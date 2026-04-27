'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ArrowRight, DollarSign, TrendingUp, Clock, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import TryExample from './TryExample';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';

interface ROIResult {
  initialInvestment: number;
  additionalContributions: number;
  totalInvested: number;
  finalValue: number;
  totalProfit: number;
  roi: number;
  annualizedROI: number;
  years: number;
}

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const formatPercent = (value: number): string => value.toFixed(2) + '%';

function getHealthLabel(roi: number): {
  label: string;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
} {
  if (roi > 15) {
    return {
      label: 'Excellent',
      color: 'green',
      bgClass: 'bg-green-50/50 dark:bg-green-950/20',
      borderClass: 'border-green-200/60 dark:border-green-900/40',
      textClass: 'text-green-700 dark:text-green-300',
    };
  }
  if (roi >= 5) {
    return {
      label: 'Good',
      color: 'yellow',
      bgClass: 'bg-yellow-50/50 dark:bg-yellow-950/20',
      borderClass: 'border-yellow-200/60 dark:border-yellow-900/40',
      textClass: 'text-yellow-700 dark:text-yellow-300',
    };
  }
  if (roi >= 0) {
    return {
      label: 'Moderate',
      color: 'blue',
      bgClass: 'bg-blue-50/50 dark:bg-blue-950/20',
      borderClass: 'border-blue-200/60 dark:border-blue-900/40',
      textClass: 'text-blue-700 dark:text-blue-300',
    };
  }
  return {
    label: 'Loss',
    color: 'red',
    bgClass: 'bg-red-50/50 dark:bg-red-950/20',
    borderClass: 'border-red-200/60 dark:border-red-900/40',
    textClass: 'text-red-700 dark:text-red-300',
  };
}

export default function ROICalculator() {
  const [initialInvestment, setInitialInvestment] = useState<string>('10000');
  const [finalValue, setFinalValue] = useState<string>('15000');
  const [duration, setDuration] = useState<string>('5');
  const [additionalContributions, setAdditionalContributions] = useState<string>('0');
  const [result, setResult] = useState<ROIResult | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ initialInvestment: string; finalValue: string; duration: string; additionalContributions: string }>('roi-calculator');

  // ---- Comparison state ----
  const [compareA, setCompareA] = useState<{ result: ROIResult; label: string } | null>(null);
  const [compareB, setCompareB] = useState<{ result: ROIResult; label: string } | null>(null);

  const handleTryExample = () => {
    setInitialInvestment('10000');
    setFinalValue('15000');
    setDuration('5');
    setAdditionalContributions('0');
    setResult(null);
  };

  const handleCalculate = () => {
    const initial = parseFloat(initialInvestment) || 0;
    const final = parseFloat(finalValue) || 0;
    const years = parseFloat(duration) || 0;
    const additional = parseFloat(additionalContributions) || 0;

    if (initial <= 0 || final <= 0 || years <= 0) {
      setResult(null);
      return;
    }

    const totalCost = initial + additional;
    const totalProfit = final - totalCost;
    const roi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    let annualizedROI = 0;
    if (totalCost > 0 && final > 0 && years > 0) {
      annualizedROI = (Math.pow(final / totalCost, 1 / years) - 1) * 100;
    }

    setResult({
      initialInvestment: initial,
      additionalContributions: additional,
      totalInvested: totalCost,
      finalValue: final,
      totalProfit,
      roi,
      annualizedROI,
      years,
    });
    saveEntry(
      { initialInvestment, finalValue, duration, additionalContributions },
      `ROI ${roi.toFixed(1)}% (${formatCurrency(totalProfit)} profit on ${formatCurrency(totalCost)} invested)`
    );
  };

  const handleRestore = (inputs: { initialInvestment: string; finalValue: string; duration: string; additionalContributions: string }) => {
    setInitialInvestment(inputs.initialInvestment);
    setFinalValue(inputs.finalValue);
    setDuration(inputs.duration);
    setAdditionalContributions(inputs.additionalContributions);
    setResult(null);
  };

  const health = result ? getHealthLabel(result.roi) : null;

  return (
    <CalculatorLayout
      title="ROI Calculator"
      description="Calculate your Return on Investment with annualized returns. Analyze the performance of stocks, real estate, business ventures, or any investment over time."
      icon={<BarChart3 className="h-7 w-7 text-white" />}
      breadcrumbs={[
        { label: 'Calculators' },
        { label: 'ROI Calculator' },
      ]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'ROI Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      workedExamples={[
        {
          title: 'Stock Investment',
          description:
            'You invested $10,000 in stocks. After 2 years, the portfolio is worth $13,000. Your profit is $3,000, giving a total ROI of 30%. The annualized ROI is 14.02%, meaning your investment grew at an equivalent rate of about 14% per year on a compound basis.',
        },
        {
          title: 'Marketing Campaign',
          description:
            'A marketing campaign cost $5,000 in labor plus $2,000 in ad spend, totaling $7,000 invested. It generated $12,000 in revenue. The profit is $5,000, yielding an ROI of 71.43% ($5,000 profit on $7,000 invested).',
        },
        {
          title: 'Real Estate Investment',
          description:
            'You put a $50,000 down payment on a property and sold it 5 years later, netting $80,000 after all costs. Your profit is $30,000, for a total ROI of 60%. The annualized ROI is 9.86%, reflecting the compound annual growth rate over the 5-year holding period.',
        },
      ]}
      relatedTools={[
        { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Calculate profit margins on sales', icon: 'Percent' },
        { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Calculate commission costs vs revenue', icon: 'DollarSign' },
        { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Factor labor costs into ROI', icon: 'CreditCard' },
        { slug: 'salary-increase-calculator', title: 'Salary Increase Calculator', description: 'Evaluate ROI of career growth', icon: 'TrendingUp' },
        { slug: 'time-card-calculator', title: 'Time Card Calculator', description: 'Track hours for project ROI', icon: 'Clock' },
        { slug: 'bonus-tax-calculator', title: 'Bonus Tax Calculator', description: 'Calculate net returns after tax', icon: 'Gift' },
      ]}
      howToSteps={[
        'Enter your Initial Investment amount — the original capital you put into the investment at the start.',
        'Enter the Final Value — the total amount the investment is worth now, including your original capital and all gains.',
        'Optionally, enter any Additional Contributions you made during the investment period (beyond the initial investment).',
        'Specify the Investment Duration in years to calculate the annualized return rate.',
        'Click "Calculate ROI" to see your total profit, overall ROI percentage, annualized return, and a visual investment health assessment.',
      ]}
      formula="ROI (%) = ((Final Value - Cost) / Cost) × 100"
      formulaDescription="ROI measures the profitability of an investment as a percentage of the total cost. The annualized ROI formula accounts for the time period, allowing you to compare investments of different durations on equal footing: Annualized ROI = ((Final Value / Cost)^(1/n) - 1) × 100, where n is the number of years."
      faqs={[
        {
          question: 'What is a good ROI?',
          answer:
            'A "good" ROI depends on the investment type and risk level. For the stock market, the S&P 500 historically returns about 10% annually before inflation, so an annualized ROI above 10% is generally considered strong. Real estate investments typically target 8-12% annual returns. For startup investments or venture capital, investors often look for 25%+ annual returns to compensate for the higher risk. Always compare your ROI against benchmarks relevant to your specific investment category.',
        },
        {
          question: 'How is ROI different from profit?',
          answer:
            'Profit is an absolute dollar amount — the difference between what you invested and what you received. ROI expresses that profit as a percentage of the total cost, making it easy to compare investments of different sizes. For example, a $1,000 profit on a $2,000 investment (50% ROI) is proportionally much better than a $1,000 profit on a $50,000 investment (2% ROI), even though the dollar profit is the same.',
        },
        {
          question: 'What is annualized ROI?',
          answer:
            'Annualized ROI converts your total return into an equivalent yearly rate, allowing you to compare investments held for different periods. For instance, a 30% return over 3 years is equivalent to roughly 9.14% per year. The formula uses compound growth: Annualized ROI = ((Final Value / Cost)^(1/years) - 1) × 100. This is sometimes called Compound Annual Growth Rate (CAGR) and gives a more accurate picture of long-term investment performance.',
        },
        {
          question: 'How does ROI account for time?',
          answer:
            'Basic ROI does not account for time — a 50% return over 1 year and a 50% return over 10 years both show the same ROI. That is why annualized ROI is important. Annualized ROI normalizes returns to a per-year basis using compound growth calculations, enabling apples-to-apples comparisons across investments with different holding periods. This metric reveals the true efficiency of capital deployment over time.',
        },
        {
          question: 'What is considered a good ROI?',
          answer:
            'A good ROI depends on the investment type and risk level. Stock market long-term average is 7-10% annualized. Real estate typically 8-12%. Marketing campaigns often target 300-500% ROI (5:1 return). Venture capital targets 10x+ ROI. Always compare against your cost of capital and industry benchmarks.',
        },
        {
          question: 'How is ROI different from profit?',
          answer:
            'Profit is the absolute dollar amount gained ($), while ROI is the percentage return relative to the amount invested. A $1,000 profit on a $100 investment is 1,000% ROI — very different from $1,000 profit on a $100,000 investment (1% ROI). ROI enables comparison across different investment sizes.',
        },
        {
          question: 'Does ROI account for the time value of money?',
          answer:
            'Simple ROI does not account for time — a 50% ROI over 1 year is very different from 50% over 10 years. Annualized ROI addresses this by expressing the return as an equivalent yearly rate, enabling fair comparison regardless of investment duration.',
        },
        {
          question: 'How do taxes affect ROI?',
          answer:
            'Taxes can significantly reduce your actual ROI. Investment gains may be subject to capital gains tax (short-term: ordinary income rate; long-term: 0-20%). Real estate has depreciation benefits. Always calculate after-tax ROI for accurate investment comparison, especially across different asset classes with different tax treatments.',
        },
      ]}
    >
      <div className="p-4 sm:p-6 space-y-6">
      {/* Form Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="initial-investment" className="text-sm font-medium">
            <DollarSign className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
            Initial Investment ($)
          </Label>
          <Input
            id="initial-investment"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 10000"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="final-value" className="text-sm font-medium">
            <Wallet className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
            Final Value ($)
          </Label>
          <Input
            id="final-value"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 15000"
            value={finalValue}
            onChange={(e) => setFinalValue(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-medium">
            <Clock className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
            Investment Duration (years)
          </Label>
          <Input
            id="duration"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g., 5"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional-contributions" className="text-sm font-medium">
            <TrendingUp className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
            Additional Contributions ($){' '}
            <span className="text-muted-foreground font-normal">optional</span>
          </Label>
          <Input
            id="additional-contributions"
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            value={additionalContributions}
            onChange={(e) => setAdditionalContributions(e.target.value)}
          />
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex items-center justify-between">
        <TryExample onClick={handleTryExample} />
        <Button
          onClick={handleCalculate}
          className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 font-semibold text-base py-6"
        >
          Calculate ROI
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="result-display mt-6 rounded-2xl border border-border/60 bg-gradient-to-b from-muted/40 to-muted/20 p-6 space-y-5" aria-live="polite"
        >
          {/* Main Result */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              Return on Investment
            </p>
            <motion.p
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`text-4xl sm:text-5xl font-bold tracking-tight ${
                result.roi >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatPercent(result.roi)}
            </motion.p>
            {/* Health Badge */}
            <div className="flex justify-center mt-2">
              <Badge
                variant="outline"
                className={`${health?.bgClass} ${health?.borderClass} ${health?.textClass} px-4 py-1.5 text-sm border`}
              >
                {health?.label}
              </Badge>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50" />

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-background/60 border border-border/40 p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Total Profit / Loss
              </p>
              <p
                className={`text-xl font-bold ${
                  result.totalProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {result.totalProfit >= 0 ? '+' : ''}
                {formatCurrency(result.totalProfit)}
              </p>
            </div>
            <div className="rounded-xl bg-background/60 border border-border/40 p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Annualized ROI
              </p>
              <p
                className={`text-xl font-bold ${
                  result.annualizedROI >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {formatPercent(result.annualizedROI)}
              </p>
            </div>
            <div className="rounded-xl bg-background/60 border border-border/40 p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Investment Duration
              </p>
              <p className="text-xl font-bold">
                {result.years === 1 ? '1 Year' : `${result.years} Years`}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50" />

          {/* Investment Growth Breakdown */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Investment Growth Breakdown</p>
            <div className="space-y-3">
              {/* Initial Investment */}
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Initial Investment</p>
                </div>
                <p className="text-sm font-semibold text-right shrink-0">
                  {formatCurrency(result.initialInvestment)}
                </p>
              </div>

              {/* Additional Contributions (if any) */}
              {result.additionalContributions > 0 && (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">+ Additional Contributions</p>
                  </div>
                  <p className="text-sm font-semibold text-right shrink-0">
                    +{formatCurrency(result.additionalContributions)}
                  </p>
                </div>
              )}

              {/* Total Invested */}
              <div className="flex items-center gap-3 rounded-lg bg-muted/40 border border-border/30 px-3 py-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Wallet className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">= Total Invested</p>
                </div>
                <p className="text-sm font-bold text-right shrink-0">
                  {formatCurrency(result.totalInvested)}
                </p>
              </div>

              {/* Visual arrow */}
              <div className="flex justify-center">
                <div className="h-6 w-px bg-border/60" />
              </div>

              {/* Final Value */}
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Wallet className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Final Value</p>
                </div>
                <p className="text-sm font-semibold text-right shrink-0">
                  {formatCurrency(result.finalValue)}
                </p>
              </div>

              {/* Profit/Loss */}
              <div
                className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
                  result.totalProfit >= 0
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40'
                    : 'bg-red-50/50 dark:bg-red-950/20 border-red-200/60 dark:border-red-900/40'
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    result.totalProfit >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'
                  }`}
                >
                  {result.totalProfit >= 0 ? (
                    <TrendingUp className={`h-4 w-4 ${result.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {result.totalProfit >= 0 ? 'Profit' : 'Loss'}
                  </p>
                </div>
                <p
                  className={`text-sm font-bold text-right shrink-0 ${
                    result.totalProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {result.totalProfit >= 0 ? '+' : ''}
                  {formatCurrency(result.totalProfit)}
                </p>
              </div>
            </div>
          </div>

          {/* Investment vs Return Bar Chart */}
          <div className="print:hidden">
            <p className="text-sm font-medium text-muted-foreground mb-3">Investment vs Return</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[
                { category: 'Initial Investment', value: result.initialInvestment },
                { category: 'Additional Contributions', value: result.additionalContributions },
                { category: 'Total Profit', value: result.totalProfit },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  <Cell fill="#3b82f6" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#10b981" />
                </Bar>
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Edge case: invalid inputs */}
      {result === null && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Enter your investment details and click "Calculate ROI" to see results.
        </div>
      )}
      </div>

      {/* ---- Comparison save buttons ---- */}
      {result && (
        <div className="flex flex-wrap gap-2 mt-4 px-1">
          <button
            onClick={() => setCompareA({ result, label: `${formatCurrency(result.totalInvested)} for ${result.years}yr` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
          >
            {compareA ? '↺ Replace Scenario A' : '+ Save as Scenario A'}
          </button>
          <button
            onClick={() => setCompareB({ result, label: `${formatCurrency(result.totalInvested)} for ${result.years}yr` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 transition-colors font-medium"
          >
            {compareB ? '↺ Replace Scenario B' : '+ Save as Scenario B'}
          </button>
        </div>
      )}

      {/* ---- Compare Panel ---- */}
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total Invested',  valueA: formatCurrency(compareA.result.totalInvested),  valueB: formatCurrency(compareB.result.totalInvested),  numA: compareA.result.totalInvested,  numB: compareB.result.totalInvested,  higherIsBetter: false },
          { label: 'Final Value',     valueA: formatCurrency(compareA.result.finalValue),     valueB: formatCurrency(compareB.result.finalValue),     numA: compareA.result.finalValue,     numB: compareB.result.finalValue },
          { label: 'Total Profit',    valueA: formatCurrency(compareA.result.totalProfit),    valueB: formatCurrency(compareB.result.totalProfit),    numA: compareA.result.totalProfit,    numB: compareB.result.totalProfit },
          { label: 'ROI %',           valueA: formatPercent(compareA.result.roi),             valueB: formatPercent(compareB.result.roi),             numA: compareA.result.roi,            numB: compareB.result.roi },
          { label: 'Annualized ROI',  valueA: formatPercent(compareA.result.annualizedROI),   valueB: formatPercent(compareB.result.annualizedROI),   numA: compareA.result.annualizedROI,  numB: compareB.result.annualizedROI },
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
    </CalculatorLayout>
  );
}
