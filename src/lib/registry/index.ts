// ---------------------------------------------------------------------------
// Calculator registry — single source of truth.
// Entries live in ./calculators/<category>.ts; this file combines them,
// derives the slug type from the data, and exposes the lookup helpers.
// ---------------------------------------------------------------------------
import { categoryOrder } from './site';
import type { CalculatorMetaInput } from './define';
import { payrollTaxesCalculators } from './calculators/payroll-taxes';
import { salaryCompensationCalculators } from './calculators/salary-compensation';
import { accountingCalculators } from './calculators/accounting';
import { hrAnalyticsCalculators } from './calculators/hr-analytics';
import { businessFinanceCalculators } from './calculators/business-finance';
import { timeAttendanceCalculators } from './calculators/time-attendance';
import { salesCompensationCalculators } from './calculators/sales-compensation';
import { freelancerAgencyCalculators } from './calculators/freelancer-agency';
import { startupSaasCalculators } from './calculators/startup-saas';

export * from './site';
export type { CalculatorMetaInput, CalculatorStatus, CalculatorTier } from './define';

/** Every calculator, in categoryOrder. */
export const calculators = [
  ...payrollTaxesCalculators,
  ...salaryCompensationCalculators,
  ...accountingCalculators,
  ...hrAnalyticsCalculators,
  ...businessFinanceCalculators,
  ...timeAttendanceCalculators,
  ...salesCompensationCalculators,
  ...freelancerAgencyCalculators,
  ...startupSaasCalculators,
];

/** Union of every slug in the registry — derived, never hand-maintained. */
export type CalculatorSlug = (typeof calculators)[number]['slug'];

export type CalculatorMeta = Omit<CalculatorMetaInput, 'slug' | 'mergedInto'> & {
  slug: CalculatorSlug;
  mergedInto?: CalculatorSlug;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get a single calculator's metadata by slug */
export function getCalculatorBySlug(slug: string): CalculatorMeta | undefined {
  return calculators.find((c) => c.slug === slug);
}

/** Get all calculator slugs (for generateStaticParams) */
export function getAllSlugs(includeDrafts = false): CalculatorSlug[] {
  const list = includeDrafts ? calculators : getPublishedCalculators();
  return list.map((c) => c.slug);
}

/** Get calculators grouped by tier */
export function getCalculatorsByTier() {
  return {
    tier1: calculators.filter((c) => c.tier === 'tier1'),
    tier2: calculators.filter((c) => c.tier === 'tier2'),
    tier3: calculators.filter((c) => c.tier === 'tier3'),
  };
}

/** Get calculators grouped by category (for hub page) */
export function getCalculatorsByCategory() {
  const grouped: Record<string, CalculatorMeta[]> = {};
  const active = getPublishedCalculators();
  for (const cat of categoryOrder) {
    grouped[cat] = active.filter((c) => c.category === cat);
  }
  return grouped;
}

/**
 * Check if a calculator is actively published.
 * If status is not set, default to published for backward compatibility.
 * If status is scheduled, it is active only if today is on or after publishDate.
 */
export function isCalculatorPublished(calc: CalculatorMeta): boolean {
  if (calc.status === 'draft' || calc.status === 'merged') return false;
  if (calc.status === 'scheduled') {
    if (!calc.publishDate) return false;
    const publishTime = new Date(calc.publishDate).getTime();
    return !isNaN(publishTime) && Date.now() >= publishTime;
  }
  return true;
}

/** Get only published calculators */
export function getPublishedCalculators(): CalculatorMeta[] {
  return calculators.filter(isCalculatorPublished);
}

/**
 * Follow mergedInto links to the calculator that now owns this slug.
 * Returns the calculator itself if it was not merged.
 */
export function resolveMergedCalculator(calc: CalculatorMeta): CalculatorMeta {
  let current = calc;
  const seen = new Set<string>();
  while (current.status === 'merged' && current.mergedInto && !seen.has(current.slug)) {
    seen.add(current.slug);
    const next = getCalculatorBySlug(current.mergedInto);
    if (!next) break;
    current = next;
  }
  return current;
}

/**
 * Filter SEO relatedTools down to live pages: merged slugs are swapped for
 * the calculator that absorbed them, unpublished ones are dropped, and
 * duplicates / self-links are removed.
 */
export function getLiveRelatedTools<T extends { slug: string; title: string; description: string; icon: string }>(
  tools: T[] | undefined,
  currentSlug: string,
): T[] {
  if (!tools) return [];
  const seen = new Set<string>([currentSlug]);
  const result: T[] = [];
  for (const tool of tools) {
    const calc = getCalculatorBySlug(tool.slug);
    if (!calc) continue;
    const target = resolveMergedCalculator(calc);
    if (!isCalculatorPublished(target) || seen.has(target.slug)) continue;
    seen.add(target.slug);
    result.push(
      target.slug === tool.slug
        ? tool
        : { ...tool, slug: target.slug, title: target.title, description: target.shortDescription },
    );
  }
  return result;
}
