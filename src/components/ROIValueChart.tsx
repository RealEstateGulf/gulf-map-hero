'use client';

import { useState, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';

interface Point {
  yr: number;
  val: number;
}

interface Props {
  data: Point[];
  formatPrice: (n: number) => string;
  title: string;
  isAr: boolean;
}

const W = 600;
const H = 220;
const PAD_L = 8;
const PAD_R = 8;
const PAD_T = 16;
const PAD_B = 28;

export default function ROIValueChart({ data, formatPrice, title, isAr }: Props) {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const series = data; // [{ yr, val }] for years 1..N, as computed by calcROI's table
  const minVal = Math.min(...series.map(p => p.val));
  const maxVal = Math.max(...series.map(p => p.val));
  const range = maxVal - minVal || 1;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const x = (i: number) => PAD_L + (i / (series.length - 1 || 1)) * plotW;
  const y = (v: number) => PAD_T + plotH - ((v - minVal) / range) * plotH;

  const linePath = series.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(2)} ${y(p.val).toFixed(2)}`).join(' ');
  const areaPath = `${linePath} L ${x(series.length - 1).toFixed(2)} ${(PAD_T + plotH).toFixed(2)} L ${x(0).toFixed(2)} ${(PAD_T + plotH).toFixed(2)} Z`;

  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * W;
    let nearest = 0;
    let best = Infinity;
    series.forEach((_, i) => {
      const d = Math.abs(x(i) - relX);
      if (d < best) { best = d; nearest = i; }
    });
    setHoverIdx(nearest);
  };

  const gridLines = 4;
  const gridValues = Array.from({ length: gridLines + 1 }, (_, i) => minVal + (range * i) / gridLines);

  const hovered = hoverIdx !== null ? series[hoverIdx] : null;

  return (
    <div>
      <div style={{ color: t.txt, fontFamily: "'Marcellus', serif", fontSize: '0.9rem', marginBottom: 10 }}>
        {title}
      </div>
      <div style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: isMobile ? 160 : 220, display: 'block', cursor: 'crosshair' }}
          onPointerMove={handleMove}
          onPointerLeave={() => setHoverIdx(null)}
          role="img"
          aria-label={title}
        >
          {/* Gridlines */}
          {gridValues.map((gv, i) => (
            <line
              key={i}
              x1={PAD_L} x2={W - PAD_R}
              y1={y(gv)} y2={y(gv)}
              stroke={t.border} strokeWidth={1}
            />
          ))}

          {/* Area wash */}
          <path d={areaPath} fill={t.gold} opacity={0.08} stroke="none" />

          {/* Line */}
          <path d={linePath} fill="none" stroke={t.gold} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {/* End marker */}
          <circle cx={x(series.length - 1)} cy={y(series[series.length - 1].val)} r={4} fill={t.gold} stroke={t.altBg} strokeWidth={2} />

          {/* Crosshair + hover point */}
          {hovered && hoverIdx !== null && (
            <>
              <line
                x1={x(hoverIdx)} x2={x(hoverIdx)}
                y1={PAD_T} y2={PAD_T + plotH}
                stroke={t.gold3} strokeWidth={1}
              />
              <circle cx={x(hoverIdx)} cy={y(hovered.val)} r={5} fill={t.gold} stroke={t.altBg} strokeWidth={2} />
            </>
          )}

          {/* Year axis labels */}
          {series.map((p, i) => (
            (i === 0 || i === series.length - 1 || i === hoverIdx) && (
              <text
                key={p.yr}
                x={x(i)} y={H - 8}
                fontSize={11}
                textAnchor={i === 0 ? 'start' : i === series.length - 1 ? 'end' : 'middle'}
                fill={t.txt4}
              >
                {isAr ? `سنة ${p.yr}` : `Yr ${p.yr}`}
              </text>
            )
          ))}
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div
            style={{
              position: 'absolute',
              top: 4,
              [isAr ? 'right' : 'left']: 8,
              background: '#060606',
              border: `1px solid ${t.gold4}`,
              borderRadius: 6,
              padding: '6px 10px',
              pointerEvents: 'none',
              fontSize: '0.75rem',
            }}
          >
            <div style={{ color: t.txt4, marginBottom: 2 }}>{isAr ? `السنة ${hovered.yr}` : `Year ${hovered.yr}`}</div>
            <div style={{ color: t.gold, fontWeight: 700 }}>{formatPrice(hovered.val)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
