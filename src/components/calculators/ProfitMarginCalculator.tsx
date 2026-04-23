'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Info, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
  };

  const health = result ? getMarginHealth(result.margin) : null;

  const howToSteps = [
    'Choose your calculation mode: "Cost & Selling Price" if you know the individual item cost and its selling price, or "Cost & Revenue" if you know total costs and total revenue for a batch or period.',
    'Enter the cost of your product or service. In cost/selling mode, this is the cost to produce or acquire one unit. In cost/revenue mode, this is your total cost of goods sold (COGS) or total expenses.',
    'Enter either the selling price per unit or your total revenue amount, depending on the mode you selected. This represents the amount your customers pay or your total income from sales.',
    'Click "Calculate" to instantly see your profit in dollars, profit margin as a percentage, and markup percentage. The visual health indicator will show whether your margin is low (under 10%), moderate (10-20%), or healthy (above 20%).',
  ];

  const formula = 'Profit Margin (%) = ((Selling Price − Cost) / Selling Price) × 100';
  const formulaDescription =
    'Profit margin measures how much of each dollar of revenue translates into profit. Markup, on the other hand, measures how much you add on top of the cost. While a 50% markup on a $100 cost yields a $50 profit and $150 selling price, the margin on that sale is 33.33% ($50 / $150). Understanding both metrics is essential for pricing strategy.';

  const faqs = [
    {
      question: "What is the difference between margin and markup?",
      answer:
        'Margin and markup are both profitability metrics, but they are calculated differently and serve different purposes. Margin is the percentage of the selling price that is profit, calculated as (Profit / Selling Price) × 100. Markup is the percentage added to the cost to get the selling price, calculated as (Profit / Cost) × 100. For example, if a product costs $60 and sells for $100, the margin is 40% but the markup is 66.67%. Confusing these two is one of the most common pricing mistakes businesses make.',
    },
    {
      question: 'What is a good profit margin for my business?',
      answer:
        'A good profit margin varies significantly by industry. Generally, a net profit margin of 10% is considered average, 20% is good, and 5% or below is low. Software companies and SaaS businesses often achieve margins of 60-80%, while grocery stores typically operate on thin margins of 1-3%. Retail businesses generally aim for margins between 20-50%. It is important to benchmark your margins against industry averages and competitors rather than aiming for a universal target.',
    },
    {
      question: 'How can I improve my profit margins?',
      answer:
        'There are two primary ways to improve profit margins: increase revenue per unit or decrease costs. You can raise prices if your product offers unique value, negotiate better deals with suppliers, reduce waste in production, improve operational efficiency, or focus on higher-margin products in your lineup. Additionally, analyzing which products or services generate the best margins and shifting resources toward them can significantly improve overall profitability. Avoid the trap of simply cutting quality to reduce costs, as this can harm long-term revenue.',
    },
    {
      question: 'What is the difference between gross margin and net margin?',
      answer:
        'Gross margin considers only the direct costs of producing goods or services (cost of goods sold), while net margin accounts for all business expenses including operating costs, taxes, interest, and depreciation. Gross margin shows the profitability of your core product or service before overhead, while net margin reveals the overall profitability of the entire business. For example, a company might have a healthy gross margin of 50% but a much lower net margin of 10% after accounting for rent, salaries, marketing, and other operating expenses.',
    },
    {
      question: 'What is a good profit margin for my industry?',
      answer:
        'Profit margins vary widely across industries and sub-sectors. Software and SaaS businesses typically see 60-80% gross margins, retail stores range from 20-50%, restaurants operate on tight 3-15% margins, grocery chains survive on 1-3%, manufacturing falls between 10-20%, and consulting firms average 30-50%. Always compare against your specific industry sub-sector and geographic region for the most accurate benchmarking, as local market conditions can significantly shift these averages.',
    },
    {
      question: 'How often should I calculate my profit margins?',
      answer:
        'You should calculate profit margins at least monthly for ongoing financial monitoring and early detection of trends. Calculate per-product or per-service margins when making pricing decisions or evaluating your product mix, and review overall business margins quarterly for a big-picture health check. Rapid or unexpected margin changes often signal cost issues, pricing problems, or shifts in demand that require immediate attention.',
    },
    {
      question: 'What causes declining profit margins?',
      answer:
        'Declining profit margins can result from rising material or labor costs that outpace price increases, increased competition forcing price cuts, growing overhead expenses such as rent and utilities, offering too many discounts or promotions, or a shift in your product mix toward lower-margin items. Identifying the root cause quickly is critical, as sustained margin erosion can threaten the viability of your business even if revenue continues to grow.',
    },
    {
      question: 'Should I use margin or markup for pricing?',
      answer:
        'Both metrics have their place: use margin to understand and communicate profitability (what percentage of your selling price is actual profit) and use markup to set prices from cost (what percentage to add on top of your cost). Many businesses use markup for day-to-day pricing decisions but track margin for financial reporting and investor presentations. Understanding both prevents common pricing mistakes, such as accidentally setting prices too low when confusing a desired margin with a markup percentage.',
    },
  ];

  return (
    <CalculatorLayout
      title="Profit Margin & Markup Calculator"
      description="Calculate your profit margin, markup percentage, and gross profit from cost and selling price or revenue."
      icon={<Percent className="h-7 w-7 text-white" />}
      breadcrumbs={[
        { label: 'Calculators' },
        { label: 'Profit Margin & Markup Calculator' },
      ]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Margin & Markup Formula' },
        { id: 'commission-structures', label: 'Margin vs Markup' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      howToSteps={howToSteps}
      formula={formula}
      formulaDescription={formulaDescription}
      commissionStructures={[
        {
          type: 'Margin',
          description: 'Measures profitability as a percentage of selling price. This tells you how many cents of profit you earn per dollar of revenue.',
          formula: 'Margin = (Profit ÷ Selling Price) × 100',
          example: 'Cost $40, sell for $80 → Profit $40 → Margin = ($40 ÷ $80) × 100 = 50%',
        },
        {
          type: 'Markup',
          description: 'Measures how much you add on top of cost to reach the selling price. This is useful for setting prices from a known cost base.',
          formula: 'Markup = (Profit ÷ Cost) × 100',
          example: 'Cost $40, sell for $80 → Profit $40 → Markup = ($40 ÷ $40) × 100 = 100%',
        },
      ]}
      workedExamples={[
        {
          title: 'Retail Product',
          description:
            'A retail product with a cost of $40 and a selling price of $80. Profit is $80 − $40 = $40. Profit margin is ($40 / $80) × 100 = 50%, meaning half of every dollar of revenue is profit. Markup is ($40 / $40) × 100 = 100%, meaning the price is doubled over cost. This is a healthy retail margin that provides room for discounts and promotions while remaining profitable.',
        },
        {
          title: 'Software Product',
          description:
            'A SaaS product with a delivery cost of $10/month per user and a selling price of $50/month. Profit is $40/month per user. Margin is ($40 / $50) × 100 = 80%, which is excellent for a software business. Markup is ($40 / $10) × 100 = 400%, reflecting the highly scalable nature of digital products where the cost to serve additional customers is minimal.',
        },
        {
          title: 'Food Service',
          description:
            'A restaurant dish with ingredient costs of $5 and a menu price of $12. Profit is $7 per dish. Margin is ($7 / $12) × 100 = 58.3%, which falls within the typical restaurant range. Markup is ($7 / $5) × 100 = 140%. While the margin looks healthy on food cost alone, restaurants must also factor in labor, rent, and overhead, which typically bring the net margin down to 3-15%.',
        },
      ]}
      faqs={faqs}
      relatedTools={[
        { slug: 'sales-commission', title: 'Sales Commission Calculator', description: 'Calculate commission on sales revenue', icon: 'DollarSign' },
        { slug: 'roi', title: 'ROI Calculator', description: 'Calculate return on investment', icon: 'BarChart3' },
        { slug: 'payroll', title: 'Payroll Calculator', description: 'Factor labor costs into pricing', icon: 'CreditCard' },
        { slug: 'salary-increase', title: 'Salary Increase Calculator', description: 'Calculate raise impact on payroll costs', icon: 'TrendingUp' },
        { slug: 'time-card', title: 'Time Card Calculator', description: 'Track labor hours for cost analysis', icon: 'Clock' },
        { slug: 'post-tax-bonus', title: 'Bonus Tax Calculator', description: 'Calculate net bonus after tax', icon: 'Gift' },
      ]}
    >
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
        <div className="flex items-center justify-between">
          <TryExample onClick={handleTryExample} />
          <Button
            onClick={handleCalculate}
            className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
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
    </CalculatorLayout>
  );
}
