'use client';

import {
  TrendingUp, Globe2, Users, Plane, Building2,
  MapPin, Star, ShieldCheck, Landmark, Sun,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import { useContent } from '@/hooks/useContent';
import Navbar from '@/components/map/Navbar';
import FooterSection from '@/components/sections/FooterSection';

const KEY_STATS = [
  { value: '85M+', labelAr: 'نسمة — عاشر أكبر اقتصاد في أوروبا', labelEn: 'People — 10th largest economy in Europe' },
  { value: '$1T+', labelAr: 'حجم الناتج المحلي الإجمالي السنوي', labelEn: 'Annual GDP' },
  { value: '50M+', labelAr: 'سائح دولي سنوياً', labelEn: 'International tourists annually' },
  { value: '#7', labelAr: 'في قائمة أكبر مقاصد الاستثمار الأجنبي', labelEn: 'Top foreign investment destination' },
];

const WHY_REASONS = [
  {
    Icon: TrendingUp,
    titleAr: 'نمو اقتصادي متسارع',
    titleEn: 'Accelerating Economic Growth',
    descAr: 'تحتل تركيا المرتبة 17 عالمياً في الناتج المحلي الإجمالي، مع نمو متواصل تجاوز %5 سنوياً في قطاع العقارات خلال العقد الأخير.',
    descEn: 'Turkey ranks 17th globally in GDP, with continuous growth exceeding 5% annually in real estate over the last decade.',
  },
  {
    Icon: MapPin,
    titleAr: 'موقع استراتيجي فريد',
    titleEn: 'Unique Strategic Location',
    descAr: 'جسر بين آسيا وأوروبا — تتمتع تركيا بوصول مباشر لأكثر من 1.5 مليار مستهلك في محيطها الجغرافي.',
    descEn: 'A bridge between Asia and Europe — Turkey has direct access to over 1.5 billion consumers in its geographic sphere.',
  },
  {
    Icon: Building2,
    titleAr: 'سوق عقاري ديناميكي',
    titleEn: 'Dynamic Real Estate Market',
    descAr: 'أسعار عقارات تنافسية مقارنة بدول الجوار الأوروبي، مع عوائد إيجارية تتراوح بين 6-12% سنوياً في المدن الكبرى.',
    descEn: 'Competitive property prices compared to European neighbors, with rental yields ranging from 6-12% annually in major cities.',
  },
  {
    Icon: Globe2,
    titleAr: 'انفتاح على الاستثمار الأجنبي',
    titleEn: 'Open to Foreign Investment',
    descAr: 'قوانين مرنة تتيح للأجانب تملّك العقارات بسهولة، مع إمكانية الحصول على الجنسية التركية عند الاستثمار بمبلغ $400,000 أو أكثر.',
    descEn: 'Flexible laws allow foreigners to own property easily, with the possibility of obtaining Turkish citizenship when investing $400,000 or more.',
  },
  {
    Icon: Plane,
    titleAr: 'بنية تحتية عالمية',
    titleEn: 'World-Class Infrastructure',
    descAr: 'مطار إسطنبول الثالث في العالم من حيث حركة المسافرين، وشبكة طرق ومواصلات حديثة تربط كل أرجاء البلاد.',
    descEn: 'Istanbul Airport is the world\'s third busiest, with a modern road and transport network connecting all parts of the country.',
  },
  {
    Icon: Sun,
    titleAr: 'جودة حياة استثنائية',
    titleEn: 'Exceptional Quality of Life',
    descAr: 'مناخ متوسطي معتدل، طعام عالمي، تراث عريق، وتكاليف معيشة منخفضة تجعل تركيا وجهة محبوبة للإقامة والترفيه.',
    descEn: 'Mild Mediterranean climate, world cuisine, rich heritage and low living costs make Turkey a beloved destination for living and leisure.',
  },
];

const CITIES = [
  {
    nameAr: 'إسطنبول',
    nameEn: 'Istanbul',
    descAr: 'أكبر مدينة في تركيا وعاصمتها الاقتصادية — موطن 16 مليون نسمة، ومحور مالي وثقافي لا مثيل له.',
    descEn: 'Turkey\'s largest city and economic capital — home to 16 million people and an unparalleled financial and cultural hub.',
    highlights: ['مطار عالمي الأول', 'سوق عقاري نشط', 'عائد إيجاري مرتفع', 'كثافة سياحية عالية'],
    photo: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80',
  },
  {
    nameAr: 'بورصة',
    nameEn: 'Bursa',
    descAr: 'مدينة جبل أولوداغ الشهير — جوهرة صناعية وسياحية في شمال غرب تركيا، تُعرف بتراثها العثماني الأصيل.',
    descEn: 'Home to the famous Mount Uludağ — an industrial and tourism gem in northwestern Turkey known for its authentic Ottoman heritage.',
    highlights: ['أسعار تنافسية', 'جبال ومصايف', 'نمو صناعي قوي', 'قرب من إسطنبول'],
    photo: 'https://images.unsplash.com/photo-1604665515746-1b0c6a35f6c7?auto=format&fit=crop&w=900&q=80',
  },
  {
    nameAr: 'أنطاليا',
    nameEn: 'Antalya',
    descAr: 'عاصمة السياحة التركية على ساحل المتوسط — تستقبل ما يزيد على 16 مليون سائح سنوياً.',
    descEn: 'Turkey\'s tourism capital on the Mediterranean coast — receiving over 16 million tourists annually.',
    highlights: ['شاطئ ومنتجعات', 'عائد فندقي مرتفع', 'مناخ مشمس 300 يوم', 'سوق إيجار موسمي قوي'],
    photo: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&w=900&q=80',
  },
  {
    nameAr: 'إزمير',
    nameEn: 'Izmir',
    descAr: 'ثالث أكبر مدن تركيا — ميناء بحري نشط وعاصمة اقتصادية للساحل الغربي بجمال طبيعي فريد.',
    descEn: 'Turkey\'s third largest city — an active seaport and economic capital of the western coast with unique natural beauty.',
    highlights: ['ميناء تجاري كبير', 'جودة حياة عالية', 'سوق عقاري صاعد', 'مجتمع كوسموبوليتي'],
    photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80',
  },
];

const TIMELINE = [
  { year: '2012', event: 'فتح تركيا باب التملك العقاري للمواطنين الخليجيين دون اشتراط المعاملة بالمثل.' },
  { year: '2017', event: 'إطلاق برنامج الجنسية التركية مقابل الاستثمار العقاري بحد أدنى $1,000,000.' },
  { year: '2018', event: 'خفض الحد الأدنى للجنسية إلى $250,000، مما فتح الباب لشريحة أوسع من المستثمرين العرب.' },
  { year: '2022', event: 'رفع الحد الأدنى إلى $400,000 بسبب الإقبال الكبير، مع تطوير منظومة تسجيل العقارات رقمياً.' },
  { year: '2024', event: 'تركيا تسجل أعلى رقم في تاريخها لمبيعات العقارات للأجانب: أكثر من 35,000 وحدة سكنية.' },
];

export default function TurkeyPage() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();
  const tr = useT();
  const { get, getImg } = useContent('turkey');
  return (
    <main style={{ background: t.bg, direction: dir, minHeight: '100vh' }}>
      <Navbar />
      <HeroSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <StatsBar t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <WhySection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <CitiesSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <TimelineSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <CtaBanner t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <FooterSection />
    </main>
  );
}

function HeroSection({ t, isMobile, isAr, tr, get, getImg }: SP) {
  const heroImg = getImg('hero.image', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1800&q=85');
  return (
    <div style={{ position: 'relative', height: isMobile ? '70vh' : '85vh', overflow: 'hidden', paddingTop: 64 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={heroImg} alt="Istanbul" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,7,0.92) 0%, rgba(7,7,7,0.4) 60%, rgba(7,7,7,0.15) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center', padding: isMobile ? '0 20px 52px' : '0 32px 80px' }}>
        <p style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ display: 'inline-block', width: 28, height: 1, background: t.gold }} />
          {isAr ? 'وجهتك الاستثمارية' : 'Your Investment Destination'}
          <span style={{ display: 'inline-block', width: 28, height: 1, background: t.gold }} />
        </p>
        <h1 style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: isMobile ? 'clamp(2rem,8vw,3rem)' : 'clamp(2.8rem,5vw,4.6rem)', lineHeight: 1.18, marginBottom: 18 }}>
          {get('hero.title', isAr, tr('turkey.title'))}
          <br />
          <em style={{ color: t.gold }}>{get('hero.subtitle', isAr, isAr ? 'البوابة الذهبية للاستثمار' : 'The Golden Gateway to Investment')}</em>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: isMobile ? '0.88rem' : '1rem', lineHeight: 1.85, maxWidth: 560 }}>
          {isAr
            ? 'اكتشف لماذا اختار أكثر من 35,000 مستثمر أجنبي تركيا وجهةً لثرواتهم في 2024 وحده'
            : 'Discover why over 35,000 foreign investors chose Turkey as the destination for their wealth in 2024 alone'}
        </p>
      </div>
    </div>
  );
}

function StatsBar({ t, isMobile, isAr, tr: _tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <div style={{ background: '#060606', borderBottom: `1px solid ${t.gold4}` }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px', display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)' }}>
        {KEY_STATS.map(({ value, labelAr, labelEn }, i) => (
          <div key={i} style={{
            ...rv(visible, 0.08 * i),
            padding: isMobile ? '28px 0' : '36px 0', textAlign: 'center',
            borderLeft: !isMobile && i > 0 ? `1px solid ${t.border}` : 'none',
            borderTop: isMobile && i >= 2 ? `1px solid ${t.border}` : 'none',
            borderRight: isMobile && i % 2 === 0 ? `1px solid ${t.border}` : 'none',
          }}>
            <div style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: isMobile ? '1.8rem' : '2.2rem', lineHeight: 1 }}>{value}</div>
            <div style={{ color: t.txt4, fontSize: '0.68rem', marginTop: 8, lineHeight: 1.5, padding: '0 8px' }}>{isAr ? labelAr : labelEn}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhySection({ t, isMobile, isAr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: t.altBg, borderBottom: `1px solid ${t.border}`, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: isMobile ? 44 : 64 }}>
          <p style={{ ...rv(visible, 0), color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
            {isAr ? 'أسباب الاختيار' : 'Reasons to Choose'}
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
          </p>
          <h2 style={{ ...rv(visible, 0.1), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.6rem,6vw,2.2rem)' : 'clamp(2rem,3vw,2.8rem)', margin: 0 }}>
            {isAr ? 'ستة أسباب تجعل تركيا الخيار الأمثل' : 'Six Reasons Turkey is the Best Choice'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 1, background: t.border, borderRadius: 10, overflow: 'hidden' }}>
          {WHY_REASONS.map(({ Icon, titleAr, titleEn, descAr, descEn }, i) => (
            <div key={i} style={{
              ...rv(visible, 0.06 * i),
              background: t.bg, padding: isMobile ? '32px 22px' : '40px 32px',
              transition: 'background 0.28s', cursor: 'default',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = t.card; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = t.bg; }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 8, background: t.gold5, border: `1px solid ${t.gold4}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
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

function CitiesSection({ t, isMobile, isAr, tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: t.bg, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ marginBottom: isMobile ? 36 : 56 }}>
          <p style={{ ...rv(visible, 0), color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 20, height: 1, background: t.gold }} />
            {isAr ? 'أبرز المدن' : 'Top Cities'}
          </p>
          <h2 style={{ ...rv(visible, 0.08), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.5rem,5vw,2rem)' : 'clamp(1.8rem,3vw,2.5rem)', margin: 0 }}>
            {tr('turkey.cities.title')}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: 20 }}>
          {CITIES.map(({ nameAr, nameEn, descAr, descEn, highlights, photo }, i) => (
            <div key={i} style={{
              ...rv(visible, 0.1 + i * 0.1),
              background: t.altBg, border: `1px solid ${t.border}`,
              borderRadius: 8, overflow: 'hidden',
              transition: 'border-color 0.3s, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.gold3; el.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.border; el.style.transform = 'translateY(0)'; }}
            >
              <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt={isAr ? nameAr : nameEn} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 14, right: 14, fontFamily: "'Marcellus', serif", color: '#fff', fontSize: '1.3rem' }}>{isAr ? nameAr : nameEn}</div>
              </div>
              <div style={{ padding: '20px 22px' }}>
                <p style={{ color: t.txt3, fontSize: '0.83rem', lineHeight: 1.8, marginBottom: 14 }}>{isAr ? descAr : descEn}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {highlights.map((h, j) => (
                    <span key={j} style={{ background: t.gold5, border: `1px solid ${t.gold4}`, borderRadius: 3, padding: '3px 9px', color: t.gold, fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.05em' }}>{h}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection({ t, isMobile, isAr, tr: _tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: '#060606', borderTop: `1px solid ${t.gold4}`, borderBottom: `1px solid ${t.gold4}`, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 60 }}>
          <p style={{ ...rv(visible, 0), color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
            {isAr ? 'المحطات الكبرى' : 'Key Milestones'}
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
          </p>
          <h2 style={{ ...rv(visible, 0.08), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.5rem,5vw,2rem)' : 'clamp(1.8rem,3vw,2.4rem)', margin: 0 }}>
            {isAr ? 'مسيرة الاستثمار العربي في تركيا' : 'Arab Investment Journey in Turkey'}
          </h2>
        </div>
        <div style={{ position: 'relative', paddingRight: isMobile ? 0 : 24 }}>
          {!isMobile && <div style={{ position: 'absolute', right: 0, top: 8, bottom: 8, width: 1, background: `linear-gradient(to bottom, transparent, ${t.gold3}, transparent)` }} />}
          {TIMELINE.map(({ year, event }, i) => (
            <div key={i} style={{ ...rv(visible, 0.1 + i * 0.1), display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: i < TIMELINE.length - 1 ? 28 : 0 }}>
              <div style={{ background: t.gold5, border: `1px solid ${t.gold4}`, borderRadius: 6, padding: '8px 14px', flexShrink: 0, textAlign: 'center', minWidth: 64 }}>
                <Landmark size={12} color={t.gold} style={{ marginBottom: 4 }} />
                <div style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '0.88rem', fontWeight: 700 }}>{year}</div>
              </div>
              <div style={{ paddingTop: 6 }}>
                <p style={{ color: t.txt2, fontSize: '0.87rem', lineHeight: 1.75, margin: 0 }}>{event}</p>
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
    <section style={{ background: t.altBg, padding: isMobile ? '60px 18px' : '80px 32px', textAlign: 'center' }}>
      <div ref={ref} style={{ maxWidth: 600, margin: '0 auto' }}>
        <Star size={20} color={t.gold} strokeWidth={1.4} style={{ marginBottom: 20 }} />
        <h2 style={{ ...rv(visible, 0), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.5rem,5vw,2rem)' : 'clamp(1.8rem,3vw,2.4rem)', marginBottom: 14 }}>
          {isAr ? 'مستعد لتبدأ رحلتك في السوق التركي؟' : 'Ready to Start Your Journey in the Turkish Market?'}
        </h2>
        <p style={{ ...rv(visible, 0.08), color: t.txt3, fontSize: '0.88rem', lineHeight: 1.85, marginBottom: 32 }}>
          {isAr
            ? 'فريقنا المتخصص يمتلك المعرفة الميدانية والعلاقات الموثوقة لمساعدتك في اتخاذ القرار الصحيح.'
            : 'Our specialized team has the field knowledge and trusted relationships to help you make the right decision.'}
        </p>
        <div style={{ ...rv(visible, 0.14), display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/properties" style={{
            background: t.gold, border: 'none', borderRadius: 5,
            color: t.goldText, fontSize: '0.78rem', fontWeight: 700,
            padding: '13px 28px', cursor: 'pointer', letterSpacing: '0.08em',
            textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 0.2s', display: 'inline-block',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
          >
            {tr('cta.viewProperties')}
          </a>
          <a href="/contact" style={{
            background: 'transparent', border: `1px solid ${t.border2}`,
            borderRadius: 5, color: t.txt2, fontSize: '0.78rem',
            padding: '13px 24px', cursor: 'pointer', textDecoration: 'none',
            transition: 'all 0.2s', display: 'inline-block',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = t.gold3; el.style.color = t.gold; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = t.border2; el.style.color = t.txt2; }}
          >
            {isAr ? 'تواصل مع خبير' : 'Contact an Expert'}
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
