import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const user = await getAuthUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Fetch all product images
    const images = await prisma.image.findMany({
      select: {
        id: true,
        url: true,
        alt: true,
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate stats
    const totalImages = images.length;
    const uniqueProducts = new Set(images.map((img: any) => img.product.id)).size;
    const recentUploads = images.filter((img: any) => {
      const imageDate = new Date(parseInt(img.id));
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return imageDate > weekAgo;
    }).length;

    const stats = {
      totalImages,
      totalProducts: uniqueProducts,
      recentUploads,
    };

    return NextResponse.json({
      images,
      stats,
    });

  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}