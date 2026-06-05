'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, ArrowRight, DollarSign, Percent, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import ComparePanel, { CompareRow } from './ComparePanel';

type CalculationMode = 'gross-to-net' | 'net-to-gross';

interface BonusResult {
  grossBonus: number;
  netBonus: number;
  taxAmount: number;
  totalTaxRate: number;
  federalTax: number;
  stateTax: number;
  additionalTax: number;
}

const formatCurrency = (value: number): string =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const formatPercent = (value: number): string => value.toFixed(2) + '%';

export default function PostTaxBonusCalculator() {
  const [mode, setMode] = useState<CalculationMode>('gross-to-net');
  const [grossBonus, setGrossBonus] = useState<string>('5000');
  const [netBonusInput, setNetBonusInput] = useState<string>('3500');
  const [federalRate, setFederalRate] = useState<string>('22');
  const [stateRate, setStateRate] = useState<string>('5');
  const [additionalRate, setAdditionalRate] = useState<string>('0');
  const [result, setResult] = useState<BonusResult | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ mode: string; grossBonus: string; netBonusInput: string; federalRate: string; stateRate: string; additionalRate: string }>('bonus-tax-calculator');

  // ---- Comparison state ----
  const [compareA, setCompareA] = useState<{ result: BonusResult; label: string } | null>(null);
  const [compareB, setCompareB] = useState<{ result: BonusResult; label: string } | null>(null);

  const handleCalculate = () => {
    const fed = parseFloat(federalRate) || 0;
    const state = parseFloat(stateRate) || 0;
    const addl = parseFloat(additionalRate) || 0;
    const totalTaxRate = fed + state + addl;

    if (mode === 'gross-to-net') {
      const gross = parseFloat(grossBonus) || 0;
      if (gross <= 0) {
        setResult(null);
        return;
      }
      const taxAmount = gross * (totalTaxRate / 100);
      const net = gross - taxAmount;

      setResult({
        grossBonus: gross,
        netBonus: net,
        taxAmount,
        totalTaxRate,
        federalTax: gross * (fed / 100),
        stateTax: gross * (state / 100),
        additionalTax: gross * (addl / 100),
      });
      saveEntry(
        { mode, grossBonus, netBonusInput, federalRate, stateRate, additionalRate },
        `${formatCurrency(gross)} gross → ${formatCurrency(net)} net (${totalTaxRate.toFixed(1)}% tax)`
      );
    } else {
      const net = parseFloat(netBonusInput) || 0;
      if (net <= 0 || totalTaxRate >= 100) {
        setResult(null);
        return;
      }
      const gross = net / (1 - totalTaxRate / 100);
      const taxAmount = gross - net;
      const r = {
        grossBonus: gross,
        netBonus: net,
        taxAmount,
        totalTaxRate,
        federalTax: gross * (fed / 100),
        stateTax: gross * (state / 100),
        additionalTax: gross * (addl / 100),
      };
      setResult(r);
      saveEntry(
        { mode, grossBonus, netBonusInput, federalRate, stateRate, additionalRate },
        `${formatCurrency(net)} net → ${formatCurrency(gross)} gross (${totalTaxRate.toFixed(1)}% tax)`
      );
    }
  };

  const handleRestore = (inputs: { mode: string; grossBonus: string; netBonusInput: string; federalRate: string; stateRate: string; additionalRate: string }) => {
    setMode(inputs.mode as CalculationMode);
    setGrossBonus(inputs.grossBonus);
    setNetBonusInput(inputs.netBonusInput);
    setFederalRate(inputs.federalRate);
    setStateRate(inputs.stateRate);
    setAdditionalRate(inputs.additionalRate);
    setResult(null);
  };

  const effectiveWithholding = result
    ? result.totalTaxRate
    : (parseFloat(federalRate) || 0) + (parseFloat(stateRate) || 0) + (parseFloat(additionalRate) || 0);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
      {/* Mode Toggle */}
      <div className="mb-6">
        <div className="flex rounded-xl bg-muted/50 p-1 border border-border/50">
          <button
            onClick={() => {
              setMode('gross-to-net');
              setResult(null);
            }}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              mode === 'gross-to-net'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/25'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Gross → Net
          </button>
          <button
            onClick={() => {
              setMode('net-to-gross');
              setResult(null);
            }}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              mode === 'net-to-gross'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/25'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Net → Gross
          </button>
        </div>
      </div>

      {/* Form Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {mode === 'gross-to-net' ? (
          <div className="space-y-2">
            <Label htmlFor="gross-bonus" className="text-sm font-medium">
              <DollarSign className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
              Gross Bonus Amount ($)
            </Label>
            <Input
              id="gross-bonus"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 5000"
              value={grossBonus}
              onChange={(e) => setGrossBonus(e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="net-bonus" className="text-sm font-medium">
              <DollarSign className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
              Desired Net Bonus ($)
            </Label>
            <Input
              id="net-bonus"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 3500"
              value={netBonusInput}
              onChange={(e) => setNetBonusInput(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="federal-rate" className="text-sm font-medium">
            <Percent className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
            Federal Tax Rate (%)
          </Label>
          <Input
            id="federal-rate"
            type="number"
            step="0.01"
            min="0"
            placeholder="22"
            value={federalRate}
            onChange={(e) => setFederalRate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state-rate" className="text-sm font-medium">
            <Percent className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
            State Tax Rate (%)
          </Label>
          <Input
            id="state-rate"
            type="number"
            step="0.01"
            min="0"
            placeholder="5"
            value={stateRate}
            onChange={(e) => setStateRate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional-rate" className="text-sm font-medium">
            <Percent className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />
            Additional Withholding (%){' '}
            <span className="text-muted-foreground font-normal">optional</span>
          </Label>
          <Input
            id="additional-rate"
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            value={additionalRate}
            onChange={(e) => setAdditionalRate(e.target.value)}
          />
        </div>

        {/* Effective Rate Preview */}
        <div className="flex items-center gap-2 rounded-lg bg-muted/30 border border-border/40 px-4 py-3 sm:self-end">
          <Info className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="text-sm text-muted-foreground">
            Total withholding: <strong className="text-foreground">{formatPercent(effectiveWithholding)}</strong>
          </span>
        </div>
      </div>

      {/* Calculate Button */}
      <Button
        onClick={handleCalculate}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 font-semibold text-base py-6"
      >
        {mode === 'gross-to-net' ? 'Calculate Net Bonus' : 'Calculate Gross Bonus'}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="result-display mt-6 rounded-2xl border border-border/60 bg-gradient-to-b from-muted/40 to-muted/20 p-6 space-y-5" aria-live="polite"
        >
          {/* Main Result */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              {mode === 'gross-to-net' ? 'Your Net Bonus' : 'Required Gross Bonus'}
            </p>
            <motion.p
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="text-4xl sm:text-5xl font-bold tracking-tight text-emerald-600"
            >
              {mode === 'gross-to-net'
                ? formatCurrency(result.netBonus)
                : formatCurrency(result.grossBonus)}
            </motion.p>
          </div>

          {/* Divider */}
          <div className="border-t border-border/50" />

          {/* Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-background/60 border border-border/40 p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Gross Bonus
              </p>
              <p className="text-xl font-bold">{formatCurrency(result.grossBonus)}</p>
            </div>
            <div className="rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-900/30 p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Total Tax Withheld
              </p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">
                -{formatCurrency(result.taxAmount)}
              </p>
            </div>
            <div className="rounded-xl bg-background/60 border border-border/40 p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Net Bonus
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(result.netBonus)}
              </p>
            </div>
          </div>

          {/* Tax Breakdown */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Tax Breakdown</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Federal Tax ({formatPercent(parseFloat(federalRate) || 0)})</span>
                <span className="font-medium">{formatCurrency(result.federalTax)}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${Math.min((result.federalTax / result.grossBonus) * 100, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">State Tax ({formatPercent(parseFloat(stateRate) || 0)})</span>
                <span className="font-medium">{formatCurrency(result.stateTax)}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${Math.min((result.stateTax / result.grossBonus) * 100, 100)}%` }}
                />
              </div>

              {result.additionalTax > 0 && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Additional ({formatPercent(parseFloat(additionalRate) || 0)})</span>
                    <span className="font-medium">{formatCurrency(result.additionalTax)}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-500 transition-all duration-500"
                      style={{ width: `${Math.min((result.additionalTax / result.grossBonus) * 100, 100)}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Effective Rate Badge */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 text-sm"
            >
              Effective Withholding Rate: {formatPercent(result.totalTaxRate)}
            </Badge>
          </div>

          {/* Bonus Breakdown Pie Chart */}
          <div className="print:hidden">
            <p className="text-sm font-medium text-muted-foreground mb-3">Bonus Breakdown</p>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Net Bonus', value: result.netBonus },
                    { name: 'Federal Tax', value: result.federalTax },
                    { name: 'State Tax', value: result.stateTax },
                    ...(result.additionalTax > 0 ? [{ name: 'Additional Tax', value: result.additionalTax }] : []),
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                  <Cell fill="#f59e0b" />
                  {result.additionalTax > 0 && <Cell fill="#8b5cf6" />}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Edge case: total rate >= 100 in reverse mode */}
      {mode === 'net-to-gross' && effectiveWithholding >= 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 p-4 text-center text-sm text-red-600 dark:text-red-400"
        >
          Total tax rate must be less than 100% for reverse calculation.
        </motion.div>
      )}

      {/* ---- Comparison save buttons ---- */}
      {result && (
        <div className="flex flex-wrap gap-2 mt-4 px-1">
          <button
            onClick={() => setCompareA({ result, label: `${formatCurrency(result.grossBonus)} Gross (${result.totalTaxRate.toFixed(1)}% tax)` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-medium"
          >
            {compareA ? '↺ Replace Scenario A' : '+ Save as Scenario A'}
          </button>
          <button
            onClick={() => setCompareB({ result, label: `${formatCurrency(result.grossBonus)} Gross (${result.totalTaxRate.toFixed(1)}% tax)` })}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 transition-colors font-medium"
          >
            {compareB ? '↺ Replace Scenario B' : '+ Save as Scenario B'}
          </button>
        </div>
      )}

      {/* ---- Compare Panel ---- */}
      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Gross Bonus',     valueA: formatCurrency(compareA.result.grossBonus),     valueB: formatCurrency(compareB.result.grossBonus),     numA: compareA.result.grossBonus,     numB: compareB.result.grossBonus },
          { label: 'Net Bonus',       valueA: formatCurrency(compareA.result.netBonus),       valueB: formatCurrency(compareB.result.netBonus),       numA: compareA.result.netBonus,       numB: compareB.result.netBonus },
          { label: 'Tax Amount',      valueA: formatCurrency(compareA.result.taxAmount),      valueB: formatCurrency(compareB.result.taxAmount),      numA: compareA.result.taxAmount,      numB: compareB.result.taxAmount,      higherIsBetter: false },
          { label: 'Total Tax Rate',  valueA: `${compareA.result.totalTaxRate.toFixed(2)}%`,  valueB: `${compareB.result.totalTaxRate.toFixed(2)}%`,  numA: compareA.result.totalTaxRate,   numB: compareB.result.totalTaxRate,   higherIsBetter: false },
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

      </div>
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </div>
  );
}
