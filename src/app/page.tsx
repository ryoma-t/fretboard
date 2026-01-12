'use client';

import { useState } from 'react';
import { Fretboard } from '@/components/Fretboard';
import { ChordSelector } from '@/components/ChordSelector';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  TRIAD_CHORDS,
  ChordDefinition,
  G_MAJOR_SCALE_TEXT,
  formatNotes,
} from '@/lib/music-theory';

export default function Home() {
  const [selectedChord, setSelectedChord] = useState<ChordDefinition>(TRIAD_CHORDS[0]);
  const [showBlueNotes, setShowBlueNotes] = useState(true);

  return (
    <div className="min-h-screen bg-muted/40 p-4 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight">
            Guitar Fretboard Visualizer
          </h1>
          <p className="text-sm text-muted-foreground">
            G Major Key - Scale & Chord Tone Visualization
          </p>
        </div>

        {/* Controls Row */}
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          {/* Chord Selector */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select Chord</CardTitle>
              <CardDescription>G Major Diatonic Chords</CardDescription>
            </CardHeader>
            <CardContent>
              <ChordSelector
                selectedChord={selectedChord}
                onChordSelect={setSelectedChord}
              />
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="lg:w-56">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Legend</CardTitle>
                <div className="flex items-center gap-2">
                  <Switch
                    id="blue-notes"
                    checked={showBlueNotes}
                    onCheckedChange={setShowBlueNotes}
                  />
                  <label htmlFor="blue-notes" className="text-xs text-muted-foreground cursor-pointer">
                    Blue Notes
                  </label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-indigo-500" />
                  <div className="w-4 h-4 rounded-full bg-indigo-400/40" />
                  <span className="text-muted-foreground">Scale Tone</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">Chord Tone</span>
                </div>
                {showBlueNotes && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-600/80" />
                    <span className="text-muted-foreground">Blue Notes</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fretboards */}
        <div className="grid gap-4">
          {/* G Major Scale */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>G Major Scale</CardTitle>
              <CardDescription>Notes: {G_MAJOR_SCALE_TEXT}</CardDescription>
            </CardHeader>
            <CardContent>
              <Fretboard
                mode="scale"
                showBlueNotes={showBlueNotes}
              />
            </CardContent>
          </Card>

          {/* Chord Tones */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{selectedChord.name} Chord Tones</CardTitle>
              <CardDescription>Notes: {formatNotes(selectedChord.notes)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Fretboard
                mode="chord"
                chord={selectedChord}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
