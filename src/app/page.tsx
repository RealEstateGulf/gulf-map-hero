import MapLoader from '@/components/map/MapLoader';
import ScrollOverlays from '@/components/ui/ScrollOverlays';
import StatsSection from '@/components/sections/StatsSection';
import WhyTurkeySection from '@/components/sections/WhyTurkeySection';
import ArchitectureSection from '@/components/sections/ArchitectureSection';
import FeaturedSection from '@/components/sections/FeaturedSection';
import ServicesSection from '@/components/sections/ServicesSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import SustainableCTASection from '@/components/sections/SustainableCTASection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import ReviewSection from '@/components/sections/ReviewSection';
import FAQSection from '@/components/sections/FAQSection';
import FooterSection from '@/components/sections/FooterSection';

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
