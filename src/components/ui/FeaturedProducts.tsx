'use client';

import React, { useEffect, useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string; alt: string }[];
  category: { name: string };
}

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=3');
        const data = await response.json();
        setFeaturedProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Slider controls
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };



  // Handle touch/swipe gestures
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    
    if (info.offset.x > swipeThreshold) {
      prevSlide();
    } else if (info.offset.x < -swipeThreshold) {
      nextSlide();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-amber-50/30 to-white relative overflow-hidden">
      {/* Subtle dot pattern background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-px w-12 bg-amber-400" />
            <span className="text-sm tracking-[0.2em] text-amber-700 uppercase font-light">Produits</span>
            <div className="h-px w-12 bg-amber-400" />
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Nos <span className="block font-serif italic text-amber-800 mt-2">Créations Vedettes</span>
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg text-gray-600 font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Découvrez nos sacs artisanaux les plus populaires, façonnés avec soin et attention aux détails
          </motion.p>
        </motion.div>

        {/* Products Grid/Slider */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white border border-amber-200/50 p-4">
                  <div className="bg-gray-200 h-64 mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 mb-16">
            <p className="text-lg text-gray-600 font-light">Aucun produit disponible pour le moment.</p>
            <p className="text-sm text-gray-500 font-light mt-2">Revenez bientôt pour découvrir nos nouveautés!</p>
          </div>
        ) : (
          <div className="relative mb-16">
            {/* Desktop Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
              {featuredProducts.map((product, index) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                >
                  <ProductCard 
                    product={{
                      id: product.id,
                      name: product.name,
                      description: product.description,
                      price: product.price,
                      material: (product.category?.name?.toLowerCase().includes('leather') ? 'leather' : 'wood') as 'leather' | 'wood',
                      images: product.images?.map(img => img.url) || ['/placeholder-product.jpg'],
                      category: product.category?.name || 'Unknown',
                      inStock: true,
                      featured: true,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    }}
                    priority={index === 0}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile Slider */}
            {featuredProducts.length > 0 && (
              <div className="md:hidden relative">
                <div className="flex justify-between items-center mb-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-white border border-amber-200/50 hover:border-amber-400 transition-all duration-300 shadow-sm"
                  >
                    <ChevronLeft className="w-6 h-6 text-amber-700" />
                  </motion.button>

                  <div className="text-center">
                    <span className="text-sm font-light text-gray-600">
                      {currentSlide + 1} / {featuredProducts.length}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-white border border-amber-200/50 hover:border-amber-400 transition-all duration-300 shadow-sm"
                  >
                    <ChevronRight className="w-6 h-6 text-amber-700" />
                  </motion.button>
                </div>

                <div className="overflow-hidden">
                  <motion.div
                    animate={{ x: `-${currentSlide * 100}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={handleDragEnd}
                    className="flex cursor-grab active:cursor-grabbing"
                  >
                    {featuredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        className="w-full flex-shrink-0 px-2"
                      >
                        <motion.div
                          initial={{ opacity: 0.8, scale: 0.95 }}
                          animate={{ 
                            opacity: index === currentSlide ? 1 : 0.8,
                            scale: index === currentSlide ? 1 : 0.95 
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <ProductCard 
                            product={{
                              id: product.id,
                              name: product.name,
                              description: product.description,
                              price: product.price,
                              material: (product.category?.name?.toLowerCase().includes('leather') ? 'leather' : 'wood') as 'leather' | 'wood',
                              images: product.images?.map(img => img.url) || ['/placeholder-product.jpg'],
                              category: product.category?.name || 'Unknown',
                              inStock: true,
                              featured: true,
                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString(),
                            }} 
                          />
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <div className="flex justify-center space-x-2 mt-6">
                  {featuredProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-amber-600 w-8' 
                          : 'bg-amber-200 w-2 hover:bg-amber-300'
                      }`}
                    />
                  ))}
                </div>

                <motion.div 
                  className="mt-4 text-center text-sm text-gray-500 font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Glissez pour découvrir nos produits
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-4 font-light tracking-wide transition-colors inline-flex items-center gap-3"
            >
              <span>Voir tous les produits</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;