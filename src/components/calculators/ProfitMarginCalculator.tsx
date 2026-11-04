'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Percent,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  PieChart as PieChartIcon,
  Target,
  BookmarkPlus,
  Package,
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';

type CalcMode = 'cost-selling' | 'target-margin' | 'cost-revenue';

interface MarginResult {
  profit: number;
  totalProfit: number;
  margin: number;
  markup: number;
  cost: number;
  sellingPrice: number;
  units: number;
  totalRevenue: number;
  totalCost: number;
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
  if (margin >= 25) {
    return {
      label: 'Healthy Margin',
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-600',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    };
  }
  if (margin >= 10) {
    return {
      label: 'Moderate Margin',
      color: 'bg-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-600',
      icon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
    };
  }
  return {
    label: 'Low / Tight Margin',
    color: 'bg-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-600',
    icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
  };
}

function MarginBar({ margin }: { margin: number }) {
  const clampedMargin = Math.min(Math.max(margin, 0), 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">0%</span>
        <span className="text-muted-foreground">10% (Tight)</span>
        <span className="text-muted-foreground">25% (Healthy)</span>
        <span className="text-muted-foreground">50%+ (High)</span>
      </div>
      <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="w-[15%] bg-red-500/25" />
          <div className="w-[20%] bg-amber-500/25" />
          <div className="flex-1 bg-emerald-500/25" />
        </div>
        <motion.div
          initial={{ left: '0%' }}
          animate={{ left: `${Math.min(clampedMargin, 98)}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white border-2 border-emerald-600 shadow-lg -translate-x-1/2 z-10"
        />
      </div>
    </div>
  );
}

const TARGET_MARGIN_PRESETS = ['20', '30', '40', '50', '60', '75'];

export default function ProfitMarginCalculator() {
  const [mode, setMode] = useState<CalcMode>('cost-selling');

  // Cost + Selling Price mode (pre-loaded for instant live results)
  const [costPrice, setCostPrice] = useState('60');
  const [sellingPrice, setSellingPrice] = useState('100');
  const [unitsSold, setUnitsSold] = useState('1');

  // Target Margin (Reverse Pricing) mode
  const [targetCost, setTargetCost] = useState('60');
  const [desiredMargin, setDesiredMargin] = useState('40');

  // Cost + Revenue mode
  const [revenueCost, setRevenueCost] = useState('5000');
  const [revenueAmount, setRevenueAmount] = useState('12000');

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    mode: string;
    costPrice: string;
    sellingPrice: string;
    unitsSold?: string;
    targetCost?: string;
    desiredMargin?: string;
    revenueCost: string;
    revenueAmount: string;
  }>('profit-margin-calculator');

  // Comparison state
  const [compareA, setCompareA] = useState<{ result: MarginResult; label: string } | null>(null);
  const [compareB, setCompareB] = useState<{ result: MarginResult; label: string } | null>(null);

  // Instant real-time calculation
  const result = useMemo<MarginResult | null>(() => {
    if (mode === 'cost-selling') {
      const cost = parseFloat(costPrice);
      const selling = parseFloat(sellingPrice);
      const qty = Math.max(1, parseFloat(unitsSold || '1') || 1);

      if (isNaN(cost) || isNaN(selling) || cost < 0 || selling <= 0) {
        return null;
      }

      const profit = selling - cost;
      const margin = (profit / selling) * 100;
      const markup = cost > 0 ? (profit / cost) * 100 : 0;

      return {
        profit,
        totalProfit: profit * qty,
        margin,
        markup,
        cost,
        sellingPrice: selling,
        units: qty,
        totalRevenue: selling * qty,
        totalCost: cost * qty,
      };
    }

    if (mode === 'target-margin') {
      const cost = parseFloat(targetCost);
      const targetM = parseFloat(desiredMargin);

      if (isNaN(cost) || isNaN(targetM) || cost < 0 || targetM <= -100 || targetM >= 100) {
        return null;
      }

      const selling = cost / (1 - targetM / 100);
      const profit = selling - cost;
      const markup = cost > 0 ? (profit / cost) * 100 : 0;

      return {
        profit,
        totalProfit: profit,
        margin: targetM,
        markup,
        cost,
        sellingPrice: selling,
        units: 1,
        totalRevenue: selling,
        totalCost: cost,
      };
    }

    // cost-revenue mode
    const cost = parseFloat(revenueCost);
    const revenue = parseFloat(revenueAmount);

    if (isNaN(cost) || isNaN(revenue) || cost < 0 || revenue <= 0) {
      return null;
    }

    const profit = revenue - cost;
    const margin = (profit / revenue) * 100;
    const markup = cost > 0 ? (profit / cost) * 100 : 0;

    return {
      profit,
      totalProfit: profit,
      margin,
      markup,
      cost,
      sellingPrice: revenue,
      units: 1,
      totalRevenue: revenue,
      totalCost: cost,
    };
  }, [mode, costPrice, sellingPrice, unitsSold, targetCost, desiredMargin, revenueCost, revenueAmount]);

  const handleTryExample = () => {
    if (mode === 'cost-selling') {
      setCostPrice('42');
      setSellingPrice('95');
      setUnitsSold('100');
    } else if (mode === 'target-margin') {
      setTargetCost('45');
      setDesiredMargin('55');
    } else {
      setRevenueCost('18500');
      setRevenueAmount('42000');
    }
  };

  const handleSaveSnapshot = () => {
    if (!result) return;
    saveEntry(
      {
        mode,
        costPrice,
        sellingPrice,
        unitsSold,
        targetCost,
        desiredMargin,
        revenueCost,
        revenueAmount,
      },
      `Margin ${result.margin.toFixed(1)}% (Markup ${result.markup.toFixed(1)}%) — ${formatCurrency(result.totalProfit)} profit`
    );
  };

  const handleRestore = (inputs: {
    mode: string;
    costPrice: string;
    sellingPrice: string;
    unitsSold?: string;
    targetCost?: string;
    desiredMargin?: string;
    revenueCost: string;
    revenueAmount: string;
  }) => {
    setMode((inputs.mode as CalcMode) || 'cost-selling');
    setCostPrice(inputs.costPrice || '60');
    setSellingPrice(inputs.sellingPrice || '100');
    setUnitsSold(inputs.unitsSold || '1');
    setTargetCost(inputs.targetCost || '60');
    setDesiredMargin(inputs.desiredMargin || '40');
    setRevenueCost(inputs.revenueCost || '5000');
    setRevenueAmount(inputs.revenueAmount || '12000');
  };

  const health = result ? getMarginHealth(result.margin) : null;

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* 3-Way Bi-Directional Mode Toggle */}
        <Tabs value={mode} onValueChange={(val) => setMode(val as CalcMode)} className="w-full">
          <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 h-auto gap-1 p-1">
            <TabsTrigger value="cost-selling" className="text-xs sm:text-sm py-2">
              <DollarSign className="h-3.5 w-3.5 mr-1" />
              Unit Cost &amp; Price
            </TabsTrigger>
            <TabsTrigger value="target-margin" className="text-xs sm:text-sm py-2">
              <Target className="h-3.5 w-3.5 mr-1" />
              Target Margin Pricing
            </TabsTrigger>
            <TabsTrigger value="cost-revenue" className="text-xs sm:text-sm py-2">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              Total Cost &amp; Revenue
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Cost + Selling Price + Units */}
          <TabsContent value="cost-selling" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPrice" className="text-sm font-medium">
                  <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Unit Cost Price ($)
                </Label>
                <Input
                  id="costPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 60.00"
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
                  placeholder="e.g., 100.00"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitsSold" className="text-sm font-medium">
                  <Package className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Quantity / Units Sold
                </Label>
                <Input
                  id="unitsSold"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  value={unitsSold}
                  onChange={(e) => setUnitsSold(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Reverse Calculator — Cost + Desired Margin % -> Selling Price */}
          <TabsContent value="target-margin" className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Target Margin Presets:</span>
              {TARGET_MARGIN_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDesiredMargin(preset)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    desiredMargin === preset
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                  }`}
                >
                  {preset}% Margin
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetCost" className="text-sm font-medium">
                  <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Unit Cost ($)
                </Label>
                <Input
                  id="targetCost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 60.00"
                  value={targetCost}
                  onChange={(e) => setTargetCost(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desiredMargin" className="text-sm font-medium">
                  <Percent className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Desired Profit Margin (%)
                </Label>
                <Input
                  id="desiredMargin"
                  type="number"
                  min="0"
                  max="99.9"
                  step="0.5"
                  placeholder="e.g., 40"
                  value={desiredMargin}
                  onChange={(e) => setDesiredMargin(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Calculates the exact selling price needed to hit your target margin.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Cost + Revenue Mode */}
          <TabsContent value="cost-revenue" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="revCost" className="text-sm font-medium">
                  <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Total Cost / COGS ($)
                </Label>
                <Input
                  id="revCost"
                  type="number"
                  min="0"
                  step="10"
                  placeholder="e.g., 5000.00"
                  value={revenueCost}
                  onChange={(e) => setRevenueCost(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Cost of goods sold or total business expenses</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="revAmount" className="text-sm font-medium">
                  <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  Total Revenue ($)
                </Label>
                <Input
                  id="revAmount"
                  type="number"
                  min="0"
                  step="10"
                  placeholder="e.g., 12000.00"
                  value={revenueAmount}
                  onChange={(e) => setRevenueAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Total gross sales revenue</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <Button
            onClick={handleSaveSnapshot}
            disabled={!result}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Save Calculation to History
          </Button>
        </div>
      </div>

      {/* Live Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="result-display mt-2 px-4 sm:px-6"
          aria-live="polite"
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 space-y-6">
            {/* Main Headline */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                {mode === 'target-margin' ? 'Required Selling Price' : 'Profit Margin'}
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <p className={`text-4xl sm:text-5xl font-extrabold ${health?.textColor}`} data-result-primary>
                  {mode === 'target-margin'
                    ? formatCurrency(result.sellingPrice)
                    : `${result.margin.toFixed(2)}%`}
                </p>
                <Badge
                  variant="outline"
                  className={`${health?.bgColor} ${health?.borderColor} ${health?.textColor} px-3 py-1 text-sm font-medium`}
                >
                  {health?.icon}
                  <span className="ml-1.5">{health?.label}</span>
                </Badge>
              </div>
              {mode === 'target-margin' && (
                <p className="text-xs text-muted-foreground">
                  Charging <strong>{formatCurrency(result.sellingPrice)}</strong> on a{' '}
                  <strong>{formatCurrency(result.cost)}</strong> cost yields a{' '}
                  <strong>{result.margin.toFixed(2)}% margin</strong> ({formatCurrency(result.profit)} profit per unit).
                </p>
              )}
            </div>

            {/* Margin Health Bar */}
            <MarginBar margin={result.margin} />

            {/* Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-background border border-border/50 p-3.5 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {result.units > 1 ? `Total Profit (${result.units} units)` : 'Gross Profit'}
                </p>
                <p className="text-lg sm:text-xl font-bold text-emerald-600">
                  {formatCurrency(result.totalProfit)}
                </p>
                {result.units > 1 && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formatCurrency(result.profit)} / unit
                  </p>
                )}
              </div>
              <div className="rounded-xl bg-background border border-border/50 p-3.5 text-center">
                <p className="text-xs text-muted-foreground mb-1">Profit Margin</p>
                <p className="text-lg sm:text-xl font-bold">{result.margin.toFixed(2)}%</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">% of selling price</p>
              </div>
              <div className="rounded-xl bg-background border border-border/50 p-3.5 text-center">
                <p className="text-xs text-muted-foreground mb-1">Markup</p>
                <p className="text-lg sm:text-xl font-bold">{result.markup.toFixed(2)}%</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">% above cost</p>
              </div>
              <div className="rounded-xl bg-background border border-border/50 p-3.5 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {mode === 'cost-revenue' ? 'Total Revenue' : 'Selling Price'}
                </p>
                <p className="text-lg sm:text-xl font-bold text-blue-600">
                  {formatCurrency(result.sellingPrice)}
                </p>
                {result.units > 1 && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formatCurrency(result.totalRevenue)} total rev
                  </p>
                )}
              </div>
            </div>

            {/* Profit vs Cost Pie Chart */}
            {result.profit >= 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-primary" />
                  Revenue Split: Cost vs. Profit
                </p>
                <div className="h-64 w-full rounded-xl bg-background border border-border/50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Profit', value: Math.max(0, result.totalProfit), color: '#10b981' },
                          { name: 'Cost', value: Math.max(0, result.totalCost), color: '#ef4444' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {[
                          { name: 'Profit', value: Math.max(0, result.totalProfit), color: '#10b981' },
                          { name: 'Cost', value: Math.max(0, result.totalCost), color: '#ef4444' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number) => [`${formatCurrency(value)}`, undefined]}
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* What-If Price Sensitivity Table (Beats OmniCalculator) */}
            {result.sellingPrice > 0 && (
              <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-border/50 bg-muted/40 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    What-If Price Sensitivity Table (Holding Cost at {formatCurrency(result.cost)})
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="text-left px-4 py-2 font-medium text-muted-foreground text-xs">Price Change</th>
                        <th className="text-right px-4 py-2 font-medium text-muted-foreground text-xs">Selling Price</th>
                        <th className="text-right px-4 py-2 font-medium text-muted-foreground text-xs">Profit</th>
                        <th className="text-right px-4 py-2 font-medium text-muted-foreground text-xs">Margin %</th>
                        <th className="text-right px-4 py-2 font-medium text-muted-foreground text-xs">Markup %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {[-15, -10, -5, 0, 5, 10, 15, 20].map((pctDelta) => {
                        const simPrice = result.sellingPrice * (1 + pctDelta / 100);
                        const simProfit = simPrice - result.cost;
                        const simMargin = simPrice > 0 ? (simProfit / simPrice) * 100 : 0;
                        const simMarkup = result.cost > 0 ? (simProfit / result.cost) * 100 : 0;
                        const isCurrent = pctDelta === 0;
                        return (
                          <tr
                            key={pctDelta}
                            className={isCurrent ? 'bg-emerald-500/10 font-semibold' : 'hover:bg-muted/20'}
                          >
                            <td className="px-4 py-2">
                              {pctDelta === 0 ? 'Current Price' : `${pctDelta > 0 ? '+' : ''}${pctDelta}%`}
                            </td>
                            <td className="text-right px-4 py-2">{formatCurrency(simPrice)}</td>
                            <td
                              className={`text-right px-4 py-2 ${
                                simProfit >= 0 ? 'text-emerald-600' : 'text-red-500'
                              }`}
                            >
                              {formatCurrency(simProfit)}
                            </td>
                            <td className="text-right px-4 py-2">{simMargin.toFixed(1)}%</td>
                            <td className="text-right px-4 py-2 text-muted-foreground">{simMarkup.toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Formula Reminder */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="mb-1">
                  <strong>Margin vs. Markup:</strong> Margin = (Profit ÷ Selling Price) × 100 &nbsp;|&nbsp; Markup = (Profit ÷ Cost) × 100
                </p>
                <p>
                  A <strong>{result.markup.toFixed(1)}% markup</strong> on {formatCurrency(result.cost)} cost equals a{' '}
                  <strong>{result.margin.toFixed(1)}% profit margin</strong> on {formatCurrency(result.sellingPrice)} revenue.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Comparison save buttons */}
      {result && (
        <div className="flex flex-wrap gap-2 mt-4 px-4 sm:px-6">
          <button
            onClick={() =>
              setCompareA({
                result,
                label: `${formatCurrency(result.cost)} cost · ${result.margin.toFixed(1)}% margin`,
              })
            }
            className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
          >
            {compareA ? '↺ Replace Scenario A' : '+ Save as Scenario A'}
          </button>
          <button
            onClick={() =>
              setCompareB({
                result,
                label: `${formatCurrency(result.cost)} cost · ${result.margin.toFixed(1)}% margin`,
              })
            }
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 transition-colors font-medium"
          >
            {compareB ? '↺ Replace Scenario B' : '+ Save as Scenario B'}
          </button>
        </div>
      )}

      {/* Compare Panel */}
      {compareA &&
        compareB &&
        (() => {
          const rows: CompareRow[] = [
            {
              label: 'Selling Price / Revenue',
              valueA: formatCurrency(compareA.result.sellingPrice),
              valueB: formatCurrency(compareB.result.sellingPrice),
              numA: compareA.result.sellingPrice,
              numB: compareB.result.sellingPrice,
            },
            {
              label: 'Cost',
              valueA: formatCurrency(compareA.result.cost),
              valueB: formatCurrency(compareB.result.cost),
              numA: compareA.result.cost,
              numB: compareB.result.cost,
              higherIsBetter: false,
            },
            {
              label: 'Gross Profit',
              valueA: formatCurrency(compareA.result.profit),
              valueB: formatCurrency(compareB.result.profit),
              numA: compareA.result.profit,
              numB: compareB.result.profit,
            },
            {
              label: 'Profit Margin %',
              valueA: `${compareA.result.margin.toFixed(2)}%`,
              valueB: `${compareB.result.margin.toFixed(2)}%`,
              numA: compareA.result.margin,
              numB: compareB.result.margin,
            },
            {
              label: 'Markup %',
              valueA: `${compareA.result.markup.toFixed(2)}%`,
              valueB: `${compareB.result.markup.toFixed(2)}%`,
              numA: compareA.result.markup,
              numB: compareB.result.markup,
            },
          ];
          return (
            <div className="px-4 sm:px-6">
              <ComparePanel
                rows={rows}
                labelA={compareA.label}
                labelB={compareB.label}
                onClear={() => {
                  setCompareA(null);
                  setCompareB(null);
                }}
                onSwap={() => {
                  const tmp = compareA;
                  setCompareA(compareB);
                  setCompareB(tmp);
                }}
              />
            </div>
          );
        })()}

      {history.length > 0 && (
        <div className="mt-6 px-4 sm:px-6 pb-4">
          <CalcHistoryPanel
            history={history}
            onRestore={handleRestore}
            onClear={clearHistory}
            onDelete={deleteEntry}
          />
        </div>
      )}
    </div>
  );
}
