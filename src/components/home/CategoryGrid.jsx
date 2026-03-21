import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '@/data/mockData';
import { supabase } from '@/lib/supabase';

export default function CategoryGrid() {
  const [categoriesList] = useState(categories); // Fallback to mock initially

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from('categories').select('*');
        console.log("Supabase Categories Response:", { data, error });
      } catch (err) {
        console.log("Supabase fetch fallback activated", err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">Our Collection</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">Curated Categories</h2>
          <p className="text-foreground/60">Explore our premium selection of organic and handcrafted products preserved with care.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-6">
          {categoriesList.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/products?category=${category.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-tertiary shadow-lg hover:shadow-xl transition-all duration-500">
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <div className="absolute bottom-0 p-6 flex flex-col justify-end h-full w-full text-white">
                  <h3 className="font-serif text-lg font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                  <p className="text-xs text-white/70 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{category.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
