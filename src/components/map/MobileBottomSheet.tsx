'use client';

import { motion } from 'framer-motion';
import { X, MapPin, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property, PropertyCategory } from '@/data/properties';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

const CHIPS: Array<{ id: PropertyCategory | 'all'; labelAr: string; labelEn: string }> = [
  { id: 'all', labelAr: 'الكل', labelEn: 'All' },
  { id: 'villas', labelAr: 'فلل', labelEn: 'Villas' },
  { id: 'land', labelAr: 'أراضي', labelEn: 'Land' },
  { id: 'apartments', labelAr: 'شقق', labelEn: 'Apartments' },
  { id: 'commercial', labelAr: 'تجاري', labelEn: 'Commercial' },
  { id: 'hotels', labelAr: 'فنادق', labelEn: 'Hotels' },
];

interface Props {
  properties: Property[];
  cityName: string;
  activeCategory: PropertyCategory | 'all';
  onCategoryChange: (cat: PropertyCategory | 'all') => void;
  onSelectProperty: (p: Property) => void;
  onClose: () => void;
}

export default function MobileBottomSheet({
  properties,
  cityName,
  activeCategory,
  onCategoryChange,
  onSelectProperty,
  onClose,
}: Props) {
  const { t } = useTheme();
  const { dir, isAr } = useLanguage();

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 32, stiffness: 280, opacity: { duration: 0.2 } }}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: t.surface,
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderTop: `1px solid ${t.gold4}`,
        borderRadius: '20px 20px 0 0',
        maxHeight: '72vh',
        display: 'flex',
        flexDirection: 'column',
        direction: dir,
        overflow: 'hidden',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* Drag handle */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 6, flexShrink: 0 }}>
        <div style={{ width: 40, height: 4, borderRadius: 999, background: t.gold4 }} />
      </div>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 18px 12px',
          borderBottom: `1px solid ${t.gold4}`,
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.gold, boxShadow: `0 0 6px ${t.gold}` }} />
            <h2 style={{ color: t.txt, fontWeight: 700, fontSize: '1rem', margin: 0 }}>{cityName}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <MapPin size={10} color={t.gold2} />
            <span style={{ color: t.gold2, fontSize: '0.7rem' }}>
              {properties.length} {isAr ? 'عقار متاح' : 'properties available'}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: t.btn,
            border: `1px solid ${t.btnBorder}`,
            borderRadius: 8,
            padding: '6px',
            cursor: 'pointer',
            display: 'flex',
            color: t.txt3,
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Category chips */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          padding: '10px 14px',
          overflowX: 'auto',
          overflowY: 'hidden',
          flexShrink: 0,
          scrollbarWidth: 'none',
          borderBottom: `1px solid ${t.gold4}`,
        } as React.CSSProperties}
      >
        {CHIPS.map(chip => {
          const active = activeCategory === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => onCategoryChange(chip.id)}
              style={{
                flexShrink: 0,
                padding: '5px 14px',
                borderRadius: 999,
                border: active ? `1px solid ${t.gold3}` : `1px solid ${t.border}`,
                background: active ? t.gold5 : t.btn,
                color: active ? t.gold : t.txt3,
                fontSize: '0.72rem',
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {isAr ? chip.labelAr : chip.labelEn}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flex: 1,
        }}
      >
        {properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: t.txt3, fontSize: '0.85rem' }}>
            {isAr ? 'لا توجد عقارات في هذا التصنيف' : 'No properties in this category'}
          </div>
        ) : (
          properties.map(prop => (
            <MobilePropertyCard
              key={prop.id}
              prop={prop}
              onSelect={() => onSelectProperty(prop)}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}

function MobilePropertyCard({ prop, onSelect }: { prop: Property; onSelect: () => void }) {
  const { t } = useTheme();
  const { dir, isAr } = useLanguage();
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={e => e.key === 'Enter' && onSelect()}
      style={{
        width: '100%',
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 14,
        boxShadow: t.shadow,
        cursor: 'pointer',
        transition: 'border-color 0.18s, transform 0.18s',
        WebkitTapHighlightColor: 'transparent',
      }}
      onTouchStart={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(0.985)'; (e.currentTarget as HTMLDivElement).style.borderColor = t.gold3; }}
      onTouchEnd={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLDivElement).style.borderColor = t.border; }}
    >
      {/* Photo — rounded top corners only */}
      <div style={{ position: 'relative', height: 140, overflow: 'hidden', background: '#111', borderRadius: '13px 13px 0 0' }}>
        <img
          src={prop.photos[0]}
          alt={isAr ? prop.titleAr : prop.titleEn}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        {prop.badge && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: t.gold, color: t.goldText,
            fontSize: '0.6rem', fontWeight: 700,
            padding: '3px 10px', borderRadius: 999,
          }}>
            {prop.badge}
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Maximize2 size={10} color="rgba(255,255,255,0.75)" />
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.65rem' }}>{prop.area} m²</span>
        </div>
        {prop.photos.length > 1 && (
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            borderRadius: 6, padding: '2px 7px',
            color: 'rgba(255,255,255,0.85)', fontSize: '0.6rem',
          }}>
            {prop.photos.length} {isAr ? 'صور' : 'photos'}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 14px 12px', background: t.card, borderRadius: '0 0 13px 13px', direction: dir }}>
        {/* Type + arrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <ChevronIcon size={14} color={t.txt4} />
          <span style={{
            fontSize: '0.62rem', background: t.gold5, color: t.gold,
            padding: '2px 8px', borderRadius: 999, border: `1px solid ${t.gold4}`,
          }}>
            {isAr ? prop.typeAr : prop.typeEn}
          </span>
        </div>
        {/* Title */}
        <p style={{ color: t.txt, fontWeight: 600, fontSize: '0.88rem', margin: '0 0 5px', lineHeight: 1.3, textAlign: isAr ? 'right' : 'left' }}>
          {isAr ? prop.titleAr : prop.titleEn}
        </p>
        {/* Location */}
        <p style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', justifyContent: isAr ? 'flex-end' : 'flex-start', gap: 4 }}>
          <span style={{ color: t.txt4, fontSize: '0.7rem' }}>{isAr ? prop.locationAr : prop.locationEn}</span>
          <MapPin size={10} color={t.txt4} />
        </p>
        {/* Price + rooms */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: t.txt3, fontSize: '0.68rem', background: t.btn, padding: '2px 8px', borderRadius: 6 }}>
            {prop.rooms !== '—' ? prop.rooms : prop.area + ' m²'}
          </span>
          <span style={{ color: t.gold, fontWeight: 700, fontSize: '1rem' }}>{prop.price} $</span>
        </div>
      </div>
    </div>
  );
}
