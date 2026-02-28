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

    // Fetch users with their order statistics
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        orders: {
          select: {
            totalAmount: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate statistics for each user
    const usersWithStats = users.map((user: any) => {
      const totalOrders = user.orders.length;
      const totalSpent = user.orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
      // orders are already sorted by createdAt desc from the DB query
      const lastOrderDate = user.orders.length > 0 ? user.orders[0].createdAt : null;

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: null, // Not available in current schema
        address: null, // Not available in current schema
        role: user.role,
        createdAt: user.createdAt,
        totalOrders,
        totalSpent,
        lastOrderDate,
      };
    });

    return NextResponse.json({
      users: usersWithStats,
      total: usersWithStats.length,
    });

  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}