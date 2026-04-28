'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  DollarSign,
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

// ---------------------------------------------------------------------------
// 2025 Federal Tax Brackets & Constants
// ---------------------------------------------------------------------------

type FilingStatus = 'single' | 'mfj' | 'mfs' | 'hoh';

interface Bracket {
  min: number;
  max: number;
  rate: number;
}

const BRACKETS: Record<FilingStatus, Bracket[]> = {
  single: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
  mfj: [
    { min: 0, max: 23850, rate: 0.10 },
    { min: 23850, max: 96950, rate: 0.12 },
    { min: 96950, max: 206700, rate: 0.22 },
    { min: 206700, max: 394600, rate: 0.24 },
    { min: 394600, max: 501050, rate: 0.32 },
    { min: 501050, max: 751600, rate: 0.35 },
    { min: 751600, max: Infinity, rate: 0.37 },
  ],
  mfs: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 375800, rate: 0.35 },
    { min: 375800, max: Infinity, rate: 0.37 },
  ],
  hoh: [
    { min: 0, max: 17000, rate: 0.10 },
    { min: 17000, max: 64850, rate: 0.12 },
    { min: 64850, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250500, rate: 0.32 },
    { min: 250500, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
};

const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 15000,
  mfj: 30000,
  mfs: 15000,
  hoh: 22500,
};

const SS_WAGE_BASE = 176100;
const SS_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const ADDITIONAL_MEDICARE_RATE = 0.009;
const ADDITIONAL_MEDICARE_THRESHOLD = 200000;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SalaryTaxResult {
  salary: number;
  filingStatus: FilingStatus;
  standardDeduction: number;
  taxableIncome: number;
  bracketBreakdown: {
    min: number;
    max: number;
    rate: number;
    taxable: number;
    tax: number;
  }[];
  federalTax: number;
  stateTax: number;
  localTax: number;
  socialSecurity: number;
  medicare: number;
  additionalMedicare: number;
  ficaTotal: number;
  totalTaxes: number;
  effectiveRate: number;
  marginalRate: number;
  takeHomePay: number;
  monthlyTakeHome: number;
  weeklyTakeHome: number;
  dailyTakeHome: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const FILING_LABELS: Record<FilingStatus, string> = {
  single: 'Single',
  mfj: 'Married Filing Jointly',
  mfs: 'Married Filing Separately',
  hoh: 'Head of Household',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SalaryTaxCalculator() {
  const [salary, setSalary] = useState('');
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [stateTaxPct, setStateTaxPct] = useState('5');
  const [localTaxPct, setLocalTaxPct] = useState('');

  const [result, setResult] = useState<SalaryTaxResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ salary: string; filingStatus: string; stateTaxPct: string; localTaxPct: string }>('salary-tax-calculator');

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    const sal = parseFloat(salary);
    if (isNaN(sal) || sal <= 0) {
      setError('Please enter a valid annual salary greater than zero.');
      return;
    }

    const stRate = parseFloat(stateTaxPct) || 0;
    const locRate = parseFloat(localTaxPct) || 0;

    if (stRate < 0 || locRate < 0) {
      setError('Tax rates cannot be negative.');
      return;
    }

    const stdDeduction = STANDARD_DEDUCTION[filingStatus];
    const taxableIncome = Math.max(sal - stdDeduction, 0);

    // Federal tax by bracket
    const brackets = BRACKETS[filingStatus];
    const bracketBreakdown: SalaryTaxResult['bracketBreakdown'] = [];
    let federalTax = 0;
    let marginalRate = 0;

    for (const bracket of brackets) {
      if (taxableIncome <= bracket.min) break;

      const taxable = Math.min(taxableIncome, bracket.max) - bracket.min;
      const tax = taxable * bracket.rate;
      federalTax += tax;
      marginalRate = bracket.rate;

      bracketBreakdown.push({
        min: bracket.min,
        max: bracket.max,
        rate: bracket.rate,
        taxable,
        tax,
      });
    }

    // State and local tax (on gross salary, simplified)
    const stateTax = sal * (stRate / 100);
    const localTax = sal * (locRate / 100);

    // FICA
    const socialSecurity = Math.min(sal, SS_WAGE_BASE) * SS_RATE;
    const medicare = sal * MEDICARE_RATE;
    const additionalMedicare =
      sal > ADDITIONAL_MEDICARE_THRESHOLD
        ? (sal - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE
        : 0;
    const ficaTotal = socialSecurity + medicare + additionalMedicare;

    // Totals
    const totalTaxes = federalTax + stateTax + localTax + ficaTotal;
    const effectiveRate = sal > 0 ? (totalTaxes / sal) * 100 : 0;
    const takeHomePay = sal - totalTaxes;

    setResult({
      salary: sal,
      filingStatus,
      standardDeduction: stdDeduction,
      taxableIncome,
      bracketBreakdown,
      federalTax,
      stateTax,
      localTax,
      socialSecurity,
      medicare,
      additionalMedicare,
      ficaTotal,
      totalTaxes,
      effectiveRate,
      marginalRate,
      takeHomePay,
      monthlyTakeHome: takeHomePay / 12,
      weeklyTakeHome: takeHomePay / 52,
      dailyTakeHome: takeHomePay / 260,
    });
    saveEntry(
      { salary, filingStatus, stateTaxPct, localTaxPct },
      `${formatCurrency(sal)} salary — Take-home: ${formatCurrency(takeHomePay)} (${effectiveRate.toFixed(1)}% effective)`
    );
  };

  const handleRestore = (inputs: { salary: string; filingStatus: string; stateTaxPct: string; localTaxPct: string }) => {
    setSalary(inputs.salary);
    setFilingStatus(inputs.filingStatus as FilingStatus);
    setStateTaxPct(inputs.stateTaxPct);
    setLocalTaxPct(inputs.localTaxPct);
    setResult(null);
  };

  const handleReset = () => {
    setSalary('');
    setFilingStatus('single');
    setStateTaxPct('5');
    setLocalTaxPct('');
    setResult(null);
    setError(null);
  };

  // ------ SEO content ------

  const howToSteps = [
    'Enter your annual gross salary before any deductions. This is the total amount shown on your employment offer or W-2 form.',
    'Select your federal filing status: Single, Married Filing Jointly, Married Filing Separately, or Head of Household. This determines which tax brackets and standard deduction apply.',
    'Enter your state income tax rate as a flat percentage. Since state tax systems vary widely, this calculator uses a simplified flat rate. Leave blank or enter 0 for states with no income tax.',
    'Optionally, enter a local or city tax percentage if your municipality imposes an additional income tax (e.g., New York City, Detroit, or certain Ohio cities).',
    'Click "Calculate Tax" to see a detailed breakdown including federal tax by bracket, FICA taxes, your effective and marginal rates, and take-home pay on monthly, weekly, and daily bases.',
  ];

  const formula =
    'Effective Tax Rate = (Total Taxes / Gross Salary) × 100%';

  const formulaDescription =
    'The United States uses a progressive tax system, meaning income is taxed at increasing rates as it rises through tax brackets. Your first dollars of taxable income are taxed at 10%, and only the dollars above each bracket threshold are taxed at the higher rate. Your effective tax rate is the average rate across all brackets — it is always lower than your marginal (top) bracket rate because of this graduated structure. FICA taxes (Social Security at 6.2% up to the $176,100 wage base, and Medicare at 1.45% on all wages plus 0.9% on earnings above $200,000) are separate from income tax and are calculated on your gross salary before the standard deduction. The standard deduction ($15,000 single / $30,000 MFJ / $22,500 HoH for 2025) reduces your taxable income before bracket calculations begin.';

  const workedExamples = [
    {
      title: '$50,000 Salary — Single Filer',
      description:
        'With a $50,000 salary filing single, the standard deduction of $15,000 brings taxable income to $35,000. Federal tax: 10% on the first $11,925 ($1,192.50) + 12% on the remaining $23,075 ($2,769.00) = $3,961.50. Social Security: 6.2% of $50,000 = $3,100. Medicare: 1.45% of $50,000 = $725. State tax (5%): $2,500. Total taxes: ~$10,286.50. Effective rate: 20.6%. Take-home: ~$39,714/year ($3,309/month).',
    },
    {
      title: '$100,000 Salary — Married Filing Jointly',
      description:
        'With $100,000 filing MFJ, the standard deduction of $30,000 gives taxable income of $70,000. Federal tax: 10% on $23,850 ($2,385.00) + 12% on $46,150 ($5,538.00) = $7,923.00. Social Security: 6.2% of $100,000 = $6,200. Medicare: 1.45% = $1,450. State tax (5%): $5,000. Total taxes: ~$20,573. Effective rate: 20.6%. Take-home: ~$79,427/year ($6,619/month). Filing jointly significantly lowers the tax burden compared to two single filers.',
    },
    {
      title: '$200,000 Salary — Single Filer',
      description:
        'A $200,000 single salary with standard deduction $15,000 gives $185,000 taxable. Federal tax spans four brackets: 10% on $11,925 ($1,192.50) + 12% on $36,550 ($4,386.00) + 22% on $54,875 ($12,072.50) + 24% on $81,650 ($19,596.00) = $37,247.00. Social Security: 6.2% on $176,100 = $10,918.20. Medicare: 1.45% on $200,000 = $2,900 + 0.9% on amount above $200,000 = $0 (exactly at threshold). State tax (5%): $10,000. Total taxes: ~$61,065.20. Effective rate: 30.5%. Marginal rate: 24%. Take-home: ~$138,935/year ($11,578/month).',
    },
  ];

  const faqs = [
    {
      question: 'Why is my effective tax rate lower than my bracket rate?',
      answer:
        'Because the US uses a progressive (graduated) tax system, not a flat tax. Only the income within each bracket is taxed at that bracket\'s rate. For example, if you\'re in the 22% bracket, only your income above the 22% threshold is taxed at 22%. Your income below that threshold is taxed at 10% and 12%. Your effective rate is a weighted average of all the rates applied to portions of your income, so it\'s always lower than your marginal (top) bracket rate. This is a common source of confusion — being "in the 22% bracket" does NOT mean all your income is taxed at 22%.',
    },
    {
      question: 'What is FICA and how is it calculated?',
      answer:
        'FICA (Federal Insurance Contributions Act) is the combined tax for Social Security and Medicare, totaling 7.65% of your wages. Social Security tax is 6.2% on wages up to $176,100 (2025 wage base) — once you earn above this amount, no more Social Security tax is withheld for the year. Medicare tax is 1.45% on all wages with no cap. Additionally, high earners pay an Additional Medicare Tax of 0.9% on wages exceeding $200,000 (single) or $250,000 (married filing jointly). Your employer matches your FICA contributions, paying an equal 7.65%, so the total cost is 15.3% of your wages.',
    },
    {
      question: 'What is the Social Security wage base?',
      answer:
        'The Social Security wage base is the maximum amount of earnings subject to Social Security tax in a given year. For 2025, the wage base is $176,100. Once your cumulative earnings reach this amount, no further Social Security tax (6.2%) is withheld for the rest of the year, though Medicare tax (1.45%) continues on all earnings. The wage base is adjusted annually for inflation by the Social Security Administration. If you earn $200,000, you\'ll pay Social Security tax on the first $176,100 ($10,918.20) and Medicare tax on the full $200,000 ($2,900.00 plus potential additional Medicare tax).',
    },
    {
      question: 'What is the Additional Medicare Tax?',
      answer:
        'The Additional Medicare Tax is a 0.9% surtax on earnings above a threshold: $200,000 for single filers, $250,000 for married filing jointly, and $125,000 for married filing separately. Unlike regular Medicare tax, there is no employer match for the Additional Medicare Tax — you pay the full 0.9%. This tax applies to wages and self-employment income combined. For example, if you earn $250,000 as a single filer, you\'ll pay an extra $450 (0.9% × $50,000) in Additional Medicare Tax on top of the regular 1.45% Medicare tax on all your earnings.',
    },
    {
      question: 'Why does state tax vary so much?',
      answer:
        'State income tax systems vary dramatically. Seven states (Alaska, Florida, Nevada, South Dakota, Texas, Washington, Wyoming) have no state income tax at all. Others have flat rates (e.g., Colorado at 4.4%, Illinois at 4.95%, Pennsylvania at 3.07%), while most use progressive brackets like the federal system (e.g., California ranges from 1% to 13.3%, New York from 4% to 10.9%). Some states also allow local/city income taxes. This calculator simplifies by using a flat rate you provide, but your actual state tax may be calculated differently depending on your state\'s rules, deductions, and credits. Always check your state\'s specific tax calculator for the most accurate result.',
    },
    {
      question: 'How can I reduce my taxable income?',
      answer:
        'Several strategies can lower your taxable income: (1) Maximize pre-tax retirement contributions — 401(k) up to $23,500 ($31,000 age 50+), traditional IRA up to $7,000 ($8,000 age 50+). (2) Use Health Savings Account (HSA) if eligible — $4,300 individual / $8,550 family in 2025. (3) Itemize deductions if they exceed the standard deduction (mortgage interest, state taxes up to $10,000 SALT cap, charitable donations). (4) Contribute to FSAs for healthcare or dependent care. (5) Use above-the-line deductions like student loan interest ($2,500 max) and educator expenses ($300). (6) Consider tax-loss harvesting for investment losses. (7) Maximize tax credits (child tax credit, education credits) which directly reduce tax owed rather than just taxable income.',
    },
  ];

  const relatedTools = [
    {
      slug: 'tax-bracket-calculator',
      title: 'Tax Bracket Calculator',
      description:
        'Find your federal tax bracket, effective and marginal tax rates',
      icon: 'FileText',
    },
    {
      slug: 'after-tax-income-calculator',
      title: 'After-Tax Income Calculator',
      description:
        'Calculate your net income after federal and state taxes with detailed breakdown',
      icon: 'Wallet',
    },
    {
      slug: 'tax-refund-estimator',
      title: 'Tax Refund Calculator',
      description:
        'Estimate your federal and state tax refund based on withholding and deductions',
      icon: 'Receipt',
    },
    {
      slug: 'payroll-calculator',
      title: 'Payroll & Paycheck Calculator',
      description:
        'Estimate your take-home pay after federal and state taxes and deductions',
      icon: 'CreditCard',
    },
    {
      slug: 'salary-converter',
      title: 'Salary Converter Calculator',
      description:
        'Convert between hourly, daily, weekly, and annual salary rates',
      icon: 'ArrowLeftRight',
    },
    {
      slug: 'property-tax-calculator',
      title: 'Property Tax Calculator',
      description:
        'Estimate your annual property tax from assessed value and tax rate',
      icon: 'Building2',
    },
  ];

  // ------ Render ------

  return (
    <CalculatorLayout
      title="Salary Tax Calculator"
      description="Calculate your total tax burden on salary income including federal, state, FICA, and local taxes. See effective rates and take-home pay."
      icon={<Shield className="h-7 w-7 text-white" />}
      breadcrumbs={[
        { label: 'Calculators' },
        { label: 'Salary Tax Calculator' },
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
        {/* Annual Salary */}
        <div className="space-y-2">
          <Label htmlFor="salary" className="text-sm font-medium">
            <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Annual Gross Salary ($)
          </Label>
          <Input
            id="salary"
            type="number"
            min="0"
            step="1000"
            placeholder="e.g., 75000"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>

        {/* Filing Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            <Info className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Filing Status
          </Label>
          <Select
            value={filingStatus}
            onValueChange={(v) => {
              setFilingStatus(v as FilingStatus);
              setResult(null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="mfj">Married Filing Jointly</SelectItem>
              <SelectItem value="mfs">Married Filing Separately</SelectItem>
              <SelectItem value="hoh">Head of Household</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* State & Local Tax */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stateTax" className="text-sm font-medium">
              <Percent className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              State Tax Rate (%)
            </Label>
            <Input
              id="stateTax"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="e.g., 5"
              value={stateTaxPct}
              onChange={(e) => setStateTaxPct(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Flat rate (simplified)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="localTax" className="text-sm font-medium">
              Local/City Tax (%)
            </Label>
            <Input
              id="localTax"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="e.g., 0 (optional)"
              value={localTaxPct}
              onChange={(e) => setLocalTaxPct(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank if none
            </p>
          </div>
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
            <Shield className="h-4 w-4 mr-2" />
            Calculate Tax
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
                Annual Take-Home Pay — {FILING_LABELS[result.filingStatus]}
              </p>
              <p className="text-4xl font-bold text-emerald-600">
                {formatCurrency(result.takeHomePay)}
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 px-3 py-1 text-xs font-medium"
                >
                  Effective Rate: {result.effectiveRate.toFixed(1)}%
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-red-500/10 border-red-500/30 text-red-500 px-3 py-1 text-xs font-medium"
                >
                  Marginal Rate: {(result.marginalRate * 100).toFixed(0)}%
                </Badge>
              </div>
            </div>

            {/* Take-home Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Monthly', value: result.monthlyTakeHome },
                { label: 'Weekly', value: result.weeklyTakeHome },
                { label: 'Daily (260 days)', value: result.dailyTakeHome },
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

            {/* Tax Breakdown Pie Chart */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <PieChartIcon className="h-4.5 w-4.5 text-primary" />
                Salary Breakdown (Annual)
              </p>
              <div className="h-72 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Take-Home Pay', value: result.takeHomePay, color: '#10b981' },
                        { name: 'Federal Tax', value: result.federalTax, color: '#ef4444' },
                        ...(result.stateTax > 0 ? [{ name: 'State Tax', value: result.stateTax, color: '#f59e0b' }] : []),
                        { name: 'FICA (SS + Med)', value: result.ficaTotal, color: '#a855f7' },
                        ...(result.localTax > 0 ? [{ name: 'Local Tax', value: result.localTax, color: '#f97316' }] : []),
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        { name: 'Take-Home Pay', value: result.takeHomePay, color: '#10b981' },
                        { name: 'Federal Tax', value: result.federalTax, color: '#ef4444' },
                        ...(result.stateTax > 0 ? [{ name: 'State Tax', value: result.stateTax, color: '#f59e0b' }] : []),
                        { name: 'FICA (SS + Med)', value: result.ficaTotal, color: '#a855f7' },
                        ...(result.localTax > 0 ? [{ name: 'Local Tax', value: result.localTax, color: '#f97316' }] : []),
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

            {/* Tax Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Federal Tax', value: result.federalTax, color: 'text-red-500' },
                { label: 'State Tax', value: result.stateTax, color: 'text-amber-600' },
                { label: 'FICA (SS + Medicare)', value: result.ficaTotal, color: 'text-purple-600' },
                { label: 'Total All Taxes', value: result.totalTaxes, color: 'text-red-500' },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                  className="rounded-xl bg-background border border-border/50 p-3 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <p className={`text-base sm:text-lg font-bold ${item.color}`}>
                    {formatCurrency(item.value)}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Bracket-by-Bracket Table */}
            {result.bracketBreakdown.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Federal Tax Bracket Breakdown
                </p>
                <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/30">
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Rate
                          </th>
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Income Range
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Taxable in Bracket
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Tax from Bracket
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {result.bracketBreakdown.map((b, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2.5">
                              <Badge
                                variant="outline"
                                className="text-xs px-2 py-0 border-red-500/30 text-red-500 bg-red-500/5"
                              >
                                {(b.rate * 100).toFixed(0)}%
                              </Badge>
                            </td>
                            <td className="px-3 py-2.5 text-muted-foreground text-xs">
                              {formatCurrency(b.min)} –{' '}
                              {b.max === Infinity
                                ? '∞'
                                : formatCurrency(b.max)}
                            </td>
                            <td className="text-right px-3 py-2.5">
                              {formatCurrency(b.taxable)}
                            </td>
                            <td className="text-right px-3 py-2.5 font-medium text-red-500">
                              {formatCurrency(b.tax)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-emerald-500/5 font-bold">
                          <td className="px-3 py-2.5" colSpan={3}>
                            Federal Tax Total
                          </td>
                          <td className="text-right px-3 py-2.5 text-red-500">
                            {formatCurrency(result.federalTax)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* FICA Detail */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                FICA Tax Detail
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-background border border-border/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Social Security
                  </p>
                  <p className="text-base font-bold text-purple-600">
                    {formatCurrency(result.socialSecurity)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    6.2% of {formatCurrency(Math.min(result.salary, SS_WAGE_BASE))}
                  </p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Medicare
                  </p>
                  <p className="text-base font-bold text-purple-600">
                    {formatCurrency(result.medicare)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    1.45% of {formatCurrency(result.salary)}
                  </p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    Add&apos;l Medicare
                  </p>
                  <p className="text-base font-bold text-purple-600">
                    {formatCurrency(result.additionalMedicare)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    0.9% above $200K
                  </p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                <strong>2025 Tax Year:</strong> Standard deduction is{' '}
                {formatCurrency(result.standardDeduction)} for{' '}
                {FILING_LABELS[result.filingStatus]}. Social Security wage base is{' '}
                {formatCurrency(SS_WAGE_BASE)}. State tax is calculated as a flat
                percentage of gross salary for simplicity — your actual state tax
                may use progressive brackets. This calculator does not account for
                tax credits, itemized deductions beyond the standard, or
                self-employment tax.
              </p>
            </div>
          </div>
        </motion.div>
      )}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </CalculatorLayout>
  );
}
