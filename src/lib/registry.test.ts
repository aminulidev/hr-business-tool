import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  calculators,
  categoryOrder,
  getLiveRelatedTools,
  getPublishedCalculators,
  isCalculatorPublished,
  resolveMergedCalculator,
  type CalculatorMeta,
} from './calculator-meta';

// ---------------------------------------------------------------------------
// Registry invariants. `calculator-meta.ts` is the single source of truth and
// several other files must agree with it by hand (component maps, SEO files,
// icon map). These tests make that agreement a build failure instead of a 404.
//
// Two checks are "ratchets": they list defects that exist today (tracked in
// TODO.md Roadmap v2, Phases 13.3 and 15.2). New defects fail the build; the
// lists shrink to empty as those phases land.
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '../..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8');

const pageSrc = read('src/app/calculators/[slug]/page.tsx');
const embedSrc = read('src/app/calculators/[slug]/embed/page.tsx');
const layoutSrc = read('src/components/calculators/CalculatorLayoutServer.tsx');

const published = getPublishedCalculators();
const merged = calculators.filter((c) => c.status === 'merged');

/** Fail with the whole list visible, not a truncated array diff. */
const expectNone = (problems: string[], label?: string) => expect(problems.join('\n'), label).toBe('');

// Keys of `iconMap` in CalculatorLayoutServer.tsx (handles `Map: MapIcon` aliases)
const iconMapKeys = (() => {
  const start = layoutSrc.indexOf('const iconMap');
  const body = layoutSrc.slice(start, layoutSrc.indexOf('};', start));
  return new Set(
    [...body.matchAll(/^\s*([A-Za-z0-9]+)\s*[,:]/gm)].map((m) => m[1]).filter((k) => k !== 'const'),
  );
})();

async function loadSeo(slug: string): Promise<any | null> {
  try {
    const mod = await import(`./seo-data/${slug}.ts`);
    return mod.default ?? null;
  } catch {
    return null;
  }
}

describe('registry shape', () => {
  it('slugs and paths are unique and consistent', () => {
    const slugs = calculators.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const c of calculators) {
      expect(c.path, c.slug).toBe(`/calculators/${c.slug}`);
      expect(categoryOrder as readonly string[], `${c.slug} category`).toContain(c.category);
      expect(['tier1', 'tier2', 'tier3'], `${c.slug} tier`).toContain(c.tier);
      expect(c.keywords.length, `${c.slug} keywords`).toBeGreaterThan(0);
    }
  });

  it('scheduled entries carry a parseable publishDate', () => {
    for (const c of calculators.filter((x) => x.status === 'scheduled')) {
      expect(c.publishDate, c.slug).toBeTruthy();
      expect(Number.isNaN(new Date(c.publishDate!).getTime()), c.slug).toBe(false);
    }
  });

  it('merged entries name a target that exists and does not loop', () => {
    for (const c of merged) {
      expect(c.mergedInto, `${c.slug} has no mergedInto`).toBeTruthy();
      expect(calculators.some((x) => x.slug === c.mergedInto), `${c.slug} → ${c.mergedInto} missing`).toBe(true);
      const target = resolveMergedCalculator(c);
      expect(target.slug).not.toBe(c.slug);
    }
  });
});

describe('every published calculator', () => {
  it('has a component in BOTH the page and embed maps', () => {
    const missingPage = published.filter((c) => !pageSrc.includes(`'${c.slug}':`)).map((c) => c.slug);
    const missingEmbed = published.filter((c) => !embedSrc.includes(`'${c.slug}'`)).map((c) => c.slug);
    expectNone(missingPage, 'missing from calculators/[slug]/page.tsx componentMap');
    expectNone(missingEmbed, 'missing from embed/page.tsx');
  });

  it('has SEO data with the sections the layout renders', async () => {
    const problems: string[] = [];
    for (const c of published) {
      const seo = await loadSeo(c.slug);
      if (!seo) {
        problems.push(`${c.slug}: no src/lib/seo-data/${c.slug}.ts default export`);
        continue;
      }
      if (!Array.isArray(seo.faqs) || seo.faqs.length < 3) problems.push(`${c.slug}: fewer than 3 FAQs`);
      if (!Array.isArray(seo.howToSteps) || seo.howToSteps.length < 3) problems.push(`${c.slug}: fewer than 3 how-to steps`);
      if (!Array.isArray(seo.workedExamples) || seo.workedExamples.length < 1) problems.push(`${c.slug}: no worked example`);
      for (const f of seo.faqs ?? []) {
        if (!f.question?.trim() || !f.answer?.trim()) problems.push(`${c.slug}: empty FAQ`);
      }
    }
    expectNone(problems);
  });

  it('links to at least one live related calculator and only to known icons', async () => {
    const problems: string[] = [];
    for (const c of published) {
      const seo = await loadSeo(c.slug);
      if (!seo) continue;
      const live = getLiveRelatedTools(seo.relatedTools, c.slug);
      if (live.length === 0) problems.push(`${c.slug}: no live related tools`);
      for (const t of seo.relatedTools ?? []) {
        if (!iconMapKeys.has(t.icon)) problems.push(`${c.slug}: icon "${t.icon}" not in CalculatorLayoutServer iconMap`);
      }
    }
    expectNone(problems);
  });

  it('has unique metaTitle, metaDescription and title across published pages', () => {
    const dupes = (key: keyof CalculatorMeta) => {
      const seen = new Map<string, string>();
      const out: string[] = [];
      for (const c of published) {
        const v = c[key] as string | undefined;
        if (!v) continue;
        if (seen.has(v)) out.push(`${key}: "${v}" on ${seen.get(v)} and ${c.slug}`);
        seen.set(v, c.slug);
      }
      return out;
    };
    expectNone([...dupes('metaTitle'), ...dupes('metaDescription'), ...dupes('title')]);
  });
});

describe('ratchets — known defects that must not grow (see TODO.md Roadmap v2)', () => {
  const STOP = new Set([
    'calculator', 'calculators', 'free', 'online', 'estimator', 'with', 'after', 'from', 'your',
    'take', 'home', 'pay', 'rate', 'tool', 'and', 'the', 'for', '2026', '2025',
  ]);
  // Tokens from both hyphen-joined ("W-2" → "w2") and hyphen-split
  // ("Time-and-a-Half" → time, half) forms; keeps acronyms like ROI / FTE / MRR
  const words = (s: string) => {
    const lower = s.toLowerCase();
    const forms = [lower.replace(/-/g, ''), lower.replace(/-/g, ' ')];
    return forms.flatMap((f) =>
      f
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length >= 2 && !STOP.has(w)),
    );
  };

  it('13.3 — metaTitle describes the same calculator as title/slug', () => {
    // Known: commission-calculator ships a Churn Rate metaTitle (calculator-meta.ts ~L417)
    const KNOWN = ['commission-calculator'];
    const bad = published
      .filter((c) => c.metaTitle)
      .filter((c) => {
        const own = new Set([...words(c.title), ...words(c.slug)]);
        return !words(c.metaTitle!).some((w) => own.has(w));
      })
      .map((c) => `${c.slug}: title="${c.title}" metaTitle="${c.metaTitle}"`);
    const badSlugs = bad.map((b) => b.split(':')[0]);
    expectNone(bad.filter((b) => !KNOWN.includes(b.split(':')[0])), 'new metaTitle/title mismatches');
    // When the known one is fixed, shrink KNOWN so this stays honest
    expectNone(KNOWN.filter((s) => !badSlugs.includes(s)), 'fixed defects still listed in KNOWN');
  });

  it('15.2 — merged slugs resolve to a PUBLISHED page (today they fall back to DRAFT_TARGET_FALLBACK)', () => {
    const KNOWN = new Set([
      'attendance-calculator',
      'replacement-cost-calculator',
      'workforce-capacity-calculator',
      'net-profit-calculator',
      'contribution-calculator',
      'split-commission-calculator',
      'sales-target-calculator',
      'lead-cost-calculator',
      'client-profit-calculator',
      'proposal-price-calculator',
      'quote-calculator',
      'estimate-calculator',
      'free-to-paid-conversion-calculator',
      'fifo-calculator',
      'lifo-calculator',
      'weighted-average-cost-calculator',
    ]);
    const bad = merged
      .filter((c) => !isCalculatorPublished(resolveMergedCalculator(c)))
      .map((c) => `${c.slug} → ${resolveMergedCalculator(c).slug} (${resolveMergedCalculator(c).status})`);
    const badSlugs = bad.map((b) => b.split(' ')[0]);
    expectNone(bad.filter((b) => !KNOWN.has(b.split(' ')[0])), 'new merged→unpublished chains');
    expectNone([...KNOWN].filter((s) => !badSlugs.includes(s)), 'fixed chains still listed in KNOWN');
  });
});
