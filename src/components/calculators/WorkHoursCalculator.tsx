'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, DollarSign, Check, Copy, Sparkles, AlertCircle, HelpCircle, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { parseTimeToMinutes, formatHHMM, minutesToDecimal } from '@/lib/time-utils';
import { formatCurrency } from '@/lib/utils';

interface DayEntry {
  clockIn: string;
  clockOut: string;
  breakMin: string;
}

interface WorkHoursSnapshot {
  totalMinutes: number;
  totalHours: number;
  breakMinutes: number;
  netHours: number;
  grossPay: number;
  label: string;
}

type RoundingOption = 'exact' | '15min' | '6min' | '5min';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WorkHoursCalculator() {
  const [days, setDays] = useState<DayEntry[]>(
    DAY_LABELS.map(() => ({ clockIn: '', clockOut: '', breakMin: '30' })),
  );
  const [hourlyRate, setHourlyRate] = useState('25.00');
  const [rounding, setRounding] = useState<RoundingOption>('exact');
  const [overtimeRule, setOvertimeRule] = useState<'weekly' | 'california'>('weekly');
  const [calculated, setCalculated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [compareA, setCompareA] = useState<WorkHoursSnapshot | null>(null);
  const [compareB, setCompareB] = useState<WorkHoursSnapshot | null>(null);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('work-hours-calculator');

  // FLSA 7/8 minute 15-min rounding or other intervals
  const applyRounding = (minutes: number, rule: RoundingOption) => {
    if (rule === 'exact' || minutes <= 0) return minutes;
    if (rule === '15min') {
      // 15-minute rounding (FLSA standard: 1-7 min rounds down, 8-14 rounds up)
      const remainder = minutes % 15;
      if (remainder >= 8) return minutes + (15 - remainder);
      return minutes - remainder;
    }
    if (rule === '6min') {
      // 6-minute rounding (1/10th of an hour)
      return Math.round(minutes / 6) * 6;
    }
    if (rule === '5min') {
      return Math.round(minutes / 5) * 5;
    }
    return minutes;
  };

  const computeDay = (d: DayEntry) => {
    const inMin = parseTimeToMinutes(d.clockIn);
    const outMin = parseTimeToMinutes(d.clockOut);
    if (inMin < 0 || outMin < 0) return { gross: 0, net: 0, brk: 0, roundedNet: 0, isOvernight: false };
    
    let gross = outMin - inMin;
    let isOvernight = false;
    if (gross < 0) {
      gross += 24 * 60; // overnight shift crossed midnight
      isOvernight = true;
    }
    const brk = Math.min(parseFloat(d.breakMin) || 0, gross);
    const rawNet = Math.max(0, gross - brk);
    const roundedNet = applyRounding(rawNet, rounding);
    return { gross, net: rawNet, brk, roundedNet, isOvernight };
  };

  // Preset schedules
  const applyPreset = (preset: 'standard' | 'fourTen' | 'eightFourThirty' | 'clear') => {
    if (preset === 'clear') {
      setDays(DAY_LABELS.map(() => ({ clockIn: '', clockOut: '', breakMin: '30' })));
      setCalculated(false);
      return;
    }
    if (preset === 'standard') {
      setDays([
        { clockIn: '9:00 AM', clockOut: '5:30 PM', breakMin: '30' },
        { clockIn: '9:00 AM', clockOut: '5:30 PM', breakMin: '30' },
        { clockIn: '9:00 AM', clockOut: '5:30 PM', breakMin: '30' },
        { clockIn: '9:00 AM', clockOut: '5:30 PM', breakMin: '30' },
        { clockIn: '9:00 AM', clockOut: '5:30 PM', breakMin: '30' },
        { clockIn: '', clockOut: '', breakMin: '0' },
        { clockIn: '', clockOut: '', breakMin: '0' },
      ]);
    } else if (preset === 'fourTen') {
      setDays([
        { clockIn: '7:30 AM', clockOut: '6:00 PM', breakMin: '30' },
        { clockIn: '7:30 AM', clockOut: '6:00 PM', breakMin: '30' },
        { clockIn: '7:30 AM', clockOut: '6:00 PM', breakMin: '30' },
        { clockIn: '7:30 AM', clockOut: '6:00 PM', breakMin: '30' },
        { clockIn: '', clockOut: '', breakMin: '0' },
        { clockIn: '', clockOut: '', breakMin: '0' },
        { clockIn: '', clockOut: '', breakMin: '0' },
      ]);
    } else if (preset === 'eightFourThirty') {
      setDays([
        { clockIn: '8:00 AM', clockOut: '4:30 PM', breakMin: '45' },
        { clockIn: '8:00 AM', clockOut: '4:30 PM', breakMin: '45' },
        { clockIn: '8:00 AM', clockOut: '4:30 PM', breakMin: '45' },
        { clockIn: '8:00 AM', clockOut: '4:30 PM', breakMin: '45' },
        { clockIn: '8:00 AM', clockOut: '4:30 PM', breakMin: '45' },
        { clockIn: '', clockOut: '', breakMin: '0' },
        { clockIn: '', clockOut: '', breakMin: '0' },
      ]);
    }
    setCalculated(false);
  };

  const totals = useMemo(() => {
    let gross = 0;
    let net = 0;
    let brk = 0;
    let roundedNet = 0;
    let dailyOTMinutes = 0;

    days.forEach((d) => {
      const r = computeDay(d);
      gross += r.gross;
      net += r.net;
      brk += r.brk;
      roundedNet += r.roundedNet;
      if (r.roundedNet > 8 * 60) {
        dailyOTMinutes += (r.roundedNet - 8 * 60);
      }
    });

    const netHours = roundedNet / 60;
    const rate = parseFloat(hourlyRate) || 0;

    let otHours = 0;
    let regHours = netHours;

    if (overtimeRule === 'california') {
      otHours = dailyOTMinutes / 60;
      regHours = netHours - otHours;
    } else {
      // Standard FLSA Weekly > 40 hours
      otHours = Math.max(0, netHours - 40);
      regHours = netHours - otHours;
    }

    const regPay = regHours * rate;
    const otPay = otHours * rate * 1.5;
    const grossPay = regPay + otPay;
    const monthlyHoursProjected = netHours * 4.3333;
    const annualHoursProjected = netHours * 52;
    const monthlyGrossProjected = grossPay * 4.3333;

    return {
      gross,
      net,
      brk,
      roundedNet,
      netHours,
      regHours,
      otHours,
      regPay,
      otPay,
      grossPay,
      rate,
      monthlyHoursProjected,
      annualHoursProjected,
      monthlyGrossProjected,
    };
  }, [days, rounding, overtimeRule, hourlyRate]);

  const handleTryExample = () => {
    applyPreset('standard');
    setHourlyRate('28.50');
    setRounding('15min');
    setOvertimeRule('weekly');
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (totals.net > 0) {
      setCalculated(true);
      saveEntry(
        {
          ...days.reduce((a, d, i) => ({ ...a, [`d${i}_in`]: d.clockIn, [`d${i}_out`]: d.clockOut, [`d${i}_brk`]: d.breakMin }), {}),
          hourlyRate,
          rounding,
          overtimeRule,
        },
        `${formatHHMM(totals.roundedNet)} net · ${totals.netHours.toFixed(2)}h · ${totals.otHours > 0 ? `${totals.otHours.toFixed(1)}h OT` : 'no OT'} · ${formatCurrency(totals.grossPay)}`,
      );
    }
  };

  const handleReset = () => {
    setDays(DAY_LABELS.map(() => ({ clockIn: '', clockOut: '', breakMin: '30' })));
    setHourlyRate('25.00');
    setRounding('exact');
    setOvertimeRule('weekly');
    setCalculated(false);
  };

  const handleRestore = (i: Record<string, string>) => {
    const newDays = DAY_LABELS.map((_, idx) => ({
      clockIn: i[`d${idx}_in`] || '',
      clockOut: i[`d${idx}_out`] || '',
      breakMin: i[`d${idx}_brk`] || '30',
    }));
    setDays(newDays);
    if (i.hourlyRate) setHourlyRate(i.hourlyRate);
    if (i.rounding) setRounding(i.rounding as RoundingOption);
    if (i.overtimeRule === 'california' || i.overtimeRule === 'weekly') {
      setOvertimeRule(i.overtimeRule);
    }
    setCalculated(true);
  };

  const handleCopyTimesheet = () => {
    const lines = [
      'WEEKLY WORK HOURS SUMMARY',
      '------------------------',
      ...days.map((d, i) => {
        const r = computeDay(d);
        if (r.net <= 0) return `${DAY_LABELS[i]}: Off`;
        return `${DAY_LABELS[i]}: ${d.clockIn} - ${d.clockOut} (Break: ${d.breakMin}m) -> ${formatHHMM(r.roundedNet)} (${(r.roundedNet / 60).toFixed(2)}h)`;
      }),
      '------------------------',
      `Gross Hours: ${formatHHMM(totals.gross)}`,
      `Unpaid Breaks: ${formatHHMM(totals.brk)}`,
      `Net Payable Hours: ${formatHHMM(totals.roundedNet)} (${totals.netHours.toFixed(2)} decimal hours)`,
      `Regular Hours: ${totals.regHours.toFixed(2)}h`,
      `Overtime Hours: ${totals.otHours.toFixed(2)}h`,
      ...(totals.rate > 0 ? [`Estimated Gross Pay: ${formatCurrency(totals.grossPay)} (@ ${formatCurrency(totals.rate)}/hr)`] : []),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const snap = (): WorkHoursSnapshot => ({
    totalMinutes: totals.gross,
    totalHours: totals.gross / 60,
    breakMinutes: totals.brk,
    netHours: totals.netHours,
    grossPay: totals.grossPay,
    label: `${formatHHMM(totals.roundedNet)} net (${totals.netHours.toFixed(2)}h)`,
  });

  const chartData = days.map((d, i) => {
    const r = computeDay(d);
    const hrs = r.roundedNet / 60;
    return {
      name: DAY_LABELS[i],
      hours: hrs,
      fill: hrs > 8 ? '#f59e0b' : '#10b981',
    };
  }).filter((d) => d.hours > 0);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Informational Guidance Banner */}
        <div className="flex items-start gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
          <Clock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
            <p className="font-semibold text-sm text-emerald-800 dark:text-emerald-300">
              Work Hours & Timesheet Calculator
            </p>
            <p>
              Input daily clock-in and clock-out times (e.g. <code>8:30 AM</code>, <code>5:00 PM</code>, <code>17:30</code>). Supports automatic overnight shift roll-over, unpaid break deduction, 15-minute 7/8 FLSA rounding rules, and daily or weekly overtime tracking.
            </p>
          </div>
        </div>

        {/* Quick Schedule Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Schedule Presets
            </Label>
            <button
              type="button"
              onClick={() => applyPreset('clear')}
              className="text-xs text-muted-foreground hover:text-rose-600 transition-colors"
            >
              Clear Schedule
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => applyPreset('standard')}
              className="py-2 px-3 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Standard 9–5:30 (40h)</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset('eightFourThirty')}
              className="py-2 px-3 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-all flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3 h-3 text-blue-600" />
              <span>8–4:30 (45m Lunch)</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset('fourTen')}
              className="py-2 px-3 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-all flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3 h-3 text-amber-600" />
              <span>4x10 Schedule (Mon-Thu)</span>
            </button>
            <button
              type="button"
              onClick={handleTryExample}
              className="py-2 px-3 text-xs font-medium rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Load Full Sample</span>
            </button>
          </div>
        </div>

        {/* 7-Day Input Grid */}
        <div className="space-y-2.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Daily Time Entries
          </Label>
          <div className="space-y-2">
            {days.map((d, i) => {
              const r = computeDay(d);
              return (
                <div
                  key={i}
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center p-3 rounded-xl border transition-all ${
                    r.roundedNet > 0
                      ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10'
                      : 'border-border/60 bg-muted/20'
                  }`}
                >
                  <div className="sm:col-span-2 flex items-center justify-between sm:block">
                    <span className="font-semibold text-sm text-foreground">{DAY_LABELS[i]}</span>
                    <div className="sm:mt-0.5">
                      {r.roundedNet > 0 ? (
                        <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                          {formatHHMM(r.roundedNet)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Off</span>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <Label htmlFor={`wh-in-${i}`} className="text-[11px] text-muted-foreground sm:sr-only">Clock In</Label>
                    <div className="relative">
                      <Input
                        id={`wh-in-${i}`}
                        placeholder="9:00 AM"
                        value={d.clockIn}
                        onChange={(e) => {
                          const nd = [...days];
                          nd[i].clockIn = e.target.value;
                          setDays(nd);
                          setCalculated(false);
                        }}
                        className="h-9 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <Label htmlFor={`wh-out-${i}`} className="text-[11px] text-muted-foreground sm:sr-only">Clock Out</Label>
                    <div className="relative">
                      <Input
                        id={`wh-out-${i}`}
                        placeholder="5:30 PM"
                        value={d.clockOut}
                        onChange={(e) => {
                          const nd = [...days];
                          nd[i].clockOut = e.target.value;
                          setDays(nd);
                          setCalculated(false);
                        }}
                        className="h-9 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <Label htmlFor={`wh-brk-${i}`} className="text-[11px] text-muted-foreground sm:sr-only">Break (min)</Label>
                    <div className="relative">
                      <Input
                        id={`wh-brk-${i}`}
                        type="number"
                        min="0"
                        step="5"
                        placeholder="30"
                        value={d.breakMin}
                        onChange={(e) => {
                          const nd = [...days];
                          nd[i].breakMin = e.target.value;
                          setDays(nd);
                          setCalculated(false);
                        }}
                        className="h-9 text-xs text-center"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">
                        min
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-1.5 pt-1 sm:pt-0">
                    {r.isOvernight && (
                      <Badge variant="outline" className="text-[10px] bg-purple-500/10 border-purple-500/30 text-purple-600">
                        Overnight +24h
                      </Badge>
                    )}
                    {r.roundedNet > 0 && (
                      <Badge
                        variant="outline"
                        className={`text-xs font-mono font-semibold ${
                          r.roundedNet / 60 > 8
                            ? 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {(r.roundedNet / 60).toFixed(2)}h
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Settings & Hourly Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Hourly Rate */}
          <div className="space-y-1.5">
            <Label htmlFor="wh-rate" className="text-xs font-semibold">Hourly Wage Rate</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
              <Input
                id="wh-rate"
                type="number"
                step="0.50"
                min="0"
                placeholder="25.00"
                value={hourlyRate}
                onChange={(e) => { setHourlyRate(e.target.value); setCalculated(false); }}
                className="pl-7 font-semibold"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">Used to compute gross regular and 1.5x overtime pay.</p>
          </div>

          {/* Time Rounding Rules */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label className="text-xs font-semibold">FLSA Rounding Rule</Label>
              <div title="FLSA allows 15-minute rounding where 1-7 min rounds down and 8-14 min rounds up.">
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'exact', label: 'Exact (No Rounding)' },
                { id: '15min', label: '15-min (7/8 FLSA)' },
                { id: '6min', label: '6-min (1/10th hr)' },
                { id: '5min', label: '5-min Nearest' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => { setRounding(r.id as RoundingOption); setCalculated(false); }}
                  className={`py-1.5 px-2 rounded-lg text-[11px] border font-medium text-center transition-all ${
                    rounding === r.id
                      ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                      : 'bg-background hover:bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overtime Policy Toggle */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Overtime Calculation Rule</Label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => { setOvertimeRule('weekly'); setCalculated(false); }}
                className={`py-2 px-2.5 rounded-lg text-[11px] border text-center transition-all ${
                  overtimeRule === 'weekly'
                    ? 'bg-emerald-600/10 border-emerald-600 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : 'bg-background hover:bg-muted text-muted-foreground border-border'
                }`}
              >
                Standard FLSA (&gt;40h/wk)
              </button>
              <button
                type="button"
                onClick={() => { setOvertimeRule('california'); setCalculated(false); }}
                className={`py-2 px-2.5 rounded-lg text-[11px] border text-center transition-all ${
                  overtimeRule === 'california'
                    ? 'bg-emerald-600/10 border-emerald-600 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : 'bg-background hover:bg-muted text-muted-foreground border-border'
                }`}
              >
                California (&gt;8h/day)
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">Select federal 40h/week or daily state OT threshold.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCalculate}
              disabled={totals.net <= 0}
              className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none font-medium"
            >
              <Clock className="w-4 h-4 mr-2" />
              Calculate Work Hours
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {/* Calculated Results Display */}
        {calculated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="result-display mt-2"
            aria-live="polite"
          >
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6 space-y-6">
              {/* Hero KPI Card */}
              <div className="text-center space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Total Payable Net Work Hours
                </p>
                <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600 tracking-tight">
                  {formatHHMM(totals.roundedNet)}
                </p>
                <div className="flex justify-center items-center gap-2 flex-wrap pt-1">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-medium">
                    {totals.netHours.toFixed(2)} Decimal Hours
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 font-medium">
                    {formatHHMM(totals.brk)} Unpaid Breaks
                  </Badge>
                  {totals.otHours > 0 ? (
                    <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 font-medium">
                      {totals.otHours.toFixed(2)}h Overtime (1.5x)
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      No Overtime
                    </Badge>
                  )}
                  {totals.rate > 0 && (
                    <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-medium">
                      Gross Pay: {formatCurrency(totals.grossPay)}
                    </Badge>
                  )}
                </div>
                <div className="flex justify-center gap-2 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyTimesheet}
                    className="h-7 text-[11px] px-3 gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Timesheet Summary'}</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2.5 border-primary/30 bg-primary/5 text-primary">
                    {compareA ? '↺ Update Scenario A' : '+ Save Scenario A'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2.5 border-amber-500/30 bg-amber-500/5 text-amber-600">
                    {compareB ? '↺ Update Scenario B' : '+ Save Scenario B'}
                  </Button>
                </div>
              </div>

              {/* 4 Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Gross Hours Clocked</p>
                  <p className="text-lg font-bold text-foreground">{formatHHMM(totals.gross)}</p>
                  <p className="text-[10px] text-muted-foreground">{(totals.gross / 60).toFixed(2)} decimal</p>
                </div>
                <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Unpaid Breaks</p>
                  <p className="text-lg font-bold text-blue-600">{formatHHMM(totals.brk)}</p>
                  <p className="text-[10px] text-muted-foreground">{(totals.brk / 60).toFixed(2)} deducted</p>
                </div>
                <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Regular Hours (1.0x)</p>
                  <p className="text-lg font-bold text-emerald-600">{totals.regHours.toFixed(2)}h</p>
                  <p className="text-[10px] text-muted-foreground">{formatCurrency(totals.regPay)} base pay</p>
                </div>
                <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Overtime Hours (1.5x)</p>
                  <p className="text-lg font-bold text-amber-600">{totals.otHours.toFixed(2)}h</p>
                  <p className="text-[10px] text-muted-foreground">{formatCurrency(totals.otPay)} premium</p>
                </div>
              </div>

              {/* Weekly to Monthly & Annual Projections */}
              <div className="rounded-xl border border-emerald-500/20 bg-background/80 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Projected Hours & Payroll Equivalents
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                    <p className="text-[11px] text-muted-foreground">Weekly Period (7 Days)</p>
                    <p className="text-base font-bold text-foreground mt-0.5">{totals.netHours.toFixed(2)} hrs</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">{formatCurrency(totals.grossPay)} gross pay</p>
                  </div>
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                    <p className="text-[11px] text-muted-foreground">Monthly Average (4.33 weeks)</p>
                    <p className="text-base font-bold text-foreground mt-0.5">{totals.monthlyHoursProjected.toFixed(1)} hrs</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">{formatCurrency(totals.monthlyGrossProjected)} / month</p>
                  </div>
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                    <p className="text-[11px] text-muted-foreground">Annualized (52 weeks)</p>
                    <p className="text-base font-bold text-foreground mt-0.5">{totals.annualHoursProjected.toFixed(0)} hrs</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">{formatCurrency(totals.grossPay * 52)} / year</p>
                  </div>
                </div>
              </div>

              {/* Recharts Bar Chart of Daily Net Hours */}
              {chartData.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Daily Work Hours Distribution
                    </h4>
                    <span className="text-[10px] text-muted-foreground">
                      Amber bars indicate hours exceeding 8.0h threshold
                    </span>
                  </div>
                  <div className="h-48 w-full bg-background/50 rounded-xl p-2 border border-border/50">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(v) => `${v}h`} tick={{ fontSize: 11 }} />
                        <RechartsTooltip
                          formatter={(v: number) => [`${v.toFixed(2)}h (${formatHHMM(Math.round(v * 60))})`, 'Hours Worked']}
                          contentStyle={{ borderRadius: '8px', border: 'none', background: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }}
                        />
                        <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                          {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                        </Bar>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Contextual Legal / FLSA Tip */}
              <div className="rounded-lg bg-muted/40 border border-border/40 p-3.5 text-xs text-muted-foreground space-y-1">
                <p>
                  💡 <strong>FLSA Wage & Hour Compliance:</strong> Under the Fair Labor Standards Act (FLSA), bona fide meal periods (typically 30 minutes or more where the employee is completely relieved from duty) are non-compensable. Rest breaks lasting 20 minutes or fewer must be counted as paid work hours.
                </p>
                <p>
                  For specialized daily overtime calculations, see our <a href="/calculators/overtime-calculator" className="text-emerald-600 hover:underline font-medium">Overtime Calculator</a> or print a full employee card with our <a href="/calculators/time-card-calculator" className="text-emerald-600 hover:underline font-medium">Time Card Calculator</a>.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Comparison Drawer */}
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Gross Hours', valueA: `${compareA.totalHours.toFixed(2)}h`, valueB: `${compareB.totalHours.toFixed(2)}h`, numA: compareA.totalHours, numB: compareB.totalHours },
          { label: 'Break Deducted', valueA: `${(compareA.breakMinutes / 60).toFixed(2)}h`, valueB: `${(compareB.breakMinutes / 60).toFixed(2)}h`, numA: compareA.breakMinutes / 60, numB: compareB.breakMinutes / 60 },
          { label: 'Net Payable Hours', valueA: `${compareA.netHours.toFixed(2)}h`, valueB: `${compareB.netHours.toFixed(2)}h`, numA: compareA.netHours, numB: compareB.netHours },
          { label: 'Estimated Gross Pay', valueA: formatCurrency(compareA.grossPay), valueB: formatCurrency(compareB.grossPay), numA: compareA.grossPay, numB: compareB.grossPay },
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel
              rows={rows}
              labelA={compareA.label}
              labelB={compareB.label}
              onClear={() => { setCompareA(null); setCompareB(null); }}
              onSwap={() => { const t = compareA; setCompareA(compareB); setCompareB(t); }}
            />
          </div>
        );
      })()}

      <CalcHistoryPanel
        history={history}
        onRestore={handleRestore}
        onClear={clearHistory}
        onDelete={deleteEntry}
      />
    </div>
  );
}

