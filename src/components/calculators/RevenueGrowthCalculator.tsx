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

interface Snapshot { curr: number; prev: number; growthRate: number; annualizedRate: number; absoluteGrowth: number; label: string; }

export default function RevenueGrowthCalculator() {
  const [currentRevenue, setCurrentRevenue] = useState('');
  const [previousRevenue, setPreviousRevenue] = useState('');
  const [periodMonths, setPeriodMonths] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ currentRevenue: string; previousRevenue: string; periodMonths: string }>('revenue-growth-calculator');

  const curr = parseFloat(currentRevenue) || 0;
  const prev = parseFloat(previousRevenue) || 0;
  const mos = parseFloat(periodMonths) || 12;
  const growthRate = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
  const annualizedRate = mos > 0 ? (Math.pow(curr / prev, 12 / mos) - 1) * 100 : 0;
  const absoluteGrowth = curr - prev;

  const handleTryExample = () => { setCurrentRevenue('1200000'); setPreviousRevenue('1000000'); setPeriodMonths('12'); setCalculated(false); };
  const handleCalculate = () => {
    if (prev > 0) {
      setCalculated(true);
      saveEntry({ currentRevenue, previousRevenue, periodMonths }, `Growth: ${growthRate.toFixed(1)}% (${formatCurrency(absoluteGrowth)} increase)`);
    }
  };
  const handleReset = () => { setCurrentRevenue(''); setPreviousRevenue(''); setPeriodMonths('12'); setCalculated(false); };
  const handleRestore = (i: { currentRevenue: string; previousRevenue: string; periodMonths: string }) => { setCurrentRevenue(i.currentRevenue); setPreviousRevenue(i.previousRevenue); setPeriodMonths(i.periodMonths); setCalculated(true); };
  const snap = (): Snapshot => ({ curr, prev, growthRate, annualizedRate, absoluteGrowth, label: `Growth: ${growthRate.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          {`Calculate revenue growth rate (YoY, MoM, QoQ) and CAGR. See compound growth projections.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentRevenue">Current Period Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="currentRevenue" type="number" step="any" min="0" placeholder="1200000" className="pl-7"
                value={currentRevenue} onChange={(e) => { setCurrentRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="previousRevenue">Previous Period Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="previousRevenue" type="number" step="any" min="0" placeholder="1000000" className="pl-7"
                value={previousRevenue} onChange={(e) => { setPreviousRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="periodMonths">Period Length (months)</Label>
            <div className="relative">
              
              <Input id="periodMonths" type="number" step="any" min="0" placeholder="12"
                value={periodMonths} onChange={(e) => { setPeriodMonths(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">12=YoY, 3=QoQ, 1=MoM</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={prev <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Growth Rate
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Revenue Growth Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(growthRate)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Annualized: ${annualizedRate.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Absolute growth: ${formatCurrency(absoluteGrowth)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{growthRate > 20 ? "Hypergrowth" : growthRate > 10 ? "Strong" : growthRate > 0 ? "Growing" : "Declining"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Previous</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(prev)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Current</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(curr)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Growth Rate</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatPercent(growthRate)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annualized</p>
                    <p className={`text-lg font-bold`}>{`{annualizedRate.toFixed(1)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Revenue growth = (current - previous) / previous × 100. Annualized = (current/previous)^(12/months) - 1. SaaS growth benchmarks: < $1M ARR 100%+, $1-10M 60-90%, $10-100M 40-60%, $100M+ 20-40% (T2D3 rule). See our Revenue Forecast Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Previous', valueA: formatCurrency(compareA.prev), valueB: formatCurrency(compareB.prev), numA: compareA.prev, numB: compareB.prev },
          { label: 'Current', valueA: formatCurrency(compareA.curr), valueB: formatCurrency(compareB.curr), numA: compareA.curr, numB: compareB.curr },
          { label: 'Growth %', valueA: formatPercent(compareA.growthRate), valueB: formatPercent(compareB.growthRate), numA: compareA.growthRate, numB: compareB.growthRate }
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
