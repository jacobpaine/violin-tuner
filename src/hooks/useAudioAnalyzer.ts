import { useEffect, useRef, useState } from "react";

type FrequencyHistory = {
  values: number[];
  outlierCount: number;
};

export const useAudioAnalyzer = (
  isStarted: boolean,
  debug: boolean = false
) => {
  const [frequency, setFrequency] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const frequencyHistoryRef = useRef<FrequencyHistory>({ values: [], outlierCount: 0 });

  useEffect(() => {
    if (!isStarted) return;

    const startAudio = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContextRef.current.createMediaStreamSource(stream);

        const filteredSource = applyBandpassFilter(audioContextRef.current, source, debug);

        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 8192; // Increased FFT size for better resolution
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

        filteredSource.connect(analyserRef.current);

        const detectPitch = () => {
          if (!analyserRef.current || !dataArrayRef.current) return;

          analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

          const signalLevel = calculateRMS(dataArrayRef.current);
          if (signalLevel < 0.01) {
            if (frequency !== null) {
              setFrequency(null);
              if (debug) console.log("Silence detected.");
            }
            requestAnimationFrame(detectPitch);
            return;
          }

          const detectedFrequency = detectFrequency(
            dataArrayRef.current,
            audioContextRef.current!.sampleRate,
            debug
          );

          if (detectedFrequency !== null) {
            const smoothedFrequency = smoothFrequency(
              detectedFrequency,
              frequencyHistoryRef.current,
              debug
            );
            setFrequency(smoothedFrequency);
            if (debug) console.log("Detected Frequency:", smoothedFrequency);
          }

          requestAnimationFrame(detectPitch);
        };

        detectPitch();
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    startAudio();

    return () => {
      audioContextRef.current?.close();
    };
  }, [isStarted, debug]);

  return { frequency };
};

const detectFrequency = (
  dataArray: Uint8Array,
  sampleRate: number,
  debug: boolean = false
): number | null => {
  const size = dataArray.length;
  const normalizedArray = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    normalizedArray[i] = (dataArray[i] - 128) / 128;
  }

  const MIN_LAG = 10;
  const MAX_LAG = size / 2;
  let maxCorrelation = 0;
  let bestLag = -1;
  const correlations = new Float32Array(size);

  for (let lag = MIN_LAG; lag < MAX_LAG; lag++) {
    let correlation = 0;

    for (let i = 0; i < size - lag; i++) {
      correlation += normalizedArray[i] * normalizedArray[i + lag];
    }

    correlations[lag] = correlation;

    if (correlation > maxCorrelation) {
      maxCorrelation = correlation;
      bestLag = lag;
    }
  }

  if (bestLag === -1 || maxCorrelation < 0.25) {
    if (debug) console.log("No valid lag found or max correlation too low.");
    return null;
  }

  const d = correlations[bestLag - 1] - correlations[bestLag + 1];
  const shift = d / (2 * (2 * correlations[bestLag] - correlations[bestLag - 1] - correlations[bestLag + 1]));
  const refinedLag = bestLag + shift;

  const frequency = sampleRate / refinedLag;

  if (frequency >= 180 && frequency <= 3520) { // Extended range for violin notes
    if (debug) console.log("Valid Frequency Detected:", frequency);
    return frequency;
  } else {
    if (debug) console.log("Frequency out of range:", frequency);
    return null;
  }
};


const smoothFrequency = (
  newFrequency: number,
  history: FrequencyHistory,
  debug: boolean = false
): number => {
  const baseDeviation = newFrequency < 300 ? 30 : 50; // Smaller deviation for lower notes
  const deviationPercentage = newFrequency < 300 ? 150 : 250;

  if (history.values.length === 0) {
    history.values.push(newFrequency);
    return newFrequency;
  }

  const average = history.values.reduce((sum, value) => sum + value, 0) / history.values.length;

  // Dynamic deviation scaling based on average frequency
  const maxDeviation = Math.max((average * deviationPercentage) / 100, baseDeviation);

  if (Math.abs(newFrequency - average) > maxDeviation) {
    history.outlierCount++;
    if (debug) console.log("Large jump detected, ignoring frequency:", newFrequency);
    return average;
  }

  history.outlierCount = 0;
  history.values.push(newFrequency);

  if (history.values.length > 7) {
    history.values.shift();
  }

  return history.values.reduce((sum, value) => sum + value, 0) / history.values.length;
};

const calculateRMS = (dataArray: Uint8Array): number => {
  const size = dataArray.length;
  let sum = 0;

  for (let i = 0; i < size; i++) {
    const normalizedValue = (dataArray[i] - 128) / 128;
    sum += normalizedValue * normalizedValue;
  }

  return Math.sqrt(sum / size);
};

const applyBandpassFilter = (
  audioContext: AudioContext,
  source: MediaStreamAudioSourceNode,
  debug: boolean
) => {
  const biquadFilter = audioContext.createBiquadFilter();

  biquadFilter.type = "bandpass";
  biquadFilter.frequency.value = 300; // Center around G3 and below
  biquadFilter.Q.value = 1.2; // Broader bandwidth for low notes

  if (debug) {
    console.log("Bandpass Filter Config:", {
      frequency: biquadFilter.frequency.value,
      Q: biquadFilter.Q,
    });
  }

  source.connect(biquadFilter);
  return biquadFilter;
};


