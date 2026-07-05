'use client';

import { useState } from 'react';
import TryExample from './TryExample';
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
  incomeTaxableIncome: number;
  ficaTaxableIncome: number;
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
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ grossPay: string; payFrequency: string; federalTaxPct: string; stateTaxPct: string; k401Pct: string }>('payroll-deduction-calculator');

    const handleTryExample = () => {
    setGrossPay('5000');
    setPayFrequency('monthly');
setOtherPreTax('250');
setOtherPostTax('50');
    setResult(null);
  };

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

    // Pre-tax deductions
    const k401Amount = gross * (k401Rate / 100);
    const totalPreTax = healthAmt + k401Amount + oPreTax;
    
    // 401(k) reduces income tax, but does NOT reduce FICA taxes
    // Health insurance and other Section 125 pre-tax deductions reduce both
    const incomeTaxableIncome = gross - totalPreTax;
    const ficaTaxableIncome = gross - healthAmt - oPreTax;

    if (incomeTaxableIncome < 0) {
      setError('Pre-tax deductions cannot exceed your gross pay.');
      return;
    }

    // Taxes
    const federalTax = incomeTaxableIncome * (fedPct / 100);
    const stateTax = incomeTaxableIncome * (stPct / 100);
    const socialSecurity = ficaTaxableIncome * (ssRate / 100);
    const medicare = ficaTaxableIncome * (medRate / 100);
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
      incomeTaxableIncome,
      ficaTaxableIncome,
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
    saveEntry(
      { grossPay, payFrequency, federalTaxPct, stateTaxPct, k401Pct },
      `${formatCurrency(gross)} gross → ${formatCurrency(netPay)} net (${effectiveRate.toFixed(1)}% deducted)`
    );
  };

  const handleRestore = (inputs: { grossPay: string; payFrequency: string; federalTaxPct: string; stateTaxPct: string; k401Pct: string }) => {
    setGrossPay(inputs.grossPay);
    setPayFrequency(inputs.payFrequency as PayFrequency);
    setFederalTaxPct(inputs.federalTaxPct);
    setStateTaxPct(inputs.stateTaxPct);
    setK401Pct(inputs.k401Pct);
    setResult(null);
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

  // ------ Render ------

  return (
    <div className="w-full">
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
          
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6">
            <TryExample onClick={handleTryExample} />
            <Button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            <FileMinus className="h-4 w-4 mr-2" />
            Calculate Deductions
          </Button>
          </div>
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
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </div>
  );
}
