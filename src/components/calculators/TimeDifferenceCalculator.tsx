'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompareArrows } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';

interface TimeDiffSnapshot { days: number; hours: number; minutes: number; totalHours: number; label: string; }

export default function TimeDifferenceCalculator() {
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().slice(0, 10);
  });
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<TimeDiffSnapshot | null>(null);
  const [compareB, setCompareB] = useState<TimeDiffSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ startDate: string; endDate: string; startTime: string; endTime: string }>('time-difference-calculator');

  const start = new Date(`${startDate}T${startTime || '00:00'}`);
  const end = new Date(`${endDate}T${endTime || '00:00'}`);
  const diffMs = Math.max(0, end.getTime() - start.getTime());
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const totalHours = totalMinutes / 60;

  const handleTryExample = () => {
    setStartDate('2026-01-01'); setEndDate('2026-12-31'); setStartTime('00:00'); setEndTime('23:59');
    setCalculated(false);
  };
  const handleCalculate = () => {
    if (diffMs > 0) {
      setCalculated(true);
      saveEntry({ startDate, endDate, startTime, endTime }, `${days}d ${hours}h ${minutes}m (${totalHours.toFixed(1)}h total)`);
    }
  };
  const handleReset = () => {
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate(new Date().toISOString().slice(0, 10));
    setStartTime('09:00'); setEndTime('17:00'); setCalculated(false);
  };
  const handleRestore = (i: { startDate: string; endDate: string; startTime: string; endTime: string }) => {
    setStartDate(i.startDate); setEndDate(i.endDate); setStartTime(i.startTime); setEndTime(i.endTime); setCalculated(true);
  };
  const snap = (): TimeDiffSnapshot => ({ days, hours, minutes, totalHours, label: `${days}d ${hours}h` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3 text-xs text-muted-foreground">
          <GitCompareArrows className="inline h-3 w-3 mr-1" />
          Calculate the duration between any two dates and times. Returns days, hours, minutes, and decimal hours.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label>Start Date & Time</Label>
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCalculated(false); }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <input type="time" value={startTime} onChange={(e) => { setStartTime(e.target.value); setCalculated(false); }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="space-y-3">
            <Label>End Date & Time</Label>
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCalculated(false); }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <input type="time" value={endTime} onChange={(e) => { setEndTime(e.target.value); setCalculated(false); }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={diffMs <= 0}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg shadow-blue-500/25 flex-1 sm:flex-none">
              Calculate Time Difference
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && diffMs > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Time Difference</p>
                <p className="text-4xl font-bold text-blue-600">{days}d {hours}h {minutes}m</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{totalHours.toFixed(2)}h total</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{(totalHours / 24).toFixed(2)} days</Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{(totalMinutes * 60).toLocaleString()} sec</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 For simple clock-time duration (e.g., 9 AM → 5 PM same day), use <a href="/calculators/hours-between-times-calculator" className="text-blue-600 hover:underline">Hours Between Two Times Calculator</a>. For business-day calculations excluding weekends, see <a href="/calculators/business-day-calculator" className="text-blue-600 hover:underline">Business Day Calculator</a>.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Days', valueA: `${compareA.days}d`, valueB: `${compareB.days}d`, numA: compareA.days, numB: compareB.days },
          { label: 'Hours', valueA: `${compareA.hours}h`, valueB: `${compareB.hours}h`, numA: compareA.hours, numB: compareB.hours },
          { label: 'Minutes', valueA: `${compareA.minutes}m`, valueB: `${compareB.minutes}m`, numA: compareA.minutes, numB: compareB.minutes },
          { label: 'Total Hours', valueA: `${compareA.totalHours.toFixed(2)}h`, valueB: `${compareB.totalHours.toFixed(2)}h`, numA: compareA.totalHours, numB: compareB.totalHours },
          { label: 'Total Days', valueA: `${(compareA.totalHours / 24).toFixed(2)}`, valueB: `${(compareB.totalHours / 24).toFixed(2)}`, numA: compareA.totalHours / 24, numB: compareB.totalHours / 24 },
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
