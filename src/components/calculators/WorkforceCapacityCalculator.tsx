'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { hc: number; hpw: number; rate: number; util: number; weeklyHours: number; productiveHours: number; weeklyCapacity: number; annualCapacity: number; monthlyCapacity: number; label: string; }

export default function WorkforceCapacityCalculator() {
  const [headcount, setHeadcount] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [productivityRate, setProductivityRate] = useState('');
  const [utilizationRate, setUtilizationRate] = useState('Productive vs available');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ headcount: string; hoursPerWeek: string; productivityRate: string; utilizationRate: string }>('workforce-capacity-calculator');

  const hc = parseFloat(headcount) || 0;
  const hpw = parseFloat(hoursPerWeek) || 0;
  const rate = parseFloat(productivityRate) || 0;
  const util = parseFloat(utilizationRate) || 0;
  const weeklyHours = hc * hpw;
  const productiveHours = weeklyHours * (util / 100);
  const weeklyCapacity = productiveHours * rate;
  const annualCapacity = weeklyCapacity * 52;
  const monthlyCapacity = annualCapacity / 12;

  const handleTryExample = () => { setHeadcount('50'); setHoursPerWeek('40'); setProductivityRate('100'); setUtilizationRate('80'); setCalculated(false); };
  const handleCalculate = () => {
    if (hc > 0 && rate > 0) {
      setCalculated(true);
      saveEntry({ headcount, hoursPerWeek, productivityRate, utilizationRate }, `Capacity: ${formatCurrency(weeklyCapacity)}/week (${formatCurrency(annualCapacity)}/yr)`);
    }
  };
  const handleReset = () => { setHeadcount(''); setHoursPerWeek('40'); setProductivityRate(''); setUtilizationRate('80'); setCalculated(false); };
  const handleRestore = (i: { headcount: string; hoursPerWeek: string; productivityRate: string; utilizationRate: string }) => { setHeadcount(i.headcount); setHoursPerWeek(i.hoursPerWeek); setProductivityRate(i.productivityRate); setUtilizationRate(i.utilizationRate); setCalculated(true); };
  const snap = (): Snapshot => ({ hc, hpw, rate, util, weeklyHours, productiveHours, weeklyCapacity, annualCapacity, monthlyCapacity, label: `Weekly: ${formatCurrency(weeklyCapacity)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Target className="inline h-3 w-3 mr-1" />
          {`Calculate maximum workforce output based on headcount, available hours, and productivity rate. Identify capacity gaps.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="headcount">Headcount</Label>
            <div className="relative">
              
              <Input id="headcount" type="number" step="any" min="0" placeholder="50"
                value={headcount} onChange={(e) => { setHeadcount(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hoursPerWeek">Hours per Week per Employee</Label>
            <div className="relative">
              
              <Input id="hoursPerWeek" type="number" step="any" min="0" placeholder="40"
                value={hoursPerWeek} onChange={(e) => { setHoursPerWeek(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="productivityRate">Output per Hour (units or $)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="productivityRate" type="number" step="any" min="0" placeholder="100" className="pl-7"
                value={productivityRate} onChange={(e) => { setProductivityRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="utilizationRate">Utilization Rate (%)</Label>
            <div className="relative">
              
              <Input id="utilizationRate" type="number" step="any" min="0" placeholder="80"
                value={utilizationRate} onChange={(e) => { setUtilizationRate(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Productive vs available</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={hc <= 0 || rate <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Capacity
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Maximum Output Capacity</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(weeklyCapacity)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Monthly: ${formatCurrency(monthlyCapacity)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`${annualCapacity.toLocaleString()} annual`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Utilization: ${util}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Weekly Hours</p>
                    <p className={`text-lg font-bold`}>{`{weeklyHours}h`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Productive Hours</p>
                    <p className={`text-lg font-bold`}>{`{productiveHours}h`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Weekly Capacity</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(weeklyCapacity)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annual Capacity</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(annualCapacity)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Workforce capacity = headcount × hours/week × utilization × output/hour. Use to identify capacity gaps (capacity vs forecast demand) and plan hiring. For headcount planning based on revenue targets, see our Workforce Planning Calculator. For utilization benchmarking, see our Employee Utilization Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Headcount', valueA: String(compareA.hc), valueB: String(compareB.hc), numA: compareA.hc, numB: compareB.hc },
          { label: 'Productive Hours', valueA: `${compareA.productiveHours}h`, valueB: `${compareB.productiveHours}h`, numA: compareA.productiveHours, numB: compareB.productiveHours },
          { label: 'Weekly Capacity', valueA: formatCurrency(compareA.weeklyCapacity), valueB: formatCurrency(compareB.weeklyCapacity), numA: compareA.weeklyCapacity, numB: compareB.weeklyCapacity },
          { label: 'Annual Capacity', valueA: formatCurrency(compareA.annualCapacity), valueB: formatCurrency(compareB.annualCapacity), numA: compareA.annualCapacity, numB: compareB.annualCapacity }
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
