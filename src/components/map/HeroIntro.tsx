'use client';

import { ArrowLeft, ArrowRight, Phone, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';
import { useContent } from '@/hooks/useContent';

interface Props {
  visible: boolean;
  onExplore: () => void;
}

export default function HeroIntro({ visible, onExplore }: Props) {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();
  const { get } = useContent('home');

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  /* ── Mobile: compact glass card at bottom ── */
  if (isMobile) {
    return (
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 12,
          right: 12,
          zIndex: 20,
          background: 'rgba(9,9,9,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 18,
          border: `1px solid ${t.gold4}`,
          overflow: 'hidden',
          direction: dir,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.55s ease, transform 0.55s ease',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        {/* Card body */}
        <div style={{ padding: '18px 20px 14px' }}>
          {/* Label */}
          <div style={{
            color: t.gold, fontSize: '0.58rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 7,
          }}>
            {isAr ? 'فرص استثمارية حصرية' : 'Exclusive Investment Opportunities'}
          </div>

          {/* Title */}
          <h1 style={{
            color: '#fff', fontSize: '1.2rem', fontWeight: 800,
            lineHeight: 1.35, margin: '0 0 14px',
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
          }}>
            {get('hero.title1', isAr, isAr ? 'استثمر في' : 'Invest in')}
            {' '}
            <span style={{ color: t.gold }}>{get('hero.title2', isAr, isAr ? 'عقارات تركيا' : 'Turkish Real Estate')}</span>
          </h1>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onExplore}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 7, background: t.gold, border: 'none', borderRadius: 10,
                color: t.goldText, fontSize: '0.8rem', fontWeight: 700,
                padding: '11px 16px', cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
            >
              <ArrowIcon size={14} />
              {isAr ? 'استكشف الفرص' : 'Explore Opportunities'}
            </button>
            <button
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, background: 'rgba(255,255,255,0.07)',
                border: `1px solid ${t.gold3}`, borderRadius: 10,
                color: '#fff', fontSize: '0.8rem', fontWeight: 600,
                padding: '11px 16px', cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <Phone size={13} />
              {isAr ? 'تواصل' : 'Contact'}
            </button>
          </div>
        </div>

        {/* Scroll hint strip */}
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '9px 0',
            background: 'rgba(217,186,160,0.06)',
            borderTop: `1px solid ${t.gold4}`,
            border: 'none',
            cursor: 'pointer',
            direction: dir,
          }}
        >
          <span style={{
            color: 'rgba(217,186,160,0.55)',
            fontSize: '0.62rem',
            fontWeight: 500,
            letterSpacing: '0.12em',
          }}>
            {isAr ? 'اكتشف المزيد' : 'Discover More'}
          </span>
          <ChevronDown
            size={13}
            color="rgba(217,186,160,0.6)"
            style={{ animation: 'chevronBounce 1.8s ease-in-out infinite' }}
          />
        </button>
      </div>
    );
  }

  /* ── Desktop: panel on right for AR, left for EN ── */
  return (
    <div
      style={{
        position: 'absolute',
        top: 64,
        bottom: 80,
        right: 0,
        left: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isAr ? 'flex-end' : 'flex-start',
        direction: 'ltr',
        pointerEvents: 'none',
        background: isAr
          ? 'linear-gradient(to left, rgba(5,8,20,0.6) 0%, rgba(5,8,20,0.2) 55%, transparent 100%)'
          : 'linear-gradient(to right, rgba(5,8,20,0.6) 0%, rgba(5,8,20,0.2) 55%, transparent 100%)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
    >
      <div
        style={{
          width: 'min(460px, 44vw)',
          padding: isAr ? '0 56px 0 80px' : '0 80px 0 56px',
          direction: dir,
          textAlign: isAr ? 'right' : 'left',
          pointerEvents: visible ? 'auto' : 'none',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : isAr ? 'translateX(28px)' : 'translateX(-28px)',
          transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
        }}
      >
        <div style={{ color: t.gold, fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.18em', marginBottom: 14 }}>
          {isAr ? 'فرص استثمارية حصرية' : 'Exclusive Investment Opportunities'}
        </div>
        <h1 style={{
          color: '#fff', fontSize: 'clamp(1.7rem, 3vw, 2.6rem)',
          fontWeight: 800, lineHeight: 1.35, margin: 0, marginBottom: 18,
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}>
          {get('hero.title1', isAr, isAr ? 'استثمر في' : 'Invest in')}
          {' '}
          <span style={{ color: t.gold }}>{get('hero.title2', isAr, isAr ? 'عقارات تركيا' : 'Turkish Real Estate')}</span>
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem',
          lineHeight: 1.9, margin: 0, marginBottom: 30,
          maxWidth: 400,
        }}>
          {get('hero.sub', isAr,
            isAr
              ? 'اكتشف أفضل الفرص العقارية في أرقى مدن تركيا، من الشقق الفاخرة إلى الأراضي الاستثمارية، مع فريق متخصص يرافقك خطوة بخطوة نحو الجنسية التركية والاستثمار الآمن.'
              : 'Discover the best real estate opportunities in Turkey\'s most prestigious cities, from luxury apartments to investment land, with a specialized team guiding you step by step toward Turkish citizenship and secure investment.'
          )}
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: isAr ? 'flex-end' : 'flex-start', flexWrap: 'wrap' }}>
          <button
            onClick={onExplore}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: t.gold, border: 'none', borderRadius: 10,
              color: t.goldText, fontSize: '0.85rem', fontWeight: 700,
              padding: '12px 22px', cursor: 'pointer',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <ArrowIcon size={16} />{isAr ? 'استكشف الفرص الاستثمارية' : 'Explore Investment Opportunities'}
          </button>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.05)', border: `1px solid ${t.gold3}`,
              borderRadius: 10, color: '#fff', fontSize: '0.85rem', fontWeight: 600,
              padding: '12px 22px', cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; e.currentTarget.style.borderColor = t.gold2; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = t.gold3; }}
          >
            <Phone size={16} />{isAr ? 'تواصل معنا' : 'Contact Us'}
          </button>
        </div>
      </div>
    </div>
  );
}
