'use client';

import { Phone, Mail, MapPin, Share2, MessageCircle, Globe } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useT } from '@/hooks/useT';
import { useLanguage } from '@/context/LanguageContext';

const TEAM = [
  {
    name: 'أحمد يلدز',
    role: 'مستشار استثمار عقاري',
    photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'ليلى شاهين',
    role: 'خبيرة السوق العقاري التركي',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  },
];

const linkStyle = {
  background: 'none', border: 'none',
  color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem',
  cursor: 'pointer', padding: 0, textAlign: 'right' as const,
  transition: 'color 0.2s', textDecoration: 'none', display: 'block',
};

export default function FooterSection() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const tr = useT();
  const { dir, isAr } = useLanguage();

  const QUICK_LINKS = [
    { label: tr('footer.links.properties'), href: '/properties' },
    { label: tr('footer.links.citizenship'), href: '/citizenship' },
    { label: tr('footer.links.services'), href: '/services' },
    { label: tr('footer.links.about'), href: '/about' },
    { label: tr('footer.links.contact'), href: '/contact' },
  ];

  const SERVICES_LINKS = [
    { label: tr('footer.services.search'), href: '/services' },
    { label: tr('footer.services.manage'), href: '/services' },
    { label: tr('footer.services.legal'), href: '/services' },
    { label: tr('footer.services.negotiate'), href: '/services' },
    { label: tr('footer.services.support'), href: '/services' },
  ];

  return (
    <footer style={{ background: '#090909', direction: dir }}>

      {/* CTA banner */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: isMobile ? '44px 18px' : '60px 32px' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', gap: 24,
        }}>
          <div>
            <p style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 10 }}>
              {isAr ? 'ابدأ رحلتك الآن' : 'Start Your Journey Now'}
            </p>
            <h3 style={{
              fontFamily: "'Marcellus', serif", color: '#ffffff',
              fontSize: isMobile ? 'clamp(1.2rem, 5vw, 1.6rem)' : 'clamp(1.4rem, 2.5vw, 2rem)',
              margin: 0, lineHeight: 1.3,
            }}>
              {isAr ? 'هل أنت مستعد لبدء رحلتك الاستثمارية؟' : 'Ready to start your investment journey?'}
            </h3>
          </div>
          <Link
            href="/contact"
            style={{
              background: t.gold, border: 'none', borderRadius: 4,
              color: t.goldText, fontSize: '0.75rem', fontWeight: 600,
              padding: '14px 28px', cursor: 'pointer',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              whiteSpace: 'nowrap', transition: 'opacity 0.2s',
              alignSelf: isMobile ? 'flex-start' : 'center',
              textDecoration: 'none', display: 'inline-block',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.8'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
          >
            {tr('cta.consult')}
          </Link>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '48px 18px 36px' : '72px 32px 52px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : '1.6fr 1fr 1fr 1.2fr',
          gap: isMobile ? 32 : 48,
        }}>

          {/* Brand — full width on mobile */}
          <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', marginBottom: 22, textDecoration: 'none' }}>
              <div style={{ background: '#070707', borderRadius: 6, padding: '2px 6px', display: 'flex', alignItems: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-miftah.png" alt="Miftah Turkiye" style={{ height: 38, width: 'auto', mixBlendMode: 'screen', objectFit: 'contain', display: 'block' }} />
              </div>
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', lineHeight: 1.85, marginBottom: 28, maxWidth: 270 }}>
              {tr('footer.tagline')}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[Share2, MessageCircle, Globe].map((Icon, i) => (
                <button
                  key={i}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'rgba(255,255,255,0.4)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.gold5; e.currentTarget.style.borderColor = t.gold3; e.currentTarget.style.color = t.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.75rem', marginBottom: 22, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {tr('footer.quicklinks')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {QUICK_LINKS.map(({ label, href }) => (
                <Link
                  key={href + label}
                  href={href}
                  style={linkStyle}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = t.gold; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.35)'; }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.75rem', marginBottom: 22, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {tr('footer.services')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SERVICES_LINKS.map(({ label, href }) => (
                <Link
                  key={href + label}
                  href={href}
                  style={linkStyle}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = t.gold; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.35)'; }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Team + contact — full width on mobile */}
          <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.75rem', marginBottom: 22, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {isAr ? 'فريقنا' : 'Our Team'}
            </div>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: isMobile ? 20 : 14, marginBottom: 28, flexWrap: 'wrap' }}>
              {TEAM.map(({ name, role, photo }) => (
                <Link key={name} href="/about" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: `1px solid ${t.gold3}`, flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600 }}>{name}</div>
                    <div style={{ color: t.gold3, fontSize: '0.68rem', marginTop: 2 }}>{role}</div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { Icon: Phone, text: '+90 555 000 0000' },
                { Icon: Mail, text: 'info@gulfinvest.com.tr' },
                { Icon: MapPin, text: isAr ? 'إسطنبول — دبي' : 'Istanbul — Dubai' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={12} color={t.gold3} />
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.76rem' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: isMobile ? '16px 18px' : '18px 32px' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between', gap: isMobile ? 10 : 16, textAlign: 'center',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem' }}>
            © 2026 Miftah Turkiye — {tr('footer.copyright')}
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              isAr ? 'سياسة الخصوصية' : 'Privacy Policy',
              isAr ? 'الشروط والأحكام' : 'Terms & Conditions',
            ].map(link => (
              <button
                key={link}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = t.gold3; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.2)'; }}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
