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

interface Snapshot { dep: number; salary: number; totalPct: number; costPerDeparture: number; totalCost: number; label: string; }

export default function CostOfTurnoverCalculator() {
  const [departures, setDepartures] = useState('');
  const [avgSalary, setAvgSalary] = useState('');
  const [replacementPct, setReplacementPct] = useState('Recruiting + agency fees');
  const [productivityPct, setProductivityPct] = useState('Ramp-up + vacancy');
  const [onboardingPct, setOnboardingPct] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ departures: string; avgSalary: string; replacementPct: string; productivityPct: string; onboardingPct: string }>('cost-of-turnover-calculator');

  const dep = parseFloat(departures) || 0;
  const salary = parseFloat(avgSalary) || 0;
  const replPct = parseFloat(replacementPct) || 0;
  const prodPct = parseFloat(productivityPct) || 0;
  const onbPct = parseFloat(onboardingPct) || 0;
  const totalPct = replPct + prodPct + onbPct;
  const costPerDeparture = salary * (totalPct / 100);
  const totalCost = dep * costPerDeparture;

  const handleTryExample = () => { setDepartures('10'); setAvgSalary('75000'); setReplacementPct('50'); setProductivityPct('75'); setOnboardingPct('15'); setCalculated(false); };
  const handleCalculate = () => {
    if (dep > 0 && salary > 0) {
      setCalculated(true);
      saveEntry({ departures, avgSalary, replacementPct, productivityPct, onboardingPct }, `Total cost: ${formatCurrency(totalCost)} (${dep} departures)`);
    }
  };
  const handleReset = () => { setDepartures(''); setAvgSalary(''); setReplacementPct('50'); setProductivityPct('75'); setOnboardingPct('15'); setCalculated(false); };
  const handleRestore = (i: { departures: string; avgSalary: string; replacementPct: string; productivityPct: string; onboardingPct: string }) => { setDepartures(i.departures); setAvgSalary(i.avgSalary); setReplacementPct(i.replacementPct); setProductivityPct(i.productivityPct); setOnboardingPct(i.onboardingPct); setCalculated(true); };
  const snap = (): Snapshot => ({ dep, salary, totalPct, costPerDeparture, totalCost, label: `${dep} departures · ${formatCurrency(totalCost)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Total turnover cost = replacement + lost productivity + onboarding + lost knowledge. Industry estimate: 50-200% of annual salary per departure.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="departures">Number of Departures</Label>
            <div className="relative">
              
              <Input id="departures" type="number" step="any" min="0" placeholder="10"
                value={departures} onChange={(e) => { setDepartures(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgSalary">Average Annual Salary</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="avgSalary" type="number" step="any" min="0" placeholder="75000" className="pl-7"
                value={avgSalary} onChange={(e) => { setAvgSalary(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="replacementPct">Replacement Cost (% of salary)</Label>
            <div className="relative">
              
              <Input id="replacementPct" type="number" step="any" min="0" placeholder="50"
                value={replacementPct} onChange={(e) => { setReplacementPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Recruiting + agency fees</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="productivityPct">Lost Productivity (% of salary)</Label>
            <div className="relative">
              
              <Input id="productivityPct" type="number" step="any" min="0" placeholder="75"
                value={productivityPct} onChange={(e) => { setProductivityPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Ramp-up + vacancy</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="onboardingPct">Onboarding/Training (% of salary)</Label>
            <div className="relative">
              
              <Input id="onboardingPct" type="number" step="any" min="0" placeholder="15"
                value={onboardingPct} onChange={(e) => { setOnboardingPct(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={dep <= 0 || salary <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Turnover Cost
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Turnover Cost</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalCost)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Per departure: ${formatCurrency(costPerDeparture)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`${totalPct}% of annual salary`}</Badge>
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{'Benchmark: 50-200% of salary'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Departures</p>
                    <p className={`text-lg font-bold`}>{`{dep}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Avg Salary</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(salary)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Cost/Departure</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(costPerDeparture)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total % of Salary</p>
                    <p className={`text-lg font-bold`}>{`{totalPct}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Cost of turnover ranges from 50% (entry-level) to 200% (executive/technical) of annual salary per departure. Components: recruiting (15-25%), lost productivity during vacancy (25-50%), onboarding/ramp-up (10-20%), lost institutional knowledge (5-15%). See our Replacement Cost Calculator for a per-role breakdown.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Departures', valueA: String(compareA.dep), valueB: String(compareB.dep), numA: compareA.dep, numB: compareB.dep },
          { label: 'Avg Salary', valueA: formatCurrency(compareA.salary), valueB: formatCurrency(compareB.salary), numA: compareA.salary, numB: compareB.salary },
          { label: 'Total % of Salary', valueA: `${compareA.totalPct}%`, valueB: `${compareB.totalPct}%`, numA: compareA.totalPct, numB: compareB.totalPct },
          { label: 'Total Cost', valueA: formatCurrency(compareA.totalCost), valueB: formatCurrency(compareB.totalCost), numA: compareA.totalCost, numB: compareB.totalCost }
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
