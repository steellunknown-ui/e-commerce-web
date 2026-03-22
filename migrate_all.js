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

// 🛑 EXACT CATEGORY DEFINITIONS — User wants ONLY these 7 categories
const DESIRED_CATEGORIES = [
  { slug: 'makhana', name: 'Makhana', description: 'Premium quality, nutrient-dense popped gorgon nuts sourced from organic farms.' },
  { slug: 'basmati-rice', name: 'Rice', description: 'Long-grain premium rice with rich aroma and soft texture.' },
  { slug: 'non-basmati-rice', name: 'Non-basmati', description: 'Premium daily consumption non-basmati rice varieties sourced fresh.' },
  { slug: 'brass-products', name: 'Brass Products', description: 'Exquisite traditional brassware and antique artifacts crafted for timeless elegance.' },
  { slug: 'marble-products', name: 'Marbles Products', description: 'Beautifully crafted marble products with premium finish and traditional designs.' },
  { slug: 'wooden-products', name: 'Wooden Products', description: 'Handmade wooden items crafted with precision from premium quality natural wood.' },
  { slug: 'handicraft-products', name: 'HandCrafted Products', description: 'Curated traditional crafts that tell a story of heritage and skill.' },
];

// MockData category_id → DB slug mapping
const CATEGORY_SLUG_MAP = {
  'makhana': 'makhana',
  'rice': 'basmati-rice',
  'non-basmati-rice': 'non-basmati-rice',
  'handicraft': 'handicraft-products',
  'brass-products': 'brass-products',
  'marble-products': 'marble-products',
  'wooden-products': 'wooden-products'
};

async function migrate() {
  console.log("🚀 Starting Full Catalogue Migration...\n");

  // ═══════════════════════════════════════════════════════
  // STEP 1: Ensure ALL desired categories exist
  // ═══════════════════════════════════════════════════════
  console.log("📂 STEP 1: Setting up categories...");

  // First delete ALL existing categories (clean slate)
  const { data: existingCats } = await supabase.from('categories').select('*');
  
  // Nullify category_id on all products first to avoid FK violations
  await supabase.from('products').update({ category_id: null }).neq('slug', 'IMPOSSIBLE_SLUG');
  console.log("   🔄 Cleared all product-category links temporarily");

  // Delete all existing categories
  for (const cat of (existingCats || [])) {
    await supabase.from('categories').delete().eq('id', cat.id);
    console.log(`   🗑️ Deleted old category: "${cat.name}" (${cat.slug})`);
  }

  // Insert fresh categories
  for (const cat of DESIRED_CATEGORIES) {
    const { error } = await supabase.from('categories').insert({
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      image_url: ''
    });
    if (error) {
      console.log(`   ❌ Failed to create "${cat.name}": ${error.message}`);
    } else {
      console.log(`   ✅ Created category: "${cat.name}" (${cat.slug})`);
    }
  }

  // Build catMap from fresh data
  const { data: freshCats } = await supabase.from('categories').select('id, slug');
  const catMap = {};
  freshCats?.forEach(c => catMap[c.slug] = c.id);
  console.log(`\n   📋 Final Categories (${Object.keys(catMap).length}): ${Object.keys(catMap).join(', ')}\n`);

  // ═══════════════════════════════════════════════════════
  // STEP 2: Parse mockData.js
  // ═══════════════════════════════════════════════════════
  console.log("📖 STEP 2: Parsing mockData.js...");

  const fileContent = fs.readFileSync('src/data/mockData.js', 'utf-8');

  const importMap = {};
  const importRegex = /import\s+(\w+)\s+from\s+['"]@\/assets\/(.+)['"]/g;
  let match;
  while ((match = importRegex.exec(fileContent)) !== null) {
    importMap[match[1]] = `src/assets/${match[2]}`;
  }

  let cleanedContent = fileContent.replace(/import\s+.+;\s*/g, '');
  cleanedContent = cleanedContent.replace(/export\s+const/g, 'const');

  Object.keys(importMap).forEach(v => {
    const regex = new RegExp(`:\\s*${v}\\b`, 'g');
    cleanedContent = cleanedContent.replace(regex, `: '${importMap[v]}'`);
  });

  const tempMod = {};
  const evalFunc = new Function('module', `${cleanedContent}; module.categories = categories; module.products = products;`);
  evalFunc(tempMod);

  const products = tempMod.products;
  console.log(`   Found ${products.length} products to process.\n`);

  // ═══════════════════════════════════════════════════════
  // STEP 3: Upload Images & Update Every Product
  // ═══════════════════════════════════════════════════════
  console.log("🖼️ STEP 3: Uploading images & updating products...\n");

  let successCount = 0;
  let failCount = 0;

  for (const p of products) {
    const localImagePath = p.thumbnail_url;
    let imageUrl = '';

    // Upload image to Supabase Storage
    if (localImagePath && localImagePath.startsWith('src/assets/')) {
      try {
        if (fs.existsSync(localImagePath)) {
          const fileExt = path.extname(localImagePath).replace('.', '');
          const fileName = `${p.slug}.${fileExt}`;
          const buffer = fs.readFileSync(localImagePath);

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, buffer, { 
              contentType: `image/${fileExt}`,
              upsert: true
            });

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
          imageUrl = publicUrl;

          if (uploadError) {
            console.log(`   ⚠️ Upload note for ${p.slug}: ${uploadError.message} (using existing)`);
          }
        } else {
          console.log(`   ⚠️ File not found: ${localImagePath}`);
        }
      } catch (err) {
        console.log(`   ⚠️ Read error for ${localImagePath}: ${err.message}`);
      }
    }

    // Resolve category
    const targetSlug = CATEGORY_SLUG_MAP[p.category_id] || p.category_id;
    const resolvedCategoryId = catMap[targetSlug] || null;

    // Build update payload
    const updatePayload = {
      name: p.name,
      short_description: p.short_description,
      full_description: p.full_description,
      price: p.price,
      moq: p.moq,
      material: p.material,
      origin: p.origin,
      category_id: resolvedCategoryId,
      is_active: true
    };

    if (imageUrl && imageUrl.includes('product-images')) {
      updatePayload.thumbnail_url = imageUrl;
    }

    // Update existing product
    const { error: updError } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('slug', p.slug);

    if (updError) {
      console.log(`   ❌ ${p.slug}: ${updError.message}`);
      failCount++;
    } else {
      const imgStatus = imageUrl ? '🖼️' : '⚠️no-img';
      const catStatus = resolvedCategoryId ? '📁' : '⚠️no-cat';
      console.log(`   ✅ ${p.slug} ${imgStatus} ${catStatus}`);
      successCount++;
    }
  }

  // ═══════════════════════════════════════════════════════
  // STEP 4: Update category images using first product image
  // ═══════════════════════════════════════════════════════
  console.log("\n🖼️ STEP 4: Setting category cover images...");
  
  for (const cat of DESIRED_CATEGORIES) {
    const catId = catMap[cat.slug];
    if (!catId) continue;
    
    const { data: firstProduct } = await supabase
      .from('products')
      .select('thumbnail_url')
      .eq('category_id', catId)
      .limit(1)
      .single();
    
    if (firstProduct?.thumbnail_url) {
      await supabase.from('categories').update({ image_url: firstProduct.thumbnail_url }).eq('id', catId);
      console.log(`   ✅ ${cat.name} cover image set`);
    }
  }

  console.log(`\n═══════════════════════════════════════`);
  console.log(`✅ ${successCount} products updated successfully`);
  console.log(`❌ ${failCount} products failed`);
  console.log(`═══════════════════════════════════════\n`);
}

migrate();
