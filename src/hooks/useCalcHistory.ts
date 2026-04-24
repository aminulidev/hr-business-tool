'use client';

import { useState, useCallback, useEffect } from 'react';
import type { CalculatorSlug } from '@/lib/calculator-meta';

export interface CalcHistoryEntry<T = Record<string, string>> {
  id: string;
  timestamp: number;
  inputs: T;
  summary: string;
}

const MAX_ENTRIES = 15;

function storageKey(slug: CalculatorSlug): string {
  return `calchub_history_${slug}`;
}

function readStorage<T>(slug: CalculatorSlug): CalcHistoryEntry<T>[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKey(slug));
    return raw ? (JSON.parse(raw) as CalcHistoryEntry<T>[]) : [];
  } catch {
    return [];
  }
}

function writeStorage<T>(slug: CalculatorSlug, entries: CalcHistoryEntry<T>[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(slug), JSON.stringify(entries));
  } catch {
    // Quota exceeded or private mode — silently ignore
  }
}

export function useCalcHistory<T = Record<string, string>>(slug: CalculatorSlug) {
  const [history, setHistory] = useState<CalcHistoryEntry<T>[]>([]);

  // Load from localStorage on mount (client-only)
  useEffect(() => {
    setHistory(readStorage<T>(slug));
  }, [slug]);

  const saveEntry = useCallback(
    (inputs: T, summary: string) => {
      const entry: CalcHistoryEntry<T> = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        inputs,
        summary,
      };
      setHistory((prev) => {
        const updated = [entry, ...prev].slice(0, MAX_ENTRIES);
        writeStorage<T>(slug, updated);
        return updated;
      });
    },
    [slug]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey(slug));
    }
  }, [slug]);

  return { history, saveEntry, clearHistory };
}
