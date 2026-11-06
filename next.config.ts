import type { NextConfig } from "next";
import { calculators, isCalculatorPublished, resolveMergedCalculator } from './src/lib/calculator-meta';

// ---------------------------------------------------------------------------
// Redirects for calculators that were merged into another page.
// Every `mergedInto` chain must end at a published page — enforced by
// src/lib/registry.test.ts — so the homepage fallback below should never fire.
// ---------------------------------------------------------------------------
function mergedCalculatorRedirects() {
  return calculators
    .filter((c) => c.status === 'merged')
    .map((c) => {
      const target = resolveMergedCalculator(c);
      const destination = isCalculatorPublished(target) ? target.path : '/';
      return { source: c.path, destination, permanent: true };
    })
    .filter((r) => r.source !== r.destination);
}

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },

  // ---------------------------------------------------------------------------
  // Permanent redirects — fixes Google Search Console 404 errors
  // ---------------------------------------------------------------------------
  async redirects() {
    return [
      {
        source: '/calculators',
        destination: '/',
        permanent: true,
      },
      {
        source: '/$',
        destination: '/',
        permanent: true,
      },
      {
        source: '/&',
        destination: '/',
        permanent: true,
      },
      ...mergedCalculatorRedirects(),
    ];
  },

  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
      {
        source: '/_next/static/media/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'q' }],
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        // Allow external websites to embed /calculators/:slug/embed via iframe
        source: '/calculators/:slug/embed',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; frame-ancestors *; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com;",
          },
        ],
      },
      {
        source: '/((?!calculators/[^/]+/embed).*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; frame-ancestors 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
