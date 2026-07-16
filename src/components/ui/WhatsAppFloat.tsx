'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Phone, Send } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useT } from '@/hooks/useT';
import { useLanguage } from '@/context/LanguageContext';

const SESSION_KEY = 'gi_popup_dismissed';

type PopupSettings = {
  enabled: boolean; delay_minutes: number;
  title_ar: string; title_en: string;
  subtitle_ar: string; subtitle_en: string;
  wa_number: string; wa_text_ar: string; wa_text_en: string;
  leave_text_ar: string; leave_text_en: string;
  success_ar: string; success_en: string;
};

const DEFAULTS: PopupSettings = {
  enabled: true, delay_minutes: 2,
  title_ar: 'تواصل معنا', title_en: 'Contact Us',
  subtitle_ar: 'اختر طريقة التواصل المفضلة لديك', subtitle_en: 'Choose your preferred contact method',
  wa_number: '905072308453', wa_text_ar: 'انضم لقناة واتساب', wa_text_en: 'Join WhatsApp Channel',
  leave_text_ar: 'اترك رقمك وسنتصل بك', leave_text_en: "Leave your number, we'll call you",
  success_ar: 'شكراً لك!', success_en: 'Thank You!',
};

export default function WhatsAppFloat() {
  const { t } = useTheme();
  const tr = useT();
  const { dir, isAr } = useLanguage();
  const [cfg, setCfg] = useState<PopupSettings>(DEFAULTS);
  const [btnClicked, setBtnClicked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tab, setTab] = useState<'main' | 'form' | 'success'>('main');
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Fetch popup settings from DB
    fetch('/api/popup-settings')
      .then(r => r.ok ? r.json() : null)
      .then((data: PopupSettings | null) => {
        if (data) setCfg(data);
        const settings = data ?? DEFAULTS;
        if (!settings.enabled) return;
        if (sessionStorage.getItem(SESSION_KEY)) return;
        const delay = (settings.delay_minutes ?? 2) * 60 * 1000;
        timerRef.current = setTimeout(() => {
          setShowPopup(true);
          requestAnimationFrame(() => requestAnimationFrame(() => setPopupVisible(true)));
        }, delay);
      })
      .catch(() => {
        // Fallback to defaults
        if (sessionStorage.getItem(SESSION_KEY)) return;
        timerRef.current = setTimeout(() => {
          setShowPopup(true);
          requestAnimationFrame(() => requestAnimationFrame(() => setPopupVisible(true)));
        }, DEFAULTS.delay_minutes * 60 * 1000);
      });
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const dismissPopup = () => {
    setPopupVisible(false);
    sessionStorage.setItem(SESSION_KEY, '1');
    setTimeout(() => setShowPopup(false), 380);
  };

  const waUrl = `https://wa.me/${cfg.wa_number}`;

  const handleBtnClick = () => {
    setBtnClicked(true);
    setTimeout(() => setBtnClicked(false), 400);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTab('success');
    }, 1200);
  };

  return (
    <>
      <style>{`
        @keyframes waPulse {
          0%   { transform: scale(1); opacity: 0.7; }
          70%  { transform: scale(1.7); opacity: 0; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes waBtnBounce {
          0%   { transform: scale(1); }
          40%  { transform: scale(0.85); }
          70%  { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        @keyframes waSlideUp {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes waSpinAnim {
          to { transform: rotate(360deg); }
        }
        .wa-pulse-ring {
          position: absolute; inset: -3px; border-radius: 50%;
          border: 2px solid #25D366;
          animation: waPulse 2s cubic-bezier(0.22,1,0.36,1) infinite;
        }
        .wa-pulse-ring-2 {
          position: absolute; inset: -3px; border-radius: 50%;
          border: 2px solid #25D366;
          animation: waPulse 2s cubic-bezier(0.22,1,0.36,1) infinite 0.7s;
        }
        .wa-btn-clicked { animation: waBtnBounce 0.4s cubic-bezier(0.22,1,0.36,1); }
        .wa-popup-enter { animation: waSlideUp 0.38s cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>

      {/* ── Floating button ───────────────────────────────────────── */}
      <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9000, direction: 'ltr' }}>
        {/* Tooltip */}
        {showTooltip && !btnClicked && (
          <div style={{
            position: 'absolute', bottom: '100%', right: 0, marginBottom: 10,
            background: 'rgba(10,10,10,0.92)', border: '1px solid rgba(37,211,102,0.3)',
            borderRadius: 6, padding: '7px 14px', whiteSpace: 'nowrap',
            color: '#fff', fontSize: '0.72rem', fontWeight: 500,
            backdropFilter: 'blur(8px)', direction: dir,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}>
            {tr('wa.tooltip')}
            <div style={{
              position: 'absolute', bottom: -5, right: 20,
              width: 10, height: 10, background: 'rgba(10,10,10,0.92)',
              border: '1px solid rgba(37,211,102,0.3)', borderTop: 'none', borderLeft: 'none',
              transform: 'rotate(45deg)',
            }} />
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleBtnClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={btnClicked ? 'wa-btn-clicked' : ''}
          style={{
            position: 'relative', width: 58, height: 58, borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            border: 'none', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 28px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.3)',
            transition: 'box-shadow 0.2s',
          }}
          onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 36px rgba(37,211,102,0.65), 0 2px 8px rgba(0,0,0,0.3)'; }}
          onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.3)'; }}
        >
          <div className="wa-pulse-ring" />
          <div className="wa-pulse-ring-2" />
          {/* WhatsApp icon */}
          <svg viewBox="0 0 24 24" fill="white" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>
      </div>

      {/* ── 2-minute popup ────────────────────────────────────────── */}
      {showPopup && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            opacity: popupVisible ? 1 : 0,
            transition: 'opacity 0.38s ease',
          }}
          onClick={e => { if (e.target === e.currentTarget) dismissPopup(); }}
        >
          <div
            className={popupVisible ? 'wa-popup-enter' : ''}
            style={{
              background: '#0c0c0c',
              border: `1px solid ${t.gold4}`,
              borderRadius: 12,
              width: '100%', maxWidth: 420,
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(217,186,160,0.06)',
              direction: dir,
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 22px 16px',
              borderBottom: `1px solid rgba(255,255,255,0.06)`,
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: 'linear-gradient(135deg,#25D366,#128C7E)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg viewBox="0 0 24 24" fill="white" width="15" height="15">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <span style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Miftah Turkiye
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: '1.1rem', margin: 0, lineHeight: 1.3 }}>
                  {tab === 'success' ? (isAr ? cfg.success_ar : cfg.success_en) : (isAr ? cfg.title_ar : cfg.title_en)}
                </h3>
              </div>
              <button
                onClick={dismissPopup}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 6, width: 30, height: 30, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s', flexShrink: 0,
                }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.1)'; el.style.color = '#fff'; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(255,255,255,0.06)'; el.style.color = 'rgba(255,255,255,0.5)'; }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 22px 24px' }}>

              {tab === 'main' && (
                <>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', lineHeight: 1.75, margin: '0 0 20px' }}>
                    {isAr ? cfg.subtitle_ar : cfg.subtitle_en}
                  </p>

                  {/* Option 1: WhatsApp */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={dismissPopup}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                      borderRadius: 8, padding: '14px 18px', textDecoration: 'none',
                      marginBottom: 12, transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.88'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
                  >
                    <svg viewBox="0 0 24 24" fill="white" width="22" height="22" style={{ flexShrink: 0 }}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>{isAr ? cfg.wa_text_ar : cfg.wa_text_en}</div>
                      <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.7rem', marginTop: 2 }}>
                        {isAr ? 'تواصل فوري مع خبير متخصص' : 'Instant contact with a specialist'}
                      </div>
                    </div>
                  </a>

                  {/* Divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', flexShrink: 0 }}>{isAr ? 'أو' : 'or'}</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                  </div>

                  {/* Option 2: Leave number */}
                  <button
                    onClick={() => setTab('form')}
                    style={{
                      width: '100%', background: 'rgba(217,186,160,0.07)',
                      border: `1px solid ${t.gold4}`, borderRadius: 8,
                      padding: '13px 18px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 12,
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = t.gold; el.style.background = 'rgba(217,186,160,0.12)'; }}
                    onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = t.gold4; el.style.background = 'rgba(217,186,160,0.07)'; }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: t.gold5, border: `1px solid ${t.gold4}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={16} color={t.gold} strokeWidth={1.5} />
                    </div>
                    <div style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{isAr ? cfg.leave_text_ar : cfg.leave_text_en}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: 2 }}>
                        {isAr ? 'استشارة مجانية خلال 24 ساعة' : 'Free consultation within 24 hours'}
                      </div>
                    </div>
                  </button>
                </>
              )}

              {tab === 'form' && (
                <form onSubmit={handleFormSubmit}>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 18px', lineHeight: 1.7 }}>
                    {isAr ? 'أدخل بياناتك وسيتواصل معك أحد خبرائنا خلال 24 ساعة.' : 'Enter your details and one of our experts will contact you within 24 hours.'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                    <input
                      type="text"
                      placeholder={tr('wa.popup.name')}
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 6, padding: '11px 14px', color: '#fff',
                        fontSize: '0.85rem', outline: 'none', direction: dir,
                        transition: 'border-color 0.2s',
                        fontFamily: 'inherit',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = t.gold3; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    />
                    <input
                      type="tel"
                      placeholder={tr('wa.popup.phone')}
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      required
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 6, padding: '11px 14px', color: '#fff',
                        fontSize: '0.85rem', outline: 'none', direction: 'ltr',
                        textAlign: dir === 'rtl' ? 'right' : 'left',
                        transition: 'border-color 0.2s',
                        fontFamily: 'inherit',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = t.gold3; }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', background: t.gold, border: 'none',
                      borderRadius: 6, padding: '12px', cursor: loading ? 'not-allowed' : 'pointer',
                      color: t.goldText, fontWeight: 700, fontSize: '0.82rem',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      opacity: loading ? 0.8 : 1, transition: 'opacity 0.2s',
                    }}
                  >
                    {loading ? (
                      <span style={{ width: 16, height: 16, border: `2px solid ${t.goldText}`, borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'waSpinAnim 0.8s linear infinite' }} />
                    ) : (
                      <><Send size={14} /> {tr('wa.popup.send')}</>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab('main')}
                    style={{
                      width: '100%', background: 'none', border: 'none',
                      color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem',
                      cursor: 'pointer', padding: '10px 0 0', transition: 'color 0.2s',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                  >
                    {isAr ? '← رجوع' : '← ' + tr('wa.popup.back')}
                  </button>
                </form>
              )}

              {tab === 'success' && (
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 18px',
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" width="28" height="28">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.84rem', lineHeight: 1.8, margin: '0 0 20px' }}>
                    {tr('wa.popup.success.sub')}
                  </p>
                  <button
                    onClick={dismissPopup}
                    style={{
                      background: t.gold5, border: `1px solid ${t.gold4}`,
                      borderRadius: 6, padding: '10px 24px', color: t.gold,
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = t.gold4; }}
                    onMouseLeave={e => { e.currentTarget.style.background = t.gold5; }}
                  >
                    {isAr ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
