import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminHeader from '@/components/admin/AdminHeader';
import ContentEditor from '@/components/admin/ContentEditor';

const PAGE_LABELS: Record<string, string> = {
  home: 'Ana Sayfa', about: 'Hakkımızda', services: 'Hizmetler',
  turkey: 'Türkiye', citizenship: 'Vatandaşlık', vip: 'VIP',
  contact: 'İletişim', properties: 'İlanlar', insights: 'Blog', popup: 'Popup',
};

// type: 'text' | 'textarea' | 'image'
type FieldDef = { key: string; label: string; type?: 'text' | 'textarea' | 'image'; defaultAr?: string; defaultEn?: string };

const PAGE_FIELDS: Record<string, FieldDef[]> = {
  home: [
    { key: 'hero.badge',     label: 'Hero Badge (küçük üst yazı)', type: 'text',     defaultAr: 'وجهة الاستثمار الأولى للخليجيين',  defaultEn: 'The #1 Investment Destination for Gulf Investors' },
    { key: 'hero.title1',    label: 'Hero Başlık 1. Satır',        type: 'text',     defaultAr: 'استثمر في',                          defaultEn: 'Invest in' },
    { key: 'hero.title2',    label: 'Hero Başlık 2. Satır (Altın)', type: 'text',    defaultAr: 'عقارات تركيا',                       defaultEn: 'Turkish Real Estate' },
    { key: 'hero.sub',       label: 'Hero Alt Başlık',             type: 'textarea', defaultAr: 'فرص استثمارية فاخرة في قلب إسطنبول وأبرز المدن التركية', defaultEn: "Luxury investment opportunities in the heart of Istanbul and Turkey's top cities" },
    { key: 'hero.image',     label: 'Hero Arka Plan Görseli',      type: 'image' },
    { key: 'featured.title', label: 'Öne Çıkan İlanlar Başlık',   type: 'text',     defaultAr: 'العقارات المميزة',                   defaultEn: 'Featured Properties' },
    { key: 'featured.sub',   label: 'Öne Çıkan İlanlar Alt Başlık', type: 'text',   defaultAr: 'محفظة مختارة بعناية لأفضل الفرص الاستثمارية', defaultEn: 'A carefully curated portfolio of the best investment opportunities' },
    { key: 'why.title',      label: 'Neden Türkiye Başlığı',       type: 'text',     defaultAr: 'لماذا تركيا؟',                       defaultEn: 'Why Turkey?' },
    { key: 'services.title', label: 'Hizmetler Başlığı',           type: 'text',     defaultAr: 'خدماتنا',                            defaultEn: 'Our Services' },
    { key: 'cta.title',      label: 'Alt CTA Başlık',              type: 'text',     defaultAr: 'ابدأ رحلتك الاستثمارية اليوم',      defaultEn: 'Start Your Investment Journey Today' },
    { key: 'cta.sub',        label: 'Alt CTA Alt Yazı',            type: 'text',     defaultAr: 'تواصل مع فريقنا للحصول على استشارة مجانية', defaultEn: 'Contact our team for a free consultation' },
  ],
  about: [
    { key: 'hero.title',      label: 'Sayfa Başlığı',        type: 'text',     defaultAr: 'من نحن',               defaultEn: 'About Us' },
    { key: 'hero.subtitle',   label: 'Alt Başlık',           type: 'text',     defaultAr: 'شريكك الاستثماري الموثوق', defaultEn: 'Your Trusted Investment Partner' },
    { key: 'hero.image',      label: 'Hero Görseli',         type: 'image' },
    { key: 'mission.title',   label: 'Misyon Başlık',        type: 'text',     defaultAr: 'مهمتنا',              defaultEn: 'Our Mission' },
    { key: 'mission.text',    label: 'Misyon Metin',         type: 'textarea' },
    { key: 'story.title',     label: 'Hikaye Başlık',        type: 'text',     defaultAr: 'قصتنا',               defaultEn: 'Our Story' },
    { key: 'story.text',      label: 'Hikaye Metin',         type: 'textarea' },
    { key: 'values.title',    label: 'Değerler Başlık',      type: 'text',     defaultAr: 'قيمنا',               defaultEn: 'Our Values' },
    { key: 'team.title',      label: 'Ekip Başlık',          type: 'text',     defaultAr: 'فريقنا',              defaultEn: 'Our Team' },
    { key: 'stats.investors', label: 'İstatistik: Yatırımcı', type: 'text',   defaultAr: 'مستثمر راضٍ',         defaultEn: 'Satisfied Investors' },
    { key: 'stats.years',     label: 'İstatistik: Yıl',      type: 'text',     defaultAr: 'سنوات خبرة',          defaultEn: 'Years Experience' },
    { key: 'stats.properties',label: 'İstatistik: Mülk',     type: 'text',     defaultAr: 'عقار مباع',           defaultEn: 'Properties Sold' },
    { key: 'stats.offices',   label: 'İstatistik: Ofis',     type: 'text',     defaultAr: 'مكتب',                defaultEn: 'Offices' },
  ],
  services: [
    { key: 'hero.title',    label: 'Sayfa Başlığı',     type: 'text',     defaultAr: 'خدماتنا',                                     defaultEn: 'Our Services' },
    { key: 'hero.subtitle', label: 'Alt Başlık',        type: 'text',     defaultAr: 'كل ما تحتاجه لاستثمار ناجح في تركيا',          defaultEn: 'Everything you need for a successful investment in Turkey' },
    { key: 'hero.image',    label: 'Hero Görseli',      type: 'image' },
    { key: 'service1.title',label: 'Hizmet 1 Başlık',  type: 'text',     defaultAr: 'البحث عن العقار المثالي',                       defaultEn: 'Property Search' },
    { key: 'service1.desc', label: 'Hizmet 1 Açıklama', type: 'textarea' },
    { key: 'service1.image',label: 'Hizmet 1 Görseli', type: 'image' },
    { key: 'service2.title',label: 'Hizmet 2 Başlık',  type: 'text',     defaultAr: 'الاستشارات القانونية',                          defaultEn: 'Legal Consultancy' },
    { key: 'service2.desc', label: 'Hizmet 2 Açıklama', type: 'textarea' },
    { key: 'service2.image',label: 'Hizmet 2 Görseli', type: 'image' },
    { key: 'service3.title',label: 'Hizmet 3 Başlık',  type: 'text',     defaultAr: 'التفاوض وإتمام الصفقة',                         defaultEn: 'Negotiation & Deal Closing' },
    { key: 'service3.desc', label: 'Hizmet 3 Açıklama', type: 'textarea' },
    { key: 'service4.title',label: 'Hizmet 4 Başlık',  type: 'text',     defaultAr: 'إدارة الأملاك',                                 defaultEn: 'Property Management' },
    { key: 'service4.desc', label: 'Hizmet 4 Açıklama', type: 'textarea' },
    { key: 'service5.title',label: 'Hizmet 5 Başlık',  type: 'text',     defaultAr: 'الدعم بعد الشراء',                              defaultEn: 'After-Purchase Support' },
    { key: 'service5.desc', label: 'Hizmet 5 Açıklama', type: 'textarea' },
  ],
  turkey: [
    { key: 'hero.title',    label: 'Sayfa Başlığı',    type: 'text',     defaultAr: 'لماذا تركيا؟',                        defaultEn: 'Why Turkey?' },
    { key: 'hero.subtitle', label: 'Alt Başlık',       type: 'text',     defaultAr: 'وجهة الاستثمار العقاري الأمثل',        defaultEn: 'The Optimal Real Estate Investment Destination' },
    { key: 'hero.image',    label: 'Hero Görseli',     type: 'image' },
    { key: 'stats.pop',     label: 'İstatistik: Nüfus', type: 'text',    defaultAr: 'مليون نسمة',                          defaultEn: 'Million Population' },
    { key: 'stats.gdp',     label: 'İstatistik: GDP',  type: 'text',     defaultAr: 'الناتج المحلي',                        defaultEn: 'GDP' },
    { key: 'stats.tourists',label: 'İstatistik: Turist', type: 'text',   defaultAr: 'مليون سائح سنوياً',                    defaultEn: 'Million Tourists Annually' },
    { key: 'cities.title',  label: 'Şehirler Başlık',  type: 'text',     defaultAr: 'أبرز المدن الاستثمارية',               defaultEn: 'Top Investment Cities' },
    { key: 'section1.title',label: 'Bölüm 1 Başlık',  type: 'text' },
    { key: 'section1.text', label: 'Bölüm 1 Metin',   type: 'textarea' },
    { key: 'section1.image',label: 'Bölüm 1 Görseli', type: 'image' },
    { key: 'section2.title',label: 'Bölüm 2 Başlık',  type: 'text' },
    { key: 'section2.text', label: 'Bölüm 2 Metin',   type: 'textarea' },
    { key: 'section2.image',label: 'Bölüm 2 Görseli', type: 'image' },
  ],
  citizenship: [
    { key: 'hero.title',    label: 'Sayfa Başlığı',    type: 'text',     defaultAr: 'الجنسية التركية عبر الاستثمار',  defaultEn: 'Turkish Citizenship by Investment' },
    { key: 'hero.subtitle', label: 'Alt Başlık',       type: 'text',     defaultAr: 'جواز سفر قوي يفتح لك أبواب العالم', defaultEn: 'A powerful passport that opens the world to you' },
    { key: 'hero.image',    label: 'Hero Görseli',     type: 'image' },
    { key: 'process.title', label: 'Süreç Başlık',     type: 'text',     defaultAr: 'خطوات الحصول على الجنسية',       defaultEn: 'Citizenship Process Steps' },
    { key: 'step1.title',   label: 'Adım 1 Başlık',   type: 'text' },
    { key: 'step1.desc',    label: 'Adım 1 Açıklama', type: 'textarea' },
    { key: 'step2.title',   label: 'Adım 2 Başlık',   type: 'text' },
    { key: 'step2.desc',    label: 'Adım 2 Açıklama', type: 'textarea' },
    { key: 'step3.title',   label: 'Adım 3 Başlık',   type: 'text' },
    { key: 'step3.desc',    label: 'Adım 3 Açıklama', type: 'textarea' },
    { key: 'benefits.title',label: 'Faydalar Başlık',  type: 'text',     defaultAr: 'مزايا الجنسية التركية',          defaultEn: 'Benefits of Turkish Citizenship' },
    { key: 'types.title',   label: 'Yatırım Türleri Başlık', type: 'text', defaultAr: 'أنواع الاستثمار المؤهّل',      defaultEn: 'Eligible Investment Types' },
  ],
  vip: [
    { key: 'hero.title',    label: 'Sayfa Başlığı',    type: 'text',     defaultAr: 'شبكة المستثمر VIP',              defaultEn: 'VIP Investor Network' },
    { key: 'hero.subtitle', label: 'Alt Başlık',       type: 'text',     defaultAr: 'وصول حصري لأفضل الفرص قبل الجميع', defaultEn: 'Exclusive access to the best opportunities before anyone else' },
    { key: 'hero.image',    label: 'Hero Görseli',     type: 'image' },
    { key: 'benefit1',      label: 'Fayda 1',          type: 'text' },
    { key: 'benefit2',      label: 'Fayda 2',          type: 'text' },
    { key: 'benefit3',      label: 'Fayda 3',          type: 'text' },
    { key: 'benefit4',      label: 'Fayda 4',          type: 'text' },
    { key: 'cta.text',      label: 'CTA Butonu Metni', type: 'text' },
  ],
  contact: [
    { key: 'hero.title',    label: 'Sayfa Başlığı',    type: 'text',     defaultAr: 'تواصل معنا',                     defaultEn: 'Contact Us' },
    { key: 'hero.subtitle', label: 'Alt Başlık',       type: 'text',     defaultAr: 'فريقنا جاهز لمساعدتك في رحلتك الاستثمارية', defaultEn: 'Our team is ready to help you on your investment journey' },
    { key: 'hero.image',    label: 'Hero Görseli',     type: 'image' },
    { key: 'address',       label: 'Adres',            type: 'text' },
    { key: 'phone',         label: 'Telefon',          type: 'text' },
    { key: 'email',         label: 'Email',            type: 'text' },
    { key: 'whatsapp',      label: 'WhatsApp No',      type: 'text' },
    { key: 'form.note',     label: 'Form Not (alt yazı)', type: 'text' },
    { key: 'map.embed',     label: 'Google Maps Embed URL', type: 'text' },
  ],
  properties: [
    { key: 'hero.title',    label: 'Sayfa Başlığı',    type: 'text',     defaultAr: 'عقارات تركيا المميزة',           defaultEn: 'Premium Turkish Properties' },
    { key: 'hero.subtitle', label: 'Alt Başlık',       type: 'text',     defaultAr: 'استثمارات مختارة بعناية للمستثمر الخليجي', defaultEn: 'Carefully curated investments for Gulf investors' },
    { key: 'hero.image',    label: 'Hero Görseli',     type: 'image' },
    { key: 'filter.label',  label: 'Filtre Etiketi',   type: 'text' },
    { key: 'empty.text',    label: 'Sonuç Yok Metni',  type: 'text' },
  ],
  insights: [
    { key: 'hero.title',    label: 'Sayfa Başlığı',    type: 'text',     defaultAr: 'رؤى ومقالات',                    defaultEn: 'Insights & Articles' },
    { key: 'hero.subtitle', label: 'Alt Başlık',       type: 'text',     defaultAr: 'تحليلات عقارية وأدلة الاستثمار في السوق التركي', defaultEn: 'Real estate analysis and investment guides for the Turkish market' },
    { key: 'hero.image',    label: 'Hero Görseli',     type: 'image' },
    { key: 'featured.label',label: 'Öne Çıkan Etiketi', type: 'text',   defaultAr: 'الأحدث',                         defaultEn: 'Latest' },
    { key: 'cta.title',     label: 'CTA Başlık',       type: 'text',     defaultAr: 'هل تريد الاستفادة من هذه المعلومات في استثمارك الخاص؟', defaultEn: 'Want to apply these insights to your own investment?' },
    { key: 'cta.sub',       label: 'CTA Alt Metin',    type: 'textarea', defaultAr: 'فريقنا يساعدك في تطبيق هذه الاستراتيجيات على عقارات حقيقية', defaultEn: 'Our team helps you apply these strategies to real properties' },
  ],
};

export default async function ContentEditPage({ params }: { params: Promise<{ pageKey: string }> }) {
  const { pageKey } = await params;
  const session = await getSession();

  const existing = await prisma.pageContent.findMany({
    where: { pageKey },
    orderBy: { key: 'asc' },
  });
  const existingMap = Object.fromEntries(existing.map(c => [c.key, c]));

  const fields = PAGE_FIELDS[pageKey] ?? [];
  const fieldKeys = fields.map(f => f.key);

  // Merge: defined fields first (with defaults), then any extra DB rows
  const rows = fields.map(f => ({
    id: existingMap[f.key]?.id ?? '',
    pageKey,
    key: f.key,
    label: f.label,
    type: f.type ?? 'text',
    defaultAr: f.defaultAr ?? '',
    defaultEn: f.defaultEn ?? '',
    valueAr: existingMap[f.key]?.valueAr ?? '',
    valueEn: existingMap[f.key]?.valueEn ?? '',
  }));

  // Extra custom rows from DB not in fields
  const extras = existing
    .filter(c => !fieldKeys.includes(c.key))
    .map(c => ({ id: c.id, pageKey, key: c.key, label: c.key, type: 'text' as const, defaultAr: '', defaultEn: '', valueAr: c.valueAr, valueEn: c.valueEn }));

  return (
    <>
      <AdminHeader title={`İçerik — ${PAGE_LABELS[pageKey] ?? pageKey}`} userName={session?.name} userRole={session?.role} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
        <ContentEditor pageKey={pageKey} initialRows={[...rows, ...extras]} />
      </main>
    </>
  );
}
