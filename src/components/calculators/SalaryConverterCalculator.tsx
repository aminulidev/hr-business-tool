'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, DollarSign, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

type PayPeriod =
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'semimonthly'
  | 'monthly'
  | 'annual';

interface PeriodResult {
  key: PayPeriod;
  label: string;
  amount: number;
  hoursPerPeriod: string;
  description: string;
}

const periodLabels: Record<PayPeriod, string> = {
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
  biweekly: 'Bi-Weekly',
  semimonthly: 'Semi-Monthly',
  monthly: 'Monthly',
  annual: 'Annual',
};

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// ---------------------------------------------------------------------------
// Conversion Logic
// ---------------------------------------------------------------------------

function convertToAnnual(
  amount: number,
  period: PayPeriod,
  hoursPerWeek: number
): number {
  const annualHours = hoursPerWeek * 52;
  switch (period) {
    case 'hourly':
      return amount * annualHours;
    case 'daily':
      return amount * (annualHours / 8);
    case 'weekly':
      return amount * 52;
    case 'biweekly':
      return amount * 26;
    case 'semimonthly':
      return amount * 24;
    case 'monthly':
      return amount * 12;
    case 'annual':
      return amount;
    default:
      return amount;
  }
}

function annualToAllPeriods(
  annual: number,
  hoursPerWeek: number
): PeriodResult[] {
  const annualHours = hoursPerWeek * 52;
  const weeklyHours = hoursPerWeek;

  return [
    {
      key: 'hourly',
      label: 'Hourly',
      amount: annual / annualHours,
      hoursPerPeriod: '1 hour',
      description: `${formatCurrency(annual / annualHours)} per hour worked`,
    },
    {
      key: 'daily',
      label: 'Daily (8-hr)',
      amount: (annual / annualHours) * 8,
      hoursPerPeriod: '8 hours',
      description: `${formatCurrency((annual / annualHours) * 8)} per 8-hour workday`,
    },
    {
      key: 'weekly',
      label: 'Weekly',
      amount: annual / 52,
      hoursPerPeriod: `${weeklyHours} hours`,
      description: `${formatCurrency(annual / 52)} for a ${weeklyHours}-hour week`,
    },
    {
      key: 'biweekly',
      label: 'Bi-Weekly',
      amount: annual / 26,
      hoursPerPeriod: `${weeklyHours * 2} hours`,
      description: `${formatCurrency(annual / 26)} every 2 weeks (26 pay periods/year)`,
    },
    {
      key: 'semimonthly',
      label: 'Semi-Monthly',
      amount: annual / 24,
      hoursPerPeriod: `${(annualHours / 24).toFixed(1)} hours`,
      description: `${formatCurrency(annual / 24)} twice per month (24 pay periods/year)`,
    },
    {
      key: 'monthly',
      label: 'Monthly',
      amount: annual / 12,
      hoursPerPeriod: `${(annualHours / 12).toFixed(1)} hours`,
      description: `${formatCurrency(annual / 12)} per month (12 periods/year)`,
    },
    {
      key: 'annual',
      label: 'Annual',
      amount: annual,
      hoursPerPeriod: `${annualHours.toLocaleString()} hours`,
      description: `${formatCurrency(annual)} total per year`,
    },
  ];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SalaryConverterCalculator() {
  const [payAmount, setPayAmount] = useState('');
  const [payPeriod, setPayPeriod] = useState<PayPeriod>('annual');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [results, setResults] = useState<PeriodResult[] | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ payAmount: string; payPeriod: string; hoursPerWeek: string }>('salary-converter');

  // ---- Comparison state ----
  const [compareA, setCompareA] = useState<{ results: PeriodResult[]; label: string } | null>(null);
  const [compareB, setCompareB] = useState<{ results: PeriodResult[]; label: string } | null>(null);

  const effectiveHoursPerWeek = useMemo(
    () => parseFloat(hoursPerWeek) || 40,
    [hoursPerWeek]
  );

  const handleTryExample = () => {
    setPayAmount('50000');
    setPayPeriod('annual');
    setHoursPerWeek('40');
    setResults(null);
  };

  const handleConvert = () => {
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) {
      setResults(null);
      return;
    }
    const annual = convertToAnnual(amount, payPeriod, effectiveHoursPerWeek);
    const allPeriods = annualToAllPeriods(annual, effectiveHoursPerWeek);
    setResults(allPeriods);
    saveEntry(
      { payAmount, payPeriod, hoursPerWeek },
      `${formatCurrency(amount)} ${periodLabels[payPeriod]} → ${formatCurrency(annual)}/year`
    );
  };

  const handleRestore = (inputs: { payAmount: string; payPeriod: string; hoursPerWeek: string }) => {
    setPayAmount(inputs.payAmount);
    setPayPeriod(inputs.payPeriod as PayPeriod);
    setHoursPerWeek(inputs.hoursPerWeek);
    setResults(null);
  };

  const annualHours = effectiveHoursPerWeek * 52;

  // -----------------------------------------------------------------------
  // SEO Content
  // -----------------------------------------------------------------------

  const howToSteps = [
    'Enter your pay amount in the input field. This can be any amount you currently earn — for example, your hourly wage, weekly paycheck, monthly salary, or annual compensation figure from your employment contract.',
    'Select the pay period that matches your input amount from the dropdown menu. Choose from Hourly, Daily, Weekly, Bi-Weekly, Semi-Monthly, Monthly, or Annual so the calculator knows the time frame of your entered amount.',
    'Optionally adjust the hours per week field if your work schedule differs from the standard 40-hour week. This is important for accurate hourly and daily conversions — for instance, part-time workers or those with non-standard schedules should update this value.',
    'Click the "Convert" button to instantly see your equivalent pay rate across all seven pay periods. The calculator converts your input to an annual figure first, then derives every other period from that baseline.',
    'Review the results grid to compare your earnings across different time frames. Each row shows the converted amount formatted as currency along with the corresponding hours worked for that period, making it easy to understand your true earning rate at every level.',
  ];

  const formula = 'Annual Salary = Hourly Rate × Hours/Week × 52';

  const formulaDescription =
    'All salary conversions start by calculating the equivalent annual salary. From this annual figure, every other pay period is derived: monthly divides by 12, semi-monthly by 24, bi-weekly by 26, weekly by 52, daily by dividing the annual total by the number of 8-hour workdays (annual hours ÷ 8), and hourly by dividing by total annual hours. The hours-per-week input directly impacts hourly, daily, and weekly calculations, while time-based periods (bi-weekly, semi-monthly, monthly, annual) are derived purely from calendar divisions.';

  const workedExamples = [
    {
      title: '$30/hour Full-Time',
      description:
        'At $30 per hour working 40 hours per week, the annual salary is $30 × 40 × 52 = $62,400. This breaks down to $240/day (8-hour day), $1,200/week, $2,400/bi-weekly, $2,600/semi-monthly, $5,200/month. Total hours worked per year: 2,080 hours.',
    },
    {
      title: '$85,000 Annual Salary',
      description:
        'An $85,000 annual salary with a standard 40-hour workweek equates to an hourly rate of $85,000 ÷ 2,080 = $40.87/hour. Daily pay is $326.92 for an 8-hour day, weekly pay is $1,634.62, bi-weekly is $3,269.23, semi-monthly is $3,541.67, and monthly is $7,083.33.',
    },
    {
      title: '$2,500 Bi-Weekly Paycheck',
      description:
        'A bi-weekly paycheck of $2,500 corresponds to an annual salary of $2,500 × 26 = $65,000. At 40 hours/week (2,080 annual hours), the hourly rate is $31.25, the daily rate is $250.00 (8-hour day), weekly is $1,250.00, semi-monthly is $2,708.33, and monthly is $5,416.67.',
    },
  ];

  const faqs = [
    {
      question: 'What is the difference between bi-weekly and semi-monthly pay?',
      answer:
        'Bi-weekly pay occurs every two weeks, resulting in 26 paychecks per year (52 weeks ÷ 2). Semi-monthly pay occurs twice per month, typically on the 1st and 15th or 15th and last day, resulting in exactly 24 paychecks per year. Over the course of a year, you receive two more paychecks with bi-weekly pay. Each semi-monthly paycheck is slightly larger than a bi-weekly one to cover the same annual salary in fewer payments.',
    },
    {
      question: 'How do I convert my salary to an hourly rate?',
      answer:
        'To convert an annual salary to an hourly rate, divide the annual salary by the total number of hours you work per year. For a standard 40-hour work week, that is 2,080 hours per year (40 × 52). For example, a $60,000 annual salary ÷ 2,080 hours = $28.85 per hour. If you work a different schedule, adjust the calculation using your actual weekly hours.',
    },
    {
      question: 'Does this calculator account for taxes and deductions?',
      answer:
        'No, this salary converter calculates gross pay equivalents only — it does not factor in taxes, insurance premiums, retirement contributions, or other deductions. The converted amounts represent your pre-tax earnings across different pay periods. To estimate your take-home (net) pay, use a payroll calculator that accounts for federal and state tax withholdings along with any deductions.',
    },
    {
      question: 'Why do my daily and hourly rates change when I adjust hours per week?',
      answer:
        'The hours-per-week setting affects conversions that are time-dependent. If your annual salary stays the same but you work fewer hours per week, your hourly rate increases because the same total pay is spread over fewer hours. Conversely, working more hours at the same salary lowers your effective hourly rate. Pay periods based on calendar divisions (monthly, semi-monthly, bi-weekly) remain unchanged because they depend only on the annual total.',
    },
    {
      question: 'How does overtime affect salary conversion?',
      answer:
        'Standard salary conversions assume a fixed number of regular hours. Overtime pay — typically 1.5× your regular hourly rate for hours beyond 40 per week — is not included in these calculations. If you regularly work overtime, your actual annual earnings will be higher than the converted figures shown here. For accurate overtime-inclusive estimates, use an overtime calculator and add those earnings to your base salary.',
    },
    {
      question: 'Are there 52 weeks in every year for salary calculations?',
      answer:
        'For salary conversion purposes, 52 weeks is the standard assumption used by employers, payroll systems, and the IRS. While a calendar year has 365 days (52 weeks + 1 day, or 52 weeks + 2 days in a leap year), the 52-week convention provides a consistent and widely accepted basis for annualizing pay. Some bi-weekly pay schedules may include 27 pay periods in certain years, but the 26-period-per-year standard is the norm for conversions.',
    },
  ];

  const relatedTools = [
    {
      slug: 'sales-commission',
      title: 'Sales Commission Calculator',
      description: 'Calculate commission earnings from sales revenue and rates',
      icon: 'DollarSign',
    },
    {
      slug: 'salary-increase',
      title: 'Salary Increase Calculator',
      description: 'See how a raise impacts your paycheck across all pay periods',
      icon: 'TrendingUp',
    },
    {
      slug: 'overtime',
      title: 'Overtime Calculator',
      description: 'Calculate overtime pay with 1.5× and 2× multipliers',
      icon: 'Timer',
    },
    {
      slug: 'payroll',
      title: 'Payroll Calculator',
      description: 'Estimate take-home pay after taxes and deductions',
      icon: 'CreditCard',
    },
    {
      slug: 'pro-rata-salary',
      title: 'Pro Rata Salary Calculator',
      description: 'Calculate prorated salary for partial work periods',
      icon: 'CalendarClock',
    },
    {
      slug: 'decimal-converter',
      title: 'Decimal & Fraction Converter',
      description: 'Convert between decimals, fractions, and percentages',
      icon: 'Hash',
    },
  ];

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <CalculatorLayout
      title="Salary Converter Calculator"
      description="Instantly convert your pay between hourly, daily, weekly, bi-weekly, semi-monthly, monthly, and annual rates. See your earnings from every angle."
      icon={<ArrowLeftRight className="h-7 w-7 text-white" />}
      breadcrumbs={[
        { label: 'Calculators' },
        { label: 'Salary Converter Calculator' },
      ]}
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
        {/* Pay Amount */}
        <div className="space-y-2">
          <Label htmlFor="payAmount" className="text-sm font-medium">
            <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Pay Amount
          </Label>
          <Input
            id="payAmount"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 75000 or 30"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
          />
        </div>

        {/* Pay Period + Hours Per Week */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="payPeriod" className="text-sm font-medium">
              Pay Period
            </Label>
            <Select
              value={payPeriod}
              onValueChange={(val) => setPayPeriod(val as PayPeriod)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily (8-hr day)</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                <SelectItem value="semimonthly">Semi-Monthly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hoursPerWeek" className="text-sm font-medium">
              <Info className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Hours per Week
            </Label>
            <Input
              id="hoursPerWeek"
              type="number"
              min="1"
              max="168"
              step="0.5"
              placeholder="40"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Standard is 40. Adjust for part-time or non-standard schedules.
            </p>
          </div>
        </div>

        {/* Convert Button */}
        <div className="flex items-center justify-between">
          <TryExample onClick={handleTryExample} />
          <Button
            onClick={handleConvert}
            className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            Convert Salary
          </Button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="result-display mt-8" aria-live="polite"
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            {/* Summary Header */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Converting{' '}
                <span className="text-foreground font-semibold">
                  {formatCurrency(parseFloat(payAmount) || 0)} {periodLabels[payPeriod]}
                </span>
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-emerald-600">
                {formatCurrency(
                  results.find((r) => r.key === 'annual')?.amount ?? 0
                )}{' '}
                <span className="text-lg sm:text-xl font-medium text-emerald-600/70">
                  / year
                </span>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <Badge variant="outline" className="px-3 py-1 text-xs">
                  <Info className="h-3 w-3 mr-1" />
                  {effectiveHoursPerWeek} hrs/week
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-xs">
                  {annualHours.toLocaleString()} total hours/year
                </Badge>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {results.map((period, idx) => (
                <motion.div
                  key={period.key}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * idx, duration: 0.3 }}
                  className={`rounded-xl border p-4 space-y-2 transition-colors ${
                    period.key === payPeriod
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-border/50 bg-background hover:border-emerald-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {period.label}
                    </span>
                    {period.key === payPeriod && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 h-4"
                      >
                        Input
                      </Badge>
                    )}
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(period.amount)}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {period.hoursPerPeriod} &middot; {period.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Full Table for detailed view */}
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Pay Period
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                      Hours / Period
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                      Periods / Year
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {results.map((period) => {
                    const periodsPerYear: Record<PayPeriod, number> = {
                      hourly: annualHours,
                      daily: annualHours / 8,
                      weekly: 52,
                      biweekly: 26,
                      semimonthly: 24,
                      monthly: 12,
                      annual: 1,
                    };
                    return (
                      <tr
                        key={period.key}
                        className={
                          period.key === payPeriod
                            ? 'bg-emerald-500/5 font-semibold'
                            : ''
                        }
                      >
                        <td className="px-4 py-3">{period.label}</td>
                        <td className="text-right px-4 py-3 text-emerald-600 font-semibold">
                          {formatCurrency(period.amount)}
                        </td>
                        <td className="text-right px-4 py-3 text-muted-foreground hidden sm:table-cell">
                          {period.hoursPerPeriod}
                        </td>
                        <td className="text-right px-4 py-3 text-muted-foreground hidden md:table-cell">
                          {periodsPerYear[period.key].toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Salary Across Periods Bar Chart */}
            <div className="print:hidden">
              <p className="text-sm font-medium text-muted-foreground mb-3">Salary Across Periods</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={results}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(v >= 1000 ? 0 : 2)}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} name="Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* ---- Comparison save buttons ---- */}
      {results && (
        <div className="flex flex-wrap gap-2 mt-4 px-1">
          <button
            onClick={() => setCompareA({ results, label: `${payAmount} ${periodLabels[payPeriod]}` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
          >
            {compareA ? '↺ Replace Scenario A' : '+ Save as Scenario A'}
          </button>
          <button
            onClick={() => setCompareB({ results, label: `${payAmount} ${periodLabels[payPeriod]}` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 transition-colors font-medium"
          >
            {compareB ? '↺ Replace Scenario B' : '+ Save as Scenario B'}
          </button>
        </div>
      )}

      {/* ---- Compare Panel ---- */}
      {compareA && compareB && (() => {
        const find = (rs: PeriodResult[], key: PayPeriod) => rs.find(r => r.key === key)?.amount ?? 0;
        const rows: CompareRow[] = [
          { label: 'Annual',      valueA: formatCurrency(find(compareA.results, 'annual')),      valueB: formatCurrency(find(compareB.results, 'annual')),      numA: find(compareA.results, 'annual'),      numB: find(compareB.results, 'annual') },
          { label: 'Monthly',     valueA: formatCurrency(find(compareA.results, 'monthly')),     valueB: formatCurrency(find(compareB.results, 'monthly')),     numA: find(compareA.results, 'monthly'),     numB: find(compareB.results, 'monthly') },
          { label: 'Bi-Weekly',   valueA: formatCurrency(find(compareA.results, 'biweekly')),   valueB: formatCurrency(find(compareB.results, 'biweekly')),   numA: find(compareA.results, 'biweekly'),   numB: find(compareB.results, 'biweekly') },
          { label: 'Weekly',      valueA: formatCurrency(find(compareA.results, 'weekly')),      valueB: formatCurrency(find(compareB.results, 'weekly')),      numA: find(compareA.results, 'weekly'),      numB: find(compareB.results, 'weekly') },
          { label: 'Daily',       valueA: formatCurrency(find(compareA.results, 'daily')),       valueB: formatCurrency(find(compareB.results, 'daily')),       numA: find(compareA.results, 'daily'),       numB: find(compareB.results, 'daily') },
          { label: 'Hourly',      valueA: formatCurrency(find(compareA.results, 'hourly')),      valueB: formatCurrency(find(compareB.results, 'hourly')),      numA: find(compareA.results, 'hourly'),      numB: find(compareB.results, 'hourly') },
        ];
        return (
          <ComparePanel
            rows={rows}
            labelA={compareA.label}
            labelB={compareB.label}
            onClear={() => { setCompareA(null); setCompareB(null); }}
            onSwap={() => { const tmp = compareA; setCompareA(compareB); setCompareB(tmp); }}
          />
        );
      })()}

      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </CalculatorLayout>
  );
}
