import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-utils';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

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
        createdAt: true,
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
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentUploads = images.filter((img: any) => {
      return new Date(img.createdAt) > weekAgo;
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

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const productId = formData.get('productId') as string | null;
    const alt = formData.get('alt') as string || 'Product image';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Validate product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, AVIF, GIF' }, { status: 400 });
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 400 });
    }

    // Save file to public/images/products
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `prod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'products');

    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/images/products/${filename}`;

    // Create DB record
    const image = await prisma.image.create({
      data: {
        url,
        alt,
        productId,
      },
      include: {
        product: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ image }, { status: 201 });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { imageId } = await request.json();

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const image = await prisma.image.findUnique({ where: { id: imageId } });
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Try to delete file from disk if it's a local file
    if (image.url.startsWith('/images/')) {
      try {
        const filePath = path.join(process.cwd(), 'public', image.url);
        await unlink(filePath);
      } catch {
        // File might not exist on disk, continue with DB deletion
      }
    }

    await prisma.image.delete({ where: { id: imageId } });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}