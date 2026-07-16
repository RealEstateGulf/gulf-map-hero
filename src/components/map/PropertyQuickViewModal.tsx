'use client';

import { useState } from 'react';
import { X, Heart, MapPin, Maximize2, Share2, MessageCircle, BedDouble } from 'lucide-react';
import { Property } from '@/data/properties';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  property: Property;
  onClose: () => void;
}

export default function PropertyQuickViewModal({ property, onClose }: Props) {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const featuresList = isAr ? (property.features ?? []) : (property.featuresEn ?? property.features ?? []);
  const descText = isAr ? property.description : (property.descriptionEn ?? property.description);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
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
          width: isMobile ? '100%' : 'min(960px, 96vw)',
          height: isMobile ? '100%' : 'min(82vh, 580px)',
          background: t.modal,
          border: isMobile ? 'none' : `1px solid ${t.gold4}`,
          borderRadius: isMobile ? 0 : 20,
          boxShadow: t.shadowModal,
          direction: dir,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          overflow: 'hidden',
          animation: 'modalFadeScale 0.3s cubic-bezier(0.22,1,0.36,1)',
          transition: 'background 0.4s ease',
        }}
      >
        {/* ═══════════════════════════════
            LEFT — Image Gallery Panel
        ═══════════════════════════════ */}
        <div
          style={{
            flex: isMobile ? '0 0 200px' : '0 0 44%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: isMobile ? 0 : (isAr ? '0 20px 20px 0' : '20px 0 0 20px'),
          }}
        >
          {/* Hero photo */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: property.thumbGradient,
              transition: 'opacity 0.6s ease',
            }}
          />

          {/* Photos */}
          {property.photos.map((photo, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: i === activeIndex ? 1 : 0,
                transition: 'opacity 0.7s ease',
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

          {/* Dark gradient for thumbnail readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.3) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Badge */}
          {property.badge && (
            <div
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: t.gold,
                color: t.goldText,
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 999,
                letterSpacing: '0.06em',
                zIndex: 3,
              }}
            >
              {property.badge}
            </div>
          )}

          {/* Top-right action buttons */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              display: 'flex',
              gap: 8,
              zIndex: 3,
            }}
          >
            <button
              style={{
                background: 'rgba(0,0,0,0.35)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8,
                padding: 8,
                cursor: 'pointer',
                display: 'flex',
                color: 'rgba(255,255,255,0.8)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#e85555'; e.currentTarget.style.borderColor = 'rgba(232,85,85,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            >
              <Heart size={14} />
            </button>
            <button
              style={{
                background: 'rgba(0,0,0,0.35)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8,
                padding: 8,
                cursor: 'pointer',
                display: 'flex',
                color: 'rgba(255,255,255,0.8)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            >
              <Share2 size={14} />
            </button>
          </div>

          {/* Photo count badge */}
          {property.photos.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: 80,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 20,
                padding: '4px 12px',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.65rem',
                letterSpacing: '0.08em',
                zIndex: 3,
                direction: 'ltr',
              }}
            >
              {activeIndex + 1} / {property.photos.length}
            </div>
          )}

          {/* Thumbnail strip */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 14px',
              zIndex: 3,
            }}
          >
            <div style={{ display: 'flex', gap: 7 }}>
              {property.photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 8,
                    backgroundImage: `url(${photo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: i === activeIndex
                      ? `2px solid ${t.gold}`
                      : '2px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'border-color 0.2s, transform 0.2s',
                    transform: i === activeIndex ? 'scale(1.04)' : 'scale(1)',
                    overflow: 'hidden',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════
            RIGHT — Details Panel
        ═══════════════════════════════ */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            direction: dir,
          }}
        >
          {/* Sticky header */}
          <div
            style={{
              padding: '22px 24px 16px',
              borderBottom: `1px solid ${t.border}`,
              flexShrink: 0,
              background: t.modal,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    color: t.txt,
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    margin: '0 0 7px',
                    lineHeight: 1.3,
                  }}
                >
                  {isAr ? property.titleAr : property.titleEn}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <MapPin size={12} color={t.gold2} />
                  <span style={{ color: t.gold2, fontSize: '0.78rem' }}>
                    {isAr ? property.locationAr : property.locationEn}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: t.btn,
                  border: `1px solid ${t.btnBorder}`,
                  borderRadius: 8,
                  padding: 7,
                  cursor: 'pointer',
                  display: 'flex',
                  color: t.txt3,
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = t.txt; }}
                onMouseLeave={e => { e.currentTarget.style.color = t.txt3; }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Scrollable body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px' }}>

            {/* Price + stats block */}
            <div
              style={{
                background: t.gold6,
                border: `1px solid ${t.gold4}`,
                borderRadius: 14,
                padding: isMobile ? '14px 16px' : '16px 20px',
                marginBottom: 18,
              }}
            >
              {/* Price row */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: t.txt4, fontSize: '0.62rem', marginBottom: 4, letterSpacing: '0.06em' }}>
                  {isAr ? 'السعر الإجمالي' : 'Total Price'}
                </div>
                <div style={{ color: t.gold, fontWeight: 800, fontSize: isMobile ? '1.5rem' : '1.7rem', lineHeight: 1, letterSpacing: '-0.01em' }}>
                  {property.price} <span style={{ fontSize: '1rem', fontWeight: 600 }}>$</span>
                </div>
              </div>
              {/* Stats row */}
              <div style={{ display: 'flex', gap: isMobile ? 12 : 20, paddingTop: 12, borderTop: `1px solid ${t.gold4}`, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                    <Maximize2 size={11} color={t.gold2} />
                    <span style={{ color: t.txt4, fontSize: '0.6rem' }}>{isAr ? 'المساحة' : 'Area'}</span>
                  </div>
                  <div style={{ color: t.txt, fontSize: '0.85rem', fontWeight: 600 }}>{property.area} m²</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: t.txt4, fontSize: '0.6rem', marginBottom: 3 }}>{isAr ? 'النوع' : 'Type'}</div>
                  <div style={{ color: t.txt, fontSize: '0.85rem', fontWeight: 600 }}>{isAr ? property.typeAr : property.typeEn}</div>
                </div>
                {property.rooms && property.rooms !== '—' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                      <BedDouble size={11} color={t.gold2} />
                      <span style={{ color: t.txt4, fontSize: '0.6rem' }}>{isAr ? 'الغرف' : 'Rooms'}</span>
                    </div>
                    <div style={{ color: t.txt, fontSize: '0.85rem', fontWeight: 600 }}>{property.rooms}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {descText && (
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    color: t.txt,
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    marginBottom: 8,
                    letterSpacing: '0.02em',
                  }}
                >
                  {isAr ? 'نبذة عن العقار' : 'About the Property'}
                </div>
                <p
                  style={{
                    color: t.txt2,
                    fontSize: '0.78rem',
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  {descText}
                </p>
              </div>
            )}

            {/* Features — 3-col grid */}
            {featuresList.length > 0 && (
              <div>
                <div
                  style={{
                    color: t.txt,
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    marginBottom: 10,
                    letterSpacing: '0.02em',
                  }}
                >
                  {isAr ? 'المميزات والخصائص' : 'Features & Highlights'}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                  }}
                >
                  {featuresList.map((f, idx) => (
                    <div
                      key={f}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 5,
                        padding: '10px 6px',
                        background: t.card,
                        borderRadius: 10,
                        border: `1px solid ${t.border}`,
                        textAlign: 'center',
                        boxShadow: t.shadow,
                        transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = t.gold4; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = t.border; }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>✓</span>
                      <span style={{ color: t.txt3, fontSize: '0.62rem', lineHeight: 1.3 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky footer — CTA buttons */}
          <div
            style={{
              padding: '14px 24px',
              borderTop: `1px solid ${t.border}`,
              flexShrink: 0,
              background: t.modal,
              display: 'flex',
              gap: 10,
            }}
          >
            <button
              style={{
                flex: '0 0 auto',
                padding: '11px 18px',
                background: t.btn,
                border: `1px solid ${t.btnBorder}`,
                borderRadius: 10,
                color: t.txt2,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = t.border2; }}
              onMouseLeave={e => { e.currentTarget.style.background = t.btn; }}
            >
              <Share2 size={14} />
              {isAr ? 'مشاركة' : 'Share'}
            </button>
            <button
              style={{
                flex: 1,
                padding: '11px',
                background: t.gold,
                border: 'none',
                borderRadius: 10,
                color: t.goldText,
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'opacity 0.2s, transform 0.2s',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.88';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <MessageCircle size={15} />
              {isAr ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
