'use client';

import { useState } from 'react';
import {
  CheckCircle2, BadgeCheck, Clock, Globe2, Home, FileText,
  ShieldCheck, Plane, Users, Star, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/useResponsive';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useLanguage } from '@/context/LanguageContext';
import { useT } from '@/hooks/useT';
import { useContent } from '@/hooks/useContent';
import Navbar from '@/components/map/Navbar';
import FooterSection from '@/components/sections/FooterSection';

const INVESTMENT_TYPES = [
  {
    Icon: Home,
    titleAr: 'شراء عقار أو أكثر',
    titleEn: 'Purchase One or More Properties',
    amount: '$400,000',
    descAr: 'تملّك عقار أو مجموعة عقارات بما لا يقل عن $400,000 والاحتفاظ بها 3 سنوات على الأقل.',
    descEn: 'Own a property or group of properties worth at least $400,000 and hold them for at least 3 years.',
    popular: true,
  },
  {
    Icon: FileText,
    titleAr: 'صناديق الاستثمار أو الأسهم',
    titleEn: 'Investment Funds or Stocks',
    amount: '$500,000',
    descAr: 'الاستثمار في صناديق استثمار عقاري أو حيازة أسهم في شركات تركية معتمدة.',
    descEn: 'Invest in real estate investment funds or hold shares in approved Turkish companies.',
    popular: false,
  },
  {
    Icon: Users,
    titleAr: 'إنشاء فرص عمل',
    titleEn: 'Creating Jobs',
    amountAr: '50 وظيفة',
    amountEn: '50 Jobs',
    amount: '',
    descAr: 'توفير 50 وظيفة دائمة للمواطنين الأتراك مع إثبات الاستدامة أمام وزارة العمل.',
    descEn: 'Provide 50 permanent jobs for Turkish citizens with proof of sustainability before the Ministry of Labor.',
    popular: false,
  },
];

const STEPS = [
  { num: '01', titleAr: 'اختيار العقار وإتمام الشراء', titleEn: 'Choose Property & Complete Purchase', descAr: 'نساعدك في اختيار العقار المناسب بقيمة لا تقل عن $400,000، وإتمام عقد البيع وتسجيله رسمياً لدى مديرية السجل العقاري.', descEn: 'We help you select an appropriate property worth at least $400,000, complete the sales contract and register it at the land registry.', durationAr: 'أسبوعان', durationEn: '2 weeks' },
  { num: '02', titleAr: 'شهادة الملكية وتقرير التقييم', titleEn: 'Title Deed & Valuation Report', descAr: 'استخراج شهادة ملكية رسمية (TAPU) وتقرير تقييم عقاري معتمد من مقيّم مرخص يثبت أن قيمة العقار تستوفي الحد المطلوب.', descEn: 'Obtaining an official title deed (TAPU) and an approved property valuation report from a licensed appraiser.', durationAr: '3-5 أيام', durationEn: '3-5 days' },
  { num: '03', titleAr: 'تقديم طلب الجنسية', titleEn: 'Submit Citizenship Application', descAr: 'تقديم الملف الكامل (عقد الشراء، جواز السفر، شهادة الملكية، شهادة عدم الإفلاس) لدى مديرية الهجرة العامة.', descEn: 'Submitting the complete file (purchase contract, passport, title deed, bankruptcy clearance) to the Directorate General of Migration.', durationAr: '1-3 أسابيع', durationEn: '1-3 weeks' },
  { num: '04', titleAr: 'مراجعة الطلب والموافقة', titleEn: 'Application Review & Approval', descAr: 'تتولى وزارة الداخلية مراجعة الطلب والتحقق من مطابقة الشروط، ثم إحالته للمراسيم الرئاسية للاعتماد النهائي.', descEn: 'The Ministry of Interior reviews the application and verifies compliance, then refers it to presidential decrees for final approval.', durationAr: '2-5 أشهر', durationEn: '2-5 months' },
  { num: '05', titleAr: 'استلام جواز السفر التركي', titleEn: 'Receive Turkish Passport', descAr: 'بعد صدور المرسوم، تُستخرج بطاقة الهوية التركية وجواز السفر لك ولعائلتك المقيمة معك (الزوجة والأطفال دون 18).', descEn: 'After the decree is issued, the Turkish ID and passport are issued for you and your residing family (spouse and children under 18).', durationAr: '2-4 أسابيع', durationEn: '2-4 weeks' },
];

const BENEFITS = [
  { Icon: Globe2, titleAr: 'دخول 110+ دولة بدون تأشيرة', titleEn: 'Visa-Free Access to 110+ Countries', descAr: 'وصول فوري لمعظم دول أوروبا والشرق الأوسط وآسيا بجواز السفر التركي.', descEn: 'Immediate access to most European, Middle Eastern and Asian countries with a Turkish passport.' },
  { Icon: Plane, titleAr: 'التقدم للتأشيرة الأمريكية E-2', titleEn: 'Apply for US E-2 Visa', descAr: 'تركيا موقّعة على اتفاقية الاستثمار مع الولايات المتحدة، مما يتيح التقدم بتأشيرة E-2 للمستثمرين.', descEn: 'Turkey is signatory to the investment treaty with the US, enabling investors to apply for an E-2 visa.' },
  { Icon: ShieldCheck, titleAr: 'الجنسية مدى الحياة وقابلة للتوريث', titleEn: 'Lifetime & Heritable Citizenship', descAr: 'جنسية تركية كاملة تُنقل للأبناء والأجيال القادمة دون أي شروط إضافية.', descEn: 'Full Turkish citizenship transferred to children and future generations without additional requirements.' },
  { Icon: BadgeCheck, titleAr: 'ازدواجية الجنسية مسموحة', titleEn: 'Dual Citizenship Allowed', descAr: 'لا تُلزمك تركيا بالتخلي عن جنسيتك الأصلية — يمكنك الاحتفاظ بجوازَي سفر.', descEn: 'Turkey does not require you to renounce your original nationality — you can hold two passports.' },
  { Icon: Home, titleAr: 'إقامة دائمة للعائلة', titleEn: 'Permanent Residence for Family', descAr: 'تشمل الجنسية الزوجة والأطفال دون 18 سنة، ويمكن تضمين الأبوين في بعض الحالات.', descEn: 'Citizenship includes spouse and children under 18, with parents includable in some cases.' },
  { Icon: Star, titleAr: 'سوق أوروبي مفتوح', titleEn: 'Open European Market', descAr: 'تركيا عضو في الاتحاد الجمركي الأوروبي مما يوفر مزايا تجارية استثنائية.', descEn: 'Turkey is a member of the European Customs Union, providing exceptional trade advantages.' },
];

const FAQS = [
  {
    qAr: 'هل يمكن تأجير العقار خلال فترة الثلاث سنوات؟',
    qEn: 'Can the property be rented during the three-year period?',
    aAr: 'نعم، يُسمح بتأجير العقار والحصول على عائد إيجاري كامل طوال فترة الاحتفاظ البالغة 3 سنوات.',
    aEn: 'Yes, you may rent the property and receive full rental income throughout the 3-year holding period.',
  },
  {
    qAr: 'هل الزوجة والأطفال يحصلون على الجنسية تلقائياً؟',
    qEn: 'Do spouses and children automatically receive citizenship?',
    aAr: 'نعم، يشمل طلب الجنسية الزوجة والأطفال دون سن 18 عاماً بشكل تلقائي دون رسوم إضافية.',
    aEn: 'Yes, the citizenship application automatically includes the spouse and children under 18 without additional fees.',
  },
  {
    qAr: 'هل يجب الإقامة في تركيا لاستيفاء الشروط؟',
    qEn: 'Is residency in Turkey required to qualify?',
    aAr: 'لا، لا يُشترط الإقامة الفعلية في تركيا للحصول على الجنسية بالاستثمار.',
    aEn: 'No, actual residency in Turkey is not required to obtain citizenship by investment.',
  },
  {
    qAr: 'كم يستغرق الحصول على الجنسية في المجمل؟',
    qEn: 'How long does the citizenship process take in total?',
    aAr: 'تتراوح مدة العملية الكاملة من 4 إلى 8 أشهر من تاريخ إتمام الشراء وتسجيل العقار.',
    aEn: 'The full process takes between 4 and 8 months from the date of purchase completion and property registration.',
  },
  {
    qAr: 'هل يمكن شراء أكثر من عقار لاستيفاء الحد الأدنى؟',
    qEn: 'Can multiple properties be purchased to meet the minimum?',
    aAr: 'نعم، يُمكن الجمع بين عقارات متعددة يُجمِع إجمالي قيمتها $400,000 أو أكثر.',
    aEn: 'Yes, multiple properties can be combined with a total value of $400,000 or more.',
  },
  {
    qAr: 'ما الوثائق المطلوبة للتقديم؟',
    qEn: 'What documents are required for the application?',
    aAr: 'جواز السفر ساري المفعول، عقد الشراء، سند الملكية (TAPU)، تقرير التقييم العقاري، شهادة عدم الإفلاس، وشهادة الميلاد لكل فرد مشمول في الطلب.',
    aEn: 'Valid passport, purchase contract, title deed (TAPU), property valuation report, bankruptcy clearance, and birth certificates for all individuals included in the application.',
  },
];

export default function CitizenshipPage() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { dir, isAr } = useLanguage();
  const tr = useT();
  const { get, getImg } = useContent('citizenship');
  return (
    <main style={{ background: t.bg, direction: dir, minHeight: '100vh' }}>
      <Navbar />
      <HeroSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <InvestmentTypesSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <StepsSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <BenefitsSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <FaqSection t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <CtaBanner t={t} isMobile={isMobile} isAr={isAr} tr={tr} get={get} getImg={getImg} />
      <FooterSection />
    </main>
  );
}

function HeroSection({ t, isMobile, isAr, tr, get }: SP) {
  return (
    <div style={{
      minHeight: isMobile ? '60vh' : '70vh',
      background: 'linear-gradient(160deg, #080808 0%, #181208 45%, #080808 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${t.gold4}`,
      padding: isMobile ? '120px 20px 64px' : '140px 32px 80px', textAlign: 'center',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'linear-gradient(rgba(217,186,160,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(217,186,160,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(217,186,160,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: '2.5rem' }}>🇹🇷</div>
        <div style={{ width: 1, height: 36, background: t.gold4 }} />
        <Globe2 size={28} color={t.gold} strokeWidth={1.2} />
      </div>
      <p style={{ color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 18, position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ display: 'inline-block', width: 28, height: 1, background: t.gold }} />
        {get('hero.title', isAr, tr('citizen.title'))}
        <span style={{ display: 'inline-block', width: 28, height: 1, background: t.gold }} />
      </p>
      <h1 style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: isMobile ? 'clamp(1.9rem,7vw,2.8rem)' : 'clamp(2.6rem,4.5vw,4rem)', lineHeight: 1.2, marginBottom: 20, position: 'relative' }}>
        {isAr ? 'جواز سفر تركي' : 'Turkish Passport'}
        <br />
        <em style={{ color: t.gold }}>{get('hero.subtitle', isAr, isAr ? 'بحد أدنى $400,000' : 'Starting from $400,000')}</em>
      </h1>
      <p style={{ color: t.txt3, fontSize: isMobile ? '0.88rem' : '0.96rem', lineHeight: 1.9, maxWidth: 520, position: 'relative', marginBottom: 40 }}>
        {isAr
          ? 'الطريق الأسرع والأكثر موثوقية للحصول على الجنسية التركية — استثمر في عقار وامتلك جوازاً يفتح لك أبواب 110+ دولة حول العالم'
          : 'The fastest and most reliable path to Turkish citizenship — invest in a property and own a passport that opens the doors of 110+ countries worldwide'}
      </p>
      <div style={{ position: 'relative', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { labelAr: 'الحد الأدنى $400,000', labelEn: 'Min. $400,000', icon: '💰' },
          { labelAr: 'خلال 4-8 أشهر', labelEn: 'Within 4-8 months', icon: '⏱' },
          { labelAr: 'للعائلة كاملةً', labelEn: 'For the whole family', icon: '👨‍👩‍👧' },
        ].map(({ labelAr, labelEn, icon }, i) => (
          <div key={i} style={{ background: t.gold5, border: `1px solid ${t.gold4}`, borderRadius: 6, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 7, color: t.gold, fontSize: '0.75rem', fontWeight: 600 }}>
            <span>{icon}</span>{isAr ? labelAr : labelEn}
          </div>
        ))}
      </div>
    </div>
  );
}

function InvestmentTypesSection({ t, isMobile, isAr, tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: t.altBg, borderBottom: `1px solid ${t.border}`, padding: isMobile ? '60px 0' : '90px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 56 }}>
          <p style={{ ...rv(visible, 0), color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
            {tr('citizen.types.title')}
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
          </p>
          <h2 style={{ ...rv(visible, 0.08), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.5rem,5vw,2rem)' : 'clamp(1.8rem,3vw,2.5rem)', margin: 0 }}>
            {isAr ? 'اختر مسار استثمارك للجنسية' : 'Choose Your Investment Path to Citizenship'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 18 }}>
          {INVESTMENT_TYPES.map((item, i) => { const { Icon, titleAr, titleEn, amount, descAr, descEn, popular } = item; const displayAmount = (item as any).amountAr ? (isAr ? (item as any).amountAr : (item as any).amountEn) : amount; return (
            <div key={i} style={{
              ...rv(visible, 0.1 + i * 0.12),
              background: popular ? 'linear-gradient(160deg, #1a1410 0%, #0f0d0a 100%)' : t.bg,
              border: `1px solid ${popular ? t.gold : t.border}`,
              borderRadius: 8, overflow: 'hidden',
              boxShadow: popular ? `0 0 40px rgba(217,186,160,0.08)` : 'none',
            }}>
              {popular && (
                <div style={{ background: t.gold, color: t.goldText, textAlign: 'center', fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.18em', padding: '5px 0', textTransform: 'uppercase' }}>
                  {isAr ? 'الخيار الأكثر شيوعاً' : 'Most Popular Choice'}
                </div>
              )}
              <div style={{ padding: isMobile ? '26px 22px' : '32px 28px' }}>
                <div style={{ width: 46, height: 46, borderRadius: 8, background: t.gold5, border: `1px solid ${t.gold4}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={20} color={t.gold} strokeWidth={1.4} />
                </div>
                <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '1rem', margin: '0 0 6px' }}>{isAr ? titleAr : titleEn}</h3>
                <div style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '1.4rem', marginBottom: 12 }}>
                  {displayAmount}
                </div>
                <p style={{ color: t.txt3, fontSize: '0.82rem', lineHeight: 1.8, margin: 0 }}>{isAr ? descAr : descEn}</p>
              </div>
            </div>
          ); })}
        </div>
      </div>
    </section>
  );
}

function StepsSection({ t, isMobile, isAr, tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: t.bg, padding: isMobile ? '60px 0' : '100px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: isMobile ? 44 : 64 }}>
          <p style={{ ...rv(visible, 0), color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
            {tr('citizen.process.title')}
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
          </p>
          <h2 style={{ ...rv(visible, 0.08), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.5rem,5vw,2rem)' : 'clamp(1.8rem,3vw,2.5rem)', margin: 0 }}>
            {isAr ? 'من الشراء إلى جواز السفر' : 'From Purchase to Passport'}
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STEPS.map(({ num, titleAr, titleEn, descAr, descEn, durationAr, durationEn }, i) => (
            <div key={i} style={{
              ...rv(visible, 0.08 + i * 0.1),
              display: 'flex', gap: isMobile ? 16 : 24, alignItems: 'flex-start',
              padding: '24px 0', borderBottom: i < STEPS.length - 1 ? `1px solid ${t.border}` : 'none',
            }}>
              <div style={{ width: 52, height: 52, flexShrink: 0, background: t.gold5, border: `1px solid ${t.gold4}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Marcellus', serif", color: t.gold, fontSize: '0.9rem' }}>{num}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                  <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '1rem', margin: 0 }}>{isAr ? titleAr : titleEn}</h3>
                  <span style={{ background: t.gold5, border: `1px solid ${t.gold4}`, borderRadius: 3, padding: '2px 8px', color: t.gold, fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <Clock size={9} />
                    {isAr ? durationAr : durationEn}
                  </span>
                </div>
                <p style={{ color: t.txt3, fontSize: '0.83rem', lineHeight: 1.8, margin: 0 }}>{isAr ? descAr : descEn}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, background: t.altBg, border: `1px solid ${t.gold4}`, borderRadius: 8, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <CheckCircle2 size={18} color={t.gold} strokeWidth={1.5} />
          <div>
            <div style={{ color: t.txt, fontSize: '0.86rem', fontWeight: 600 }}>{isAr ? 'المدة الإجمالية المتوقعة: 4 – 8 أشهر' : 'Expected Total Duration: 4 – 8 Months'}</div>
            <div style={{ color: t.txt4, fontSize: '0.74rem', marginTop: 3 }}>{isAr ? 'تشمل جميع مراحل الشراء والتسجيل والمراجعة الحكومية' : 'Includes all purchase, registration and government review stages'}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection({ t, isMobile, isAr, tr }: SP) {
  const { ref, visible } = useScrollReveal();
  return (
    <section style={{ background: '#060606', borderTop: `1px solid ${t.gold4}`, borderBottom: `1px solid ${t.gold4}`, padding: isMobile ? '60px 0' : '90px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 56 }}>
          <p style={{ ...rv(visible, 0), color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
            {tr('citizen.benefits.title')}
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
          </p>
          <h2 style={{ ...rv(visible, 0.08), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.5rem,5vw,2rem)' : 'clamp(1.8rem,3vw,2.5rem)', margin: 0 }}>
            {isAr ? 'ما الذي تكسبه بجوازك التركي؟' : 'What Do You Gain With Your Turkish Passport?'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 1, background: t.border, borderRadius: 10, overflow: 'hidden' }}>
          {BENEFITS.map(({ Icon, titleAr, titleEn, descAr, descEn }, i) => (
            <div key={i} style={{
              ...rv(visible, 0.06 * i),
              background: '#060606', padding: isMobile ? '28px 20px' : '36px 28px',
              transition: 'background 0.25s', cursor: 'default',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#0f0f0f'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = '#060606'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(217,186,160,0.08)', border: `1px solid rgba(217,186,160,0.18)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={18} color={t.gold} strokeWidth={1.4} />
              </div>
              <h3 style={{ fontFamily: "'Marcellus', serif", color: t.txt, fontSize: '0.98rem', margin: '0 0 8px' }}>{isAr ? titleAr : titleEn}</h3>
              <p style={{ color: t.txt4, fontSize: '0.8rem', lineHeight: 1.8, margin: 0 }}>{isAr ? descAr : descEn}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ t, isMobile, isAr, tr }: SP) {
  const { ref, visible } = useScrollReveal();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section style={{ background: t.altBg, padding: isMobile ? '60px 0' : '90px 0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>
        <div ref={ref} style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 52 }}>
          <p style={{ ...rv(visible, 0), color: t.gold, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
            {tr('citizen.faq.title')}
            <span style={{ display: 'inline-block', width: 22, height: 1, background: t.gold }} />
          </p>
          <h2 style={{ ...rv(visible, 0.08), fontFamily: "'Marcellus', serif", color: t.txt, fontSize: isMobile ? 'clamp(1.5rem,5vw,2rem)' : 'clamp(1.8rem,3vw,2.4rem)', margin: 0 }}>
            {isAr ? 'إجابات على أكثر الأسئلة شيوعاً' : 'Answers to the Most Common Questions'}
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {FAQS.map(({ qAr, qEn, aAr, aEn }, i) => (
            <div key={i} style={{
              ...rv(visible, 0.06 + i * 0.06),
              background: t.bg, border: `1px solid ${open === i ? t.gold3 : t.border}`,
              borderRadius: i === 0 ? '8px 8px 0 0' : i === FAQS.length - 1 ? '0 0 8px 8px' : '0',
              overflow: 'hidden', transition: 'border-color 0.25s',
            }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', padding: '18px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, textAlign: 'right' }}>
                <span style={{ color: t.txt, fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.5, flex: 1, textAlign: 'right' }}>{isAr ? qAr : qEn}</span>
                {open === i ? <ChevronUp size={16} color={t.gold} style={{ flexShrink: 0 }} /> : <ChevronDown size={16} color={t.txt4} style={{ flexShrink: 0 }} />}
              </button>
              {open === i && (
                <div style={{ padding: '0 22px 20px' }}>
                  <div style={{ width: '100%', height: 1, background: t.border, marginBottom: 14 }} />
                  <p style={{ color: t.txt3, fontSize: '0.84rem', lineHeight: 1.85, margin: 0 }}>{isAr ? aAr : aEn}</p>
                </div>
              )}
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
        <div style={{ fontSize: '2.2rem', marginBottom: 20 }}>🇹🇷</div>
        <h2 style={{ ...rv(visible, 0), fontFamily: "'Marcellus', serif", color: '#fff', fontSize: isMobile ? 'clamp(1.5rem,5vw,2rem)' : 'clamp(1.8rem,3vw,2.4rem)', marginBottom: 14 }}>
          {isAr ? 'ابدأ رحلتك نحو الجنسية التركية اليوم' : 'Start Your Journey to Turkish Citizenship Today'}
        </h2>
        <p style={{ ...rv(visible, 0.08), color: t.txt3, fontSize: '0.88rem', lineHeight: 1.85, marginBottom: 36 }}>
          {isAr
            ? 'فريقنا القانوني المتخصص يرافقك في كل خطوة — من اختيار العقار حتى استلام جواز السفر.'
            : 'Our specialized legal team accompanies you at every step — from selecting the property to receiving the passport.'}
        </p>
        <div style={{ ...rv(visible, 0.14), display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/contact" style={{ background: t.gold, border: 'none', borderRadius: 5, color: t.goldText, fontSize: '0.8rem', fontWeight: 700, padding: '14px 30px', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 0.2s', display: 'inline-block' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
          >
            {tr('cta.consult')}
          </a>
          <a href="/vip" style={{ background: 'transparent', border: `1px solid ${t.border2}`, borderRadius: 5, color: t.txt2, fontSize: '0.8rem', padding: '14px 24px', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s', display: 'inline-block' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = t.gold3; el.style.color = t.gold; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = t.border2; el.style.color = t.txt2; }}
          >
            {isAr ? 'شبكة VIP' : 'VIP Network'}
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
