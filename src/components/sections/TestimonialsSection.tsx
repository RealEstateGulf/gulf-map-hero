'use client';

import { useTheme } from '@/context/ThemeContext';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';

const TESTIMONIALS = [
  {
    name: 'محمد العمري',
    roleAr: 'مستثمر — المملكة العربية السعودية', roleEn: 'Investor — Saudi Arabia',
    quoteAr: 'تجربة استثنائية من البداية للنهاية. الفريق احترافي وصادق، واستلمت الشقة في الموعد المحدد دون أي تعقيدات.',
    quoteEn: 'An exceptional experience from start to finish. The team is professional and honest, and I received the apartment on time without any complications.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'فاطمة الكندي',
    roleAr: 'مستثمرة — الإمارات العربية', roleEn: 'Investor — UAE',
    quoteAr: 'أنجزوا كل شيء وأنا في دبي دون أي تعقيدات. الشفافية والاحترافية جعلتني أنصح بهم لكل من أعرفه.',
    quoteEn: 'They handled everything while I was in Dubai without any complications. The transparency and professionalism made me recommend them to everyone I know.',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'أحمد الرشيدي',
    roleAr: 'مستثمر — الكويت', roleEn: 'Investor — Kuwait',
    quoteAr: 'حصلت على الجنسية التركية في أقل من 5 أشهر. ثقتي بهم كاملة وسأعاود الاستثمار معهم مرة أخرى.',
    quoteEn: 'I obtained Turkish citizenship in less than 5 months. My trust in them is complete and I will invest with them again.',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
];

export default function TestimonialsSection() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { ref, visible } = useScrollReveal();
  const { dir, isAr } = useLanguage();

  return (
    <section style={{ background: t.altBg, direction: dir, padding: isMobile ? '60px 0' : '100px 0', borderTop: '1px solid rgba(217,186,160,0.1)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>

        <div ref={ref} style={{ marginBottom: isMobile ? 36 : 64 }}>
          <p style={{
            ...rv(visible, 0),
            color: t.gold, fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: t.gold }} />
            {isAr ? 'قصص المستثمرين' : 'Investor Stories'}
          </p>
          <h2 style={{
            ...rv(visible, 0.1),
            fontFamily: "'Marcellus', serif", color: t.txt,
            fontSize: isMobile ? 'clamp(1.6rem, 6vw, 2.4rem)' : 'clamp(2rem, 3.5vw, 3rem)',
            lineHeight: 1.25, maxWidth: 500,
          }}>
            {isAr
              ? <>ما يقوله مستثمرونا<br /><em>عن تجربتهم معنا</em></>
              : <>What Our Investors Say<br /><em>About Their Experience with Us</em></>}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 16 : 20 }}>
          {TESTIMONIALS.map(({ name, roleAr, roleEn, quoteAr, quoteEn, photo }, i) => (
            <div
              key={i}
              style={{
                ...rv(visible, 0.08 + i * 0.12),
                background: t.bg, border: `1px solid ${t.border}`,
                borderRadius: 8, padding: isMobile ? '28px 22px' : '36px 30px',
                transition: 'border-color 0.3s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
                cursor: 'default',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.gold3; el.style.transform = 'translateY(-6px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.border; el.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', gap: 2, marginBottom: 22 }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} style={{ color: t.gold, fontSize: '0.85rem' }}>★</span>
                ))}
              </div>
              <p style={{
                fontFamily: "'Marcellus', serif", color: t.txt2,
                fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.85, marginBottom: 28,
              }}>
                &ldquo;{isAr ? quoteAr : quoteEn}&rdquo;
              </p>
              <div style={{ width: 32, height: 1, background: t.gold3, marginBottom: 20 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `1px solid ${t.gold3}` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ color: t.txt, fontWeight: 600, fontSize: '0.88rem' }}>{name}</div>
                  <div style={{ color: t.gold, fontSize: '0.7rem', marginTop: 3, letterSpacing: '0.04em' }}>{isAr ? roleAr : roleEn}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
