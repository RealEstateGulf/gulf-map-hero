'use client';

import { ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import { useContent } from '@/hooks/useContent';

const PHOTO = 'https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&w=900&q=80';

export default function SustainableCTASection() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { ref, visible } = useScrollReveal();
  const { dir, isAr } = useLanguage();
  const tr = useT();
  const { get } = useContent('home');

  return (
    <section style={{ background: t.bg, direction: dir, padding: isMobile ? '60px 0' : '100px 0', borderTop: '1px solid rgba(217,186,160,0.1)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <p style={{
          color: t.gold, fontSize: '0.62rem', fontWeight: 700,
          letterSpacing: '0.25em', textTransform: 'uppercase',
          marginBottom: isMobile ? 36 : 56, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: t.gold }} />
          {isAr ? 'استشارة استثمارية' : 'Investment Advisory'}
        </p>

        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 36 : 72,
            alignItems: 'center',
          }}
        >
          {/* Text */}
          <div style={rv(visible, 0, 'left')}>
            <h2 style={{
              fontFamily: "'Marcellus', serif", color: t.txt,
              fontSize: isMobile ? 'clamp(1.6rem, 6vw, 2.4rem)' : 'clamp(2rem, 3.5vw, 3.2rem)',
              lineHeight: 1.25, marginBottom: 20,
            }}>
              {get('cta.title', isAr,
                isAr ? 'ابدأ رحلتك الاستثمارية اليوم' : 'Start Your Investment Journey Today'
              )}
            </h2>
            <p style={{ color: t.txt3, fontSize: '0.9rem', lineHeight: 1.9, marginBottom: 14, maxWidth: 440 }}>
              {get('cta.sub', isAr,
                isAr
                  ? 'من الحصول على الجنسية التركية إلى بناء محفظة عقارية متنوعة في أفضل المناطق — نحن شريكك الحقيقي في كل خطوة نحو حياة استثنائية.'
                  : 'From obtaining Turkish citizenship to building a diversified real estate portfolio in the best areas — we are your true partner in every step toward an exceptional life.'
              )}
            </p>
            <p style={{
              fontFamily: "'Marcellus', serif", color: t.txt4,
              fontStyle: 'italic', fontSize: '0.95rem', marginBottom: 44, lineHeight: 1.7,
            }}>
              {isAr
                ? 'القرار الاستثماري الصحيح لا يُبنى على الحظ — بل على البيانات والخبرة الميدانية.'
                : 'The right investment decision is not built on luck — but on data and on-the-ground expertise.'}
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link
                href="/contact"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: t.gold, border: 'none', borderRadius: 4,
                  color: t.goldText, fontSize: '0.75rem', fontWeight: 700,
                  padding: '13px 26px', cursor: 'pointer',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  transition: 'opacity 0.2s, transform 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = '0.85'; el.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }}
              >
                {tr('cta.consult')} <ArrowLeft size={14} />
              </Link>
              <a
                href="https://wa.me/905550000000"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'transparent', border: `1px solid ${t.border2}`,
                  borderRadius: 4, color: t.txt2, fontSize: '0.75rem', fontWeight: 600,
                  padding: '13px 26px', cursor: 'pointer',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  transition: 'border-color 0.2s, color 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = t.gold; el.style.color = t.gold; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = t.border2; el.style.color = t.txt2; }}
              >
                <MessageCircle size={14} /> {tr('cta.whatsapp')}
              </a>
            </div>
          </div>

          {/* Image */}
          <div style={{ ...rv(visible, 0.2, 'right'), height: isMobile ? 280 : 520, overflow: 'hidden', borderRadius: 6, position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOTO} alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
            />
            <div style={{ position: 'absolute', top: 0, right: 0, width: 3, height: '35%', background: `linear-gradient(to bottom, ${t.gold}, transparent)` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
