'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, DollarSign, TrendingDown, Info, BarChart as BarChartIcon } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
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
import { Switch } from '@/components/ui/switch';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FilingStatus = 'single' | 'mfj' | 'mfs' | 'hoh';

interface BracketDefinition {
  min: number;
  max: number; // Infinity for the top bracket
  rate: number;
}

interface BracketResult {
  rate: number;
  incomeInBracket: number;
  taxInBracket: number;
  min: number;
  max: number | null; // null → "no upper limit"
}

interface TaxResult {
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  breakdown: BracketResult[];
  taxableIncome: number;
  grossIncome: number;
  standardDeductionApplied: number;
}

// ---------------------------------------------------------------------------
// 2025 Federal Tax Brackets
// ---------------------------------------------------------------------------

const brackets2025: Record<FilingStatus, BracketDefinition[]> = {
  single: [
    { min: 0, max: 11925, rate: 0.1 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
  mfj: [
    { min: 0, max: 23850, rate: 0.1 },
    { min: 23850, max: 96950, rate: 0.12 },
    { min: 96950, max: 206700, rate: 0.22 },
    { min: 206700, max: 394600, rate: 0.24 },
    { min: 394600, max: 501050, rate: 0.32 },
    { min: 501050, max: 751600, rate: 0.35 },
    { min: 751600, max: Infinity, rate: 0.37 },
  ],
  mfs: [
    { min: 0, max: 11925, rate: 0.1 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 375800, rate: 0.35 },
    { min: 375800, max: Infinity, rate: 0.37 },
  ],
  hoh: [
    { min: 0, max: 17000, rate: 0.1 },
    { min: 17000, max: 64850, rate: 0.12 },
    { min: 64850, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250500, rate: 0.32 },
    { min: 250500, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
};

// ---------------------------------------------------------------------------
// 2025 Standard Deductions
// ---------------------------------------------------------------------------

const standardDeductions: Record<FilingStatus, number> = {
  single: 15000,
  mfj: 30000,
  mfs: 15000,
  hoh: 22500,
};

// ---------------------------------------------------------------------------
// Filing status labels
// ---------------------------------------------------------------------------

const filingStatusLabels: Record<FilingStatus, string> = {
  single: 'Single',
  mfj: 'Married Filing Jointly',
  mfs: 'Married Filing Separately',
  hoh: 'Head of Household',
};

// ---------------------------------------------------------------------------
// Color-coding for bracket rows (lighter → darker green)
// ---------------------------------------------------------------------------

const bracketRowStyles = [
  'bg-emerald-50/70 dark:bg-emerald-950/20',
  'bg-emerald-50/70 dark:bg-emerald-950/25',
  'bg-emerald-100/70 dark:bg-emerald-950/30',
  'bg-emerald-100/70 dark:bg-emerald-950/35',
  'bg-emerald-200/70 dark:bg-emerald-900/25',
  'bg-emerald-200/70 dark:bg-emerald-900/30',
  'bg-emerald-300/70 dark:bg-emerald-900/35',
];

const bracketBarColors = [
  'bg-emerald-300 dark:bg-emerald-600',
  'bg-emerald-300 dark:bg-emerald-600',
  'bg-emerald-400 dark:bg-emerald-500',
  'bg-emerald-500 dark:bg-emerald-500',
  'bg-emerald-500 dark:bg-emerald-400',
  'bg-emerald-600 dark:bg-emerald-400',
  'bg-emerald-700 dark:bg-emerald-300',
];

const rechartsColors = [
  '#6ee7b7', // 10%
  '#34d399', // 12%
  '#10b981', // 22%
  '#059669', // 24%
  '#047857', // 32%
  '#065f46', // 35%
  '#022c22', // 37%
];

const bracketBadgeStyles = [
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
  'bg-emerald-200 text-emerald-900 dark:bg-emerald-800/40 dark:text-emerald-200',
  'bg-emerald-200 text-emerald-900 dark:bg-emerald-800/50 dark:text-emerald-200',
  'bg-emerald-300 text-emerald-900 dark:bg-emerald-700/40 dark:text-emerald-100',
  'bg-emerald-400 text-white dark:bg-emerald-700/60 dark:text-emerald-50',
  'bg-emerald-500 text-white dark:bg-emerald-600/70 dark:text-white',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const formatIncomeRange = (min: number, max: number | null): string => {
  if (max === null) return `Over ${formatCurrency(min)}`;
  return `${formatCurrency(min)} – ${formatCurrency(max)}`;
};

function calculateTax(
  grossIncome: number,
  filingStatus: FilingStatus,
  applyStandardDeduction: boolean,
): TaxResult {
  const deduction = applyStandardDeduction ? standardDeductions[filingStatus] : 0;
  const taxableIncome = Math.max(0, grossIncome - deduction);
  const brackets = brackets2025[filingStatus];
  let remaining = taxableIncome;
  let totalTax = 0;
  let marginalRate = 0;
  const breakdown: BracketResult[] = [];

  for (const bracket of brackets) {
    if (remaining <= 0) {
      breakdown.push({
        rate: bracket.rate,
        incomeInBracket: 0,
        taxInBracket: 0,
        min: bracket.min,
        max: bracket.max === Infinity ? null : bracket.max,
      });
      continue;
    }

    const bracketWidth =
      bracket.max === Infinity ? Infinity : bracket.max - bracket.min;
    const incomeInBracket = Math.min(remaining, bracketWidth);
    const taxInBracket = incomeInBracket * bracket.rate;
    totalTax += taxInBracket;
    remaining -= incomeInBracket;
    marginalRate = bracket.rate;

    breakdown.push({
      rate: bracket.rate,
      incomeInBracket,
      taxInBracket,
      min: bracket.min,
      max: bracket.max === Infinity ? null : bracket.max,
    });
  }

  const effectiveRate =
    taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;

  return {
    totalTax,
    effectiveRate,
    marginalRate,
    breakdown,
    taxableIncome,
    grossIncome,
    standardDeductionApplied: deduction,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TaxBracketCalculator() {
  const [incomeInput, setIncomeInput] = useState('');
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [applyDeduction, setApplyDeduction] = useState(true);
  const [result, setResult] = useState<TaxResult | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ incomeInput: string; filingStatus: string; applyDeduction: string }>('tax-bracket-calculator');

  // ---- Comparison state ----
  const [compareA, setCompareA] = useState<{ result: TaxResult; label: string } | null>(null);
  const [compareB, setCompareB] = useState<{ result: TaxResult; label: string } | null>(null);

  const handleCalculate = () => {
    const income = parseFloat(incomeInput);
    if (isNaN(income) || income < 0) {
      setResult(null);
      return;
    }
    const res = calculateTax(income, filingStatus, applyDeduction);
    setResult(res);
    saveEntry(
      { incomeInput, filingStatus, applyDeduction: String(applyDeduction) },
      `${formatCurrency(income)} (${filingStatusLabels[filingStatus]}) — Tax: ${formatCurrency(res.totalTax)} | Effective: ${res.effectiveRate.toFixed(2)}%`
    );
  };

  const handleRestore = (inputs: { incomeInput: string; filingStatus: string; applyDeduction: string }) => {
    setIncomeInput(inputs.incomeInput);
    setFilingStatus(inputs.filingStatus as FilingStatus);
    setApplyDeduction(inputs.applyDeduction === 'true');
    setResult(null);
  };

  // Current standard deduction for selected filing status
  const currentDeduction = standardDeductions[filingStatus];

  // ---------------------------------------------------------------------------
  // SEO Content
  // ---------------------------------------------------------------------------

  const howToSteps = [
    'Enter your total annual gross income in the field above. This is your income before any deductions or taxes.',
    'Select your filing status from the dropdown menu. Choose Single, Married Filing Jointly, Married Filing Separately, or Head of Household based on your tax situation.',
    'Toggle the standard deduction switch if you want the calculator to automatically subtract the 2025 standard deduction for your filing status. This reduces your taxable income before the bracket calculation.',
    'Click the "Calculate Federal Tax" button to see your total tax owed, effective tax rate, marginal tax rate, and a detailed bracket-by-bracket breakdown.',
    'Review the results to understand how much tax you owe in each bracket, your monthly and bi-weekly withholding equivalents, and strategies to optimize your tax situation.',
  ];

  const formula = 'Tax = Σ(Income in Bracket × Bracket Rate)';
  const formulaDescription =
    'The US federal income tax uses a progressive (marginal) system. Each portion of your taxable income is taxed at the rate of the bracket it falls into. Your effective tax rate is the average rate across all brackets, while your marginal tax rate is the rate applied to your last dollar of income. This means earning more money only increases the tax rate on income above your current bracket threshold — not on all of your income.';

  const workedExamples = [
    {
      title: '$65,000 Single Filer',
      description:
        'With a $65,000 gross income and the $15,000 standard deduction, the taxable income is $50,000. Tax is calculated as: 10% on the first $11,925 ($1,192.50), 12% on the next $36,550 ($4,386.00), and 22% on the remaining $1,525 ($335.50). Total federal tax is $5,914.00, with an effective rate of 11.83% and a marginal rate of 22%. Monthly withholding equivalent is $492.83 and bi-weekly is $227.46.',
    },
    {
      title: '$120,000 Married Filing Jointly',
      description:
        'With a $120,000 gross income and the $30,000 standard deduction, the taxable income is $90,000. Tax is calculated as: 10% on the first $23,850 ($2,385.00) and 12% on the remaining $66,150 ($7,938.00). Total federal tax is $10,323.00, with an effective rate of 11.47% and a marginal rate of 12%. Monthly withholding equivalent is $860.25 and bi-weekly is $397.04.',
    },
    {
      title: '$250,000 Single Filer (High Earner)',
      description:
        'With a $250,000 gross income and the $15,000 standard deduction, the taxable income is $235,000. Tax is calculated across five brackets: 10% on $11,925 ($1,192.50), 12% on $36,550 ($4,386.00), 22% on $54,875 ($12,072.50), 24% on $93,950 ($22,548.00), and 32% on $37,700 ($12,064.00). Total federal tax is $52,263.00, with an effective rate of 22.24% and a marginal rate of 32%. Monthly withholding equivalent is $4,355.25 and bi-weekly is $2,010.12.',
    },
  ];

  const faqs = [
    {
      question: 'What is the difference between marginal and effective tax rates?',
      answer:
        'Your marginal tax rate is the rate applied to your last (highest) dollar of taxable income. For example, if you are single and your taxable income is $60,000, your marginal rate is 22% because your last dollars fall in the 22% bracket. Your effective tax rate is the average rate across all your income — calculated by dividing total tax by total taxable income. In this example, the effective rate would be approximately 13.5%, significantly lower than the 22% marginal rate. This distinction is important because many people mistakenly believe a raise will be taxed at their marginal rate on all income, when in reality only the income above the bracket threshold is taxed at the higher rate.',
    },
    {
      question: 'What happens when my income crosses into a new tax bracket?',
      answer:
        'Only the portion of your income that falls within the new bracket is taxed at the higher rate — not your entire income. For example, if you are single and your taxable income increases from $47,000 to $50,000, only the $1,525 that exceeds the $48,475 threshold is taxed at 22%. The first $11,925 is still taxed at 10% and the next $36,550 is still taxed at 12%. This is the nature of a progressive tax system. You will never have less take-home pay due to crossing a bracket boundary.',
    },
    {
      question: 'Should I take the standard deduction or itemize?',
      answer:
        'You should choose whichever option gives you the larger deduction. The 2025 standard deduction is $15,000 for single filers, $30,000 for married filing jointly, $15,000 for married filing separately, and $22,500 for head of household. You should itemize if your qualifying expenses — such as mortgage interest, state and local taxes (SALT, capped at $10,000), charitable donations, and medical expenses exceeding 7.5% of AGI — exceed the standard deduction. Since the Tax Cuts and Jobs Act of 2017 roughly doubled the standard deduction, about 90% of taxpayers now take the standard deduction.',
    },
    {
      question: 'Does this calculator include state taxes?',
      answer:
        'No, this calculator only computes federal income tax using the 2025 IRS brackets. State income tax is a separate calculation that varies significantly by state — some states like Texas, Florida, and Nevada have no state income tax, while others like California (up to 13.3%) and New York (up to 10.9%) have substantial rates. To estimate your total tax burden, you would need to run your taxable income through your specific state\'s tax brackets as well. Keep in mind that some states allow you to deduct federal taxes paid, further complicating the calculation.',
    },
    {
      question: 'How are capital gains taxed versus ordinary income?',
      answer:
        'Long-term capital gains (assets held over one year) are taxed at preferential rates of 0%, 15%, or 20% depending on your taxable income level, which is generally lower than ordinary income rates. Short-term capital gains (assets held one year or less) are taxed at your ordinary income tax rates — the same brackets this calculator uses. Additionally, high-income earners may be subject to the 3.8% Net Investment Income Tax (NIIT) on investment income. Qualified dividends are also taxed at the long-term capital gains rates, making tax-advantaged investing an important consideration for overall tax planning.',
    },
    {
      question: 'How can I lower my tax bracket?',
      answer:
        'There are several strategies to reduce your taxable income and potentially drop into a lower tax bracket: (1) Maximize pre-tax retirement contributions like a 401(k) ($23,500 limit in 2025, $31,000 if age 50+) or traditional IRA. (2) Contribute to a Health Savings Account (HSA) if you have a high-deductible health plan ($4,300 individual / $8,550 family in 2025). (3) Use flexible spending accounts (FSA) for healthcare and dependent care. (4) Harvest tax losses by selling investments at a loss to offset gains. (5) Consider timing — defer income or accelerate deductions if you are close to a bracket threshold. (6) If self-employed, maximize business deductions like the home office deduction, equipment expenses, and retirement plans like a SEP-IRA or Solo 401(k).',
    },
  ];

  const relatedTools = [
    {
      slug: 'payroll-calculator',
      title: 'Payroll Calculator',
      description: 'Calculate your take-home pay after all deductions',
      icon: 'CreditCard',
    },
    {
      slug: 'after-tax-income-calculator',
      title: 'After-Tax Income Calculator',
      description: 'Estimate your income after federal and state taxes',
      icon: 'DollarSign',
    },
    {
      slug: 'bonus-tax-calculator',
      title: 'Bonus Tax Calculator',
      description: 'Calculate net bonus after supplemental withholding',
      icon: 'Gift',
    },
    {
      slug: 'salary-converter',
      title: 'Salary Converter',
      description: 'Convert salary between hourly, monthly, and annual',
      icon: 'TrendingUp',
    },
    {
      slug: 'salary-increase-calculator',
      title: 'Salary Increase Calculator',
      description: 'See how a raise affects your paycheck and taxes',
      icon: 'TrendingUp',
    },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <CalculatorLayout
      title="Federal Tax Bracket Calculator"
      description="Calculate your 2025 federal income tax using the progressive bracket system. See your effective and marginal rates, bracket-by-bracket breakdown, and withholding equivalents."
      icon={<FileText className="h-7 w-7 text-white" />}
      breadcrumbs={[
        { label: 'Calculators' },
        { label: 'Tax Bracket Calculator' },
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
        {/* ======== Income Input ======== */}
        <div className="space-y-2">
          <Label htmlFor="income" className="text-sm font-medium">
            <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Annual Gross Income ($)
          </Label>
          <Input
            id="income"
            type="number"
            min="0"
            step="100"
            placeholder="e.g., 75000"
            value={incomeInput}
            onChange={(e) => setIncomeInput(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter your total income before any deductions.
          </p>
        </div>

        {/* ======== Filing Status ======== */}
        <div className="space-y-2">
          <Label htmlFor="filing-status" className="text-sm font-medium">
            Filing Status
          </Label>
          <Select
            value={filingStatus}
            onValueChange={(val) => {
              setFilingStatus(val as FilingStatus);
              setResult(null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select filing status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="mfj">Married Filing Jointly</SelectItem>
              <SelectItem value="mfs">Married Filing Separately</SelectItem>
              <SelectItem value="hoh">Head of Household</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ======== Standard Deduction Toggle ======== */}
        <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <Label
              htmlFor="standard-deduction"
              className="text-sm font-medium cursor-pointer select-none"
            >
              Apply 2025 Standard Deduction
            </Label>
            <Badge
              variant="secondary"
              className="text-xs shrink-0 hidden sm:inline-flex"
            >
              {formatCurrency(currentDeduction)}
            </Badge>
          </div>
          <Switch
            id="standard-deduction"
            checked={applyDeduction}
            onCheckedChange={(checked) => {
              setApplyDeduction(checked);
              setResult(null);
            }}
          />
        </div>

        {/* Deduction info */}
        {applyDeduction && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 px-4 py-3"
          >
            <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {filingStatusLabels[filingStatus]} standard deduction of{' '}
              <strong className="text-foreground">
                {formatCurrency(currentDeduction)}
              </strong>{' '}
              will be subtracted from your gross income before calculating tax.
              {filingStatus === 'mfs' &&
                ' If you file separately and your spouse itemizes, you must also itemize.'}
            </p>
          </motion.div>
        )}

        {/* ======== Calculate Button ======== */}
        <Button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
          size="lg"
        >
          Calculate Federal Tax
        </Button>
      </div>

      {/* ======== Results ======== */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="result-display mt-8 space-y-6" aria-live="polite"
        >
          {/* ---------- Income Summary ---------- */}
          {applyDeduction && result.standardDeductionApplied > 0 && (
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-sm">
                <span className="text-muted-foreground">Gross Income:</span>
                <span className="font-semibold">{formatCurrency(result.grossIncome)}</span>
                <TrendingDown className="h-4 w-4 text-red-500 hidden sm:block" />
                <span className="text-muted-foreground">Deduction:</span>
                <span className="font-semibold text-red-500">
                  -{formatCurrency(result.standardDeductionApplied)}
                </span>
                <span className="text-muted-foreground">=</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Taxable: {formatCurrency(result.taxableIncome)}
                </span>
              </div>
            </div>
          )}

          {/* ---------- Main Result Cards ---------- */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Total Federal Tax
              </p>
              <motion.p
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400"
              >
                {formatCurrency(result.totalTax)}
              </motion.p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-5 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Effective Tax Rate
              </p>
              <p className="text-2xl sm:text-3xl font-bold">{result.effectiveRate.toFixed(2)}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Average across all brackets
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/20 p-5 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Marginal Tax Rate
              </p>
              <p className="text-2xl sm:text-3xl font-bold">
                {(result.marginalRate * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Rate on your last dollar
              </p>
            </div>
          </div>

          {/* ---------- Withholding Equivalents ---------- */}
          <div className="rounded-xl border border-border/60 bg-gradient-to-b from-muted/40 to-muted/20 p-5 space-y-3">
            <p className="text-sm font-semibold text-center text-muted-foreground uppercase tracking-wider">
              Withholding Equivalents
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">Monthly Tax</p>
                <p className="text-lg font-bold">
                  {formatCurrency(result.totalTax / 12)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Take-home:{' '}
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {formatCurrency((result.taxableIncome - result.totalTax) / 12)}
                  </span>
                </p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">Bi-Weekly Tax</p>
                <p className="text-lg font-bold">
                  {formatCurrency(result.totalTax / 26)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Take-home:{' '}
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {formatCurrency((result.taxableIncome - result.totalTax) / 26)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* ---------- Visual Bar Chart ---------- */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4">
            <p className="text-sm font-semibold flex items-center gap-2">
              <BarChartIcon className="h-4.5 w-4.5 text-primary" />
              Tax by Bracket
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={result.breakdown.filter((b) => b.incomeInBracket > 0)}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis
                    dataKey="rate"
                    tick={{ fill: '#888888', fontSize: 12 }}
                    tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#888888', fontSize: 12 }}
                    tickFormatter={(val) => `$${val.toLocaleString()}`}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [formatCurrency(value), 'Tax in Bracket']}
                    labelFormatter={(label: number) => `${(label * 100).toFixed(0)}% Bracket`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="taxInBracket" radius={[4, 4, 0, 0]}>
                    {result.breakdown.filter((b) => b.incomeInBracket > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={rechartsColors[index] || '#10b981'} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ---------- Bracket Breakdown Table ---------- */}
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <div className="px-5 py-3 bg-muted/30 border-b border-border/50">
              <p className="text-sm font-semibold">Bracket-by-Bracket Breakdown</p>
              <p className="text-xs text-muted-foreground">
                {filingStatusLabels[filingStatus]} — 2025 Tax Year
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      Income Range
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      Taxable in Bracket
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                      Tax
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider w-28">
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((bracket, idx) => {
                    const hasIncome = bracket.incomeInBracket > 0;
                    const maxTax = result.breakdown.reduce(
                      (max, b) => Math.max(max, b.taxInBracket),
                      0,
                    );
                    const barWidth =
                      maxTax > 0
                        ? (bracket.taxInBracket / maxTax) * 100
                        : 0;

                    return (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.25 }}
                        className={`border-b border-border/30 last:border-b-0 ${
                          bracketRowStyles[idx] ?? bracketRowStyles[bracketRowStyles.length - 1]
                        } ${!hasIncome ? 'opacity-40' : ''}`}
                      >
                        {/* Rate badge */}
                        <td className="px-4 py-3">
                          <Badge
                            className={`text-xs font-bold px-2.5 py-0.5 ${bracketBadgeStyles[idx] ?? bracketBadgeStyles[bracketBadgeStyles.length - 1]}`}
                          >
                            {(bracket.rate * 100).toFixed(0)}%
                          </Badge>
                        </td>
                        {/* Range */}
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                          {formatIncomeRange(bracket.min, bracket.max)}
                        </td>
                        {/* Taxable in bracket */}
                        <td className="text-right px-4 py-3 font-medium whitespace-nowrap">
                          {hasIncome
                            ? formatCurrency(bracket.incomeInBracket)
                            : '—'}
                        </td>
                        {/* Tax */}
                        <td className="text-right px-4 py-3 font-semibold whitespace-nowrap">
                          {hasIncome
                            ? formatCurrency(bracket.taxInBracket)
                            : '—'}
                        </td>
                        {/* Visual bar */}
                        <td className="px-4 py-3">
                          <div className="w-full h-2.5 rounded-full bg-muted/50 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${barWidth}%` }}
                              transition={{ delay: 0.3 + idx * 0.06, duration: 0.4 }}
                              className={`h-full rounded-full ${
                                bracketBarColors[idx] ?? bracketBarColors[bracketBarColors.length - 1]
                              }`}
                            />
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
                {/* Footer: Total */}
                <tfoot>
                  <tr className="border-t-2 border-border bg-emerald-500/5">
                    <td className="px-4 py-3" colSpan={2}>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        Total Federal Tax
                      </span>
                    </td>
                    <td className="text-right px-4 py-3">
                      <span className="text-sm font-medium">
                        {formatCurrency(result.taxableIncome)}
                      </span>
                    </td>
                    <td className="text-right px-4 py-3">
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(result.totalTax)}
                      </span>
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ---------- Summary Badges ---------- */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Info className="h-3.5 w-3.5 mr-1.5" />
              Effective Rate: {result.effectiveRate.toFixed(2)}%
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <TrendingDown className="h-3.5 w-3.5 mr-1.5" />
              Marginal Rate: {(result.marginalRate * 100).toFixed(0)}%
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <DollarSign className="h-3.5 w-3.5 mr-1.5" />
              Annual Take-Home: {formatCurrency(result.taxableIncome - result.totalTax)}
            </Badge>
          </div>

          {/* ---------- Tax Savings Note ---------- */}
          {result.effectiveRate > 0 && (
            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              This calculation uses 2025 federal tax brackets only. Actual tax liability may
              differ based on additional factors such as state taxes, credits, deductions
              beyond the standard deduction, and other adjustments. Consult a tax
              professional for personalized advice.
            </p>
          )}
        </motion.div>
      )}

      {/* ---- Comparison save buttons ---- */}
      {result && (
        <div className="flex flex-wrap gap-2 mt-4 px-1">
          <button
            onClick={() => setCompareA({ result, label: `${formatCurrency(result.grossIncome)} (${filingStatusLabels[filingStatus]})` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
          >
            {compareA ? '↺ Replace Scenario A' : '+ Save as Scenario A'}
          </button>
          <button
            onClick={() => setCompareB({ result, label: `${formatCurrency(result.grossIncome)} (${filingStatusLabels[filingStatus]})` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 transition-colors font-medium"
          >
            {compareB ? '↺ Replace Scenario B' : '+ Save as Scenario B'}
          </button>
        </div>
      )}

      {/* ---- Compare Panel ---- */}
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Gross Income',     valueA: formatCurrency(compareA.result.grossIncome),     valueB: formatCurrency(compareB.result.grossIncome),     numA: compareA.result.grossIncome,     numB: compareB.result.grossIncome },
          { label: 'Taxable Income',   valueA: formatCurrency(compareA.result.taxableIncome),   valueB: formatCurrency(compareB.result.taxableIncome),   numA: compareA.result.taxableIncome,   numB: compareB.result.taxableIncome },
          { label: 'Total Federal Tax',valueA: formatCurrency(compareA.result.totalTax),        valueB: formatCurrency(compareB.result.totalTax),        numA: compareA.result.totalTax,        numB: compareB.result.totalTax,        higherIsBetter: false },
          { label: 'Effective Rate',   valueA: `${compareA.result.effectiveRate.toFixed(2)}%`,  valueB: `${compareB.result.effectiveRate.toFixed(2)}%`,  numA: compareA.result.effectiveRate,   numB: compareB.result.effectiveRate,   higherIsBetter: false },
          { label: 'Marginal Rate',    valueA: `${(compareA.result.marginalRate * 100).toFixed(0)}%`, valueB: `${(compareB.result.marginalRate * 100).toFixed(0)}%`, numA: compareA.result.marginalRate, numB: compareB.result.marginalRate, higherIsBetter: false },
          { label: 'Est. Take-Home',   valueA: formatCurrency(compareA.result.taxableIncome - compareA.result.totalTax), valueB: formatCurrency(compareB.result.taxableIncome - compareB.result.totalTax), numA: compareA.result.taxableIncome - compareA.result.totalTax, numB: compareB.result.taxableIncome - compareB.result.totalTax },
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
