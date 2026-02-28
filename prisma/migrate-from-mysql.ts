/**
 * Migration script: imports Royal Artisanat data from old MySQL export → Neon PostgreSQL
 * Run with: npx ts-node --project tsconfig.json -e "require('./prisma/migrate-from-mysql.ts')"
 * Or: npx tsx prisma/migrate-from-mysql.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Raw data from old-data.sql (MySQL) ──────────────────────────────────────

const OLD_CATEGORIES = [
  { id: 1, img: 'images/products/prod_1_68891a2b161e1.jpg',  fr: 'Couffin',          en: 'Beach Basket' },
  { id: 2, img: 'images/products/prod_24_6883c1f42b8e4.jpeg', fr: 'Sac à droit',      en: 'Round bag' },
  { id: 3, img: 'images/products/prod_10_688584aa9b6e6.jpeg', fr: 'Pochette / Trousse', en: 'Pouch' },
  { id: 4, img: 'images/products/sac-a-main-porte-monaie-margoum-vert.jpg', fr: 'Pack / Série', en: 'Pack / Set' },
];

const OLD_PRODUCTS = [
  { id: 1,  catId: 1, price: 45,  stock: 0,   nameFr: 'Sac à main zebra',                    nameEn: 'Zebra Handbag',                       descFr: 'Fait à la main entièrement en margoum tunisien, avec un design unique et une qualité exceptionnelle.',                                                                                                                   descEn: 'Entirely handmade in Tunisian margoum, featuring a unique design and exceptional quality.' },
  { id: 2,  catId: 1, price: 59,  stock: 0,   nameFr: 'Sac à main Nejma',                    nameEn: 'Nejma Handbag',                       descFr: 'Sac à main Nejma, fait à la main en cuir et en feuille de palmier, avec un design unique et une qualité exceptionnelle.',                                                                                                 descEn: 'Nejma handbag, handcrafted from leather and palm leaf, featuring a unique design and exceptional quality.' },
  { id: 3,  catId: 3, price: 23,  stock: 100, nameFr: 'Pouchette juttin',                    nameEn: 'Juttin Pouch',                        descFr: 'Pouchette juttin, fait à la main en cuir et en feuille de palmier, avec un design unique et une qualité exceptionnelle.',                                                                                               descEn: 'Juttin pouch, handcrafted from leather and palm leaf, featuring a unique design and exceptional quality.' },
  { id: 4,  catId: 1, price: 59,  stock: 0,   nameFr: 'Sac à main Nejma',                    nameEn: 'Nejma Handbag',                       descFr: 'Sac à main Nejma, fait à la main en cuir et en feuille de palmier, avec un design unique et une qualité exceptionnelle.',                                                                                               descEn: 'Nejma handbag, handcrafted from leather and palm leaf, featuring a unique design and exceptional quality.' },
  { id: 6,  catId: 2, price: 35,  stock: 0,   nameFr: 'Rond margoum',                        nameEn: 'Margoum Round Bag',                   descFr: 'Fait à la main entièrement en margoum tunisien, avec un design unique et une qualité exceptionnelle.',                                                                                                                   descEn: 'Entirely handmade in Tunisian margoum, featuring a unique design and exceptional quality.' },
  { id: 7,  catId: 4, price: 66,  stock: 0,   nameFr: 'Sac Martini + Pochette Martini',      nameEn: 'Martini Bag + Martini Pouch',         descFr: 'Sac Martini, fabriqué à la main en tissu unique, avec un design traditionnel et des poignées en bois. Un sac alliant authenticité, savoir-faire artisanal et élégance.',                                           descEn: 'Martini bag, handmade from unique fabric, featuring a traditional design and wooden handles. A bag that combines authenticity, craftsmanship, and elegance.' },
  { id: 8,  catId: 4, price: 66,  stock: 0,   nameFr: 'Couffin vero + pochette vero',        nameEn: 'Vero Basket + Vero Pouch',            descFr: 'Fait à la main entièrement en margoum tunisien, avec un design unique et une qualité exceptionnelle.',                                                                                                                   descEn: 'Entirely handmade in Tunisian margoum, featuring a unique design and exceptional quality.' },
  { id: 9,  catId: 2, price: 35,  stock: 1000, nameFr: 'Rond marron',                        nameEn: 'Brown Round Bag',                     descFr: 'Sac a droit pour toujours. Dimensions 25/25cm.',                                                                                                                                                                              descEn: 'Forever stylish round bag. Dimensions 25×25 cm.' },
  { id: 10, catId: 3, price: 23,  stock: 100, nameFr: 'Pouchette cassé',                     nameEn: 'Cracked White Pouch',                 descFr: 'Pouchette en blanc cassé beige 20 cm.',                                                                                                                                                                                      descEn: 'Beige cracked white pouch, 20 cm.' },
  { id: 14, catId: 4, price: 66,  stock: 100, nameFr: 'Couffin juttin + pochette juttin',    nameEn: 'Juttin Basket + Juttin Pouch',        descFr: 'Couffin en jute et en bois naturelle avec pochette. Dimensions: 35/45 cm. Dimensions pochette: 20 cm.',                                                                                                                 descEn: 'Basket made of jute and natural wood with matching pouch. Size: 35×45 cm. Pouch size: 20 cm.' },
  { id: 15, catId: 4, price: 66,  stock: 100, nameFr: 'Couffin cassé + pochette cassé',      nameEn: 'Cracked White Basket + Pouch',        descFr: 'Couffin blanc cassé beige avec pochette. Dimensions couffin: 35/45 cm. Dimensions pochette: 20 cm.',                                                                                                                       descEn: 'Off-white beige basket with pouch. Basket size: 35×45 cm. Pouch size: 20 cm.' },
  { id: 17, catId: 2, price: 40,  stock: 100, nameFr: 'SAC Bellini',                         nameEn: 'Bellini Bag (Black)',                 descFr: 'Sac en coudre halfa noire.',                                                                                                                                                                                                 descEn: 'Bag made of black halfa weaving.' },
  { id: 18, catId: 2, price: 40,  stock: 98,  nameFr: 'SAC Bellini',                         nameEn: 'Bellini Bag (Orange)',                descFr: 'Sac en coudre halfa orange.',                                                                                                                                                                                                descEn: 'Bag made of orange halfa weaving.' },
  { id: 19, catId: 2, price: 40,  stock: 100, nameFr: 'SAC Bellini',                         nameEn: 'Bellini Bag (Green)',                 descFr: 'Sac en coudre halfa vert.',                                                                                                                                                                                                  descEn: 'Bag made of green halfa weaving.' },
  { id: 20, catId: 2, price: 40,  stock: 98,  nameFr: 'SAC Bellini',                         nameEn: 'Bellini Bag (White)',                 descFr: 'Sac en coudre halfa blanc.',                                                                                                                                                                                                 descEn: 'Bag made of white halfa weaving.' },
  { id: 21, catId: 2, price: 40,  stock: 99,  nameFr: 'SAC Bellini',                         nameEn: 'Bellini Bag (Beige Natural)',         descFr: 'Sac en coudre beige en halfa naturelle.',                                                                                                                                                                                    descEn: 'Beige bag made of natural halfa weaving.' },
  { id: 22, catId: 2, price: 40,  stock: 31,  nameFr: 'SAC Bellini',                         nameEn: 'Bellini Bag (Beige & White)',         descFr: 'Sac en coudre halfa naturelle, beige et blanc.',                                                                                                                                                                             descEn: 'Bag made of natural halfa weaving, beige and white.' },
  { id: 24, catId: 2, price: 40,  stock: 99,  nameFr: 'Sac Bellini',                         nameEn: 'Bellini Bag',                         descFr: 'Sac beige et blanc.',                                                                                                                                                                                                        descEn: 'Beige and white bag.' },
];

// Images from images_produits (produit_id → url_image)
const OLD_IMAGES: { prodId: number; url: string }[] = [
  { prodId: 7,  url: 'images/products/sac-martini-porte-monaie.jpg' },
  { prodId: 8,  url: 'images/products/sac-a-main-porte-monaie-margoum-vert.jpg' },
  { prodId: 14, url: 'images/products/prod_14_6880cde899e43.jpeg' },
  { prodId: 14, url: 'images/products/prod_14_6880ce07e7d15.jpeg' },
  { prodId: 14, url: 'images/products/prod_14_6880ce2572232.jpeg' },
  { prodId: 14, url: 'images/products/prod_14_6880ce7883d0e.jpeg' },
  { prodId: 14, url: 'images/products/prod_14_6880cea224a10.jpeg' },
  { prodId: 14, url: 'images/products/prod_14_6880ceceb6b7e.jpeg' },
  { prodId: 15, url: 'images/products/prod_15_688394856f676.jpeg' },
  { prodId: 15, url: 'images/products/prod_15_68857d23aac3e.jpeg' },
  { prodId: 15, url: 'images/products/prod_15_68857d46a44bb.jpeg' },
  { prodId: 17, url: 'images/products/prod_17_688396379b529.jpeg' },
  { prodId: 17, url: 'images/products/prod_17_6883964a164eb.jpeg' },
  { prodId: 17, url: 'images/products/prod_17_6883965b88c74.jpeg' },
  { prodId: 18, url: 'images/products/prod_18_688399b868b11.jpeg' },
  { prodId: 18, url: 'images/products/prod_18_688399cc25afa.jpeg' },
  { prodId: 18, url: 'images/products/prod_18_688399e4387a2.jpeg' },
  { prodId: 19, url: 'images/products/prod_19_68839a3c324f0.jpeg' },
  { prodId: 19, url: 'images/products/prod_19_68839a5aed405.jpeg' },
  { prodId: 19, url: 'images/products/prod_19_68839a7c6af69.jpeg' },
  { prodId: 20, url: 'images/products/prod_20_68839ace532c4.jpeg' },
  { prodId: 20, url: 'images/products/prod_20_68839ae235d8b.jpeg' },
  { prodId: 20, url: 'images/products/prod_20_68839af91b024.jpeg' },
  { prodId: 21, url: 'images/products/prod_21_6883b81ba5289.jpeg' },
  { prodId: 21, url: 'images/products/prod_21_6883b88034d62.jpeg' },
  { prodId: 21, url: 'images/products/prod_21_6883b8d2bb732.jpeg' },
  { prodId: 22, url: 'images/products/prod_22_6883bb0ada239.jpeg' },
  { prodId: 22, url: 'images/products/prod_22_6883bb3e113f5.jpeg' },
  { prodId: 22, url: 'images/products/prod_22_6883bbe614075.jpeg' },
  { prodId: 24, url: 'images/products/prod_24_6883c1f42b8e4.jpeg' },
  { prodId: 24, url: 'images/products/prod_24_6884e8338f06c.jpeg' },
  { prodId: 10, url: 'images/products/prod_10_688584aa9b6e6.jpeg' },
  { prodId: 3,  url: 'images/products/prod_3_688585a972a26.jpeg' },
  { prodId: 9,  url: 'images/products/prod_9_688586772ef39.jpeg' },
  { prodId: 6,  url: 'images/products/prod_6_688919cb471c4.jpg' },
  { prodId: 4,  url: 'images/products/prod_4_68891a00e18a0.jpg' },
  { prodId: 1,  url: 'images/products/prod_1_68891a2b161e1.jpg' },
  { prodId: 2,  url: 'images/products/prod_2_688b5f06453d1.jpg' },
];

// ─── Migration ────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting migration from MySQL → PostgreSQL (Neon)...\n');

  // 1. Clear existing data (in dependency order)
  console.log('🗑️  Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.image.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('   ✓ Cleared\n');

  // 2. Insert categories
  console.log('📂 Inserting categories...');
  // Map old int id → new cuid (we'll store in a map for product linking)
  const catIdMap = new Map<number, string>();

  for (const cat of OLD_CATEGORIES) {
    const created = await prisma.category.create({
      data: {
        name: cat.en.trim(),
        description: cat.fr.trim(),
      },
    });
    catIdMap.set(cat.id, created.id);
    console.log(`   ✓ [${cat.id}] ${cat.en.trim()} → ${created.id}`);
  }

  // 3. Insert products
  console.log('\n🛍️  Inserting products...');
  const prodIdMap = new Map<number, string>();

  for (const prod of OLD_PRODUCTS) {
    const catId = catIdMap.get(prod.catId);
    if (!catId) {
      console.warn(`   ⚠️  Skipping product ${prod.id} — unknown category ${prod.catId}`);
      continue;
    }
    const created = await prisma.product.create({
      data: {
        name: prod.nameEn.trim(),
        description: prod.descEn.trim(),
        price: prod.price,
        stock: prod.stock,
        isActive: true,
        categoryId: catId,
      },
    });
    prodIdMap.set(prod.id, created.id);
    console.log(`   ✓ [${prod.id}] ${prod.nameEn.trim()} @ ${prod.price} TND → ${created.id}`);
  }

  // 4. Insert images
  console.log('\n🖼️  Inserting images...');
  // Group by product so we can set a sensible alt
  const prodNames = new Map(OLD_PRODUCTS.map(p => [p.id, p.nameEn.trim()]));

  for (const img of OLD_IMAGES) {
    const productId = prodIdMap.get(img.prodId);
    if (!productId) continue; // product was skipped

    const url = img.url.startsWith('/') ? img.url : '/' + img.url;
    await prisma.image.create({
      data: {
        url,
        alt: prodNames.get(img.prodId) ?? 'Product image',
        productId,
      },
    });
  }
  console.log(`   ✓ ${OLD_IMAGES.length} images inserted`);

  // 5. Summary
  const [catCount, prodCount, imgCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.image.count(),
  ]);

  console.log('\n✅ Migration complete!');
  console.log(`   📂 Categories : ${catCount}`);
  console.log(`   🛍️  Products   : ${prodCount}`);
  console.log(`   🖼️  Images     : ${imgCount}`);
}

main()
  .catch(e => { console.error('❌ Migration failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
