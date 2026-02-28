'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Calendar, 
  Package, 
  MapPin, 
  Phone, 
  Edit2, 
  Save, 
  X, 
  Shield,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shippingAddress: string;
  createdAt: string;
  orderItems: Array<{
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      images: Array<{
        url: string;
        alt: string;
      }>;
    };
  }>;
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
      return;
    }

    if (isAuthenticated) {
      fetchProfile();
      fetchOrders();
    }
  }, [isAuthenticated, loading, router]);

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setEditForm({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setUpdateLoading(true);
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        await fetchProfile();
        setIsEditing(false);
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'PROCESSING':
        return <Package className="w-4 h-4" />;
      case 'SHIPPED':
        return <Truck className="w-4 h-4" />;
      case 'DELIVERED':
        return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-300 bg-yellow-400/20';
      case 'PROCESSING':
        return 'text-blue-300 bg-blue-400/20';
      case 'SHIPPED':
        return 'text-purple-300 bg-purple-400/20';
      case 'DELIVERED':
        return 'text-green-200 bg-green-400/20';
      case 'CANCELLED':
        return 'text-red-300 bg-red-400/20';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-background pt-4">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl text-foreground mb-2">Loading Profile...</h2>
            <p className="text-muted-foreground">Please wait while we fetch your information</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-4">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-glow-blue mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information and view your orders</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-secondary/30 rounded-xl p-6 border border-primary/20 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-muted-foreground">{profile.email}</p>
                <div className="flex items-center justify-center mt-2">
                  <Shield className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm text-primary capitalize">{profile.role.toLowerCase()}</span>
                </div>
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Member since:</span>
                    <span className="text-foreground">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total orders:</span>
                    <span className="text-foreground">{orders.length}</span>
                  </div>
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="w-full laser-button"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      First Name
                    </label>
                    <Input
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleInputChange}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Last Name
                    </label>
                    <Input
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleInputChange}
                      placeholder="Last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={updateLoading}
                      className="flex-1 laser-button"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateLoading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({
                          firstName: profile.firstName,
                          lastName: profile.lastName,
                          email: profile.email
                        });
                      }}
                      variant="outline"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Orders Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-secondary/30 rounded-xl p-6 border border-primary/20">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <Package className="w-6 h-6 mr-2 text-primary" />
                Order History
              </h2>

              {loadingOrders ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't placed any orders yet. Start shopping to see your orders here.
                  </p>
                  <Button asChild className="laser-button">
                    <a href="/shop">
                      Start Shopping
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-secondary/50 rounded-lg p-6 border border-primary/10"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            Order #{order.id.slice(-8)}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </div>
                          <div className="text-xl font-bold text-primary">
                            ${order.totalAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Items ({order.orderItems.length})</h4>
                          <div className="space-y-2">
                            {order.orderItems.slice(0, 2).map((item, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded bg-secondary">
                                  {item.product.images && item.product.images.length > 0 ? (
                                    <Image
                                      src={item.product.images[0].url}
                                      alt={item.product.images[0].alt}
                                      fill
                                      className="object-cover rounded"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center rounded">
                                      <Package className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-foreground truncate">
                                    {item.product.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {order.orderItems.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                +{order.orderItems.length - 2} more items
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-foreground mb-2">Shipping Address</h4>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-primary mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                              {order.shippingAddress}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}