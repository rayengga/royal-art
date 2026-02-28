'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Image as ImageIcon, Search, Filter, Eye, AlertCircle, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  category: {
    id: string;
    name: string;
  };
  images: {
    id: string;
    url: string;
    alt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (productId: string) => {
    const url = `${window.location.origin}/buy/${productId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(productId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/products?limit=100'),
          fetch('/api/categories')
        ]);
        
        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        
        setProducts(productsData.products || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: product.category.id,
          isActive: !currentStatus,
        }),
      });
      
      if (response.ok) {
        setProducts(products.map(p => 
          p.id === productId 
            ? { ...p, isActive: !currentStatus }
            : p
        ));
      } else {
        alert('Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product status');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-gold mx-auto mb-4"></div>
          <h2 className="text-xl text-white mb-2">Loading Products...</h2>
          <p className="text-gray-400">Fetching product data from database</p>
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
            <h2 className="text-xl text-white mb-2">Error Loading Products</h2>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage your product inventory</p>
        </div>
        <Link href="/admin/products/add">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-soft-gold to-warm-gold text-gray-900 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold flex items-center space-x-2 hover:shadow-lg transition-all duration-300 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </motion.button>
        </Link>
      </motion.div>

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
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors w-full sm:w-64"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-soft-gold transition-colors appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700/50 overflow-hidden hover:border-soft-gold/30 transition-all duration-300"
          >
            {/* Product Image */}
            <div className="relative h-48 bg-gray-700">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon size={48} className="text-gray-500" />
                </div>
              )}
              <div className="absolute top-3 right-3 flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.isActive 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-white mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  {product.category.name}
                </p>
              </div>

              <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-soft-gold text-lg font-bold">
                    ${product.price}
                  </span>
                </div>
                <div className="text-sm">
                  <span className={`${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    Stock: {product.stock}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between space-x-2">
                <div className="flex space-x-2">
                  <Link href={`/product/${product.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                      title="View Product"
                    >
                      <Eye size={16} />
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopyLink(product.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      copiedId === product.id
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                    }`}
                    title="Copy buy link"
                  >
                    {copiedId === product.id ? <Check size={16} /> : <Copy size={16} />}
                  </motion.button>
                  <Link href={`/admin/products/edit/${product.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-soft-gold/20 text-soft-gold rounded-lg hover:bg-soft-gold/30 transition-colors"
                      title="Edit Product"
                    >
                      <Edit size={16} />
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleProductStatus(product.id, product.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      product.isActive 
                        ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                    title={product.isActive ? 'Deactivate Product' : 'Activate Product'}
                  >
                    {product.isActive ? '⏸️' : '▶️'}
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  title="Delete Product"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredProducts.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-500 mb-4">
            <ImageIcon size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl text-gray-400 mb-2">No Products Found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedCategory 
              ? 'No products match your current filters.' 
              : 'Start by adding your first product.'}
          </p>
          {(!searchQuery && !selectedCategory) && (
            <Link href="/admin/products/add">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-soft-gold to-warm-gold text-gray-900 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto hover:shadow-lg transition-all duration-300"
              >
                <Plus size={20} />
                <span>Add Your First Product</span>
              </motion.button>
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AdminProductsPage;