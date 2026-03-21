import { useState, useEffect, useRef } from 'react';
import { products } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductCarousel() {
    const [productsList] = useState(products);
    const [isHovered, setIsHovered] = useState(false);
    const scrollContainerRef = useRef(null);

    // Duplicate products for infinite seamless scroll track
    const carouselProducts = [...productsList, ...productsList];

    useEffect(() => {
        if (isHovered) return;

        let animationFrameId;
        const speed = 0.8; // Butter smooth continuous speed

        const scrollTick = () => {
            if (scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                container.scrollLeft += speed;

                // Seamless reset to start upon crossing halfway mark of duplicated array
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
            scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    return (
        <section 
            className="py-16 bg-muted/20 relative group" 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
                <span className="text-primary font-semibold text-sm tracking-wider uppercase">Spotlight</span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">Featured Products</h2>
                <p className="text-foreground/60 text-sm">Discover our signature export-grade products, updated automatically.</p>
            </div>

            <div className="relative max-w-[95rem] mx-auto flex items-center">
                {/* Left Arrow Controls */}
                <button 
                    onClick={handlePrev} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 backdrop-blur-md p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg border border-white/10 flex items-center justify-center m-auto"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>

                <div 
                    ref={scrollContainerRef} 
                    className="flex space-x-6 overflow-x-auto scrollbar-none px-4 w-full"
                    style={{ scrollbarWidth: 'none' }} 
                >
                    {carouselProducts.map((product, index) => (
                        <Link
                            key={`${product.id}-${index}`}
                            to={`/products?category=${product.category_id}`}
                            className="flex-shrink-0 w-72 md:w-80 group relative aspect-[3/4] bg-tertiary rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
                        >
                            <img
                                src={product.thumbnail_url}
                                alt={product.name}
                                className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-75"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                            <div className="absolute bottom-0 p-6 flex flex-col justify-end w-full h-full text-white">
                                <span className="text-xs text-secondary font-semibold tracking-wider uppercase mb-1">{product.material}</span>
                                <h3 className="font-serif text-md font-bold tracking-tight mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                                <div className="flex justify-between items-center text-xs text-white/70">
                                    <span>MOQ: {product.moq}</span>
                                    <span>Origin: {product.origin}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Right Arrow Controls */}
                <button 
                    onClick={handleNext} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 backdrop-blur-md p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-lg border border-white/10 flex items-center justify-center m-auto"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>
        </section>
    );
}
