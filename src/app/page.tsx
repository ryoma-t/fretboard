"use client";

import { ChordSelector } from "@/components/ChordSelector";
import { CircleOfFifths } from "@/components/CircleOfFifths";
import { Fretboard } from "@/components/Fretboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  ChordDefinition,
  Note,
  formatNotes,
  getDiatonicChords,
  getScaleText,
} from "@/lib/music-theory";
import { useMemo, useState } from "react";

export default function Home() {
  const [selectedKey, setSelectedKey] = useState<Note>("G");
  const [showBlueNotes, setShowBlueNotes] = useState(true);
  const [selectedChordIndex, setSelectedChordIndex] = useState<{
    type: "triad" | "seventh";
    index: number;
  }>({ type: "triad", index: 0 });

  // Memoize diatonic chords to prevent recalculation on every render
  const { triads, sevenths } = useMemo(
    () => getDiatonicChords(selectedKey),
    [selectedKey]
  );

  // Get selected chord from memoized arrays
  const selectedChord =
    selectedChordIndex.type === "triad"
      ? triads[selectedChordIndex.index]
      : sevenths[selectedChordIndex.index];

  // Handler for chord selection
  const handleChordSelect = (chord: ChordDefinition) => {
    const triadIndex = triads.findIndex((c) => c.name === chord.name);
    if (triadIndex !== -1) {
      setSelectedChordIndex({ type: "triad", index: triadIndex });
    } else {
      const seventhIndex = sevenths.findIndex((c) => c.name === chord.name);
      setSelectedChordIndex({ type: "seventh", index: seventhIndex });
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 p-3 sm:p-4 lg:p-8 overflow-x-hidden">
      <div className="mx-auto max-w-6xl space-y-3 sm:space-y-4 lg:space-y-6 w-full">
        {/* Header */}
        <h1 className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight">
          Fretboard Visualizer
        </h1>

        {/* Controls Row */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto]">
          {/* Legend */}
          <Card className="sm:col-span-2 lg:col-span-1 lg:w-48 py-0 gap-0">
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base">Legend</CardTitle>
                <div className="flex items-center gap-2">
                  <Switch
                    id="blue-notes"
                    checked={showBlueNotes}
                    onCheckedChange={setShowBlueNotes}
                  />
                  <label
                    htmlFor="blue-notes"
                    className="text-[10px] sm:text-xs text-muted-foreground cursor-pointer"
                  >
                    Blue Notes
                  </label>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 lg:flex-col lg:space-y-2 lg:gap-0 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-indigo-500" />
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-indigo-400/40" />
                  <span className="text-muted-foreground">Scale Tone</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">Chord Tone</span>
                </div>
                {showBlueNotes && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-amber-600/80" />
                    <span className="text-muted-foreground">Blue Notes</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Key Selector */}
          <Card className="py-0 gap-0">
            <CardHeader className="p-3 sm:p-6 pb-0 sm:pb-0">
              <CardTitle className="text-sm sm:text-base">Key</CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 flex items-center justify-center">
              <CircleOfFifths
                selectedKey={selectedKey}
                onKeySelect={setSelectedKey}
              />
            </CardContent>
          </Card>

          {/* Chord Selector */}
          <Card className="overflow-hidden py-0 gap-0">
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base">Chord</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {selectedKey} Major Diatonic Chords
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 overflow-x-auto">
              <ChordSelector
                triads={triads}
                sevenths={sevenths}
                selectedChord={selectedChord}
                onChordSelect={handleChordSelect}
              />
            </CardContent>
          </Card>
        </div>

        {/* Fretboards */}
        <div className="grid gap-3 sm:gap-4">
          {/* Major Scale */}
          <Card className="overflow-hidden py-0 gap-0">
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base">
                {selectedKey} Major Scale
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Notes: {getScaleText(selectedKey)}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 overflow-x-auto">
              <Fretboard
                mode="scale"
                musicalKey={selectedKey}
                showBlueNotes={showBlueNotes}
              />
            </CardContent>
          </Card>

          {/* Chord Tones */}
          <Card className="overflow-hidden py-0 gap-0">
            <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-sm sm:text-base">
                {selectedChord.name} Chord Tones
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Notes: {formatNotes(selectedChord.notes)}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 overflow-x-auto">
              <Fretboard
                mode="chord"
                musicalKey={selectedKey}
                chord={selectedChord}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
