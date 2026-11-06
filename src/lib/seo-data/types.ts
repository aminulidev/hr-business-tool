// ---------------------------------------------------------------------------
// Shape of every src/lib/seo-data/<slug>.ts default export. Each file ends with
// `export default seoData satisfies CalculatorSeoData` so a missing section,
// a typo in an icon name, or a related-tool slug that is not in the registry
// fails type-checking.
// ---------------------------------------------------------------------------
import type { CalculatorSlug } from '@/lib/registry';
import type { IconName } from '@/lib/registry/icons';

export interface SeoRelatedTool {
  slug: CalculatorSlug;
  title: string;
  description: string;
  icon: IconName;
}

export interface SeoFaq {
  question: string;
  answer: string;
}

export interface SeoWorkedExample {
  title: string;
  description: string;
}

export interface SeoCommissionStructure {
  type: string;
  description: string;
  formula: string;
  example: string;
}

export interface SeoBenchmarkTable {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: string[][];
  /** Short caption shown with the table */
  description?: string;
  note?: string;
}

export interface SeoDeepDiveSection {
  id?: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  bullets?: string[];
  highlights?: string[];
}

export interface CalculatorSeoData {
  howToSteps: string[];
  formula?: string;
  formulaDescription?: string;
  workedExamples: SeoWorkedExample[];
  commissionStructures?: SeoCommissionStructure[];
  benchmarkTables?: SeoBenchmarkTable[];
  deepDiveSections?: SeoDeepDiveSection[];
  faqs: SeoFaq[];
  relatedTools: SeoRelatedTool[];
  /** @deprecated The page route builds the table of contents; this is ignored. */
  tableOfContents?: { id: string; label: string }[];
  /** @deprecated The page route builds breadcrumbs from the registry; this is ignored. */
  breadcrumbs?: { label: string; href?: string }[];
}
