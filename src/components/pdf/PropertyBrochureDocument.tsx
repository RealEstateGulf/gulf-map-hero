import { Document, Page, View, Text, Image, Font, StyleSheet, Svg, Path, Circle } from '@react-pdf/renderer';
import type { Property } from '@/data/properties';

// Regular and Bold are registered as two entirely separate font families
// (not one family with two weights) — mixing weights under a single family
// name has caused react-pdf/fontkit to pick the wrong glyph for certain
// Arabic letter sequences (renders as a stray box mid-word) in testing.
Font.register({ family: 'Amiri', src: '/fonts/Amiri-Regular.ttf' });
Font.register({ family: 'Amiri-Bold', src: '/fonts/Amiri-Bold.ttf' });
Font.register({
  family: 'Poppins',
  fonts: [
    { src: '/fonts/Poppins-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Poppins-Bold.ttf', fontWeight: 'bold' },
  ],
});
// Arabic text needs a shaping-aware layout engine; react-pdf's default
// doesn't join Arabic letters correctly without this disabled.
Font.registerHyphenationCallback(word => [word]);

// Investor-deck palette: deep navy + brass gold, swapped in for the old
// pure-black brochure so it reads as a presentation deck, not a flyer.
const NAVY = '#0c2742';
const NAVY2 = '#16375a';
const GOLD = '#D4AF37';
const LIGHT_BG = '#f5f6f8';
const PANEL = '#ffffff';
const INK = '#132233';
const MUTED = '#6b7686';
const BORDER = '#e3e2da';

// 16:9 slide canvas (960×540pt) rather than a document page — the whole
// point of this template is to read like a presentation, not a brochure.
const SLIDE: [number, number] = [960, 540];

const styles = StyleSheet.create({
  // ---- shared ----
  page: { fontFamily: 'Amiri', fontSize: 11, color: INK, backgroundColor: PANEL, direction: 'rtl' },
  eyebrow: { fontFamily: 'Amiri-Bold', fontSize: 10, color: GOLD, letterSpacing: 1 },
  logoRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  logoMark: { width: 95, height: 31, objectFit: 'contain' },
  pageNum: { position: 'absolute', bottom: 18, right: 28, fontFamily: 'Poppins', fontSize: 9, color: MUTED },
  captionBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: PANEL, paddingHorizontal: 28, paddingVertical: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTop: `1px solid ${BORDER}`,
  },
  captionText: { fontFamily: 'Amiri-Bold', fontSize: 11, color: INK, letterSpacing: 1 },

  // ---- cover ----
  coverRow: { flexDirection: 'row-reverse', width: '100%', height: '100%' },
  coverImage: { width: '62%', height: '100%', objectFit: 'cover' },
  coverPanel: { width: '38%', height: '100%', backgroundColor: NAVY, padding: 34, justifyContent: 'space-between' },
  coverLogoMark: { width: 150, height: 49, objectFit: 'contain' },
  coverTitle: { fontFamily: 'Amiri-Bold', fontSize: 30, color: '#fff', textAlign: 'right', lineHeight: 1.35, marginTop: 10 },
  coverDivider: { width: 46, height: 2, backgroundColor: GOLD, alignSelf: 'flex-end', marginVertical: 14 },
  coverSub: { fontSize: 11, color: '#c7d2de', textAlign: 'right', lineHeight: 1.6 },
  coverFooter: { fontFamily: 'Amiri-Bold', fontSize: 9.5, color: '#9fb2c9', letterSpacing: 1 },

  // ---- specs (full navy) ----
  navyPad: { padding: 40, height: '100%', backgroundColor: NAVY, justifyContent: 'space-between' },
  specHeadline: { fontFamily: 'Amiri-Bold', fontSize: 26, color: '#fff', textAlign: 'right', marginTop: 8, maxWidth: 560, alignSelf: 'flex-end' },
  specStatsRow: { flexDirection: 'row-reverse', gap: 50, marginTop: 10 },
  specStatCol: { borderTopWidth: 1.5, borderTopColor: GOLD, paddingTop: 14, minWidth: 150 },
  specStatValue: { fontFamily: 'Amiri-Bold', fontSize: 34, color: '#fff' },
  specStatLabel: { fontSize: 10, color: '#9fb2c9', marginTop: 4 },
  specBottomBar: {
    backgroundColor: NAVY2, borderRadius: 4, paddingVertical: 16, paddingHorizontal: 22,
    flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center',
  },
  specBottomText: { fontSize: 11, color: '#fff', textAlign: 'right', flex: 1 },
  pill: { backgroundColor: GOLD, color: NAVY, fontFamily: 'Amiri-Bold', fontSize: 11, paddingVertical: 7, paddingHorizontal: 16, borderRadius: 3 },

  // ---- price / künye split ----
  splitRow: { flexDirection: 'row-reverse', width: '100%', height: '100%' },
  priceCol: { width: '38%', height: '100%', backgroundColor: NAVY, padding: 36, justifyContent: 'center' },
  priceValue: { fontFamily: 'Amiri-Bold', fontSize: 56, color: '#fff', textAlign: 'right' },
  priceUnit: { fontSize: 15, color: '#c7d2de', textAlign: 'right', marginTop: 2 },
  priceSub: { fontSize: 9.5, color: '#9fb2c9', textAlign: 'right', marginTop: 10 },
  pillOutline: {
    alignSelf: 'flex-end', marginTop: 20, borderWidth: 1, borderColor: GOLD, color: GOLD,
    fontFamily: 'Amiri-Bold', fontSize: 10.5, paddingVertical: 7, paddingHorizontal: 14, borderRadius: 3,
  },
  kunyeCol: { width: '62%', height: '100%', backgroundColor: LIGHT_BG, padding: 40, justifyContent: 'center' },
  kunyeHeadline: { fontFamily: 'Amiri-Bold', fontSize: 22, color: INK, textAlign: 'right', marginBottom: 18 },
  kunyeTable: { borderWidth: 1, borderColor: BORDER },
  kunyeRow: { flexDirection: 'row-reverse', borderBottomWidth: 1, borderBottomColor: BORDER },
  kunyeRowLast: { flexDirection: 'row-reverse' },
  kunyeLabel: { width: '38%', padding: 11, fontSize: 10, color: MUTED, backgroundColor: '#eceae2' },
  kunyeValue: { width: '62%', padding: 11, fontSize: 10.5, color: INK, textAlign: 'right', fontFamily: 'Amiri-Bold' },

  // ---- location split ----
  locCol: { width: '42%', height: '100%', backgroundColor: NAVY, padding: 38, justifyContent: 'center' },
  locHeadline: { fontFamily: 'Amiri-Bold', fontSize: 25, color: '#fff', textAlign: 'right', marginTop: 8 },
  locSub: { fontSize: 11, color: '#9fb2c9', textAlign: 'right', marginTop: 6 },
  locParagraph: { fontSize: 10, color: '#c7d2de', textAlign: 'right', lineHeight: 1.75, marginTop: 20 },
  locImage: { width: '58%', height: '100%', objectFit: 'cover' },

  // ---- icon-card grid ----
  gridPad: { padding: 40, height: '100%', backgroundColor: LIGHT_BG, justifyContent: 'space-between' },
  gridHeadline: { fontFamily: 'Amiri-Bold', fontSize: 24, color: INK, textAlign: 'right', marginTop: 8, marginBottom: 26 },
  cardsRow: { flexDirection: 'row-reverse', gap: 16 },
  card: { flex: 1, backgroundColor: PANEL, borderWidth: 1, borderColor: BORDER, borderRadius: 4, padding: 18, minHeight: 120 },
  cardIconWrap: { marginBottom: 14, alignItems: 'flex-end' },
  cardText: { fontSize: 11, fontFamily: 'Amiri-Bold', color: INK, textAlign: 'right', lineHeight: 1.5 },
  gridBottomBar: {
    backgroundColor: NAVY, borderRadius: 4, paddingVertical: 16, paddingHorizontal: 22,
    flexDirection: 'row-reverse', alignItems: 'center', gap: 10,
  },
  gridBottomText: { fontSize: 10.5, color: '#fff', textAlign: 'right', flex: 1 },

  // ---- full-bleed caption photo ----
  fullBleedImg: { width: '100%', height: '100%', objectFit: 'cover' },

  // ---- feature spotlight split ----
  spotImage: { width: '55%', height: '100%', objectFit: 'cover' },
  spotCol: { width: '45%', height: '100%', backgroundColor: PANEL, padding: 42, justifyContent: 'center' },
  spotHeadline: { fontFamily: 'Amiri-Bold', fontSize: 23, color: INK, textAlign: 'right', marginTop: 8 },
  spotBody: { fontSize: 10.5, color: MUTED, textAlign: 'right', lineHeight: 1.8, marginTop: 14 },

  // ---- gallery spread ----
  galleryRow: { flexDirection: 'row', width: '100%', height: '100%' },
  galleryHalf: { width: '50%', height: '100%', objectFit: 'cover' },

  // ---- closing ----
  closeCol: { width: '42%', height: '100%', backgroundColor: NAVY, padding: 40, justifyContent: 'space-between' },
  closeHeadline: { fontFamily: 'Amiri-Bold', fontSize: 28, color: '#fff', textAlign: 'right', marginTop: 14, lineHeight: 1.35 },
  closeSub: { fontSize: 10.5, color: '#9fb2c9', textAlign: 'right', marginTop: 10 },
  closeBlock: { borderTopWidth: 1, borderTopColor: '#2a4a6b', paddingTop: 10, marginTop: 14 },
  closeLabel: { fontFamily: 'Amiri-Bold', fontSize: 9.5, color: GOLD, letterSpacing: 1, marginBottom: 4 },
  closeValue: { fontFamily: 'Amiri-Bold', fontSize: 13, color: '#fff', textAlign: 'right' },
  closeImage: { width: '58%', height: '100%', objectFit: 'cover' },
});

// ---------------------------------------------------------------------------
// A tiny set of hand-drawn line icons (react-pdf can't load an icon-font or
// arbitrary SVG library, so these are the minimum needed to echo the
// reference deck's icon cards) — cycled across whichever feature bullets
// land on a card, not mapped to meaning.
function IconHome() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path d="M3 11.5L12 4l9 7.5" stroke={GOLD} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5.5 10v9h13v-9" stroke={GOLD} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconUsers() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Circle cx={9} cy={8} r={3} stroke={GOLD} strokeWidth={1.6} fill="none" />
      <Path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke={GOLD} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Circle cx={17} cy={9} r={2.3} stroke={GOLD} strokeWidth={1.6} fill="none" />
      <Path d="M15.5 13.3c2.4.3 4 2 4 4.7" stroke={GOLD} strokeWidth={1.6} fill="none" strokeLinecap="round" />
    </Svg>
  );
}
function IconChart() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path d="M4 20V10M11 20V4M18 20v-7" stroke={GOLD} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Path d="M3 20h18" stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}
function IconCheck() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={9} stroke={GOLD} strokeWidth={1.6} fill="none" />
      <Path d="M8 12.5l2.6 2.6L16 9.5" stroke={GOLD} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function IconStar() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z"
        stroke={GOLD} strokeWidth={1.4} fill="none" strokeLinejoin="round"
      />
    </Svg>
  );
}
function IconMapPin() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z" stroke={GOLD} strokeWidth={1.6} fill="none" strokeLinejoin="round" />
      <Circle cx={12} cy={9.3} r={2.4} stroke={GOLD} strokeWidth={1.6} fill="none" />
    </Svg>
  );
}
const ICONS = [IconHome, IconUsers, IconChart, IconCheck, IconStar, IconMapPin];

// The gold wordmark reads fine on both navy and light panels, so unlike the
// old monogram-only mark this doesn't need separate light/dark variants.
function Logo() {
  return (
    <View style={styles.logoRow}>
      <Image src="/logo-bircan-akin.png" style={styles.logoMark} />
    </View>
  );
}

function PageNumber({ n }: { n: number }) {
  return <Text style={styles.pageNum}>{String(n).padStart(2, '0')}</Text>;
}

interface Props {
  property: Property;
  agentPhone: string;
  agentEmail: string;
  /** Pre-resolved data URLs — react-pdf's <Image> can't gracefully recover
   * from a failed remote fetch, so the caller resolves these itself and
   * just omits whichever ones fail. */
  coverImage?: string;
  galleryPhotos?: string[];
}

export default function PropertyBrochureDocument({ property, agentPhone, agentEmail, coverImage, galleryPhotos }: Props) {
  const photos = galleryPhotos ?? [];
  // Hierarchy requested: the large "hero" photos should read as exterior/site
  // shots, moving to interiors only once the deck gets to specific rooms.
  // The only photo we can actually *guarantee* is exterior is the cover —
  // it's hand-picked as the building/entrance shot for every listing, while
  // everything after it in `photos` is just upload order (not curated by
  // room), so re-using the cover itself for every "this is the outside" slot
  // is the only way to not risk mislabeling an interior shot as the facade.
  // Don't paper over a one-photo exterior by stamping it on every "outside"
  // slot — that just reads as a mistake. It gets exactly two appearances
  // (location page, closing bookend) and the deck moves on to interiors
  // from there, which is also where the hierarchy is supposed to go anyway.
  const siteImg = coverImage;
  const captionImg = photos[0] ?? coverImage;
  const featureImg = photos[1] ?? photos[0] ?? coverImage;
  const restPhotos = photos.slice(2);
  const spreadPairs: [string | undefined, string | undefined][] = [];
  for (let i = 0; i < Math.min(restPhotos.length, 6); i += 2) {
    spreadPairs.push([restPhotos[i], restPhotos[i + 1]]);
  }
  const closingImg = coverImage;

  const features = property.features ?? [];
  const cardFeatures1 = features.slice(0, 4);
  const barFeature1 = features[4];
  const cardFeatures2 = features.slice(5, 9);
  const barFeature2 = features[9];

  const descParas = (property.description ?? '').split(/\n\n+/).filter(Boolean);
  const year = new Date().getFullYear();

  const kunyeRows = [
    { label: 'نوع العقار', value: property.typeAr },
    { label: 'المساحة', value: `${property.area} م²` },
    ...(property.rooms && property.rooms !== '—' ? [{ label: 'عدد الغرف', value: property.rooms }] : []),
    { label: 'الموقع', value: property.locationAr },
    { label: 'المدينة', value: property.city },
  ];

  return (
    <Document title={property.titleAr}>
      {/* 1 — cover */}
      <Page size={SLIDE} style={styles.page}>
        <View style={styles.coverRow}>
          {coverImage && <Image src={coverImage} style={styles.coverImage} />}
          <View style={styles.coverPanel}>
            <Image src="/logo-bircan-akin.png" style={styles.coverLogoMark} />
            <View>
              <Text style={styles.eyebrow}>{property.city.toUpperCase()}  ·  {property.typeAr.toUpperCase()}</Text>
              <Text style={styles.coverTitle}>{property.titleAr}</Text>
              <View style={styles.coverDivider} />
              <Text style={styles.coverSub}>{property.locationAr}</Text>
              {property.badge && <Text style={[styles.coverSub, { marginTop: 4 }]}>{property.badge}</Text>}
            </View>
            <Text style={styles.coverFooter}>عرض استثماري · {year}</Text>
          </View>
        </View>
      </Page>

      {/* 2 — specs */}
      <Page size={SLIDE} style={styles.page}>
        <View style={styles.navyPad}>
          <View>
            <Logo />
            <Text style={[styles.eyebrow, { marginTop: 24 }]}>مواصفات العقار</Text>
            <Text style={styles.specHeadline}>{property.titleAr}</Text>
            <View style={styles.specStatsRow}>
              {property.rooms && property.rooms !== '—' && (
                <View style={styles.specStatCol}>
                  <Text style={styles.specStatValue}>{property.rooms}</Text>
                  <Text style={styles.specStatLabel}>عدد الغرف</Text>
                </View>
              )}
              <View style={styles.specStatCol}>
                <Text style={styles.specStatValue}>{property.area} م²</Text>
                <Text style={styles.specStatLabel}>المساحة الإجمالية</Text>
              </View>
              <View style={styles.specStatCol}>
                <Text style={styles.specStatValue}>{property.typeAr}</Text>
                <Text style={styles.specStatLabel}>نوع العقار</Text>
              </View>
            </View>
          </View>
          <View style={styles.specBottomBar}>
            <Text style={styles.pill}>للبيع</Text>
            <Text style={styles.specBottomText}>{barFeature1 ?? property.locationAr}</Text>
          </View>
        </View>
        <PageNumber n={2} />
      </Page>

      {/* 3 — price + künye */}
      <Page size={SLIDE} style={styles.page}>
        <View style={styles.splitRow}>
          <View style={styles.kunyeCol}>
            <Text style={styles.eyebrow}>بيانات العقار</Text>
            <Text style={styles.kunyeHeadline}>نظرة سريعة على العقار</Text>
            <View style={styles.kunyeTable}>
              {kunyeRows.map((r, i) => (
                <View key={r.label} style={i === kunyeRows.length - 1 ? styles.kunyeRowLast : styles.kunyeRow}>
                  <Text style={styles.kunyeValue}>{r.value}</Text>
                  <Text style={styles.kunyeLabel}>{r.label}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.priceCol}>
            <Text style={styles.eyebrow}>سعر البيع</Text>
            <Text style={styles.priceValue}>${Number(property.price).toLocaleString('en-US')}</Text>
            <Text style={styles.priceUnit}>دولار أمريكي</Text>
            {property.badge && <Text style={styles.pillOutline}>{property.badge}</Text>}
          </View>
        </View>
        <PageNumber n={3} />
      </Page>

      {/* 4 — location */}
      <Page size={SLIDE} style={styles.page}>
        <View style={styles.splitRow}>
          {siteImg && <Image src={siteImg} style={styles.locImage} />}
          <View style={styles.locCol}>
            <Text style={styles.eyebrow}>الموقع</Text>
            <Text style={styles.locHeadline}>{property.city}</Text>
            <Text style={styles.locSub}>{property.locationAr}</Text>
            {descParas[0] && <Text style={styles.locParagraph}>{descParas[0]}</Text>}
          </View>
        </View>
        <PageNumber n={4} />
      </Page>

      {/* 5 — amenities grid */}
      {cardFeatures1.length > 0 && (
        <Page size={SLIDE} style={styles.page}>
          <View style={styles.gridPad}>
            <View>
              <Logo />
              <Text style={[styles.eyebrow, { marginTop: 24 }]}>مميزات العقار</Text>
              <Text style={styles.gridHeadline}>خدمات ومرافق متكاملة</Text>
              <View style={styles.cardsRow}>
                {cardFeatures1.map((f, i) => {
                  const Icon = ICONS[i % ICONS.length];
                  return (
                    <View key={i} style={styles.card}>
                      <View style={styles.cardIconWrap}><Icon /></View>
                      <Text style={styles.cardText}>{f}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            {barFeature2 && (
              <View style={styles.gridBottomBar}>
                <IconCheck />
                <Text style={styles.gridBottomText}>{barFeature2}</Text>
              </View>
            )}
          </View>
          <PageNumber n={5} />
        </Page>
      )}

      {/* 6 — full-bleed caption photo */}
      <Page size={SLIDE} style={styles.page}>
        {captionImg && <Image src={captionImg} style={styles.fullBleedImg} />}
        <View style={styles.captionBar}>
          <Logo />
          <Text style={styles.captionText}>لمحة من الداخل</Text>
        </View>
        <PageNumber n={6} />
      </Page>

      {/* 7 — feature spotlight */}
      <Page size={SLIDE} style={styles.page}>
        <View style={styles.splitRow}>
          <View style={styles.spotCol}>
            <Text style={styles.eyebrow}>لماذا هذا العقار</Text>
            <Text style={styles.spotHeadline}>{property.badge || 'فرصة استثمارية مميزة'}</Text>
            <Text style={styles.spotBody}>{descParas[1] ?? descParas[0] ?? property.titleAr}</Text>
          </View>
          {featureImg && <Image src={featureImg} style={styles.spotImage} />}
        </View>
        <PageNumber n={7} />
      </Page>

      {/* 8..n — gallery spreads */}
      {spreadPairs.map(([a, b], i) => (
        <Page key={i} size={SLIDE} style={styles.page}>
          <View style={styles.galleryRow}>
            {a && <Image src={a} style={styles.galleryHalf} />}
            {b && <Image src={b} style={styles.galleryHalf} />}
          </View>
          <View style={styles.captionBar}>
            <Logo />
            <Text style={styles.captionText}>معرض الصور</Text>
          </View>
          <PageNumber n={8 + i} />
        </Page>
      ))}

      {/* advantages grid */}
      {cardFeatures2.length > 0 && (
        <Page size={SLIDE} style={styles.page}>
          <View style={styles.gridPad}>
            <View>
              <Logo />
              <Text style={[styles.eyebrow, { marginTop: 24 }]}>أبرز المزايا</Text>
              <Text style={styles.gridHeadline}>جودة الحياة والقيمة الاستثمارية</Text>
              <View style={styles.cardsRow}>
                {cardFeatures2.map((f, i) => {
                  const Icon = ICONS[(i + 2) % ICONS.length];
                  return (
                    <View key={i} style={styles.card}>
                      <View style={styles.cardIconWrap}><Icon /></View>
                      <Text style={styles.cardText}>{f}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            <View style={styles.gridBottomBar}>
              <IconStar />
              <Text style={styles.gridBottomText}>تصميم عصري ومواصفات بناء عالية الجودة</Text>
            </View>
          </View>
          <PageNumber n={9} />
        </Page>
      )}

      {/* closing */}
      <Page size={SLIDE} style={styles.page}>
        <View style={styles.splitRow}>
          <View style={styles.closeCol}>
            <View>
              <Logo />
              <Text style={[styles.eyebrow, { marginTop: 30 }]}>تواصل معنا</Text>
              <Text style={styles.closeHeadline}>عاين العقار على الطبيعة</Text>
              <Text style={styles.closeSub}>للمزيد من التفاصيل وترتيب موعد معاينة، تواصل معنا مباشرة.</Text>
            </View>
            <View>
              <View style={styles.closeBlock}>
                <Text style={styles.closeLabel}>هاتف · واتساب</Text>
                <Text style={styles.closeValue}>{agentPhone}</Text>
              </View>
              <View style={styles.closeBlock}>
                <Text style={styles.closeLabel}>البريد الإلكتروني</Text>
                <Text style={styles.closeValue}>{agentEmail}</Text>
              </View>
              <View style={styles.closeBlock}>
                <Text style={styles.closeLabel}>الموقع الإلكتروني</Text>
                <Text style={styles.closeValue}>www.almiftahrealestate.com</Text>
              </View>
            </View>
          </View>
          {closingImg && <Image src={closingImg} style={styles.closeImage} />}
        </View>
      </Page>
    </Document>
  );
}
