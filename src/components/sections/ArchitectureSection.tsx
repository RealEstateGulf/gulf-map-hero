'use client';

import { TrendingUp, Shield, Clock, Users, BarChart2, Award } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';

const ICONS = [
  { Icon: TrendingUp,  labelAr: 'عوائد مرتفعة',        labelEn: 'High Returns' },
  { Icon: Shield,      labelAr: 'استثمار آمن',           labelEn: 'Secure Investment' },
  { Icon: Clock,       labelAr: 'متابعة كاملة',          labelEn: 'Full Follow-up' },
  { Icon: Users,       labelAr: 'خبراء ميدانيون',        labelEn: 'On-ground Experts' },
  { Icon: BarChart2,   labelAr: 'تحليل السوق',           labelEn: 'Market Analysis' },
  { Icon: Award,       labelAr: 'خدمة متميزة',           labelEn: 'Premium Service' },
];

export default function ArchitectureSection() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { ref, visible } = useScrollReveal();
  const { dir, isAr } = useLanguage();

  return (
    <section style={{ background: t.bg, direction: dir, borderTop: '1px solid rgba(217,186,160,0.1)' }}>
      <div
        ref={ref}
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: isMobile ? '60px 18px 40px' : '100px 32px 80px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 28 : 80,
          alignItems: 'flex-start',
        }}
      >
        {/* Label + giant number */}
        <div style={rv(visible, 0, 'left')}>
          <p style={{
            color: t.gold, fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: t.gold }} />
            {isAr ? 'نسبة رضا المستثمرين' : 'Investor Satisfaction Rate'}
          </p>

          <div style={{
            fontFamily: "'Marcellus', serif",
            color: t.gold,
            fontSize: isMobile ? 'clamp(5rem, 22vw, 8rem)' : 'clamp(6rem, 14vw, 11rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
          }}>
            98%
          </div>
        </div>

        {/* Paragraph + italic sub */}
        <div style={{ ...rv(visible, 0.2), paddingTop: isMobile ? 0 : 20 }}>
          <p style={{ color: t.txt2, fontSize: isMobile ? '0.9rem' : '1rem', lineHeight: 2, marginBottom: 28, maxWidth: 480 }}>
            {isAr
              ? 'أكثر من 130 مستثمراً خليجياً وثقوا بنا لاتخاذ قراراتهم العقارية في تركيا. نسبة رضا 98% ليست رقماً — بل نتيجة سنوات من العمل الميداني والشفافية الكاملة.'
              : 'More than 130 Gulf investors trusted us to make their real estate decisions in Turkey. A 98% satisfaction rate is not just a number — it is the result of years of on-the-ground work and full transparency.'}
          </p>
          <p style={{
            fontFamily: "'Marcellus', serif",
            color: t.txt3, fontSize: '1.1rem',
            fontStyle: 'italic', lineHeight: 1.6,
          }}>
            {isAr
              ? 'استثمارك الناجح في تركيا يبدأ بالشريك الصحيح.'
              : 'Your successful investment in Turkey starts with the right partner.'}
          </p>
        </div>
      </div>

      {/* Bottom: icons grid */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: isMobile ? '0 18px 60px' : '0 32px 100px',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(3,1fr)' : 'repeat(6,1fr)',
        gap: 0,
        borderTop: `1px solid ${t.border}`,
      }}>
        {ICONS.map(({ Icon, labelAr, labelEn }, i) => (
          <div
            key={i}
            style={{
              ...rv(visible, 0.1 + i * 0.07),
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: isMobile ? 8 : 12,
              padding: isMobile ? '24px 8px' : '36px 16px',
              borderLeft: i % (isMobile ? 3 : 6) !== 0 ? `1px solid ${t.border}` : 'none',
              borderTop: isMobile && i >= 3 ? `1px solid ${t.border}` : 'none',
              transition: 'background 0.25s',
              cursor: 'default',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = t.gold6; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
          >
            <Icon size={isMobile ? 20 : 26} color={t.gold} strokeWidth={1.2} />
            <span style={{ color: t.txt4, fontSize: '0.65rem', letterSpacing: '0.06em', textAlign: 'center' }}>
              {isAr ? labelAr : labelEn}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
