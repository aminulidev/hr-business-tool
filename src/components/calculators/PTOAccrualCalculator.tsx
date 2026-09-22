'use client';

/**
 * PTOAccrualCalculator — calculates paid time off accrual based on
 * accrual rate, hours worked, and policy type (hourly/lump-sum/annual).
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, Info, Calculator } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import TryExample from './TryExample';

type AccrualType = 'per-hour' | 'per-pay-period' | 'annual-lump';

interface PTOResult {
  annualPTOHours: number;
  annualPTODays: number;
  accruedPerPaycheck: number;
  currentBalance: number;
  projectedYearEnd: number;
  cashValue: number;
}

const fmt = (n: number, d: number = 1) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: d });

const fmtMoney = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function PTOAccrualCalculator() {
  const [accrualType, setAccrualType] = useState<AccrualType>('per-hour');
  const [rate, setRate] = useState('0.05'); // hours per hour worked
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [payPeriodsPerYear, setPayPeriodsPerYear] = useState('26'); // bi-weekly
  const [annualHours, setAnnualHours] = useState('80'); // for annual-lump mode
  const [currentHours, setCurrentHours] = useState('0');
  const [hourlyRate, setHourlyRate] = useState('25');
  const [yearsEmployed, setYearsEmployed] = useState('1');

  const result = useMemo<PTOResult | null>(() => {
    const r = parseFloat(rate);
    const hpw = parseFloat(hoursPerWeek);
    const ppy = parseFloat(payPeriodsPerYear);
    const ah = parseFloat(annualHours);
    const ch = parseFloat(currentHours);
    const hr = parseFloat(hourlyRate);
    const yrs = parseFloat(yearsEmployed);

    if (isNaN(r) || isNaN(hpw) || isNaN(ppy) || isNaN(ch) || isNaN(hr) || isNaN(yrs)) {
      return null;
    }

    let annualPTOHours = 0;
    let accruedPerPaycheck = 0;

    if (accrualType === 'per-hour') {
      annualPTOHours = r * hpw * 52;
      accruedPerPaycheck = annualPTOHours / ppy;
    } else if (accrualType === 'per-pay-period') {
      annualPTOHours = r * ppy;
      accruedPerPaycheck = r;
    } else {
      // annual-lump
      annualPTOHours = ah;
      accruedPerPaycheck = ah / ppy;
    }

    const annualPTODays = annualPTOHours / 8;
    const projectedYearEnd = ch + annualPTOHours;
    const cashValue = annualPTOHours * hr;

    return {
      annualPTOHours,
      annualPTODays,
      accruedPerPaycheck,
      currentBalance: ch,
      projectedYearEnd,
      cashValue,
    };
  }, [accrualType, rate, hoursPerWeek, payPeriodsPerYear, annualHours, currentHours, hourlyRate, yearsEmployed]);

  const handleTryExample = () => {
    setAccrualType('per-hour');
    setRate('0.0577'); // ~3 weeks/year (120 hours) at 40 hrs/week
    setHoursPerWeek('40');
    setPayPeriodsPerYear('26');
    setCurrentHours('40');
    setHourlyRate('25');
    setYearsEmployed('2');
  };

  const handleReset = () => {
    setRate('0.05');
    setCurrentHours('0');
    setHourlyRate('25');
    setYearsEmployed('1');
  };

  return (
    <div className="p-5 sm:p-6 space-y-6">
      <TryExample onClick={handleTryExample} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="accrualType" className="text-sm font-medium">Accrual Type</Label>
          <Select value={accrualType} onValueChange={(v) => setAccrualType(v as AccrualType)}>
            <SelectTrigger id="accrualType" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="per-hour">Per hour worked</SelectItem>
              <SelectItem value="per-pay-period">Per pay period</SelectItem>
              <SelectItem value="annual-lump">Annual lump sum</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="rate" className="text-sm font-medium">
            {accrualType === 'per-hour' && 'Accrual Rate (hours per hour worked)'}
            {accrualType === 'per-pay-period' && 'Accrual Rate (hours per pay period)'}
            {accrualType === 'annual-lump' && 'Annual PTO Hours'}
          </Label>
          <Input
            id="rate"
            type="number"
            step="0.001"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {accrualType === 'per-hour' && 'Common: 0.0192 (2 weeks/yr), 0.0385 (4 weeks/yr), 0.0577 (6 weeks/yr)'}
            {accrualType === 'per-pay-period' && 'Hours earned each paycheck'}
            {accrualType === 'annual-lump' && 'Total hours granted at start of year'}
          </p>
        </div>

        {accrualType === 'annual-lump' && (
          <input type="hidden" />
        )}

        <div>
          <Label htmlFor="hpw" className="text-sm font-medium">Hours Worked Per Week</Label>
          <Input
            id="hpw"
            type="number"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="ppy" className="text-sm font-medium">Pay Periods Per Year</Label>
          <Select value={payPeriodsPerYear} onValueChange={setPayPeriodsPerYear}>
            <SelectTrigger id="ppy" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="52">Weekly (52)</SelectItem>
              <SelectItem value="26">Bi-weekly (26)</SelectItem>
              <SelectItem value="24">Semi-monthly (24)</SelectItem>
              <SelectItem value="12">Monthly (12)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="current" className="text-sm font-medium">Current PTO Balance (hours)</Label>
          <Input
            id="current"
            type="number"
            value={currentHours}
            onChange={(e) => setCurrentHours(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="hr" className="text-sm font-medium">Hourly Rate ($)</Label>
          <Input
            id="hr"
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Used to calculate PTO cash value</p>
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="result-display space-y-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Annual PTO</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{fmt(result.annualPTOHours, 1)}h</p>
              <p className="text-xs text-muted-foreground mt-1">{fmt(result.annualPTODays, 1)} days</p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Per Paycheck</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{fmt(result.accruedPerPaycheck, 2)}h</p>
              <p className="text-xs text-muted-foreground mt-1">accrued each period</p>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Year-End Balance</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{fmt(result.projectedYearEnd, 1)}h</p>
              <p className="text-xs text-muted-foreground mt-1">{fmt(result.projectedYearEnd / 8, 1)} days</p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Cash Value</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{fmtMoney(result.cashValue)}</p>
              <p className="text-xs text-muted-foreground mt-1">if paid out</p>
            </div>
          </div>

          <div className="rounded-xl bg-muted/40 p-4 text-sm space-y-2">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <Info className="size-4 text-primary" />
              How we calculated this
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
              {accrualType === 'per-hour' && (
                <>
                  <li>Annual PTO = {rate} hours × {hoursPerWeek} hrs/week × 52 weeks = {fmt(result.annualPTOHours, 1)} hours</li>
                  <li>Per paycheck = {fmt(result.annualPTOHours, 1)} ÷ {payPeriodsPerYear} periods = {fmt(result.accruedPerPaycheck, 2)} hours</li>
                </>
              )}
              {accrualType === 'per-pay-period' && (
                <>
                  <li>Annual PTO = {rate} hours × {payPeriodsPerYear} periods = {fmt(result.annualPTOHours, 1)} hours</li>
                  <li>Per paycheck = {rate} hours flat</li>
                </>
              )}
              {accrualType === 'annual-lump' && (
                <>
                  <li>Annual PTO = {rate} hours granted at start of year</li>
                  <li>Equivalent per paycheck = {fmt(result.annualPTOHours, 1)} ÷ {payPeriodsPerYear} = {fmt(result.accruedPerPaycheck, 2)} hours</li>
                </>
              )}
              <li>Cash value = {fmt(result.annualPTOHours, 1)} hours × ${hourlyRate}/hr = {fmtMoney(result.cashValue)}</li>
              <li>Year-end balance = {currentHours} current + {fmt(result.annualPTOHours, 1)} accrued = {fmt(result.projectedYearEnd, 1)} hours</li>
            </ul>
          </div>

          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
        </motion.div>
      )}
    </div>
  );
}
