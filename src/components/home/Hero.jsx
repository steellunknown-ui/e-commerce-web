import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import heroVideo from '@/assets/Cinematic_Hero_Background_Video_Creation.mp4';

// Content mapped to matching video time intervals
const heroSlides = [
  {
    id: 'makhana',
    label: 'Ancient Treasures for Modern Living',
    title: { main: 'Elevate Your Table with ', highlight: 'Earthy Luxury', highlightClass: 'text-primary' },
    description: 'Discover organic popped Makhana, traditional Terracotta cookware, and specialty aging-grains. Handcrafted for slow, authentic living.',
    time: [0, 2.0]
  },
  {
    id: 'rice',
    label: 'Grown with Care, Aged to Perfection',
    title: { main: 'Harvesting the Golden ', highlight: 'Basmati Fields', highlightClass: 'text-secondary' },
    description: 'Sustainably cultivated in mineral-rich soil, our premium long-grain rice brings aromatic excellence to every gourmet meal.',
    time: [2.0, 3.5]
  },
  {
    id: 'pots',
    label: 'Crafted by Master Artisans',
    title: { main: 'Empower Your Health with ', highlight: 'Clay Cookware', highlightClass: 'text-tertiary' },
    description: 'Authentic earthen pots that locking in nutrition, promote naturally alkaline cooking, and support traditional local crafting nodes.',
    time: [3.5, 8.0]
  }
];

export default function Hero() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const videoRef = useRef(null);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;

      // Find matching slide that encompasses current video timestamp
      const matchedIndex = heroSlides.findIndex(slide =>
        time >= slide.time[0] && time < slide.time[1]
      );

      if (matchedIndex !== -1 && matchedIndex !== currentSlideIndex) {
        setCurrentSlideIndex(matchedIndex);
      }
    }
  };

  const slide = heroSlides[currentSlideIndex];

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src={heroVideo}
          autoPlay
          loop
          muted
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white z-10">
        <div className="max-w-xl md:max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <span className="inline-block px-4 py-1 rounded-full border border-secondary text-secondary font-semibold text-sm tracking-wider uppercase bg-secondary/10 backdrop-blur-md">
                {slide.label}
              </span>

              <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight leading-none">
                {slide.title.main}
                <span className={slide.title.highlightClass}>{slide.title.highlight}</span>
              </h1>

              <p className="text-lg text-white/80 leading-relaxed font-sans">
                {slide.description}
              </p>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Link to="/products">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-300 w-full sm:w-auto">
                    Explore Catalogue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className={`border-2 font-semibold w-full sm:w-auto transition-all duration-300 bg-black/20 backdrop-blur-sm
                    ${currentSlideIndex === 0 ? 'border-primary text-primary hover:bg-primary hover:text-white' : ''}
                    ${currentSlideIndex === 1 ? 'border-secondary text-secondary hover:bg-secondary hover:text-white' : ''}
                    ${currentSlideIndex === 2 ? 'border-tertiary text-tertiary hover:bg-tertiary hover:text-white' : ''}
                  `}
                >
                  Bulk Inquiry
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2"
      >
        <span className="text-white/60 text-xs uppercase tracking-widest font-sans">Scroll to Discover</span>
        <div className="w-1 h-12 rounded-full bg-white/30 relative overflow-hidden">
          <motion.div
            animate={{ y: [0, 48, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-1 h-3 rounded-full bg-primary absolute top-0"
          ></motion.div>
        </div>
      </motion.div>
    </div>
  );
}
