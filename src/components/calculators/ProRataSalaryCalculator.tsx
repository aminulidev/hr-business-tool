'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, BarChart as BarChartIcon } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';
import TryExample from './TryExample';
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

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ annualSalary: string; actualDaysWorked: string; fullWorkingDays: string }>('pro-rata-calculator');

  const handleTryExample = () => {
    setAnnualSalary('75000');
    setFullWorkingDays('260');
    setActualDaysWorked('195');
    setCalculated(true);
  };

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
    <div className="w-full">
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <Button
            onClick={handleCalculate}
            disabled={annualSalaryNum <= 0 || actualDaysWorkedNum <= 0}
            className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
          >
            Calculate Pro Rata Salary
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

      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </div>
  );
}
