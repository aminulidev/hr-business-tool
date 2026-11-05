'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency } from '@/lib/utils';

interface Snapshot {
  out: number;
  infl: number;
  cashBalance: number;
  grossBurn: number;
  netBurn: number;
  runwayMonths: number;
  annualBurn: number;
  dailyBurn: number;
  label: string;
}

export default function BurnRateCalculator() {
  const [cashOutflow, setCashOutflow] = useState('100000');
  const [cashInflow, setCashInflow] = useState('30000');
  const [cashBalanceInput, setCashBalanceInput] = useState('1260000');
  const [calculated, setCalculated] = useState(true);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{
    cashOutflow: string;
    cashInflow: string;
    cashBalanceInput?: string;
  }>('burn-rate-calculator');

  const out = parseFloat(cashOutflow) || 0;
  const infl = parseFloat(cashInflow) || 0;
  const cashBalance = parseFloat(cashBalanceInput) || 0;
  const grossBurn = out;
  const netBurn = out - infl;
  const annualBurn = netBurn * 12;
  const dailyBurn = netBurn / 30;
  const runwayMonths = netBurn > 0 ? cashBalance / netBurn : Infinity;

  const handleTryExample = () => {
    setCashOutflow('100000');
    setCashInflow('30000');
    setCashBalanceInput('1260000');
    setCalculated(true);
  };

  const handleCalculate = () => {
    if (out > 0) {
      setCalculated(true);
      saveEntry(
        { cashOutflow, cashInflow, cashBalanceInput },
        `Net burn: ${formatCurrency(netBurn)}/mo · Runway: ${
          Number.isFinite(runwayMonths) ? `${runwayMonths.toFixed(1)} mo` : 'Cash-flow positive'
        }`
      );
    }
  };

  const handleReset = () => {
    setCashOutflow('');
    setCashInflow('');
    setCashBalanceInput('');
    setCalculated(false);
  };

  const handleRestore = (i: {
    cashOutflow: string;
    cashInflow: string;
    cashBalanceInput?: string;
  }) => {
    setCashOutflow(i.cashOutflow);
    setCashInflow(i.cashInflow);
    if (i.cashBalanceInput !== undefined) setCashBalanceInput(i.cashBalanceInput);
    setCalculated(true);
  };

  const snap = (): Snapshot => ({
    out,
    infl,
    cashBalance,
    grossBurn,
    netBurn,
    runwayMonths: Number.isFinite(runwayMonths) ? runwayMonths : 999,
    annualBurn,
    dailyBurn,
    label: `Net burn: ${formatCurrency(netBurn)}/mo`,
  });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingDown className="inline h-3 w-3 mr-1" />
          Calculate Gross Burn Rate (monthly cash outflow), Net Burn Rate (outflow minus revenue inflow), and Cash Runway in months.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cashOutflow">Monthly Cash Outflow (Expenses)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="cashOutflow"
                type="number"
                step="any"
                min="0"
                placeholder="100000"
                className="pl-7"
                value={cashOutflow}
                onChange={(e) => {
                  setCashOutflow(e.target.value);
                  setCalculated(true);
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cashInflow">Monthly Cash Inflow (Revenue)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="cashInflow"
                type="number"
                step="any"
                min="0"
                placeholder="30000"
                className="pl-7"
                value={cashInflow}
                onChange={(e) => {
                  setCashInflow(e.target.value);
                  setCalculated(true);
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cashBalanceInput">Current Cash Balance ($)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                id="cashBalanceInput"
                type="number"
                step="any"
                min="0"
                placeholder="1260000"
                className="pl-7"
                value={cashBalanceInput}
                onChange={(e) => {
                  setCashBalanceInput(e.target.value);
                  setCalculated(true);
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              onClick={handleCalculate}
              disabled={out <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none"
            >
              Calculate Burn & Runway
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
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Monthly Net Burn Rate</p>
                <p className="text-4xl font-bold text-emerald-600">
                  {netBurn > 0 ? `${formatCurrency(netBurn)}/mo` : 'Cash-Flow Positive!'}
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-red-500/10 border-red-500/30 text-red-600">
                    Gross Burn: {formatCurrency(grossBurn)}/mo
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">
                    Runway: {Number.isFinite(runwayMonths) ? `${runwayMonths.toFixed(1)} months` : 'Infinite (Profitable)'}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">
                    Burn Multiple: {infl > 0 && netBurn > 0 ? `${(netBurn / (infl * 0.1 || 1)).toFixed(1)}x` : 'N/A'}
                  </Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">
                    {compareA ? '↺ Set A' : '+ Save A'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">
                    {compareB ? '↺ Set B' : '+ Save B'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Gross Burn</p>
                  <p className="text-lg font-bold">{formatCurrency(grossBurn)}/mo</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Net Burn</p>
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(netBurn)}/mo</p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Cash Runway</p>
                  <p className="text-lg font-bold text-amber-600">
                    {Number.isFinite(runwayMonths) ? `${runwayMonths.toFixed(1)} mos` : '∞'}
                  </p>
                </div>
                <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Annual Net Burn</p>
                  <p className="text-lg font-bold">{formatCurrency(annualBurn)}/yr</p>
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                <strong>Runway Health Check:</strong> Venture-backed startups typically target <strong>18–24 months</strong> of cash runway after a raise and begin raising their next round (or cutting burn to reach "Default Alive" profitability) when runway reaches <strong>9–12 months</strong>.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Gross Burn', valueA: formatCurrency(compareA.grossBurn), valueB: formatCurrency(compareB.grossBurn), numA: compareA.grossBurn, numB: compareB.grossBurn, higherIsBetter: false },
          { label: 'Net Burn', valueA: formatCurrency(compareA.netBurn), valueB: formatCurrency(compareB.netBurn), numA: compareA.netBurn, numB: compareB.netBurn, higherIsBetter: false },
          { label: 'Runway (Months)', valueA: `${compareA.runwayMonths.toFixed(1)} mo`, valueB: `${compareB.runwayMonths.toFixed(1)} mo`, numA: compareA.runwayMonths, numB: compareB.runwayMonths },
          { label: 'Annual Burn', valueA: formatCurrency(compareA.annualBurn), valueB: formatCurrency(compareB.annualBurn), numA: compareA.annualBurn, numB: compareB.annualBurn, higherIsBetter: false },
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
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}
