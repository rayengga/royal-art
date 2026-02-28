'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  overview: {
    totalUsers: number;
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
  };
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    price: number;
    sales?: number;
    category?: {
      name: string;
    };
  }>;
}

// StatCard component defined outside the main component
const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50 hover:border-soft-gold/30 transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-white text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setDashboardStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-gold mx-auto mb-4"></div>
          <h2 className="text-xl text-white mb-2">Loading Dashboard...</h2>
          <p className="text-gray-400">Fetching your store statistics</p>
        </div>
      </div>
    );
  }

  if (error) {
    // If it's an authentication error, the layout will handle redirecting to login
    if (error.includes('401')) {
      return null;
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl text-white mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Unable to load dashboard</h2>
          <p className="text-gray-400">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/products/add"
            className="bg-gradient-to-r from-soft-gold to-electric-blue text-white px-3 sm:px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
          >
            Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="bg-gray-700/50 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600/50 transition-colors text-sm sm:text-base"
          >
            View Orders
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard
          title="Total Products"
          value={dashboardStats.overview.totalProducts}
          icon={Package}
          color="bg-blue-500/20"
        />
        <StatCard
          title="Total Orders"
          value={dashboardStats.overview.totalOrders}
          icon={ShoppingCart}
          color="bg-green-500/20"
        />
        <StatCard
          title="Total Customers"
          value={dashboardStats.overview.totalUsers}
          icon={Users}
          color="bg-purple-500/20"
        />
        <StatCard
          title="Revenue"
          value={`$${dashboardStats.overview.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="bg-yellow-500/20"
        />
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700/50"
      >
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
        </div>
        <div className="p-6">
          {dashboardStats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {dashboardStats.recentOrders.map((order: any) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-700/30 rounded-lg gap-2">
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm sm:text-base truncate">Order #{order.id}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{order.customerName}</p>
                  </div>
                  <div className="sm:text-right flex sm:block justify-between">
                    <p className="text-white font-medium text-sm sm:text-base">${order.total}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No orders yet</p>
          )}
        </div>
      </motion.div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700/50"
      >
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white">Top Products</h2>
        </div>
        <div className="p-6">
          {dashboardStats.topProducts.length > 0 ? (
            <div className="space-y-4">
              {dashboardStats.topProducts.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-soft-gold to-electric-blue rounded-lg flex items-center justify-center">
                      <Package size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-gray-400 text-sm">${product.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{product.sales || 0} sold</p>
                    <p className="text-gray-400 text-sm">In {product.category?.name || 'Uncategorized'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No products yet</p>
          )}
        </div>
      </motion.div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
        >
          <h3 className="text-white text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/products/add"
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-600/50 transition-colors"
            >
              <Package size={18} className="text-soft-gold" />
              <span className="text-white">Add New Product</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-600/50 transition-colors"
            >
              <ShoppingCart size={18} className="text-electric-blue" />
              <span className="text-white">Manage Orders</span>
            </Link>
            <Link
              href="/admin/stats"
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-600/50 transition-colors"
            >
              <TrendingUp size={18} className="text-green-400" />
              <span className="text-white">View Analytics</span>
            </Link>
          </div>
        </motion.div>

        {/* Pending Orders Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle size={24} className="text-orange-400" />
            <h3 className="text-white text-lg font-semibold">Pending Orders</h3>
          </div>
          <p className="text-orange-200 mb-3">
            You have {dashboardStats.overview.pendingOrders} pending orders that need attention.
          </p>
          <Link
            href="/admin/orders"
            className="inline-flex items-center space-x-2 text-orange-300 hover:text-orange-200 transition-colors"
          >
            <span>View pending orders</span>
            <TrendingUp size={16} />
          </Link>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-green-500/10 border border-green-500/30 rounded-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign size={24} className="text-green-400" />
            <h3 className="text-white text-lg font-semibold">This Month</h3>
          </div>
          <p className="text-2xl font-bold text-white mb-2">
            ${dashboardStats.overview.monthlyRevenue.toFixed(2)}
          </p>
          <p className="text-green-200 text-sm">
            Monthly revenue so far
          </p>
        </motion.div>
      </div>
    </div>
  );
}