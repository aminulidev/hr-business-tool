import { getCalculatorBySlug, getPublishedCalculators, type CalculatorMeta } from './calculator-meta';
import { searchItems } from './search-core';

export interface SearchResult {
  calculator: CalculatorMeta;
  score: number;
  matchReason?: string;
}

export function searchCalculators(query: string, items: CalculatorMeta[] = getPublishedCalculators()): SearchResult[] {
  return searchItems(query, items);
}

// Popular / high-intent calculators to highlight on empty search
export const popularCalculators: CalculatorMeta[] = [
  'roi-calculator',
  'commission-calculator',
  'payroll-calculator',
  'salary-converter',
  'overtime-calculator',
  'break-even-calculator',
]
  .map((slug) => getCalculatorBySlug(slug))
  .filter((c): c is CalculatorMeta => Boolean(c));
