import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { CompareProvider } from '@/context/CompareContext';
import GlobalOverlay from '@/components/ui/GlobalOverlay';
import TrackPageView from '@/components/TrackPageView';
import AnalyticsScripts from '@/components/AnalyticsScripts';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.almiftahrealestate.com'),
  title: {
    default: 'المفتاح العقارية | الاستثمار العقاري في تركيا',
    template: '%s',
  },
  description: 'شريكك الموثوق في الاستثمار العقاري وتملك العقارات في تركيا — إسطنبول، أنطاليا، بورصة | Your trusted partner for real estate investment and property ownership in Türkiye',
  verification: {
    google: 'Y0uRtElpzoWCBfJYCja5fbzGBPTBL0AWUrfGvngux2g',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" style={{ height: '100%' }}>
      <body style={{ margin: 0, minHeight: '100%' }}>
        {/* Meta Pixel Code — hardcoded per request, separate from the
            admin-editable one in AnalyticsScripts (both fire). */}
        <Script
          id="meta-pixel-hardcoded"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1303352931838168');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1303352931838168&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <CompareProvider>
                {children}
                <GlobalOverlay />
                <TrackPageView />
                <AnalyticsScripts />
              </CompareProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
