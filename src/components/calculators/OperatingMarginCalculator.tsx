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

interface Snapshot { oi: number; rev: number; opMargin: number; label: string; }

export default function OperatingMarginCalculator() {
  const [operatingIncome, setOperatingIncome] = useState('');
  const [revenue, setRevenue] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ operatingIncome: string; revenue: string }>('operating-margin-calculator');

  const oi = parseFloat(operatingIncome) || 0;
  const rev = parseFloat(revenue) || 0;
  const opMargin = rev > 0 ? (oi / rev) * 100 : 0;

  const handleTryExample = () => { setOperatingIncome('250000'); setRevenue('1000000'); setCalculated(false); };
  const handleCalculate = () => {
    if (rev > 0) {
      setCalculated(true);
      saveEntry({ operatingIncome, revenue }, `Operating margin: ${opMargin.toFixed(1)}% (${formatCurrency(oi)} on ${formatCurrency(rev)})`);
    }
  };
  const handleReset = () => { setOperatingIncome(''); setRevenue(''); setCalculated(false); };
  const handleRestore = (i: { operatingIncome: string; revenue: string }) => { setOperatingIncome(i.operatingIncome); setRevenue(i.revenue); setCalculated(true); };
  const snap = (): Snapshot => ({ oi, rev, opMargin, label: `Operating margin: ${opMargin.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Percent className="inline h-3 w-3 mr-1" />
          {`Operating margin = operating income / revenue × 100. Measures operational profitability before interest and taxes. Tech: 25%, Retail: 5%, Manufacturing: 10%.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="operatingIncome">Operating Income (EBIT)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="operatingIncome" type="number" step="any" min="0" placeholder="250000" className="pl-7"
                value={operatingIncome} onChange={(e) => { setOperatingIncome(e.target.value); setCalculated(false); }} />
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
              Calculate Operating Margin
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Operating Margin</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(opMargin)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Operating income: ${formatCurrency(oi)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{'Tech 25%, Retail 5%, Manufacturing 10%'}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{opMargin < 5 ? "Low" : opMargin > 15 ? "Strong" : "Healthy"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Operating Income</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(oi)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(rev)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Operating Margin</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatPercent(opMargin)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Per $1 Rev</p>
                    <p className={`text-lg font-bold`}>{`${opMargin.toFixed(2)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Operating margin = operating income (EBIT) / revenue × 100. Measures profitability from core operations before interest and taxes. Industry benchmarks: tech 25%, healthcare 12%, manufacturing 10%, retail 5%, restaurants 9%. Higher = better operational efficiency. Different from net margin (after interest/taxes).`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Operating Income', valueA: formatCurrency(compareA.oi), valueB: formatCurrency(compareB.oi), numA: compareA.oi, numB: compareB.oi },
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'Operating Margin', valueA: formatPercent(compareA.opMargin), valueB: formatPercent(compareB.opMargin), numA: compareA.opMargin, numB: compareB.opMargin }
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
