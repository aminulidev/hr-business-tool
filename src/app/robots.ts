import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/calculator-meta';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Main crawl rule — allow all real pages and Next.js static/image assets
        // required by Googlebot Web Rendering Service (WRS) to hydrate dynamic
        // calculators and index images. Only disallow internal API routes.
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',                   // Internal API routes
          '/private/',               // Private routes
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
