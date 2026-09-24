'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { parseTimeToMinutes, formatHHMM } from '@/lib/time-utils';

interface ClockInSnapshot { clockInMin: number; shiftLenMin: number; breakMin: number; clockOutMin: number; label: string; }

function formatTime(min: number): string {
  if (min < 0) return '—';
  const h24 = Math.floor(min / 60) % 24;
  const m = min % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

export default function ClockInCalculator() {
  const [clockIn, setClockIn] = useState('9:00 AM');
  const [breakMin, setBreakMin] = useState('30');
  const [shiftLen, setShiftLen] = useState('8');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<ClockInSnapshot | null>(null);
  const [compareB, setCompareB] = useState<ClockInSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ clockIn: string; breakMin: string; shiftLen: string }>('clock-in-calculator');

  const inMin = parseTimeToMinutes(clockIn);
  const brk = parseFloat(breakMin) || 0;
  const shift = (parseFloat(shiftLen) || 0) * 60;
  const outMin = inMin >= 0 ? inMin + shift + brk : -1;

  const handleTryExample = () => { setClockIn('8:30 AM'); setBreakMin('30'); setShiftLen('8'); setCalculated(false); };
  const handleCalculate = () => {
    if (inMin >= 0 && shift > 0) {
      setCalculated(true);
      saveEntry({ clockIn, breakMin, shiftLen }, `In ${clockIn} · ${shiftLen}h shift + ${brk}min break · Out ${formatTime(outMin)}`);
    }
  };
  const handleReset = () => { setClockIn('9:00 AM'); setBreakMin('30'); setShiftLen('8'); setCalculated(false); };
  const handleRestore = (i: { clockIn: string; breakMin: string; shiftLen: string }) => { setClockIn(i.clockIn); setBreakMin(i.breakMin); setShiftLen(i.shiftLen); setCalculated(true); };
  const snap = (): ClockInSnapshot => ({ clockInMin: inMin, shiftLenMin: shift, breakMin: brk, clockOutMin: outMin, label: `${clockIn} → ${formatTime(outMin)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <LogIn className="inline h-3 w-3 mr-1" />
          Enter your clock-in time, target shift length, and unpaid break to calculate your clock-out time. Perfect for hitting exactly 8 hours.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ci-in">Clock-In Time</Label>
            <Input id="ci-in" placeholder="9:00 AM" value={clockIn}
              onChange={(e) => { setClockIn(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Formats: 9:00 AM, 9am, 17:30</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ci-shift">Shift Length (hours)</Label>
            <Input id="ci-shift" type="number" step="0.5" min="0" placeholder="8" value={shiftLen}
              onChange={(e) => { setShiftLen(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Standard: 8h. Part-time: 4-6h.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ci-break">Break (minutes, unpaid)</Label>
            <Input id="ci-break" type="number" step="5" min="0" placeholder="30" value={breakMin}
              onChange={(e) => { setBreakMin(e.target.value); setCalculated(false); }} />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={inMin < 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Clock-Out Time
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && inMin >= 0 && outMin > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Clock-Out Time</p>
                <p className="text-4xl font-bold text-emerald-600">{formatTime(outMin)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">In: {formatTime(inMin)}</Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{shiftLen}h shift + {brk}min break</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">Total onsite: {formatHHMM(shift + brk)}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 To hit exactly 8 work hours with a 30-minute unpaid lunch, you must be onsite for 8h 30m. Add commute time to plan your day. For overtime-avoidance mode, see <a href="/calculators/clock-out-calculator" className="text-emerald-600 hover:underline">Clock Out Calculator</a>.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Clock-In', valueA: formatTime(compareA.clockInMin), valueB: formatTime(compareB.clockInMin) },
          { label: 'Shift Length', valueA: `${(compareA.shiftLenMin / 60).toFixed(1)}h`, valueB: `${(compareB.shiftLenMin / 60).toFixed(1)}h`, numA: compareA.shiftLenMin, numB: compareB.shiftLenMin },
          { label: 'Break', valueA: `${compareA.breakMin} min`, valueB: `${compareB.breakMin} min`, numA: compareA.breakMin, numB: compareB.breakMin },
          { label: 'Clock-Out', valueA: formatTime(compareA.clockOutMin), valueB: formatTime(compareB.clockOutMin) },
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
