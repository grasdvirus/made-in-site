import { HeroSection } from '@/components/sections/hero-section';
import { CategoriesSection } from '@/components/sections/categories-section';
import { BenefitsSection } from '@/components/sections/benefits-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <BenefitsSection />
      <TestimonialsSection />
    </main>
  );
}
