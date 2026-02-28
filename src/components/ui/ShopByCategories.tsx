'use client';

import React, { useEffect, useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  _count: {
    products: number;
  };
  products: Array<{
    images: Array<{
      url: string;
      alt: string;
    }>;
  }>;
}

const ShopByCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?include=products');
        const data = await response.json();
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Categories data is not an array:', data);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);



  const getCategoryImage = (category: Category) => {
    if (category.products && category.products.length > 0) {
      const firstProduct = category.products[0];
      if (firstProduct.images && firstProduct.images.length > 0) {
        return firstProduct.images[0].url;
      }
    }
    return '/images/placeholder-category.jpg';
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % categories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      prevSlide();
    } else if (info.offset.x < -swipeThreshold) {
      nextSlide();
    }
  };


  return (
    <section className="py-16 sm:py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl mx-auto mb-12 sm:mb-16"
        >
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-serif italic text-amber-800 mb-4 tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            La Sélection De La Maison
          </motion.h2>

          <motion.p
            className="text-sm sm:text-base text-gray-600 font-light tracking-wide uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Découvrez nos collections
          </motion.p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : Array.isArray(categories) && categories.length > 0 ? (
          <>
            {/* Desktop Grid - 4 columns in one line */}
            <div className="hidden md:grid md:grid-cols-4 gap-4 lg:gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={`/shop?category=${category.id}`} className="group block">
                    <motion.div className="relative overflow-hidden bg-gray-100">
                      {/* Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <Image
                          src={getCategoryImage(category)}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </motion.div>
                    
                    {/* Text Below Image */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="mt-4"
                    >
                      <h3 className="text-xl lg:text-2xl font-light mb-2 tracking-wide text-gray-900">
                        {category.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                        <span className="text-sm font-light tracking-wider uppercase">Découvrir</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Slider */}
            <div className="md:hidden">
              {categories.length > 0 && (
                <div className="relative -mx-4 sm:-mx-6">
                  <div className="overflow-hidden">
                    <motion.div
                      animate={{ x: `-${currentSlide * 100}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.1}
                      onDragEnd={handleDragEnd}
                      className="flex"
                    >
                      {categories.map((category, index) => (
                        <motion.div
                          key={category.id}
                          className="w-full flex-shrink-0 px-4 sm:px-6"
                        >
                          <Link href={`/shop?category=${category.id}`}>
                            <motion.div
                              initial={{ opacity: 0.8, scale: 0.98 }}
                              animate={{ 
                                opacity: index === currentSlide ? 1 : 0.8,
                                scale: index === currentSlide ? 1 : 0.98
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              {/* Image Container */}
                              <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-gray-100">
                                <Image
                                  src={getCategoryImage(category)}
                                  alt={category.name}
                                  fill
                                  className="object-cover"
                                  sizes="100vw"
                                  priority={index === 0}
                                />
                              </div>

                              {/* Text Below Image */}
                              <div className="mt-4">
                                <h3 className="text-xl sm:text-2xl font-light mb-2 tracking-wide text-gray-900">
                                  {category.name}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-gray-600">
                                  <span className="text-sm font-light tracking-wider uppercase">Découvrir</span>
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Dots Navigation */}
                  <div className="flex justify-center gap-2 mt-6">
                    {categories.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-gray-900 w-8' 
                            : 'bg-gray-300 w-1.5'
                        }`}
                        aria-label={`Aller à la collection ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucune catégorie disponible pour le moment.</p>
          </div>
        )}

        {/* Explore Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center mt-12 sm:mt-16"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ backgroundColor: '#1f2937' }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-900 text-white px-12 py-4 font-light tracking-widest text-sm uppercase transition-all duration-300 inline-flex items-center gap-3 hover:gap-4"
            >
              <span>Explorer toutes les collections</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ShopByCategories;