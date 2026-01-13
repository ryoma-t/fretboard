// Note definitions
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export type Note = typeof NOTES[number];

// All keys (for selection)
export const ALL_KEYS: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Display names for keys (with enharmonic alternatives)
export const KEY_DISPLAY_NAMES: Record<Note, string> = {
  'C': 'C',
  'C#': 'C# / Db',
  'D': 'D',
  'D#': 'D# / Eb',
  'E': 'E',
  'F': 'F',
  'F#': 'F# / Gb',
  'G': 'G',
  'G#': 'G# / Ab',
  'A': 'A',
  'A#': 'A# / Bb',
  'B': 'B',
};

// Flat notation mapping
export const FLAT_NOTES: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
};

// Standard tuning (6th string to 1st string)
export const STANDARD_TUNING: Note[] = ['E', 'A', 'D', 'G', 'B', 'E'];

// Major scale intervals (semitones from root)
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

// Blue note intervals (semitones from root): b3, b5, b7
const BLUE_NOTE_INTERVALS = [3, 6, 10];

// Get major scale for a given key
export function getMajorScale(key: Note): Note[] {
  const keyIndex = NOTES.indexOf(key);
  return MAJOR_SCALE_INTERVALS.map(interval => NOTES[(keyIndex + interval) % 12]);
}

// Get blue notes for a given key
export function getBlueNotes(key: Note): Note[] {
  const keyIndex = NOTES.indexOf(key);
  return BLUE_NOTE_INTERVALS.map(interval => NOTES[(keyIndex + interval) % 12]);
}

// Get degree label for a note relative to a key
export function getDegreeLabel(note: Note, key: Note): string {
  const keyIndex = NOTES.indexOf(key);
  const noteIndex = NOTES.indexOf(note);
  const interval = (noteIndex - keyIndex + 12) % 12;

  const degreeMap: Record<number, string> = {
    0: 'R',
    1: '♭2',
    2: '2',
    3: '♭3',
    4: '3',
    5: '4',
    6: '♭5',
    7: '5',
    8: '♭6',
    9: '6',
    10: '♭7',
    11: '7',
  };

  return degreeMap[interval];
}

// Chord type
export type ChordType = 'major' | 'minor' | 'dim' | 'maj7' | 'min7' | '7' | 'min7b5';

// Chord definition
export interface ChordDefinition {
  name: string;
  root: Note;
  type: ChordType;
  notes: Note[];
  degrees: string[]; // Degrees from chord root
  role: string; // Diatonic function
}

// Chord intervals and degree labels
const CHORD_INTERVALS: Record<ChordType, number[]> = {
  'major': [0, 4, 7],
  'minor': [0, 3, 7],
  'dim': [0, 3, 6],
  'maj7': [0, 4, 7, 11],
  'min7': [0, 3, 7, 10],
  '7': [0, 4, 7, 10],
  'min7b5': [0, 3, 6, 10],
};

const CHORD_DEGREE_LABELS: Record<ChordType, string[]> = {
  'major': ['R', '3', '5'],
  'minor': ['R', '♭3', '5'],
  'dim': ['R', '♭3', '♭5'],
  'maj7': ['R', '3', '5', '7'],
  'min7': ['R', '♭3', '5', '♭7'],
  '7': ['R', '3', '5', '♭7'],
  'min7b5': ['R', '♭3', '♭5', '♭7'],
};

// Diatonic chord types for major scale
const DIATONIC_TRIAD_TYPES: ChordType[] = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'dim'];
const DIATONIC_SEVENTH_TYPES: ChordType[] = ['maj7', 'min7', 'min7', 'maj7', '7', 'min7', 'min7b5'];
const DIATONIC_ROLES = ['Ⅰ', 'Ⅱm', 'Ⅲm', 'Ⅳ', 'Ⅴ', 'Ⅵm', 'Ⅶm♭5'];
const DIATONIC_SEVENTH_ROLES = ['Ⅰmaj7', 'Ⅱm7', 'Ⅲm7', 'Ⅳmaj7', 'Ⅴ7', 'Ⅵm7', 'Ⅶm7♭5'];

// Get chord notes
function getChordNotes(root: Note, type: ChordType): { notes: Note[]; degrees: string[] } {
  const rootIndex = NOTES.indexOf(root);
  const intervals = CHORD_INTERVALS[type];
  const notes = intervals.map(interval => NOTES[(rootIndex + interval) % 12]);
  const degrees = CHORD_DEGREE_LABELS[type];
  return { notes, degrees };
}

// Generate chord name
function getChordName(root: Note, type: ChordType): string {
  const rootName = root;
  const suffixes: Record<ChordType, string> = {
    'major': '',
    'minor': 'm',
    'dim': 'm♭5',
    'maj7': 'maj7',
    'min7': 'm7',
    '7': '7',
    'min7b5': 'm7♭5',
  };
  return rootName + suffixes[type];
}

// Get diatonic chords for a given key
export function getDiatonicChords(key: Note): { triads: ChordDefinition[]; sevenths: ChordDefinition[] } {
  const scale = getMajorScale(key);

  const triads: ChordDefinition[] = scale.map((root, i) => ({
    name: getChordName(root, DIATONIC_TRIAD_TYPES[i]),
    root,
    type: DIATONIC_TRIAD_TYPES[i],
    role: DIATONIC_ROLES[i],
    ...getChordNotes(root, DIATONIC_TRIAD_TYPES[i]),
  }));

  const sevenths: ChordDefinition[] = scale.map((root, i) => ({
    name: getChordName(root, DIATONIC_SEVENTH_TYPES[i]),
    root,
    type: DIATONIC_SEVENTH_TYPES[i],
    role: DIATONIC_SEVENTH_ROLES[i],
    ...getChordNotes(root, DIATONIC_SEVENTH_TYPES[i]),
  }));

  return { triads, sevenths };
}

// Get note at fret
export function getNoteAtFret(stringNote: Note, fret: number): Note {
  const noteIndex = NOTES.indexOf(stringNote);
  return NOTES[(noteIndex + fret) % 12];
}

// Check if note is in scale
export function isInScale(note: Note, key: Note): boolean {
  const scale = getMajorScale(key);
  return scale.includes(note);
}

// Check if note is a blue note
export function isBlueNote(note: Note, key: Note): boolean {
  const blueNotes = getBlueNotes(key);
  return blueNotes.includes(note);
}

// Check if note is a chord tone
export function isChordTone(note: Note, chord: ChordDefinition): boolean {
  return chord.notes.includes(note);
}

// Get chord degree for a note
export function getChordDegree(note: Note, chord: ChordDefinition): string | null {
  const index = chord.notes.indexOf(note);
  if (index === -1) return null;
  return chord.degrees[index];
}

// Format notes for display
export function formatNotes(notes: Note[]): string {
  return notes.map(note => {
    if (note === 'F#') return 'F#';
    return FLAT_NOTES[note] || note;
  }).join('-');
}

// Get scale text for display
export function getScaleText(key: Note): string {
  const scale = getMajorScale(key);
  return formatNotes(scale);
}
