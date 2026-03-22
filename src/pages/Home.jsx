import { useEffect } from 'react';
import Hero from '@/components/home/Hero';
import ProductCarousel from '@/components/home/ProductCarousel';
import CategoryGrid from '@/components/home/CategoryGrid';
import AboutUs from '@/components/home/AboutUs';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import BulkEnquiryCTA from '@/components/home/BulkEnquiryCTA';

export default function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Delay slightly for render cycles to complete
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  }, []);

  return (
    <div className="space-y-0">
      <Hero />
      <ProductCarousel />
      <CategoryGrid />
      <AboutUs />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <BulkEnquiryCTA />
    </div>
  );
}
