'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Timer, DollarSign, Clock, Info, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
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
// Types
// ---------------------------------------------------------------------------

type OvertimeMultiplierPreset = '1.5' | '2' | 'custom';

interface OvertimeResult {
  regularPay: number;
  overtimePay: number;
  totalPay: number;
  overtimePremium: number;
  effectiveHourlyRate: number;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  hourlyRate: number;
  multiplier: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const formatNumber = (value: number, decimals: number = 2): string =>
  value.toFixed(decimals);

export default function OvertimeCalculator() {
  const [hourlyRateInput, setHourlyRateInput] = useState<string>('');
  const [regularHoursInput, setRegularHoursInput] = useState<string>('40');
  const [overtimeHoursInput, setOvertimeHoursInput] = useState<string>('');
  const [multiplierPreset, setMultiplierPreset] = useState<OvertimeMultiplierPreset>('1.5');
  const [customMultiplierInput, setCustomMultiplierInput] = useState<string>('1.5');
  const [weeklyHoursInput, setWeeklyHoursInput] = useState<string>('');
  
  const [result, setResult] = useState<OvertimeResult | null>(null);
  const [autoOvertimeHint, setAutoOvertimeHint] = useState<number | null>(null);
  
  const [compareA, setCompareA] = useState<{ result: OvertimeResult; label: string } | null>(null);
  const [compareB, setCompareB] = useState<{ result: OvertimeResult; label: string } | null>(null);
  
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<any>('overtime-calculator');

  // Auto overtime hint logic
  useMemo(() => {
    const w = parseFloat(weeklyHoursInput);
    const r = parseFloat(regularHoursInput) || 40;
    if (!isNaN(w) && !isNaN(r)) {
      setAutoOvertimeHint(Math.max(0, w - r));
    } else {
      setAutoOvertimeHint(null);
    }
  }, [weeklyHoursInput, regularHoursInput]);

  const handleCalculate = () => {
    const rRate = parseFloat(hourlyRateInput) || 0;
    const rHrs = parseFloat(regularHoursInput) || 0;
    
    let otHrs = parseFloat(overtimeHoursInput) || 0;
    const wHrs = parseFloat(weeklyHoursInput);
    
    if (!isNaN(wHrs) && wHrs > rHrs) {
      otHrs = wHrs - rHrs;
      setOvertimeHoursInput(otHrs.toString());
    }
    
    const mult = multiplierPreset === 'custom' ? (parseFloat(customMultiplierInput) || 1.5) : parseFloat(multiplierPreset);
    
    const regPay = rHrs * rRate;
    const otPay = otHrs * (rRate * mult);
    const totalPay = regPay + otPay;
    const totHrs = rHrs + otHrs;
    
    setResult({
      regularPay: regPay,
      overtimePay: otPay,
      totalPay: totalPay,
      overtimePremium: otPay - (otHrs * rRate),
      effectiveHourlyRate: totHrs > 0 ? totalPay / totHrs : 0,
      regularHours: rHrs,
      overtimeHours: otHrs,
      totalHours: totHrs,
      hourlyRate: rRate,
      multiplier: mult
    });
    
    saveEntry({ hourlyRateInput, regularHoursInput, overtimeHoursInput, multiplierPreset, customMultiplierInput, weeklyHoursInput }, `${formatCurrency(totalPay)} (${totHrs}h)`);
  };

  const handleReset = () => {
    setHourlyRateInput('');
    setRegularHoursInput('40');
    setOvertimeHoursInput('');
    setMultiplierPreset('1.5');
    setCustomMultiplierInput('1.5');
    setWeeklyHoursInput('');
    setResult(null);
    setAutoOvertimeHint(null);
  };

  const handleRestore = (item: any) => {
    setHourlyRateInput(item.hourlyRateInput || '');
    setRegularHoursInput(item.regularHoursInput || '40');
    setOvertimeHoursInput(item.overtimeHoursInput || '');
    setMultiplierPreset(item.multiplierPreset || '1.5');
    setCustomMultiplierInput(item.customMultiplierInput || '1.5');
    setWeeklyHoursInput(item.weeklyHoursInput || '');
    setResult(null);
  };

return (
    <div className="w-full">
      {/* ================================================================= */}
      {/* Input Form                                                        */}
      {/* ================================================================= */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Row 1: Hourly Rate & Regular Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hourly-rate" className="text-sm font-medium">
              <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Hourly Rate ($)
            </Label>
            <Input
              id="hourly-rate"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 25"
              value={hourlyRateInput}
              onChange={(e) => setHourlyRateInput(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="regular-hours" className="text-sm font-medium">
              <Clock className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Regular Hours / Week
            </Label>
            <Input
              id="regular-hours"
              type="number"
              min="0"
              step="1"
              placeholder="40"
              value={regularHoursInput}
              onChange={(e) => setRegularHoursInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Standard is 40 hrs under FLSA
            </p>
          </div>
        </div>

        {/* Row 2: Overtime Hours & Multiplier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="overtime-hours" className="text-sm font-medium">
              <Timer className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Overtime Hours Worked
            </Label>
            <Input
              id="overtime-hours"
              type="number"
              min="0"
              step="0.25"
              placeholder="e.g., 5"
              value={overtimeHoursInput}
              onChange={(e) => setOvertimeHoursInput(e.target.value)}
            />
            {autoOvertimeHint !== null && (
              <p className="text-xs text-amber-600 mt-1">
                {autoOvertimeHint > 0
                  ? `Weekly total suggests ${formatNumber(autoOvertimeHint)} OT hrs (will be used on calculate)`
                  : 'Weekly total does not exceed regular hours'
                }
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ot-multiplier" className="text-sm font-medium">
              <TrendingUp className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Overtime Multiplier
            </Label>
            <Select
              value={multiplierPreset}
              onValueChange={(val) => {
                setMultiplierPreset(val as OvertimeMultiplierPreset);
                if (val !== 'custom') {
                  setCustomMultiplierInput(val);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select multiplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.5">1.5x — Time-and-a-Half</SelectItem>
                <SelectItem value="2">2x — Double Time</SelectItem>
                <SelectItem value="custom">Custom Multiplier</SelectItem>
              </SelectContent>
            </Select>

            {multiplierPreset === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  type="number"
                  min="1"
                  step="0.1"
                  placeholder="e.g., 1.5"
                  value={customMultiplierInput}
                  onChange={(e) => setCustomMultiplierInput(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter any multiplier (e.g., 1.25, 2, 3)
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Row 3: Weekly Total (optional auto-calculate) */}
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3">
          <Label htmlFor="weekly-hours" className="text-sm font-medium flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
            Total Weekly Hours Worked
            <span className="text-xs text-muted-foreground font-normal">(optional — auto-calculates overtime)</span>
          </Label>
          <Input
            id="weekly-hours"
            type="number"
            min="0"
            step="0.25"
            placeholder="e.g., 48"
            value={weeklyHoursInput}
            onChange={(e) => setWeeklyHoursInput(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            If total hours exceed your regular hours ({regularHoursInput || '40'}), overtime hours will be calculated automatically.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleCalculate}
            className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            Calculate Overtime Pay
          </Button>
          <Button variant="outline" onClick={handleReset} size="lg">
            Reset
          </Button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Results                                                           */}
      {/* ================================================================= */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="result-display mt-8" aria-live="polite"
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            {/* Main Result */}
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                Total Weekly Pay
              </p>
              <p className="text-4xl font-bold text-emerald-600">
                {formatCurrency(result.totalPay)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatNumber(result.totalHours)} total hours ·{' '}
                <span className="font-semibold text-foreground">
                  {formatCurrency(result.effectiveHourlyRate)}/hr effective
                </span>
              </p>
            </div>

            {/* Breakdown Table */}
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                      Hours
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                      Rate
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                      Pay
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <tr>
                    <td className="px-4 py-3 font-medium">Regular Pay</td>
                    <td className="text-center px-4 py-3 text-muted-foreground">
                      {formatNumber(result.regularHours)} hrs
                    </td>
                    <td className="text-center px-4 py-3 text-muted-foreground">
                      {formatCurrency(result.hourlyRate)}/hr
                    </td>
                    <td className="text-right px-4 py-3 font-medium">
                      {formatCurrency(result.regularPay)}
                    </td>
                  </tr>
                  {result.overtimeHours > 0 && (
                    <tr className="text-amber-600">
                      <td className="px-4 py-3 flex items-center gap-1.5">
                        <Timer className="h-3.5 w-3.5" />
                        Overtime Pay ({result.multiplier}x)
                      </td>
                      <td className="text-center px-4 py-3">
                        {formatNumber(result.overtimeHours)} hrs
                      </td>
                      <td className="text-center px-4 py-3">
                        {formatCurrency(result.hourlyRate * result.multiplier)}/hr
                      </td>
                      <td className="text-right px-4 py-3 font-medium">
                        +{formatCurrency(result.overtimePay)}
                      </td>
                    </tr>
                  )}
                  <tr className="font-bold bg-emerald-500/5">
                    <td className="px-4 py-3 text-emerald-600">Total Pay</td>
                    <td className="text-center px-4 py-3 text-emerald-600">
                      {formatNumber(result.totalHours)} hrs
                    </td>
                    <td className="text-center px-4 py-3 text-emerald-600">
                      {formatCurrency(result.effectiveHourlyRate)}/hr
                    </td>
                    <td className="text-right px-4 py-3 text-emerald-600">
                      {formatCurrency(result.totalPay)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Regular Pay</p>
                <p className="text-lg font-bold">{formatCurrency(result.regularPay)}</p>
              </div>
              <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Overtime Pay</p>
                <p className="text-lg font-bold text-amber-600">
                  {formatCurrency(result.overtimePay)}
                </p>
              </div>
              <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">OT Premium</p>
                <p className="text-lg font-bold text-emerald-600">
                  +{formatCurrency(result.overtimePremium)}
                </p>
              </div>
              <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Effective Rate</p>
                <p className="text-lg font-bold text-emerald-600">
                  {formatCurrency(result.effectiveHourlyRate)}
                  <span className="text-xs text-muted-foreground font-normal">/hr</span>
                </p>
              </div>
            </div>

            {/* Summary Badges */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <DollarSign className="h-3.5 w-3.5 mr-1.5" />
                Base Rate: {formatCurrency(result.hourlyRate)}/hr
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                Multiplier: {result.multiplier}x
              </Badge>
              {result.overtimeHours > 0 && (
                <Badge variant="outline" className="px-4 py-2 text-sm">
                  <Info className="h-3.5 w-3.5 mr-1.5" />
                  OT Premium: +{formatNumber((result.effectiveHourlyRate - result.hourlyRate) / result.hourlyRate * 100)}% over base
                </Badge>
              )}
            </div>

            {/* Pay Split Pie Chart */}
            <div className="print:hidden">
              <p className="text-sm font-medium text-muted-foreground mb-3">Pay Split</p>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Regular Pay', value: result.regularPay },
                      { name: 'Overtime Pay', value: result.overtimePay },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* ---- Comparison save buttons ---- */}
      {result && (
        <div className="flex flex-wrap gap-2 mt-4 px-1">
          <button
            onClick={() => setCompareA({ result, label: `${formatCurrency(result.hourlyRate)}/hr · ${result.overtimeHours}h OT` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
          >
            {compareA ? '↺ Replace Scenario A' : '+ Save as Scenario A'}
          </button>
          <button
            onClick={() => setCompareB({ result, label: `${formatCurrency(result.hourlyRate)}/hr · ${result.overtimeHours}h OT` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 transition-colors font-medium"
          >
            {compareB ? '↺ Replace Scenario B' : '+ Save as Scenario B'}
          </button>
        </div>
      )}

      {/* ---- Compare Panel ---- */}
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Hourly Rate',       valueA: formatCurrency(compareA.result.hourlyRate),       valueB: formatCurrency(compareB.result.hourlyRate),       numA: compareA.result.hourlyRate,       numB: compareB.result.hourlyRate },
          { label: 'Regular Pay',       valueA: formatCurrency(compareA.result.regularPay),       valueB: formatCurrency(compareB.result.regularPay),       numA: compareA.result.regularPay,       numB: compareB.result.regularPay },
          { label: 'Overtime Pay',      valueA: formatCurrency(compareA.result.overtimePay),      valueB: formatCurrency(compareB.result.overtimePay),      numA: compareA.result.overtimePay,      numB: compareB.result.overtimePay },
          { label: 'Total Pay',         valueA: formatCurrency(compareA.result.totalPay),         valueB: formatCurrency(compareB.result.totalPay),         numA: compareA.result.totalPay,         numB: compareB.result.totalPay },
          { label: 'Total Hours',       valueA: `${compareA.result.totalHours} h`,                valueB: `${compareB.result.totalHours} h`,                numA: compareA.result.totalHours,       numB: compareB.result.totalHours },
          { label: 'Eff. Hourly Rate',  valueA: formatCurrency(compareA.result.effectiveHourlyRate), valueB: formatCurrency(compareB.result.effectiveHourlyRate), numA: compareA.result.effectiveHourlyRate, numB: compareB.result.effectiveHourlyRate },
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
