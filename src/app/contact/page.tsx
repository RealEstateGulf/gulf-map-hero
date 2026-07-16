'use client';

import { useState } from 'react';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle2,
  MessageSquare, Building2,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import { useContent } from '@/hooks/useContent';
import Navbar from '@/components/map/Navbar';
import FooterSection from '@/components/sections/FooterSection';

const OFFICES = [
  {
    cityAr: 'دبي',
    cityEn: 'Dubai',
    cityCode: 'DUBAI',
    countryAr: 'الإمارات العربية المتحدة',
    countryEn: 'United Arab Emirates',
    flag: '🇦🇪',
    addressAr: 'برج خليفة، شارع الشيخ زايد، وسط مدينة دبي',
    addressEn: 'Burj Khalifa, Sheikh Zayed Road, Downtown Dubai',
    phone: '+971 4 XXX XXXX',
    whatsapp: '+971 5X XXX XXXX',
    email: 'dubai@gulfinvest.com.tr',
    hoursAr: 'الأحد – الخميس: 9:00 – 18:00',
    hoursEn: 'Sunday – Thursday: 9:00 – 18:00',
    photo: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
    mapEmbed: 'https://maps.google.com/?q=Burj+Khalifa+Dubai',
  },
  {
    cityAr: 'إسطنبول',
    cityEn: 'Istanbul',
    cityCode: 'ISTANBUL',
    countryAr: 'تركيا',
    countryEn: 'Turkey',
    flag: '🇹🇷',
    addressAr: 'شارع بغداد، كاديكوي، إسطنبول 34710',
    addressEn: 'Baghdad Street, Kadikoy, Istanbul 34710',
    phone: '+90 212 XXX XXXX',
    whatsapp: '+90 555 000 0000',
    email: 'info@gulfinvest.com.tr',
    hoursAr: 'الاثنين – السبت: 9:00 – 19:00',
    hoursEn: 'Monday – Saturday: 9:00 – 19:00',
    photo: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80',
    mapEmbed: 'https://maps.google.com/?q=Bagdat+Caddesi+Kadikoy+Istanbul',
  },
];

export default function ContactPage() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();
  const tr = useT();
  const { get, getImg } = useContent('contact');

  return (
    <main style={{ background: t.bg, direction: dir, minHeight: '100vh' }}>
      <Navbar />
      <HeroSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <OfficesSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <FormSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} dir={dir} />
      <FooterSection />
    </main>
  );
}

function HeroSection({ t, isMobile, isAr, tr, get }: SP) {
  return (
    <div style={{
      height: isMobile ? 280 : 360,
      background: 'linear-gradient(160deg, #0a0a0a 0%, #181210 50%, #0a0a0a 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      borderBottom: `1px solid ${t.gold4}`,
      paddingTop: 64, textAlign: 'center',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'linear-gradient(rgba(217,186,160,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(217,186,160,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <p style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ display: 'inline-block', width: 28, height: 1, background: t.gold }} />
        {isAr ? 'نحن هنا لخدمتك' : 'We Are Here to Serve You'}
        <span style={{ display: 'inline-block', width: 28, height: 1, background: t.gold }} />
      </p>
      <h1 style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: isMobile ? 'clamp(1.8rem,7vw,2.4rem)' : 'clamp(2.4rem,4.5vw,3.4rem)', margin: '0 0 16px', position: 'relative' }}>
        {get('hero.title', isAr, tr('contact.title'))}
      </h1>
      <p style={{ color: t.txt3, fontSize: '0.88rem', maxWidth: 420, padding: '0 20px', lineHeight: 1.8, position: 'relative' }}>
        {get('hero.subtitle', isAr, tr('contact.subtitle'))}
      </p>
    </div>
  );
}

function OfficesSection({ t, isMobile, isAr, tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '48px 18px 20px' : '72px 32px 32px' }}>
      <div ref={ref} style={{ marginBottom: isMobile ? 32 : 48 }}>
        <p style={{ ...rv(visible, 0), color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-block', width: 20, height: 1, background: t.gold }} />
          {isAr ? 'مكاتبنا' : 'Our Offices'}
        </p>
        <h2 style={{ ...rv(visible, 0.08), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.4rem,5vw,2rem)' : 'clamp(1.7rem,2.8vw,2.4rem)', margin: 0 }}>
          {isAr ? 'نلقاك في قلب المنطقة' : 'We Meet You at the Heart of the Region'}
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        {OFFICES.map((office, i) => (
          <div key={i} style={{
            ...rv(visible, 0.1 + i * 0.14),
            background: t.altBg, border: `1px solid ${t.border}`,
            borderRadius: 10, overflow: 'hidden',
            transition: 'border-color 0.3s, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.gold3; el.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.border; el.style.transform = 'translateY(0)'; }}
          >
            <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={office.photo} alt={isAr ? office.cityAr : office.cityEn} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)' }} />
              <div style={{ position: 'absolute', bottom: 16, right: 16 }}>
                <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {office.cityCode} · {office.flag}
                </div>
                <div style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: '1.5rem', lineHeight: 1 }}>
                  {isAr ? office.cityAr : office.cityEn}
                </div>
              </div>
            </div>
            <div style={{ padding: '24px 24px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                <Building2 size={12} color={t.gold} />
                <span style={{ color: t.gold, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em' }}>{isAr ? office.countryAr : office.countryEn}</span>
              </div>
              {[
                { Icon: MapPin, text: isAr ? office.addressAr : office.addressEn },
                { Icon: Phone, text: office.phone, sub: `${isAr ? 'واتساب' : 'WhatsApp'}: ${office.whatsapp}` },
                { Icon: Mail, text: office.email },
                { Icon: Clock, text: isAr ? office.hoursAr : office.hoursEn },
              ].map(({ Icon, text, sub }, j) => (
                <div key={j} style={{ display: 'flex', gap: 12, marginBottom: j < 3 ? 14 : 0, alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, flexShrink: 0, background: t.gold5, border: `1px solid ${t.gold4}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={13} color={t.gold} />
                  </div>
                  <div>
                    <div style={{ color: t.txt2, fontSize: '0.82rem', lineHeight: 1.5 }}>{text}</div>
                    {sub && <div style={{ color: t.txt4, fontSize: '0.72rem', marginTop: 2 }}>{sub}</div>}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${t.border}` }}>
                <a href={office.mapEmbed} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: t.gold, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textDecoration: 'none', textTransform: 'uppercase', transition: 'gap 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '10px'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '6px'; }}
                >
                  <MapPin size={12} />
                  {isAr ? 'عرض على الخريطة ←' : 'View on Map →'}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FormSection({ t, isMobile, isAr, tr, dir }: SP & { dir: 'rtl' | 'ltr' }) {
  const { ref, visible } = useScrollReveal();
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const SUBJECTS = isAr
    ? ['استفسار عام', 'طلب عرض سعر', 'حجز موعد استشارة', 'معلومات الجنسية التركية', 'عضوية VIP', 'شكوى أو اقتراح']
    : ['General inquiry', 'Quote request', 'Book consultation', 'Turkish citizenship info', 'VIP membership', 'Complaint or suggestion'];

  const set = (f: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.message) {
      setError(isAr ? 'يرجى ملء جميع الحقول الإلزامية' : 'Please fill in all required fields');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1100);
  };

  const inp: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${t.border2}`, borderRadius: 6,
    color: t.txt, fontSize: '0.85rem', padding: '12px 14px',
    outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'inherit', direction: dir, boxSizing: 'border-box',
  };

  return (
    <section style={{ background: t.altBg, borderTop: `1px solid ${t.border}`, padding: isMobile ? '48px 0 60px' : '72px 0 100px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr', gap: isMobile ? 44 : 72, alignItems: 'start' }}>
          {/* Info */}
          <div style={rv(visible, 0)}>
            <p style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-block', width: 20, height: 1, background: t.gold }} />
              {isAr ? 'أرسل رسالة' : 'Send a Message'}
            </p>
            <h2 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.5rem,5vw,2rem)' : 'clamp(1.7rem,2.8vw,2.4rem)', lineHeight: 1.3, marginBottom: 18 }}>
              {isAr ? <>كيف يمكننا<br /><em style={{ color: t.gold }}>مساعدتك اليوم؟</em></> : <>How Can We<br /><em style={{ color: t.gold }}>Help You Today?</em></>}
            </h2>
            <p style={{ color: t.txt3, fontSize: '0.87rem', lineHeight: 1.9, marginBottom: 36, maxWidth: 360 }}>
              {isAr
                ? 'سواء كنت تبحث عن عقارك الأول في تركيا أو تريد توسيع محفظتك الاستثمارية — فريقنا المتخصص جاهز للإجابة على كل استفساراتك.'
                : 'Whether you\'re looking for your first property in Turkey or want to expand your investment portfolio — our specialized team is ready to answer all your inquiries.'}
            </p>
            {[
              { Icon: MessageSquare, titleAr: 'رد سريع', titleEn: 'Quick Response', descAr: 'نلتزم بالرد خلال 4 ساعات عمل', descEn: 'We respond within 4 working hours' },
              { Icon: Phone, titleAr: 'اتصل مباشرة', titleEn: 'Call Directly', descAr: 'متاحون على واتساب 6 أيام بالأسبوع', descEn: 'Available on WhatsApp 6 days a week' },
              { Icon: Mail, titleAr: 'بريد إلكتروني', titleEn: 'Email', descAr: 'info@gulfinvest.com.tr', descEn: 'info@gulfinvest.com.tr' },
            ].map(({ Icon, titleAr, titleEn, descAr, descEn }, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < 2 ? 20 : 0, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, flexShrink: 0, background: t.gold5, border: `1px solid ${t.gold4}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={t.gold} strokeWidth={1.4} />
                </div>
                <div>
                  <div style={{ color: t.txt, fontSize: '0.86rem', fontWeight: 600, marginBottom: 3 }}>{isAr ? titleAr : titleEn}</div>
                  <div style={{ color: t.txt4, fontSize: '0.78rem' }}>{isAr ? descAr : descEn}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={rv(visible, 0.12)}>
            <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: `linear-gradient(135deg, ${t.gold5}, rgba(217,186,160,0.02))`, borderBottom: `1px solid ${t.gold4}`, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, background: t.gold5, border: `1px solid ${t.gold4}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={12} color={t.gold} />
                </div>
                <div style={{ color: t.txt, fontSize: '0.86rem', fontWeight: 600 }}>{isAr ? 'نموذج التواصل' : 'Contact Form'}</div>
              </div>

              {submitted ? (
                <div style={{ padding: '52px 24px', textAlign: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: `${t.gold}18`, border: `1.5px solid ${t.gold3}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                    <CheckCircle2 size={26} color={t.gold} strokeWidth={1.4} />
                  </div>
                  <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '1.2rem', marginBottom: 10 }}>
                    {tr('contact.form.success')}
                  </h3>
                  <p style={{ color: t.txt3, fontSize: '0.85rem', lineHeight: 1.8, maxWidth: 300, margin: '0 auto' }}>
                    {isAr ? <>شكراً <strong style={{ color: t.txt2 }}>{form.name}</strong>، سيتواصل معك أحد مستشارينا قريباً.</> : <>Thank you <strong style={{ color: t.txt2 }}>{form.name}</strong>, one of our advisors will contact you soon.</>}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ padding: '22px 24px 26px' }} noValidate>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0 14px' }}>
                    <FField label={tr('contact.form.name')}>
                      <input type="text" placeholder={isAr ? 'اسمك' : 'Your Name'} value={form.name} onChange={set('name')} style={inp}
                        onFocus={e => { e.target.style.borderColor = t.gold3; }} onBlur={e => { e.target.style.borderColor = t.border2; }} />
                    </FField>
                    <FField label={tr('contact.form.phone')}>
                      <input type="tel" placeholder="+971 5X XXX XXXX" value={form.phone} onChange={set('phone')}
                        style={{ ...inp, direction: 'ltr', textAlign: dir === 'rtl' ? 'right' : 'left' }}
                        onFocus={e => { e.target.style.borderColor = t.gold3; }} onBlur={e => { e.target.style.borderColor = t.border2; }} />
                    </FField>
                  </div>
                  <FField label={tr('contact.form.email')}>
                    <input type="email" placeholder="email@example.com" value={form.email} onChange={set('email')}
                      style={{ ...inp, direction: 'ltr', textAlign: dir === 'rtl' ? 'right' : 'left' }}
                      onFocus={e => { e.target.style.borderColor = t.gold3; }} onBlur={e => { e.target.style.borderColor = t.border2; }} />
                  </FField>
                  <FField label={isAr ? 'موضوع الرسالة' : 'Message Subject'}>
                    <div style={{ position: 'relative' }}>
                      <select value={form.subject} onChange={set('subject')}
                        style={{ ...inp, appearance: 'none', WebkitAppearance: 'none', color: form.subject ? t.txt : t.txt4 }}
                        onFocus={e => { e.target.style.borderColor = t.gold3; }} onBlur={e => { e.target.style.borderColor = t.border2; }}>
                        <option value="" style={{ background: '#111' }}>{isAr ? 'اختر الموضوع (اختياري)' : 'Choose subject (optional)'}</option>
                        {SUBJECTS.map(s => <option key={s} value={s} style={{ background: '#111', color: '#fff' }}>{s}</option>)}
                      </select>
                      <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: t.txt4, fontSize: '0.6rem', pointerEvents: 'none' }}>▼</div>
                    </div>
                  </FField>
                  <FField label={tr('contact.form.message') + ' *'}>
                    <textarea placeholder={isAr ? 'أخبرنا عن استفسارك أو طلبك بالتفصيل…' : 'Tell us about your inquiry or request in detail…'} value={form.message} onChange={set('message')} rows={5}
                      style={{ ...inp, resize: 'vertical', minHeight: 110 }}
                      onFocus={e => { e.target.style.borderColor = t.gold3; }} onBlur={e => { e.target.style.borderColor = t.border2; }} />
                  </FField>
                  {error && (
                    <div style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.25)', borderRadius: 6, padding: '10px 14px', color: '#e07070', fontSize: '0.8rem', marginBottom: 14 }}>{error}</div>
                  )}
                  <button type="submit" disabled={loading} style={{
                    width: '100%', background: loading ? t.gold4 : t.gold, border: 'none',
                    borderRadius: 6, color: t.goldText, fontSize: '0.8rem', fontWeight: 700,
                    padding: '13px', cursor: loading ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.07em', textTransform: 'uppercase', transition: 'opacity 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.85'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                  >
                    {loading
                      ? <><Spinner />&nbsp;{tr('contact.form.sending')}</>
                      : <><Send size={13} /> {tr('contact.form.submit')}</>
                    }
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </section>
  );
}

function FField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.67rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Spinner() {
  return <span style={{ display: 'inline-block', width: 13, height: 13, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />;
}

interface SP {
  t: ReturnType<typeof useTheme>['t'];
  isMobile: boolean;
  isAr: boolean;
  tr: (key: any) => string;
  get: (key: string, isAr: boolean, fallback?: string) => string;
  getImg: (key: string, fallback?: string) => string;
}
