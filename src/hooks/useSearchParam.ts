'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
};

/**
 * Read one query-string parameter on the client without a Suspense boundary
 * and without a setState-in-effect. Returns null during server rendering and
 * hydration, then the real value — React reconciles the difference itself.
 *
 * Used by merged calculators to open the tab their old URL redirected to,
 * e.g. /time-card-calculator?mode=breaks (Roadmap v2, Phase 15.1).
 */
export function useSearchParam(name: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  );
}
