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

let initialQuery: URLSearchParams | null = null;
const noopSubscribe = () => () => {};

/**
 * The query string as it was when the page first rendered on the client; null on
 * the server and during hydration. The snapshot is taken once, so a later
 * history.replaceState() (share links) never changes it.
 *
 * Paycheck-type calculators key their form on `useInitialQuery()?.toString()`:
 * the server renders defaults, then the client mounts the form a second time
 * with the shared values — instead of copying the URL into state in an effect.
 */
export function useInitialQuery(): URLSearchParams | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      if (initialQuery === null) initialQuery = new URLSearchParams(window.location.search);
      return initialQuery;
    },
    () => null,
  );
}
