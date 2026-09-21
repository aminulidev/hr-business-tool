'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Percent, Info, ArrowRightLeft } from 'lucide-react';
import TryExample from './TryExample';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CalcMode = 'cost-to-price' | 'price-to-cost';

interface MarkupResult {
  costPrice: number;
  markupPct: number;
  sellingPrice: number;
  grossProfit: number;
  profitPerUnit: number;
  marginPct: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function markupToMargin(markupPct: number): number {
  return (markupPct / (100 + markupPct)) * 100;
}

function marginToMarkup(marginPct: number): number {
  return (marginPct / (100 - marginPct)) * 100;
}

const referenceRates = [
  { markup: 10, margin: 9.09 },
  { markup: 20, margin: 16.67 },
  { markup: 25, margin: 20.00 },
  { markup: 30, margin: 23.08 },
  { markup: 50, margin: 33.33 },
  { markup: 100, margin: 50.00 },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MarkupCalculator() {
  const [mode, setMode] = useState<CalcMode>('cost-to-price');
  const [costPrice, setCostPrice] = useState('');
  const [markupPct, setMarkupPct] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [result, setResult] = useState<MarkupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ mode: string; costPrice: string; markupPct: string; sellingPrice: string }>('markup-calculator');

  // ---- Comparison state ----
  const [compareA, setCompareA] = useState<{ result: MarkupResult; label: string } | null>(null);
  const [compareB, setCompareB] = useState<{ result: MarkupResult; label: string } | null>(null);

    const handleTryExample = () => {
    setCostPrice('50');
    setMarkupPct('40');
    setResult(null);
  };

  const handleCalculate = () => {
    setResult(null);
    setError(null);

    if (mode === 'cost-to-price') {
      const cost = parseFloat(costPrice);
      const markup = parseFloat(markupPct);
      if (isNaN(cost) || cost < 0) {
        setError('Please enter a valid cost price (zero or greater).');
        return;
      }
      if (isNaN(markup) || markup < 0) {
        setError('Please enter a valid markup percentage (zero or greater).');
        return;
      }
      const price = cost * (1 + markup / 100);
      const profit = price - cost;
      const margin = markupToMargin(markup);

      setResult({
        costPrice: cost,
        markupPct: markup,
        sellingPrice: price,
        grossProfit: profit,
        profitPerUnit: profit,
        marginPct: margin,
      });
    } else {
      const price = parseFloat(sellingPrice);
      const markup = parseFloat(markupPct);
      if (isNaN(price) || price <= 0) {
        setError('Please enter a valid selling price greater than zero.');
        return;
      }
      if (isNaN(markup) || markup < 0) {
        setError('Please enter a valid markup percentage (zero or greater).');
        return;
      }
      const cost = price / (1 + markup / 100);
      const profit = price - cost;
      const margin = markupToMargin(markup);

      setResult({
        costPrice: cost,
        markupPct: markup,
        sellingPrice: price,
        grossProfit: profit,
        profitPerUnit: profit,
        marginPct: margin,
      });
    }
    saveEntry(
      { mode, costPrice, markupPct, sellingPrice },
      `${(result?.markupPct ?? 0).toFixed(1)}% markup: ${formatCurrency(result?.costPrice ?? 0)} cost → ${formatCurrency(result?.sellingPrice ?? 0)} price`
    );
  };

  const handleRestore = (inputs: { mode: string; costPrice: string; markupPct: string; sellingPrice: string }) => {
    setMode(inputs.mode as CalcMode);
    setCostPrice(inputs.costPrice);
    setMarkupPct(inputs.markupPct);
    setSellingPrice(inputs.sellingPrice);
    setResult(null);
  };

  const handleReset = () => {
    setCostPrice('');
    setMarkupPct('');
    setSellingPrice('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Mode Toggle */}
        <div className="flex rounded-xl bg-muted/50 p-1 border border-border/50">
          <button
            type="button"
            onClick={() => { setMode('cost-to-price'); setResult(null); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              mode === 'cost-to-price'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Cost to Selling Price
          </button>
          <button
            type="button"
            onClick={() => { setMode('price-to-cost'); setResult(null); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              mode === 'price-to-cost'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ArrowRightLeft className="h-4 w-4" />
            Selling Price to Cost
          </button>
        </div>

        {/* Inputs */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {mode === 'cost-to-price' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="costPrice" className="text-sm font-medium">
                  <Package className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Cost Price ($)
                </Label>
                <Input
                  id="costPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 50.00"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The amount you pay to produce or purchase the product
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="markupPct1" className="text-sm font-medium">
                  <Percent className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Markup Percentage (%)
                </Label>
                <Input
                  id="markupPct1"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g., 50"
                  value={markupPct}
                  onChange={(e) => setMarkupPct(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="sellingPrice" className="text-sm font-medium">
                  <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Selling Price ($)
                </Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 75.00"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The final retail or selling price
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="markupPct2" className="text-sm font-medium">
                  <Percent className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Markup Percentage (%)
                </Label>
                <Input
                  id="markupPct2"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g., 50"
                  value={markupPct}
                  onChange={(e) => setMarkupPct(e.target.value)}
                />
              </div>
            </>
          )}
        </motion.div>

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
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-6">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCalculate}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
              size="lg"
            >
              <Package className="h-4 w-4 mr-2" />
              Calculate Markup
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
                  {mode === 'cost-to-price' ? 'Selling Price' : 'Cost Price'}
                </p>
                <p className="text-4xl font-bold text-emerald-600">
                  {formatCurrency(mode === 'cost-to-price' ? result.sellingPrice : result.costPrice)}
                </p>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 px-3 py-1 text-sm font-medium"
                >
                  {formatCurrency(result.grossProfit)} profit per unit
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
                  <p className="text-xs text-muted-foreground mb-1">Cost Price</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(result.costPrice)}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Selling Price</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {formatCurrency(result.sellingPrice)}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Markup</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {result.markupPct.toFixed(1)}%
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Gross Margin</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {result.marginPct.toFixed(1)}%
                  </p>
                </motion.div>
              </div>

              {/* Visual Breakdown */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Price Breakdown</p>
                <div className="space-y-2">
                  {/* Selling price total bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20 shrink-0 text-right">Selling Price</span>
                    <div className="flex-1 h-8 rounded-lg bg-muted/60 relative overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-lg bg-gradient-to-r from-blue-400/40 to-blue-500/40 flex items-center justify-end pr-3"
                      >
                        <span className="text-xs font-semibold text-blue-700">
                          {formatCurrency(result.sellingPrice)}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                  {/* Cost portion */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20 shrink-0 text-right">Cost</span>
                    <div className="flex-1 h-8 rounded-lg bg-muted/60 relative overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${result.sellingPrice > 0 ? (result.costPrice / result.sellingPrice) * 100 : 0}%` }}
                        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                        className="h-full rounded-lg bg-gradient-to-r from-red-400/50 to-red-500/50 flex items-center justify-end pr-3"
                      >
                        <span className="text-xs font-semibold text-red-700 whitespace-nowrap">
                          {formatCurrency(result.costPrice)}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                  {/* Profit portion */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20 shrink-0 text-right">Profit</span>
                    <div className="flex-1 h-8 rounded-lg bg-muted/60 relative overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${result.sellingPrice > 0 ? (result.grossProfit / result.sellingPrice) * 100 : 0}%` }}
                        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
                        className="h-full rounded-lg bg-gradient-to-r from-emerald-400/60 to-emerald-500/60 flex items-center justify-end pr-3"
                      >
                        <span className="text-xs font-semibold text-emerald-700 whitespace-nowrap">
                          {formatCurrency(result.grossProfit)}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Reference Table */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Markup vs Margin Quick Reference</p>
                <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="text-center px-4 py-3 font-medium text-muted-foreground">Markup %</th>
                        <th className="text-center px-4 py-3 font-medium text-muted-foreground">Margin %</th>
                        <th className="text-center px-4 py-3 font-medium text-muted-foreground">Multiplier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {referenceRates.map((row) => (
                        <tr key={row.markup} className={Math.abs(row.markup - result.markupPct) < 0.01 ? 'bg-emerald-500/5' : ''}>
                          <td className={`text-center px-4 py-3 font-medium ${Math.abs(row.markup - result.markupPct) < 0.01 ? 'text-emerald-600' : ''}`}>
                            {row.markup}%
                          </td>
                          <td className={`text-center px-4 py-3 font-medium ${Math.abs(row.markup - result.markupPct) < 0.01 ? 'text-emerald-600' : ''}`}>
                            {row.margin.toFixed(2)}%
                          </td>
                          <td className="text-center px-4 py-3 text-muted-foreground">
                            {((100 + row.markup) / 100).toFixed(2)}x
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Markup vs Margin Comparison */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Markup vs Margin Comparison</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 space-y-2">
                    <p className="text-xs text-muted-foreground">Your Markup</p>
                    <p className="text-2xl font-bold text-emerald-600">{result.markupPct.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">
                      Calculated on <strong>cost</strong> of {formatCurrency(result.costPrice)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 space-y-2">
                    <p className="text-xs text-muted-foreground">Equivalent Margin</p>
                    <p className="text-2xl font-bold text-emerald-600">{result.marginPct.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">
                      Calculated on <strong>selling price</strong> of {formatCurrency(result.sellingPrice)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="flex items-start gap-2 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Key difference:</strong> Markup of {result.markupPct.toFixed(1)}% on cost gives a margin of only{' '}
                  {result.marginPct.toFixed(1)}% because margin is calculated on the higher selling price ({formatCurrency(result.sellingPrice)}).
                  Using markup when you mean margin (or vice versa) can lead to significant pricing errors.
                </p>
              </div>

              {/* Cost vs Profit Pie Chart */}
              <div className="print:hidden">
                <p className="text-sm font-medium text-muted-foreground mb-3">Cost vs Profit Breakdown</p>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Cost', value: result.costPrice },
                        { name: 'Gross Profit', value: result.grossProfit },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      <Cell fill="#ef4444" />
                      <Cell fill="#10b981" />
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ---- Comparison save buttons ---- */}
      {result && (
        <div className="flex flex-wrap gap-2 mt-4 px-1">
          <button
            onClick={() => setCompareA({ result, label: `${formatCurrency(result.costPrice)} + ${result.markupPct.toFixed(1)}% markup` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
          >
            {compareA ? '↺ Replace Scenario A' : '+ Save as Scenario A'}
          </button>
          <button
            onClick={() => setCompareB({ result, label: `${formatCurrency(result.costPrice)} + ${result.markupPct.toFixed(1)}% markup` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 transition-colors font-medium"
          >
            {compareB ? '↺ Replace Scenario B' : '+ Save as Scenario B'}
          </button>
        </div>
      )}

      {/* ---- Compare Panel ---- */}
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Cost Price',      valueA: formatCurrency(compareA.result.costPrice),      valueB: formatCurrency(compareB.result.costPrice),      numA: compareA.result.costPrice,      numB: compareB.result.costPrice,      higherIsBetter: false },
          { label: 'Markup %',        valueA: `${compareA.result.markupPct.toFixed(2)}%`,    valueB: `${compareB.result.markupPct.toFixed(2)}%`,    numA: compareA.result.markupPct,      numB: compareB.result.markupPct },
          { label: 'Selling Price',   valueA: formatCurrency(compareA.result.sellingPrice),   valueB: formatCurrency(compareB.result.sellingPrice),   numA: compareA.result.sellingPrice,   numB: compareB.result.sellingPrice },
          { label: 'Profit per Unit', valueA: formatCurrency(compareA.result.profitPerUnit),  valueB: formatCurrency(compareB.result.profitPerUnit),  numA: compareA.result.profitPerUnit,  numB: compareB.result.profitPerUnit },
          { label: 'Margin %',        valueA: `${compareA.result.marginPct.toFixed(2)}%`,    valueB: `${compareB.result.marginPct.toFixed(2)}%`,    numA: compareA.result.marginPct,      numB: compareB.result.marginPct },
        ];
        return (
          <ComparePanel
            rows={rows}
            labelA={compareA.label}
            labelB={compareB.label}
            onClear={() => { setCompareA(null); setCompareB(null); }}
            onSwap={() => { const tmp = compareA; setCompareA(compareB); setCompareB(tmp); }}
          />
        );
      })()}

      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </div>
  );
}