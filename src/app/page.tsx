'use client';

import { useState } from 'react';
import { Fretboard } from '@/components/Fretboard';
import { ChordSelector } from '@/components/ChordSelector';
import {
  TRIAD_CHORDS,
  ChordDefinition,
  G_MAJOR_WITH_BLUE_TEXT,
  formatNotes,
} from '@/lib/music-theory';

export default function Home() {
  const [selectedChord, setSelectedChord] = useState<ChordDefinition>(TRIAD_CHORDS[0]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ヘッダー */}
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Guitar Fretboard Visualizer
          </h1>
          <p className="mt-2 text-gray-600">Gメジャーキー - スケール & コードトーン</p>
        </header>

        {/* コード選択 */}
        <div className="bg-white rounded-lg shadow p-4">
          <ChordSelector
            selectedChord={selectedChord}
            onChordSelect={setSelectedChord}
          />
        </div>

        {/* 凡例 */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-700 mb-2">凡例</div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500" />
              <span>スケールトーン</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-500" />
              <span>ブルーノート (♭3, ♭5, ♭7)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500" />
              <span>コードトーン</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-400 opacity-40" />
              <span>スケールトーン（薄）</span>
            </div>
          </div>
        </div>

        {/* 上段: Gメジャースケール指板 */}
        <div className="bg-white rounded-lg shadow p-4">
          <Fretboard
            title="Gメジャースケール + ブルーノート"
            subtitle={`構成音: ${G_MAJOR_WITH_BLUE_TEXT}`}
            mode="scale"
          />
        </div>

        {/* 下段: 選択コードの指板 */}
        <div className="bg-white rounded-lg shadow p-4">
          <Fretboard
            title={`${selectedChord.name} コードトーン`}
            subtitle={`構成音: ${formatNotes(selectedChord.notes)}`}
            mode="chord"
            chord={selectedChord}
          />
        </div>
      </div>
    </div>
  );
}
