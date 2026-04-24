'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, BarChart as BarChartIcon } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CalculatorLayout from '@/components/calculators/CalculatorLayout';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface ProRataSnapshot {
  annualSalary: number;
  actualDays: number;
  proRataSalary: number;
  percentage: number;
  label: string;
}

export default function ProRataSalaryCalculator() {
  const [annualSalary, setAnnualSalary] = useState<string>('');
  const [fullWorkingDays, setFullWorkingDays] = useState<string>('260');
  const [actualDaysWorked, setActualDaysWorked] = useState<string>('');
  const [calculated, setCalculated] = useState(false);

  // Comparison State
  const [compareA, setCompareA] = useState<ProRataSnapshot | null>(null);
  const [compareB, setCompareB] = useState<ProRataSnapshot | null>(null);

  const { history, saveEntry, clearHistory } = useCalcHistory<{ annualSalary: string; actualDaysWorked: string; fullWorkingDays: string }>('pro-rata-salary');

  const annualSalaryNum = parseFloat(annualSalary) || 0;
  const fullWorkingDaysNum = parseFloat(fullWorkingDays) || 260;
  const actualDaysWorkedNum = parseFloat(actualDaysWorked) || 0;

  const dailyRate =
    fullWorkingDaysNum > 0 ? annualSalaryNum / fullWorkingDaysNum : 0;
  const proRataSalary = dailyRate * actualDaysWorkedNum;
  const difference = annualSalaryNum - proRataSalary;
  const percentageOfFull =
    annualSalaryNum > 0 ? (proRataSalary / annualSalaryNum) * 100 : 0;

  const handleCalculate = () => {
    if (annualSalaryNum > 0 && actualDaysWorkedNum > 0 && fullWorkingDaysNum > 0) {
      setCalculated(true);
      saveEntry(
        { annualSalary, actualDaysWorked, fullWorkingDays },
        `${formatCurrency(annualSalaryNum)} salary, ${actualDaysWorkedNum}/${fullWorkingDaysNum} days — Result: ${formatCurrency(proRataSalary)}`
      );
    }
  };

  const handleRestore = (inputs: { annualSalary: string; actualDaysWorked: string; fullWorkingDays: string }) => {
    setAnnualSalary(inputs.annualSalary);
    setActualDaysWorked(inputs.actualDaysWorked);
    setFullWorkingDays(inputs.fullWorkingDays);
    setCalculated(true);
  };

  const handleReset = () => {
    setAnnualSalary('');
    setFullWorkingDays('260');
    setActualDaysWorked('');
    setCalculated(false);
  };

  return (
    <CalculatorLayout
      title="Pro Rata Salary Calculator"
      description="Calculate your pro rata salary based on the number of days you've worked. Ideal for part-time roles, mid-year starts, or contract work."
      icon={<CalendarClock className="h-7 w-7 text-white" />}
      breadcrumbs={[
        { label: 'Calculators' },
        { label: 'Pro Rata Salary Calculator' },
      ]}
      tableOfContents={[
        { id: 'how-to-calculate', label: 'How to Calculate' },
        { id: 'formula', label: 'Pro Rata Formula' },
        { id: 'worked-examples', label: 'Worked Examples' },
        { id: 'frequently-asked-questions', label: 'FAQs' },
        { id: 'related-calculators', label: 'Related Calculators' },
      ]}
      workedExamples={[
        {
          title: 'Mid-Year Start',
          description:
            'An employee earning a full-time annual salary of $80,000 starts on July 1st, working 130 of the standard 260 working days in the year. The daily rate is calculated as $80,000 / 260 = $307.69 per day. Multiplying by the 130 days worked gives a pro rata salary of $40,000 — exactly half the full-time amount.',
        },
        {
          title: 'Part-Time Equivalent',
          description:
            'A full-time role carries a salary of $60,000 per year, but the employee works only 3 days per week instead of 5. Over a full year this amounts to 156 working days out of 260. The pro rata salary is $60,000 × (156 / 260) = $36,000, which represents 60% of the full-time salary and matches the 60% fraction of hours worked.',
        },
        {
          title: 'Contract Work (90 Days)',
          description:
            'A contractor is engaged for a 90-day assignment with an annualized salary equivalent of $100,000. The daily rate is $100,000 / 260 = $384.62. The pro rata pay for the 90-day engagement is $384.62 × 90 = $34,615.38. This approach is common for fixed-term contracts and freelance engagements where the annual rate serves as the basis for short-term compensation.',
        },
      ]}
      relatedTools={[
        { slug: 'sales-commission', title: 'Sales Commission Calculator', description: 'Calculate your commission earnings', icon: 'DollarSign' },
        { slug: 'salary-increase', title: 'Salary Increase Calculator', description: 'See what a raise looks like in your paycheck', icon: 'TrendingUp' },
        { slug: 'payroll', title: 'Payroll Calculator', description: 'Calculate your take-home pay after taxes', icon: 'CreditCard' },
        { slug: 'time-card', title: 'Time Card Calculator', description: 'Convert work hours to decimal format', icon: 'Clock' },
        { slug: 'post-tax-bonus', title: 'Bonus Tax Calculator', description: 'Calculate net bonus after tax withholding', icon: 'Gift' },
        { slug: 'profit-margin', title: 'Profit Margin Calculator', description: 'Calculate profit margins and markup', icon: 'Percent' },
      ]}
      howToSteps={[
        'Start with the full-time annual salary — this is the complete yearly salary a full-time employee working the entire year would earn.',
        'Determine the total number of working days in a full year — the standard is 260 days (52 weeks × 5 days), but adjust if your organization uses a different schedule.',
        'Count the actual number of days you will work or have worked — this includes only the days you are actively employed during the period in question.',
        'Calculate your daily rate by dividing the full annual salary by the total working days, then multiply by your actual days worked to get the pro rata salary.',
      ]}
      formula="Daily Rate = Annual Salary / Full Working Days\nPro Rata Salary = Daily Rate × Days Worked"
      formulaDescription="The pro rata salary is calculated by first finding the daily equivalent of the full-time salary, then multiplying it by the actual number of days worked. This ensures that employees who work fewer than the standard number of days receive a fair and proportional share of the full-time salary."
      faqs={[
        {
          question: 'When is pro rata salary used?',
          answer:
            'Pro rata salary calculations are used when an employee does not work the full standard year or full-time hours. Common scenarios include starting a job mid-year, leaving before the year ends, transitioning from full-time to part-time, or working on a fixed-term contract. Employers use pro rata to ensure compensation is fair and proportional to actual time worked.',
        },
        {
          question: 'Is a pro rata salary taxed the same as a full salary?',
          answer:
            'Yes, pro rata salaries are taxed using the same income tax brackets and rates as full-time salaries. The key difference is that since the total annual income is lower, you may fall into a lower tax bracket, resulting in a lower overall tax burden. All standard deductions, benefits, and payroll taxes still apply proportionally.',
        },
        {
          question: 'How does pro rata work for part-time employees?',
          answer:
            'For part-time employees, the pro rata calculation typically uses hours rather than days. The full-time equivalent salary is multiplied by the fraction of hours worked. For example, if you work 20 hours per week in a role that is normally 40 hours, your pro rata salary would be 50% of the full-time salary. Benefits such as holiday entitlement and pension contributions are also usually calculated on a pro rata basis.',
        },
        {
          question: 'What about pro rata and holiday entitlement?',
          answer:
            'Holiday entitlement is also calculated on a pro rata basis for part-time or mid-year starters. In most jurisdictions, full-time employees are entitled to a statutory number of paid holiday days per year. A pro rata employee receives the same proportion of those days as their working time represents. For example, working half the year typically entitles you to half the annual holiday allowance.',
        },
        {
          question: 'Does pro rata affect benefits like health insurance and retirement plans?',
          answer:
            'It depends on the employer and jurisdiction. Some benefits like health insurance may have eligibility thresholds that pro rata employees still meet. Retirement plan contributions are typically proportional to earnings, meaning lower pro rata salaries result in lower contributions. Always check your employment contract and company benefits policy to understand exactly how pro rata status affects each specific benefit.',
        },
        {
          question: 'How is pro rata different from prorated?',
          answer:
            'They refer to the exact same concept. "Pro rata" is the original Latin phrase meaning "in proportion," while "prorated" is simply the anglicized verb form of the same term. Both describe the process of allocating or reducing an amount proportionally based on time worked, usage, or another relevant factor. In everyday usage they are completely interchangeable.',
        },
        {
          question: 'Can I calculate pro rata by hours instead of days?',
          answer:
            'Yes, you can absolutely calculate pro rata using hours. Instead of dividing the annual salary by working days, divide it by annual working hours — typically 2,080 hours (40 hours × 52 weeks). This gives you the hourly rate, which you then multiply by the actual hours worked. The hourly method is especially useful for roles with variable daily hours or for contractors billing by the hour.',
        },
        {
          question: 'Does pro rata affect my pension or 401(k) contributions?',
          answer:
            'Yes, pension and 401(k) contributions are typically calculated as a percentage of your salary, so a pro rata employee will contribute less in absolute dollar terms but the same percentage as a full-time employee. For example, if the employer matches 5% of salary, a pro rata employee earning $36,000 receives $1,800 in matching contributions compared to $3,000 for a full-time $60,000 employee. The contribution rate remains identical.',
        },
      ]}
    >
      <div className="p-4 sm:p-6 space-y-6">
      {/* Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="annual-salary" className="text-sm font-medium">
            Full-time Annual Salary
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">
              $
            </span>
            <Input
              id="annual-salary"
              type="number"
              step="0.01"
              min="0"
              placeholder="80,000"
              value={annualSalary}
              onChange={(e) => {
                setAnnualSalary(e.target.value);
                setCalculated(false);
              }}
              className="pl-7"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="full-working-days" className="text-sm font-medium">
            Full-time Annual Working Days
          </Label>
          <div className="relative">
            <Input
              id="full-working-days"
              type="number"
              step="1"
              min="1"
              placeholder="260"
              value={fullWorkingDays}
              onChange={(e) => {
                setFullWorkingDays(e.target.value);
                setCalculated(false);
              }}
            />
            <span className="absolute right-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">
              days
            </span>
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="actual-days-worked" className="text-sm font-medium">
            Actual Days Worked
          </Label>
          <div className="relative">
            <Input
              id="actual-days-worked"
              type="number"
              step="1"
              min="0"
              placeholder="130"
              value={actualDaysWorked}
              onChange={(e) => {
                setActualDaysWorked(e.target.value);
                setCalculated(false);
              }}
            />
            <span className="absolute right-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">
              days
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleCalculate}
          disabled={annualSalaryNum <= 0 || actualDaysWorkedNum <= 0}
          className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none"
        >
          Calculate Pro Rata Salary
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
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
            <p className="text-sm text-muted-foreground mb-1">
              Pro Rata Salary
            </p>
            <p className="text-4xl font-bold text-emerald-600">
              {formatCurrency(proRataSalary)}
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCompareA({
                  annualSalary: annualSalaryNum,
                  actualDays: actualDaysWorkedNum,
                  proRataSalary: proRataSalary,
                  percentage: percentageOfFull,
                  label: `${actualDaysWorkedNum} days worked`
                })}
                className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary"
              >
                {compareA ? '↺ Set A' : '+ Save A'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCompareB({
                  annualSalary: annualSalaryNum,
                  actualDays: actualDaysWorkedNum,
                  proRataSalary: proRataSalary,
                  percentage: percentageOfFull,
                  label: `${actualDaysWorkedNum} days worked`
                })}
                className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600"
              >
                {compareB ? '↺ Set B' : '+ Save B'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg bg-muted/50 p-4 text-center border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Daily Rate
              </p>
              <p className="text-lg font-semibold">
                {formatCurrency(dailyRate)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                per working day
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 text-center border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                % of Full Salary
              </p>
              <p className="text-lg font-semibold">
                {formatPercent(percentageOfFull)}
              </p>
              <Badge variant="secondary" className="mt-1">
                {actualDaysWorkedNum} of {fullWorkingDaysNum} days
              </Badge>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 text-center border border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Difference from Full
              </p>
              <p className="text-lg font-semibold text-amber-600">
                {formatCurrency(difference)}
              </p>
              <Badge variant="secondary" className="mt-1">
                Not earned
              </Badge>
            </div>
          </div>

          {/* Bar Chart Breakdown */}
          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChartIcon className="h-4.5 w-4.5 text-primary" />
              Salary Breakdown
            </p>
            <div className="h-64 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={[
                    { name: 'Pro Rata Salary', amount: proRataSalary, fill: '#10b981' },
                    { name: 'Not Earned', amount: difference, fill: '#f59e0b' },
                  ]}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#888888', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#888888', fontSize: 12 }}
                    tickFormatter={(val) => `$${val.toLocaleString()}`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [`${formatCurrency(value)}`, 'Amount']}
                    labelStyle={{ color: '#888888' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {[
                      { name: 'Pro Rata Salary', amount: proRataSalary, fill: '#10b981' },
                      { name: 'Not Earned', amount: difference, fill: '#f59e0b' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {percentageOfFull < 100 && (
            <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                💡 By working <strong>{actualDaysWorkedNum}</strong> of{' '}
                <strong>{fullWorkingDaysNum}</strong> working days, you earn{' '}
                <strong>{formatPercent(percentageOfFull)}</strong> of the full-time salary.{' '}
                Your daily rate is <strong>{formatCurrency(dailyRate)}</strong>.
              </p>
            </div>
          )}
        </motion.div>
      )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Full Annual Salary', valueA: formatCurrency(compareA.annualSalary), valueB: formatCurrency(compareB.annualSalary), numA: compareA.annualSalary, numB: compareB.annualSalary },
          { label: 'Actual Days Worked', valueA: `${compareA.actualDays} days`,         valueB: `${compareB.actualDays} days`,         numA: compareA.actualDays,   numB: compareB.actualDays },
          { label: 'Pro Rata Salary',    valueA: formatCurrency(compareA.proRataSalary), valueB: formatCurrency(compareB.proRataSalary), numA: compareA.proRataSalary, numB: compareB.proRataSalary },
          { label: '% of Full Salary',   valueA: formatPercent(compareA.percentage),    valueB: formatPercent(compareB.percentage),    numA: compareA.percentage,    numB: compareB.percentage },
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

      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} />
    </CalculatorLayout>
  );
}
