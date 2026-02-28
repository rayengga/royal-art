import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-utils'

export const GET = requireAdmin(async (request: NextRequest, { user }: any) => {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'month';
    
    // Calculate date range
    let startDate = new Date();
    if (range === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (range === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (range === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Get counts
    const [
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      recentOrders,
      lowStockProducts,
      topProducts,
      ordersByStatus,
      topCategories,
      recentActivity
    ] = await Promise.all([
      // Total users (excluding admin)
      prisma.user.count({
        where: { role: 'CLIENT' }
      }),

      // Total active products
      prisma.product.count({
        where: { isActive: true }
      }),

      // Total categories
      prisma.category.count(),

      // Total orders
      prisma.order.count(),

      // Pending orders
      prisma.order.count({
        where: { status: 'PENDING' }
      }),

      // Recent orders (last 7 days)
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Low stock products (stock <= 5)
      prisma.product.findMany({
        where: {
          stock: { lte: 5 },
          isActive: true
        },
        include: {
          category: true
        },
        orderBy: { stock: 'asc' },
        take: 10
      }),

      // Top selling products (by order items count)
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          category: true,
          _count: {
            select: { orderItems: true }
          }
        },
        orderBy: {
          orderItems: {
            _count: 'desc'
          }
        },
        take: 5
      }),

      // Orders by status
      prisma.order.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      }),

      // Top categories by revenue
      prisma.category.findMany({
        include: {
          _count: {
            select: { products: true }
          },
          products: {
            include: {
              orderItems: {
                select: {
                  price: true,
                  quantity: true
                }
              }
            }
          }
        },
        take: 5
      }),

      // Recent activity (orders, users, products)
      Promise.all([
        prisma.order.findMany({
          where: {
            createdAt: { gte: startDate }
          },
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }),
        prisma.user.findMany({
          where: {
            createdAt: { gte: startDate },
            role: 'CLIENT'
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        }),
        prisma.product.findMany({
          where: {
            createdAt: { gte: startDate }
          },
          orderBy: { createdAt: 'desc' },
          take: 2
        })
      ])
    ])

    // Calculate revenue (count delivered orders as revenue for cash on delivery)
    const revenueResult = await prisma.order.aggregate({
      where: {
        OR: [
          { paymentStatus: 'PAID' },
          { status: 'DELIVERED', paymentMethod: 'CASH_ON_DELIVERY' }
        ]
      },
      _sum: {
        totalAmount: true
      }
    })

    // Revenue for current month
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const monthlyRevenueResult = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: currentMonth
        },
        OR: [
          { paymentStatus: 'PAID' },
          { status: 'DELIVERED', paymentMethod: 'CASH_ON_DELIVERY' }
        ]
      },
      _sum: {
        totalAmount: true
      }
    })

    // Process recent activity
    const [recentOrdersActivity, recentUsersActivity, recentProductsActivity] = recentActivity;
    const combinedActivity = [
      ...recentOrdersActivity.map((order: any) => ({
        id: order.id,
        type: 'order' as const,
        description: `New order from ${order.user.firstName} ${order.user.lastName}`,
        timestamp: order.createdAt,
        amount: order.totalAmount
      })),
      ...recentUsersActivity.map((user: any) => ({
        id: user.id,
        type: 'user' as const,
        description: `New customer ${user.firstName} ${user.lastName} registered`,
        timestamp: user.createdAt
      })),
      ...recentProductsActivity.map((product: any) => ({
        id: product.id,
        type: 'product' as const,
        description: `New product "${product.name}" added`,
        timestamp: product.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    // Process orders by status
    const orderStatusMap = ordersByStatus.reduce((acc: any, item: any) => {
      acc[item.status.toLowerCase()] = item._count.status;
      return acc;
    }, {});

    // Process top categories with revenue
    const processedTopCategories = topCategories.map((category: any) => {
      const totalRevenue = category.products.reduce((sum: number, product: any) => {
        return sum + product.orderItems.reduce((productSum: number, item: any) => {
          return productSum + (item.price * item.quantity);
        }, 0);
      }, 0);

      return {
        id: category.id,
        name: category.name,
        productCount: category._count.products,
        totalRevenue
      };
    }).sort((a: any, b: any) => b.totalRevenue - a.totalRevenue);

    const stats = {
      overview: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        pendingOrders,
        totalRevenue: revenueResult._sum.totalAmount || 0,
        monthlyRevenue: monthlyRevenueResult._sum.totalAmount || 0
      },
      ordersByStatus: {
        pending: orderStatusMap.pending || 0,
        confirmed: orderStatusMap.confirmed || 0,
        processing: orderStatusMap.processing || 0,
        shipped: orderStatusMap.shipped || 0,
        delivered: orderStatusMap.delivered || 0,
        cancelled: orderStatusMap.cancelled || 0
      },
      topCategories: processedTopCategories,
      recentActivity: combinedActivity,
      recentOrders,
      lowStockProducts,
      topProducts: topProducts.map((product: any) => ({
        ...product,
        salesCount: product._count.orderItems
      }))
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})