import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, getAuthUser } from '@/lib/auth-utils'
import { sendOrderNotificationEmail } from '@/lib/email'

async function generateOrderId(): Promise<string> {
  while (true) {
    const id = String(Math.floor(100000 + Math.random() * 900000));
    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return id;
  }
}

export const GET = requireAuth(async (request: NextRequest, { user }: any) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    
    // If not admin, only show user's orders
    if (user.role !== 'ADMIN') {
      where.userId = user.id
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          orderItems: {
            include: {
              product: {
                include: {
                  images: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const POST = requireAuth(async (request: NextRequest, { user }: any) => {
  try {
    const { 
      items, 
      shippingAddress, 
      billingAddress, 
      paymentMethod 
    } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !billingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: 'Shipping address, billing address, and payment method are required' },
        { status: 400 }
      )
    }

    // Validate products and calculate total
    let totalAmount = 0
    const validatedItems: Array<{
      productId: string;
      quantity: number;
      price: number;
    }> = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        )
      }

      if (!product.isActive) {
        return NextResponse.json(
          { error: `Product is not available: ${product.name}` },
          { status: 400 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product: ${product.name}` },
          { status: 400 }
        )
      }

      const itemTotal = product.price * item.quantity
      totalAmount += itemTotal

      validatedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      })
    }

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx: any) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          id: await generateOrderId(),
          userId: user.id,
          totalAmount,
          shippingAddress,
          billingAddress,
          paymentMethod,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          orderItems: {
            create: validatedItems
          }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          orderItems: {
            include: {
              product: {
                include: {
                  images: true
                }
              }
            }
          }
        }
      })

      // Update product stock
      for (const item of validatedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }

      return newOrder
    })

    // Send email notification
    try {
      // Parse shipping address to get customer details
      let customerInfo: any = {};
      try {
        customerInfo = typeof shippingAddress === 'string' 
          ? JSON.parse(shippingAddress) 
          : shippingAddress;
      } catch {
        // If parsing fails, use user info
        customerInfo = {
          customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          customerPhone: 'N/A',
          governorate: 'N/A',
          address: shippingAddress
        };
      }

      await sendOrderNotificationEmail({
        orderNumber: order.id,
        customerName: customerInfo.customerName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        customerPhone: customerInfo.customerPhone || customerInfo.phone || 'N/A',
        governorate: customerInfo.governorate || 'N/A',
        address: customerInfo.address || '',
        items: order.orderItems.map((item: any) => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: order.totalAmount,
        orderDate: order.createdAt || new Date().toISOString()
      });
    } catch (emailError) {
      console.error('Failed to send order notification email:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})