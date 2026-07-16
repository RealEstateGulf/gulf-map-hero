'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { X, Sun, Moon, AlignRight, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useCurrency, CURRENCIES } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import { useContent } from '@/hooks/useContent';

export default function Navbar() {
  const { t, toggle } = useTheme();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { currency, setCurrency, currencyInfo } = useCurrency();
  const { lang, setLang, dir } = useLanguage();
  const tr = useT();
  const currRef = useRef<HTMLDivElement>(null);
  const { getImg } = useContent('settings');
  const logoUrl = getImg('logo', '/logo-miftah.png');

  const NAV_ITEMS: { labelKey: 'nav.properties' | 'nav.citizenship' | 'nav.vip' | 'nav.insights' | 'nav.turkey' | 'nav.contact'; href: string }[] = [
    { labelKey: 'nav.properties', href: '/properties' },
    { labelKey: 'nav.citizenship', href: '/citizenship' },
    { labelKey: 'nav.vip', href: '/vip' },
    { labelKey: 'nav.insights', href: '/insights' },
    { labelKey: 'nav.turkey', href: '/turkey' },
    { labelKey: 'nav.contact', href: '/contact' },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (currRef.current && !currRef.current.contains(e.target as Node)) setCurrencyOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 16px' : '0 24px',
        background: t.navbar, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${t.gold4}`, boxShadow: t.shadow,
        direction: 'ltr', transition: 'background 0.4s ease, box-shadow 0.4s ease',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
          <div style={{ background: '#070707', borderRadius: 8, padding: '2px 4px', display: 'flex', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Miftah Turkiye"
              style={{
                height: isMobile ? 38 : 46,
                width: 'auto',
                mixBlendMode: 'screen',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
        </Link>

        {/* Desktop nav */}
        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 24, direction: dir === 'rtl' ? 'rtl' : 'ltr' }}>
            {NAV_ITEMS.map(({ labelKey, href }) => {
              const label = tr(labelKey);
              const isVip = labelKey === 'nav.vip';
              const baseStyle = {
                background: 'none', border: 'none',
                color: isVip ? t.gold : t.txt3,
                fontSize: '0.76rem', cursor: 'pointer', padding: 0,
                whiteSpace: 'nowrap' as const, transition: 'color 0.2s',
                fontWeight: isVip ? 600 : 400,
                textDecoration: 'none', fontFamily: 'inherit',
              };
              const inner = isVip
                ? <><span>{lang === 'ar' ? 'شبكة ' : 'VIP '}</span><span style={{ color: t.gold }}>{lang === 'ar' ? 'VIP' : 'Network'}</span></>
                : label;
              return (
                <Link key={labelKey} href={href} style={baseStyle}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = t.gold; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = isVip ? t.gold : t.txt3; }}
                >{inner}</Link>
              );
            })}
          </nav>
        )}

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {/* Theme toggle */}
          <button onClick={toggle} title={t.name === 'dark' ? 'Light mode' : 'Dark mode'}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.btn, border: `1px solid ${t.btnBorder}`, borderRadius: 8, padding: 7, color: t.txt3, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = t.gold; e.currentTarget.style.borderColor = t.gold3; }}
            onMouseLeave={e => { e.currentTarget.style.color = t.txt3; e.currentTarget.style.borderColor = t.btnBorder; }}
          >
            {t.name === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: t.btn, border: `1px solid ${t.btnBorder}`,
              borderRadius: 8, padding: '5px 10px',
              color: t.gold, fontSize: '0.72rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              letterSpacing: '0.05em',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.gold3; e.currentTarget.style.background = t.gold5; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.btnBorder; e.currentTarget.style.background = t.btn; }}
          >
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>

          {/* Currency picker */}
          {!isMobile && (
            <div ref={currRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setCurrencyOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: currencyOpen ? t.gold5 : t.btn,
                  border: `1px solid ${currencyOpen ? t.gold3 : t.btnBorder}`,
                  borderRadius: 6, padding: '5px 10px',
                  color: currencyOpen ? t.gold : t.txt3, fontSize: '0.72rem',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = t.gold3; el.style.color = t.gold; }}
                onMouseLeave={e => { if (!currencyOpen) { const el = e.currentTarget; el.style.borderColor = t.btnBorder; el.style.color = t.txt3; } }}
              >
                <span>{currencyInfo.flag}</span>
                <span>{currency}</span>
                <ChevronDown size={11} style={{ transform: currencyOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }} />
              </button>

              {currencyOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
                  background: '#0d0d0d', border: `1px solid ${t.gold4}`,
                  borderRadius: 8, overflow: 'hidden', minWidth: 180,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.5)', zIndex: 200,
                  direction: 'rtl',
                }}>
                  {CURRENCIES.map(c => (
                    <button key={c.code} onClick={() => { setCurrency(c.code); setCurrencyOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        background: c.code === currency ? t.gold5 : 'none',
                        border: 'none', borderBottom: `1px solid ${t.border}`,
                        padding: '10px 14px', cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (c.code !== currency) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { if (c.code !== currency) e.currentTarget.style.background = 'none'; }}
                    >
                      <span style={{ fontSize: '0.9rem' }}>{c.flag}</span>
                      <span style={{ color: c.code === currency ? t.gold : t.txt2, fontSize: '0.76rem' }}>{c.nameAr}</span>
                      <span style={{ color: t.txt4, fontSize: '0.68rem', marginRight: 'auto' }}>{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(o => !o)}
            style={{
              background: menuOpen ? t.gold5 : 'none', border: `1px solid ${menuOpen ? t.gold3 : 'transparent'}`,
              borderRadius: 8, color: menuOpen ? t.gold : t.txt3, cursor: 'pointer', display: 'flex', padding: 7, transition: 'all 0.2s',
            }}
          >
            {menuOpen ? <X size={18} /> : <AlignRight size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      <div style={{
        position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
        background: t.navbar, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${t.gold4}`,
        maxHeight: menuOpen ? '600px' : '0', overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{ padding: '8px 0 20px', direction: dir }}>
          {NAV_ITEMS.map(({ labelKey, href }, i) => {
            const label = tr(labelKey);
            const isVip = labelKey === 'nav.vip';
            const itemStyle = {
              display: 'block', width: '100%', background: 'none', border: 'none',
              color: isVip ? t.gold : t.txt2, fontSize: '0.95rem', cursor: 'pointer',
              padding: '14px 24px', textAlign: dir === 'rtl' ? 'right' as const : 'left' as const,
              fontWeight: isVip ? 600 : 400,
              borderBottom: i < NAV_ITEMS.length - 1 ? `1px solid ${t.border}` : 'none',
              transition: 'color 0.2s, background 0.2s', textDecoration: 'none', fontFamily: 'inherit',
            };
            return (
              <Link key={labelKey} href={href} onClick={() => setMenuOpen(false)} style={itemStyle}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = t.gold; el.style.background = t.gold6; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.color = isVip ? t.gold : t.txt2; el.style.background = 'none'; }}
              >{label}</Link>
            );
          })}

          {/* Mobile language toggle */}
          <div style={{ padding: '16px 24px 0', borderTop: `1px solid ${t.border}`, marginTop: 8 }}>
            <div style={{ color: t.txt4, fontSize: '0.65rem', marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {lang === 'ar' ? 'اللغة' : 'Language'}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['ar', 'en'] as const).map(l => (
                <button key={l} onClick={() => { setLang(l); setMenuOpen(false); }}
                  style={{
                    background: lang === l ? t.gold : t.btn,
                    border: `1px solid ${lang === l ? t.gold : t.border}`,
                    borderRadius: 4, padding: '5px 14px', cursor: 'pointer',
                    color: lang === l ? t.goldText : t.txt3,
                    fontSize: '0.75rem', fontFamily: 'inherit', fontWeight: 700, transition: 'all 0.2s',
                  }}
                >
                  {l === 'ar' ? 'العربية' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile currency picker */}
          <div style={{ padding: '16px 24px 0', borderTop: `1px solid ${t.border}`, marginTop: 8 }}>
            <div style={{ color: t.txt4, fontSize: '0.65rem', marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {lang === 'ar' ? 'العملة' : 'Currency'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CURRENCIES.map(c => (
                <button key={c.code} onClick={() => setCurrency(c.code)}
                  style={{
                    background: c.code === currency ? t.gold : t.btn,
                    border: `1px solid ${c.code === currency ? t.gold : t.border}`,
                    borderRadius: 4, padding: '5px 10px', cursor: 'pointer',
                    color: c.code === currency ? t.goldText : t.txt3,
                    fontSize: '0.7rem', fontFamily: 'inherit', transition: 'all 0.2s',
                  }}
                >
                  {c.flag} {c.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
