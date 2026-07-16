'use client';

import { useTheme } from '@/context/ThemeContext';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';

const FEATURES_AR = [
  'خبرة ميدانية تتجاوز 6 سنوات في سوق العقارات التركي',
  'شفافية كاملة في كل خطوة — لا رسوم مخفية',
  'دعم قانوني وترجمة متخصصة طوال مراحل الاستثمار',
  'شبكة علاقات مباشرة مع كبار المطورين والمطورين العقاريين في تركيا',
];

const FEATURES_EN = [
  'Over 6 years of field expertise in the Turkish real estate market',
  'Full transparency at every step — no hidden fees',
  'Legal support and specialized translation throughout the investment stages',
  'Direct relationships with Turkey\'s top developers and real estate builders',
];

const BIG_PHOTO = 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80';

export default function WhyUsSection() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { ref, visible } = useScrollReveal();
  const { dir, isAr } = useLanguage();

  return (
    <section style={{ background: t.altBg, direction: dir, borderTop: '1px solid rgba(217,186,160,0.1)' }}>
      <div
        ref={ref}
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: isMobile ? '60px 18px' : '100px 32px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 40 : 80,
          alignItems: 'center',
        }}
      >
        {/* Text */}
        <div style={rv(visible, 0, 'left')}>
          <p style={{
            color: t.gold, fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: t.gold }} />
            {isAr ? 'لماذا تختارنا' : 'Why Choose Us'}
          </p>
          <h2 style={{
            fontFamily: "'Marcellus', serif", color: t.txt,
            fontSize: isMobile ? 'clamp(1.6rem, 6vw, 2.4rem)' : 'clamp(1.9rem, 3vw, 2.8rem)',
            lineHeight: 1.3, marginBottom: 12,
          }}>
            {isAr
              ? <>خبرة ميدانية،<br />نتائج موثّقة</>
              : <>Field Expertise,<br />Documented Results</>}
          </h2>

          <div style={{ marginBottom: 36, paddingBottom: 36, borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '2.8rem', lineHeight: 1 }}>+130</div>
            <div style={{ color: t.txt4, fontSize: '0.78rem', marginTop: 6, letterSpacing: '0.08em' }}>
              {isAr ? 'مستثمر عربي انضم إلينا' : 'Arab investors who joined us'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {(isAr ? FEATURES_AR : FEATURES_EN).map((feat, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 0', borderBottom: `1px solid ${t.border}`,
                  transition: `padding-${dir === 'rtl' ? 'right' : 'left'} 0.25s`, cursor: 'default',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style[dir === 'rtl' ? 'paddingRight' : 'paddingLeft'] = '8px'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style[dir === 'rtl' ? 'paddingRight' : 'paddingLeft'] = '0'; }}
              >
                <span style={{ color: t.gold, fontSize: '0.85rem', flexShrink: 0 }}>{dir === 'rtl' ? '←' : '→'}</span>
                <span style={{ color: t.txt2, fontSize: '0.85rem', lineHeight: 1.55 }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div style={{ ...rv(visible, 0.2, 'right'), height: isMobile ? 300 : 560, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BIG_PHOTO} alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
          />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 3, height: '40%', background: `linear-gradient(to top, ${t.gold}, transparent)` }} />
        </div>
      </div>
    </section>
  );
}
