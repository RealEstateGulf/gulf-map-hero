'use client';

import { X, Calculator } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';
import ROICalculator from './ROICalculator';

interface Props {
  initialPrice?: number;
  initialMonthlyRent?: number;
  onClose: () => void;
}

export default function ROICalculatorModal({ initialPrice, initialMonthlyRent, onClose }: Props) {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: t.overlay,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'backdropFadeIn 0.25s ease',
        padding: isMobile ? 0 : 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: isMobile ? '100%' : 'min(1400px, 96vw)',
          height: isMobile ? '100%' : 'min(90vh, 900px)',
          background: t.modal,
          border: isMobile ? 'none' : `1px solid ${t.gold4}`,
          borderRadius: isMobile ? 0 : 20,
          boxShadow: t.shadowModal,
          direction: dir,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalFadeScale 0.3s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: isMobile ? '16px 18px' : '20px 28px',
            borderBottom: `1px solid ${t.border}`,
            flexShrink: 0,
            background: t.modal,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calculator size={18} color={t.gold} strokeWidth={1.6} />
            <h2 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? '1rem' : '1.15rem', margin: 0 }}>
              {isAr ? 'حاسبة العائد على الاستثمار' : 'ROI Calculator'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: t.btn, border: `1px solid ${t.btnBorder}`, borderRadius: 8,
              padding: 7, cursor: 'pointer', display: 'flex', color: t.txt3,
              flexShrink: 0, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = t.txt; }}
            onMouseLeave={e => { e.currentTarget.style.color = t.txt3; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '20px 16px 32px' : '32px 36px 44px' }}>
          <ROICalculator
            initialPrice={initialPrice}
            initialMonthlyRent={initialMonthlyRent}
            hideCta
            locked
          />
        </div>
      </div>
    </div>
  );
}
