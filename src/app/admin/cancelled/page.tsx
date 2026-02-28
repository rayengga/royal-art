'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XCircle, 
  Search, 
  Eye, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  AlertCircle,
  X,
  Clock,
  RefreshCw,
  Trash2,
  Phone
} from 'lucide-react';
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
  orderItems: {
    quantity: number;
    price: number;
    product: {
      name: string;
      images: { url: string; alt: string }[];
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function CancelledOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionOrder, setActionOrder] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState('PENDING');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders?limit=50');

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        const allOrders: AdminOrder[] = data.orders || [];
        // Only keep cancelled orders
        setOrders(allOrders.filter(o => o.status === 'CANCELLED'));
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const viewOrderDetails = (order: AdminOrder) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const openStatusModal = (order: AdminOrder) => {
    setActionOrder(order);
    setNewStatus('PENDING');
    setShowStatusModal(true);
  };

  const openDeleteModal = (order: AdminOrder) => {
    setActionOrder(order);
    setShowDeleteModal(true);
  };

  const updateOrderStatus = async () => {
    if (!actionOrder) return;
    setActionLoading(true);
    try {
      const response = await fetch(`/api/orders/${actionOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        // Remove from cancelled list since it's no longer cancelled
        setOrders(orders.filter(o => o.id !== actionOrder.id));
        setShowStatusModal(false);
        setActionOrder(null);
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteOrder = async () => {
    if (!actionOrder) return;
    setActionLoading(true);
    try {
      const response = await fetch(`/api/orders/${actionOrder.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setOrders(orders.filter(o => o.id !== actionOrder.id));
        setShowDeleteModal(false);
        setActionOrder(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'PAID':
        return 'text-green-400 bg-green-400/20';
      case 'FAILED':
        return 'text-red-400 bg-red-400/20';
      case 'REFUNDED':
        return 'text-purple-400 bg-purple-400/20';
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

    return matchesSearch;
  });

  // Calculate stats
  const totalCancelledAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
          <h2 className="text-xl text-white mb-2">Loading Cancelled Orders...</h2>
          <p className="text-gray-400">Fetching cancelled order data</p>
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" />
            Cancelled Orders
          </h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">View all cancelled orders</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-lg p-4 sm:p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Total Cancelled</p>
              <p className="text-white text-xl sm:text-2xl font-bold mt-1">{orders.length}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-red-500/20">
              <XCircle size={24} className="text-red-400" />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-lg p-4 sm:p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Lost Revenue</p>
              <p className="text-white text-xl sm:text-2xl font-bold mt-1">${totalCancelledAmount.toFixed(2)}</p>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-red-500/20">
              <CreditCard size={24} className="text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-md rounded-lg p-4 sm:p-6 border border-gray-700/50"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search cancelled orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-400 transition-colors w-full sm:w-64"
            />
          </div>
          <div className="text-sm text-gray-400">
            Showing {filteredOrders.length} of {orders.length} cancelled orders
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
            <XCircle size={64} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No Cancelled Orders</h3>
            <p className="text-gray-500">
              {searchQuery
                ? 'No cancelled orders match your search.'
                : 'No orders have been cancelled yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Order</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Customer</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm hidden md:table-cell">Items</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Total</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Payment</th>
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
                    <td className="p-3 sm:p-4">
                      <div>
                        <p className="text-white font-medium text-sm">#{order.id}</p>
                        <div className="inline-flex items-center space-x-1 mt-1 px-2 py-0.5 rounded-full text-xs text-red-400 bg-red-400/20">
                          <XCircle className="w-3 h-3" />
                          <span>Cancelled</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <User size={16} className="text-gray-300" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {order.user.firstName} {order.user.lastName}
                          </p>
                          <p className="text-xs text-gray-400">{order.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 hidden md:table-cell">
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
                    <td className="p-3 sm:p-4">
                      <p className="text-white font-semibold text-sm">${order.totalAmount}</p>
                    </td>
                    <td className="p-3 sm:p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 hidden lg:table-cell">
                      <p className="text-gray-300 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-3 sm:p-4">
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
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openStatusModal(order)}
                          className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                          title="Update Status"
                        >
                          <RefreshCw size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openDeleteModal(order)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </motion.button>
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
              <div className="p-4 sm:p-6 border-b border-gray-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Cancelled Order Details</h2>
                  <p className="text-gray-400 text-sm">Order ID: {selectedOrder.id}</p>
                </div>
                <button
                  onClick={closeOrderModal}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Left Column - Order Info */}
                  <div className="space-y-4 sm:space-y-6">
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
                            <p className="text-gray-300 text-sm">
                              <span className="font-medium">Name:</span> {parsed?.customerName || `${selectedOrder.user.firstName} ${selectedOrder.user.lastName}`}
                            </p>
                            <p className="text-gray-300 text-sm">
                              <span className="font-medium">Email:</span> {selectedOrder.user.email}
                            </p>
                            {parsed?.customerPhone && (
                              <p className="text-gray-300 text-sm flex items-center gap-1">
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
                                <p className="text-gray-300 text-sm">
                                  <span className="font-medium">Address:</span> {addr.address}
                                </p>
                              )}
                              {addr.governorate && (
                                <p className="text-gray-300 text-sm">
                                  <span className="font-medium">Governorate:</span> {addr.governorate}
                                </p>
                              )}
                            </div>
                          );
                        } catch {
                          return <p className="text-gray-300 text-sm">{selectedOrder.shippingAddress}</p>;
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
                          <span className="text-gray-300 text-sm">Order Status:</span>
                          <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 text-red-400 bg-red-400/20">
                            <XCircle className="w-4 h-4" />
                            CANCELLED
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Payment Status:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.paymentStatus)}`}>
                            {selectedOrder.paymentStatus}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Order Date:</span>
                          <span className="text-gray-300 text-sm">
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
                          <span className="text-gray-300 text-sm">Payment Method:</span>
                          <span className="text-gray-300 text-sm">Cash on Delivery</span>
                        </div>
                        <div className="flex items-center justify-between text-lg font-bold">
                          <span className="text-white">Total Amount:</span>
                          <span className="text-red-400 line-through">${selectedOrder.totalAmount.toFixed(2)}</span>
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
                          <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 bg-gray-600/50 rounded-lg">
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-600 flex-shrink-0">
                              {item.product.images && item.product.images.length > 0 ? (
                                <Image
                                  src={item.product.images[0].url}
                                  alt={item.product.images[0].alt}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                                  <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white text-sm truncate">{item.product.name}</h4>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-gray-400 text-xs">Qty: {item.quantity}</span>
                                <span className="text-gray-400 text-xs">${item.price.toFixed(2)} each</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-sm sm:text-lg font-semibold text-white">
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
                          <span className="text-red-400 line-through">${selectedOrder.totalAmount.toFixed(2)}</span>
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

      {/* Update Status Modal */}
      <AnimatePresence>
        {showStatusModal && actionOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowStatusModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl border border-gray-700 max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <RefreshCw size={24} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Update Order Status</h3>
                  <p className="text-gray-400 text-sm">Order #{actionOrder.id}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Change the status of this cancelled order to:
              </p>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors mb-6"
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
              </select>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateOrderStatus}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      Update Status
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && actionOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl border border-red-500/30 max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <Trash2 size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Delete Order</h3>
                  <p className="text-gray-400 text-sm">Order #{actionOrder.id}</p>
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-sm">
                  <strong>Warning:</strong> This will permanently delete this order and restore the product stock. This action cannot be undone.
                </p>
              </div>
              <div className="text-sm text-gray-400 mb-6 space-y-1">
                <p><span className="text-gray-300">Customer:</span> {actionOrder.user.firstName} {actionOrder.user.lastName}</p>
                <p><span className="text-gray-300">Amount:</span> ${actionOrder.totalAmount}</p>
                <p><span className="text-gray-300">Items:</span> {actionOrder.orderItems.length} product(s)</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteOrder}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
