import type { NextConfig } from "next";
import { calculators, isCalculatorPublished, resolveMergedCalculator } from './src/lib/calculator-meta';

// ---------------------------------------------------------------------------
// Redirects for calculators that were merged into another page.
// ---------------------------------------------------------------------------
const DRAFT_TARGET_FALLBACK: Record<string, string> = {
  'absenteeism-calculator': '/calculators/employee-hours-calculator',
  'cost-of-turnover-calculator': '/calculators/employee-turnover-calculator',
  'employee-cost-calculator': '/calculators/payroll-calculator',
  'workforce-planning-calculator': '/calculators/employee-hours-calculator',
  'net-margin-calculator': '/calculators/profit-margin-calculator',
  'contribution-margin-calculator': '/calculators/gross-margin-calculator',
  'commission-split-calculator': '/calculators/commission-calculator',
  'quota-calculator': '/calculators/commission-calculator',
  'cpl-calculator': '/calculators/roi-calculator',
  'project-pricing-calculator': '/calculators/billable-hours-calculator',
  'trial-conversion-calculator': '/calculators/roi-calculator',
  'clock-out-calculator': '/calculators/time-card-calculator',
  'profit-per-client-calculator': '/calculators/billable-hours-calculator',
};

function mergedCalculatorRedirects() {
  return calculators
    .filter((c) => c.status === 'merged')
    .map((c) => {
      const target = resolveMergedCalculator(c);
      const destination = isCalculatorPublished(target)
        ? target.path
        : DRAFT_TARGET_FALLBACK[target.slug] ?? '/';
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
