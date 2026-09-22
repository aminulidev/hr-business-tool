'use client';

import { useState } from 'react';
import TryExample from './TryExample';
import { motion } from 'framer-motion';
import {
  Shield,
  DollarSign,
  Percent,
  Info,
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

import UnitToggle from './UnitToggle';
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
const ADDITIONAL_MEDICARE_THRESHOLDS: Record<FilingStatus, number> = {
  single: 200000,
  mfj: 250000,
  mfs: 125000,
  hoh: 200000,
};
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

    const handleTryExample = () => {
    setSalary('90000');
    setFilingStatus('single');
    setStateTaxPct('5');
    setResult(null);
  };

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
      sal > ADDITIONAL_MEDICARE_THRESHOLDS[filingStatus]
        ? (sal - ADDITIONAL_MEDICARE_THRESHOLDS[filingStatus]) * ADDITIONAL_MEDICARE_RATE
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

  // ------ Render ------

  return (
    <div className="w-full">
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
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCalculate}
              className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
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
      </div>

      {/* Results */}
      {/* UnitToggle — show pay-period equivalents of the entered salary */}
        {(() => {
          const _ann = parseFloat(salary) || 0;
          if (!_ann) return null;
          return (
            <div className="px-4 sm:px-6 mt-3 mb-1">
              <UnitToggle annualSalary={_ann} />
            </div>
          );
        })()}
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
    </div>
  );
}
