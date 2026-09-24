'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';
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

interface SickLeaveSnapshot { accrued: number; used: number; remaining: number; label: string; }

// State mandates: hours accrued per hour worked, annual cap
const STATE_MANDATES: Record<string, { rate: number; cap: number; name: string }> = {
  none: { rate: 0, cap: 0, name: 'No state mandate (FLSA only)' },
  CA: { rate: 1 / 30, cap: 48, name: 'California (1 hr per 30 hrs worked, cap 48h)' },
  NY: { rate: 1 / 30, cap: 40, name: 'New York (1 hr per 30 hrs worked, cap 40-56h)' },
  WA: { rate: 1 / 40, cap: 40, name: 'Washington (1 hr per 40 hrs worked, cap 40h)' },
  MA: { rate: 1 / 30, cap: 40, name: 'Massachusetts (1 hr per 30 hrs, cap 40h)' },
  OR: { rate: 1 / 30, cap: 40, name: 'Oregon (1 hr per 30 hrs, cap 40h)' },
  AZ: { rate: 1 / 30, cap: 40, name: 'Arizona (1 hr per 30 hrs, cap 40h)' },
  VT: { rate: 1 / 52, cap: 24, name: 'Vermont (1 hr per 52 hrs, cap 24h)' },
  CT: { rate: 1 / 40, cap: 40, name: 'Connecticut (1 hr per 40 hrs, cap 40h)' },
  MI: { rate: 1 / 35, cap: 40, name: 'Michigan (1 hr per 35 hrs, cap 40h)' },
  MD: { rate: 1 / 30, cap: 40, name: 'Maryland (1 hr per 30 hrs, cap 40h)' },
  CO: { rate: 1 / 30, cap: 48, name: 'Colorado (1 hr per 30 hrs, cap 48h)' },
  IL: { rate: 1 / 40, cap: 40, name: 'Illinois (1 hr per 40 hrs, cap 40h)' },
  NV: { rate: 1 / 50, cap: 40, name: 'Nevada (1 hr per 50 hrs, cap 40h)' },
};

export default function SickLeaveCalculator() {
  const [stateCode, setStateCode] = useState('CA');
  const [hoursWorked, setHoursWorked] = useState('2080');
  const [usedHours, setUsedHours] = useState('16');
  const [manualAccrual, setManualAccrual] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<SickLeaveSnapshot | null>(null);
  const [compareB, setCompareB] = useState<SickLeaveSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ stateCode: string; hoursWorked: string; usedHours: string; manualAccrual: string }>('sick-leave-calculator');

  const state = STATE_MANDATES[stateCode] || STATE_MANDATES.none;
  const hrsWorked = parseFloat(hoursWorked) || 0;
  const used = parseFloat(usedHours) || 0;
  const manual = parseFloat(manualAccrual) || 0;

  const accrued = manual > 0 ? manual : Math.min(hrsWorked * state.rate, state.cap);
  const remaining = Math.max(0, accrued - used);

  const handleTryExample = () => { setStateCode('CA'); setHoursWorked('2080'); setUsedHours('16'); setManualAccrual(''); setCalculated(false); };
  const handleCalculate = () => {
    if (accrued > 0 || used > 0) {
      setCalculated(true);
      saveEntry({ stateCode, hoursWorked, usedHours, manualAccrual }, `${state.name} · ${accrued.toFixed(1)}h accrued · ${remaining.toFixed(1)}h remaining`);
    }
  };
  const handleReset = () => { setStateCode('CA'); setHoursWorked('2080'); setUsedHours('0'); setManualAccrual(''); setCalculated(false); };
  const handleRestore = (i: { stateCode: string; hoursWorked: string; usedHours: string; manualAccrual: string }) => {
    setStateCode(i.stateCode); setHoursWorked(i.hoursWorked); setUsedHours(i.usedHours); setManualAccrual(i.manualAccrual); setCalculated(true);
  };
  const snap = (): SickLeaveSnapshot => ({ accrued, used, remaining, label: `${stateCode} · ${remaining.toFixed(1)}h left` });

  const chartData = [
    { name: 'Used', value: used, fill: '#f43f5e' },
    { name: 'Remaining', value: remaining, fill: '#10b981' },
    ...(accrued - used - remaining > 0 ? [] : []),
  ];

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3 text-xs text-muted-foreground">
          <HeartPulse className="inline h-3 w-3 mr-1" />
          State mandates use accrual rate per hour worked. 14 states + DC require paid sick leave. FLSA does not mandate sick leave.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sl-state">State (for accrual rate)</Label>
            <Select value={stateCode} onValueChange={(v) => { setStateCode(v); setCalculated(false); }}>
              <SelectTrigger id="sl-state"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(STATE_MANDATES).map(([code, s]) => (
                  <SelectItem key={code} value={code}>{code === 'none' ? '— No state mandate —' : `${code} — ${s.name.split('(')[0].trim()}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sl-hours">Hours Worked (Year)</Label>
            <Input id="sl-hours" type="number" step="1" min="0" placeholder="2080" value={hoursWorked}
              onChange={(e) => { setHoursWorked(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Full-time = ~2,080h/year. 1 FTE = 40h × 52w.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sl-used">Sick Hours Used</Label>
            <Input id="sl-used" type="number" step="0.5" min="0" placeholder="16" value={usedHours}
              onChange={(e) => { setUsedHours(e.target.value); setCalculated(false); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sl-manual">Manual Accrual Override (optional)</Label>
            <div className="relative">
              <Input id="sl-manual" type="number" step="1" min="0" placeholder="Leave blank to use state formula" value={manualAccrual}
                onChange={(e) => { setManualAccrual(e.target.value); setCalculated(false); }} />
              <span className="absolute right-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">h</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={accrued <= 0 && used <= 0}
              className="bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white shadow-lg shadow-rose-500/25 flex-1 sm:flex-none">
              Calculate Sick Leave
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Sick Leave Remaining</p>
                <p className="text-4xl font-bold text-rose-600">{remaining.toFixed(1)}h</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{accrued.toFixed(1)}h accrued</Badge>
                  <Badge variant="outline" className="bg-rose-500/10 border-rose-500/30 text-rose-600">{used}h used</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{state.name.split('(')[0].trim()}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Accrual Rate', value: state.rate > 0 ? `${(state.rate * 100).toFixed(2)}%` : 'manual' },
                  { label: 'Annual Cap', value: state.cap > 0 ? `${state.cap}h` : 'N/A' },
                  { label: 'Hours Worked', value: `${hrsWorked}h` },
                  { label: 'Accrued', value: `${accrued.toFixed(1)}h`, amber: true },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-lg font-bold ${m.amber ? 'text-rose-600' : ''}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `${v}h`} tick={{ fontSize: 11 }} />
                    <RechartsTooltip formatter={(v: number) => [`${v.toFixed(1)}h`, '']} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 Federal FMLA provides up to <strong>12 weeks unpaid</strong> leave for serious illness/family care (employer 50+ employees). State paid family leave (CA, NY, NJ, RI, WA, MA, CT, OR, CO, DC, MN, MD, DE) provides partial wage replacement. The federal Earned Safe and Sick Time Act has not passed — check your state DOL for mandates. See <a href="/calculators/leave-calculator" className="text-rose-600 hover:underline">Leave Calculator</a> for total leave balance across all categories.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Accrued', valueA: `${compareA.accrued.toFixed(1)}h`, valueB: `${compareB.accrued.toFixed(1)}h`, numA: compareA.accrued, numB: compareB.accrued },
          { label: 'Used', valueA: `${compareA.used}h`, valueB: `${compareB.used}h`, numA: compareA.used, numB: compareB.used },
          { label: 'Remaining', valueA: `${compareA.remaining.toFixed(1)}h`, valueB: `${compareB.remaining.toFixed(1)}h`, numA: compareA.remaining, numB: compareB.remaining },
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
