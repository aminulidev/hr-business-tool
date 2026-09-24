'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { cost: number; accDep: number; bookValue: number; depreciationPct: number; remainingValuePct: number; label: string; }

export default function BookValueCalculator() {
  const [originalCost, setOriginalCost] = useState('');
  const [accumulatedDepreciation, setAccumulatedDepreciation] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ originalCost: string; accumulatedDepreciation: string }>('book-value-calculator');

  const cost = parseFloat(originalCost) || 0;
  const accDep = parseFloat(accumulatedDepreciation) || 0;
  const bookValue = cost - accDep;
  const depreciationPct = cost > 0 ? (accDep / cost) * 100 : 0;
  const remainingValuePct = cost > 0 ? (bookValue / cost) * 100 : 0;

  const handleTryExample = () => { setOriginalCost('50000'); setAccumulatedDepreciation('30000'); setCalculated(false); };
  const handleCalculate = () => {
    if (cost > 0) {
      setCalculated(true);
      saveEntry({ originalCost, accumulatedDepreciation }, `Book value: ${formatCurrency(bookValue)} (${depreciationPct.toFixed(1)}% depreciated)`);
    }
  };
  const handleReset = () => { setOriginalCost(''); setAccumulatedDepreciation(''); setCalculated(false); };
  const handleRestore = (i: { originalCost: string; accumulatedDepreciation: string }) => { setOriginalCost(i.originalCost); setAccumulatedDepreciation(i.accumulatedDepreciation); setCalculated(true); };
  const snap = (): Snapshot => ({ cost, accDep, bookValue, depreciationPct, remainingValuePct, label: `BV: ${formatCurrency(bookValue)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingDown className="inline h-3 w-3 mr-1" />
          {`Calculate book value = cost - accumulated depreciation.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="originalCost">Original Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="originalCost" type="number" step="any" min="0" placeholder="50000" className="pl-7"
                value={originalCost} onChange={(e) => { setOriginalCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accumulatedDepreciation">Accumulated Depreciation</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="accumulatedDepreciation" type="number" step="any" min="0" placeholder="30000" className="pl-7"
                value={accumulatedDepreciation} onChange={(e) => { setAccumulatedDepreciation(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={cost <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Book Value
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Book Value</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(bookValue)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Depreciated: ${depreciationPct.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Remaining: ${remainingValuePct.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Original cost: ${formatCurrency(cost)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Original Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Acc. Depr.</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(accDep)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Book Value</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(bookValue)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Depr. %</p>
                    <p className={`text-lg font-bold`}>{`{depreciationPct.toFixed(1)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Book value = original cost - accumulated depreciation. Also called net book value or carrying value.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Cost', valueA: formatCurrency(compareA.cost), valueB: formatCurrency(compareB.cost), numA: compareA.cost, numB: compareB.cost },
          { label: 'Book Value', valueA: formatCurrency(compareA.bookValue), valueB: formatCurrency(compareB.bookValue), numA: compareA.bookValue, numB: compareB.bookValue }
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel rows={rows} labelA={compareA.label} labelB={compareB.label}
              onClear={() => { setCompareA(null); setCompareB(null); }}
              onSwap={() => { const t = compareA; setCompareA(compareB); setCompareB(t); }} />
          </div>
        );
      })()}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}
