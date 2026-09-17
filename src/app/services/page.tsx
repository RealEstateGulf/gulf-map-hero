import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo';
import ServicesClient from './ServicesClient';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('services', {
    path: '/services',
    title: 'خدماتنا العقارية | استشارات، إدارة أملاك، ودعم قانوني في تركيا',
    description: 'خدمات متكاملة للمستثمر العربي في تركيا: البحث عن العقار المناسب، المعاينة، الدعم القانوني، إدارة الأملاك، وخدمات ما بعد البيع.',
    keywords: 'خدمات عقارية تركيا, إدارة أملاك تركيا, استشارة عقارية',
  });
}

export default function ServicesPage() {
  return <ServicesClient />;
}
