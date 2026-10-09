import { forwardRef } from 'react';

// Same navy/gold language as the redesigned PDF brochure, so every
// downloadable asset for a listing reads as one consistent brand kit.
const GOLD = '#D4AF37';
const NAVY = '#0c2742';
const NAVY2 = '#16375a';
const TXT = '#f2f2f2';
const MUTED = 'rgba(255,255,255,0.6)';

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
  const titleFontSize = titleAr.length > 70 ? 32 : titleAr.length > 45 ? 38 : 46;

  return (
    <div
      ref={ref}
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        background: NAVY,
        fontFamily: "'Poppins', sans-serif",
        direction: 'rtl',
      }}
    >
      <style>{`
        @font-face {
          font-family: 'Amiri-Post';
          src: url('/fonts/Amiri-Bold.ttf') format('truetype');
          font-weight: bold;
        }
      `}</style>
      {/* Left panel */}
      <div
        style={{
          width: 430,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 44px',
          background: `radial-gradient(circle at 15% 0%, rgba(212,175,55,0.14) 0%, transparent 45%), ${NAVY}`,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="Al-Miftah" style={{ width: 54, objectFit: 'contain' }} />
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 19 }}>Al Miftah Real Estate</div>
            <div style={{ color: MUTED, fontSize: 12.5, marginTop: 2 }}>almiftahrealestate.com</div>
          </div>
        </div>

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
            fontFamily: "'Amiri-Post', serif",
            fontSize: titleFontSize,
            fontWeight: 700,
            lineHeight: 1.4,
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
            background: NAVY2,
            borderRadius: 14,
            border: `1px solid ${GOLD}`,
            padding: '22px 26px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            marginBottom: 40,
          }}
        >
          <div style={{ color: MUTED, fontSize: 17, fontWeight: 600 }}>{specsLabel}</div>
          <div style={{ color: '#fff', fontFamily: "'Amiri-Post', serif", fontSize: 42, fontWeight: 700 }}>{priceLabel}</div>
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, background: NAVY }}>
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
