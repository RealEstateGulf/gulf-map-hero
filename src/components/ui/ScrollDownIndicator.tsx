'use client';

import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';

export default function ScrollDownIndicator() {
  const isMobile = useIsMobile();
  const { isAr } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const show = visible && !scrolled && !isMobile;

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        left: 28,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.7s ease',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      {/* Top short horizontal line */}
      <div style={{ width: 1, height: 40, background: 'rgba(217,186,160,0.2)' }} />

      {/* Rotated label */}
      <div
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          color: 'rgba(217,186,160,0.55)',
          fontSize: '0.58rem',
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          transition: 'color 0.25s',
          userSelect: 'none',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.color = '#D9BAA0'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.color = 'rgba(217,186,160,0.55)'; }}
      >
        {isAr ? 'اكتشف المزيد' : 'Discover More'}
      </div>

      {/* Animated scroll line with travelling dot */}
      <div style={{ position: 'relative', width: 1, height: 64, overflow: 'hidden' }}>
        {/* Track */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: '100%', background: 'rgba(217,186,160,0.15)' }} />
        {/* Travelling fill */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1,
            background: '#D9BAA0',
            animation: 'scrollLine 2s cubic-bezier(0.4,0,0.6,1) infinite',
          }}
        />
      </div>

      {/* Arrow chevron */}
      <svg width="10" height="14" viewBox="0 0 10 14" fill="none" style={{ opacity: 0.5, animation: 'chevronBounce 2s ease-in-out infinite' }}>
        <path d="M1 1L5 7L9 1" stroke="#D9BAA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1 7L5 13L9 7" stroke="#D9BAA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
      </svg>
    </div>
  );
}
