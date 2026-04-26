'use client';

import { useState } from 'react';
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

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ hourlyRate: string; regularHours: string; overtimeHours: string; payFrequency: string; federalTaxPct: string; stateTaxPct: string }>('hourly-paycheck');

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

  // ------ SEO content ------

  const howToSteps = [
    'Enter your hourly pay rate — this is the amount you earn per regular hour worked before any taxes or deductions.',
    'Enter the number of regular hours you work per week (typically 40 for full-time). Also enter any overtime hours if applicable.',
    'Select your pay frequency: weekly, bi-weekly (every two weeks), semi-monthly (twice per month), or monthly. This determines how many paychecks you receive per year.',
    'Enter your federal and state tax withholding percentages. The defaults (12% federal, 5% state) are approximate flat rates. Toggle FICA on or off — when enabled, Social Security (6.2%) and Medicare (1.45%) totaling 7.65% are included.',
    'Optionally, enter any additional per-period deductions (like union dues, garnishments, or parking fees). Click "Calculate Paycheck" to see your gross pay, all deductions, net pay per period and per year, and your effective hourly rate after taxes.',
  ];

  const formula =
    'Net Pay = Gross Pay − Federal Tax − State Tax − FICA − Other Deductions';

  const formulaDescription =
    'Your gross hourly paycheck is calculated by multiplying your hours worked by your hourly rate, with overtime hours paid at 1.5x the regular rate. From this gross amount, federal income tax, state income tax, and FICA (Social Security 6.2% + Medicare 1.45% = 7.65%) are deducted as percentages. Any additional fixed deductions are also subtracted. The effective hourly rate is calculated by dividing your annual net take-home pay by your total annual hours worked — this tells you what you actually earn per hour after all taxes and deductions are taken into account. This "real" hourly rate is useful for comparing job offers or evaluating whether overtime is worthwhile.';

  const workedExamples = [
    {
      title: '$15/hr at 40 Hours/Week, Bi-Weekly',
      description:
        'At $15.00/hr working 40 regular hours/week with no overtime, the weekly gross is $600.00. Bi-weekly gross (2 weeks) = $1,200.00. Annual gross = $31,200.00. Federal tax (12%) = $144.00/period, state tax (5%) = $60.00/period, FICA (7.65%) = $91.80/period. Net per period = $1,200.00 − $295.80 = $904.20. Annual net = $23,509.20. Effective hourly rate after taxes = $904.20 / (40 × 2) = $11.30/hr. Your actual take-home is about 75.3% of your gross rate.',
    },
    {
      title: '$25/hr at 40 Hours/Week with 5 OT Hours, Bi-Weekly',
      description:
        'At $25.00/hr with 40 regular + 5 overtime hours/week, weekly gross = $1,000 (regular) + $187.50 (OT) = $1,187.50. Bi-weekly gross = $2,375.00. Federal tax (12%) = $285.00, state tax (5%) = $118.75, FICA = $181.69. Net per period = $2,375.00 − $585.44 (incl. other) = $1,789.56. Annual net = $46,528.48. Effective hourly rate = $1,789.56 / 90 = $19.88/hr. The 5 OT hours add $375/week in gross but also increase tax withholding proportionally.',
    },
    {
      title: '$50/hr at 40 Hours/Week, Monthly Pay',
      description:
        'At $50.00/hr with 40 regular hours/week, weekly gross = $2,000. Monthly gross (52/12 ≈ 4.33 weeks) = $8,666.67. Federal tax (22%) = $1,906.67, state tax (5%) = $433.33, FICA = $663.00. Net per month = $8,666.67 − $3,003.00 = $5,663.67. Annual net = $67,964.04. Effective hourly rate = $5,663.67 / (40 × 4.33) = $32.69/hr. At this income level, the effective hourly rate after taxes is roughly 65% of the gross rate.',
    },
  ];

  const faqs = [
    {
      question: 'How is hourly pay taxed?',
      answer:
        'Hourly pay is taxed the same way as salary income — there is no separate tax treatment. Your employer withholds federal income tax, state income tax (if applicable), Social Security (6.2%), and Medicare (1.45%) from each paycheck based on the information you provide on your W-4 form. The amount withheld depends on your earnings, filing status, number of allowances/dependents, and any additional withholding you elect. For overtime pay specifically, the additional earnings are added to your regular pay for the period, which may push more income into a higher tax bracket for that pay period, resulting in a slightly higher withholding percentage.',
    },
    {
      question: 'What is FICA and why is it taken from my paycheck?',
      answer:
        'FICA (Federal Insurance Contributions Act) is a mandatory payroll tax that funds Social Security and Medicare programs. You pay 6.2% of your wages (up to $176,100 in 2025) for Social Security and 1.45% on all wages for Medicare, totaling 7.65%. Your employer matches this amount, contributing an equal 7.65% on your behalf, making the total FICA contribution 15.3% of your wages. FICA is separate from income tax and cannot be reduced by filing status or deductions (though pre-tax deductions like 401(k) reduce the wages FICA is calculated on). Self-employed individuals pay the full 15.3% as the Self-Employment Tax.',
    },
    {
      question: 'Is overtime pay taxed differently?',
      answer:
        'No, overtime pay is not taxed at a higher rate. It is taxed the same as your regular wages — it is simply added to your gross earnings for the pay period, which may cause more of your income to fall into a higher withholding bracket temporarily. This often leads to the misconception that overtime is "taxed more." In reality, your tax bracket for the year is determined by your total annual income. If overtime pushes your annual income into a higher bracket, only the income above the bracket threshold is taxed at the higher rate. The extra withholding in overtime paychecks is often refunded when you file your tax return if it exceeds your actual tax liability.',
    },
    {
      question: 'How does pay frequency affect my withholding?',
      answer:
        'Pay frequency (weekly, bi-weekly, semi-monthly, monthly) affects the size of each paycheck but does not change your total annual tax liability. With more frequent pay periods (e.g., weekly), each check is smaller and the withholding per check is proportionally less. With less frequent pay periods (e.g., monthly), each check is larger and withholding per check is higher. However, the total tax paid over the year remains the same for the same annual income. Pay frequency can affect cash flow timing — weekly pay provides more frequent access to money but smaller amounts, while monthly pay provides larger sums less frequently.',
    },
    {
      question: 'What is the difference between an independent contractor and an employee for taxes?',
      answer:
        'The key tax difference is that employees have taxes withheld by their employer (federal/state income tax + 7.65% FICA), while independent contractors receive their full pay with no withholding and are responsible for paying all taxes themselves. Contractors pay the full 15.3% Self-Employment Tax (both employer and employee portions of FICA) plus income tax via quarterly estimated tax payments. Contractors can deduct business expenses (mileage, supplies, home office) before calculating taxable income, which can significantly reduce their tax burden. Employees generally cannot deduct work-related expenses. The IRS has strict rules about worker classification — misclassifying employees as contractors can result in significant penalties.',
    },
    {
      question: 'How can I increase my take-home pay?',
      answer:
        'Several strategies can boost your take-home pay: (1) Adjust your W-4 withholding — if you consistently receive large refunds, you are over-withholding. Increase allowances to reduce federal tax withholding per paycheck. (2) Contribute to pre-tax retirement accounts (401(k), 403(b), traditional IRA) — every dollar contributed reduces your taxable income. (3) Use a Health Savings Account (HSA) if eligible — triple tax advantage with pre-tax contributions. (4) Use pre-tax commuter benefits and dependent care FSAs. (5) Negotiate a higher hourly rate — even a small increase compounds significantly over time. (6) Consider overtime if available — even after taxes, OT premium pay provides net additional income. (7) Review your pay stubs regularly to catch errors.',
    },
  ];

  const relatedTools = [
    {
      slug: 'payroll',
      title: 'Payroll & Paycheck Calculator',
      description:
        'Estimate your take-home pay after federal and state taxes and deductions',
      icon: 'CreditCard',
    },
    {
      slug: 'wages',
      title: 'Wages Calculator',
      description:
        'Calculate gross wages from hours worked and hourly rates with overtime',
      icon: 'Banknote',
    },
    {
      slug: 'salary-converter',
      title: 'Salary Converter Calculator',
      description:
        'Convert between hourly, daily, weekly, and annual salary rates',
      icon: 'ArrowLeftRight',
    },
    {
      slug: 'overtime',
      title: 'Overtime Calculator',
      description:
        'Calculate overtime pay with standard time-and-a-half and double-time rates',
      icon: 'Timer',
    },
    {
      slug: 'after-tax-income',
      title: 'After-Tax Income Calculator',
      description:
        'Calculate your net income after federal and state taxes with detailed breakdown',
      icon: 'Wallet',
    },
  ];

  // ------ Render ------

  return (
    <CalculatorLayout
      title="Hourly Paycheck Calculator"
      description="Calculate your hourly paycheck after taxes and deductions. See net pay per period and per year, plus your effective hourly rate after taxes."
      icon={<BadgeDollarSign className="h-7 w-7 text-white" />}
      breadcrumbs={[
        { label: 'Calculators' },
        { label: 'Hourly Paycheck Calculator' },
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
          <Button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            <BadgeDollarSign className="h-4 w-4 mr-2" />
            Calculate Paycheck
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
    </CalculatorLayout>
  );
}
