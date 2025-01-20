export const chromaticScale = [
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

/**
 * Finds the closest note for a given frequency.
 */
export const findClosestNote = (frequency: number): string | null => {
  const A4 = 440;
  const noteIndex = Math.round(
    12 * Math.log2(frequency / A4) + chromaticScale.indexOf("A4")
  );

  if (noteIndex < 0 || noteIndex >= chromaticScale.length) {
    return null;
  }

  return chromaticScale[noteIndex];
};

/**
 * Calculates pitch difference in cents between the detected frequency and the target note.
 */
export const calculatePitchDifference = (
  frequency: number,
  note: string | null
): number | null => {
  if (!note) return null;
  const noteIndex = chromaticScale.indexOf(note);
  const baseFrequency =
    440 * Math.pow(2, (noteIndex - chromaticScale.indexOf("A4")) / 12);
  return 1200 * Math.log2(frequency / baseFrequency); // Difference in cents
};

/**
 * Determines if the detected frequency is in tune.
 */
export const isInTune = (
  pitchDifference: number | null,
  tolerance: number = 0.5
): boolean => {
  return pitchDifference !== null && Math.abs(pitchDifference) <= tolerance;
};
