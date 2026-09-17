import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo';
import PropertiesClient from './PropertiesClient';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('properties', {
    path: '/properties',
    title: 'عقارات للبيع في تركيا | شقق وفلل ومشاريع استثمارية',
    description: 'تصفح أحدث العقارات للبيع في تركيا: شقق، فلل، وفنادق استثمارية في إسطنبول وبورصة وأنطاليا بأسعار وشروط تناسب المستثمر العربي.',
    keywords: 'عقارات للبيع في تركيا, شقق للبيع اسطنبول, فلل للبيع تركيا',
  });
}

export default function PropertiesPage() {
  return <PropertiesClient />;
}
