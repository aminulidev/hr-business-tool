'use client';

import { useState } from 'react';
import TryExample from './TryExample';
import { motion } from 'framer-motion';
import { PieChart, DollarSign, Percent, Info, Plus, Trash2 } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
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

type CalcMode = 'revenue-cogs' | 'revenue-margin' | 'cogs-margin';

interface Product {
  id: number;
  name: string;
  revenue: string;
  cogs: string;
}

interface ProductResult {
  id: number;
  name: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMargin: number;
}

interface MarginResult {
  products: ProductResult[];
  totalRevenue: number;
  totalCogs: number;
  totalGrossProfit: number;
  totalGrossMargin: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

let nextId = 2;

function calcProduct(revenue: number, cogs: number, name: string, id: number): ProductResult {
  const grossProfit = revenue - cogs;
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  return { id, name, revenue, cogs, grossProfit, grossMargin };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GrossMarginCalculator() {
  const [mode, setMode] = useState<CalcMode>('revenue-cogs');

  // Mode 1 & 2: single product
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');
  const [marginPct, setMarginPct] = useState('');

  // Multi-product
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Product 1', revenue: '', cogs: '' },
  ]);

  const [result, setResult] = useState<MarginResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ mode: string; revenue: string; cogs: string; marginPct: string }>('gross-margin-calculator');

  // ---- Comparison state ----
  const [compareA, setCompareA] = useState<{ result: MarginResult; label: string } | null>(null);
  const [compareB, setCompareB] = useState<{ result: MarginResult; label: string } | null>(null);

  const handleSingleCalculate = () => {
    setResult(null);
    setError(null);

    if (mode === 'revenue-cogs') {
      const rev = parseFloat(revenue);
      const cost = parseFloat(cogs);
      if (isNaN(rev) || rev <= 0) {
        setError('Please enter a valid revenue amount greater than zero.');
        return;
      }
      if (isNaN(cost) || cost < 0) {
        setError('Please enter a valid COGS (zero or greater).');
        return;
      }
      if (cost > rev) {
        setError('COGS cannot exceed revenue. This would result in a gross loss.');
        return;
      }
      const prod = calcProduct(rev, cost, 'Product', 0);
      setResult({
        products: [prod],
        totalRevenue: prod.revenue,
        totalCogs: prod.cogs,
        totalGrossProfit: prod.grossProfit,
        totalGrossMargin: prod.grossMargin,
      });
    } else if (mode === 'revenue-margin') {
      const rev = parseFloat(revenue);
      const margin = parseFloat(marginPct);
      if (isNaN(rev) || rev <= 0) {
        setError('Please enter a valid revenue amount greater than zero.');
        return;
      }
      if (isNaN(margin) || margin < 0 || margin > 100) {
        setError('Margin percentage must be between 0% and 100%.');
        return;
      }
      const cost = rev * (1 - margin / 100);
      const prod = calcProduct(rev, cost, 'Product', 0);
      setResult({
        products: [prod],
        totalRevenue: prod.revenue,
        totalCogs: prod.cogs,
        totalGrossProfit: prod.grossProfit,
        totalGrossMargin: prod.grossMargin,
      });
    } else {
      const cost = parseFloat(cogs);
      const margin = parseFloat(marginPct);
      if (isNaN(cost) || cost < 0) {
        setError('Please enter a valid COGS (zero or greater).');
        return;
      }
      if (isNaN(margin) || margin < 0 || margin > 100) {
        setError('Margin percentage must be between 0% and 100%.');
        return;
      }
      const rev = margin >= 100 ? 0 : cost / (1 - margin / 100);
      const prod = calcProduct(rev, cost, 'Product', 0);
      setResult({
        products: [prod],
        totalRevenue: prod.revenue,
        totalCogs: prod.cogs,
        totalGrossProfit: prod.grossProfit,
        totalGrossMargin: prod.grossMargin,
      });
    }
    saveEntry(
      { mode, revenue, cogs, marginPct },
      `${mode}: margin ${result ? result.totalGrossMargin.toFixed(1) : '?'}% on ${formatCurrency(parseFloat(revenue) || parseFloat(cogs) || 0)}`
    );
  };

  const handleRestore = (inputs: { mode: string; revenue: string; cogs: string; marginPct: string }) => {
    setMode(inputs.mode as CalcMode);
    setRevenue(inputs.revenue);
    setCogs(inputs.cogs);
    setMarginPct(inputs.marginPct);
    setResult(null);
  };


  const handleTryExample = () => {
    setRevenue('100000');
    setCogs('60000');
    setResult(null);
  };

  const handleMultiCalculate = () => {
    setResult(null);
    setError(null);

    const results: ProductResult[] = [];
    for (const p of products) {
      const rev = parseFloat(p.revenue);
      const cost = parseFloat(p.cogs);
      if (isNaN(rev) || rev <= 0) {
        setError(`Please enter a valid revenue for ${p.name}.`);
        return;
      }
      if (isNaN(cost) || cost < 0) {
        setError(`Please enter a valid COGS for ${p.name}.`);
        return;
      }
      results.push(calcProduct(rev, cost, p.name, p.id));
    }

    const totalRevenue = results.reduce((s, r) => s + r.revenue, 0);
    const totalCogs = results.reduce((s, r) => s + r.cogs, 0);
    const totalGrossProfit = totalRevenue - totalCogs;
    const totalGrossMargin = totalRevenue > 0 ? (totalGrossProfit / totalRevenue) * 100 : 0;

    setResult({ products: results, totalRevenue, totalCogs, totalGrossProfit, totalGrossMargin });
  };

  const addProduct = () => {
    if (products.length >= 5) return;
    nextId++;
    setProducts([...products, { id: nextId, name: `Product ${nextId}`, revenue: '', cogs: '' }]);
  };

  const removeProduct = (id: number) => {
    if (products.length <= 1) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateProduct = (id: number, field: keyof Product, value: string) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleReset = () => {
    setRevenue('');
    setCogs('');
    setMarginPct('');
    setProducts([{ id: 1, name: 'Product 1', revenue: '', cogs: '' }]);
    setResult(null);
    setError(null);
  };

  const isMultiProduct = mode === 'revenue-cogs';

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Mode Toggle */}
        <div className="flex flex-wrap rounded-xl bg-muted/50 p-1 border border-border/50 gap-1">
          {([
            { value: 'revenue-cogs' as CalcMode, label: 'Revenue & COGS' },
            { value: 'revenue-margin' as CalcMode, label: 'Revenue & Margin %' },
            { value: 'cogs-margin' as CalcMode, label: 'COGS & Margin %' },
          ]).map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => { setMode(m.value); setResult(null); setError(null); }}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                mode === m.value
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Single Product Inputs */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {(mode === 'revenue-cogs' || mode === 'revenue-margin') && (
            <div className="space-y-2">
              <Label htmlFor="revenue" className="text-sm font-medium">
                <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Revenue ($)
              </Label>
              <Input
                id="revenue"
                type="number"
                min="0"
                step="100"
                placeholder="e.g., 100000"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
              />
            </div>
          )}

          {(mode === 'revenue-cogs' || mode === 'cogs-margin') && (
            <div className="space-y-2">
              <Label htmlFor="cogs" className="text-sm font-medium">
                <PieChart className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Cost of Goods Sold — COGS ($)
              </Label>
              <Input
                id="cogs"
                type="number"
                min="0"
                step="100"
                placeholder="e.g., 60000"
                value={cogs}
                onChange={(e) => setCogs(e.target.value)}
              />
            </div>
          )}

          {(mode === 'revenue-margin' || mode === 'cogs-margin') && (
            <div className="space-y-2">
              <Label htmlFor="marginPct" className="text-sm font-medium">
                <Percent className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Desired Gross Margin (%)
              </Label>
              <Input
                id="marginPct"
                type="number"
                min="0"
                max="100"
                step="1"
                placeholder="e.g., 40"
                value={marginPct}
                onChange={(e) => setMarginPct(e.target.value)}
              />
            </div>
          )}
        </motion.div>

        {/* Multi-Product Section */}
        {mode === 'revenue-cogs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Multi-Product Comparison</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProduct}
                disabled={products.length >= 5}
                className="h-8 gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Product
              </Button>
            </div>

            <div className="space-y-3">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{product.name}</span>
                    {products.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(product.id)}
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor={`rev-${product.id}`} className="text-xs text-muted-foreground">Revenue ($)</Label>
                      <Input
                        id={`rev-${product.id}`}
                        type="number"
                        min="0"
                        step="100"
                        placeholder="e.g., 50000"
                        value={product.revenue}
                        onChange={(e) => updateProduct(product.id, 'revenue', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`cogs-${product.id}`} className="text-xs text-muted-foreground">COGS ($)</Label>
                      <Input
                        id={`cogs-${product.id}`}
                        type="number"
                        min="0"
                        step="100"
                        placeholder="e.g., 30000"
                        value={product.cogs}
                        onChange={(e) => updateProduct(product.id, 'cogs', e.target.value)}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
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
            onClick={isMultiProduct && products.length > 1 ? handleMultiCalculate : handleSingleCalculate}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            <PieChart className="h-4 w-4 mr-2" />
            Calculate Gross Margin
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
                  {result.products.length > 1 ? 'Total Gross Margin' : 'Gross Margin'}
                </p>
                <p className="text-4xl font-bold text-emerald-600">
                  {result.totalGrossMargin.toFixed(1)}%
                </p>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 px-3 py-1 text-sm font-medium"
                >
                  {formatCurrency(result.totalGrossProfit)} gross profit
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
                  <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(result.totalRevenue)}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">COGS</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(result.totalCogs)}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl bg-background border border-border/50 p-4 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">Gross Profit</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {formatCurrency(result.totalGrossProfit)}
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
                    {result.totalGrossMargin.toFixed(1)}%
                  </p>
                </motion.div>
              </div>

              {/* Visual Pie Chart Comparison */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <PieChart className="h-4.5 w-4.5 text-primary" />
                  COGS vs Gross Profit Breakdown
                </p>
                <div className="h-72 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Gross Profit', value: Math.max(0, result.totalGrossProfit), color: '#10b981' },
                          { name: 'COGS', value: Math.max(0, result.totalCogs), color: '#ef4444' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {[
                          { name: 'Gross Profit', value: Math.max(0, result.totalGrossProfit), color: '#10b981' },
                          { name: 'COGS', value: Math.max(0, result.totalCogs), color: '#ef4444' },
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

              {/* Product Breakdown Table (multi-product) */}
              {result.products.length > 1 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Product Breakdown</p>
                  <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/50 bg-muted/30 sticky top-0">
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
                            <th className="text-right px-4 py-3 font-medium text-muted-foreground">Revenue</th>
                            <th className="text-right px-4 py-3 font-medium text-muted-foreground">COGS</th>
                            <th className="text-right px-4 py-3 font-medium text-muted-foreground">Profit</th>
                            <th className="text-right px-4 py-3 font-medium text-muted-foreground">Margin</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {result.products.map((p) => (
                            <tr key={p.id}>
                              <td className="px-4 py-3 font-medium">{p.name}</td>
                              <td className="text-right px-4 py-3 text-muted-foreground">{formatCurrency(p.revenue)}</td>
                              <td className="text-right px-4 py-3 text-muted-foreground">{formatCurrency(p.cogs)}</td>
                              <td className="text-right px-4 py-3 text-emerald-600 font-medium">{formatCurrency(p.grossProfit)}</td>
                              <td className="text-right px-4 py-3 font-bold text-emerald-600">{p.grossMargin.toFixed(1)}%</td>
                            </tr>
                          ))}
                          <tr className="bg-emerald-500/5 font-bold">
                            <td className="px-4 py-3">Total</td>
                            <td className="text-right px-4 py-3">{formatCurrency(result.totalRevenue)}</td>
                            <td className="text-right px-4 py-3">{formatCurrency(result.totalCogs)}</td>
                            <td className="text-right px-4 py-3 text-emerald-600">{formatCurrency(result.totalGrossProfit)}</td>
                            <td className="text-right px-4 py-3 text-emerald-600">{result.totalGrossMargin.toFixed(1)}%</td>
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
                  <strong>Key insight:</strong> A gross margin of {result.totalGrossMargin.toFixed(1)}% means that for every{' '}
                  {formatCurrency(1)} in revenue, {formatCurrency(result.totalGrossMargin / 100)} remains after covering
                  direct costs. The remaining amount must cover all operating expenses, taxes, and profit.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ---- Comparison save buttons ---- */}
      {result && (
        <div className="flex flex-wrap gap-2 mt-4 px-1">
          <button
            onClick={() => setCompareA({ result, label: `${formatCurrency(result.totalRevenue)} rev · ${result.totalGrossMargin.toFixed(1)}% margin` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
          >
            {compareA ? '↺ Replace Scenario A' : '+ Save as Scenario A'}
          </button>
          <button
            onClick={() => setCompareB({ result, label: `${formatCurrency(result.totalRevenue)} rev · ${result.totalGrossMargin.toFixed(1)}% margin` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 transition-colors font-medium"
          >
            {compareB ? '↺ Replace Scenario B' : '+ Save as Scenario B'}
          </button>
        </div>
      )}

      {/* ---- Compare Panel ---- */}
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total Revenue',   valueA: formatCurrency(compareA.result.totalRevenue),   valueB: formatCurrency(compareB.result.totalRevenue),   numA: compareA.result.totalRevenue,   numB: compareB.result.totalRevenue },
          { label: 'Total COGS',      valueA: formatCurrency(compareA.result.totalCogs),      valueB: formatCurrency(compareB.result.totalCogs),      numA: compareA.result.totalCogs,      numB: compareB.result.totalCogs,      higherIsBetter: false },
          { label: 'Gross Profit',    valueA: formatCurrency(compareA.result.totalGrossProfit), valueB: formatCurrency(compareB.result.totalGrossProfit), numA: compareA.result.totalGrossProfit, numB: compareB.result.totalGrossProfit },
          { label: 'Gross Margin %',  valueA: `${compareA.result.totalGrossMargin.toFixed(2)}%`, valueB: `${compareB.result.totalGrossMargin.toFixed(2)}%`, numA: compareA.result.totalGrossMargin, numB: compareB.result.totalGrossMargin },
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
