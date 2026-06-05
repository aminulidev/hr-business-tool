'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <div className="w-full">
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
    </div>
  );
}
