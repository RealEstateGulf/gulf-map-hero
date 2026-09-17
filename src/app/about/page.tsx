import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo';
import AboutClient from './AboutClient';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('about', {
    path: '/about',
    title: 'من نحن | المفتاح العقارية للاستثمار العقاري في تركيا',
    description: 'تعرف على المفتاح العقارية، شريكك الموثوق للمستثمرين العرب في السوق العقاري التركي — خبرة محلية، فريق متخصص، ودعم كامل من الاستشارة حتى تسليم المفتاح.',
    keywords: 'شركة عقارية في تركيا, المفتاح العقارية, استشارات عقارية تركيا',
  });
}

export default function AboutPage() {
  return <AboutClient />;
}
