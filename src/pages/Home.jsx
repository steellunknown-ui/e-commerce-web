import Hero from '@/components/home/Hero';
import ProductCarousel from '@/components/home/ProductCarousel';
import CategoryGrid from '@/components/home/CategoryGrid';
import AboutUs from '@/components/home/AboutUs';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import BulkEnquiryCTA from '@/components/home/BulkEnquiryCTA';

export default function Home() {
  return (
    <div className="space-y-0">
      <Hero />
      <ProductCarousel />
      <CategoryGrid />
      <AboutUs />
      <WhyChooseUs />
      <BulkEnquiryCTA />
    </div>
  );
}
