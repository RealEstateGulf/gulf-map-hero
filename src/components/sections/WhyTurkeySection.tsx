'use client';

import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';

const PHOTO = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80';

export default function WhyTurkeySection() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { ref, visible } = useScrollReveal();
  const { dir, isAr } = useLanguage();
  const tr = useT();

  return (
    <section style={{ background: t.altBg, direction: dir, borderTop: '1px solid rgba(217,186,160,0.1)' }}>
      <div
        ref={ref}
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: isMobile ? '60px 18px' : '0 32px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '340px 1fr',
          gap: isMobile ? 36 : 80,
          alignItems: 'center',
          minHeight: isMobile ? 'auto' : 580,
        }}
      >
        {/* Text col */}
        <div style={rv(visible, 0, 'left')}>
          <p style={{
            color: t.gold, fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: t.gold, verticalAlign: 'middle' }} />
            {isAr ? 'من نحن' : 'About Us'}
          </p>
          <p style={{ color: t.txt3, fontSize: '0.88rem', lineHeight: 1.9, marginBottom: 32, maxWidth: 280 }}>
            {isAr
              ? 'شغفنا يكمن في تحويل أحلام الملكية العقارية إلى حقيقة ملموسة، بخبرة ميدانية تمتد لأكثر من ست سنوات في السوق التركي.'
              : 'Our passion lies in turning real estate ownership dreams into tangible reality, with over six years of field experience in the Turkish market.'}
          </p>
          <Link
            href="/about"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'none', border: `1px solid ${t.border2}`,
              borderRadius: 4, color: t.txt2, fontSize: '0.75rem',
              fontWeight: 600, letterSpacing: '0.1em',
              padding: '10px 20px', cursor: 'pointer',
              textTransform: 'uppercase', transition: 'border-color 0.25s, color 0.25s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = t.gold; el.style.color = t.gold; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = t.border2; el.style.color = t.txt2; }}
          >
            {tr('cta.readMore')}
          </Link>
        </div>

        {/* Heading + photo col */}
        <div style={{ ...rv(visible, 0.18), padding: isMobile ? '0' : '80px 0' }}>
          <h2 style={{
            fontFamily: "'Marcellus', serif",
            color: t.txt,
            fontSize: isMobile ? 'clamp(1.6rem, 6vw, 2.4rem)' : 'clamp(2.2rem, 4vw, 3.4rem)',
            fontStyle: 'italic',
            lineHeight: 1.35,
            marginBottom: isMobile ? 28 : 52,
          }}>
            {isAr
              ? <>الاستثمار في تركيا<br />فرصة حقيقية يدركها<br />المستثمر الذكي اليوم.</>
              : <>Investing in Turkey<br />Is a Real Opportunity<br />the Smart Investor Seizes Today.</>}
          </h2>

          <div style={{ overflow: 'hidden', borderRadius: 4, height: isMobile ? 260 : 380 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOTO} alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
