'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Percent, Info, ArrowRightLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';

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
  const { history, saveEntry, clearHistory } = useCalcHistory<{ mode: string; costPrice: string; markupPct: string; sellingPrice: string }>('markup');

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

  // ------ SEO content ------

  const howToSteps = [
    'Select your calculation mode: "Cost to Selling Price" to calculate the final price from your cost and desired markup, or "Selling Price to Cost" to reverse-calculate the cost from a known price and markup.',
    'Enter the cost price — this is the amount you pay to produce or purchase the product, including materials, direct labor, and manufacturing overhead.',
    'Enter your desired markup percentage. This is the percentage added ON TOP of your cost to determine the selling price. For example, a 50% markup on a $100 cost gives a $150 selling price.',
    'Click "Calculate" to see your selling price, gross profit per unit, and the equivalent gross margin percentage.',
    'Use the quick reference table below the results to compare common markup rates and their corresponding margin percentages.',
  ];

  const formula = 'Selling Price = Cost × (1 + Markup% / 100)';
  const formulaDescription =
    'Markup is the amount added to the cost price of a product to arrive at the selling price. It is always expressed as a percentage of the cost, not the selling price. For example, if a product costs $40 and you apply a 50% markup, the selling price is $40 × (1 + 0.50) = $60. Your gross profit per unit is $20. The equivalent gross margin is 33.3% ($20 / $60). This distinction from margin is crucial: markup is calculated on cost, while margin is calculated on revenue. As markup increases, the gap between markup % and margin % grows wider. A 100% markup equals a 50% margin, and a 300% markup equals a 75% margin.';

  const workedExamples = [
    {
      title: 'Retail Clothing: $25 Cost with 60% Markup',
      description:
        'A clothing retailer purchases a shirt for $25 and applies a 60% markup. Selling Price = $25 × 1.60 = $40. Gross Profit = $40 - $25 = $15 per shirt. Gross Margin = ($15 / $40) × 100 = 37.5%. Note that while the markup is 60%, the margin is only 37.5% because margin is calculated on the higher selling price.',
    },
    {
      title: 'Electronics Store: $200 Cost with 25% Markup',
      description:
        'An electronics retailer buys a speaker at wholesale for $200 and applies a 25% markup. Selling Price = $200 × 1.25 = $250. Gross Profit = $50 per unit. Gross Margin = ($50 / $250) × 100 = 20%. The 25% markup translates to a 20% gross margin, leaving room for operating expenses but requiring volume to cover fixed costs.',
    },
    {
      title: 'Restaurant Food Cost: $8 Cost with 300% Markup',
      description:
        'A restaurant\'s food cost for a pasta dish is $8 (ingredients only). The restaurant applies a 300% markup to cover labor, rent, and other expenses. Selling Price = $8 × 4.00 = $32. Gross Profit = $24 per dish. Gross Margin = ($24 / $32) × 100 = 75%. While this seems high, restaurants typically have high operating expenses (rent, labor, utilities) that consume most of this gross profit.',
    },
  ];

  const faqs = [
    {
      question: 'What is markup?',
      answer:
        'Markup is the difference between the selling price of a product and its cost, expressed as a percentage of the cost. It represents how much you add to the cost to determine your selling price. For example, if a product costs $50 and you sell it for $75, the markup is ($75 - $50) / $50 × 100 = 50%. Markup is used by businesses to ensure they cover costs and make a profit. It is one of the simplest and most common pricing strategies, particularly in retail, wholesale, and manufacturing.',
    },
    {
      question: 'What is the difference between markup and margin?',
      answer:
        'The key difference lies in the base used for calculation. Markup is calculated on the cost price: (Selling Price - Cost) / Cost × 100%. Margin is calculated on the selling price: (Selling Price - Cost) / Selling Price × 100%. For a product costing $60 and selling for $100: Markup = ($100 - $60) / $60 = 66.7%. Margin = ($100 - $60) / $100 = 40%. The markup percentage is always higher than the margin percentage. This difference is important when setting prices — using markup when you mean margin (or vice versa) can lead to significantly different pricing outcomes and profit levels.',
    },
    {
      question: 'What are common markup rates by industry?',
      answer:
        'Markup rates vary widely by industry. Grocery stores typically use 15-25% markup on most items. Clothing retail applies 50-100% markup. Electronics retail uses 20-40% markup. Restaurants use 200-400% markup on food and 300-500% on beverages (to account for high operating costs). Jewelry often has 50-300% markup. Furniture stores use 40-100% markup. Pharmaceuticals can have 200-5,000% markup on generic drugs. Construction contractors typically use 10-20% markup. Understanding your industry\'s standard markup helps you set competitive yet profitable prices.',
    },
    {
      question: 'How do I determine the right markup for my product?',
      answer:
        'The right markup depends on several factors: (1) Industry standards — research what competitors charge and what margins they operate on. (2) Your cost structure — include all direct costs (materials, labor, shipping) plus a share of indirect costs (rent, marketing, admin). (3) Perceived value — premium or unique products can command higher markups. (4) Volume goals — lower markups can drive higher sales volume. (5) Target profit — work backward from your desired net profit to determine the required markup. Many businesses start with their industry\'s average markup and adjust based on their unique costs, competitive position, and profit goals.',
    },
    {
      question: 'What is keystone pricing?',
      answer:
        'Keystone pricing is a retail pricing strategy where the selling price is exactly double the cost — a 100% markup (which equals a 50% gross margin). The term comes from the idea that this markup is the "keystone" of retail pricing. For example, a product purchased at wholesale for $50 would be sold for $100. This strategy is common in retail, especially for apparel, accessories, gift items, and home goods. Many retailers consider keystone pricing their baseline and may adjust up or down based on demand, competition, and brand positioning. While simple, it doesn\'t account for varying cost structures across different product categories.',
    },
    {
      question: 'What is cost-plus pricing?',
      answer:
        'Cost-plus pricing (also called markup pricing) is a strategy where you add a fixed markup percentage to the total cost of producing a product. The formula is: Selling Price = Total Cost × (1 + Markup%). It is the simplest pricing method and ensures every unit sold is profitable. However, it has limitations: it doesn\'t consider competitor pricing, customer willingness to pay, or perceived value. Cost-plus works best for custom orders, government contracts, commodities, and industries where costs are relatively stable. For consumer-facing businesses, value-based pricing (setting prices based on what customers are willing to pay) often leads to higher profits than pure cost-plus pricing.',
    },
  ];

  const relatedTools = [
    { slug: 'profit-margin', title: 'Profit Margin Calculator', description: 'Calculate profit margin and markup from cost and selling price', icon: 'Percent' },
    { slug: 'gross-margin', title: 'Gross Margin Calculator', description: 'Calculate gross margin and COGS from revenue and costs', icon: 'PieChart' },
    { slug: 'discount', title: 'Discount Calculator', description: 'Calculate sale prices and savings from discounts', icon: 'Tag' },
    { slug: 'roi', title: 'ROI Calculator', description: 'Evaluate the return on investment for decisions', icon: 'BarChart3' },
    { slug: 'sales-commission', title: 'Sales Commission Calculator', description: 'Calculate commission earnings from sales', icon: 'DollarSign' },
  ];

  return (
    <CalculatorLayout
      title="Markup Calculator"
      description="Calculate selling price from cost and desired markup percentage, with margin vs markup comparison and quick reference tables."
      icon={<Package className="h-7 w-7 text-white" />}
      breadcrumbs={[{ label: 'Calculators' }, { label: 'Markup Calculator' }]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      howToSteps={howToSteps}
      formula={formula}
      formulaDescription={formulaDescription}
      workedExamples={workedExamples}
      faqs={faqs}
      relatedTools={relatedTools}
    >
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
        <div className="flex gap-3">
          <Button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
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
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} />
    </CalculatorLayout>
  );
}
