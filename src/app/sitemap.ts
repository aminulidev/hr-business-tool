import type { MetadataRoute } from 'next';
import { calculators, SITE_URL } from '@/lib/calculator-meta';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Hub page
  const hubEntry: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1.0,
  };

  // Individual calculator pages
  const calculatorEntries: MetadataRoute.Sitemap = calculators.map((calc) => ({
    url: `${SITE_URL}${calc.path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Legal and informational pages
  const legalPages = [
    { path: '/about', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/contact', priority: 0.5, changeFreq: 'yearly' as const },
    { path: '/privacy-policy', priority: 0.4, changeFreq: 'yearly' as const },
    { path: '/terms-of-service', priority: 0.4, changeFreq: 'yearly' as const },
    { path: '/cookie-policy', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/disclaimer', priority: 0.3, changeFreq: 'yearly' as const },
  ];

  const legalEntries: MetadataRoute.Sitemap = legalPages.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));

  return [hubEntry, ...calculatorEntries, ...legalEntries];
}
