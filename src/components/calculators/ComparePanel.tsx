'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeftRight, TrendingUp, TrendingDown, Minus, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CompareRow {
  label: string;
  valueA: string;
  valueB: string;
  /** Raw numeric values for diff calculation (optional) */
  numA?: number;
  numB?: number;
  /** Whether higher numB is better (default true) */
  higherIsBetter?: boolean;
}

interface ComparePanelProps {
  rows: CompareRow[];
  labelA: string;
  labelB: string;
  onClear: () => void;
  onSwap?: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function DiffBadge({
  numA,
  numB,
  higherIsBetter = true,
}: {
  numA?: number;
  numB?: number;
  higherIsBetter?: boolean;
}) {
  if (numA === undefined || numB === undefined || numA === 0) return null;

  const diff = numB - numA;
  const pct = (Math.abs(diff) / Math.abs(numA)) * 100;
  if (pct < 0.01) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground">
        <Minus className="size-2.5" /> Same
      </span>
    );
  }

  const isPositive = diff > 0;
  const isBetter = higherIsBetter ? isPositive : !isPositive;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${
        isBetter
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-red-500 dark:text-red-400'
      }`}
    >
      {isPositive ? (
        <TrendingUp className="size-2.5" />
      ) : (
        <TrendingDown className="size-2.5" />
      )}
      {isPositive ? '+' : ''}
      {pct.toFixed(1)}%
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ComparePanel({
  rows,
  labelA,
  labelB,
  onClear,
  onSwap,
}: ComparePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const header = `Metric\t${labelA}\t${labelB}\tDifference %`;
    const body = rows.map(r => {
      let diffStr = '';
      if (r.numA !== undefined && r.numB !== undefined && r.numA !== 0) {
        const diff = ((r.numB - r.numA) / Math.abs(r.numA)) * 100;
        diffStr = `${diff > 0 ? '+' : ''}${diff.toFixed(2)}%`;
      }
      return `${r.label}\t${r.valueA}\t${r.valueB}\t${diffStr}`;
    }).join('\n');
    
    navigator.clipboard.writeText(`${header}\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="compare-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-primary/15 bg-primary/10">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="size-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Scenario Comparison</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {rows.length} metrics
            </Badge>
          </div>
          <div className="flex items-center gap-1.5">
            {onSwap && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSwap}
                className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeftRight className="size-3" />
                Swap
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={`h-7 px-2 text-xs gap-1 transition-colors ${
                copied ? 'text-emerald-600 bg-emerald-500/10' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-destructive"
            >
              <X className="size-3" />
              Clear
            </Button>
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_1fr_1fr] gap-0 text-xs font-semibold text-muted-foreground border-b border-border/60">
          <div className="px-4 py-2">Metric</div>
          <div className="px-3 py-2 text-center text-[10px]">Δ B vs A</div>
          <div className="px-4 py-2 text-right">
            <span className="inline-flex items-center gap-1">
              <span className="size-2 rounded-full bg-primary inline-block" />
              {labelA}
            </span>
          </div>
          <div className="px-4 py-2 text-right">
            <span className="inline-flex items-center gap-1">
              <span className="size-2 rounded-full bg-amber-500 inline-block" />
              {labelB}
            </span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/40">
          {rows.map((row, idx) => {
            const numA = row.numA;
            const numB = row.numB;
            const bHigher = numA !== undefined && numB !== undefined && numB > numA;
            const bLower  = numA !== undefined && numB !== undefined && numB < numA;
            const higherIsBetter = row.higherIsBetter !== false;

            return (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.25 }}
                className="grid grid-cols-[1fr_auto_1fr_1fr] gap-0 text-sm items-center hover:bg-muted/30 transition-colors"
              >
                {/* Label */}
                <div className="px-4 py-2.5 text-xs text-muted-foreground font-medium">
                  {row.label}
                </div>

                {/* Diff */}
                <div className="px-3 py-2.5 text-center">
                  <DiffBadge
                    numA={numA}
                    numB={numB}
                    higherIsBetter={higherIsBetter}
                  />
                </div>

                {/* Scenario A */}
                <div
                  className={`px-4 py-2.5 text-right text-xs font-semibold tabular-nums ${
                    bLower && higherIsBetter
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : bHigher && !higherIsBetter
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : ''
                  }`}
                >
                  {row.valueA}
                </div>

                {/* Scenario B */}
                <div
                  className={`px-4 py-2.5 text-right text-xs font-semibold tabular-nums ${
                    bHigher && higherIsBetter
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : bLower && !higherIsBetter
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : ''
                  }`}
                >
                  {row.valueB}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-border/40 text-[10px] text-muted-foreground">
          Green highlights the better value per metric. Adjust inputs and recalculate to update Scenario B.
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
