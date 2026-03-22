import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonialsData = [
  {
    name: "Rahul Sharma",
    role: "MD, Punjab Agro Exports",
    content: "Green Weave supply chains are flawlessly accurate. Their Non-Basmati variety loaded on time perfectly vacuum sealed brick packs, sustaining 8-weeks container transit immaculate.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=150"
  },
  {
    name: "Priya Patel",
    role: "CEO, Organic Retail UK",
    content: "The handcrafted brass handicrafts arrived securely packed with Zero denting. Their Bulk Enquiry team coordinates documentation faster than any provider I have partnered before in India.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150"
  },
  {
    name: "Vikram Singh",
    role: "Logistics Manager, Dubai Trade",
    content: "Makhana and Basmati Rice quality grades uniformly match testing specs. Certifications releases were direct downloads, bypassing clearing layout timeouts completely, extremely reliable operations.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1507003200747-5267b7857c32?auto=format&fit=crop&w=150"
  },
  {
    name: "Ananya Reddy",
    role: "Sourcing Head, Singapore Foods",
    content: "The wooden products series feature stunning carvings without compromises. Their compliance standards perfectly match absolute container load limits securely tracking.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150"
  },
  {
    name: "Amit Gupta",
    role: "Director, Global Spices LLC",
    content: "Our bulk orders for Marbles reached on-time layout targets perfectly. Customer responsiveness absolute benchmarks maintaining reliable transit integrity.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150"
  }
];

export default function Testimonials() {
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef(null);
  
  // Duplicate array for infinite scroll continuous track
  const carouselItems = [...testimonialsData, ...testimonialsData];

  useEffect(() => {
    if (isHovered || carouselItems.length === 0) return;

    let animationFrameId;
    const speed = 0.5; // slow reading scrolling track

    const scrollTick = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        container.scrollLeft += speed;

        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollTick);
    };

    animationFrameId = requestAnimationFrame(scrollTick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="py-20 bg-muted/30 relative group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4 px-4">
        <span className="text-primary font-semibold text-sm tracking-wider uppercase">Endorsements</span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">Global Client Testimonials</h2>
        <p className="text-foreground/60 text-sm">Trusted by premium B2B buyers and importers from around the world.</p>
      </div>

      <div className="relative max-w-[100rem] mx-auto flex items-center px-4 md:px-12">
        {/* Left Arrow Controls */}
        <button 
          onClick={handlePrev} 
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-primary hover:text-white backdrop-blur-md p-3 rounded-full text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-muted/20 flex items-center justify-center m-auto"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div 
          ref={scrollContainerRef} 
          className="flex space-x-6 overflow-x-auto scrollbar-none py-6 w-full"
          style={{ scrollbarWidth: 'none' }} 
        >
          {carouselItems.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex-shrink-0 w-[85vw] md:w-[22rem] bg-white p-6 rounded-2xl border border-muted/10 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-lg transition-all duration-300 relative"
            >
              <div className="absolute top-6 right-6 text-primary/10">
                <Quote className="h-12 w-12 stroke-[3]" />
              </div>

              <div className="space-y-4">
                <div className="flex text-secondary gap-0.5">
                  {[...Array(item.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-secondary" />)}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed font-medium italic">
                    "{item.content}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-muted/10">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{item.name}</h4>
                  <p className="text-xs text-foreground/50">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Controls */}
        <button 
          onClick={handleNext} 
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-primary hover:text-white backdrop-blur-md p-3 rounded-full text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-muted/20 flex items-center justify-center m-auto"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
