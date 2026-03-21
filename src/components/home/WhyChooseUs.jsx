import { useState } from 'react';
import { ShieldCheck, Truck, Sparkles, Sprout, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
  {
    icon: Sprout,
    title: '100% Organic & Sourced',
    description: 'Directly from organic farms and verified artisans ensuring authenticity.',
  },
  {
    icon: ShieldCheck,
    title: 'Certified Premium Quality',
    description: 'Every product undergoes strict quality checks for export readiness and hygiene.',
  },
  {
    icon: Sparkles,
    title: 'Traditional Craftsmanship',
    description: 'Preserving ancient techniques of pottery and harvesting methods.',
  },
  {
    icon: Truck,
    title: 'Seamless Bulk Logistics',
    description: 'Configured for scale, addressing B2B packaging and bulk container loads.',
  },
];

export default function WhyChooseUs() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary font-semibold text-sm tracking-wider uppercase">The Promise</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mt-2 mb-6">Why Sophisticated Buyers Choose Us</h2>
            <p className="text-foreground/70 mb-8 leading-relaxed">
              We close the gap between local artisanal talent and global B2B standards. Our items are not just products; they are preserving heritage and sustainable ecology.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-5 border border-muted/30 rounded-xl hover:border-primary/50 hover:bg-muted/10 transition-all duration-300 group"
                >
                  <feature.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300 mb-3" />
                  <h4 className="font-semibold text-base mb-1 text-foreground">{feature.title}</h4>
                  <p className="text-sm text-foreground/60">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <img 
              src="/src/assets/why-choose-us.png" 
              alt="Our crafts, rice, makhana, and brass collections" 
              className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80"; // Unsplash backup
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-semibold tracking-wider transition-opacity duration-300">
                Click to Expand
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all duration-300 shadow-lg"
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Image full layout */}
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src="/src/assets/why-choose-us.png" 
              alt="Full Preview of Collections" 
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain cursor-default"
              onClick={(e) => e.stopPropagation()} // Prevent closing wrapper trigger
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80";
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
