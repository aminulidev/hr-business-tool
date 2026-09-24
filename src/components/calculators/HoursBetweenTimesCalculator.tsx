'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock3 } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { parseTimeToMinutes, formatHHMM } from '@/lib/time-utils';

interface HoursBetweenSnapshot { startMin: number; endMin: number; durationMin: number; decimalHours: number; label: string; }

function formatTime(min: number): string {
  if (min < 0) return '—';
  const h24 = Math.floor((min / 60) % 24);
  const m = min % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

export default function HoursBetweenTimesCalculator() {
  const [startTime, setStartTime] = useState('9:00 AM');
  const [endTime, setEndTime] = useState('5:30 PM');
  const [overnight, setOvernight] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<HoursBetweenSnapshot | null>(null);
  const [compareB, setCompareB] = useState<HoursBetweenSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ startTime: string; endTime: string; overnight: string }>('hours-between-times-calculator');

  const sMin = parseTimeToMinutes(startTime);
  const eMin = parseTimeToMinutes(endTime);
  let duration = eMin - sMin;
  if (duration < 0 || overnight) duration += 24 * 60;
  const decimalHours = duration / 60;

  const handleTryExample = () => { setStartTime('10:00 PM'); setEndTime('6:00 AM'); setOvernight(true); setCalculated(false); };
  const handleCalculate = () => {
    if (sMin >= 0 && eMin >= 0) {
      setCalculated(true);
      saveEntry({ startTime, endTime, overnight: String(overnight) }, `${startTime} → ${endTime} = ${formatHHMM(duration)}`);
    }
  };
  const handleReset = () => { setStartTime('9:00 AM'); setEndTime('5:00 PM'); setOvernight(false); setCalculated(false); };
  const handleRestore = (i: { startTime: string; endTime: string; overnight: string }) => { setStartTime(i.startTime); setEndTime(i.endTime); setOvernight(i.overnight === 'true'); setCalculated(true); };
  const snap = (): HoursBetweenSnapshot => ({ startMin: sMin, endMin: eMin, durationMin: duration, decimalHours, label: `${startTime} → ${endTime}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3 text-xs text-muted-foreground">
          <Clock3 className="inline h-3 w-3 mr-1" />
          Calculates the exact duration between any two clock times. Supports overnight shifts (10pm → 6am) and outputs hours:minutes plus decimal hours.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hb-start">Start Time</Label>
            <Input id="hb-start" placeholder="9:00 AM" value={startTime}
              onChange={(e) => { setStartTime(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Formats: 9:00 AM, 9am, 17:30</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hb-end">End Time</Label>
            <Input id="hb-end" placeholder="5:30 PM" value={endTime}
              onChange={(e) => { setEndTime(e.target.value); setCalculated(false); }} />
          </div>
          <div className="space-y-2 flex items-end">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={overnight} onChange={(e) => { setOvernight(e.target.checked); setCalculated(false); }}
                className="h-4 w-4 rounded border-input" />
              Overnight shift (e.g., 10pm → 6am)
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={sMin < 0 || eMin < 0}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg shadow-blue-500/25 flex-1 sm:flex-none">
              Calculate Hours
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && sMin >= 0 && eMin >= 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Duration Between Times</p>
                <p className="text-4xl font-bold text-blue-600">{formatHHMM(duration)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{decimalHours.toFixed(2)}h decimal</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{formatTime(sMin)} → {formatTime(eMin)}</Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{(duration * 60).toLocaleString()} seconds</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 For multi-day durations or date+time spans, use <a href="/calculators/time-difference-calculator" className="text-blue-600 hover:underline">Time Difference Calculator</a>. For payroll, multiply decimal hours by hourly rate — see <a href="/calculators/payroll-hours-calculator" className="text-blue-600 hover:underline">Payroll Hours Calculator</a>.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Start Time', valueA: formatTime(compareA.startMin), valueB: formatTime(compareB.startMin) },
          { label: 'End Time', valueA: formatTime(compareA.endMin), valueB: formatTime(compareB.endMin) },
          { label: 'Duration (h:m)', valueA: formatHHMM(compareA.durationMin), valueB: formatHHMM(compareB.durationMin), numA: compareA.durationMin, numB: compareB.durationMin },
          { label: 'Decimal Hours', valueA: `${compareA.decimalHours.toFixed(2)}h`, valueB: `${compareB.decimalHours.toFixed(2)}h`, numA: compareA.decimalHours, numB: compareB.decimalHours },
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
