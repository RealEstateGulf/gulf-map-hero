'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function AnalyticsScripts() {
  const [ga4Id, setGa4Id] = useState('');
  const [metaPixelId, setMetaPixelId] = useState('');

  useEffect(() => {
    fetch('/api/content/analytics')
      .then(r => r.json())
      .then((data: Record<string, { ar: string; en: string }>) => {
        if (data?.ga4_id?.ar) setGa4Id(data.ga4_id.ar.trim());
        if (data?.meta_pixel_id?.ar) setMetaPixelId(data.meta_pixel_id.ar.trim());
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
