import { forwardRef } from 'react';

const GOLD = '#D4AF37';
const BG = '#0a0a0a';
const TXT = '#f2f2f2';
const MUTED = 'rgba(255,255,255,0.55)';

const WIDTH = 1080;
const HEIGHT = 1350;

export interface InstagramPostData {
  logoUrl: string;
  photos: string[]; // exactly 3, already resolved to data: URLs
  typeAr: string;
  locationAr: string;
  titleAr: string;
  badge?: string;
  priceLabel: string; // e.g. "$122,746"
  specsLabel: string; // e.g. "3+1 · 150 م²"
  phoneDisplay: string;
}

// A fixed-size (1080x1350, Instagram portrait post) offscreen template.
// Rendered into a detached node and rasterized with html-to-image — never
// shown to the visitor directly, so it doesn't need to be responsive.
const InstagramPostCard = forwardRef<HTMLDivElement, InstagramPostData>(function InstagramPostCard(
  { logoUrl, photos, typeAr, locationAr, titleAr, badge, priceLabel, specsLabel, phoneDisplay },
  ref,
) {
  const titleFontSize = titleAr.length > 70 ? 34 : titleAr.length > 45 ? 40 : 48;

  return (
    <div
      ref={ref}
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        background: BG,
        fontFamily: "'Poppins', sans-serif",
        direction: 'rtl',
      }}
    >
      {/* Left panel */}
      <div
        style={{
          width: 430,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 44px',
          background: `radial-gradient(circle at 15% 0%, rgba(212,175,55,0.12) 0%, transparent 45%), ${BG}`,
        }}
      >
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt="Al-Miftah" style={{ width: 190, objectFit: 'contain' }} />

        <div style={{ flex: 1 }} />

        {/* Kicker */}
        <div style={{ color: GOLD, fontSize: 20, fontWeight: 600, letterSpacing: 1, marginBottom: 14 }}>
          {typeAr} · {locationAr}
        </div>

        {/* Badge pill */}
        {badge && (
          <div
            style={{
              alignSelf: 'flex-start',
              background: 'rgba(212,175,55,0.14)',
              border: `1px solid ${GOLD}`,
              borderRadius: 999,
              padding: '6px 16px',
              color: GOLD,
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            {badge}
          </div>
        )}

        {/* Title */}
        <div
          style={{
            color: '#fff',
            fontSize: titleFontSize,
            fontWeight: 800,
            lineHeight: 1.35,
            marginBottom: 24,
          }}
        >
          {titleAr}
        </div>

        {/* Divider */}
        <div style={{ width: 70, height: 3, background: GOLD, marginBottom: 24 }} />

        <div style={{ color: MUTED, fontSize: 20, lineHeight: 1.8, marginBottom: 36 }}>
          اكتشف تفاصيل هذا العقار من محفظتنا العقارية
        </div>

        {/* Price card */}
        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            border: `2px solid ${GOLD}`,
            padding: '22px 26px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            marginBottom: 40,
          }}
        >
          <div style={{ color: '#333', fontSize: 17, fontWeight: 600 }}>{specsLabel}</div>
          <div style={{ color: '#0a0a0a', fontSize: 42, fontWeight: 800 }}>{priceLabel}</div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Contact */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(212,175,55,0.14)', border: `1px solid ${GOLD}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: GOLD, fontSize: 16, flexShrink: 0,
            }}
          >
            ✆
          </div>
          <div style={{ color: TXT, fontSize: 20, fontWeight: 600, direction: 'ltr' }}>{phoneDisplay}</div>
        </div>
        <div style={{ color: MUTED, fontSize: 17, fontWeight: 600 }}>
          تواصل معنا لمزيد من التفاصيل
        </div>
      </div>

      {/* Right: 3 stacked photos */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, background: '#000' }}>
        {photos.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            style={{ width: '100%', flex: 1, objectFit: 'cover', display: 'block' }}
          />
        ))}
      </div>
    </div>
  );
});

export default InstagramPostCard;
export { WIDTH as INSTAGRAM_POST_WIDTH, HEIGHT as INSTAGRAM_POST_HEIGHT };
