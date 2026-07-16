'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BedDouble,
  Maximize2,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from '@/components/map/Navbar';
import FooterSection from '@/components/sections/FooterSection';
import type { Property } from '@/data/properties';

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useTheme();
  const { isAr } = useLanguage();
  // undefined = yükleniyor, null = bulunamadı
  const [property, setProperty] = useState<Property | null | undefined>(undefined);
  const [related, setRelated] = useState<Property[]>([]);

  useEffect(() => {
    fetch('/api/properties')
      .then(r => r.json())
      .then((all: Property[]) => {
        const found = all.find(p => p.id === id) ?? null;
        setProperty(found);
        if (found) setRelated(all.filter(p => p.id !== found.id && p.category === found.category).slice(0, 3));
      });
  }, [id]);

  if (property === undefined) {
    return (
      <main style={{ background: t.bg, minHeight: '100vh', direction: 'rtl' }}>
        <Navbar />
        <div style={{ paddingTop: 140, textAlign: 'center', color: t.txt4, fontSize: '0.9rem' }}>
          {isAr ? 'جارٍ التحميل...' : 'Loading...'}
        </div>
      </main>
    );
  }
  if (property === null) notFound();
  return <PropertyDetail property={property} related={related} />;
}

function PropertyDetail({ property, related }: { property: Property; related: Property[] }) {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <main style={{ background: t.bg, minHeight: '100vh', direction: 'rtl' }}>
      <Navbar />

      {/* Breadcrumb */}
      <div
        style={{
          paddingTop: 64,
          background: t.altBg,
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: isMobile ? '12px 16px' : '14px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Link
            href="/"
            style={{ color: t.txt4, fontSize: '0.73rem', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = t.gold; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = t.txt4; }}
          >
            الرئيسية
          </Link>
          <ChevronRight size={10} color={t.txt4} />
          <Link
            href="/properties"
            style={{ color: t.txt4, fontSize: '0.73rem', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = t.gold; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = t.txt4; }}
          >
            العقارات
          </Link>
          <ChevronRight size={10} color={t.txt4} />
          <span style={{ color: t.txt3, fontSize: '0.73rem' }}>{property.titleAr}</span>
        </div>
      </div>

      {/* Gallery */}
      <div style={{ background: '#080808', borderBottom: `1px solid ${t.border}` }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: isMobile ? '20px 16px 0' : '28px 32px 0',
          }}
        >
          {/* Main image */}
          <div
            style={{
              position: 'relative',
              borderRadius: 8,
              overflow: 'hidden',
              height: isMobile ? 260 : 500,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={property.photos[activePhoto]}
              alt={property.titleAr}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.3s ease' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)',
              }}
            />
            {property.badge && (
              <div
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: t.gold,
                  borderRadius: 3,
                  padding: '4px 12px',
                  color: t.goldText,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {property.badge}
              </div>
            )}
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(8px)',
                borderRadius: 4,
                padding: '5px 10px',
              }}
            >
              <MapPin size={11} color={t.gold} />
              <span style={{ color: '#fff', fontSize: '0.7rem' }}>{property.locationAr}</span>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: '10px 0 0',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {property.photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setActivePhoto(i)}
                style={{
                  width: 88,
                  height: 60,
                  flexShrink: 0,
                  borderRadius: 5,
                  overflow: 'hidden',
                  border: `2px solid ${i === activePhoto ? t.gold : 'transparent'}`,
                  cursor: 'pointer',
                  padding: 0,
                  background: 'none',
                  opacity: i === activePhoto ? 1 : 0.48,
                  transition: 'all 0.22s',
                }}
                onMouseEnter={e => { if (i !== activePhoto) (e.currentTarget as HTMLButtonElement).style.opacity = '0.75'; }}
                onMouseLeave={e => { if (i !== activePhoto) (e.currentTarget as HTMLButtonElement).style.opacity = '0.48'; }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: isMobile ? '32px 16px 60px' : '52px 32px 100px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 340px',
            gap: isMobile ? 40 : 52,
            alignItems: 'start',
          }}
        >
          {/* Left: property info */}
          <div>
            {/* Type label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span
                style={{
                  color: t.gold,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                {property.typeAr}
              </span>
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: t.gold4,
                  display: 'inline-block',
                }}
              />
              <span style={{ color: t.txt4, fontSize: '0.72rem' }}>{property.locationAr}</span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "'Marcellus', serif",
                color: t.txt,
                fontSize: isMobile
                  ? 'clamp(1.5rem, 5vw, 2rem)'
                  : 'clamp(1.8rem, 2.8vw, 2.6rem)',
                margin: '0 0 10px',
                lineHeight: 1.25,
              }}
            >
              {property.titleAr}
            </h1>

            {/* Price */}
            <div
              style={{
                fontFamily: "'Marcellus', serif",
                color: t.gold,
                fontSize: isMobile ? '1.5rem' : '1.9rem',
                marginBottom: 28,
              }}
            >
              ${property.price}
            </div>

            {/* Specs bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${property.rooms !== '—' ? 3 : 2}, 1fr)`,
                gap: 1,
                background: t.border,
                borderRadius: 8,
                overflow: 'hidden',
                marginBottom: 36,
              }}
            >
              {property.rooms !== '—' && (
                <SpecCell label="غرف" value={property.rooms} t={t} />
              )}
              <SpecCell label="المساحة" value={`${property.area} م²`} t={t} />
              <SpecCell label="النوع" value={property.typeAr} t={t} />
            </div>

            {/* Description */}
            {property.description && (
              <div style={{ marginBottom: 36 }}>
                <SectionTitle title="وصف العقار" t={t} />
                <p
                  style={{
                    color: t.txt3,
                    fontSize: '0.88rem',
                    lineHeight: 1.9,
                    margin: 0,
                  }}
                >
                  {property.description}
                </p>
              </div>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div style={{ marginBottom: 36 }}>
                <SectionTitle title="المميزات والخدمات" t={t} />
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: '12px 24px',
                  }}
                >
                  {property.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <CheckCircle2 size={13} color={t.gold} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                      <span style={{ color: t.txt2, fontSize: '0.84rem' }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back link — mobile */}
            {isMobile && (
              <Link
                href="/properties"
                style={{
                  color: t.txt4,
                  fontSize: '0.78rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  marginTop: 8,
                }}
              >
                <ArrowRight size={13} />
                العودة إلى قائمة العقارات
              </Link>
            )}
          </div>

          {/* Right: sidebar */}
          <div style={{ position: isMobile ? 'static' : 'sticky', top: 84 }}>
            <div
              style={{
                background: t.altBg,
                border: `1px solid ${t.border}`,
                borderRadius: 8,
                overflow: 'hidden',
                marginBottom: 16,
              }}
            >
              {/* Agent card */}
              <div
                style={{
                  padding: '22px 20px',
                  borderBottom: `1px solid ${t.border}`,
                }}
              >
                <p
                  style={{
                    color: t.txt4,
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: 14,
                  }}
                >
                  الوكيل المسؤول
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: `1.5px solid ${t.gold3}`,
                      flexShrink: 0,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80"
                      alt="أحمد يلدز"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <div style={{ color: t.txt, fontSize: '0.85rem', fontWeight: 600 }}>
                      أحمد يلدز
                    </div>
                    <div style={{ color: t.gold, fontSize: '0.65rem', marginTop: 3 }}>
                      مدير العلاقات العربية
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {[
                    { Icon: Phone, text: '+90 555 000 0000' },
                    { Icon: Mail, text: 'info@gulfinvest.com.tr' },
                  ].map(({ Icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={12} color={t.gold} />
                      <span style={{ color: t.txt3, fontSize: '0.78rem' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  style={{
                    width: '100%',
                    background: t.gold,
                    border: 'none',
                    borderRadius: 6,
                    color: t.goldText,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '13px',
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.82'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  احجز معاينة
                </button>
                <button
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: `1px solid ${t.border2}`,
                    borderRadius: 6,
                    color: t.txt2,
                    fontSize: '0.78rem',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = t.gold3;
                    e.currentTarget.style.color = t.gold;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = t.border2;
                    e.currentTarget.style.color = t.txt2;
                  }}
                >
                  تواصل مع الوكيل
                </button>
              </div>
            </div>

            {/* Quick info box */}
            <div
              style={{
                background: t.altBg,
                border: `1px solid ${t.border}`,
                borderRadius: 8,
                padding: '16px 20px',
                marginBottom: 16,
              }}
            >
              {[
                { label: 'رمز العقار', value: `GI-${property.id.padStart(4, '0')}` },
                { label: 'الموقع', value: property.locationAr },
                { label: 'النوع', value: property.typeAr },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '9px 0',
                    borderBottom: `1px solid ${t.border}`,
                  }}
                >
                  <span style={{ color: t.txt4, fontSize: '0.72rem' }}>{label}</span>
                  <span style={{ color: t.txt2, fontSize: '0.75rem', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Back link — desktop */}
            {!isMobile && (
              <div style={{ textAlign: 'center' }}>
                <Link
                  href="/properties"
                  style={{
                    color: t.txt4,
                    fontSize: '0.74rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = t.gold; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = t.txt4; }}
                >
                  <ArrowRight size={12} />
                  العودة إلى قائمة العقارات
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Related properties */}
        {related.length > 0 && (
          <div style={{ marginTop: isMobile ? 52 : 72 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
              <h2
                style={{
                  fontFamily: "'Marcellus', serif",
                  color: t.txt,
                  fontSize: '1.3rem',
                  margin: 0,
                }}
              >
                عقارات مشابهة
              </h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : `repeat(${related.length}, 1fr)`,
                gap: 18,
              }}
            >
              {related.map(p => (
                <Link
                  key={p.id}
                  href={`/properties/${p.id}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    style={{
                      background: t.card,
                      border: `1px solid ${t.border}`,
                      borderRadius: 8,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 48px rgba(0,0,0,0.5)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.photos[0]}
                        alt={p.titleAr}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                    </div>
                    <div style={{ padding: '14px 16px 14px' }}>
                      <div style={{ color: t.txt4, fontSize: '0.58rem', letterSpacing: '0.08em', marginBottom: 4 }}>{p.locationAr}</div>
                      <div style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '0.9rem', marginBottom: 8 }}>{p.titleAr}</div>
                      <div style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '0.95rem' }}>${p.price}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <FooterSection />
    </main>
  );
}

function SpecCell({
  label,
  value,
  t,
}: {
  label: string;
  value: string;
  t: ReturnType<typeof useTheme>['t'];
}) {
  return (
    <div style={{ background: t.altBg, padding: '15px 16px', textAlign: 'center' }}>
      <div
        style={{
          color: t.txt4,
          fontSize: '0.58rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <div
        style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '1.05rem' }}
      >
        {value}
      </div>
    </div>
  );
}

function SectionTitle({ title, t }: { title: string; t: ReturnType<typeof useTheme>['t'] }) {
  return (
    <h2
      style={{
        fontFamily: "'Marcellus', serif",
        color: t.txt,
        fontSize: '1.1rem',
        margin: '0 0 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <span style={{ display: 'inline-block', width: 20, height: 1, background: t.gold }} />
      {title}
    </h2>
  );
}
