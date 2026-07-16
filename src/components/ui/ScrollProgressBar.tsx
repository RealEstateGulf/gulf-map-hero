'use client';

import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/useResponsive';

const SECTIONS = [
  'الإحصائيات',
  'من نحن',
  'التميز',
  'العقارات',
  'الخدمات',
  'لماذا نحن',
  'انضم إلينا',
  'المستثمرون',
  'أسئلة',
  'تواصل',
];

export default function ScrollProgressBar() {
  const isMobile = useIsMobile();
  const [progress, setProgress] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? Math.min((scrollTop / docH) * 100, 100) : 0);
      setPastHero(scrollTop > window.innerHeight * 0.35);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const TRACK_HEIGHT = 280;
  const dotPos = (progress / 100) * TRACK_HEIGHT;

  const sectionCount = SECTIONS.length;

  if (isMobile) return null;

  return (
    <div
      style={{
        position: 'fixed',
        right: 22,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        opacity: pastHero ? 1 : 0,
        transition: 'opacity 0.6s ease',
        pointerEvents: pastHero ? 'auto' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Track container */}
      <div style={{ position: 'relative', width: 1, height: TRACK_HEIGHT }}>

        {/* Background track */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: '100%', background: 'rgba(255,255,255,0.07)' }} />

        {/* Filled portion */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1,
            height: `${progress}%`,
            background: 'linear-gradient(to bottom, #D9BAA0, rgba(217,186,160,0.5))',
            transition: 'height 0.1s linear',
          }}
        />

        {/* Section tick marks */}
        {SECTIONS.map((label, i) => {
          const pct = (i / (sectionCount - 1)) * 100;
          const y = (pct / 100) * TRACK_HEIGHT;
          const isFilled = progress >= pct;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: y,
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {/* Tick dot */}
              <div
                style={{
                  width: isFilled ? 5 : 3,
                  height: isFilled ? 5 : 3,
                  borderRadius: '50%',
                  background: isFilled ? '#D9BAA0' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  boxShadow: isFilled ? '0 0 6px rgba(217,186,160,0.5)' : 'none',
                }}
              />
              {/* Label on hover */}
              {hovered && (
                <span
                  style={{
                    position: 'absolute',
                    right: 12,
                    color: isFilled ? '#D9BAA0' : 'rgba(255,255,255,0.3)',
                    fontSize: '0.55rem',
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: '0.1em',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.25s',
                    direction: 'rtl',
                  }}
                >
                  {label}
                </span>
              )}
            </div>
          );
        })}

        {/* Moving glowing dot */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: dotPos,
            transform: 'translate(-50%, -50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#D9BAA0',
            boxShadow: '0 0 10px rgba(217,186,160,0.8), 0 0 24px rgba(217,186,160,0.35)',
            transition: 'top 0.1s linear',
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}
