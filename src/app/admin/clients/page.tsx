'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Mail, Phone, MapPin, Calendar, ShoppingBag, Users, AlertCircle } from 'lucide-react';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  createdAt: string;
  role: 'ADMIN' | 'CLIENT';
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/admin/clients');
        
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        
        const data = await response.json();
        setClients(data.users || []);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !roleFilter || client.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-gold mx-auto mb-4"></div>
          <h2 className="text-xl text-white mb-2">Loading Clients...</h2>
          <p className="text-gray-400">Fetching user data from database</p>
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
            <h2 className="text-xl text-white mb-2">Error Loading Clients</h2>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Clients</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage customer accounts and profiles</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        {[
          { 
            title: 'Total Clients', 
            value: clients.length, 
            color: 'bg-blue-500/20', 
            textColor: 'text-blue-400',
            icon: Users 
          },
          { 
            title: 'Active Users', 
            value: clients.filter(c => c.role === 'CLIENT').length, 
            color: 'bg-green-500/20', 
            textColor: 'text-green-400',
            icon: Users 
          },
          { 
            title: 'Admins', 
            value: clients.filter(c => c.role === 'ADMIN').length, 
            color: 'bg-purple-500/20', 
            textColor: 'text-purple-400',
            icon: Users 
          },
          { 
            title: 'Total Revenue', 
            value: `$${clients.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}`, 
            color: 'bg-yellow-500/20', 
            textColor: 'text-yellow-400',
            icon: ShoppingBag 
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
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors w-full sm:w-64"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-soft-gold transition-colors appearance-none"
              >
                <option value="">All Roles</option>
                <option value="CLIENT">Clients</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Showing {filteredClients.length} of {clients.length} clients
          </div>
        </div>
      </motion.div>

      {/* Clients List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700/50 overflow-hidden"
      >
        {filteredClients.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={64} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No Clients Found</h3>
            <p className="text-gray-500">
              {searchQuery || roleFilter 
                ? 'No clients match your current filters.' 
                : 'No clients have registered yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Client</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Contact</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Role</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Orders</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Total Spent</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm hidden lg:table-cell">Last Order</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm hidden lg:table-cell">Join Date</th>
                  <th className="text-left p-3 sm:p-4 text-gray-300 font-medium text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredClients.map((client, index) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-700/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-soft-gold to-laser-red rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {client.firstName} {client.lastName}
                          </p>
                          <p className="text-sm text-gray-400">ID: {client.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Mail size={14} />
                          <span className="text-sm">{client.email}</span>
                        </div>
                        {client.phone && (
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Phone size={14} />
                            <span className="text-sm">{client.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.role === 'ADMIN' 
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {client.role === 'CLIENT' ? 'CLIENT' : client.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <ShoppingBag size={16} className="text-gray-400" />
                        <span className="text-white">{client.totalOrders}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-semibold">${client.totalSpent.toFixed(2)}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-300 text-sm">
                        {client.lastOrderDate 
                          ? new Date(client.lastOrderDate).toLocaleDateString()
                          : 'No orders'}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-300 text-sm">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedClient(client);
                          setShowClientModal(true);
                        }}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                        title="View Client Details"
                      >
                        <Eye size={16} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Client Details Modal */}
      {showClientModal && selectedClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-soft-gold to-laser-red rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {selectedClient.firstName.charAt(0)}{selectedClient.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedClient.firstName} {selectedClient.lastName}
                  </h2>
                  <p className="text-gray-400">Client ID: {selectedClient.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowClientModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <Mail size={16} />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <p className="text-white">{selectedClient.email}</p>
                  </div>
                  {selectedClient.phone && (
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 text-gray-400 mb-2">
                        <Phone size={16} />
                        <span className="text-sm font-medium">Phone</span>
                      </div>
                      <p className="text-white">{selectedClient.phone}</p>
                    </div>
                  )}
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <Users size={16} />
                      <span className="text-sm font-medium">Role</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedClient.role === 'ADMIN' 
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {selectedClient.role}
                    </span>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <Calendar size={16} />
                      <span className="text-sm font-medium">Join Date</span>
                    </div>
                    <p className="text-white">{new Date(selectedClient.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              {selectedClient.address && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <MapPin size={16} />
                      <span className="text-sm font-medium">Address</span>
                    </div>
                    <p className="text-white">{selectedClient.address}</p>
                  </div>
                </div>
              )}

              {/* Order Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Order Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <ShoppingBag size={16} />
                      <span className="text-sm font-medium">Total Orders</span>
                    </div>
                    <p className="text-white text-2xl font-bold">{selectedClient.totalOrders}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <span className="text-sm font-medium">Total Spent</span>
                    </div>
                    <p className="text-white text-2xl font-bold">${selectedClient.totalSpent.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-gray-400 mb-2">
                      <Calendar size={16} />
                      <span className="text-sm font-medium">Last Order</span>
                    </div>
                    <p className="text-white">
                      {selectedClient.lastOrderDate 
                        ? new Date(selectedClient.lastOrderDate).toLocaleDateString()
                        : 'No orders yet'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Average Order Value */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Additional Info</h3>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Average Order Value</span>
                    <span className="text-white font-semibold">
                      ${selectedClient.totalOrders > 0 
                        ? (selectedClient.totalSpent / selectedClient.totalOrders).toFixed(2)
                        : '0.00'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700 flex justify-end">
              <button
                onClick={() => setShowClientModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}