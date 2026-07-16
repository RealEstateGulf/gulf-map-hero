'use client';

import { BedDouble, Bath, Maximize2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import { useContent } from '@/hooks/useContent';

const PROPERTIES = [
  {
    locationAr: 'بورصة، تركيا', locationEn: 'Bursa, Turkey',
    title: 'فيلا آريس', titleEn: 'Villa Aries',
    beds: 4, baths: 4, sqm: 320,
    price: '$1,250,000',
    tagAr: 'مميز', tagEn: 'Featured',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80',
  },
  {
    locationAr: 'إسطنبول، تركيا', locationEn: 'Istanbul, Turkey',
    title: 'ميزون نورفين', titleEn: 'Maison Norvin',
    beds: 3, baths: 3, sqm: 180,
    price: '$620,000',
    tagAr: null, tagEn: null,
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  },
  {
    locationAr: 'يالوفا، تركيا', locationEn: 'Yalova, Turkey',
    title: 'فيلا ليونورا', titleEn: 'Villa Leonora',
    beds: 6, baths: 5, sqm: 520,
    price: '$1,850,000',
    tagAr: 'فريد', tagEn: 'Unique',
    img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
  },
  {
    locationAr: 'بورصة، تركيا', locationEn: 'Bursa, Turkey',
    title: 'بنتهاوس أوريون', titleEn: 'Penthouse Orion',
    beds: 4, baths: 3, sqm: 240,
    price: '$980,000',
    tagAr: null, tagEn: null,
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  },
];

export default function FeaturedSection() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { ref, visible } = useScrollReveal();
  const router = useRouter();
  const { dir, isAr } = useLanguage();
  const tr = useT();
  const { get } = useContent('home');

  const cardBase = {
    background: t.bg,
    border: `1px solid ${t.border}`,
    borderRadius: 8,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease',
  };

  const hoverIn = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    el.style.transform = 'translateY(-8px)';
    el.style.boxShadow = '0 32px 64px rgba(0,0,0,0.65)';
    const img = el.querySelector('img') as HTMLImageElement | null;
    if (img) img.style.transform = 'scale(1.06)';
  };
  const hoverOut = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    el.style.transform = 'translateY(0)';
    el.style.boxShadow = 'none';
    const img = el.querySelector('img') as HTMLImageElement | null;
    if (img) img.style.transform = 'scale(1)';
  };

  const LocationBadge = ({ location }: { location: string }) => (
    <div style={{
      position: 'absolute', top: 12, right: 12,
      background: 'rgba(9,9,9,0.65)', backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3,
      padding: '4px 10px', color: '#fff',
      fontSize: '0.58rem', fontWeight: 500, letterSpacing: '0.06em',
    }}>
      {location}
    </div>
  );

  const TagBadge = ({ tag }: { tag: string }) => (
    <div style={{
      position: 'absolute', top: 12, left: 12,
      background: t.gold, borderRadius: 3,
      padding: '3px 9px', color: t.goldText,
      fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>
      {tag}
    </div>
  );

  const sqmLabel = isAr ? 'م²' : 'sqm';

  const Specs = ({ beds, baths, sqm }: { beds: number; baths: number; sqm: number }) => (
    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
      {[{ Icon: BedDouble, val: beds }, { Icon: Bath, val: baths }, { Icon: Maximize2, val: `${sqm}${sqmLabel}` }].map(({ Icon, val }, j) => (
        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Icon size={12} color={t.txt4} strokeWidth={1.5} />
          <span style={{ color: t.txt3, fontSize: '0.7rem' }}>{val}</span>
        </div>
      ))}
    </div>
  );

  const PriceRow = ({ price }: { price: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '1rem' }}>{price}</div>
      <Link
        href="/contact"
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: t.gold, border: 'none', borderRadius: 4,
          color: t.goldText, fontSize: '0.62rem', fontWeight: 700,
          padding: '7px 13px', cursor: 'pointer',
          letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'opacity 0.2s',
          textDecoration: 'none',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.82'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
      >
        {tr('cta.bookViewing')} <ArrowLeft size={10} />
      </Link>
    </div>
  );

  return (
    <section style={{ background: t.altBg, direction: dir, padding: isMobile ? '60px 0' : '100px 0', borderTop: '1px solid rgba(217,186,160,0.1)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>

        {/* Header */}
        <div ref={ref} style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 16 : 40,
          alignItems: 'flex-end',
          marginBottom: isMobile ? 36 : 56,
        }}>
          <div style={rv(visible, 0)}>
            <p style={{
              color: t.gold, fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ display: 'inline-block', width: 24, height: 1, background: t.gold }} />
              {get('featured.title', isAr, isAr ? 'العقارات المميزة' : 'Featured Properties')}
            </p>
            <h2 style={{
              fontFamily: "'Marcellus', serif", color: t.txt,
              fontSize: isMobile ? 'clamp(1.6rem, 6vw, 2.2rem)' : 'clamp(2rem, 3.5vw, 3rem)',
              lineHeight: 1.2, margin: 0,
            }}>
              {isAr
                ? <>فرص استثمارية مختارة،<br /><em>عوائد موثّقة</em> في كل مشروع</>
                : <>Curated Investment Opportunities,<br /><em>Documented Returns</em> in Every Project</>}
            </h2>
          </div>
          {!isMobile && (
            <div style={{ ...rv(visible, 0.18), textAlign: dir === 'rtl' ? 'right' : 'left' }}>
              <p style={{ color: t.txt3, fontSize: '0.9rem', lineHeight: 1.9, maxWidth: 360 }}>
                {isAr
                  ? 'محفظتنا مبنية على تحليل دقيق للسوق التركي — شقق وفلل ومشاريع تجارية في أعلى المناطق الاستثمارية نمواً.'
                  : 'Our portfolio is built on rigorous analysis of the Turkish market — apartments, villas and commercial projects in the highest-growth investment areas.'}
              </p>
            </div>
          )}
        </div>

        {/* Row 1: large vertical cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 18, marginBottom: 18 }}>
          {PROPERTIES.slice(0, 2).map((p, i) => (
            <div key={i} style={{ ...cardBase, ...rv(visible, 0.1 + i * 0.12) }} onMouseEnter={hoverIn} onMouseLeave={hoverOut} onClick={() => router.push('/properties')}>
              <div style={{ position: 'relative', overflow: 'hidden', height: isMobile ? 240 : 360 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={isAr ? p.title : p.titleEn} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)' }} />
                <LocationBadge location={isAr ? p.locationAr : p.locationEn} />
                {(isAr ? p.tagAr : p.tagEn) && <TagBadge tag={(isAr ? p.tagAr : p.tagEn)!} />}
              </div>
              <div style={{ padding: '22px 22px 20px' }}>
                <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '1.15rem', margin: '0 0 16px', lineHeight: 1.3 }}>
                  {isAr ? p.title : p.titleEn}
                </h3>
                <div style={{ width: '100%', height: 1, background: t.border, marginBottom: 16 }} />
                <Specs beds={p.beds} baths={p.baths} sqm={p.sqm} />
                <PriceRow price={p.price} />
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
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

        {/* Row 2: horizontal cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 18 }}>
          {PROPERTIES.slice(2).map((p, i) => (
            <div
              key={i + 2}
              style={{ ...cardBase, ...rv(visible, 0.28 + i * 0.12), display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
              onClick={() => router.push('/properties')}
            >
              <div style={{ position: 'relative', overflow: 'hidden', width: isMobile ? '100%' : '42%', height: isMobile ? 200 : 'auto', flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={isAr ? p.title : p.titleEn} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' }} />
                {(isAr ? p.tagAr : p.tagEn) && <TagBadge tag={(isAr ? p.tagAr : p.tagEn)!} />}
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div>
                  <div style={{ color: t.txt4, fontSize: '0.6rem', letterSpacing: '0.1em', marginBottom: 6 }}>{isAr ? p.locationAr : p.locationEn}</div>
                  <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '1rem', margin: '0 0 14px', lineHeight: 1.3 }}>{isAr ? p.title : p.titleEn}</h3>
                  <div style={{ width: '100%', height: 1, background: t.border, marginBottom: 14 }} />
                  <Specs beds={p.beds} baths={p.baths} sqm={p.sqm} />
                </div>
                <div style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '1.1rem', marginTop: 8 }}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
