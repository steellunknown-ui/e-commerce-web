import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, ImageIcon } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_description: '',
    full_description: '',
    price: '',
    moq: '',
    category_id: '',
    material: '',
    origin: '',
    image_file: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Products
      const { data: prods } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
      setProducts(prods || []);

      // 2. Fetch Categories for Dropdown
      const { data: cats } = await supabase.from('categories').select('id, name');
      setCategories(cats || []);

    } catch (error) {
      console.error("Fetch Products Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const seedCategories = async () => {
    if (!confirm("Are you sure you want to add default categories into your Database?")) return;
    try {
      const defaultCats = [
        { slug: 'makhana', name: 'Makhana (Foxnuts)', description: 'Premium quality nutrient-dense nuts' },
        { slug: 'basmati-rice', name: 'Basmati Rice', description: 'Long-grain premium aromatic rice' },
        { slug: 'non-basmati-rice', name: 'Non Basmati Rice', description: 'Daily consumption staple non-basmati varieties' },
        { slug: 'handicraft-products', name: 'Handcrafted Art', description: 'Curated traditional crafts of heritage' },
        { slug: 'brass-products', name: 'Brass Products', description: 'Exquisite traditional brassware and antique artifacts' },
        { slug: 'marble-products', name: 'Marble Products', description: 'Handcrafted marble decor and planters' },
        { slug: 'wooden-products', name: 'Wooden Products', description: 'Artisanal wooden clocks and kitchenware' }
      ];

      const { error } = await supabase.from('categories').insert(defaultCats);
      if (error) throw error;
      
      alert("Default Categories Seeded Successfully!");
      fetchData(); // Reload list
    } catch (err) {
      alert("Seeding Error: " + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'name' && !formData.slug) {
      // Auto-generate slug from name
      setFormData(prev => ({ ...prev, name: value, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image_file: e.target.files[0] });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = '';

      // 🖼️ 1. Upload Image to Supabase Storage if present
      if (formData.image_file) {
        const file = formData.image_file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) {
          throw new Error("Image Upload Failed! Please ensure you have created a PUBLIC bucket named 'product-images' in your Supabase Dashboard: " + uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      // 📝 2. Insert into Database
      const { error } = await supabase.from('products').insert([{
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-'),
        short_description: formData.short_description,
        full_description: formData.full_description,
        price: formData.price ? parseFloat(formData.price) : null,
        moq: formData.moq,
        material: formData.material,
        origin: formData.origin,
        category_id: formData.category_id || null,
        thumbnail_url: imageUrl || 'https://images.unsplash.com/photo-1541216970279-affbfdd55aa8?auto=format&fit=crop&w=800&q=80', // Default fallback
        is_active: true
      }]);

      if (error) throw error;

      alert("Product Added Successfully!");
      setIsAddModalOpen(false);
      
      // Reset form
      setFormData({ name: '', slug: '', short_description: '', full_description: '', price: '', moq: '', category_id: '', material: '', origin: '', image_file: null });
      fetchData(); // Reload list

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading Products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Products</h1>
          <p className="text-foreground/60 text-sm">Manage items listed in your live catalogue.</p>
        </div>
        <div className="flex items-center gap-3">
          {categories.length === 0 && (
            <Button onClick={seedCategories} className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2">
              Setup Categories
            </Button>
          )}
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-muted/20 shadow-sm overflow-hidden">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/10 text-foreground/70 border-b border-muted/20">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Image</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Name</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Category</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">MOQ</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/10">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-muted/5 transition-colors">
                    <td className="px-6 py-4">
                      <img src={prod.thumbnail_url} alt={prod.name} className="h-10 w-10 object-cover rounded-lg border" />
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">{prod.name}</td>
                    <td className="px-6 py-4 text-foreground/60">{prod.categories?.name || 'Uncategorized'}</td>
                    <td className="px-6 py-4 text-foreground/60">{prod.moq || 'N/A'}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDelete(prod.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 text-foreground/40">No products found. Add your first item!</div>
        )}
      </div>

      {/* 📦 Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border border-muted/20">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-bold">Add New Product</DialogTitle>
            <DialogDescription>Fill in the specs. It will appear live instantly once added.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Premium Makhana" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="slug">Slug (Auto-generated)</Label>
                <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="e.g., premium-makhana" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="category_id">Category *</Label>
                <select 
                  id="category_id" 
                  name="category_id" 
                  value={formData.category_id} 
                  onChange={handleInputChange} 
                  required
                  className="w-full h-10 px-3 bg-white border border-muted/30 rounded-md shadow-sm text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="moq">MOQ (Minimum Order Quantity) *</Label>
                <Input id="moq" name="moq" value={formData.moq} onChange={handleInputChange} placeholder="e.g., 500 Kg or 10 Units" required />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="short_description">Short Description *</Label>
              <Input id="short_description" name="short_description" value={formData.short_description} onChange={handleInputChange} placeholder="Brief summary of product" required />
            </div>

            <div className="space-y-1">
              <Label htmlFor="full_description">Full Description</Label>
              <Textarea id="full_description" name="full_description" value={formData.full_description} onChange={handleInputChange} placeholder="Detailed parameters..." rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="material">Material / Grade</Label>
                <Input id="material" name="material" value={formData.material} onChange={handleInputChange} placeholder="e.g., Organic / Metal" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="origin">Origin</Label>
                <Input id="origin" name="origin" value={formData.origin} onChange={handleInputChange} placeholder="e.g., Kalher, India" />
              </div>
            </div>

            {/* 🖼️ Image Upload */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="border border-dashed border-muted/30 rounded-xl p-6 flex flex-col items-center justify-center bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer relative">
                <Input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <ImageIcon className="h-8 w-8 text-foreground/40 mb-2" />
                <p className="text-sm font-medium">{formData.image_file ? formData.image_file.name : 'Click to Upload Image'}</p>
                <p className="text-xs text-foreground/40">PNG, JPG up to 5MB</p>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white">
                {isSubmitting ? 'Adding...' : 'Add Now'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
