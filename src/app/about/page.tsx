'use client';

import { motion, useScroll, useTransform, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState, useEffect, useMemo } from 'react';
import { 
  Target, 
  Award, 
  Heart, 
  Users,
  Scissors,
  Palette,
  Shield,
  Sparkles,
  Star,
  Facebook,
  Instagram,
  MessageCircle,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Generate fixed random positions for sparkles to avoid hydration mismatch
  const sparklePositions = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      xOffset: Math.random() * 20 - 10,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 5
    })), 
    []
  );

  // Generate fixed positions for stats background shapes
  const statsShapePositions = useMemo(() => 
    Array.from({ length: 5 }, () => Math.random() * 100),
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { label: 'Clients Satisfaits', value: '1,000+', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Sacs Fabriqués', value: '5,000+', icon: Scissors, color: 'from-amber-500 to-orange-500' },
    { label: 'Années d\'Excellence', value: '29+', icon: Award, color: 'from-purple-500 to-pink-500' },
    { label: 'Modèles Uniques', value: '200+', icon: Star, color: 'from-rose-500 to-red-500' }
  ];

  const values = [
    {
      icon: Scissors,
      title: 'Matériaux de haute qualité',
      description: 'Conçus avec précision et excellence, nos sacs sont élaborés avec des matériaux de haute qualité pour assurer un confort et une durabilité sans égal.',
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-500/30'
    },
    {
      icon: Palette,
      title: 'Design raffiné',
      description: 'Simplicité raffinée. Nos créations expriment l\'essence du design minimaliste, offrant un style élégant qui parle de lui-même.',
      gradient: 'from-rose-500/20 to-pink-500/20',
      iconColor: 'text-rose-600',
      borderColor: 'border-rose-500/30'
    },
    {
      icon: Shield,
      title: 'Différentes tailles',
      description: 'Conçus pour tous les corps et tout le monde, nos sacs embrassent la diversité avec une large gamme de tailles et de formes, célébrant la beauté de l\'individualité.',
      gradient: 'from-orange-500/20 to-amber-500/20',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-500/30'
    },
    {
      icon: Heart,
      title: 'Artisanat authentique',
      description: 'Chaque pièce raconte une histoire, façonnée avec soin par des artisans talentueux, dans le respect des traditions et du savoir-faire ancestral du Maghreb.',
      gradient: 'from-pink-500/20 to-rose-500/20',
      iconColor: 'text-pink-600',
      borderColor: 'border-pink-500/30'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % values.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + values.length) % values.length);
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
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-orange-50/20 overflow-hidden">
      {/* Floating Background Elements - Only render on client to avoid hydration mismatch */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {sparklePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute hidden sm:block"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, pos.xOffset, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: pos.duration,
                repeat: Infinity,
                delay: pos.delay,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Hero Section - Professional Design */}
      <section className="relative pt-20 pb-32 sm:pt-24 sm:pb-40 overflow-hidden bg-gradient-to-b from-white via-amber-50/30 to-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(217 119 6) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Elegant Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
        
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative">
          <div className="max-w-4xl mx-auto">
            {/* Minimalist Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
              <span className="text-sm tracking-[0.2em] text-amber-700 font-light uppercase">
                Since 1995
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
            </motion.div>

            {/* Main Heading - Refined Typography */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 mb-6 tracking-tight leading-[1.1]">
                Royal
                <span className="block font-serif italic mt-2 bg-gradient-to-br from-amber-800 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Artisanat
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                L'excellence de l'artisanat tunisien au service de votre élégance
              </p>
            </motion.div>

            {/* Elegant Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-px w-24 mx-auto bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 mb-12"
            />

            {/* Refined Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-16 font-light"
            >
              Depuis près de trois décennies, nous créons des sacs à main qui incarnent le raffinement et l'authenticité. 
              Chaque pièce est une célébration du savoir-faire ancestral maghrébin, réinterprété avec une sensibilité contemporaine.
            </motion.p>

            {/* Sophisticated Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="grid grid-cols-3 gap-px bg-amber-200/30 rounded-lg overflow-hidden max-w-3xl mx-auto"
            >
              {[
                { value: '29', suffix: 'ans', label: 'D\'excellence' },
                { value: '5K', suffix: '+', label: 'Créations' },
                { value: '200', suffix: '+', label: 'Modèles' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.75 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm p-8 text-center group hover:bg-amber-50/50 transition-colors duration-300"
                >
                  <div className="mb-2">
                    <span className="text-4xl sm:text-5xl font-light text-gray-900 tabular-nums">
                      {stat.value}
                    </span>
                    <span className="text-2xl sm:text-3xl font-light text-amber-600">
                      {stat.suffix}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 tracking-wide uppercase font-light">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Minimal Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3"
          >
            <span className="text-xs text-gray-400 tracking-widest uppercase font-light">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-amber-400 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Notre Histoire Section - Professional Design */}
      <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
        {/* Subtle Background Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-50/40 to-transparent" />
        
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="https://royal-artisanat.store/images/products/about-us-01.jpg"
                  alt="Royal Artisanat craftsmanship"
                  fill
                  className="object-cover"
                />
                {/* Elegant Border Overlay */}
                <div className="absolute inset-0 border border-amber-900/10" />
              </div>
              
              {/* Floating Year Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-6 -right-6 bg-white shadow-2xl px-8 py-6 border border-amber-100"
              >
                <div className="text-5xl font-light text-gray-900 tabular-nums">1995</div>
                <div className="text-xs text-gray-500 tracking-widest uppercase mt-1">Fondation</div>
              </motion.div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              {/* Section Label */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="h-px w-12 bg-amber-400" />
                <span className="text-sm tracking-[0.2em] text-amber-700 uppercase font-light">
                  Notre Histoire
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2 
                className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-8 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Une passion pour
                <span className="block font-serif italic text-amber-800 mt-2">
                  l'artisanat authentique
                </span>
              </motion.h2>

              {/* Content */}
              <div className="space-y-6">
                {[
                  "Royal Artisanat est née de la passion pour l'artisanat authentique. Nous créons à la main des sacs pour femmes, des couffins et des trousses en mêlant avec finesse les inspirations marocaines et tunisiennes.",
                  "Chaque pièce raconte une histoire, façonnée avec soin par des artisans talentueux, dans le respect des traditions et du savoir-faire ancestral du Maghreb."
                ].map((text, index) => (
                  <motion.p
                    key={index}
                    className="text-base sm:text-lg text-gray-600 leading-relaxed font-light"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {text}
                  </motion.p>
                ))}
              </div>

              {/* Decorative Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="mt-10 pt-8 border-t border-amber-200/50"
              >
                <p className="text-lg sm:text-xl text-amber-800 font-light italic">
                  "Tradition et excellence, tissées à la main"
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Notre Mission Section - Professional Design */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-white to-amber-50/30 relative overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-amber-50/40 to-transparent" />
        
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Section Label */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="h-px w-12 bg-amber-400" />
                <span className="text-sm tracking-[0.2em] text-amber-700 uppercase font-light">
                  Notre Mission
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2 
                className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-8 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Faire rayonner
                <span className="block font-serif italic text-amber-800 mt-2">
                  l'artisanat maghrébin
                </span>
              </motion.h2>

              {/* Content */}
              <div className="space-y-6">
                {[
                  "Chez Royal Artisant, notre mission est de faire rayonner l'élégance et l'authenticité de l'artisanat maghrébin à travers des créations uniques.",
                  "Nous valorisons le travail manuel, le savoir-faire transmis de génération en génération, et l'alliance harmonieuse des cultures tunisienne et marocaine.",
                  "À travers chaque sac, couffin ou trousse, nous souhaitons offrir aux femmes un accessoire à la fois authentique, durable et chargé d'histoire."
                ].map((text, index) => (
                  <motion.p
                    key={index}
                    className="text-base sm:text-lg text-gray-600 leading-relaxed font-light"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {text}
                  </motion.p>
                ))}
              </div>

              {/* Key Values */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="mt-10 pt-8 border-t border-amber-200/50"
              >
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { label: 'Authenticité', icon: '✦' },
                    { label: 'Élégance', icon: '✦' },
                    { label: 'Durabilité', icon: '✦' }
                  ].map((value, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + idx * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-amber-600 text-xl mb-2">{value.icon}</div>
                      <div className="text-sm text-gray-700 font-light">{value.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Images Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  { src: "https://royal-artisanat.store/images/products/about-us-02.jpg", delay: 0.3 },
                  { src: "https://royal-artisanat.store/images/products/about-us-03.jpg", delay: 0.4 }
                ].map((img, index) => (
                  <motion.div
                    key={index}
                    className={`relative overflow-hidden ${index === 1 ? 'mt-12' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: img.delay, duration: 0.6 }}
                  >
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={img.src}
                        alt={`Artisan work ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {/* Elegant Border */}
                      <div className="absolute inset-0 border border-amber-900/10" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced Elegant Design */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-white via-amber-50/20 to-orange-50/30 relative overflow-hidden">
        {/* Elegant animated background elements */}
        {mounted && (
          <>
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full blur-3xl"
            />
            <motion.div
              animate={{ 
                rotate: [360, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-orange-200/30 to-transparent rounded-full blur-3xl"
            />
          </>
        )}

        {/* Decorative lines pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, rgb(217 119 6) 1px, transparent 1px), linear-gradient(to bottom, rgb(217 119 6) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
              <span className="text-xs uppercase tracking-[0.3em] text-amber-700 font-light">
                Nos Chiffres
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4">
              L'excellence en <span className="italic font-serif text-amber-800">chiffres</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -12 }}
                  className="group relative"
                >
                  {/* Main Card */}
                  <div className="relative overflow-hidden bg-white border border-amber-200/40 p-8 transition-all duration-500 group-hover:border-amber-400 group-hover:shadow-2xl group-hover:shadow-amber-100/50">
                    {/* Animated gradient background */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      animate={{ 
                        backgroundPosition: ['0% 0%', '100% 100%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    
                    {/* Top decorative line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    
                    {/* Corner accents */}
                    <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-amber-400 to-transparent" />
                      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-amber-400 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-amber-400 to-transparent" />
                      <div className="absolute bottom-0 left-0 w-px h-full bg-gradient-to-t from-amber-400 to-transparent" />
                    </div>

                    <div className="relative text-center">
                      {/* Icon with animated ring */}
                      <div className="relative inline-block mb-6">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border-2 border-dashed border-amber-300 opacity-0 group-hover:opacity-100"
                          style={{ padding: '4px' }}
                        />
                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 via-orange-100 to-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg group-hover:shadow-amber-200">
                          <Icon className="w-8 h-8 text-amber-700 group-hover:text-amber-800 transition-colors" />
                        </div>
                      </div>

                      {/* Value with animated number */}
                      <motion.div 
                        className="text-5xl lg:text-6xl font-light text-amber-800 mb-4 tracking-tight group-hover:text-amber-900 transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        {stat.value}
                      </motion.div>

                      {/* Decorative divider */}
                      <div className="flex justify-center mb-4">
                        <motion.div 
                          className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + 0.4, duration: 0.6 }}
                        />
                      </div>

                      {/* Label */}
                      <div className="text-xs lg:text-sm text-gray-600 font-light tracking-[0.15em] uppercase leading-relaxed">
                        {stat.label}
                      </div>
                    </div>

                    {/* Bottom glow effect */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-amber-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom decorative element */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex items-center justify-center mt-16"
          >
            <div className="h-px flex-1 max-w-md bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Quality Priority Section - Same as Home Page */}
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
              <span className="text-sm tracking-[0.2em] text-amber-700 uppercase font-light">Excellence</span>
              <div className="h-px w-12 bg-amber-400" />
            </motion.div>

            <motion.h2
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              La qualité est <span className="block font-serif italic text-amber-800 mt-2">notre priorité</span>
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg text-gray-600 font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Nos stylistes talentueux ont assemblé des créations qui sont parfaites pour la saison. 
              Ils ont une variété de façons d'inspirer votre prochaine tenue tendance.
            </motion.p>
          </motion.div>

          {/* Desktop Grid - 4 columns */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              
              return (
                <motion.div
                  key={value.title}
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
                        <Icon className="w-10 h-10 text-amber-700" strokeWidth={1.5} />
                      </div>

                      <h3 className="text-lg font-light text-gray-900 mb-4 group-hover:text-amber-800 transition-colors duration-300 leading-snug">
                        {value.title}
                      </h3>
                      
                      <p className="text-gray-600 font-light leading-relaxed text-sm flex-grow">
                        {value.description}
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

          {/* Mobile/Tablet View - Slider */}
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
                    {currentSlide + 1} / {values.length}
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
                  {values.map((value, index) => {
                    const Icon = value.icon;
                    
                    return (
                      <motion.div
                        key={value.title}
                        className="w-full flex-shrink-0 px-2"
                      >
                        <motion.div
                          initial={{ opacity: 0.8, scale: 0.95 }}
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
                              <Icon className="w-12 h-12 text-amber-700" strokeWidth={1.5} />
                            </div>

                            <h3 className="text-xl font-light text-gray-900 mb-4 leading-snug">
                              {value.title}
                            </h3>
                            
                            <p className="text-gray-600 font-light leading-relaxed flex-grow">
                              {value.description}
                            </p>

                            <div className="mt-6 pt-4 border-t border-amber-200/50 w-full">
                              <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto" />
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              <div className="flex justify-center space-x-2 mt-6">
                {values.map((_, index) => (
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
                Glissez pour découvrir nos valeurs
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Suivez-nous Section - Professional Design */}
      <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-white to-rose-50/30" />
        
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto"
          >
            {/* Section Label */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <div className="h-px w-12 bg-amber-400" />
              <span className="text-sm tracking-[0.2em] text-amber-700 uppercase font-light">
                Suivez-nous
              </span>
              <div className="h-px w-12 bg-amber-400" />
            </motion.div>

            {/* Heading */}
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Restez
              <span className="block font-serif italic text-amber-800 mt-2">
                connectés
              </span>
            </motion.h2>

            <motion.p 
              className="text-base sm:text-lg text-gray-600 mb-12 font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Découvrez nos dernières créations et inspirations artisanales
            </motion.p>

            {/* Social Links Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {[
                { name: 'Facebook', url: 'https://www.facebook.com/royalart.tn', Icon: Facebook },
                { name: 'Instagram', url: 'https://www.instagram.com/royal.artisanat/', Icon: Instagram },
                { name: 'WhatsApp', url: 'https://wa.me/21658955494', Icon: MessageCircle },
                { name: 'Email', url: 'mailto:royalartisants2022@gmail.com', Icon: Mail }
              ].map((social, index) => {
                const Icon = social.Icon;
                return (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: 0.5 + index * 0.1,
                      duration: 0.6
                    }}
                    className="group relative bg-white border border-amber-200/50 hover:border-amber-400 p-8 transition-all duration-300 overflow-hidden"
                  >
                    {/* Hover Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <Icon className="w-8 h-8 text-amber-700 mb-3 mx-auto" />
                      <div className="text-sm text-gray-700 font-light tracking-wide">{social.name}</div>
                    </div>

                    {/* Subtle Arrow */}
                    <motion.div
                      className="absolute bottom-4 right-4 text-amber-600 opacity-0 group-hover:opacity-100"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      →
                    </motion.div>
                  </motion.a>
                );
              })}
            </div>

            {/* Decorative Element */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="mt-12 pt-8 border-t border-amber-200/50"
            >
              <p className="text-sm text-gray-500 font-light">
                Partagez votre passion pour l'artisanat authentique
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
