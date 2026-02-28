import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Clearing existing product/category/image data...')

  await prisma.orderItem.deleteMany()
  await prisma.image.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  console.log('📦 Creating categories...')

  // Map old MySQL category IDs → new Prisma IDs
  const cat1 = await prisma.category.create({
    data: {
      id: 'cat-1',
      name: 'Couffin',
      description: 'Handcrafted beach baskets / Couffins artisanaux',
    },
  })

  const cat2 = await prisma.category.create({
    data: {
      id: 'cat-2',
      name: 'Sac à droit',
      description: 'Round bags / Sacs ronds',
    },
  })

  const cat3 = await prisma.category.create({
    data: {
      id: 'cat-3',
      name: 'Pochette / Trousse',
      description: 'Pouches and small bags / Pochettes et petits sacs',
    },
  })

  const cat4 = await prisma.category.create({
    data: {
      id: 'cat-4',
      name: 'Pack / Série',
      description: 'Packs and sets / Packs et séries',
    },
  })

  console.log(`✅ Created 4 categories`)

  const catMap: Record<number, string> = {
    1: cat1.id,
    2: cat2.id,
    3: cat3.id,
    4: cat4.id,
  }

  console.log('🛍️  Creating products...')

  const productsData = [
    {
      id: 'prod-1',
      catId: 1,
      price: 45.0,
      stock: 0,
      name: 'Sac à main zebra',
      desc: 'Fait à la main entièrement en margoum tunisien, avec un design unique et une qualité exceptionnelle.',
    },
    {
      id: 'prod-2',
      catId: 1,
      price: 59.0,
      stock: 0,
      name: 'Sac à main Nejma',
      desc: 'Sac à main Nejma, fait à la main en cuir et en feuille de palmier, avec un design unique et une qualité exceptionnelle.',
    },
    {
      id: 'prod-3',
      catId: 3,
      price: 23.0,
      stock: 100,
      name: 'Pouchette juttin',
      desc: 'Pouchette juttin, fait à la main en cuir et en feuille de palmier, avec un design unique et une qualité exceptionnelle.',
    },
    {
      id: 'prod-4',
      catId: 1,
      price: 59.0,
      stock: 0,
      name: 'Sac à main Nejma - Rose',
      desc: 'Sac à main Nejma, fait à la main en cuir et en feuille de palmier, avec un design unique et une qualité exceptionnelle.',
    },
    {
      id: 'prod-6',
      catId: 2,
      price: 35.0,
      stock: 0,
      name: 'Rond margoum',
      desc: 'Fait à la main entièrement en margoum tunisien, avec un design unique et une qualité exceptionnelle.',
    },
    {
      id: 'prod-7',
      catId: 4,
      price: 66.0,
      stock: 0,
      name: 'Sac Martini + Pochette Martini',
      desc: 'Sac Martini, fabriqué à la main en tissu unique, avec un design traditionnel et des poignées en bois. Un sac alliant authenticité, savoir-faire artisanal et élégance.',
    },
    {
      id: 'prod-8',
      catId: 4,
      price: 66.0,
      stock: 0,
      name: 'Couffin vero + pochette vero',
      desc: 'Fait à la main entièrement en margoum tunisien, avec un design unique et une qualité exceptionnelle.',
    },
    {
      id: 'prod-9',
      catId: 2,
      price: 35.0,
      stock: 1000,
      name: 'Rond marron',
      desc: 'Sac à droit pour toujours. Dimension 25/25 cm.',
    },
    {
      id: 'prod-10',
      catId: 3,
      price: 23.0,
      stock: 100,
      name: 'Pouchette cassé',
      desc: 'Pouchette en blanc cassé beige 20 cm.',
    },
    {
      id: 'prod-14',
      catId: 4,
      price: 66.0,
      stock: 100,
      name: 'Couffin juttin + pochette juttin',
      desc: 'Couffin en jute et en bois naturelle coloré avec pochette. Dimension: 35/45 cm. Dimension pochette: 20 cm.',
    },
    {
      id: 'prod-15',
      catId: 4,
      price: 66.0,
      stock: 100,
      name: 'Couffin cassé + pochette cassé',
      desc: 'Couffin blanc cassé beige avec pochette. Dimension couffin: 35/45 cm. Dimension pochette: 20 cm.',
    },
    {
      id: 'prod-17',
      catId: 2,
      price: 40.0,
      stock: 100,
      name: 'SAC Bellini - Noir',
      desc: 'Sac en coudre halfa noire.',
    },
    {
      id: 'prod-18',
      catId: 2,
      price: 40.0,
      stock: 98,
      name: 'SAC Bellini - Orange',
      desc: 'Sac en coudre halfa orange.',
    },
    {
      id: 'prod-19',
      catId: 2,
      price: 40.0,
      stock: 100,
      name: 'SAC Bellini - Vert',
      desc: 'Sac en coudre halfa vert.',
    },
    {
      id: 'prod-20',
      catId: 2,
      price: 40.0,
      stock: 98,
      name: 'SAC Bellini - Blanc',
      desc: 'Sac en coudre halfa blanc.',
    },
    {
      id: 'prod-21',
      catId: 2,
      price: 40.0,
      stock: 99,
      name: 'SAC Bellini - Beige',
      desc: 'Sac en coudre beige en halfa naturelle.',
    },
    {
      id: 'prod-22',
      catId: 2,
      price: 40.0,
      stock: 31,
      name: 'SAC Bellini - Beige & Blanc',
      desc: 'Sac en coudre halfa naturelle, beige et blanc.',
    },
    {
      id: 'prod-24',
      catId: 2,
      price: 40.0,
      stock: 99,
      name: 'Sac Bellini - Bicolore',
      desc: 'Sac beige et blanc.',
    },
  ]

  for (const p of productsData) {
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        description: p.desc,
        price: p.price,
        stock: p.stock,
        isActive: true,
        categoryId: catMap[p.catId],
      },
    })
  }

  console.log(`✅ Created ${productsData.length} products`)

  console.log('🖼️  Creating images...')

  const imagesData = [
    // prod-7: Sac Martini
    { id: 'img-22', prodId: 'prod-7', url: '/images/products/sac-martini-porte-monaie.jpg', alt: 'Sac Martini + Pochette Martini' },

    // prod-8: Couffin vero
    { id: 'img-27', prodId: 'prod-8', url: '/images/products/sac-a-main-porte-monaie-margoum-vert.jpg', alt: 'Couffin vero + pochette vero' },

    // prod-14: Couffin juttin
    { id: 'img-53', prodId: 'prod-14', url: '/images/products/prod_14_6880cde899e43.jpeg', alt: 'Couffin juttin + pochette juttin' },
    { id: 'img-54', prodId: 'prod-14', url: '/images/products/prod_14_6880ce07e7d15.jpeg', alt: 'Couffin juttin + pochette juttin' },
    { id: 'img-55', prodId: 'prod-14', url: '/images/products/prod_14_6880ce2572232.jpeg', alt: 'Couffin juttin + pochette juttin' },
    { id: 'img-56', prodId: 'prod-14', url: '/images/products/prod_14_6880ce7883d0e.jpeg', alt: 'Couffin juttin + pochette juttin' },
    { id: 'img-57', prodId: 'prod-14', url: '/images/products/prod_14_6880cea224a10.jpeg', alt: 'Couffin juttin + pochette juttin' },
    { id: 'img-58', prodId: 'prod-14', url: '/images/products/prod_14_6880ceceb6b7e.jpeg', alt: 'Couffin juttin + pochette juttin' },

    // prod-15: Couffin cassé
    { id: 'img-59', prodId: 'prod-15', url: '/images/products/prod_15_688394856f676.jpeg', alt: 'Couffin cassé + pochette cassé' },
    { id: 'img-90', prodId: 'prod-15', url: '/images/products/prod_15_68857d23aac3e.jpeg', alt: 'Couffin cassé + pochette cassé' },
    { id: 'img-91', prodId: 'prod-15', url: '/images/products/prod_15_68857d46a44bb.jpeg', alt: 'Couffin cassé + pochette cassé' },

    // prod-17: Bellini noir
    { id: 'img-66', prodId: 'prod-17', url: '/images/products/prod_17_688396379b529.jpeg', alt: 'SAC Bellini - Noir' },
    { id: 'img-67', prodId: 'prod-17', url: '/images/products/prod_17_6883964a164eb.jpeg', alt: 'SAC Bellini - Noir' },
    { id: 'img-68', prodId: 'prod-17', url: '/images/products/prod_17_6883965b88c74.jpeg', alt: 'SAC Bellini - Noir' },

    // prod-18: Bellini orange
    { id: 'img-69', prodId: 'prod-18', url: '/images/products/prod_18_688399b868b11.jpeg', alt: 'SAC Bellini - Orange' },
    { id: 'img-70', prodId: 'prod-18', url: '/images/products/prod_18_688399cc25afa.jpeg', alt: 'SAC Bellini - Orange' },
    { id: 'img-71', prodId: 'prod-18', url: '/images/products/prod_18_688399e4387a2.jpeg', alt: 'SAC Bellini - Orange' },

    // prod-19: Bellini vert
    { id: 'img-72', prodId: 'prod-19', url: '/images/products/prod_19_68839a3c324f0.jpeg', alt: 'SAC Bellini - Vert' },
    { id: 'img-73', prodId: 'prod-19', url: '/images/products/prod_19_68839a5aed405.jpeg', alt: 'SAC Bellini - Vert' },
    { id: 'img-74', prodId: 'prod-19', url: '/images/products/prod_19_68839a7c6af69.jpeg', alt: 'SAC Bellini - Vert' },

    // prod-20: Bellini blanc
    { id: 'img-75', prodId: 'prod-20', url: '/images/products/prod_20_68839ace532c4.jpeg', alt: 'SAC Bellini - Blanc' },
    { id: 'img-76', prodId: 'prod-20', url: '/images/products/prod_20_68839ae235d8b.jpeg', alt: 'SAC Bellini - Blanc' },
    { id: 'img-77', prodId: 'prod-20', url: '/images/products/prod_20_68839af91b024.jpeg', alt: 'SAC Bellini - Blanc' },

    // prod-21: Bellini beige
    { id: 'img-78', prodId: 'prod-21', url: '/images/products/prod_21_6883b81ba5289.jpeg', alt: 'SAC Bellini - Beige' },
    { id: 'img-79', prodId: 'prod-21', url: '/images/products/prod_21_6883b88034d62.jpeg', alt: 'SAC Bellini - Beige' },
    { id: 'img-80', prodId: 'prod-21', url: '/images/products/prod_21_6883b8d2bb732.jpeg', alt: 'SAC Bellini - Beige' },

    // prod-22: Bellini beige & blanc
    { id: 'img-81', prodId: 'prod-22', url: '/images/products/prod_22_6883bb0ada239.jpeg', alt: 'SAC Bellini - Beige & Blanc' },
    { id: 'img-82', prodId: 'prod-22', url: '/images/products/prod_22_6883bb3e113f5.jpeg', alt: 'SAC Bellini - Beige & Blanc' },
    { id: 'img-83', prodId: 'prod-22', url: '/images/products/prod_22_6883bbe614075.jpeg', alt: 'SAC Bellini - Beige & Blanc' },

    // prod-24: Bellini bicolore
    { id: 'img-87', prodId: 'prod-24', url: '/images/products/prod_24_6883c1f42b8e4.jpeg', alt: 'Sac Bellini - Bicolore' },
    { id: 'img-89', prodId: 'prod-24', url: '/images/products/prod_24_6884e8338f06c.jpeg', alt: 'Sac Bellini - Bicolore' },

    // prod-10: Pouchette cassé
    { id: 'img-92', prodId: 'prod-10', url: '/images/products/prod_10_688584aa9b6e6.jpeg', alt: 'Pouchette cassé' },

    // prod-3: Pouchette juttin
    { id: 'img-93', prodId: 'prod-3', url: '/images/products/prod_3_688585a972a26.jpeg', alt: 'Pouchette juttin' },

    // prod-9: Rond marron
    { id: 'img-94', prodId: 'prod-9', url: '/images/products/prod_9_688586772ef39.jpeg', alt: 'Rond marron' },

    // prod-6: Rond margoum
    { id: 'img-96', prodId: 'prod-6', url: '/images/products/prod_6_688919cb471c4.jpg', alt: 'Rond margoum' },

    // prod-4: Sac Nejma Rose
    { id: 'img-97', prodId: 'prod-4', url: '/images/products/prod_4_68891a00e18a0.jpg', alt: 'Sac à main Nejma - Rose' },

    // prod-1: Sac zebra
    { id: 'img-98', prodId: 'prod-1', url: '/images/products/prod_1_68891a2b161e1.jpg', alt: 'Sac à main zebra' },

    // prod-2: Sac Nejma
    { id: 'img-101', prodId: 'prod-2', url: '/images/products/prod_2_688b5f06453d1.jpg', alt: 'Sac à main Nejma' },
  ]

  for (const img of imagesData) {
    await prisma.image.create({
      data: {
        id: img.id,
        url: img.url,
        alt: img.alt,
        productId: img.prodId,
      },
    })
  }

  console.log(`✅ Created ${imagesData.length} images`)
  console.log('🎉 Import complete! All real product data is now in the database.')
}

main()
  .catch((e) => {
    console.error('❌ Import failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
