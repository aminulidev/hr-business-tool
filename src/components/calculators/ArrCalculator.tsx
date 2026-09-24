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

interface Snapshot { m: number; ac: number; arrFromMrr: number; totalArr: number; monthlyAvg: number; label: string; }

export default function ArrCalculator() {
  const [mrr, setMrr] = useState('');
  const [annualContracts, setAnnualContracts] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ mrr: string; annualContracts: string }>('arr-calculator');

  const m = parseFloat(mrr) || 0;
  const ac = parseFloat(annualContracts) || 0;
  const arrFromMrr = m * 12;
  const totalArr = arrFromMrr + ac;
  const monthlyAvg = totalArr / 12;

  const handleTryExample = () => { setMrr('100000'); setAnnualContracts('200000'); setCalculated(false); };
  const handleCalculate = () => {
    if (m > 0 || ac > 0) {
      setCalculated(true);
      saveEntry({ mrr, annualContracts }, `ARR: ${formatCurrency(totalArr)} (MRR: ${formatCurrency(m)}/mo)`);
    }
  };
  const handleReset = () => { setMrr(''); setAnnualContracts(''); setCalculated(false); };
  const handleRestore = (i: { mrr: string; annualContracts: string }) => { setMrr(i.mrr); setAnnualContracts(i.annualContracts); setCalculated(true); };
  const snap = (): Snapshot => ({ m, ac, arrFromMrr, totalArr, monthlyAvg, label: `ARR: ${formatCurrency(totalArr)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          {`Calculate Annual Recurring Revenue (ARR) from MRR or annual contracts.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mrr">Monthly Recurring Revenue (MRR)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="mrr" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={mrr} onChange={(e) => { setMrr(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="annualContracts">Additional Annual Contracts</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="annualContracts" type="number" step="any" min="0" placeholder="200000" className="pl-7"
                value={annualContracts} onChange={(e) => { setAnnualContracts(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={m <= 0 && ac <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate ARR
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Annual Recurring Revenue</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalArr)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`ARR from MRR: ${formatCurrency(arrFromMrr)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Monthly average: ${formatCurrency(monthlyAvg)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`MRR: ${formatCurrency(m)}/mo`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">MRR</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(m)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ARR from MRR</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(arrFromMrr)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total ARR</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalArr)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Monthly Avg</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(monthlyAvg)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`ARR = MRR x 12 + annual contracts. For pure subscription SaaS: ARR = MRR x 12.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'MRR', valueA: formatCurrency(compareA.m), valueB: formatCurrency(compareB.m), numA: compareA.m, numB: compareB.m },
          { label: 'ARR', valueA: formatCurrency(compareA.totalArr), valueB: formatCurrency(compareB.totalArr), numA: compareA.totalArr, numB: compareB.totalArr }
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
