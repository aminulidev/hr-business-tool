'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Coffee,
  Clock,
  Info,
  AlertCircle,
  BarChart as BarChartIcon,
  Copy,
} from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TryExample from './TryExample';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { parseTimeToMinutes, TIME_FORMAT_EXAMPLES } from '@/lib/time-utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

type LunchMode = 'auto' | 'manual';

interface DayEntry {
  enabled: boolean;
  clockIn: string;
  lunchStart: string;
  lunchEnd: string;
  clockOut: string;
}

interface DayResult {
  day: string;
  enabled: boolean;
  clockIn: string;
  lunchStart: string;
  lunchEnd: string;
  clockOut: string;
  hoursBeforeLunch: number;
  hoursAfterLunch: number;
  lunchDuration: number;
  totalHours: number;
}

interface TimeCardResult {
  days: DayResult[];
  totalRegularHours: number;
  totalOvertimeHours: number;
  totalHours: number;
  overtimeThreshold: number;
  weeklyDecimal: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function minutesToDecimal(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}

function minutesToTimeStr(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function createEmptyDay(): DayEntry {
  return {
    enabled: true,
    clockIn: '09:00 AM',
    lunchStart: '12:00 PM',
    lunchEnd: '01:00 PM',
    clockOut: '05:00 PM',
  };
}

const DEFAULT_DAYS: DayEntry[] = [
  createEmptyDay(),
  createEmptyDay(),
  createEmptyDay(),
  createEmptyDay(),
  createEmptyDay(),
  { enabled: false, clockIn: '', lunchStart: '', lunchEnd: '', clockOut: '' },
  { enabled: false, clockIn: '', lunchStart: '', lunchEnd: '', clockOut: '' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TimeCardLunchCalculator() {
  const [days, setDays] = useState<DayEntry[]>(DEFAULT_DAYS);
  const [lunchMode, setLunchMode] = useState<LunchMode>('manual');
  const [autoLunchDuration, setAutoLunchDuration] = useState('60');
  const [overtimeThreshold, setOvertimeThreshold] = useState('40');
  const [result, setResult] = useState<TimeCardResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateDay = (idx: number, field: keyof DayEntry, value: string | boolean) => {
    setDays((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d))
    );
    setResult(null);
  };

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    const otThresh = parseFloat(overtimeThreshold);
    if (isNaN(otThresh) || otThresh <= 0) {
      setError('Please enter a valid overtime threshold greater than zero.');
      return;
    }

    const autoDur = parseFloat(autoLunchDuration);
    if (lunchMode === 'auto' && (isNaN(autoDur) || autoDur < 0)) {
      setError('Please enter a valid lunch duration.');
      return;
    }

    const dayResults: DayResult[] = [];
    let totalMinutes = 0;

    for (let i = 0; i < days.length; i++) {
      const day = days[i];

      if (!day.enabled) {
        dayResults.push({
          day: DAYS[i],
          enabled: false,
          clockIn: '',
          lunchStart: '',
          lunchEnd: '',
          clockOut: '',
          hoursBeforeLunch: 0,
          hoursAfterLunch: 0,
          lunchDuration: 0,
          totalHours: 0,
        });
        continue;
      }

      if (!day.clockIn || !day.clockOut) {
        setError(`Please enter clock-in and clock-out times for ${DAYS[i]}.`);
        return;
      }

      const clockInMin = parseTimeToMinutes(day.clockIn);
      const clockOutMin = parseTimeToMinutes(day.clockOut);

      if (clockInMin < 0) {
        setError(`Invalid clock-in time for ${DAYS[i]}. Try formats like ${TIME_FORMAT_EXAMPLES}`);
        return;
      }
      if (clockOutMin < 0) {
        setError(`Invalid clock-out time for ${DAYS[i]}. Try formats like ${TIME_FORMAT_EXAMPLES}`);
        return;
      }

      if (clockOutMin <= clockInMin) {
        setError(
          `Clock-out time must be after clock-in time for ${DAYS[i]}.`
        );
        return;
      }

      let lunchMin = 0;
      let hoursBefore = 0;
      let hoursAfter = 0;

      if (lunchMode === 'manual') {
        if (!day.lunchStart || !day.lunchEnd) {
          setError(
            `Please enter lunch start and end times for ${DAYS[i]} (or switch to auto-deduct mode).`
          );
          return;
        }
        const lunchStartMin = parseTimeToMinutes(day.lunchStart);
        const lunchEndMin = parseTimeToMinutes(day.lunchEnd);

        if (lunchStartMin < 0) {
          setError(`Invalid lunch out time for ${DAYS[i]}. Try formats like ${TIME_FORMAT_EXAMPLES}`);
          return;
        }
        if (lunchEndMin < 0) {
          setError(`Invalid lunch in time for ${DAYS[i]}. Try formats like ${TIME_FORMAT_EXAMPLES}`);
          return;
        }

        if (lunchEndMin <= lunchStartMin) {
          setError(
            `Lunch end must be after lunch start for ${DAYS[i]}.`
          );
          return;
        }
        if (lunchStartMin < clockInMin || lunchEndMin > clockOutMin) {
          setError(
            `Lunch times must be within clock-in and clock-out times for ${DAYS[i]}.`
          );
          return;
        }

        lunchMin = lunchEndMin - lunchStartMin;
        hoursBefore = lunchStartMin - clockInMin;
        hoursAfter = clockOutMin - lunchEndMin;
      } else {
        // Auto-deduct: subtract lunch from the middle of the shift
        lunchMin = autoDur || 0;
        const totalShiftMin = clockOutMin - clockInMin;
        if (totalShiftMin <= lunchMin) {
          setError(
            `Total shift time for ${DAYS[i]} is less than or equal to the lunch duration.`
          );
          return;
        }
        const effectiveMin = totalShiftMin - lunchMin;
        const half = lunchMin / 2;
        hoursBefore = totalShiftMin / 2 - half;
        hoursAfter = totalShiftMin / 2 - half;
      }

      const totalDayMin = hoursBefore + hoursAfter;
      totalMinutes += totalDayMin;

      dayResults.push({
        day: DAYS[i],
        enabled: true,
        clockIn: day.clockIn,
        lunchStart: lunchMode === 'manual' ? day.lunchStart : '',
        lunchEnd: lunchMode === 'manual' ? day.lunchEnd : '',
        clockOut: day.clockOut,
        hoursBeforeLunch: minutesToDecimal(hoursBefore),
        hoursAfterLunch: minutesToDecimal(hoursAfter),
        lunchDuration: minutesToDecimal(lunchMin),
        totalHours: minutesToDecimal(totalDayMin),
      });
    }

    const totalHours = minutesToDecimal(totalMinutes);
    const totalRegularHours = Math.min(totalHours, otThresh);
    const totalOvertimeHours = Math.max(totalHours - otThresh, 0);

    setResult({
      days: dayResults,
      totalRegularHours,
      totalOvertimeHours,
      totalHours,
      overtimeThreshold: otThresh,
      weeklyDecimal: totalHours,
    });
  };

  const handleReset = () => {
    setDays(DEFAULT_DAYS);
    setLunchMode('manual');
    setAutoLunchDuration('60');
    setOvertimeThreshold('40');
    setResult(null);
    setError(null);
  };

  // Copy first enabled day's times to all other enabled days
  const copyMonToAll = () => {
    const firstEnabled = days.find((d) => d.enabled);
    if (!firstEnabled) return;
    setDays((prev) =>
      prev.map((d, i) => {
        if (!d.enabled) return d;
        if (d === firstEnabled) return d;
        return {
          ...d,
          clockIn: firstEnabled.clockIn,
          lunchStart: firstEnabled.lunchStart,
          lunchEnd: firstEnabled.lunchEnd,
          clockOut: firstEnabled.clockOut,
        };
      })
    );
    setResult(null);
  };

  // Try Example: standard 9-5 weekday with 1-hour lunch
  const handleTryExample = () => {
    setDays([
      { enabled: true, clockIn: '09:00', lunchStart: '12:00', lunchEnd: '13:00', clockOut: '17:30' },
      { enabled: true, clockIn: '09:00', lunchStart: '12:00', lunchEnd: '13:00', clockOut: '17:30' },
      { enabled: true, clockIn: '09:00', lunchStart: '12:00', lunchEnd: '13:00', clockOut: '17:30' },
      { enabled: true, clockIn: '09:00', lunchStart: '12:00', lunchEnd: '13:00', clockOut: '17:30' },
      { enabled: true, clockIn: '09:00', lunchStart: '12:00', lunchEnd: '13:00', clockOut: '17:30' },
      { enabled: false, clockIn: '', lunchStart: '', lunchEnd: '', clockOut: '' },
      { enabled: false, clockIn: '', lunchStart: '', lunchEnd: '', clockOut: '' },
    ]);
    setLunchMode('manual');
    setAutoLunchDuration('60');
    setOvertimeThreshold('40');
    setResult(null);
    setError(null);
  };

  // ------ Render ------

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Lunch Mode */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            <Coffee className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Lunch Break Mode
          </Label>
          <Select
            value={lunchMode}
            onValueChange={(v) => {
              setLunchMode(v as LunchMode);
              setResult(null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">
                Manual — Enter lunch start/end times
              </SelectItem>
              <SelectItem value="auto">
                Auto-Deduct — Subtract fixed duration
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Auto Lunch Duration */}
        {lunchMode === 'auto' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="autoLunch" className="text-sm font-medium">
              Auto-Deduct Lunch Duration (minutes)
            </Label>
            <Select value={autoLunchDuration} onValueChange={setAutoLunchDuration}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes (1 hour)</SelectItem>
                <SelectItem value="90">90 minutes (1.5 hours)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This duration will be deducted from each workday automatically
            </p>
          </motion.div>
        )}

        {/* Overtime Threshold */}
        <div className="space-y-2">
          <Label htmlFor="otThresh" className="text-sm font-medium">
            <AlertCircle className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Weekly Overtime Threshold (hours)
          </Label>
          <Input
            id="otThresh"
            type="number"
            min="0"
            step="1"
            value={overtimeThreshold}
            onChange={(e) => setOvertimeThreshold(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Federal default: 40 hours/week
          </p>
        </div>

        {/* Daily Entries */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Daily Time Entries
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={copyMonToAll}
              className="gap-1.5 text-xs"
              title="Copy first day's times to all other enabled days"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy to All
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Accepts: {TIME_FORMAT_EXAMPLES}
          </p>

          {/* Header row (desktop) */}
          <div className="hidden sm:grid grid-cols-6 gap-2 text-xs text-muted-foreground font-medium px-1">
            <span>Day</span>
            <span>Clock In</span>
            {lunchMode === 'manual' && <span>Lunch Out</span>}
            {lunchMode === 'manual' && <span>Lunch In</span>}
            <span>Clock Out</span>
            <span className="text-right">On/Off</span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {days.map((day, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className={`rounded-lg border p-3 space-y-2 transition-colors ${
                  day.enabled
                    ? 'border-border/50 bg-background'
                    : 'border-border/20 bg-muted/20 opacity-60'
                }`}
              >
                {/* Mobile label */}
                <div className="sm:hidden flex items-center justify-between">
                  <span className="text-sm font-medium">{DAYS[idx]}</span>
                  <button
                    type="button"
                    onClick={() => updateDay(idx, 'enabled', !day.enabled)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
                      day.enabled
                        ? 'bg-emerald-500'
                        : 'bg-input border border-border'
                    }`}
                    role="switch"
                    aria-checked={day.enabled}
                  >
                    <span
                      className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        day.enabled ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div
                  className={`grid gap-2 ${
                    lunchMode === 'manual'
                      ? 'grid-cols-3 sm:grid-cols-6'
                      : 'grid-cols-2 sm:grid-cols-4'
                  }`}
                >
                  {/* Day label (desktop) */}
                  <div className="hidden sm:flex items-center">
                    <span className="text-sm font-medium">{DAYS[idx]}</span>
                  </div>

                  {/* Clock In */}
                  <div className="space-y-1">
                    <Label
                      htmlFor={`in-${idx}`}
                      className="sm:hidden text-xs font-medium"
                    >
                      Clock In
                    </Label>
                    <Input
                      id={`in-${idx}`}
                      type="text"
                      placeholder="9:00 AM"
                      value={day.enabled ? day.clockIn : ''}
                      disabled={!day.enabled}
                      onChange={(e) =>
                        updateDay(idx, 'clockIn', e.target.value)
                      }
                      className="text-sm"
                    />
                  </div>

                  {/* Lunch Start (manual) */}
                  {lunchMode === 'manual' && (
                    <div className="space-y-1">
                      <Label
                        htmlFor={`ls-${idx}`}
                        className="sm:hidden text-xs font-medium"
                      >
                        Lunch Out
                      </Label>
                      <Input
                        id={`ls-${idx}`}
                        type="text"
                        placeholder="12:00 PM"
                        value={day.enabled ? day.lunchStart : ''}
                        disabled={!day.enabled}
                        onChange={(e) =>
                          updateDay(idx, 'lunchStart', e.target.value)
                        }
                        className="text-sm"
                      />
                    </div>
                  )}

                  {/* Lunch End (manual) */}
                  {lunchMode === 'manual' && (
                    <div className="space-y-1">
                      <Label
                        htmlFor={`le-${idx}`}
                        className="sm:hidden text-xs font-medium"
                      >
                        Lunch In
                      </Label>
                      <Input
                        id={`le-${idx}`}
                        type="text"
                        placeholder="1:00 PM"
                        value={day.enabled ? day.lunchEnd : ''}
                        disabled={!day.enabled}
                        onChange={(e) =>
                          updateDay(idx, 'lunchEnd', e.target.value)
                        }
                        className="text-sm"
                      />
                    </div>
                  )}

                  {/* Clock Out */}
                  <div className="space-y-1">
                    <Label
                      htmlFor={`out-${idx}`}
                      className="sm:hidden text-xs font-medium"
                    >
                      Clock Out
                    </Label>
                    <Input
                      id={`out-${idx}`}
                      type="text"
                      placeholder="5:00 PM"
                      value={day.enabled ? day.clockOut : ''}
                      disabled={!day.enabled}
                      onChange={(e) =>
                        updateDay(idx, 'clockOut', e.target.value)
                      }
                      className="text-sm"
                    />
                  </div>

                  {/* Toggle (desktop) */}
                  <div className="hidden sm:flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        updateDay(idx, 'enabled', !day.enabled)
                      }
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
                        day.enabled
                          ? 'bg-emerald-500'
                          : 'bg-input border border-border'
                      }`}
                      role="switch"
                      aria-checked={day.enabled}
                    >
                      <span
                        className={`pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          day.enabled ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex gap-3">
            <TryExample onClick={handleTryExample} />
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="shrink-0"
            >
              Reset
            </Button>
          </div>
          <Button
            onClick={handleCalculate}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            <Clock className="h-4 w-4 mr-2" />
            Calculate Hours
          </Button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 px-4 sm:px-6"
          aria-live="polite"
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            {/* Main Result */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Total Weekly Hours
              </p>
              <p className="text-4xl font-bold text-emerald-600">
                {result.totalHours.toFixed(2)} hrs
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 px-3 py-1 text-xs font-medium"
                >
                  {result.totalRegularHours.toFixed(2)} regular
                </Badge>
                {result.totalOvertimeHours > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 border-amber-500/30 text-amber-600 px-3 py-1 text-xs font-medium"
                  >
                    {result.totalOvertimeHours.toFixed(2)} overtime
                  </Badge>
                )}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Total Hours',
                  value: `${result.totalHours.toFixed(2)} hrs`,
                  color: 'text-emerald-600',
                },
                {
                  label: 'Regular Hours',
                  value: `${result.totalRegularHours.toFixed(2)} hrs`,
                  color: 'text-blue-600',
                },
                {
                  label: 'Overtime Hours',
                  value: `${result.totalOvertimeHours.toFixed(2)} hrs`,
                  color: result.totalOvertimeHours > 0 ? 'text-amber-600' : 'text-muted-foreground',
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="rounded-xl bg-background border border-border/50 p-3 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <p className={`text-base sm:text-lg font-bold ${item.color}`}>
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Daily Hours Bar Chart */}
            {result.days.some((d) => d.enabled) && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChartIcon className="h-4.5 w-4.5 text-primary" />
                  Hours Worked Per Day
                </p>
                <div className="h-64 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={result.days.filter((d) => d.enabled)}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis
                        dataKey="day"
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
                        formatter={(value: number) => [`${value.toFixed(2)} hrs`, 'Hours Worked']}
                        labelStyle={{ color: '#888888' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="totalHours" radius={[4, 4, 0, 0]} fill="#10b981" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Daily Breakdown Table */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Daily Breakdown
              </p>
              <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs">
                          Day
                        </th>
                        {lunchMode === 'manual' && (
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Before Lunch
                          </th>
                        )}
                        {lunchMode === 'manual' && (
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            After Lunch
                          </th>
                        )}
                        <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                          Lunch
                        </th>
                        <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {result.days.map((d, idx) => (
                        <tr
                          key={idx}
                          className={
                            d.enabled ? '' : 'opacity-40 text-muted-foreground'
                          }
                        >
                          <td className="px-3 py-2 font-medium">
                            {d.day}
                            {!d.enabled && (
                              <span className="ml-1 text-xs">(off)</span>
                            )}
                          </td>
                          {lunchMode === 'manual' && (
                            <td className="text-right px-3 py-2">
                              {d.enabled ? d.hoursBeforeLunch.toFixed(2) : '—'}
                            </td>
                          )}
                          {lunchMode === 'manual' && (
                            <td className="text-right px-3 py-2">
                              {d.enabled ? d.hoursAfterLunch.toFixed(2) : '—'}
                            </td>
                          )}
                          <td className="text-right px-3 py-2 text-amber-600">
                            {d.enabled
                              ? `−${d.lunchDuration.toFixed(2)}`
                              : '—'}
                          </td>
                          <td className="text-right px-3 py-2 font-semibold">
                            {d.enabled ? d.totalHours.toFixed(2) : '—'}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-500/5 font-bold">
                        <td className="px-3 py-2.5" colSpan={lunchMode === 'manual' ? 4 : 2}>
                          Weekly Total
                        </td>
                        <td className="text-right px-3 py-2.5 text-emerald-600">
                          {result.totalHours.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                <strong>Note:</strong> Hours are displayed in decimal format
                (e.g., 7.50 = 7 hours 30 minutes) which is standard for payroll
                processing. Overtime is calculated for hours exceeding{' '}
                {result.overtimeThreshold} per week. Federal FLSA requires overtime
                pay at 1.5x the regular rate for non-exempt employees. State laws
                may have additional daily overtime requirements.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
