'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileMinus,
  DollarSign,
  Percent,
  Info,
  Shield,
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

type PayFrequency = 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';

interface DeductionResult {
  grossPay: number;
  payFrequency: PayFrequency;
  healthInsurance: number;
  k401Contribution: number;
  otherPreTax: number;
  totalPreTax: number;
  taxableIncome: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  ficaTotal: number;
  totalTaxes: number;
  otherPostTax: number;
  totalPostTax: number;
  totalDeductions: number;
  netPay: number;
  effectiveRate: number;
  itemized: {
    label: string;
    amount: number;
    type: 'pre-tax' | 'tax' | 'post-tax';
  }[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const FREQ_LABELS: Record<PayFrequency, string> = {
  weekly: 'Weekly',
  'bi-weekly': 'Bi-Weekly',
  'semi-monthly': 'Semi-Monthly',
  monthly: 'Monthly',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PayrollDeductionCalculator() {
  const [grossPay, setGrossPay] = useState('');
  const [payFrequency, setPayFrequency] = useState<PayFrequency>('bi-weekly');
  const [federalTaxPct, setFederalTaxPct] = useState('12');
  const [stateTaxPct, setStateTaxPct] = useState('5');
  const [ssPct, setSsPct] = useState('6.2');
  const [medicarePct, setMedicarePct] = useState('1.45');
  const [healthInsurance, setHealthInsurance] = useState('');
  const [k401Pct, setK401Pct] = useState('5');
  const [otherPreTax, setOtherPreTax] = useState('');
  const [otherPostTax, setOtherPostTax] = useState('');

  const [result, setResult] = useState<DeductionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    const gross = parseFloat(grossPay);
    if (isNaN(gross) || gross <= 0) {
      setError('Please enter a valid gross pay greater than zero.');
      return;
    }

    const fedPct = parseFloat(federalTaxPct);
    const stPct = parseFloat(stateTaxPct);
    const ssRate = parseFloat(ssPct);
    const medRate = parseFloat(medicarePct);
    const k401Rate = parseFloat(k401Pct);
    const healthAmt = parseFloat(healthInsurance) || 0;
    const oPreTax = parseFloat(otherPreTax) || 0;
    const oPostTax = parseFloat(otherPostTax) || 0;

    if ([fedPct, stPct, ssRate, medRate, k401Rate].some((v) => isNaN(v) || v < 0)) {
      setError('Please enter valid percentages (zero or greater) for all tax and contribution fields.');
      return;
    }
    if ([fedPct, stPct, ssRate, medRate, k401Rate].some((v) => v > 100)) {
      setError('Percentage values cannot exceed 100%.');
      return;
    }
    if (healthAmt < 0 || oPreTax < 0 || oPostTax < 0) {
      setError('Deduction amounts cannot be negative.');
      return;
    }

    // Pre-tax deductions (reduces taxable income)
    const k401Amount = gross * (k401Rate / 100);
    const totalPreTax = healthAmt + k401Amount + oPreTax;
    const taxableIncome = gross - totalPreTax;

    if (taxableIncome < 0) {
      setError('Pre-tax deductions cannot exceed your gross pay.');
      return;
    }

    // Taxes on taxable income
    const federalTax = taxableIncome * (fedPct / 100);
    const stateTax = taxableIncome * (stPct / 100);
    const socialSecurity = taxableIncome * (ssRate / 100);
    const medicare = taxableIncome * (medRate / 100);
    const ficaTotal = socialSecurity + medicare;
    const totalTaxes = federalTax + stateTax + ficaTotal;

    // Post-tax deductions
    const totalPostTax = oPostTax;

    // Totals
    const totalDeductions = totalPreTax + totalTaxes + totalPostTax;
    const netPay = gross - totalDeductions;
    const effectiveRate = gross > 0 ? (totalDeductions / gross) * 100 : 0;

    const itemized: DeductionResult['itemized'] = [
      ...(k401Rate > 0
        ? [
            {
              label: `401(k) (${k401Rate}%)`,
              amount: k401Amount,
              type: 'pre-tax' as const,
            },
          ]
        : []),
      ...(healthAmt > 0
        ? [
            {
              label: 'Health Insurance',
              amount: healthAmt,
              type: 'pre-tax' as const,
            },
          ]
        : []),
      ...(oPreTax > 0
        ? [
            {
              label: 'Other Pre-tax',
              amount: oPreTax,
              type: 'pre-tax' as const,
            },
          ]
        : []),
      ...(fedPct > 0
        ? [
            {
              label: `Federal Tax (${fedPct}%)`,
              amount: federalTax,
              type: 'tax' as const,
            },
          ]
        : []),
      ...(stPct > 0
        ? [
            {
              label: `State Tax (${stPct}%)`,
              amount: stateTax,
              type: 'tax' as const,
            },
          ]
        : []),
      ...(ssRate > 0
        ? [
            {
              label: `Social Security (${ssRate}%)`,
              amount: socialSecurity,
              type: 'tax' as const,
            },
          ]
        : []),
      ...(medRate > 0
        ? [
            {
              label: `Medicare (${medRate}%)`,
              amount: medicare,
              type: 'tax' as const,
            },
          ]
        : []),
      ...(oPostTax > 0
        ? [
            {
              label: 'Other Post-tax',
              amount: oPostTax,
              type: 'post-tax' as const,
            },
          ]
        : []),
    ];

    setResult({
      grossPay: gross,
      payFrequency,
      healthInsurance: healthAmt,
      k401Contribution: k401Amount,
      otherPreTax: oPreTax,
      totalPreTax,
      taxableIncome,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      ficaTotal,
      totalTaxes,
      otherPostTax: oPostTax,
      totalPostTax,
      totalDeductions,
      netPay,
      effectiveRate,
      itemized,
    });
  };

  const handleReset = () => {
    setGrossPay('');
    setPayFrequency('bi-weekly');
    setFederalTaxPct('12');
    setStateTaxPct('5');
    setSsPct('6.2');
    setMedicarePct('1.45');
    setHealthInsurance('');
    setK401Pct('5');
    setOtherPreTax('');
    setOtherPostTax('');
    setResult(null);
    setError(null);
  };

  // ------ SEO content ------

  const howToSteps = [
    'Enter your gross pay per pay period — this is your total earnings before any taxes or deductions are taken out.',
    'Select your pay frequency: weekly, bi-weekly (every two weeks), semi-monthly (twice per month), or monthly.',
    'Enter your federal and state income tax withholding percentages. The defaults are approximate flat rates; your actual withholding may vary based on your W-4 elections and tax brackets.',
    'Enter your pre-tax deductions: health insurance premium (fixed dollar amount per period), 401(k) contribution (percentage of gross), and any other pre-tax deductions like HSA or FSA contributions.',
    'Click "Calculate Deductions" to see a complete itemized breakdown of all deductions, your taxable income, total taxes, and your net take-home pay per period.',
  ];

  const formula =
    'Net Pay = Gross Pay − Pre-tax Deductions − Taxes − Post-tax Deductions';

  const formulaDescription =
    'Payroll deductions are subtracted from gross pay in a specific order. Pre-tax deductions (like 401(k) contributions, health insurance premiums, HSA contributions, and FSA contributions) are taken out first, which reduces your taxable income — lowering the amount of federal and state income tax you owe. FICA taxes (Social Security at 6.2% and Medicare at 1.45%) are calculated on the reduced taxable income. Finally, post-tax deductions (like Roth 401(k) contributions, garnishments, or union dues) are subtracted from what remains. Pre-tax deductions provide a double benefit: you reduce your tax bill and save for the future simultaneously.';

  const workedExamples = [
    {
      title: '$3,000 Bi-Weekly Gross with Standard Deductions',
      description:
        'An employee earns $3,000 bi-weekly. They contribute 5% to 401(k) ($150), pay $85 for health insurance, and have $25 in other pre-tax deductions. Total pre-tax = $260, taxable income = $2,740. Federal tax (12%) = $328.80, state tax (5%) = $137.00, Social Security (6.2%) = $169.88, Medicare (1.45%) = $39.73. Total taxes = $675.41. Net pay = $3,000.00 − $260.00 − $675.41 = $2,064.59 per period.',
    },
    {
      title: '$5,000 Semi-Monthly with High 401(k) Contributions',
      description:
        'An employee earns $5,000 semi-monthly and contributes 15% to 401(k) ($750), pays $200 for health insurance, and has $50 in HSA contributions. Total pre-tax = $1,000, taxable income = $4,000. Federal tax (22%) = $880.00, state tax (7%) = $280.00, FICA = $306.00. Total taxes = $1,466.00. Net pay = $5,000 − $1,000 − $1,466.00 = $2,534.00. The aggressive 401(k) savings significantly reduce taxable income and saves $352 in federal taxes per period compared to a 5% contribution.',
    },
    {
      title: '$1,200 Weekly with Minimal Deductions',
      description:
        'A part-time employee earns $1,200 weekly with no 401(k) or health insurance. Federal tax (10%) = $120.00, state tax (3%) = $36.00, FICA = $91.80. Total deductions = $247.80. Net pay = $952.20 per week. The effective deduction rate is 20.65%. This simple scenario shows how much of each paycheck goes to taxes when no pre-tax benefit deductions are available to reduce taxable income.',
    },
  ];

  const faqs = [
    {
      question: 'What are pre-tax deductions?',
      answer:
        'Pre-tax deductions are amounts taken from your gross pay before income taxes are calculated. Common pre-tax deductions include 401(k) retirement plan contributions, health insurance premiums, dental and vision insurance, HSA (Health Savings Account) contributions, FSA (Flexible Spending Account) contributions, commuter benefits, and some life insurance premiums. Because these are deducted before taxes, they lower your taxable income, which means you pay less in federal and state income tax. For example, contributing $200 pre-tax to a 401(k) saves you approximately $24-$66 in federal taxes (depending on your bracket) compared to a post-tax contribution of the same amount.',
    },
    {
      question: 'What is FICA tax and how is it calculated?',
      answer:
        'FICA (Federal Insurance Contributions Act) tax consists of two components: Social Security tax (6.2% of wages) and Medicare tax (1.45% of wages), for a total of 7.65%. For 2025, Social Security tax applies to the first $176,100 of earnings (the "wage base limit"), after which no more Social Security tax is owed for the year. Medicare tax has no wage base limit — it applies to all earnings. Additionally, high earners pay an Additional Medicare Tax of 0.9% on earnings above $200,000 (single) or $250,000 (married filing jointly). Your employer matches your FICA contributions, paying an equal 7.65% on your behalf.',
    },
    {
      question: 'What are the 401(k) contribution limits?',
      answer:
        'For 2025, the IRS limits 401(k) employee contributions to $23,500 per year (up from $23,000 in 2024). If you are age 50 or older, you can make an additional "catch-up" contribution of $7,500, bringing the total to $31,000. These limits apply to traditional (pre-tax) 401(k) and Roth 401(k) contributions combined. The total annual addition limit (including employer matching) is $69,000 ($76,500 with catch-up). Contributing up to the limit, especially with pre-tax dollars, is one of the most effective ways to reduce your taxable income while saving for retirement.',
    },
    {
      question: 'What is the difference between HSA and FSA?',
      answer:
        'Both HSA (Health Savings Account) and FSA (Flexible Spending Account) allow pre-tax contributions for healthcare expenses, but they differ in key ways. An HSA is available only with a High Deductible Health Plan (HDHP), has a higher contribution limit ($4,300 individual / $8,550 family for 2025), and funds roll over year to year — you never lose the money. An FSA is available with most health plans, has a lower limit ($3,200 for 2025), and typically has a "use it or lose it" rule where unused funds are forfeited (though some employers offer a small rollover or grace period). HSAs are portable (you keep them if you change jobs) and can be invested for growth. Both reduce your taxable income dollar for dollar.',
    },
    {
      question: 'What happens if my deductions exceed my gross pay?',
      answer:
        'Your deductions cannot legally exceed your gross pay. If pre-tax deductions alone would reduce your pay below zero, your employer must limit them so that your taxable income is at least zero. Post-tax deductions are also limited by your remaining after-tax income. In practice, your net pay will never be negative. If you are trying to maximize 401(k) contributions but they would exceed your pay, your employer will reduce the contribution to the maximum allowed. For example, if you earn $500 and set your 401(k) to 100%, the system will cap the deduction at $500 (less any required deductions like FICA). Always ensure your total deduction percentage leaves room for required taxes.',
    },
    {
      question: 'How can I optimize my payroll deductions?',
      answer:
        'To optimize your deductions and maximize take-home pay: (1) Maximize pre-tax contributions to 401(k)/403(b) up to the annual limit — every dollar contributed reduces your taxable income. (2) Use an HSA if you have an HDHP — it offers a triple tax benefit (deductible contributions, tax-free growth, tax-free withdrawals for medical expenses). (3) Review your W-4 withholding to avoid over- or under-withholding. (4) Take advantage of commuter benefits and dependent care FSAs if applicable. (5) Consider Roth vs. traditional 401(k) based on your current vs. expected future tax bracket. (6) Review your benefit elections annually during open enrollment to ensure they align with your current needs and financial goals.',
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
      slug: 'after-tax-income',
      title: 'After-Tax Income Calculator',
      description:
        'Calculate your net income after federal and state taxes with detailed breakdown',
      icon: 'Wallet',
    },
    {
      slug: 'salary-tax',
      title: 'Salary Tax Calculator',
      description:
        'Calculate total tax on your salary with federal, state, FICA, and local taxes',
      icon: 'Shield',
    },
    {
      slug: 'hourly-paycheck',
      title: 'Hourly Paycheck Calculator',
      description:
        'Calculate your hourly paycheck after taxes and deductions',
      icon: 'BadgeDollarSign',
    },
    {
      slug: 'tax-bracket',
      title: 'Tax Bracket Calculator',
      description:
        'Find your federal tax bracket, effective and marginal tax rates',
      icon: 'FileText',
    },
  ];

  // ------ Render ------

  return (
    <CalculatorLayout
      title="Payroll Deduction Calculator"
      description="Calculate detailed paycheck deductions including federal tax, state tax, FICA, health insurance, 401(k), and more. See your gross-to-net pay breakdown."
      icon={<FileMinus className="h-7 w-7 text-white" />}
      breadcrumbs={[
        { label: 'Calculators' },
        { label: 'Payroll Deduction Calculator' },
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
        {/* Gross Pay */}
        <div className="space-y-2">
          <Label htmlFor="grossPay" className="text-sm font-medium">
            <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Gross Pay per Period ($)
          </Label>
          <Input
            id="grossPay"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 3000.00"
            value={grossPay}
            onChange={(e) => setGrossPay(e.target.value)}
          />
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
              <SelectItem value="semi-monthly">Semi-Monthly (24/year)</SelectItem>
              <SelectItem value="monthly">Monthly (12/year)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pre-tax Deductions */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Pre-Tax Deductions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="health" className="text-xs font-medium">
                Health Insurance ($)
              </Label>
              <Input
                id="health"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 85.00"
                value={healthInsurance}
                onChange={(e) => setHealthInsurance(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="k401" className="text-xs font-medium">
                401(k) Contribution (%)
              </Label>
              <Input
                id="k401"
                type="number"
                min="0"
                max="100"
                step="0.5"
                placeholder="e.g., 5"
                value={k401Pct}
                onChange={(e) => setK401Pct(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="otherPre" className="text-xs font-medium">
              Other Pre-Tax Deductions (HSA, FSA, etc.) ($)
            </Label>
            <Input
              id="otherPre"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 50.00"
              value={otherPreTax}
              onChange={(e) => setOtherPreTax(e.target.value)}
            />
          </div>
        </div>

        {/* Tax Withholding */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <Percent className="h-3.5 w-3.5" />
            Tax Withholding (% of taxable income)
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fedTax" className="text-xs font-medium">
                Federal Income Tax (%)
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="stTax" className="text-xs font-medium">
                State Income Tax (%)
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
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ss" className="text-xs font-medium">
                Social Security (%)
              </Label>
              <Input
                id="ss"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={ssPct}
                onChange={(e) => setSsPct(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Default: 6.2%</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="med" className="text-xs font-medium">
                Medicare (%)
              </Label>
              <Input
                id="med"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={medicarePct}
                onChange={(e) => setMedicarePct(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Default: 1.45%</p>
            </div>
          </div>
        </div>

        {/* Post-tax Deductions */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Post-Tax Deductions
          </p>
          <div className="space-y-2">
            <Label htmlFor="otherPost" className="text-xs font-medium">
              Other Post-Tax Deductions (Roth 401k, garnishments, etc.) ($)
            </Label>
            <Input
              id="otherPost"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 0.00"
              value={otherPostTax}
              onChange={(e) => setOtherPostTax(e.target.value)}
            />
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
            <FileMinus className="h-4 w-4 mr-2" />
            Calculate Deductions
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
                Net Take-Home Pay ({FREQ_LABELS[result.payFrequency]})
              </p>
              <p className="text-4xl font-bold text-emerald-600">
                {formatCurrency(result.netPay)}
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 px-3 py-1 text-xs font-medium"
                >
                  {formatCurrency(result.grossPay)} gross
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-red-500/10 border-red-500/30 text-red-600 px-3 py-1 text-xs font-medium"
                >
                  −{formatCurrency(result.totalDeductions)} deductions
                </Badge>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Pre-Tax Deductions', value: result.totalPreTax, color: 'text-blue-600' },
                { label: 'Total Taxes', value: result.totalTaxes, color: 'text-red-500' },
                { label: 'Post-Tax Deductions', value: result.totalPostTax, color: 'text-amber-600' },
                { label: 'Effective Deduction Rate', value: null, color: 'text-muted-foreground' },
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
                  <p className={`text-base sm:text-lg font-bold ${item.color}`}>
                    {item.value !== null
                      ? formatCurrency(item.value)
                      : `${result.effectiveRate.toFixed(1)}%`}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Gross vs Net Bar */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Gross vs Net Pay
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-12 shrink-0 text-right">
                    Gross
                  </span>
                  <div className="flex-1 h-8 rounded-lg bg-muted/60 relative overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-lg bg-gradient-to-r from-slate-400/60 to-slate-500/60 flex items-center justify-center"
                    >
                      <span className="text-xs font-semibold text-slate-700">
                        {formatCurrency(result.grossPay)}
                      </span>
                    </motion.div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-12 shrink-0 text-right">
                    Net
                  </span>
                  <div className="flex-1 h-8 rounded-lg bg-muted/60 relative overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{
                        width: `${Math.max(
                          (result.netPay / result.grossPay) * 100,
                          3
                        )}%`,
                      }}
                      transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                      className="h-full rounded-lg bg-gradient-to-r from-emerald-400/60 to-emerald-500/60 flex items-center justify-end pr-3"
                    >
                      <span className="text-xs font-semibold text-emerald-700 whitespace-nowrap">
                        {formatCurrency(result.netPay)}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Breakdown Chart */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <PieChartIcon className="h-4.5 w-4.5 text-primary" />
                Pay Breakdown
              </p>
              <div className="h-72 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Net Pay', value: result.netPay, color: '#10b981' },
                        ...(result.totalPreTax > 0 ? [{ name: 'Pre-Tax Deductions', value: result.totalPreTax, color: '#3b82f6' }] : []),
                        ...(result.totalTaxes > 0 ? [{ name: 'Taxes', value: result.totalTaxes, color: '#ef4444' }] : []),
                        ...(result.totalPostTax > 0 ? [{ name: 'Post-Tax', value: result.totalPostTax, color: '#f59e0b' }] : []),
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        { name: 'Net Pay', value: result.netPay, color: '#10b981' },
                        ...(result.totalPreTax > 0 ? [{ name: 'Pre-Tax Deductions', value: result.totalPreTax, color: '#3b82f6' }] : []),
                        ...(result.totalTaxes > 0 ? [{ name: 'Taxes', value: result.totalTaxes, color: '#ef4444' }] : []),
                        ...(result.totalPostTax > 0 ? [{ name: 'Post-Tax', value: result.totalPostTax, color: '#f59e0b' }] : []),
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

            {/* Itemized Deductions Table */}
            {result.itemized.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Itemized Deduction Breakdown
                </p>
                <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/30">
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Deduction
                          </th>
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Type
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {/* Gross pay row */}
                        <tr className="bg-emerald-500/5">
                          <td className="px-3 py-2.5 font-semibold">Gross Pay</td>
                          <td className="px-3 py-2.5 text-muted-foreground">—</td>
                          <td className="text-right px-3 py-2.5 font-semibold text-emerald-600">
                            {formatCurrency(result.grossPay)}
                          </td>
                        </tr>
                        {result.itemized.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2.5">{item.label}</td>
                            <td className="px-3 py-2.5">
                              <Badge
                                variant="outline"
                                className={`text-xs px-2 py-0 ${
                                  item.type === 'pre-tax'
                                    ? 'border-blue-500/30 text-blue-600 bg-blue-500/5'
                                    : item.type === 'tax'
                                      ? 'border-red-500/30 text-red-500 bg-red-500/5'
                                      : 'border-amber-500/30 text-amber-600 bg-amber-500/5'
                                }`}
                              >
                                {item.type}
                              </Badge>
                            </td>
                            <td className="text-right px-3 py-2.5 text-red-500">
                              −{formatCurrency(item.amount)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-emerald-500/10 font-bold">
                          <td className="px-3 py-2.5" colSpan={2}>
                            Net Pay
                          </td>
                          <td className="text-right px-3 py-2.5 text-emerald-600">
                            {formatCurrency(result.netPay)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                <strong>Disclaimer:</strong> This calculator uses flat-rate
                percentages for tax withholding. Your actual withholding may
                differ based on progressive tax brackets, W-4 elections, state
                tax rules, and other factors. For precise figures, consult your
                HR department or a tax professional.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </CalculatorLayout>
  );
}
