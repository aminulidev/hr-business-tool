'use client';

import { useState } from 'react';
import TryExample from './TryExample';
import { motion } from 'framer-motion';
import {
  BadgeDollarSign,
  DollarSign,
  Clock,
  Percent,
  Info,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
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
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PayFrequency = 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';

interface HourlyPaycheckResult {
  hourlyRate: number;
  regularHours: number;
  overtimeHours: number;
  totalHoursPerWeek: number;
  payFrequency: PayFrequency;
  periodsPerYear: number;
  grossPerPeriod: number;
  grossPerYear: number;
  federalTax: number;
  stateTax: number;
  fica: number;
  otherDeductions: number;
  totalDeductionsPerPeriod: number;
  netPayPerPeriod: number;
  netPayPerYear: number;
  effectiveHourlyRate: number;
  effectiveRate: number;
}

interface HourlySnapshot {
  hourlyRate: number;
  regularHours: number;
  overtimeHours: number;
  grossPeriod: number;
  netPeriod: number;
  netYear: number;
  label: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PERIODS_PER_YEAR: Record<PayFrequency, number> = {
  weekly: 52,
  'bi-weekly': 26,
  'semi-monthly': 24,
  monthly: 12,
};

const FREQ_LABELS: Record<PayFrequency, string> = {
  weekly: 'Weekly',
  'bi-weekly': 'Bi-Weekly',
  'semi-monthly': 'Semi-Monthly',
  monthly: 'Monthly',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HourlyPaycheckCalculator() {
  const [hourlyRate, setHourlyRate] = useState('');
  const [regularHours, setRegularHours] = useState('40');
  const [overtimeHours, setOvertimeHours] = useState('0');
  const [payFrequency, setPayFrequency] = useState<PayFrequency>('bi-weekly');
  const [federalTaxPct, setFederalTaxPct] = useState('12');
  const [stateTaxPct, setStateTaxPct] = useState('5');
  const [includeFica, setIncludeFica] = useState(true);
  const [otherDeductions, setOtherDeductions] = useState('');

  const [result, setResult] = useState<HourlyPaycheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Comparison State
  const [compareA, setCompareA] = useState<HourlySnapshot | null>(null);
  const [compareB, setCompareB] = useState<HourlySnapshot | null>(null);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ hourlyRate: string; regularHours: string; overtimeHours: string; payFrequency: string; federalTaxPct: string; stateTaxPct: string }>('hourly-paycheck-calculator');

    const handleTryExample = () => {
    setHourlyRate('25');
    setRegularHours('80');
    setPayFrequency('bi-weekly');
    
    setStateTaxPct('5');
    setResult(null);
  };

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    const rate = parseFloat(hourlyRate);
    if (isNaN(rate) || rate <= 0) {
      setError('Please enter a valid hourly rate greater than zero.');
      return;
    }

    const regHrs = parseFloat(regularHours);
    const otHrs = parseFloat(overtimeHours);

    if (isNaN(regHrs) || regHrs < 0) {
      setError('Regular hours cannot be negative.');
      return;
    }
    if (isNaN(otHrs) || otHrs < 0) {
      setError('Overtime hours cannot be negative.');
      return;
    }

    const fedPct = parseFloat(federalTaxPct);
    const stPct = parseFloat(stateTaxPct);
    const otherDed = parseFloat(otherDeductions) || 0;

    if (isNaN(fedPct) || fedPct < 0 || isNaN(stPct) || stPct < 0) {
      setError('Tax percentages cannot be negative.');
      return;
    }
    if (otherDed < 0) {
      setError('Other deductions cannot be negative.');
      return;
    }

    const totalHrsPerWeek = regHrs + otHrs;
    const grossPerWeek = regHrs * rate + otHrs * rate * 1.5; // OT at 1.5x
    const periodsPerYear = PERIODS_PER_YEAR[payFrequency];
    const weeksPerPeriod = 52 / periodsPerYear;
    const grossPerPeriod = grossPerWeek * weeksPerPeriod;
    const grossPerYear = grossPerWeek * 52;

    // Taxable income per period
    const taxablePerPeriod = grossPerPeriod;

    const federalTax = taxablePerPeriod * (fedPct / 100);
    const stateTax = taxablePerPeriod * (stPct / 100);
    const fica = includeFica ? taxablePerPeriod * 0.0765 : 0; // SS 6.2% + Medicare 1.45%

    const totalDeductionsPerPeriod =
      federalTax + stateTax + fica + otherDed;

    const netPayPerPeriod = grossPerPeriod - totalDeductionsPerPeriod;
    const netPayPerYear = netPayPerPeriod * periodsPerYear;
    const totalHoursPerYear = totalHrsPerWeek * 52;
    const effectiveHourlyRate =
      totalHoursPerYear > 0 ? netPayPerYear / totalHoursPerYear : 0;
    const effectiveRate =
      grossPerPeriod > 0
        ? (totalDeductionsPerPeriod / grossPerPeriod) * 100
        : 0;

    setResult({
      hourlyRate: rate,
      regularHours: regHrs,
      overtimeHours: otHrs,
      totalHoursPerWeek: totalHrsPerWeek,
      payFrequency,
      periodsPerYear,
      grossPerPeriod,
      grossPerYear,
      federalTax,
      stateTax,
      fica,
      otherDeductions: otherDed,
      totalDeductionsPerPeriod,
      netPayPerPeriod,
      netPayPerYear,
      effectiveHourlyRate,
      effectiveRate,
    });
    saveEntry(
      { hourlyRate, regularHours, overtimeHours, payFrequency, federalTaxPct, stateTaxPct },
      `${formatCurrency(rate)}/hr → ${formatCurrency(netPayPerPeriod)} net/${FREQ_LABELS[payFrequency].toLowerCase()}`
    );
  };

  const handleRestore = (inputs: { hourlyRate: string; regularHours: string; overtimeHours: string; payFrequency: string; federalTaxPct: string; stateTaxPct: string }) => {
    setHourlyRate(inputs.hourlyRate);
    setRegularHours(inputs.regularHours);
    setOvertimeHours(inputs.overtimeHours);
    setPayFrequency(inputs.payFrequency as PayFrequency);
    setFederalTaxPct(inputs.federalTaxPct);
    setStateTaxPct(inputs.stateTaxPct);
    setResult(null);
  };

  const handleReset = () => {
    setHourlyRate('');
    setRegularHours('40');
    setOvertimeHours('0');
    setPayFrequency('bi-weekly');
    setFederalTaxPct('12');
    setStateTaxPct('5');
    setIncludeFica(true);
    setOtherDeductions('');
    setResult(null);
    setError(null);
  };

  // ------ Render ------

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Hourly Rate */}
        <div className="space-y-2">
          <Label htmlFor="hourlyRate" className="text-sm font-medium">
            <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Hourly Rate ($)
          </Label>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 25.00"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>

        {/* Hours */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="regHrs" className="text-sm font-medium">
              <Clock className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Regular Hours/Week
            </Label>
            <Input
              id="regHrs"
              type="number"
              min="0"
              step="0.5"
              placeholder="e.g., 40"
              value={regularHours}
              onChange={(e) => setRegularHours(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="otHrs" className="text-sm font-medium">
              Overtime Hours/Week
            </Label>
            <Input
              id="otHrs"
              type="number"
              min="0"
              step="0.5"
              placeholder="e.g., 0"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Paid at 1.5x rate
            </p>
          </div>
        </div>

        {/* Pay Frequency */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            <Info className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Pay Frequency
          </Label>
          <Select
            value={payFrequency}
            onValueChange={(v) => {
              setPayFrequency(v as PayFrequency);
              setResult(null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly (52/year)</SelectItem>
              <SelectItem value="bi-weekly">Bi-Weekly (26/year)</SelectItem>
              <SelectItem value="semi-monthly">
                Semi-Monthly (24/year)
              </SelectItem>
              <SelectItem value="monthly">Monthly (12/year)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tax Withholding */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <Percent className="h-3.5 w-3.5" />
            Tax Withholding
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fedTax" className="text-xs font-medium">
                Federal Tax (%)
              </Label>
              <Input
                id="fedTax"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={federalTaxPct}
                onChange={(e) => setFederalTaxPct(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Default: 12% (approx.)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stTax" className="text-xs font-medium">
                State Tax (%)
              </Label>
              <Input
                id="stTax"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={stateTaxPct}
                onChange={(e) => setStateTaxPct(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Default: 5% (approx.)
              </p>
            </div>
          </div>

          {/* FICA Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium cursor-pointer">
                Include FICA (SS + Medicare)
              </Label>
              <p className="text-xs text-muted-foreground">
                Social Security 6.2% + Medicare 1.45% = 7.65%
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={includeFica}
              onClick={() => {
                setIncludeFica(!includeFica);
                setResult(null);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                includeFica
                  ? 'bg-emerald-500'
                  : 'bg-input border border-border'
              }`}
            >
              <span
                className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  includeFica ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Other Deductions */}
        <div className="space-y-2">
          <Label htmlFor="otherDed" className="text-sm font-medium">
            Other Deductions per Period ($)
          </Label>
          <Input
            id="otherDed"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 50.00 (union dues, parking, etc.)"
            value={otherDeductions}
            onChange={(e) => setOtherDeductions(e.target.value)}
          />
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
        <div className="flex gap-3">
          
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6">
            <TryExample onClick={handleTryExample} />
            <Button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            <BadgeDollarSign className="h-4 w-4 mr-2" />
            Calculate Paycheck
          </Button>
          </div>
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="shrink-0"
          >
            Reset
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
                Net Pay per {FREQ_LABELS[result.payFrequency]} Period
              </p>
              <p className="text-4xl font-bold text-emerald-600">
                {formatCurrency(result.netPayPerPeriod)}
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 px-3 py-1 text-xs font-medium"
                >
                  {formatCurrency(result.grossPerPeriod)} gross
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 px-3 py-1 text-xs font-medium"
                >
                  Effective: {formatCurrency(result.effectiveHourlyRate)}/hr
                </Badge>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCompareA({
                    hourlyRate: result.hourlyRate,
                    regularHours: result.regularHours,
                    overtimeHours: result.overtimeHours,
                    grossPeriod: result.grossPerPeriod,
                    netPeriod: result.netPayPerPeriod,
                    netYear: result.netPayPerYear,
                    label: `${formatCurrency(result.hourlyRate)}/hr (${result.regularHours}h)`
                  })}
                  className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary"
                >
                  {compareA ? '↺ Set A' : '+ Save A'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCompareB({
                    hourlyRate: result.hourlyRate,
                    regularHours: result.regularHours,
                    overtimeHours: result.overtimeHours,
                    grossPeriod: result.grossPerPeriod,
                    netPeriod: result.netPayPerPeriod,
                    netYear: result.netPayPerYear,
                    label: `${formatCurrency(result.hourlyRate)}/hr (${result.regularHours}h)`
                  })}
                  className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600"
                >
                  {compareB ? '↺ Set B' : '+ Save B'}
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Gross/Period', value: formatCurrency(result.grossPerPeriod), color: '' },
                { label: 'Deductions/Period', value: formatCurrency(result.totalDeductionsPerPeriod), color: 'text-red-500' },
                { label: 'Net/Year', value: formatCurrency(result.netPayPerYear), color: 'text-emerald-600' },
                { label: 'Eff. Hourly Rate', value: formatCurrency(result.effectiveHourlyRate) + '/hr', color: 'text-emerald-600' },
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
                  <p
                    className={`text-base sm:text-lg font-bold ${item.color}`}
                  >
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Gross vs Net Pie Chart */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <PieChartIcon className="h-4.5 w-4.5 text-primary" />
                Gross Pay Breakdown (Per Period)
              </p>
              <div className="h-72 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Net Pay', value: result.netPayPerPeriod, color: '#10b981' },
                        { name: 'Federal Tax', value: result.federalTax, color: '#ef4444' },
                        ...(result.stateTax > 0 ? [{ name: 'State Tax', value: result.stateTax, color: '#f97316' }] : []),
                        ...(result.fica > 0 ? [{ name: 'FICA', value: result.fica, color: '#3b82f6' }] : []),
                        ...(result.otherDeductions > 0 ? [{ name: 'Other Deductions', value: result.otherDeductions, color: '#8b5cf6' }] : []),
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        { name: 'Net Pay', value: result.netPayPerPeriod, color: '#10b981' },
                        { name: 'Federal Tax', value: result.federalTax, color: '#ef4444' },
                        ...(result.stateTax > 0 ? [{ name: 'State Tax', value: result.stateTax, color: '#f97316' }] : []),
                        ...(result.fica > 0 ? [{ name: 'FICA', value: result.fica, color: '#3b82f6' }] : []),
                        ...(result.otherDeductions > 0 ? [{ name: 'Other Deductions', value: result.otherDeductions, color: '#8b5cf6' }] : []),
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number) => [`${formatCurrency(value)}`, undefined]}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Deduction Breakdown */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Deduction Breakdown
              </p>
              <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">
                          Deduction
                        </th>
                        <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs">
                          Per Period
                        </th>
                        <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs">
                          Per Year
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      <tr className="bg-emerald-500/5">
                        <td className="px-4 py-2.5 font-semibold">
                          Gross Pay
                        </td>
                        <td className="text-right px-4 py-2.5 font-semibold text-emerald-600">
                          {formatCurrency(result.grossPerPeriod)}
                        </td>
                        <td className="text-right px-4 py-2.5 font-semibold text-emerald-600">
                          {formatCurrency(result.grossPerYear)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5">Federal Tax</td>
                        <td className="text-right px-4 py-2.5 text-red-500">
                          −{formatCurrency(result.federalTax)}
                        </td>
                        <td className="text-right px-4 py-2.5 text-red-500">
                          −{formatCurrency(result.federalTax * result.periodsPerYear)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5">State Tax</td>
                        <td className="text-right px-4 py-2.5 text-red-500">
                          −{formatCurrency(result.stateTax)}
                        </td>
                        <td className="text-right px-4 py-2.5 text-red-500">
                          −{formatCurrency(result.stateTax * result.periodsPerYear)}
                        </td>
                      </tr>
                      {result.fica > 0 && (
                        <tr>
                          <td className="px-4 py-2.5">
                            FICA (SS 6.2% + Med 1.45%)
                          </td>
                          <td className="text-right px-4 py-2.5 text-red-500">
                            −{formatCurrency(result.fica)}
                          </td>
                          <td className="text-right px-4 py-2.5 text-red-500">
                            −{formatCurrency(result.fica * result.periodsPerYear)}
                          </td>
                        </tr>
                      )}
                      {result.otherDeductions > 0 && (
                        <tr>
                          <td className="px-4 py-2.5">Other Deductions</td>
                          <td className="text-right px-4 py-2.5 text-red-500">
                            −{formatCurrency(result.otherDeductions)}
                          </td>
                          <td className="text-right px-4 py-2.5 text-red-500">
                            −{formatCurrency(result.otherDeductions * result.periodsPerYear)}
                          </td>
                        </tr>
                      )}
                      <tr className="bg-emerald-500/10 font-bold">
                        <td className="px-4 py-2.5">Net Pay</td>
                        <td className="text-right px-4 py-2.5 text-emerald-600">
                          {formatCurrency(result.netPayPerPeriod)}
                        </td>
                        <td className="text-right px-4 py-2.5 text-emerald-600">
                          {formatCurrency(result.netPayPerYear)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Effective Rate Comparison */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Hourly Rate: Gross vs After-Tax
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Gross Hourly Rate
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(result.hourlyRate)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.totalHoursPerWeek.toFixed(1)} hrs/week
                  </p>
                </div>
                <div className="rounded-xl bg-background border border-emerald-500/30 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Effective Hourly Rate
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(result.effectiveHourlyRate)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    After all taxes & deductions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16 shrink-0 text-right">
                  After Tax
                </span>
                <div className="flex-1 h-6 rounded-lg bg-muted/60 relative overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{
                      width: `${Math.max(
                        (result.effectiveHourlyRate / result.hourlyRate) * 100,
                        3
                      )}%`,
                    }}
                    transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-lg bg-gradient-to-r from-emerald-400/50 to-emerald-500/50 flex items-center justify-end pr-3"
                  >
                    <span className="text-xs font-semibold text-emerald-700 whitespace-nowrap">
                      {(
                        (result.effectiveHourlyRate / result.hourlyRate) *
                        100
                      ).toFixed(1)}
                      % of gross
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                <strong>Effective hourly rate</strong> is your annual net
                take-home pay divided by total annual hours worked (
                {result.totalHoursPerWeek.toFixed(1)} hrs/week × 52 weeks ={' '}
                {(result.totalHoursPerWeek * 52).toFixed(0)} hrs/year). This
                shows your true hourly earnings after all taxes and deductions.
                Tax withholding uses flat rates for simplicity — your actual
                withholding may vary based on progressive brackets and W-4
                elections.
              </p>
            </div>
          </div>
        </motion.div>
      )}
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Hourly Rate',     valueA: formatCurrency(compareA.hourlyRate),     valueB: formatCurrency(compareB.hourlyRate),     numA: compareA.hourlyRate,     numB: compareB.hourlyRate },
          { label: 'Regular Hours',   valueA: `${compareA.regularHours}h`,             valueB: `${compareB.regularHours}h`,             numA: compareA.regularHours,   numB: compareB.regularHours },
          { label: 'Overtime Hours',  valueA: `${compareA.overtimeHours}h`,            valueB: `${compareB.overtimeHours}h`,            numA: compareA.overtimeHours,  numB: compareB.overtimeHours },
          { label: 'Gross Pay (Period)', valueA: formatCurrency(compareA.grossPeriod),  valueB: formatCurrency(compareB.grossPeriod),  numA: compareA.grossPeriod,    numB: compareB.grossPeriod },
          { label: 'Net Pay (Period)',   valueA: formatCurrency(compareA.netPeriod),    valueB: formatCurrency(compareB.netPeriod),    numA: compareA.netPeriod,      numB: compareB.netPeriod },
          { label: 'Net Pay (Year)',     valueA: formatCurrency(compareA.netYear),      valueB: formatCurrency(compareB.netYear),      numA: compareA.netYear,        numB: compareB.netYear },
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel
              rows={rows}
              labelA={compareA.label}
              labelB={compareB.label}
              onClear={() => { setCompareA(null); setCompareB(null); }}
              onSwap={() => { const tmp = compareA; setCompareA(compareB); setCompareB(tmp); }}
            />
          </div>
        );
      })()}

      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </div>
  );
}
