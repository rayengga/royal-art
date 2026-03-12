'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/**
 * All entrance animations use CSS @keyframes (animate-fade-up + delay variants
 * defined in globals.css) instead of Framer Motion's initial/animate props.
 *
 * Why: Framer Motion sets initial={{ opacity: 0 }} on the CLIENT but the server
 * renders the element at full opacity, causing a React hydration mismatch on
 * every single page load. CSS animations start identically on server and client.
 *
 * Only whileHover / whileTap remain on interactive buttons — those are purely
 * client-side events and never cause hydration issues.
 */
const Hero = () => {
  const t = useTranslations('hero');
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50/50 to-white">
      {/* Subtle dot pattern background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </div>

      {/* Background Image with elegant overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: "url('https://royal-artisanat.store/images/royart/about-banner-01.png')" }}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="max-w-5xl mx-auto">

          {/* Top Badge */}
          <div className="animate-fade-up animate-delay-200 flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-amber-400" />
            <span className="text-sm tracking-[0.2em] text-amber-700 uppercase font-light">{t('badge')}</span>
            <div className="h-px w-12 bg-amber-400" />
          </div>

          {/* Main Heading — LCP element; CSS animation keeps it visible for the browser's LCP measurement */}
          <div className="animate-fade-up animate-delay-300 mb-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 leading-tight">
              {t('welcomeTo')}
            </h1>
            <div className="flex justify-center mt-2">
              <div className="overflow-hidden w-[380px] sm:w-[420px] md:w-[520px] lg:w-[630px] h-[150px] sm:h-[160px] md:h-[200px] lg:h-[240px]">
                <Image
                  src="/royal_artisanat.svg"
                  alt="Royal Artisanat"
                  width={1264}
                  height={848}
                  className="w-full h-auto -mt-[18%]"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Subtitles */}
          <p className="animate-fade-up animate-delay-400 text-xl sm:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed font-light">
            {t('subtitle')}
          </p>

          <p className="animate-fade-up animate-delay-500 text-base sm:text-lg text-gray-500 mb-12 max-w-2xl mx-auto font-light">
            {t('subtitle2')}
          </p>

          {/* CTA Buttons — motion.button is fine here: whileHover/whileTap are client-only */}
          <div className="animate-fade-up animate-delay-600 flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-4 font-light tracking-wide transition-colors inline-flex items-center gap-3"
              >
                <span>{t('cta')}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border border-amber-600 text-amber-800 hover:bg-amber-50 px-10 py-4 font-light tracking-wide transition-colors"
              >
                {t('ourStory')}
              </motion.button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;