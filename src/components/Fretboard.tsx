'use client';

import {
  STANDARD_TUNING,
  getNoteAtFret,
  isInScale,
  isBlueNote,
  isChordTone,
  getChordDegree,
  getDegreeLabel,
  ChordDefinition,
  Note,
} from '@/lib/music-theory';

interface FretboardProps {
  mode: 'scale' | 'chord';
  musicalKey: Note;
  chord?: ChordDefinition;
  showBlueNotes?: boolean;
}

const FRET_COUNT = 16; // 0-15 frets
const FRET_MARKERS = [3, 5, 7, 9, 12, 15];
const DOUBLE_MARKERS = [12];

export function Fretboard({ mode, musicalKey, chord, showBlueNotes = true }: FretboardProps) {
  // Determine note display style
  const getNoteStyle = (note: Note): {
    show: boolean;
    bgColor: string;
    textColor: string;
    opacity: string;
    degree: string;
  } => {
    const inScale = isInScale(note, musicalKey);
    const blueNote = isBlueNote(note, musicalKey);

    if (mode === 'scale') {
      // Scale mode: scale tones + blue notes
      if (inScale) {
        return {
          show: true,
          bgColor: 'bg-indigo-500',
          textColor: 'text-white',
          opacity: 'opacity-100',
          degree: getDegreeLabel(note, musicalKey),
        };
      }
      if (blueNote && showBlueNotes) {
        return {
          show: true,
          bgColor: 'bg-amber-600/80',
          textColor: 'text-white',
          opacity: 'opacity-100',
          degree: getDegreeLabel(note, musicalKey),
        };
      }
      return { show: false, bgColor: '', textColor: '', opacity: '', degree: '' };
    }

    // Chord mode
    if (!chord) return { show: false, bgColor: '', textColor: '', opacity: '', degree: '' };

    const isChord = isChordTone(note, chord);
    const chordDegree = getChordDegree(note, chord);

    if (isChord && chordDegree) {
      // Chord tone: emphasized display
      return {
        show: true,
        bgColor: 'bg-emerald-500',
        textColor: 'text-white',
        opacity: 'opacity-100',
        degree: chordDegree,
      };
    }

    if (inScale) {
      // Scale tone: dimmed display
      return {
        show: true,
        bgColor: 'bg-indigo-400/40',
        textColor: 'text-indigo-100',
        opacity: 'opacity-100',
        degree: getDegreeLabel(note, musicalKey),
      };
    }

    return { show: false, bgColor: '', textColor: '', opacity: '', degree: '' };
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* Fretboard */}
      <div className="min-w-[500px] sm:min-w-[700px]">
          {/* Fret numbers */}
          <div className="flex mb-1">
            <div className="w-6 sm:w-8 shrink-0" /> {/* String name space */}
            {Array.from({ length: FRET_COUNT }, (_, fret) => (
              <div
                key={fret}
                className="flex-1 text-center text-[10px] sm:text-xs text-muted-foreground min-w-[28px] sm:min-w-[40px]"
              >
                {fret > 0 ? fret : ''}
              </div>
            ))}
          </div>

          {/* Strings and fretboard */}
          <div className="relative bg-stone-700 rounded-lg p-1.5 sm:p-2">
            {/* Fret markers */}
            <div className="absolute inset-0 flex pointer-events-none">
              <div className="w-6 sm:w-8 shrink-0" />
              {Array.from({ length: FRET_COUNT }, (_, fret) => (
                <div key={fret} className="flex-1 flex items-center justify-center min-w-[28px] sm:min-w-[40px]">
                  {FRET_MARKERS.includes(fret) && (
                    <div className="flex flex-col gap-12 sm:gap-16">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-stone-500/40" />
                      {DOUBLE_MARKERS.includes(fret) && (
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-stone-500/40" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Strings (1st string at top, 6th string at bottom) */}
            {[...STANDARD_TUNING].reverse().map((openNote, stringIndex) => (
              <div key={stringIndex} className="flex items-center h-8 sm:h-10">
                {/* String name */}
                <div className="w-6 sm:w-8 text-center text-xs sm:text-sm font-bold text-stone-300 shrink-0">
                  {openNote}
                </div>

                {/* Frets */}
                {Array.from({ length: FRET_COUNT }, (_, fret) => {
                  const note = getNoteAtFret(openNote, fret);
                  const style = getNoteStyle(note);
                  // String thickness: thinner at top (1st), thicker at bottom (6th)
                  const stringThickness = 1 + stringIndex * 0.4;

                  return (
                    <div
                      key={fret}
                      className={`flex-1 h-full flex items-center justify-center relative min-w-[28px] sm:min-w-[40px] ${
                        fret === 0 ? 'bg-stone-400' : 'border-r border-stone-600'
                      }`}
                    >
                      {/* String line */}
                      <div
                        className="absolute inset-x-0 top-1/2 bg-stone-400"
                        style={{
                          height: `${stringThickness}px`,
                        }}
                      />

                      {/* Note display */}
                      {style.show && (
                        <div
                          className={`
                            relative z-10 w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center
                            text-[10px] sm:text-xs font-semibold
                            ${style.bgColor} ${style.textColor} ${style.opacity}
                          `}
                        >
                          {style.degree}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}
