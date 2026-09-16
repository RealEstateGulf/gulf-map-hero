import { Document, Page, View, Text, Image, Font, StyleSheet } from '@react-pdf/renderer';
import type { Property } from '@/data/properties';

Font.register({
  family: 'Amiri',
  fonts: [
    { src: '/fonts/Amiri-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Amiri-Bold.ttf', fontWeight: 'bold' },
  ],
});
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

const GOLD = '#D4AF37';
const BG = '#0a0a0a';
const PANEL = '#141414';
const TXT = '#f2f2f2';
const MUTED = '#9a9a9a';
const BORDER = '#2a2a2a';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Amiri',
    fontSize: 11,
    color: TXT,
    direction: 'rtl',
    paddingBottom: 50,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottom: `1px solid ${BORDER}`,
  },
  brand: { fontFamily: 'Poppins', fontSize: 13, fontWeight: 'bold', color: TXT },
  brandSub: { fontSize: 8, color: MUTED, marginTop: 2 },
  date: { fontSize: 8, color: MUTED },
  coverImage: { width: '100%', height: 320, objectFit: 'cover' },
  body: { paddingHorizontal: 28, paddingTop: 18 },
  galleryPage: { paddingHorizontal: 24, paddingTop: 24 },
  galleryTitle: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 14, color: TXT },
  galleryGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 10 },
  galleryCell: { width: '48.5%' },
  galleryImage: { width: '100%', height: 190, objectFit: 'cover', borderRadius: 3 },
  badge: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(212,175,55,0.15)',
    color: GOLD,
    fontSize: 8,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'right', marginBottom: 4, color: TXT },
  location: { fontSize: 10, color: MUTED, textAlign: 'right', marginBottom: 10 },
  price: { fontFamily: 'Poppins', fontSize: 18, fontWeight: 'bold', color: GOLD, textAlign: 'right', marginBottom: 14 },
  specsRow: {
    flexDirection: 'row-reverse',
    backgroundColor: PANEL,
    borderTop: `1px solid ${BORDER}`,
    borderBottom: `1px solid ${BORDER}`,
    marginBottom: 16,
  },
  specCell: { flex: 1, paddingVertical: 10, alignItems: 'center', borderLeft: `1px solid ${BORDER}` },
  specLabel: { fontFamily: 'Poppins', fontSize: 7, color: MUTED, marginBottom: 3, textTransform: 'uppercase' },
  specValue: { fontSize: 11, fontWeight: 'bold', color: TXT },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', textAlign: 'right', marginBottom: 8, marginTop: 4, color: TXT },
  description: { fontSize: 10, lineHeight: 1.7, textAlign: 'right', color: '#c8c8c8', marginBottom: 16 },
  featuresGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', marginBottom: 10 },
  featureItem: { width: '50%', flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 7 },
  featureDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: GOLD, marginLeft: 6 },
  featureText: { fontSize: 9.5, color: TXT },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderTop: `1px solid ${BORDER}`,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PANEL,
  },
  footerLabel: { fontSize: 7, color: MUTED, fontFamily: 'Poppins' },
  footerAgent: { fontSize: 10, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  footerContact: { fontSize: 8, color: '#ccc', fontFamily: 'Poppins' },
  footerSite: { fontSize: 8, color: GOLD, fontFamily: 'Poppins' },
});

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

function BrandHeader() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.brand}>Al Miftah Real Estate</Text>
        <Text style={styles.brandSub}>almiftahrealestate.com</Text>
      </View>
      <Text style={styles.date}>{new Date().toLocaleDateString('en-GB')}</Text>
    </View>
  );
}

function BrandFooter({ agentPhone, agentEmail }: { agentPhone: string; agentEmail: string }) {
  return (
    <View style={styles.footer} fixed>
      <View>
        <Text style={styles.footerLabel}>الوكيل المسؤول</Text>
        <Text style={styles.footerAgent}>ممثل المفتاح المعتمد</Text>
        <Text style={styles.footerContact}>{agentPhone}  •  {agentEmail}</Text>
      </View>
      <Text style={styles.footerSite}>www.almiftahrealestate.com</Text>
    </View>
  );
}

// One gallery page holds 6 photos at a clearly-legible size (2 cols × 3 rows);
// more than that spills onto additional gallery pages rather than shrinking.
const PHOTOS_PER_GALLERY_PAGE = 6;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function PropertyBrochureDocument({ property, agentPhone, agentEmail, coverImage, galleryPhotos }: Props) {
  const specs = [
    { label: 'النوع', value: property.typeAr },
    { label: 'المساحة', value: `${property.area} م²` },
    ...(property.rooms && property.rooms !== '—' ? [{ label: 'الغرف', value: property.rooms }] : []),
  ];
  const galleryPages = chunk(galleryPhotos ?? [], PHOTOS_PER_GALLERY_PAGE);

  return (
    <Document title={property.titleAr}>
      <Page size="A4" style={styles.page}>
        <BrandHeader />

        {coverImage && <Image src={coverImage} style={styles.coverImage} />}

        <View style={styles.body}>
          {property.badge && <Text style={styles.badge}>{property.badge}</Text>}
          <Text style={styles.title}>{property.titleAr}</Text>
          <Text style={styles.location}>{property.locationAr}</Text>
          <Text style={styles.price}>${property.price}</Text>

          <View style={styles.specsRow}>
            {specs.map(s => (
              <View key={s.label} style={styles.specCell}>
                <Text style={styles.specLabel}>{s.label}</Text>
                <Text style={styles.specValue}>{s.value}</Text>
              </View>
            ))}
          </View>

          {property.description && (
            <>
              <Text style={styles.sectionTitle}>نبذة عن العقار</Text>
              <Text style={styles.description}>{property.description}</Text>
            </>
          )}

          {property.features && property.features.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>المميزات والخدمات</Text>
              <View style={styles.featuresGrid}>
                {property.features.map((f, i) => (
                  <View key={i} style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        <BrandFooter agentPhone={agentPhone} agentEmail={agentEmail} />
      </Page>

      {galleryPages.map((pagePhotos, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <BrandHeader />
          <View style={styles.galleryPage}>
            <Text style={styles.galleryTitle}>
              {galleryPages.length > 1 ? `معرض الصور (${pageIndex + 1}/${galleryPages.length})` : 'معرض الصور'}
            </Text>
            <View style={styles.galleryGrid}>
              {pagePhotos.map((src, i) => (
                <View key={i} style={styles.galleryCell}>
                  <Image src={src} style={styles.galleryImage} />
                </View>
              ))}
            </View>
          </View>
          <BrandFooter agentPhone={agentPhone} agentEmail={agentEmail} />
        </Page>
      ))}
    </Document>
  );
}
