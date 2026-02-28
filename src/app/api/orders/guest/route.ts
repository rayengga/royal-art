import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderNotificationEmail } from '@/lib/email'

async function generateOrderId(): Promise<string> {
  while (true) {
    const id = String(Math.floor(100000 + Math.random() * 900000));
    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return id;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      productId,
      productName,
      productPrice,
      quantity,
      totalPrice,
      customerName,
      customerPhone,
      governorate,
      address,
      orderDate
    } = body

    // Validate required fields
    if (!productId || !customerName || !customerPhone || !governorate) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, customerName, customerPhone, governorate' },
        { status: 400 }
      )
    }

    // Validate product exists and has stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Create guest order entry
    // Since we need a user for the Order model, we'll store guest orders differently
    // For now, let's create a GuestOrder or use the shippingAddress to store customer info
    
    // Check if there's a guest user, if not create one or handle differently
    let guestUser = await prisma.user.findFirst({
      where: { email: 'guest@royalartisanat.com' }
    })

    if (!guestUser) {
      // Create a guest user for guest orders
      guestUser = await prisma.user.create({
        data: {
          email: 'guest@royalartisanat.com',
          password: 'not-applicable',
          firstName: 'Guest',
          lastName: 'Customer',
          role: 'CLIENT'
        }
      })
    }

    // Format customer info as shipping address
    const shippingInfo = JSON.stringify({
      customerName,
      customerPhone,
      governorate,
      address: address || '',
      orderDate
    })

    // Create the order
    const order = await prisma.$transaction(async (tx: any) => {
      const newOrder = await tx.order.create({
        data: {
          id: await generateOrderId(),
          userId: guestUser!.id,
          totalAmount: totalPrice,
          shippingAddress: shippingInfo,
          billingAddress: shippingInfo,
          paymentMethod: 'CASH_ON_DELIVERY',
          status: 'PENDING',
          paymentStatus: 'PENDING',
          orderItems: {
            create: [{
              productId,
              quantity,
              price: productPrice
            }]
          }
        },
        include: {
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
      await tx.product.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: quantity
          }
        }
      })

      return newOrder
    })

    // Send email notification
    try {
      await sendOrderNotificationEmail({
        orderNumber: order.id,
        customerName,
        customerPhone,
        governorate,
        address: address || '',
        items: [{
          productName,
          quantity,
          price: productPrice
        }],
        totalAmount: totalPrice,
        orderDate: orderDate || new Date().toISOString()
      });
    } catch (emailError) {
      console.error('Failed to send order notification email:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Order placed successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Guest order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // This could be used by admin to view guest orders
  return NextResponse.json(
    { error: 'Method not allowed for guests' },
    { status: 405 }
  )
}
