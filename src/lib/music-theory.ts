// 音名定義
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export type Note = typeof NOTES[number];

// フラット表記のマッピング
export const FLAT_NOTES: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
};

// 標準チューニング（6弦から1弦）
export const STANDARD_TUNING: Note[] = ['E', 'A', 'D', 'G', 'B', 'E'];

// Gメジャースケール
export const G_MAJOR_SCALE: Note[] = ['G', 'A', 'B', 'C', 'D', 'E', 'F#'];

// ブルーノート（Gメジャー基準）
export const BLUE_NOTES: Note[] = ['A#', 'C#', 'F']; // ♭3=Bb, ♭5=Db, ♭7=F

// Gメジャースケール基準の度数表記
export const G_MAJOR_DEGREES: Record<Note, string> = {
  'C': '4',
  'C#': '♭5',
  'D': '5',
  'D#': '♭6',
  'E': '6',
  'F': '♭7',
  'F#': '7',
  'G': 'R',
  'G#': '♭2',
  'A': '2',
  'A#': '♭3',
  'B': '3',
};

// コードタイプ
export type ChordType = 'major' | 'minor' | 'dim' | 'maj7' | 'min7' | '7' | 'min7b5';

// コード定義
export interface ChordDefinition {
  name: string;
  root: Note;
  type: ChordType;
  notes: Note[];
  degrees: string[]; // コードルートからの度数
  role: string; // ダイアトニック機能（Ⅰ, Ⅱm, etc.）
}

// コード構成音を計算
function getChordNotes(root: Note, type: ChordType): { notes: Note[]; degrees: string[] } {
  const rootIndex = NOTES.indexOf(root);

  const intervals: Record<ChordType, number[]> = {
    'major': [0, 4, 7],         // R, 3, 5
    'minor': [0, 3, 7],         // R, ♭3, 5
    'dim': [0, 3, 6],           // R, ♭3, ♭5
    'maj7': [0, 4, 7, 11],      // R, 3, 5, 7
    'min7': [0, 3, 7, 10],      // R, ♭3, 5, ♭7
    '7': [0, 4, 7, 10],         // R, 3, 5, ♭7
    'min7b5': [0, 3, 6, 10],    // R, ♭3, ♭5, ♭7
  };

  const degreeLabels: Record<ChordType, string[]> = {
    'major': ['R', '3', '5'],
    'minor': ['R', '♭3', '5'],
    'dim': ['R', '♭3', '♭5'],
    'maj7': ['R', '3', '5', '7'],
    'min7': ['R', '♭3', '5', '♭7'],
    '7': ['R', '3', '5', '♭7'],
    'min7b5': ['R', '♭3', '♭5', '♭7'],
  };

  const chordIntervals = intervals[type];
  const notes = chordIntervals.map(interval => NOTES[(rootIndex + interval) % 12]);
  const degrees = degreeLabels[type];

  return { notes, degrees };
}

// Gメジャーダイアトニックコード定義
export const CHORDS: ChordDefinition[] = [
  // トライアド
  { name: 'G', root: 'G', type: 'major', role: 'Ⅰ', ...getChordNotes('G', 'major') },
  { name: 'Am', root: 'A', type: 'minor', role: 'Ⅱm', ...getChordNotes('A', 'minor') },
  { name: 'Bm', root: 'B', type: 'minor', role: 'Ⅲm', ...getChordNotes('B', 'minor') },
  { name: 'C', root: 'C', type: 'major', role: 'Ⅳ', ...getChordNotes('C', 'major') },
  { name: 'D', root: 'D', type: 'major', role: 'Ⅴ', ...getChordNotes('D', 'major') },
  { name: 'Em', root: 'E', type: 'minor', role: 'Ⅵm', ...getChordNotes('E', 'minor') },
  { name: 'F#m♭5', root: 'F#', type: 'dim', role: 'Ⅶm♭5', ...getChordNotes('F#', 'dim') },
  // セブンス
  { name: 'Gmaj7', root: 'G', type: 'maj7', role: 'Ⅰmaj7', ...getChordNotes('G', 'maj7') },
  { name: 'Am7', root: 'A', type: 'min7', role: 'Ⅱm7', ...getChordNotes('A', 'min7') },
  { name: 'Bm7', root: 'B', type: 'min7', role: 'Ⅲm7', ...getChordNotes('B', 'min7') },
  { name: 'Cmaj7', root: 'C', type: 'maj7', role: 'Ⅳmaj7', ...getChordNotes('C', 'maj7') },
  { name: 'D7', root: 'D', type: '7', role: 'Ⅴ7', ...getChordNotes('D', '7') },
  { name: 'Em7', root: 'E', type: 'min7', role: 'Ⅵm7', ...getChordNotes('E', 'min7') },
  { name: 'F#m7♭5', root: 'F#', type: 'min7b5', role: 'Ⅶm7♭5', ...getChordNotes('F#', 'min7b5') },
];

// トライアドとセブンスを分離
export const TRIAD_CHORDS = CHORDS.slice(0, 7);
export const SEVENTH_CHORDS = CHORDS.slice(7);

// フレット上の音を取得
export function getNoteAtFret(stringNote: Note, fret: number): Note {
  const noteIndex = NOTES.indexOf(stringNote);
  return NOTES[(noteIndex + fret) % 12];
}

// 音がスケールに含まれているか
export function isInScale(note: Note): boolean {
  return G_MAJOR_SCALE.includes(note);
}

// 音がブルーノートか
export function isBlueNote(note: Note): boolean {
  return BLUE_NOTES.includes(note);
}

// 音がコードトーンか
export function isChordTone(note: Note, chord: ChordDefinition): boolean {
  return chord.notes.includes(note);
}

// コードトーンの度数を取得（コードルートからの度数）
export function getChordDegree(note: Note, chord: ChordDefinition): string | null {
  const index = chord.notes.indexOf(note);
  if (index === -1) return null;
  return chord.degrees[index];
}

// 構成音を表示用文字列に変換
export function formatNotes(notes: Note[]): string {
  return notes.map(note => {
    // F#はそのまま、その他のシャープはフラット表記に
    if (note === 'F#') return 'F#';
    return FLAT_NOTES[note] || note;
  }).join('-');
}

// Gメジャースケールの構成音文字列
export const G_MAJOR_SCALE_TEXT = 'G-A-B-C-D-E-F#';

// ブルーノートを含むスケールの構成音文字列
export const G_MAJOR_WITH_BLUE_TEXT = 'G-A-B♭-B-C-D♭-D-E-F-F#';
