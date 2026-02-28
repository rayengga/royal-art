import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── React Strict Mode ──────────────────────────────────────────────────
  reactStrictMode: true,

  // ─── Performance: package tree-shaking ──────────────────────────────────────
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@/components/ui',
      '@/components/layout',
    ],
  },

  // ─── Turbopack dev rules ──────────────────────────────────────────────────
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // ─── Image optimisation ───────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],   // serve avif first, then webp
    minimumCacheTTL: 60 * 60 * 24 * 30,     // 30-day CDN cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'i.pinimg.com' },
      { protocol: 'https', hostname: 'dokenzmen.com' },
      { protocol: 'https', hostname: 'royal-artisanat.store' },
    ],
  },

  // ─── HTTP headers: caching + security ────────────────────────────────────
  async headers() {
    return [
      // Static assets – long-lived cache
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Public images
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=86400' },
        ],
      },
      // Security headers for all routes
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Public API endpoints – short public cache
      {
        source: '/api/products',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=30' },
        ],
      },
      {
        source: '/api/categories',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=60' },
        ],
      },
    ];
  },

  // ─── Compression ─────────────────────────────────────────────────────────
  compress: true,

  // ─── Build ───────────────────────────────────────────────────────────────
  poweredByHeader: false,           // remove X-Powered-By: Next.js
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
