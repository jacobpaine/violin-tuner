const notes = [
  { note: "C", freq: 16.35 },
  { note: "C#", freq: 17.32 },
  { note: "D", freq: 18.35 },
  { note: "D#", freq: 19.45 },
  { note: "E", freq: 20.60 },
  { note: "F", freq: 21.83 },
  { note: "F#", freq: 23.12 },
  { note: "G", freq: 24.50 },
  { note: "G#", freq: 25.96 },
  { note: "A", freq: 27.50 },
  { note: "A#", freq: 29.14 },
  { note: "B", freq: 30.87 },
];

export const getNote = (frequency: number): string | null => {
  const A4 = 440; // Reference pitch
  const semitoneRatio = Math.pow(2, 1 / 12);

  if (!frequency) return null;

  let noteIndex = Math.round(12 * Math.log2(frequency / A4)) + 69;
  if (noteIndex < 0 || noteIndex >= 128) return null;

  const octave = Math.floor(noteIndex / 12) - 1;
  const noteName = notes[noteIndex % 12].note;
  return `${noteName}${octave}`;
};
