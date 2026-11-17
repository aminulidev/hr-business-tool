// ---------------------------------------------------------------------------
// The home page's calculator list, as plain data
// ---------------------------------------------------------------------------
// HubPage is a client component (search box, category filter). It used to import
// the registry, which put all of it (every title, description and keyword of
// every entry, 240 kB) into the browser on the home page, and on every other
// page too, because Next prefetches the home link in the header. The server page
// now builds this list and passes it down as props; the client receives only the
// published calculators and only the fields its cards show. The keyword lists
// are not among them: they are needed only to search, so HubPage loads them on
// first use of the search box (hub-keywords.ts).
//
// Import this from Server Components only. Client components import the type.

import { getPublishedCalculators } from './calculator-meta';
import { iconMap, type IconName } from './registry/icons';

export interface HubCalculator {
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  /** /calculators/<slug> */
  path: string;
  /** Name in registry/icons.ts; components cannot cross from server to client */
  icon: IconName;
}

const ICON_NAMES = new Map(Object.entries(iconMap).map(([name, component]) => [component, name as IconName]));

/** The icon's name in iconMap, or undefined when the registry uses an icon the map does not have */
export function iconNameOf(icon: unknown): IconName | undefined {
  return ICON_NAMES.get(icon as (typeof iconMap)[IconName]);
}

export function getHubCalculators(): HubCalculator[] {
  return getPublishedCalculators().map((c) => ({
    slug: c.slug,
    title: c.title,
    shortDescription: c.shortDescription,
    category: c.category,
    path: c.path,
    icon: iconNameOf(c.icon) ?? 'Calculator',
  }));
}
