import React, { Suspense, lazy } from 'react';
import Hero from '@/components/ui/Hero';

const FeaturedProducts  = lazy(() => import('@/components/ui/FeaturedProducts'));
const WhyChooseUs       = lazy(() => import('@/components/ui/WhyChooseUs'));
const ShopByCategories  = lazy(() => import('@/components/ui/ShopByCategories'));

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero is above the fold — load eagerly */}
      <Hero />

      {/* Everything below the fold is lazy-loaded */}
      <Suspense fallback={<div className="min-h-[700px]" />}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<div className="min-h-[500px]" />}>
        <WhyChooseUs />
      </Suspense>
      <Suspense fallback={<div className="min-h-[600px]" />}>
        <ShopByCategories />
      </Suspense>
    </div>
  );
}
