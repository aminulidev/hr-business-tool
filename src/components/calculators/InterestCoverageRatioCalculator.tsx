'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { eb: number; int: number; icr: number; label: string; }

export default function InterestCoverageRatioCalculator() {
  const [ebit, setEbit] = useState('');
  const [interestExpense, setInterestExpense] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ ebit: string; interestExpense: string }>('interest-coverage-ratio-calculator');

  const eb = parseFloat(ebit) || 0;
  const int = parseFloat(interestExpense) || 0;
  const icr = int > 0 ? eb / int : 0;

  const handleTryExample = () => { setEbit('500000'); setInterestExpense('100000'); setCalculated(false); };
  const handleCalculate = () => {
    if (int > 0) {
      setCalculated(true);
      saveEntry({ ebit, interestExpense }, `ICR: ${icr.toFixed(2)}x (${formatCurrency(eb)} / ${formatCurrency(int)})`);
    }
  };
  const handleReset = () => { setEbit(''); setInterestExpense(''); setCalculated(false); };
  const handleRestore = (i: { ebit: string; interestExpense: string }) => { setEbit(i.ebit); setInterestExpense(i.interestExpense); setCalculated(true); };
  const snap = (): Snapshot => ({ eb, int, icr, label: `ICR: ${icr.toFixed(2)}x` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Scale className="inline h-3 w-3 mr-1" />
          {`Interest coverage ratio = EBIT / interest expense. Measures ability to pay debt interest. Healthy: 3.0+. Below 1.5 = distress.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ebit">EBIT (Operating Income)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="ebit" type="number" step="any" min="0" placeholder="500000" className="pl-7"
                value={ebit} onChange={(e) => { setEbit(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interestExpense">Interest Expense</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="interestExpense" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={interestExpense} onChange={(e) => { setInterestExpense(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={int <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Interest Coverage
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Interest Coverage Ratio</p>
                <p className="text-4xl font-bold text-emerald-600">{`{icr.toFixed(2)}x`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`EBIT: ${formatCurrency(eb)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Interest: ${formatCurrency(int)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{icr < 1.5 ? "Distress risk" : icr < 3 ? "Moderate" : "Healthy"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">EBIT</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(eb)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Interest</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(int)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ICR</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{icr.toFixed(2)}x`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className={`text-lg font-bold`}>{icr < 1.5 ? "Risk" : icr < 3 ? "Moderate" : "Healthy"}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Interest coverage ratio (ICR) = EBIT / interest expense. Also called Times Interest Earned (TIE). Measures ability to pay interest on debt. Healthy: 3.0+. Below 1.5 = distress risk (can't cover interest). Below 1.0 = imminent default. Lenders typically require ICR > 2.0-3.0 in loan covenants. See our Debt Ratio Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'EBIT', valueA: formatCurrency(compareA.eb), valueB: formatCurrency(compareB.eb), numA: compareA.eb, numB: compareB.eb },
          { label: 'Interest', valueA: formatCurrency(compareA.int), valueB: formatCurrency(compareB.int), numA: compareA.int, numB: compareB.int },
          { label: 'ICR', valueA: `${compareA.icr.toFixed(2)}x`, valueB: `${compareB.icr.toFixed(2)}x`, numA: compareA.icr, numB: compareB.icr }
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
