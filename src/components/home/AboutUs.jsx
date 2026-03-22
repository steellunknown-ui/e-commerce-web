import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Star, CheckCircle, Target, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutUs() {
  const [isExpanded, setIsExpanded] = useState(false);

  const whyChooseUs = [
    { title: 'Authentic Craftsmanship', description: 'Every product is handcrafted by skilled artisans using traditional techniques.' },
    { title: 'Premium Quality', description: 'We use the finest brass, wood, and marble for long-lasting beauty and durability.' },
    { title: 'Eco-Friendly Approach', description: 'Sustainable materials and responsible production methods are at the heart of our process.' },
    { title: 'Elegant Designs', description: 'A perfect fusion of heritage, art, and modern aesthetics.' },
    { title: 'Customer Satisfaction', description: 'We value trust, quality, and timeless relationships with our customers.' }
  ];

  const companyDetails = [
    { label: 'Name of Founder', value: 'Mr. R K Prajapati' },
    { label: 'Year of Establishment', value: '2025' },
    { label: 'Nature of Business', value: 'Supplier & Trader' },
    { label: 'Number of Employees', value: 'Below 10 People' },
    { label: 'Market Covered', value: 'Pan India' },
    { label: 'GST No', value: '27BZOPP1173P1ZJ' },
    { label: 'Legal Status of Firm', value: 'Proprietorship' }
  ];

  return (
    <section id="about" className="py-20 bg-muted/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">Behind The Brand</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">About Green Weave</h2>
          <p className="text-foreground/80 text-md max-w-2xl mx-auto leading-relaxed mt-4">
            At Green-Weave, we are dedicated to preserving India’s timeless artistry while creating designs that blend beautifully with modern living. Each creation we offer is a tribute to traditional craftsmanship.
          </p>
          
          <div className="pt-4">
            <Button 
              onClick={() => setIsExpanded(!isExpanded)} 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-white font-semibold flex items-center mx-auto"
            >
              {isExpanded ? 'Show Less' : 'Know More'} 
              {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-16 pt-8 border-t border-muted/30">
                {/* 1. Full Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-foreground/80 text-sm leading-relaxed">
                  <p>
                    From handcrafted Brass Statues that radiate spiritual grace to Wooden Stools that combine strength with rustic elegance, Wooden Dry Fruit Boxes that make gifting graceful, and Brass Wall Hangings that add culture and charm to your walls — every Green-Weave product tells a story of heritage and heart.
                  </p>
                  <p>
                    Our artisans work with dedication and precision, using age-old techniques refined over generations. Every carving, polish, and engraving reflects the essence of Indian artistry. We take pride in using eco-friendly and sustainable materials, ensuring that every piece enhances beauty while respecting the environment.
                  </p>
                </div>

                {/* 2. Mission & Vision Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-background border border-muted/30 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center space-x-3 text-primary">
                      <Target className="h-6 w-6" />
                      <h4 className="font-serif text-xl font-bold">Our Mission</h4>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      To preserve and promote India’s rich heritage of craftsmanship by creating authentic, eco-friendly, and artistically designed home décor pieces that bring cultural warmth and elegance to modern spaces.
                    </p>
                  </div>

                  <div className="p-8 bg-background border border-muted/30 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center space-x-3 text-primary">
                      <Eye className="h-6 w-6" />
                      <h4 className="font-serif text-xl font-bold">Our Vision</h4>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      To be a global symbol of Indian artistry and sustainable craftsmanship — inspiring homes worldwide with creations that celebrate tradition, creativity, and timeless beauty.
                    </p>
                  </div>
                </div>

                {/* 3. Why Choose Us (List Grid) */}
                <div className="space-y-6">
                  <h4 className="font-serif text-2xl font-bold text-center text-foreground">Why Choose Us</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {whyChooseUs.map((item, index) => (
                      <div key={index} className="p-5 bg-background border border-muted/30 rounded-xl hover:border-primary/40 transition-all duration-300">
                        <CheckCircle className="h-6 w-6 text-primary mb-3" />
                        <h5 className="font-semibold text-base mb-1 text-foreground">{item.title}</h5>
                        <p className="text-xs text-foreground/60">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Company Status Columns */}
                <div className="max-w-4xl mx-auto p-8 bg-background border border-muted/30 rounded-2xl shadow-md">
                  <h4 className="font-serif text-2xl font-bold text-center mb-6 text-foreground">Company Overview</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                    {companyDetails.map((detail, index) => (
                      <div key={index} className="flex justify-between border-b border-muted/20 pb-2 text-sm">
                        <span className="text-foreground/60 font-medium">{detail.label}</span>
                        <span className="text-foreground font-semibold text-right">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
