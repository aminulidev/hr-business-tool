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

interface Snapshot { ret: number; hr: number; proj: number; one: number; totalMonthly: number; annualRevenue: number; recurringPct: number; arr: number; label: string; }

export default function MonthlyRevenueCalculator() {
  const [retainerRevenue, setRetainerRevenue] = useState('');
  const [hourlyRevenue, setHourlyRevenue] = useState('');
  const [projectRevenue, setProjectRevenue] = useState('');
  const [oneTimeRevenue, setOneTimeRevenue] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ retainerRevenue: string; hourlyRevenue: string; projectRevenue: string; oneTimeRevenue: string }>('monthly-revenue-calculator');

  const ret = parseFloat(retainerRevenue) || 0;
  const hr = parseFloat(hourlyRevenue) || 0;
  const proj = parseFloat(projectRevenue) || 0;
  const one = parseFloat(oneTimeRevenue) || 0;
  const totalMonthly = ret + hr + proj + one;
  const annualRevenue = totalMonthly * 12;
  const recurringPct = totalMonthly > 0 ? (ret / totalMonthly) * 100 : 0;
  const arr = ret * 12;

  const handleTryExample = () => { setRetainerRevenue('8000'); setHourlyRevenue('3000'); setProjectRevenue('2000'); setOneTimeRevenue('500'); setCalculated(false); };
  const handleCalculate = () => {
    if (totalMonthly > 0) {
      setCalculated(true);
      saveEntry({ retainerRevenue, hourlyRevenue, projectRevenue, oneTimeRevenue }, `Revenue: ${formatCurrency(totalMonthly)}/mo (${recurringPct.toFixed(0)}% recurring)`);
    }
  };
  const handleReset = () => { setRetainerRevenue(''); setHourlyRevenue(''); setProjectRevenue(''); setOneTimeRevenue(''); setCalculated(false); };
  const handleRestore = (i: { retainerRevenue: string; hourlyRevenue: string; projectRevenue: string; oneTimeRevenue: string }) => { setRetainerRevenue(i.retainerRevenue); setHourlyRevenue(i.hourlyRevenue); setProjectRevenue(i.projectRevenue); setOneTimeRevenue(i.oneTimeRevenue); setCalculated(true); };
  const snap = (): Snapshot => ({ ret, hr, proj, one, totalMonthly, annualRevenue, recurringPct, arr, label: `Revenue: ${formatCurrency(totalMonthly)}/mo` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          {`Calculate monthly revenue from active retainers, hourly work, project milestones, and one-time projects.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="retainerRevenue">Retainer Revenue (monthly)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="retainerRevenue" type="number" step="any" min="0" placeholder="8000" className="pl-7"
                value={retainerRevenue} onChange={(e) => { setRetainerRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hourlyRevenue">Hourly Billable Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="hourlyRevenue" type="number" step="any" min="0" placeholder="3000" className="pl-7"
                value={hourlyRevenue} onChange={(e) => { setHourlyRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectRevenue">Project Milestone Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="projectRevenue" type="number" step="any" min="0" placeholder="2000" className="pl-7"
                value={projectRevenue} onChange={(e) => { setProjectRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="oneTimeRevenue">One-Time Projects</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="oneTimeRevenue" type="number" step="any" min="0" placeholder="500" className="pl-7"
                value={oneTimeRevenue} onChange={(e) => { setOneTimeRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={totalMonthly <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Monthly Revenue
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Monthly Revenue</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalMonthly)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`ARR (retainers): ${formatCurrency(arr)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Recurring: ${recurringPct.toFixed(0)}% of revenue`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Annual revenue: ${formatCurrency(annualRevenue)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Recurring (MRR)</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(ret)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">One-Time</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(hr + proj + one)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Monthly Total</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalMonthly)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annual Total</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(annualRevenue)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Monthly revenue = retainers (MRR) + hourly billable + project milestones + one-time. Track recurring % - higher = more predictable revenue. ARR = retainer x 12. Target: 60%+ recurring for stability.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Recurring', valueA: formatCurrency(compareA.ret), valueB: formatCurrency(compareB.ret), numA: compareA.ret, numB: compareB.ret },
          { label: 'Monthly Total', valueA: formatCurrency(compareA.totalMonthly), valueB: formatCurrency(compareB.totalMonthly), numA: compareA.totalMonthly, numB: compareB.totalMonthly },
          { label: 'Annual', valueA: formatCurrency(compareA.annualRevenue), valueB: formatCurrency(compareB.annualRevenue), numA: compareA.annualRevenue, numB: compareB.annualRevenue }
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
