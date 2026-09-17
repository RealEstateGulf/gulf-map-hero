'use client';

import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import Navbar from '@/components/map/Navbar';
import FooterSection from '@/components/sections/FooterSection';
import ROICalculator from '@/components/ROICalculator';

export default function CalculatorClient() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();
  const tr = useT();

  return (
    <main style={{ background: t.bg, direction: dir, minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ background: '#060606', borderBottom: `1px solid ${t.gold4}`, padding: isMobile ? '110px 20px 52px' : '130px 32px 70px', textAlign: 'center' }}>
        <p style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <span style={{ width: 28, height: 1, background: t.gold, display: 'inline-block' }} />
          {tr('calc.hero.badge')}
          <span style={{ width: 28, height: 1, background: t.gold, display: 'inline-block' }} />
        </p>
        <h1 style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: isMobile ? 'clamp(1.8rem,7vw,2.8rem)' : 'clamp(2.4rem,4vw,3.4rem)', lineHeight: 1.2, marginBottom: 14 }}>
          {tr('calc.title')}<br /><em style={{ color: t.gold }}>{isAr ? 'قبل أن تتخذ قرارك' : 'Before You Decide'}</em>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.85, maxWidth: 480, margin: '0 auto' }}>
          {tr('calc.subtitle')}
        </p>
      </div>

      {/* Main calculator */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '36px 18px 60px' : '60px 32px 100px' }}>
        <ROICalculator />
      </div>

      <FooterSection />
    </main>
  );
}
