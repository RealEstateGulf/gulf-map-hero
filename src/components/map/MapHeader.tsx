'use client';

import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

export default function MapHeader() {
  const { t } = useTheme();
  const { dir, isAr } = useLanguage();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        padding: '18px 24px',
        background: t.headerGrad,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        direction: dir,
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isAr ? 'flex-end' : 'flex-start', gap: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span
            style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.15rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            }}
          >
            Gulf Map Hero
          </span>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: t.gold,
              boxShadow: `0 0 8px ${t.gold}, 0 0 16px ${t.gold2}`,
            }}
          />
        </div>
        <span
          style={{
            color: t.gold2,
            fontSize: '0.72rem',
            letterSpacing: '0.04em',
            fontWeight: 400,
          }}
        >
          {isAr ? 'فرص استثمارية في تركيا' : 'Investment Opportunities in Turkey'}
        </span>
      </div>

      {/* Stats + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            background: 'rgba(255,255,255,0.08)',
            border: `1px solid ${t.gold4}`,
            borderRadius: 8,
            overflow: 'hidden',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ padding: '6px 14px', textAlign: 'center', borderInlineEnd: `1px solid ${t.gold4}` }}>
            <div style={{ color: t.gold, fontWeight: 700, fontSize: '0.9rem', lineHeight: 1 }}>15</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', marginTop: 2 }}>
              {isAr ? 'عقار' : 'Props'}
            </div>
          </div>
          <div style={{ padding: '6px 14px', textAlign: 'center' }}>
            <div style={{ color: t.gold, fontWeight: 700, fontSize: '0.9rem', lineHeight: 1 }}>4</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', marginTop: 2 }}>
              {isAr ? 'مدن' : 'Cities'}
            </div>
          </div>
        </div>

        <button
          style={{
            background: t.gold5,
            border: `1px solid ${t.gold3}`,
            color: t.gold,
            padding: '8px 18px',
            borderRadius: 8,
            fontSize: '0.78rem',
            cursor: 'pointer',
            fontWeight: 500,
            letterSpacing: '0.06em',
            transition: 'all 0.25s',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = t.gold6;
            e.currentTarget.style.boxShadow = `0 0 18px ${t.gold5}`;
            e.currentTarget.style.borderColor = t.gold2;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = t.gold5;
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = t.gold3;
          }}
        >
          {isAr ? 'ابدأ الاستكشاف' : 'Start Exploring'}
        </button>
      </div>
    </div>
  );
}
