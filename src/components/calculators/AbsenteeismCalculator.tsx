'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { absent: number; emps: number; days: number; totalScheduled: number; absenceRate: number; totalCost: number; bradford: number; label: string; }

export default function AbsenteeismCalculator() {
  const [absentDays, setAbsentDays] = useState('');
  const [totalEmployees, setTotalEmployees] = useState('');
  const [workDays, setWorkDays] = useState('Typical year: 220 after holidays');
  const [dailyCost, setDailyCost] = useState('Lost productivity + replacement');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ absentDays: string; totalEmployees: string; workDays: string; dailyCost: string }>('absenteeism-calculator');

  const absent = parseFloat(absentDays) || 0;
  const emps = parseFloat(totalEmployees) || 0;
  const days = parseFloat(workDays) || 0;
  const cost = parseFloat(dailyCost) || 0;
  const totalScheduled = emps * days;
  const absenceRate = totalScheduled > 0 ? (absent / totalScheduled) * 100 : 0;
  const totalCost = absent * cost;
  const bradford = absent * absent * 1;

  const handleTryExample = () => { setAbsentDays('70'); setTotalEmployees('100'); setWorkDays('220'); setDailyCost('350'); setCalculated(false); };
  const handleCalculate = () => {
    if (absent > 0 && emps > 0) {
      setCalculated(true);
      saveEntry({ absentDays, totalEmployees, workDays, dailyCost }, `Absence rate: ${absenceRate.toFixed(2)}% (${formatCurrency(totalCost)} cost)`);
    }
  };
  const handleReset = () => { setAbsentDays(''); setTotalEmployees(''); setWorkDays('220'); setDailyCost(''); setCalculated(false); };
  const handleRestore = (i: { absentDays: string; totalEmployees: string; workDays: string; dailyCost: string }) => { setAbsentDays(i.absentDays); setTotalEmployees(i.totalEmployees); setWorkDays(i.workDays); setDailyCost(i.dailyCost); setCalculated(true); };
  const snap = (): Snapshot => ({ absent, emps, days, totalScheduled, absenceRate, totalCost, bradford, label: `Absence rate: ${absenceRate.toFixed(2)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <CalendarCheck className="inline h-3 w-3 mr-1" />
          {`Calculate absenteeism rate, cost of absences, and Bradford Factor score. SHRM benchmark: 3.2% absence rate.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="absentDays">Total Absent Days</Label>
            <div className="relative">
              
              <Input id="absentDays" type="number" step="any" min="0" placeholder="70"
                value={absentDays} onChange={(e) => { setAbsentDays(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalEmployees">Total Employees</Label>
            <div className="relative">
              
              <Input id="totalEmployees" type="number" step="any" min="0" placeholder="100"
                value={totalEmployees} onChange={(e) => { setTotalEmployees(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workDays">Work Days in Period</Label>
            <div className="relative">
              
              <Input id="workDays" type="number" step="any" min="0" placeholder="220"
                value={workDays} onChange={(e) => { setWorkDays(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Typical year: 220 after holidays</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dailyCost">Cost per Absence Day ($)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="dailyCost" type="number" step="any" min="0" placeholder="350" className="pl-7"
                value={dailyCost} onChange={(e) => { setDailyCost(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Lost productivity + replacement</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={absent <= 0 || emps <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Absenteeism
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Absenteeism Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(absenceRate)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-red-500/10 border-red-500/30 text-red-600'">{`Total cost: ${formatCurrency(totalCost)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Bradford Factor: ${bradford.toFixed(0)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{'Benchmark: 3.2% (SHRM)'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Absent Days</p>
                    <p className={`text-lg font-bold`}>{`{absent}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Scheduled Days</p>
                    <p className={`text-lg font-bold`}>{`{totalScheduled}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Absence Rate</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{absenceRate.toFixed(2)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalCost)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Absenteeism rate = absent days / (employees × work days) × 100. SHRM benchmark: 3.2% (US average). Bradford Factor = S² × D (spells × days) — weights frequent short absences higher. Bradford >100 = concern, >400 = disciplinary action. For attendance tracking, see our Attendance Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Absent Days', valueA: String(compareA.absent), valueB: String(compareB.absent), numA: compareA.absent, numB: compareB.absent },
          { label: 'Employees', valueA: String(compareA.emps), valueB: String(compareB.emps), numA: compareA.emps, numB: compareB.emps },
          { label: 'Absence Rate', valueA: `${compareA.absenceRate.toFixed(2)}%`, valueB: `${compareB.absenceRate.toFixed(2)}%`, numA: compareA.absenceRate, numB: compareB.absenceRate },
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
