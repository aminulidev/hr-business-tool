'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';
import TryExample from './TryExample';

interface SalaryIncreaseResult {
  currentSalary: number;
  salaryIncrease: number;
  increaseAmount: number;
  newSalary: number;
  realIncrease: number;
}

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const formatPercent = (value: number): string =>
  `${value.toFixed(2)}%`;

export default function SalaryIncreaseCalculator() {
  const [currentSalary, setCurrentSalary] = useState<string>('');
  const [salaryIncrease, setSalaryIncrease] = useState<string>('');
  const [inflationRate, setInflationRate] = useState<string>('3.0');
  const [calculated, setCalculated] = useState(false);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ currentSalary: string; salaryIncrease: string; inflationRate: string }>('salary-increase-calculator');

  const handleTryExample = () => {
    setCurrentSalary('65000');
    setSalaryIncrease('8');
    setInflationRate('3.2');
    setCalculated(true);
  };

  // ---- Comparison state ----
  const [compareA, setCompareA] = useState<{ result: SalaryIncreaseResult; label: string } | null>(null);
  const [compareB, setCompareB] = useState<{ result: SalaryIncreaseResult; label: string } | null>(null);

  const currentSalaryNum = parseFloat(currentSalary) || 0;
  const salaryIncreaseNum = parseFloat(salaryIncrease) || 0;
  const inflationRateNum = parseFloat(inflationRate) || 0;

  const increaseAmount = currentSalaryNum * (salaryIncreaseNum / 100);
  const newSalary = currentSalaryNum + increaseAmount;
  const monthlyIncrease = increaseAmount / 12;
  const realIncrease = salaryIncreaseNum - inflationRateNum;
  const realMonthlyIncrease =
    currentSalaryNum * (realIncrease / 100) / 12;

  const handleCalculate = () => {
    if (currentSalaryNum > 0 && salaryIncreaseNum >= 0) {
      setCalculated(true);
      saveEntry(
        { currentSalary, salaryIncrease, inflationRate },
        `${formatCurrency(currentSalaryNum)} → ${formatCurrency(newSalary)} (+${salaryIncreaseNum}% raise)`
      );
    }
  };

  const handleRestore = (inputs: { currentSalary: string; salaryIncrease: string; inflationRate: string }) => {
    setCurrentSalary(inputs.currentSalary);
    setSalaryIncrease(inputs.salaryIncrease);
    setInflationRate(inputs.inflationRate);
    setCalculated(false);
  };

  const handleReset = () => {
    setCurrentSalary('');
    setSalaryIncrease('');
    setInflationRate('3.0');
    setCalculated(false);
  };

  return (
    <CalculatorLayout
      title="Salary Increase Calculator"
      description="Calculate your new salary after a raise and understand the real impact after inflation. See the difference between nominal and real wage growth."
      icon={<TrendingUp className="h-7 w-7 text-white" />}
      breadcrumbs={[
        { label: 'Calculators' },
        { label: 'Salary Increase Calculator' },
      ]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Salary Increase Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      workedExamples={[
        {
          title: '3% Annual Raise',
          description:
            'An employee currently earning $65,000 per year receives a standard 3% annual raise. The increase amount is $65,000 × 3% = $1,950, bringing the new salary to $66,950. However, with inflation also at 3%, the real increase is exactly 0% — meaning the employee\'s purchasing power remains unchanged despite the higher paycheck.',
        },
        {
          title: 'Promotion Raise (15%)',
          description:
            'After earning a promotion, an employee earning $55,000 receives a 15% raise. The increase is $55,000 × 15% = $8,250, resulting in a new salary of $63,250. On a monthly basis, this translates to an extra $687.50 per month ($8,250 / 12). A 15% raise is typical for promotions and significantly outpaces average inflation.',
        },
        {
          title: 'Below-Inflation Raise',
          description:
            'An employee earning $70,000 receives a 2% raise in a year where inflation is running at 4.5%. The nominal increase is $1,400, bringing the salary to $71,400. However, the real wage decrease is 2.5% (2% - 4.5%), meaning the employee\'s purchasing power actually declines despite receiving a raise. This scenario highlights why understanding inflation-adjusted growth is critical.',
        },
      ]}
      relatedTools={[
        { slug: 'commission-calculator', title: 'Sales Commission Calculator', description: 'Calculate commission from sales revenue', icon: 'DollarSign' },
        { slug: 'pro-rata-calculator', title: 'Pro Rata Salary Calculator', description: 'Calculate prorated salary for partial periods', icon: 'CalendarClock' },
        { slug: 'payroll-calculator', title: 'Payroll Calculator', description: 'Calculate your take-home pay after taxes', icon: 'CreditCard' },
        { slug: 'bonus-tax-calculator', title: 'Bonus Tax Calculator', description: 'Calculate net bonus after tax withholding', icon: 'Gift' },
        { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Calculate profit margins and markup', icon: 'Percent' },
        { slug: 'roi-calculator', title: 'ROI Calculator', description: 'Calculate return on investment', icon: 'BarChart3' },
      ]}
      howToSteps={[
        'Enter your current annual salary — this is the total amount you earn before any increase is applied, including base pay and any existing allowances.',
        'Input the salary increase percentage — this is the raise you received or are expecting, expressed as a percentage of your current salary.',
        'Optionally, enter the current inflation rate — this allows you to see the real (inflation-adjusted) purchasing power of your raise rather than just the nominal increase.',
        'Calculate your new salary and compare the nominal increase against inflation to understand your true wage growth in terms of purchasing power.',
      ]}
      formula={`New Salary = Current Salary × (1 + Increase% / 100)\nReal Increase = Nominal Increase - Inflation Rate`}
      formulaDescription="The salary increase formula applies the raise percentage to your current salary to determine your new earnings. The real increase subtracts the inflation rate from your nominal raise, revealing how much your purchasing power actually grows. A raise that is lower than inflation means your real wages are decreasing, even though your paycheck amount increases."
      faqs={[
        {
          question: 'What is a good salary increase percentage?',
          answer:
            'A good salary increase typically ranges from 3% to 5% for annual merit raises, which roughly keeps pace with or slightly exceeds inflation. Promotions often come with larger increases of 10% to 20%. Exceptional performers or those changing jobs may negotiate increases of 15% to 30% or more. The key benchmark is whether your raise exceeds inflation — if it does, your real purchasing power is growing.',
        },
        {
          question: 'How does inflation affect my salary increase?',
          answer:
            'Inflation erodes the purchasing power of your money over time, meaning even with a nominal raise, you could effectively be earning less in real terms. For example, a 3% raise with 4% inflation means your real wages decreased by 1%. To truly benefit from a raise, it must exceed the inflation rate. Understanding the difference between nominal and real income growth is essential for evaluating whether your compensation is truly improving.',
        },
        {
          question: 'How often should you ask for a raise?',
          answer:
            'Most experts recommend asking for a raise at least annually during performance reviews, or whenever you take on significantly more responsibility. A good rule of thumb is to request a raise after 6 to 12 months of consistently exceeding expectations in your role. Timing matters — consider asking after a major accomplishment, during the company budget planning cycle, or when you have market data showing you are underpaid relative to peers.',
        },
        {
          question: "What is the average salary increase per year?",
          answer:
            'The average annual salary increase in the United States typically ranges from 2.5% to 3.5% for cost-of-living adjustments and merit raises. However, this varies significantly by industry, region, and economic conditions. In high-demand fields like technology and healthcare, increases of 4% to 6% are more common. Job switchers tend to see larger increases of 10% to 15% on average compared to those who stay at the same company.',
        },
        {
          question: 'Should I negotiate my salary increase?',
          answer:
            'Absolutely. Research shows that employees who negotiate their salary increases typically receive 5% to 10% more than those who accept the initial offer. Come prepared with data on market rates, a record of your accomplishments, and a clear justification for why you deserve more. Approach the conversation professionally, focus on the value you bring to the organization, and be willing to discuss alternative compensation like bonuses or additional benefits if a higher base salary is not immediately possible.',
        },
        {
          question: 'How do I convert my hourly wage to an annual salary?',
          answer:
            'To convert an hourly wage to an annual salary, multiply your hourly rate by the number of hours you work per week, then multiply by 52 weeks in a year. For example, $30 per hour × 40 hours per week × 52 weeks = $62,400 per year. Once you have the annual equivalent, you can apply the raise percentage using this calculator to see what your increased hourly rate would be.',
        },
        {
          question: 'What is a cost-of-living adjustment (COLA)?',
          answer:
            'A cost-of-living adjustment (COLA) is an automatic salary increase tied to a measure of inflation, most commonly the Consumer Price Index (CPI). COLAs are standard in government employment, union contracts, Social Security benefits, and some private-sector pensions. Their purpose is to ensure that wages and benefits keep pace with rising prices, preserving the recipient\'s purchasing power over time without requiring individual negotiation.',
        },
        {
          question: 'Does my raise affect my tax bracket?',
          answer:
            'A raise could push you into a higher marginal tax bracket, but a common misconception is that your entire salary gets taxed at the new higher rate. In reality, only the income that falls above the bracket threshold is taxed at the higher rate, while income below it continues to be taxed at the lower rates. For example, if you earn $50,000 and get a raise to $55,000, only the $5,000 above the bracket threshold is taxed at the higher marginal rate, not the full $55,000.',
        },
      ]}
    >
      <div className="p-4 sm:p-6 space-y-6">
      {/* Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="current-salary" className="text-sm font-medium">
            Current Salary (annual)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">
              $
            </span>
            <Input
              id="current-salary"
              type="number"
              step="0.01"
              min="0"
              placeholder="65,000"
              value={currentSalary}
              onChange={(e) => {
                setCurrentSalary(e.target.value);
                setCalculated(false);
              }}
              className="pl-7"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary-increase" className="text-sm font-medium">
            Salary Increase
          </Label>
          <div className="relative">
            <Input
              id="salary-increase"
              type="number"
              step="0.01"
              min="0"
              placeholder="5.00"
              value={salaryIncrease}
              onChange={(e) => {
                setSalaryIncrease(e.target.value);
                setCalculated(false);
              }}
              className="pr-7"
            />
            <span className="absolute right-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">
              %
            </span>
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="inflation-rate" className="text-sm font-medium">
            Current Inflation Rate{' '}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <div className="relative max-w-xs">
            <Input
              id="inflation-rate"
              type="number"
              step="0.01"
              min="0"
              placeholder="3.00"
              value={inflationRate}
              onChange={(e) => {
                setInflationRate(e.target.value);
                setCalculated(false);
              }}
              className="pr-7"
            />
            <span className="absolute right-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">
              %
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <Button
            onClick={handleCalculate}
            disabled={currentSalaryNum <= 0}
            className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
          >
            Calculate Salary Increase
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
        <TryExample onClick={handleTryExample} />
      </div>

      {/* Results */}
      {calculated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="result-display mt-6" aria-live="polite"
        >
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-1">Your New Salary</p>
            <p className="text-4xl font-bold text-emerald-600">
              {formatCurrency(newSalary)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              +{formatCurrency(increaseAmount)} per year · +{formatCurrency(monthlyIncrease)} per month
            </p>
          </div>

          {/* Before / After Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Current Salary
              </p>
              <p className="text-xl font-semibold">{formatCurrency(currentSalaryNum)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(currentSalaryNum / 12)}/month
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-4 text-center border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">
                New Salary
              </p>
              <p className="text-xl font-semibold text-emerald-600">
                {formatCurrency(newSalary)}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                {formatCurrency(newSalary / 12)}/month
              </p>
            </div>
          </div>

          {/* Real vs Nominal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Nominal Increase
              </p>
              <p className="text-lg font-semibold text-emerald-600">
                +{formatPercent(salaryIncreaseNum)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                +{formatCurrency(increaseAmount)}/year
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 text-center border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Inflation Rate
              </p>
              <p className="text-lg font-semibold text-amber-600">
                {formatPercent(inflationRateNum)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">cost of living</p>
            </div>

            <div className={`rounded-lg p-4 text-center border ${
              realIncrease >= 0
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
            }`}>
              <p className={`text-xs uppercase tracking-wide mb-1 ${
                realIncrease >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                Real Increase
              </p>
              <p className={`text-lg font-semibold ${
                realIncrease >= 0
                  ? 'text-emerald-600'
                  : 'text-red-600'
              }`}>
                {realIncrease >= 0 ? '+' : ''}{formatPercent(realIncrease)}
              </p>
              <Badge
                variant={realIncrease >= 0 ? 'default' : 'destructive'}
                className="mt-1"
              >
                {realIncrease >= 0 ? 'Above inflation' : 'Below inflation'}
              </Badge>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Monthly Increase (nominal)
              </p>
              <p className="text-lg font-semibold">
                +{formatCurrency(monthlyIncrease)}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 text-center border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Monthly Increase (real)
              </p>
              <p className={`text-lg font-semibold ${realMonthlyIncrease >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {realMonthlyIncrease >= 0 ? '+' : ''}{formatCurrency(realMonthlyIncrease)}
              </p>
            </div>
          </div>

          {/* Insight */}
          <div className={`mt-4 rounded-lg p-3 border ${
            realIncrease >= 0
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
          }`}>
            <p className={`text-sm ${
              realIncrease >= 0
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-amber-700 dark:text-amber-300'
            }`}>
              {realIncrease >= 0 ? (
                <>
                  💡 Great news! Your raise of <strong>{formatPercent(salaryIncreaseNum)}</strong> exceeds the{' '}
                  <strong>{formatPercent(inflationRateNum)}</strong> inflation rate, giving you a real wage increase of{' '}
                  <strong>{formatPercent(realIncrease)}</strong>. Your purchasing power is growing.
                </>
              ) : (
                <>
                  ⚠️ Your raise of <strong>{formatPercent(salaryIncreaseNum)}</strong> is below the{' '}
                  <strong>{formatPercent(inflationRateNum)}</strong> inflation rate, resulting in a real wage decrease of{' '}
                  <strong>{formatPercent(realIncrease)}</strong>. Consider negotiating a higher raise to maintain your purchasing power.
                </>
              )}
            </p>
          </div>

          {/* Before vs After Comparison Chart */}
          <div className="print:hidden">
            <p className="text-sm font-medium text-muted-foreground mb-3">Salary Comparison</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[
                { category: 'Current', amount: currentSalaryNum, monthly: currentSalaryNum / 12 },
                { category: 'New', amount: newSalary, monthly: newSalary / 12 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} name="Annual Salary" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
      </div>

      {/* ---- Comparison save buttons ---- */}
      {calculated && (
        <div className="flex flex-wrap gap-2 mt-4 px-1">
          <button
            onClick={() => {
              const res: SalaryIncreaseResult = { currentSalary: currentSalaryNum, salaryIncrease: salaryIncreaseNum, increaseAmount, newSalary, realIncrease };
              setCompareA({ result: res, label: `${formatCurrency(currentSalaryNum)} + ${salaryIncreaseNum}%` });
            }}
            className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
          >
            {compareA ? '↺ Replace Scenario A' : '+ Save as Scenario A'}
          </button>
          <button
            onClick={() => {
              const res: SalaryIncreaseResult = { currentSalary: currentSalaryNum, salaryIncrease: salaryIncreaseNum, increaseAmount, newSalary, realIncrease };
              setCompareB({ result: res, label: `${formatCurrency(currentSalaryNum)} + ${salaryIncreaseNum}%` });
            }}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 transition-colors font-medium"
          >
            {compareB ? '↺ Replace Scenario B' : '+ Save as Scenario B'}
          </button>
        </div>
      )}

      {/* ---- Compare Panel ---- */}
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Current Salary', valueA: formatCurrency(compareA.result.currentSalary),  valueB: formatCurrency(compareB.result.currentSalary),  numA: compareA.result.currentSalary,  numB: compareB.result.currentSalary },
          { label: 'Raise %',        valueA: `${compareA.result.salaryIncrease.toFixed(2)}%`,valueB: `${compareB.result.salaryIncrease.toFixed(2)}%`,numA: compareA.result.salaryIncrease, numB: compareB.result.salaryIncrease },
          { label: 'Raise Amount',   valueA: formatCurrency(compareA.result.increaseAmount), valueB: formatCurrency(compareB.result.increaseAmount), numA: compareA.result.increaseAmount, numB: compareB.result.increaseAmount },
          { label: 'New Salary',     valueA: formatCurrency(compareA.result.newSalary),      valueB: formatCurrency(compareB.result.newSalary),      numA: compareA.result.newSalary,      numB: compareB.result.newSalary },
          { label: 'Real Increase',  valueA: `${compareA.result.realIncrease.toFixed(2)}%`,  valueB: `${compareB.result.realIncrease.toFixed(2)}%`,  numA: compareA.result.realIncrease,   numB: compareB.result.realIncrease },
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
