'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';

// These IDs are admin-editable content pulled from the database and
// interpolated into an inline <script>. Validate their shape strictly
// before rendering so a malicious/malformed stored value can never break
// out of the script context (stored XSS).
const GA4_ID_RE = /^G-[A-Z0-9]+$/;
const META_PIXEL_ID_RE = /^\d{5,20}$/;

export default function AnalyticsScripts() {
  const [ga4Id, setGa4Id] = useState('');
  const [metaPixelId, setMetaPixelId] = useState('');

  useEffect(() => {
    fetch('/api/content/analytics')
      .then(r => r.json())
      .then((data: Record<string, { ar: string; en: string }>) => {
        const rawGa4 = data?.ga4_id?.ar?.trim();
        if (rawGa4 && GA4_ID_RE.test(rawGa4)) setGa4Id(rawGa4);

        const rawPixel = data?.meta_pixel_id?.ar?.trim();
        if (rawPixel && META_PIXEL_ID_RE.test(rawPixel)) setMetaPixelId(rawPixel);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Google Analytics 4 */}
      {ga4Id && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}', { page_path: window.location.pathname });
              `,
            }}
          />
        </>
      )}

      {/* Meta Pixel */}
      {metaPixelId && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){
                if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}
    </>
  );
}
