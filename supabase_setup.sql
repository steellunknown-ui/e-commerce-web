-- ==========================================
-- SUPABASE / POSTGRESQL DATABASE SETUP SCRIPT
-- ==========================================
-- Copy and paste this script into your Supabase SQL Editor to initialize tables.

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  price NUMERIC,
  moq TEXT,
  material TEXT,
  origin TEXT,
  shelf_life TEXT,
  size_info TEXT,
  weight_info TEXT,
  benefits TEXT,
  care_instructions TEXT,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  product_name TEXT,
  quantity TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. INSERT DEFAULT CATEGORIES
INSERT INTO categories (slug, name, description, image_url) VALUES
('makhana', 'Makhana (Foxnuts)', 'Premium quality, nutrient-dense popped gorgon nuts sourced from organic farms.', 'https://images.unsplash.com/photo-1627483262769-04d0a1400f8e'),
('terracotta-cookware', 'Terracotta Cookware', 'Traditional earthenware crafted by artisans for slow, healthy, and flavorful cooking.', 'https://images.unsplash.com/photo-1578995541814-c711756d10fb'),
('specialty-rice', 'Specialty Rice', 'Aromatics and heirloom grains preserving ancient agricultural heritage.', 'https://images.unsplash.com/photo-1586201375761-83865001e31c'),
('handicraft-products', 'Handcrafted Art', 'Curated traditional crafts that tell a story of heritage and skill.', 'https://images.unsplash.com/photo-1614088033068-075f9227653c'),
('brass-handicraft', 'Brass Handicrafts', 'Exquisite traditional brassware and antique artifacts crafted for timeless elegance.', 'https://images.unsplash.com/photo-1590424753715-dd4822830f02')
ON CONFLICT (slug) DO NOTHING;
