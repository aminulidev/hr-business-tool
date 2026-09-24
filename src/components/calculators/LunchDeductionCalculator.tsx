'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { parseTimeToMinutes, formatHHMM, minutesToDecimal } from '@/lib/time-utils';
import { formatCurrency } from '@/lib/utils';

interface LunchSnapshot { grossMin: number; lunchMin: number; netMin: number; netHours: number; label: string; }

function formatTime(min: number): string {
  if (min < 0) return '—';
  const h24 = Math.floor((min / 60) % 24);
  const m = min % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

export default function LunchDeductionCalculator() {
  const [clockIn, setClockIn] = useState('9:00 AM');
  const [clockOut, setClockOut] = useState('5:30 PM');
  const [deductMode, setDeductMode] = useState<'fixed' | 'auto' | 'waive'>('fixed');
  const [lunchLength, setLunchLength] = useState('30');
  const [autoTrigger, setAutoTrigger] = useState('6');
  const [hourlyRate, setHourlyRate] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<LunchSnapshot | null>(null);
  const [compareB, setCompareB] = useState<LunchSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ clockIn: string; clockOut: string; deductMode: string; lunchLength: string; autoTrigger: string; hourlyRate: string }>('lunch-deduction-calculator');

  const inMin = parseTimeToMinutes(clockIn);
  const outMin = parseTimeToMinutes(clockOut);
  let grossMin = outMin - inMin;
  if (grossMin < 0) grossMin += 24 * 60;

  const fixedLunch = parseFloat(lunchLength) || 0;
  const trigger = parseFloat(autoTrigger) || 0;

  // Determine lunch deduction
  let lunchMin = 0;
  if (deductMode === 'fixed') {
    lunchMin = fixedLunch;
  } else if (deductMode === 'auto') {
    // Auto-deduct if shift >= trigger hours
    if (grossMin / 60 >= trigger) lunchMin = fixedLunch;
  }
  // 'waive' = 0

  const netMin = Math.max(0, grossMin - lunchMin);
  const netHours = netMin / 60;
  const r = parseFloat(hourlyRate) || 0;
  const otHours = Math.max(0, netHours - 8); // daily OT simplified
  const regHours = netHours - otHours;
  const pay = regHours * r + otHours * r * 1.5;

  const handleTryExample = () => { setClockIn('8:00 AM'); setClockOut('4:30 PM'); setDeductMode('fixed'); setLunchLength('30'); setAutoTrigger('6'); setHourlyRate('22'); setCalculated(false); };
  const handleCalculate = () => {
    if (inMin >= 0 && outMin >= 0 && grossMin > 0) {
      setCalculated(true);
      saveEntry({ clockIn, clockOut, deductMode, lunchLength, autoTrigger, hourlyRate }, `${formatHHMM(grossMin)} - ${formatHHMM(lunchMin)} lunch = ${formatHHMM(netMin)} payable`);
    }
  };
  const handleReset = () => { setClockIn('9:00 AM'); setClockOut('5:30 PM'); setDeductMode('fixed'); setLunchLength('30'); setAutoTrigger('6'); setHourlyRate(''); setCalculated(false); };
  const handleRestore = (i: { clockIn: string; clockOut: string; deductMode: string; lunchLength: string; autoTrigger: string; hourlyRate: string }) => {
    setClockIn(i.clockIn); setClockOut(i.clockOut); setDeductMode(i.deductMode as 'fixed' | 'auto' | 'waive'); setLunchLength(i.lunchLength); setAutoTrigger(i.autoTrigger); setHourlyRate(i.hourlyRate); setCalculated(true);
  };
  const snap = (): LunchSnapshot => ({ grossMin, lunchMin, netMin, netHours, label: `${formatHHMM(netMin)} payable` });

  const chartData = [
    { name: 'Net Work', value: netMin, fill: '#10b981' },
    { name: 'Lunch', value: lunchMin, fill: '#f59e0b' },
  ];

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Utensils className="inline h-3 w-3 mr-1" />
          Calculate net payable hours after lunch deduction. Choose fixed (always deduct), auto (only if shift over X hours), or waive (no deduction).
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ld-in">Clock-In</Label>
            <Input id="ld-in" placeholder="9:00 AM" value={clockIn}
              onChange={(e) => { setClockIn(e.target.value); setCalculated(false); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ld-out">Clock-Out</Label>
            <Input id="ld-out" placeholder="5:30 PM" value={clockOut}
              onChange={(e) => { setClockOut(e.target.value); setCalculated(false); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ld-mode">Lunch Deduction Mode</Label>
            <Select value={deductMode} onValueChange={(v) => { setDeductMode(v as 'fixed' | 'auto' | 'waive'); setCalculated(false); }}>
              <SelectTrigger id="ld-mode"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed — always deduct lunch</SelectItem>
                <SelectItem value="auto">Auto — only if shift ≥ threshold</SelectItem>
                <SelectItem value="waive">Waive — no lunch deduction</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {deductMode !== 'waive' && (
            <div className="space-y-2">
              <Label htmlFor="ld-length">Lunch Length (minutes)</Label>
              <Input id="ld-length" type="number" step="5" min="0" placeholder="30" value={lunchLength}
                onChange={(e) => { setLunchLength(e.target.value); setCalculated(false); }} />
            </div>
          )}
          {deductMode === 'auto' && (
            <div className="space-y-2">
              <Label htmlFor="ld-trigger">Auto-Deduct Trigger (hours)</Label>
              <Input id="ld-trigger" type="number" step="0.5" min="0" placeholder="6" value={autoTrigger}
                onChange={(e) => { setAutoTrigger(e.target.value); setCalculated(false); }} />
              <p className="text-xs text-muted-foreground">Deduct lunch only if shift ≥ this many hours.</p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="ld-rate">Hourly Rate (optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="ld-rate" type="number" step="0.25" min="0" placeholder="20.00" value={hourlyRate}
                onChange={(e) => { setHourlyRate(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={grossMin <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Net Hours
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && grossMin > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Net Payable Hours</p>
                <p className="text-4xl font-bold text-emerald-600">{formatHHMM(netMin)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">Gross: {formatHHMM(grossMin)}</Badge>
                  {lunchMin > 0 && <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">Lunch: {formatHHMM(lunchMin)}</Badge>}
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">Decimal: {netHours.toFixed(2)}h</Badge>
                  {r > 0 && <Badge variant="outline" className="bg-violet-500/10 border-violet-500/30 text-violet-600">Pay: {formatCurrency(pay)}</Badge>}
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Gross Hours', value: formatHHMM(grossMin) },
                  { label: 'Lunch Deducted', value: formatHHMM(lunchMin) },
                  { label: 'Net Payable', value: formatHHMM(netMin), amber: true },
                  { label: 'Decimal Hours', value: `${netHours.toFixed(2)}h`, amber: true },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-lg font-bold ${m.amber ? 'text-emerald-600' : ''}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `${v}m`} tick={{ fontSize: 11 }} />
                    <RechartsTooltip formatter={(v: number) => [`${formatHHMM(v)}`, '']} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 California requires a 30-min meal break for shifts ≥ 5h, and a 2nd meal for shifts ≥ 10h. Employers may auto-deduct 30 min, but only if the employee is actually relieved of duty. Waiving lunch is allowed only for shifts ≤ 6h with mutual written consent (LC 512). For weekly timesheets with lunch, see <a href="/calculators/time-card-calculator-with-lunch" className="text-emerald-600 hover:underline">Time Card with Lunch</a>.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Gross Minutes', valueA: formatHHMM(compareA.grossMin), valueB: formatHHMM(compareB.grossMin), numA: compareA.grossMin, numB: compareB.grossMin },
          { label: 'Lunch Deducted', valueA: formatHHMM(compareA.lunchMin), valueB: formatHHMM(compareB.lunchMin), numA: compareA.lunchMin, numB: compareB.lunchMin },
          { label: 'Net Payable', valueA: formatHHMM(compareA.netMin), valueB: formatHHMM(compareB.netMin), numA: compareA.netMin, numB: compareB.netMin },
          { label: 'Net Hours', valueA: `${compareA.netHours.toFixed(2)}h`, valueB: `${compareB.netHours.toFixed(2)}h`, numA: compareA.netHours, numB: compareB.netHours },
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
