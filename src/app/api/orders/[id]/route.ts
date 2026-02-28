import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/auth-utils'

interface RouteParams {
  params: Promise<{ id: string }>
}

export const GET = requireAuth(async (
  request: NextRequest,
  context: RouteParams & { user: any }
) => {
  try {
    const { params, user } = context
    const { id } = await params

    const where: any = { id }
    
    // If not admin, only show user's own orders
    if (user.role !== 'ADMIN') {
      where.userId = user.id
    }

    const order = await prisma.order.findUnique({
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
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const PUT = requireAdmin(async (
  request: NextRequest,
  context: RouteParams & { user: any }
) => {
  try {
    const { status, paymentStatus } = await request.json()
    const { params } = context
    const { id } = await params

    if (!status && !paymentStatus) {
      return NextResponse.json(
        { error: 'Status or payment status is required' },
        { status: 400 }
      )
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: id }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus
    
    // Auto-update payment status to PAID when order is DELIVERED (for cash on delivery)
    if (status === 'DELIVERED' && existingOrder.paymentMethod === 'CASH_ON_DELIVERY' && existingOrder.paymentStatus === 'PENDING') {
      updateData.paymentStatus = 'PAID'
    }

    const order = await prisma.order.update({
      where: { id: id },
      data: updateData,
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

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})

export const DELETE = requireAdmin(async (
  request: NextRequest,
  context: RouteParams & { user: any }
) => {
  try {
    const { params } = context
    const { id } = await params

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: id },
      include: {
        orderItems: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Only allow deletion of PENDING or CANCELLED orders
    if (!['PENDING', 'CANCELLED'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Can only delete pending or cancelled orders' },
        { status: 400 }
      )
    }

    // Restore product stock in a transaction
    await prisma.$transaction(async (tx: any) => {
      // Restore stock for each item
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        })
      }

      // Delete the order
      await tx.order.delete({
        where: { id: id }
      })
    })

    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Order deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})