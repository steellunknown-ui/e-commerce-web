import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// 1️⃣ Read .env
const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split(/\r?\n/).forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length > 0) {
    envVars[key.trim()] = value.join('=').trim().replace(/"/g, '').replace('\r', '');
  }
});

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

async function migrate() {
  console.log("🚀 Starting Full Catalogue Migration...");

  // 2️⃣ Read and Parse mockData.js
  const fileContent = fs.readFileSync('src/data/mockData.js', 'utf-8');

  // Map Imports: e.g., makhanaBulk -> 'src/assets/products/makhana/organic_bulk.png'
  const importMap = {};
  const importRegex = /import\s+(\w+)\s+from\s+['"]@\/assets\/(.+)['"]/g;
  let match;
  while ((match = importRegex.exec(fileContent)) !== null) {
    importMap[match[1]] = `src/assets/${match[2]}`;
  }

  // Strip imports
  let cleanedContent = fileContent.replace(/import\s+.+;\s*/g, '');
  
  // ⚡ Strip "export" keywords to prevent Function() SyntaxErrors
  cleanedContent = cleanedContent.replace(/export\s+const/g, 'const');

  // Replace image variables with string paths
  Object.keys(importMap).forEach(v => {
    // Replace standalone variable references: thumbnail_url: makhanaBulk => thumbnail_url: 'src/assets/...'
    const regex = new RegExp(`:\\s*${v}\\b`, 'g');
    cleanedContent = cleanedContent.replace(regex, `: '${importMap[v]}'`);
  });

  // Evaluate the strings into actual arrays
  const tempMod = {};
  const evalFunc = new Function('module', `${cleanedContent}; module.categories = categories; module.products = products;`);
  evalFunc(tempMod);

  const categories = tempMod.categories;
  const products = tempMod.products;

  console.log(`Found ${categories.length} Categories and ${products.length} Products to migrate.`);

  // 3️⃣ Fetch Existing Categories (Skip inserting to avoid RLS Update issues)
  const { data: insertedCats, error: catError } = await supabase
    .from('categories')
    .select('id, slug');

  if (catError) {
    console.error("Categories Fetch Error:", catError.message);
    return;
  }

  const catMap = {};
  insertedCats.forEach(c => catMap[c.slug] = c.id);
  console.log(`✅ Loaded ${insertedCats.length} Categories from Database!`);

  // 3️⃣.5 Fetch Existing Products to avoid Slug Duplicate Collisions Rollbacks
  const { data: existingProds } = await supabase.from('products').select('slug');
  const existingSlugs = new Set(existingProds ? existingProds.map(p => p.slug) : []);
  console.log(`${existingSlugs.size} existing products cached to prevent collisions.`);

  // 4️⃣ Upload Images and Insert Products
  const productsToInsert = [];

  for (const p of products) {
    let imageUrl = '';
    const localImagePath = p.thumbnail_url;

    if (localImagePath && localImagePath.startsWith('src/assets/')) {
      try {
        const fileExt = path.extname(localImagePath).replace('.', '');
        const fileName = `${Date.now()}_${path.basename(localImagePath)}`;
        const buffer = fs.readFileSync(localImagePath);

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, buffer, { contentType: `image/${fileExt}` });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
          imageUrl = publicUrl;
          console.log(`📸 Uploaded image for ${p.name}`);
          
          if (existingSlugs.has(p.slug)) {
            console.log(`🔄 Updating Image for Existing Product: ${p.slug}`);
            const { error: updError } = await supabase.from('products').update({ thumbnail_url: imageUrl }).eq('slug', p.slug);
            if (updError) {
              console.error(`❌ Update Failed for ${p.slug}:`, updError.message);
            } else {
              console.log(`✅ Image Updated for ${p.slug}`);
            }
            continue; // Skip inserting it as a new row
          }
        } else {
          console.warn(`⚠️ Failed to upload image ${localImagePath}:`, uploadError.message);
        }
      } catch (err) {
        console.warn(`⚠️ FS Read Error for ${localImagePath}`);
      }
    }

    if (existingSlugs.has(p.slug)) {
      continue; // Duplicate but no new image uploaded, safe to skip
    }

    if (localImagePath && localImagePath.startsWith('src/assets/')) {
      try {
        const fileExt = path.extname(localImagePath).replace('.', '');
        const fileName = `${Date.now()}_${path.basename(localImagePath)}`;
        const buffer = fs.readFileSync(localImagePath);

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, buffer, { contentType: `image/${fileExt}` });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
          imageUrl = publicUrl;
        } else {
          console.warn(`⚠️ Failed to upload image ${localImagePath}:`, uploadError.message);
        }
      } catch (err) {
        console.warn(`⚠️ FS Read Error for ${localImagePath}`);
      }
    }

    // 🛑 SLUG DICTIONARY FIX
    // 'mockData.js' used ID strings differently than DB Slugs, we must map them exactly.
    const slugMap = {
      'makhana': 'makhana',
      'rice': 'basmati-rice',
      'non-basmati-rice': 'non-basmati-rice',
      'handicraft': 'handicraft-products',
      'brass-products': 'brass-products',
      'marble-products': 'marble-products',
      'wooden-products': 'wooden-products'
    };

    const targetCategorySlug = slugMap[p.category_id] || p.category_id;
    const resolvedCategoryId = catMap[targetCategorySlug] || null;

    productsToInsert.push({
      name: p.name,
      slug: p.slug,
      short_description: p.short_description,
      full_description: p.full_description,
      price: p.price,
      moq: p.moq,
      material: p.material,
      origin: p.origin,
      category_id: resolvedCategoryId,
      thumbnail_url: imageUrl || 'https://images.unsplash.com/photo-1541216970279-affbfdd55aa8',
      is_active: true
    });
  }

  const { error: prodError } = await supabase
    .from('products')
    .upsert(productsToInsert, { onConflict: 'slug' });

  if (prodError) {
    console.error("❌ Products Migration Error:", prodError.message);
  } else {
    console.log(`✅ ${productsToInsert.length} Products Synced Successfully with Full Mappings!`);
  }
}

migrate();
