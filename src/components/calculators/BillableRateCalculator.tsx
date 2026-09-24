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

interface Snapshot { sal: number; ben: number; oh: number; util: number; pf: number; loadedCost: number; annualHours: number; billableHours: number; breakEvenRate: number; targetRate: number; label: string; }

export default function BillableRateCalculator() {
  const [targetSalary, setTargetSalary] = useState('');
  const [benefitsPct, setBenefitsPct] = useState('');
  const [overheadPct, setOverheadPct] = useState('');
  const [utilization, setUtilization] = useState('');
  const [profitPct, setProfitPct] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ targetSalary: string; benefitsPct: string; overheadPct: string; utilization: string; profitPct: string }>('billable-rate-calculator');

  const sal = parseFloat(targetSalary) || 0;
  const ben = parseFloat(benefitsPct) || 0;
  const oh = parseFloat(overheadPct) || 0;
  const util = parseFloat(utilization) || 0;
  const pf = parseFloat(profitPct) || 0;
  const loadedCost = sal * (1 + ben / 100) * (1 + oh / 100);
  const annualHours = 2080;
  const billableHours = annualHours * (util / 100);
  const breakEvenRate = billableHours > 0 ? loadedCost / billableHours : 0;
  const targetRate = breakEvenRate / (1 - pf / 100);

  const handleTryExample = () => { setTargetSalary('100000'); setBenefitsPct('30'); setOverheadPct('50'); setUtilization('65'); setProfitPct('20'); setCalculated(false); };
  const handleCalculate = () => {
    if (sal > 0 && util > 0) {
      setCalculated(true);
      saveEntry({ targetSalary, benefitsPct, overheadPct, utilization, profitPct }, `Rate: ${formatCurrency(targetRate)}/hr (break-even ${formatCurrency(breakEvenRate)})`);
    }
  };
  const handleReset = () => { setTargetSalary(''); setBenefitsPct('30'); setOverheadPct('50'); setUtilization('65'); setProfitPct('20'); setCalculated(false); };
  const handleRestore = (i: { targetSalary: string; benefitsPct: string; overheadPct: string; utilization: string; profitPct: string }) => { setTargetSalary(i.targetSalary); setBenefitsPct(i.benefitsPct); setOverheadPct(i.overheadPct); setUtilization(i.utilization); setProfitPct(i.profitPct); setCalculated(true); };
  const snap = (): Snapshot => ({ sal, ben, oh, util, pf, loadedCost, annualHours, billableHours, breakEvenRate, targetRate, label: `Rate: ${formatCurrency(targetRate)}/hr` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Calculate required billable rate from target salary, overhead multiplier, utilization rate, and profit margin.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="targetSalary">Target Annual Salary</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="targetSalary" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={targetSalary} onChange={(e) => { setTargetSalary(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="benefitsPct">Benefits & Payroll Taxes (%)</Label>
            <div className="relative">
              
              <Input id="benefitsPct" type="number" step="any" min="0" placeholder="30"
                value={benefitsPct} onChange={(e) => { setBenefitsPct(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="overheadPct">Overhead (%)</Label>
            <div className="relative">
              
              <Input id="overheadPct" type="number" step="any" min="0" placeholder="50"
                value={overheadPct} onChange={(e) => { setOverheadPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Rent, admin, tools</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="utilization">Utilization Rate (%)</Label>
            <div className="relative">
              
              <Input id="utilization" type="number" step="any" min="0" placeholder="65"
                value={utilization} onChange={(e) => { setUtilization(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Billable / total hours</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profitPct">Profit Margin (%)</Label>
            <div className="relative">
              
              <Input id="profitPct" type="number" step="any" min="0" placeholder="20"
                value={profitPct} onChange={(e) => { setProfitPct(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={sal <= 0 || util <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Billable Rate
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Required Billable Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(targetRate)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Break-even rate: ${formatCurrency(breakEvenRate)}/hr`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Loaded cost: ${formatCurrency(loadedCost)}/yr`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Billable hours: ${billableHours.toFixed(0)}/yr`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Loaded Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(loadedCost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Billable Hours</p>
                    <p className={`text-lg font-bold`}>{`{billableHours.toFixed(0)}h`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Break-Even Rate</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(breakEvenRate)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Target Rate</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(targetRate)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Billable rate = (salary x (1 + benefits%) x (1 + overhead%)) / (2080 x utilization%) / (1 - profit%). Typical: $100k salary -> $195k loaded -> 1,352 billable hours (65% util) -> $144 break-even -> $180 target (20% profit). See our Utilization Rate Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Loaded Cost', valueA: formatCurrency(compareA.loadedCost), valueB: formatCurrency(compareB.loadedCost), numA: compareA.loadedCost, numB: compareB.loadedCost },
          { label: 'Break-Even', valueA: formatCurrency(compareA.breakEvenRate), valueB: formatCurrency(compareB.breakEvenRate), numA: compareA.breakEvenRate, numB: compareB.breakEvenRate },
          { label: 'Target Rate', valueA: formatCurrency(compareA.targetRate), valueB: formatCurrency(compareB.targetRate), numA: compareA.targetRate, numB: compareB.targetRate }
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
