import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAudioAnalyzer } from "../hooks/useAudioAnalyzer";

const Tuner: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [debouncedFrequency, setDebouncedFrequency] = useState<number | null>(
    null
  );
  const { frequency } = useAudioAnalyzer(isListening);
  const oscillators = useRef<
    Map<string, { oscillator: OscillatorNode; audioContext: AudioContext }>
  >(new Map());

  useEffect(() => {
    if (frequency === null) {
      setDebouncedFrequency(null);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedFrequency(frequency);
    }, 100);

    return () => {
      clearTimeout(handler);
    };
  }, [frequency]);

  const toggleListening = () => {
    setIsListening((prev) => !prev);
  };

  const chromaticScale = [
    "G3",
    "G#3",
    "A3",
    "A#3",
    "B3",
    "C4",
    "C#4",
    "D4",
    "D#4",
    "E4",
    "F4",
    "F#4",
    "G4",
    "G#4",
    "A4",
    "A#4",
    "B4",
    "C5",
    "C#5",
    "D5",
    "D#5",
    "E5",
    "F5",
    "F#5",
    "G5",
    "G#5",
    "A5",
    "A#5",
    "B5",
    "C6",
    "C#6",
    "D6",
    "D#6",
    "E6",
    "F6",
    "F#6",
    "G6",
    "G#6",
    "A6",
    "A#6",
    "B6",
    "C7",
    "C#7",
    "D7",
    "D#7",
    "E7",
    "F7",
    "F#7",
    "G7",
  ];

  const findClosestNote = useCallback(
    (frequency: number) => {
      const A4 = 440;
      const SEMITONE_RATIO = Math.pow(2, 1 / 12);
      const noteIndex = Math.round(
        12 * Math.log2(frequency / A4) + chromaticScale.indexOf("A4")
      );

      if (noteIndex < 0 || noteIndex >= chromaticScale.length) {
        return null;
      }

      return chromaticScale[noteIndex];
    },
    [chromaticScale]
  );

  const closestNote = debouncedFrequency
    ? findClosestNote(debouncedFrequency)
    : null;

  const toggleTone = (frequency: number, note: string) => {
    const current = oscillators.current.get(note);
    if (current) {
      current.oscillator.stop();
      current.audioContext.close();
      oscillators.current.delete(note);
    } else {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      oscillator.start();

      oscillators.current.set(note, { oscillator, audioContext });
    }
  };

  const renderInTuneFeedback = () => {
    const calculatePitchDifference = (
      frequency: number,
      note: string | null
    ): number | null => {
      if (!note) return null;
      const noteIndex = chromaticScale.indexOf(note);
      const baseFrequency =
        440 * Math.pow(2, (noteIndex - chromaticScale.indexOf("A4")) / 12);
      return 1200 * Math.log2(frequency / baseFrequency); // Difference in cents
    };

    const pitchDifference = debouncedFrequency
      ? calculatePitchDifference(debouncedFrequency, closestNote)
      : null;
    const tolerance = 0.5; // In percentage or cents

    const isInTune = (pitchDifference: number | null) => {
      return pitchDifference !== null && Math.abs(pitchDifference) <= tolerance;
    };

    const getFeedbackColor = (pitchDifference: number | null) => {
      if (pitchDifference === null) return "grey"; // No frequency detected
      if (isInTune(pitchDifference)) return "green";
      return pitchDifference > 0 ? "red" : "blue"; // Sharp = red, Flat = blue
    };
    const pitchDiff = debouncedFrequency
      ? calculatePitchDifference(debouncedFrequency, closestNote)
      : null;
    const feedbackColor = getFeedbackColor(pitchDiff);

    return (
      <div
        className="feedback-text"
        style={{
          color: feedbackColor,
          fontWeight: isInTune(pitchDiff) ? "bold" : "normal",
          background: "linear-gradient(to bottom, #001f3f, #000000)",
        }}
      >
        {pitchDifference === null
          ? "No Frequency Detected"
          : isInTune(pitchDiff)
          ? "In Tune"
          : pitchDifference > 0
          ? `Sharp by ${pitchDifference.toFixed(2)} cents`
          : `Flat by ${Math.abs(pitchDifference).toFixed(2)} cents`}
      </div>
    );
  };

  const renderNotesSemiCircle = () => {
    const radius = 275; // Adjusted for smaller screens
    const semiCircleNotes = chromaticScale
      .slice(0, chromaticScale.indexOf("D6") + 1)
      .reverse();
    const horizontalNotes = chromaticScale.slice(
      chromaticScale.indexOf("D6") + 1
    );

    return (
      <div style={{ position: "relative", width: "100%" }}>
        <div
          style={{
            position: "relative",
            width: `${radius * 2}px`,
            height: `${radius * 1.05}px`,
            margin: "20px auto",
            borderTopLeftRadius: `${radius}px`,
            borderTopRightRadius: `${radius}px`,
            background: "linear-gradient(to bottom, #001f3f, #000000)",
            overflow: "visible",
            borderTop: "2px solid #ccc",
          }}
        >
          {semiCircleNotes.map((note, index) => {
            const angle = (index / (semiCircleNotes.length - 1)) * Math.PI;
            const x = radius + radius * 0.92 * Math.cos(angle);
            const y = radius - radius * 0.91 * Math.sin(angle);

            const isActive = closestNote === note;

            return (
              <div
                key={note}
                style={{
                  position: "absolute",
                  left: `${x}px`,
                  top: `${y}px`,
                  fontSize: isActive ? "1.4rem" : "0.9rem",
                  fontWeight: isActive ? "bold" : "normal",
                  color: isActive ? "yellow" : "darkgrey",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {note}
              </div>
            );
          })}
        </div>

        {/* Horizontal Notes */}
        <div
          style={{
            position: "relative",
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "5px",
            padding: "10px 0",
            background: "linear-gradient(to bottom, #001f3f, #000000)",
            borderRadius: "8px",
          }}
        >
          {horizontalNotes.map((note) => {
            const isActive = closestNote === note;

            return (
              <div
                key={note}
                style={{
                  fontSize: isActive ? "1.2rem" : "0.8rem",
                  fontWeight: isActive ? "bold" : "normal",
                  color: isActive ? "yellow" : "darkgrey",
                  padding: "5px",
                }}
              >
                {note}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <button onClick={toggleListening} className="start-listening">
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>

      {renderNotesSemiCircle()}
      {renderInTuneFeedback()}

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button onClick={() => toggleTone(196, "G3")}>G</button>
        <button onClick={() => toggleTone(293.66, "D4")}>D</button>
        <button onClick={() => toggleTone(440, "A4")}>A</button>
        <button onClick={() => toggleTone(659.25, "E5")}>E</button>
      </div>

      <h3 style={{ color: "darkgrey" }}>
        Detected Frequency: {debouncedFrequency?.toFixed(2) || "—"} Hz
      </h3>
    </div>
  );
};

export default Tuner;
