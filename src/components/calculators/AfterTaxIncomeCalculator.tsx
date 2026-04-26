'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, DollarSign, TrendingDown, Info, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
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

  const { history, saveEntry, clearHistory } = useCalcHistory<{ incomeAmount: string; payFrequency: string; filingStatus: string; stateTaxRate: string }>('after-tax-income');

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

  // =========================================================================
  // SEO Content
  // =========================================================================

  const breadcrumbs = [
    { label: 'Calculators' },
    { label: 'After-Tax Income Calculator' },
  ];

  const tableOfContents = [
    { id: 'how-to-calculate', label: 'How to Calculate' },
    { id: 'formula', label: 'Formula' },
    { id: 'worked-examples', label: 'Worked Examples' },
    { id: 'frequently-asked-questions', label: 'FAQs' },
    { id: 'related-calculators', label: 'Related Calculators' },
  ];

  const howToSteps = [
    'Enter your gross income in the primary input field. You can specify it as an annual salary, monthly pay, bi-weekly or weekly paycheck, or an hourly wage.',
    'Select your pay frequency to tell the calculator how your income amount should be interpreted. If you choose hourly, also enter your typical hours per week.',
    'Choose your federal tax filing status: Single, Married Filing Jointly, or Head of Household. This determines which 2025 tax brackets apply.',
    'Set your state income tax rate. Use the quick-preset buttons for common states (e.g., 0% for Texas or Florida, 9.3% for California) or type a custom percentage.',
    'Enter any additional monthly pre-tax deductions such as health insurance premiums, 401(k) contributions, or HSA contributions.',
    'Click "Calculate" to see your detailed after-tax income breakdown including federal tax, state tax, Social Security, Medicare, and your net take-home pay.',
  ];

  const formulaDescription =
    'After-tax income (also called net income or take-home pay) is the amount of money you actually receive after all required taxes and deductions are subtracted from your gross earnings. Federal income tax is calculated using the 2025 progressive bracket system based on your filing status. State income tax varies by state. FICA taxes include Social Security (6.2% on earnings up to $176,100) and Medicare (1.45% on all earnings, plus an additional 0.9% on earnings above $200,000). Additional deductions reduce your taxable income further.';

  const workedExamples = [
    {
      title: 'Example 1: $75,000 Single in California (9.3% state tax)',
      description:
        'Federal tax on $75,000 (Single 2025 brackets): 10% on first $11,925 ($1,192.50) + 12% on $36,550 ($4,386.00) + 22% on remaining $26,525 ($5,835.50) = $11,414.00. State tax: $75,000 × 9.3% = $6,975. Social Security: $75,000 × 6.2% = $4,650. Medicare: $75,000 × 1.45% = $1,087.50. Total deductions: $24,126.50. Net annual income: $50,873.50 ($4,239.46/month).',
    },
    {
      title: 'Example 2: $100,000 Married Filing Jointly in Texas (0% state tax)',
      description:
        'Federal tax on $100,000 (MFJ 2025 brackets): 10% on first $23,850 ($2,385.00) + 12% on $71,100 ($8,532.00) + 22% on remaining $5,050 ($1,111.00) = $12,028.00. State tax: $0 (Texas has no state income tax). Social Security: $100,000 × 6.2% = $6,200. Medicare: $100,000 × 1.45% = $1,450. Total deductions: $19,678. Net annual income: $80,322 ($6,693.50/month).',
    },
    {
      title: 'Example 3: $55,000 hourly at $26.44/hr, Single, 5% state tax',
      description:
        'Annual gross: $26.44/hr × 40 hrs/week × 52 weeks = $54,995.20. Federal tax: 10% on $11,925 ($1,192.50) + 12% on $36,550 ($4,386.00) + 22% on remaining $6,520.20 ($1,434.44) = $7,012.94. State tax: $54,995.20 × 5% = $2,749.76. Social Security: $54,995.20 × 6.2% = $3,409.70. Medicare: $54,995.20 × 1.45% = $797.43. Total deductions: $13,969.83. Net annual income: $41,025.37 ($3,418.78/month).',
    },
  ];

  const faqs = [
    {
      question: 'What is after-tax income?',
      answer:
        'After-tax income, also known as net income or take-home pay, is the amount of money you receive after all taxes and deductions have been subtracted from your gross earnings. This includes federal income tax, state income tax, Social Security, Medicare, and any additional deductions such as retirement contributions or health insurance premiums. It represents the actual money available for you to spend, save, or invest.',
    },
    {
      question: 'What is FICA and how much does it take from my paycheck?',
      answer:
        'FICA (Federal Insurance Contributions Act) consists of two components: Social Security and Medicare. Social Security tax is 6.2% of your wages up to a wage base limit of $176,100 (for 2025). Medicare tax is 1.45% on all wages with no cap. Additionally, if your earnings exceed $200,000, an Additional Medicare Tax of 0.9% applies to the amount over $200,000. Your employer matches both the Social Security and Medicare contributions, effectively doubling the total FICA contribution.',
    },
    {
      question: 'How does filing status affect my federal taxes?',
      answer:
        'Your filing status determines which tax brackets apply to your income and the size of each bracket. Single filers have the narrowest brackets, meaning they enter higher tax brackets at lower income levels. Married Filing Jointly couples enjoy the widest brackets, so each dollar is taxed at a lower rate compared to single filers at the same total income. Head of Household status (for unmarried individuals supporting a qualifying dependent) offers brackets between Single and Married Filing Jointly. Choosing the correct filing status can significantly impact your tax liability.',
    },
    {
      question: 'What is the difference between gross and net income?',
      answer:
        'Gross income is your total earnings before any taxes, deductions, or withholdings are applied. This includes your salary, wages, bonuses, tips, and other compensation. Net income (also called take-home pay) is what remains after subtracting federal income tax, state income tax, FICA taxes (Social Security and Medicare), and any additional deductions like retirement plan contributions, health insurance premiums, or garnishments. The difference between gross and net income can be 20-40% or more depending on your income level, filing status, location, and deductions.',
    },
    {
      question: 'How can I increase my take-home pay?',
      answer:
        'There are several strategies to increase your take-home pay: (1) Contribute to tax-advantaged accounts like a 401(k) or traditional IRA, which reduce your taxable income. (2) Use a Flexible Spending Account (FSA) or Health Savings Account (HSA) for eligible medical expenses with pre-tax dollars. (3) Adjust your W-4 withholding if you consistently receive large tax refunds. (4) Claim all eligible tax credits and deductions. (5) Consider moving to a state with lower or no income tax. (6) Negotiate a higher salary or seek additional income sources. (7) Review your paycheck regularly for errors in withholding.',
    },
    {
      question: 'What is the difference between tax withholding and actual tax liability?',
      answer:
        'Tax withholding is the amount your employer deducts from each paycheck and sends to the IRS on your behalf, based on information you provide on your W-4 form. Your actual tax liability is the total amount you owe for the year based on your taxable income, deductions, and credits as calculated on your tax return. If your withholding exceeds your tax liability, you receive a refund. If it is less than your liability, you owe additional taxes and may face penalties. This calculator estimates your actual tax liability, not your withholding amount, though they should be similar if your W-4 is properly configured.',
    },
  ];

  const relatedTools = [
    {
      slug: 'payroll',
      title: 'Payroll Calculator',
      description: 'Calculate your paycheck details including taxes and deductions.',
      icon: 'DollarSign',
    },
    {
      slug: 'tax-bracket',
      title: 'Tax Bracket Calculator',
      description: 'Find your federal tax bracket and marginal tax rate.',
      icon: 'Percent',
    },
    {
      slug: 'post-tax-bonus',
      title: 'Post-Tax Bonus Calculator',
      description: 'Estimate your take-home bonus after federal and state taxes.',
      icon: 'Gift',
    },
    {
      slug: 'salary-converter',
      title: 'Salary Converter',
      description: 'Convert salary between hourly, weekly, monthly, and annual pay.',
      icon: 'CalendarClock',
    },
    {
      slug: 'salary-increase',
      title: 'Salary Increase Calculator',
      description: 'Calculate your raise amount in percentage and actual dollars.',
      icon: 'TrendingUp',
    },
    {
      slug: 'property-tax',
      title: 'Property Tax Calculator',
      description: 'Estimate your annual property tax from assessed value and tax rate.',
      icon: 'Building2',
    },
  ];

  // =========================================================================
  // Render
  // =========================================================================

  return (
    <CalculatorLayout
      title="After-Tax Income Calculator"
      description="Calculate your take-home pay after federal tax, state tax, Social Security, Medicare, and deductions using 2025 tax brackets."
      icon={<Wallet className="h-7 w-7 text-white" />}
      breadcrumbs={breadcrumbs}
      tableOfContents={tableOfContents}
      howToSteps={howToSteps}
      formula="Net Income = Gross Income − Federal Tax − State Tax − FICA − Deductions"
      formulaDescription={formulaDescription}
      workedExamples={workedExamples}
      faqs={faqs}
      relatedTools={relatedTools}
    >
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
          <Button
            onClick={handleCalculate}
            className="w-full h-11 text-base font-semibold mt-2"
          >
            Calculate After-Tax Income
          </Button>
        </div>

        {/* ================================================================= */}
        {/* Results Section                                                    */}
        {/* ================================================================= */}
        {showResults && results && (
          <motion.div
            className="space-y-6 pt-2"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
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

      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} />
    </CalculatorLayout>
  );
}
