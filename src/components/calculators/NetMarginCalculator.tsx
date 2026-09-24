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

interface Snapshot { ni: number; rev: number; netMargin: number; label: string; }

export default function NetMarginCalculator() {
  const [netIncome, setNetIncome] = useState('');
  const [revenue, setRevenue] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ netIncome: string; revenue: string }>('net-margin-calculator');

  const ni = parseFloat(netIncome) || 0;
  const rev = parseFloat(revenue) || 0;
  const netMargin = rev > 0 ? (ni / rev) * 100 : 0;
  const netProfit = ni;

  const handleTryExample = () => { setNetIncome('200000'); setRevenue('1000000'); setCalculated(false); };
  const handleCalculate = () => {
    if (rev > 0) {
      setCalculated(true);
      saveEntry({ netIncome, revenue }, `Net margin: ${netMargin.toFixed(1)}% (${formatCurrency(ni)} on ${formatCurrency(rev)})`);
    }
  };
  const handleReset = () => { setNetIncome(''); setRevenue(''); setCalculated(false); };
  const handleRestore = (i: { netIncome: string; revenue: string }) => { setNetIncome(i.netIncome); setRevenue(i.revenue); setCalculated(true); };
  const snap = (): Snapshot => ({ ni, rev, netMargin, label: `Net margin: ${netMargin.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Percent className="inline h-3 w-3 mr-1" />
          {`Net profit margin = net income / revenue × 100. Measures bottom-line profitability. Tech: 20%, Retail: 3%, Restaurants: 5%.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="netIncome">Net Income</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="netIncome" type="number" step="any" min="0" placeholder="200000" className="pl-7"
                value={netIncome} onChange={(e) => { setNetIncome(e.target.value); setCalculated(false); }} />
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
              Calculate Net Margin
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Net Profit Margin</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(netMargin)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Net profit: ${formatCurrency(ni)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{'Tech 20%, Retail 3%, Restaurants 5%'}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{netMargin < 5 ? "Low margin" : netMargin > 15 ? "High margin" : "Healthy"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Net Income</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(ni)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(rev)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Net Margin</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatPercent(netMargin)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Per $100 Rev</p>
                    <p className={`text-lg font-bold`}>{`{netMargin.toFixed(2)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Net margin = net income / revenue × 100. Measures how much of each revenue dollar becomes profit. Industry benchmarks: tech 20%, healthcare 8%, retail 3%, restaurants 5%, manufacturing 7%. Compare to industry average — high margin indicates pricing power or cost efficiency.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Net Income', valueA: formatCurrency(compareA.ni), valueB: formatCurrency(compareB.ni), numA: compareA.ni, numB: compareB.ni },
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'Net Margin', valueA: formatPercent(compareA.netMargin), valueB: formatPercent(compareB.netMargin), numA: compareA.netMargin, numB: compareB.netMargin }
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
