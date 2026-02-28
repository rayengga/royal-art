'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/helpers';

interface ProductCardProps {
  product: Product;
  className?: string;
  /** Set true for the first visible card to trigger LCP preload */
  priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '', priority = false }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className={`group relative bg-background ${className}`}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-6xl text-gray-300">📦</span>
            </div>
          )}
          
          {/* Quick Add Button - Appears on Hover */}
          {product.inStock && (
            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full bg-white text-gray-900 py-3 font-light tracking-[0.15em] text-xs uppercase transition-all duration-300 hover:bg-gray-900 hover:text-white flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Ajout rapide</span>
              </motion.button>
            </div>
          )}
          
          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
              <div className="text-gray-600 px-6 py-3 font-light tracking-[0.2em] text-xs uppercase">
                Rupture de stock
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="pt-4 pb-2 space-y-2 bg-white">
          <h3 className="text-sm font-light text-gray-900 tracking-wide leading-relaxed uppercase">
            {product.name}
          </h3>

          <div className="text-base font-normal text-gray-900">
            {formatPrice(product.price)}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;