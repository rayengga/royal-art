import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding with old data...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.image.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@royalartisanat.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Royal Artisanat',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create categories from old data
  const categoriesData = [
    {
      name: 'Couffin',
      description: 'Paniers artisanaux faits main - Beach Baskets',
    },
    {
      name: 'Sac à Main',
      description: 'Sacs à main ronds artisanaux - Round Handbags',
    },
    {
      name: 'Pochette',
      description: 'Pochettes et trousses artisanales - Pouches',
    },
    {
      name: 'Pack',
      description: 'Ensembles et packs de sacs - Sets & Packs',
    },
  ];

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.create({
        data: cat,
      })
    )
  );

  console.log(`✅ ${categories.length} categories created`);

  // Map old category IDs to new category IDs
  const categoryMap: Record<number, string> = {
    1: categories[0].id, // Couffin
    2: categories[1].id, // Sac à Main
    3: categories[2].id, // Pochette
    4: categories[3].id, // Pack
  };

  // Create products from old data
  const productsData = [
    // Category 1 - Couffin
    {
      name: 'Sac à main zebra',
      description: 'Fait à la main entièrement en margoum tunisien, avec un design unique et une qualité exceptionnelle.',
      price: 45.0,
      stock: 10,
      categoryId: categoryMap[1],
      images: [
        { url: '/images/products/prod_1_68891a2b161e1.jpg', alt: 'Sac à main zebra' },
      ],
    },
    {
      name: 'Sac à main Nejma',
      description: 'Sac à main Nejma, fait à la main en cuir et en feuille de palmier, avec un design unique et une qualité exceptionnelle.',
      price: 59.0,
      stock: 8,
      categoryId: categoryMap[1],
      images: [
        { url: '/images/products/prod_2_688b5f06453d1.jpg', alt: 'Sac à main Nejma' },
      ],
    },
    {
      name: 'Sac à main Nejma (variante)',
      description: 'Sac à main Nejma, fait à la main en cuir et en feuille de palmier, avec un design unique et une qualité exceptionnelle.',
      price: 59.0,
      stock: 8,
      categoryId: categoryMap[1],
      images: [
        { url: '/images/products/prod_4_68891a00e18a0.jpg', alt: 'Sac à main Nejma' },
      ],
    },
    
    // Category 2 - Sac à Main
    {
      name: 'Rond margoum',
      description: 'Fait à la main entièrement en margoum tunisien, avec un design unique et une qualité exceptionnelle',
      price: 35.0,
      stock: 12,
      categoryId: categoryMap[2],
      images: [
        { url: '/images/products/prod_6_688919cb471c4.jpg', alt: 'Rond margoum' },
      ],
    },
    {
      name: 'Rond marron',
      description: 'Sac à main rond pour toujours. Dimensions 25×25 cm.',
      price: 35.0,
      stock: 15,
      categoryId: categoryMap[2],
      images: [
        { url: '/images/products/prod_9_688586772ef39.jpeg', alt: 'Rond marron' },
      ],
    },
    {
      name: 'SAC Bellini Noir',
      description: 'Sac en tissage halfa noir',
      price: 40.0,
      stock: 10,
      categoryId: categoryMap[2],
      images: [
        { url: '/images/products/prod_17_6883964a164eb.jpeg', alt: 'SAC Bellini Noir' },
        { url: '/images/products/prod_17_6883965b88c74.jpeg', alt: 'SAC Bellini Noir - Vue 2' },
      ],
    },
    {
      name: 'SAC Bellini Orange',
      description: 'Sac en tissage halfa orange',
      price: 40.0,
      stock: 10,
      categoryId: categoryMap[2],
      images: [
        { url: '/images/products/prod_18_688399e4387a2.jpeg', alt: 'SAC Bellini Orange' },
        { url: '/images/products/prod_18_688399cc25afa.jpeg', alt: 'SAC Bellini Orange - Vue 2' },
      ],
    },
    {
      name: 'SAC Bellini Vert',
      description: 'Sac en tissage halfa vert',
      price: 40.0,
      stock: 10,
      categoryId: categoryMap[2],
      images: [
        { url: '/images/products/prod_19_68839a5aed405.jpeg', alt: 'SAC Bellini Vert' },
        { url: '/images/products/prod_19_68839a7c6af69.jpeg', alt: 'SAC Bellini Vert - Vue 2' },
      ],
    },
    {
      name: 'SAC Bellini Blanc',
      description: 'Sac en tissage halfa blanc',
      price: 40.0,
      stock: 10,
      categoryId: categoryMap[2],
      images: [
        { url: '/images/products/prod_20_68839ae235d8b.jpeg', alt: 'SAC Bellini Blanc' },
        { url: '/images/products/prod_20_68839af91b024.jpeg', alt: 'SAC Bellini Blanc - Vue 2' },
      ],
    },
    {
      name: 'SAC Bellini Beige',
      description: 'Sac beige en tissage halfa naturelle',
      price: 40.0,
      stock: 10,
      categoryId: categoryMap[2],
      images: [
        { url: '/images/products/prod_21_6883b8d2bb732.jpeg', alt: 'SAC Bellini Beige' },
        { url: '/images/products/prod_21_6883b81ba5289.jpeg', alt: 'SAC Bellini Beige - Vue 2' },
      ],
    },
    {
      name: 'SAC Bellini Bicolore',
      description: 'Sac en tissage halfa naturelle, beige et blanc',
      price: 40.0,
      stock: 15,
      categoryId: categoryMap[2],
      images: [
        { url: '/images/products/prod_22_6883bbe614075.jpeg', alt: 'SAC Bellini Bicolore' },
        { url: '/images/products/prod_22_6883bb3e113f5.jpeg', alt: 'SAC Bellini Bicolore - Vue 2' },
      ],
    },
    {
      name: 'Sac Bellini Beige et Blanc',
      description: 'Sac beige et blanc en tissage halfa',
      price: 40.0,
      stock: 12,
      categoryId: categoryMap[2],
      images: [
        { url: '/images/products/prod_24_6883c1f42b8e4.jpeg', alt: 'Sac Bellini Beige et Blanc' },
        { url: '/images/products/prod_24_6884e8338f06c.jpeg', alt: 'Sac Bellini Beige et Blanc - Vue 2' },
      ],
    },

    // Category 3 - Pochette
    {
      name: 'Pouchette juttin',
      description: 'Pouchette juttin, fait à la main en cuir et en feuille de palmier, avec un design unique et une qualité exceptionnelle.',
      price: 23.0,
      stock: 20,
      categoryId: categoryMap[3],
      images: [
        { url: '/images/products/prod_3_688585a972a26.jpeg', alt: 'Pouchette juttin' },
      ],
    },
    {
      name: 'Pouchette cassé',
      description: 'Pouchette en blanc cassé beige, 20 cm',
      price: 23.0,
      stock: 20,
      categoryId: categoryMap[3],
      images: [
        { url: '/images/products/prod_10_688584aa9b6e6.jpeg', alt: 'Pouchette cassé' },
      ],
    },

    // Category 4 - Pack
    {
      name: 'Sac Martini + Pochette Martini',
      description: 'Sac Martini, fabriqué à la main en tissu unique, avec un design traditionnel et des poignées en bois. Un sac alliant authenticité, savoir-faire artisanal et élégance.',
      price: 66.0,
      stock: 5,
      categoryId: categoryMap[4],
      images: [
        { url: '/images/products/sac-martini-porte-monaie.jpg', alt: 'Sac Martini + Pochette Martini' },
      ],
    },
    {
      name: 'Couffin vero + pochette vero',
      description: 'Fait à la main entièrement en margoum tunisien, avec un design unique et une qualité exceptionnelle.',
      price: 66.0,
      stock: 5,
      categoryId: categoryMap[4],
      images: [
        { url: '/images/products/sac-a-main-porte-monaie-margoum-vert.jpg', alt: 'Couffin vero + pochette vero' },
      ],
    },
    {
      name: 'Couffin juttin + pochette juttin',
      description: 'Couffin en jute et en bois naturel coloré avec pochette. Taille: 35×45 cm. Taille pochette: 20 cm.',
      price: 66.0,
      stock: 8,
      categoryId: categoryMap[4],
      images: [
        { url: '/images/products/prod_14_6880ce7883d0e.jpeg', alt: 'Couffin juttin + pochette juttin' },
        { url: '/images/products/prod_14_6880cea224a10.jpeg', alt: 'Couffin juttin + pochette juttin - Vue 2' },
        { url: '/images/products/prod_14_6880ceceb6b7e.jpeg', alt: 'Couffin juttin + pochette juttin - Vue 3' },
      ],
    },
    {
      name: 'Couffin cassé + pochette cassé',
      description: 'Couffin blanc cassé beige avec pochette. Taille couffin: 35×45 cm. Taille pochette: 20 cm.',
      price: 66.0,
      stock: 8,
      categoryId: categoryMap[4],
      images: [
        { url: '/images/products/prod_15_688394856f676.jpeg', alt: 'Couffin cassé + pochette cassé' },
        { url: '/images/products/prod_15_68857d23aac3e.jpeg', alt: 'Couffin cassé + pochette cassé - Vue 2' },
        { url: '/images/products/prod_15_68857d46a44bb.jpeg', alt: 'Couffin cassé + pochette cassé - Vue 3' },
      ],
    },
  ];

  const products = [];
  for (const productData of productsData) {
    const { images, ...productInfo } = productData;
    const product = await prisma.product.create({
      data: {
        ...productInfo,
        images: {
          create: images,
        },
      },
      include: {
        images: true,
      },
    });
    products.push(product);
    console.log(`  - Created: ${product.name}`);
  }

  console.log(`✅ ${products.length} products created with images`);
  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`  - Users: 1 admin`);
  console.log(`  - Categories: ${categories.length}`);
  console.log(`  - Products: ${products.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
