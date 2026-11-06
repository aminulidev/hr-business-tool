import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';
import robots from './robots';
import { calculators, getPublishedCalculators, isCalculatorPublished, SITE_URL } from '@/lib/calculator-meta';
import { CATEGORY_HUBS } from '@/lib/category-hubs';
import { SALARY_TIERS } from '@/lib/salary-pages';
import { getAllAuthors } from '@/lib/authors';

describe('sitemap.xml', () => {
  it('lists every published calculator and nothing that 404s or redirects', async () => {
    const entries = await sitemap();
    const urls = new Set(entries.map((e) => e.url));

    for (const c of getPublishedCalculators()) {
      expect(urls.has(`${SITE_URL}${c.path}`), `${c.slug} missing from sitemap`).toBe(true);
    }
    for (const c of calculators.filter((x) => !isCalculatorPublished(x))) {
      expect(urls.has(`${SITE_URL}${c.path}`), `${c.slug} (${c.status}) must not be in sitemap`).toBe(false);
    }
    // /calculators redirects to / and must not be listed
    expect(urls.has(`${SITE_URL}/calculators`)).toBe(false);
  });

  it('has no duplicate URLs and only absolute site URLs', async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const u of urls) expect(u.startsWith(SITE_URL)).toBe(true);
  });

  it('includes category hubs and salary tiers', async () => {
    const urls = new Set((await sitemap()).map((e) => e.url));
    for (const hub of CATEGORY_HUBS) expect(urls.has(`${SITE_URL}/category/${hub.slug}`), hub.slug).toBe(true);
    for (const tier of SALARY_TIERS) expect(urls.has(`${SITE_URL}/salary/${tier.slug}`), tier.slug).toBe(true);
  });

  it('includes the editorial policy and no personal author pages (Phase 13.1)', async () => {
    const urls = new Set((await sitemap()).map((e) => e.url));
    expect(urls.has(`${SITE_URL}/editorial-policy`)).toBe(true);
    expect([...urls].some((u) => u.includes('/authors/')), 'no personal author pages').toBe(false);
  });
});

describe('robots.txt', () => {
  it('blocks only API/private routes and points at the sitemap', () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    const disallow = rules.flatMap((x) => (Array.isArray(x.disallow) ? x.disallow : [x.disallow])).filter(Boolean);
    expect(disallow).toContain('/api/');
    // Googlebot needs these to render the calculators (TODO.md Phase 1)
    expect(disallow.some((d) => String(d).includes('/_next'))).toBe(false);
    expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
