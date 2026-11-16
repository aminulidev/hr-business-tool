'use client';

import { calculatorComponents } from '@/lib/registry/components';
import type { CalculatorSlug } from '@/lib/registry';

/**
 * Renders the calculator for a slug. This file is the client boundary that makes the dynamic
 * imports in registry/components.tsx actually split the bundle.
 *
 * The page and embed routes are Server Components. When they imported the component map directly,
 * every calculator became a client reference of that one route, and the bundler shipped all of them
 * to every calculator page: about 1.1 MB of JavaScript (240 kB compressed) that the page never ran.
 * Importing the map from a client component instead means each `dynamic(() => import(...))` is a
 * real lazy chunk, and a page downloads only the calculator it shows. Server rendering is
 * unchanged: the calculator's HTML is still in the static page.
 *
 * Do not import registry/components.tsx from a Server Component.
 */
export default function CalculatorRenderer({ slug }: { slug: CalculatorSlug }) {
  const Calculator = calculatorComponents[slug];
  // registry.test.ts guarantees every published slug has an entry.
  return Calculator ? <Calculator /> : null;
}
