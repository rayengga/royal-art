'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Eye, Download, Search, Grid, List, Plus, X, AlertCircle, ImageIcon, Copy, Check } from 'lucide-react';
import Image from 'next/image';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  product: {
    id: string;
    name: string;
  };
}

interface ImageStats {
  totalImages: number;
  totalProducts: number;
  recentUploads: number;
}

interface ProductOption {
  id: string;
  name: string;
}

export default function ImagesPage() {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [stats, setStats] = useState<ImageStats>({
    totalImages: 0,
    totalProducts: 0,
    recentUploads: 0,
  });

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadProductId, setUploadProductId] = useState('');
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview modal state
  const [previewImage, setPreviewImage] = useState<ProductImage | null>(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<ProductImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Copy URL feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/images');
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(data.images || []);
      setStats(data.stats || { totalImages: 0, totalProducts: 0, recentUploads: 0 });
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=100');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products?.map((p: any) => ({ id: p.id, name: p.name })) || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchProducts();
  }, []);

  // ── Upload handlers ──────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
    if (!uploadAlt) setUploadAlt(file.name.replace(/\.[^.]+$/, ''));
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadProductId) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('productId', uploadProductId);
      formData.append('alt', uploadAlt || 'Product image');

      const response = await fetch('/api/admin/images', { method: 'POST', body: formData });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }
      closeUploadModal();
      await fetchImages();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadPreview(null);
    setUploadProductId('');
    setUploadAlt('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Delete handler ───────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await fetch('/api/admin/images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: deleteTarget.id }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Delete failed');
      }
      setDeleteTarget(null);
      await fetchImages();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  // ── Copy URL handler ─────────────────────────────────────────────
  const handleCopyUrl = async (image: ProductImage) => {
    const fullUrl = `${window.location.origin}${image.url}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(image.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = fullUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(image.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // ── Download handler ─────────────────────────────────────────────
  const handleDownload = (image: ProductImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.alt || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredImages = images.filter(image =>
    image.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-gold mx-auto mb-4"></div>
          <h2 className="text-xl text-white mb-2">Loading Images...</h2>
          <p className="text-gray-400">Fetching image data from database</p>
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
            <h2 className="text-xl text-white mb-2">Error Loading Images</h2>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Images</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage product images and media files</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-r from-soft-gold to-laser-red text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus size={20} />
          <span>Upload Images</span>
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        {[
          { 
            title: 'Total Images', 
            value: stats.totalImages, 
            color: 'bg-blue-500/20', 
            textColor: 'text-blue-400',
            icon: ImageIcon 
          },
          { 
            title: 'Products with Images', 
            value: stats.totalProducts, 
            color: 'bg-green-500/20', 
            textColor: 'text-green-400',
            icon: Grid 
          },
          { 
            title: 'Recent Uploads', 
            value: stats.recentUploads, 
            color: 'bg-purple-500/20', 
            textColor: 'text-purple-400',
            icon: Upload 
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

      {/* Controls */}
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
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors w-full sm:w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Showing {filteredImages.length} of {images.length} images
            </div>
            <div className="flex bg-gray-700/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-soft-gold text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-soft-gold text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Images Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {filteredImages.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700/50 p-12 text-center">
            <ImageIcon size={64} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No Images Found</h3>
            <p className="text-gray-500">
              {searchQuery 
                ? 'No images match your search query.' 
                : 'No product images have been uploaded yet.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700/50 overflow-hidden hover:border-soft-gold/50 transition-all group"
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      <button
                        onClick={() => setPreviewImage(image)}
                        className="p-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        title="Preview"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleCopyUrl(image)}
                        className="p-2 bg-amber-500/80 text-white rounded-lg hover:bg-amber-600 transition-colors"
                        title="Copy URL"
                      >
                        {copiedId === image.id ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                      <button
                        onClick={() => handleDownload(image)}
                        className="p-2 bg-green-500/80 text-white rounded-lg hover:bg-green-600 transition-colors"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(image)}
                        className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-white font-medium truncate">{image.alt}</h4>
                  <p className="text-gray-400 text-sm mt-1">{image.product.name}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      Product Image
                    </span>
                    <span className="text-xs text-soft-gold">
                      {image.url.split('.').pop()?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-medium">Preview</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Name</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Product</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Type</th>
                    <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {filteredImages.map((image, index) => (
                    <motion.tr
                      key={image.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={image.url}
                            alt={image.alt}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-white font-medium">{image.alt}</p>
                        <p className="text-sm text-gray-400 truncate max-w-xs">{image.url}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-300">{image.product.name}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                          {image.url.split('.').pop()?.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setPreviewImage(image)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                            title="Preview"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleCopyUrl(image)}
                            className="p-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors"
                            title="Copy URL"
                          >
                            {copiedId === image.id ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                          <button
                            onClick={() => handleDownload(image)}
                            className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(image)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Upload Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeUploadModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Upload Image</h2>
                <button onClick={closeUploadModal} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-soft-gold transition-colors"
                >
                  {uploadPreview ? (
                    <div className="relative w-full h-48">
                      <Image src={uploadPreview} alt="Preview" fill className="object-contain rounded-lg" />
                    </div>
                  ) : (
                    <>
                      <Upload size={40} className="mx-auto text-gray-500 mb-3" />
                      <p className="text-gray-400">Click to select an image</p>
                      <p className="text-gray-500 text-sm mt-1">JPEG, PNG, WebP, AVIF, GIF · Max 5MB</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Product *</label>
                  <select
                    value={uploadProductId}
                    onChange={(e) => setUploadProductId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-soft-gold transition-colors"
                  >
                    <option value="">Select a product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Alt text</label>
                  <input
                    type="text"
                    value={uploadAlt}
                    onChange={(e) => setUploadAlt(e.target.value)}
                    placeholder="Describe the image..."
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-soft-gold transition-colors"
                  />
                </div>

                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || !uploadProductId || uploading}
                  className="w-full bg-gradient-to-r from-soft-gold to-laser-red text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      <span>Upload Image</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Preview Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[85vh] bg-gray-900 rounded-xl overflow-hidden border border-gray-700"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div>
                  <h3 className="text-white font-medium">{previewImage.alt}</h3>
                  <p className="text-gray-400 text-sm">{previewImage.product.name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyUrl(previewImage)}
                    className="p-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === previewImage.id ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                  <button
                    onClick={() => handleDownload(previewImage)}
                    className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                  <button onClick={() => setPreviewImage(null)} className="text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="relative w-full" style={{ height: '70vh' }}>
                <Image src={previewImage.url} alt={previewImage.alt} fill className="object-contain" />
              </div>
              <div className="p-3 border-t border-gray-700 flex items-center justify-between">
                <span className="text-gray-400 text-sm truncate">{previewImage.url}</span>
                <button
                  onClick={() => handleCopyUrl(previewImage)}
                  className="text-sm text-amber-400 hover:text-amber-300 flex items-center space-x-1 flex-shrink-0 ml-2"
                >
                  {copiedId === previewImage.id ? (
                    <><Check size={14} /><span>Copied!</span></>
                  ) : (
                    <><Copy size={14} /><span>Copy URL</span></>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ──────────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-sm text-center"
            >
              <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={28} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Delete Image?</h3>
              <p className="text-gray-400 text-sm mb-1">{deleteTarget.alt}</p>
              <p className="text-gray-500 text-xs mb-6">This action cannot be undone.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {deleting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <span>Delete</span>
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