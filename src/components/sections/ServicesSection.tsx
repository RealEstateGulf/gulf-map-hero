'use client';

import { Search, Handshake, Key } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import { useContent } from '@/hooks/useContent';

const SERVICES = [
  {
    Icon: Search,
    titleAr: 'البحث عن العقار المثالي',
    titleEn: 'Finding the Perfect Property',
    descAr: 'نُعينك على اكتشاف العقارات التي تلائم أسلوب حياتك وطموحاتك، من خلال منهجية بحث دقيقة ومعرفة عميقة بالسوق التركي.',
    descEn: 'We help you discover properties that suit your lifestyle and ambitions, through a precise research methodology and deep knowledge of the Turkish market.',
    num: '01',
  },
  {
    Icon: Handshake,
    titleAr: 'التفاوض وإتمام الصفقات',
    titleEn: 'Negotiation & Deal Closing',
    descAr: 'خبراؤنا يتولّون كل مراحل التفاوض نيابةً عنك، لضمان أفضل شروط الصفقة وأحسن سعر ممكن في السوق.',
    descEn: 'Our experts handle all negotiation stages on your behalf, to ensure the best deal terms and the best possible price in the market.',
    num: '02',
  },
  {
    Icon: Key,
    titleAr: 'إدارة الأملاك والاستثمار',
    titleEn: 'Property & Investment Management',
    descAr: 'نرعى استثمارك طوال الوقت — من الصيانة وإدارة الإيجار حتى الخدمات اليومية — لتنمو ثروتك بلا عناء.',
    descEn: 'We look after your investment at all times — from maintenance and rental management to daily services — so your wealth grows effortlessly.',
    num: '03',
  },
];

export default function ServicesSection() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { ref, visible } = useScrollReveal();
  const { dir, isAr } = useLanguage();
  const tr = useT();
  const { get } = useContent('home');

  return (
    <section style={{ background: t.bg, direction: dir, padding: isMobile ? '60px 0' : '100px 0', borderTop: '1px solid rgba(217,186,160,0.1)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>

        <div ref={ref} style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 72 }}>
          <p style={{
            ...rv(visible, 0),
            color: t.gold, fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 18,
          }}>
            {isAr ? 'ما الذي نقدّمه' : 'What We Offer'}
          </p>
          <h2 style={{
            ...rv(visible, 0.12),
            fontFamily: "'Marcellus', serif", color: t.txt,
            fontSize: isMobile ? 'clamp(1.6rem, 6vw, 2.4rem)' : 'clamp(2rem, 3.5vw, 3rem)',
            lineHeight: 1.25, maxWidth: 640, margin: '0 auto 16px',
          }}>
            {get('services.title', isAr, isAr ? 'خدماتنا' : 'Our Services')}
          </h2>
          <p style={{ ...rv(visible, 0.22), color: t.txt3, fontSize: '0.88rem', lineHeight: 1.85, maxWidth: 480, margin: '0 auto' }}>
            {isAr
              ? 'نقدّم خدمات متكاملة تشمل كل جوانب تجربتك العقارية، بأعلى معايير الاحترافية.'
              : 'We provide comprehensive services covering every aspect of your real estate experience, to the highest standards of professionalism.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 16 : 20 }}>
          {SERVICES.map(({ Icon, titleAr, titleEn, descAr, descEn, num }, i) => (
            <div
              key={i}
              style={{
                ...rv(visible, 0.1 + i * 0.12),
                background: t.altBg, border: `1px solid ${t.border}`,
                borderRadius: 8, padding: isMobile ? '32px 24px' : '44px 36px',
                position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.3s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
                cursor: 'default',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.gold3; el.style.transform = 'translateY(-6px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.border; el.style.transform = 'translateY(0)'; }}
            >
              <div style={{ position: 'absolute', top: 12, left: 22, fontFamily: "'Marcellus', serif", fontSize: '4rem', color: t.gold6, lineHeight: 1 }}>
                {num}
              </div>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: t.gold5, border: `1px solid ${t.gold4}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
                <Icon size={22} color={t.gold} strokeWidth={1.4} />
              </div>
              <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '1.15rem', marginBottom: 14, lineHeight: 1.4 }}>
                {isAr ? titleAr : titleEn}
              </h3>
              <p style={{ color: t.txt3, fontSize: '0.85rem', lineHeight: 1.9, margin: '0 0 24px' }}>
                {isAr ? descAr : descEn}
              </p>
              <Link
                href="/services"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', color: t.gold,
                  fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: 'pointer', padding: 0, transition: 'gap 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '12px'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '6px'; }}
              >
                {tr('cta.learnMore')} <span style={{ fontSize: '0.9rem' }}>←</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
