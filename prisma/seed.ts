import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@decory.com' },
    update: {},
    create: {
      email: 'admin@decory.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    }
  })

  // Create test client user
  const clientPassword = await bcrypt.hash('client123', 12)
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      password: clientPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'CLIENT'
    }
  })

  // Create categories
  const leatherCategory = await prisma.category.upsert({
    where: { name: 'Leather Products' },
    update: {},
    create: {
      name: 'Leather Products',
      description: 'Premium engraved leather items including wallets, belts, and accessories'
    }
  })

  const woodCategory = await prisma.category.upsert({
    where: { name: 'Wood Products' },
    update: {},
    create: {
      name: 'Wood Products',
      description: 'Handcrafted laser-engraved wooden items and decorative pieces'
    }
  })

  const accessoriesCategory = await prisma.category.upsert({
    where: { name: 'Accessories' },
    update: {},
    create: {
      name: 'Accessories',
      description: 'Custom engraved accessories and personalized gifts'
    }
  })

  // Create products
  const products = [
    {
      name: 'Premium Leather Wallet',
      description: 'Handcrafted genuine leather wallet with custom laser engraving. Perfect for personal use or as a gift.',
      price: 59.99,
      stock: 25,
      categoryId: leatherCategory.id,
      images: [
        {
          url: 'https://picsum.photos/400/400?random=1',
          alt: 'Premium Leather Wallet - Front View'
        },
        {
          url: 'https://picsum.photos/400/400?random=2',
          alt: 'Premium Leather Wallet - Engraved Detail'
        }
      ]
    },
    {
      name: 'Custom Wooden Cutting Board',
      description: 'Beautiful bamboo cutting board with personalized laser engraving. Food-safe finish included.',
      price: 45.99,
      stock: 15,
      categoryId: woodCategory.id,
      images: [
        {
          url: 'https://picsum.photos/400/400?random=3',
          alt: 'Custom Wooden Cutting Board'
        }
      ]
    },
    {
      name: 'Engraved Leather Belt',
      description: 'High-quality genuine leather belt with custom name or message engraving.',
      price: 79.99,
      stock: 20,
      categoryId: leatherCategory.id,
      images: [
        {
          url: 'https://picsum.photos/400/400?random=4',
          alt: 'Engraved Leather Belt'
        }
      ]
    },
    {
      name: 'Wooden Phone Stand',
      description: 'Elegant wooden phone stand with optional custom engraving. Compatible with all phone sizes.',
      price: 24.99,
      stock: 30,
      categoryId: woodCategory.id,
      images: [
        {
          url: 'https://picsum.photos/400/400?random=5',
          alt: 'Wooden Phone Stand'
        }
      ]
    },
    {
      name: 'Personalized Keychain',
      description: 'Custom laser-engraved keychain available in leather or wood. Perfect for gifts.',
      price: 12.99,
      stock: 50,
      categoryId: accessoriesCategory.id,
      images: [
        {
          url: 'https://picsum.photos/400/400?random=6',
          alt: 'Personalized Keychain'
        }
      ]
    },
    {
      name: 'Wooden Desk Organizer',
      description: 'Multi-compartment desk organizer with custom engraving options. Great for office or home.',
      price: 89.99,
      stock: 12,
      categoryId: woodCategory.id,
      images: [
        {
          url: 'https://picsum.photos/400/400?random=7',
          alt: 'Wooden Desk Organizer'
        }
      ]
    }
  ]

  // Create products with images (skip if same name already exists)
  for (const productData of products) {
    const { images, ...productInfo } = productData

    const exists = await prisma.product.findFirst({
      where: { name: productData.name }
    })

    if (!exists) {
      await prisma.product.create({
        data: {
          ...productInfo,
          images: {
            create: images
          }
        }
      })
    }
  }

  // Create a sample order — id is required by schema (no @default)
  const orderId = String(Math.floor(100000 + Math.random() * 900000));
  const sampleOrder = await prisma.order.create({
    data: {
      id: orderId,
      userId: client.id,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      totalAmount: 104.98,
      shippingAddress: '123 Main St, Anytown, AN 12345',
      billingAddress: '123 Main St, Anytown, AN 12345',
      paymentMethod: 'Credit Card',
      orderItems: {
        create: [
          {
            productId: (await prisma.product.findFirst({ where: { name: 'Premium Leather Wallet' } }))?.id!,
            quantity: 1,
            price: 59.99
          },
          {
            productId: (await prisma.product.findFirst({ where: { name: 'Custom Wooden Cutting Board' } }))?.id!,
            quantity: 1,
            price: 45.99
          }
        ]
      }
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Admin user: admin@decory.com / admin123`)
  console.log(`👤 Client user: client@example.com / client123`)
  console.log(`📦 Created ${products.length} products`)
  console.log(`📂 Created 3 categories`)
  console.log(`🛒 Created 1 sample order`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })