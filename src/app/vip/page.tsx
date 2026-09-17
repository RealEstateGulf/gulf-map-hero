import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo';
import VipClient from './VipClient';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('vip', {
    path: '/vip',
    title: 'خدمة VIP للمستثمرين العرب | المفتاح العقارية',
    description: 'برنامج خدمة VIP حصري لكبار المستثمرين العرب في تركيا: جولات عقارية خاصة، استشارات مخصصة، ودعم كامل من الاستشارة الأولى حتى تسليم المفتاح.',
    keywords: 'خدمة VIP عقارية, استثمار عقاري فاخر تركيا',
  });
}

export default function VipPage() {
  return <VipClient />;
}
