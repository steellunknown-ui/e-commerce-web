import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: "How do you ensure food safety and hygiene for exports?",
    answer: "We strictly adhere to international food safety regulations (HACCP, ISO 22000). All products undergo laboratory testing for pesticides, heavy metals, and moisture levels before sealing in vacuum packs."
  },
  {
    question: "What is your Minimum Order Quantity (MOQ) for bulk orders?",
    answer: "MOQs typically range from 500 kg to 1 Ton depending on the product matrix. For container loads (FCL or LCL), we support mixed-load shipments tailored to your supply chain."
  },
  {
    question: "Do you provide custom B2B private label packaging?",
    answer: "Yes! We support full bulk OEM customization. We offer vacuum brick packing, gunny loading, PP packs, and custom-branded pouches designed to sustain global transit scaling cleanly."
  },
  {
    question: "Which organic and quality certifications do you hold?",
    answer: "Our network supports APEDA, SPICES BOARD, and USDA Organic guidelines. Specific batch-level APEDA phytosanitary and origins certifications are released upon container lock downloads."
  },
  {
    question: "What are your standard shipping Incoterms and Payment terms?",
    answer: "We predominantly trade on FOB (Free On Board), CIF (Cost, Insurance & Freight), and CFR. Payment runs flexible via Irrevocable LC (Letter of Credit) or standard Wire transfers upon contract confirmation."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">Got Questions?</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">Frequently Asked Questions</h2>
          <p className="text-foreground/60 text-sm max-w-lg mx-auto">
            Everything you need to know about our sourcing, logistics, and bulk ordering processes.
          </p>
        </div>

        <div className="space-y-3">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${isOpen ? 'border-primary bg-primary/[0.02]' : 'border-muted/30 bg-white'}`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className={`font-semibold md:text-lg transition-colors duration-200 ${isOpen ? 'text-primary' : 'text-foreground/80 group-hover:text-primary'}`}>
                    {item.question}
                  </span>
                  <div className={`p-1.5 rounded-full transition-all duration-300 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-muted/30 text-foreground/40'}`}>
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-foreground/70 text-sm md:text-md leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
