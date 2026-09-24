'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, AlertCircle, Info, DollarSign, Percent, Clock } from 'lucide-react';
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

type DiffType = 'percent' | 'fixed';

interface NightShiftSnapshot {
  baseRate: number;
  nightHours: number;
  regularHours: number;
  diffType: DiffType;
  diffVal: number;
  nightRate: number;
  nightPremium: number;
  totalPay: number;
  effectiveRate: number;
  label: string;
}

export default function NightShiftDifferentialCalculator() {
  const [baseRate, setBaseRate] = useState('');
  const [diffType, setDiffType] = useState<DiffType>('percent');
  const [differential, setDifferential] = useState('15');
  const [nightHours, setNightHours] = useState('36');
  const [regularHours, setRegularHours] = useState('0');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<NightShiftSnapshot | null>(null);
  const [compareB, setCompareB] = useState<NightShiftSnapshot | null>(null);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    baseRate: string;
    diffType: DiffType;
    differential: string;
    nightHours: string;
    regularHours: string;
  }>('night-shift-differential-calculator');

  const rate = parseFloat(baseRate) || 0;
  const dVal = parseFloat(differential) || 0;
  const nH = parseFloat(nightHours) || 0;
  const regH = parseFloat(regularHours) || 0;

  // Rate calculations
  const nightRate = rate > 0 ? (diffType === 'percent' ? rate * (1 + dVal / 100) : rate + dVal) : 0;
  const premiumPerHour = Math.max(0, nightRate - rate);
  const nightPay = nightRate * nH;
  const regularPay = rate * regH;
  const totalPay = nightPay + regularPay;
  const totalHours = nH + regH;
  const basePay = rate * totalHours;
  const nightPremium = Math.max(0, totalPay - basePay);
  const effectiveRate = totalHours > 0 ? totalPay / totalHours : 0;
  const isOvertimeRisk = totalHours > 40;

  const handleTryExample = () => {
    setBaseRate('32.00');
    setDiffType('fixed');
    setDifferential('4.50'); // $4.50/hr night differential
    setNightHours('36');
    setRegularHours('12');
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (rate > 0 && nH > 0) {
      setCalculated(true);
      const diffLabel = diffType === 'percent' ? `${dVal}%` : `${formatCurrency(dVal)}/hr`;
      saveEntry(
        { baseRate, diffType, differential, nightHours, regularHours },
        `${formatCurrency(rate)}/hr · ${nH}h night (+${diffLabel}) · Total: ${formatCurrency(totalPay)}`,
      );
    }
  };

  const handleReset = () => {
    setBaseRate('');
    setDiffType('percent');
    setDifferential('15');
    setNightHours('36');
    setRegularHours('0');
    setCalculated(false);
  };

  const handleRestore = (i: {
    baseRate: string;
    diffType?: DiffType;
    differential: string;
    nightHours: string;
    regularHours: string;
  }) => {
    setBaseRate(i.baseRate);
    setDiffType(i.diffType || 'percent');
    setDifferential(i.differential);
    setNightHours(i.nightHours);
    setRegularHours(i.regularHours);
    setCalculated(true);
  };

  const snap = (): NightShiftSnapshot => ({
    baseRate: rate,
    nightHours: nH,
    regularHours: regH,
    diffType,
    diffVal: dVal,
    nightRate,
    nightPremium,
    totalPay,
    effectiveRate,
    label: `${formatCurrency(rate)}/hr · ${nH}h night @ ${diffType === 'percent' ? `${dVal}%` : formatCurrency(dVal)}`,
  });

  const chartData = [
    { name: 'Day / Regular Pay', amount: regularPay, fill: '#10b981' },
    { name: 'Night Straight Base', amount: rate * nH, fill: '#6366f1' },
    { name: 'Night Differential Premium', amount: nightPremium, fill: '#8b5cf6' },
  ].filter((d) => d.amount > 0);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {rate > 0 && nH > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-lg bg-violet-500/5 border border-violet-500/20 p-3"
          >
            <Moon className="h-4 w-4 text-violet-600 shrink-0" />
            <p className="text-sm text-violet-700 dark:text-violet-300">
              Base: <strong>{formatCurrency(rate)}/hr</strong> · Night Rate:{' '}
              <strong>{formatCurrency(nightRate)}/hr</strong> (
              {diffType === 'percent' ? `+${dVal}%` : `+${formatCurrency(dVal)}/hr`}) · Night Premium:{' '}
              <strong>{formatCurrency(nightPremium)}</strong>
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Base Hourly Rate */}
          <div className="space-y-2">
            <Label htmlFor="ns-rate" className="font-semibold text-foreground">
              Base Hourly Rate
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
              <Input
                id="ns-rate"
                type="number"
                step="0.25"
                min="0"
                placeholder="25.00"
                value={baseRate}
                onChange={(e) => {
                  setBaseRate(e.target.value);
                  setCalculated(false);
                }}
                className="pl-7"
              />
            </div>
            <p className="text-xs text-muted-foreground">Standard day-shift straight wage before night premium.</p>
          </div>

          {/* Differential Type & Value */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ns-diff" className="font-semibold text-foreground">
                Night Shift Differential
              </Label>
              <div className="flex rounded-md border border-border/60 p-0.5 bg-background">
                <button
                  type="button"
                  onClick={() => setDiffType('percent')}
                  className={`px-2 py-0.5 text-xs font-semibold rounded ${diffType === 'percent' ? 'bg-violet-600 text-white' : 'text-muted-foreground'}`}
                >
                  % Percent
                </button>
                <button
                  type="button"
                  onClick={() => setDiffType('fixed')}
                  className={`px-2 py-0.5 text-xs font-semibold rounded ${diffType === 'fixed' ? 'bg-violet-600 text-white' : 'text-muted-foreground'}`}
                >
                  $/hr Flat
                </button>
              </div>
            </div>
            <div className="relative">
              {diffType === 'fixed' && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
              )}
              <Input
                id="ns-diff"
                type="number"
                step={diffType === 'percent' ? '0.5' : '0.25'}
                min="0"
                placeholder={diffType === 'percent' ? '15' : '3.50'}
                value={differential}
                onChange={(e) => {
                  setDifferential(e.target.value);
                  setCalculated(false);
                }}
                className={diffType === 'fixed' ? 'pl-7' : 'pr-8'}
              />
              {diffType === 'percent' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">%</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {diffType === 'percent' ? 'Typically 10%–15% for graveyard hours (6pm–6am).' : 'Typically +$2.50 to +$5.00/hr in healthcare & nursing.'}
            </p>
          </div>

          {/* Night Shift Hours */}
          <div className="space-y-2">
            <Label htmlFor="ns-hours" className="font-semibold text-foreground">
              Night Shift Hours (Workweek)
            </Label>
            <Input
              id="ns-hours"
              type="number"
              step="0.5"
              min="0"
              placeholder="36"
              value={nightHours}
              onChange={(e) => {
                setNightHours(e.target.value);
                setCalculated(false);
              }}
            />
            <p className="text-xs text-muted-foreground">Hours worked during night shift (e.g. 7pm–7am or 11pm–7am).</p>
          </div>

          {/* Regular Day Hours */}
          <div className="space-y-2">
            <Label htmlFor="ns-reg" className="font-semibold text-foreground">
              Day / Regular Hours (Same Week)
            </Label>
            <Input
              id="ns-reg"
              type="number"
              step="0.5"
              min="0"
              placeholder="0"
              value={regularHours}
              onChange={(e) => {
                setRegularHours(e.target.value);
                setCalculated(false);
              }}
            />
            <p className="text-xs text-muted-foreground">Optional: Standard daytime hours worked in the same workweek.</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCalculate}
              disabled={rate <= 0 || nH <= 0}
              className="bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-600 hover:to-violet-800 text-white shadow-lg shadow-violet-500/25 flex-1 sm:flex-none"
            >
              Calculate Night Shift Pay
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">
              Reset
            </Button>
          </div>
        </div>

        {/* Overtime Interaction Callout */}
        {isOvertimeRisk && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Overtime Threshold Exceeded ({totalHours} Total Hours)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Under federal FLSA regulations (29 C.F.R. § 778.207), hours worked over 40 must be compensated at least 1.5× the <strong>blended regular rate of pay</strong>. Night shift differentials are non-discretionary earnings and must be factored into your overtime calculation.
            </p>
            <div className="pt-1">
              <Link
                href="/calculators/overtime-calculator"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline"
              >
                Calculate FLSA blended overtime on our Overtime Calculator →
              </Link>
            </div>
          </motion.div>
        )}

        {calculated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="result-display mt-2"
            aria-live="polite"
          >
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Gross Earnings</p>
                <p className="text-4xl sm:text-5xl font-extrabold text-violet-600 tracking-tight">
                  {formatCurrency(totalPay)}
                </p>
                <div className="flex justify-center gap-2 flex-wrap pt-1">
                  {regH > 0 && (
                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-medium">
                      {formatCurrency(regularPay)} regular day pay
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/30 text-indigo-600 font-medium">
                    {formatCurrency(rate * nH)} night straight base
                  </Badge>
                  <Badge variant="outline" className="bg-violet-500/10 border-violet-500/30 text-violet-600 font-medium">
                    +{formatCurrency(nightPremium)} night shift differential
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
                  { label: 'Base Rate', value: `${formatCurrency(rate)}/hr`, note: 'Straight daytime rate' },
                  {
                    label: 'Night Rate',
                    value: `${formatCurrency(nightRate)}/hr`,
                    amber: true,
                    note: diffType === 'percent' ? `+${dVal}% premium` : `+${formatCurrency(dVal)}/hr`,
                  },
                  {
                    label: 'Premium per Hour',
                    value: `+${formatCurrency(premiumPerHour)}/hr`,
                    amber: true,
                    note: 'Additional night wage',
                  },
                  {
                    label: 'Effective Rate',
                    value: `${formatCurrency(effectiveRate)}/hr`,
                    note: `${totalHours} total weekly hrs`,
                  },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-3.5 text-center shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-base sm:text-lg font-bold ${m.amber ? 'text-violet-600' : 'text-foreground'}`}>
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
                          formatter={(v: number) => [formatCurrency(v), 'Pay Component']}
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

              {/* Legal & Compliance note */}
              <div className="rounded-lg bg-muted/40 border border-border/40 p-3.5 text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Info className="h-3.5 w-3.5 text-violet-600" />
                  Night Shift Differential Rules
                </div>
                <p>
                  Night shift differentials compensate workers for sleep schedule disruptions during third-shift hours (commonly 6pm to 6am). While the FLSA does not mandate differential rates for private employers, federal wage laws require that any differential earned <strong>must be included in the regular rate</strong> when computing 1.5× overtime.
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
            label: 'Base Rate',
            valueA: `${formatCurrency(compareA.baseRate)}/hr`,
            valueB: `${formatCurrency(compareB.baseRate)}/hr`,
            numA: compareA.baseRate,
            numB: compareB.baseRate,
          },
          {
            label: 'Night Hours',
            valueA: `${compareA.nightHours} hrs`,
            valueB: `${compareB.nightHours} hrs`,
            numA: compareA.nightHours,
            numB: compareB.nightHours,
          },
          {
            label: 'Night Differential',
            valueA: compareA.diffType === 'percent' ? `${compareA.diffVal}%` : `${formatCurrency(compareA.diffVal)}/hr`,
            valueB: compareB.diffType === 'percent' ? `${compareB.diffVal}%` : `${formatCurrency(compareB.diffVal)}/hr`,
          },
          {
            label: 'Night Shift Rate',
            valueA: `${formatCurrency(compareA.nightRate)}/hr`,
            valueB: `${formatCurrency(compareB.nightRate)}/hr`,
            numA: compareA.nightRate,
            numB: compareB.nightRate,
          },
          {
            label: 'Night Premium Earned',
            valueA: formatCurrency(compareA.nightPremium),
            valueB: formatCurrency(compareB.nightPremium),
            numA: compareA.nightPremium,
            numB: compareB.nightPremium,
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
