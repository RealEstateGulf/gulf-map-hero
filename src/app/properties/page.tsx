'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { BedDouble, Maximize2, MapPin, ArrowLeft, SlidersHorizontal, ChevronDown, Scale, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useCurrency, parseUSD } from '@/context/CurrencyContext';
import { useCompare } from '@/context/CompareContext';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import { useContent } from '@/hooks/useContent';
import Navbar from '@/components/map/Navbar';
import FooterSection from '@/components/sections/FooterSection';
import type { Property, PropertyCategory } from '@/data/properties';

export default function PropertiesPage() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { ref, visible } = useScrollReveal();
  const { dir, isAr } = useLanguage();
  const tr = useT();
  const { get, getImg } = useContent('properties');

  const CATEGORIES: { key: 'all' | PropertyCategory; label: string }[] = [
    { key: 'all', label: tr('prop.filter.all') },
    { key: 'villas', label: tr('prop.filter.villas') },
    { key: 'apartments', label: tr('prop.filter.apartments') },
    { key: 'land', label: tr('prop.filter.land') },
    { key: 'commercial', label: tr('prop.filter.commercial') },
    { key: 'hotels', label: tr('prop.filter.hotels') },
  ];

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | PropertyCategory>('all');
  const [activeCity, setActiveCity] = useState<string>('الكل');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  useEffect(() => {
    fetch('/api/properties')
      .then(r => r.json())
      .then(setAllProperties)
      .finally(() => setLoading(false));
  }, []);

  const ALL_CITIES = useMemo(
    () => ['الكل', ...Array.from(new Set(allProperties.map(p => p.city)))],
    [allProperties],
  );

  const filtered = useMemo(() => {
    return allProperties.filter(p => {
      const categoryMatch = activeCategory === 'all' || p.category === activeCategory;
      const cityMatch = activeCity === 'الكل' || p.city === activeCity;
      return categoryMatch && cityMatch;
    });
  }, [allProperties, activeCategory, activeCity]);

  return (
    <main style={{ background: t.bg, minHeight: '100vh', direction: dir }}>
      <Navbar />

      {/* Hero */}
      <div
        style={{
          height: isMobile ? 280 : 380,
          background: 'linear-gradient(160deg, #0a0a0a 0%, #1c1611 50%, #0a0a0a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: `1px solid ${t.gold4}`,
          paddingTop: 64,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.08,
            backgroundImage:
              'linear-gradient(rgba(217,186,160,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(217,186,160,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <p
          style={{
            color: t.gold,
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            position: 'relative',
          }}
        >
          <span style={{ display: 'inline-block', width: 28, height: 1, background: t.gold }} />
          {isAr ? 'المحفظة العقارية' : 'Property Portfolio'}
          <span style={{ display: 'inline-block', width: 28, height: 1, background: t.gold }} />
        </p>
        <h1
          style={{
            fontFamily: "'Marcellus', serif",
            color: '#fff',
            fontSize: isMobile ? 'clamp(1.8rem, 7vw, 2.4rem)' : 'clamp(2.4rem, 4.5vw, 3.4rem)',
            margin: 0,
            lineHeight: 1.2,
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {get('hero.title', isAr, tr('prop.hero.title'))}
        </h1>
        <p
          style={{
            color: t.txt3,
            fontSize: '0.88rem',
            marginTop: 18,
            textAlign: 'center',
            maxWidth: 460,
            padding: '0 20px',
            lineHeight: 1.8,
            position: 'relative',
          }}
        >
          {get('hero.subtitle', isAr, tr('prop.hero.sub'))}
        </p>
      </div>

      {/* Filter bar */}
      <div
        style={{
          background: t.altBg,
          borderBottom: `1px solid ${t.border}`,
          position: 'sticky',
          top: 64,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 16px' : '0 32px' }}>

          {/* Category chips */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: isMobile ? '12px 0 0' : '14px 0 0',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            <SlidersHorizontal size={13} color={t.gold} style={{ flexShrink: 0 }} />
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 4,
                  border: `1px solid ${activeCategory === cat.key ? t.gold : t.border}`,
                  background: activeCategory === cat.key ? t.gold5 : 'transparent',
                  color: activeCategory === cat.key ? t.gold : t.txt3,
                  fontSize: '0.73rem',
                  fontWeight: activeCategory === cat.key ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* City row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: isMobile ? '10px 0 12px' : '10px 0 14px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            <MapPin size={13} color={t.txt4} style={{ flexShrink: 0 }} />
            {isMobile ? (
              /* Mobile: dropdown */
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => setCityDropdownOpen(o => !o)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 4,
                    border: `1px solid ${activeCity !== 'الكل' ? t.gold : t.border}`,
                    background: activeCity !== 'الكل' ? t.gold5 : 'transparent',
                    color: activeCity !== 'الكل' ? t.gold : t.txt3,
                    fontSize: '0.73rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {activeCity}
                  <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: cityDropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </button>
                {cityDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '110%',
                      right: 0,
                      background: t.modal,
                      border: `1px solid ${t.border}`,
                      borderRadius: 6,
                      padding: '6px 0',
                      minWidth: 140,
                      zIndex: 200,
                      boxShadow: t.shadowModal,
                    }}
                  >
                    {ALL_CITIES.map(city => (
                      <button
                        key={city}
                        onClick={() => { setActiveCity(city); setCityDropdownOpen(false); }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '9px 16px',
                          background: activeCity === city ? t.gold5 : 'none',
                          border: 'none',
                          color: activeCity === city ? t.gold : t.txt2,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          textAlign: dir === 'rtl' ? 'right' : 'left',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { if (activeCity !== city) { e.currentTarget.style.background = t.gold6; e.currentTarget.style.color = t.txt; } }}
                        onMouseLeave={e => { if (activeCity !== city) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = t.txt2; } }}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Desktop: chips */
              ALL_CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => setActiveCity(city)}
                  style={{
                    padding: '5px 13px',
                    borderRadius: 4,
                    border: `1px solid ${activeCity === city ? t.gold : t.border}`,
                    background: activeCity === city ? t.gold5 : 'transparent',
                    color: activeCity === city ? t.gold : t.txt4,
                    fontSize: '0.7rem',
                    fontWeight: activeCity === city ? 600 : 400,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { if (activeCity !== city) { e.currentTarget.style.borderColor = t.gold4; e.currentTarget.style.color = t.txt3; } }}
                  onMouseLeave={e => { if (activeCity !== city) { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.txt4; } }}
                >
                  {city}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: isMobile ? '36px 16px 60px' : '56px 32px 100px',
        }}
        onClick={() => cityDropdownOpen && setCityDropdownOpen(false)}
      >
        <div ref={ref} style={{ marginBottom: 28, ...rv(visible, 0) }}>
          <p style={{ color: t.txt4, fontSize: '0.8rem', margin: 0 }}>
            {filtered.length} {tr('prop.available')}
            {activeCity !== 'الكل' && (
              <span style={{ color: t.gold, marginRight: 6 }}>· {activeCity}</span>
            )}
            {activeCategory !== 'all' && (
              <span style={{ color: t.gold, marginRight: 6 }}>
                · {CATEGORIES.find(c => c.key === activeCategory)?.label}
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: t.txt4, fontSize: '0.9rem' }}>
            {isAr ? 'جارٍ التحميل...' : 'Loading...'}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: t.txt4,
              fontSize: '0.9rem',
            }}
          >
            {tr('prop.noMatch')}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: 20,
            }}
          >
            {filtered.map((property, i) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={i}
                visible={visible}
                t={t}
              />
            ))}
          </div>
        )}
      </div>

      <FooterSection />
    </main>
  );
}

function PropertyCard({
  property,
  index,
  visible,
  t,
}: {
  property: Property;
  index: number;
  visible: boolean;
  t: ReturnType<typeof useTheme>['t'];
}) {
  const mainPhoto = property.photos[0];
  const { formatPrice } = useCurrency();
  const { add, remove, has, isFull } = useCompare();
  const { dir } = useLanguage();
  const tr = useT();
  const isCompared = has(property.id);

  return (
    <Link href={`/properties/${property.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 8,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease',
          ...rv(visible, 0.05 * (index % 9)),
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = 'translateY(-6px)';
          el.style.boxShadow = '0 28px 60px rgba(0,0,0,0.55)';
          const img = el.querySelector('img') as HTMLImageElement | null;
          if (img) img.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = 'translateY(0)';
          el.style.boxShadow = 'none';
          const img = el.querySelector('img') as HTMLImageElement | null;
          if (img) img.style.transform = 'scale(1)';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainPhoto}
            alt={property.titleAr}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.65s cubic-bezier(0.22,1,0.36,1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)',
            }}
          />
          {property.badge && (
            <div
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: t.gold,
                borderRadius: 3,
                padding: '3px 9px',
                color: t.goldText,
                fontSize: '0.55rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {property.badge}
            </div>
          )}
          {/* Compare toggle */}
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              isCompared ? remove(property.id) : add(property);
            }}
            title={isCompared ? tr('prop.compareRemove') : tr('prop.compareAdd')}
            disabled={!isCompared && isFull}
            style={{
              position: 'absolute', top: 10, left: 10,
              width: 30, height: 30, borderRadius: '50%',
              background: isCompared ? t.gold : 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(6px)',
              border: `1px solid ${isCompared ? t.gold : 'rgba(255,255,255,0.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: (!isCompared && isFull) ? 'not-allowed' : 'pointer',
              opacity: (!isCompared && isFull) ? 0.4 : 1,
              transition: 'all 0.2s',
              zIndex: 2,
            }}
          >
            {isCompared
              ? <X size={13} color={t.goldText} strokeWidth={2} />
              : <Scale size={13} color="#fff" strokeWidth={1.5} />
            }
          </button>
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(6px)',
              borderRadius: 3,
              padding: '4px 8px',
            }}
          >
            <MapPin size={10} color={t.gold} />
            <span style={{ color: '#fff', fontSize: '0.62rem' }}>{property.locationAr}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '18px 18px 16px' }}>
          <div
            style={{
              fontSize: '0.58rem',
              color: t.gold,
              letterSpacing: '0.1em',
              marginBottom: 6,
              textTransform: 'uppercase',
            }}
          >
            {property.typeAr}
          </div>
          <h3
            style={{
              fontFamily: "'Marcellus', serif",
              color: t.txt,
              fontSize: '1rem',
              margin: '0 0 12px',
              lineHeight: 1.35,
            }}
          >
            {property.titleAr}
          </h3>
          <div style={{ width: '100%', height: 1, background: t.border, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
            {property.rooms !== '—' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <BedDouble size={11} color={t.txt4} strokeWidth={1.5} />
                <span style={{ color: t.txt3, fontSize: '0.68rem' }}>{property.rooms}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Maximize2 size={11} color={t.txt4} strokeWidth={1.5} />
              <span style={{ color: t.txt3, fontSize: '0.68rem' }}>{property.area} {tr('unit.sqm')}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '1.05rem' }}>
              {formatPrice(parseUSD(property.price))}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: t.gold,
                fontSize: '0.62rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              {tr('cta.viewDetails')}
              <ArrowLeft size={10} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
