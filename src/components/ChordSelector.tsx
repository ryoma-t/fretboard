'use client';

import { Button } from '@/components/ui/button';
import { TRIAD_CHORDS, SEVENTH_CHORDS, ChordDefinition } from '@/lib/music-theory';

interface ChordSelectorProps {
  selectedChord: ChordDefinition;
  onChordSelect: (chord: ChordDefinition) => void;
}

export function ChordSelector({ selectedChord, onChordSelect }: ChordSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">コードを選択（Gメジャーキー）</div>

      {/* トライアド */}
      <div className="flex flex-wrap gap-2">
        {TRIAD_CHORDS.map((chord) => (
          <Button
            key={chord.name}
            variant={selectedChord.name === chord.name ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChordSelect(chord)}
            className="min-w-[60px]"
          >
            {chord.name}
          </Button>
        ))}
      </div>

      {/* セブンス */}
      <div className="flex flex-wrap gap-2">
        {SEVENTH_CHORDS.map((chord) => (
          <Button
            key={chord.name}
            variant={selectedChord.name === chord.name ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChordSelect(chord)}
            className="min-w-[80px]"
          >
            {chord.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
