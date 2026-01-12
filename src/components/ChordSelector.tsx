'use client';

import { Button } from '@/components/ui/button';
import { TRIAD_CHORDS, SEVENTH_CHORDS, ChordDefinition } from '@/lib/music-theory';

interface ChordSelectorProps {
  selectedChord: ChordDefinition;
  onChordSelect: (chord: ChordDefinition) => void;
}

const DEGREE_LABELS = ['Ⅰ', 'Ⅱm', 'Ⅲm', 'Ⅳ', 'Ⅴ', 'Ⅵm', 'Ⅶm♭5'];

// コード機能: T=Tonic, SD=Subdominant, D=Dominant
type ChordFunction = 'T' | 'SD' | 'D';
const CHORD_FUNCTIONS: ChordFunction[] = ['T', 'SD', 'T', 'SD', 'D', 'T', 'D'];

const FUNCTION_COLORS: Record<ChordFunction, string> = {
  'T': 'bg-stone-100 hover:bg-stone-200',      // Tonic: 薄い（安定）
  'SD': 'bg-stone-200 hover:bg-stone-300',     // Subdominant: 中間
  'D': 'bg-stone-300 hover:bg-stone-400',      // Dominant: 濃い（緊張）
};

const FUNCTION_LABELS: Record<ChordFunction, string> = {
  'T': 'T',
  'SD': 'SD',
  'D': 'D',
};

export function ChordSelector({ selectedChord, onChordSelect }: ChordSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-muted" />T
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-muted-foreground/30" />SD
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-muted-foreground/50" />D
        </span>
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1.5 sm:gap-2 min-w-[480px]">
          {/* Header row: degrees */}
          <div /> {/* empty cell */}
          {DEGREE_LABELS.map((label) => (
            <div key={label} className="text-center text-xs font-medium text-muted-foreground pb-1">
              {label}
            </div>
          ))}

          {/* Triad row */}
          <div className="text-xs font-medium text-muted-foreground flex items-center">Triad</div>
          {TRIAD_CHORDS.map((chord, i) => (
            <Button
              key={chord.name}
              variant={selectedChord.name === chord.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChordSelect(chord)}
              className={`w-full ${selectedChord.name !== chord.name ? FUNCTION_COLORS[CHORD_FUNCTIONS[i]] : ''}`}
            >
              {chord.name}
            </Button>
          ))}

          {/* 7th row */}
          <div className="text-xs font-medium text-muted-foreground flex items-center">7th</div>
          {SEVENTH_CHORDS.map((chord, i) => (
            <Button
              key={chord.name}
              variant={selectedChord.name === chord.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChordSelect(chord)}
              className={`w-full ${selectedChord.name !== chord.name ? FUNCTION_COLORS[CHORD_FUNCTIONS[i]] : ''}`}
            >
              {chord.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
