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

/**
 * A primary source the page relies on. Rendered as a link in the
 * "Sources & References" section and listed in the page's JSON-LD.
 * Prefer the exact publication (IRS Pub. 15-T, a state withholding guide,
 * a CFR section) over an agency home page. Shared constants live in ./sources.ts.
 */
export interface SeoSource {
  label: string;
  url: string;
  /** Issuing agency or organisation, e.g. "Internal Revenue Service" */
  publisher?: string;
  /** What this page takes from the source, one short clause */
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
  /**
   * Primary sources this page's numbers come from. Required (by registry.test.ts)
   * for every published Payroll & Taxes calculator; optional for pure business-math
   * pages, where the sources section is simply not rendered.
   */
  sources?: SeoSource[];
  /** @deprecated The page route builds the table of contents; this is ignored. */
  tableOfContents?: { id: string; label: string }[];
  /** @deprecated The page route builds breadcrumbs from the registry; this is ignored. */
  breadcrumbs?: { label: string; href?: string }[];
}
