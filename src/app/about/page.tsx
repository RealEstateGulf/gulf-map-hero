'use client';

import { Star, Users, Building2, Globe2, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import { useContent } from '@/hooks/useContent';
import Navbar from '@/components/map/Navbar';
import FooterSection from '@/components/sections/FooterSection';

const STATS = [
  { value: '+130', labelAr: 'مستثمر خليجي', labelEn: 'Gulf investors' },
  { value: '6+', labelAr: 'سنوات خبرة ميدانية', labelEn: 'years field experience' },
  { value: '+17', labelAr: 'عقار في محفظتنا', labelEn: 'properties in portfolio' },
  { value: '2', labelAr: 'مكاتب: دبي وإسطنبول', labelEn: 'offices: Dubai & Istanbul' },
];

const TEAM = [
  {
    name: 'أحمد يلدز',
    role: 'مدير العلاقات العربية',
    bio: 'يمتلك أحمد خبرة تتجاوز 8 سنوات في تسهيل صفقات العقارات للمستثمرين الخليجيين في تركيا، ويتحدث العربية والتركية والإنجليزية بطلاقة.',
    photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'ليلى شاهين',
    role: 'خبيرة العقارات الفاخرة',
    bio: 'ليلى متخصصة في العقارات الفاخرة وتملك شبكة علاقات واسعة مع كبار المطورين في إسطنبول وبورصة وأنطاليا.',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'خالد التميمي',
    role: 'مستشار قانوني',
    bio: 'محامٍ متخصص في قانون الملكية العقارية للأجانب في تركيا، يرافق العملاء في كل مراحل التوثيق وإجراءات الجنسية.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'نورا الحمد',
    role: 'مديرة علاقات العملاء — دبي',
    bio: 'نورا تدير مكتب دبي وتُعدّ الحلقة الرئيسية التي تربط المستثمرين الخليجيين بفريقنا في تركيا، مع دعم مستمر على مدار الساعة.',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80',
  },
];

const VALUES = [
  {
    Icon: CheckCircle2,
    titleAr: 'الشفافية الكاملة',
    titleEn: 'Full Transparency',
    descAr: 'لا رسوم خفية، لا مفاجآت. نُطلعك على كل تفصيل من تكاليف وإجراءات قبل اتخاذ أي خطوة.',
    descEn: 'No hidden fees, no surprises. We share every detail of costs and procedures before any step.',
  },
  {
    Icon: Globe2,
    titleAr: 'الخبرة الميدانية',
    titleEn: 'Field Expertise',
    descAr: 'فريقنا يعيش ويعمل في تركيا — نحن نعرف السوق من الداخل، لا من الكتب.',
    descEn: 'Our team lives and works in Turkey — we know the market from the inside, not from books.',
  },
  {
    Icon: Users,
    titleAr: 'الخدمة الشخصية',
    titleEn: 'Personal Service',
    descAr: 'كل عميل لديه مستشار مخصص يتابع ملفه من البداية حتى النهاية وما بعدها.',
    descEn: 'Every client has a dedicated advisor who follows their file from start to finish and beyond.',
  },
];

export default function AboutPage() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();
  const tr = useT();
  const { get, getImg } = useContent('about');
  return (
    <main style={{ background: t.bg, direction: dir, minHeight: '100vh' }}>
      <Navbar />
      <HeroSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <MissionSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <StatsSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <ValuesSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <TeamSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <CtaBanner t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <FooterSection />
    </main>
  );
}

function HeroSection({ t, isMobile, isAr, tr, get, getImg }: SP) {
  const heroImg = getImg('hero.image', 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1800&q=85');
  return (
    <div style={{ position: 'relative', height: isMobile ? '65vh' : '75vh', overflow: 'hidden', paddingTop: 64 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroImg}
        alt="Miftah Turkiye"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,7,0.92) 0%, rgba(7,7,7,0.45) 55%, rgba(7,7,7,0.2) 100%)' }} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end',
        textAlign: 'center', padding: isMobile ? '0 20px 52px' : '0 32px 80px',
      }}>
        <p style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ display: 'inline-block', width: 28, height: 1, background: t.gold }} />
          {get('hero.title', isAr, tr('about.title'))}
          <span style={{ display: 'inline-block', width: 28, height: 1, background: t.gold }} />
        </p>
        <h1 style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: isMobile ? 'clamp(2rem,8vw,3rem)' : 'clamp(2.8rem,5vw,4.4rem)', lineHeight: 1.18, marginBottom: 18 }}>
          Miftah Türkiye
          <br />
          <em style={{ color: t.gold }}>{get('hero.subtitle', isAr, tr('about.subtitle'))}</em>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: isMobile ? '0.88rem' : '1rem', lineHeight: 1.85, maxWidth: 520 }}>
          {get('story.text', isAr,
            isAr
              ? 'منذ 2018، نبني جسور الثقة بين المستثمر العربي والسوق العقاري التركي الواعد'
              : 'Since 2018, we have been building bridges of trust between Arab investors and the promising Turkish real estate market'
          )}
        </p>
      </div>
    </div>
  );
}

function MissionSection({ t, isMobile, isAr, tr: _tr, get }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: t.altBg, borderBottom: `1px solid ${t.border}`, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 36 : 80, alignItems: 'center' }}>
          <div style={rv(visible, 0, 'left')}>
            <p style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
              {get('story.title', isAr, isAr ? 'قصتنا' : 'Our Story')}
            </p>
            <h2 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.6rem,6vw,2.4rem)' : 'clamp(2rem,3.5vw,2.8rem)', lineHeight: 1.3, marginBottom: 24 }}>
              {isAr ? <>رحلة بدأت بشغف،<br /><em style={{ color: t.gold }}>وترسّخت بثقة</em></> : <>A Journey Built on Passion,<br /><em style={{ color: t.gold }}>Rooted in Trust</em></>}
            </h2>
            <p style={{ color: t.txt3, fontSize: '0.88rem', lineHeight: 1.9, marginBottom: 18 }}>
              {get('mission.text', isAr,
                isAr
                  ? 'انطلقنا من رؤية بسيطة: أن المستثمر العربي يستحق شريكاً أمانة موثوقاً في السوق التركي — لا وسيطاً يبحث عن عمولة فحسب.'
                  : 'We started from a simple vision: the Arab investor deserves a trustworthy partner in the Turkish market — not just a broker chasing a commission.'
              )}
            </p>
          </div>
          <div style={{ ...rv(visible, 0.2, 'right'), height: isMobile ? 280 : 460, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=900&q=80" alt="Our team" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 3, height: '40%', background: `linear-gradient(to top, ${t.gold}, transparent)` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection({ t, isMobile, isAr, tr: _tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: '#060606', borderBottom: `1px solid ${t.gold4}` }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px', display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)' }}>
        {STATS.map(({ value, labelAr, labelEn }, i) => (
          <div key={i} style={{
            ...rv(visible, 0.1 * i),
            padding: isMobile ? '32px 0' : '48px 0', textAlign: 'center',
            borderLeft: !isMobile && i > 0 ? `1px solid ${t.border}` : 'none',
            borderTop: isMobile && i >= 2 ? `1px solid ${t.border}` : 'none',
            borderRight: isMobile && i % 2 === 0 ? `1px solid ${t.border}` : 'none',
          }}>
            <div style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: isMobile ? '2rem' : '2.6rem', lineHeight: 1 }}>{value}</div>
            <div style={{ color: t.txt4, fontSize: '0.7rem', marginTop: 10, letterSpacing: '0.05em' }}>{isAr ? labelAr : labelEn}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ValuesSection({ t, isMobile, isAr, tr, get }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: t.bg, padding: isMobile ? '60px 0' : '90px 0', borderBottom: `1px solid ${t.border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 52 }}>
          <p style={{ ...rv(visible, 0), color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
            {get('values.title', isAr, tr('about.values.title'))}
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
          </p>
          <h2 style={{ ...rv(visible, 0.08), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.5rem,5vw,2rem)' : 'clamp(1.8rem,3vw,2.4rem)', margin: 0 }}>
            {isAr ? 'ما الذي يجعلنا مختلفين' : 'What Makes Us Different'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 20 }}>
          {VALUES.map(({ Icon, titleAr, titleEn, descAr, descEn }, i) => (
            <div key={i} style={{
              ...rv(visible, 0.1 + i * 0.12),
              background: t.altBg, border: `1px solid ${t.border}`,
              borderRadius: 8, padding: isMobile ? '28px 22px' : '36px 28px',
              transition: 'border-color 0.25s, transform 0.3s cubic-bezier(0.22,1,0.36,1)',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.gold3; el.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.border; el.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 8, background: t.gold5, border: `1px solid ${t.gold4}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={20} color={t.gold} strokeWidth={1.4} />
              </div>
              <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '1.05rem', margin: '0 0 10px' }}>{isAr ? titleAr : titleEn}</h3>
              <p style={{ color: t.txt3, fontSize: '0.83rem', lineHeight: 1.85, margin: 0 }}>{isAr ? descAr : descEn}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection({ t, isMobile, isAr, tr, get }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: t.altBg, padding: isMobile ? '60px 0' : '90px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ marginBottom: isMobile ? 36 : 52 }}>
          <p style={{ ...rv(visible, 0), color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
            {get('team.title', isAr, tr('about.team.title'))}
          </p>
          <h2 style={{ ...rv(visible, 0.08), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.5rem,5vw,2rem)' : 'clamp(1.8rem,3vw,2.4rem)', margin: 0 }}>
            {isAr ? 'الأشخاص الذين يقفون خلف نجاحك' : 'The People Behind Your Success'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? 16 : 22 }}>
          {TEAM.map(({ name, role, bio, photo }, i) => (
            <div key={i} style={{
              ...rv(visible, 0.1 + i * 0.1),
              background: t.bg, border: `1px solid ${t.border}`,
              borderRadius: 8, overflow: 'hidden',
              transition: 'border-color 0.25s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = t.gold3; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = t.border; }}
            >
              <div style={{ height: isMobile ? 140 : 200, overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', objectPosition: 'top' }} />
              </div>
              <div style={{ padding: isMobile ? '14px 14px' : '18px 20px' }}>
                <div style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? '0.82rem' : '0.92rem', marginBottom: 4 }}>{name}</div>
                <div style={{ color: t.gold, fontSize: '0.62rem', fontWeight: 600, marginBottom: 10, letterSpacing: '0.04em' }}>{role}</div>
                {!isMobile && <p style={{ color: t.txt4, fontSize: '0.74rem', lineHeight: 1.7, margin: 0 }}>{bio}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner({ t, isMobile, isAr, tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: '#060606', borderTop: `1px solid ${t.gold4}`, padding: isMobile ? '64px 18px' : '90px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(217,186,160,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div ref={ref} style={{ maxWidth: 560, margin: '0 auto', position: 'relative' }}>
        <Star size={20} color={t.gold} strokeWidth={1.4} style={{ marginBottom: 20 }} />
        <h2 style={{ ...rv(visible, 0), fontFamily: "'Marcellus', serif", color: '#fff', fontSize: isMobile ? 'clamp(1.5rem,5vw,2rem)' : 'clamp(1.8rem,3vw,2.4rem)', marginBottom: 14 }}>
          {isAr ? 'لنبدأ رحلتك الاستثمارية معاً' : "Let's Start Your Investment Journey Together"}
        </h2>
        <p style={{ ...rv(visible, 0.08), color: t.txt3, fontSize: '0.88rem', lineHeight: 1.85, marginBottom: 32 }}>
          {isAr
            ? 'تواصل مع فريقنا للحصول على استشارة مجانية، أو استعرض محفظة عقاراتنا المختارة بعناية.'
            : 'Contact our team for a free consultation, or browse our carefully selected property portfolio.'}
        </p>
        <div style={{ ...rv(visible, 0.14), display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/contact" style={{
            background: t.gold, borderRadius: 5, color: t.goldText,
            fontSize: '0.8rem', fontWeight: 700, padding: '14px 30px',
            textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase',
            transition: 'opacity 0.2s', display: 'inline-block',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
          >
            {tr('cta.consult')}
          </a>
          <a href="/properties" style={{
            background: 'transparent', border: `1px solid ${t.border2}`,
            borderRadius: 5, color: t.txt2, fontSize: '0.8rem',
            padding: '14px 24px', textDecoration: 'none',
            transition: 'all 0.2s', display: 'inline-block',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = t.gold3; el.style.color = t.gold; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = t.border2; el.style.color = t.txt2; }}
          >
            {tr('cta.viewProperties')}
          </a>
        </div>
      </div>
    </section>
  );
}

interface SP {
  t: ReturnType<typeof useTheme>['t'];
  isMobile: boolean;
  isAr: boolean;
  tr: (key: any) => string;
  get: (key: string, isAr: boolean, fallback?: string) => string;
  getImg: (key: string, fallback?: string) => string;
}
