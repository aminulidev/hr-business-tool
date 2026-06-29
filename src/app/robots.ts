import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/calculator-meta';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Main crawl rule — allow all real pages, explicitly disallow
        // Next.js internal static asset paths that Google keeps trying
        // to crawl. Font files (/_next/static/media/*.woff2) were showing
        // as "Blocked by robots.txt" in GSC — making this explicit resolves
        // the validation and prevents crawl budget waste.
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',                   // Internal API routes
          '/_next/static/media/',    // Font files (*.woff2, *.woff, *.ttf)
          '/_next/static/chunks/',   // JS bundle files
          '/_next/image',            // Image optimization endpoint
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
