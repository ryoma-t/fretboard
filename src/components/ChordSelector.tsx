'use client';

import { Button } from '@/components/ui/button';
import { ChordDefinition } from '@/lib/music-theory';

interface ChordSelectorProps {
  triads: ChordDefinition[];
  sevenths: ChordDefinition[];
  selectedChord: ChordDefinition;
  onChordSelect: (chord: ChordDefinition) => void;
}

const DEGREE_LABELS = ['Ⅰ', 'Ⅱm', 'Ⅲm', 'Ⅳ', 'Ⅴ', 'Ⅵm', 'Ⅶm♭5'];

// Chord function: T=Tonic, SD=Subdominant, D=Dominant
type ChordFunction = 'T' | 'SD' | 'D';
const CHORD_FUNCTIONS: ChordFunction[] = ['T', 'SD', 'T', 'SD', 'D', 'T', 'D'];

const FUNCTION_COLORS: Record<ChordFunction, string> = {
  'T': 'bg-stone-100 hover:bg-stone-200',
  'SD': 'bg-stone-200 hover:bg-stone-300',
  'D': 'bg-stone-300 hover:bg-stone-400',
};

export function ChordSelector({ triads, sevenths, selectedChord, onChordSelect }: ChordSelectorProps) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center justify-end gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded bg-muted" />T
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded bg-muted-foreground/30" />SD
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded bg-muted-foreground/50" />D
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1 sm:gap-1.5 md:gap-2 min-w-[360px] sm:min-w-[480px]">
          {/* Header row: degrees */}
          <div /> {/* empty cell */}
          {DEGREE_LABELS.map((label) => (
            <div key={label} className="text-center text-[10px] sm:text-xs font-medium text-muted-foreground pb-0.5 sm:pb-1">
              {label}
            </div>
          ))}

          {/* Triad row */}
          <div className="text-[10px] sm:text-xs font-medium text-muted-foreground flex items-center pr-1">Triad</div>
          {triads.map((chord, i) => (
            <Button
              key={chord.name}
              variant={selectedChord.name === chord.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChordSelect(chord)}
              className={`w-full h-7 sm:h-8 text-[10px] sm:text-xs px-1 sm:px-2 ${selectedChord.name !== chord.name ? FUNCTION_COLORS[CHORD_FUNCTIONS[i]] : ''}`}
            >
              {chord.name}
            </Button>
          ))}

          {/* 7th row */}
          <div className="text-[10px] sm:text-xs font-medium text-muted-foreground flex items-center pr-1">7th</div>
          {sevenths.map((chord, i) => (
            <Button
              key={chord.name}
              variant={selectedChord.name === chord.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChordSelect(chord)}
              className={`w-full h-7 sm:h-8 text-[10px] sm:text-xs px-1 sm:px-2 ${selectedChord.name !== chord.name ? FUNCTION_COLORS[CHORD_FUNCTIONS[i]] : ''}`}
            >
              {chord.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
