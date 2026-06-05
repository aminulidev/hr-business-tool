'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, TrendingDown, Info } from 'lucide-react';
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
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<PayrollInputs>('payroll-calculator');

  const handleTryExample = () => {
    setSalaryInput('75000');
    setFrequency('annual');
    setFederalTaxRate('22');
    setStateTaxRate('5');
    setOtherDeductions('500');
    
    // Trigger calculation with these values
    const salary = 75000;
    const fedRate = 0.22;
    const stRate = 0.05;
    const deductions = 500;
    const periods = 1; // annual
    const grossPerPeriod = 75000;
    const federalTaxPerPeriod = grossPerPeriod * fedRate;
    const stateTaxPerPeriod = grossPerPeriod * stRate;
    const deductionsPerPeriod = deductions * 12;
    const totalDeductionsPerPeriod = federalTaxPerPeriod + stateTaxPerPeriod + deductionsPerPeriod;
    const netPayPerPeriod = grossPerPeriod - totalDeductionsPerPeriod;
    const effectiveTaxRate = 27; // (22 + 5)
    const annualNetPay = netPayPerPeriod;

    setResult({
      grossPerPeriod,
      federalTaxPerPeriod,
      stateTaxPerPeriod,
      otherDeductionsPerPeriod: deductionsPerPeriod,
      netPayPerPeriod,
      effectiveTaxRate,
      annualNetPay,
    });
    saveEntry(
      { salaryInput: '75000', frequency: 'annual', federalTaxRate: '22', stateTaxRate: '5', otherDeductions: '500' },
      `${formatCurrency(netPayPerPeriod)} net / Annual (${formatCurrency(grossPerPeriod)} gross)`
    );
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
    saveEntry(
      { salaryInput, frequency, federalTaxRate, stateTaxRate, otherDeductions },
      `${formatCurrency(netPayPerPeriod)} net / ${frequencyLabels[frequency]} (${formatCurrency(grossPerPeriod)} gross)`
    );
  };

  const handleRestore = (inputs: PayrollInputs) => {
    setSalaryInput(inputs.salaryInput);
    setFrequency(inputs.frequency);
    setFederalTaxRate(inputs.federalTaxRate);
    setStateTaxRate(inputs.stateTaxRate);
    setOtherDeductions(inputs.otherDeductions);
    setResult(null);
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
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </div>
  );
}
