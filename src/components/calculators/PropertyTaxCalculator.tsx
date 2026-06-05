'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, DollarSign, Percent, Info, Calculator, ArrowRight, BarChart as BarChartIcon } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
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
import ComparePanel, { CompareRow } from './ComparePanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CalcMode = 'calculate-tax' | 'calculate-rate';
type RateMode = 'percentage' | 'mills';

interface TaxResult {
  assessedValue: number;
  assessmentRatio: number;
  exemptions: number;
  taxableValue: number;
  annualTax: number;
  monthlyTax: number;
  effectiveRate: number;
  taxAsPercentOfValue: number;
  rateMode: RateMode;
  rateValue: number;
}

interface JurisdictionComparison {
  name: string;
  ratePercent: number;
  annualTax: number;
  monthlyTax: number;
}

interface PropertySnapshot {
  marketValue: number;
  taxableValue: number;
  annualTax: number;
  effectiveRate: number;
  label: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrencyExact = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function computeTaxFromRate(
  assessedValue: number,
  rateMode: RateMode,
  rateValue: number,
  assessmentRatio: number,
  exemptions: number
): TaxResult {
  const adjustedValue = assessedValue * (assessmentRatio / 100);
  const taxableValue = Math.max(adjustedValue - exemptions, 0);

  let annualTax: number;
  if (rateMode === 'mills') {
    annualTax = taxableValue * (rateValue / 1000);
  } else {
    annualTax = taxableValue * (rateValue / 100);
  }

  const monthlyTax = annualTax / 12;
  const effectiveRate = taxableValue > 0 ? (annualTax / taxableValue) * 100 : 0;
  const taxAsPercentOfValue = assessedValue > 0 ? (annualTax / assessedValue) * 100 : 0;

  return {
    assessedValue,
    assessmentRatio,
    exemptions,
    taxableValue,
    annualTax,
    monthlyTax,
    effectiveRate,
    taxAsPercentOfValue,
    rateMode,
    rateValue,
  };
}

function computeRateFromTax(
  assessedValue: number,
  assessmentRatio: number,
  exemptions: number,
  targetTax: number,
  rateMode: RateMode
): TaxResult {
  const adjustedValue = assessedValue * (assessmentRatio / 100);
  const taxableValue = Math.max(adjustedValue - exemptions, 0);

  let rateValue: number;
  if (taxableValue > 0) {
    rateValue = rateMode === 'mills'
      ? (targetTax / taxableValue) * 1000
      : (targetTax / taxableValue) * 100;
  } else {
    rateValue = 0;
  }

  return computeTaxFromRate(assessedValue, rateMode, rateValue, assessmentRatio, exemptions);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PropertyTaxCalculator() {
  const [mode, setMode] = useState<CalcMode>('calculate-tax');
  const [assessedValue, setAssessedValue] = useState('');
  const [rateMode, setRateMode] = useState<RateMode>('percentage');
  const [taxRate, setTaxRate] = useState('');
  const [assessmentRatio, setAssessmentRatio] = useState('100');
  const [exemptions, setExemptions] = useState('');
  const [targetTax, setTargetTax] = useState('');
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Comparison State
  const [compareA, setCompareA] = useState<PropertySnapshot | null>(null);
  const [compareB, setCompareB] = useState<PropertySnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ mode: string; assessedValue: string; rateMode: string; taxRate: string; assessmentRatio: string; exemptions: string }>('property-tax-calculator');

  const handleCalculate = () => {
    setResult(null);
    setError(null);

    const av = parseFloat(assessedValue);
    if (isNaN(av) || av <= 0) {
      setError('Please enter a valid assessed property value greater than zero.');
      return;
    }

    const ar = parseFloat(assessmentRatio);
    if (isNaN(ar) || ar < 0 || ar > 100) {
      setError('Assessment ratio must be between 0% and 100%.');
      return;
    }

    const ex = parseFloat(exemptions) || 0;
    if (ex < 0) {
      setError('Exemptions cannot be negative.');
      return;
    }

    if (mode === 'calculate-tax') {
      const rate = parseFloat(taxRate);
      if (isNaN(rate) || rate < 0) {
        setError('Please enter a valid tax rate (zero or greater).');
        return;
      }

      const res = computeTaxFromRate(av, rateMode, rate, ar, ex);
      setResult(res);
      saveEntry(
        { mode, assessedValue, rateMode, taxRate, assessmentRatio, exemptions },
        `${formatCurrencyExact(res.annualTax)}/yr — ${formatCurrencyExact(res.monthlyTax)}/mo (${res.effectiveRate.toFixed(2)}%)`
      );
    } else {
      const tax = parseFloat(targetTax);
      if (isNaN(tax) || tax < 0) {
        setError('Please enter a valid target tax amount (zero or greater).');
        return;
      }

      const res = computeRateFromTax(av, ar, ex, tax, rateMode);
      setResult(res);
      saveEntry(
        { mode, assessedValue, rateMode, taxRate, assessmentRatio, exemptions },
        `Rate ${res.rateValue.toFixed(2)} ${rateMode === 'mills' ? 'mills' : '%'} for ${formatCurrencyExact(tax)}/yr tax`
      );
    }
  };

  const handleRestore = (inputs: { mode: string; assessedValue: string; rateMode: string; taxRate: string; assessmentRatio: string; exemptions: string }) => {
    setMode(inputs.mode as CalcMode);
    setAssessedValue(inputs.assessedValue);
    setRateMode(inputs.rateMode as RateMode);
    setTaxRate(inputs.taxRate);
    setAssessmentRatio(inputs.assessmentRatio);
    setExemptions(inputs.exemptions);
    setResult(null);
  };

  const handleReset = () => {
    setAssessedValue('');
    setRateMode('percentage');
    setTaxRate('');
    setAssessmentRatio('100');
    setExemptions('');
    setTargetTax('');
    setResult(null);
    setError(null);
  };

  const comparisonData: JurisdictionComparison[] = result
    ? [
        { name: 'Your Rate', ratePercent: result.effectiveRate, annualTax: result.annualTax, monthlyTax: result.monthlyTax },
        { name: 'Low (0.5%)', ratePercent: 0.5, annualTax: result.taxableValue * 0.005, monthlyTax: (result.taxableValue * 0.005) / 12 },
        { name: 'Average (1.1%)', ratePercent: 1.1, annualTax: result.taxableValue * 0.011, monthlyTax: (result.taxableValue * 0.011) / 12 },
        { name: 'High (2.0%)', ratePercent: 2.0, annualTax: result.taxableValue * 0.02, monthlyTax: (result.taxableValue * 0.02) / 12 },
        { name: 'Very High (2.5%)', ratePercent: 2.5, annualTax: result.taxableValue * 0.025, monthlyTax: (result.taxableValue * 0.025) / 12 },
      ]
    : [];

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* ================================================================= */}
        {/* Mode Toggle                                                       */}
        {/* ================================================================= */}
        <div className="flex rounded-xl bg-muted/50 p-1 border border-border/50">
          <button
            type="button"
            onClick={() => { setMode('calculate-tax'); setResult(null); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              mode === 'calculate-tax'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calculator className="h-4 w-4" />
            Calculate Tax from Rate
          </button>
          <button
            type="button"
            onClick={() => { setMode('calculate-rate'); setResult(null); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              mode === 'calculate-rate'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowRight className="h-4 w-4" />
            Calculate Rate from Tax
          </button>
        </div>

        {/* Assessed Value */}
        <div className="space-y-2">
          <Label htmlFor="assessedValue" className="text-sm font-medium">
            <Building2 className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Assessed Property Value ($)
          </Label>
          <Input
            id="assessedValue"
            type="number"
            min="0"
            step="1000"
            placeholder="e.g., 350000"
            value={assessedValue}
            onChange={(e) => setAssessedValue(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            The value assigned by your local tax assessor (not necessarily market value)
          </p>
        </div>

        {/* Assessment Ratio */}
        <div className="space-y-2">
          <Label htmlFor="assessmentRatio" className="text-sm font-medium">
            <Percent className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Assessment Ratio (%)
          </Label>
          <Input
            id="assessmentRatio"
            type="number"
            min="0"
            max="100"
            step="1"
            placeholder="e.g., 100"
            value={assessmentRatio}
            onChange={(e) => setAssessmentRatio(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Percentage of market value used for taxation (100% if full value is assessed)
          </p>
        </div>

        {/* Exemptions */}
        <div className="space-y-2">
          <Label htmlFor="exemptions" className="text-sm font-medium">
            <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Exemptions ($)
          </Label>
          <Input
            id="exemptions"
            type="number"
            min="0"
            step="1000"
            placeholder="e.g., 25000"
            value={exemptions}
            onChange={(e) => setExemptions(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Homestead, senior, veteran, or other exemption amounts
          </p>
        </div>

        {/* Rate Mode and Rate Input (or Target Tax) */}
        {mode === 'calculate-tax' ? (
          <motion.div
            key="calc-tax"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Rate Format */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tax Rate Format</Label>
              <div className="flex rounded-xl bg-muted/50 p-1 border border-border/50">
                <button
                  type="button"
                  onClick={() => setRateMode('percentage')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    rateMode === 'percentage'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Percent className="h-3.5 w-3.5" />
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setRateMode('mills')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    rateMode === 'mills'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Calculator className="h-3.5 w-3.5" />
                  Mills
                </button>
              </div>
            </div>

            {/* Tax Rate */}
            <div className="space-y-2">
              <Label htmlFor="taxRate" className="text-sm font-medium">
                {rateMode === 'percentage' ? 'Tax Rate (%)' : 'Millage Rate (mills)'}
              </Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                step={rateMode === 'percentage' ? '0.01' : '0.1'}
                placeholder={rateMode === 'percentage' ? 'e.g., 1.25' : 'e.g., 12.5'}
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
              {rateMode === 'mills' && (
                <p className="text-xs text-muted-foreground">
                  1 mill = $1 of tax per $1,000 of assessed value. 10 mills = 1%.
                </p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="calc-rate"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Rate Format for reverse calc */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Desired Rate Format</Label>
              <div className="flex rounded-xl bg-muted/50 p-1 border border-border/50">
                <button
                  type="button"
                  onClick={() => setRateMode('percentage')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    rateMode === 'percentage'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Percent className="h-3.5 w-3.5" />
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setRateMode('mills')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    rateMode === 'mills'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Calculator className="h-3.5 w-3.5" />
                  Mills
                </button>
              </div>
            </div>

            {/* Target Tax */}
            <div className="space-y-2">
              <Label htmlFor="targetTax" className="text-sm font-medium">
                <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Annual Tax Amount ($)
              </Label>
              <Input
                id="targetTax"
                type="number"
                min="0"
                step="100"
                placeholder="e.g., 5000"
                value={targetTax}
                onChange={(e) => setTargetTax(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the annual tax bill to find the effective rate
              </p>
            </div>
          </motion.div>
        )}

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
            <Building2 className="h-4 w-4 mr-2" />
            Calculate Property Tax
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
                  {mode === 'calculate-tax' ? 'Estimated Annual Property Tax' : 'Required Tax Rate'}
                </p>
                <p className="text-4xl font-bold text-emerald-600">
                  {mode === 'calculate-tax'
                    ? formatCurrencyExact(result.annualTax)
                    : `${result.rateValue.toFixed(2)} ${result.rateMode === 'mills' ? 'mills' : '%'}`
                  }
                </p>
                {mode === 'calculate-tax' && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 px-3 py-1 text-sm font-medium"
                  >
                    {formatCurrencyExact(result.monthlyTax)}/month
                  </Badge>
                )}

                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCompareA({
                      marketValue: result.assessedValue,
                      taxableValue: result.taxableValue,
                      annualTax: result.annualTax,
                      effectiveRate: result.effectiveRate,
                      label: `${formatCurrency(result.assessedValue)} Home`
                    })}
                    className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary"
                  >
                    {compareA ? '↺ Set A' : '+ Save A'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCompareB({
                      marketValue: result.assessedValue,
                      taxableValue: result.taxableValue,
                      annualTax: result.annualTax,
                      effectiveRate: result.effectiveRate,
                      label: `${formatCurrency(result.assessedValue)} Home`
                    })}
                    className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600"
                  >
                    {compareB ? '↺ Set B' : '+ Save B'}
                  </Button>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Taxable Value</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(result.taxableValue)}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Annual Tax</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {formatCurrencyExact(result.annualTax)}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Monthly Tax</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {formatCurrencyExact(result.monthlyTax)}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Effective Rate</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {result.effectiveRate.toFixed(2)}%
                  </p>
                </motion.div>
              </div>

              {/* Jurisdiction Comparison Bar Chart */}
              {mode === 'calculate-tax' && comparisonData.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BarChartIcon className="h-4.5 w-4.5 text-primary" />
                    Jurisdiction Comparison (Annual Tax)
                  </p>
                  <div className="h-72 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={comparisonData}
                        margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: '#888888', fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          interval={0}
                          angle={-25}
                          textAnchor="end"
                        />
                        <YAxis
                          tick={{ fill: '#888888', fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <RechartsTooltip
                          formatter={(value: number) => [`${formatCurrencyExact(value)}`, 'Annual Tax']}
                          labelStyle={{ color: '#888888' }}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="annualTax" radius={[4, 4, 0, 0]}>
                          {comparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#3b82f6'} />
                          ))}
                        </Bar>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Jurisdiction Comparison */}
              {mode === 'calculate-tax' && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Jurisdiction Comparison</p>
                  <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/50 bg-muted/30 sticky top-0">
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Jurisdiction</th>
                            <th className="text-right px-4 py-3 font-medium text-muted-foreground">Effective Rate</th>
                            <th className="text-right px-4 py-3 font-medium text-muted-foreground">Annual Tax</th>
                            <th className="text-right px-4 py-3 font-medium text-muted-foreground">Monthly</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {comparisonData.map((row, idx) => (
                            <tr key={idx} className={idx === 0 ? 'bg-emerald-500/5' : ''}>
                              <td className="px-4 py-3 font-medium">
                                {row.name}
                                {idx === 0 && (
                                  <Badge variant="outline" className="ml-2 text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-600">You</Badge>
                                )}
                              </td>
                              <td className="text-right px-4 py-3 text-muted-foreground">
                                {row.ratePercent.toFixed(2)}%
                              </td>
                              <td className={`text-right px-4 py-3 font-medium ${idx === 0 ? 'text-emerald-600' : ''}`}>
                                {formatCurrencyExact(row.annualTax)}
                              </td>
                              <td className="text-right px-4 py-3 text-muted-foreground">
                                {formatCurrencyExact(row.monthlyTax)}
                              </td>
                            </tr>
                          ))}
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
                  <strong>Note:</strong> Property tax calculations vary by jurisdiction. This calculator provides estimates
                  based on the values you enter. Actual tax bills may include additional levies, special assessments, or
                  fees not reflected here. Contact your local tax assessor\'s office for exact figures.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Market Value',     valueA: formatCurrency(compareA.marketValue),  valueB: formatCurrency(compareB.marketValue),  numA: compareA.marketValue,  numB: compareB.marketValue },
          { label: 'Taxable Value',    valueA: formatCurrency(compareA.taxableValue), valueB: formatCurrency(compareB.taxableValue), numA: compareA.taxableValue, numB: compareB.taxableValue },
          { label: 'Annual Prop Tax',  valueA: formatCurrencyExact(compareA.annualTax), valueB: formatCurrencyExact(compareB.annualTax), numA: compareA.annualTax, numB: compareB.annualTax, higherIsBetter: false },
          { label: 'Effective Tax Rate', valueA: formatPercent(compareA.effectiveRate), valueB: formatPercent(compareB.effectiveRate), numA: compareA.effectiveRate, numB: compareB.effectiveRate, higherIsBetter: false },
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

      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </div>
  );
}
