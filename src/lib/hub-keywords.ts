// ---------------------------------------------------------------------------
// Search keywords for the home page, loaded when the visitor uses the search box
// ---------------------------------------------------------------------------
// The home page's calculator list (hub-data.ts) carries what the cards show. The
// keyword lists are only needed to search, and they added 6 kB of compressed
// HTML to every home page view, so HubPage fetches them with import() when the
// search box is first focused. Until they arrive, search matches on title,
// description and category.
//
// This file imports the registry. Never import it statically from a client
// component: use `import('@/lib/hub-keywords')` (bundle-boundaries.test.ts).

import { getPublishedCalculators } from './calculator-meta';

export function getHubKeywords(): Record<string, readonly string[]> {
  return Object.fromEntries(getPublishedCalculators().map((c) => [c.slug, c.keywords ?? []]));
}
