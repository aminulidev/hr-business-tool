'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatPercent } from '@/lib/utils';

interface AttendanceSnapshot { scheduledDays: number; attendedDays: number; absentDays: number; tardyDays: number; attendanceRate: number; absenceRate: number; label: string; }

export default function AttendanceCalculator() {
  const [scheduledDays, setScheduledDays] = useState('');
  const [absentDays, setAbsentDays] = useState('');
  const [tardyDays, setTardyDays] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<AttendanceSnapshot | null>(null);
  const [compareB, setCompareB] = useState<AttendanceSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ scheduledDays: string; absentDays: string; tardyDays: string }>('attendance-calculator');

  const scheduled = parseFloat(scheduledDays) || 0;
  const absent = parseFloat(absentDays) || 0;
  const tardy = parseFloat(tardyDays) || 0;
  const attended = Math.max(0, scheduled - absent);
  const attendanceRate = scheduled > 0 ? (attended / scheduled) * 100 : 0;
  const absenceRate = scheduled > 0 ? (absent / scheduled) * 100 : 0;
  const tardyRate = scheduled > 0 ? (tardy / scheduled) * 100 : 0;

  const handleTryExample = () => { setScheduledDays('220'); setAbsentDays('5'); setTardyDays('8'); setCalculated(false); };
  const handleCalculate = () => {
    if (scheduled > 0) {
      setCalculated(true);
      saveEntry({ scheduledDays, absentDays, tardyDays }, `${scheduled} days · ${attendanceRate.toFixed(1)}% attendance · ${absenceRate.toFixed(1)}% absence`);
    }
  };
  const handleReset = () => { setScheduledDays(''); setAbsentDays(''); setTardyDays(''); setCalculated(false); };
  const handleRestore = (i: { scheduledDays: string; absentDays: string; tardyDays: string }) => {
    setScheduledDays(i.scheduledDays); setAbsentDays(i.absentDays); setTardyDays(i.tardyDays); setCalculated(true);
  };
  const snap = (): AttendanceSnapshot => ({ scheduledDays: scheduled, attendedDays: attended, absentDays: absent, tardyDays: tardy, attendanceRate, absenceRate, label: `${scheduled} days` });

  const chartData = [
    { name: 'Attended', value: attended, fill: '#10b981' },
    { name: 'Absent', value: absent, fill: '#f43f5e' },
    { name: 'Tardy', value: tardy, fill: '#f59e0b' },
  ];

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="at-sched">Total Scheduled Workdays</Label>
            <Input id="at-sched" type="number" step="1" min="0" placeholder="220" value={scheduledDays}
              onChange={(e) => { setScheduledDays(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Typical full-year: ~220 workdays after holidays/PTO.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="at-absent">Days Absent</Label>
            <Input id="at-absent" type="number" step="0.5" min="0" placeholder="5" value={absentDays}
              onChange={(e) => { setAbsentDays(e.target.value); setCalculated(false); }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="at-tardy">Days Tardy</Label>
            <Input id="at-tardy" type="number" step="0.5" min="0" placeholder="8" value={tardyDays}
              onChange={(e) => { setTardyDays(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Late arrivals (still counts as attended).</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={scheduled <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Attendance Rate
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Attendance Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(attendanceRate)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{attended} attended</Badge>
                  <Badge variant="outline" className="bg-red-500/10 border-red-500/30 text-red-600">{absent} absent ({formatPercent(absenceRate)})</Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{tardy} tardy ({formatPercent(tardyRate)})</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Scheduled Days', value: `${scheduled}` },
                  { label: 'Attended Days', value: `${attended}`, amber: true },
                  { label: 'Absence Rate', value: formatPercent(absenceRate) },
                  { label: 'Tardy Rate', value: formatPercent(tardyRate) },
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
                    <YAxis tick={{ fontSize: 11 }} />
                    <RechartsTooltip formatter={(v: number) => [`${v} days`, '']} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 Industry benchmark: a healthy attendance rate is 95%+ (absence rate under 5%). Rates below 90% may indicate engagement issues, burnout, or chronic health problems. The Society for Human Resource Management (SHRM) reports the average US absence rate is 3.2% per year.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Scheduled Days', valueA: String(compareA.scheduledDays), valueB: String(compareB.scheduledDays), numA: compareA.scheduledDays, numB: compareB.scheduledDays },
          { label: 'Attended Days', valueA: String(compareA.attendedDays), valueB: String(compareB.attendedDays), numA: compareA.attendedDays, numB: compareB.attendedDays },
          { label: 'Absent Days', valueA: String(compareA.absentDays), valueB: String(compareB.absentDays), numA: compareA.absentDays, numB: compareB.absentDays },
          { label: 'Tardy Days', valueA: String(compareA.tardyDays), valueB: String(compareB.tardyDays), numA: compareA.tardyDays, numB: compareB.tardyDays },
          { label: 'Attendance Rate', valueA: formatPercent(compareA.attendanceRate), valueB: formatPercent(compareB.attendanceRate), numA: compareA.attendanceRate, numB: compareB.attendanceRate },
          { label: 'Absence Rate', valueA: formatPercent(compareA.absenceRate), valueB: formatPercent(compareB.absenceRate), numA: compareA.absenceRate, numB: compareB.absenceRate },
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
