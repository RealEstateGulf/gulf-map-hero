'use client';

import { LayoutGrid, Home, TreePine, Building2, Briefcase, Hotel } from 'lucide-react';
import type { PropertyCategory } from '@/data/properties';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';

const CATEGORIES: Array<{ id: PropertyCategory | 'all'; labelAr: string; labelEn: string; Icon: typeof Home }> = [
  { id: 'all', labelAr: 'الكل', labelEn: 'All', Icon: LayoutGrid },
  { id: 'villas', labelAr: 'فلل فاخرة', labelEn: 'Villas', Icon: Home },
  { id: 'land', labelAr: 'أراضي', labelEn: 'Land', Icon: TreePine },
  { id: 'apartments', labelAr: 'شقق', labelEn: 'Apartments', Icon: Building2 },
  { id: 'commercial', labelAr: 'مشاريع تجارية', labelEn: 'Commercial', Icon: Briefcase },
  { id: 'hotels', labelAr: 'فنادق', labelEn: 'Hotels', Icon: Hotel },
];

interface Props {
  active: PropertyCategory | 'all';
  onChange: (id: PropertyCategory | 'all') => void;
}

export default function CategoryBar({ active, onChange }: Props) {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();

  if (isMobile) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        zIndex: 30,
        background: t.navbar,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: `1px solid ${t.gold4}`,
        boxShadow: t.shadow,
        direction: dir,
        transition: 'background 0.4s ease',
      }}
    >
      <div
        className="category-bar-scroll"
        style={{
          display: 'flex',
          justifyContent: isMobile ? 'flex-start' : 'center',
          padding: isMobile ? '10px 16px 14px' : '12px 24px 16px',
          gap: isMobile ? 6 : 8,
        }}
      >
        {CATEGORIES.map(({ id, labelAr, labelEn, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: isMobile ? 3 : 5,
                padding: isMobile ? '8px 14px' : '10px 22px',
                borderRadius: 12,
                border: isActive ? `1px solid ${t.gold3}` : `1px solid ${t.border}`,
                background: isActive ? t.gold5 : t.btn,
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: isMobile ? 64 : 90,
                flexShrink: 0,
                boxShadow: isActive ? t.shadow : 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = t.btn;
                  e.currentTarget.style.borderColor = t.gold4;
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = t.btn;
                  e.currentTarget.style.borderColor = t.border;
                }
              }}
            >
              <Icon size={isMobile ? 16 : 20} color={isActive ? t.gold : t.txt3} strokeWidth={isActive ? 2 : 1.5} />
              <span style={{
                color: isActive ? t.gold : t.txt3,
                fontSize: isMobile ? '0.6rem' : '0.72rem',
                fontWeight: isActive ? 600 : 400,
                whiteSpace: 'nowrap',
              }}>
                {isAr ? labelAr : labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
