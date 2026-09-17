import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo';
import CitizenshipClient from './CitizenshipClient';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('citizenship', {
    path: '/citizenship',
    title: 'الجنسية التركية عن طريق الاستثمار العقاري 2026',
    description: 'احصل على الجنسية التركية لك ولعائلتك من خلال شراء عقار بقيمة 400,000 دولار أمريكي — الشروط، المستندات المطلوبة، وخطوات التقديم بالتفصيل.',
    keywords: 'الجنسية التركية عن طريق الاستثمار, جواز السفر التركي بالعقار, شروط الجنسية التركية 2026',
  });
}

export default function CitizenshipPage() {
  return <CitizenshipClient />;
}
