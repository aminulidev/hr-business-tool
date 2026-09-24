'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { salary: number; mP25: number; mP50: number; mP75: number; mP90: number; vsP50: number; vsP75: number; percentile: number; label: string; }

export default function SalaryBenchmarkCalculator() {
  const [employeeSalary, setEmployeeSalary] = useState('');
  const [p25, setP25] = useState('');
  const [p50, setP50] = useState('');
  const [p75, setP75] = useState('');
  const [p90, setP90] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ employeeSalary: string; p25: string; p50: string; p75: string; p90: string }>('salary-benchmark-calculator');

  const salary = parseFloat(employeeSalary) || 0;
  const mP25 = parseFloat(p25) || 0;
  const mP50 = parseFloat(p50) || 0;
  const mP75 = parseFloat(p75) || 0;
  const mP90 = parseFloat(p90) || 0;
  const vsP50 = mP50 > 0 ? (salary / mP50) * 100 : 0;
  const vsP25 = mP25 > 0 ? (salary / mP25) * 100 : 0;
  const vsP75 = mP75 > 0 ? (salary / mP75) * 100 : 0;
  const percentile = salary <= mP25 ? 25 : salary <= mP50 ? 50 : salary <= mP75 ? 75 : salary <= mP90 ? 90 : 95;

  const handleTryExample = () => { setEmployeeSalary('85000'); setP25('70000'); setP50('85000'); setP75('100000'); setP90('115000'); setCalculated(false); };
  const handleCalculate = () => {
    if (salary > 0 && mP50 > 0) {
      setCalculated(true);
      saveEntry({ employeeSalary, p25, p50, p75, p90 }, `Salary: ${vsP50.toFixed(0)}% of median (${percentile}th percentile)`);
    }
  };
  const handleReset = () => { setEmployeeSalary(''); setP25(''); setP50(''); setP75(''); setP90(''); setCalculated(false); };
  const handleRestore = (i: { employeeSalary: string; p25: string; p50: string; p75: string; p90: string }) => { setEmployeeSalary(i.employeeSalary); setP25(i.p25); setP50(i.p50); setP75(i.p75); setP90(i.p90); setCalculated(true); };
  const snap = (): Snapshot => ({ salary, mP25, mP50, mP75, mP90, vsP50, vsP75, percentile, label: `${vsP50.toFixed(0)}% of median` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <BarChart3 className="inline h-3 w-3 mr-1" />
          {`Compare employee salary to market benchmark by percentiles (25th, 50th, 75th, 90th). Identify pay gaps and adjust bands.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeSalary">Employee Salary</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="employeeSalary" type="number" step="any" min="0" placeholder="85000" className="pl-7"
                value={employeeSalary} onChange={(e) => { setEmployeeSalary(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="p25">Market 25th Percentile</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="p25" type="number" step="any" min="0" placeholder="70000" className="pl-7"
                value={p25} onChange={(e) => { setP25(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="p50">Market 50th Percentile (Median)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="p50" type="number" step="any" min="0" placeholder="85000" className="pl-7"
                value={p50} onChange={(e) => { setP50(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="p75">Market 75th Percentile</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="p75" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={p75} onChange={(e) => { setP75(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="p90">Market 90th Percentile</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="p90" type="number" step="any" min="0" placeholder="115000" className="pl-7"
                value={p90} onChange={(e) => { setP90(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={salary <= 0 || mP50 <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Compare to Benchmark
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Salary vs Market</p>
                <p className="text-4xl font-bold text-emerald-600">{`{vsP50.toFixed(0)}% of median`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Estimated percentile: ${percentile}th`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`vs P75: ${vsP75.toFixed(0)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Target: 90-110% of median'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Employee Salary</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(salary)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Market Median</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(mP50)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">vs Median</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{vsP50.toFixed(0)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Percentile</p>
                    <p className={`text-lg font-bold`}>{`{percentile}th`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Salary benchmarking compares employee pay to market data (BLS, Payscale, Glassdoor, Radford). Target: 90-110% of median (P50). Below P25 = retention risk. Above P90 = budget pressure. Adjust pay bands annually for inflation (3-4%) and market shifts. For comp-ratio analysis, see our Compensation Ratio Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Salary', valueA: formatCurrency(compareA.salary), valueB: formatCurrency(compareB.salary), numA: compareA.salary, numB: compareB.salary },
          { label: 'Market Median', valueA: formatCurrency(compareA.mP50), valueB: formatCurrency(compareB.mP50), numA: compareA.mP50, numB: compareB.mP50 },
          { label: 'vs Median', valueA: `${compareA.vsP50.toFixed(0)}%`, valueB: `${compareB.vsP50.toFixed(0)}%`, numA: compareA.vsP50, numB: compareB.vsP50 },
          { label: 'Percentile', valueA: `${compareA.percentile}th`, valueB: `${compareB.percentile}th`, numA: compareA.percentile, numB: compareB.percentile }
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
