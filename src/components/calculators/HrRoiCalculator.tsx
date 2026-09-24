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

interface Snapshot { ret: number; prod: number; cost: number; totalValue: number; budget: number; netValue: number; roi: number; payback: number; label: string; }

export default function HrRoiCalculator() {
  const [retentionSavings, setRetentionSavings] = useState('');
  const [productivityGains, setProductivityGains] = useState('');
  const [costReductions, setCostReductions] = useState('');
  const [hrBudget, setHrBudget] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ retentionSavings: string; productivityGains: string; costReductions: string; hrBudget: string }>('hr-roi-calculator');

  const ret = parseFloat(retentionSavings) || 0;
  const prod = parseFloat(productivityGains) || 0;
  const cost = parseFloat(costReductions) || 0;
  const budget = parseFloat(hrBudget) || 0;
  const totalValue = ret + prod + cost;
  const netValue = totalValue - budget;
  const roi = budget > 0 ? (netValue / budget) * 100 : 0;
  const payback = totalValue > 0 ? budget / (totalValue / 12) : 0;

  const handleTryExample = () => { setRetentionSavings('200000'); setProductivityGains('150000'); setCostReductions('50000'); setHrBudget('580000'); setCalculated(false); };
  const handleCalculate = () => {
    if (budget > 0 && totalValue > 0) {
      setCalculated(true);
      saveEntry({ retentionSavings, productivityGains, costReductions, hrBudget }, `HR ROI: ${roi.toFixed(0)}% (${formatCurrency(netValue)} net)`);
    }
  };
  const handleReset = () => { setRetentionSavings(''); setProductivityGains(''); setCostReductions(''); setHrBudget(''); setCalculated(false); };
  const handleRestore = (i: { retentionSavings: string; productivityGains: string; costReductions: string; hrBudget: string }) => { setRetentionSavings(i.retentionSavings); setProductivityGains(i.productivityGains); setCostReductions(i.costReductions); setHrBudget(i.hrBudget); setCalculated(true); };
  const snap = (): Snapshot => ({ ret, prod, cost, totalValue, budget, netValue, roi, payback, label: `ROI: ${roi.toFixed(0)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          {`Calculate HR ROI: value of retention savings, productivity gains, and cost reductions minus HR department budget.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="retentionSavings">Retention Savings (vs last year)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="retentionSavings" type="number" step="any" min="0" placeholder="200000" className="pl-7"
                value={retentionSavings} onChange={(e) => { setRetentionSavings(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="productivityGains">Productivity Gains</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="productivityGains" type="number" step="any" min="0" placeholder="150000" className="pl-7"
                value={productivityGains} onChange={(e) => { setProductivityGains(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="costReductions">HR Cost Reductions</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="costReductions" type="number" step="any" min="0" placeholder="50000" className="pl-7"
                value={costReductions} onChange={(e) => { setCostReductions(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hrBudget">Total HR Budget</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="hrBudget" type="number" step="any" min="0" placeholder="580000" className="pl-7"
                value={hrBudget} onChange={(e) => { setHrBudget(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={budget <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate HR ROI
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">HR ROI</p>
                <p className="text-4xl font-bold text-emerald-600">{`{roi.toFixed(0)}%`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Net value: ${formatCurrency(netValue)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Payback: ${payback.toFixed(1)} months`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Good HR ROI: > 50%'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalValue)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">HR Budget</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(budget)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Net Value</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(netValue)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Payback (mo)</p>
                    <p className={`text-lg font-bold`}>{`{payback.toFixed(1)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`HR ROI = (value created - HR budget) / HR budget × 100. Value = retention savings + productivity gains + cost reductions. Good ROI: >50%. HR ROI is harder to measure than other departments — use leading indicators (engagement, retention, time-to-fill) plus lagging financial impact. See our Recruiting ROI Calculator for hiring-specific ROI.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total Value', valueA: formatCurrency(compareA.totalValue), valueB: formatCurrency(compareB.totalValue), numA: compareA.totalValue, numB: compareB.totalValue },
          { label: 'HR Budget', valueA: formatCurrency(compareA.budget), valueB: formatCurrency(compareB.budget), numA: compareA.budget, numB: compareB.budget },
          { label: 'Net Value', valueA: formatCurrency(compareA.netValue), valueB: formatCurrency(compareB.netValue), numA: compareA.netValue, numB: compareB.netValue },
          { label: 'ROI %', valueA: `${compareA.roi.toFixed(0)}%`, valueB: `${compareB.roi.toFixed(0)}%`, numA: compareA.roi, numB: compareB.roi }
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
