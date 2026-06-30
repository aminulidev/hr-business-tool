'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, TrendingDown, Info, ShieldCheck, Heart } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PayFrequency = 'annual' | 'monthly' | 'biweekly' | 'weekly';

// ---------------------------------------------------------------------------
// FICA Constants (2025 tax year)
// ---------------------------------------------------------------------------
const SOCIAL_SECURITY_RATE = 0.062;       // 6.2%
const MEDICARE_RATE = 0.0145;              // 1.45%
const ADDITIONAL_MEDICARE_RATE = 0.009;    // 0.9% over threshold
const SS_WAGE_BASE = 176100;               // 2025 Social Security wage base
const ADDITIONAL_MEDICARE_THRESHOLD = 200000; // $200k for single filers

interface PayrollResult {
  grossPerPeriod: number;
  federalTaxPerPeriod: number;
  stateTaxPerPeriod: number;
  socialSecurityPerPeriod: number;
  medicarePerPeriod: number;
  otherDeductionsPerPeriod: number;
  netPayPerPeriod: number;
  effectiveTaxRate: number;
  annualNetPay: number;
  // Annual breakdown for display
  annualGross: number;
  annualFederalTax: number;
  annualStateTax: number;
  annualSS: number;
  annualMedicare: number;
  annualOtherDeductions: number;
  ficaTotal: number;
}

const periodsPerYear: Record<PayFrequency, number> = {
  annual: 1,
  monthly: 12,
  biweekly: 26,
  weekly: 52,
};

const frequencyLabels: Record<PayFrequency, string> = {
  annual: 'Annual',
  monthly: 'Monthly',
  biweekly: 'Bi-Weekly',
  weekly: 'Weekly',
};

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

interface PayrollInputs {
  salaryInput: string;
  frequency: PayFrequency;
  federalTaxRate: string;
  stateTaxRate: string;
  otherDeductions: string;
}

export default function PayrollCalculator() {
  const [salaryInput, setSalaryInput] = useState('');
  const [frequency, setFrequency] = useState<PayFrequency>('annual');
  const [federalTaxRate, setFederalTaxRate] = useState('22');
  const [stateTaxRate, setStateTaxRate] = useState('5');
  const [otherDeductions, setOtherDeductions] = useState('0');
  const [result, setResult] = useState<PayrollResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<PayrollInputs>('payroll-calculator');

  // ── Validation ──
  const validate = (salary: number, fedRate: number, stRate: number): boolean => {
    const errs: Record<string, string> = {};
    if (isNaN(salary) || salary <= 0) errs.salary = 'Enter a salary greater than $0';
    if (isNaN(fedRate) || fedRate < 0 || fedRate > 100) errs.federalTax = 'Enter a rate between 0% and 100%';
    if (isNaN(stRate) || stRate < 0 || stRate > 100) errs.stateTax = 'Enter a rate between 0% and 100%';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Core FICA calculation ──
  const calculateFICA = (annualSalary: number) => {
    // Social Security: 6.2% up to wage base
    const ssWages = Math.min(annualSalary, SS_WAGE_BASE);
    const socialSecurityAnnual = ssWages * SOCIAL_SECURITY_RATE;

    // Medicare: 1.45% on all wages + 0.9% Additional Medicare Tax above $200k
    let medicareAnnual = annualSalary * MEDICARE_RATE;
    if (annualSalary > ADDITIONAL_MEDICARE_THRESHOLD) {
      medicareAnnual += (annualSalary - ADDITIONAL_MEDICARE_THRESHOLD) * ADDITIONAL_MEDICARE_RATE;
    }

    return { socialSecurityAnnual, medicareAnnual };
  };

  const computeResult = (
    salary: number,
    freq: PayFrequency,
    fedRateStr: string,
    stRateStr: string,
    deductionsStr: string
  ): PayrollResult | null => {
    const fedRate = parseFloat(fedRateStr) / 100;
    const stRate = parseFloat(stRateStr) / 100;
    const deductions = parseFloat(deductionsStr) || 0;

    if (!validate(salary, fedRate * 100, stRate * 100)) return null;

    const periods = periodsPerYear[freq];
    const annualSalary = freq === 'annual' ? salary : salary * periods;

    const grossPerPeriod = annualSalary / periods;
    const federalTaxPerPeriod = grossPerPeriod * fedRate;
    const stateTaxPerPeriod = grossPerPeriod * stRate;

    // FICA
    const { socialSecurityAnnual, medicareAnnual } = calculateFICA(annualSalary);
    const socialSecurityPerPeriod = socialSecurityAnnual / periods;
    const medicarePerPeriod = medicareAnnual / periods;

    // Convert monthly deductions to per-period
    let deductionsPerPeriod: number;
    if (freq === 'annual') {
      deductionsPerPeriod = deductions * 12;
    } else if (freq === 'monthly') {
      deductionsPerPeriod = deductions;
    } else if (freq === 'biweekly') {
      deductionsPerPeriod = (deductions * 12) / 26;
    } else {
      deductionsPerPeriod = (deductions * 12) / 52;
    }

    const netPayPerPeriod = grossPerPeriod
      - federalTaxPerPeriod
      - stateTaxPerPeriod
      - socialSecurityPerPeriod
      - medicarePerPeriod
      - deductionsPerPeriod;

    const totalTaxPerPeriod = federalTaxPerPeriod + stateTaxPerPeriod + socialSecurityPerPeriod + medicarePerPeriod;
    const effectiveTaxRate = grossPerPeriod > 0
      ? (totalTaxPerPeriod / grossPerPeriod) * 100
      : 0;
    const annualNetPay = netPayPerPeriod * periods;

    return {
      grossPerPeriod,
      federalTaxPerPeriod,
      stateTaxPerPeriod,
      socialSecurityPerPeriod,
      medicarePerPeriod,
      otherDeductionsPerPeriod: deductionsPerPeriod,
      netPayPerPeriod,
      effectiveTaxRate,
      annualNetPay,
      annualGross: annualSalary,
      annualFederalTax: federalTaxPerPeriod * periods,
      annualStateTax: stateTaxPerPeriod * periods,
      annualSS: socialSecurityAnnual,
      annualMedicare: medicareAnnual,
      annualOtherDeductions: deductionsPerPeriod * periods,
      ficaTotal: socialSecurityPerPeriod + medicarePerPeriod,
    };
  };

  const handleTryExample = () => {
    setSalaryInput('75000');
    setFrequency('annual');
    setFederalTaxRate('22');
    setStateTaxRate('5');
    setOtherDeductions('500');
    setErrors({});

    const res = computeResult(75000, 'annual', '22', '5', '500');
    if (res) {
      setResult(res);
      saveEntry(
        { salaryInput: '75000', frequency: 'annual', federalTaxRate: '22', stateTaxRate: '5', otherDeductions: '500' },
        `${formatCurrency(res.netPayPerPeriod)} net / Annual (${formatCurrency(res.grossPerPeriod)} gross)`
      );
    }
  };

  const handleCalculate = () => {
    const salary = parseFloat(salaryInput);
    const res = computeResult(salary, frequency, federalTaxRate, stateTaxRate, otherDeductions);
    if (res) {
      setResult(res);
      saveEntry(
        { salaryInput, frequency, federalTaxRate, stateTaxRate, otherDeductions },
        `${formatCurrency(res.netPayPerPeriod)} net / ${frequencyLabels[frequency]} (${formatCurrency(res.grossPerPeriod)} gross)`
      );
    } else {
      setResult(null);
    }
  };

  const handleRestore = (inputs: PayrollInputs) => {
    setSalaryInput(inputs.salaryInput);
    setFrequency(inputs.frequency);
    setFederalTaxRate(inputs.federalTaxRate);
    setStateTaxRate(inputs.stateTaxRate);
    setOtherDeductions(inputs.otherDeductions);
    setResult(null);
    setErrors({});
  };

  return (
    <div className="w-full">
      {/* Input Fields */}
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salary" className="text-sm font-medium">
              <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Salary / Pay Amount
            </Label>
            <Input
              id="salary"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 75000"
              value={salaryInput}
              onChange={(e) => { setSalaryInput(e.target.value); setErrors((p) => ({ ...p, salary: '' })); }}
              className={errors.salary ? 'border-red-500' : ''}
            />
            {errors.salary && <p className="text-xs text-red-500">{errors.salary}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-sm font-medium">
              Pay Frequency
            </Label>
            <Select
              value={frequency}
              onValueChange={(val) => setFrequency(val as PayFrequency)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual">Annual</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="federalTax" className="text-sm font-medium">
              <TrendingDown className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Federal Tax Rate (%)
            </Label>
            <Input
              id="federalTax"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="22"
              value={federalTaxRate}
              onChange={(e) => { setFederalTaxRate(e.target.value); setErrors((p) => ({ ...p, federalTax: '' })); }}
              className={errors.federalTax ? 'border-red-500' : ''}
            />
            {errors.federalTax && <p className="text-xs text-red-500">{errors.federalTax}</p>}
            <p className="text-xs text-muted-foreground">
              <Info className="inline h-3 w-3 mr-0.5" />
              Enter your expected or marginal rate. Use our{' '}
              <a href="/calculators/tax-bracket-calculator" className="text-emerald-600 underline underline-offset-2 hover:text-emerald-500">
                Tax Bracket Calculator
              </a>{' '}
              to find your effective rate.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stateTax" className="text-sm font-medium">
              <TrendingDown className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              State Tax Rate (%)
            </Label>
            <Input
              id="stateTax"
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="5"
              value={stateTaxRate}
              onChange={(e) => { setStateTaxRate(e.target.value); setErrors((p) => ({ ...p, stateTax: '' })); }}
              className={errors.stateTax ? 'border-red-500' : ''}
            />
            {errors.stateTax && <p className="text-xs text-red-500">{errors.stateTax}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deductions" className="text-sm font-medium">
              <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Other Deductions ($/month)
            </Label>
            <Input
              id="deductions"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 500"
              value={otherDeductions}
              onChange={(e) => setOtherDeductions(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Health insurance, 401(k), HSA, etc. — entered as monthly amount.
            </p>
          </div>
        </div>

        {/* FICA Info Banner */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <ShieldCheck className="inline h-4 w-4 mr-1.5" />
            <span className="font-semibold">FICA taxes are automatically calculated:</span>{' '}
            Social Security (6.2% up to ${SS_WAGE_BASE.toLocaleString()} wage base) +
            Medicare (1.45% on all wages, +0.9% above $200k). These are mandatory payroll deductions.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <Button
            onClick={handleCalculate}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            Calculate Take-Home Pay
          </Button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="result-display mt-8" aria-live="polite"
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            {/* Main Result */}
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                Net Pay Per {frequencyLabels[frequency]} Period
              </p>
              <p className="text-4xl font-bold text-emerald-600">
                {formatCurrency(result.netPayPerPeriod)}
              </p>
              <p className="text-xs text-muted-foreground">
                Annual Net Pay: <span className="font-semibold text-foreground">{formatCurrency(result.annualNetPay)}</span>
              </p>
            </div>

            {/* Breakdown Table */}
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Per Period
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Annual
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <tr>
                    <td className="px-4 py-3 font-medium">Gross Pay</td>
                    <td className="text-right px-4 py-3">
                      {formatCurrency(result.grossPerPeriod)}
                    </td>
                    <td className="text-right px-4 py-3">
                      {formatCurrency(result.annualGross)}
                    </td>
                  </tr>
                  <tr className="text-red-500/80">
                    <td className="px-4 py-3 flex items-center gap-1.5">
                      <TrendingDown className="h-3.5 w-3.5" />
                      Federal Tax
                    </td>
                    <td className="text-right px-4 py-3">
                      -{formatCurrency(result.federalTaxPerPeriod)}
                    </td>
                    <td className="text-right px-4 py-3">
                      -{formatCurrency(result.annualFederalTax)}
                    </td>
                  </tr>
                  <tr className="text-red-500/80">
                    <td className="px-4 py-3 flex items-center gap-1.5">
                      <TrendingDown className="h-3.5 w-3.5" />
                      State Tax
                    </td>
                    <td className="text-right px-4 py-3">
                      -{formatCurrency(result.stateTaxPerPeriod)}
                    </td>
                    <td className="text-right px-4 py-3">
                      -{formatCurrency(result.annualStateTax)}
                    </td>
                  </tr>
                  <tr className="text-orange-500/80">
                    <td className="px-4 py-3 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Social Security (6.2%)
                    </td>
                    <td className="text-right px-4 py-3">
                      -{formatCurrency(result.socialSecurityPerPeriod)}
                    </td>
                    <td className="text-right px-4 py-3">
                      -{formatCurrency(result.annualSS)}
                    </td>
                  </tr>
                  <tr className="text-orange-500/80">
                    <td className="px-4 py-3 flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5" />
                      Medicare (1.45%)
                    </td>
                    <td className="text-right px-4 py-3">
                      -{formatCurrency(result.medicarePerPeriod)}
                    </td>
                    <td className="text-right px-4 py-3">
                      -{formatCurrency(result.annualMedicare)}
                    </td>
                  </tr>
                  <tr className="text-red-500/80">
                    <td className="px-4 py-3 flex items-center gap-1.5">
                      <TrendingDown className="h-3.5 w-3.5" />
                      Other Deductions
                    </td>
                    <td className="text-right px-4 py-3">
                      -{formatCurrency(result.otherDeductionsPerPeriod)}
                    </td>
                    <td className="text-right px-4 py-3">
                      -{formatCurrency(result.annualOtherDeductions)}
                    </td>
                  </tr>
                  <tr className="font-bold bg-emerald-500/5">
                    <td className="px-4 py-3 text-emerald-600">Net Pay</td>
                    <td className="text-right px-4 py-3 text-emerald-600">
                      {formatCurrency(result.netPayPerPeriod)}
                    </td>
                    <td className="text-right px-4 py-3 text-emerald-600">
                      {formatCurrency(result.annualNetPay)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary Badges */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <Info className="h-3.5 w-3.5 mr-1.5" />
                Effective Tax Rate: {result.effectiveTaxRate.toFixed(2)}%
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                FICA Total: {formatCurrency(result.ficaTotal)}/period
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                Take-Home Ratio: {result.grossPerPeriod > 0
                  ? ((result.netPayPerPeriod / result.grossPerPeriod) * 100).toFixed(1)
                  : '0'}
                %
              </Badge>
            </div>

            {/* Pay Breakdown Pie Chart */}
            <div className="print:hidden">
              <p className="text-sm font-medium text-muted-foreground mb-3">Pay Breakdown</p>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Net Pay', value: Math.max(result.netPayPerPeriod, 0) },
                      { name: 'Federal Tax', value: result.federalTaxPerPeriod },
                      { name: 'State Tax', value: result.stateTaxPerPeriod },
                      { name: 'Social Security', value: result.socialSecurityPerPeriod },
                      { name: 'Medicare', value: result.medicarePerPeriod },
                      { name: 'Other Deductions', value: result.otherDeductionsPerPeriod },
                    ].filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#f97316" />
                    <Cell fill="#fb923c" />
                    <Cell fill="#8b5cf6" />
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </div>
  );
}
