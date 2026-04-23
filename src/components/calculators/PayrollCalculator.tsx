'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, TrendingDown, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import TryExample from './TryExample';
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

type PayFrequency = 'annual' | 'monthly' | 'biweekly' | 'weekly';

interface PayrollResult {
  grossPerPeriod: number;
  federalTaxPerPeriod: number;
  stateTaxPerPeriod: number;
  otherDeductionsPerPeriod: number;
  netPayPerPeriod: number;
  effectiveTaxRate: number;
  annualNetPay: number;
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

export default function PayrollCalculator() {
  const [salaryInput, setSalaryInput] = useState('');
  const [frequency, setFrequency] = useState<PayFrequency>('annual');
  const [federalTaxRate, setFederalTaxRate] = useState('22');
  const [stateTaxRate, setStateTaxRate] = useState('5');
  const [otherDeductions, setOtherDeductions] = useState('0');
  const [result, setResult] = useState<PayrollResult | null>(null);

  const handleTryExample = () => {
    setSalaryInput('75000');
    setFrequency('annual');
    setFederalTaxRate('22');
    setStateTaxRate('5');
    setOtherDeductions('500');
    setResult(null);
  };

  const handleCalculate = () => {
    const salary = parseFloat(salaryInput);
    const fedRate = parseFloat(federalTaxRate) / 100;
    const stRate = parseFloat(stateTaxRate) / 100;
    const deductions = parseFloat(otherDeductions) || 0;

    if (isNaN(salary) || salary <= 0) {
      setResult(null);
      return;
    }

    const periods = periodsPerYear[frequency];
    const annualSalary = frequency === 'annual' ? salary : salary * periods;

    const grossPerPeriod = annualSalary / periods;
    const federalTaxPerPeriod = grossPerPeriod * fedRate;
    const stateTaxPerPeriod = grossPerPeriod * stRate;

    // Convert monthly deductions to per-period
    let deductionsPerPeriod: number;
    if (frequency === 'annual') {
      deductionsPerPeriod = deductions * 12;
    } else if (frequency === 'monthly') {
      deductionsPerPeriod = deductions;
    } else if (frequency === 'biweekly') {
      deductionsPerPeriod = (deductions * 12) / 26;
    } else {
      deductionsPerPeriod = (deductions * 12) / 52;
    }

    const totalDeductionsPerPeriod =
      federalTaxPerPeriod + stateTaxPerPeriod + deductionsPerPeriod;
    const netPayPerPeriod = grossPerPeriod - totalDeductionsPerPeriod;
    const effectiveTaxRate = grossPerPeriod > 0
      ? ((federalTaxPerPeriod + stateTaxPerPeriod) / grossPerPeriod) * 100
      : 0;
    const annualNetPay = netPayPerPeriod * periods;

    setResult({
      grossPerPeriod,
      federalTaxPerPeriod,
      stateTaxPerPeriod,
      otherDeductionsPerPeriod: deductionsPerPeriod,
      netPayPerPeriod,
      effectiveTaxRate,
      annualNetPay,
    });
  };

  const howToSteps = [
    'Enter your total salary in the field above. You can input your annual salary, monthly salary, bi-weekly pay, or weekly pay depending on your pay frequency.',
    'Select your pay frequency from the dropdown. This tells the calculator how many pay periods you have per year so it can convert all amounts accurately.',
    'Enter your estimated federal and state tax rates as percentages. The default values of 22% federal and 5% state are common for many income brackets, but adjust these to match your actual tax situation.',
    'Include any additional monthly deductions such as health insurance premiums, 401(k) contributions, or other pre-tax/post-tax deductions that are withheld from your paycheck.',
    'Click the "Calculate" button to see your net pay per period, total deductions breakdown, effective tax rate, and projected annual take-home pay.',
  ];

  const formula = 'Net Pay = Gross Pay − Federal Tax − State Tax − Deductions';
  const formulaDescription =
    'The net pay formula subtracts all taxes and deductions from your gross pay to determine your actual take-home income per pay period. Your effective tax rate is the combined percentage of your gross pay that goes to taxes.';

  const faqs = [
    {
      question: 'How is federal tax calculated on my paycheck?',
      answer:
        'Federal income tax is calculated based on your taxable income and the IRS tax brackets. Your employer uses the information on your W-4 form to determine the correct withholding amount. The federal tax is a percentage of your gross wages, and the rate depends on your filing status, income level, and any additional withholdings you elected. Keep in mind that this calculator uses a flat effective rate for estimation purposes, while the actual system uses progressive brackets.',
    },
    {
      question: 'What is FICA tax and is it included in this calculator?',
      answer:
        'FICA (Federal Insurance Contributions Act) tax consists of two parts: Social Security tax at 6.2% on wages up to a yearly limit, and Medicare tax at 1.45% on all wages. If you earn above a certain threshold, an additional 0.9% Medicare surtax applies. This calculator focuses on federal and state income tax only, so you may want to factor in an additional 7.65% for FICA when estimating your total deductions.',
    },
    {
      question: 'How do state taxes work and why do they vary?',
      answer:
        'State income taxes are separate from federal taxes and vary significantly by state. Some states like Texas, Florida, and Nevada have no state income tax at all, while others like California and New York have rates that can exceed 10%. The tax is typically a percentage of your taxable income, and most states use their own bracket systems similar to the federal structure. Be sure to check your specific state\'s tax rates for the most accurate estimate.',
    },
    {
      question: 'What deductions can I claim to reduce my taxable income?',
      answer:
        'Common deductions that reduce your taxable income include retirement contributions (such as 401(k), 403(b), or IRA), health savings account (HSA) contributions, flexible spending account (FSA) contributions, health and dental insurance premiums, and student loan interest. Pre-tax deductions lower your taxable income directly, while post-tax deductions like Roth 401(k) contributions do not. Maximizing pre-tax deductions can significantly increase your take-home pay.',
    },
    {
      question: 'How often should I review my paycheck?',
      answer:
        'Review every pay stub for accuracy. Check that tax withholdings match your W-4 elections, deductions are correct, and overtime or bonuses are properly calculated. Report any discrepancies to HR immediately to ensure corrections are made before tax filing season.',
    },
    {
      question: 'What is the difference between gross and net pay?',
      answer:
        'Gross pay is your total earnings before any deductions are taken out, including your base salary, overtime, bonuses, and commissions. Net pay (also called take-home pay) is what remains after federal and state taxes, insurance premiums, retirement contributions, and other deductions are subtracted. Understanding this difference helps you budget effectively and identify where your money is going.',
    },
    {
      question: 'How do bonuses affect my paycheck taxes?',
      answer:
        'Bonuses are often taxed at a flat supplemental rate of 22% federal, which may differ from your regular tax bracket. This can result in higher withholding on bonus checks, but the difference typically reconciles when you file your annual tax return. If your total annual income places you in a lower bracket, you may receive a refund for the excess withholding.',
    },
    {
      question: 'Can I change my tax withholding?',
      answer:
        'Yes, you can submit an updated W-4 form to your employer at any time to adjust your tax withholding. You can change the number of allowances, request additional dollar amounts to be withheld, or claim exemptions if eligible. Changes typically take effect within one to two pay periods, giving you flexibility to fine-tune your take-home pay throughout the year.',
    },
  ];

  return (
    <CalculatorLayout
      title="Payroll & Paycheck Calculator"
      description="Calculate your take-home pay after federal and state taxes, plus custom deductions. Get a clear breakdown of your paycheck."
      icon={<CreditCard className="h-7 w-7 text-white" />}
      breadcrumbs={[
        { label: 'Calculators' },
        { label: 'Payroll & Paycheck Calculator' },
      ]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Payroll Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      howToSteps={howToSteps}
      formula={formula}
      formulaDescription={formulaDescription}
      workedExamples={[
        {
          title: '$75,000 Annual Salary',
          description:
            'Single filer with 22% federal tax, 5% state tax, and $500/month in deductions (health insurance + 401(k)). Gross pay is $6,250/month. Federal tax: $1,375/month, State tax: $312.50/month, Other deductions: $500/month. Net take-home pay: $4,062.50/month, or $48,750.00 annually. The effective combined tax rate is 27%, meaning roughly 65% of gross income makes it to the bank after all withholdings.',
        },
        {
          title: 'Bi-Weekly $3,000 Paycheck',
          description:
            'With a bi-weekly gross of $3,000, the annual equivalent is $78,000. At 22% federal tax and 0% state tax (Texas resident), with $300/month in deductions: gross per bi-weekly period is $3,000, federal tax is $660, deductions convert to $138.46 bi-weekly ($300 × 12 / 26). Net pay per bi-weekly check is $2,201.54, totaling approximately $57,240.04 annually.',
        },
        {
          title: '$120,000 High Earner',
          description:
            'A $120,000 annual salary with 24% federal tax, 8% state tax (California), and $800/month in deductions. Monthly gross is $10,000. Federal tax: $2,400, State tax: $800, Deductions: $800. Net pay: $6,000/month, or $72,000 annually. This example illustrates the impact of higher tax brackets and significant deductions on take-home pay, with a combined 32% tax rate reducing gross earnings by a third.',
        },
      ]}
      faqs={faqs}
      relatedTools={[
        { slug: 'sales-commission', title: 'Sales Commission Calculator', description: 'Calculate commission from sales revenue', icon: 'DollarSign' },
        { slug: 'salary-increase', title: 'Salary Increase Calculator', description: 'See what a raise looks like in your paycheck', icon: 'TrendingUp' },
        { slug: 'pro-rata-salary', title: 'Pro Rata Salary Calculator', description: 'Calculate prorated salary for partial periods', icon: 'CalendarClock' },
        { slug: 'time-card', title: 'Time Card Calculator', description: 'Convert work hours to decimal format', icon: 'Clock' },
        { slug: 'post-tax-bonus', title: 'Bonus Tax Calculator', description: 'Calculate net bonus after tax withholding', icon: 'Gift' },
        { slug: 'roi', title: 'ROI Calculator', description: 'Calculate return on investment', icon: 'BarChart3' },
      ]}
    >
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
              onChange={(e) => setSalaryInput(e.target.value)}
            />
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
              onChange={(e) => setFederalTaxRate(e.target.value)}
            />
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
              onChange={(e) => setStateTaxRate(e.target.value)}
            />
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
              Health insurance, 401(k), HSA, etc.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <TryExample onClick={handleTryExample} />
          <Button
            onClick={handleCalculate}
            className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
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
                      {formatCurrency(result.grossPerPeriod * periodsPerYear[frequency])}
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
                      -{formatCurrency(result.federalTaxPerPeriod * periodsPerYear[frequency])}
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
                      -{formatCurrency(result.stateTaxPerPeriod * periodsPerYear[frequency])}
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
                      -{formatCurrency(result.otherDeductionsPerPeriod * periodsPerYear[frequency])}
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
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Net Pay', value: result.netPayPerPeriod },
                      { name: 'Federal Tax', value: result.federalTaxPerPeriod },
                      { name: 'State Tax', value: result.stateTaxPerPeriod },
                      { name: 'Other Deductions', value: result.otherDeductionsPerPeriod },
                    ]}
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
    </CalculatorLayout>
  );
}
