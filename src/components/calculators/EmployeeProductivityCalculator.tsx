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

interface Snapshot { rev: number; fte: number; revPerEmp: number; revPerHour: number; dailyOutput: number; label: string; }

export default function EmployeeProductivityCalculator() {
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [fteCount, setFteCount] = useState('');
  const [annualHours, setAnnualHours] = useState('Standard 2,080');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ annualRevenue: string; fteCount: string; annualHours: string }>('employee-productivity-calculator');

  const rev = parseFloat(annualRevenue) || 0;
  const fte = parseFloat(fteCount) || 0;
  const hours = parseFloat(annualHours) || 2080;
  const revPerEmp = fte > 0 ? rev / fte : 0;
  const totalHours = fte * hours;
  const revPerHour = totalHours > 0 ? rev / totalHours : 0;
  const dailyOutput = revPerHour * 8;

  const handleTryExample = () => { setAnnualRevenue('5000000'); setFteCount('25'); setAnnualHours('2080'); setCalculated(false); };
  const handleCalculate = () => {
    if (rev > 0 && fte > 0) {
      setCalculated(true);
      saveEntry({ annualRevenue, fteCount, annualHours }, `Rev/FTE: ${formatCurrency(revPerEmp)} (${formatCurrency(revPerHour)}/hour)`);
    }
  };
  const handleReset = () => { setAnnualRevenue(''); setFteCount(''); setAnnualHours('2080'); setCalculated(false); };
  const handleRestore = (i: { annualRevenue: string; fteCount: string; annualHours: string }) => { setAnnualRevenue(i.annualRevenue); setFteCount(i.fteCount); setAnnualHours(i.annualHours); setCalculated(true); };
  const snap = (): Snapshot => ({ rev, fte, revPerEmp, revPerHour, dailyOutput, label: `Rev/FTE: ${formatCurrency(revPerEmp)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Activity className="inline h-3 w-3 mr-1" />
          {`Calculate revenue per employee, revenue per labor hour, and output per FTE. Benchmark against industry averages.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annualRevenue">Annual Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="annualRevenue" type="number" step="any" min="0" placeholder="5000000" className="pl-7"
                value={annualRevenue} onChange={(e) => { setAnnualRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fteCount">FTE Count</Label>
            <div className="relative">
              
              <Input id="fteCount" type="number" step="any" min="0" placeholder="25"
                value={fteCount} onChange={(e) => { setFteCount(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="annualHours">Annual Hours per FTE</Label>
            <div className="relative">
              
              <Input id="annualHours" type="number" step="any" min="0" placeholder="2080"
                value={annualHours} onChange={(e) => { setAnnualHours(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Standard 2,080</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={rev <= 0 || fte <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Productivity
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Revenue per Employee</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(revPerEmp)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Revenue/hour: ${formatCurrency(revPerHour)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Daily output/FTE: ${formatCurrency(dailyOutput)}`}</Badge>
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{'Benchmark: Tech $400k, Retail $250k'}</Badge>
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
                    <p className="text-xs text-muted-foreground mb-1">FTE Count</p>
                    <p className={`text-lg font-bold`}>{`{fte}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue/FTE</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(revPerEmp)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue/Hour</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(revPerHour)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Revenue per employee benchmarks: tech $400k, finance $350k, manufacturing $300k, retail $250k, healthcare $200k, restaurants $100k. Higher = better. To improve: increase revenue, reduce headcount, or shift to higher-value work. See our Revenue per Employee Calculator for full benchmark data.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'FTE', valueA: String(compareA.fte), valueB: String(compareB.fte), numA: compareA.fte, numB: compareB.fte },
          { label: 'Rev/FTE', valueA: formatCurrency(compareA.revPerEmp), valueB: formatCurrency(compareB.revPerEmp), numA: compareA.revPerEmp, numB: compareB.revPerEmp },
          { label: 'Rev/Hour', valueA: formatCurrency(compareA.revPerHour), valueB: formatCurrency(compareB.revPerHour), numA: compareA.revPerHour, numB: compareB.revPerHour }
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
