import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Lightweight connectivity check - avoid $connect/$disconnect on singleton
    const [productCount, categoryCount] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
    ])

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      productCount,
      categoryCount,
      timestamp: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch (error: any) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}