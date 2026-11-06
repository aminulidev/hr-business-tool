import type { MetadataRoute } from 'next';
import { getPublishedCalculators, SITE_URL } from '@/lib/calculator-meta';
import { CATEGORY_HUBS } from '@/lib/category-hubs';
import { SALARY_TIERS } from '@/lib/salary-pages';
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

  // Topical Category Pillar Hub pages
  const categoryEntries: MetadataRoute.Sitemap = CATEGORY_HUBS.map((cat) => ({
    url: `${SITE_URL}/category/${cat.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Individual calculator pages
  const calculatorEntries: MetadataRoute.Sitemap = getPublishedCalculators().map((calc) => ({
    url: `${SITE_URL}${calc.path}`,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Programmatic Wage & Salary Breakdown pages (/salary + /salary/[slug])
  const salaryEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/salary`,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    ...SALARY_TIERS.map((tier) => ({
      url: `${SITE_URL}/salary/${tier.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

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

  // Informational and legal pages
  const legalPages = [
    { path: '/compare/jobs', priority: 0.8, changeFreq: 'monthly' as const },
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

  return [
    hubEntry,
    ...categoryEntries,
    ...calculatorEntries,
    ...salaryEntries,
    ...blogEntries,
    guidesEntry,
    glossaryEntry,
    ...legalEntries,
  ];
}
