'use client';

import Link from 'next/link';
import { X, Scale } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { useTheme } from '@/context/ThemeContext';
import { useT } from '@/hooks/useT';
import { useLanguage } from '@/context/LanguageContext';

export default function CompareBar() {
  const { list, remove, clear } = useCompare();
  const { t } = useTheme();
  const tr = useT();
  const { dir } = useLanguage();

  if (list.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 8000,
      background: '#0c0c0c', borderTop: `1px solid ${t.gold3}`,
      padding: '14px 20px',
      transform: list.length > 0 ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.38s cubic-bezier(0.22,1,0.36,1)',
      direction: dir,
      boxShadow: '0 -8px 40px rgba(217,186,160,0.12)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Scale size={16} color={t.gold} strokeWidth={1.4} />
          <span style={{ color: t.txt3, fontSize: '0.76rem' }}>{tr('compare.count')} ({list.length}/3)</span>
        </div>

        {/* Property thumbnails */}
        <div style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap' }}>
          {list.map(p => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: t.altBg, border: `1px solid ${t.border}`,
              borderRadius: 6, padding: '6px 10px', position: 'relative',
            }}>
              <div style={{ width: 36, height: 28, borderRadius: 4, background: p.thumbGradient, flexShrink: 0 }} />
              <div>
                <div style={{ color: t.txt, fontSize: '0.72rem', fontWeight: 500, maxWidth: 120, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{p.titleAr}</div>
                <div style={{ color: t.gold, fontSize: '0.62rem' }}>{p.price} $</div>
              </div>
              <button onClick={() => remove(p.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: t.txt4, padding: 2, display: 'flex', transition: 'color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; }}
                onMouseLeave={e => { e.currentTarget.style.color = t.txt4; }}
              >
                <X size={13} />
              </button>
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: 3 - list.length }).map((_, i) => (
            <div key={i} style={{
              width: 120, height: 42,
              background: 'rgba(255,255,255,0.02)',
              border: `1px dashed ${t.border}`,
              borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.txt4, fontSize: '0.62rem',
            }}>
              {tr('compare.add')}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button onClick={clear} style={{
            background: 'none', border: `1px solid ${t.border}`,
            borderRadius: 5, padding: '8px 14px', color: t.txt3,
            fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = t.border2; el.style.color = t.txt; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = t.border; el.style.color = t.txt3; }}
          >
            {tr('compare.clear')}
          </button>
          <Link href="/compare" style={{
            background: t.gold, border: 'none', borderRadius: 5,
            padding: '8px 18px', color: t.goldText, fontSize: '0.75rem',
            fontWeight: 700, textDecoration: 'none', display: 'inline-flex',
            alignItems: 'center', gap: 6, letterSpacing: '0.05em',
            opacity: list.length < 2 ? 0.5 : 1,
            pointerEvents: list.length < 2 ? 'none' : 'auto',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => { if (list.length >= 2) (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
            onMouseLeave={e => { if (list.length >= 2) (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
          >
            <Scale size={14} /> {tr('compare.now')}
          </Link>
        </div>
      </div>
    </div>
  );
}
