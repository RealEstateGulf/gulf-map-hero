'use client';

import Link from 'next/link';
import { Scale, Plus, CheckCircle2, XCircle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useCompare } from '@/context/CompareContext';
import { useCurrency, parseUSD } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import type { Property } from '@/data/properties';
import Navbar from '@/components/map/Navbar';
import FooterSection from '@/components/sections/FooterSection';

type RowKey = keyof Property | 'priceFormatted';

export default function ComparePage() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { list, remove } = useCompare();
  const { formatPrice } = useCurrency();
  const { dir } = useLanguage();
  const tr = useT();

  const ROW_SPECS: { label: string; key: RowKey }[] = [
    { label: tr('compare.row.location'), key: 'locationAr' },
    { label: tr('compare.row.city'), key: 'city' },
    { label: tr('compare.row.type'), key: 'typeAr' },
    { label: tr('compare.row.area'), key: 'area' },
    { label: tr('compare.row.rooms'), key: 'rooms' },
    { label: tr('compare.row.price'), key: 'priceFormatted' },
    { label: tr('compare.row.features'), key: 'features' },
  ];

  if (list.length === 0) {
    return (
      <main style={{ background: t.bg, direction: dir, minHeight: '100vh' }}>
        <Navbar />
        <div style={{ padding: isMobile ? '120px 20px 80px' : '160px 32px 100px', textAlign: 'center' }}>
          <Scale size={48} color={t.gold3} strokeWidth={1} style={{ marginBottom: 24, opacity: 0.5 }} />
          <h1 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? '1.6rem' : '2rem', marginBottom: 14 }}>
            {tr('compare.empty.title')}
          </h1>
          <p style={{ color: t.txt3, fontSize: '0.88rem', lineHeight: 1.8, marginBottom: 32 }}>
            {tr('compare.empty.sub')}
          </p>
          <Link href="/properties" style={{ background: t.gold, borderRadius: 5, color: t.goldText, fontSize: '0.8rem', fontWeight: 700, padding: '13px 28px', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {tr('cta.viewProperties')}
          </Link>
        </div>
        <FooterSection />
      </main>
    );
  }

  return (
    <main style={{ background: t.bg, direction: dir, minHeight: '100vh', paddingBottom: 80 }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: '#060606', borderBottom: `1px solid ${t.gold4}`, padding: isMobile ? '110px 18px 40px' : '120px 32px 52px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Scale size={18} color={t.gold} strokeWidth={1.4} />
              <span style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>{tr('compare.title')}</span>
            </div>
            <h1 style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: isMobile ? 'clamp(1.5rem,6vw,2rem)' : 'clamp(1.8rem,3vw,2.4rem)', margin: 0 }}>
              {tr('compare.count')} {list.length}
            </h1>
          </div>
          {list.length < 3 && (
            <Link href="/properties" style={{ background: t.gold5, border: `1px solid ${t.gold4}`, borderRadius: 6, padding: '10px 16px', color: t.gold, fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Plus size={14} /> {tr('compare.add')} ({list.length}/3)
            </Link>
          )}
        </div>
      </div>

      {/* Comparison table */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '28px 18px' : '48px 32px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: isMobile ? 600 : 'auto' }}>
          {/* Property headers */}
          <thead>
            <tr>
              <th style={{ background: 'transparent', border: 'none', width: 140, padding: '0 12px 16px 0' }}></th>
              {list.map(p => (
                <th key={p.id} style={{ border: 'none', padding: '0 8px 16px', verticalAlign: 'bottom' }}>
                  <div style={{ background: t.altBg, border: `1px solid ${t.border}`, borderRadius: 8, overflow: 'hidden', textAlign: dir === 'rtl' ? 'right' : 'left' }}>
                    {/* Gradient thumbnail */}
                    <div style={{ height: 120, background: p.thumbGradient, position: 'relative' }}>
                      {p.badge && (
                        <span style={{ position: 'absolute', top: 10, right: 10, background: t.gold, color: t.goldText, fontSize: '0.55rem', fontWeight: 700, padding: '2px 8px', borderRadius: 3 }}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '12px 14px 14px' }}>
                      <div style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '0.9rem', marginBottom: 4, lineHeight: 1.3 }}>{p.titleAr}</div>
                      <div style={{ color: t.gold, fontFamily: "'Marcellus', serif", fontSize: '1rem' }}>{formatPrice(parseUSD(p.price))} </div>
                      <button onClick={() => remove(p.id)} style={{
                        marginTop: 8, background: 'none', border: `1px solid ${t.border}`,
                        borderRadius: 4, padding: '4px 10px', color: t.txt4,
                        fontSize: '0.62rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                      }}
                        onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = '#f87171'; el.style.color = '#f87171'; }}
                        onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = t.border; el.style.color = t.txt4; }}
                      >
                        {tr('compare.remove')} ✕
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Spec rows */}
          <tbody>
            {ROW_SPECS.map(({ label, key }, ri) => (
              <tr key={key} style={{ background: ri % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                <td style={{ padding: '14px 12px 14px 0', color: t.txt4, fontSize: '0.76rem', whiteSpace: 'nowrap', verticalAlign: 'top', borderTop: `1px solid ${t.border}` }}>
                  {label}
                </td>
                {list.map(p => {
                  let cellContent: React.ReactNode = null;
                  if (key === 'priceFormatted') {
                    cellContent = <span style={{ fontFamily: "'Marcellus', serif", color: t.gold }}>{formatPrice(parseUSD(p.price))}</span>;
                  } else if (key === 'area') {
                    cellContent = `${p.area} ${tr('unit.sqm')}`;
                  } else if (key === 'features') {
                    cellContent = (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {(p.features ?? []).map((f, fi) => (
                          <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <CheckCircle2 size={11} color={t.gold} strokeWidth={1.5} />
                            <span style={{ color: t.txt3, fontSize: '0.72rem' }}>{f}</span>
                          </div>
                        ))}
                        {(!p.features || p.features.length === 0) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <XCircle size={11} color={t.txt4} strokeWidth={1.5} />
                            <span style={{ color: t.txt4, fontSize: '0.72rem' }}>—</span>
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    const val = p[key as keyof typeof p];
                    cellContent = String(val ?? '—');
                  }
                  return (
                    <td key={p.id} style={{ padding: '14px 8px', color: t.txt2, fontSize: '0.82rem', borderTop: `1px solid ${t.border}`, verticalAlign: 'top' }}>
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* CTA row */}
        <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {list.map(p => (
            <Link key={p.id} href={`/properties/${p.id}`} style={{
              background: t.gold5, border: `1px solid ${t.gold4}`, borderRadius: 6,
              padding: '10px 18px', color: t.gold, fontSize: '0.75rem', fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = t.gold; el.style.color = t.goldText; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = t.gold5; el.style.color = t.gold; }}
            >
              {tr('compare.viewFull')} {p.titleAr} {tr('compare.viewFullSuffix')}
            </Link>
          ))}
          <Link href="/contact" style={{ background: t.gold, borderRadius: 6, padding: '10px 20px', color: t.goldText, fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.06em' }}>
            {tr('cta.contactNow')}
          </Link>
        </div>
      </div>

      <FooterSection />
    </main>
  );
}
