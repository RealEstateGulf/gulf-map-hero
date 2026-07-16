'use client';

import { useEffect, useState, CSSProperties } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';

const STATS = [
  { value: 130, suffix: '+', labelAr: 'مستثمر عربي راضٍ', labelEn: 'Satisfied Arab Investors' },
  { value: 37, suffix: '+', labelAr: 'جائزة دولية', labelEn: 'International Awards' },
  { value: 98, suffix: '%', labelAr: 'رضا العملاء', labelEn: 'Client Satisfaction' },
];

function useCountUp(target: number, visible: boolean, duration = 1600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let startTime: number | null = null;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [visible, target, duration]);
  return count;
}

function StatItem({ value, suffix, labelAr, labelEn, delay, visible, isMobile, isAr }: {
  value: number; suffix: string; labelAr: string; labelEn: string;
  delay: number; visible: boolean; isMobile: boolean; isAr: boolean;
}) {
  const { t } = useTheme();
  const count = useCountUp(value, visible, 1800);
  const style: CSSProperties = {
    ...rv(visible, delay),
    padding: isMobile ? '44px 24px' : '72px 40px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  };

  return (
    <div style={style}>
      <div style={{
        fontFamily: "'Marcellus', serif",
        color: t.gold,
        fontSize: isMobile ? 'clamp(2.4rem, 10vw, 3.2rem)' : 'clamp(3rem, 5.5vw, 4.4rem)',
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}>
        {count}{suffix}
      </div>
      <div style={{ width: 24, height: 1, background: t.gold3 }} />
      <div style={{ color: t.txt3, fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}>
        {isAr ? labelAr : labelEn}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { ref, visible } = useScrollReveal(0.25);
  const { dir, isAr } = useLanguage();

  return (
    <section style={{
      background: t.altBg,
      direction: dir,
      borderTop: '1px solid rgba(217,186,160,0.1)',
      borderBottom: '1px solid rgba(217,186,160,0.1)',
    }}>
      <div
        ref={ref}
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
        }}
      >
        {STATS.map(({ value, suffix, labelAr, labelEn }, i) => (
          <div
            key={i}
            style={{
              borderLeft: !isMobile && i > 0 ? `1px solid ${t.border}` : 'none',
              borderTop: isMobile && i > 0 ? `1px solid ${t.border}` : 'none',
            }}
          >
            <StatItem value={value} suffix={suffix} labelAr={labelAr} labelEn={labelEn} delay={i * 0.15} visible={visible} isMobile={isMobile} isAr={isAr} />
          </div>
        ))}
      </div>
    </section>
  );
}
