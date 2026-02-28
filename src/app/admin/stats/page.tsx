'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  Calendar,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';

interface DetailedStats {
  overview: {
    totalUsers: number;
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
  };
  ordersByStatus: {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  topCategories: Array<{
    id: string;
    name: string;
    productCount: number;
    totalRevenue: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'order' | 'user' | 'product';
    description: string;
    timestamp: string;
    amount?: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    price: number;
  }>;
}

export default function StatsPage() {
  const [stats, setStats] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchDetailedStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/admin/stats?range=${timeRange}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch detailed statistics');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedStats();
  }, [timeRange]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <TrendingUp className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'confirmed':
        return 'text-blue-400 bg-blue-400/20';
      case 'processing':
        return 'text-purple-400 bg-purple-400/20';
      case 'shipped':
        return 'text-indigo-400 bg-indigo-400/20';
      case 'delivered':
        return 'text-green-400 bg-green-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-gold mx-auto mb-4"></div>
          <h2 className="text-xl text-white mb-2">Loading Statistics...</h2>
          <p className="text-gray-400">Analyzing business data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl text-white mb-2">Error Loading Statistics</h2>
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

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Statistics & Analytics</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Comprehensive business insights and performance metrics</p>
        </div>
        
        <div className="flex items-center">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
            className="bg-gray-800 border border-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:border-soft-gold text-sm sm:text-base"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          {
            title: 'Total Revenue',
            value: `$${stats.overview.totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: 'bg-green-500/20 text-green-400',
            trend: null
          },
          {
            title: 'Total Orders',
            value: stats.overview.totalOrders,
            icon: ShoppingBag,
            color: 'bg-blue-500/20 text-blue-400',
            trend: null
          },
          {
            title: 'Active Products',
            value: stats.overview.totalProducts,
            icon: Package,
            color: 'bg-purple-500/20 text-purple-400',
            trend: null
          },
          {
            title: 'Total Customers',
            value: stats.overview.totalUsers,
            icon: Users,
            color: 'bg-orange-500/20 text-orange-400',
            trend: null
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{metric.title}</p>
                <p className="text-white text-2xl font-bold mt-1">{metric.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${metric.color}`}>
                <metric.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Order Status Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <BarChart3 className="mr-2" />
          Order Status Distribution
        </h3>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {Object.entries(stats.ordersByStatus).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${getStatusColor(status)}`}>
                {getStatusIcon(status)}
              </div>
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-sm text-gray-400 capitalize">{status}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Target className="mr-2" />
            Top Categories
          </h3>
          
          <div className="space-y-4">
            {stats.topCategories.map((category, index) => (
              <div key={category.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-soft-gold to-laser-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{category.name}</p>
                    <p className="text-gray-400 text-sm">{category.productCount} products</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${category.totalRevenue.toFixed(2)}</p>
                  <p className="text-gray-400 text-sm">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <AlertCircle className="mr-2 text-red-400" />
            Low Stock Alert
          </h3>
          
          {stats.lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
              <p className="text-gray-400">All products are well stocked!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-red-400 text-sm">Only {product.stock} left in stock</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${product.price.toFixed(2)}</p>
                    <button className="text-soft-gold text-sm hover:underline">
                      Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Clock className="mr-2" />
          Recent Activity
        </h3>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {stats.recentActivity.map((activity, index) => (
            <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'order' ? 'bg-blue-500/20 text-blue-400' :
                activity.type === 'user' ? 'bg-green-500/20 text-green-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {activity.type === 'order' && <ShoppingBag size={18} />}
                {activity.type === 'user' && <Users size={18} />}
                {activity.type === 'product' && <Package size={18} />}
              </div>
              
              <div className="flex-1">
                <p className="text-white">{activity.description}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
              
              {activity.amount && (
                <div className="text-right">
                  <p className="text-green-400 font-semibold">+${activity.amount.toFixed(2)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}