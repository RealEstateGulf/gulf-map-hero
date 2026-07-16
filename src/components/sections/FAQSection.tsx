'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useScrollReveal, rv } from '@/hooks/useScrollReveal';
import { useIsMobile } from '@/hooks/useResponsive';
import { useLanguage } from '@/context/LanguageContext';

const FAQS = [
  {
    qAr: 'ما الحد الأدنى للاستثمار للحصول على الجنسية التركية؟',
    qEn: 'What is the minimum investment to obtain Turkish citizenship?',
    aAr: 'يبلغ الحد الأدنى للاستثمار العقاري للحصول على الجنسية التركية 400,000 دولار أمريكي، ويجب الاحتفاظ بالعقار لمدة لا تقل عن 3 سنوات وفق اللوائح الحالية.',
    aEn: 'The minimum real estate investment to obtain Turkish citizenship is $400,000 USD, and the property must be held for at least 3 years according to current regulations.',
  },
  {
    qAr: 'كم يستغرق الحصول على الجنسية التركية عبر الاستثمار؟',
    qEn: 'How long does it take to obtain Turkish citizenship through investment?',
    aAr: 'تستغرق العملية عادةً ما بين 3 إلى 6 أشهر من تاريخ استيفاء جميع المستندات المطلوبة وتسجيل العقار رسمياً باسمك.',
    aEn: 'The process usually takes between 3 to 6 months from the date all required documents are fulfilled and the property is officially registered in your name.',
  },
  {
    qAr: 'هل يمكن للمستثمر الأجنبي تملّك العقارات في تركيا بالكامل؟',
    qEn: 'Can a foreign investor fully own properties in Turkey?',
    aAr: 'نعم، يحق للمستثمرين الأجانب من معظم الجنسيات تملّك العقارات في تركيا بصورة كاملة دون الحاجة إلى شريك تركي.',
    aEn: 'Yes, foreign investors from most nationalities are entitled to fully own properties in Turkey without the need for a Turkish partner.',
  },
  {
    qAr: 'ما مميزات الجنسية التركية للمستثمر العربي؟',
    qEn: 'What are the benefits of Turkish citizenship for Arab investors?',
    aAr: 'تمنحك الجنسية التركية حرية السفر إلى أكثر من 110 دولة بدون تأشيرة، وإمكانية التقدم للحصول على تأشيرة E-2 الأمريكية، فضلاً عن المزايا الاقتصادية والتعليمية والصحية داخل تركيا.',
    aEn: 'Turkish citizenship gives you visa-free travel to more than 110 countries, the ability to apply for a US E-2 visa, as well as economic, educational and healthcare benefits within Turkey.',
  },
  {
    qAr: 'هل أحتاج إلى التواجد في تركيا طوال فترة الاستثمار؟',
    qEn: 'Do I need to be present in Turkey throughout the investment period?',
    aAr: 'لا، يمكننا إدارة كامل العملية نيابةً عنك عبر التوكيل الرسمي. تأتي إلى تركيا مرة واحدة فقط لتوقيع عقد الشراء، ونحن نتولى كل الإجراءات الأخرى.',
    aEn: 'No, we can manage the entire process on your behalf through official power of attorney. You visit Turkey only once to sign the purchase contract, and we handle all other procedures.',
  },
];

export default function FAQSection() {
  const { t } = useTheme();
  const isMobile = useIsMobile();
  const { ref, visible } = useScrollReveal();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { dir, isAr } = useLanguage();

  return (
    <section style={{ background: t.altBg, direction: dir, padding: isMobile ? '60px 0' : '100px 0', borderTop: '1px solid rgba(217,186,160,0.1)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 18px' : '0 32px' }}>

        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? 16 : 80,
            marginBottom: isMobile ? 36 : 64,
            alignItems: 'flex-end',
          }}
        >
          <div style={rv(visible, 0)}>
            <p style={{
              color: t.gold, fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ display: 'inline-block', width: 24, height: 1, background: t.gold }} />
              {isAr ? 'أسئلة شائعة' : 'Frequently Asked Questions'}
            </p>
            <h2 style={{
              fontFamily: "'Marcellus', serif", color: t.txt,
              fontSize: isMobile ? 'clamp(1.6rem, 6vw, 2.4rem)' : 'clamp(2rem, 3.5vw, 3rem)',
              lineHeight: 1.25, margin: 0,
            }}>
              {isAr
                ? <>أسئلتكم،<br /><em>أُجيب عليها بأناقة</em></>
                : <>Your Questions,<br /><em>Answered Elegantly</em></>}
            </h2>
          </div>
          {!isMobile && (
            <p style={{ ...rv(visible, 0.15), color: t.txt3, fontSize: '0.88rem', lineHeight: 1.85, maxWidth: 380 }}>
              {isAr
                ? 'إجابات شاملة على أكثر الأسئلة التي يطرحها المستثمرون العرب حول الاستثمار العقاري في تركيا.'
                : 'Comprehensive answers to the most common questions Arab investors ask about real estate investment in Turkey.'}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} style={{ ...rv(visible, 0.08 + i * 0.07), borderTop: `1px solid ${t.border}` }}>
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  style={{
                    width: '100%', background: 'none', border: 'none',
                    padding: isMobile ? '18px 0' : '22px 0',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', cursor: 'pointer',
                    gap: 16, textAlign: dir === 'rtl' ? 'right' : 'left',
                  }}
                >
                  <span style={{
                    color: isOpen ? t.gold : t.txt,
                    fontFamily: "'Marcellus', serif",
                    fontSize: isMobile ? '0.92rem' : '1rem',
                    lineHeight: 1.4, flex: 1, transition: 'color 0.25s',
                    textAlign: dir === 'rtl' ? 'right' : 'left',
                  }}>
                    {isAr ? faq.qAr : faq.qEn}
                  </span>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                    background: isOpen ? t.gold : 'transparent',
                    border: `1px solid ${isOpen ? t.gold : t.border2}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s',
                  }}>
                    {isOpen ? <Minus size={13} color={t.goldText} /> : <Plus size={13} color={t.txt3} />}
                  </div>
                </button>
                <div style={{
                  maxHeight: isOpen ? 300 : 0, overflow: 'hidden',
                  transition: 'max-height 0.4s cubic-bezier(0.22,1,0.36,1)',
                }}>
                  <p style={{
                    color: t.txt2, fontSize: '0.88rem',
                    lineHeight: 1.9, paddingBottom: 24, margin: 0,
                  }}>
                    {isAr ? faq.aAr : faq.aEn}
                  </p>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: `1px solid ${t.border}` }} />
        </div>
      </div>
    </section>
  );
}
