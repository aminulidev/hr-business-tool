'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { rev: number; cost: number; tenure: number; annualValue: number; rampLoss: number; totalValue: number; annualROI: number; label: string; }

export default function EmployeeLifetimeValueCalculator() {
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [annualCost, setAnnualCost] = useState('Salary + benefits + taxes');
  const [avgTenure, setAvgTenure] = useState('');
  const [rampMonths, setRampMonths] = useState('Time to full productivity');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ annualRevenue: string; annualCost: string; avgTenure: string; rampMonths: string }>('employee-lifetime-value-calculator');

  const rev = parseFloat(annualRevenue) || 0;
  const cost = parseFloat(annualCost) || 0;
  const tenure = parseFloat(avgTenure) || 0;
  const ramp = parseFloat(rampMonths) || 0;
  const annualValue = rev - cost;
  const rampLoss = annualValue * (ramp / 12) * 0.5;
  const totalValue = annualValue * tenure - rampLoss;
  const annualROI = cost > 0 ? (annualValue / cost) * 100 : 0;

  const handleTryExample = () => { setAnnualRevenue('200000'); setAnnualCost('110000'); setAvgTenure('4'); setRampMonths('6'); setCalculated(false); };
  const handleCalculate = () => {
    if (rev > 0 && cost > 0 && tenure > 0) {
      setCalculated(true);
      saveEntry({ annualRevenue, annualCost, avgTenure, rampMonths }, `ELTV: ${formatCurrency(totalValue)} (ROI ${annualROI.toFixed(0)}%)`);
    }
  };
  const handleReset = () => { setAnnualRevenue(''); setAnnualCost(''); setAvgTenure(''); setRampMonths('6'); setCalculated(false); };
  const handleRestore = (i: { annualRevenue: string; annualCost: string; avgTenure: string; rampMonths: string }) => { setAnnualRevenue(i.annualRevenue); setAnnualCost(i.annualCost); setAvgTenure(i.avgTenure); setRampMonths(i.rampMonths); setCalculated(true); };
  const snap = (): Snapshot => ({ rev, cost, tenure, annualValue, rampLoss, totalValue, annualROI, label: `ELTV: ${formatCurrency(totalValue)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Activity className="inline h-3 w-3 mr-1" />
          {`Calculate Employee Lifetime Value (ELTV): net value an employee generates over their tenure minus total cost.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annualRevenue">Annual Revenue per Employee</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="annualRevenue" type="number" step="any" min="0" placeholder="200000" className="pl-7"
                value={annualRevenue} onChange={(e) => { setAnnualRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="annualCost">Annual Cost per Employee (loaded)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="annualCost" type="number" step="any" min="0" placeholder="110000" className="pl-7"
                value={annualCost} onChange={(e) => { setAnnualCost(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Salary + benefits + taxes</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgTenure">Average Tenure (years)</Label>
            <div className="relative">
              
              <Input id="avgTenure" type="number" step="any" min="0" placeholder="4"
                value={avgTenure} onChange={(e) => { setAvgTenure(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rampMonths">Ramp-up Period (months)</Label>
            <div className="relative">
              
              <Input id="rampMonths" type="number" step="any" min="0" placeholder="6"
                value={rampMonths} onChange={(e) => { setRampMonths(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Time to full productivity</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={rev <= 0 || cost <= 0 || tenure <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate ELTV
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Employee Lifetime Value</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalValue)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Annual value: ${formatCurrency(annualValue)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Annual ROI: ${annualROI.toFixed(0)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Ramp loss: ${formatCurrency(rampLoss)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annual Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(rev)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annual Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annual Value</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(annualValue)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ELTV</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalValue)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`ELTV = (annual revenue per employee - annual loaded cost) × tenure - ramp-up loss. Use to quantify retention ROI: extending average tenure by 1 year adds significant value. High ELTV roles justify higher retention investment. Low/negative ELTV = reassess pricing or role design. For turnover cost (the inverse), see our Cost of Turnover Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Annual Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'Annual Value', valueA: formatCurrency(compareA.annualValue), valueB: formatCurrency(compareB.annualValue), numA: compareA.annualValue, numB: compareB.annualValue },
          { label: 'ELTV', valueA: formatCurrency(compareA.totalValue), valueB: formatCurrency(compareB.totalValue), numA: compareA.totalValue, numB: compareB.totalValue },
          { label: 'Annual ROI', valueA: `${compareA.annualROI.toFixed(0)}%`, valueB: `${compareB.annualROI.toFixed(0)}%`, numA: compareA.annualROI, numB: compareB.annualROI }
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
