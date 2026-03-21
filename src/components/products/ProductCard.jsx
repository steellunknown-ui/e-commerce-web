import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Eye } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <div className="group bg-card border border-muted/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full bg-white">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted/20">
        <img 
          src={product.thumbnail_url} 
          alt={product.name} 
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {product.is_featured && (
          <Badge className="absolute top-4 left-4 bg-primary text-white border-0">
            Featured
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex-grow space-y-1">
          <span className="text-xs text-primary font-semibold tracking-wider uppercase">{product.category_id}</span>
          <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-foreground/60 line-clamp-2">
            {product.short_description}
          </p>
          <div className="pt-2 flex items-center space-x-2 text-xs text-foreground/40">
            <span>Origin: {product.origin}</span>
            <span>•</span>
            <span>MOQ: {product.moq}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-5 border-t border-muted/10 mt-4">
          <Link to={`/products/${product.slug}`} className="flex-1">
            <Button variant="outline" className="w-full border-muted/30 hover:bg-muted/10 hover:text-primary text-sm gap-1">
              <Eye className="h-4 w-4" /> Know More
            </Button>
          </Link>
          <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-white text-sm gap-1">
            <ShoppingBag className="h-4 w-4" /> Enquire
          </Button>
        </div>
      </div>
    </div>
  );
}
