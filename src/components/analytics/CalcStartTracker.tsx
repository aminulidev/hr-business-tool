'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/**
 * Fires `calc_start` once per page view, the first time the visitor edits anything inside the
 * calculator. Most calculators compute live, so there is no "Calculate" click to count; this is
 * the measure of whether a visit actually used the tool. Mounted by the calculator page layout
 * and by the embed page, so no calculator needs its own tracking code.
 */
export default function CalcStartTracker({ scope = '.calculator-form' }: { scope?: string }) {
  useEffect(() => {
    let fired = false;
    const onEdit = (e: Event) => {
      if (fired) return;
      const target = e.target as Element | null;
      if (!target?.closest?.(scope)) return;
      fired = true;
      track('calc_start');
      document.removeEventListener('input', onEdit, true);
      document.removeEventListener('change', onEdit, true);
    };
    document.addEventListener('input', onEdit, true);
    document.addEventListener('change', onEdit, true);
    return () => {
      document.removeEventListener('input', onEdit, true);
      document.removeEventListener('change', onEdit, true);
    };
  }, [scope]);
  return null;
}
