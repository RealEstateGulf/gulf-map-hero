'use client';

import { useTheme } from '@/context/ThemeContext';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';

const REVIEW = {
  name: 'خالد المنصوري',
  roleAr: 'مدير تنفيذي — دبي، الإمارات',
  roleEn: 'Executive Director — Dubai, UAE',
  photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  quoteAr: 'من أول لقاء حتى استلام المفتاح، كان الفريق حاضراً في كل خطوة. الشفافية والاحترافية التي أبدوها جعلتني أوصي بهم لكل مستثمر خليجي يفكر في السوق التركي.',
  quoteEn: 'From the first meeting to receiving the key, the team was present at every step. The transparency and professionalism they demonstrated made me recommend them to every Gulf investor thinking about the Turkish market.',
};

export default function ReviewSection() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { ref, visible } = useScrollReveal();
  const { dir, isAr } = useLanguage();

  return (
    <section style={{ background: t.bg, direction: dir, padding: isMobile ? '60px 0' : '100px 0', borderTop: '1px solid rgba(217,186,160,0.1)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 36 : 72,
            alignItems: 'center',
          }}
        >
          {/* Heading */}
          <div style={rv(visible, 0, 'left')}>
            <p style={{
              color: t.gold, fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ display: 'inline-block', width: 24, height: 1, background: t.gold }} />
              {isAr ? 'آراء مستثمرينا' : 'Investor Testimonials'}
            </p>
            <h2 style={{
              fontFamily: "'Marcellus', serif", color: t.txt,
              fontSize: isMobile ? 'clamp(1.8rem, 7vw, 2.8rem)' : 'clamp(2.2rem, 4vw, 3.4rem)',
              fontStyle: 'italic', lineHeight: 1.3,
            }}>
              {isAr
                ? <>الاستثمار الناجح<br />يبدأ بالشريك<br /><span style={{ color: t.gold }}>الصحيح.</span></>
                : <>Successful Investment<br />Starts with the<br /><span style={{ color: t.gold }}>Right Partner.</span></>}
            </h2>
          </div>

          {/* Review card */}
          <div style={{
            ...rv(visible, 0.18, 'right'),
            background: t.altBg, border: `1px solid ${t.border}`,
            borderRadius: 8, padding: isMobile ? '32px 24px' : '44px 40px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 10, left: 24,
              fontFamily: "'Marcellus', serif", fontSize: '7rem',
              color: t.gold5, lineHeight: 1, fontStyle: 'italic', userSelect: 'none',
            }}>
              "
            </div>
            <div style={{ display: 'flex', gap: 3, marginBottom: 24 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: t.gold, fontSize: '1rem' }}>★</span>
              ))}
            </div>
            <p style={{
              fontFamily: "'Marcellus', serif", color: t.txt,
              fontSize: isMobile ? '0.9rem' : '1rem', fontStyle: 'italic',
              lineHeight: 1.9, marginBottom: 36,
            }}>
              &ldquo;{isAr ? REVIEW.quoteAr : REVIEW.quoteEn}&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 24, borderTop: `1px solid ${t.border}` }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${t.gold}`, flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={REVIEW.photo} alt={REVIEW.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ color: t.txt, fontWeight: 700, fontSize: '0.9rem' }}>{REVIEW.name}</div>
                <div style={{ color: t.gold, fontSize: '0.72rem', marginTop: 4, letterSpacing: '0.04em' }}>
                  {isAr ? REVIEW.roleAr : REVIEW.roleEn}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
