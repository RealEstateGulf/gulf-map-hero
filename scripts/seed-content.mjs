/**
 * Seed script — updates PageContent table with Turkey real-estate-investment themed content.
 * Run: node scripts/seed-content.mjs
 */
import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../prisma/dev.db');

const db = new Database(DB_PATH);

/** Upsert a single content row */
function upsert(pageKey, key, valueAr, valueEn) {
  const existing = db
    .prepare('SELECT id FROM PageContent WHERE pageKey = ? AND key = ?')
    .get(pageKey, key);
  if (existing) {
    db.prepare('UPDATE PageContent SET valueAr = ?, valueEn = ? WHERE pageKey = ? AND key = ?')
      .run(valueAr, valueEn, pageKey, key);
  } else {
    const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    db.prepare('INSERT INTO PageContent (id, pageKey, key, valueAr, valueEn) VALUES (?, ?, ?, ?, ?)')
      .run(id, pageKey, key, valueAr, valueEn);
  }
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
const home = [
  ['hero.badge',     'بوابتك الأولى للاستثمار العقاري في تركيا',           'Your Gateway to Real Estate Investment in Turkey'],
  ['hero.title1',    'استثمر في',                                            'Invest in'],
  ['hero.title2',    'عقارات تركيا المميزة',                                 "Turkey's Premium Real Estate"],
  ['hero.sub',       'فرص استثمارية عقارية حصرية في إسطنبول وأنطاليا وبورصة وأبرز المدن التركية — بعوائد مرتفعة وإمكانية الحصول على الجنسية التركية',
                     'Exclusive real estate investment opportunities in Istanbul, Antalya, Bursa and Turkey\'s top cities — with high returns and a path to Turkish citizenship'],
  ['featured.title', 'عقارات مختارة بعناية',                                'Carefully Selected Properties'],
  ['featured.sub',   'محفظة استثمارية متنوعة تشمل شققاً فاخرة ومجمعات سكنية وعقارات تجارية في أفضل مناطق تركيا',
                     'A diversified portfolio including luxury apartments, residential complexes and commercial properties in Turkey\'s best locations'],
  ['why.title',      'لماذا الاستثمار في تركيا؟',                           'Why Invest in Turkey?'],
  ['services.title', 'خدماتنا الاستثمارية',                                 'Our Investment Services'],
  ['cta.title',      'ابدأ رحلتك الاستثمارية في تركيا اليوم',              'Start Your Turkey Investment Journey Today'],
  ['cta.sub',        'استشارة مجانية مع خبرائنا الميدانيين — نرافقك من اختيار العقار حتى تسجيل الملكية والحصول على الجنسية',
                     'Free consultation with our on-the-ground experts — we guide you from property selection to title deed and citizenship'],
];
home.forEach(([key, ar, en]) => upsert('home', key, ar, en));

// ─── ABOUT ────────────────────────────────────────────────────────────────────
const about = [
  ['hero.title',       'من نحن',                                              'About Us'],
  ['hero.subtitle',    'شريكك الموثوق في الاستثمار العقاري بتركيا',           'Your Trusted Partner in Turkish Real Estate Investment'],
  ['mission.title',   'مهمتنا',                                              'Our Mission'],
  ['mission.text',    'مفتاح تركيا وُلد من رؤية واضحة: أن المستثمر الخليجي والعربي يستحق شريكاً أميناً يعرف السوق التركي من الداخل، ويفهم احتياجاته ثقافياً ومالياً. منذ انطلاقنا عام 2018، رافقنا أكثر من 130 مستثمراً في رحلتهم نحو امتلاك عقار أو الحصول على الجنسية التركية.',
                     'Miftah Türkiye was born from a clear vision: the Gulf and Arab investor deserves an honest partner who knows the Turkish market from the inside and understands their cultural and financial needs. Since 2018, we have guided more than 130 investors on their journey to property ownership or Turkish citizenship.'],
  ['story.title',     'قصتنا',                                               'Our Story'],
  ['story.text',      'بدأت رحلتنا من إسطنبول عام 2018 بفريق صغير من المتخصصين في العقارات والقانون. اليوم نمتلك مكاتب في إسطنبول ودبي، ونتعامل مع أكبر مطوري العقارات في تركيا مباشرةً، مما يمنح عملاءنا وصولاً حصرياً لأفضل العروض قبل طرحها للعموم.',
                     'Our journey began in Istanbul in 2018 with a small team of real estate and legal specialists. Today we have offices in Istanbul and Dubai, dealing directly with Turkey\'s largest property developers, giving our clients exclusive access to the best offers before public release.'],
  ['values.title',    'قيمنا',                                               'Our Values'],
  ['team.title',      'فريق الخبراء',                                        'Our Expert Team'],
  ['stats.investors', 'مستثمر خليجي وعربي راضٍ',                           'Satisfied Gulf & Arab Investors'],
  ['stats.years',     'سنوات خبرة ميدانية في السوق التركي',                 'Years of Field Experience in Turkish Market'],
  ['stats.properties','عقار تم تسليمه بنجاح',                               'Properties Successfully Delivered'],
  ['stats.offices',   'مكتب: إسطنبول ودبي',                                 'Offices: Istanbul & Dubai'],
];
about.forEach(([key, ar, en]) => upsert('about', key, ar, en));

// ─── SERVICES ─────────────────────────────────────────────────────────────────
const services = [
  ['hero.title',     'خدماتنا الاستثمارية',                                  'Our Investment Services'],
  ['hero.subtitle',  'كل ما تحتاجه للاستثمار الناجح في العقار التركي — تحت سقف واحد',
                     'Everything you need for a successful Turkish property investment — under one roof'],
  ['service1.title', 'البحث عن العقار المثالي',                              'Finding Your Ideal Property'],
  ['service1.desc',  'نحلل متطلباتك الاستثمارية بدقة — الميزانية، العائد المتوقع، التوقيت — ثم نُقدّم لك قائمة مخصصة من أفضل العقارات في الموقع المناسب. نغطي إسطنبول وأنطاليا وبورصة وإزمير وطرابزون.',
                     'We precisely analyse your investment requirements — budget, expected return, timing — then present you with a tailored shortlist of the best properties in the right location. We cover Istanbul, Antalya, Bursa, Izmir and Trabzon.'],
  ['service1.image', '', ''],
  ['service2.title', 'الاستشارة القانونية والتوثيق',                         'Legal Consultancy & Documentation'],
  ['service2.desc',  'فريقنا القانوني المتخصص يتولى كل خطوة: التحقق من سند الملكية (الطابو)، الكشف عن الرهون والديون، إعداد العقود، التمثيل أمام دوائر التسجيل، وضمان حقوقك القانونية الكاملة في تركيا.',
                     'Our specialist legal team handles every step: title deed (Tapu) verification, lien and debt disclosure, contract preparation, representation at registration offices, and ensuring your full legal rights in Turkey.'],
  ['service2.image', '', ''],
  ['service3.title', 'التفاوض وإتمام الصفقة',                                'Negotiation & Deal Closing'],
  ['service3.desc',  'خبرتنا الطويلة مع المطورين الأتراك تمنحك أفضل الأسعار والشروط. نتفاوض نيابةً عنك، نتابع مراحل الدفع، ونحرص على أن يتم كل شيء في الوقت المحدد وبالسعر المتفق عليه.',
                     'Our long experience with Turkish developers gets you the best prices and terms. We negotiate on your behalf, track payment milestones, and ensure everything is delivered on time and at the agreed price.'],
  ['service4.title', 'جنسية تركية عبر الاستثمار',                           'Turkish Citizenship via Investment'],
  ['service4.desc',  'نُرشدك خطوة بخطوة للحصول على الجنسية التركية عبر شراء عقار بقيمة 400,000 دولار فأكثر. نجهّز الملف الكامل، ننسق مع المحامين، ونتابع الطلب حتى صدور جواز السفر التركي.',
                     'We guide you step by step to obtain Turkish citizenship by purchasing property worth $400,000 or more. We prepare the complete file, coordinate with lawyers, and follow up the application until the Turkish passport is issued.'],
  ['service5.title', 'إدارة العقار وتأجيره',                                 'Property Management & Rental'],
  ['service5.desc',  'بعد الشراء لا تقلق من بُعدك — فريقنا يدير عقارك بالكامل: إيجاد المستأجرين، تحصيل الإيجار، الصيانة الدورية، والتقارير المالية الشهرية. عائد إيجاري يصل إلى 8% سنوياً.',
                     'After purchase, don\'t worry about distance — our team fully manages your property: finding tenants, collecting rent, regular maintenance, and monthly financial reports. Rental yields reaching 8% annually.'],
];
services.forEach(([key, ar, en]) => upsert('services', key, ar, en));

// ─── TURKEY ───────────────────────────────────────────────────────────────────
const turkey = [
  ['hero.title',     'لماذا الاستثمار في تركيا؟',                           'Why Invest in Turkey?'],
  ['hero.subtitle',  'أسرع الأسواق العقارية نمواً في المنطقة — فرص لا تتكرر',
                     'The Fastest Growing Real Estate Market in the Region — Unrepeatable Opportunities'],
  ['stats.pop',      'مليون نسمة — 10th أكبر اقتصاد في أوروبا',             'Million People — 10th Largest Economy in Europe'],
  ['stats.gdp',      'تريليون دولار ناتج محلي إجمالي سنوي',                 'Trillion USD Annual GDP'],
  ['stats.tourists', 'مليون سائح دولي سنوياً — طلب إيجاري ضخم',            'Million International Tourists Annually — Massive Rental Demand'],
  ['cities.title',   'أبرز مدن الاستثمار العقاري',                          'Top Real Estate Investment Cities'],
  ['section1.title', 'إسطنبول — قلب الاستثمار',                             'Istanbul — The Heart of Investment'],
  ['section1.text',  'إسطنبول هي أكبر مدينة في أوروبا والشرق الأوسط، وأكثرها طلباً من المستثمرين الأجانب. الأسعار ارتفعت 120% خلال 5 سنوات، والطلب على الإيجار قياسي. مناطق بشيكطاش، كاديكوي، مسلك وباشاك شهير هي الأكثر عائداً.',
                     'Istanbul is the largest city in Europe and the Middle East, and the most sought-after by foreign investors. Prices rose 120% over 5 years, and rental demand is record-high. Beşiktaş, Kadıköy, Maslak and Başakşehir districts deliver the highest yields.'],
  ['section1.image', '', ''],
  ['section2.title', 'أنطاليا وعلانيا — الاستثمار السياحي',                 'Antalya & Alanya — Tourism Investment'],
  ['section2.text',  'تستقبل أنطاليا 15 مليون سائح سنوياً وتُعدّ العاصمة السياحية لتركيا. شقق إطلالة البحر وفلل المجمعات السكنية تحقق عائداً إيجارياً بين 6-10% سنوياً. أسعار التملك لا تزال في المتناول مقارنةً بأوروبا.',
                     'Antalya receives 15 million tourists annually and is Turkey\'s tourism capital. Sea-view apartments and villa complexes achieve rental yields of 6–10% annually. Purchase prices remain accessible compared to Europe.'],
  ['section2.image', '', ''],
];
turkey.forEach(([key, ar, en]) => upsert('turkey', key, ar, en));

// ─── CITIZENSHIP ──────────────────────────────────────────────────────────────
const citizenship = [
  ['hero.title',      'الجنسية التركية عبر الاستثمار العقاري',              'Turkish Citizenship via Real Estate Investment'],
  ['hero.subtitle',   'جواز سفر قوي يفتح 110+ دولة — عبر استثمار عقاري مضمون',
                      'A Powerful Passport Opening 110+ Countries — Through a Secured Property Investment'],
  ['process.title',   'خطوات الحصول على الجنسية التركية',                   'Steps to Obtain Turkish Citizenship'],
  ['step1.title',     'اختيار العقار المؤهّل',                              'Selecting an Eligible Property'],
  ['step1.desc',      'يجب أن تكون قيمة العقار 400,000 دولار أمريكي على الأقل، وأن يكون مسجلاً باسمك في الطابو (سند الملكية التركي). نساعدك في اختيار العقار المناسب من محفظتنا الحصرية.',
                      'The property must be worth at least $400,000 USD and registered in your name in the Tapu (Turkish title deed). We help you select the right property from our exclusive portfolio.'],
  ['step2.title',     'إعداد الملف وتقديم الطلب',                           'Preparing the File & Submitting the Application'],
  ['step2.desc',      'نتولى إعداد كامل وثائق طلب الجنسية: تقرير التقييم العقاري، الترجمات المعتمدة، إثبات الدفع، خلو سجل الشرطة. نقدم الطلب عبر مكتبنا القانوني المرخص.',
                      'We handle the preparation of all citizenship application documents: property appraisal report, certified translations, proof of payment, police clearance. We submit the application through our licensed legal office.'],
  ['step3.title',     'الموافقة واستلام الجواز',                            'Approval & Receiving the Passport'],
  ['step3.desc',      'تستغرق العملية عادةً 3 إلى 6 أشهر. بعد الموافقة تحصل أنت وعائلتك (الزوجة والأبناء دون 18 عاماً) على الجنسية التركية وجواز السفر التركي.',
                      'The process typically takes 3 to 6 months. After approval, you and your family (spouse and children under 18) receive Turkish citizenship and the Turkish passport.'],
  ['benefits.title',  'مزايا الجنسية التركية',                              'Benefits of Turkish Citizenship'],
  ['types.title',     'أنواع العقارات المؤهّلة للجنسية',                    'Eligible Property Types for Citizenship'],
];
citizenship.forEach(([key, ar, en]) => upsert('citizenship', key, ar, en));

// ─── VIP ──────────────────────────────────────────────────────────────────────
const vip = [
  ['hero.title',    'شبكة المستثمر VIP',                                     'VIP Investor Network'],
  ['hero.subtitle', 'وصول حصري لأفضل العروض العقارية في تركيا قبل طرحها للعموم',
                    'Exclusive Access to Turkey\'s Best Property Deals Before Public Release'],
  ['benefit1',      'وصول مسبق للعقارات قيد الإنشاء بأسعار الإطلاق',       'Pre-launch access to off-plan properties at launch prices'],
  ['benefit2',      'مستشار شخصي مخصص على مدار الساعة',                    'Dedicated personal advisor available around the clock'],
  ['benefit3',      'جولات ميدانية VIP مجانية في إسطنبول وأنطاليا',        'Complimentary VIP site tours in Istanbul & Antalya'],
  ['benefit4',      'تقارير السوق الشهرية وتحليلات عائد الاستثمار',        'Monthly market reports and ROI analysis'],
  ['cta.text',      'انضم إلى شبكة VIP',                                    'Join the VIP Network'],
];
vip.forEach(([key, ar, en]) => upsert('vip', key, ar, en));

// ─── CONTACT ──────────────────────────────────────────────────────────────────
const contact = [
  ['hero.title',    'تواصل معنا',                                            'Contact Us'],
  ['hero.subtitle', 'فريقنا الميداني في إسطنبول ودبي جاهز لمساعدتك',       'Our on-the-ground team in Istanbul & Dubai is ready to help you'],
  ['address',       'إسطنبول، تركيا | دبي، الإمارات',                       'Istanbul, Turkey | Dubai, UAE'],
  ['phone',         '+90 212 000 00 00',                                     '+90 212 000 00 00'],
  ['email',         'info@miftahturkiye.com',                                'info@miftahturkiye.com'],
  ['whatsapp',      '+90 555 000 00 00',                                     '+90 555 000 00 00'],
  ['form.note',     'سنرد عليك خلال ساعتين في أوقات العمل',                'We will respond within 2 hours during business hours'],
];
contact.forEach(([key, ar, en]) => upsert('contact', key, ar, en));

// ─── PROPERTIES ───────────────────────────────────────────────────────────────
const properties = [
  ['hero.title',    'عقارات تركيا — محفظتنا الحصرية',                      'Turkey Properties — Our Exclusive Portfolio'],
  ['hero.subtitle', 'شقق فاخرة، فلل، ومجمعات سكنية مختارة للمستثمر الخليجي',
                    'Luxury apartments, villas and residential complexes selected for Gulf investors'],
  ['filter.label',  'تصفية حسب المدينة أو النوع',                          'Filter by city or type'],
  ['empty.text',    'لا توجد عقارات متاحة حالياً بهذه المعايير',           'No properties currently available with these criteria'],
];
properties.forEach(([key, ar, en]) => upsert('properties', key, ar, en));

// ─── INSIGHTS ─────────────────────────────────────────────────────────────────
const insights = [
  ['hero.title',     'رؤى ومقالات — سوق العقارات التركي',                   'Insights & Articles — Turkish Real Estate Market'],
  ['hero.subtitle',  'تحليلات ميدانية، أرقام السوق، ودليل المستثمر الخليجي في تركيا',
                     'On-the-ground analysis, market figures, and the Gulf investor guide to Turkey'],
  ['featured.label', 'الأحدث',                                              'Latest'],
  ['cta.title',      'هل تريد تطبيق هذه المعلومات على استثمارك الخاص؟',    'Want to Apply These Insights to Your Own Investment?'],
  ['cta.sub',        'فريقنا الميداني يساعدك في تحديد أفضل فرصة عقارية تناسب ميزانيتك وأهدافك في السوق التركي',
                     'Our on-the-ground team helps you identify the best property opportunity that suits your budget and goals in the Turkish market'],
];
insights.forEach(([key, ar, en]) => upsert('insights', key, ar, en));

// ─── Done ─────────────────────────────────────────────────────────────────────
db.close();
console.log('✓ All page content seeded successfully.');
