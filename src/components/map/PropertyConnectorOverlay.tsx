'use client';

import { useEffect, useRef, useState } from 'react';
import { X, LayoutGrid } from 'lucide-react';
import { Property } from '@/data/properties';
import PropertyConnectorCard from './PropertyConnectorCard';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  cityName: string;
  properties: Property[];
  markerPoint: { x: number; y: number } | null;
  onSelectProperty: (property: Property) => void;
  onShowAll: () => void;
  onClose: () => void;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cx: number;
  cy: number;
}

const CARD_WIDTH = 340;

const CORNER_STYLES: Array<{ top?: number; bottom?: number; left?: number; right?: number }> = [
  { top: 84, left: 28 },
  { top: 84, right: 28 },
  { bottom: 108, left: 28 },
  { bottom: 108, right: 28 },
];

export default function PropertyConnectorOverlay({
  cityName,
  properties,
  markerPoint,
  onSelectProperty,
  onShowAll,
  onClose,
}: Props) {
  const { t } = useTheme();
  const { isAr } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lines, setLines] = useState<Line[]>([]);

  const visible = properties.slice(0, 4);

  useEffect(() => {
    const update = () => {
      const container = containerRef.current;
      if (!markerPoint || !container) {
        setLines([]);
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      const next: Line[] = [];

      visible.forEach((_, i) => {
        const card = cardRefs.current[i];
        if (!card) return;
        const r = card.getBoundingClientRect();

        // Card corner closest to marker (container-relative)
        const x1 = (i % 2 === 0 ? r.right : r.left) - containerRect.left;
        const y1 = (i < 2 ? r.bottom : r.top) - containerRect.top;
        const x2 = markerPoint.x;
        const y2 = markerPoint.y;

        // Quadratic bezier control point — dramatic outward arc
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1) return;

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        // Perpendicular direction (90° rotated)
        const perpX = -dy / len;
        const perpY = dx / len;

        // Bow away from screen center
        const dot = perpX * (midX - centerX) + perpY * (midY - centerY);
        const sign = dot >= 0 ? 1 : -1;

        // 25% of line length = dramatic arc
        const arcHeight = len * 0.25;
        const cx = midX + sign * perpX * arcHeight;
        const cy = midY + sign * perpY * arcHeight;

        next.push({ x1, y1, x2, y2, cx, cy });
      });

      setLines(next);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [markerPoint, visible.length]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, zIndex: 25, pointerEvents: 'none' }}>
      {/* Curved connector lines */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          {lines.map((l, i) => (
            <linearGradient
              key={i}
              id={`conn-grad-${i}`}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={t.gold} stopOpacity={0.92} />
              <stop offset="100%" stopColor={t.gold} stopOpacity={0.22} />
            </linearGradient>
          ))}
        </defs>

        {/* Curved paths */}
        {lines.map((l, i) => (
          <path
            key={i}
            d={`M ${l.x1} ${l.y1} Q ${l.cx} ${l.cy} ${l.x2} ${l.y2}`}
            stroke={`url(#conn-grad-${i})`}
            strokeWidth={1.6}
            strokeDasharray="5 4"
            fill="none"
            style={{ animation: 'connectorDash 0.7s linear infinite' }}
          />
        ))}

        {/* Dot at each card connection point */}
        {lines.map((l, i) => (
          <circle key={`dot-${i}`} cx={l.x1} cy={l.y1} r={3.5} fill={t.gold} opacity={0.7} />
        ))}

        {/* Marker rings */}
        {markerPoint && lines.length > 0 && (
          <>
            <circle cx={markerPoint.x} cy={markerPoint.y} r={12} fill="none" stroke={t.gold} strokeOpacity={0.18} strokeWidth={1} />
            <circle cx={markerPoint.x} cy={markerPoint.y} r={6} fill="none" stroke={t.gold} strokeOpacity={0.45} strokeWidth={1.5} />
            <circle cx={markerPoint.x} cy={markerPoint.y} r={3} fill={t.gold} opacity={0.95} />
          </>
        )}
      </svg>

      {/* Empty state */}
      {properties.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            animation: 'connectorCardIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
          }}
        >
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', fontWeight: 600, marginBottom: 6 }}>
            {isAr ? 'لا توجد عقارات في هذا التصنيف حالياً' : 'No properties in this category'}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>
            {isAr ? 'جرّب اختيار تصنيف آخر من القائمة السفلية' : 'Try selecting a different category from the bar below'}
          </div>
        </div>
      )}

      {/* Corner cards */}
      {visible.map((property, i) => (
        <div
          key={property.id}
          ref={el => { cardRefs.current[i] = el; }}
          style={{
            position: 'absolute',
            ...CORNER_STYLES[i],
            width: CARD_WIDTH,
            pointerEvents: 'auto',
            animation: `connectorCardIn 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s both`,
          }}
        >
          <PropertyConnectorCard property={property} onDetail={onSelectProperty} />
        </div>
      ))}

      {/* Top center info capsule */}
      <div
        style={{
          position: 'absolute',
          top: 76,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: t.navbar,
          border: `1px solid ${t.gold3}`,
          borderRadius: 999,
          padding: '8px 10px 8px 18px',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          direction: 'ltr',
          pointerEvents: 'auto',
          animation: 'fadeSlideDown 0.4s ease',
          boxShadow: t.name === 'luxhom'
            ? '0 4px 20px rgba(0,0,0,0.08)'
            : '0 4px 24px rgba(0,0,0,0.5)',
        }}
      >
        <span style={{ color: t.txt, fontWeight: 800, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
          {cityName}
        </span>
        <span style={{ color: t.gold2, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
          {properties.length} {isAr ? 'فرصة استثمارية' : 'investment opportunities'}
        </span>
        {properties.length > 0 && (
          <button
            onClick={onShowAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: t.gold,
              border: 'none',
              borderRadius: 999,
              color: t.goldText,
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '6px 14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <LayoutGrid size={13} />
            {isAr ? 'عرض الكل' : 'View All'}
          </button>
        )}
        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            background: t.btn,
            border: `1px solid ${t.btnBorder}`,
            borderRadius: '50%',
            color: t.txt3,
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = t.txt; }}
          onMouseLeave={e => { e.currentTarget.style.color = t.txt3; }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
