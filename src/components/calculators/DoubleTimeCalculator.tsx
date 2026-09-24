'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, AlertCircle, Info, Scale } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface DoubleTimeSnapshot {
  regularRate: number;
  doubleTimeRate: number;
  regularHours: number;
  timeAndHalfHours: number;
  doubleTimeHours: number;
  regularPay: number;
  timeAndHalfPay: number;
  doubleTimePay: number;
  totalPay: number;
  totalHours: number;
  effectiveRate: number;
  label: string;
}

export default function DoubleTimeCalculator() {
  const [regularRate, setRegularRate] = useState('');
  const [regularHours, setRegularHours] = useState('40');
  const [timeAndHalfHours, setTimeAndHalfHours] = useState('0');
  const [doubleTimeHours, setDoubleTimeHours] = useState('4');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<DoubleTimeSnapshot | null>(null);
  const [compareB, setCompareB] = useState<DoubleTimeSnapshot | null>(null);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    regularRate: string;
    regularHours: string;
    timeAndHalfHours: string;
    doubleTimeHours: string;
  }>('double-time-calculator');

  const rateNum = parseFloat(regularRate) || 0;
  const regHrs = parseFloat(regularHours) || 0;
  const thHrs = parseFloat(timeAndHalfHours) || 0;
  const dtHrs = parseFloat(doubleTimeHours) || 0;

  // Rates
  const dtRate = rateNum * 2;
  const thRate = rateNum * 1.5;

  // Earnings
  const regPay = rateNum * regHrs;
  const thPay = thRate * thHrs;
  const dtPay = dtRate * dtHrs;
  const total = regPay + thPay + dtPay;
  const totalHours = regHrs + thHrs + dtHrs;
  const straightBasePay = rateNum * totalHours;
  const overtimePremium = Math.max(0, total - straightBasePay);
  const effectiveRate = totalHours > 0 ? total / totalHours : 0;

  const handleTryExample = () => {
    setRegularRate('26.00');
    setRegularHours('40');
    setTimeAndHalfHours('4'); // e.g. California hours 9-12 or standard OT
    setDoubleTimeHours('6'); // California hours over 12 or 7th day
    setCalculated(false);
  };

  const handleCaliforniaShiftPreset = () => {
    // 14-hour California single-day shift example
    setRegularRate('25.00');
    setRegularHours('8'); // First 8 hrs = straight time
    setTimeAndHalfHours('4'); // Hours 9-12 = 1.5x
    setDoubleTimeHours('2'); // Hours 13-14 = 2.0x
    setCalculated(true);
  };

  const handleCalculate = () => {
    if (rateNum > 0 && (regHrs > 0 || dtHrs > 0 || thHrs > 0)) {
      setCalculated(true);
      saveEntry(
        { regularRate, regularHours, timeAndHalfHours, doubleTimeHours },
        `${formatCurrency(rateNum)}/hr · ${dtHrs}h DT (2×) + ${thHrs}h 1.5× · Total: ${formatCurrency(total)}`,
      );
    }
  };

  const handleReset = () => {
    setRegularRate('');
    setRegularHours('40');
    setTimeAndHalfHours('0');
    setDoubleTimeHours('4');
    setCalculated(false);
  };

  const handleRestore = (i: {
    regularRate: string;
    regularHours: string;
    timeAndHalfHours?: string;
    doubleTimeHours: string;
  }) => {
    setRegularRate(i.regularRate);
    setRegularHours(i.regularHours);
    setTimeAndHalfHours(i.timeAndHalfHours || '0');
    setDoubleTimeHours(i.doubleTimeHours);
    setCalculated(true);
  };

  const snap = (): DoubleTimeSnapshot => ({
    regularRate: rateNum,
    doubleTimeRate: dtRate,
    regularHours: regHrs,
    timeAndHalfHours: thHrs,
    doubleTimeHours: dtHrs,
    regularPay: regPay,
    timeAndHalfPay: thPay,
    doubleTimePay: dtPay,
    totalPay: total,
    totalHours,
    effectiveRate,
    label: `${formatCurrency(rateNum)}/hr · ${dtHrs}h DT`,
  });

  const chartData = [
    { name: 'Straight Regular', amount: regPay, fill: '#10b981' },
    { name: 'Time-and-a-Half (1.5×)', amount: thPay, fill: '#f59e0b' },
    { name: 'Double Time (2.0×)', amount: dtPay, fill: '#f43f5e' },
  ].filter((d) => d.amount > 0);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {rateNum > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-lg bg-rose-500/5 border border-rose-500/20 p-3"
          >
            <Zap className="h-4 w-4 text-rose-600 shrink-0" />
            <p className="text-sm text-rose-700 dark:text-rose-300">
              Straight rate: <strong>{formatCurrency(rateNum)}/hr</strong> · Double-Time (2.0×):{' '}
              <strong>{formatCurrency(dtRate)}/hr</strong>
              {thHrs > 0 && (
                <>
                  {' '}· 1.5× Overtime: <strong>{formatCurrency(thRate)}/hr</strong>
                </>
              )}
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Regular Rate */}
          <div className="space-y-2">
            <Label htmlFor="dt-rate" className="font-semibold text-foreground">
              Regular Hourly Rate
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
              <Input
                id="dt-rate"
                type="number"
                step="0.01"
                min="0"
                placeholder="25.00"
                value={regularRate}
                onChange={(e) => {
                  setRegularRate(e.target.value);
                  setCalculated(false);
                }}
                className="pl-7"
              />
            </div>
            <p className="text-xs text-muted-foreground">Standard straight-time rate (1.0×).</p>
          </div>

          {/* Regular Hours */}
          <div className="space-y-2">
            <Label htmlFor="dt-reg-hours" className="font-semibold text-foreground">
              Straight Hours (1.0×)
            </Label>
            <Input
              id="dt-reg-hours"
              type="number"
              step="0.5"
              min="0"
              placeholder="40"
              value={regularHours}
              onChange={(e) => {
                setRegularHours(e.target.value);
                setCalculated(false);
              }}
            />
            <p className="text-xs text-muted-foreground">Standard 1x hours (e.g. 40h/wk or 8h/day).</p>
          </div>

          {/* Time-and-a-Half Hours (1.5x) */}
          <div className="space-y-2">
            <Label htmlFor="dt-th-hours" className="font-semibold text-foreground">
              1.5× Overtime Hours
            </Label>
            <Input
              id="dt-th-hours"
              type="number"
              step="0.5"
              min="0"
              placeholder="0"
              value={timeAndHalfHours}
              onChange={(e) => {
                setTimeAndHalfHours(e.target.value);
                setCalculated(false);
              }}
            />
            <p className="text-xs text-muted-foreground">Optional: Hours 9–12 or hours 41–48.</p>
          </div>

          {/* Double-Time Hours (2.0x) */}
          <div className="space-y-2">
            <Label htmlFor="dt-hours" className="font-semibold text-foreground">
              Double-Time Hours (2.0×)
            </Label>
            <Input
              id="dt-hours"
              type="number"
              step="0.5"
              min="0"
              placeholder="4"
              value={doubleTimeHours}
              onChange={(e) => {
                setDoubleTimeHours(e.target.value);
                setCalculated(false);
              }}
            />
            <p className="text-xs text-muted-foreground">Hours over 12/day, 7th day, or holiday.</p>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-muted-foreground font-medium flex items-center gap-1">
            <Scale className="h-3.5 w-3.5 text-rose-600" />
            Quick Presets:
          </span>
          <button
            type="button"
            onClick={handleCaliforniaShiftPreset}
            className="px-2.5 py-1 rounded-md bg-muted hover:bg-accent text-foreground transition-colors border border-border/60"
          >
            California 14-Hour Day (8h Reg + 4h 1.5× + 2h 2×)
          </button>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCalculate}
              disabled={rateNum <= 0 || (dtHrs <= 0 && regHrs <= 0 && thHrs <= 0)}
              className="bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white shadow-lg shadow-rose-500/25 flex-1 sm:flex-none"
            >
              Calculate Double Time
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">
              Reset
            </Button>
          </div>
        </div>

        {calculated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="result-display mt-2"
            aria-live="polite"
          >
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Gross Earnings</p>
                <p className="text-4xl sm:text-5xl font-extrabold text-rose-600 tracking-tight">
                  {formatCurrency(total)}
                </p>
                <div className="flex justify-center gap-2 flex-wrap pt-1">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-medium">
                    {formatCurrency(regPay)} straight time ({regHrs}h)
                  </Badge>
                  {thHrs > 0 && (
                    <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600 font-medium">
                      {formatCurrency(thPay)} 1.5× overtime ({thHrs}h)
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-rose-500/10 border-rose-500/30 text-rose-600 font-medium">
                    {formatCurrency(dtPay)} 2.0× double-time ({dtHrs}h)
                  </Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCompareA(snap())}
                    className="h-7 text-[10px] px-2.5 border-primary/30 bg-primary/5 text-primary"
                  >
                    {compareA ? '↺ Set A' : '+ Save A'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCompareB(snap())}
                    className="h-7 text-[10px] px-2.5 border-amber-500/30 bg-amber-500/5 text-amber-600"
                  >
                    {compareB ? '↺ Set B' : '+ Save B'}
                  </Button>
                </div>
              </div>

              {/* Metric Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Straight Rate', value: `${formatCurrency(rateNum)}/hr`, note: 'Standard base wage' },
                  {
                    label: 'Double-Time Rate',
                    value: `${formatCurrency(dtRate)}/hr`,
                    amber: true,
                    note: '2.0× statutory multiplier',
                  },
                  {
                    label: 'Premium Earnings',
                    value: `+${formatCurrency(overtimePremium)}`,
                    amber: true,
                    note: 'Amount above 1.0x pay',
                  },
                  {
                    label: 'Blended Effective Rate',
                    value: `${formatCurrency(effectiveRate)}/hr`,
                    note: `${totalHours} total hours worked`,
                  },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-3.5 text-center shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-base sm:text-lg font-bold ${m.amber ? 'text-rose-600' : 'text-foreground'}`}>
                      {m.value}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{m.note}</p>
                  </div>
                ))}
              </div>

              {/* Bar Chart Breakdown */}
              {chartData.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                    Earnings Distribution
                  </h4>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                        <RechartsTooltip
                          formatter={(v: number) => [formatCurrency(v), 'Pay Tier']}
                          contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                        />
                        <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                          {chartData.map((e, i) => (
                            <Cell key={i} fill={e.fill} />
                          ))}
                        </Bar>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Explanatory callout */}
              <div className="rounded-lg bg-muted/40 border border-border/40 p-3.5 text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Info className="h-3.5 w-3.5 text-rose-600" />
                  Statutory Double-Time Regulations (California Labor Code § 510)
                </div>
                <p>
                  While federal FLSA does not mandate double-time, California mandates <strong>2.0× regular rate of pay</strong> for all hours worked beyond 12 hours in a single workday, and for all hours worked beyond 8 hours on the 7th consecutive day of work in a workweek.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Comparison Drawer */}
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          {
            label: 'Regular Rate',
            valueA: `${formatCurrency(compareA.regularRate)}/hr`,
            valueB: `${formatCurrency(compareB.regularRate)}/hr`,
            numA: compareA.regularRate,
            numB: compareB.regularRate,
          },
          {
            label: 'Double-Time Rate (2×)',
            valueA: `${formatCurrency(compareA.doubleTimeRate)}/hr`,
            valueB: `${formatCurrency(compareB.doubleTimeRate)}/hr`,
            numA: compareA.doubleTimeRate,
            numB: compareB.doubleTimeRate,
          },
          {
            label: 'Straight Regular Pay',
            valueA: formatCurrency(compareA.regularPay),
            valueB: formatCurrency(compareB.regularPay),
            numA: compareA.regularPay,
            numB: compareB.regularPay,
          },
          {
            label: '1.5× Overtime Pay',
            valueA: formatCurrency(compareA.timeAndHalfPay),
            valueB: formatCurrency(compareB.timeAndHalfPay),
            numA: compareA.timeAndHalfPay,
            numB: compareB.timeAndHalfPay,
          },
          {
            label: 'Double-Time Pay',
            valueA: formatCurrency(compareA.doubleTimePay),
            valueB: formatCurrency(compareB.doubleTimePay),
            numA: compareA.doubleTimePay,
            numB: compareB.doubleTimePay,
          },
          {
            label: 'Total Gross Pay',
            valueA: formatCurrency(compareA.totalPay),
            valueB: formatCurrency(compareB.totalPay),
            numA: compareA.totalPay,
            numB: compareB.totalPay,
          },
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel
              rows={rows}
              labelA={compareA.label}
              labelB={compareB.label}
              onClear={() => {
                setCompareA(null);
                setCompareB(null);
              }}
              onSwap={() => {
                const t = compareA;
                setCompareA(compareB);
                setCompareB(t);
              }}
            />
          </div>
        );
      })()}

      <CalcHistoryPanel
        history={history}
        onRestore={handleRestore}
        onClear={clearHistory}
        onDelete={deleteEntry}
      />
    </div>
  );
}
