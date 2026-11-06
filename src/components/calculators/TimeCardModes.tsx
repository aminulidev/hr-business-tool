'use client';

/**
 * Secondary modes of the Time Card Calculator (Roadmap v2, Phase 15.1).
 * Four thin pages — hours-between-times, time-difference, clock-out and
 * break — were folded into the time card page as tabs. Their old URLs 301
 * here with ?mode=… so a visitor lands on the right tab.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock3, LogOut, PauseCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TryExample from './TryExample';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { parseTimeToMinutes, formatHHMM } from '@/lib/time-utils';

export type TimeCardMode = 'timecard' | 'hours-between' | 'clock-out' | 'breaks';

export const TIME_CARD_MODES: { value: TimeCardMode; label: string; short: string; icon: typeof Clock }[] = [
  { value: 'timecard', label: 'Time card & timesheet', short: 'Time card', icon: Clock },
  { value: 'hours-between', label: 'Hours between two times', short: 'Hours between', icon: Clock3 },
  { value: 'clock-out', label: 'When to clock out', short: 'Clock-out time', icon: LogOut },
  { value: 'breaks', label: 'Meal & rest break rules', short: 'Break rules', icon: PauseCircle },
];

export function isTimeCardMode(v: string | null): v is TimeCardMode {
  return !!v && TIME_CARD_MODES.some((m) => m.value === v);
}

export function TimeCardModeSwitcher({ mode, onChange }: { mode: TimeCardMode; onChange: (m: TimeCardMode) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 rounded-xl bg-muted/50 p-1 border border-border/50" role="tablist" aria-label="Time card calculator modes">
      {TIME_CARD_MODES.map((m) => {
        const Icon = m.icon;
        const active = m.value === mode;
        return (
          <button
            key={m.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m.value)}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              active ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="sm:hidden">{m.short}</span>
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function formatClock(min: number): string {
  if (min < 0) return '—';
  const h24 = Math.floor(min / 60) % 24;
  const m = min % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

const dateInputClass = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm';

// ---------------------------------------------------------------------------
// Hours between two times (same day, overnight, or across dates)
// ---------------------------------------------------------------------------
export function HoursBetweenMode() {
  const [startTime, setStartTime] = useState('9:00 AM');
  const [endTime, setEndTime] = useState('5:30 PM');
  const [overnight, setOvernight] = useState(false);
  const [useDates, setUseDates] = useState(false);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [breakMin, setBreakMin] = useState('0');
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('hours-between-times-calculator');

  const sMin = parseTimeToMinutes(startTime);
  const eMin = parseTimeToMinutes(endTime);
  const brk = Math.max(0, parseFloat(breakMin) || 0);

  let totalMinutes = -1;
  if (sMin >= 0 && eMin >= 0) {
    if (useDates && startDate && endDate) {
      const dayDiff = Math.round((new Date(`${endDate}T00:00:00`).getTime() - new Date(`${startDate}T00:00:00`).getTime()) / 86_400_000);
      totalMinutes = dayDiff * 1440 + (eMin - sMin);
    } else {
      totalMinutes = eMin - sMin;
      if (totalMinutes < 0 || (overnight && totalMinutes <= 0)) totalMinutes += 1440;
      else if (overnight && totalMinutes > 0 && eMin < sMin) totalMinutes += 1440;
    }
  }
  const valid = totalMinutes >= 0;
  const paidMinutes = Math.max(0, totalMinutes - brk);
  const days = Math.floor(totalMinutes / 1440);
  const remHours = Math.floor((totalMinutes % 1440) / 60);
  const remMinutes = totalMinutes % 60;

  const handleTryExample = () => { setUseDates(false); setStartTime('10:00 PM'); setEndTime('6:00 AM'); setOvernight(true); setBreakMin('30'); };
  const handleSave = () => {
    if (!valid) return;
    saveEntry(
      { startTime, endTime, overnight: String(overnight), useDates: String(useDates), startDate, endDate, breakMin },
      useDates ? `${startDate} ${startTime} → ${endDate} ${endTime} = ${(totalMinutes / 60).toFixed(2)}h` : `${startTime} → ${endTime} = ${formatHHMM(totalMinutes)}`,
    );
  };
  const handleRestore = (i: Record<string, string>) => {
    setStartTime(i.startTime); setEndTime(i.endTime); setOvernight(i.overnight === 'true'); setUseDates(i.useDates === 'true');
    if (i.startDate) setStartDate(i.startDate); if (i.endDate) setEndDate(i.endDate); setBreakMin(i.breakMin ?? '0');
  };

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3 text-xs text-muted-foreground">
          <Clock3 className="inline h-3 w-3 mr-1" />
          Exact duration between two clock times, in hours:minutes and decimal hours. Handles overnight shifts (10 PM → 6 AM) and, with dates switched on, spans of several days.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hb-start">Start time</Label>
            <Input id="hb-start" placeholder="9:00 AM" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <p className="text-xs text-muted-foreground">Formats: 9:00 AM, 9am, 17:30</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hb-end">End time</Label>
            <Input id="hb-end" placeholder="5:30 PM" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hb-break">Unpaid break (minutes)</Label>
            <Input id="hb-break" type="number" min="0" step="5" value={breakMin} onChange={(e) => setBreakMin(e.target.value)} />
            <p className="text-xs text-muted-foreground">Leave 0 for the raw duration</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Switch id="hb-dates" checked={useDates} onCheckedChange={setUseDates} />
            <span>Different start and end dates</span>
          </label>
          {!useDates && (
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Switch id="hb-overnight" checked={overnight} onCheckedChange={setOvernight} />
              <span>Overnight shift (end time is the next day)</span>
            </label>
          )}
        </div>

        {useDates && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hb-sd">Start date</Label>
              <input id="hb-sd" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={dateInputClass} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hb-ed">End date</Label>
              <input id="hb-ed" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={dateInputClass} />
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <Button onClick={handleSave} disabled={!valid} variant="outline" className="shrink-0">Save to history</Button>
        </div>

        {valid && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-5">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">{useDates ? 'Elapsed time' : 'Duration between times'}</p>
                <p className="text-4xl font-bold text-blue-600" data-result-primary>
                  {days > 0 ? `${days}d ${remHours}h ${remMinutes}m` : formatHHMM(totalMinutes)}
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{(totalMinutes / 60).toFixed(2)} decimal hours</Badge>
                  {brk > 0 && <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{(paidMinutes / 60).toFixed(2)} paid hours after break</Badge>}
                  {!useDates && <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{formatClock(sMin)} → {formatClock(eMin)}</Badge>}
                  {useDates && <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{(totalMinutes / 1440).toFixed(2)} days</Badge>}
                </div>
              </div>
              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                Decimal hours = minutes ÷ 60: 15 min = 0.25, 30 min = 0.50, 45 min = 0.75. Payroll systems need the decimal figure. To total a whole week with overtime, switch to the Time card tab.
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Clock-out time to hit a target number of hours
// ---------------------------------------------------------------------------
export function ClockOutMode() {
  const [clockIn, setClockIn] = useState('8:00 AM');
  const [targetHours, setTargetHours] = useState('8');
  const [breakMin, setBreakMin] = useState('30');
  const [hoursSoFar, setHoursSoFar] = useState('');
  const [avoidDailyOT, setAvoidDailyOT] = useState(false);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('clock-out-calculator');

  const inMin = parseTimeToMinutes(clockIn);
  const sofar = Math.max(0, parseFloat(hoursSoFar) || 0);
  let target = Math.max(0, parseFloat(targetHours) || 0);
  if (avoidDailyOT && target > 8) target = 8;
  const brk = Math.max(0, parseFloat(breakMin) || 0);
  const outMin = inMin >= 0 ? inMin + target * 60 + brk : -1;
  const weeklyAfterToday = sofar + target;
  const toForty = Math.max(0, 40 - sofar);
  const valid = inMin >= 0 && target > 0;

  const handleTryExample = () => { setClockIn('8:00 AM'); setTargetHours('8'); setBreakMin('30'); setHoursSoFar('32'); setAvoidDailyOT(true); };
  const handleSave = () => {
    if (!valid) return;
    saveEntry({ clockIn, targetHours, breakMin, hoursSoFar, avoidDailyOT: String(avoidDailyOT) }, `In ${clockIn} · ${target}h → out ${formatClock(outMin)}`);
  };
  const handleRestore = (i: Record<string, string>) => {
    setClockIn(i.clockIn); setTargetHours(i.targetHours); setBreakMin(i.breakMin); setHoursSoFar(i.hoursSoFar ?? ''); setAvoidDailyOT(i.avoidDailyOT === 'true');
  };

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-muted-foreground">
          <LogOut className="inline h-3 w-3 mr-1" />
          Clock-out time = clock-in + hours you want to work + unpaid break. Add the hours you have already worked this week to see where today leaves you against the 40-hour overtime line.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="co-in">Clock-in time</Label>
            <Input id="co-in" placeholder="8:00 AM" value={clockIn} onChange={(e) => setClockIn(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="co-target">Hours to work today</Label>
            <Input id="co-target" type="number" step="0.25" min="0" value={targetHours} onChange={(e) => setTargetHours(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="co-break">Unpaid break (minutes)</Label>
            <Input id="co-break" type="number" step="5" min="0" value={breakMin} onChange={(e) => setBreakMin(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="co-sofar">Hours already worked this week</Label>
            <Input id="co-sofar" type="number" step="0.25" min="0" placeholder="optional" value={hoursSoFar} onChange={(e) => setHoursSoFar(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 max-w-md rounded-lg border border-border/40 p-3">
          <div>
            <Label htmlFor="co-avoid" className="text-sm font-medium">Cap today at 8 hours</Label>
            <p className="text-xs text-muted-foreground">Avoids daily overtime in California, Alaska and (below $18/hr) Nevada.</p>
          </div>
          <Switch id="co-avoid" checked={avoidDailyOT} onCheckedChange={setAvoidDailyOT} />
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <Button onClick={handleSave} disabled={!valid} variant="outline" className="shrink-0">Save to history</Button>
        </div>

        {valid && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-5">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Clock out at</p>
                <p className="text-4xl font-bold text-amber-600" data-result-primary>{formatClock(outMin)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">In {formatClock(inMin)}</Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{target}h worked</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">On site {formatHHMM(target * 60 + brk)}</Badge>
                  {outMin >= 1440 && <Badge variant="outline" className="bg-violet-500/10 border-violet-500/30 text-violet-600">Next day</Badge>}
                </div>
              </div>
              {hoursSoFar !== '' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-background border border-border/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Week after today</p>
                    <p className="text-lg font-bold">{weeklyAfterToday.toFixed(2)}h</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Hours left before 40</p>
                    <p className="text-lg font-bold">{toForty.toFixed(2)}h</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Overtime this week</p>
                    <p className={`text-lg font-bold ${weeklyAfterToday > 40 ? 'text-red-600' : 'text-emerald-600'}`}>{Math.max(0, weeklyAfterToday - 40).toFixed(2)}h</p>
                  </div>
                </div>
              )}
              {hoursSoFar !== '' && toForty > 0 && toForty < target && (
                <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-3 text-xs text-muted-foreground">
                  To stop exactly at 40 hours for the week, clock out at {formatClock(inMin + toForty * 60 + brk)} ({toForty.toFixed(2)} more hours).
                </div>
              )}
              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                Federal overtime is weekly: 1.5× after 40 hours in the workweek, however the hours are spread. Daily overtime after 8 hours exists only in California, Alaska and Nevada (for workers earning under $18/hour), and Colorado after 12 hours.
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meal and rest break rules by state
// ---------------------------------------------------------------------------
type BreakState = 'CA' | 'OR' | 'WA' | 'CO' | 'NY' | 'other';

interface BreakRule {
  name: string;
  /** Shift length (hours) that triggers the first unpaid meal period; 0 = none required */
  mealThreshold: number;
  mealMin: number;
  /** Shift length that triggers a second meal period; 0 = none */
  secondMealThreshold: number;
  /** Paid rest break every N hours; 0 = none required */
  restEveryHours: number;
  restMin: number;
  source: string;
  note: string;
}

export const BREAK_RULES: Record<BreakState, BreakRule> = {
  CA: {
    name: 'California', mealThreshold: 5, mealMin: 30, secondMealThreshold: 10, restEveryHours: 4, restMin: 10,
    source: 'Labor Code §§ 512 and 226.7; Wage Orders',
    note: 'Meal period must start before the end of the 5th hour; a second one before the end of the 10th. One hour of premium pay is owed for each missed meal or rest break.',
  },
  OR: {
    name: 'Oregon', mealThreshold: 6, mealMin: 30, secondMealThreshold: 14, restEveryHours: 4, restMin: 10,
    source: 'OAR 839-020-0050',
    note: 'Meal period for shifts of 6 hours or more; a paid 10-minute rest break for every 4-hour segment or major part of it.',
  },
  WA: {
    name: 'Washington', mealThreshold: 5, mealMin: 30, secondMealThreshold: 11, restEveryHours: 4, restMin: 10,
    source: 'WAC 296-126-092',
    note: 'Meal period for shifts over 5 hours, taken between the 2nd and 5th hour; employees may not work more than 3 hours without a rest break.',
  },
  CO: {
    name: 'Colorado', mealThreshold: 5, mealMin: 30, secondMealThreshold: 0, restEveryHours: 4, restMin: 10,
    source: 'COMPS Order #39, Rules 5.1–5.2',
    note: 'Uninterrupted 30-minute meal period for shifts over 5 hours; a paid 10-minute rest break for each 4 hours or major fraction.',
  },
  NY: {
    name: 'New York', mealThreshold: 6, mealMin: 30, secondMealThreshold: 0, restEveryHours: 0, restMin: 0,
    source: 'Labor Law § 162',
    note: 'A 30-minute meal period for shifts of more than 6 hours spanning 11 AM–2 PM (factory workers get 60 minutes); no state rest-break requirement.',
  },
  other: {
    name: 'No state mandate (federal rules only)', mealThreshold: 0, mealMin: 0, secondMealThreshold: 0, restEveryHours: 0, restMin: 0,
    source: '29 CFR 785.18–785.19',
    note: 'The FLSA requires no breaks. If an employer gives short rest breaks (5–20 minutes) they must be paid; a bona fide meal period of 30+ minutes, fully relieved of duty, may be unpaid.',
  },
};

export function BreakRulesMode() {
  const [shiftHours, setShiftHours] = useState('8');
  const [stateCode, setStateCode] = useState<BreakState>('CA');
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('break-calculator');

  const sh = Math.max(0, parseFloat(shiftHours) || 0);
  const rule = BREAK_RULES[stateCode];
  let mealBreaks = 0;
  if (rule.mealThreshold > 0 && sh > rule.mealThreshold - 0.0001) mealBreaks = 1;
  if (rule.secondMealThreshold > 0 && sh > rule.secondMealThreshold - 0.0001) mealBreaks = 2;
  const restBreaks = rule.restEveryHours > 0 ? Math.floor(sh / rule.restEveryHours) : 0;
  const unpaidMin = mealBreaks * rule.mealMin;
  const paidMin = restBreaks * rule.restMin;
  const netWorkHours = Math.max(0, sh - unpaidMin / 60);

  const handleTryExample = () => { setShiftHours('10'); setStateCode('CA'); };
  const handleSave = () => {
    if (sh <= 0) return;
    saveEntry({ shiftHours, stateCode }, `${rule.name} · ${sh}h shift · ${mealBreaks} meal + ${restBreaks} rest`);
  };
  const handleRestore = (i: Record<string, string>) => { setShiftHours(i.shiftHours); setStateCode(i.stateCode as BreakState); };

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3 text-xs text-muted-foreground">
          <PauseCircle className="inline h-3 w-3 mr-1" />
          Federal law requires no meal or rest breaks. California, Oregon, Washington, Colorado and New York (among others) do. Meal periods are usually unpaid and come off your time card; rest breaks are paid and stay on it.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bc-shift">Shift length (hours, including breaks)</Label>
            <Input id="bc-shift" type="number" step="0.5" min="0" value={shiftHours} onChange={(e) => setShiftHours(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bc-state">State</Label>
            <Select value={stateCode} onValueChange={(v) => setStateCode(v as BreakState)}>
              <SelectTrigger id="bc-state"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(BREAK_RULES) as BreakState[]).map((s) => (
                  <SelectItem key={s} value={s}>{BREAK_RULES[s].name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <Button onClick={handleSave} disabled={sh <= 0} variant="outline" className="shrink-0">Save to history</Button>
        </div>

        {sh > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-5">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Required breaks in {rule.name.replace(' (federal rules only)', '')} for a {sh}-hour shift</p>
                <p className="text-4xl font-bold text-blue-600" data-result-primary>{unpaidMin + paidMin} min</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{mealBreaks} × {rule.mealMin || 30}-min meal (unpaid)</Badge>
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{restBreaks} × {rule.restMin || 10}-min rest (paid)</Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">Paid time {netWorkHours.toFixed(2)}h</Badge>
                </div>
              </div>
              <div className="rounded-xl border border-border/50 overflow-hidden text-xs">
                <div className="px-4 py-2 bg-muted/40 border-b border-border/50 font-semibold text-muted-foreground">{rule.name} — {rule.source}</div>
                <div className="divide-y divide-border/40">
                  <div className="px-4 py-2 flex justify-between gap-4"><span>First meal period</span><span className="font-semibold text-right">{rule.mealThreshold ? (mealBreaks >= 1 ? `Required (shift over ${rule.mealThreshold}h)` : `Not until ${rule.mealThreshold}h`) : 'Not required'}</span></div>
                  {rule.secondMealThreshold > 0 && <div className="px-4 py-2 flex justify-between gap-4"><span>Second meal period</span><span className="font-semibold text-right">{mealBreaks >= 2 ? `Required (shift over ${rule.secondMealThreshold}h)` : `Not until ${rule.secondMealThreshold}h`}</span></div>}
                  <div className="px-4 py-2 flex justify-between gap-4"><span>Paid rest breaks</span><span className="font-semibold text-right">{rule.restEveryHours ? `${restBreaks} (one per ${rule.restEveryHours} hours)` : 'Not required'}</span></div>
                  <div className="px-4 py-3 text-muted-foreground">{rule.note}</div>
                </div>
              </div>
              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                Enter the unpaid meal minutes in the Time card tab so the week&apos;s total matches your pay stub. A &quot;working lunch&quot; at your desk is paid time under the FLSA.
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}
