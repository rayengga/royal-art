'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle, Clock, AlertCircle, User, X, MapPin, Phone, CreditCard } from 'lucide-react';
import Image from 'next/image';

interface AdminOrder {
  id: string;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shippingAddress: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
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
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/orders?limit=50');
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus as AdminOrder['status'], paymentStatus: updatedOrder.paymentStatus }
            : order
        ));
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const viewOrderDetails = (order: AdminOrder) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
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
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'PROCESSING':
        return 'text-blue-400 bg-blue-400/20';
      case 'SHIPPED':
        return 'text-purple-400 bg-purple-400/20';
      case 'DELIVERED':
        return 'text-green-400 bg-green-400/20';
      case 'CANCELLED':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-gold mx-auto mb-4"></div>
          <h2 className="text-xl text-white mb-2">Loading Orders...</h2>
          <p className="text-gray-400">Fetching order data from database</p>
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
            <h2 className="text-xl text-white mb-2">Error Loading Orders</h2>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-gray-400 mt-1">Manage customer orders and fulfillment</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        {[
          { 
            title: 'Total Orders', 
            value: orders.length, 
            color: 'bg-blue-500/20', 
            textColor: 'text-blue-400',
            icon: Package 
          },
          { 
            title: 'Pending', 
            value: orders.filter(o => o.status === 'PENDING').length, 
            color: 'bg-yellow-500/20', 
            textColor: 'text-yellow-400',
            icon: Clock 
          },
          { 
            title: 'Processing', 
            value: orders.filter(o => o.status === 'PROCESSING').length, 
            color: 'bg-blue-500/20', 
            textColor: 'text-blue-400',
            icon: Package 
          },
          { 
            title: 'Delivered', 
            value: orders.filter(o => o.status === 'DELIVERED').length, 
            color: 'bg-green-500/20', 
            textColor: 'text-green-400',
            icon: CheckCircle 
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={24} className={stat.textColor} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors w-full sm:w-64"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-soft-gold transition-colors appearance-none"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700/50 overflow-hidden"
      >
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={64} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No Orders Found</h3>
            <p className="text-gray-500">
              {searchQuery || statusFilter 
                ? 'No orders match your current filters.' 
                : 'No orders have been placed yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Order</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Customer</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm hidden md:table-cell">Items</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Total</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Status</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm hidden lg:table-cell">Date</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">#{order.id}</p>
                        <p className="text-sm text-gray-400">
                          Payment: {order.paymentStatus}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <User size={16} className="text-gray-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {order.user.firstName} {order.user.lastName}
                          </p>
                          <p className="text-sm text-gray-400">{order.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {order.orderItems.slice(0, 3).map((item, i) => (
                          <div key={i} className="w-8 h-8 bg-gray-600 rounded overflow-hidden">
                            {item.product.images?.[0]?.url ? (
                              <Image
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            ) : (
                              <Package size={16} className="text-gray-400 m-2" />
                            )}
                          </div>
                        ))}
                        {order.orderItems.length > 3 && (
                          <span className="text-sm text-gray-400">
                            +{order.orderItems.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-semibold">${order.totalAmount}</p>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-300 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => viewOrderDetails(order)}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                          title="View Order"
                        >
                          <Eye size={16} />
                        </motion.button>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-soft-gold"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeOrderModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Order Details</h2>
                  <p className="text-gray-400">Order ID: {selectedOrder.id}</p>
                </div>
                <button
                  onClick={closeOrderModal}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Left Column - Order Info */}
                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Customer Information
                      </h3>
                      {(() => {
                        let parsed: any = null;
                        try { parsed = JSON.parse(selectedOrder.shippingAddress); } catch {}
                        return (
                          <div className="space-y-2">
                            <p className="text-gray-300">
                              <span className="font-medium">Name:</span> {parsed?.customerName || `${selectedOrder.user.firstName} ${selectedOrder.user.lastName}`}
                            </p>
                            <p className="text-gray-300">
                              <span className="font-medium">Email:</span> {selectedOrder.user.email}
                            </p>
                            {parsed?.customerPhone && (
                              <p className="text-gray-300 flex items-center gap-1">
                                <span className="font-medium">Phone:</span> {parsed.customerPhone}
                              </p>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Shipping Address
                      </h3>
                      {(() => {
                        try {
                          const addr = JSON.parse(selectedOrder.shippingAddress);
                          return (
                            <div className="space-y-2">
                              {addr.address && (
                                <p className="text-gray-300">
                                  <span className="font-medium">Address:</span> {addr.address}
                                </p>
                              )}
                              {addr.governorate && (
                                <p className="text-gray-300">
                                  <span className="font-medium">Governorate:</span> {addr.governorate}
                                </p>
                              )}
                            </div>
                          );
                        } catch {
                          return <p className="text-gray-300">{selectedOrder.shippingAddress}</p>;
                        }
                      })()}
                    </div>

                    {/* Order Status */}
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        Order Status
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Order Status:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(selectedOrder.status)}`}>
                            {getStatusIcon(selectedOrder.status)}
                            {selectedOrder.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Payment Status:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.paymentStatus)}`}>
                            {selectedOrder.paymentStatus}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Order Date:</span>
                          <span className="text-gray-300">
                            {new Date(selectedOrder.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payment Information
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Payment Method:</span>
                          <span className="text-gray-300">Cash on Delivery</span>
                        </div>
                        <div className="flex items-center justify-between text-xl font-bold">
                          <span className="text-white">Total Amount:</span>
                          <span className="text-soft-gold">${selectedOrder.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Order Items */}
                  <div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {selectedOrder.orderItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 bg-gray-600/50 rounded-lg">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-600">
                              {item.product.images && item.product.images.length > 0 ? (
                                <Image
                                  src={item.product.images[0].url}
                                  alt={item.product.images[0].alt}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                                  <Package className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-white">{item.product.name}</h4>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-gray-400">Qty: {item.quantity}</span>
                                <span className="text-gray-400">${item.price.toFixed(2)} each</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-white">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Order Summary */}
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <div className="flex items-center justify-between text-lg font-bold text-white">
                          <span>Total:</span>
                          <span className="text-soft-gold">${selectedOrder.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}