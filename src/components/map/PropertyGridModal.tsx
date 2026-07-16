'use client';

import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Property } from '@/data/properties';
import PropertyGridCard from './PropertyGridCard';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  cityName: string;
  properties: Property[];
  onClose: () => void;
  onSelectProperty: (p: Property) => void;
}

export default function PropertyGridModal({ cityName, properties, onClose, onSelectProperty }: Props) {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();
  const gridRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const showOverflow = properties.length > 6;
  const visible = showOverflow ? properties.slice(0, 5) : properties.slice(0, 6);
  const overflowCount = showOverflow ? properties.length - visible.length : 0;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        background: t.overlay,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'backdropFadeIn 0.3s ease',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 'min(1100px, 96vw)',
          maxHeight: isMobile ? '92vh' : '88vh',
          background: t.modal,
          border: `1px solid ${t.gold4}`,
          borderRadius: 20,
          boxShadow: t.shadowModal,
          direction: dir,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalFadeScale 0.35s cubic-bezier(0.22,1,0.36,1)',
          transition: 'background 0.4s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 22px',
            borderBottom: `1px solid ${t.gold4}`,
            background: t.name === 'luxhom'
              ? `linear-gradient(to bottom, ${t.gold6} 0%, transparent 100%)`
              : `linear-gradient(to bottom, ${t.gold6} 0%, transparent 100%)`,
          }}
        >
          <div style={{ width: 30 }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: t.txt, fontWeight: 800, fontSize: '1.2rem' }}>{cityName}</div>
            <div style={{ color: t.gold2, fontSize: '0.75rem', marginTop: 2 }}>
              {properties.length} {isAr ? 'فرص استثمارية متاحة' : 'investment opportunities available'}
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
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = t.txt; }}
            onMouseLeave={e => { e.currentTarget.style.color = t.txt3; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? 12 : 16,
            padding: isMobile ? 14 : 22,
            overflowY: 'auto',
          }}
        >
          {properties.length === 0 && (
            <div
              style={{
                gridColumn: '1 / -1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '60px 0',
              }}
            >
              <div style={{ color: t.txt2, fontSize: '0.95rem', fontWeight: 600 }}>
                {isAr ? 'لا توجد عقارات في هذا التصنيف حالياً' : 'No properties in this category'}
              </div>
              <div style={{ color: t.txt3, fontSize: '0.78rem' }}>
                {isAr ? 'جرّب اختيار تصنيف آخر من القائمة السفلية' : 'Try selecting a different category from the bar below'}
              </div>
            </div>
          )}
          {visible.map(prop => (
            <PropertyGridCard
              key={prop.id}
              property={prop}
              gridRef={gridRef}
              isOtherExpanded={expandedId !== null && expandedId !== prop.id}
              onExpandChange={id => setExpandedId(id)}
              onDetail={onSelectProperty}
            />
          ))}
          {showOverflow && (
            <div
              style={{
                borderRadius: 16,
                border: `1px dashed ${t.gold3}`,
                background: t.gold6,
                height: 320,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                opacity: expandedId !== null ? 0.25 : 1,
                filter: expandedId !== null ? 'blur(3px)' : 'none',
                transition: 'opacity 0.35s ease, filter 0.35s ease',
              }}
            >
              <div style={{ color: t.gold, fontWeight: 800, fontSize: '1.8rem' }}>+{overflowCount}</div>
              <div style={{ color: t.txt3, fontSize: '0.78rem' }}>
                {isAr ? 'عقارات إضافية' : 'more properties'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
