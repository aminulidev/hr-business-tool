'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { std: number; actual: number; rate: number; efficiency: number; variance: number; varianceCost: number; status: string; label: string; }

export default function LaborEfficiencyCalculator() {
  const [standardHours, setStandardHours] = useState('Expected hours for actual output');
  const [actualHours, setActualHours] = useState('');
  const [hourlyRate, setHourlyRate] = useState('For efficiency variance $');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ standardHours: string; actualHours: string; hourlyRate: string }>('labor-efficiency-calculator');

  const std = parseFloat(standardHours) || 0;
  const actual = parseFloat(actualHours) || 0;
  const rate = parseFloat(hourlyRate) || 0;
  const efficiency = actual > 0 ? (std / actual) * 100 : 0;
  const variance = std - actual;
  const varianceCost = variance * rate;
  const status = efficiency >= 100 ? "Above standard" : efficiency >= 90 ? "At standard" : "Below standard";

  const handleTryExample = () => { setStandardHours('1600'); setActualHours('1800'); setHourlyRate('25'); setCalculated(false); };
  const handleCalculate = () => {
    if (std > 0 && actual > 0) {
      setCalculated(true);
      saveEntry({ standardHours, actualHours, hourlyRate }, `Efficiency: ${efficiency.toFixed(1)}% (${status})`);
    }
  };
  const handleReset = () => { setStandardHours(''); setActualHours(''); setHourlyRate(''); setCalculated(false); };
  const handleRestore = (i: { standardHours: string; actualHours: string; hourlyRate: string }) => { setStandardHours(i.standardHours); setActualHours(i.actualHours); setHourlyRate(i.hourlyRate); setCalculated(true); };
  const snap = (): Snapshot => ({ std, actual, rate, efficiency, variance, varianceCost, status, label: `${efficiency.toFixed(1)}% efficiency` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Gauge className="inline h-3 w-3 mr-1" />
          {`Calculate labor efficiency: standard hours for actual output / actual hours worked × 100. Used in manufacturing and services.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="standardHours">Standard Hours for Output</Label>
            <div className="relative">
              
              <Input id="standardHours" type="number" step="any" min="0" placeholder="1600"
                value={standardHours} onChange={(e) => { setStandardHours(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Expected hours for actual output</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="actualHours">Actual Hours Worked</Label>
            <div className="relative">
              
              <Input id="actualHours" type="number" step="any" min="0" placeholder="1800"
                value={actualHours} onChange={(e) => { setActualHours(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly Rate ($/hr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="hourlyRate" type="number" step="any" min="0" placeholder="25" className="pl-7"
                value={hourlyRate} onChange={(e) => { setHourlyRate(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">For efficiency variance $</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={std <= 0 || actual <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Efficiency
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Labor Efficiency Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{`{efficiency.toFixed(1)}%`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Status: ${status}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Variance: ${variance} hours`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Variance cost: ${formatCurrency(varianceCost)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Standard Hours</p>
                    <p className={`text-lg font-bold`}>{`{std}h`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Actual Hours</p>
                    <p className={`text-lg font-bold`}>{`{actual}h`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Efficiency</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{efficiency.toFixed(1)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Variance</p>
                    <p className={`text-lg font-bold`}>{`{variance}h`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Labor efficiency = (standard hours for actual output / actual hours worked) × 100. Above 100% = outperforming standard (efficient). Below 90% = underperforming (inefficient). Variance cost = (standard - actual) × hourly rate. Used in manufacturing (machine-paced work) and professional services. For capacity utilization, see our Employee Utilization Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Standard Hours', valueA: `${compareA.std}h`, valueB: `${compareB.std}h`, numA: compareA.std, numB: compareB.std },
          { label: 'Actual Hours', valueA: `${compareA.actual}h`, valueB: `${compareB.actual}h`, numA: compareA.actual, numB: compareB.actual },
          { label: 'Efficiency', valueA: `${compareA.efficiency.toFixed(1)}%`, valueB: `${compareB.efficiency.toFixed(1)}%`, numA: compareA.efficiency, numB: compareB.efficiency },
          { label: 'Variance Cost', valueA: formatCurrency(compareA.varianceCost), valueB: formatCurrency(compareB.varianceCost), numA: compareA.varianceCost, numB: compareB.varianceCost }
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
