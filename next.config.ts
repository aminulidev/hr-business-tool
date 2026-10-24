import type { NextConfig } from "next";
import { calculators, isCalculatorPublished, resolveMergedCalculator } from './src/lib/calculator-meta';

// ---------------------------------------------------------------------------
// Redirects for calculators that were merged into another page.
// ---------------------------------------------------------------------------
// A merged slug follows its `mergedInto` chain. If the final target is live it
// gets a 308 there; if the target is still a draft, it goes to the closest
// published calculator listed here, or to the homepage as a last resort.
// A 404 here would drop any crawled or bookmarked equity and send reviewers
// to an error page.
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
      // Merged calculator slugs → the page that absorbed them
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
