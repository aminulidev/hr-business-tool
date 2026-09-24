'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Printer } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { parseTimeToMinutes, formatHHMM, minutesToDecimal } from '@/lib/time-utils';
import { formatCurrency } from '@/lib/utils';

interface DayRow { in1: string; out1: string; in2: string; out2: string; }
const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TimesheetCalculator() {
  const [employee, setEmployee] = useState('');
  const [weekStart, setWeekStart] = useState(() => new Date().toISOString().slice(0, 10));
  const [days, setDays] = useState<DayRow[]>(DAY_LABELS.map(() => ({ in1: '', out1: '', in2: '', out2: '' })));
  const [lunchMin, setLunchMin] = useState('30');
  const [rate, setRate] = useState('20');
  const [calculated, setCalculated] = useState(false);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('timesheet-calculator');

  const computeDay = (d: DayRow) => {
    const i1 = parseTimeToMinutes(d.in1);
    const o1 = parseTimeToMinutes(d.out1);
    const i2 = parseTimeToMinutes(d.in2);
    const o2 = parseTimeToMinutes(d.out2);
    let mins = 0;
    if (i1 >= 0 && o1 >= 0) {
      let m = o1 - i1; if (m < 0) m += 24 * 60; mins += m;
    }
    if (i2 >= 0 && o2 >= 0) {
      let m = o2 - i2; if (m < 0) m += 24 * 60; mins += m;
    }
    return mins;
  };

  const dailyMins = days.map(computeDay);
  const dailyNet = dailyMins.map((m) => Math.max(0, m - (parseFloat(lunchMin) || 0)));
  const totalNet = dailyNet.reduce((s, n) => s + n, 0);
  const r = parseFloat(rate) || 0;
  const otHours = Math.max(0, totalNet / 60 - 40);
  const regHours = totalNet / 60 - otHours;
  const totalPay = regHours * r + otHours * r * 1.5;

  const updateDay = (i: number, field: keyof DayRow, value: string) => {
    const nd = [...days]; nd[i] = { ...nd[i], [field]: value }; setDays(nd); setCalculated(false);
  };

  const handleTryExample = () => {
    setEmployee('John Smith');
    setDays([
      { in1: '8:00 AM', out1: '12:00 PM', in2: '1:00 PM', out2: '5:00 PM' },
      { in1: '8:00 AM', out1: '12:00 PM', in2: '1:00 PM', out2: '5:00 PM' },
      { in1: '8:00 AM', out1: '12:00 PM', in2: '1:00 PM', out2: '5:00 PM' },
      { in1: '8:00 AM', out1: '12:00 PM', in2: '1:00 PM', out2: '5:00 PM' },
      { in1: '8:00 AM', out1: '12:00 PM', in2: '1:00 PM', out2: '6:00 PM' },
      { in1: '', out1: '', in2: '', out2: '' },
      { in1: '', out1: '', in2: '', out2: '' },
    ]);
    setLunchMin('60'); setRate('22'); setCalculated(false);
  };

  const handleCalculate = () => {
    if (totalNet > 0) {
      setCalculated(true);
      const inputs: Record<string, string> = { employee, weekStart, lunchMin, rate };
      days.forEach((d, i) => { inputs[`d${i}_in1`] = d.in1; inputs[`d${i}_out1`] = d.out1; inputs[`d${i}_in2`] = d.in2; inputs[`d${i}_out2`] = d.out2; });
      saveEntry(inputs, `${employee || 'Employee'} · ${formatHHMM(totalNet)} · ${formatCurrency(totalPay)}`);
    }
  };

  const handleReset = () => { setEmployee(''); setDays(DAY_LABELS.map(() => ({ in1: '', out1: '', in2: '', out2: '' }))); setLunchMin('30'); setRate('20'); setCalculated(false); };
  const handleRestore = (i: Record<string, string>) => {
    setEmployee(i.employee || ''); setWeekStart(i.weekStart || ''); setLunchMin(i.lunchMin || '30'); setRate(i.rate || '20');
    const nd: DayRow[] = [];
    for (let idx = 0; idx < 7; idx++) {
      nd.push({ in1: i[`d${idx}_in1`] || '', out1: i[`d${idx}_out1`] || '', in2: i[`d${idx}_in2`] || '', out2: i[`d${idx}_out2`] || '' });
    }
    setDays(nd); setCalculated(true);
  };

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ts-emp">Employee Name</Label>
            <Input id="ts-emp" placeholder="John Smith" value={employee} onChange={(e) => setEmployee(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ts-week">Week Starting</Label>
            <input id="ts-week" type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="ts-lunch">Lunch (min)</Label>
              <Input id="ts-lunch" type="number" min="0" step="5" value={lunchMin} onChange={(e) => { setLunchMin(e.target.value); setCalculated(false); }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ts-rate">Rate $/hr</Label>
              <Input id="ts-rate" type="number" step="0.25" min="0" value={rate} onChange={(e) => { setRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted/30 border border-border/30 p-2 text-xs text-muted-foreground">
          Timesheet supports split shifts (morning + afternoon). Time formats: 9:00 AM, 9am, 17:30, or 9:00. Overnight shifts auto-detected.
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border/50 rounded-lg overflow-hidden">
            <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground">
              <tr>
                <th className="px-2 py-2 text-left">Day</th>
                <th className="px-2 py-2 text-center">Clock In</th>
                <th className="px-2 py-2 text-center">Out for Lunch</th>
                <th className="px-2 py-2 text-center">In from Lunch</th>
                <th className="px-2 py-2 text-center">Clock Out</th>
                <th className="px-2 py-2 text-right">Net Hours</th>
                <th className="px-2 py-2 text-right">Decimal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {days.map((d, i) => (
                <tr key={i} className="hover:bg-muted/10">
                  <td className="px-2 py-1 font-medium">{DAY_LABELS[i]}</td>
                  <td className="px-1 py-1"><Input className="h-8 text-xs text-center" placeholder="8:00 AM" value={d.in1} onChange={(e) => updateDay(i, 'in1', e.target.value)} /></td>
                  <td className="px-1 py-1"><Input className="h-8 text-xs text-center" placeholder="12:00 PM" value={d.out1} onChange={(e) => updateDay(i, 'out1', e.target.value)} /></td>
                  <td className="px-1 py-1"><Input className="h-8 text-xs text-center" placeholder="1:00 PM" value={d.in2} onChange={(e) => updateDay(i, 'in2', e.target.value)} /></td>
                  <td className="px-1 py-1"><Input className="h-8 text-xs text-center" placeholder="5:00 PM" value={d.out2} onChange={(e) => updateDay(i, 'out2', e.target.value)} /></td>
                  <td className="px-2 py-1 text-right tabular-nums">{dailyNet[i] > 0 ? formatHHMM(dailyNet[i]) : '—'}</td>
                  <td className="px-2 py-1 text-right tabular-nums text-xs">{dailyNet[i] > 0 ? minutesToDecimal(dailyNet[i]).toFixed(2) : '—'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/40 text-xs font-semibold">
              <tr>
                <td colSpan={5} className="px-2 py-2 text-right">TOTAL</td>
                <td className="px-2 py-2 text-right tabular-nums">{formatHHMM(totalNet)}</td>
                <td className="px-2 py-2 text-right tabular-nums">{minutesToDecimal(totalNet).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={totalNet <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Timesheet
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
            {calculated && <Button variant="outline" onClick={() => window.print()} className="shrink-0 gap-1.5"><Printer className="h-4 w-4" /> Print</Button>}
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Weekly Timesheet Summary</p>
                <p className="text-4xl font-bold text-emerald-600">{formatHHMM(totalNet)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{minutesToDecimal(totalNet).toFixed(2)}h decimal</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{regHours.toFixed(1)}h reg + {otHours.toFixed(1)}h OT</Badge>
                  {r > 0 && <Badge variant="outline" className="bg-violet-500/10 border-violet-500/30 text-violet-600">Gross: {formatCurrency(totalPay)}</Badge>}
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 Timesheets must be retained for 2+ years under FLSA (29 CFR 516.5). The $34.4K+ overtime threshold (2024) makes many salaried workers non-exempt — track their hours too. See <a href="/calculators/payroll-calculator" className="text-emerald-600 hover:underline">Payroll Calculator</a> for net pay after taxes, or <a href="/calculators/time-card-calculator-with-lunch" className="text-emerald-600 hover:underline">Time Card with Lunch</a> for a simpler single-row format.
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}
