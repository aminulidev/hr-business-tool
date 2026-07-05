'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ArrowRight, Calendar, Info, BarChart as BarChartIcon } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import TryExample from './TryExample';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ---------------------------------------------------------------------------
// US Federal Holidays 2025
// ---------------------------------------------------------------------------

const US_HOLIDAYS_2025: { date: Date; name: string }[] = [
  { date: new Date(2025, 0, 1), name: "New Year's Day" },
  { date: new Date(2025, 0, 20), name: 'MLK Jr. Day' },
  { date: new Date(2025, 1, 17), name: "Presidents' Day" },
  { date: new Date(2025, 4, 26), name: 'Memorial Day' },
  { date: new Date(2025, 5, 19), name: 'Juneteenth' },
  { date: new Date(2025, 6, 4), name: 'Independence Day' },
  { date: new Date(2025, 8, 1), name: 'Labor Day' },
  { date: new Date(2025, 9, 13), name: 'Columbus Day' },
  { date: new Date(2025, 10, 11), name: "Veterans Day" },
  { date: new Date(2025, 10, 27), name: 'Thanksgiving' },
  { date: new Date(2025, 11, 25), name: 'Christmas' },
];

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

function isHoliday(d: Date, holidays: Date[]): boolean {
  return holidays.some((h) => sameDay(d, h));
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

function addDays(d: Date, n: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
}

// ---------------------------------------------------------------------------
// Calculation functions
// ---------------------------------------------------------------------------

interface CountResult {
  businessDays: number;
  calendarDays: number;
  weekendDays: number;
  holidaysExcluded: number;
  holidaysInRange: string[];
}

function countBusinessDays(
  start: Date,
  end: Date,
  excludeHolidays: boolean
): CountResult {
  const holidays = excludeHolidays
    ? US_HOLIDAYS_2025.map((h) => h.date)
    : [];
  const holidayNames = US_HOLIDAYS_2025;

  let businessDays = 0;
  let weekendDays = 0;
  let holidaysExcluded = 0;
  const holidaysInRange: string[] = [];

  const current = new Date(start);
  current.setHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    if (isWeekend(current)) {
      weekendDays++;
    } else if (isHoliday(current, holidays)) {
      holidaysExcluded++;
      const holiday = holidayNames.find((h) => sameDay(h.date, current));
      if (holiday) holidaysInRange.push(holiday.name);
    } else {
      businessDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  const calendarDays =
    Math.round(endDate.getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24) +
    1;

  return {
    businessDays,
    calendarDays,
    weekendDays,
    holidaysExcluded,
    holidaysInRange,
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
  const holidays = excludeHolidays
    ? US_HOLIDAYS_2025.map((h) => h.date)
    : [];
  const holidayNames = US_HOLIDAYS_2025;

  let remaining = Math.abs(daysToAdd);
  const direction = daysToAdd >= 0 ? 1 : -1;
  let current = new Date(start);
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
    } else if (isHoliday(current, holidays)) {
      holidaysSkipped++;
      const holiday = holidayNames.find((h) => sameDay(h.date, current));
      if (holiday) holidaysSkippedNames.push(holiday.name);
    } else {
      remaining--;
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

export default function BusinessDayCalculator() {
  const [mode, setMode] = useState<Mode>('count');

  // Count mode state
  const [countStart, setCountStart] = useState('2025-01-06');
  const [countEnd, setCountEnd] = useState('2025-03-28');
  const [countHolidayOption, setCountHolidayOption] =
    useState<HolidayOption>('weekends-holidays');
  const [countResult, setCountResult] = useState<CountResult | null>(null);

  // Add mode state
  const [addStart, setAddStart] = useState('2025-01-01');
  const [addDays, setAddDays] = useState('30');
  const [addHolidayOption, setAddHolidayOption] =
    useState<HolidayOption>('weekends-holidays');
  const [addResult, setAddResult] = useState<AddResult | null>(null);

  // Shared
  const [error, setError] = useState<string | null>(null);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<any>('business-day-calculator');

  const handleTryExample = () => {
    setCountStart('2025-01-01');
    setCountEnd('2025-01-31');
    setAddStart('2025-01-01');
    setAddDays('10');
  };

  const handleCount = () => {
    setError(null);
    setCountResult(null);

    if (!countStart || !countEnd) {
      setError('Please select both a start and end date.');
      return;
    }

    const start = new Date(countStart + 'T00:00:00');
    const end = new Date(countEnd + 'T00:00:00');

    if (end < start) {
      setError('End date must be on or after the start date.');
      return;
    }

    const result = countBusinessDays(
      start,
      end,
      countHolidayOption === 'weekends-holidays'
    );
    setCountResult(result);
    saveEntry({ mode: "count", inputs: { countStart, countEnd, countHolidayOption } }, `${result.businessDays} days`);
  };

  const handleAdd = () => {
    setError(null);
    setAddResult(null);

    if (!addStart) {
      setError('Please select a start date.');
      return;
    }

    const days = parseInt(addDays, 10);
    if (isNaN(days) || days === 0) {
      setError('Please enter a non-zero number of business days.');
      return;
    }

    if (Math.abs(days) > 10000) {
      setError('Please enter a number of business days between -10,000 and 10,000.');
      return;
    }

    const start = new Date(addStart + 'T00:00:00');
    const result = addBusinessDays(
      start,
      days,
      addHolidayOption === 'weekends-holidays'
    );
    setAddResult(result);
    saveEntry({ mode: "add", inputs: { addStart, addDays, addHolidayOption } }, `${result.resultDate.toLocaleDateString()} (Added ${addDays} days)`);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* ================================================================= */}
        {/* Mode Toggle                                                       */}
        {/* ================================================================= */}
        <div className="flex rounded-xl bg-muted/50 p-1 border border-border/50">
          <button
            type="button"
            onClick={() => {
              setMode('count');
              setError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              mode === 'count'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            Count Days Between
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('add');
              setError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              mode === 'add'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowRight className="h-4 w-4" />
            Add / Subtract Days
          </button>
        </div>

        {/* ================================================================= */}
        {/* Mode 1: Count Business Days Between Two Dates                      */}
        {/* ================================================================= */}
        {mode === 'count' && (
          <motion.div
            key="count"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* Date inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="count-start" className="text-sm font-medium">
                  <Calendar className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  Start Date
                </Label>
                <DatePicker value={countStart} onChange={setCountStart} className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="count-end" className="text-sm font-medium">
                  <Calendar className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  End Date
                </Label>
                <DatePicker value={countEnd} onChange={setCountEnd} className="text-sm" />
              </div>
            </div>

            {/* Holiday toggle */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                <Info className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                Exclusions
              </Label>
              <Select
                value={countHolidayOption}
                onValueChange={(v) => setCountHolidayOption(v as HolidayOption)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekends-only">
                    Exclude weekends only
                  </SelectItem>
                  <SelectItem value="weekends-holidays">
                    Exclude weekends + US federal holidays (2025)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-500 text-sm rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3"
              >
                <Info className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Calculate */}
            <Button
              onClick={handleCount}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
              size="lg"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Calculate Business Days
            </Button>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* Mode 2: Add/Subtract Business Days                                */}
        {/* ================================================================= */}
        {mode === 'add' && (
          <motion.div
            key="add"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {/* Start date */}
            <div className="space-y-1.5">
              <Label htmlFor="add-start" className="text-sm font-medium">
                <Calendar className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                Start Date
              </Label>
              <DatePicker value={addStart} onChange={setAddStart} className="text-sm" />
            </div>

            {/* Days to add */}
            <div className="space-y-1.5">
              <Label htmlFor="add-days" className="text-sm font-medium">
                <ArrowRight className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                Business Days to Add
              </Label>
              <Input
                id="add-days"
                type="number"
                value={addDays}
                onChange={(e) => setAddDays(e.target.value)}
                placeholder="e.g. 30 (positive) or -10 (negative)"
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use a positive number to add days, or a negative number to subtract.
              </p>
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
                  <SelectItem value="weekends-only">
                    Exclude weekends only
                  </SelectItem>
                  <SelectItem value="weekends-holidays">
                    Exclude weekends + US federal holidays (2025)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-500 text-sm rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3"
              >
                <Info className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Calculate */}
            <Button
              onClick={handleAdd}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
              size="lg"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Calculate Result Date
            </Button>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* Count Mode Results                                                */}
        {/* ================================================================= */}
        {mode === 'count' && countResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="result-display mt-6" aria-live="polite"
          >
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              {/* Main result */}
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground font-medium">
                  Business Days Between{' '}
                  {formatDateShort(new Date(countStart + 'T00:00:00'))} and{' '}
                  {formatDateShort(new Date(countEnd + 'T00:00:00'))}
                </p>
                <p className="text-5xl font-bold text-emerald-600">
                  {countResult.businessDays}
                </p>
                <p className="text-sm text-muted-foreground">business days</p>
              </div>

              {/* Breakdown badges */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 text-sm border-border/60 bg-background/50"
                >
                  <Calendar className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  {countResult.calendarDays} calendar days
                </Badge>
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 text-sm border-border/60 bg-background/50"
                >
                  <CalendarDays className="inline h-3.5 w-3.5 mr-1.5 text-amber-500" />
                  {countResult.weekendDays} weekend days
                </Badge>
                {countResult.holidaysExcluded > 0 && (
                  <Badge
                    variant="outline"
                    className="px-3 py-1.5 text-sm border-border/60 bg-background/50"
                  >
                    <Info className="inline h-3.5 w-3.5 mr-1.5 text-red-500" />
                    {countResult.holidaysExcluded} holiday
                    {countResult.holidaysExcluded !== 1 ? 's' : ''} excluded
                  </Badge>
                )}
              </div>

              {/* Visual breakdown */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Business Days
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {countResult.businessDays}
                  </p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Weekend Days
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {countResult.weekendDays}
                  </p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Holidays Out
                  </p>
                  <p className="text-2xl font-bold text-red-500">
                    {countResult.holidaysExcluded}
                  </p>
                </div>
              </div>

              {/* Bar Chart Breakdown */}
              <div className="space-y-3 mt-6">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChartIcon className="h-4.5 w-4.5 text-primary" />
                  Working vs Non-Working Days
                </p>
                <div className="h-64 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { name: 'Business Days', days: countResult.businessDays, fill: '#10b981' },
                        { name: 'Weekend Days', days: countResult.weekendDays, fill: '#f59e0b' },
                        { name: 'Holidays', days: countResult.holidaysExcluded, fill: '#ef4444' },
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
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
                        labelStyle={{ color: '#888888' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
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
                  <p className="text-sm font-medium mb-2">
                    US Federal Holidays in this range:
                  </p>
                  <ul className="space-y-1">
                    {countResult.holidaysInRange.map((name) => (
                      <li
                        key={name}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span className="size-1.5 rounded-full bg-red-400 shrink-0" />
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ================================================================= */}
        {/* Add/Subtract Mode Results                                         */}
        {/* ================================================================= */}
        {mode === 'add' && addResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="result-display mt-6" aria-live="polite"
          >
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              {/* Main result */}
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground font-medium">
                  {parseInt(addDays, 10) > 0 ? 'Adding' : 'Subtracting'}{' '}
                  {Math.abs(parseInt(addDays, 10))} business day
                  {Math.abs(parseInt(addDays, 10)) !== 1 ? 's' : ''} from{' '}
                  {formatDateShort(new Date(addStart + 'T00:00:00'))}
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-emerald-600">
                  {formatDateLong(addResult.resultDate)}
                </p>
                <p className="text-sm text-muted-foreground">
                  ({formatDateShort(addResult.resultDate)})
                </p>
              </div>

              {/* Breakdown badges */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 text-sm border-border/60 bg-background/50"
                >
                  <Calendar className="inline h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  {addResult.daysSkipped} calendar days traversed
                </Badge>
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 text-sm border-border/60 bg-background/50"
                >
                  <CalendarDays className="inline h-3.5 w-3.5 mr-1.5 text-amber-500" />
                  {addResult.weekendDaysSkipped} weekend days skipped
                </Badge>
                {addResult.holidaysSkipped > 0 && (
                  <Badge
                    variant="outline"
                    className="px-3 py-1.5 text-sm border-border/60 bg-background/50"
                  >
                    <Info className="inline h-3.5 w-3.5 mr-1.5 text-red-500" />
                    {addResult.holidaysSkipped} holiday
                    {addResult.holidaysSkipped !== 1 ? 's' : ''} skipped
                  </Badge>
                )}
              </div>

              {/* Visual breakdown */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Calendar Days
                  </p>
                  <p className="text-2xl font-bold">
                    {addResult.daysSkipped}
                  </p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Weekends Skipped
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {addResult.weekendDaysSkipped}
                  </p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Holidays Skipped
                  </p>
                  <p className="text-2xl font-bold text-red-500">
                    {addResult.holidaysSkipped}
                  </p>
                </div>
              </div>

              {/* Bar Chart Breakdown */}
              <div className="space-y-3 mt-6">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChartIcon className="h-4.5 w-4.5 text-primary" />
                  Calendar vs Skipped Days
                </p>
                <div className="h-64 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { name: 'Calendar Days', days: addResult.daysSkipped, fill: '#10b981' },
                        { name: 'Weekends Skipped', days: addResult.weekendDaysSkipped, fill: '#f59e0b' },
                        { name: 'Holidays Skipped', days: addResult.holidaysSkipped, fill: '#ef4444' },
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
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
                        labelStyle={{ color: '#888888' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="days" radius={[4, 4, 0, 0]}>
                        {[
                          { name: 'Calendar Days', days: addResult.daysSkipped, fill: '#10b981' },
                          { name: 'Weekends Skipped', days: addResult.weekendDaysSkipped, fill: '#f59e0b' },
                          { name: 'Holidays Skipped', days: addResult.holidaysSkipped, fill: '#ef4444' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Holidays list */}
              {addResult.holidaysSkippedNames.length > 0 && (
                <div className="rounded-xl bg-background border border-border/50 p-4">
                  <p className="text-sm font-medium mb-2">
                    Holidays encountered during calculation:
                  </p>
                  <ul className="space-y-1">
                    {addResult.holidaysSkippedNames.map((name) => (
                      <li
                        key={name}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span className="size-1.5 rounded-full bg-red-400 shrink-0" />
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
