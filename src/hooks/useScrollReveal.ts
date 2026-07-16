'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

export function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export function rv(visible: boolean, delay = 0, dir: 'up' | 'left' | 'right' = 'up'): CSSProperties {
  const translate =
    dir === 'left' ? 'translateX(-40px)' :
    dir === 'right' ? 'translateX(40px)' :
    'translateY(44px)';
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : translate,
    transition: `opacity 0.85s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.85s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    willChange: 'opacity, transform',
  };
}
