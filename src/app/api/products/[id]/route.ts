import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-utils'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        category: true,
        images: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const PUT = requireAdmin(async (
  request: NextRequest,
  context: RouteParams & { user: any }
) => {
  try {
    const { name, description, price, stock, categoryId, isActive, images } = await request.json()
    const { params } = context
    const { id } = await params

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Update product with new images if provided
    const updateData: any = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      categoryId,
      isActive: isActive !== undefined ? isActive : true
    }

    if (images) {
      // Delete existing images and create new ones
      await prisma.image.deleteMany({
        where: { productId: id }
      })
      
      updateData.images = {
        create: images.map((img: any) => ({
          url: img.url,
          alt: img.alt || name
        }))
      }
    }

    const product = await prisma.product.update({
      where: { id: id },
      data: updateData,
      include: {
        category: true,
        images: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product update error:', error)
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

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if product is used in any orders
    const orderItems = await prisma.orderItem.findFirst({
      where: { productId: id }
    })

    if (orderItems) {
      // Soft delete - just mark as inactive
      await prisma.product.update({
        where: { id: id },
        data: { isActive: false }
      })
      
      return NextResponse.json({ 
        message: 'Product marked as inactive (used in orders)' 
      })
    } else {
      // Hard delete if not used in orders
      await prisma.product.delete({
        where: { id: id }
      })
      
      return NextResponse.json({ 
        message: 'Product deleted successfully' 
      })
    }
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})