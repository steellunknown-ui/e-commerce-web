import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/products/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🔄 Supabase Data States
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: prods } = await supabase.from('products').select('*').eq('is_active', true);
        const { data: cats } = await supabase.from('categories').select('*');
        setProductsList(prods || []);
        setCategoriesList(cats || []);
      } catch (err) {
        console.error("Fetch Live Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20">Loading Catalogue...</div>;

  // Filter Logic
  const filteredProducts = productsList.filter((product) => {
    const activeCategory = categoriesList.find(c => c.slug === categoryFilter);
    const matchesCategory = categoryFilter === 'all' || (activeCategory && product.category_id === activeCategory.id);
    
    const matchesSearch = (product.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                          (product.short_description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (slug) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
    setIsSidebarOpen(false); 
  };

  return (
    <div className="pt-24 pb-20 bg-muted/10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">Catalogue</span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground">Explore Our Earthly Bounty</h1>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40 h-5 w-5" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 bg-white border-muted/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button 
            variant="outline" 
            className="md:hidden w-full border-muted/30 flex items-center justify-center gap-2"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Filter className="h-4 w-4" /> Filters & Categories
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters (Desktop) */}
          <div className={`md:w-64 flex-shrink-0 md:sticky md:top-24 md:self-start ${isSidebarOpen ? 'fixed inset-0 z-40 bg-background p-6 overflow-y-auto md:relative md:bg-transparent md:p-0' : 'hidden md:block'}`}>
            <div className="flex justify-between items-center md:hidden mb-6">
              <h3 className="font-serif text-xl font-bold">Filters</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-muted/20 shadow-sm space-y-4">
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Categories
                </h4>
                <div className="space-y-1">
                <Button 
                  variant={categoryFilter === 'all' ? 'default' : 'ghost'} 
                  className={`w-full justify-start font-medium text-sm ${categoryFilter === 'all' ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  All Products
                </Button>
                {categoriesList.map((cat) => {
                  const displayNames = {
                    'makhana': 'Makhana',
                    'basmati-rice': 'Rice',
                    'non-basmati-rice': 'Non-basmati',
                    'handicraft-products': 'HandCrafted Products',
                    'brass-products': 'Brass Products',
                    'marble-products': 'Marbles Products',
                    'wooden-products': 'Wooden Products'
                  };
                  return (
                    <Button 
                      key={cat.id}
                      variant={categoryFilter === cat.slug ? 'default' : 'ghost'} 
                      className={`w-full justify-start font-medium text-sm ${categoryFilter === cat.slug ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
                      onClick={() => handleCategoryChange(cat.slug)}
                    >
                      {displayNames[cat.slug] || cat.name}
                    </Button>
                  );
                })}
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-grow">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-foreground/60 space-y-2">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/30" />
                <h3 className="text-xl font-semibold">No products found</h3>
                <p>Try matching with another category or search term.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
