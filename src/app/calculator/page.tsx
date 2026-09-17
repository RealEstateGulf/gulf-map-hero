import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo';
import CalculatorClient from './CalculatorClient';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('calculator', {
    path: '/calculator',
    title: 'حاسبة العائد على الاستثمار العقاري في تركيا',
    description: 'احسب العائد المتوقع من استثمارك العقاري في تركيا مجانًا — العائد الإيجاري، ارتفاع قيمة العقار، وفترة استرداد رأس المال بضغطة زر.',
    keywords: 'حاسبة العائد على الاستثمار العقاري, حساب الإيجار في تركيا, ROI عقارات تركيا',
  });
}

export default function CalculatorPage() {
  return <CalculatorClient />;
}
