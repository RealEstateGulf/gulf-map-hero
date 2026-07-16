import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { CompareProvider } from '@/context/CompareContext';
import GlobalOverlay from '@/components/ui/GlobalOverlay';
import TrackPageView from '@/components/TrackPageView';
import AnalyticsScripts from '@/components/AnalyticsScripts';

export const metadata: Metadata = {
  title: 'مفتاح تركيا | Miftah Turkiye — الاستثمار العقاري في تركيا',
  description: 'شريكك الموثوق في الاستثمار العقاري وتملك العقارات في تركيا — إسطنبول، أنطاليا، بورصة | Your trusted partner for real estate investment and property ownership in Turkey',
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
