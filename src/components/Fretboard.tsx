'use client';

import {
  STANDARD_TUNING,
  getNoteAtFret,
  isInScale,
  isBlueNote,
  isChordTone,
  getChordDegree,
  G_MAJOR_DEGREES,
  ChordDefinition,
  Note,
} from '@/lib/music-theory';

interface FretboardProps {
  mode: 'scale' | 'chord';
  chord?: ChordDefinition;
  showBlueNotes?: boolean;
}

const FRET_COUNT = 16; // 0-15 frets
const FRET_MARKERS = [3, 5, 7, 9, 12, 15];
const DOUBLE_MARKERS = [12];

export function Fretboard({ mode, chord, showBlueNotes = true }: FretboardProps) {
  // ノートの表示スタイルを決定
  const getNoteStyle = (note: Note, stringIndex: number, fret: number): {
    show: boolean;
    bgColor: string;
    textColor: string;
    opacity: string;
    degree: string;
  } => {
    const inScale = isInScale(note);
    const blueNote = isBlueNote(note);

    if (mode === 'scale') {
      // スケールモード: スケールトーン + ブルーノート
      if (inScale) {
        return {
          show: true,
          bgColor: 'bg-indigo-500',
          textColor: 'text-white',
          opacity: 'opacity-100',
          degree: G_MAJOR_DEGREES[note],
        };
      }
      if (blueNote && showBlueNotes) {
        return {
          show: true,
          bgColor: 'bg-amber-600/80',
          textColor: 'text-white',
          opacity: 'opacity-100',
          degree: G_MAJOR_DEGREES[note],
        };
      }
      return { show: false, bgColor: '', textColor: '', opacity: '', degree: '' };
    }

    // コードモード
    if (!chord) return { show: false, bgColor: '', textColor: '', opacity: '', degree: '' };

    const isChord = isChordTone(note, chord);
    const chordDegree = getChordDegree(note, chord);

    if (isChord && chordDegree) {
      // コードトーン: 強調表示、コードルートからの度数
      return {
        show: true,
        bgColor: 'bg-emerald-500',
        textColor: 'text-white',
        opacity: 'opacity-100',
        degree: chordDegree,
      };
    }

    if (inScale) {
      // スケールトーン: 薄く表示、Gメジャー基準の度数
      return {
        show: true,
        bgColor: 'bg-indigo-400/40',
        textColor: 'text-indigo-100',
        opacity: 'opacity-100',
        degree: G_MAJOR_DEGREES[note],
      };
    }

    return { show: false, bgColor: '', textColor: '', opacity: '', degree: '' };
  };

  return (
    <div className="w-full">
      {/* Fretboard */}
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="min-w-[700px]">
          {/* Fret numbers */}
          <div className="flex mb-1">
            <div className="w-8 shrink-0" /> {/* String name space */}
            {Array.from({ length: FRET_COUNT }, (_, fret) => (
              <div
                key={fret}
                className="flex-1 text-center text-xs text-muted-foreground min-w-[40px]"
              >
                {fret > 0 ? fret : ''}
              </div>
            ))}
          </div>

          {/* Strings and fretboard */}
          <div className="relative bg-stone-700 rounded-lg p-2">
            {/* フレットマーカー */}
            <div className="absolute inset-0 flex pointer-events-none">
              <div className="w-8 shrink-0" />
              {Array.from({ length: FRET_COUNT }, (_, fret) => (
                <div key={fret} className="flex-1 flex items-center justify-center min-w-[40px]">
                  {FRET_MARKERS.includes(fret) && (
                    <div className="flex flex-col gap-16">
                      <div className="w-3 h-3 rounded-full bg-stone-500/40" />
                      {DOUBLE_MARKERS.includes(fret) && (
                        <div className="w-3 h-3 rounded-full bg-stone-500/40" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 弦（1弦から6弦の順：上が1弦、下が6弦） */}
            {[...STANDARD_TUNING].reverse().map((openNote, stringIndex) => (
              <div key={stringIndex} className="flex items-center h-10">
                {/* 弦名 */}
                <div className="w-8 text-center text-sm font-bold text-stone-300 shrink-0">
                  {openNote}
                </div>

                {/* フレット */}
                {Array.from({ length: FRET_COUNT }, (_, fret) => {
                  const note = getNoteAtFret(openNote, fret);
                  const style = getNoteStyle(note, stringIndex, fret);
                  // 弦の太さ: 1弦(上)が細く、6弦(下)が太い
                  const stringThickness = 1 + stringIndex * 0.4;

                  return (
                    <div
                      key={fret}
                      className={`flex-1 h-full flex items-center justify-center relative min-w-[40px] ${
                        fret === 0 ? 'bg-stone-400' : 'border-r border-stone-600'
                      }`}
                    >
                      {/* 弦線 */}
                      <div
                        className="absolute inset-x-0 top-1/2 bg-stone-400"
                        style={{
                          height: `${stringThickness}px`,
                        }}
                      />

                      {/* ノート表示 */}
                      {style.show && (
                        <div
                          className={`
                            relative z-10 w-7 h-7 rounded-full flex items-center justify-center
                            text-xs font-semibold
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
    </div>
  );
}
