import React, { useState, useEffect, useRef } from "react";
import { useAudioAnalyzer } from "../hooks/useAudioAnalyzer";
import {
  chromaticScale,
  findClosestNote,
  calculatePitchDifference,
  isInTune,
} from "../utils/noteUtils";
import "../styles/Tuner.css";

const Tuner: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [debouncedFrequency, setDebouncedFrequency] = useState<number | null>(
    null
  );
  const { frequency } = useAudioAnalyzer(isListening);
  const oscillators = useRef<
    Map<string, { oscillator: OscillatorNode; audioContext: AudioContext }>
  >(new Map());
  const [currentTone, setCurrentTone] = useState<string | null>(null);

  const calculateRadius = (width: number) => {
    return width / 2.8;
  };

  const [radius, setRadius] = useState(() =>
    calculateRadius(window.innerWidth)
  );

  useEffect(() => {
    const handleResize = () => {
      const newRadius = calculateRadius(window.innerWidth);
      setRadius(newRadius);
      document.documentElement.style.setProperty(
        "--semi-circle-radius",
        `${newRadius}px`
      );
    };

    document.documentElement.style.setProperty(
      "--semi-circle-radius",
      `${radius}px`
    );

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [radius]);

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

  useEffect(() => {
    if (debouncedFrequency) {
      const note = findClosestNote(debouncedFrequency);
      setCurrentTone(note);
    } else {
      setCurrentTone(null);
    }
  }, [debouncedFrequency]);

  const toggleListening = () => {
    setIsListening((prev) => !prev);
  };

  const closestNote = debouncedFrequency
    ? findClosestNote(debouncedFrequency)
    : null;

  const toggleTone = (frequency: number, note: string) => {
    const current = oscillators.current.get(note);
    if (current) {
      current.oscillator.stop();
      current.audioContext.close();
      oscillators.current.delete(note);
      setCurrentTone(null);
    } else {
      const audioContext = new window.AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      oscillator.start();

      oscillators.current.set(note, { oscillator, audioContext });
      setCurrentTone(note);
    }
  };

  const getFeedbackColor = (pitchDifference: number | null) => {
    if (pitchDifference === null) return "#BDBDBD";
    if (isInTune(pitchDifference)) return "#4CAF50";
    return pitchDifference > 0 ? "#F44336" : "#2196F3";
  };

  const renderInTuneFeedback = () => {
    const pitchDifference = debouncedFrequency
      ? calculatePitchDifference(debouncedFrequency, closestNote)
      : null;

    const feedbackColor = getFeedbackColor(pitchDifference);

    return (
      <div className="feedback-text" style={{ color: feedbackColor }}>
        {pitchDifference === null
          ? "No Frequency Detected"
          : isInTune(pitchDifference)
          ? "In Tune"
          : pitchDifference > 0
          ? `Sharp by ${pitchDifference.toFixed(2)} cents`
          : `Flat by ${Math.abs(pitchDifference).toFixed(2)} cents`}
      </div>
    );
  };

  const isActiveNote = (note: string) => {
    return debouncedFrequency
      ? chromaticScale.indexOf(note) ===
          Math.round(12 * Math.log2(debouncedFrequency / 440)) +
            chromaticScale.indexOf("A4")
      : false;
  };

  const renderSemiCircle = (semiCircleNotes: string[]) => {
    return semiCircleNotes.map((note: string, index: number) => {
      const angle = (index / (semiCircleNotes.length - 1)) * Math.PI;
      const x = radius + radius * 0.92 * Math.cos(angle);
      const y = radius - radius * 0.91 * Math.sin(angle);

      return (
        <div
          key={note}
          className={`semi-circle-note ${isActiveNote(note) ? "active" : ""}`}
          style={{
            left: `${x}px`,
            top: `${y}px`,
          }}
        >
          {note}
        </div>
      );
    });
  };

  const renderNotesSemiCircle = () => {
    const semiCircleNotes = chromaticScale
      .slice(0, chromaticScale.indexOf("D6") + 1)
      .reverse();
    const horizontalNotes = chromaticScale.slice(
      chromaticScale.indexOf("D6") + 1
    );

    return (
      <div style={{ position: "relative", width: "100%" }}>
        <div className="semi-circle-container">
          <div className="center-tone">{currentTone || "—"}</div>
          {renderSemiCircle(semiCircleNotes)}
        </div>

        {/* Horizontal Notes */}
        <div className="horizontal-notes">
          {horizontalNotes.map((note) => {
            const isActive = closestNote === note;

            return (
              <div
                key={note}
                className={`horizontal-note ${isActive ? "active" : ""}`}
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
    <div className="tuner-wrapper">
      <div className="tuner-container">
        <button onClick={toggleListening} className="start-listening">
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>

        {renderNotesSemiCircle()}
        {renderInTuneFeedback()}

        <div className="open-notes-buttons">
          <button onClick={() => toggleTone(196, "G3")}>G</button>
          <button onClick={() => toggleTone(293.66, "D4")}>D</button>
          <button onClick={() => toggleTone(440, "A4")}>A</button>
          <button onClick={() => toggleTone(659.25, "E5")}>E</button>
        </div>

        <h3 className="detected-frequency">
          Detected Frequency: {debouncedFrequency?.toFixed(2) || "—"} Hz
        </h3>
      </div>
    </div>
  );
};

export default Tuner;
