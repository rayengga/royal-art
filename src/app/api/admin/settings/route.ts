import { NextResponse, NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch current user settings
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return settings with default values
    const settings = {
      profile: {
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      notifications: {
        emailOrders: true,
        emailUsers: true,
        emailProducts: false,
        emailLowStock: true
      },
      system: {
        siteName: 'Decory',
        siteDescription: 'Premium Laser Engraved Products',
        contactEmail: 'contact@decory.com',
        allowRegistration: true,
        requireEmailVerification: false,
        maintenanceMode: false
      },
      appearance: {
        theme: 'dark' as const,
        primaryColor: '#D4AF37',
        accentColor: '#DC2626'
      }
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { section, data } = await request.json();

    switch (section) {
      case 'profile':
        return await updateProfile(user.id, data);
      case 'notifications':
        return await updateNotifications(user.id, data);
      case 'system':
        return await updateSystem(data);
      case 'appearance':
        return await updateAppearance(data);
      default:
        return NextResponse.json(
          { error: 'Invalid section' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function updateProfile(userId: string, data: any) {
  try {
    const updateData: any = {};

    // Update name if first/last name provided
    if (data.firstName !== undefined) {
      updateData.firstName = data.firstName;
    }
    if (data.lastName !== undefined) {
      updateData.lastName = data.lastName;
    }

    // Update email if provided
    if (data.email) {
      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: userId }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 400 }
        );
      }

      updateData.email = data.email;
    }

    // Handle password change if provided
    if (data.currentPassword && data.newPassword) {
      if (data.newPassword !== data.confirmPassword) {
        return NextResponse.json(
          { error: 'New passwords do not match' },
          { status: 400 }
        );
      }

      // Verify current password
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true }
      });

      if (!currentUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const isValidPassword = await bcrypt.compare(data.currentPassword, currentUser.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Hash new password
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(data.newPassword, saltRounds);
    } else if (data.newPassword && !data.currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required to change password' },
        { status: 400 }
      );
    }

    // Update user in database
    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: updateData
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

async function updateNotifications(userId: string, data: any) {
  try {
    // For now, we'll just return success since we don't have a notifications table
    // In a real app, you'd store these preferences in the database
    console.log('Notification preferences updated for user:', userId, data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

async function updateSystem(data: any) {
  try {
    // For now, we'll just return success since we don't have a settings table
    // In a real app, you'd store these in a dedicated settings table
    console.log('System settings updated:', data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating system settings:', error);
    return NextResponse.json(
      { error: 'Failed to update system settings' },
      { status: 500 }
    );
  }
}

async function updateAppearance(data: any) {
  try {
    // For now, we'll just return success since we don't have a settings table
    // In a real app, you'd store these preferences in the database
    console.log('Appearance settings updated:', data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating appearance settings:', error);
    return NextResponse.json(
      { error: 'Failed to update appearance settings' },
      { status: 500 }
    );
  }
}