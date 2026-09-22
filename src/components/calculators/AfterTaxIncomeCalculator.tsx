'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, DollarSign, TrendingDown, Info, PieChart as PieChartIcon } from 'lucide-react';
import TryExample from './TryExample';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

// ---------------------------------------------------------------------------
// 2025 Federal Tax Brackets
// ---------------------------------------------------------------------------

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

const FEDERAL_BRACKETS_2025: Record<string, TaxBracket[]> = {
  single: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
  married: [
    { min: 0, max: 23850, rate: 0.10 },
    { min: 23850, max: 96950, rate: 0.12 },
    { min: 96950, max: 206700, rate: 0.22 },
    { min: 206700, max: 394600, rate: 0.24 },
    { min: 394600, max: 501050, rate: 0.32 },
    { min: 501050, max: 751600, rate: 0.35 },
    { min: 751600, max: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { min: 0, max: 17000, rate: 0.10 },
    { min: 17000, max: 64850, rate: 0.12 },
    { min: 64850, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250500, rate: 0.32 },
    { min: 250500, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
};

// ---------------------------------------------------------------------------
// FICA Constants (2025)
// ---------------------------------------------------------------------------

const SS_WAGE_CAP = 176100;
const SS_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const ADDITIONAL_MEDICARE_THRESHOLD = 200000;
const ADDITIONAL_MEDICARE_RATE = 0.009;

// ---------------------------------------------------------------------------
// Pay frequency conversion helpers
// ---------------------------------------------------------------------------

type PayFrequency = 'annual' | 'monthly' | 'biweekly' | 'weekly' | 'hourly';

function toAnnualGross(amount: number, frequency: PayFrequency, hoursPerWeek: number): number {
  switch (frequency) {
    case 'annual':
      return amount;
    case 'monthly':
      return amount * 12;
    case 'biweekly':
      return amount * 26;
    case 'weekly':
      return amount * 52;
    case 'hourly':
      return amount * hoursPerWeek * 52;
  }
}

// ---------------------------------------------------------------------------
// Tax Calculation
// ---------------------------------------------------------------------------

function calculateFederalTax(grossIncome: number, filingStatus: string): number {
  const brackets = FEDERAL_BRACKETS_2025[filingStatus] ?? FEDERAL_BRACKETS_2025.single;
  let tax = 0;

  for (const bracket of brackets) {
    if (grossIncome <= bracket.min) break;
    const taxableInBracket = Math.min(grossIncome, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }

  return tax;
}

function calculateSocialSecurity(grossIncome: number): number {
  return Math.min(grossIncome, SS_WAGE_CAP) * SS_RATE;
}

function calculateMedicare(grossIncome: number): number {
  let medicare = grossIncome * MEDICARE_RATE;
  if (grossIncome > ADDITIONAL_MEDICARE_THRESHOLD) {
    medicare += (grossIncome - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE;
  }
  return medicare;
}

interface TaxResults {
  grossAnnual: number;
  grossMonthly: number;
  grossBiweekly: number;
  grossWeekly: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  additionalDeductionsAnnual: number;
  totalDeductions: number;
  netAnnual: number;
  netMonthly: number;
  netBiweekly: number;
  netWeekly: number;
  netDaily: number;
  effectiveTaxRate: number;
}

interface IncomeSnapshot {
  gross: number;
  net: number;
  taxes: number;
  effectiveRate: number;
  label: string;
}

function calculateTaxResults(
  grossAnnual: number,
  filingStatus: string,
  stateRate: number,
  additionalDeductionsMonthly: number,
): TaxResults {
  const federalTax = calculateFederalTax(grossAnnual, filingStatus);
  const stateTax = grossAnnual * (stateRate / 100);
  const socialSecurity = calculateSocialSecurity(grossAnnual);
  const medicare = calculateMedicare(grossAnnual);
  const additionalDeductionsAnnual = additionalDeductionsMonthly * 12;
  const totalDeductions =
    federalTax + stateTax + socialSecurity + medicare + additionalDeductionsAnnual;

  const netAnnual = Math.max(0, grossAnnual - totalDeductions);

  return {
    grossAnnual,
    grossMonthly: grossAnnual / 12,
    grossBiweekly: grossAnnual / 26,
    grossWeekly: grossAnnual / 52,
    federalTax,
    stateTax,
    socialSecurity,
    medicare,
    additionalDeductionsAnnual,
    totalDeductions,
    netAnnual,
    netMonthly: netAnnual / 12,
    netBiweekly: netAnnual / 26,
    netWeekly: netAnnual / 52,
    netDaily: netAnnual / 260,
    effectiveTaxRate: grossAnnual > 0 ? (totalDeductions / grossAnnual) * 100 : 0,
  };
}

// ---------------------------------------------------------------------------
// Formatter
// ---------------------------------------------------------------------------

function fmt(n: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ---------------------------------------------------------------------------
// State Tax Preset Buttons
// ---------------------------------------------------------------------------

const STATE_PRESETS = [
  { label: 'TX / FL (0%)', value: 0 },
  { label: '3%', value: 3 },
  { label: '4%', value: 4 },
  { label: '5%', value: 5 },
  { label: '7%', value: 7 },
  { label: '9.3%', value: 9.3 },
  { label: '10%', value: 10 },
  { label: '13%', value: 13 },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

import { Variants } from 'framer-motion';

import UnitToggle from './UnitToggle';
const resultVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: 'easeOut' },
  }),
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AfterTaxIncomeCalculator() {
  // ---- Input State ----
  const [incomeAmount, setIncomeAmount] = useState<string>('75000');
  const [payFrequency, setPayFrequency] = useState<PayFrequency>('annual');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  const [filingStatus, setFilingStatus] = useState<string>('single');
  const [stateTaxRate, setStateTaxRate] = useState<string>('9.3');
  const [additionalDeductions, setAdditionalDeductions] = useState<string>('0');
  const [showResults, setShowResults] = useState<boolean>(false);

  // Comparison State
  const [compareA, setCompareA] = useState<IncomeSnapshot | null>(null);
  const [compareB, setCompareB] = useState<IncomeSnapshot | null>(null);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ incomeAmount: string; payFrequency: string; filingStatus: string; stateTaxRate: string }>('after-tax-income-calculator');

  // ---- Computed Results ----
  const results = useMemo<TaxResults | null>(() => {
    const amount = parseFloat(incomeAmount);
    const hpw = parseFloat(hoursPerWeek) || 0;
    const stateRate = parseFloat(stateTaxRate) || 0;
    const deductions = parseFloat(additionalDeductions) || 0;

    if (!amount || amount <= 0) return null;
    if (payFrequency === 'hourly' && hpw <= 0) return null;

    const grossAnnual = toAnnualGross(amount, payFrequency, hpw);
    return calculateTaxResults(grossAnnual, filingStatus, stateRate, deductions);
  }, [incomeAmount, payFrequency, hoursPerWeek, filingStatus, stateTaxRate, additionalDeductions]);

    const handleTryExample = () => {
    setIncomeAmount('75000');
    setPayFrequency('annual');
    setHoursPerWeek('40');
    setFilingStatus('single');
    setStateTaxRate('5');
    setAdditionalDeductions('0');
    
    setShowResults(false);
  };

  const handleCalculate = () => {
    setShowResults(true);
    if (results) {
      saveEntry(
        { incomeAmount, payFrequency, filingStatus, stateTaxRate },
        `${payFrequency} $${incomeAmount} — Net: $${(results.netAnnual).toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr (${results.effectiveTaxRate.toFixed(1)}% effective)`
      );
    }
  };

  const handleRestore = (inputs: { incomeAmount: string; payFrequency: string; filingStatus: string; stateTaxRate: string }) => {
    setIncomeAmount(inputs.incomeAmount);
    setPayFrequency(inputs.payFrequency as PayFrequency);
    setFilingStatus(inputs.filingStatus);
    setStateTaxRate(inputs.stateTaxRate);
    setShowResults(false);
  };

  // ---- Filing status display label ----
  const filingStatusLabels: Record<string, string> = {
    single: 'Single',
    married: 'Married Filing Jointly',
    head_of_household: 'Head of Household',
  };

  // ---- Effective bracket breakdown for tooltip ----
  const bracketBreakdown = useMemo(() => {
    if (!results) return null;
    const brackets = FEDERAL_BRACKETS_2025[filingStatus] ?? FEDERAL_BRACKETS_2025.single;
    return brackets
      .filter((b) => results.grossAnnual > b.min)
      .map((b) => {
        const taxableInBracket = Math.min(results.grossAnnual, b.max) - b.min;
        return `  ${(b.rate * 100).toFixed(0)}% on ${fmt(taxableInBracket)} = ${fmt(taxableInBracket * b.rate)}`;
      })
      .join('\n');
  }, [results, filingStatus]);

  // ------ Render ------

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ================================================================= */}
        {/* Input Section                                                      */}
        {/* ================================================================= */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Income Details</h2>
          </div>

          {/* Pay Frequency Selector */}
          <div className="space-y-2">
            <Label htmlFor="pay-frequency">Pay Frequency</Label>
            <Select
              value={payFrequency}
              onValueChange={(val) => setPayFrequency(val as PayFrequency)}
            >
              <SelectTrigger id="pay-frequency" className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual">Annual Salary</SelectItem>
                <SelectItem value="monthly">Monthly Pay</SelectItem>
                <SelectItem value="biweekly">Bi-Weekly Pay</SelectItem>
                <SelectItem value="weekly">Weekly Pay</SelectItem>
                <SelectItem value="hourly">Hourly Wage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Income Amount */}
          <div className="space-y-2">
            <Label htmlFor="income-amount">
              {payFrequency === 'hourly' ? 'Hourly Wage ($)' : `Gross Income ($)`}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                $
              </span>
              <Input
                id="income-amount"
                type="number"
                min="0"
                step="any"
                placeholder={
                  payFrequency === 'hourly' ? 'e.g. 26.44' : 'e.g. 75000'
                }
                value={incomeAmount}
                onChange={(e) => {
                  setIncomeAmount(e.target.value);
                  setShowResults(false);
                }}
                className="pl-7"
              />
            </div>
          </div>

          {/* Hours Per Week (only for hourly) */}
          {payFrequency === 'hourly' && (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Label htmlFor="hours-per-week">Hours Per Week</Label>
              <Input
                id="hours-per-week"
                type="number"
                min="0"
                max="168"
                step="1"
                placeholder="e.g. 40"
                value={hoursPerWeek}
                onChange={(e) => {
                  setHoursPerWeek(e.target.value);
                  setShowResults(false);
                }}
              />
            </motion.div>
          )}

          {/* Filing Status */}
          <div className="space-y-2">
            <Label htmlFor="filing-status">Filing Status</Label>
            <Select value={filingStatus} onValueChange={setFilingStatus}>
              <SelectTrigger id="filing-status" className="w-full">
                <SelectValue placeholder="Select filing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married Filing Jointly</SelectItem>
                <SelectItem value="head_of_household">Head of Household</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* State Tax Rate */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="state-tax-rate">State Tax Rate (%)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">
                      Enter your effective state income tax rate. Use preset buttons for common
                      states or enter a custom value. Some states like Texas, Florida, and Nevada
                      have 0% state income tax.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="state-tax-rate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="e.g. 9.3"
              value={stateTaxRate}
              onChange={(e) => {
                setStateTaxRate(e.target.value);
                setShowResults(false);
              }}
            />
            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {STATE_PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  variant={parseFloat(stateTaxRate) === preset.value ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-xs px-2.5"
                  onClick={() => {
                    setStateTaxRate(String(preset.value));
                    setShowResults(false);
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Additional Deductions */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="additional-deductions">Additional Deductions ($ / month)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-xs">
                      Enter monthly pre-tax deductions such as health insurance premiums, 401(k)
                      contributions, HSA contributions, or other payroll deductions.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                $
              </span>
              <Input
                id="additional-deductions"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 200"
                value={additionalDeductions}
                onChange={(e) => {
                  setAdditionalDeductions(e.target.value);
                  setShowResults(false);
                }}
                className="pl-7"
              />
            </div>
          </div>

          {/* Calculate Button */}
          
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6">
            <TryExample onClick={handleTryExample} />
            <Button
            onClick={handleCalculate}
            className=" h-11 text-base font-semibold "
          >
            Calculate After-Tax Income
          </Button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Results Section                                                    */}
        {/* ================================================================= */}
        {showResults && results && (
          <motion.div
            className="space-y-6 pt-2 px-4 sm:px-6 pb-4 sm:pb-6"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
          {/* UnitToggle — show pay-period equivalents */}
            {(() => {
              const _sal = parseFloat(incomeAmount) || 0;
              if (!_sal) return null;
              const _periods = payFrequency === 'annual' ? 1 : payFrequency === 'monthly' ? 12 : payFrequency === 'biweekly' ? 26 : payFrequency === 'weekly' ? 52 : 2080;
              const _ann = payFrequency === 'annual' ? _sal : payFrequency === 'hourly' ? _sal * 2080 : _sal * _periods;
              return (
                <div className="mt-3 mb-1">
                  <UnitToggle annualSalary={_ann} />
                </div>
              );
            })()}

            {/* Divider */}
            <div className="border-t" />

            {/* ---- Visual Income Breakdown Chart ---- */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <PieChartIcon className="h-4.5 w-4.5 text-primary" />
                Income Breakdown
              </h3>
              <div className="h-72 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Take-Home Pay', value: results.netAnnual, color: '#10b981' },
                        { name: 'Federal Tax', value: results.federalTax, color: '#ef4444' },
                        ...(results.stateTax > 0 ? [{ name: 'State Tax', value: results.stateTax, color: '#f97316' }] : []),
                        { name: 'Social Security', value: results.socialSecurity, color: '#3b82f6' },
                        { name: 'Medicare', value: results.medicare, color: '#6366f1' },
                        ...(results.additionalDeductionsAnnual > 0 ? [{ name: 'Other Deductions', value: results.additionalDeductionsAnnual, color: '#8b5cf6' }] : []),
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        { name: 'Take-Home Pay', value: results.netAnnual, color: '#10b981' },
                        { name: 'Federal Tax', value: results.federalTax, color: '#ef4444' },
                        ...(results.stateTax > 0 ? [{ name: 'State Tax', value: results.stateTax, color: '#f97316' }] : []),
                        { name: 'Social Security', value: results.socialSecurity, color: '#3b82f6' },
                        { name: 'Medicare', value: results.medicare, color: '#6366f1' },
                        ...(results.additionalDeductionsAnnual > 0 ? [{ name: 'Other Deductions', value: results.additionalDeductionsAnnual, color: '#8b5cf6' }] : []),
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number) => [`$${fmt(value)}`, undefined]}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ---- Gross Income Breakdown ---- */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <DollarSign className="h-4.5 w-4.5 text-primary" />
                Gross Income Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Annual', value: results.grossAnnual },
                  { label: 'Monthly', value: results.grossMonthly },
                  { label: 'Bi-Weekly', value: results.grossBiweekly },
                  { label: 'Weekly', value: results.grossWeekly },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="rounded-xl bg-muted/40 p-3 text-center"
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={resultVariants}
                  >
                    <div className="text-xs text-muted-foreground mb-0.5">{item.label}</div>
                    <div className="text-sm font-semibold">${fmt(item.value)}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ---- Tax Breakdown ---- */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <TrendingDown className="h-4.5 w-4.5 text-primary" />
                Tax &amp; Deduction Breakdown
              </h3>
              <div className="space-y-2">
                {[
                  {
                    label: 'Federal Income Tax',
                    value: results.federalTax,
                    pct: results.grossAnnual > 0 ? (results.federalTax / results.grossAnnual) * 100 : 0,
                    tooltip: bracketBreakdown,
                  },
                  {
                    label: 'State Income Tax',
                    value: results.stateTax,
                    pct: results.grossAnnual > 0 ? (results.stateTax / results.grossAnnual) * 100 : 0,
                    tooltip: `${parseFloat(stateTaxRate) || 0}% of gross income`,
                  },
                  {
                    label: 'Social Security (6.2%)',
                    value: results.socialSecurity,
                    pct: results.grossAnnual > 0 ? (results.socialSecurity / results.grossAnnual) * 100 : 0,
                    tooltip: `6.2% on first $${SS_WAGE_CAP.toLocaleString()} of earnings`,
                  },
                  {
                    label: 'Medicare (1.45%)',
                    value: results.medicare,
                    pct: results.grossAnnual > 0 ? (results.medicare / results.grossAnnual) * 100 : 0,
                    tooltip:
                      '1.45% on all earnings' +
                      (results.grossAnnual > ADDITIONAL_MEDICARE_THRESHOLD
                        ? ` + 0.9% on earnings over $${ADDITIONAL_MEDICARE_THRESHOLD.toLocaleString()}`
                        : ''),
                  },
                  {
                    label: 'Additional Deductions',
                    value: results.additionalDeductionsAnnual,
                    pct:
                      results.grossAnnual > 0
                        ? (results.additionalDeductionsAnnual / results.grossAnnual) * 100
                        : 0,
                    tooltip: `$${fmt(parseFloat(additionalDeductions) || 0)}/month × 12 months`,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5"
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={resultVariants}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm truncate">{item.label}</span>
                      {item.tooltip && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 text-muted-foreground/60 cursor-help shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <pre className="text-xs whitespace-pre-wrap font-sans">
                                {item.tooltip}
                              </pre>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {item.pct.toFixed(1)}%
                      </Badge>
                      <span className="text-sm font-semibold w-24 text-right">
                        -${fmt(item.value)}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {/* Total Deductions Row */}
                <motion.div
                  className="flex items-center justify-between rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 px-3 py-3"
                  custom={6}
                  initial="hidden"
                  animate="visible"
                  variants={resultVariants}
                >
                  <span className="text-sm font-bold">Total Deductions</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="destructive" className="text-xs">
                      {results.effectiveTaxRate.toFixed(1)}%
                    </Badge>
                    <span className="text-sm font-bold w-24 text-right">
                      -${fmt(results.totalDeductions)}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* ---- Net Take-Home Pay ---- */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Wallet className="h-4.5 w-4.5 text-emerald-500" />
                  Net Take-Home Pay
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCompareA({
                      gross: results.grossAnnual,
                      net: results.netAnnual,
                      taxes: results.totalDeductions,
                      effectiveRate: results.effectiveTaxRate,
                      label: `${formatCurrency(results.grossAnnual)} Gross`
                    })}
                    className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary"
                  >
                    {compareA ? '↺ Set A' : '+ Save A'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCompareB({
                      gross: results.grossAnnual,
                      net: results.netAnnual,
                      taxes: results.totalDeductions,
                      effectiveRate: results.effectiveTaxRate,
                      label: `${formatCurrency(results.grossAnnual)} Gross`
                    })}
                    className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600"
                  >
                    {compareB ? '↺ Set B' : '+ Save B'}
                  </Button>
                </div>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Annual', value: results.netAnnual },
                  { label: 'Monthly', value: results.netMonthly },
                  { label: 'Bi-Weekly', value: results.netBiweekly },
                  { label: 'Weekly', value: results.netWeekly },
                  { label: 'Daily (260 days)', value: results.netDaily },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 p-3 text-center"
                    custom={i + 7}
                    initial="hidden"
                    animate="visible"
                    variants={resultVariants}
                  >
                    <div className="text-xs text-muted-foreground mb-0.5">{item.label}</div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      ${fmt(item.value)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ---- Summary Card ---- */}
            <motion.div
              className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 p-5 space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Filing Status
                </span>
                <span className="text-sm font-semibold">
                  {filingStatusLabels[filingStatus] ?? 'Single'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Effective Tax Rate
                </span>
                <span className="text-sm font-semibold">{results.effectiveTaxRate.toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Monthly Take-Home
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  ${fmt(results.netMonthly)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                Based on 2025 federal tax brackets. This is an estimate and does not account for
                all possible deductions, credits, or state-specific rules. Consult a tax professional
                for personalized advice.
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Gross Annual Income', valueA: formatCurrency(compareA.gross), valueB: formatCurrency(compareB.gross), numA: compareA.gross, numB: compareB.gross },
          { label: 'Net Annual Income',   valueA: formatCurrency(compareA.net),   valueB: formatCurrency(compareB.net),   numA: compareA.net,   numB: compareB.net },
          { label: 'Total Taxes & Ded.',  valueA: formatCurrency(compareA.taxes), valueB: formatCurrency(compareB.taxes), numA: compareA.taxes, numB: compareB.taxes, higherIsBetter: false },
          { label: 'Effective Tax Rate',  valueA: formatPercent(compareA.effectiveRate), valueB: formatPercent(compareB.effectiveRate), numA: compareA.effectiveRate, numB: compareB.effectiveRate, higherIsBetter: false },
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
