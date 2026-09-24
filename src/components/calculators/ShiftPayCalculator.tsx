'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, AlertCircle, Info, DollarSign, Percent, Clock } from 'lucide-react';
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

interface ShiftSnapshot {
  baseRate: number;
  totalPay: number;
  basePay: number;
  premiumPay: number;
  totalHours: number;
  effectiveRate: number;
  label: string;
}

export default function ShiftPayCalculator() {
  const [baseRate, setBaseRate] = useState('');
  
  // Shift inputs
  const [dayHours, setDayHours] = useState('40');
  const [dayDiffType, setDayDiffType] = useState<DiffType>('percent');
  const [dayDiffVal, setDayDiffVal] = useState('0');

  const [swingHours, setSwingHours] = useState('0');
  const [swingDiffType, setSwingDiffType] = useState<DiffType>('percent');
  const [swingDiffVal, setSwingDiffVal] = useState('10');

  const [nightHours, setNightHours] = useState('0');
  const [nightDiffType, setNightDiffType] = useState<DiffType>('percent');
  const [nightDiffVal, setNightDiffVal] = useState('15');

  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<ShiftSnapshot | null>(null);
  const [compareB, setCompareB] = useState<ShiftSnapshot | null>(null);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    baseRate: string;
    dayHours: string;
    dayDiffType: DiffType;
    dayDiffVal: string;
    swingHours: string;
    swingDiffType: DiffType;
    swingDiffVal: string;
    nightHours: string;
    nightDiffType: DiffType;
    nightDiffVal: string;
  }>('shift-pay-calculator');

  const rate = parseFloat(baseRate) || 0;
  const dH = parseFloat(dayHours) || 0;
  const dV = parseFloat(dayDiffVal) || 0;
  const sH = parseFloat(swingHours) || 0;
  const sV = parseFloat(swingDiffVal) || 0;
  const nH = parseFloat(nightHours) || 0;
  const nV = parseFloat(nightDiffVal) || 0;

  // Rate calculations
  const dayRate = rate > 0 ? (dayDiffType === 'percent' ? rate * (1 + dV / 100) : rate + dV) : 0;
  const swingRate = rate > 0 ? (swingDiffType === 'percent' ? rate * (1 + sV / 100) : rate + sV) : 0;
  const nightRate = rate > 0 ? (nightDiffType === 'percent' ? rate * (1 + nV / 100) : rate + nV) : 0;

  const dayPay = dayRate * dH;
  const swingPay = swingRate * sH;
  const nightPay = nightRate * nH;
  const totalPay = dayPay + swingPay + nightPay;

  const totalHours = dH + sH + nH;
  const basePay = rate * totalHours;
  const premiumPay = Math.max(0, totalPay - basePay);
  const effectiveRate = totalHours > 0 ? totalPay / totalHours : 0;
  const isOvertimeRisk = totalHours > 40;

  const handleTryExample = () => {
    setBaseRate('24.50');
    setDayHours('40');
    setDayDiffType('percent');
    setDayDiffVal('0');

    setSwingHours('12');
    setSwingDiffType('fixed');
    setSwingDiffVal('2.50'); // $2.50/hr flat addition

    setNightHours('8');
    setNightDiffType('percent');
    setNightDiffVal('15'); // 15% night addition
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (rate > 0 && totalHours > 0) {
      setCalculated(true);
      saveEntry(
        {
          baseRate,
          dayHours,
          dayDiffType,
          dayDiffVal,
          swingHours,
          swingDiffType,
          swingDiffVal,
          nightHours,
          nightDiffType,
          nightDiffVal,
        },
        `${formatCurrency(rate)}/hr · ${totalHours}h · Total: ${formatCurrency(totalPay)}`,
      );
    }
  };

  const handleReset = () => {
    setBaseRate('');
    setDayHours('40');
    setDayDiffType('percent');
    setDayDiffVal('0');
    setSwingHours('0');
    setSwingDiffType('percent');
    setSwingDiffVal('10');
    setNightHours('0');
    setNightDiffType('percent');
    setNightDiffVal('15');
    setCalculated(false);
  };

  const handleRestore = (i: {
    baseRate: string;
    dayHours: string;
    dayDiffType?: DiffType;
    dayDiffVal: string;
    swingHours: string;
    swingDiffType?: DiffType;
    swingDiffVal: string;
    nightHours: string;
    nightDiffType?: DiffType;
    nightDiffVal: string;
  }) => {
    setBaseRate(i.baseRate);
    setDayHours(i.dayHours);
    setDayDiffType(i.dayDiffType || 'percent');
    setDayDiffVal(i.dayDiffVal);
    setSwingHours(i.swingHours);
    setSwingDiffType(i.swingDiffType || 'percent');
    setSwingDiffVal(i.swingDiffVal);
    setNightHours(i.nightHours);
    setNightDiffType(i.nightDiffType || 'percent');
    setNightDiffVal(i.nightDiffVal);
    setCalculated(true);
  };

  const snap = (): ShiftSnapshot => ({
    baseRate: rate,
    totalPay,
    basePay,
    premiumPay,
    totalHours,
    effectiveRate,
    label: `${formatCurrency(rate)}/hr · ${totalHours}h`,
  });

  const chartData = [
    { name: 'Day Shift', amount: dayPay, fill: '#10b981' },
    { name: 'Swing Shift', amount: swingPay, fill: '#f59e0b' },
    { name: 'Night Shift', amount: nightPay, fill: '#8b5cf6' },
  ].filter((d) => d.amount > 0);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {rate > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3"
          >
            <CalendarClock className="h-4 w-4 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Base: <strong>{formatCurrency(rate)}/hr</strong>
              {swingRate > rate && (
                <>
                  {' '}· Swing:{' '}
                  <strong>{formatCurrency(swingRate)}/hr</strong> (
                  {swingDiffType === 'percent' ? `+${sV}%` : `+${formatCurrency(sV)}/hr`})
                </>
              )}
              {nightRate > rate && (
                <>
                  {' '}· Night:{' '}
                  <strong>{formatCurrency(nightRate)}/hr</strong> (
                  {nightDiffType === 'percent' ? `+${nV}%` : `+${formatCurrency(nV)}/hr`})
                </>
              )}
            </p>
          </motion.div>
        )}

        <div className="space-y-2">
          <Label htmlFor="base-rate" className="font-semibold text-foreground">
            Base Hourly Rate
          </Label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
            <Input
              id="base-rate"
              type="number"
              step="0.25"
              min="0"
              placeholder="20.00"
              value={baseRate}
              onChange={(e) => {
                setBaseRate(e.target.value);
                setCalculated(false);
              }}
              className="pl-7"
            />
          </div>
          <p className="text-xs text-muted-foreground">The standard hourly wage before any shift premium or differential.</p>
        </div>

        {/* 3 Shift Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Day Shift */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Day Shift (1st)</h4>
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-mono">
                {formatCurrency(dayRate)}/hr
              </Badge>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="day-hours" className="text-xs">Hours Worked</Label>
              <Input
                id="day-hours"
                type="number"
                step="0.5"
                min="0"
                placeholder="40"
                value={dayHours}
                onChange={(e) => {
                  setDayHours(e.target.value);
                  setCalculated(false);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="day-diff" className="text-xs">Shift Differential</Label>
                <div className="flex rounded-md border border-border/60 p-0.5 bg-background">
                  <button
                    type="button"
                    onClick={() => setDayDiffType('percent')}
                    className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${dayDiffType === 'percent' ? 'bg-emerald-600 text-white' : 'text-muted-foreground'}`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => setDayDiffType('fixed')}
                    className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${dayDiffType === 'fixed' ? 'bg-emerald-600 text-white' : 'text-muted-foreground'}`}
                  >
                    $/hr
                  </button>
                </div>
              </div>
              <div className="relative">
                {dayDiffType === 'fixed' && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>}
                <Input
                  id="day-diff"
                  type="number"
                  step={dayDiffType === 'percent' ? '0.5' : '0.25'}
                  min="0"
                  placeholder="0"
                  value={dayDiffVal}
                  onChange={(e) => {
                    setDayDiffVal(e.target.value);
                    setCalculated(false);
                  }}
                  className={dayDiffType === 'fixed' ? 'pl-6' : ''}
                />
              </div>
            </div>
          </div>

          {/* Swing Shift */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-300">Swing Shift (2nd)</h4>
              <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600 font-mono">
                {formatCurrency(swingRate)}/hr
              </Badge>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="swing-hours" className="text-xs">Hours Worked</Label>
              <Input
                id="swing-hours"
                type="number"
                step="0.5"
                min="0"
                placeholder="0"
                value={swingHours}
                onChange={(e) => {
                  setSwingHours(e.target.value);
                  setCalculated(false);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="swing-diff" className="text-xs">Shift Differential</Label>
                <div className="flex rounded-md border border-border/60 p-0.5 bg-background">
                  <button
                    type="button"
                    onClick={() => setSwingDiffType('percent')}
                    className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${swingDiffType === 'percent' ? 'bg-amber-600 text-white' : 'text-muted-foreground'}`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => setSwingDiffType('fixed')}
                    className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${swingDiffType === 'fixed' ? 'bg-amber-600 text-white' : 'text-muted-foreground'}`}
                  >
                    $/hr
                  </button>
                </div>
              </div>
              <div className="relative">
                {swingDiffType === 'fixed' && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>}
                <Input
                  id="swing-diff"
                  type="number"
                  step={swingDiffType === 'percent' ? '0.5' : '0.25'}
                  min="0"
                  placeholder="10"
                  value={swingDiffVal}
                  onChange={(e) => {
                    setSwingDiffVal(e.target.value);
                    setCalculated(false);
                  }}
                  className={swingDiffType === 'fixed' ? 'pl-6' : ''}
                />
              </div>
            </div>
          </div>

          {/* Night Shift */}
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-violet-700 dark:text-violet-300">Night Shift (3rd)</h4>
              <Badge variant="outline" className="bg-violet-500/10 border-violet-500/30 text-violet-600 font-mono">
                {formatCurrency(nightRate)}/hr
              </Badge>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="night-hours" className="text-xs">Hours Worked</Label>
              <Input
                id="night-hours"
                type="number"
                step="0.5"
                min="0"
                placeholder="0"
                value={nightHours}
                onChange={(e) => {
                  setNightHours(e.target.value);
                  setCalculated(false);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="night-diff" className="text-xs">Shift Differential</Label>
                <div className="flex rounded-md border border-border/60 p-0.5 bg-background">
                  <button
                    type="button"
                    onClick={() => setNightDiffType('percent')}
                    className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${nightDiffType === 'percent' ? 'bg-violet-600 text-white' : 'text-muted-foreground'}`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => setNightDiffType('fixed')}
                    className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${nightDiffType === 'fixed' ? 'bg-violet-600 text-white' : 'text-muted-foreground'}`}
                  >
                    $/hr
                  </button>
                </div>
              </div>
              <div className="relative">
                {nightDiffType === 'fixed' && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>}
                <Input
                  id="night-diff"
                  type="number"
                  step={nightDiffType === 'percent' ? '0.5' : '0.25'}
                  min="0"
                  placeholder="15"
                  value={nightDiffVal}
                  onChange={(e) => {
                    setNightDiffVal(e.target.value);
                    setCalculated(false);
                  }}
                  className={nightDiffType === 'fixed' ? 'pl-6' : ''}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCalculate}
              disabled={rate <= 0 || totalHours <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none"
            >
              Calculate Shift Pay
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">
              Reset
            </Button>
          </div>
        </div>

        {/* Overtime Interaction Callout (when hours > 40) */}
        {totalHours > 40 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Overtime Threshold Exceeded ({totalHours} Hours Worked)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Under the Fair Labor Standards Act (FLSA), all non-exempt hours worked over 40 in a workweek must be compensated at least <strong>1.5× your regular rate</strong>. Because shift differentials must be included in your regular rate of pay when calculating overtime, your actual earnings may be higher.
            </p>
            <div className="pt-1">
              <Link
                href="/calculators/overtime-calculator"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline"
              >
                Use our Overtime Calculator to calculate FLSA blended overtime rate →
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
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Gross Earnings</p>
                <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600 tracking-tight">
                  {formatCurrency(totalPay)}
                </p>
                <div className="flex justify-center gap-2 flex-wrap pt-1">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-medium">
                    {formatCurrency(basePay)} straight base
                  </Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600 font-medium">
                    +{formatCurrency(premiumPay)} shift differential premium
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

              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Total Hours', value: `${totalHours} hrs`, note: `${dH}d / ${sH}s / ${nH}n` },
                  { label: 'Base Rate', value: `${formatCurrency(rate)}/hr`, note: 'Standard rate' },
                  {
                    label: 'Effective Rate',
                    value: `${formatCurrency(effectiveRate)}/hr`,
                    amber: true,
                    note: 'Blended hourly avg',
                  },
                  {
                    label: 'Differential Boost',
                    value: `${basePay > 0 ? ((premiumPay / basePay) * 100).toFixed(1) : '0.0'}%`,
                    amber: true,
                    note: 'Above base pay',
                  },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-3.5 text-center shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className={`text-base sm:text-lg font-bold ${m.amber ? 'text-amber-600' : 'text-foreground'}`}>
                      {m.value}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{m.note}</p>
                  </div>
                ))}
              </div>

              {/* Earnings Distribution Breakdown Chart */}
              {chartData.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
                    Gross Earnings by Shift Category
                  </h4>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                        <RechartsTooltip
                          formatter={(v: number) => [formatCurrency(v), 'Shift Earnings']}
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
                  <Info className="h-3.5 w-3.5 text-emerald-600" />
                  FLSA &amp; Shift Differential Guidelines
                </div>
                <p>
                  Employers offer shift differentials (either as a percentage or fixed $/hour premium) for evening, night, or weekend shifts. Under the Fair Labor Standards Act (FLSA), shift differentials are non-discretionary wage additions and <strong>must be factored into your regular rate of pay</strong> if you work overtime.
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
            label: 'Total Hours',
            valueA: `${compareA.totalHours} hrs`,
            valueB: `${compareB.totalHours} hrs`,
            numA: compareA.totalHours,
            numB: compareB.totalHours,
          },
          {
            label: 'Base Straight Pay',
            valueA: formatCurrency(compareA.basePay),
            valueB: formatCurrency(compareB.basePay),
            numA: compareA.basePay,
            numB: compareB.basePay,
          },
          {
            label: 'Shift Differential Premium',
            valueA: formatCurrency(compareA.premiumPay),
            valueB: formatCurrency(compareB.premiumPay),
            numA: compareA.premiumPay,
            numB: compareB.premiumPay,
          },
          {
            label: 'Effective Hourly Rate',
            valueA: `${formatCurrency(compareA.effectiveRate)}/hr`,
            valueB: `${formatCurrency(compareB.effectiveRate)}/hr`,
            numA: compareA.effectiveRate,
            numB: compareB.effectiveRate,
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
