'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, ShieldAlert, DollarSign, Percent, Banknote } from 'lucide-react';
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

interface HazardSnapshot {
  baseRate: number;
  hazardousHours: number;
  standardHours: number;
  method: string;
  hazardPremiumTotal: number;
  straightRegularPay: number;
  totalPay: number;
  effectiveRate: number;
  label: string;
}

export default function HazardPayCalculator() {
  const [baseRate, setBaseRate] = useState('');
  const [hazardousHours, setHazardousHours] = useState('40');
  const [standardHours, setStandardHours] = useState('0');
  const [method, setMethod] = useState<'percent' | 'hourly' | 'stipend'>('percent');
  const [percent, setPercent] = useState('15');
  const [hourlyAdd, setHourlyAdd] = useState('3.50');
  const [stipend, setStipend] = useState('250');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<HazardSnapshot | null>(null);
  const [compareB, setCompareB] = useState<HazardSnapshot | null>(null);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    baseRate: string;
    hazardousHours: string;
    standardHours: string;
    method: string;
    percent: string;
    hourlyAdd: string;
    stipend: string;
  }>('hazard-pay-calculator');

  const rate = parseFloat(baseRate) || 0;
  const hazHrs = parseFloat(hazardousHours) || 0;
  const stdHrs = parseFloat(standardHours) || 0;
  const pct = parseFloat(percent) || 0;
  const ha = parseFloat(hourlyAdd) || 0;
  const stip = parseFloat(stipend) || 0;

  // Earnings calculation
  const standardPay = rate * stdHrs;
  const hazardousBasePay = rate * hazHrs;
  const totalStraightPay = standardPay + hazardousBasePay;

  let hazardPremiumTotal = 0;
  let effectiveHazardRate = rate;

  if (method === 'percent') {
    hazardPremiumTotal = hazardousBasePay * (pct / 100);
    effectiveHazardRate = rate * (1 + pct / 100);
  } else if (method === 'hourly') {
    hazardPremiumTotal = ha * hazHrs;
    effectiveHazardRate = rate + ha;
  } else {
    // Flat periodic stipend
    hazardPremiumTotal = stip;
    effectiveHazardRate = hazHrs > 0 ? rate + stip / hazHrs : rate;
  }

  const totalPay = totalStraightPay + hazardPremiumTotal;
  const totalHours = hazHrs + stdHrs;
  const effectiveRate = totalHours > 0 ? totalPay / totalHours : 0;
  const isOvertimeRisk = totalHours > 40;

  const handleTryExample = () => {
    setBaseRate('26.00');
    setHazardousHours('32');
    setStandardHours('16'); // 48h total -> triggers overtime warning
    setMethod('hourly');
    setHourlyAdd('4.00'); // $4/hr hazard premium
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (rate > 0 && totalHours > 0) {
      setCalculated(true);
      const methodLabel =
        method === 'percent'
          ? `${pct}%`
          : method === 'hourly'
            ? `+${formatCurrency(ha)}/hr`
            : `${formatCurrency(stip)} stipend`;
      saveEntry(
        { baseRate, hazardousHours, standardHours, method, percent, hourlyAdd, stipend },
        `${formatCurrency(rate)}/hr · ${hazHrs}h hazard (${methodLabel}) · Total: ${formatCurrency(totalPay)}`,
      );
    }
  };

  const handleReset = () => {
    setBaseRate('');
    setHazardousHours('40');
    setStandardHours('0');
    setMethod('percent');
    setPercent('15');
    setHourlyAdd('3.50');
    setStipend('250');
    setCalculated(false);
  };

  const handleRestore = (i: {
    baseRate: string;
    hazardousHours?: string;
    hours?: string; // backwards compatibility
    standardHours?: string;
    method: string;
    percent: string;
    hourlyAdd: string;
    stipend: string;
  }) => {
    setBaseRate(i.baseRate);
    setHazardousHours(i.hazardousHours || i.hours || '40');
    setStandardHours(i.standardHours || '0');
    setMethod(i.method as 'percent' | 'hourly' | 'stipend');
    setPercent(i.percent);
    setHourlyAdd(i.hourlyAdd);
    setStipend(i.stipend);
    setCalculated(true);
  };

  const snap = (): HazardSnapshot => ({
    baseRate: rate,
    hazardousHours: hazHrs,
    standardHours: stdHrs,
    method,
    hazardPremiumTotal,
    straightRegularPay: totalStraightPay,
    totalPay,
    effectiveRate,
    label: `${formatCurrency(rate)}/hr · ${hazHrs}h hazard (${method})`,
  });

  const chartData = [
    ...(stdHrs > 0 ? [{ name: 'Standard Non-Hazard', amount: standardPay, fill: '#10b981' }] : []),
    { name: 'Hazard Base Pay', amount: hazardousBasePay, fill: '#6366f1' },
    { name: 'Hazard Duty Premium', amount: hazardPremiumTotal, fill: '#f43f5e' },
  ].filter((d) => d.amount > 0);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        {rate > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-lg bg-rose-500/5 border border-rose-500/20 p-3"
          >
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
            <p className="text-sm text-rose-700 dark:text-rose-300">
              Base: <strong>{formatCurrency(rate)}/hr</strong> · Effective Hazard Rate:{' '}
              <strong>{formatCurrency(effectiveHazardRate)}/hr</strong>
              {hazHrs > 0 && (
                <>
                  {' '}· Hazard Premium: <strong>+{formatCurrency(hazardPremiumTotal)}</strong>
                </>
              )}
            </p>
          </motion.div>
        )}

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Base Hourly Rate */}
          <div className="space-y-2">
            <Label htmlFor="hz-rate" className="font-semibold text-foreground">
              Base Hourly Rate
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
              <Input
                id="hz-rate"
                type="number"
                step="0.25"
                min="0"
                placeholder="24.00"
                value={baseRate}
                onChange={(e) => {
                  setBaseRate(e.target.value);
                  setCalculated(false);
                }}
                className="pl-7"
              />
            </div>
            <p className="text-xs text-muted-foreground">Standard straight-time rate without hazard premium.</p>
          </div>

          {/* Hazardous Hours */}
          <div className="space-y-2">
            <Label htmlFor="hz-hours" className="font-semibold text-foreground">
              Hazardous Duty Hours
            </Label>
            <Input
              id="hz-hours"
              type="number"
              step="0.5"
              min="0"
              placeholder="40"
              value={hazardousHours}
              onChange={(e) => {
                setHazardousHours(e.target.value);
                setCalculated(false);
              }}
            />
            <p className="text-xs text-muted-foreground">Hours worked in high-risk / dangerous conditions.</p>
          </div>

          {/* Standard Non-Hazard Hours */}
          <div className="space-y-2">
            <Label htmlFor="hz-std-hours" className="font-semibold text-foreground">
              Standard Non-Hazard Hours
            </Label>
            <Input
              id="hz-std-hours"
              type="number"
              step="0.5"
              min="0"
              placeholder="0"
              value={standardHours}
              onChange={(e) => {
                setStandardHours(e.target.value);
                setCalculated(false);
              }}
            />
            <p className="text-xs text-muted-foreground">Optional: Standard safe hours worked in the same workweek.</p>
          </div>
        </div>

        {/* Hazard Compensation Model Selector */}
        <div className="space-y-3 pt-1">
          <Label className="font-semibold text-foreground">Hazard Pay Calculation Method</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'percent',
                title: 'Percentage Premium',
                desc: 'e.g. +10% to +25% of base pay',
                icon: Percent,
              },
              {
                id: 'hourly',
                title: 'Hourly Flat Add-On',
                desc: 'e.g. +$2.50 to +$5.00 / hour',
                icon: DollarSign,
              },
              {
                id: 'stipend',
                title: 'Fixed Periodic Stipend',
                desc: 'e.g. $250 flat weekly allowance',
                icon: Banknote,
              },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMethod(m.id as any);
                    setCalculated(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-rose-500 bg-rose-500/10 shadow-sm ring-1 ring-rose-500'
                      : 'border-border/60 bg-card hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-rose-600' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-semibold text-foreground">{m.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Method Value Input */}
        <div className="pt-1">
          {method === 'percent' && (
            <div className="space-y-1.5 max-w-xs">
              <Label htmlFor="hz-percent" className="text-xs font-semibold">Hazard Premium Percentage</Label>
              <div className="relative">
                <Input
                  id="hz-percent"
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="15"
                  value={percent}
                  onChange={(e) => {
                    setPercent(e.target.value);
                    setCalculated(false);
                  }}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">%</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Standard range: 5% (light hazard) to 25% (extreme danger / combat).</p>
            </div>
          )}

          {method === 'hourly' && (
            <div className="space-y-1.5 max-w-xs">
              <Label htmlFor="hz-hourly" className="text-xs font-semibold">Extra Dollar Rate ($/hour)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
                <Input
                  id="hz-hourly"
                  type="number"
                  step="0.25"
                  min="0"
                  placeholder="3.50"
                  value={hourlyAdd}
                  onChange={(e) => {
                    setHourlyAdd(e.target.value);
                    setCalculated(false);
                  }}
                  className="pl-7"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Common in healthcare, oil rigs, and construction (e.g. +$2.50 to +$5.00/hr).</p>
            </div>
          )}

          {method === 'stipend' && (
            <div className="space-y-1.5 max-w-xs">
              <Label htmlFor="hz-stipend" className="text-xs font-semibold">Flat Allowance / Stipend ($)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
                <Input
                  id="hz-stipend"
                  type="number"
                  step="10"
                  min="0"
                  placeholder="250"
                  value={stipend}
                  onChange={(e) => {
                    setStipend(e.target.value);
                    setCalculated(false);
                  }}
                  className="pl-7"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Flat pay period bonus for biohazard, environmental, or radiation exposure.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCalculate}
              disabled={rate <= 0 || totalHours <= 0}
              className="bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white shadow-lg shadow-rose-500/25 flex-1 sm:flex-none"
            >
              Calculate Hazard Pay
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">
              Reset
            </Button>
          </div>
        </div>

        {/* Overtime Interaction Alert (FLSA Regular Rate rule) */}
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
              Under federal FLSA Section 7(e), hazard pay premiums for hours worked <strong>cannot be excluded</strong> from an employee&apos;s regular rate of pay when calculating 1.5× overtime. The statutory regular rate must be computed across total earnings (including hazard pay) before computing overtime premiums.
            </p>
            <div className="pt-1">
              <Link
                href="/calculators/overtime-calculator"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline"
              >
                Compute statutory blended overtime on our Overtime Calculator →
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
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Gross Earnings</p>
                <p className="text-4xl sm:text-5xl font-extrabold text-rose-600 tracking-tight">
                  {formatCurrency(totalPay)}
                </p>
                <div className="flex justify-center gap-2 flex-wrap pt-1">
                  {stdHrs > 0 && (
                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-medium">
                      {formatCurrency(standardPay)} standard safe pay ({stdHrs}h)
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/30 text-indigo-600 font-medium">
                    {formatCurrency(hazardousBasePay)} hazard straight base ({hazHrs}h)
                  </Badge>
                  <Badge variant="outline" className="bg-rose-500/10 border-rose-500/30 text-rose-600 font-medium">
                    +{formatCurrency(hazardPremiumTotal)} hazard duty premium
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
                  { label: 'Straight Base', value: `${formatCurrency(rate)}/hr`, note: 'Standard daytime wage' },
                  {
                    label: 'Effective Hazard Rate',
                    value: `${formatCurrency(effectiveHazardRate)}/hr`,
                    amber: true,
                    note: 'Hazard hours rate',
                  },
                  {
                    label: 'Hazard Premium',
                    value: `+${formatCurrency(hazardPremiumTotal)}`,
                    amber: true,
                    note: 'Danger pay bonus',
                  },
                  {
                    label: 'Blended Hourly Avg',
                    value: `${formatCurrency(effectiveRate)}/hr`,
                    note: `${totalHours} total weekly hrs`,
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
                    Workweek Compensation Structure
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
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                  Hazard Pay &amp; Dangerous Duty Standards
                </div>
                <p>
                  Hazard pay compensates workers for performing duties under severe physical hardship, toxic exposure, infectious disease risk, or extreme workplace danger. In the federal civilian workforce, hazard pay is governed by 5 C.F.R. § 550.901–907 with differential schedules up to 25%. In the private sector, hazard premiums are established via collective bargaining or corporate policy.
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
            label: 'Hazardous Hours',
            valueA: `${compareA.hazardousHours} hrs`,
            valueB: `${compareB.hazardousHours} hrs`,
            numA: compareA.hazardousHours,
            numB: compareB.hazardousHours,
          },
          {
            label: 'Pay Method',
            valueA: compareA.method,
            valueB: compareB.method,
          },
          {
            label: 'Straight Regular Pay',
            valueA: formatCurrency(compareA.straightRegularPay),
            valueB: formatCurrency(compareB.straightRegularPay),
            numA: compareA.straightRegularPay,
            numB: compareB.straightRegularPay,
          },
          {
            label: 'Hazard Premium Bonus',
            valueA: formatCurrency(compareA.hazardPremiumTotal),
            valueB: formatCurrency(compareB.hazardPremiumTotal),
            numA: compareA.hazardPremiumTotal,
            numB: compareB.hazardPremiumTotal,
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
