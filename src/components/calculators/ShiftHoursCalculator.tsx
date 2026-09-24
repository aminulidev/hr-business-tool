'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, Clock, Calendar, DollarSign, Sparkles, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency } from '@/lib/utils';

interface ShiftHoursSnapshot {
  patternName: string;
  shiftGross: number;
  shiftNet: number;
  daysPerWeek: number;
  weeklyNetHours: number;
  monthlyHours: number;
  annualHours: number;
  regularHours: number;
  otHours: number;
  dtHours: number;
  totalWeeklyPay: number;
  label: string;
}

interface PatternPreset {
  name: string;
  shiftHours: number;
  breakMin: number;
  daysPerWeek: number;
  description: string;
}

const SHIFT_PRESETS: Record<string, PatternPreset> = {
  '5x8': { name: '5x8 Standard (40h)', shiftHours: 8.5, breakMin: 30, daysPerWeek: 5, description: 'Standard 5-day week, 8h net/day' },
  '4x10': { name: '4x10 Compressed (40h)', shiftHours: 10.5, breakMin: 30, daysPerWeek: 4, description: '4 days x 10h net, 3-day weekend' },
  '3x12': { name: '3x12 Healthcare (36h)', shiftHours: 12.5, breakMin: 30, daysPerWeek: 3, description: '3 shifts x 12h net, 4 days off' },
  '4x12': { name: '4x12 Extended (48h)', shiftHours: 12.5, breakMin: 30, daysPerWeek: 4, description: '4 shifts x 12h net, 8h weekly OT' },
  '9_80': { name: '9/80 Schedule (80h/2wks)', shiftHours: 9.5, breakMin: 30, daysPerWeek: 4.5, description: '80h across 9 days per 2 weeks' },
  'pitman': { name: '2-2-3 Pitman (42h avg)', shiftHours: 12.5, breakMin: 30, daysPerWeek: 3.5, description: '12h rotating 14-day cycle' },
};

export default function ShiftHoursCalculator() {
  const [presetKey, setPresetKey] = useState<string>('5x8');
  const [grossShiftHours, setGrossShiftHours] = useState('8.5');
  const [breakMinutes, setBreakMinutes] = useState('30');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [baseHourlyRate, setBaseHourlyRate] = useState('28.00');
  const [shiftDiffMode, setShiftDiffMode] = useState<'flat' | 'percent'>('flat');
  const [shiftDiffValue, setShiftDiffValue] = useState('0'); // e.g. +$2.50/hr night diff
  const [overtimeRule, setOvertimeRule] = useState<'flsa' | 'california'>('flsa');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<ShiftHoursSnapshot | null>(null);
  const [compareB, setCompareB] = useState<ShiftHoursSnapshot | null>(null);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    presetKey: string;
    grossShiftHours: string;
    breakMinutes: string;
    daysPerWeek: string;
    baseHourlyRate: string;
    shiftDiffValue: string;
    overtimeRule: string;
  }>('shift-hours-calculator');

  const shiftGross = parseFloat(grossShiftHours) || 0;
  const breakMin = parseFloat(breakMinutes) || 0;
  const shiftNet = Math.max(0, shiftGross - breakMin / 60);
  const dpw = parseFloat(daysPerWeek) || 0;
  const baseRate = parseFloat(baseHourlyRate) || 0;
  const diffVal = parseFloat(shiftDiffValue) || 0;

  // Blended effective hourly rate including shift differential
  const effectiveHourlyRate = useMemo(() => {
    if (diffVal <= 0) return baseRate;
    if (shiftDiffMode === 'percent') {
      return baseRate * (1 + diffVal / 100);
    }
    return baseRate + diffVal;
  }, [baseRate, diffVal, shiftDiffMode]);

  const results = useMemo(() => {
    const weeklyNetHours = shiftNet * dpw;
    const monthlyHours = (weeklyNetHours * 52) / 12;
    const annualHours = weeklyNetHours * 52;

    let regularHours = 0;
    let otHours = 0;
    let dtHours = 0;

    if (overtimeRule === 'california') {
      // California daily rules:
      // Hours 0-8: regular
      // Hours 8-12: daily OT (1.5x)
      // Hours >12: daily Double Time (2.0x)
      const dailyReg = Math.min(shiftNet, 8);
      const dailyOT = Math.max(0, Math.min(shiftNet - 8, 4));
      const dailyDT = Math.max(0, shiftNet - 12);

      regularHours = dailyReg * dpw;
      otHours = dailyOT * dpw;
      dtHours = dailyDT * dpw;
    } else {
      // Standard FLSA Weekly Overtime (>40 hours/week)
      otHours = Math.max(0, weeklyNetHours - 40);
      regularHours = Math.min(weeklyNetHours, 40);
      dtHours = 0;
    }

    const regPay = regularHours * effectiveHourlyRate;
    const otPay = otHours * effectiveHourlyRate * 1.5;
    const dtPay = dtHours * effectiveHourlyRate * 2.0;
    const totalWeeklyPay = regPay + otPay + dtPay;
    const monthlyGrossPay = (totalWeeklyPay * 52) / 12;
    const annualGrossPay = totalWeeklyPay * 52;

    return {
      weeklyNetHours,
      monthlyHours,
      annualHours,
      regularHours,
      otHours,
      dtHours,
      regPay,
      otPay,
      dtPay,
      totalWeeklyPay,
      monthlyGrossPay,
      annualGrossPay,
    };
  }, [shiftNet, dpw, effectiveHourlyRate, overtimeRule]);

  const applyPreset = (key: string) => {
    const p = SHIFT_PRESETS[key];
    if (p) {
      setPresetKey(key);
      setGrossShiftHours(p.shiftHours.toString());
      setBreakMinutes(p.breakMin.toString());
      setDaysPerWeek(p.daysPerWeek.toString());
      setCalculated(false);
    }
  };

  const handleTryExample = () => {
    applyPreset('3x12');
    setBaseHourlyRate('38.00');
    setShiftDiffMode('flat');
    setShiftDiffValue('4.00'); // night shift diff
    setOvertimeRule('flsa');
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (shiftNet > 0 && dpw > 0) {
      setCalculated(true);
      saveEntry(
        {
          presetKey,
          grossShiftHours,
          breakMinutes,
          daysPerWeek,
          baseHourlyRate,
          shiftDiffValue,
          overtimeRule,
        },
        `${shiftNet.toFixed(1)}h shift x ${dpw}d = ${results.weeklyNetHours.toFixed(1)}h/wk · ${formatCurrency(results.totalWeeklyPay)}/wk`,
      );
    }
  };

  const handleReset = () => {
    applyPreset('5x8');
    setBaseHourlyRate('28.00');
    setShiftDiffValue('0');
    setOvertimeRule('flsa');
    setCalculated(false);
  };

  const handleRestore = (i: {
    presetKey?: string;
    grossShiftHours: string;
    breakMinutes?: string;
    daysPerWeek: string;
    baseHourlyRate: string;
    shiftDiffValue?: string;
    overtimeRule?: string;
  }) => {
    if (i.presetKey) setPresetKey(i.presetKey);
    setGrossShiftHours(i.grossShiftHours);
    setBreakMinutes(i.breakMinutes || '30');
    setDaysPerWeek(i.daysPerWeek);
    setBaseHourlyRate(i.baseHourlyRate);
    setShiftDiffValue(i.shiftDiffValue || '0');
    if (i.overtimeRule === 'flsa' || i.overtimeRule === 'california') {
      setOvertimeRule(i.overtimeRule);
    }
    setCalculated(true);
  };

  const snap = (): ShiftHoursSnapshot => ({
    patternName: SHIFT_PRESETS[presetKey]?.name || 'Custom Shift',
    shiftGross,
    shiftNet,
    daysPerWeek: dpw,
    weeklyNetHours: results.weeklyNetHours,
    monthlyHours: results.monthlyHours,
    annualHours: results.annualHours,
    regularHours: results.regularHours,
    otHours: results.otHours,
    dtHours: results.dtHours,
    totalWeeklyPay: results.totalWeeklyPay,
    label: `${shiftNet.toFixed(1)}h x ${dpw}d/wk (${results.weeklyNetHours.toFixed(1)}h)`,
  });

  const chartData = [
    { name: 'Shift Net', hours: parseFloat(shiftNet.toFixed(1)), fill: '#10b981' },
    { name: 'Weekly', hours: parseFloat(results.weeklyNetHours.toFixed(1)), fill: '#3b82f6' },
    { name: 'Monthly Avg', hours: parseFloat(results.monthlyHours.toFixed(1)), fill: '#f59e0b' },
  ];

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Banner */}
        <div className="flex items-start gap-3 rounded-xl bg-violet-500/10 border border-violet-500/20 p-4">
          <CalendarClock className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
          <div className="text-xs text-violet-900 dark:text-violet-200 space-y-1">
            <p className="font-semibold text-sm text-violet-700 dark:text-violet-300">
              Shift Hours & Pattern Scheduler
            </p>
            <p>
              Model standard and compressed work shifts (5×8, 4×10, 3×12, 9/80, 2-2-3 Pitman). Accounts for unpaid lunch breaks, night/weekend shift differential surcharges, and state-specific daily overtime thresholds.
            </p>
          </div>
        </div>

        {/* Quick Shift Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Shift Pattern Presets
            </Label>
            <span className="text-[11px] text-muted-foreground">Select a pattern to auto-populate:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(SHIFT_PRESETS).map(([key, p]) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-all ${
                  presetKey === key
                    ? 'bg-violet-600/10 border-violet-600 text-violet-700 dark:text-violet-300 font-semibold shadow-sm'
                    : 'bg-background hover:bg-muted text-foreground border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{p.name}</span>
                  {presetKey === key && <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" />}
                </div>
                <p className="text-[10px] text-muted-foreground font-normal mt-0.5">{p.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Shift Length */}
          <div className="space-y-1.5">
            <Label htmlFor="sh-gross" className="text-xs font-semibold">Total Shift Length (Hours)</Label>
            <div className="relative">
              <Input
                id="sh-gross"
                type="number"
                step="0.25"
                min="1"
                max="24"
                placeholder="8.5"
                value={grossShiftHours}
                onChange={(e) => { setGrossShiftHours(e.target.value); setPresetKey('custom'); setCalculated(false); }}
                className="font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">hrs</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Door-to-door shift time scheduled.</p>
          </div>

          {/* Unpaid Break */}
          <div className="space-y-1.5">
            <Label htmlFor="sh-break" className="text-xs font-semibold">Unpaid Meal Break (Min)</Label>
            <div className="relative">
              <Input
                id="sh-break"
                type="number"
                step="5"
                min="0"
                max="180"
                placeholder="30"
                value={breakMinutes}
                onChange={(e) => { setBreakMinutes(e.target.value); setPresetKey('custom'); setCalculated(false); }}
                className="font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">min</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Deducted from gross shift time.</p>
          </div>

          {/* Days Per Week */}
          <div className="space-y-1.5">
            <Label htmlFor="sh-days" className="text-xs font-semibold">Days Worked / Week</Label>
            <div className="relative">
              <Input
                id="sh-days"
                type="number"
                step="0.5"
                min="0.5"
                max="7"
                placeholder="5"
                value={daysPerWeek}
                onChange={(e) => { setDaysPerWeek(e.target.value); setPresetKey('custom'); setCalculated(false); }}
                className="font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">days</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Use 3.5 or 4.5 for alternating 2-week cycles.</p>
          </div>

          {/* Base Wage */}
          <div className="space-y-1.5">
            <Label htmlFor="sh-rate" className="text-xs font-semibold">Base Hourly Wage</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="sh-rate"
                type="number"
                step="0.50"
                min="0"
                placeholder="28.00"
                value={baseHourlyRate}
                onChange={(e) => { setBaseHourlyRate(e.target.value); setCalculated(false); }}
                className="pl-7 font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">/hr</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Standard day-shift wage rate.</p>
          </div>
        </div>

        {/* Shift Differential & Overtime Rule Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Shift Differential */}
          <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Shift Differential (Night / Hazard / Weekend)</Label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => { setShiftDiffMode('flat'); setCalculated(false); }}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                    shiftDiffMode === 'flat' ? 'bg-violet-600 text-white border-violet-600' : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  $/hr
                </button>
                <button
                  type="button"
                  onClick={() => { setShiftDiffMode('percent'); setCalculated(false); }}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                    shiftDiffMode === 'percent' ? 'bg-violet-600 text-white border-violet-600' : 'bg-muted text-muted-foreground border-border'
                  }`}
                >
                  %
                </button>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                {shiftDiffMode === 'flat' ? '+$' : '+'}
              </span>
              <Input
                type="number"
                step={shiftDiffMode === 'flat' ? '0.25' : '1'}
                min="0"
                placeholder={shiftDiffMode === 'flat' ? '2.50' : '10'}
                value={shiftDiffValue}
                onChange={(e) => { setShiftDiffValue(e.target.value); setCalculated(false); }}
                className="pl-8 text-xs font-medium"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {shiftDiffMode === 'flat' ? '/hr' : '%'}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Effective wage: <strong>{formatCurrency(effectiveHourlyRate)}/hr</strong> (used for overtime calculations per FLSA).
            </p>
          </div>

          {/* Overtime Policy */}
          <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Overtime Computation Rule</Label>
              <div title="Federal FLSA triggers OT after 40h/week. California triggers OT after 8h/day and double-time after 12h/day.">
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setOvertimeRule('flsa'); setCalculated(false); }}
                className={`py-2 px-2.5 rounded-lg text-xs border text-center transition-all ${
                  overtimeRule === 'flsa'
                    ? 'bg-violet-600/10 border-violet-600 text-violet-700 dark:text-violet-300 font-semibold'
                    : 'bg-background hover:bg-muted text-muted-foreground border-border'
                }`}
              >
                Standard FLSA (&gt;40h/wk)
              </button>
              <button
                type="button"
                onClick={() => { setOvertimeRule('california'); setCalculated(false); }}
                className={`py-2 px-2.5 rounded-lg text-xs border text-center transition-all ${
                  overtimeRule === 'california'
                    ? 'bg-violet-600/10 border-violet-600 text-violet-700 dark:text-violet-300 font-semibold'
                    : 'bg-background hover:bg-muted text-muted-foreground border-border'
                }`}
              >
                California Daily (&gt;8h / &gt;12h)
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {overtimeRule === 'california' ? 'Assesses 1.5x after 8h/day and 2.0x after 12h/day.' : 'Assesses 1.5x overtime for total weekly hours exceeding 40.0.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCalculate}
              disabled={shiftNet <= 0 || dpw <= 0}
              className="bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800 text-white shadow-lg shadow-violet-500/25 flex-1 sm:flex-none font-medium"
            >
              <CalendarClock className="w-4 h-4 mr-2" />
              Calculate Shift Hours & Pay
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
            <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-6 space-y-6">
              {/* Hero KPI Card */}
              <div className="text-center space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Weekly Shift Schedule Total
                </p>
                <p className="text-4xl sm:text-5xl font-extrabold text-violet-600 tracking-tight">
                  {results.weeklyNetHours.toFixed(1)} hrs / week
                </p>
                <div className="flex justify-center items-center gap-2 flex-wrap pt-1">
                  <Badge variant="outline" className="bg-violet-500/10 border-violet-500/30 text-violet-700 dark:text-violet-300 font-medium">
                    {shiftNet.toFixed(2)}h Net / Shift ({breakMin}m lunch)
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 font-medium">
                    {results.monthlyHours.toFixed(1)}h Monthly Avg
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-medium">
                    Weekly Pay: {formatCurrency(results.totalWeeklyPay)}
                  </Badge>
                  {results.otHours > 0 && (
                    <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 font-medium">
                      {results.otHours.toFixed(1)}h Overtime (1.5x)
                    </Badge>
                  )}
                  {results.dtHours > 0 && (
                    <Badge variant="outline" className="bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300 font-medium">
                      {results.dtHours.toFixed(1)}h Double Time (2.0x)
                    </Badge>
                  )}
                </div>

                <div className="flex justify-center gap-2 pt-3">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2.5 border-primary/30 bg-primary/5 text-primary">
                    {compareA ? '↺ Update Scenario A' : '+ Save Scenario A'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2.5 border-amber-500/30 bg-amber-500/5 text-amber-600">
                    {compareB ? '↺ Update Scenario B' : '+ Save Scenario B'}
                  </Button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Shift Length (Net)</p>
                  <p className="text-lg font-bold text-foreground">{shiftNet.toFixed(2)}h</p>
                  <p className="text-[10px] text-muted-foreground">{shiftGross}h gross − {breakMin}m brk</p>
                </div>
                <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Weekly Straight Pay</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(results.regPay)}</p>
                  <p className="text-[10px] text-muted-foreground">{results.regularHours.toFixed(1)}h @ {formatCurrency(effectiveHourlyRate)}/h</p>
                </div>
                <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Premium Wages (OT/DT)</p>
                  <p className="text-lg font-bold text-amber-600">{formatCurrency(results.otPay + results.dtPay)}</p>
                  <p className="text-[10px] text-muted-foreground">{(results.otHours + results.dtHours).toFixed(1)} premium hours</p>
                </div>
                <div className="rounded-xl bg-background border border-border/60 p-3.5 text-center">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">Annual Projected Pay</p>
                  <p className="text-lg font-bold text-violet-600">{formatCurrency(results.annualGrossPay)}</p>
                  <p className="text-[10px] text-muted-foreground">{results.annualHours.toLocaleString()}h / year</p>
                </div>
              </div>

              {/* Extended Projections Table */}
              <div className="rounded-xl border border-violet-500/20 bg-background/80 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Projected Hours & Compensation Schedule
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-lg bg-violet-500/5 border border-violet-500/20 p-3">
                    <p className="text-[11px] text-muted-foreground">Weekly Period (7 Days)</p>
                    <p className="text-base font-bold text-foreground mt-0.5">{results.weeklyNetHours.toFixed(1)} hours</p>
                    <p className="text-[11px] text-violet-600 font-semibold">{formatCurrency(results.totalWeeklyPay)} gross pay</p>
                  </div>
                  <div className="rounded-lg bg-violet-500/5 border border-violet-500/20 p-3">
                    <p className="text-[11px] text-muted-foreground">Monthly Average (4.3333 weeks)</p>
                    <p className="text-base font-bold text-foreground mt-0.5">{results.monthlyHours.toFixed(1)} hours</p>
                    <p className="text-[11px] text-violet-600 font-semibold">{formatCurrency(results.monthlyGrossPay)} / month</p>
                  </div>
                  <div className="rounded-lg bg-violet-500/5 border border-violet-500/20 p-3">
                    <p className="text-[11px] text-muted-foreground">Annualized (52 weeks)</p>
                    <p className="text-base font-bold text-foreground mt-0.5">{results.annualHours.toLocaleString()} hours</p>
                    <p className="text-[11px] text-violet-600 font-semibold">{formatCurrency(results.annualGrossPay)} / year</p>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Hours Horizon Comparison
                </h4>
                <div className="h-44 w-full bg-background/50 rounded-xl p-2 border border-border/50">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => `${v}h`} tick={{ fontSize: 11 }} />
                      <RechartsTooltip
                        formatter={(v: number) => [`${v} hours`, 'Net Hours']}
                        contentStyle={{ borderRadius: '8px', border: 'none', background: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }}
                      />
                      <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                        {chartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Informational Guidance */}
              <div className="rounded-lg bg-muted/40 border border-border/40 p-3.5 text-xs text-muted-foreground space-y-1">
                <p>
                  💡 <strong>Shift Scheduling Tip:</strong> In 24/7 continuous operations (manufacturing, public safety, hospitals), rotating shift models like the <strong>2-2-3 Pitman schedule</strong> alternate 2-on, 2-off, 3-on, giving employees every other weekend off with an average of 42.0 hours per week (2 hours built-in overtime).
                </p>
                <p>
                  To design complex team rotations, see our <a href="/calculators/shift-pay-calculator" className="text-violet-600 hover:underline font-medium">Shift Pay Calculator</a> or explore our <a href="/calculators/work-hours-calculator" className="text-violet-600 hover:underline font-medium">Work Hours Calculator</a>.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Comparison Drawer */}
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Shift Net Hours', valueA: `${compareA.shiftNet.toFixed(1)}h`, valueB: `${compareB.shiftNet.toFixed(1)}h`, numA: compareA.shiftNet, numB: compareB.shiftNet },
          { label: 'Days / Week', valueA: `${compareA.daysPerWeek} days`, valueB: `${compareB.daysPerWeek} days`, numA: compareA.daysPerWeek, numB: compareB.daysPerWeek },
          { label: 'Weekly Net Hours', valueA: `${compareA.weeklyNetHours.toFixed(1)}h`, valueB: `${compareB.weeklyNetHours.toFixed(1)}h`, numA: compareA.weeklyNetHours, numB: compareB.weeklyNetHours },
          { label: 'Monthly Hours', valueA: `${compareA.monthlyHours.toFixed(0)}h`, valueB: `${compareB.monthlyHours.toFixed(0)}h`, numA: compareA.monthlyHours, numB: compareB.monthlyHours },
          { label: 'Annual Hours', valueA: `${compareA.annualHours.toLocaleString()}h`, valueB: `${compareB.annualHours.toLocaleString()}h`, numA: compareA.annualHours, numB: compareB.annualHours },
          { label: 'Weekly Overtime', valueA: `${compareA.otHours.toFixed(1)}h`, valueB: `${compareB.otHours.toFixed(1)}h`, numA: compareA.otHours, numB: compareB.otHours },
          { label: 'Weekly Gross Pay', valueA: formatCurrency(compareA.totalWeeklyPay), valueB: formatCurrency(compareB.totalWeeklyPay), numA: compareA.totalWeeklyPay, numB: compareB.totalWeeklyPay },
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

