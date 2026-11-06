'use client';

/**
 * Shift Schedule Planner (Roadmap v2, Phase 15.1): the former Shift Rotation
 * Calculator and Employee Schedule Calculator on one page.
 *  - Rotation tab: full-cycle crew grids for 2-2-3, DuPont, Pitman and
 *    4-on-4-off with a coverage check and FLSA / 7(k) overtime math.
 *  - Weekly roster tab: per-employee shifts, hours, overtime and labor cost.
 */

import { useMemo, useState } from 'react';
import { useSearchParam } from '@/hooks/useSearchParam';
import { motion } from 'framer-motion';
import { RefreshCw, CalendarDays, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TryExample from './TryExample';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency } from '@/lib/utils';

type PlannerMode = 'rotation' | 'roster';
export type Pattern = '2-2-3' | 'dupont' | 'pitman' | '4on4off';

interface PatternInfo {
  name: string;
  cycleDays: number;
  crews: number;
  /** Crews that work the day shift; the rest work nights (0 = single-shift pattern) */
  dayCrews: number;
  description: string;
  weekendsOff: string;
  usedBy: string;
}

export const PATTERNS: Record<Pattern, PatternInfo> = {
  '2-2-3': {
    name: '2-2-3 (Panama)', cycleDays: 14, crews: 4, dayCrews: 2,
    description: '2 on, 2 off, 3 on, 2 off, 2 on, 3 off. Four crews: two cover days, two cover nights, and crews swap days/nights every cycle or every few cycles.',
    weekendsOff: 'Every other weekend (a 3-day weekend every two weeks)',
    usedBy: 'Police and 911 dispatch, hospitals, manufacturing',
  },
  dupont: {
    name: 'DuPont (28-day)', cycleDays: 28, crews: 4, dayCrews: 2,
    description: '4 nights on, 3 off, 3 days on, 1 off, 3 nights on, 3 off, 4 days on, then 7 consecutive days off. Each crew works 14 of 28 days.',
    weekendsOff: 'One full weekend plus the 7-day break each cycle',
    usedBy: 'Chemical plants, refineries, utilities',
  },
  pitman: {
    name: 'Pitman (2-3-2)', cycleDays: 14, crews: 4, dayCrews: 2,
    description: '2 on, 3 off, 2 on, 2 off, 3 on, 2 off. Same 7-of-14 days as 2-2-3 but with the 3-day stretch over the weekend, so every other weekend is a Friday–Sunday off.',
    weekendsOff: 'Every other weekend, Friday through Sunday',
    usedBy: 'Nursing, security, call centers',
  },
  '4on4off': {
    name: '4-on 4-off', cycleDays: 8, crews: 4, dayCrews: 2,
    description: '4 consecutive 12-hour shifts then 4 days off. Needs 4 crews for 24/7 coverage (2 day, 2 night); crews usually alternate days and nights each block.',
    weekendsOff: 'Rotates; a crew is off every other weekend on average',
    usedBy: 'Mining, oil and gas, warehousing, fire service',
  },
};

/** One cycle for crew A (1 = on). Other crews are offsets of the same pattern. */
const CREW_A: Record<Pattern, number[]> = {
  '2-2-3': [1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
  pitman: [1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0],
  dupont: [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  '4on4off': [1, 1, 1, 1, 0, 0, 0, 0],
};

function buildCycle(pattern: Pattern): number[][] {
  const base = CREW_A[pattern];
  const n = base.length;
  const complement = base.map((v) => 1 - v);
  // Day crews A/B are complements of each other; night crews C/D repeat the same pair.
  const dupontB = [...base.slice(7), ...base.slice(0, 7)];
  const dupontC = [...base.slice(14), ...base.slice(0, 14)];
  const dupontD = [...base.slice(21), ...base.slice(0, 21)];
  if (pattern === 'dupont') return [base, dupontB, dupontC, dupontD].map((c) => c.slice(0, n));
  return [base, complement, base, complement];
}

const CREW_NAMES = ['A', 'B', 'C', 'D'];
const SHIFT_HOURS = 12;
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function rotationStats(pattern: Pattern) {
  const info = PATTERNS[pattern];
  const cycle = buildCycle(pattern);
  const daysOn = cycle[0].reduce((s, v) => s + v, 0);
  const avgWeekly = (daysOn * SHIFT_HOURS) / (info.cycleDays / 7);
  const hoursPer28 = avgWeekly * 4;
  // Coverage: at least one crew on each day among day crews and among night crews
  const gaps = Array.from({ length: info.cycleDays }, (_, d) => {
    const dayOn = cycle.slice(0, info.dayCrews).some((c) => c[d] === 1);
    const nightOn = cycle.slice(info.dayCrews).some((c) => c[d] === 1);
    return !(dayOn && nightOn);
  }).filter(Boolean).length;
  const longestStretch = cycle[0].concat(cycle[0]).reduce(
    (acc, v) => (v ? { cur: acc.cur + 1, max: Math.max(acc.max, acc.cur + 1) } : { cur: 0, max: acc.max }),
    { cur: 0, max: 0 },
  ).max;
  return { info, cycle, daysOn, avgWeekly, hoursPer28, gaps, longestStretch: Math.min(longestStretch, info.cycleDays) };
}

// ---------------------------------------------------------------------------
// Rotation tab
// ---------------------------------------------------------------------------
function RotationTab() {
  const [pattern, setPattern] = useState<Pattern>('2-2-3');
  const [hourlyRate, setHourlyRate] = useState('28');
  const [sevenK, setSevenK] = useState(false);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ pattern: string; hourlyRate: string; sevenK: string }>('shift-rotation-calculator');

  const s = useMemo(() => rotationStats(pattern), [pattern]);
  const rate = Math.max(0, parseFloat(hourlyRate) || 0);
  // Weekly OT for a 12-hour pattern: hours over 40 in a 7-day week vary by week; the
  // average is what budgets use. 7(k): police 171h / 28 days, fire 212h / 28 days.
  const avgOtWeekly = Math.max(0, s.avgWeekly - 40);
  const policeOt28 = Math.max(0, s.hoursPer28 - 171);
  const fireOt28 = Math.max(0, s.hoursPer28 - 212);
  const weeklyPay = rate * (Math.min(40, s.avgWeekly) + avgOtWeekly * 1.5);

  const handleTryExample = () => { setPattern('dupont'); setHourlyRate('32'); setSevenK(false); };
  const handleSave = () => saveEntry({ pattern, hourlyRate, sevenK: String(sevenK) }, `${s.info.name} · ${s.avgWeekly.toFixed(0)}h/wk avg`);
  const handleRestore = (i: { pattern: string; hourlyRate: string; sevenK: string }) => { setPattern(i.pattern as Pattern); setHourlyRate(i.hourlyRate); setSevenK(i.sevenK === 'true'); };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-violet-500/5 border border-violet-500/20 p-3 text-xs text-muted-foreground">
        <RefreshCw className="inline h-3 w-3 mr-1" />
        Pick a 12-hour rotation to see every crew&apos;s full cycle, confirm 24/7 coverage, and get the average weekly hours and overtime the pattern builds in.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2 sm:col-span-1">
          <Label>Rotation pattern</Label>
          <Select value={pattern} onValueChange={(v) => setPattern(v as Pattern)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(PATTERNS) as Pattern[]).map((p) => <SelectItem key={p} value={p}>{PATTERNS[p].name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rot-rate">Hourly rate (for the pay estimate)</Label>
          <Input id="rot-rate" type="number" step="0.5" min="0" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rot-7k">Overtime rule</Label>
          <Select value={sevenK ? '7k' : 'flsa'} onValueChange={(v) => setSevenK(v === '7k')}>
            <SelectTrigger id="rot-7k"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="flsa">Standard FLSA — over 40 hours a week</SelectItem>
              <SelectItem value="7k">Section 7(k) — police and fire 28-day periods</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <TryExample onClick={handleTryExample} />
        <Button onClick={handleSave} variant="outline" className="shrink-0">Save to history</Button>
      </div>

      <motion.div key={pattern} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} className="result-display" aria-live="polite">
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 sm:p-6 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground font-medium">{s.info.name}</p>
            <p className="text-4xl font-bold text-violet-600" data-result-primary>{s.avgWeekly.toFixed(1)}h / week average</p>
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{s.info.crews} crews</Badge>
              <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{s.info.cycleDays}-day cycle · {s.daysOn} shifts</Badge>
              <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{s.hoursPer28.toFixed(0)}h per 28 days</Badge>
              {s.gaps === 0 ? (
                <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600"><CheckCircle2 className="h-3 w-3 mr-1 inline" />24/7 coverage</Badge>
              ) : (
                <Badge variant="outline" className="bg-red-500/10 border-red-500/30 text-red-600"><AlertTriangle className="h-3 w-3 mr-1 inline" />{s.gaps} uncovered days</Badge>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border/50 overflow-hidden">
            <div className="px-4 py-2 bg-muted/40 border-b border-border/50 text-xs font-semibold text-muted-foreground">
              Full {s.info.cycleDays}-day cycle — crews {CREW_NAMES.slice(0, s.info.dayCrews).join(' & ')} days, {CREW_NAMES.slice(s.info.dayCrews, s.info.crews).join(' & ')} nights
            </div>
            <div className="overflow-x-auto">
              <table className="text-[11px] sm:text-xs w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-2 py-1.5 text-left sticky left-0 bg-muted/30">Crew</th>
                    {Array.from({ length: s.info.cycleDays }, (_, d) => (
                      <th key={d} className="px-1 py-1.5 text-center font-medium text-muted-foreground">
                        <div>{DOW[d % 7]}</div>
                        <div className="text-[10px] opacity-70">{d + 1}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {s.cycle.map((row, i) => (
                    <tr key={i}>
                      <td className="px-2 py-1.5 font-semibold whitespace-nowrap sticky left-0 bg-background">Crew {CREW_NAMES[i]} {i < s.info.dayCrews ? '(Day)' : '(Night)'}</td>
                      {row.map((cell, d) => (
                        <td key={d} className={`px-1 py-1.5 text-center ${cell ? (i < s.info.dayCrews ? 'bg-violet-500/20 text-violet-700 dark:text-violet-300 font-semibold' : 'bg-indigo-500/25 text-indigo-800 dark:text-indigo-200 font-semibold') : 'text-muted-foreground/60'}`}>
                          {cell ? (i < s.info.dayCrews ? 'D' : 'N') : '·'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Longest stretch on', value: `${s.longestStretch} shifts` },
              { label: 'Days off per cycle', value: `${s.info.cycleDays - s.daysOn} of ${s.info.cycleDays}` },
              sevenK
                ? { label: 'Police OT per 28 days (171h)', value: `${policeOt28.toFixed(0)}h`, accent: true }
                : { label: 'Avg weekly overtime (FLSA)', value: `${avgOtWeekly.toFixed(1)}h`, accent: true },
              sevenK
                ? { label: 'Fire OT per 28 days (212h)', value: `${fireOt28.toFixed(0)}h` }
                : { label: 'Avg weekly gross at this rate', value: rate ? formatCurrency(weeklyPay) : '—' },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-background border border-border/50 p-3.5 text-center">
                <p className="text-[11px] text-muted-foreground mb-1">{m.label}</p>
                <p className={`text-lg font-bold ${m.accent ? 'text-violet-600' : ''}`}>{m.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground space-y-1.5">
            <p><strong className="text-foreground">{s.info.name}:</strong> {s.info.description}</p>
            <p><strong className="text-foreground">Weekends off:</strong> {s.info.weekendsOff}. <strong className="text-foreground">Common in:</strong> {s.info.usedBy}.</p>
            <p>
              Overtime is owed per workweek, not on the cycle average: a 2-2-3 crew works 36 hours one week and 48 the next, so the 48-hour week carries 8 hours of overtime even though the average is 42. Public-safety agencies can elect a 28-day FLSA 7(k) period instead (overtime after 171 hours for police, 212 for firefighters). California adds daily overtime after 8 hours, so a 12-hour shift there is 4 hours at 1.5× every day.
            </p>
          </div>
        </div>
      </motion.div>
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Weekly roster tab (former Employee Schedule Calculator)
// ---------------------------------------------------------------------------
interface Employee { name: string; mon: string; tue: string; wed: string; thu: string; fri: string; sat: string; sun: string; rate: string }
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const DAY_LABELS: Record<string, string> = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };

/** "9-5", "8:30-4:30", "4-12" (PM assumed when end ≤ start), "22-6" (24-hour) */
export function parseShift(shift: string): number {
  if (!shift) return 0;
  const m = shift.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*-\s*(\d{1,2})(?::(\d{2}))?$/);
  if (!m) return 0;
  const s = parseInt(m[1], 10) + (m[2] ? parseInt(m[2], 10) / 60 : 0);
  let e = parseInt(m[3], 10) + (m[4] ? parseInt(m[4], 10) / 60 : 0);
  if (e <= s) e += 12;
  if (e <= s) e += 12;
  return Math.min(24, e - s);
}

const blank = (name: string): Employee => ({ name, mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '', rate: '20' });

function RosterTab() {
  const [employees, setEmployees] = useState<Employee[]>([
    { ...blank('Alice'), mon: '9-5', tue: '9-5', wed: '9-5', thu: '9-5', fri: '9-5', rate: '22' },
    { ...blank('Bob'), mon: '12-8', tue: '12-8', wed: '12-8', thu: '12-8', fri: '12-8', rate: '20' },
  ]);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('employee-schedule-calculator');

  const parsed = employees.map((e) => {
    const hours = DAYS.reduce((s, d) => s + parseShift(e[d]), 0);
    const r = parseFloat(e.rate) || 0;
    const ot = Math.max(0, hours - 40);
    return { hours, ot, pay: (hours - ot) * r + ot * r * 1.5 };
  });
  const totalHours = parsed.reduce((s, p) => s + p.hours, 0);
  const totalOt = parsed.reduce((s, p) => s + p.ot, 0);
  const totalPay = parsed.reduce((s, p) => s + p.pay, 0);
  const coverage = DAYS.map((d) => employees.filter((e) => parseShift(e[d]) > 0).length);

  const update = (i: number, field: keyof Employee, value: string) => setEmployees((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  const add = () => setEmployees((prev) => [...prev, blank(`Employee ${prev.length + 1}`)]);
  const remove = (i: number) => setEmployees((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const handleTryExample = () =>
    setEmployees([
      { ...blank('Alice'), mon: '8-4', tue: '8-4', wed: '8-4', thu: '8-4', fri: '8-4', rate: '22' },
      { ...blank('Bob'), mon: '4-12', tue: '4-12', wed: '4-12', thu: '4-12', fri: '4-12', sat: '4-12', rate: '24' },
      { ...blank('Carol'), sat: '8-4', sun: '8-4', rate: '26' },
    ]);
  const handleSave = () => {
    const inputs: Record<string, string> = {};
    employees.forEach((e, i) => Object.entries(e).forEach(([k, v]) => { inputs[`e${i}_${k}`] = v; }));
    saveEntry(inputs, `${employees.length} staff · ${totalHours.toFixed(1)}h · ${formatCurrency(totalPay)}`);
  };
  const handleRestore = (i: Record<string, string>) => {
    const count = new Set(Object.keys(i).map((k) => k.split('_')[0])).size;
    const list: Employee[] = [];
    for (let idx = 0; idx < count; idx++) {
      const e = blank('');
      (Object.keys(e) as (keyof Employee)[]).forEach((k) => { e[k] = i[`e${idx}_${k}`] ?? (k === 'rate' ? '20' : ''); });
      list.push(e);
    }
    setEmployees(list);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3 text-xs text-muted-foreground">
        <CalendarDays className="inline h-3 w-3 mr-1" />
        Type each shift as a range — <code>9-5</code>, <code>8:30-4:30</code>, <code>4-12</code>, <code>22-6</code>. Hours, overtime over 40 and labor cost update as you type; the coverage row shows how many people are on each day.
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border border-border/50 rounded-lg overflow-hidden">
          <thead className="bg-muted/40 font-semibold text-muted-foreground">
            <tr>
              <th className="px-2 py-2 text-left">Name</th>
              {DAYS.map((d) => <th key={d} className="px-1 py-2 text-center">{DAY_LABELS[d]}</th>)}
              <th className="px-2 py-2 text-center">$/hr</th>
              <th className="px-2 py-2 text-right">Hours</th>
              <th className="px-2 py-2 text-right">OT</th>
              <th className="px-2 py-2 text-right">Pay</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {employees.map((e, i) => (
              <tr key={i} className="hover:bg-muted/10">
                <td className="px-1 py-1"><Input className="h-8 text-xs min-w-[6rem]" value={e.name} onChange={(ev) => update(i, 'name', ev.target.value)} aria-label={`Employee ${i + 1} name`} /></td>
                {DAYS.map((d) => (
                  <td key={d} className="px-1 py-1"><Input className="h-8 text-xs text-center min-w-[4.5rem]" placeholder="—" value={e[d]} onChange={(ev) => update(i, d, ev.target.value)} aria-label={`${e.name || 'Employee'} ${DAY_LABELS[d]}`} /></td>
                ))}
                <td className="px-1 py-1"><Input className="h-8 text-xs text-center min-w-[4rem]" type="number" step="0.5" value={e.rate} onChange={(ev) => update(i, 'rate', ev.target.value)} aria-label="Hourly rate" /></td>
                <td className="px-2 py-1 text-right tabular-nums">{parsed[i].hours.toFixed(1)}</td>
                <td className={`px-2 py-1 text-right tabular-nums ${parsed[i].ot > 0 ? 'text-amber-600 font-semibold' : ''}`}>{parsed[i].ot.toFixed(1)}</td>
                <td className="px-2 py-1 text-right tabular-nums font-semibold">{formatCurrency(parsed[i].pay)}</td>
                <td className="px-1"><Button variant="ghost" size="sm" className="h-7 px-2 text-red-600" onClick={() => remove(i)} aria-label="Remove employee">×</Button></td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted/40 font-semibold">
            <tr>
              <td className="px-2 py-2 text-right text-muted-foreground">On duty</td>
              {coverage.map((c, i) => <td key={i} className={`px-1 py-2 text-center ${c === 0 ? 'text-red-600' : ''}`}>{c}</td>)}
              <td />
              <td className="px-2 py-2 text-right">{totalHours.toFixed(1)}</td>
              <td className="px-2 py-2 text-right text-amber-600">{totalOt.toFixed(1)}</td>
              <td className="px-2 py-2 text-right">{formatCurrency(totalPay)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex gap-2">
          <TryExample onClick={handleTryExample} />
          <Button variant="outline" size="sm" onClick={add} className="text-emerald-600 border-emerald-500/30 bg-emerald-500/5">+ Add employee</Button>
        </div>
        <Button onClick={handleSave} variant="outline" className="shrink-0" disabled={totalHours <= 0}>Save to history</Button>
      </div>

      {totalHours > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display" aria-live="polite">
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Weekly labor cost for {employees.length} {employees.length === 1 ? 'person' : 'people'}</p>
              <p className="text-4xl font-bold text-blue-600" data-result-primary>{formatCurrency(totalPay)}</p>
              <div className="flex justify-center gap-2 flex-wrap">
                <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{totalHours.toFixed(1)}h scheduled</Badge>
                <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{(totalHours / employees.length).toFixed(1)}h per person</Badge>
                <Badge variant="outline" className={totalOt > 0 ? 'bg-amber-500/10 border-amber-500/30 text-amber-600' : 'bg-muted/40'}>{totalOt.toFixed(1)}h overtime</Badge>
                {coverage.some((c) => c === 0) && <Badge variant="outline" className="bg-red-500/10 border-red-500/30 text-red-600">{coverage.filter((c) => c === 0).length} day(s) with nobody scheduled</Badge>}
              </div>
            </div>
            <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
              Wages only. Add roughly 7.65% employer FICA, federal and state unemployment tax and any benefits to get the loaded cost. Fair-workweek laws in New York City, Chicago, Philadelphia, Seattle, San Francisco and Oregon require posting schedules 14 days ahead and paying a premium for late changes.
            </div>
          </div>
        </motion.div>
      )}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ---------------------------------------------------------------------------
export default function ShiftSchedulePlanner() {
  // Old /employee-schedule-calculator URLs 301 here with ?mode=roster
  const urlMode = useSearchParam('mode');
  const [modeOverride, setMode] = useState<PlannerMode | null>(null);
  const mode: PlannerMode = modeOverride ?? (urlMode === 'roster' ? 'roster' : 'rotation');

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex rounded-xl bg-muted/50 p-1 border border-border/50" role="tablist">
          {([
            { value: 'rotation', label: 'Rotating shift patterns', icon: RefreshCw },
            { value: 'roster', label: 'Weekly staff roster', icon: CalendarDays },
          ] as { value: PlannerMode; label: string; icon: typeof RefreshCw }[]).map((t) => {
            const Icon = t.icon;
            const active = mode === t.value;
            return (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(t.value)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>
        {mode === 'rotation' ? <RotationTab /> : <RosterTab />}
      </div>
    </div>
  );
}
