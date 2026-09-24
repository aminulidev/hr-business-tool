'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { subs: number; avg: number; mrr: number; arr: number; dailyMRR: number; label: string; }

export default function MrrCalculator() {
  const [activeSubs, setActiveSubs] = useState('');
  const [avgMonthly, setAvgMonthly] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ activeSubs: string; avgMonthly: string }>('mrr-calculator');

  const subs = parseFloat(activeSubs) || 0;
  const avg = parseFloat(avgMonthly) || 0;
  const mrr = subs * avg;
  const arr = mrr * 12;
  const dailyMRR = mrr / 30;

  const handleTryExample = () => { setActiveSubs('500'); setAvgMonthly('100'); setCalculated(false); };
  const handleCalculate = () => {
    if (subs > 0 && avg > 0) {
      setCalculated(true);
      saveEntry({ activeSubs, avgMonthly }, `MRR: ${formatCurrency(mrr)} (ARR: ${formatCurrency(arr)})`);
    }
  };
  const handleReset = () => { setActiveSubs(''); setAvgMonthly(''); setCalculated(false); };
  const handleRestore = (i: { activeSubs: string; avgMonthly: string }) => { setActiveSubs(i.activeSubs); setAvgMonthly(i.avgMonthly); setCalculated(true); };
  const snap = (): Snapshot => ({ subs, avg, mrr, arr, dailyMRR, label: `MRR: ${formatCurrency(mrr)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          {`Calculate Monthly Recurring Revenue (MRR) from active subscriptions.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="activeSubs">Active Subscriptions</Label>
            <div className="relative">
              
              <Input id="activeSubs" type="number" step="any" min="0" placeholder="500"
                value={activeSubs} onChange={(e) => { setActiveSubs(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgMonthly">Average Monthly Subscription</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="avgMonthly" type="number" step="any" min="0" placeholder="100" className="pl-7"
                value={avgMonthly} onChange={(e) => { setAvgMonthly(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={subs <= 0 || avg <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate MRR
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Monthly Recurring Revenue</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(mrr)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`ARR: ${formatCurrency(arr)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Daily MRR: ${formatCurrency(dailyMRR)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`${subs} active subscriptions`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Subscriptions</p>
                    <p className={`text-lg font-bold`}>{`{subs}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Avg Subscription</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(avg)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">MRR</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(mrr)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ARR</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(arr)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`MRR = active subscriptions x average monthly subscription. ARR = MRR x 12.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Subs', valueA: String(compareA.subs), valueB: String(compareB.subs), numA: compareA.subs, numB: compareB.subs },
          { label: 'MRR', valueA: formatCurrency(compareA.mrr), valueB: formatCurrency(compareB.mrr), numA: compareA.mrr, numB: compareB.mrr },
          { label: 'ARR', valueA: formatCurrency(compareA.arr), valueB: formatCurrency(compareB.arr), numA: compareA.arr, numB: compareB.arr }
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
