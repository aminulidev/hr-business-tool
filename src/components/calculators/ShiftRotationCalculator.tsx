'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import TryExample from './TryExample';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';

type Pattern = '2-2-3' | 'dupont' | 'pitman' | '4on4off';

interface PatternInfo { name: string; cycle: number; daysOn: number; daysOff: number; crews: number; shiftHours: number; description: string; }
const PATTERNS: Record<Pattern, PatternInfo> = {
  '2-2-3': { name: '2-2-3 (Panama)', cycle: 14, daysOn: 7, daysOff: 7, crews: 4, shiftHours: 12, description: '2 on, 2 off, 3 on, 2 off, 2 on, 3 off. 4 crews rotate day/night. Avg 42h/week.' },
  'dupont': { name: 'DuPont (28-day)', cycle: 28, daysOn: 14, daysOff: 14, crews: 4, shiftHours: 12, description: '4-3, 3-3, 3-3, 4-3, 7-off cycle. 4 crews. Avg ~42h/week with 7-day break.' },
  'pitman': { name: 'Pitman (2-3-2)', cycle: 14, daysOn: 7, daysOff: 7, crews: 2, shiftHours: 12, description: '2 on, 3 off, 2 on, 2 off, 3 on, 2 off. 2 crews. Avg 42h/week. Every other weekend off.' },
  '4on4off': { name: '4-on 4-off', cycle: 8, daysOn: 4, daysOff: 4, crews: 2, shiftHours: 12, description: '4 days on, 4 days off. Continuous coverage with 2 crews. Avg 42h/week.' },
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Pre-defined rotation schedules (1 = on, 0 = off)
const SCHEDULES: Record<Pattern, number[][]> = {
  '2-2-3': [
    [1,1,0,0,1,1,1], // Crew A day
    [0,0,1,1,0,0,0], // Crew B day
    [1,1,1,0,0,1,1], // Crew C night
    [0,0,0,1,1,0,0], // Crew D night
  ],
  'dupont': [
    [1,1,1,1,0,0,0], [1,1,1,0,0,0,0], [1,1,1,0,0,0,0], [0,0,0,1,1,1,1],
  ],
  'pitman': [
    [1,1,0,0,0,1,1], [0,0,1,1,1,0,0],
  ],
  '4on4off': [
    [1,1,1,1,0,0,0], [0,0,0,0,1,1,1],
  ],
};

const CREW_NAMES = ['A', 'B', 'C', 'D'];

export default function ShiftRotationCalculator() {
  const [pattern, setPattern] = useState<Pattern>('2-2-3');
  const [calculated, setCalculated] = useState(false);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ pattern: string }>('shift-rotation-calculator');

  const info = PATTERNS[pattern];
  const schedule = SCHEDULES[pattern];

  const handleTryExample = () => { setPattern('dupont'); setCalculated(false); };
  const handleCalculate = () => { setCalculated(true); saveEntry({ pattern }, `${info.name} · ${info.crews} crews · ${info.shiftHours}h shifts`); };
  const handleReset = () => { setPattern('2-2-3'); setCalculated(false); };
  const handleRestore = (i: { pattern: string }) => { setPattern(i.pattern as Pattern); setCalculated(true); };

  const weeklyHours = info.daysOn * info.shiftHours / (info.cycle / 7);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-violet-500/5 border border-violet-500/20 p-3 text-xs text-muted-foreground">
          <RefreshCw className="inline h-3 w-3 mr-1" />
          Generate popular rotating shift schedules for 24/7 coverage. Includes 2-2-3 (Panama), DuPont (28-day), Pitman, and 4-on-4-off.
        </div>

        <div className="space-y-2 max-w-md">
          <Label>Shift Pattern</Label>
          <Select value={pattern} onValueChange={(v) => { setPattern(v as Pattern); setCalculated(false); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(PATTERNS) as Pattern[]).map(p => <SelectItem key={p} value={p}>{PATTERNS[p].name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate}
              className="bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-600 hover:to-violet-800 text-white shadow-lg shadow-violet-500/25 flex-1 sm:flex-none">
              Generate Rotation
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">{info.name}</p>
                <p className="text-4xl font-bold text-violet-600">{weeklyHours.toFixed(1)}h/week avg</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{info.crews} crews</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{info.shiftHours}h shifts</Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{info.cycle}-day cycle</Badge>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 overflow-hidden">
                <div className="px-4 py-2 bg-muted/40 border-b border-border/50 text-xs font-semibold text-muted-foreground">
                  {info.name} — Crew Rotation (1 cycle)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="px-3 py-2 text-left">Crew</th>
                        {DAY_LABELS.map(d => <th key={d} className="px-2 py-2 text-center">{d}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {schedule.map((row, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 font-semibold">Crew {CREW_NAMES[i]} {i >= info.crews / 2 ? '(Night)' : '(Day)'}</td>
                          {row.map((cell, j) => (
                            <td key={j} className={`px-2 py-2 text-center ${cell ? 'bg-violet-500/20 text-violet-700 dark:text-violet-300 font-semibold' : 'bg-muted/20 text-muted-foreground'}`}>
                              {cell ? 'ON' : 'off'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Cycle Length', value: `${info.cycle} days` },
                  { label: 'Days On / Off', value: `${info.daysOn}/${info.daysOff}` },
                  { label: 'Shift Length', value: `${info.shiftHours}h` },
                  { label: 'Avg Hours/Week', value: `${weeklyHours.toFixed(1)}h`, amber: true },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-lg font-bold ${m.amber ? 'text-violet-600' : ''}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {info.description}
                <br />
                💡 12-hour shifts trigger daily overtime in California (over 8h/day = 1.5×, over 12h = 2×). 42h/week avg = 2h OT/week under FLSA. See <a href="/calculators/shift-pay-calculator" className="text-violet-600 hover:underline">Shift Pay Calculator</a> for pay calculations.
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}
