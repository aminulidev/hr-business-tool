'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Banknote,
  DollarSign,
  Clock,
  Info,
  Plus,
  Trash2,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PayPeriod = 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';

interface WageEntry {
  id: number;
  hourlyRate: string;
  regularHours: string;
  overtimeHours: string;
  doubleTimeHours: string;
}

interface WagesResult {
  entries: {
    hourlyRate: number;
    regularHours: number;
    overtimeHours: number;
    doubleTimeHours: number;
    regularPay: number;
    overtimePay: number;
    doubleTimePay: number;
    subtotal: number;
  }[];
  grossPerPeriod: number;
  grossPerWeek: number;
  grossPerBiWeekly: number;
  grossPerSemiMonthly: number;
  grossPerMonth: number;
  grossPerYear: number;
  overtimeMultiplier: number;
  doubleTimeMultiplier: number;
  payPeriod: PayPeriod;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const PERIOD_MULTIPLIERS: Record<PayPeriod, number> = {
  weekly: 52,
  'bi-weekly': 26,
  'semi-monthly': 24,
  monthly: 12,
};

const PERIOD_LABELS: Record<PayPeriod, string> = {
  weekly: 'Weekly',
  'bi-weekly': 'Bi-Weekly',
  'semi-monthly': 'Semi-Monthly',
  monthly: 'Monthly',
};

let nextId = 1;
function createEntry(): WageEntry {
  return {
    id: nextId++,
    hourlyRate: '',
    regularHours: '40',
    overtimeHours: '0',
    doubleTimeHours: '0',
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WagesCalculator() {
  const [entries, setEntries] = useState<WageEntry[]>([createEntry()]);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState('1.5');
  const [doubleTimeMultiplier, setDoubleTimeMultiplier] = useState('2');
  const [payPeriod, setPayPeriod] = useState<PayPeriod>('weekly');
  const [result, setResult] = useState<WagesResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateEntry = (id: number, field: keyof WageEntry, value: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
    setResult(null);
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, createEntry()]);
    setResult(null);
  };

  const removeEntry = (id: number) => {
    if (entries.length <= 1) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setResult(null);
  };

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    const otMult = parseFloat(overtimeMultiplier);
    const dtMult = parseFloat(doubleTimeMultiplier);

    if (isNaN(otMult) || otMult <= 0) {
      setError('Please enter a valid overtime multiplier greater than zero.');
      return;
    }
    if (isNaN(dtMult) || dtMult <= 0) {
      setError('Please enter a valid double-time multiplier greater than zero.');
      return;
    }

    const calcEntries: WagesResult['entries'] = [];
    let totalPeriod = 0;

    for (const entry of entries) {
      const rate = parseFloat(entry.hourlyRate);
      const regHrs = parseFloat(entry.regularHours);
      const otHrs = parseFloat(entry.overtimeHours);
      const dtHrs = parseFloat(entry.doubleTimeHours);

      if (isNaN(rate) || rate <= 0) {
        setError('Please enter a valid hourly rate greater than zero for each row.');
        return;
      }
      if (isNaN(regHrs) || regHrs < 0) {
        setError('Regular hours cannot be negative.');
        return;
      }
      if (isNaN(otHrs) || otHrs < 0) {
        setError('Overtime hours cannot be negative.');
        return;
      }
      if (isNaN(dtHrs) || dtHrs < 0) {
        setError('Double-time hours cannot be negative.');
        return;
      }

      const regularPay = regHrs * rate;
      const overtimePay = otHrs * rate * otMult;
      const doubleTimePay = dtHrs * rate * dtMult;
      const subtotal = regularPay + overtimePay + doubleTimePay;

      calcEntries.push({
        hourlyRate: rate,
        regularHours: regHrs,
        overtimeHours: otHrs,
        doubleTimeHours: dtHrs,
        regularPay,
        overtimePay,
        doubleTimePay,
        subtotal,
      });

      totalPeriod += subtotal;
    }

    const periodMultiplier = PERIOD_MULTIPLIERS[payPeriod];
    const grossPerYear = totalPeriod * periodMultiplier;
    const grossPerWeek = grossPerYear / 52;
    const grossPerBiWeekly = grossPerYear / 26;
    const grossPerSemiMonthly = grossPerYear / 24;
    const grossPerMonth = grossPerYear / 12;

    setResult({
      entries: calcEntries,
      grossPerPeriod: totalPeriod,
      grossPerWeek,
      grossPerBiWeekly,
      grossPerSemiMonthly,
      grossPerMonth,
      grossPerYear,
      overtimeMultiplier: otMult,
      doubleTimeMultiplier: dtMult,
      payPeriod,
    });
  };

  const handleReset = () => {
    nextId = 1;
    setEntries([createEntry()]);
    setOvertimeMultiplier('1.5');
    setDoubleTimeMultiplier('2');
    setPayPeriod('weekly');
    setResult(null);
    setError(null);
  };

  // ------ SEO content ------

  const howToSteps = [
    'Enter your hourly rate and the number of regular hours you work per week in the first row. This is your standard pay at the base rate.',
    'Optionally, enter any overtime hours (hours worked beyond the regular schedule) and double-time hours. The default multipliers are 1.5x for overtime and 2x for double-time.',
    'If you have multiple hourly rates — for example, different shifts or roles — click "Add Rate Row" to add additional entries. Each row can have its own rate and hours.',
    'Select your pay period (weekly, bi-weekly, semi-monthly, or monthly) to see wages converted to per-period, monthly, and annual equivalents.',
    'Click "Calculate Wages" to see a detailed breakdown of regular pay, overtime pay, double-time pay, and equivalent earnings across all pay periods.',
  ];

  const formula =
    'Gross Wages = (Regular Hours × Rate) + (OT Hours × Rate × OT Multiplier) + (DT Hours × Rate × DT Multiplier)';

  const formulaDescription =
    'Your gross wages are the sum of pay from all work categories: regular hours at the base rate, overtime hours at a premium multiplier (typically 1.5x by federal law), and double-time hours at an even higher multiplier (typically 2x, required in some states for hours worked beyond a daily threshold). Each pay category is calculated independently and summed to arrive at total gross wages per pay period. To convert to annual wages, multiply the per-period amount by the number of pay periods per year (52 for weekly, 26 for bi-weekly, 24 for semi-monthly, and 12 for monthly).';

  const workedExamples = [
    {
      title: 'Standard 40-Hour Week at $25/hr',
      description:
        'An employee earning $25.00 per hour works 40 regular hours with no overtime. Regular pay = 40 × $25.00 = $1,000.00. With weekly pay periods (52 per year), the annual wages are $1,000.00 × 52 = $52,000.00. The equivalent monthly gross is $4,333.33 and bi-weekly gross is $2,000.00.',
    },
    {
      title: '50-Hour Week with Overtime at $30/hr',
      description:
        'An employee earning $30.00 per hour works 40 regular hours plus 10 overtime hours at 1.5x. Regular pay = 40 × $30.00 = $1,200.00. Overtime pay = 10 × $30.00 × 1.5 = $450.00. Total weekly gross = $1,650.00. Annual wages (52 weeks) = $1,650.00 × 52 = $85,800.00. The overtime premium alone contributes $23,400.00 per year in additional earnings.',
    },
    {
      title: 'Multiple Rates: Day Shift + Night Shift',
      description:
        'An employee works two shifts per week: 20 hours at $20/hr (day shift) and 25 hours at $28/hr (night shift, including 5 overtime hours at 1.5x). Day shift pay = 20 × $20.00 = $400.00. Night shift regular = 20 × $28.00 = $560.00. Night shift overtime = 5 × $28.00 × 1.5 = $210.00. Total weekly gross = $400.00 + $560.00 + $210.00 = $1,170.00. Annual wages = $1,170.00 × 52 = $60,840.00.',
    },
  ];

  const faqs = [
    {
      question: 'What is the difference between wages and salary?',
      answer:
        'Wages are compensation calculated based on the number of hours worked multiplied by an hourly rate. If you work more hours, you earn more; fewer hours means less pay. Salary, on the other hand, is a fixed amount of compensation paid on a regular schedule (weekly, bi-weekly, or monthly) regardless of the exact hours worked. Salaried employees typically do not receive overtime pay for extra hours, while wage earners are generally entitled to overtime under the Fair Labor Standards Act (FLSA). Both can be exempt or non-exempt depending on job duties and salary thresholds.',
    },
    {
      question: 'How is overtime calculated?',
      answer:
        'Under the federal Fair Labor Standards Act (FLSA), overtime is calculated at 1.5 times the employee\'s regular hourly rate for all hours worked beyond 40 in a workweek. Some states have additional daily overtime rules — for example, California requires overtime (1.5x) after 8 hours in a single day and double-time (2x) after 12 hours. The formula is: Overtime Pay = Overtime Hours × Hourly Rate × 1.5. Some employers offer higher multipliers voluntarily, and certain industries (like healthcare) may have different overtime rules.',
    },
    {
      question: 'What is double time and when does it apply?',
      answer:
        'Double time means the employee is paid at twice their regular hourly rate (2.0x). While not required by federal law, several states mandate double time under specific conditions. California, for example, requires double-time pay for hours worked beyond 12 in a single day and for the first 8 hours worked on the 7th consecutive day of work. Some union contracts also specify double-time rates for holidays, weekends, or exceeding certain weekly thresholds. Always check your state labor laws and employment agreement.',
    },
    {
      question: 'What are the minimum wage laws in the US?',
      answer:
        'The federal minimum wage is $7.25 per hour (effective since July 2009). However, many states and cities have significantly higher minimums. As of 2025, states like California ($16.50/hr), Washington ($16.66/hr), and New York ($15.00-$16.00/hr depending on region) have much higher floors. Employers must pay the higher of the federal or applicable state/local minimum. Certain workers, such as tipped employees (minimum $2.13/hr federal cash wage), student workers, and certain agricultural workers, may have different minimums.',
    },
    {
      question: 'How do I calculate gross vs net wages?',
      answer:
        'Gross wages are your total earnings before any deductions — the full amount calculated from your hours worked and pay rate (including overtime and double-time). Net wages (also called "take-home pay") are what you actually receive after all deductions are subtracted. Deductions include federal and state income tax withholding, Social Security (6.2%), Medicare (1.45%), health insurance premiums, 401(k) contributions, garnishments, and any other post-tax deductions. To calculate net wages: Net = Gross − All Deductions. Use our Payroll Deduction Calculator for a detailed breakdown.',
    },
    {
      question: 'How are tipped employee wages calculated?',
      answer:
        'Tipped employees have a dual wage structure: a cash wage from the employer (federal minimum of $2.13/hr) plus tips from customers. The employer must ensure that the total of cash wage plus tips equals at least the federal minimum wage ($7.25/hr). If tips fall short, the employer must make up the difference. Many states have higher cash wage minimums for tipped workers. For overtime calculations, the regular rate for a tipped employee is generally the full minimum wage (not the cash wage), so the overtime rate is at least $10.875/hr federally (1.5 × $7.25). Some states require the overtime rate to include the tip credit differently.',
    },
  ];

  const relatedTools = [
    {
      slug: 'overtime',
      title: 'Overtime Calculator',
      description:
        'Calculate overtime pay with standard time-and-a-half and double-time rates',
      icon: 'Timer',
    },
    {
      slug: 'salary-converter',
      title: 'Salary Converter Calculator',
      description:
        'Convert between hourly, daily, weekly, bi-weekly, monthly, and annual pay rates',
      icon: 'ArrowLeftRight',
    },
    {
      slug: 'payroll',
      title: 'Payroll & Paycheck Calculator',
      description:
        'Estimate your take-home pay after federal and state taxes and deductions',
      icon: 'CreditCard',
    },
    {
      slug: 'hourly-paycheck',
      title: 'Hourly Paycheck Calculator',
      description:
        'Calculate your hourly paycheck after taxes and deductions',
      icon: 'BadgeDollarSign',
    },
    {
      slug: 'time-card',
      title: 'Time Card Calculator',
      description:
        'Calculate total work hours from clock-in/out times for payroll',
      icon: 'Clock',
    },
  ];

  // ------ Render ------

  return (
    <CalculatorLayout
      title="Wages Calculator"
      description="Calculate gross wages from hours worked and hourly rates, including overtime and double-time pay. Supports multiple pay rates."
      icon={<Banknote className="h-7 w-7 text-white" />}
      breadcrumbs={[{ label: 'Calculators' }, { label: 'Wages Calculator' }]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      howToSteps={howToSteps}
      formula={formula}
      formulaDescription={formulaDescription}
      workedExamples={workedExamples}
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <div className="p-4 sm:p-6 space-y-6">
        {/* Pay Period */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            <Clock className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Pay Period
          </Label>
          <Select
            value={payPeriod}
            onValueChange={(v) => {
              setPayPeriod(v as PayPeriod);
              setResult(null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly (52/year)</SelectItem>
              <SelectItem value="bi-weekly">Bi-Weekly (26/year)</SelectItem>
              <SelectItem value="semi-monthly">Semi-Monthly (24/year)</SelectItem>
              <SelectItem value="monthly">Monthly (12/year)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Multiplier Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="otMult" className="text-sm font-medium">
              OT Multiplier
            </Label>
            <Input
              id="otMult"
              type="number"
              min="0"
              step="0.1"
              value={overtimeMultiplier}
              onChange={(e) => {
                setOvertimeMultiplier(e.target.value);
                setResult(null);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Default 1.5x (time-and-a-half)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dtMult" className="text-sm font-medium">
              Double-Time Mult.
            </Label>
            <Input
              id="dtMult"
              type="number"
              min="0"
              step="0.1"
              value={doubleTimeMultiplier}
              onChange={(e) => {
                setDoubleTimeMultiplier(e.target.value);
                setResult(null);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Default 2x (double-time)
            </p>
          </div>
        </div>

        {/* Rate Entries */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Hourly Rate Entries
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEntry}
              className="gap-1.5 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Rate Row
            </Button>
          </div>

          {entries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  Rate #{idx + 1}
                </Badge>
                {entries.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`rate-${entry.id}`} className="text-xs font-medium">
                  Hourly Rate ($)
                </Label>
                <Input
                  id={`rate-${entry.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 25.00"
                  value={entry.hourlyRate}
                  onChange={(e) =>
                    updateEntry(entry.id, 'hourlyRate', e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label
                    htmlFor={`reg-${entry.id}`}
                    className="text-xs font-medium"
                  >
                    Reg Hours
                  </Label>
                  <Input
                    id={`reg-${entry.id}`}
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="40"
                    value={entry.regularHours}
                    onChange={(e) =>
                      updateEntry(entry.id, 'regularHours', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`ot-${entry.id}`}
                    className="text-xs font-medium"
                  >
                    OT Hours
                  </Label>
                  <Input
                    id={`ot-${entry.id}`}
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="0"
                    value={entry.overtimeHours}
                    onChange={(e) =>
                      updateEntry(entry.id, 'overtimeHours', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`dt-${entry.id}`}
                    className="text-xs font-medium"
                  >
                    DT Hours
                  </Label>
                  <Input
                    id={`dt-${entry.id}`}
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="0"
                    value={entry.doubleTimeHours}
                    onChange={(e) =>
                      updateEntry(entry.id, 'doubleTimeHours', e.target.value)
                    }
                  />
                </div>
              </div>
            </motion.div>
          ))}
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
          <Button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            <Banknote className="h-4 w-4 mr-2" />
            Calculate Wages
          </Button>
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
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            {/* Main Result */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Gross Wages per {PERIOD_LABELS[result.payPeriod].replace('-', '- ')} Period
              </p>
              <p className="text-4xl font-bold text-emerald-600">
                {formatCurrency(result.grossPerPeriod)}
              </p>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 px-3 py-1 text-sm font-medium"
              >
                {formatCurrency(result.grossPerYear)}/year
              </Badge>
            </div>

            {/* Equivalent Wages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Weekly', value: result.grossPerWeek },
                { label: 'Bi-Weekly', value: result.grossPerBiWeekly },
                { label: 'Semi-Monthly', value: result.grossPerSemiMonthly },
                { label: 'Monthly', value: result.grossPerMonth },
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
                  <p className="text-base sm:text-lg font-bold text-emerald-600">
                    {formatCurrency(item.value)}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Entry Breakdown Table */}
            {result.entries.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Pay Breakdown by Rate
                </p>
                <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/30">
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Rate
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Reg Hrs
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            OT Hrs
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            DT Hrs
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Regular
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            OT Pay
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            DT Pay
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {result.entries.map((entry, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2.5 font-medium">
                              {formatCurrency(entry.hourlyRate)}/hr
                            </td>
                            <td className="text-right px-3 py-2.5 text-muted-foreground">
                              {entry.regularHours}
                            </td>
                            <td className="text-right px-3 py-2.5 text-muted-foreground">
                              {entry.overtimeHours}
                            </td>
                            <td className="text-right px-3 py-2.5 text-muted-foreground">
                              {entry.doubleTimeHours}
                            </td>
                            <td className="text-right px-3 py-2.5">
                              {formatCurrency(entry.regularPay)}
                            </td>
                            <td className="text-right px-3 py-2.5 text-amber-600">
                              {formatCurrency(entry.overtimePay)}
                            </td>
                            <td className="text-right px-3 py-2.5 text-red-500">
                              {formatCurrency(entry.doubleTimePay)}
                            </td>
                            <td className="text-right px-3 py-2.5 font-semibold">
                              {formatCurrency(entry.subtotal)}
                            </td>
                          </tr>
                        ))}
                        {/* Totals */}
                        <tr className="bg-emerald-500/5 font-bold">
                          <td className="px-3 py-2.5" colSpan={4}>
                            Total
                          </td>
                          <td className="text-right px-3 py-2.5">
                            {formatCurrency(
                              result.entries.reduce((s, e) => s + e.regularPay, 0)
                            )}
                          </td>
                          <td className="text-right px-3 py-2.5 text-amber-600">
                            {formatCurrency(
                              result.entries.reduce((s, e) => s + e.overtimePay, 0)
                            )}
                          </td>
                          <td className="text-right px-3 py-2.5 text-red-500">
                            {formatCurrency(
                              result.entries.reduce(
                                (s, e) => s + e.doubleTimePay,
                                0
                              )
                            )}
                          </td>
                          <td className="text-right px-3 py-2.5 text-emerald-600">
                            {formatCurrency(result.grossPerPeriod)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Pay Category Breakdown */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <PieChartIcon className="h-4.5 w-4.5 text-primary" />
                Regular vs Overtime vs Double-Time
              </p>
              {(() => {
                const totalReg = result.entries.reduce(
                  (s, e) => s + e.regularPay,
                  0
                );
                const totalOT = result.entries.reduce(
                  (s, e) => s + e.overtimePay,
                  0
                );
                const totalDT = result.entries.reduce(
                  (s, e) => s + e.doubleTimePay,
                  0
                );

                const data = [
                  { name: 'Regular', value: totalReg, color: '#10b981' },
                  ...(totalOT > 0 ? [{ name: 'Overtime', value: totalOT, color: '#f59e0b' }] : []),
                  ...(totalDT > 0 ? [{ name: 'Double-Time', value: totalDT, color: '#ef4444' }] : []),
                ];

                return (
                  <div className="h-72 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={85}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
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
                );
              })()}
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                <strong>Note:</strong> These calculations show gross wages before any
                tax withholding or deductions. Your actual take-home pay will be
                lower after federal/state taxes, Social Security (6.2%), Medicare
                (1.45%), and any benefit contributions. Use our{' '}
                <strong>Payroll Deduction Calculator</strong> to estimate net pay.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </CalculatorLayout>
  );
}
