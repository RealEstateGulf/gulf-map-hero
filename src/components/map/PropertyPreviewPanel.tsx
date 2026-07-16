'use client';

import { X, MapPin, Maximize2 } from 'lucide-react';
import { Property } from '@/data/properties';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  properties: Property[];
  cityName: string;
  onClose: () => void;
}

export default function PropertyPreviewPanel({ properties, cityName, onClose }: Props) {
  const { t } = useTheme();
  const { dir, isAr } = useLanguage();

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: t.surface,
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        borderLeft: `1px solid ${t.gold4}`,
        boxShadow: t.name === 'luxhom' ? '-4px 0 32px rgba(0,0,0,0.08)' : 'none',
        direction: dir,
        transition: 'background 0.4s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: `1px solid ${t.gold4}`,
          background: t.name === 'luxhom'
            ? `linear-gradient(to bottom, ${t.gold6} 0%, transparent 100%)`
            : `linear-gradient(to bottom, ${t.gold6} 0%, transparent 100%)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: t.gold,
                  boxShadow: `0 0 6px ${t.gold}`,
                }}
              />
              <h2 style={{ color: t.txt, fontWeight: 700, fontSize: '1.1rem', margin: 0, letterSpacing: '0.04em' }}>
                {cityName}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={11} color={t.gold2} />
              <span style={{ color: t.gold2, fontSize: '0.72rem' }}>
                {properties.length} {isAr ? 'عقار متاح' : 'properties available'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: t.btn,
              border: `1px solid ${t.btnBorder}`,
              borderRadius: 8,
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: t.txt3,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = t.border2;
              e.currentTarget.style.color = t.txt;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = t.btn;
              e.currentTarget.style.color = t.txt3;
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Property list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {properties.map(prop => (
            <PropertyCard key={prop.id} prop={prop} />
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: `1px solid ${t.gold4}`,
          background: t.gold6,
        }}
      >
        <button
          style={{
            width: '100%',
            padding: '11px',
            background: t.gold5,
            border: `1px solid ${t.gold3}`,
            borderRadius: 10,
            color: t.gold,
            fontSize: '0.82rem',
            fontWeight: 500,
            cursor: 'pointer',
            letterSpacing: '0.05em',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = t.gold6;
            e.currentTarget.style.boxShadow = `0 0 16px ${t.gold5}`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = t.gold5;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isAr ? `عرض جميع العقارات في ${cityName}` : `View All Properties in ${cityName}`}
        </button>
      </div>
    </div>
  );
}

function PropertyCard({ prop }: { prop: Property }) {
  const { t } = useTheme();
  const { isAr } = useLanguage();

  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        padding: '14px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: t.shadow,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.borderColor = t.gold3;
        el.style.background = t.cardHover;
        el.style.boxShadow = t.name === 'luxhom' ? '0 4px 20px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.borderColor = t.border;
        el.style.background = t.card;
        el.style.boxShadow = t.shadow;
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
        <span
          style={{
            fontSize: '0.65rem',
            background: t.gold5,
            color: t.gold,
            padding: '3px 9px',
            borderRadius: 999,
            border: `1px solid ${t.gold4}`,
            letterSpacing: '0.05em',
          }}
        >
          {isAr ? prop.typeAr : prop.typeEn}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Maximize2 size={10} color={t.txt4} />
          <span style={{ color: t.txt4, fontSize: '0.68rem' }}>{prop.area} m²</span>
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          color: t.txt,
          fontWeight: 600,
          fontSize: '0.88rem',
          margin: '0 0 5px 0',
          lineHeight: 1.3,
        }}
      >
        {isAr ? prop.titleAr : prop.titleEn}
      </h3>

      {/* Location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12 }}>
        <MapPin size={10} color={t.txt4} />
        <span style={{ color: t.txt4, fontSize: '0.72rem' }}>{isAr ? prop.locationAr : prop.locationEn}</span>
      </div>

      {/* Price + rooms */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            color: t.gold,
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '0.02em',
          }}
        >
          {prop.price}
        </span>
        <span
          style={{
            color: t.txt3,
            fontSize: '0.72rem',
            background: t.btn,
            padding: '2px 8px',
            borderRadius: 6,
          }}
        >
          {prop.rooms}
        </span>
      </div>
    </div>
  );
}
