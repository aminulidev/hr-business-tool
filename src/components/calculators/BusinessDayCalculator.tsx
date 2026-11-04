'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  ArrowRight,
  Calendar,
  Info,
  BarChart as BarChartIcon,
  Sparkles,
  Clock,
} from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Cell,
} from 'recharts';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ---------------------------------------------------------------------------
// Dynamic Multi-Year US Federal Holiday Engine (OPM Observed Rules)
// ---------------------------------------------------------------------------

interface HolidayEntry {
  date: Date;
  name: string;
}

/** Nth weekday of a month (month is 0-indexed, weekday 0=Sun..6=Sat, n=1..5) */
function nthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (weekday - firstDay + 7) % 7;
  const day = 1 + offset + (n - 1) * 7;
  return new Date(year, month, day);
}

/** Last weekday of a month */
function lastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const lastDate = new Date(year, month + 1, 0);
  const diff = (lastDate.getDay() - weekday + 7) % 7;
  return new Date(year, month, lastDate.getDate() - diff);
}

/** Apply US OPM observed rule: Saturday -> Friday, Sunday -> Monday */
function observedFixedHoliday(year: number, month: number, day: number): Date {
  const actual = new Date(year, month, day);
  const dow = actual.getDay();
  if (dow === 6) return new Date(year, month, day - 1);
  if (dow === 0) return new Date(year, month, day + 1);
  return actual;
}

function getUSFederalHolidaysForYear(year: number): HolidayEntry[] {
  return [
    { date: observedFixedHoliday(year, 0, 1), name: `New Year's Day (${year})` },
    { date: nthWeekdayOfMonth(year, 0, 1, 3), name: `MLK Jr. Day (${year})` },
    { date: nthWeekdayOfMonth(year, 1, 1, 3), name: `Presidents' Day (${year})` },
    { date: lastWeekdayOfMonth(year, 4, 1), name: `Memorial Day (${year})` },
    { date: observedFixedHoliday(year, 5, 19), name: `Juneteenth (${year})` },
    { date: observedFixedHoliday(year, 6, 4), name: `Independence Day (${year})` },
    { date: nthWeekdayOfMonth(year, 8, 1, 1), name: `Labor Day (${year})` },
    { date: nthWeekdayOfMonth(year, 9, 1, 2), name: `Columbus Day (${year})` },
    { date: observedFixedHoliday(year, 10, 11), name: `Veterans Day (${year})` },
    { date: nthWeekdayOfMonth(year, 10, 4, 4), name: `Thanksgiving (${year})` },
    { date: observedFixedHoliday(year, 11, 25), name: `Christmas Day (${year})` },
  ];
}

function getUSFederalHolidaysBetweenYears(startYear: number, endYear: number): HolidayEntry[] {
  const minY = Math.min(startYear, endYear) - 1;
  const maxY = Math.max(startYear, endYear) + 1;
  const list: HolidayEntry[] = [];
  for (let y = minY; y <= maxY; y++) {
    list.push(...getUSFederalHolidaysForYear(y));
  }
  return list;
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateLong(d: Date): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function toIsoDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ---------------------------------------------------------------------------
// Calculation functions
// ---------------------------------------------------------------------------

interface CountResult {
  businessDays: number;
  calendarDays: number;
  weekendDays: number;
  holidaysExcluded: number;
  holidaysInRange: { name: string; dateStr: string }[];
  workHours8: number;
  workWeeks: number;
}

function countBusinessDays(
  start: Date,
  end: Date,
  excludeHolidays: boolean
): CountResult {
  const holidays = excludeHolidays
    ? getUSFederalHolidaysBetweenYears(start.getFullYear(), end.getFullYear())
    : [];

  let businessDays = 0;
  let weekendDays = 0;
  let holidaysExcluded = 0;
  const holidaysInRange: { name: string; dateStr: string }[] = [];

  const current = new Date(start);
  current.setHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    if (isWeekend(current)) {
      weekendDays++;
    } else {
      const holiday = holidays.find((h) => sameDay(h.date, current));
      if (holiday) {
        holidaysExcluded++;
        holidaysInRange.push({
          name: holiday.name,
          dateStr: formatDateShort(current),
        });
      } else {
        businessDays++;
      }
    }
    current.setDate(current.getDate() + 1);
  }

  const calendarDays =
    Math.round((endDate.getTime() - new Date(start).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)) + 1;

  return {
    businessDays,
    calendarDays,
    weekendDays,
    holidaysExcluded,
    holidaysInRange,
    workHours8: businessDays * 8,
    workWeeks: businessDays / 5,
  };
}

interface AddResult {
  resultDate: Date;
  daysSkipped: number;
  weekendDaysSkipped: number;
  holidaysSkipped: number;
  holidaysSkippedNames: string[];
}

function addBusinessDays(
  start: Date,
  daysToAdd: number,
  excludeHolidays: boolean
): AddResult {
  const estYears = Math.ceil(Math.abs(daysToAdd) / 250) + 1;
  const holidays = excludeHolidays
    ? getUSFederalHolidaysBetweenYears(
        start.getFullYear() - estYears,
        start.getFullYear() + estYears
      )
    : [];

  let remaining = Math.abs(daysToAdd);
  const direction = daysToAdd >= 0 ? 1 : -1;
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);

  let daysSkipped = 0;
  let weekendDaysSkipped = 0;
  let holidaysSkipped = 0;
  const holidaysSkippedNames: string[] = [];

  while (remaining > 0) {
    current.setDate(current.getDate() + direction);
    daysSkipped++;

    if (isWeekend(current)) {
      weekendDaysSkipped++;
    } else {
      const holiday = holidays.find((h) => sameDay(h.date, current));
      if (holiday) {
        holidaysSkipped++;
        holidaysSkippedNames.push(`${holiday.name} (${formatDateShort(current)})`);
      } else {
        remaining--;
      }
    }
  }

  return {
    resultDate: current,
    daysSkipped,
    weekendDaysSkipped,
    holidaysSkipped,
    holidaysSkippedNames,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Mode = 'count' | 'add';
type HolidayOption = 'weekends-only' | 'weekends-holidays';

const ADD_DAY_PRESETS = ['5', '10', '15', '20', '30', '45', '60', '90'];

export default function BusinessDayCalculator() {
  const [mode, setMode] = useState<Mode>('count');

  // Dynamic 2026+ defaults
  const [countStart, setCountStart] = useState('2026-01-01');
  const [countEnd, setCountEnd] = useState('2026-03-31');
  const [countHolidayOption, setCountHolidayOption] =
    useState<HolidayOption>('weekends-holidays');

  // Add mode state
  const [addStart, setAddStart] = useState('2026-01-05');
  const [addDaysInput, setAddDaysInput] = useState('30');
  const [addHolidayOption, setAddHolidayOption] =
    useState<HolidayOption>('weekends-holidays');

  const applyRangePreset = (preset: '30d' | '60d' | '90d' | 'q1' | 'year') => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    const yr = base.getFullYear();
    if (preset === 'q1') {
      setCountStart(`${yr}-01-01`);
      setCountEnd(`${yr}-03-31`);
      return;
    }
    if (preset === 'year') {
      setCountStart(`${yr}-01-01`);
      setCountEnd(`${yr}-12-31`);
      return;
    }
    const offset = preset === '30d' ? 30 : preset === '60d' ? 60 : 90;
    const end = new Date(base);
    end.setDate(end.getDate() + offset);
    setCountStart(toIsoDateString(base));
    setCountEnd(toIsoDateString(end));
  };

  // Live calculation for Count Mode
  const { countResult, countError } = useMemo<{
    countResult: CountResult | null;
    countError: string | null;
  }>(() => {
    if (!countStart || !countEnd) {
      return { countResult: null, countError: 'Please select both a start and end date.' };
    }
    const start = new Date(countStart + 'T00:00:00');
    const end = new Date(countEnd + 'T00:00:00');
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { countResult: null, countError: 'Invalid date selected.' };
    }
    if (end < start) {
      return { countResult: null, countError: 'End date must be on or after the start date.' };
    }
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 3650) {
      return { countResult: null, countError: 'Please select a date range within 10 years.' };
    }
    return {
      countResult: countBusinessDays(
        start,
        end,
        countHolidayOption === 'weekends-holidays'
      ),
      countError: null,
    };
  }, [countStart, countEnd, countHolidayOption]);

  // Live calculation for Add Mode
  const { addResult, addError } = useMemo<{
    addResult: AddResult | null;
    addError: string | null;
  }>(() => {
    if (!addStart) {
      return { addResult: null, addError: 'Please select a start date.' };
    }
    const days = parseInt(addDaysInput, 10);
    if (isNaN(days) || days === 0) {
      return { addResult: null, addError: 'Please enter a non-zero number of business days.' };
    }
    if (Math.abs(days) > 2500) {
      return { addResult: null, addError: 'Please enter between -2,500 and 2,500 business days.' };
    }
    const start = new Date(addStart + 'T00:00:00');
    if (isNaN(start.getTime())) {
      return { addResult: null, addError: 'Invalid start date.' };
    }
    return {
      addResult: addBusinessDays(
        start,
        days,
        addHolidayOption === 'weekends-holidays'
      ),
      addError: null,
    };
  }, [addStart, addDaysInput, addHolidayOption]);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Mode Toggle */}
        <div className="flex rounded-xl bg-muted/50 p-1 border border-border/50">
          <button
            type="button"
            onClick={() => setMode('count')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              mode === 'count'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            Count Business Days Between Dates
          </button>
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              mode === 'add'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowRight className="h-4 w-4" />
            Add / Subtract Business Days
          </button>
        </div>

        {/* Mode 1: Count Business Days Between Two Dates */}
        {mode === 'count' && (
          <motion.div
            key="count"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* Quick Range Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                Quick Ranges:
              </span>
              {[
                { id: '30d' as const, label: 'Next 30 Calendar Days' },
                { id: '60d' as const, label: 'Next 60 Days' },
                { id: '90d' as const, label: 'Next 90 Days' },
                { id: 'q1' as const, label: 'Q1 (Jan–Mar)' },
                { id: 'year' as const, label: 'Full Calendar Year' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyRangePreset(p.id)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium border bg-muted/40 hover:bg-muted text-foreground border-border/60 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Date inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="count-start" className="text-sm font-medium">
                  <Calendar className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  Start Date (Inclusive)
                </Label>
                <DatePicker value={countStart} onChange={setCountStart} className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="count-end" className="text-sm font-medium">
                  <Calendar className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  End Date (Inclusive)
                </Label>
                <DatePicker value={countEnd} onChange={setCountEnd} className="text-sm" />
              </div>
            </div>

            {/* Holiday toggle */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                <Info className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                Holiday &amp; Weekend Exclusions
              </Label>
              <Select
                value={countHolidayOption}
                onValueChange={(v) => setCountHolidayOption(v as HolidayOption)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekends-holidays">
                    Exclude Weekends + All 11 US Federal Holidays (2025–2028+)
                  </SelectItem>
                  <SelectItem value="weekends-only">
                    Exclude Weekends Only (Saturdays &amp; Sundays)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {countError && (
              <div className="flex items-center gap-2 text-red-500 text-sm rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
                <Info className="h-4 w-4 shrink-0" />
                {countError}
              </div>
            )}
          </motion.div>
        )}

        {/* Mode 2: Add/Subtract Business Days */}
        {mode === 'add' && (
          <motion.div
            key="add"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* Quick SLA / Deadline Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                Deadline Presets:
              </span>
              {ADD_DAY_PRESETS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setAddDaysInput(d)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    addDaysInput === d
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                  }`}
                >
                  +{d} Business Days
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="add-start" className="text-sm font-medium">
                  <Calendar className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  Start Date
                </Label>
                <DatePicker value={addStart} onChange={setAddStart} className="text-sm" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="add-days" className="text-sm font-medium">
                  <ArrowRight className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  Business Days to Add (or Negative to Subtract)
                </Label>
                <Input
                  id="add-days"
                  type="number"
                  value={addDaysInput}
                  onChange={(e) => setAddDaysInput(e.target.value)}
                  placeholder="e.g. 30 or -10"
                  className="text-sm"
                />
              </div>
            </div>

            {/* Holiday toggle */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                <Info className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                Exclusions
              </Label>
              <Select
                value={addHolidayOption}
                onValueChange={(v) => setAddHolidayOption(v as HolidayOption)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekends-holidays">
                    Exclude Weekends + All 11 US Federal Holidays (2025–2028+)
                  </SelectItem>
                  <SelectItem value="weekends-only">
                    Exclude Weekends Only
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {addError && (
              <div className="flex items-center gap-2 text-red-500 text-sm rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
                <Info className="h-4 w-4 shrink-0" />
                {addError}
              </div>
            )}
          </motion.div>
        )}

        {/* Count Mode Live Results */}
        {mode === 'count' && countResult && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="result-display mt-4"
            aria-live="polite"
          >
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 space-y-6">
              {/* Main result */}
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground font-medium">
                  Working Days From{' '}
                  {formatDateShort(new Date(countStart + 'T00:00:00'))} to{' '}
                  {formatDateShort(new Date(countEnd + 'T00:00:00'))}
                </p>
                <p className="text-5xl font-extrabold text-emerald-600" data-result-primary>
                  {countResult.businessDays} Business Days
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Equals <strong>{countResult.workHours8.toLocaleString()} standard work hours</strong> (at 8 hrs/day) ·{' '}
                  <strong>{countResult.workWeeks.toFixed(1)} workweeks</strong>
                </p>
              </div>

              {/* Breakdown badges */}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 text-xs sm:text-sm border-border/60 bg-background"
                >
                  <Calendar className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  {countResult.calendarDays} Total Calendar Days
                </Badge>
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 text-xs sm:text-sm border-border/60 bg-background"
                >
                  <CalendarDays className="inline h-3.5 w-3.5 mr-1.5 text-amber-500" />
                  {countResult.weekendDays} Weekend Days
                </Badge>
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 text-xs sm:text-sm border-border/60 bg-background"
                >
                  <Clock className="inline h-3.5 w-3.5 mr-1.5 text-red-500" />
                  {countResult.holidaysExcluded} Federal Holiday{countResult.holidaysExcluded !== 1 ? 's' : ''} Excluded
                </Badge>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-background border border-border/50 p-3.5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Business Days</p>
                  <p className="text-2xl font-bold text-emerald-600">{countResult.businessDays}</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-3.5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Weekend Days</p>
                  <p className="text-2xl font-bold text-amber-600">{countResult.weekendDays}</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-3.5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Federal Holidays</p>
                  <p className="text-2xl font-bold text-red-500">{countResult.holidaysExcluded}</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-3.5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Billable Hours (8h)</p>
                  <p className="text-2xl font-bold text-blue-600">{countResult.workHours8}</p>
                </div>
              </div>

              {/* Bar Chart Breakdown */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChartIcon className="h-4 w-4 text-primary" />
                  Working vs. Non-Working Days Breakdown
                </p>
                <div className="h-60 w-full rounded-xl bg-background border border-border/50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { name: 'Business Days', days: countResult.businessDays, fill: '#10b981' },
                        { name: 'Weekend Days', days: countResult.weekendDays, fill: '#f59e0b' },
                        { name: 'Holidays', days: countResult.holidaysExcluded, fill: '#ef4444' },
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#888888', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#888888', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <RechartsTooltip
                        formatter={(value: number) => [`${value} days`, 'Count']}
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                      />
                      <Bar dataKey="days" radius={[4, 4, 0, 0]}>
                        {[
                          { name: 'Business Days', days: countResult.businessDays, fill: '#10b981' },
                          { name: 'Weekend Days', days: countResult.weekendDays, fill: '#f59e0b' },
                          { name: 'Holidays', days: countResult.holidaysExcluded, fill: '#ef4444' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Holidays list */}
              {countResult.holidaysInRange.length > 0 && (
                <div className="rounded-xl bg-background border border-border/50 p-4">
                  <p className="text-sm font-semibold mb-2">
                    US Federal Holidays Excluded in This Period ({countResult.holidaysInRange.length}):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {countResult.holidaysInRange.map((h) => (
                      <div
                        key={`${h.name}-${h.dateStr}`}
                        className="text-xs sm:text-sm text-muted-foreground flex items-center justify-between rounded-lg bg-muted/30 px-3 py-1.5 border border-border/40"
                      >
                        <span className="flex items-center gap-2 font-medium text-foreground">
                          <span className="size-1.5 rounded-full bg-red-500 shrink-0" />
                          {h.name}
                        </span>
                        <span className="text-xs text-muted-foreground">{h.dateStr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Add/Subtract Mode Live Results */}
        {mode === 'add' && addResult && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="result-display mt-4"
            aria-live="polite"
          >
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 space-y-6">
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground font-medium">
                  {parseInt(addDaysInput, 10) > 0 ? 'Adding' : 'Subtracting'}{' '}
                  {Math.abs(parseInt(addDaysInput, 10))} Business Day
                  {Math.abs(parseInt(addDaysInput, 10)) !== 1 ? 's' : ''} From{' '}
                  {formatDateShort(new Date(addStart + 'T00:00:00'))}
                </p>
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600" data-result-primary>
                  {formatDateLong(addResult.resultDate)}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-background border border-border/50 p-3.5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Calendar Days Span</p>
                  <p className="text-2xl font-bold">{addResult.daysSkipped}</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-3.5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Weekends Skipped</p>
                  <p className="text-2xl font-bold text-amber-600">{addResult.weekendDaysSkipped}</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-3.5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Holidays Skipped</p>
                  <p className="text-2xl font-bold text-red-500">{addResult.holidaysSkipped}</p>
                </div>
              </div>

              {addResult.holidaysSkippedNames.length > 0 && (
                <div className="rounded-xl bg-background border border-border/50 p-4">
                  <p className="text-sm font-semibold mb-2">
                    US Federal Holidays Skipped Along the Way:
                  </p>
                  <ul className="space-y-1">
                    {addResult.holidaysSkippedNames.map((name) => (
                      <li
                        key={name}
                        className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span className="size-1.5 rounded-full bg-red-500 shrink-0" />
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
