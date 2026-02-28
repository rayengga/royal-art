'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, PanInfo } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Lazy load UI components to reduce initial bundle size
const Button = dynamic(() => import('@/components/ui/Button').then(mod => ({ default: mod.Button })), {
  loading: () => <button className="w-full py-6 bg-gray-200 animate-pulse rounded-lg" disabled>Loading...</button>
});
const Input = dynamic(() => import('@/components/ui/Input').then(mod => ({ default: mod.Input })), {
  loading: () => <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
});

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

export default function BuyNowPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // Buy Now form state
  const [buyFormData, setBuyFormData] = useState({
    fullName: '',
    phoneNumber: '',
    governorate: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  // Image navigation handlers
  const handleImageDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else if (info.offset.x < -swipeThreshold && product && selectedImageIndex < product.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (product && selectedImageIndex < product.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleBuyNowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);

    try {
      const orderData = {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity,
        totalPrice: (product.price * quantity) + 7, // Including 7 TND delivery
        customerName: buyFormData.fullName,
        customerPhone: buyFormData.phoneNumber,
        governorate: buyFormData.governorate,
        address: buyFormData.address,
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
        setQuantity(1);
        
        // Redirect to home or success page after 3 seconds
        setTimeout(() => {
          router.push('/');
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
                <div className="bg-muted h-20 w-full rounded"></div>
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
          </div>
        </div>
      </div>
    );
  }

  const currentImage = product.images[selectedImageIndex] || { url: '/placeholder-product.jpg', alt: product.name };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
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

          {/* Buy Now Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-amber-50 to-blue-50 rounded-2xl p-8 shadow-xl border border-amber-200">
              {orderSuccess ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-3">Commande confirmée !</h3>
                  <p className="text-amber-700 mb-4">Merci pour votre commande. Nous vous contacterons bientôt.</p>
                  <p className="text-sm text-amber-600">Redirection vers la page d'accueil...</p>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-amber-900 mb-2">Commander maintenant</h2>
                  <p className="text-amber-700 mb-6">{product.name}</p>
                  
                  <form onSubmit={handleBuyNowSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-amber-900 mb-2">
                        Nom complet *
                      </label>
                      <Input
                        type="text"
                        required
                        value={buyFormData.fullName}
                        onChange={(e) => setBuyFormData({ ...buyFormData, fullName: e.target.value })}
                        placeholder="Votre nom complet"
                        className="bg-white border-amber-300 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-900 mb-2">
                        Numéro de téléphone *
                      </label>
                      <Input
                        type="tel"
                        required
                        value={buyFormData.phoneNumber}
                        onChange={(e) => setBuyFormData({ ...buyFormData, phoneNumber: e.target.value })}
                        placeholder="+216 XX XXX XXX"
                        className="bg-white border-amber-300 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-900 mb-2">
                        Gouvernorat *
                      </label>
                      <select
                        required
                        value={buyFormData.governorate}
                        onChange={(e) => setBuyFormData({ ...buyFormData, governorate: e.target.value })}
                        className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                      >
                        <option value="">Sélectionnez un gouvernorat</option>
                        {TUNISIA_GOVERNORATES.map((gov) => (
                          <option key={gov} value={gov}>{gov}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-900 mb-2">
                        Adresse de livraison
                      </label>
                      <textarea
                        value={buyFormData.address}
                        onChange={(e) => setBuyFormData({ ...buyFormData, address: e.target.value })}
                        placeholder="Adresse complète (optionnel)"
                        rows={3}
                        className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-900 mb-2">
                        Quantité
                      </label>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold transition-colors"
                        >
                          -
                        </button>
                        <span className="text-2xl font-bold text-amber-900 min-w-[3rem] text-center">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          disabled={quantity >= product.stock}
                          className="w-10 h-10 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-amber-600 mt-1">{product.stock} articles disponibles</p>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border-2 border-amber-300">
                      <h3 className="text-lg font-semibold text-amber-900 mb-4">Résumé de la commande</h3>
                      <div className="space-y-3">
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
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || product.stock === 0}
                      className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Traitement en cours...
                        </span>
                      ) : (
                        'Confirmer la commande'
                      )}
                    </Button>

                    <p className="text-xs text-center text-amber-600 mt-4">
                      En passant commande, vous acceptez nos conditions de vente.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
