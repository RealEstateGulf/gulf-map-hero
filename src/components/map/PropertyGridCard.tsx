'use client';

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { Property } from '@/data/properties';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  property: Property;
  gridRef: RefObject<HTMLDivElement | null>;
  isOtherExpanded: boolean;
  onExpandChange: (id: string | null) => void;
  onDetail: (property: Property) => void;
}

const HOVER_DELAY = 550;
const TRANSITION = 'all 0.45s cubic-bezier(0.22, 1, 0.36, 1)';

type Phase = 'idle' | 'expanding' | 'expanded' | 'collapsing';

export default function PropertyGridCard({ property, gridRef, isOtherExpanded, onExpandChange, onDetail }: Props) {
  const { t } = useTheme();
  const { isAr } = useLanguage();
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef<Phase>('idle');
  const cycleRef = useRef(0);
  const mouseMoveHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayStyle, setOverlayStyle] = useState<CSSProperties | null>(null);

  useEffect(() => {
    if (property.photos.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex(i => (i + 1) % property.photos.length);
    }, 3200);
    return () => clearInterval(id);
  }, [property.photos.length]);

  const stopWatchingMouse = () => {
    if (mouseMoveHandlerRef.current) {
      window.removeEventListener('mousemove', mouseMoveHandlerRef.current);
      mouseMoveHandlerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
      stopWatchingMouse();
    };
  }, []);

  const collapse = () => {
    if (phaseRef.current !== 'expanded') return;
    stopWatchingMouse();
    phaseRef.current = 'collapsing';
    onExpandChange(null);
    const card = cardRef.current;
    const grid = gridRef.current;
    if (!card || !grid) {
      phaseRef.current = 'idle';
      setOverlayStyle(null);
      return;
    }
    const cardRect = card.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    setOverlayStyle(s =>
      s && {
        ...s,
        top: cardRect.top - gridRect.top,
        left: cardRect.left - gridRect.left,
        width: cardRect.width,
        height: cardRect.height,
        transition: TRANSITION,
        pointerEvents: 'none',
      },
    );
    collapseTimer.current = setTimeout(() => {
      phaseRef.current = 'idle';
      setOverlayStyle(null);
    }, 460);
  };

  const handleEnter = () => {
    if (phaseRef.current !== 'idle') return;
    const myCycle = ++cycleRef.current;
    phaseRef.current = 'expanding';
    hoverTimer.current = setTimeout(() => {
      if (cycleRef.current !== myCycle || phaseRef.current !== 'expanding') return;
      const card = cardRef.current;
      const grid = gridRef.current;
      if (!card || !grid) return;
      const cardRect = card.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();
      setOverlayStyle({
        position: 'absolute',
        top: cardRect.top - gridRect.top,
        left: cardRect.left - gridRect.left,
        width: cardRect.width,
        height: cardRect.height,
        transition: 'none',
        pointerEvents: 'none',
        zIndex: 80,
      });
      onExpandChange(property.id);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cycleRef.current !== myCycle || phaseRef.current !== 'expanding') return;
          phaseRef.current = 'expanded';
          setOverlayStyle(s =>
            s && {
              ...s,
              top: 0,
              left: 0,
              width: gridRect.width,
              height: gridRect.height,
              transition: TRANSITION,
              pointerEvents: 'auto',
            },
          );
          const listener = (e: MouseEvent) => {
            const g = gridRef.current;
            if (!g) return;
            const r = g.getBoundingClientRect();
            const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
            if (!inside) collapse();
          };
          mouseMoveHandlerRef.current = listener;
          window.addEventListener('mousemove', listener);
        });
      });
    }, HOVER_DELAY);
  };

  const handleLeave = () => {
    if (phaseRef.current !== 'expanding') return;
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    cycleRef.current++;
    phaseRef.current = 'idle';
    setOverlayStyle(null);
    onExpandChange(null);
  };

  const renderContent = (big: boolean) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Photo carousel */}
      <div style={{ position: 'relative', flex: big ? 1 : '0 0 150px', overflow: 'hidden', background: '#111' }}>
        {property.photos.map((photo, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: i === activeIndex ? 1 : 0,
              transition: 'opacity 0.9s ease',
            }}
          >
            <img
              src={photo}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ))}
        {property.badge && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: t.gold,
              color: t.goldText,
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 999,
              letterSpacing: '0.05em',
              zIndex: 2,
            }}
          >
            {property.badge}
          </div>
        )}
        {property.photos.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 6,
              zIndex: 2,
            }}
          >
            {property.photos.map((_, i) => (
              <button
                key={i}
                onClick={e => {
                  e.stopPropagation();
                  setActiveIndex(i);
                }}
                style={{
                  width: i === activeIndex ? 18 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === activeIndex ? t.gold : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.25s ease',
                }}
              />
            ))}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(6,9,22,0.85) 0%, rgba(6,9,22,0) 45%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Info */}
      <div
        style={{
          padding: big ? '18px 20px' : '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: big ? 10 : 6,
          flex: big ? '1 1 auto' : 1,
          minHeight: 0,
          background: t.expanded,
        }}
      >
        <div>
          <div
            style={{
              color: t.txt,
              fontWeight: 700,
              fontSize: big ? '1.15rem' : '0.85rem',
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            {isAr ? property.titleAr : property.titleEn}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={11} color={t.gold2} />
            <span style={{ color: t.gold2, fontSize: '0.7rem' }}>{isAr ? property.locationAr : property.locationEn}</span>
          </div>
        </div>

        <div style={{ color: t.gold, fontWeight: 800, fontSize: big ? '1.3rem' : '1rem' }}>
          {property.price} <span style={{ fontSize: '0.85em', fontWeight: 600 }}>$</span>
        </div>

        {property.description && (
          <p
            style={{
              color: t.txt2,
              fontSize: '0.72rem',
              lineHeight: 1.6,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: big ? 5 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {isAr ? property.description : (property.descriptionEn ?? property.description)}
          </p>
        )}

        <button
          onClick={e => {
            e.stopPropagation();
            onDetail(property);
          }}
          style={{
            marginTop: 'auto',
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: t.gold,
            border: 'none',
            borderRadius: 8,
            color: t.goldText,
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '7px 14px',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          <ArrowIcon size={13} />
          {isAr ? 'عرض التفاصيل' : 'View Details'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={cardRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          position: 'relative',
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${t.gold4}`,
          background: t.card,
          height: 320,
          opacity: overlayStyle ? 0 : isOtherExpanded ? 0.25 : 1,
          filter: isOtherExpanded ? 'blur(3px)' : 'none',
          pointerEvents: isOtherExpanded || overlayStyle ? 'none' : 'auto',
          transition: 'opacity 0.35s ease, filter 0.35s ease',
          boxShadow: t.shadow,
        }}
      >
        {renderContent(false)}
      </div>

      {overlayStyle && (
        <div
          style={{
            ...overlayStyle,
            borderRadius: 16,
            overflow: 'hidden',
            border: `1px solid ${t.gold3}`,
            background: t.expanded,
            boxShadow: t.shadowModal,
          }}
        >
          {renderContent(true)}
        </div>
      )}
    </>
  );
}
