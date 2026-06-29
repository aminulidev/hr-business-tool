import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
      // /calculators (no slug) → homepage (the hub page)
      // Caused by glossary "Browse All Tools" link pointing to /calculators
      {
        source: '/calculators',
        destination: '/',
        permanent: true,
      },
      // /$ and /& → homepage
      // Google crawled these malformed URLs
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
        // Font and media files: noindex only (nofollow is meaningless for
        // binary files and was causing extra GSC noise)
        source: '/_next/static/media/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
      {
        // Noindex any URL that has a ?q= query parameter.
        // These appear in GSC as "Alternate page with proper canonical tag"
        // because ?q={search_term_string} gets crawled by Googlebot but the
        // page's canonical points to the homepage without the query string.
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
        source: '/(.*)',
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
