'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { hours: number; rate: number; laborCost: number; loadedCost: number; profit: number; totalPrice: number; effectiveRate: number; label: string; }

export default function ProjectPricingCalculator() {
  const [estimatedHours, setEstimatedHours] = useState('');
  const [baseRate, setBaseRate] = useState('');
  const [overheadMult, setOverheadMult] = useState('');
  const [profitMargin, setProfitMargin] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ estimatedHours: string; baseRate: string; overheadMult: string; profitMargin: string }>('project-pricing-calculator');

  const hours = parseFloat(estimatedHours) || 0;
  const rate = parseFloat(baseRate) || 0;
  const oh = parseFloat(overheadMult) || 1;
  const pm = parseFloat(profitMargin) || 0;
  const laborCost = hours * rate;
  const loadedCost = laborCost * oh;
  const profit = loadedCost * (pm / 100);
  const totalPrice = loadedCost + profit;
  const effectiveRate = hours > 0 ? totalPrice / hours : 0;

  const handleTryExample = () => { setEstimatedHours('80'); setBaseRate('75'); setOverheadMult('1.3'); setProfitMargin('20'); setCalculated(false); };
  const handleCalculate = () => {
    if (hours > 0 && rate > 0) {
      setCalculated(true);
      saveEntry({ estimatedHours, baseRate, overheadMult, profitMargin }, `Price: ${formatCurrency(totalPrice)} (${formatCurrency(effectiveRate)}/hr effective)`);
    }
  };
  const handleReset = () => { setEstimatedHours(''); setBaseRate(''); setOverheadMult('1.3'); setProfitMargin('20'); setCalculated(false); };
  const handleRestore = (i: { estimatedHours: string; baseRate: string; overheadMult: string; profitMargin: string }) => { setEstimatedHours(i.estimatedHours); setBaseRate(i.baseRate); setOverheadMult(i.overheadMult); setProfitMargin(i.profitMargin); setCalculated(true); };
  const snap = (): Snapshot => ({ hours, rate, laborCost, loadedCost, profit, totalPrice, effectiveRate, label: `Price: ${formatCurrency(totalPrice)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Calculate fixed-bid project price from estimated hours, hourly rate, overhead multiplier, and profit margin.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimatedHours">Estimated Hours</Label>
            <div className="relative">
              
              <Input id="estimatedHours" type="number" step="any" min="0" placeholder="80"
                value={estimatedHours} onChange={(e) => { setEstimatedHours(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="baseRate">Base Hourly Rate</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="baseRate" type="number" step="any" min="0" placeholder="75" className="pl-7"
                value={baseRate} onChange={(e) => { setBaseRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="overheadMult">Overhead Multiplier</Label>
            <div className="relative">
              
              <Input id="overheadMult" type="number" step="any" min="0" placeholder="1.3"
                value={overheadMult} onChange={(e) => { setOverheadMult(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">1.3 = 30% overhead</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profitMargin">Desired Profit Margin (%)</Label>
            <div className="relative">
              
              <Input id="profitMargin" type="number" step="any" min="0" placeholder="20"
                value={profitMargin} onChange={(e) => { setProfitMargin(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={hours <= 0 || rate <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Project Price
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Project Price</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalPrice)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Loaded cost: ${formatCurrency(loadedCost)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Profit: ${formatCurrency(profit)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Effective rate: ${formatCurrency(effectiveRate)}/hr`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Labor Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(laborCost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Loaded Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(loadedCost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Price</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalPrice)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Eff. Rate</p>
                    <p className={`text-lg font-bold`}>{`${formatCurrency(effectiveRate)}/hr`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Project price = (hours x rate x overhead) x (1 + profit margin). Overhead covers non-billable time (admin, sales, training) - typically 1.25-1.5x. Profit margin 15-30% typical. See our Estimate Calculator for three-point estimation.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Hours', valueA: String(compareA.hours), valueB: String(compareB.hours), numA: compareA.hours, numB: compareB.hours },
          { label: 'Total Price', valueA: formatCurrency(compareA.totalPrice), valueB: formatCurrency(compareB.totalPrice), numA: compareA.totalPrice, numB: compareB.totalPrice },
          { label: 'Eff. Rate', valueA: `${formatCurrency(compareA.effectiveRate)}/hr`, valueB: `${formatCurrency(compareB.effectiveRate)}/hr`, numA: compareA.effectiveRate, numB: compareB.effectiveRate }
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
