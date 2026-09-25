'use client';

import { useEffect, useState } from 'react';
import { BedDouble, Maximize2, ArrowLeft, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useIsMobile } from '@/hooks/useResponsive';
import { useCurrency, parseUSD } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import { useContent } from '@/hooks/useContent';
import type { Property } from '@/data/properties';

const BUDGET_CAP_USD = 250_000;

export default function BudgetSection() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { ref, visible } = useScrollReveal();
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { dir, isAr } = useLanguage();
  const tr = useT();
  const { get } = useContent('home');

  const [properties, setProperties] = useState<Property[] | null>(null);

  useEffect(() => {
    fetch('/api/properties')
      .then(r => r.json())
      .then((data: Property[]) => {
        const budget = data
          .filter(p => parseUSD(p.price) > 0 && parseUSD(p.price) <= BUDGET_CAP_USD)
          .sort((a, b) => parseUSD(a.price) - parseUSD(b.price));
        setProperties(budget.slice(0, 8));
      })
      .catch(() => setProperties([]));
  }, []);

  // Same guard pattern as FeaturedSection: don't bail out while still loading
  // (null), only once the fetch has confirmed there's nothing to show — the
  // outer div carries the ref the scroll-reveal observer attaches to.
  if (properties && properties.length === 0) return null;

  const sqmLabel = isAr ? 'م²' : 'sqm';

  return (
    <section style={{ background: t.bg, direction: dir, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>

        {/* Header */}
        <div ref={ref} style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 16 : 40,
          alignItems: 'flex-end',
          marginBottom: isMobile ? 32 : 48,
        }}>
          <div style={rv(visible, 0)}>
            <p style={{
              color: t.gold, fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Wallet size={12} />
              {get('budget.title', isAr, isAr ? 'فرص ميسورة التكلفة' : 'Budget-Friendly Opportunities')}
            </p>
            <h2 style={{
              fontFamily: "'Marcellus', serif", color: t.txt,
              fontSize: isMobile ? 'clamp(1.5rem, 6vw, 2rem)' : 'clamp(1.8rem, 3.2vw, 2.6rem)',
              lineHeight: 1.25, margin: 0,
            }}>
              {isAr
                ? <>عقارات بأسعار تبدأ من دون <em>250 ألف دولار</em></>
                : <>Properties Starting Under <em>$250,000</em></>}
            </h2>
          </div>
          {!isMobile && (
            <div style={{ ...rv(visible, 0.18), textAlign: dir === 'rtl' ? 'right' : 'left' }}>
              <p style={{ color: t.txt3, fontSize: '0.9rem', lineHeight: 1.9, maxWidth: 360 }}>
                {isAr
                  ? 'اختيارات مدروسة لمن يبحث عن بداية استثمارية ذكية في تركيا، دون المساس بجودة الموقع أو التشطيب.'
                  : 'A curated selection for investors looking for a smart entry point into the Turkish market, without compromising on location or finish quality.'}
              </p>
            </div>
          )}
        </div>

        {/* Horizontal scroll strip */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            paddingBottom: 8,
            marginBottom: 28,
            scrollSnapType: 'x mandatory',
          }}
        >
          {(properties ?? []).map((p, i) => (
            <div
              key={p.id}
              onClick={() => router.push(`/properties/${p.slug}`)}
              style={{
                flex: `0 0 ${isMobile ? '78%' : '300px'}`,
                scrollSnapAlign: 'start',
                background: t.card,
                border: `1px solid ${t.border}`,
                borderRadius: 8,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease',
                ...rv(visible, 0.05 * (i % 8)),
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(-6px)';
                el.style.boxShadow = '0 28px 60px rgba(0,0,0,0.55)';
                const img = el.querySelector('img') as HTMLImageElement | null;
                if (img) img.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
                const img = el.querySelector('img') as HTMLImageElement | null;
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              <div style={{ position: 'relative', height: 190, overflow: 'hidden', background: '#111' }}>
                {p.photos[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.photos[0]}
                    alt={isAr ? p.titleAr : p.titleEn}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.65s cubic-bezier(0.22,1,0.36,1)' }}
                  />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)' }} />
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  background: 'rgba(9,9,9,0.65)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3,
                  padding: '3px 9px', color: '#fff',
                  fontSize: '0.56rem', fontWeight: 500, letterSpacing: '0.06em',
                }}>
                  {isAr ? p.locationAr : p.locationEn}
                </div>
              </div>
              <div style={{ padding: '16px 16px 14px' }}>
                <div style={{ fontSize: '0.56rem', color: t.gold, letterSpacing: '0.1em', marginBottom: 6, textTransform: 'uppercase' }}>
                  {isAr ? p.typeAr : p.typeEn}
                </div>
                <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '0.92rem', margin: '0 0 12px', lineHeight: 1.35, minHeight: '2.4em' }}>
                  {isAr ? p.titleAr : p.titleEn}
                </h3>
                <div style={{ width: '100%', height: 1, background: t.border, marginBottom: 12 }} />
                <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
                  {p.rooms !== '—' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <BedDouble size={11} color={t.txt4} strokeWidth={1.5} />
                      <span style={{ color: t.txt3, fontSize: '0.66rem' }}>{p.rooms}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Maximize2 size={11} color={t.txt4} strokeWidth={1.5} />
                    <span style={{ color: t.txt3, fontSize: '0.66rem' }}>{p.area}{sqmLabel}</span>
                  </div>
                </div>
                <div style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '1rem' }}>
                  {formatPrice(parseUSD(p.price))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/properties" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'transparent', border: `1px solid ${t.border2}`,
            borderRadius: 4, color: t.txt2, fontSize: '0.75rem',
            padding: '11px 22px', cursor: 'pointer', textDecoration: 'none',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            transition: 'border-color 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = t.gold; el.style.color = t.gold; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = t.border2; el.style.color = t.txt2; }}
          >
            {tr('cta.viewAll')} <ArrowLeft size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}
