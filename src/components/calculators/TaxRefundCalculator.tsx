'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, DollarSign, Percent, Info, PieChart as PieChartIcon } from 'lucide-react';
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

// ---------------------------------------------------------------------------
// 2025 Federal Tax Brackets
// ---------------------------------------------------------------------------

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

type FilingStatus = 'single' | 'mfj' | 'mfs' | 'hoh';

const brackets2025: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { min: 0, max: 11925, rate: 10 },
    { min: 11925, max: 48475, rate: 12 },
    { min: 48475, max: 103350, rate: 22 },
    { min: 103350, max: 197300, rate: 24 },
    { min: 197300, max: 250525, rate: 32 },
    { min: 250525, max: 626350, rate: 35 },
    { min: 626350, max: Infinity, rate: 37 },
  ],
  mfj: [
    { min: 0, max: 23850, rate: 10 },
    { min: 23850, max: 96950, rate: 12 },
    { min: 96950, max: 206700, rate: 22 },
    { min: 206700, max: 394600, rate: 24 },
    { min: 394600, max: 501050, rate: 32 },
    { min: 501050, max: 751600, rate: 35 },
    { min: 751600, max: Infinity, rate: 37 },
  ],
  mfs: [
    { min: 0, max: 11925, rate: 10 },
    { min: 11925, max: 48475, rate: 12 },
    { min: 48475, max: 103350, rate: 22 },
    { min: 103350, max: 197300, rate: 24 },
    { min: 197300, max: 250525, rate: 32 },
    { min: 250525, max: 375800, rate: 35 },
    { min: 375800, max: Infinity, rate: 37 },
  ],
  hoh: [
    { min: 0, max: 17000, rate: 10 },
    { min: 17000, max: 64850, rate: 12 },
    { min: 64850, max: 103350, rate: 22 },
    { min: 103350, max: 197300, rate: 24 },
    { min: 197300, max: 250500, rate: 32 },
    { min: 250500, max: 626350, rate: 35 },
    { min: 626350, max: Infinity, rate: 37 },
  ],
};

const standardDeductions: Record<FilingStatus, number> = {
  single: 15000,
  mfj: 30000,
  mfs: 15000,
  hoh: 22500,
};

const STATE_TAX_RATE = 5.0; // Flat estimate for state tax

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BracketBreakdown {
  rate: number;
  min: number;
  max: number;
  income: number;
  tax: number;
}

interface TaxResult {
  filingStatus: FilingStatus;
  grossIncome: number;
  standardDeduction: number;
  itemizedDeduction: number;
  totalDeduction: number;
  taxableIncome: number;
  taxCredits: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  totalWithholding: number;
  refund: number;
  effectiveRate: number;
  bracketBreakdown: BracketBreakdown[];
  topBracket: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function calculateFederalTax(taxableIncome: number, status: FilingStatus): { tax: number; breakdown: BracketBreakdown[]; topBracket: number } {
  const bracketList = brackets2025[status];
  const breakdown: BracketBreakdown[] = [];
  let totalTax = 0;
  let topBracket = 10;

  for (const bracket of bracketList) {
    if (taxableIncome <= bracket.min) break;

    const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
    const taxInBracket = taxableInBracket * (bracket.rate / 100);
    totalTax += taxInBracket;
    topBracket = bracket.rate;

    breakdown.push({
      rate: bracket.rate,
      min: bracket.min,
      max: bracket.max === Infinity ? Infinity : bracket.max,
      income: taxableInBracket,
      tax: taxInBracket,
    });
  }

  return { tax: totalTax, breakdown, topBracket };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TaxRefundCalculator() {
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [grossIncome, setGrossIncome] = useState('');
  const [federalWithheld, setFederalWithheld] = useState('');
  const [stateWithheld, setStateWithheld] = useState('');
  const [deductionType, setDeductionType] = useState<'standard' | 'itemized'>('standard');
  const [itemizedDeduction, setItemizedDeduction] = useState('');
  const [taxCredits, setTaxCredits] = useState('');
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { history, saveEntry, clearHistory } = useCalcHistory<{ filingStatus: string; grossIncome: string; federalWithheld: string; stateWithheld: string }>('tax-refund');

  const handleCalculate = () => {
    setResult(null);
    setError(null);

    const income = parseFloat(grossIncome);
    if (isNaN(income) || income <= 0) {
      setError('Please enter a valid annual gross income greater than zero.');
      return;
    }

    const fedWh = parseFloat(federalWithheld) || 0;
    const stWh = parseFloat(stateWithheld) || 0;
    const credits = parseFloat(taxCredits) || 0;

    if (fedWh < 0 || stWh < 0 || credits < 0) {
      setError('Withholding and credit values cannot be negative.');
      return;
    }

    let totalDeduction: number;
    if (deductionType === 'standard') {
      totalDeduction = standardDeductions[filingStatus];
    } else {
      totalDeduction = parseFloat(itemizedDeduction) || 0;
      if (totalDeduction < 0) {
        setError('Itemized deductions cannot be negative.');
        return;
      }
    }

    const taxableIncome = Math.max(income - totalDeduction, 0);
    const { tax: fedTax, breakdown, topBracket } = calculateFederalTax(taxableIncome, filingStatus);
    const stateTax = taxableIncome * (STATE_TAX_RATE / 100);
    const totalTaxBeforeCredits = fedTax + stateTax;
    const creditsApplied = Math.min(credits, fedTax);
    const effectiveFederalTax = fedTax - creditsApplied;
    const totalTax = effectiveFederalTax + stateTax;
    const totalWithholding = fedWh + stWh;
    const refund = totalWithholding - totalTax;
    const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

    setResult({
      filingStatus,
      grossIncome: income,
      standardDeduction: standardDeductions[filingStatus],
      itemizedDeduction: deductionType === 'itemized' ? totalDeduction : 0,
      totalDeduction,
      taxableIncome,
      taxCredits: creditsApplied,
      federalTax: effectiveFederalTax,
      stateTax,
      totalTax,
      totalWithholding,
      refund,
      effectiveRate,
      bracketBreakdown: breakdown,
      topBracket,
    });
    saveEntry(
      { filingStatus, grossIncome, federalWithheld, stateWithheld },
      refund >= 0
        ? `Refund: ${formatCurrency(refund)} (${effectiveRate.toFixed(1)}% effective)`
        : `Owe: ${formatCurrency(Math.abs(refund))} (${effectiveRate.toFixed(1)}% effective)`
    );
  };

  const handleRestore = (inputs: { filingStatus: string; grossIncome: string; federalWithheld: string; stateWithheld: string }) => {
    setFilingStatus(inputs.filingStatus as FilingStatus);
    setGrossIncome(inputs.grossIncome);
    setFederalWithheld(inputs.federalWithheld);
    setStateWithheld(inputs.stateWithheld);
    setResult(null);
  };

  const handleReset = () => {
    setFilingStatus('single');
    setGrossIncome('');
    setFederalWithheld('');
    setStateWithheld('');
    setDeductionType('standard');
    setItemizedDeduction('');
    setTaxCredits('');
    setResult(null);
    setError(null);
  };

  const filingStatusLabel: Record<FilingStatus, string> = {
    single: 'Single',
    mfj: 'Married Filing Jointly',
    mfs: 'Married Filing Separately',
    hoh: 'Head of Household',
  };

  // ------ SEO content ------

  const howToSteps = [
    'Select your filing status: Single, Married Filing Jointly, Married Filing Separately, or Head of Household. This determines your tax brackets and standard deduction.',
    'Enter your annual gross income — this is your total income before any taxes, deductions, or exemptions are applied. Include wages, salaries, tips, and other taxable income.',
    'Enter the federal and state tax amounts withheld year-to-date (YTD). You can find these on your pay stubs or W-2 form in boxes 2 (federal) and 17 (state).',
    'Choose between the standard deduction or itemized deductions. The standard deduction is a flat amount based on your filing status. Itemized deductions include mortgage interest, charitable contributions, and state/local taxes (SALT, capped at $10,000). Enter any applicable tax credits.',
    'Click "Calculate Refund" to see your estimated federal and state tax liability, total withholding, and whether you will receive a refund or owe additional taxes. Review the bracket-by-bracket breakdown for a detailed view.',
  ];

  const formula = 'Refund = Total Tax Withheld − Total Tax Liability';
  const formulaDescription =
    'Your tax refund is the difference between what was withheld from your paychecks (federal and state) and your actual tax liability. Tax liability is calculated using progressive tax brackets — each portion of your taxable income is taxed at a different rate. Your taxable income is your gross income minus deductions (standard or itemized). Tax credits are then subtracted directly from your federal tax liability, reducing it dollar-for-dollar. If your total withholding exceeds your total tax, you receive a refund. If your withholding falls short, you owe additional taxes. The 2025 standard deductions are: Single $15,000, Married Filing Jointly $30,000, Married Filing Separately $15,000, Head of Household $22,500.';

  const workedExamples = [
    {
      title: 'Single, $65,000 Income, $8,500 Federal Withheld',
      description:
        'A single filer earning $65,000 with $8,500 federal tax withheld and no state tax withheld. Standard deduction: $14,600. Taxable income: $65,000 - $14,600 = $50,400. Federal tax: $1,160 (10% bracket on first $11,600) + $4,266 (12% bracket on $35,550) + $719 (22% bracket on $3,270) = $6,145. State tax estimate (5%): $2,520. Total tax: $8,665. Total withholding: $8,500. Amount owed: $165.',
    },
    {
      title: 'Married Filing Jointly, $120,000, $15,000 Federal + $5,000 State Withheld',
      description:
        'A married couple filing jointly with $120,000 combined income. Federal withheld: $15,000. State withheld: $5,000. Standard deduction: $29,200. Taxable income: $90,800. Federal tax: $2,320 (10% on first $23,200) + $8,532 (12% on $71,100) + $1,353 (22% on $6,150) = $12,205. State tax (5%): $4,540. Total tax: $16,745. Total withholding: $20,000. Estimated refund: $3,255.',
    },
    {
      title: 'Head of Household, $45,000 Income, $4,200 Federal Withheld, $1,000 Credits',
      description:
        'A head of household filer earning $45,000 with $4,200 federal tax withheld and $1,000 in tax credits. Standard deduction: $21,900. Taxable income: $23,100. Federal tax: $1,655 (10% on first $16,550) + $723 (12% on $6,025) = $2,378. After $1,000 in credits: $1,378. State tax (5%): $1,155. Total tax: $2,533. Total withholding: $4,200. Estimated refund: $1,667.',
    },
  ];

  const faqs = [
    {
      question: 'When will I get my tax refund?',
      answer:
        'The IRS typically issues most refunds within 21 calendar days after accepting your e-filed return. Paper returns take longer — usually 6-8 weeks. You can check your refund status using the IRS "Where\'s My Refund?" tool on their website or the IRS2Go mobile app. Your refund may be delayed if there are errors on your return, if you claimed the Earned Income Tax Credit (EITC) or Additional Child Tax Credit (ACTC — these refunds are not issued before mid-February), if your return requires manual review, or if you are affected by identity theft protections. Filing electronically with direct deposit is the fastest way to receive your refund.',
    },
    {
      question: 'How do I check my tax refund status?',
      answer:
        'You can check your federal refund status online using the IRS "Where\'s My Refund?" tool at irs.gov/refunds. You will need your Social Security number, filing status, and the exact refund amount shown on your return. The tool updates once per day, usually overnight. For state refunds, check your state\'s department of revenue or taxation website — most states have their own refund tracking tools. You can also call the IRS refund hotline at 1-800-829-1954, but online tools are generally faster and more detailed.',
    },
    {
      question: 'What if I owe money instead of getting a refund?',
      answer:
        'If your calculation shows you owe taxes, you still need to file your return by the deadline (typically April 15). You can pay online through the IRS Direct Pay system, by credit or debit card, by electronic funds withdrawal, or by check or money order. If you cannot pay the full amount, you can request an installment agreement with the IRS. The penalty for failing to file is much higher than the penalty for failing to pay, so always file on time even if you cannot pay. You may also be able to reduce your balance through an offer in compromise or by applying for currently not collectible status if you are experiencing financial hardship.',
    },
    {
      question: 'Should I take the standard deduction or itemize?',
      answer:
        'You should choose whichever deduction amount is larger. The 2025 standard deductions are: Single $15,000, Married Filing Jointly $30,000, Married Filing Separately $15,000, Head of Household $22,500. You should itemize if your qualifying expenses exceed these amounts. Common itemized deductions include: mortgage interest (on up to $750,000 of mortgage debt), state and local taxes (SALT deduction, capped at $10,000), charitable contributions, medical expenses exceeding 7.5% of your AGI, and casualty and theft losses from federally declared disasters. Since the Tax Cuts and Jobs Act of 2017, roughly 90% of taxpayers take the standard deduction because it was nearly doubled.',
    },
    {
      question: 'What is the difference between tax credits and tax deductions?',
      answer:
        'Tax deductions reduce your taxable income, while tax credits reduce your tax liability directly. Deductions lower the amount of income subject to tax — for example, a $10,000 deduction saves you $1,200 in taxes if you are in the 12% bracket. Credits reduce your actual tax bill dollar-for-dollar — a $1,000 credit saves exactly $1,000 regardless of your bracket. Some credits are refundable (like the Earned Income Tax Credit and the Additional Child Tax Credit), meaning if the credit exceeds your tax liability, you receive the difference as a refund. Non-refundable credits (like the Child and Dependent Care Credit) can only reduce your tax to zero — any excess is lost. Credits are generally more valuable than deductions of the same amount.',
    },
    {
      question: 'How can I increase my tax refund?',
      answer:
        'To increase your refund, you can: (1) Maximize your deductions — contribute to a traditional IRA or 401(k), donate to charity, track medical expenses, and bundle deductions into one tax year if close to the itemization threshold. (2) Claim all eligible tax credits — child tax credit, education credits (American Opportunity and Lifetime Learning), earned income credit, and saver\'s credit. (3) Adjust your W-4 withholding — increasing withholding reduces your paycheck but increases your refund. However, getting a large refund means you are essentially giving the government an interest-free loan. It may be better to reduce withholding and invest the difference. (4) File jointly if married — this often results in a lower tax liability than filing separately, thanks to wider tax brackets. (5) Contribute to an HSA if you have a high-deductible health plan — contributions are tax-deductible.',
    },
  ];

  const relatedTools = [
    { slug: 'tax-bracket', title: 'Tax Bracket Calculator', description: 'Find your federal tax bracket and effective tax rate', icon: 'FileText' },
    { slug: 'after-tax-income', title: 'After-Tax Income Calculator', description: 'Calculate your net income after federal and state taxes', icon: 'Wallet' },
    { slug: 'salary-tax', title: 'Salary Tax Calculator', description: 'See your total tax burden broken down by tax type', icon: 'Shield' },
    { slug: 'payroll', title: 'Payroll Calculator', description: 'Estimate your take-home pay after taxes and deductions', icon: 'CreditCard' },
    { slug: 'hourly-paycheck', title: 'Hourly Paycheck Calculator', description: 'Calculate your hourly take-home pay after taxes', icon: 'BadgeDollarSign' },
  ];

  return (
    <CalculatorLayout
      title="Tax Refund Calculator"
      description="Estimate your federal and state tax refund based on income, withholding, deductions, and filing status using 2025 tax brackets."
      icon={<Receipt className="h-7 w-7 text-white" />}
      breadcrumbs={[{ label: 'Calculators' }, { label: 'Tax Refund Calculator' }]}
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
        {/* Filing Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            <Receipt className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
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

        {/* Gross Income */}
        <div className="space-y-2">
          <Label htmlFor="grossIncome" className="text-sm font-medium">
            <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Annual Gross Income ($)
          </Label>
          <Input
            id="grossIncome"
            type="number"
            min="0"
            step="1000"
            placeholder="e.g., 75000"
            value={grossIncome}
            onChange={(e) => setGrossIncome(e.target.value)}
          />
        </div>

        {/* Withholding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="federalWithheld" className="text-sm font-medium">
              Federal Tax Withheld (YTD) ($)
            </Label>
            <Input
              id="federalWithheld"
              type="number"
              min="0"
              step="100"
              placeholder="e.g., 10000"
              value={federalWithheld}
              onChange={(e) => setFederalWithheld(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">W-2 Box 2</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stateWithheld" className="text-sm font-medium">
              State Tax Withheld (YTD) ($)
            </Label>
            <Input
              id="stateWithheld"
              type="number"
              min="0"
              step="100"
              placeholder="e.g., 3000"
              value={stateWithheld}
              onChange={(e) => setStateWithheld(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">W-2 Box 17</p>
          </div>
        </div>

        {/* Deduction Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            <Percent className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Deduction Type
          </Label>
          <div className="flex rounded-xl bg-muted/50 p-1 border border-border/50">
            <button
              type="button"
              onClick={() => { setDeductionType('standard'); setResult(null); }}
              className={`flex-1 flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                deductionType === 'standard'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Standard ({formatCurrency(standardDeductions[filingStatus])})
            </button>
            <button
              type="button"
              onClick={() => { setDeductionType('itemized'); setResult(null); }}
              className={`flex-1 flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                deductionType === 'itemized'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Itemized
            </button>
          </div>
        </div>

        {deductionType === 'itemized' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <Label htmlFor="itemizedDeduction" className="text-sm font-medium">
              Itemized Deductions ($)
            </Label>
            <Input
              id="itemizedDeduction"
              type="number"
              min="0"
              step="100"
              placeholder="e.g., 25000"
              value={itemizedDeduction}
              onChange={(e) => setItemizedDeduction(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Mortgage interest + SALT (max $10K) + charitable contributions + medical expenses above 7.5% AGI
            </p>
          </motion.div>
        )}

        {/* Tax Credits */}
        <div className="space-y-2">
          <Label htmlFor="taxCredits" className="text-sm font-medium">
            <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Tax Credits ($)
          </Label>
          <Input
            id="taxCredits"
            type="number"
            min="0"
            step="100"
            placeholder="e.g., 2000"
            value={taxCredits}
            onChange={(e) => setTaxCredits(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Child tax credit, education credits, EITC, and other non-refundable credits
          </p>
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

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            <Receipt className="h-4 w-4 mr-2" />
            Calculate Refund
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

        {/* ================================================================= */}
        {/* Results                                                           */}
        {/* ================================================================= */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="result-display mt-6" aria-live="polite"
          >
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              {/* Main Result */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  {result.refund >= 0 ? 'Estimated Tax Refund' : 'Estimated Amount Owed'}
                </p>
                <p className={`text-4xl font-bold ${result.refund >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(result.refund))}
                </p>
                <Badge
                  variant="outline"
                  className={`px-3 py-1 text-sm font-medium ${
                    result.refund >= 0
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                      : 'bg-red-500/10 border-red-500/30 text-red-600'
                  }`}
                >
                  {result.refund >= 0 ? 'You will receive a refund' : 'You owe additional taxes'}
                </Badge>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Taxable Income</p>
                  <p className="text-lg font-bold">{formatCurrency(result.taxableIncome)}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Total Tax</p>
                  <p className="text-lg font-bold">{formatCurrency(result.totalTax)}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Total Withheld</p>
                  <p className="text-lg font-bold">{formatCurrency(result.totalWithholding)}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Effective Rate</p>
                  <p className="text-lg font-bold">{result.effectiveRate.toFixed(1)}%</p>
                </motion.div>
              </div>

              {/* Visual Pie Chart: Withholding vs Tax Liability */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <PieChartIcon className="h-4.5 w-4.5 text-primary" />
                  Withholding vs Tax Liability
                </p>
                <div className="h-72 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Total Withholding', value: result.totalWithholding, color: '#3b82f6' },
                          { name: 'Total Tax Liability', value: result.totalTax, color: result.refund >= 0 ? '#10b981' : '#ef4444' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {[
                          { name: 'Total Withholding', value: result.totalWithholding, color: '#3b82f6' },
                          { name: 'Total Tax Liability', value: result.totalTax, color: result.refund >= 0 ? '#10b981' : '#ef4444' },
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
                <div className="text-center mt-2">
                  <span className={`text-sm font-medium ${result.refund >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {result.refund >= 0
                      ? `Refund: ${formatCurrency(result.refund)}`
                      : `Amount Owed: ${formatCurrency(Math.abs(result.refund))}`
                    }
                  </span>
                </div>
              </div>

              {/* Bracket Breakdown Table */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Tax Bracket Breakdown ({filingStatusLabel[result.filingStatus]})
                </p>
                <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/30 sticky top-0">
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Bracket</th>
                          <th className="text-right px-4 py-3 font-medium text-muted-foreground">Income</th>
                          <th className="text-right px-4 py-3 font-medium text-muted-foreground">Tax</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {result.bracketBreakdown.map((b, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="text-xs font-mono">
                                {b.rate}%
                              </Badge>
                              <span className="ml-2 text-xs text-muted-foreground">
                                {formatCurrency(b.min)} – {b.max === Infinity ? '∞' : formatCurrency(b.max)}
                              </span>
                            </td>
                            <td className="text-right px-4 py-3 text-muted-foreground">
                              {formatCurrency(b.income)}
                            </td>
                            <td className="text-right px-4 py-3 font-medium">
                              {formatCurrency(b.tax)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-emerald-500/5 font-bold">
                          <td className="px-4 py-3">Total Federal Tax</td>
                          <td className="text-right px-4 py-3">{formatCurrency(result.taxableIncome)}</td>
                          <td className="text-right px-4 py-3 text-emerald-600">
                            {formatCurrency(result.federalTax + result.taxCredits)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* Top Bracket & Marginal Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Top Tax Bracket</p>
                  <p className="text-2xl font-bold text-emerald-600">{result.topBracket}%</p>
                  <p className="text-xs text-muted-foreground">(Marginal Rate)</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Total Deduction</p>
                  <p className="text-2xl font-bold">{formatCurrency(result.totalDeduction)}</p>
                  <p className="text-xs text-muted-foreground">
                    {deductionType === 'standard' ? 'Standard' : 'Itemized'}
                  </p>
                </div>
              </div>

              {/* Info Box */}
              <div className="flex items-start gap-2 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Disclaimer:</strong> This calculator provides estimates using 2025 federal tax brackets and a flat {STATE_TAX_RATE}% state tax estimate.
                  Actual tax liability may differ due to additional state tax rules, pre-tax deductions (401k, HSA), self-employment tax,
                  capital gains, and other factors not included. State tax is estimated at a flat {STATE_TAX_RATE}% rate — your actual
                  state rate varies. Consult a tax professional for precise calculations.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} />
    </CalculatorLayout>
  );
}
