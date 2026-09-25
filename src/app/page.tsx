import type { Metadata } from 'next';
import { getSeoMetadata } from '@/lib/seo';
import MapLoader from '@/components/map/MapLoader';
import ScrollOverlays from '@/components/ui/ScrollOverlays';
import StatsSection from '@/components/sections/StatsSection';
import WhyTurkeySection from '@/components/sections/WhyTurkeySection';
import ArchitectureSection from '@/components/sections/ArchitectureSection';
import FeaturedSection from '@/components/sections/FeaturedSection';
import BudgetSection from '@/components/sections/BudgetSection';
import ServicesSection from '@/components/sections/ServicesSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import SustainableCTASection from '@/components/sections/SustainableCTASection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ReviewSection from '@/components/sections/ReviewSection';
import FAQSection from '@/components/sections/FAQSection';
import FooterSection from '@/components/sections/FooterSection';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('home', {
    path: '/',
    title: 'المفتاح العقارية | الاستثمار العقاري وشراء العقارات في تركيا',
    description: 'دليلك الموثوق للاستثمار العقاري في تركيا — شقق وفلل ومشاريع استثمارية في إسطنبول وأنطاليا وبورصة، مع استشارات مجانية ودعم كامل للمستثمرين العرب وطريق الحصول على الجنسية التركية.',
    keywords: 'استثمار عقاري في تركيا, شراء عقار في تركيا, عقارات تركيا للبيع, الجنسية التركية عن طريق الاستثمار, عقارات اسطنبول',
  });
}

export default function Home() {
  return (
    <main>
      {/* Hero: full-screen map */}
      <section style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <MapLoader />
      </section>

      {/* Fixed scroll overlays (client-only) */}
      <ScrollOverlays />

      <StatsSection />
      <WhyTurkeySection />
      <ArchitectureSection />
      <FeaturedSection />
      <BudgetSection />
      <ServicesSection />
      <WhyUsSection />
      <SustainableCTASection />
      <TestimonialsSection />
      <ReviewSection />
      <FAQSection />
      <FooterSection />
    </main>
  );
}
