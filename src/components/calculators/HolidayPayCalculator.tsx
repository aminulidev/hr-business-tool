'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PartyPopper, AlertCircle, Info, Calendar, Sparkles } from 'lucide-react';
import TryExample from './TryExample';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface HolidaySnapshot {
  baseRate: number;
  holidayMultiplier: number;
  holidayHours: number;
  regularHours: number;
  holidayPay: number;
  regularPay: number;
  holidayPremium: number;
  totalPay: number;
  totalHours: number;
  effectiveRate: number;
  label: string;
}

export default function HolidayPayCalculator() {
  const [baseRate, setBaseRate] = useState('');
  const [holidayHours, setHolidayHours] = useState('8');
  const [multiplier, setMultiplier] = useState('2');
  const [customMultiplier, setCustomMultiplier] = useState('');
  const [regularHours, setRegularHours] = useState('32');
  const [holidayName, setHolidayName] = useState('Christmas / Thanksgiving');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<HolidaySnapshot | null>(null);
  const [compareB, setCompareB] = useState<HolidaySnapshot | null>(null);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    baseRate: string;
    holidayHours: string;
    multiplier: string;
    customMultiplier: string;
    regularHours: string;
    holidayName: string;
  }>('holiday-pay-calculator');

  const rate = parseFloat(baseRate) || 0;
  const hH = parseFloat(holidayHours) || 0;
  const regH = parseFloat(regularHours) || 0;

  // Resolve actual multiplier (preset or custom)
  const mult = multiplier === 'custom' ? parseFloat(customMultiplier) || 1 : parseFloat(multiplier) || 1;

  const holidayRate = rate * mult;
  const holidayPay = holidayRate * hH;
  const regularPay = rate * regH;
  const totalPay = holidayPay + regularPay;
  const totalHours = hH + regH;
  const straightBasePay = rate * totalHours;
  const holidayPremium = Math.max(0, holidayPay - rate * hH);
  const effectiveRate = totalHours > 0 ? totalPay / totalHours : 0;
  const isOvertimeRisk = totalHours > 40;

  const handleTryExample = () => {
    setBaseRate('28.00');
    setHolidayHours('8');
    setMultiplier('2'); // Double time
    setCustomMultiplier('');
    setRegularHours('36'); // Total 44 hours -> FLSA OT trigger
    setHolidayName('Thanksgiving Day');
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (rate > 0 && hH > 0) {
      setCalculated(true);
      saveEntry(
        { baseRate, holidayHours, multiplier, customMultiplier, regularHours, holidayName },
        `${formatCurrency(rate)}/hr · ${hH}h @ ${mult}× (${holidayName}) · Total: ${formatCurrency(totalPay)}`,
      );
    }
  };

  const handleReset = () => {
    setBaseRate('');
    setHolidayHours('8');
    setMultiplier('2');
    setCustomMultiplier('');
    setRegularHours('32');
    setHolidayName('Christmas / Thanksgiving');
    setCalculated(false);
  };

  const handleRestore = (i: {
    baseRate: string;
    holidayHours: string;
    multiplier: string;
    customMultiplier?: string;
    regularHours: string;
    holidayName?: string;
  }) => {
    setBaseRate(i.baseRate);
    setHolidayHours(i.holidayHours);
    setMultiplier(i.multiplier);
    setCustomMultiplier(i.customMultiplier || '');
    setRegularHours(i.regularHours);
    setHolidayName(i.holidayName || 'Recognized Holiday');
    setCalculated(true);
  };

  const snap = (): HolidaySnapshot => ({
    baseRate: rate,
    holidayMultiplier: mult,
    holidayHours: hH,
    regularHours: regH,
    holidayPay,
    regularPay,
    holidayPremium,
    totalPay,
    totalHours,
    effectiveRate,
    label: `${formatCurrency(rate)}/hr · ${hH}h @ ${mult}×`,
  });

  const chartData = [
    { name: 'Regular Non-Holiday', amount: regularPay, fill: '#10b981' },
    { name: 'Holiday Straight Base', amount: rate * hH, fill: '#0ea5e9' },
    { name: 'Holiday Premium Bonus', amount: holidayPremium, fill: '#f59e0b' },
  ].filter((d) => d.amount > 0);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {rate > 0 && hH > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-lg bg-amber-500/5 border border-amber-500/20 p-3"
          >
            <PartyPopper className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Base: <strong>{formatCurrency(rate)}/hr</strong> · Holiday Rate:{' '}
              <strong>{formatCurrency(holidayRate)}/hr</strong> ({mult}×) · Holiday Pay:{' '}
              <strong>{formatCurrency(holidayPay)}</strong>
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Base Hourly Rate */}
          <div className="space-y-2">
            <Label htmlFor="hp-rate" className="font-semibold text-foreground">
              Base Hourly Rate
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
              <Input
                id="hp-rate"
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
            <p className="text-xs text-muted-foreground">Standard straight-time hourly wage before holiday premiums.</p>
          </div>

          {/* Holiday Multiplier */}
          <div className="space-y-2">
            <Label htmlFor="hp-mult" className="font-semibold text-foreground">
              Holiday Pay Multiplier
            </Label>
            <div className="flex gap-2">
              <Select
                value={multiplier}
                onValueChange={(v) => {
                  setMultiplier(v);
                  setCalculated(false);
                }}
              >
                <SelectTrigger id="hp-mult" className="flex-1">
                  <SelectValue placeholder="2×" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.25">1.25× (25% premium)</SelectItem>
                  <SelectItem value="1.5">1.5× (Time-and-a-half)</SelectItem>
                  <SelectItem value="2">2.0× (Double time)</SelectItem>
                  <SelectItem value="2.5">2.5× (Double-time-and-a-half)</SelectItem>
                  <SelectItem value="3">3.0× (Triple time)</SelectItem>
                  <SelectItem value="custom">Custom Multiplier...</SelectItem>
                </SelectContent>
              </Select>
              {multiplier === 'custom' && (
                <div className="relative w-28 shrink-0">
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    placeholder="1.75"
                    value={customMultiplier}
                    onChange={(e) => {
                      setCustomMultiplier(e.target.value);
                      setCalculated(false);
                    }}
                    className="pr-6"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">×</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Most employers offer 1.5× or 2.0×. Union contracts often provide 2.5× or 3.0×.
            </p>
          </div>

          {/* Holiday Hours Worked */}
          <div className="space-y-2">
            <Label htmlFor="hp-hours" className="font-semibold text-foreground">
              Holiday Hours Worked
            </Label>
            <Input
              id="hp-hours"
              type="number"
              step="0.5"
              min="0"
              placeholder="8"
              value={holidayHours}
              onChange={(e) => {
                setHolidayHours(e.target.value);
                setCalculated(false);
              }}
            />
            <p className="text-xs text-muted-foreground">Actual hours worked during the recognized holiday calendar day.</p>
          </div>

          {/* Regular Non-Holiday Hours */}
          <div className="space-y-2">
            <Label htmlFor="hp-reg" className="font-semibold text-foreground">
              Regular Hours (Same Workweek)
            </Label>
            <Input
              id="hp-reg"
              type="number"
              step="0.5"
              min="0"
              placeholder="32"
              value={regularHours}
              onChange={(e) => {
                setRegularHours(e.target.value);
                setCalculated(false);
              }}
            />
            <p className="text-xs text-muted-foreground">Standard non-holiday hours worked in the remainder of the week.</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCalculate}
              disabled={rate <= 0 || hH <= 0}
              className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white shadow-lg shadow-amber-500/25 flex-1 sm:flex-none"
            >
              Calculate Holiday Pay
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">
              Reset
            </Button>
          </div>
        </div>

        {/* Overtime Interaction Callout (when total weekly hours > 40) */}
        {isOvertimeRisk && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Overtime Threshold Exceeded ({totalHours} Total Workweek Hours)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Under FLSA Section 7(e)(6), holiday premium pay (e.g. the extra 0.5× or 1.0× above straight time) can typically be credited toward overtime obligations, but holiday hours worked count toward the 40-hour weekly threshold. When a holiday workweek exceeds 40 total hours, verify your collective bargaining agreement or company handbook.
            </p>
            <div className="pt-1">
              <Link
                href="/calculators/overtime-calculator"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline"
              >
                Compute overtime and statutory regular rate on our Overtime Calculator →
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
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Gross Earnings (Workweek)</p>
                <p className="text-4xl sm:text-5xl font-extrabold text-amber-600 tracking-tight">
                  {formatCurrency(totalPay)}
                </p>
                <div className="flex justify-center gap-2 flex-wrap pt-1">
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-medium">
                    {formatCurrency(regularPay)} regular pay ({regH}h)
                  </Badge>
                  <Badge variant="outline" className="bg-sky-500/10 border-sky-500/30 text-sky-600 font-medium">
                    {formatCurrency(rate * hH)} holiday base ({hH}h)
                  </Badge>
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600 font-medium">
                    +{formatCurrency(holidayPremium)} holiday premium bonus
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
                  { label: 'Base Rate', value: `${formatCurrency(rate)}/hr`, note: 'Standard daytime wage' },
                  {
                    label: 'Holiday Rate',
                    value: `${formatCurrency(holidayRate)}/hr`,
                    amber: true,
                    note: `${mult}× holiday multiplier`,
                  },
                  {
                    label: 'Premium per Hour',
                    value: `+${formatCurrency(holidayRate - rate)}/hr`,
                    amber: true,
                    note: 'Holiday bonus component',
                  },
                  {
                    label: 'Blended Effective Rate',
                    value: `${formatCurrency(effectiveRate)}/hr`,
                    note: `${totalHours} total weekly hrs`,
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
                    Workweek Earnings Distribution
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

              {/* Explanatory callout */}
              <div className="rounded-lg bg-muted/40 border border-border/40 p-3.5 text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Info className="h-3.5 w-3.5 text-amber-600" />
                  FLSA Holiday Pay Rules
                </div>
                <p>
                  Under federal law (FLSA), private employers are not required to provide paid holidays or pay premium rates for holiday hours. However, when offered, holiday pay is fully taxable compensation. If you work more than 40 hours in a holiday week, statutory 1.5× overtime rules apply under federal and state wage laws.
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
            label: 'Holiday Multiplier',
            valueA: `${compareA.holidayMultiplier}×`,
            valueB: `${compareB.holidayMultiplier}×`,
            numA: compareA.holidayMultiplier,
            numB: compareB.holidayMultiplier,
          },
          {
            label: 'Holiday Hours',
            valueA: `${compareA.holidayHours} hrs`,
            valueB: `${compareB.holidayHours} hrs`,
            numA: compareA.holidayHours,
            numB: compareB.holidayHours,
          },
          {
            label: 'Holiday Gross Pay',
            valueA: formatCurrency(compareA.holidayPay),
            valueB: formatCurrency(compareB.holidayPay),
            numA: compareA.holidayPay,
            numB: compareB.holidayPay,
          },
          {
            label: 'Holiday Premium Bonus',
            valueA: formatCurrency(compareA.holidayPremium),
            valueB: formatCurrency(compareB.holidayPremium),
            numA: compareA.holidayPremium,
            numB: compareB.holidayPremium,
          },
          {
            label: 'Total Workweek Pay',
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
