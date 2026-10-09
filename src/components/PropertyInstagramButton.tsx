'use client';

import { useRef, useState } from 'react';
import { Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useTheme } from '@/context/ThemeContext';
import { fetchAsDataUrl } from '@/lib/fetchAsDataUrl';
import InstagramPostCard, { INSTAGRAM_POST_WIDTH, INSTAGRAM_POST_HEIGHT, type InstagramPostData } from './InstagramPostCard';

// Deliberately not the full `Property` type from @/data/properties — this is
// used both on the public property page (which has that shape already) and
// in the admin listings table (which reads straight off the Prisma row), so
// it only asks for the handful of fields the post actually needs.
export interface InstagramButtonProperty {
  slug: string;
  photos: string[];
  typeAr: string;
  locationAr: string;
  titleAr: string;
  badge?: string | null;
  price: string;
  rooms: string;
  area: number;
}

interface Props {
  property: InstagramButtonProperty;
  phoneDisplay: string;
  /** Compact icon-only button for tight spaces like the admin table. */
  compact?: boolean;
}

// Waits for every <img> under `node` to finish decoding — the images are
// already data: URLs by the time we get here, but decode() can still resolve
// on a later microtask, and html-to-image needs them fully painted first.
async function waitForImages(node: HTMLElement) {
  const imgs = Array.from(node.querySelectorAll('img'));
  await Promise.all(imgs.map(img => img.decode().catch(() => {})));
}

export default function PropertyInstagramButton({ property, phoneDisplay, compact = false }: Props) {
  const { t } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [postData, setPostData] = useState<InstagramPostData | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError('');
    try {
      const wantedPhotos = (property.photos ?? []).slice(0, 3);
      const [logoUrl, ...resolvedPhotos] = await Promise.all([
        fetchAsDataUrl('/logo-miftah-white.png'),
        ...wantedPhotos.map(fetchAsDataUrl),
      ]);
      const photos = resolvedPhotos.filter((u): u is string => !!u);
      if (!logoUrl || photos.length === 0) {
        throw new Error('missing assets');
      }
      // Pad to exactly 3 slots by repeating the last photo, so the layout
      // never has an empty stripe if a listing has fewer than 3 photos.
      while (photos.length < 3) photos.push(photos[photos.length - 1]);

      const price = Number(property.price.replace(/[^0-9]/g, ''));
      const priceLabel = Number.isFinite(price) && price > 0 ? `$${price.toLocaleString('en-US')}` : property.price;
      const specsLabel = property.rooms !== '—'
        ? `${property.rooms} · ${property.area} م²`
        : `${property.area} م²`;

      setPostData({
        logoUrl,
        photos: photos.slice(0, 3),
        typeAr: property.typeAr,
        locationAr: property.locationAr,
        titleAr: property.titleAr,
        badge: property.badge ?? undefined,
        priceLabel,
        specsLabel,
        phoneDisplay,
      });

      // Let React paint the offscreen card before we rasterize it.
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (!cardRef.current) throw new Error('card not mounted');
      await waitForImages(cardRef.current);
      // The card's title/price use a self-hosted @font-face (Amiri) declared
      // inline in InstagramPostCard — without this, html-to-image can
      // rasterize before the font file finishes downloading and silently
      // fall back to the default serif for that first capture.
      await document.fonts.load('bold 48px Amiri-Post').catch(() => {});

      const dataUrl = await toPng(cardRef.current, {
        width: INSTAGRAM_POST_WIDTH,
        height: INSTAGRAM_POST_HEIGHT,
        pixelRatio: 1,
        cacheBust: true,
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${property.slug}-instagram.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error('Instagram post generation failed:', e);
      setError('تعذر إنشاء الصورة، حاول مرة أخرى');
    } finally {
      setPostData(null);
      setLoading(false);
    }
  };

  return (
    <div>
      {compact ? (
        <button
          type="button"
          onClick={handleDownload}
          disabled={loading}
          title="تحميل منشور انستغرام"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 7,
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.2)',
            color: '#D4AF37', fontSize: '0.72rem',
            cursor: loading ? 'default' : 'pointer', whiteSpace: 'nowrap',
          }}
        >
          {loading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <ImageIcon size={13} />}
          {loading ? '...' : 'IG'}
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleDownload}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'transparent', border: `1px solid ${t.border2}`, borderRadius: 6,
            padding: '12px', color: t.txt2, fontSize: '0.78rem',
            cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = t.gold3; e.currentTarget.style.color = t.gold; } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = t.border2; e.currentTarget.style.color = t.txt2; }}
        >
          {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <ImageIcon size={14} />}
          {loading ? 'جارٍ التجهيز...' : 'تحميل منشور انستغرام'}
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </button>
      )}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: '#ff6060', fontSize: '0.72rem' }}>
          <AlertCircle size={12} />
          {error}
        </div>
      )}

      {/* Offscreen render target — never visible, only rasterized */}
      {postData && (
        <div style={{ position: 'fixed', top: 0, left: -99999, pointerEvents: 'none' }}>
          <InstagramPostCard ref={cardRef} {...postData} />
        </div>
      )}
    </div>
  );
}
