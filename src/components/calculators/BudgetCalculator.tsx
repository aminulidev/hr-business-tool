'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { rev: number; c: number; grossProfit: number; totalOpex: number; netIncome: number; netMargin: number; breakEven: number; label: string; }

export default function BudgetCalculator() {
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');
  const [salaries, setSalaries] = useState('');
  const [marketing, setMarketing] = useState('');
  const [rent, setRent] = useState('');
  const [other, setOther] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ revenue: string; cogs: string; salaries: string; marketing: string; rent: string; other: string }>('budget-calculator');

  const rev = parseFloat(revenue) || 0;
  const c = parseFloat(cogs) || 0;
  const sal = parseFloat(salaries) || 0;
  const mkt = parseFloat(marketing) || 0;
  const rnt = parseFloat(rent) || 0;
  const oth = parseFloat(other) || 0;
  const grossProfit = rev - c;
  const totalOpex = sal + mkt + rnt + oth;
  const netIncome = grossProfit - totalOpex;
  const netMargin = rev > 0 ? (netIncome / rev) * 100 : 0;
  const breakEven = grossProfit > 0 ? (totalOpex / grossProfit) * rev : 0;

  const handleTryExample = () => { setRevenue('1000000'); setCogs('400000'); setSalaries('300000'); setMarketing('80000'); setRent('60000'); setOther('40000'); setCalculated(false); };
  const handleCalculate = () => {
    if (rev > 0) {
      setCalculated(true);
      saveEntry({ revenue, cogs, salaries, marketing, rent, other }, `Net income: ${formatCurrency(netIncome)} (${netMargin.toFixed(1)}% margin)`);
    }
  };
  const handleReset = () => { setRevenue(''); setCogs(''); setSalaries(''); setMarketing(''); setRent(''); setOther(''); setCalculated(false); };
  const handleRestore = (i: { revenue: string; cogs: string; salaries: string; marketing: string; rent: string; other: string }) => { setRevenue(i.revenue); setCogs(i.cogs); setSalaries(i.salaries); setMarketing(i.marketing); setRent(i.rent); setOther(i.other); setCalculated(true); };
  const snap = (): Snapshot => ({ rev, c, grossProfit, totalOpex, netIncome, netMargin, breakEven, label: `Net income: ${formatCurrency(netIncome)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Wallet className="inline h-3 w-3 mr-1" />
          {`Build an annual business budget: revenue, COGS, operating expenses, capex. See projected net income and break-even revenue.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenue">Projected Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="revenue" type="number" step="any" min="0" placeholder="1000000" className="pl-7"
                value={revenue} onChange={(e) => { setRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cogs">COGS (direct costs)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="cogs" type="number" step="any" min="0" placeholder="400000" className="pl-7"
                value={cogs} onChange={(e) => { setCogs(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salaries">Salaries & Benefits</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="salaries" type="number" step="any" min="0" placeholder="300000" className="pl-7"
                value={salaries} onChange={(e) => { setSalaries(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketing">Marketing & Sales</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="marketing" type="number" step="any" min="0" placeholder="80000" className="pl-7"
                value={marketing} onChange={(e) => { setMarketing(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rent">Rent & Utilities</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="rent" type="number" step="any" min="0" placeholder="60000" className="pl-7"
                value={rent} onChange={(e) => { setRent(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="other">Other Operating Expenses</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="other" type="number" step="any" min="0" placeholder="40000" className="pl-7"
                value={other} onChange={(e) => { setOther(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={rev <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Budget
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Projected Net Income</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(netIncome)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Net margin: ${netMargin.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Break-even revenue: ${formatCurrency(breakEven)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{netIncome > 0 ? "Profitable" : "Loss"}</Badge>
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
                    <p className="text-xs text-muted-foreground mb-1">Gross Profit</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(grossProfit)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Opex</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalOpex)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Net Income</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(netIncome)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Annual budget: revenue - COGS = gross profit; gross profit - operating expenses (salaries, marketing, rent, other) = net income. Break-even revenue = (opex / gross margin %) × revenue. Track budget vs actuals monthly. Adjust quarterly. See our Cash Flow Forecast Calculator for liquidity planning.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'Gross Profit', valueA: formatCurrency(compareA.grossProfit), valueB: formatCurrency(compareB.grossProfit), numA: compareA.grossProfit, numB: compareB.grossProfit },
          { label: 'Net Income', valueA: formatCurrency(compareA.netIncome), valueB: formatCurrency(compareB.netIncome), numA: compareA.netIncome, numB: compareB.netIncome },
          { label: 'Break-even Rev', valueA: formatCurrency(compareA.breakEven), valueB: formatCurrency(compareB.breakEven), numA: compareA.breakEven, numB: compareB.breakEven }
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
