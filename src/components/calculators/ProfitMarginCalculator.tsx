'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Info, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';

type CalcMode = 'cost-selling' | 'cost-revenue';

interface MarginResult {
  profit: number;
  margin: number;
  markup: number;
  cost: number;
  sellingPrice?: number;
  revenue?: number;
}

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function getMarginHealth(margin: number): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: React.ReactNode;
} {
  if (margin > 20) {
    return {
      label: 'Healthy',
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-600',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    };
  }
  if (margin >= 10) {
    return {
      label: 'Moderate',
      color: 'bg-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-600',
      icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
    };
  }
  return {
    label: 'Low',
    color: 'bg-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-600',
    icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
  };
}

function MarginBar({ margin }: { margin: number }) {
  const health = getMarginHealth(margin);
  const clampedMargin = Math.min(Math.max(margin, 0), 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">0%</span>
        <span className="text-muted-foreground">10%</span>
        <span className="text-muted-foreground">20%</span>
        <span className="text-muted-foreground">50%+</span>
      </div>
      <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
        {/* Zone backgrounds */}
        <div className="absolute inset-0 flex">
          <div className="w-[20%] bg-red-500/20" />
          <div className="w-[20%] bg-amber-500/20" />
          <div className="flex-1 bg-emerald-500/20" />
        </div>
        {/* Indicator */}
        <motion.div
          initial={{ left: '0%' }}
          animate={{ left: `${Math.min(clampedMargin, 98)}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white border-2 border-emerald-600 shadow-lg -translate-x-1/2 z-10"
        />
      </div>
    </div>
  );
}

export default function ProfitMarginCalculator() {
  const [mode, setMode] = useState<CalcMode>('cost-selling');

  // Cost + Selling Price mode
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  // Cost + Revenue mode
  const [revenueCost, setRevenueCost] = useState('');
  const [revenueAmount, setRevenueAmount] = useState('');

  const [result, setResult] = useState<MarginResult | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ mode: string; costPrice: string; sellingPrice: string; revenueCost: string; revenueAmount: string }>('profit-margin-calculator');

  // ---- Comparison state ----
  const [compareA, setCompareA] = useState<{ result: MarginResult; label: string } | null>(null);
  const [compareB, setCompareB] = useState<{ result: MarginResult; label: string } | null>(null);

  const handleTryExample = () => {
    if (mode === 'cost-selling') {
      setCostPrice('40');
      setSellingPrice('80');
    } else {
      setRevenueCost('5000');
      setRevenueAmount('12000');
    }
    setResult(null);
  };

  const handleCalculate = () => {
    setResult(null);

    if (mode === 'cost-selling') {
      const cost = parseFloat(costPrice);
      const selling = parseFloat(sellingPrice);

      if (isNaN(cost) || isNaN(selling) || cost < 0 || selling < 0) {
        return;
      }

      const profit = selling - cost;
      const margin = selling > 0 ? (profit / selling) * 100 : 0;
      const markup = cost > 0 ? (profit / cost) * 100 : 0;

      setResult({
        profit,
        margin,
        markup,
        cost,
        sellingPrice: selling,
      });
    } else {
      const cost = parseFloat(revenueCost);
      const revenue = parseFloat(revenueAmount);

      if (isNaN(cost) || isNaN(revenue) || cost < 0 || revenue < 0) {
        return;
      }

      const profit = revenue - cost;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
      const markup = cost > 0 ? (profit / cost) * 100 : 0;

      setResult({
        profit,
        margin,
        markup,
        cost,
        revenue,
      });
    }
    saveEntry(
      { mode, costPrice, sellingPrice, revenueCost, revenueAmount },
      `Margin ${result ? result.margin.toFixed(1) : '?'}% — ${formatCurrency(result?.profit ?? 0)} profit`
    );
  };

  const handleRestore = (inputs: { mode: string; costPrice: string; sellingPrice: string; revenueCost: string; revenueAmount: string }) => {
    setMode(inputs.mode as CalcMode);
    setCostPrice(inputs.costPrice);
    setSellingPrice(inputs.sellingPrice);
    setRevenueCost(inputs.revenueCost);
    setRevenueAmount(inputs.revenueAmount);
    setResult(null);
  };

  const health = result ? getMarginHealth(result.margin) : null;

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Mode Toggle */}
        <Tabs
          value={mode}
          onValueChange={(val) => {
            setMode(val as CalcMode);
            setResult(null);
          }}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="cost-selling" className="text-sm">
              <DollarSign className="h-3.5 w-3.5 mr-1.5" />
              Cost & Selling Price
            </TabsTrigger>
            <TabsTrigger value="cost-revenue" className="text-sm">
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              Cost & Revenue
            </TabsTrigger>
          </TabsList>

          {/* Cost + Selling Price Mode */}
          <TabsContent value="cost-selling" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPrice" className="text-sm font-medium">
                  <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
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
              </div>
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
                  placeholder="e.g., 99.99"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Cost + Revenue Mode */}
          <TabsContent value="cost-revenue" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="revCost" className="text-sm font-medium">
                  <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Total Cost ($)
                </Label>
                <Input
                  id="revCost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 5000.00"
                  value={revenueCost}
                  onChange={(e) => setRevenueCost(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Cost of goods sold or total expenses
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="revAmount" className="text-sm font-medium">
                  <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Revenue ($)
                </Label>
                <Input
                  id="revAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 12000.00"
                  value={revenueAmount}
                  onChange={(e) => setRevenueAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Total income from sales
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Calculate Button */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <Button
            onClick={handleCalculate}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            Calculate Profit Margin
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
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Profit Margin
              </p>
              <div className="flex items-center justify-center gap-3">
                <p className={`text-4xl font-bold ${health?.textColor}`}>
                  {result.margin.toFixed(2)}%
                </p>
                <Badge
                  variant="outline"
                  className={`${health?.bgColor} ${health?.borderColor} ${health?.textColor} px-3 py-1 text-sm font-medium`}
                >
                  {health?.icon}
                  <span className="ml-1.5">{health?.label}</span>
                </Badge>
              </div>
            </div>

            {/* Margin Health Bar */}
            <MarginBar margin={result.margin} />

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl bg-background border border-border/50 p-4 text-center"
              >
                <p className="text-xs text-muted-foreground mb-1">Profit</p>
                <p className="text-xl font-bold text-emerald-600">
                  {formatCurrency(result.profit)}
                </p>
                {result.profit < 0 && (
                  <p className="text-xs text-red-500 mt-0.5">Loss</p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl bg-background border border-border/50 p-4 text-center"
              >
                <p className="text-xs text-muted-foreground mb-1">
                  Profit Margin
                </p>
                <p className="text-xl font-bold">
                  {result.margin.toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">of selling price</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl bg-background border border-border/50 p-4 text-center"
              >
                <p className="text-xs text-muted-foreground mb-1">Markup</p>
                <p className="text-xl font-bold">
                  {result.markup.toFixed(2)}%
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">above cost</p>
              </motion.div>
            </div>

            {/* Profit vs Cost Pie Chart */}
            {result.profit >= 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <PieChartIcon className="h-4.5 w-4.5 text-primary" />
                  Cost vs Profit Breakdown
                </p>
                <div className="h-72 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Profit', value: Math.max(0, result.profit), color: '#10b981' },
                          { name: 'Cost', value: Math.max(0, result.cost), color: '#ef4444' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {[
                          { name: 'Profit', value: Math.max(0, result.profit), color: '#10b981' },
                          { name: 'Cost', value: Math.max(0, result.cost), color: '#ef4444' },
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
            )}

            {/* Detailed Breakdown */}
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Metric
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <tr>
                    <td className="px-4 py-3 font-medium">
                      {mode === 'cost-selling' ? 'Cost Price' : 'Total Cost'}
                    </td>
                    <td className="text-right px-4 py-3">
                      {formatCurrency(result.cost)}
                    </td>
                  </tr>
                  {mode === 'cost-selling' ? (
                    <tr>
                      <td className="px-4 py-3 font-medium">Selling Price</td>
                      <td className="text-right px-4 py-3">
                        {formatCurrency(result.sellingPrice!)}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="px-4 py-3 font-medium">Revenue</td>
                      <td className="text-right px-4 py-3">
                        {formatCurrency(result.revenue!)}
                      </td>
                    </tr>
                  )}
                  <tr className={result.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                    <td className="px-4 py-3 font-bold flex items-center gap-1.5">
                      {result.profit >= 0 ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5" />
                      )}
                      {result.profit >= 0 ? 'Gross Profit' : 'Net Loss'}
                    </td>
                    <td className="text-right px-4 py-3 font-bold">
                      {formatCurrency(result.profit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Formula Reminder */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="mb-1">
                  <strong>Margin vs Markup:</strong> Margin = (Profit / Selling Price) × 100 &nbsp;|&nbsp; Markup = (Profit / Cost) × 100
                </p>
                <p>
                  A {result.markup.toFixed(1)}% markup on {formatCurrency(result.cost)} cost produces a {result.margin.toFixed(1)}% margin.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ---- Comparison save buttons ---- */}
      {result && (
        <div className="flex flex-wrap gap-2 mt-4 px-1">
          <button
            onClick={() => setCompareA({ result, label: `${formatCurrency(result.cost)} cost · ${result.margin.toFixed(1)}% margin` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
          >
            {compareA ? '↺ Replace Scenario A' : '+ Save as Scenario A'}
          </button>
          <button
            onClick={() => setCompareB({ result, label: `${formatCurrency(result.cost)} cost · ${result.margin.toFixed(1)}% margin` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 transition-colors font-medium"
          >
            {compareB ? '↺ Replace Scenario B' : '+ Save as Scenario B'}
          </button>
        </div>
      )}

      {/* ---- Compare Panel ---- */}
      {compareA && compareB && (() => {
        const priceA = compareA.result.sellingPrice ?? compareA.result.revenue ?? 0;
        const priceB = compareB.result.sellingPrice ?? compareB.result.revenue ?? 0;
        const rows: CompareRow[] = [
          { label: 'Revenue / Price',  valueA: formatCurrency(priceA),                        valueB: formatCurrency(priceB),                        numA: priceA,                         numB: priceB },
          { label: 'Cost',             valueA: formatCurrency(compareA.result.cost),           valueB: formatCurrency(compareB.result.cost),           numA: compareA.result.cost,           numB: compareB.result.cost,           higherIsBetter: false },
          { label: 'Gross Profit',     valueA: formatCurrency(compareA.result.profit),         valueB: formatCurrency(compareB.result.profit),         numA: compareA.result.profit,         numB: compareB.result.profit },
          { label: 'Profit Margin %',  valueA: `${compareA.result.margin.toFixed(2)}%`,       valueB: `${compareB.result.margin.toFixed(2)}%`,       numA: compareA.result.margin,         numB: compareB.result.margin },
          { label: 'Markup %',         valueA: `${compareA.result.markup.toFixed(2)}%`,       valueB: `${compareB.result.markup.toFixed(2)}%`,       numA: compareA.result.markup,         numB: compareB.result.markup },
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
