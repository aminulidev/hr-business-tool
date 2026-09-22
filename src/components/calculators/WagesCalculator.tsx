'use client';

import { useState } from 'react';
import TryExample from './TryExample';
import { motion } from 'framer-motion';
import {
  Banknote,
  DollarSign,
  Clock,
  Info,
  Plus,
  Trash2,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

import UnitToggle from './UnitToggle';
// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PayPeriod = 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';

interface WageEntry {
  id: number;
  hourlyRate: string;
  regularHours: string;
  overtimeHours: string;
  doubleTimeHours: string;
}

interface WagesResult {
  entries: {
    hourlyRate: number;
    regularHours: number;
    overtimeHours: number;
    doubleTimeHours: number;
    regularPay: number;
    overtimePay: number;
    doubleTimePay: number;
    subtotal: number;
  }[];
  grossPerPeriod: number;
  grossPerWeek: number;
  grossPerBiWeekly: number;
  grossPerSemiMonthly: number;
  grossPerMonth: number;
  grossPerYear: number;
  overtimeMultiplier: number;
  doubleTimeMultiplier: number;
  payPeriod: PayPeriod;
}

interface WageSnapshot {
  grossPeriod: number;
  grossYear: number;
  totalHours: number;
  label: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PERIOD_MULTIPLIERS: Record<PayPeriod, number> = {
  weekly: 52,
  'bi-weekly': 26,
  'semi-monthly': 24,
  monthly: 12,
};

const PERIOD_LABELS: Record<PayPeriod, string> = {
  weekly: 'Weekly',
  'bi-weekly': 'Bi-Weekly',
  'semi-monthly': 'Semi-Monthly',
  monthly: 'Monthly',
};

let nextId = 1;
function createEntry(): WageEntry {
  return {
    id: nextId++,
    hourlyRate: '',
    regularHours: '40',
    overtimeHours: '0',
    doubleTimeHours: '0',
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WagesCalculator() {
  const [entries, setEntries] = useState<WageEntry[]>([createEntry()]);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState('1.5');
  const [doubleTimeMultiplier, setDoubleTimeMultiplier] = useState('2');
  const [payPeriod, setPayPeriod] = useState<PayPeriod>('weekly');
  const [result, setResult] = useState<WagesResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Comparison State
  const [compareA, setCompareA] = useState<WageSnapshot | null>(null);
  const [compareB, setCompareB] = useState<WageSnapshot | null>(null);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ payPeriod: string; overtimeMultiplier: string; doubleTimeMultiplier: string; firstRate: string }>('wages-calculator');

  const updateEntry = (id: number, field: keyof WageEntry, value: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
    setResult(null);
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, createEntry()]);
    setResult(null);
  };

  const removeEntry = (id: number) => {
    if (entries.length <= 1) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setResult(null);
  };

    const handleTryExample = () => {
setEntries([{ id: 1, hourlyRate: '20', regularHours: '40', overtimeHours: '5', doubleTimeHours: '0' }]);
    setOvertimeMultiplier('1.5');
    setDoubleTimeMultiplier('2');
    setPayPeriod('weekly');
    setResult(null);
  };

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    const otMult = parseFloat(overtimeMultiplier);
    const dtMult = parseFloat(doubleTimeMultiplier);

    if (isNaN(otMult) || otMult <= 0) {
      setError('Please enter a valid overtime multiplier greater than zero.');
      return;
    }
    if (isNaN(dtMult) || dtMult <= 0) {
      setError('Please enter a valid double-time multiplier greater than zero.');
      return;
    }

    const calcEntries: WagesResult['entries'] = [];
    let totalPeriod = 0;

    for (const entry of entries) {
      const rate = parseFloat(entry.hourlyRate);
      const regHrs = parseFloat(entry.regularHours);
      const otHrs = parseFloat(entry.overtimeHours);
      const dtHrs = parseFloat(entry.doubleTimeHours);

      if (isNaN(rate) || rate <= 0) {
        setError('Please enter a valid hourly rate greater than zero for each row.');
        return;
      }
      if (isNaN(regHrs) || regHrs < 0) {
        setError('Regular hours cannot be negative.');
        return;
      }
      if (isNaN(otHrs) || otHrs < 0) {
        setError('Overtime hours cannot be negative.');
        return;
      }
      if (isNaN(dtHrs) || dtHrs < 0) {
        setError('Double-time hours cannot be negative.');
        return;
      }

      const regularPay = regHrs * rate;
      const overtimePay = otHrs * rate * otMult;
      const doubleTimePay = dtHrs * rate * dtMult;
      const subtotal = regularPay + overtimePay + doubleTimePay;

      calcEntries.push({
        hourlyRate: rate,
        regularHours: regHrs,
        overtimeHours: otHrs,
        doubleTimeHours: dtHrs,
        regularPay,
        overtimePay,
        doubleTimePay,
        subtotal,
      });

      totalPeriod += subtotal;
    }

    const periodMultiplier = PERIOD_MULTIPLIERS[payPeriod];
    const grossPerYear = totalPeriod * periodMultiplier;
    const grossPerWeek = grossPerYear / 52;
    const grossPerBiWeekly = grossPerYear / 26;
    const grossPerSemiMonthly = grossPerYear / 24;
    const grossPerMonth = grossPerYear / 12;

    setResult({
      entries: calcEntries,
      grossPerPeriod: totalPeriod,
      grossPerWeek,
      grossPerBiWeekly,
      grossPerSemiMonthly,
      grossPerMonth,
      grossPerYear,
      overtimeMultiplier: otMult,
      doubleTimeMultiplier: dtMult,
      payPeriod,
    });
    saveEntry(
      { payPeriod, overtimeMultiplier, doubleTimeMultiplier, firstRate: entries[0]?.hourlyRate ?? '' },
      `${PERIOD_LABELS[payPeriod]}: ${formatCurrency(totalPeriod)}/period — ${formatCurrency(grossPerYear)}/yr`
    );
  };

  const handleRestore = (inputs: { payPeriod: string; overtimeMultiplier: string; doubleTimeMultiplier: string; firstRate: string }) => {
    setPayPeriod(inputs.payPeriod as PayPeriod);
    setOvertimeMultiplier(inputs.overtimeMultiplier);
    setDoubleTimeMultiplier(inputs.doubleTimeMultiplier);
    setResult(null);
  };

  const handleReset = () => {
    nextId = 1;
    setEntries([createEntry()]);
    setOvertimeMultiplier('1.5');
    setDoubleTimeMultiplier('2');
    setPayPeriod('weekly');
    setResult(null);
    setError(null);
  };

  // ------ Render ------

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
      {/* Pay Period */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
            <Clock className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Pay Period
          </Label>
          <Select
            value={payPeriod}
            onValueChange={(v) => {
              setPayPeriod(v as PayPeriod);
              setResult(null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly (52/year)</SelectItem>
              <SelectItem value="bi-weekly">Bi-Weekly (26/year)</SelectItem>
              <SelectItem value="semi-monthly">Semi-Monthly (24/year)</SelectItem>
              <SelectItem value="monthly">Monthly (12/year)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Multiplier Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="otMult" className="text-sm font-medium">
              OT Multiplier
            </Label>
            <Input
              id="otMult"
              type="number"
              min="0"
              step="0.1"
              value={overtimeMultiplier}
              onChange={(e) => {
                setOvertimeMultiplier(e.target.value);
                setResult(null);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Default 1.5x (time-and-a-half)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dtMult" className="text-sm font-medium">
              Double-Time Mult.
            </Label>
            <Input
              id="dtMult"
              type="number"
              min="0"
              step="0.1"
              value={doubleTimeMultiplier}
              onChange={(e) => {
                setDoubleTimeMultiplier(e.target.value);
                setResult(null);
              }}
            />
            <p className="text-xs text-muted-foreground">
              Default 2x (double-time)
            </p>
          </div>
        </div>

        {/* Rate Entries */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Hourly Rate Entries
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEntry}
              className="gap-1.5 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Rate Row
            </Button>
          </div>

          {entries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  Rate #{idx + 1}
                </Badge>
                {entries.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`rate-${entry.id}`} className="text-xs font-medium">
                  Hourly Rate ($)
                </Label>
                <Input
                  id={`rate-${entry.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 25.00"
                  value={entry.hourlyRate}
                  onChange={(e) =>
                    updateEntry(entry.id, 'hourlyRate', e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label
                    htmlFor={`reg-${entry.id}`}
                    className="text-xs font-medium"
                  >
                    Reg Hours
                  </Label>
                  <Input
                    id={`reg-${entry.id}`}
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="40"
                    value={entry.regularHours}
                    onChange={(e) =>
                      updateEntry(entry.id, 'regularHours', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`ot-${entry.id}`}
                    className="text-xs font-medium"
                  >
                    OT Hours
                  </Label>
                  <Input
                    id={`ot-${entry.id}`}
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="0"
                    value={entry.overtimeHours}
                    onChange={(e) =>
                      updateEntry(entry.id, 'overtimeHours', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`dt-${entry.id}`}
                    className="text-xs font-medium"
                  >
                    DT Hours
                  </Label>
                  <Input
                    id={`dt-${entry.id}`}
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="0"
                    value={entry.doubleTimeHours}
                    onChange={(e) =>
                      updateEntry(entry.id, 'doubleTimeHours', e.target.value)
                    }
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCalculate}
              className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
              size="lg"
            >
              <Banknote className="h-4 w-4 mr-2" />
              Calculate Wages
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
        </div>
      </div>

      {/* Results */}
      {/* UnitToggle — show pay-period equivalents */}
        {(() => {
          const _hr = parseFloat(entries[0]?.hourlyRate) || 0;
          if (!_hr) return null;
          return (
            <div className="px-4 sm:px-6 mt-3 mb-1">
              <UnitToggle hourlyRate={_hr} />
            </div>
          );
        })()}
        {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 px-4 sm:px-6"
          aria-live="polite"
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            {/* Main Result */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Gross Wages per {PERIOD_LABELS[result.payPeriod].replace('-', '- ')} Period
              </p>
              <p className="text-4xl font-bold text-emerald-600">
                {formatCurrency(result.grossPerPeriod)}
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 px-3 py-1 text-sm font-medium"
                >
                  {formatCurrency(result.grossPerYear)}/year
                </Badge>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const totalHours = result.entries.reduce((acc, curr) => acc + curr.regularHours + curr.overtimeHours + curr.doubleTimeHours, 0);
                    setCompareA({
                      grossPeriod: result.grossPerPeriod,
                      grossYear: result.grossPerYear,
                      totalHours,
                      label: `${formatCurrency(result.grossPerPeriod)} / ${PERIOD_LABELS[result.payPeriod]}`
                    });
                  }}
                  className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary"
                >
                  {compareA ? '↺ Set A' : '+ Save A'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const totalHours = result.entries.reduce((acc, curr) => acc + curr.regularHours + curr.overtimeHours + curr.doubleTimeHours, 0);
                    setCompareB({
                      grossPeriod: result.grossPerPeriod,
                      grossYear: result.grossPerYear,
                      totalHours,
                      label: `${formatCurrency(result.grossPerPeriod)} / ${PERIOD_LABELS[result.payPeriod]}`
                    });
                  }}
                  className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600"
                >
                  {compareB ? '↺ Set B' : '+ Save B'}
                </Button>
              </div>
            </div>

            {/* Equivalent Wages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Weekly', value: result.grossPerWeek },
                { label: 'Bi-Weekly', value: result.grossPerBiWeekly },
                { label: 'Semi-Monthly', value: result.grossPerSemiMonthly },
                { label: 'Monthly', value: result.grossPerMonth },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="rounded-xl bg-background border border-border/50 p-3 text-center"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-emerald-600">
                    {formatCurrency(item.value)}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Entry Breakdown Table */}
            {result.entries.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Pay Breakdown by Rate
                </p>
                <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/30">
                          <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Rate
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Reg Hrs
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            OT Hrs
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            DT Hrs
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Regular
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            OT Pay
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            DT Pay
                          </th>
                          <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {result.entries.map((entry, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2.5 font-medium">
                              {formatCurrency(entry.hourlyRate)}/hr
                            </td>
                            <td className="text-right px-3 py-2.5 text-muted-foreground">
                              {entry.regularHours}
                            </td>
                            <td className="text-right px-3 py-2.5 text-muted-foreground">
                              {entry.overtimeHours}
                            </td>
                            <td className="text-right px-3 py-2.5 text-muted-foreground">
                              {entry.doubleTimeHours}
                            </td>
                            <td className="text-right px-3 py-2.5">
                              {formatCurrency(entry.regularPay)}
                            </td>
                            <td className="text-right px-3 py-2.5 text-amber-600">
                              {formatCurrency(entry.overtimePay)}
                            </td>
                            <td className="text-right px-3 py-2.5 text-red-500">
                              {formatCurrency(entry.doubleTimePay)}
                            </td>
                            <td className="text-right px-3 py-2.5 font-semibold">
                              {formatCurrency(entry.subtotal)}
                            </td>
                          </tr>
                        ))}
                        {/* Totals */}
                        <tr className="bg-emerald-500/5 font-bold">
                          <td className="px-3 py-2.5" colSpan={4}>
                            Total
                          </td>
                          <td className="text-right px-3 py-2.5">
                            {formatCurrency(
                              result.entries.reduce((s, e) => s + e.regularPay, 0)
                            )}
                          </td>
                          <td className="text-right px-3 py-2.5 text-amber-600">
                            {formatCurrency(
                              result.entries.reduce((s, e) => s + e.overtimePay, 0)
                            )}
                          </td>
                          <td className="text-right px-3 py-2.5 text-red-500">
                            {formatCurrency(
                              result.entries.reduce(
                                (s, e) => s + e.doubleTimePay,
                                0
                              )
                            )}
                          </td>
                          <td className="text-right px-3 py-2.5 text-emerald-600">
                            {formatCurrency(result.grossPerPeriod)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Pay Category Breakdown */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <PieChartIcon className="h-4.5 w-4.5 text-primary" />
                Regular vs Overtime vs Double-Time
              </p>
              {(() => {
                const totalReg = result.entries.reduce(
                  (s, e) => s + e.regularPay,
                  0
                );
                const totalOT = result.entries.reduce(
                  (s, e) => s + e.overtimePay,
                  0
                );
                const totalDT = result.entries.reduce(
                  (s, e) => s + e.doubleTimePay,
                  0
                );

                const data = [
                  { name: 'Regular', value: totalReg, color: '#10b981' },
                  ...(totalOT > 0 ? [{ name: 'Overtime', value: totalOT, color: '#f59e0b' }] : []),
                  ...(totalDT > 0 ? [{ name: 'Double-Time', value: totalDT, color: '#ef4444' }] : []),
                ];

                return (
                  <div className="h-72 w-full rounded-xl bg-muted/20 border border-border/50 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={85}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
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
                );
              })()}
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                <strong>Note:</strong> These calculations show gross wages before any
                tax withholding or deductions. Your actual take-home pay will be
                lower after federal/state taxes, Social Security (6.2%), Medicare
                (1.45%), and any benefit contributions. Use our{' '}
                <strong>Payroll Deduction Calculator</strong> to estimate net pay.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Gross Pay (Period)', valueA: formatCurrency(compareA.grossPeriod), valueB: formatCurrency(compareB.grossPeriod), numA: compareA.grossPeriod, numB: compareB.grossPeriod },
          { label: 'Gross Pay (Annual)', valueA: formatCurrency(compareA.grossYear),   valueB: formatCurrency(compareB.grossYear),   numA: compareA.grossYear,   numB: compareB.grossYear },
          { label: 'Total Weekly Hours', valueA: `${compareA.totalHours}h`,           valueB: `${compareB.totalHours}h`,           numA: compareA.totalHours,   numB: compareB.totalHours },
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
