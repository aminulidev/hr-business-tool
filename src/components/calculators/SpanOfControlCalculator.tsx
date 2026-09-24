'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { emps: number; mgrs: number; icCount: number; span: number; managementRatio: number; managementPct: number; benchmark: string; label: string; }

export default function SpanOfControlCalculator() {
  const [totalEmployees, setTotalEmployees] = useState('');
  const [numManagers, setNumManagers] = useState('Includes all levels of management');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalEmployees: string; numManagers: string }>('span-of-control-calculator');

  const emps = parseFloat(totalEmployees) || 0;
  const mgrs = parseFloat(numManagers) || 0;
  const icCount = emps - mgrs;
  const span = mgrs > 0 ? icCount / mgrs : 0;
  const managementRatio = emps > 0 ? mgrs / emps : 0;
  const managementPct = managementRatio * 100;
  const benchmark = span < 5 ? "Narrow (complex roles)" : span < 11 ? "Standard" : span < 31 ? "Wide (transactional)" : "Very wide";

  const handleTryExample = () => { setTotalEmployees('100'); setNumManagers('12'); setCalculated(false); };
  const handleCalculate = () => {
    if (emps > 0 && mgrs > 0) {
      setCalculated(true);
      saveEntry({ totalEmployees, numManagers }, `Span: ${span.toFixed(1)} (${benchmark})`);
    }
  };
  const handleReset = () => { setTotalEmployees(''); setNumManagers(''); setCalculated(false); };
  const handleRestore = (i: { totalEmployees: string; numManagers: string }) => { setTotalEmployees(i.totalEmployees); setNumManagers(i.numManagers); setCalculated(true); };
  const snap = (): Snapshot => ({ emps, mgrs, icCount, span, managementRatio, managementPct, benchmark, label: `Span: ${span.toFixed(1)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Users className="inline h-3 w-3 mr-1" />
          {`Calculate span of control (direct reports per manager). Benchmarks: 4-6 (complex), 7-10 (standard), 15-30 (transactional).`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalEmployees">Total Employees</Label>
            <div className="relative">
              
              <Input id="totalEmployees" type="number" step="any" min="0" placeholder="100"
                value={totalEmployees} onChange={(e) => { setTotalEmployees(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="numManagers">Number of Managers</Label>
            <div className="relative">
              
              <Input id="numManagers" type="number" step="any" min="0" placeholder="12"
                value={numManagers} onChange={(e) => { setNumManagers(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Includes all levels of management</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={emps <= 0 || mgrs <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Span of Control
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Average Span of Control</p>
                <p className="text-4xl font-bold text-emerald-600">{`{span.toFixed(1)} direct reports`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`IC-to-Manager ratio: ${span.toFixed(1)}:1`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Management layer: ${managementPct.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Classification: ${benchmark}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Employees</p>
                    <p className={`text-lg font-bold`}>{`{emps}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Managers</p>
                    <p className={`text-lg font-bold`}>{`{mgrs}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">IC Count</p>
                    <p className={`text-lg font-bold`}>{`{icCount}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Span</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{span.toFixed(1)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Span of control = direct reports per manager. Benchmarks: 4-6 (complex/knowledge work, e.g., engineering), 7-10 (standard office work), 15-30 (transactional, e.g., call centers, retail). Narrow span = more overhead; wide span = less coaching. Optimal depends on role complexity, autonomy, and experience level.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total Employees', valueA: String(compareA.emps), valueB: String(compareB.emps), numA: compareA.emps, numB: compareB.emps },
          { label: 'Managers', valueA: String(compareA.mgrs), valueB: String(compareB.mgrs), numA: compareA.mgrs, numB: compareB.mgrs },
          { label: 'Span', valueA: compareA.span.toFixed(1), valueB: compareB.span.toFixed(1), numA: compareA.span, numB: compareB.span },
          { label: 'Mgmt %', valueA: `${compareA.managementPct.toFixed(1)}%`, valueB: `${compareB.managementPct.toFixed(1)}%`, numA: compareA.managementPct, numB: compareB.managementPct }
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
