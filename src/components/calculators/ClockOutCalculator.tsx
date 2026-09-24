'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { parseTimeToMinutes, formatHHMM } from '@/lib/time-utils';

interface ClockOutSnapshot { clockInMin: number; targetHours: number; breakMin: number; clockOutMin: number; label: string; }

function formatTime(min: number): string {
  if (min < 0) return '—';
  const h24 = Math.floor(min / 60) % 24;
  const m = min % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

export default function ClockOutCalculator() {
  const [clockIn, setClockIn] = useState('9:00 AM');
  const [targetHours, setTargetHours] = useState('8');
  const [breakMin, setBreakMin] = useState('30');
  const [avoidOT, setAvoidOT] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<ClockOutSnapshot | null>(null);
  const [compareB, setCompareB] = useState<ClockOutSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ clockIn: string; targetHours: string; breakMin: string; avoidOT: string }>('clock-out-calculator');

  const inMin = parseTimeToMinutes(clockIn);
  const target = (parseFloat(targetHours) || 0) * 60;
  const brk = parseFloat(breakMin) || 0;
  const outMin = inMin >= 0 ? inMin + target + brk : -1;
  const willTriggerOT = avoidOT && (target / 60) > 8;

  const handleTryExample = () => { setClockIn('8:00 AM'); setTargetHours('8'); setBreakMin('30'); setAvoidOT(true); setCalculated(false); };
  const handleCalculate = () => {
    if (inMin >= 0 && target > 0) {
      setCalculated(true);
      saveEntry({ clockIn, targetHours, breakMin, avoidOT: String(avoidOT) }, `In ${clockIn} · ${targetHours}h target · Out ${formatTime(outMin)}`);
    }
  };
  const handleReset = () => { setClockIn('9:00 AM'); setTargetHours('8'); setBreakMin('30'); setAvoidOT(false); setCalculated(false); };
  const handleRestore = (i: { clockIn: string; targetHours: string; breakMin: string; avoidOT: string }) => {
    setClockIn(i.clockIn); setTargetHours(i.targetHours); setBreakMin(i.breakMin); setAvoidOT(i.avoidOT === 'true'); setCalculated(true);
  };
  const snap = (): ClockOutSnapshot => ({ clockInMin: inMin, targetHours: target / 60, breakMin: brk, clockOutMin: outMin, label: `${clockIn} → ${formatTime(outMin)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-muted-foreground">
          <LogOut className="inline h-3 w-3 mr-1" />
          Calculate the exact clock-out time to hit your target hours. Use the "avoid OT" toggle to cap at 8 hours/day.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="co-in">Clock-In Time</Label>
            <Input id="co-in" placeholder="9:00 AM" value={clockIn}
              onChange={(e) => { setClockIn(e.target.value); setCalculated(false); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="co-target">Target Hours Worked</Label>
            <Input id="co-target" type="number" step="0.5" min="0" placeholder="8" value={targetHours}
              onChange={(e) => { setTargetHours(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">8h = full time, 6h avoids daily OT in CA.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="co-break">Unpaid Break (min)</Label>
            <Input id="co-break" type="number" step="5" min="0" placeholder="30" value={breakMin}
              onChange={(e) => { setBreakMin(e.target.value); setCalculated(false); }} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 max-w-md rounded-lg border border-border/40 p-3">
          <div>
            <Label htmlFor="co-avoid" className="text-sm font-medium">Avoid Overtime (cap at 8h)</Label>
            <p className="text-xs text-muted-foreground">Auto-reduce target if it would exceed 8 hours.</p>
          </div>
          <Switch id="co-avoid" checked={avoidOT} onCheckedChange={(c) => { setAvoidOT(c); if (c && parseFloat(targetHours) > 8) setTargetHours('8'); setCalculated(false); }} />
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={inMin < 0}
              className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white shadow-lg shadow-amber-500/25 flex-1 sm:flex-none">
              Calculate Clock-Out Time
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && inMin >= 0 && outMin > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Clock-Out Time (to hit {targetHours}h)</p>
                <p className="text-4xl font-bold text-amber-600">{formatTime(outMin)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">In: {formatTime(inMin)}</Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{targetHours}h worked</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">Onsite: {formatHHMM(target + brk)}</Badge>
                  {willTriggerOT && <Badge variant="outline" className="bg-red-500/10 border-red-500/30 text-red-600">CAUTION: OT triggered</Badge>}
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 To avoid FLSA overtime (over 40h/week), track your weekly hours. California requires OT after 8h/day, so cap daily shifts at 8h. See <a href="/calculators/overtime-calculator" className="text-amber-600 hover:underline">Overtime Calculator</a> for full rules.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Clock-In', valueA: formatTime(compareA.clockInMin), valueB: formatTime(compareB.clockInMin) },
          { label: 'Target Hours', valueA: `${compareA.targetHours.toFixed(1)}h`, valueB: `${compareB.targetHours.toFixed(1)}h`, numA: compareA.targetHours, numB: compareB.targetHours },
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
