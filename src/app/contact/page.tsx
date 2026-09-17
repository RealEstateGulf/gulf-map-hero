import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo';
import ContactClient from './ContactClient';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('contact', {
    path: '/contact',
    title: 'تواصل معنا | مكاتب المفتاح العقارية في دبي وبورصة',
    description: 'تواصل مع فريق المفتاح العقارية عبر مكاتبنا في دبي وبورصة، أو راسلنا مباشرة للحصول على استشارة مجانية حول الاستثمار العقاري في تركيا.',
    keywords: 'تواصل المفتاح العقارية, مكتب عقاري في دبي, عقارات تركيا اتصل بنا',
  });
}

export default function ContactPage() {
  return <ContactClient />;
}
