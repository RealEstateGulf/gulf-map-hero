import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo';
import TurkeyClient from './TurkeyClient';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('turkey', {
    path: '/turkey',
    title: 'الاستثمار في تركيا | لماذا تركيا وجهة المستثمر العربي الأولى',
    description: 'تعرف على أبرز المدن التركية للاستثمار العقاري — إسطنبول، بورصة، أنطاليا، وإزمير — ولماذا يختار المستثمرون العرب تركيا لبناء ثروتهم العقارية.',
    keywords: 'الاستثمار في تركيا, لماذا الاستثمار في تركيا, مدن تركيا للاستثمار العقاري',
  });
}

export default function TurkeyPage() {
  return <TurkeyClient />;
}
