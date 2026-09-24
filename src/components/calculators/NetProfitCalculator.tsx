'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { rev: number; cogs: number; op: number; intr: number; tax: number; grossProfit: number; operatingIncome: number; pretaxIncome: number; netProfit: number; netMargin: number; label: string; }

export default function NetProfitCalculator() {
  const [revenue, setRevenue] = useState('');
  const [cogsValue, setCogsValue] = useState('');
  const [opexValue, setOpexValue] = useState('');
  const [interest, setInterest] = useState('');
  const [taxes, setTaxes] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ revenue: string; cogsValue: string; opexValue: string; interest: string; taxes: string }>('net-profit-calculator');

  const rev = parseFloat(revenue) || 0;
  const cogs = parseFloat(cogsValue) || 0;
  const op = parseFloat(opexValue) || 0;
  const intr = parseFloat(interest) || 0;
  const tax = parseFloat(taxes) || 0;
  const grossProfit = rev - cogs;
  const operatingIncome = grossProfit - op;
  const pretaxIncome = operatingIncome - intr;
  const netProfit = pretaxIncome - tax;
  const netMargin = rev > 0 ? (netProfit / rev) * 100 : 0;

  const handleTryExample = () => { setRevenue('1000000'); setCogsValue('400000'); setOpexValue('300000'); setInterest('20000'); setTaxes('80000'); setCalculated(false); };
  const handleCalculate = () => {
    if (rev > 0) {
      setCalculated(true);
      saveEntry({ revenue, cogsValue, opexValue, interest, taxes }, `Net profit: ${formatCurrency(netProfit)} (${netMargin.toFixed(1)}% margin)`);
    }
  };
  const handleReset = () => { setRevenue(''); setCogsValue(''); setOpexValue(''); setInterest(''); setTaxes(''); setCalculated(false); };
  const handleRestore = (i: { revenue: string; cogsValue: string; opexValue: string; interest: string; taxes: string }) => { setRevenue(i.revenue); setCogsValue(i.cogsValue); setOpexValue(i.opexValue); setInterest(i.interest); setTaxes(i.taxes); setCalculated(true); };
  const snap = (): Snapshot => ({ rev, cogs, op, intr, tax, grossProfit, operatingIncome, pretaxIncome, netProfit, netMargin, label: `Net profit: ${formatCurrency(netProfit)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Net profit (net income) = revenue - all expenses including COGS, operating expenses, interest, and taxes.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenue">Total Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="revenue" type="number" step="any" min="0" placeholder="1000000" className="pl-7"
                value={revenue} onChange={(e) => { setRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cogsValue">COGS</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="cogsValue" type="number" step="any" min="0" placeholder="400000" className="pl-7"
                value={cogsValue} onChange={(e) => { setCogsValue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="opexValue">Operating Expenses</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="opexValue" type="number" step="any" min="0" placeholder="300000" className="pl-7"
                value={opexValue} onChange={(e) => { setOpexValue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest">Interest Expense</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="interest" type="number" step="any" min="0" placeholder="20000" className="pl-7"
                value={interest} onChange={(e) => { setInterest(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxes">Income Taxes</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="taxes" type="number" step="any" min="0" placeholder="80000" className="pl-7"
                value={taxes} onChange={(e) => { setTaxes(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={rev <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Net Profit
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Net Profit (Net Income)</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(netProfit)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Net margin: ${netMargin.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Operating income: ${formatCurrency(operatingIncome)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{netProfit > 0 ? "Profitable" : "Loss"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Gross Profit</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(grossProfit)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Operating Income</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(operatingIncome)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(netProfit)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Net Margin</p>
                    <p className={`text-lg font-bold`}>{`{netMargin.toFixed(1)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Net profit = revenue - COGS - operating expenses - interest - taxes. Also called net income or 'the bottom line'. Net margin = net profit / revenue × 100. Negative = net loss. Track trend over time — declining net margin despite growing revenue indicates cost inflation or pricing pressure. See our Net Margin Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'Operating Income', valueA: formatCurrency(compareA.operatingIncome), valueB: formatCurrency(compareB.operatingIncome), numA: compareA.operatingIncome, numB: compareB.operatingIncome },
          { label: 'Net Profit', valueA: formatCurrency(compareA.netProfit), valueB: formatCurrency(compareB.netProfit), numA: compareA.netProfit, numB: compareB.netProfit },
          { label: 'Net Margin', valueA: `${compareA.netMargin.toFixed(1)}%`, valueB: `${compareB.netMargin.toFixed(1)}%`, numA: compareA.netMargin, numB: compareB.netMargin }
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel rows={rows} labelA={compareA.label} labelB={compareB.label}
              onClear={() => { setCompareA(null); setCompareB(null); }}
              onSwap={() => { const t = compareA; setCompareA(compareB); setCompareB(t); }} />
          </div>
        );
      })()}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}
