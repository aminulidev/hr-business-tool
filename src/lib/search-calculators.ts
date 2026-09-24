import { calculators, getPublishedCalculators, type CalculatorMeta } from './calculator-meta';

export interface SearchResult {
  calculator: CalculatorMeta;
  score: number;
  matchReason?: string;
}

export function searchCalculators(query: string, items: CalculatorMeta[] = getPublishedCalculators()): SearchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return items.map((c) => ({ calculator: c, score: 0 }));
  }

  const queryClean = trimmed.replace(/[^a-z0-9\s]/g, ' ');
  const tokens = queryClean.split(/\s+/).filter(Boolean);
  const strippedQuery = trimmed.replace(/[^a-z0-9]/g, '');

  const results: SearchResult[] = [];

  for (const calc of items) {
    const titleLower = calc.title.toLowerCase();
    const titleClean = titleLower.replace(/[^a-z0-9\s]/g, ' ');
    const titleWords = titleClean.split(/\s+/).filter(Boolean);
    const titleNoCalc = titleLower.replace(/\bcalculators?\b/g, '').trim();
    const slugClean = calc.slug.toLowerCase().replace(/-/g, ' ');

    const descLower = (calc.shortDescription || '').toLowerCase();
    const catLower = calc.category.toLowerCase();
    const keywords = (calc.keywords || []).map((k) => k.toLowerCase());

    let score = 0;
    let matchReason = '';

    // 1. Exact match on title or slug
    if (
      titleLower === trimmed ||
      titleNoCalc === trimmed ||
      calc.slug === trimmed ||
      calc.slug === `${trimmed}-calculator` ||
      slugClean === trimmed
    ) {
      score = 2000;
      matchReason = 'exact-title';
    } else if (strippedQuery.length >= 2 && calc.slug.replace(/[^a-z0-9]/g, '') === strippedQuery) {
      score = 1800;
      matchReason = 'exact-slug';
    }

    // 2. Title matching
    if (score < 1500) {
      // Check title words
      for (const word of titleWords) {
        if (word === trimmed) {
          score = Math.max(score, 1200);
          matchReason = 'title-word-exact';
          break;
        }
      }

      if (titleLower.startsWith(trimmed)) {
        score = Math.max(score, 1000);
        matchReason = matchReason || 'title-starts-with';
      }

      // Check if any title word starts with query
      if (score < 800) {
        for (const word of titleWords) {
          if (word.startsWith(trimmed)) {
            score = Math.max(score, 800);
            matchReason = matchReason || 'title-word-prefix';
            break;
          }
        }
      }

      // Check if query is in title as substring
      if (score < 600 && titleLower.includes(trimmed)) {
        score = Math.max(score, 600);
        matchReason = matchReason || 'title-substring';
      }
    }

    // 3. Keywords matching
    for (const kw of keywords) {
      const kwClean = kw.replace(/[^a-z0-9\s]/g, ' ');
      const kwWords = kwClean.split(/\s+/).filter(Boolean);

      if (kw === trimmed || kw === `${trimmed} calculator`) {
        score = Math.max(score, 700);
        matchReason = matchReason || 'keyword-exact';
        break;
      }

      if (kwWords.includes(trimmed)) {
        score = Math.max(score, 500);
        matchReason = matchReason || 'keyword-word-exact';
      } else if (kw.startsWith(trimmed)) {
        score = Math.max(score, 400);
        matchReason = matchReason || 'keyword-starts-with';
      } else if (kwWords.some((w) => w.startsWith(trimmed))) {
        score = Math.max(score, 350);
        matchReason = matchReason || 'keyword-word-prefix';
      } else if (kw.includes(trimmed)) {
        score = Math.max(score, 250);
        matchReason = matchReason || 'keyword-substring';
      }
    }

    // 4. Description matching
    if (descLower.includes(trimmed)) {
      const descWords = descLower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
      if (descWords.includes(trimmed)) {
        score = Math.max(score, 150);
        matchReason = matchReason || 'desc-word';
      } else {
        score = Math.max(score, 80);
        matchReason = matchReason || 'desc-substring';
      }
    }

    // 5. Category matching (only if user explicitly searches for category name)
    const fullCat = catLower.replace(/&/g, 'and').replace(/\s+/g, ' ').trim();
    if (trimmed.length >= 3 && (catLower === trimmed || fullCat === trimmed)) {
      score = Math.max(score, 120);
      matchReason = matchReason || 'category';
    }

    // 6. Multi-token queries (e.g. "time card lunch", "tax refund")
    if (tokens.length > 1) {
      const allText = `${titleLower} ${catLower} ${descLower} ${keywords.join(' ')}`;
      const allTokensMatch = tokens.every((token) => allText.includes(token));
      if (!allTokensMatch) {
        // Disqualify if not all tokens are present anywhere
        score = 0;
      } else {
        // Boost if all tokens are in title
        const allInTitle = tokens.every((t) => titleLower.includes(t));
        if (allInTitle) {
          score += 400;
        } else {
          score += 150;
        }
      }
    }

    if (score > 0) {
      results.push({ calculator: calc, score, matchReason });
    }
  }

  // Sort by score descending; if tied, sort alphabetically by title
  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.calculator.title.localeCompare(b.calculator.title);
  });
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
  .map((slug) => calculators.find((c) => c.slug === slug))
  .filter((c): c is CalculatorMeta => Boolean(c));
