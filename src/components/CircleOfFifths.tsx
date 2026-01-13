'use client';

import { Note } from '@/lib/music-theory';

interface CircleOfFifthsProps {
  selectedKey: Note;
  onKeySelect: (key: Note) => void;
}

// Circle of fifths order (clockwise from top)
const KEYS: { note: Note; label: string }[] = [
  { note: 'C', label: 'C' },
  { note: 'G', label: 'G' },
  { note: 'D', label: 'D' },
  { note: 'A', label: 'A' },
  { note: 'E', label: 'E' },
  { note: 'B', label: 'B' },
  { note: 'F#', label: 'F#' },
  { note: 'C#', label: 'Db' },
  { note: 'G#', label: 'Ab' },
  { note: 'D#', label: 'Eb' },
  { note: 'A#', label: 'Bb' },
  { note: 'F', label: 'F' },
];

// Round to fixed precision to avoid hydration mismatch
const round = (n: number) => Math.round(n * 1000) / 1000;

// Create arc path for a wedge segment
function createWedgePath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
): string {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = round(cx + outerR * Math.cos(startRad));
  const y1 = round(cy + outerR * Math.sin(startRad));
  const x2 = round(cx + outerR * Math.cos(endRad));
  const y2 = round(cy + outerR * Math.sin(endRad));
  const x3 = round(cx + innerR * Math.cos(endRad));
  const y3 = round(cy + innerR * Math.sin(endRad));
  const x4 = round(cx + innerR * Math.cos(startRad));
  const y4 = round(cy + innerR * Math.sin(startRad));

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
}

export function CircleOfFifths({ selectedKey, onKeySelect }: CircleOfFifthsProps) {
  const cx = 50;
  const cy = 50;
  const outerRadius = 46;
  const innerRadius = 20;
  const gap = 1.5; // gap between segments in degrees

  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
      >
        {KEYS.map((key, index) => {
          const segmentAngle = 360 / KEYS.length;
          const startAngle = index * segmentAngle - 90 - segmentAngle / 2 + gap / 2;
          const endAngle = startAngle + segmentAngle - gap;
          const isSelected = selectedKey === key.note;

          // Calculate label position (middle of the wedge)
          const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
          const labelR = (innerRadius + outerRadius) / 2;
          const labelX = round(cx + labelR * Math.cos(midAngle));
          const labelY = round(cy + labelR * Math.sin(midAngle));

          return (
            <g
              key={key.note}
              className="cursor-pointer group"
              onClick={() => onKeySelect(key.note)}
            >
              <path
                d={createWedgePath(cx, cy, innerRadius, outerRadius, startAngle, endAngle)}
                className={`
                  transition-all duration-150
                  ${isSelected
                    ? 'fill-primary stroke-primary'
                    : 'fill-muted group-hover:fill-primary/80 stroke-border group-hover:stroke-primary'
                  }
                `}
                strokeWidth="0.5"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className={`
                  text-[7px] sm:text-[8px] font-medium pointer-events-none select-none
                  transition-all duration-150
                  ${isSelected ? 'fill-primary-foreground' : 'fill-foreground group-hover:fill-primary-foreground'}
                `}
              >
                {key.label}
              </text>
            </g>
          );
        })}

        {/* Center circle */}
        <circle
          cx={cx}
          cy={cy}
          r={innerRadius - 2}
          className="fill-background"
        />
      </svg>
    </div>
  );
}
