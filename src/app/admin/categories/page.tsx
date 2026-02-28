'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Image as ImageIcon, Package, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface AdminCategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCategories(
      selectedCategories.length === categories.length ? [] : categories.map(c => c.id)
    );
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setCategories(categories.filter(c => c.id !== categoryId));
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selectedCategories.length} categories? This action cannot be undone.`)) {
      selectedCategories.forEach(categoryId => {
        handleDeleteCategory(categoryId);
      });
      setSelectedCategories([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-gold mx-auto mb-4"></div>
          <h2 className="text-xl text-white mb-2">Loading Categories...</h2>
          <p className="text-gray-400">Fetching category data from database</p>
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
            <h2 className="text-xl text-white mb-2">Error Loading Categories</h2>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage your product categories</p>
        </div>
        <div className="flex space-x-3">
          {selectedCategories.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Trash2 size={16} />
              <span>Delete ({selectedCategories.length})</span>
            </button>
          )}
          <Link
            href="/admin/categories/add"
            className="bg-gradient-to-r from-soft-gold to-electric-blue text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Categories</p>
              <p className="text-white text-2xl font-bold">{categories.length}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Package size={24} className="text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-white text-2xl font-bold">
                {categories.reduce((sum, cat) => sum + (cat._count?.products || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Package size={24} className="text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Products/Category</p>
              <p className="text-white text-2xl font-bold">
                {Math.round(categories.reduce((sum, cat) => sum + (cat._count?.products || 0), 0) / categories.length)}
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Package size={24} className="text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Categories Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700/50"
      >
        {/* Table Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedCategories.length === categories.length}
                onChange={handleSelectAll}
                className="w-4 h-4 text-soft-gold bg-gray-700 border-gray-600 rounded focus:ring-soft-gold focus:ring-2"
              />
              <span className="text-white font-medium">
                {selectedCategories.length > 0 
                  ? `${selectedCategories.length} selected` 
                  : 'Select all categories'
                }
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              {categories.length} categories total
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="divide-y divide-gray-700/50">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-700/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleSelectCategory(category.id)}
                    className="w-4 h-4 text-soft-gold bg-gray-700 border-gray-600 rounded focus:ring-soft-gold focus:ring-2"
                  />
                  
                  <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                    <ImageIcon size={24} className="text-gray-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{category.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{category._count?.products || 0} products</span>
                      <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(category.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/categories/edit/${category.id}`}
                    className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                  >
                    <Edit size={16} className="text-gray-300" />
                  </Link>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}