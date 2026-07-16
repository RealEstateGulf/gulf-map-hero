'use client';

import { useEffect, useState } from 'react';
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { Property } from '@/data/properties';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  property: Property;
  onDetail: (property: Property) => void;
}

export default function PropertyConnectorCard({ property, onDetail }: Props) {
  const { t } = useTheme();
  const { isAr } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (property.photos.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex(i => (i + 1) % property.photos.length);
    }, 3200);
    return () => clearInterval(id);
  }, [property.photos.length]);

  return (
    <div
      onClick={() => onDetail(property)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        background: t.modal,
        border: hovered ? `1px solid ${t.gold3}` : `1px solid ${t.gold4}`,
        boxShadow: hovered
          ? t.name === 'luxhom' ? '0 20px 50px rgba(0,0,0,0.16)' : '0 20px 50px rgba(0,0,0,0.65)'
          : t.name === 'luxhom' ? '0 6px 24px rgba(0,0,0,0.09)' : '0 8px 28px rgba(0,0,0,0.45)',
        transform: hovered ? 'scale(1.028) translateY(-2px)' : 'scale(1) translateY(0)',
        transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1), border-color 0.25s ease, box-shadow 0.28s ease',
      }}
    >
      {/* Photo carousel */}
      <div style={{ position: 'relative', height: 135, overflow: 'hidden' }}>
        {property.photos.map((photo, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              background: photo,
              opacity: i === activeIndex ? 1 : 0,
              transition: 'opacity 0.9s ease',
            }}
          />
        ))}
        {property.badge && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: t.gold,
              color: t.goldText,
              fontSize: '0.6rem',
              fontWeight: 700,
              padding: '2px 8px',
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
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 5,
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
                  width: i === activeIndex ? 16 : 5,
                  height: 5,
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
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            color: t.txt,
            fontWeight: 700,
            fontSize: '0.82rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {isAr ? property.titleAr : property.titleEn}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <MapPin size={10} color={t.gold2} />
          <span style={{ color: t.gold2, fontSize: '0.66rem' }}>{isAr ? property.locationAr : property.locationEn}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          <div style={{ color: t.gold, fontWeight: 800, fontSize: '0.92rem' }}>
            {property.price} <span style={{ fontSize: '0.8em', fontWeight: 600 }}>$</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: t.gold,
              fontSize: '0.68rem',
              fontWeight: 700,
            }}
          >
            {isAr ? 'عرض التفاصيل' : 'View Details'}
            <ArrowIcon size={11} />
          </div>
        </div>
      </div>
    </div>
  );
}
