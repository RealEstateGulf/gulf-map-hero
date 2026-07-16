'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import { useContent } from '@/hooks/useContent';
import Navbar from '@/components/map/Navbar';
import FooterSection from '@/components/sections/FooterSection';
import {
  Lock, Star, TrendingUp, Users, CalendarCheck, FileText,
  ShieldCheck, BadgeCheck, Globe2, Gem, Crown, Sparkles,
  CheckCircle2, Send,
} from 'lucide-react';

// ─── data ────────────────────────────────────────────────────────────────────

const PRIVILEGES = [
  { Icon: Lock, titleAr: 'عقارات ما قبل الطرح', titleEn: 'Pre-launch Properties', descAr: 'وصول حصري لعقارات off-market قبل أن تُعلَن للعموم بأسعار مبكرة مميزة.', descEn: 'Exclusive access to off-market properties before they are publicly announced at special early prices.' },
  { Icon: Users, titleAr: 'مستشار شخصي مخصص', titleEn: 'Dedicated Personal Advisor', descAr: 'مستشار استثماري عربي مخصص لك بالكامل — متاح 6 أيام في الأسبوع لخدمتك.', descEn: 'A fully dedicated Arab investment advisor — available 6 days a week at your service.' },
  { Icon: CalendarCheck, titleAr: 'جولات ميدانية VIP', titleEn: 'VIP Field Tours', descAr: 'دعوات حصرية لجولات مشاريع استثمارية في تركيا مع استقبال واستضافة على نفقتنا.', descEn: 'Exclusive invitations to investment project tours in Turkey with complimentary reception and hosting at our expense.' },
  { Icon: TrendingUp, titleAr: 'أولوية في الصفقات', titleEn: 'Priority in Deals', descAr: 'الأولوية المطلقة في الصفقات ذات العائد الأعلى وفرص الشراء قبل رفع السعر.', descEn: 'Absolute priority in highest-yield deals and buying opportunities before price increases.' },
  { Icon: FileText, titleAr: 'تقارير السوق الشهرية', titleEn: 'Monthly Market Reports', descAr: 'تحليلات حصرية ومعمّقة للسوق العقاري التركي مع توقعات الأسعار والمناطق الواعدة.', descEn: 'Exclusive in-depth analyses of the Turkish real estate market with price forecasts and promising areas.' },
  { Icon: ShieldCheck, titleAr: 'دعم قانوني ومالي', titleEn: 'Legal & Financial Support', descAr: 'فريق قانوني ومالي مخصص لتسهيل إجراءات الملكية والجنسية والتمويل من أوّل خطوة.', descEn: 'A dedicated legal and financial team to facilitate ownership, citizenship and financing procedures from the first step.' },
];

const STATS = [
  { value: '+180', labelAr: 'عضو VIP نشط', labelEn: 'Active VIP Member' },
  { value: '+420', labelAr: 'صفقة أُغلقت بنجاح', labelEn: 'Deal Closed Successfully' },
  { value: '18٪', labelAr: 'متوسط العائد السنوي', labelEn: 'Avg Annual Return' },
  { value: '6', labelAr: 'مدن تركية مغطّاة', labelEn: 'Turkish Cities Covered' },
];

const TIERS = [
  {
    nameAr: 'فضي', nameEn: 'Silver', nameCode: 'SILVER',
    Icon: Star, min: '$250,000', color: '#A8B8C8',
    featuresAr: ['مستشار شخصي مخصص', 'تقارير السوق الشهرية', 'وصول لعقارات Off-Market', 'دعم قانوني متكامل'],
    featuresEn: ['Dedicated personal advisor', 'Monthly market reports', 'Access to Off-Market properties', 'Comprehensive legal support'],
  },
  {
    nameAr: 'ذهبي', nameEn: 'Gold', nameCode: 'GOLD',
    Icon: Crown, min: '$500,000', color: '#D9BAA0', featured: true,
    featuresAr: ['جميع مزايا الفضي', 'جولة ميدانية VIP مجانية', 'أولوية في الصفقات المميزة', 'إمكانية الشراء الجماعي', 'تحليلات ربعية حصرية'],
    featuresEn: ['All Silver benefits', 'Free VIP field tour', 'Priority in premium deals', 'Group purchase option', 'Exclusive quarterly analyses'],
  },
  {
    nameAr: 'بلاتيني', nameEn: 'Platinum', nameCode: 'PLATINUM',
    Icon: Gem, min: '$1,000,000', color: '#E8D5C4',
    featuresAr: ['جميع مزايا الذهبي', 'مدير ملف استثماري دائم', 'اجتماعات إستراتيجية ربعية', 'عروض مشاريع حصرية قبل الإطلاق', 'دعوة لمنتدى المستثمرين السنوي', 'خدمة نقل VIP داخل تركيا'],
    featuresEn: ['All Gold benefits', 'Permanent investment file manager', 'Quarterly strategic meetings', 'Exclusive pre-launch project offers', 'Invitation to annual investor forum', 'VIP transportation inside Turkey'],
  },
];

const TESTIMONIALS = [
  { name: 'خالد المنصور', roleAr: 'عضو بلاتيني — المملكة العربية السعودية', roleEn: 'Platinum Member — Saudi Arabia', quote: 'الانضمام لشبكة VIP كان أذكى قرار استثماري اتخذته. وصلني عرض off-market قبل 3 أسابيع من طرحه للعموم وكان العائد 22% في أول سنة.', quoteEn: 'Joining the VIP network was the smartest investment decision I ever made. I received an off-market offer 3 weeks before it went public and the return was 22% in the first year.', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', tier: 'بلاتيني', tierEn: 'Platinum' },
  { name: 'نورة الزهراني', roleAr: 'عضو ذهبي — الإمارات العربية المتحدة', roleEn: 'Gold Member — UAE', quote: 'الجولة الميدانية التي نظمتموها كانت احترافية بامتياز. رأيت المشاريع بعيني وأغلقت صفقتين في نفس الأسبوع. شكراً للفريق.', quoteEn: 'The field tour you organized was exceptionally professional. I saw the projects with my own eyes and closed two deals in the same week. Thank you, team.', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', tier: 'ذهبي', tierEn: 'Gold' },
  { name: 'عبدالله الراشد', roleAr: 'عضو ذهبي — الكويت', roleEn: 'Gold Member — Kuwait', quote: 'ثلاث سنوات وأنا عضو في الشبكة — ستة عقارات، إيجار شهري ثابت، وجنسية تركية. لا أتخيل هذا المسار بدون فريقكم.', quoteEn: 'Three years as a network member — six properties, stable monthly rental income, and Turkish citizenship. I cannot imagine this path without your team.', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', tier: 'ذهبي', tierEn: 'Gold' },
];

const EVENTS = [
  { dateAr: 'سبتمبر 2025', dateEn: 'September 2025', titleAr: 'منتدى المستثمرين العرب — إسطنبول', titleEn: 'Arab Investors Forum — Istanbul', descAr: 'ملتقى سنوي حصري يجمع أبرز المستثمرين العرب ونخبة المطورين الأتراك.', descEn: 'An exclusive annual gathering bringing together leading Arab investors and top Turkish developers.' },
  { dateAr: 'أكتوبر 2025', dateEn: 'October 2025', titleAr: 'جولة مشاريع بورصة الكبرى', titleEn: 'Bursa Major Projects Tour', descAr: 'زيارة ميدانية لأفضل مشاريع بورصة الجديدة مع عروض حصرية لأعضاء VIP فقط.', descEn: 'A field visit to the best new Bursa projects with exclusive offers for VIP members only.' },
  { dateAr: 'نوفمبر 2025', dateEn: 'November 2025', titleAr: 'ندوة عقارية — دبي', titleEn: 'Real Estate Seminar — Dubai', descAr: 'نلقاكم في دبي لاستعراض خارطة الاستثمار في تركيا لعام 2026.', descEn: 'Join us in Dubai to review the Turkey investment roadmap for 2026.' },
];

// ─── page ─────────────────────────────────────────────────────────────────────

export default function VipPage() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();
  const tr = useT();
  const { get, getImg } = useContent('vip');

  return (
    <main style={{ background: t.bg, direction: dir, overflowX: 'hidden', minHeight: '100vh' }}>
      <Navbar />
      <HeroSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <PrivilegesSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <StatsSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <TiersSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <EventsSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <TestimonialsSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <RegistrationSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} dir={dir} />
      <FooterSection />
    </main>
  );
}

// ─── hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ t, isMobile, isAr, tr, get }: SP) {
  return (
    <div style={{
      minHeight: isMobile ? '80vh' : '90vh',
      background: '#070707',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      padding: isMobile ? '120px 24px 80px' : '160px 32px 100px',
      textAlign: 'center',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'linear-gradient(rgba(217,186,160,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(217,186,160,0.5) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: isMobile ? 400 : 700, height: isMobile ? 400 : 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,186,160,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', marginBottom: 32 }}>
        <div style={{ width: 56, height: 56, background: 'transparent', border: `1.5px solid ${t.gold}`, transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <div style={{ width: 24, height: 24, background: t.gold }} />
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: t.goldText, fontSize: '0.48rem', fontWeight: 800, letterSpacing: '0.12em' }}>VIP</div>
      </div>
      <p style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, position: 'relative' }}>
        <span style={{ display: 'inline-block', width: 36, height: 1, background: `linear-gradient(to left, ${t.gold}, transparent)` }} />
        {get('hero.title', isAr, tr('vip.title'))}
        <span style={{ display: 'inline-block', width: 36, height: 1, background: `linear-gradient(to right, ${t.gold}, transparent)` }} />
      </p>
      <h1 style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: isMobile ? 'clamp(2rem, 8vw, 2.8rem)' : 'clamp(2.8rem, 5vw, 4.4rem)', lineHeight: 1.18, margin: '0 0 24px', maxWidth: 680, position: 'relative' }}>
        {isAr ? <>الحلقة الضيّقة<br /><em style={{ color: t.gold }}>لكبار المستثمرين العرب</em><br />في السوق التركي</> : <>The Inner Circle<br /><em style={{ color: t.gold }}>For Major Arab Investors</em><br />in the Turkish Market</>}
      </h1>
      <p style={{ color: t.txt3, fontSize: isMobile ? '0.88rem' : '0.95rem', lineHeight: 1.9, maxWidth: 540, marginBottom: 44, position: 'relative' }}>
        {get('hero.subtitle', isAr, tr('vip.subtitle'))}
      </p>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', position: 'relative' }}>
        <button style={{ background: t.gold, border: 'none', borderRadius: 5, color: t.goldText, fontSize: '0.8rem', fontWeight: 700, padding: '14px 32px', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'opacity 0.2s, transform 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {isAr ? 'انضم للشبكة' : 'Join the Network'}
        </button>
        <button style={{ background: 'transparent', border: `1px solid ${t.border2}`, borderRadius: 5, color: t.txt2, fontSize: '0.8rem', padding: '14px 28px', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = t.gold3; e.currentTarget.style.color = t.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = t.border2; e.currentTarget.style.color = t.txt2; }}
        >
          {isAr ? 'تعرّف على المزايا' : 'Explore Benefits'}
        </button>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(to top, ${t.bg}, transparent)` }} />
    </div>
  );
}

// ─── privileges ───────────────────────────────────────────────────────────────

function PrivilegesSection({ t, isMobile, isAr, tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: t.altBg, borderTop: `1px solid ${t.gold4}`, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: isMobile ? 44 : 64 }}>
          <p style={{ ...rv(visible, 0), color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: t.gold }} />
            {isAr ? 'امتيازات العضوية' : 'Membership Privileges'}
            <span style={{ display: 'inline-block', width: 24, height: 1, background: t.gold }} />
          </p>
          <h2 style={{ ...rv(visible, 0.1), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.6rem, 6vw, 2.2rem)' : 'clamp(2rem, 3vw, 2.8rem)', lineHeight: 1.25, margin: 0 }}>
            {isAr ? 'ما تحصل عليه حين تنضم' : 'What You Gain When You Join'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 1, background: t.border, borderRadius: 10, overflow: 'hidden' }}>
          {PRIVILEGES.map(({ Icon, titleAr, titleEn, descAr, descEn }, i) => (
            <div key={i} style={{ ...rv(visible, 0.06 * i), background: t.bg, padding: isMobile ? '32px 24px' : '40px 32px', transition: 'background 0.3s ease', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = t.card; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = t.bg; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 8, background: t.gold5, border: `1px solid ${t.gold4}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Icon size={20} color={t.gold} strokeWidth={1.4} />
              </div>
              <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '1.05rem', margin: '0 0 10px' }}>{isAr ? titleAr : titleEn}</h3>
              <p style={{ color: t.txt3, fontSize: '0.83rem', lineHeight: 1.8, margin: 0 }}>{isAr ? descAr : descEn}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── stats ────────────────────────────────────────────────────────────────────

function StatsSection({ t, isMobile, isAr, tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: '#070707', borderTop: `1px solid ${t.gold4}`, borderBottom: `1px solid ${t.gold4}`, padding: isMobile ? '52px 0' : '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isMobile ? 32 : 0 }}>
          {STATS.map(({ value, labelAr, labelEn }, i) => (
            <div key={i} style={{ ...rv(visible, 0.1 * i), textAlign: 'center', padding: isMobile ? '0' : '0 32px', borderLeft: !isMobile && i > 0 ? `1px solid ${t.border}` : 'none' }}>
              <div style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: isMobile ? '2.2rem' : '2.8rem', lineHeight: 1, marginBottom: 8 }}>{value}</div>
              <div style={{ color: t.txt4, fontSize: '0.75rem', letterSpacing: '0.08em' }}>{isAr ? labelAr : labelEn}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── tiers ────────────────────────────────────────────────────────────────────

function TiersSection({ t, isMobile, isAr, tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: t.altBg, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: isMobile ? 44 : 64 }}>
          <p style={{ ...rv(visible, 0), color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: t.gold }} />
            {isAr ? 'مستويات العضوية' : 'Membership Tiers'}
            <span style={{ display: 'inline-block', width: 24, height: 1, background: t.gold }} />
          </p>
          <h2 style={{ ...rv(visible, 0.1), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.6rem, 6vw, 2.2rem)' : 'clamp(2rem, 3vw, 2.8rem)', margin: '0 0 14px' }}>
            {isAr ? 'اختر مستواك الاستثماري' : 'Choose Your Investment Level'}
          </h2>
          <p style={{ ...rv(visible, 0.15), color: t.txt3, fontSize: '0.88rem', maxWidth: 420, margin: '0 auto' }}>
            {isAr ? 'كلما كان حجم استثمارك أكبر، كانت مزاياك أوسع وفرصك أكثر حصرية' : 'The larger your investment, the wider your benefits and the more exclusive your opportunities'}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 20, alignItems: 'start' }}>
          {TIERS.map(({ nameAr, nameEn, nameCode, Icon, min, color, featured, featuresAr, featuresEn }, i) => (
            <div key={i} style={{
              ...rv(visible, 0.1 + i * 0.12),
              background: featured ? 'linear-gradient(160deg, #1a1510 0%, #0f0d0a 100%)' : t.bg,
              border: `1px solid ${featured ? t.gold : t.border}`,
              borderRadius: 10, overflow: 'hidden', position: 'relative',
              transform: featured && !isMobile ? 'scale(1.04)' : 'none',
              boxShadow: featured ? `0 0 60px rgba(217,186,160,0.1)` : 'none',
            }}>
              {featured && (
                <div style={{ background: t.gold, color: t.goldText, textAlign: 'center', fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.2em', padding: '6px 0', textTransform: 'uppercase' }}>
                  {isAr ? 'الأكثر اختياراً' : 'Most Popular'}
                </div>
              )}
              <div style={{ padding: isMobile ? '28px 24px' : '36px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={color} strokeWidth={1.4} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.52rem', color, letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase' }}>{nameCode}</div>
                    <div style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '1.3rem', lineHeight: 1 }}>{isAr ? nameAr : nameEn}</div>
                  </div>
                </div>
                <div style={{ background: `${color}0d`, border: `1px solid ${color}28`, borderRadius: 6, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: t.txt4, fontSize: '0.68rem' }}>{isAr ? 'الحد الأدنى للاستثمار' : 'Minimum Investment'}</span>
                  <span style={{ fontFamily: "'Marcellus', serif", color, fontSize: '1.1rem', fontWeight: 600 }}>{min}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                  {(isAr ? featuresAr : featuresEn).map((feat, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                      <BadgeCheck size={14} color={color} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ color: t.txt2, fontSize: '0.82rem', lineHeight: 1.5 }}>{feat}</span>
                    </div>
                  ))}
                </div>
                <button style={{
                  width: '100%', background: featured ? t.gold : 'transparent',
                  border: `1px solid ${featured ? t.gold : color + '66'}`,
                  borderRadius: 6, color: featured ? t.goldText : color,
                  fontSize: '0.75rem', fontWeight: 700, padding: '12px',
                  cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { if (!featured) { e.currentTarget.style.background = `${color}18`; } else { e.currentTarget.style.opacity = '0.85'; } }}
                  onMouseLeave={e => { if (!featured) { e.currentTarget.style.background = 'transparent'; } else { e.currentTarget.style.opacity = '1'; } }}
                >
                  {isAr ? `ابدأ بمستوى ${nameAr}` : `Start at ${nameEn}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── events ───────────────────────────────────────────────────────────────────

function EventsSection({ t, isMobile, isAr, tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: '#070707', borderTop: `1px solid ${t.gold4}`, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 44 : 80, alignItems: 'center' }}>
          <div style={rv(visible, 0)}>
            <p style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
              {isAr ? 'فعاليات حصرية' : 'Exclusive Events'}
            </p>
            <h2 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.6rem, 6vw, 2.2rem)' : 'clamp(1.9rem, 3vw, 2.6rem)', lineHeight: 1.3, margin: '0 0 20px' }}>
              {isAr ? <>نلتقي وجهاً لوجه<br /><em style={{ color: t.gold }}>حيث تُولد الصفقات الكبرى</em></> : <>Meet Face to Face<br /><em style={{ color: t.gold }}>Where Big Deals Are Born</em></>}
            </h2>
            <p style={{ color: t.txt3, fontSize: '0.88rem', lineHeight: 1.85, maxWidth: 380 }}>
              {isAr
                ? 'لأعضاء VIP دعوات دورية لفعاليات حصرية — منتديات استثمارية، جولات مشاريع، وأمسيات شبكية تجمعك بأبرز المطورين والمستثمرين.'
                : 'VIP members receive periodic invitations to exclusive events — investment forums, project tours, and networking evenings connecting you with top developers and investors.'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {EVENTS.map(({ dateAr, dateEn, titleAr, titleEn, descAr, descEn }, i) => (
              <div key={i} style={{
                ...rv(visible, 0.1 + i * 0.12),
                background: t.card, border: `1px solid ${t.border}`,
                borderRadius: i === 0 ? '8px 8px 0 0' : i === EVENTS.length - 1 ? '0 0 8px 8px' : '0',
                padding: '22px 24px', display: 'flex', gap: 20, alignItems: 'flex-start',
                transition: 'background 0.25s, border-color 0.25s', cursor: 'default',
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = t.expanded; el.style.borderColor = t.gold4; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = t.card; el.style.borderColor = t.border; }}
              >
                <div style={{ background: t.gold5, border: `1px solid ${t.gold4}`, borderRadius: 6, padding: '8px 12px', textAlign: 'center', flexShrink: 0, minWidth: 72 }}>
                  <Globe2 size={13} color={t.gold} style={{ marginBottom: 4 }} />
                  <div style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, lineHeight: 1.2 }}>{isAr ? dateAr : dateEn}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '0.95rem', marginBottom: 5 }}>{isAr ? titleAr : titleEn}</div>
                  <div style={{ color: t.txt4, fontSize: '0.78rem', lineHeight: 1.6 }}>{isAr ? descAr : descEn}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── testimonials ─────────────────────────────────────────────────────────────

function TestimonialsSection({ t, isMobile, isAr, tr }: SP) {
  const { ref, visible } = useScrollReveal();
  const TIER_COLORS: Record<string, string> = { 'بلاتيني': '#E8D5C4', 'ذهبي': '#D9BAA0' };
  return (
    <section style={{ background: t.altBg, borderTop: `1px solid ${t.gold4}`, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 60 }}>
          <p style={{ ...rv(visible, 0), color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: t.gold }} />
            {isAr ? 'أصوات الأعضاء' : 'Member Voices'}
            <span style={{ display: 'inline-block', width: 24, height: 1, background: t.gold }} />
          </p>
          <h2 style={{ ...rv(visible, 0.1), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.6rem, 6vw, 2.2rem)' : 'clamp(2rem, 3vw, 2.8rem)', margin: 0 }}>
            {isAr ? 'من داخل الشبكة' : 'From Inside the Network'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 20 }}>
          {TESTIMONIALS.map(({ name, roleAr, roleEn, quote, quoteEn, photo, tier, tierEn }, i) => (
            <div key={i} style={{
              ...rv(visible, 0.1 + i * 0.12),
              background: t.bg, border: `1px solid ${t.border}`,
              borderRadius: 8, padding: isMobile ? '28px 22px' : '36px 30px',
              transition: 'border-color 0.3s, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
              cursor: 'default', display: 'flex', flexDirection: 'column',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.gold3; el.style.transform = 'translateY(-6px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.border; el.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', gap: 1, marginBottom: 20 }}>
                {Array.from({ length: 5 }).map((_, j) => <Sparkles key={j} size={12} color={t.gold} />)}
              </div>
              <p style={{ fontFamily: "'Marcellus', serif", color: t.txt2, fontSize: '0.88rem', fontStyle: 'italic', lineHeight: 1.85, marginBottom: 24, flex: 1 }}>
                &ldquo;{isAr ? quote : quoteEn}&rdquo;
              </p>
              <div style={{ width: 28, height: 1, background: t.gold3, marginBottom: 20 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `1.5px solid ${TIER_COLORS[tier] ?? t.gold3}` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ color: t.txt, fontWeight: 600, fontSize: '0.88rem' }}>{name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                    <span style={{ background: `${TIER_COLORS[tier] ?? t.gold}22`, border: `1px solid ${TIER_COLORS[tier] ?? t.gold}44`, borderRadius: 3, padding: '1px 7px', color: TIER_COLORS[tier] ?? t.gold, fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                      {isAr ? tier : tierEn}
                    </span>
                    <span style={{ color: t.txt4, fontSize: '0.68rem' }}>{(isAr ? roleAr : roleEn).split('—')[1]?.trim()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── registration ─────────────────────────────────────────────────────────────

function RegistrationSection({ t, isMobile, isAr, tr, dir }: SP & { dir: 'rtl' | 'ltr' }) {
  const { ref, visible } = useScrollReveal();
  const [form, setForm] = useState({ name: '', country: '', phone: '', email: '', budget: '', tier: '', how: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const COUNTRIES_AR = ['المملكة العربية السعودية', 'الإمارات العربية المتحدة', 'الكويت', 'قطر', 'البحرين', 'سلطنة عُمان', 'الأردن', 'مصر', 'العراق', 'دولة أخرى'];
  const COUNTRIES_EN = ['Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Qatar', 'Bahrain', 'Oman', 'Jordan', 'Egypt', 'Iraq', 'Other'];
  const BUDGETS_AR = ['$250,000 – $500,000', '$500,000 – $1,000,000', 'أكثر من $1,000,000'];
  const BUDGETS_EN = ['$250,000 – $500,000', '$500,000 – $1,000,000', 'More than $1,000,000'];
  const TIERS_OPT_AR = ['فضي ($250k+)', 'ذهبي ($500k+)', 'بلاتيني ($1M+)'];
  const TIERS_OPT_EN = ['Silver ($250k+)', 'Gold ($500k+)', 'Platinum ($1M+)'];
  const HOW_AR = ['توصية من صديق أو زميل', 'وسائل التواصل الاجتماعي', 'محرك البحث', 'إعلان رقمي', 'فعالية أو مؤتمر', 'أخرى'];
  const HOW_EN = ['Friend or colleague referral', 'Social media', 'Search engine', 'Digital ad', 'Event or conference', 'Other'];
  const PROMISES_AR = ['سرية تامة لبياناتك الشخصية', 'لا رسوم للانضمام أو التقديم', 'ردّ مضمون خلال 48 ساعة', 'مستشار عربي متخصص يتابعك'];
  const PROMISES_EN = ['Full confidentiality of your personal data', 'No joining or application fees', 'Guaranteed response within 48 hours', 'A specialized Arab advisor follows up with you'];

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const required: (keyof typeof form)[] = ['name', 'country', 'phone', 'email', 'budget', 'tier'];
    if (required.find(f => !form[f])) {
      setError(isAr ? 'يرجى ملء جميع الحقول الإلزامية' : 'Please fill in all required fields');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  const inputBase: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${t.border2}`, borderRadius: 6,
    color: t.txt, fontSize: '0.85rem', padding: '12px 14px',
    outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'inherit', appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
    direction: dir, boxSizing: 'border-box' as const,
  };

  return (
    <section style={{ background: '#070707', borderTop: `1px solid ${t.gold4}`, padding: isMobile ? '60px 0' : '100px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(217,186,160,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px', position: 'relative' }}>
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.15fr', gap: isMobile ? 48 : 80, alignItems: 'start' }}>
          {/* Left pitch */}
          <div style={rv(visible, 0)}>
            <div style={{ width: 44, height: 44, border: `1.5px solid ${t.gold4}`, transform: 'rotate(45deg)', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 18, height: 18, background: t.gold5 }} />
            </div>
            <p style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
              {isAr ? 'طلب الانضمام' : 'Join Request'}
            </p>
            <h2 style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: isMobile ? 'clamp(1.7rem, 6vw, 2.2rem)' : 'clamp(2rem, 3vw, 2.7rem)', lineHeight: 1.25, marginBottom: 20 }}>
              {isAr ? <>مقاعد محدودة<br /><em style={{ color: t.gold }}>لأعضاء مختارين بعناية</em></> : <>Limited Seats<br /><em style={{ color: t.gold }}>For Carefully Selected Members</em></>}
            </h2>
            <p style={{ color: t.txt3, fontSize: '0.88rem', lineHeight: 1.9, marginBottom: 36 }}>
              {isAr
                ? <>لا تُفتح باب العضوية دائماً. إن كنت جاداً في بناء محفظة عقارية متميزة في تركيا، قدّم طلبك الآن وسيتواصل معك مستشارنا خلال <strong style={{ color: t.txt2 }}>48 ساعة</strong>.</>
                : <>Membership is not always open. If you are serious about building a distinguished real estate portfolio in Turkey, submit your application now and our advisor will contact you within <strong style={{ color: t.txt2 }}>48 hours</strong>.</>}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(isAr ? PROMISES_AR : PROMISES_EN).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={15} color={t.gold} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                  <span style={{ color: t.txt3, fontSize: '0.84rem' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div style={rv(visible, 0.12)}>
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: `linear-gradient(135deg, ${t.gold5} 0%, rgba(217,186,160,0.03) 100%)`, borderBottom: `1px solid ${t.gold4}`, padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, background: t.gold5, border: `1px solid ${t.gold4}`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={13} color={t.gold} />
                </div>
                <div>
                  <div style={{ color: t.txt, fontSize: '0.88rem', fontWeight: 600 }}>{tr('vip.form.submit')}</div>
                  <div style={{ color: t.txt4, fontSize: '0.68rem', marginTop: 2 }}>{isAr ? 'جميع الحقول المُعلَّمة بـ * إلزامية' : 'All fields marked with * are required'}</div>
                </div>
              </div>

              {submitted ? (
                <div style={{ padding: '52px 28px', textAlign: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${t.gold}18`, border: `1.5px solid ${t.gold3}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <CheckCircle2 size={28} color={t.gold} strokeWidth={1.4} />
                  </div>
                  <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '1.3rem', marginBottom: 12 }}>
                    {isAr ? 'تم استلام طلبك' : 'Your Request Received'}
                  </h3>
                  <p style={{ color: t.txt3, fontSize: '0.86rem', lineHeight: 1.8, maxWidth: 320, margin: '0 auto 28px' }}>
                    {isAr
                      ? <>شكراً <strong style={{ color: t.txt2 }}>{form.name}</strong>، سيتواصل معك مستشارنا عبر الواتساب أو البريد الإلكتروني خلال 48 ساعة.</>
                      : <>Thank you <strong style={{ color: t.txt2 }}>{form.name}</strong>, our advisor will contact you via WhatsApp or email within 48 hours.</>}
                  </p>
                  <div style={{ background: t.gold5, border: `1px solid ${t.gold4}`, borderRadius: 6, padding: '12px 20px', color: t.gold, fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <BadgeCheck size={14} strokeWidth={1.5} />
                    {isAr ? `رقم طلبك: GI-VIP-${Date.now().toString().slice(-5)}` : `Request ID: GI-VIP-${Date.now().toString().slice(-5)}`}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ padding: '24px 28px 28px' }} noValidate>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0 16px' }}>
                    <VField label={tr('vip.form.name') + ' *'}>
                      <input type="text" placeholder={isAr ? 'محمد العمري' : 'Your Full Name'} value={form.name} onChange={set('name')} style={inputBase}
                        onFocus={e => { e.target.style.borderColor = t.gold3; }} onBlur={e => { e.target.style.borderColor = t.border2; }} />
                    </VField>
                    <VField label={tr('vip.form.country') + ' *'}>
                      <SelectWrap t={t}>
                        <select value={form.country} onChange={set('country')} style={{ ...inputBase, color: form.country ? t.txt : t.txt4 }}
                          onFocus={e => { e.target.style.borderColor = t.gold3; }} onBlur={e => { e.target.style.borderColor = t.border2; }}>
                          <option value="" disabled style={{ background: '#1a1a1a' }}>{isAr ? 'اختر دولتك' : 'Choose your country'}</option>
                          {(isAr ? COUNTRIES_AR : COUNTRIES_EN).map(c => <option key={c} value={c} style={{ background: '#1a1a1a', color: '#fff' }}>{c}</option>)}
                        </select>
                      </SelectWrap>
                    </VField>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0 16px' }}>
                    <VField label={tr('vip.form.phone') + ' *'}>
                      <input type="tel" placeholder="+966 5XX XXX XXXX" value={form.phone} onChange={set('phone')}
                        style={{ ...inputBase, direction: 'ltr', textAlign: dir === 'rtl' ? 'right' : 'left' }}
                        onFocus={e => { e.target.style.borderColor = t.gold3; }} onBlur={e => { e.target.style.borderColor = t.border2; }} />
                    </VField>
                    <VField label={isAr ? 'البريد الإلكتروني *' : 'Email *'}>
                      <input type="email" placeholder="email@example.com" value={form.email} onChange={set('email')}
                        style={{ ...inputBase, direction: 'ltr', textAlign: dir === 'rtl' ? 'right' : 'left' }}
                        onFocus={e => { e.target.style.borderColor = t.gold3; }} onBlur={e => { e.target.style.borderColor = t.border2; }} />
                    </VField>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0 16px' }}>
                    <VField label={tr('vip.form.budget') + ' *'}>
                      <SelectWrap t={t}>
                        <select value={form.budget} onChange={set('budget')} style={{ ...inputBase, color: form.budget ? t.txt : t.txt4 }}
                          onFocus={e => { e.target.style.borderColor = t.gold3; }} onBlur={e => { e.target.style.borderColor = t.border2; }}>
                          <option value="" disabled style={{ background: '#1a1a1a' }}>{isAr ? 'حدد الميزانية' : 'Select budget'}</option>
                          {(isAr ? BUDGETS_AR : BUDGETS_EN).map(b => <option key={b} value={b} style={{ background: '#1a1a1a', color: '#fff' }}>{b}</option>)}
                        </select>
                      </SelectWrap>
                    </VField>
                    <VField label={isAr ? 'مستوى العضوية المفضّل *' : 'Preferred Membership Tier *'}>
                      <SelectWrap t={t}>
                        <select value={form.tier} onChange={set('tier')} style={{ ...inputBase, color: form.tier ? t.txt : t.txt4 }}
                          onFocus={e => { e.target.style.borderColor = t.gold3; }} onBlur={e => { e.target.style.borderColor = t.border2; }}>
                          <option value="" disabled style={{ background: '#1a1a1a' }}>{isAr ? 'اختر المستوى' : 'Choose tier'}</option>
                          {(isAr ? TIERS_OPT_AR : TIERS_OPT_EN).map(ti => <option key={ti} value={ti} style={{ background: '#1a1a1a', color: '#fff' }}>{ti}</option>)}
                        </select>
                      </SelectWrap>
                    </VField>
                  </div>
                  <VField label={isAr ? 'كيف سمعت عنا؟' : 'How did you hear about us?'}>
                    <SelectWrap t={t}>
                      <select value={form.how} onChange={set('how')} style={{ ...inputBase, color: form.how ? t.txt : t.txt4 }}
                        onFocus={e => { e.target.style.borderColor = t.gold3; }} onBlur={e => { e.target.style.borderColor = t.border2; }}>
                        <option value="" style={{ background: '#1a1a1a' }}>{isAr ? 'اختياري' : 'Optional'}</option>
                        {(isAr ? HOW_AR : HOW_EN).map(h => <option key={h} value={h} style={{ background: '#1a1a1a', color: '#fff' }}>{h}</option>)}
                      </select>
                    </SelectWrap>
                  </VField>
                  <VField label={isAr ? 'ملاحظات أو تفاصيل إضافية' : 'Additional Notes or Details'}>
                    <textarea
                      placeholder={isAr ? 'أخبرنا عن أهدافك الاستثمارية أو أي استفسارات لديك…' : 'Tell us about your investment goals or any inquiries you have…'}
                      value={form.notes} onChange={set('notes')} rows={4}
                      style={{ ...inputBase, resize: 'vertical', minHeight: 96 }}
                      onFocus={e => { e.target.style.borderColor = t.gold3; }} onBlur={e => { e.target.style.borderColor = t.border2; }} />
                  </VField>
                  {error && (
                    <div style={{ background: 'rgba(220,50,50,0.08)', border: '1px solid rgba(220,50,50,0.25)', borderRadius: 6, padding: '10px 14px', color: '#e07070', fontSize: '0.8rem', marginBottom: 16 }}>{error}</div>
                  )}
                  <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? t.gold4 : t.gold, border: 'none', borderRadius: 6, color: t.goldText, fontSize: '0.82rem', fontWeight: 700, padding: '14px', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'opacity 0.2s, transform 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {loading
                      ? <><span style={{ display: 'inline-block', width: 14, height: 14, border: `2px solid ${t.goldText}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />{isAr ? 'جاري الإرسال…' : 'Sending…'}</>
                      : <><Send size={14} />{tr('vip.form.submit')}</>
                    }
                  </button>
                  <p style={{ color: t.txt4, fontSize: '0.68rem', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
                    {isAr
                      ? <>{`بتقديم الطلب توافق على `}<span style={{ color: t.gold, cursor: 'pointer' }}>سياسة الخصوصية</span>{` وعلى تواصل فريقنا معك.`}</>
                      : <>{`By submitting you agree to our `}<span style={{ color: t.gold, cursor: 'pointer' }}>Privacy Policy</span>{` and to being contacted by our team.`}</>}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}

function VField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  );
}

function SelectWrap({ t, children }: { t: SP['t']; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative' }}>
      {children}
      <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: t.txt4, fontSize: '0.6rem' }}>▼</div>
    </div>
  );
}

// ─── types ────────────────────────────────────────────────────────────────────

interface SP {
  t: ReturnType<typeof useTheme>['t'];
  isMobile: boolean;
  isAr: boolean;
  tr: (key: any) => string;
  get: (key: string, isAr: boolean, fallback?: string) => string;
  getImg: (key: string, fallback?: string) => string;
}
