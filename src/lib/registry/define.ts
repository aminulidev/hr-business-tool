import type { LucideIcon } from 'lucide-react';
import type { Category } from './site';

export type CalculatorStatus = 'published' | 'draft' | 'scheduled' | 'merged';
export type CalculatorTier = 'tier1' | 'tier2' | 'tier3';

/** Shape of a registry entry as written in src/lib/registry/calculators/*.ts */
export interface CalculatorMetaInput {
  slug: string;
  title: string;
  /** High-CTR custom <title> for SERP */
  metaTitle?: string;
  /** Used on hub cards */
  shortDescription: string;
  /** Used in <meta name="description"> */
  metaDescription: string;
  /** Target keywords for SEO */
  keywords: string[];
  icon: LucideIcon;
  tier: CalculatorTier;
  /** Hub section label — must be one of categoryOrder */
  category: Category;
  /** Full URL path, always /calculators/<slug> */
  path: string;
  status?: CalculatorStatus;
  /** YYYY-MM-DD, required when status is 'scheduled' */
  publishDate?: string;
  /** Required when status is 'merged' — the published page that absorbed this one */
  mergedInto?: string;
}

/**
 * Preserves each entry's literal slug so `CalculatorSlug` can be derived from
 * the data instead of a hand-maintained union. Other fields stay widened.
 */
export function defineCalculators<const T extends readonly CalculatorMetaInput[]>(list: T): T {
  return list;
}
