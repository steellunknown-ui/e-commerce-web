import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import EnquiryModal from '@/components/products/EnquiryModal';

export default function ProductDetails() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!product) {
    return (
      <div className="pt-24 pb-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/products">
          <Button variant="link" className="text-primary">Back to Catalogue</Button>
        </Link>
      </div>
    );
  }

  const handleWhatsappEnquiry = () => {
    const message = `Hi, I am interested in your product: ${product.name}. MOQ is ${product.moq}. Can you share more details and pricing?`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="pt-24 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/products" className="inline-flex items-center space-x-1 text-primary hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" /> <span>Back to Catalogue</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Gallery */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-muted/20 shadow-lg">
            <img 
              src={product.thumbnail_url} 
              alt={product.name} 
              className="h-full w-full object-cover"
            />
            {product.is_featured && (
              <Badge className="absolute top-6 left-6 bg-primary text-white border-0 text-sm px-4 py-1">
                Featured Collection
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="space-y-3">
              <span className="text-primary font-semibold tracking-wider uppercase text-sm">{product.category_id}</span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-tight">{product.name}</h1>
              <p className="text-foreground/60 leading-relaxed text-lg">{product.short_description}</p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4 p-4 border border-muted/20 rounded-2xl bg-muted/5">
              <div className="space-y-1">
                <span className="text-xs text-foreground/40 uppercase">MOQ</span>
                <p className="font-semibold text-sm">{product.moq}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-foreground/40 uppercase">Origin</span>
                <p className="font-semibold text-sm">{product.origin}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-foreground/40 uppercase">Material</span>
                <p className="font-semibold text-sm">{product.material}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-foreground/40 uppercase">Shelf Life</span>
                <p className="font-semibold text-sm">{product.shelf_life}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold">About this Product</h3>
              <p className="text-foreground/70 leading-relaxed text-sm">{product.full_description}</p>
            </div>

            {/* Benefits & Care */}
            <div className="space-y-4 border-t border-muted/10 pt-6">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Benefits</h4>
                  <p className="text-xs text-foreground/60">{product.benefits}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ShieldAlert className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Care Instructions</h4>
                  <p className="text-xs text-foreground/60">{product.care_instructions}</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-muted/10">
              <Button 
                size="lg" 
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsModalOpen(true)}
              >
                <ShoppingBag className="mr-2 h-5 w-5" /> Enquire Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="flex-1 border-emerald-600/50 text-emerald-700 hover:bg-emerald-50 h-12 font-semibold"
                onClick={handleWhatsappEnquiry}
              >
                WhatsApp Enquiry
              </Button>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={product} />
    </div>
  );
}
