'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { days: number; positions: number; avgDays: number; avgWeeks: number; vacancyCost: number; label: string; }

export default function TimeToFillCalculator() {
  const [totalDays, setTotalDays] = useState('');
  const [numPositions, setNumPositions] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalDays: string; numPositions: string }>('time-to-fill-calculator');

  const days = parseFloat(totalDays) || 0;
  const positions = parseFloat(numPositions) || 0;
  const avgDays = positions > 0 ? days / positions : 0;
  const avgWeeks = avgDays / 7;
  const vacancyCost = avgDays * 250;

  const handleTryExample = () => { setTotalDays('210'); setNumPositions('5'); setCalculated(false); };
  const handleCalculate = () => {
    if (days > 0 && positions > 0) {
      setCalculated(true);
      saveEntry({ totalDays, numPositions }, `Avg time to fill: ${avgDays.toFixed(1)} days`);
    }
  };
  const handleReset = () => { setTotalDays(''); setNumPositions(''); setCalculated(false); };
  const handleRestore = (i: { totalDays: string; numPositions: string }) => { setTotalDays(i.totalDays); setNumPositions(i.numPositions); setCalculated(true); };
  const snap = (): Snapshot => ({ days, positions, avgDays, avgWeeks, vacancyCost, label: `${avgDays.toFixed(1)} days avg` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Clock className="inline h-3 w-3 mr-1" />
          {`Calculate average time to fill from requisition approval to candidate start. SHRM benchmark: 36-42 days average.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalDays">Total Days (sum across positions)</Label>
            <div className="relative">
              
              <Input id="totalDays" type="number" step="any" min="0" placeholder="210"
                value={totalDays} onChange={(e) => { setTotalDays(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="numPositions">Number of Positions Filled</Label>
            <div className="relative">
              
              <Input id="numPositions" type="number" step="any" min="0" placeholder="5"
                value={numPositions} onChange={(e) => { setNumPositions(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={days <= 0 || positions <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Time to Fill
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Average Time to Fill</p>
                <p className="text-4xl font-bold text-emerald-600">{`{avgDays.toFixed(1)} days`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`{avgWeeks.toFixed(1)} weeks`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{'SHRM benchmark: 36-42 days'}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Vacancy cost: ${formatCurrency(vacancyCost)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Days</p>
                    <p className={`text-lg font-bold`}>{`{days}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Positions</p>
                    <p className={`text-lg font-bold`}>{`{positions}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Avg Days</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{avgDays.toFixed(1)}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Avg Weeks</p>
                    <p className={`text-lg font-bold`}>{`{avgWeeks.toFixed(1)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Time to fill = days from requisition approval to candidate start date. Longer than time to hire (which ends at offer acceptance). SHRM benchmark: 36-42 days. Vacancy cost ~$250/day for mid-level roles. Track by department and role level to identify bottlenecks.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total Days', valueA: String(compareA.days), valueB: String(compareB.days), numA: compareA.days, numB: compareB.days },
          { label: 'Positions', valueA: String(compareA.positions), valueB: String(compareB.positions), numA: compareA.positions, numB: compareB.positions },
          { label: 'Avg Days', valueA: compareA.avgDays.toFixed(1), valueB: compareB.avgDays.toFixed(1), numA: compareA.avgDays, numB: compareB.avgDays },
          { label: 'Vacancy Cost', valueA: formatCurrency(compareA.vacancyCost), valueB: formatCurrency(compareB.vacancyCost), numA: compareA.vacancyCost, numB: compareB.vacancyCost }
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
