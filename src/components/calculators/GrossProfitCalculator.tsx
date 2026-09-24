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

interface Snapshot { rev: number; cogs: number; grossProfit: number; grossMargin: number; markup: number; label: string; }

export default function GrossProfitCalculator() {
  const [revenue, setRevenue] = useState('');
  const [cogsValue, setCogsValue] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ revenue: string; cogsValue: string }>('gross-profit-calculator');

  const rev = parseFloat(revenue) || 0;
  const cogs = parseFloat(cogsValue) || 0;
  const grossProfit = rev - cogs;
  const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;
  const markup = cogs > 0 ? (grossProfit / cogs) * 100 : 0;

  const handleTryExample = () => { setRevenue('1000000'); setCogsValue('600000'); setCalculated(false); };
  const handleCalculate = () => {
    if (rev > 0) {
      setCalculated(true);
      saveEntry({ revenue, cogsValue }, `Gross profit: ${formatCurrency(grossProfit)} (${grossMargin.toFixed(1)}% margin)`);
    }
  };
  const handleReset = () => { setRevenue(''); setCogsValue(''); setCalculated(false); };
  const handleRestore = (i: { revenue: string; cogsValue: string }) => { setRevenue(i.revenue); setCogsValue(i.cogsValue); setCalculated(true); };
  const snap = (): Snapshot => ({ rev, cogs, grossProfit, grossMargin, markup, label: `Gross profit: ${formatCurrency(grossProfit)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Gross profit = revenue - COGS. Measures profit after direct costs. Retail: 30%, SaaS: 80%, Grocery: 25%.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenue">Total Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="revenue" type="number" step="any" min="0" placeholder="1000000" className="pl-7"
                value={revenue} onChange={(e) => { setRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cogsValue">Cost of Goods Sold (COGS)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="cogsValue" type="number" step="any" min="0" placeholder="600000" className="pl-7"
                value={cogsValue} onChange={(e) => { setCogsValue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={rev <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Gross Profit
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Gross Profit</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(grossProfit)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Gross margin: ${grossMargin.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Markup: ${markup.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'SaaS 80%, Retail 30%, Grocery 25%'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(rev)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">COGS</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cogs)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Gross Profit</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(grossProfit)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Gross Margin</p>
                    <p className={`text-lg font-bold`}>{`{grossMargin.toFixed(1)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Gross profit = revenue - COGS. Measures profit after direct production costs. Gross margin = gross profit / revenue × 100. Markup = gross profit / COGS × 100. Industry benchmarks: SaaS 80%, retail 30%, manufacturing 35%, grocery 25%. Higher = better. See our Gross Margin Calculator and Markup Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'COGS', valueA: formatCurrency(compareA.cogs), valueB: formatCurrency(compareB.cogs), numA: compareA.cogs, numB: compareB.cogs },
          { label: 'Gross Profit', valueA: formatCurrency(compareA.grossProfit), valueB: formatCurrency(compareB.grossProfit), numA: compareA.grossProfit, numB: compareB.grossProfit },
          { label: 'Gross Margin', valueA: `${compareA.grossMargin.toFixed(1)}%`, valueB: `${compareB.grossMargin.toFixed(1)}%`, numA: compareA.grossMargin, numB: compareB.grossMargin }
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
