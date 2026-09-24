'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency } from '@/lib/utils';

interface Employee { name: string; mon: string; tue: string; wed: string; thu: string; fri: string; sat: string; sun: string; rate: string; }
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const DAY_LABELS: Record<string, string> = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };

export default function EmployeeScheduleCalculator() {
  const [employees, setEmployees] = useState<Employee[]>([
    { name: 'Alice', mon: '9-5', tue: '9-5', wed: '9-5', thu: '9-5', fri: '9-5', sat: '', sun: '', rate: '22' },
    { name: 'Bob', mon: '12-8', tue: '12-8', wed: '12-8', thu: '12-8', fri: '12-8', sat: '', sun: '', rate: '20' },
  ]);
  const [calculated, setCalculated] = useState(false);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('employee-schedule-calculator');

  const parseShift = (shift: string): number => {
    if (!shift) return 0;
    const m = shift.match(/^(\d+)(?::(\d+))?-(\d+)(?::(\d+))?$/);
    if (!m) return 0;
    let s = parseFloat(m[1]) + (m[2] ? parseFloat(m[2]) / 60 : 0);
    let e = parseFloat(m[3]) + (m[4] ? parseFloat(m[4]) / 60 : 0);
    if (e < s) e += 24;
    return e - s;
  };

  const computeEmployee = (e: Employee) => {
    const hours = DAYS.reduce((s, d) => s + parseShift(e[d]), 0);
    const r = parseFloat(e.rate) || 0;
    const ot = Math.max(0, hours - 40);
    const pay = (hours - ot) * r + ot * r * 1.5;
    return { hours, pay, ot };
  };

  const parsed = employees.map(computeEmployee);
  const totalHours = parsed.reduce((s, p) => s + p.hours, 0);
  const totalPay = parsed.reduce((s, p) => s + p.pay, 0);

  const updateEmployee = (i: number, field: keyof Employee, value: string) => {
    const ne = [...employees]; ne[i] = { ...ne[i], [field]: value }; setEmployees(ne); setCalculated(false);
  };
  const addEmployee = () => setEmployees([...employees, { name: `Emp ${employees.length + 1}`, mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '', rate: '20' }]);
  const removeEmployee = (i: number) => { setEmployees(employees.filter((_, idx) => idx !== i)); setCalculated(false); };

  const handleTryExample = () => {
    setEmployees([
      { name: 'Alice', mon: '8-4', tue: '8-4', wed: '8-4', thu: '8-4', fri: '8-4', sat: '', sun: '', rate: '22' },
      { name: 'Bob', mon: '4-12', tue: '4-12', wed: '4-12', thu: '4-12', fri: '4-12', sat: '', sun: '', rate: '24' },
      { name: 'Carol', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '8-4', sun: '8-4', rate: '26' },
    ]);
    setCalculated(false);
  };
  const handleCalculate = () => {
    if (totalHours > 0) {
      setCalculated(true);
      const inputs: Record<string, string> = {};
      employees.forEach((e, i) => { Object.entries(e).forEach(([k, v]) => { inputs[`e${i}_${k}`] = v; }); });
      saveEntry(inputs, `${employees.length} emp · ${totalHours}h · ${formatCurrency(totalPay)}`);
    }
  };
  const handleReset = () => setEmployees([{ name: 'Emp 1', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '', rate: '20' }]);
  const handleRestore = (i: Record<string, string>) => {
    const count = new Set(Object.keys(i).map(k => k.split('_')[0])).size;
    const ne: Employee[] = [];
    for (let idx = 0; idx < count; idx++) {
      const e: Employee = { name: '', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '', rate: '20' };
      (Object.keys(e) as (keyof Employee)[]).forEach(k => { e[k] = i[`e${idx}_${k}`] || (k === 'rate' ? '20' : ''); });
      ne.push(e);
    }
    setEmployees(ne); setCalculated(true);
  };

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3 text-xs text-muted-foreground">
          <CalendarDays className="inline h-3 w-3 mr-1" />
          Build a weekly schedule by entering shift ranges (e.g., 9-5, 8-4, 12-8). OT paid at 1.5× for hours over 40/week.
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-border/50 rounded-lg overflow-hidden">
            <thead className="bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="px-2 py-2 text-left">Name</th>
                {DAYS.map(d => <th key={d} className="px-1 py-2 text-center">{DAY_LABELS[d]}</th>)}
                <th className="px-2 py-2 text-center">Rate</th>
                <th className="px-2 py-2 text-right">Hours</th>
                <th className="px-2 py-2 text-right">Pay</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {employees.map((e, i) => (
                <tr key={i} className="hover:bg-muted/10">
                  <td className="px-1 py-1"><Input className="h-8 text-xs" value={e.name} onChange={(ev) => updateEmployee(i, 'name', ev.target.value)} /></td>
                  {DAYS.map(d => <td key={d} className="px-1 py-1"><Input className="h-8 text-xs text-center" placeholder="—" value={e[d]} onChange={(ev) => updateEmployee(i, d, ev.target.value)} /></td>)}
                  <td className="px-1 py-1"><Input className="h-8 text-xs text-center" type="number" step="0.5" value={e.rate} onChange={(ev) => updateEmployee(i, 'rate', ev.target.value)} /></td>
                  <td className="px-2 py-1 text-right tabular-nums">{parsed[i].hours.toFixed(1)}h</td>
                  <td className="px-2 py-1 text-right tabular-nums font-semibold">{formatCurrency(parsed[i].pay)}</td>
                  <td className="px-1"><Button variant="ghost" size="sm" className="h-7 px-2 text-red-600" onClick={() => removeEmployee(i)}>×</Button></td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/40 font-semibold">
              <tr>
                <td colSpan={9} className="px-2 py-2 text-right">TOTAL ({employees.length} emp)</td>
                <td className="px-2 py-2 text-right">{totalHours.toFixed(1)}h</td>
                <td className="px-2 py-2 text-right">{formatCurrency(totalPay)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <Button variant="outline" size="sm" onClick={addEmployee} className="text-emerald-600 border-emerald-500/30 bg-emerald-500/5">+ Add Employee</Button>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={totalHours <= 0}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg shadow-blue-500/25 flex-1 sm:flex-none">
              Calculate Schedule
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Weekly Schedule Summary ({employees.length} employees)</p>
                <p className="text-4xl font-bold text-blue-600">{formatCurrency(totalPay)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{totalHours.toFixed(1)}h scheduled</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{(totalHours / employees.length).toFixed(1)}h avg/emp</Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{parsed.reduce((s, p) => s + p.ot, 0).toFixed(1)}h OT</Badge>
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 For rotating shifts (2-2-3, DuPont, Pitman), see <a href="/calculators/shift-rotation-calculator" className="text-blue-600 hover:underline">Shift Rotation Calculator</a>. For payroll taxes on these wages, use <a href="/calculators/payroll-calculator" className="text-blue-600 hover:underline">Payroll Calculator</a>.
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}
