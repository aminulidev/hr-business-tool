'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { eb: number; rev: number; ebitdaMargin: number; label: string; }

export default function EbitdaMarginCalculator() {
  const [ebitda, setEbitda] = useState('');
  const [revenue, setRevenue] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ ebitda: string; revenue: string }>('ebitda-margin-calculator');

  const eb = parseFloat(ebitda) || 0;
  const rev = parseFloat(revenue) || 0;
  const ebitdaMargin = rev > 0 ? (eb / rev) * 100 : 0;
  const ratio = rev > 0 ? eb / rev : 0;

  const handleTryExample = () => { setEbitda('300000'); setRevenue('1000000'); setCalculated(false); };
  const handleCalculate = () => {
    if (rev > 0) {
      setCalculated(true);
      saveEntry({ ebitda, revenue }, `EBITDA margin: ${ebitdaMargin.toFixed(1)}% (${formatCurrency(eb)} on ${formatCurrency(rev)})`);
    }
  };
  const handleReset = () => { setEbitda(''); setRevenue(''); setCalculated(false); };
  const handleRestore = (i: { ebitda: string; revenue: string }) => { setEbitda(i.ebitda); setRevenue(i.revenue); setCalculated(true); };
  const snap = (): Snapshot => ({ eb, rev, ebitdaMargin, label: `EBITDA margin: ${ebitdaMargin.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Percent className="inline h-3 w-3 mr-1" />
          {`EBITDA margin = EBITDA / revenue × 100. Strips out interest, taxes, depreciation, and amortization for operational comparison. SaaS: 30-40%.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ebitda">EBITDA</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="ebitda" type="number" step="any" min="0" placeholder="300000" className="pl-7"
                value={ebitda} onChange={(e) => { setEbitda(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="revenue">Total Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="revenue" type="number" step="any" min="0" placeholder="1000000" className="pl-7"
                value={revenue} onChange={(e) => { setRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={rev <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate EBITDA Margin
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">EBITDA Margin</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(ebitdaMargin)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`EBITDA: ${formatCurrency(eb)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{'SaaS 30-40%, Manufacturing 15%, Retail 10%'}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{ebitdaMargin < 10 ? "Low" : ebitdaMargin > 25 ? "Strong" : "Healthy"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">EBITDA</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(eb)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(rev)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">EBITDA Margin</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatPercent(ebitdaMargin)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Per $1 Rev</p>
                    <p className={`text-lg font-bold`}>{`${ebitdaMargin.toFixed(2)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`EBITDA margin = EBITDA / revenue × 100. EBITDA = earnings before interest, taxes, depreciation, amortization. Strips out financing and accounting decisions to compare operational profitability. SaaS: 30-40%, manufacturing: 15%, retail: 10%, restaurants: 15%. Higher = more operationally profitable.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'EBITDA', valueA: formatCurrency(compareA.eb), valueB: formatCurrency(compareB.eb), numA: compareA.eb, numB: compareB.eb },
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'EBITDA Margin', valueA: formatPercent(compareA.ebitdaMargin), valueB: formatPercent(compareB.ebitdaMargin), numA: compareA.ebitdaMargin, numB: compareB.ebitdaMargin }
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
