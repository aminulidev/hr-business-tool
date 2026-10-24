import type { MetadataRoute } from 'next';
import { getPublishedCalculators, SITE_URL } from '@/lib/calculator-meta';
import { getSortedPostsData } from '@/lib/blog';

// lastModified is only set where a real date exists (blog frontmatter).
// A generated "now" timestamp on every URL is ignored by Google and reads as noise.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Hub page
  const hubEntry: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    changeFrequency: 'weekly',
    priority: 1.0,
  };

  // Individual calculator pages
  const calculatorEntries: MetadataRoute.Sitemap = getPublishedCalculators().map((calc) => ({
    url: `${SITE_URL}${calc.path}`,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Blog entries
  const posts = await getSortedPostsData();
  const blogEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(`${post.date}T00:00:00Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  // Guides entry
  const guidesEntry: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/guides`,
    changeFrequency: 'weekly',
    priority: 0.8,
  };

  // Glossary entry
  const glossaryEntry: MetadataRoute.Sitemap[number] = {
    url: `${SITE_URL}/glossary`,
    changeFrequency: 'monthly',
    priority: 0.7,
  };

  // Informational and legal pages. /newsletter and /compare/jobs are noindex
  // and intentionally left out.
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
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));

  return [hubEntry, ...calculatorEntries, ...blogEntries, guidesEntry, glossaryEntry, ...legalEntries];
}
