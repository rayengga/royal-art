import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetData() {
  console.log('🧹 Starting database cleanup...')

  try {
    // Delete in correct order due to foreign key constraints
    
    // 1. Delete order items first
    const deletedOrderItems = await prisma.orderItem.deleteMany({})
    console.log(`🗑️  Deleted ${deletedOrderItems.count} order items`)

    // 2. Delete all orders
    const deletedOrders = await prisma.order.deleteMany({})
    console.log(`🗑️  Deleted ${deletedOrders.count} orders`)

    // 3. Delete product images
    const deletedImages = await prisma.image.deleteMany({})
    console.log(`🗑️  Deleted ${deletedImages.count} product images`)

    // 4. Delete all products
    const deletedProducts = await prisma.product.deleteMany({})
    console.log(`🗑️  Deleted ${deletedProducts.count} products`)

    // 5. Delete all client users (keep admin)
    const deletedClients = await prisma.user.deleteMany({
      where: {
        role: 'CLIENT'
      }
    })
    console.log(`🗑️  Deleted ${deletedClients.count} client users`)

    // Show remaining data
    const remainingUsers = await prisma.user.count()
    const remainingCategories = await prisma.category.count()
    
    console.log('\n✅ Database cleanup completed!')
    console.log(`📊 Remaining data:`)
    console.log(`   - Users: ${remainingUsers} (admin only)`)
    console.log(`   - Categories: ${remainingCategories}`)
    console.log(`   - Products: 0`)
    console.log(`   - Orders: 0`)
    console.log(`   - Clients: 0`)

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

resetData()
  .catch((e) => {
    console.error('❌ Reset failed:', e)
    process.exit(1)
  })