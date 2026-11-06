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
import { iconMap } from './registry/icons';
import { AUTHORS, type Author } from './authors';
import { SRC } from './seo-data/sources';

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

// One shared slug → component map, used by both the page and embed routes
const componentsSrc = read('src/lib/registry/components.tsx');

const all: CalculatorMeta[] = calculators;
const published = getPublishedCalculators();
const merged = all.filter((c) => c.status === 'merged');

/** Fail with the whole list visible, not a truncated array diff. */
const expectNone = (problems: string[], label?: string) => expect(problems.join('\n'), label).toBe('');

const iconMapKeys = new Set(Object.keys(iconMap));

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
    const slugs = all.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const c of all) {
      expect(c.path, c.slug).toBe(`/calculators/${c.slug}`);
      expect(categoryOrder as readonly string[], `${c.slug} category`).toContain(c.category);
      expect(['tier1', 'tier2', 'tier3'], `${c.slug} tier`).toContain(c.tier);
      expect(c.keywords.length, `${c.slug} keywords`).toBeGreaterThan(0);
    }
  });

  it('scheduled entries carry a parseable publishDate', () => {
    for (const c of all.filter((x) => x.status === 'scheduled')) {
      expect(c.publishDate, c.slug).toBeTruthy();
      expect(Number.isNaN(new Date(c.publishDate!).getTime()), c.slug).toBe(false);
    }
  });

  it('mergedQuery is only set on merged entries and is a bare query string', () => {
    for (const c of all) {
      if (c.mergedQuery !== undefined) {
        expect(c.status, `${c.slug} has mergedQuery but is ${c.status}`).toBe('merged');
        expect(c.mergedQuery, `${c.slug} mergedQuery`).toMatch(/^[a-z]+=[a-z-]+$/);
      }
    }
  });

  it('merged entries name a target that exists and does not loop', () => {
    for (const c of merged) {
      expect(c.mergedInto, `${c.slug} has no mergedInto`).toBeTruthy();
      expect(all.some((x) => x.slug === c.mergedInto), `${c.slug} → ${c.mergedInto} missing`).toBe(true);
      const target = resolveMergedCalculator(c);
      expect(target.slug).not.toBe(c.slug);
    }
  });
});

describe('every published calculator', () => {
  it('has a component in src/lib/registry/components.tsx', () => {
    const missing = published.filter((c) => !componentsSrc.includes(`'${c.slug}':`)).map((c) => c.slug);
    expectNone(missing, 'missing from calculatorComponents');
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
        if (!iconMapKeys.has(t.icon)) problems.push(`${c.slug}: icon "${t.icon}" not in registry/icons.ts iconMap`);
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
    // Empty since PR 2 (Nov 2026). Add a slug here only with a TODO.md item to fix it.
    const KNOWN: string[] = [];
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

  it('15.2 — merged slugs resolve to a PUBLISHED page (next.config.ts redirects there)', () => {
    // Empty since PR 2 (Nov 2026). A merged slug may only point at a published page.
    const KNOWN = new Set<string>([]);
    const bad = merged
      .filter((c) => !isCalculatorPublished(resolveMergedCalculator(c)))
      .map((c) => `${c.slug} → ${resolveMergedCalculator(c).slug} (${resolveMergedCalculator(c).status})`);
    const badSlugs = bad.map((b) => b.split(' ')[0]);
    expectNone(bad.filter((b) => !KNOWN.has(b.split(' ')[0])), 'new merged→unpublished chains');
    expectNone([...KNOWN].filter((s) => !badSlugs.includes(s)), 'fixed chains still listed in KNOWN');
  });
});

// ---------------------------------------------------------------------------
// Phase 13.1 / 13.2 — trust layer. Review dates must be real and backed by a
// note; sources must be specific, linked publications; every tax/paycheck page
// must cite at least one.
// ---------------------------------------------------------------------------
describe('trust layer (Phase 13)', () => {
  const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

  it('lastReviewed is a real past date with a review note, and author is a known profile', () => {
    const today = new Date().toISOString().slice(0, 10);
    const problems: string[] = [];
    for (const c of all) {
      if (c.lastReviewed !== undefined) {
        if (!ISO_DATE.test(c.lastReviewed) || Number.isNaN(new Date(c.lastReviewed).getTime())) problems.push(`${c.slug}: lastReviewed "${c.lastReviewed}" is not YYYY-MM-DD`);
        if (c.lastReviewed > today) problems.push(`${c.slug}: lastReviewed ${c.lastReviewed} is in the future`);
        if (!c.reviewNotes?.trim()) problems.push(`${c.slug}: lastReviewed without reviewNotes`);
      }
      if (c.author !== undefined && !(c.author in AUTHORS)) problems.push(`${c.slug}: unknown author "${c.author}"`);
    }
    expectNone(problems);
  });

  it('authorship is organisation-level until a real, named reviewer is added', () => {
    // Option 2 chosen Nov 6 2026: no named persons, no invented credentials.
    const authors: Author[] = Object.values(AUTHORS);
    for (const a of authors) {
      if (a.kind === 'person') {
        expect(a.links.length, `${a.slug}: a named person needs a verifiable profile link`).toBeGreaterThan(0);
        expect(/CPA|EA|SHRM|HRCI|PHR|JD|Esq/i.test(a.role) ? a.bio : 'ok', `${a.slug}: credentials must be explained in the bio`).toBeTruthy();
      }
    }
    expect(AUTHORS['editorial-team'].kind).toBe('organization');
  });

  it('every source is a labelled https link to a specific publication', async () => {
    const problems: string[] = [];
    for (const c of published) {
      const seo = await loadSeo(c.slug);
      if (!seo?.sources) continue;
      const seen = new Set<string>();
      for (const s of seo.sources as { label?: string; url?: string }[]) {
        if (!s.label?.trim()) problems.push(`${c.slug}: source without label`);
        if (!s.url || !/^https:\/\/[^\s]+$/.test(s.url)) problems.push(`${c.slug}: "${s.label}" has no https url`);
        else if (seen.has(s.url)) problems.push(`${c.slug}: duplicate source url ${s.url}`);
        if (s.url) seen.add(s.url);
      }
    }
    expectNone(problems);
  });

  it('every published Payroll & Taxes calculator cites at least one source', async () => {
    const missing: string[] = [];
    for (const c of published.filter((x) => x.category === 'Payroll & Taxes')) {
      const seo = await loadSeo(c.slug);
      if (!seo?.sources?.length) missing.push(c.slug);
    }
    expectNone(missing, 'tax pages without sources');
  });

  it('engine-backed paycheck pages carry a review date and cite the federal withholding sources', async () => {
    const problems: string[] = [];
    const engineSlugs = published.filter((c) => c.slug === 'hourly-paycheck-calculator' || c.slug === 'payroll-calculator' || /-hourly-paycheck-calculator$/.test(c.slug));
    expect(engineSlugs.length).toBe(32);
    for (const c of engineSlugs) {
      if (!c.lastReviewed) problems.push(`${c.slug}: no lastReviewed`);
      const seo = await loadSeo(c.slug);
      const urls = new Set((seo?.sources ?? []).map((s: { url: string }) => s.url));
      if (!urls.has(SRC.irsPub15T.url)) problems.push(`${c.slug}: does not cite IRS Pub. 15-T`);
      if (!urls.has(SRC.ssaCola.url)) problems.push(`${c.slug}: does not cite the SSA wage base`);
    }
    expectNone(problems);
  });

  it('state paycheck pages cite their own state agency, not only federal sources', async () => {
    const problems: string[] = [];
    for (const c of published.filter((x) => /-hourly-paycheck-calculator$/.test(x.slug))) {
      const seo = await loadSeo(c.slug);
      const federal = new Set(Object.values(SRC).map((s) => s.url));
      const stateSpecific = (seo?.sources ?? []).filter((s: { url: string }) => !federal.has(s.url));
      if (stateSpecific.length === 0) problems.push(`${c.slug}: no state-specific source`);
    }
    expectNone(problems);
  });
});
