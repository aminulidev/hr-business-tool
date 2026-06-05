'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Trash2, DollarSign, Timer, AlertCircle, BarChart as BarChartIcon } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WorkDay {
  id: string;
  label: string;
  clockIn: string;
  clockOut: string;
  lunchBreak: string;
}

interface TimeCardResult {
  days: {
    label: string;
    clockIn: string;
    clockOut: string;
    lunchBreak: number;
    totalHours: number;
    decimalHours: number;
  }[];
  totalRegularHours: number;
  totalOvertimeHours: number;
  totalDecimalHours: number;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
  hourlyRate: number;
  overtimeThreshold: number;
  overtimeMultiplier: number;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return -1;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return -1;
  return hours * 60 + minutes;
}

function minutesToDecimal(totalMinutes: number): number {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return parseFloat((hours + mins / 60).toFixed(2));
}

function formatDecimalHours(decimal: number): string {
  return decimal.toFixed(2);
}

function formatHHMM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m}m`;
}

const defaultDays: WorkDay[] = DAY_LABELS.slice(0, 5).map((label) => ({
  id: generateId(),
  label,
  clockIn: '09:00',
  clockOut: '17:00',
  lunchBreak: '30',
}));

export default function TimeCardCalculator() {
  const [days, setDays] = useState<WorkDay[]>(defaultDays);
  const [hourlyRate, setHourlyRate] = useState('');
  const [overtimeThreshold, setOvertimeThreshold] = useState('40');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState('1.5');
  const [result, setResult] = useState<TimeCardResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addDay = useCallback(() => {
    const dayIndex = days.length % 7;
    const label = DAY_LABELS[dayIndex];
    setDays((prev) => [
      ...prev,
      {
        id: generateId(),
        label: prev.length < 7 ? label : `Day ${prev.length + 1}`,
        clockIn: '09:00',
        clockOut: '17:00',
        lunchBreak: '30',
      },
    ]);
  }, [days.length]);

  const removeDay = useCallback((id: string) => {
    setDays((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((d) => d.id !== id);
    });
  }, []);

  const updateDay = useCallback((id: string, field: keyof WorkDay, value: string) => {
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  }, []);

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    const rate = parseFloat(hourlyRate) || 0;
    const threshold = parseFloat(overtimeThreshold) || 40;
    const multiplier = parseFloat(overtimeMultiplier) || 1.5;

    const parsedDays: TimeCardResult['days'] = [];
    let totalHours = 0;

    for (const day of days) {
      const inMinutes = parseTimeToMinutes(day.clockIn);
      const outMinutes = parseTimeToMinutes(day.clockOut);
      const lunchMinutes = parseFloat(day.lunchBreak) || 0;

      if (inMinutes < 0) {
        setError(`Invalid clock-in time for ${day.label}. Use HH:MM format (e.g., 09:00).`);
        return;
      }
      if (outMinutes < 0) {
        setError(`Invalid clock-out time for ${day.label}. Use HH:MM format (e.g., 17:00).`);
        return;
      }
      if (outMinutes <= inMinutes) {
        setError(`Clock-out must be after clock-in for ${day.label}.`);
        return;
      }

      const workedMinutes = outMinutes - inMinutes - lunchMinutes;
      if (workedMinutes < 0) {
        setError(`Lunch break exceeds total work time for ${day.label}.`);
        return;
      }

      const totalMins = workedMinutes;
      const decimalHours = minutesToDecimal(totalMins);
      const displayHours = totalMins / 60;

      parsedDays.push({
        label: day.label,
        clockIn: day.clockIn,
        clockOut: day.clockOut,
        lunchBreak: lunchMinutes,
        totalHours: displayHours,
        decimalHours,
      });

      totalHours += displayHours;
    }

    const regularHours = Math.min(totalHours, threshold);
    const overtimeHours = Math.max(totalHours - threshold, 0);

    const regularPay = rate * regularHours;
    const overtimePay = rate * overtimeHours * multiplier;
    const totalPay = regularPay + overtimePay;

    setResult({
      days: parsedDays,
      totalRegularHours: regularHours,
      totalOvertimeHours: overtimeHours,
      totalDecimalHours: minutesToDecimal(Math.round(totalHours * 60)),
      regularPay,
      overtimePay,
      totalPay,
      hourlyRate: rate,
      overtimeThreshold: threshold,
      overtimeMultiplier: multiplier,
    });
  };

  const formatCurrency = (value: number): string =>
    value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Work Days */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-base">
              <Clock className="inline h-4 w-4 mr-1.5 text-muted-foreground" />
              Work Days
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={addDay}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Day
            </Button>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {days.map((day) => (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="rounded-xl border border-border/50 bg-muted/20 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">
                    {day.label}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDay(day.id)}
                    disabled={days.length <= 1}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Clock In</Label>
                    <Input
                      type="text"
                      placeholder="09:00"
                      value={day.clockIn}
                      onChange={(e) => updateDay(day.id, 'clockIn', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Clock Out</Label>
                    <Input
                      type="text"
                      placeholder="17:00"
                      value={day.clockOut}
                      onChange={(e) => updateDay(day.id, 'clockOut', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Lunch (min)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="30"
                      value={day.lunchBreak}
                      onChange={(e) => updateDay(day.id, 'lunchBreak', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Wage Settings */}
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
          <Label className="text-sm font-semibold">
            <DollarSign className="inline h-4 w-4 mr-1.5 text-muted-foreground" />
            Wage Settings (Optional)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="hourlyRate" className="text-xs text-muted-foreground">
                <DollarSign className="inline h-3 w-3 mr-1" />
                Hourly Rate ($)
              </Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="0.01"
                placeholder="25.00"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="otThreshold" className="text-xs text-muted-foreground">
                <Timer className="inline h-3 w-3 mr-1" />
                OT Threshold (hrs/wk)
              </Label>
              <Input
                id="otThreshold"
                type="number"
                min="0"
                step="1"
                placeholder="40"
                value={overtimeThreshold}
                onChange={(e) => setOvertimeThreshold(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="otMultiplier" className="text-xs text-muted-foreground">
                OT Rate Multiplier
              </Label>
              <Input
                id="otMultiplier"
                type="number"
                min="0"
                step="0.1"
                placeholder="1.5"
                value={overtimeMultiplier}
                onChange={(e) => setOvertimeMultiplier(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-500 text-sm rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
          size="lg"
        >
          Calculate Hours
        </Button>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="result-display mt-8" aria-live="polite"
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            {/* Main Result */}
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                Total Hours Worked
              </p>
              <p className="text-4xl font-bold text-emerald-600">
                {formatDecimalHours(result.totalDecimalHours)} hrs
              </p>
              <p className="text-xs text-muted-foreground">
                ({formatHHMM(Math.round(result.totalDecimalHours * 60))} in hours & minutes)
              </p>
            </div>

            {/* Daily Hours Bar Chart */}
            {result.days.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChartIcon className="h-4.5 w-4.5 text-primary" />
                  Hours Worked Per Day
                </p>
                <div className="h-64 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={result.days}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis
                        dataKey="label"
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
                        formatter={(value: number) => [`${formatDecimalHours(value)} hrs`, 'Hours Worked']}
                        labelStyle={{ color: '#888888' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Bar dataKey="decimalHours" radius={[4, 4, 0, 0]} fill="#10b981" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Daily Breakdown Table */}
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Day
                    </th>
                    <th className="text-center px-3 py-3 font-medium text-muted-foreground">
                      In
                    </th>
                    <th className="text-center px-3 py-3 font-medium text-muted-foreground">
                      Out
                    </th>
                    <th className="text-center px-3 py-3 font-medium text-muted-foreground">
                      Lunch
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Hours
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Decimal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {result.days.map((day) => (
                    <tr key={day.label}>
                      <td className="px-4 py-3 font-medium">{day.label}</td>
                      <td className="text-center px-3 py-3 text-muted-foreground">
                        {day.clockIn}
                      </td>
                      <td className="text-center px-3 py-3 text-muted-foreground">
                        {day.clockOut}
                      </td>
                      <td className="text-center px-3 py-3 text-muted-foreground">
                        {day.lunchBreak}m
                      </td>
                      <td className="text-right px-4 py-3">
                        {formatHHMM(Math.round(day.totalHours * 60))}
                      </td>
                      <td className="text-right px-4 py-3 font-mono font-medium">
                        {formatDecimalHours(day.decimalHours)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Hours Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Regular</p>
                <p className="text-xl font-bold">
                  {formatDecimalHours(result.totalRegularHours)}
                </p>
                <p className="text-xs text-muted-foreground">hrs</p>
              </div>
              <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Overtime</p>
                <p className="text-xl font-bold text-amber-600">
                  {formatDecimalHours(result.totalOvertimeHours)}
                </p>
                <p className="text-xs text-muted-foreground">hrs</p>
              </div>
              <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total</p>
                <p className="text-xl font-bold text-emerald-600">
                  {formatDecimalHours(result.totalDecimalHours)}
                </p>
                <p className="text-xs text-muted-foreground">hrs</p>
              </div>
            </div>

            {/* Pay Breakdown */}
            {result.hourlyRate > 0 && (
              <div className="rounded-xl bg-background border border-border/50 p-4 space-y-3">
                <p className="text-sm font-semibold text-center">Earnings Breakdown</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Regular Pay</p>
                    <p className="text-lg font-bold">{formatCurrency(result.regularPay)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Overtime Pay ({result.overtimeMultiplier}x)
                    </p>
                    <p className="text-lg font-bold text-amber-600">
                      {formatCurrency(result.overtimePay)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Total Pay</p>
                    <p className="text-lg font-bold text-emerald-600">
                      {formatCurrency(result.totalPay)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center pt-1">
                  <Badge variant="outline" className="text-xs">
                    Rate: {formatCurrency(result.hourlyRate)}/hr | OT after {result.overtimeThreshold} hrs/wk
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
