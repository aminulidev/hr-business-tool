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

interface Snapshot { totalRev: number; totalCost: number; netValue: number; roi: number; payback: number; label: string; }

export default function RecruitingRoiCalculator() {
  const [recruitingCost, setRecruitingCost] = useState('');
  const [newHireSalary, setNewHireSalary] = useState('');
  const [newHireRevenue, setNewHireRevenue] = useState('');
  const [numHires, setNumHires] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ recruitingCost: string; newHireSalary: string; newHireRevenue: string; numHires: string }>('recruiting-roi-calculator');

  const cost = parseFloat(recruitingCost) || 0;
  const salary = parseFloat(newHireSalary) || 0;
  const rev = parseFloat(newHireRevenue) || 0;
  const hires = parseFloat(numHires) || 0;
  const totalRev = rev * hires;
  const totalCost = cost + (salary * hires);
  const netValue = totalRev - totalCost;
  const roi = cost > 0 ? (netValue / cost) * 100 : 0;
  const payback = rev > 0 ? (cost / hires) / (rev / 12) : 0;

  const handleTryExample = () => { setRecruitingCost('25000'); setNewHireSalary('80000'); setNewHireRevenue('150000'); setNumHires('3'); setCalculated(false); };
  const handleCalculate = () => {
    if (cost > 0 && rev > 0) {
      setCalculated(true);
      saveEntry({ recruitingCost, newHireSalary, newHireRevenue, numHires }, `ROI: ${roi.toFixed(0)}% (${formatCurrency(netValue)} net)`);
    }
  };
  const handleReset = () => { setRecruitingCost(''); setNewHireSalary(''); setNewHireRevenue(''); setNumHires(''); setCalculated(false); };
  const handleRestore = (i: { recruitingCost: string; newHireSalary: string; newHireRevenue: string; numHires: string }) => { setRecruitingCost(i.recruitingCost); setNewHireSalary(i.newHireSalary); setNewHireRevenue(i.newHireRevenue); setNumHires(i.numHires); setCalculated(true); };
  const snap = (): Snapshot => ({ totalRev, totalCost, netValue, roi, payback, label: `ROI: ${roi.toFixed(0)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <BarChart3 className="inline h-3 w-3 mr-1" />
          {`Calculate recruiting ROI: value of new hire productivity vs recruiting cost, with payback period and ROI %.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recruitingCost">Total Recruiting Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="recruitingCost" type="number" step="any" min="0" placeholder="25000" className="pl-7"
                value={recruitingCost} onChange={(e) => { setRecruitingCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newHireSalary">New Hire Annual Salary</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="newHireSalary" type="number" step="any" min="0" placeholder="80000" className="pl-7"
                value={newHireSalary} onChange={(e) => { setNewHireSalary(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newHireRevenue">New Hire Annual Revenue Generated</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="newHireRevenue" type="number" step="any" min="0" placeholder="150000" className="pl-7"
                value={newHireRevenue} onChange={(e) => { setNewHireRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="numHires">Number of Hires</Label>
            <div className="relative">
              
              <Input id="numHires" type="number" step="any" min="0" placeholder="3"
                value={numHires} onChange={(e) => { setNumHires(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={cost <= 0 || rev <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Recruiting ROI
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Recruiting ROI</p>
                <p className="text-4xl font-bold text-emerald-600">{`{roi.toFixed(0)}%`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Net value: ${formatCurrency(netValue)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Payback: ${payback.toFixed(1)} months`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Good ROI: > 200%'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalRev)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalCost)}</p>
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
                {`Recruiting ROI = (value generated - recruiting cost) / recruiting cost × 100. Good ROI: >200% (3x return). Payback period: months for new hire to generate enough value to cover recruiting cost. For cost-per-hire breakdown, see our Cost per Hire Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total Revenue', valueA: formatCurrency(compareA.totalRev), valueB: formatCurrency(compareB.totalRev), numA: compareA.totalRev, numB: compareB.totalRev },
          { label: 'Total Cost', valueA: formatCurrency(compareA.totalCost), valueB: formatCurrency(compareB.totalCost), numA: compareA.totalCost, numB: compareB.totalCost },
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
