'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingCart, ArrowLeft, Star, Truck, Shield, RefreshCw, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';

// Tunisia governorates list
const TUNISIA_GOVERNORATES = [
  'Ariana',
  'Béja',
  'Ben Arous',
  'Bizerte',
  'Gabès',
  'Gafsa',
  'Jendouba',
  'Kairouan',
  'Kasserine',
  'Kébili',
  'Le Kef',
  'Mahdia',
  'La Manouba',
  'Médenine',
  'Monastir',
  'Nabeul',
  'Sfax',
  'Sidi Bouzid',
  'Siliana',
  'Sousse',
  'Tataouine',
  'Tozeur',
  'Tunis',
  'Zaghouan'
];

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  category: Category;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Buy Now form state
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [buyFormData, setBuyFormData] = useState({
    fullName: '',
    phoneNumber: '',
    governorate: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Recommended products state
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [recommendedSlide, setRecommendedSlide] = useState(0);
  const [productsPerView, setProductsPerView] = useState(4);

  // Update productsPerView on window resize
  useEffect(() => {
    const updateProductsPerView = () => {
      if (window.innerWidth < 768) {
        setProductsPerView(1);
      } else if (window.innerWidth < 1024) {
        setProductsPerView(2);
      } else {
        setProductsPerView(4);
      }
    };

    updateProductsPerView();
    window.addEventListener('resize', updateProductsPerView);
    return () => window.removeEventListener('resize', updateProductsPerView);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return;
        }
        
        const productData = await response.json();
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  // Fetch recommended products (sorted by stock, highest first)
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      if (!params.id) return;
      
      try {
        setLoadingRecommended(true);
        const response = await fetch(`/api/products?limit=8&sortBy=stock&sortOrder=desc&excludeId=${params.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setRecommendedProducts(data.products || []);
        }
      } catch (err) {
        console.error('Error fetching recommended products:', err);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommendedProducts();
  }, [params.id]);

  // Slider controls for recommended products
  const maxSlide = Math.max(0, recommendedProducts.length - productsPerView);
  const slidePercentage = 100 / productsPerView;
  
  // Reset slide position when productsPerView changes (on resize)
  useEffect(() => {
    setRecommendedSlide((prev) => Math.min(prev, maxSlide));
  }, [productsPerView, maxSlide]);

  const prevRecommendedSlide = () => {
    setRecommendedSlide((prev) => Math.max(prev - 1, 0));
  };

  const nextRecommendedSlide = () => {
    setRecommendedSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    
    if (info.offset.x > swipeThreshold) {
      prevRecommendedSlide();
    } else if (info.offset.x < -swipeThreshold) {
      nextRecommendedSlide();
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Convert database product format to frontend Product type
    const productForCart = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      material: (product.category.name.toLowerCase().includes('leather') ? 'leather' : 'wood') as 'wood' | 'leather',
      images: product.images?.map(img => img.url) || ['/placeholder-product.jpg'],
      category: product.category.name,
      inStock: product.stock > 0,
      featured: false,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
    
    addToCart(productForCart, quantity);
  };

  const handleBuyNowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    // Validate required fields
    if (!buyFormData.fullName.trim() || !buyFormData.phoneNumber.trim() || !buyFormData.governorate) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity: quantity,
        totalPrice: product.price * quantity,
        customerName: buyFormData.fullName,
        customerPhone: buyFormData.phoneNumber,
        governorate: buyFormData.governorate,
        address: buyFormData.address || '',
        orderDate: new Date().toISOString()
      };
      
      const response = await fetch('/api/orders/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (response.ok) {
        setOrderSuccess(true);
        setBuyFormData({ fullName: '', phoneNumber: '', governorate: '', address: '' });
        setTimeout(() => {
          setShowBuyForm(false);
          setOrderSuccess(false);
        }, 3000);
      } else {
        throw new Error('Order submission failed');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-4">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="bg-muted h-96 rounded-lg"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-muted h-20 w-20 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-muted h-8 w-3/4 rounded"></div>
                <div className="bg-muted h-6 w-1/2 rounded"></div>
                <div className="bg-muted h-20 w-full rounded"></div>
                <div className="bg-muted h-12 w-1/3 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background pt-4">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {error || 'Product Not Found'}
            </h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/shop">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = product.images[selectedImageIndex] || { url: '/placeholder-product.jpg', alt: product.name };

  // Image navigation handlers
  const handleImageDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else if (info.offset.x < -swipeThreshold && selectedImageIndex < product.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex < product.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-4">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category.name}`} className="hover:text-foreground transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Main Image with Drag (Mobile) and Navigation Buttons (Desktop) */}
              <div className="aspect-square relative overflow-hidden rounded-lg bg-muted mb-4 group">
                <motion.div
                  key={selectedImageIndex}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={handleImageDragEnd}
                  className="relative w-full h-full cursor-grab active:cursor-grabbing lg:cursor-default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={currentImage.url}
                    alt={currentImage.alt}
                    fill
                    className="object-cover pointer-events-none"
                    priority
                  />
                </motion.div>

                {/* Navigation Buttons (Desktop only) */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      disabled={selectedImageIndex === 0}
                      className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      disabled={selectedImageIndex === product.images.length - 1}
                      className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-10">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index 
                          ? 'border-red-500' 
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-xl font-semibold text-red-500">${product.price}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">(4.8) 127 reviews</span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="quantity" className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      className="w-16 text-center bg-transparent focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1"
                    size="lg"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>

                {/* Buy Now Button */}
                <Button
                  onClick={() => setShowBuyForm(!showBuyForm)}
                  className="w-full bg-amber-600 hover:bg-amber-700 btn-vibrate"
                  size="lg"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Acheter Maintenant
                </Button>

                {/* Buy Now Form */}
                {showBuyForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border border-amber-200 rounded-lg p-6 bg-amber-50/50"
                  >
                    {orderSuccess ? (
                      <div className="text-center py-4">
                        <div className="text-green-600 text-lg font-semibold mb-2">
                          ✓ Commande envoyée avec succès!
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Nous vous contacterons bientôt pour confirmer votre commande.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleBuyNowSubmit} className="space-y-4">
                        <h4 className="text-lg font-semibold text-foreground mb-4">
                          Informations de Livraison
                        </h4>
                        
                        {/* Full Name */}
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
                            Nom Complet <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="Votre nom complet"
                            value={buyFormData.fullName}
                            onChange={(e) => setBuyFormData({ ...buyFormData, fullName: e.target.value })}
                            required
                            className="w-full"
                          />
                        </div>
                        
                        {/* Phone Number */}
                        <div>
                          <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground mb-1">
                            Numéro de Téléphone <span className="text-red-500">*</span>
                          </label>
                          <Input
                            id="phoneNumber"
                            type="tel"
                            placeholder="Ex: 55 123 456"
                            value={buyFormData.phoneNumber}
                            onChange={(e) => setBuyFormData({ ...buyFormData, phoneNumber: e.target.value })}
                            required
                            className="w-full"
                          />
                        </div>
                        
                        {/* Governorate Dropdown */}
                        <div>
                          <label htmlFor="governorate" className="block text-sm font-medium text-foreground mb-1">
                            Gouvernorat <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="governorate"
                            value={buyFormData.governorate}
                            onChange={(e) => setBuyFormData({ ...buyFormData, governorate: e.target.value })}
                            required
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="">Sélectionnez votre gouvernorat</option>
                            {TUNISIA_GOVERNORATES.map((gov) => (
                              <option key={gov} value={gov}>
                                {gov}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Address (Optional) */}
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1">
                            Adresse <span className="text-muted-foreground">(Optionnel)</span>
                          </label>
                          <textarea
                            id="address"
                            placeholder="Votre adresse complète"
                            value={buyFormData.address}
                            onChange={(e) => setBuyFormData({ ...buyFormData, address: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                          />
                        </div>
                        
                        {/* Order Summary */}
                        <div className="border-t border-amber-200 pt-4 mt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Produit:</span>
                            <span className="font-medium">{product.name}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Quantité:</span>
                            <span className="font-medium">{quantity}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Prix:</span>
                            <span className="font-medium">{(product.price * quantity).toFixed(3)} TND</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Frais de livraison:</span>
                            <span className="font-medium">7.000 TND</span>
                          </div>
                          <div className="border-t border-amber-200 mt-2 pt-2 flex justify-between text-lg font-semibold text-amber-700">
                            <span>Total:</span>
                            <span>{(product.price * quantity + 7).toFixed(3)} TND</span>
                          </div>
                        </div>
                        
                        {/* Submit Button */}
                        <Button
                          type="submit"
                          className="w-full bg-amber-600 hover:bg-amber-700"
                          size="lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Envoi en cours...
                            </span>
                          ) : (
                            'Confirmer la Commande'
                          )}
                        </Button>
                      </form>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* Features */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">1 year warranty</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">30-day return policy</span>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                Category: 
                <Link 
                  href={`/shop?category=${product.category.name}`}
                  className="text-foreground hover:text-red-500 transition-colors ml-1"
                >
                  {product.category.name}
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Recommended Products Section */}
        {recommendedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 pt-12 border-t border-border"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Produits qui pourraient vous plaire
                </h2>
                <p className="text-muted-foreground text-sm">
                  Découvrez nos autres créations populaires
                </p>
              </div>
              
              {/* Slider Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevRecommendedSlide}
                  disabled={recommendedSlide === 0}
                  className={`p-2 rounded-full border transition-all duration-300 ${
                    recommendedSlide === 0
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-500'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextRecommendedSlide}
                  disabled={recommendedSlide >= maxSlide}
                  className={`p-2 rounded-full border transition-all duration-300 ${
                    recommendedSlide >= maxSlide
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-500'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Products Slider */}
            {loadingRecommended ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-muted aspect-[3/4] rounded-lg mb-4"></div>
                    <div className="bg-muted h-4 rounded w-3/4 mb-2"></div>
                    <div className="bg-muted h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative overflow-hidden">
                <motion.div
                  animate={{ x: `-${recommendedSlide * slidePercentage}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={handleDragEnd}
                  className="flex cursor-grab active:cursor-grabbing"
                >
                  {recommendedProducts.map((recProduct) => (
                    <div
                      key={recProduct.id}
                      className="w-full md:w-1/2 lg:w-1/4 flex-shrink-0 px-3"
                    >
                      <ProductCard
                        product={{
                          id: recProduct.id,
                          name: recProduct.name,
                          description: recProduct.description,
                          price: recProduct.price,
                          material: (recProduct.category.name.toLowerCase().includes('leather') ? 'leather' : 'wood') as 'leather' | 'wood',
                          images: recProduct.images?.map(img => img.url) || ['/placeholder-product.jpg'],
                          category: recProduct.category.name,
                          inStock: recProduct.stock > 0,
                          featured: false,
                          createdAt: recProduct.createdAt,
                          updatedAt: recProduct.updatedAt,
                        }}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Mobile: Dots indicator */}
            <div className="flex justify-center mt-6 space-x-2 md:hidden">
              {recommendedProducts.slice(0, Math.min(8, recommendedProducts.length)).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setRecommendedSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === recommendedSlide
                      ? 'bg-amber-600 w-6'
                      : 'bg-gray-300 w-2 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}