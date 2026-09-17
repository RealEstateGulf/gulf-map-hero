import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo';
import InsightsClient from './InsightsClient';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('insights', {
    path: '/insights',
    title: 'مقالات ونصائح عقارية | مدونة المفتاح العقارية',
    description: 'أحدث المقالات والتحليلات حول سوق العقارات التركي، أدلة الاستثمار، وأخبار الجنسية التركية — كل ما يحتاجه المستثمر العربي في مكان واحد.',
    keywords: 'مدونة عقارية تركيا, أخبار الاستثمار العقاري تركيا',
  });
}

export default function InsightsPage() {
  return <InsightsClient />;
}
