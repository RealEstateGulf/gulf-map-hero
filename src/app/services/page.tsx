'use client';

import { Search, Handshake, Key, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import { useContent } from '@/hooks/useContent';
import Navbar from '@/components/map/Navbar';
import FooterSection from '@/components/sections/FooterSection';

const SERVICES = [
  {
    Icon: Search,
    titleAr: 'البحث عن العقار المثالي',
    titleEn: 'Finding the Ideal Property',
    num: '01',
    descAr: 'نُعينك على اكتشاف العقارات التي تلائم أسلوب حياتك وطموحاتك الاستثمارية، عبر منهجية بحث دقيقة ومعرفة ميدانية عميقة بأكثر المناطق التركية طلباً.',
    descEn: 'We help you discover properties that match your lifestyle and investment ambitions through a precise methodology and deep field knowledge of Turkey\'s most sought-after areas.',
    featuresAr: ['تحليل السوق المحلي في المدينة المستهدفة', 'قائمة مخصصة من العقارات المطابقة لمعاييرك', 'جولات ميدانية بمرافقة خبير متخصص', 'تقييم عائد الاستثمار لكل خيار'],
    featuresEn: ['Local market analysis in your target city', 'Custom list of properties matching your criteria', 'Field tours with a specialist expert', 'ROI assessment for each option'],
    photo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
  },
  {
    Icon: ShieldCheck,
    titleAr: 'الاستشارات القانونية والتوثيق',
    titleEn: 'Legal Consultancy & Documentation',
    num: '02',
    descAr: 'نتولى كافة الجوانب القانونية لصفقتك العقارية بكل دقة ومهنية — من التحقق من سند الملكية حتى تسجيل العقار رسمياً باسمك.',
    descEn: 'We handle all legal aspects of your property transaction with precision and professionalism — from verifying the title deed to officially registering the property in your name.',
    featuresAr: ['التحقق من خلو العقار من الحقوق والرهون', 'صياغة عقود البيع والشراء باللغتين', 'استخراج الرقم الضريبي (TAX ID) للمستثمر', 'التنسيق مع كاتب العدل ودائرة السجل العقاري'],
    featuresEn: ['Verifying the property is free of encumbrances', 'Drafting sales contracts in both languages', 'Obtaining the investor\'s TAX ID', 'Coordinating with the notary and land registry'],
    photo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
  },
  {
    Icon: Handshake,
    titleAr: 'التفاوض وإتمام الصفقة',
    titleEn: 'Negotiation & Deal Closing',
    num: '03',
    descAr: 'خبراؤنا في التفاوض يمثّلونك بالكامل أمام البائع، لضمان أفضل سعر وأحسن شروط — دون أن تضطر للتواجد شخصياً في كل مرحلة.',
    descEn: 'Our negotiation experts fully represent you before the seller, ensuring the best price and terms — without you needing to be present at every stage.',
    featuresAr: ['تحليل السعر السوقي العادل للعقار', 'التفاوض المباشر مع البائع أو المطوّر', 'صياغة شروط الدفع والتسليم بما يحمي حقوقك', 'توكيل رسمي بالنيابة عنك إن لزم'],
    featuresEn: ['Analyzing the fair market price', 'Direct negotiation with the seller or developer', 'Drafting payment and delivery terms to protect your rights', 'Official power of attorney on your behalf if needed'],
    photo: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80',
  },
  {
    Icon: Key,
    titleAr: 'إدارة الأملاك والإيجار',
    titleEn: 'Property & Rental Management',
    num: '04',
    descAr: 'استثمارك يعمل لصالحك حتى وأنت بعيد — نرعى عقارك بالكامل من تشغيل وإيجار وصيانة، ونضمن لك تدفق دخل ثابت.',
    descEn: 'Your investment works for you even while you\'re away — we fully care for your property: operations, rental, and maintenance, ensuring a steady income stream.',
    featuresAr: ['تسويق العقار وإيجاده للمستأجرين المناسبين', 'تحصيل الإيجار وإدارة العقود', 'الصيانة الدورية والطارئة', 'تقارير شهرية مفصّلة عن أداء العقار'],
    featuresEn: ['Marketing the property and finding suitable tenants', 'Rent collection and contract management', 'Regular and emergency maintenance', 'Detailed monthly property performance reports'],
    photo: 'https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=900&q=80',
  },
  {
    Icon: HeartHandshake,
    titleAr: 'الدعم المتكامل بعد الشراء',
    titleEn: 'Comprehensive After-Purchase Support',
    num: '05',
    descAr: 'علاقتنا معك لا تنتهي عند التوقيع — نبقى بجانبك في كل ما يحتاجه عقارك وملفاتك القانونية والإدارية على مدار العام.',
    descEn: 'Our relationship with you doesn\'t end at signing — we remain by your side for everything your property and legal/administrative files need throughout the year.',
    featuresAr: ['المساعدة في فتح الحسابات البنكية التركية', 'الإشراف على إجراءات الجنسية أو الإقامة', 'تجديد العقود والوثائق الرسمية دورياً', 'الدعم الكامل باللغة العربية على مدار الساعة'],
    featuresEn: ['Assistance opening Turkish bank accounts', 'Supervising citizenship or residency procedures', 'Periodic renewal of contracts and official documents', 'Full Arabic language support around the clock'],
    photo: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80',
  },
];

const PROCESS = [
  { num: '01', titleAr: 'الاستشارة الأولى', titleEn: 'Initial Consultation', descAr: 'نجتمع بك (حضورياً أو عن بُعد) لفهم أهدافك الاستثمارية وميزانيتك والمنطقة المفضلة.', descEn: 'We meet with you (in-person or remotely) to understand your investment goals, budget and preferred area.' },
  { num: '02', titleAr: 'قائمة مخصصة', titleEn: 'Customized List', descAr: 'في خلال 48 ساعة نُعدّ قائمة عقارات مختارة تتناسب مع معاييرك، مع تقييم تفصيلي لكل خيار.', descEn: 'Within 48 hours we prepare a selected property list matching your criteria, with a detailed assessment of each.' },
  { num: '03', titleAr: 'الجولة الميدانية', titleEn: 'Field Tour', descAr: 'نرافقك (أو نرسل لك فيديو مباشر) في معاينة العقارات، وتقديم كل المعلومات التي تحتاجها.', descEn: 'We accompany you (or send you a live video) to view properties and provide all the information you need.' },
  { num: '04', titleAr: 'الإغلاق والمتابعة', titleEn: 'Closing & Follow-up', descAr: 'بعد اتخاذ قرارك، نُتمّ كل الإجراءات القانونية والتوثيق ونبقى معك في كل مراحل ما بعد الشراء.', descEn: 'After your decision, we complete all legal procedures and documentation and remain with you through all post-purchase stages.' },
];

export default function ServicesPage() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();
  const tr = useT();
  const { get, getImg } = useContent('services');
  return (
    <main style={{ background: t.bg, direction: dir, minHeight: '100vh' }}>
      <Navbar />
      <HeroSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <ServicesDetailSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <ProcessSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <CtaBanner t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <FooterSection />
    </main>
  );
}

function HeroSection({ t, isMobile, isAr, tr, get }: SP) {
  return (
    <div style={{
      background: '#060606', borderBottom: `1px solid ${t.gold4}`,
      padding: isMobile ? '120px 20px 64px' : '150px 32px 90px',
      textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(rgba(217,186,160,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(217,186,160,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
        <p style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <span style={{ display: 'inline-block', width: 28, height: 1, background: t.gold }} />
          {isAr ? 'ما الذي نقدّمه' : 'What We Offer'}
          <span style={{ display: 'inline-block', width: 28, height: 1, background: t.gold }} />
        </p>
        <h1 style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: isMobile ? 'clamp(2rem,8vw,3rem)' : 'clamp(2.8rem,5vw,4rem)', lineHeight: 1.2, marginBottom: 18 }}>
          {get('hero.title', isAr, tr('services.title'))}
          <br />
          <em style={{ color: t.gold }}>{get('hero.subtitle', isAr, isAr ? 'من البحث حتى بعد الشراء' : 'From Search to After Purchase')}</em>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: isMobile ? '0.88rem' : '0.96rem', lineHeight: 1.9, maxWidth: 520, margin: '0 auto' }}>
          {isAr
            ? 'خمس خدمات متكاملة تغطي كل مراحل رحلتك العقارية في تركيا — فريق واحد، دعم كامل، نتائج مضمونة.'
            : 'Five integrated services covering every stage of your property journey in Turkey — one team, full support, guaranteed results.'}
        </p>
      </div>
    </div>
  );
}

function ServicesDetailSection({ t, isMobile, isAr, tr: _tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: t.bg, padding: isMobile ? '48px 0' : '80px 0' }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        {SERVICES.map(({ Icon, titleAr, titleEn, num, descAr, descEn, featuresAr, featuresEn, photo }, i) => {
          const isEven = i % 2 === 1;
          return (
            <div key={i} style={{
              ...rv(visible, 0.06 * i),
              display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? 28 : 64, alignItems: 'center',
              padding: isMobile ? '40px 0' : '64px 0',
              borderBottom: i < SERVICES.length - 1 ? `1px solid ${t.border}` : 'none',
              direction: !isMobile && isEven ? 'ltr' : 'rtl',
            }}>
              <div style={{ direction: 'rtl' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 8, background: t.gold5, border: `1px solid ${t.gold4}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={t.gold} strokeWidth={1.4} />
                  </div>
                  <span style={{ fontFamily: "'Marcellus', serif", color: t.txt4, fontSize: '0.7rem' }}>{num}</span>
                </div>
                <h2 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.3rem,5vw,1.7rem)' : 'clamp(1.5rem,2.5vw,2rem)', margin: '0 0 14px' }}>
                  {isAr ? titleAr : titleEn}
                </h2>
                <p style={{ color: t.txt3, fontSize: '0.86rem', lineHeight: 1.85, marginBottom: 22 }}>{isAr ? descAr : descEn}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(isAr ? featuresAr : featuresEn).map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <CheckCircle2 size={14} color={t.gold} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ color: t.txt2, fontSize: '0.82rem', lineHeight: 1.6 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ height: isMobile ? 220 : 340, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt={isAr ? titleAr : titleEn} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, transparent 50%)' }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProcessSection({ t, isMobile, isAr, tr: _tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: '#060606', borderTop: `1px solid ${t.gold4}`, borderBottom: `1px solid ${t.gold4}`, padding: isMobile ? '60px 0' : '90px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 56 }}>
          <p style={{ ...rv(visible, 0), color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
            {isAr ? 'كيف نعمل' : 'How We Work'}
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
          </p>
          <h2 style={{ ...rv(visible, 0.08), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.5rem,5vw,2rem)' : 'clamp(1.8rem,3vw,2.5rem)', margin: 0 }}>
            {isAr ? 'رحلتك في أربع خطوات' : 'Your Journey in Four Steps'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? 16 : 1, background: isMobile ? 'none' : t.border, borderRadius: isMobile ? 0 : 8, overflow: 'hidden' }}>
          {PROCESS.map(({ num, titleAr, titleEn, descAr, descEn }, i) => (
            <div key={i} style={{
              ...rv(visible, 0.1 + i * 0.1),
              background: '#060606', padding: isMobile ? '24px 16px' : '36px 28px',
              border: isMobile ? `1px solid ${t.border}` : 'none', borderRadius: isMobile ? 6 : 0,
            }}>
              <div style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '1.6rem', marginBottom: 14 }}>{num}</div>
              <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '0.95rem', margin: '0 0 10px' }}>{isAr ? titleAr : titleEn}</h3>
              <p style={{ color: t.txt4, fontSize: '0.78rem', lineHeight: 1.75, margin: 0 }}>{isAr ? descAr : descEn}</p>
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
    <section style={{ background: t.altBg, padding: isMobile ? '64px 18px' : '90px 32px', textAlign: 'center' }}>
      <div ref={ref} style={{ maxWidth: 560, margin: '0 auto' }}>
        <h2 style={{ ...rv(visible, 0), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.5rem,5vw,2rem)' : 'clamp(1.8rem,3vw,2.4rem)', marginBottom: 14 }}>
          {isAr ? 'مستعد لتبدأ؟' : 'Ready to Start?'}
        </h2>
        <p style={{ ...rv(visible, 0.08), color: t.txt3, fontSize: '0.88rem', lineHeight: 1.85, marginBottom: 32 }}>
          {isAr
            ? 'استشارتك الأولى مجانية — تحدّث مع أحد خبرائنا اليوم واكتشف الفرص المناسبة لك.'
            : 'Your first consultation is free — speak with one of our experts today and discover the right opportunities for you.'}
        </p>
        <div style={{ ...rv(visible, 0.14), display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/contact" style={{
            background: t.gold, borderRadius: 5, color: t.goldText,
            fontSize: '0.78rem', fontWeight: 700, padding: '13px 28px',
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
            borderRadius: 5, color: t.txt2, fontSize: '0.78rem',
            padding: '13px 24px', textDecoration: 'none',
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
