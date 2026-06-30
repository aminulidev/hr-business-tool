'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, DollarSign, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

type PayPeriod =
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'semimonthly'
  | 'monthly'
  | 'annual';

interface PeriodResult {
  key: PayPeriod;
  label: string;
  amount: number;
  hoursPerPeriod: string;
  description: string;
}

const periodLabels: Record<PayPeriod, string> = {
  hourly: 'Hourly',
  daily: 'Daily',
  weekly: 'Weekly',
  biweekly: 'Bi-Weekly',
  semimonthly: 'Semi-Monthly',
  monthly: 'Monthly',
  annual: 'Annual',
};

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

// ---------------------------------------------------------------------------
// Conversion Logic
// ---------------------------------------------------------------------------

function convertToAnnual(
  amount: number,
  period: PayPeriod,
  hoursPerWeek: number,
  daysPerWeek: number
): number {
  const annualHours = hoursPerWeek * 52;
  const hoursPerDay = hoursPerWeek / daysPerWeek;
  switch (period) {
    case 'hourly':
      return amount * annualHours;
    case 'daily':
      return amount * (daysPerWeek * 52);
    case 'weekly':
      return amount * 52;
    case 'biweekly':
      return amount * 26;
    case 'semimonthly':
      return amount * 24;
    case 'monthly':
      return amount * 12;
    case 'annual':
      return amount;
    default:
      return amount;
  }
}

function annualToAllPeriods(
  annual: number,
  hoursPerWeek: number,
  daysPerWeek: number
): PeriodResult[] {
  const annualHours = hoursPerWeek * 52;
  const weeklyHours = hoursPerWeek;
  const hoursPerDay = hoursPerWeek / daysPerWeek;
  const annualDays = daysPerWeek * 52;

  return [
    {
      key: 'hourly',
      label: 'Hourly',
      amount: annual / annualHours,
      hoursPerPeriod: '1 hour',
      description: `${formatCurrency(annual / annualHours)} per hour worked`,
    },
    {
      key: 'daily',
      label: `Daily (${hoursPerDay % 1 === 0 ? hoursPerDay : hoursPerDay.toFixed(1)}-hr)`,
      amount: annual / annualDays,
      hoursPerPeriod: `${hoursPerDay % 1 === 0 ? hoursPerDay : hoursPerDay.toFixed(1)} hours`,
      description: `${formatCurrency(annual / annualDays)} per ${hoursPerDay % 1 === 0 ? hoursPerDay : hoursPerDay.toFixed(1)}-hour workday`,
    },
    {
      key: 'weekly',
      label: 'Weekly',
      amount: annual / 52,
      hoursPerPeriod: `${weeklyHours} hours`,
      description: `${formatCurrency(annual / 52)} for a ${weeklyHours}-hour week`,
    },
    {
      key: 'biweekly',
      label: 'Bi-Weekly',
      amount: annual / 26,
      hoursPerPeriod: `${weeklyHours * 2} hours`,
      description: `${formatCurrency(annual / 26)} every 2 weeks (26 pay periods/year)`,
    },
    {
      key: 'semimonthly',
      label: 'Semi-Monthly',
      amount: annual / 24,
      hoursPerPeriod: `${(annualHours / 24).toFixed(1)} hours`,
      description: `${formatCurrency(annual / 24)} twice per month (24 pay periods/year)`,
    },
    {
      key: 'monthly',
      label: 'Monthly',
      amount: annual / 12,
      hoursPerPeriod: `${(annualHours / 12).toFixed(1)} hours`,
      description: `${formatCurrency(annual / 12)} per month (12 periods/year)`,
    },
    {
      key: 'annual',
      label: 'Annual',
      amount: annual,
      hoursPerPeriod: `${annualHours.toLocaleString()} hours`,
      description: `${formatCurrency(annual)} total per year`,
    },
  ];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SalaryConverterCalculator() {
  const [payAmount, setPayAmount] = useState('');
  const [payPeriod, setPayPeriod] = useState<PayPeriod>('annual');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [results, setResults] = useState<PeriodResult[] | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ payAmount: string; payPeriod: string; hoursPerWeek: string; daysPerWeek: string }>('salary-converter');

  // ---- Comparison state ----
  const [compareA, setCompareA] = useState<{ results: PeriodResult[]; label: string } | null>(null);
  const [compareB, setCompareB] = useState<{ results: PeriodResult[]; label: string } | null>(null);

  const effectiveHoursPerWeek = useMemo(
    () => parseFloat(hoursPerWeek) || 40,
    [hoursPerWeek]
  );

  const effectiveDaysPerWeek = useMemo(
    () => parseFloat(daysPerWeek) || 5,
    [daysPerWeek]
  );

  const handleTryExample = () => {
    setPayAmount('50000');
    setPayPeriod('annual');
    setHoursPerWeek('40');
    setDaysPerWeek('5');
    
    const annual = 50000;
    const allPeriods = annualToAllPeriods(annual, 40, 5);
    setResults(allPeriods);
    saveEntry(
      { payAmount: '50000', payPeriod: 'annual', hoursPerWeek: '40', daysPerWeek: '5' },
      `${formatCurrency(50000)} Annual → ${formatCurrency(annual)}/year`
    );
  };

  const handleConvert = () => {
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) {
      setResults(null);
      return;
    }
    const annual = convertToAnnual(amount, payPeriod, effectiveHoursPerWeek, effectiveDaysPerWeek);
    const allPeriods = annualToAllPeriods(annual, effectiveHoursPerWeek, effectiveDaysPerWeek);
    setResults(allPeriods);
    saveEntry(
      { payAmount, payPeriod, hoursPerWeek, daysPerWeek },
      `${formatCurrency(amount)} ${periodLabels[payPeriod]} → ${formatCurrency(annual)}/year`
    );
  };

  const handleRestore = (inputs: { payAmount: string; payPeriod: string; hoursPerWeek: string; daysPerWeek?: string }) => {
    setPayAmount(inputs.payAmount);
    setPayPeriod(inputs.payPeriod as PayPeriod);
    setHoursPerWeek(inputs.hoursPerWeek);
    setDaysPerWeek(inputs.daysPerWeek || '5');
    setResults(null);
  };

  const annualHours = effectiveHoursPerWeek * 52;

  // -----------------------------------------------------------------------
  // SEO Content
  // -----------------------------------------------------------------------

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {/* Pay Amount */}
        <div className="space-y-2">
          <Label htmlFor="payAmount" className="text-sm font-medium">
            <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Pay Amount
          </Label>
          <Input
            id="payAmount"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 75000 or 30"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
          />
        </div>

        {/* Pay Period + Hours Per Week */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="payPeriod" className="text-sm font-medium">
              Pay Period
            </Label>
            <Select
              value={payPeriod}
              onValueChange={(val) => setPayPeriod(val as PayPeriod)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                <SelectItem value="semimonthly">Semi-Monthly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Days Per Week */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hoursPerWeek" className="text-sm font-medium">
              <Info className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Hours per Week
            </Label>
            <Input
              id="hoursPerWeek"
              type="number"
              min="1"
              max="168"
              step="0.5"
              placeholder="40"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daysPerWeek" className="text-sm font-medium">
              <Info className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Work Days per Week
            </Label>
            <Input
              id="daysPerWeek"
              type="number"
              min="1"
              max="7"
              step="1"
              placeholder="5"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground -mt-4">
          Standard: 40 hrs / 5 days. Adjust for non-standard schedules (e.g., 4×10 shifts).
        </p>

        {/* Convert Button */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <Button
            onClick={handleConvert}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            Convert Salary
          </Button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="result-display mt-8" aria-live="polite"
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            {/* Summary Header */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Converting{' '}
                <span className="text-foreground font-semibold">
                  {formatCurrency(parseFloat(payAmount) || 0)} {periodLabels[payPeriod]}
                </span>
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-emerald-600">
                {formatCurrency(
                  results.find((r) => r.key === 'annual')?.amount ?? 0
                )}{' '}
                <span className="text-lg sm:text-xl font-medium text-emerald-600/70">
                  / year
                </span>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <Badge variant="outline" className="px-3 py-1 text-xs">
                  <Info className="h-3 w-3 mr-1" />
                  {effectiveHoursPerWeek} hrs/week
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-xs">
                  {annualHours.toLocaleString()} total hours/year
                </Badge>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {results.map((period, idx) => (
                <motion.div
                  key={period.key}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * idx, duration: 0.3 }}
                  className={`rounded-xl border p-4 space-y-2 transition-colors ${
                    period.key === payPeriod
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-border/50 bg-background hover:border-emerald-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {period.label}
                    </span>
                    {period.key === payPeriod && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 h-4"
                      >
                        Input
                      </Badge>
                    )}
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(period.amount)}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {period.hoursPerPeriod} &middot; {period.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Full Table for detailed view */}
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Pay Period
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                      Hours / Period
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                      Periods / Year
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {results.map((period) => {
                    const periodsPerYear: Record<PayPeriod, number> = {
                      hourly: annualHours,
                      daily: effectiveDaysPerWeek * 52,
                      weekly: 52,
                      biweekly: 26,
                      semimonthly: 24,
                      monthly: 12,
                      annual: 1,
                    };
                    return (
                      <tr
                        key={period.key}
                        className={
                          period.key === payPeriod
                            ? 'bg-emerald-500/5 font-semibold'
                            : ''
                        }
                      >
                        <td className="px-4 py-3">{period.label}</td>
                        <td className="text-right px-4 py-3 text-emerald-600 font-semibold">
                          {formatCurrency(period.amount)}
                        </td>
                        <td className="text-right px-4 py-3 text-muted-foreground hidden sm:table-cell">
                          {period.hoursPerPeriod}
                        </td>
                        <td className="text-right px-4 py-3 text-muted-foreground hidden md:table-cell">
                          {periodsPerYear[period.key].toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Salary Across Periods Bar Chart */}
            <div className="print:hidden">
              <p className="text-sm font-medium text-muted-foreground mb-3">Salary Across Periods</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={results}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(v >= 1000 ? 0 : 2)}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} name="Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* ---- Comparison save buttons ---- */}
      {results && (
        <div className="flex flex-wrap gap-2 mt-4 px-1">
          <button
            onClick={() => setCompareA({ results, label: `${payAmount} ${periodLabels[payPeriod]}` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
          >
            {compareA ? '↺ Replace Scenario A' : '+ Save as Scenario A'}
          </button>
          <button
            onClick={() => setCompareB({ results, label: `${payAmount} ${periodLabels[payPeriod]}` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 transition-colors font-medium"
          >
            {compareB ? '↺ Replace Scenario B' : '+ Save as Scenario B'}
          </button>
        </div>
      )}

      {/* ---- Compare Panel ---- */}
      {compareA && compareB && (() => {
        const find = (rs: PeriodResult[], key: PayPeriod) => rs.find(r => r.key === key)?.amount ?? 0;
        const rows: CompareRow[] = [
          { label: 'Annual',      valueA: formatCurrency(find(compareA.results, 'annual')),      valueB: formatCurrency(find(compareB.results, 'annual')),      numA: find(compareA.results, 'annual'),      numB: find(compareB.results, 'annual') },
          { label: 'Monthly',     valueA: formatCurrency(find(compareA.results, 'monthly')),     valueB: formatCurrency(find(compareB.results, 'monthly')),     numA: find(compareA.results, 'monthly'),     numB: find(compareB.results, 'monthly') },
          { label: 'Bi-Weekly',   valueA: formatCurrency(find(compareA.results, 'biweekly')),   valueB: formatCurrency(find(compareB.results, 'biweekly')),   numA: find(compareA.results, 'biweekly'),   numB: find(compareB.results, 'biweekly') },
          { label: 'Weekly',      valueA: formatCurrency(find(compareA.results, 'weekly')),      valueB: formatCurrency(find(compareB.results, 'weekly')),      numA: find(compareA.results, 'weekly'),      numB: find(compareB.results, 'weekly') },
          { label: 'Daily',       valueA: formatCurrency(find(compareA.results, 'daily')),       valueB: formatCurrency(find(compareB.results, 'daily')),       numA: find(compareA.results, 'daily'),       numB: find(compareB.results, 'daily') },
          { label: 'Hourly',      valueA: formatCurrency(find(compareA.results, 'hourly')),      valueB: formatCurrency(find(compareB.results, 'hourly')),      numA: find(compareA.results, 'hourly'),      numB: find(compareB.results, 'hourly') },
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
