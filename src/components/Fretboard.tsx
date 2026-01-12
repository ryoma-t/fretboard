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
  title: string;
  subtitle: string;
  mode: 'scale' | 'chord';
  chord?: ChordDefinition;
}

const FRET_COUNT = 16; // 0-15フレット
const FRET_MARKERS = [3, 5, 7, 9, 12, 15];
const DOUBLE_MARKERS = [12];

export function Fretboard({ title, subtitle, mode, chord }: FretboardProps) {
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
          bgColor: 'bg-blue-500',
          textColor: 'text-white',
          opacity: 'opacity-100',
          degree: G_MAJOR_DEGREES[note],
        };
      }
      if (blueNote) {
        return {
          show: true,
          bgColor: 'bg-orange-500',
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
        bgColor: 'bg-blue-400',
        textColor: 'text-white',
        opacity: 'opacity-40',
        degree: G_MAJOR_DEGREES[note],
      };
    }

    return { show: false, bgColor: '', textColor: '', opacity: '', degree: '' };
  };

  return (
    <div className="w-full">
      {/* タイトル */}
      <div className="mb-2">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>

      {/* 指板 */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[800px]">
          {/* フレット番号 */}
          <div className="flex mb-1">
            <div className="w-8 shrink-0" /> {/* 弦名用スペース */}
            {Array.from({ length: FRET_COUNT }, (_, fret) => (
              <div
                key={fret}
                className="flex-1 text-center text-xs text-gray-500 min-w-[40px]"
              >
                {fret}
              </div>
            ))}
          </div>

          {/* 弦と指板 */}
          <div className="relative bg-amber-800 rounded-lg p-2">
            {/* フレットマーカー */}
            <div className="absolute inset-0 flex pointer-events-none">
              <div className="w-8 shrink-0" />
              {Array.from({ length: FRET_COUNT }, (_, fret) => (
                <div key={fret} className="flex-1 flex items-center justify-center min-w-[40px]">
                  {FRET_MARKERS.includes(fret) && (
                    <div className="flex flex-col gap-16">
                      <div className="w-3 h-3 rounded-full bg-amber-200/30" />
                      {DOUBLE_MARKERS.includes(fret) && (
                        <div className="w-3 h-3 rounded-full bg-amber-200/30" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 弦 */}
            {STANDARD_TUNING.map((openNote, stringIndex) => (
              <div key={stringIndex} className="flex items-center h-10">
                {/* 弦名 */}
                <div className="w-8 text-center text-sm font-bold text-amber-100 shrink-0">
                  {openNote}
                </div>

                {/* フレット */}
                {Array.from({ length: FRET_COUNT }, (_, fret) => {
                  const note = getNoteAtFret(openNote, fret);
                  const style = getNoteStyle(note, stringIndex, fret);

                  return (
                    <div
                      key={fret}
                      className={`flex-1 h-full flex items-center justify-center relative min-w-[40px] ${
                        fret === 0 ? 'bg-gray-200' : 'border-r border-amber-600'
                      }`}
                    >
                      {/* 弦線 */}
                      <div
                        className="absolute inset-x-0 top-1/2 h-px bg-gray-400"
                        style={{
                          height: `${1 + stringIndex * 0.3}px`,
                        }}
                      />

                      {/* ノート表示 */}
                      {style.show && (
                        <div
                          className={`
                            relative z-10 w-7 h-7 rounded-full flex items-center justify-center
                            text-xs font-bold shadow-md
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
