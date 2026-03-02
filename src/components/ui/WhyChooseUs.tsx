'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Palette, Shield, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const WhyChooseUs = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations('whyChooseUs');

  const features = [
    {
      icon: Scissors,
      title: t('feature1Title'),
      description: t('feature1Desc')
    },
    {
      icon: Palette,
      title: t('feature2Title'),
      description: t('feature2Desc')
    },
    {
      icon: Shield,
      title: t('feature3Title'),
      description: t('feature3Desc')
    },
    {
      icon: Heart,
      title: t('feature4Title'),
      description: t('feature4Desc')
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Native touch swipe handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative">
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
            <span className="text-sm tracking-[0.2em] text-amber-700 uppercase font-light">{t('badge')}</span>
            <div className="h-px w-12 bg-amber-400" />
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {t('titlePart1')} <span className="block font-serif italic text-amber-800 mt-2">{t('titlePart2')}</span>
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg text-gray-600 font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {t('description')}
          </motion.p>
        </motion.div>

        {/* Desktop Grid - 4 columns */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-gradient-to-br from-white to-amber-50/30 border-2 border-amber-200/50 hover:border-amber-400 p-8 transition-all duration-300 h-full flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-300/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <IconComponent className="w-10 h-10 text-amber-700" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-lg font-light text-gray-900 mb-4 group-hover:text-amber-800 transition-colors duration-300 leading-snug">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 font-light leading-relaxed text-sm flex-grow">
                      {feature.description}
                    </p>

                    <div className="mt-6 pt-4 border-t border-amber-200/50 w-full">
                      <div className="h-1 w-12 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto group-hover:w-20 transition-all duration-300" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Slider */}
        <div className="lg:hidden">
          <div className="relative">
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
                  {currentSlide + 1} / {features.length}
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

            <div
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                animate={{ x: `-${currentSlide * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex"
              >
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  
                  return (
                    <div
                      key={feature.title}
                      className="w-full flex-shrink-0 px-2"
                    >
                      <motion.div
                        animate={{ 
                          opacity: index === currentSlide ? 1 : 0.8,
                          scale: index === currentSlide ? 1 : 0.95
                        }}
                        transition={{ duration: 0.5 }}
                        className="relative bg-gradient-to-br from-white to-amber-50/30 border-2 border-amber-200/50 p-10 transition-all duration-300 flex flex-col h-[420px]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 transition-opacity duration-300" style={{ opacity: index === currentSlide ? 0.5 : 0 }} />

                        <div className="relative flex flex-col items-center text-center">
                          <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-300/50">
                            <IconComponent className="w-12 h-12 text-amber-700" strokeWidth={1.5} />
                          </div>

                          <h3 className="text-xl font-light text-gray-900 mb-4 leading-snug">
                            {feature.title}
                          </h3>
                          
                          <p className="text-gray-600 font-light leading-relaxed flex-grow">
                            {feature.description}
                          </p>

                          <div className="mt-6 pt-4 border-t border-amber-200/50 w-full">
                            <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto" />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            <div className="flex justify-center space-x-2 mt-6">
              {features.map((_, index) => (
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
              {t('swipeHint')}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
