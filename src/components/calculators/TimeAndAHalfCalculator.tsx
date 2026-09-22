'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlarmClock } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency } from '@/lib/utils';

interface OTSnapshot { regularRate: number; overtimeRate: number; regularPay: number; overtimePay: number; totalPay: number; label: string; }

export default function TimeAndAHalfCalculator() {
  const [regularRate, setRegularRate] = useState('');
  const [regularHours, setRegularHours] = useState('40');
  const [overtimeHours, setOvertimeHours] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<OTSnapshot | null>(null);
  const [compareB, setCompareB] = useState<OTSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ regularRate: string; regularHours: string; overtimeHours: string }>('time-and-a-half-calculator');

  const rateNum = parseFloat(regularRate) || 0;
  const regHrs = parseFloat(regularHours) || 0;
  const otHrs = parseFloat(overtimeHours) || 0;
  const otRate = rateNum * 1.5;
  const regPay = rateNum * regHrs;
  const otPay = otRate * otHrs;
  const total = regPay + otPay;

    const handleTryExample = () => {
    setRegularRate('25');
    setRegularHours('40');
    setOvertimeHours('8');
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (rateNum > 0 && otHrs > 0) {
      setCalculated(true);
      saveEntry({ regularRate, regularHours, overtimeHours }, `${formatCurrency(rateNum)}/hr · OT: ${formatCurrency(otRate)}/hr · Total: ${formatCurrency(total)}`);
    }
  };
  const handleReset = () => { setRegularRate(''); setRegularHours('40'); setOvertimeHours(''); setCalculated(false); };
  const handleRestore = (i: { regularRate: string; regularHours: string; overtimeHours: string }) => {
    setRegularRate(i.regularRate); setRegularHours(i.regularHours); setOvertimeHours(i.overtimeHours); setCalculated(true);
  };
  const snap = (): OTSnapshot => ({ regularRate: rateNum, overtimeRate: otRate, regularPay: regPay, overtimePay: otPay, totalPay: total, label: `${formatCurrency(rateNum)}/hr · ${otHrs}h OT` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {rateNum > 0 && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-lg bg-amber-500/5 border border-amber-500/20 p-3">
            <AlarmClock className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Your time-and-a-half rate: <strong>{formatCurrency(otRate)}/hr</strong>
              {otHrs > 0 && <> · {otHrs}h OT = <strong>{formatCurrency(otPay)}</strong></>}
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reg-rate">Regular Hourly Rate</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="reg-rate" type="number" step="0.01" min="0" placeholder="20.00"
                value={regularRate} onChange={(e) => { setRegularRate(e.target.value); setCalculated(false); }} className="pl-7" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-hours">Regular Hours</Label>
            <Input id="reg-hours" type="number" step="0.5" min="0" placeholder="40"
              value={regularHours} onChange={(e) => { setRegularHours(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Standard full-time week = 40h</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ot-hours">Overtime Hours</Label>
            <Input id="ot-hours" type="number" step="0.5" min="0" placeholder="5"
              value={overtimeHours} onChange={(e) => { setOvertimeHours(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Hours worked over 40</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={rateNum <= 0 || otHrs <= 0}
              className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white shadow-lg shadow-amber-500/25 flex-1 sm:flex-none">
              Calculate Time and a Half
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Gross Pay</p>
                <p className="text-4xl font-bold text-amber-600">{formatCurrency(total)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{formatCurrency(regPay)} regular</Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{formatCurrency(otPay)} overtime</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Regular Rate', value: `${formatCurrency(rateNum)}/hr` },
                  { label: 'OT Rate (1.5×)', value: `${formatCurrency(otRate)}/hr`, amber: true },
                  { label: 'Regular Hours', value: `${regHrs}h` },
                  { label: 'Overtime Hours', value: `${otHrs}h`, amber: true },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-lg font-bold ${m.amber ? 'text-amber-600' : ''}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={[{ name: 'Regular Pay', amount: regPay, fill: '#10b981' }, { name: 'Overtime Pay', amount: otPay, fill: '#f59e0b' }]} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} tick={{ fontSize: 11 }} />
                    <RechartsTooltip formatter={(v: number) => [formatCurrency(v), 'Amount']} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {[{ fill: '#10b981' }, { fill: '#f59e0b' }].map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 Your time-and-a-half rate of <strong>{formatCurrency(otRate)}/hr</strong> applies to all hours worked over 40 per workweek under the FLSA. States like California also require daily overtime for hours over 8/day.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Regular Rate', valueA: `${formatCurrency(compareA.regularRate)}/hr`, valueB: `${formatCurrency(compareB.regularRate)}/hr`, numA: compareA.regularRate, numB: compareB.regularRate },
          { label: 'OT Rate (1.5×)', valueA: `${formatCurrency(compareA.overtimeRate)}/hr`, valueB: `${formatCurrency(compareB.overtimeRate)}/hr`, numA: compareA.overtimeRate, numB: compareB.overtimeRate },
          { label: 'Regular Pay', valueA: formatCurrency(compareA.regularPay), valueB: formatCurrency(compareB.regularPay), numA: compareA.regularPay, numB: compareB.regularPay },
          { label: 'Overtime Pay', valueA: formatCurrency(compareA.overtimePay), valueB: formatCurrency(compareB.overtimePay), numA: compareA.overtimePay, numB: compareB.overtimePay },
          { label: 'Total Gross Pay', valueA: formatCurrency(compareA.totalPay), valueB: formatCurrency(compareB.totalPay), numA: compareA.totalPay, numB: compareB.totalPay },
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel rows={rows} labelA={compareA.label} labelB={compareB.label}
              onClear={() => { setCompareA(null); setCompareB(null); }}
              onSwap={() => { const t = compareA; setCompareA(compareB); setCompareB(t); }} />
          </div>
        );
      })()}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </div>
  );
}
