'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { rev: number; c: number; op: number; intr: number; tx: number; grossProfit: number; operatingIncome: number; pretaxIncome: number; netIncome: number; netMargin: number; grossMargin: number; label: string; }

export default function PnlCalculator() {
  const [revenue, setRevenue] = useState('');
  const [cogs, setCogs] = useState('');
  const [opex, setOpex] = useState('');
  const [interest, setInterest] = useState('');
  const [taxes, setTaxes] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ revenue: string; cogs: string; opex: string; interest: string; taxes: string }>('pnl-calculator');

  const rev = parseFloat(revenue) || 0;
  const c = parseFloat(cogs) || 0;
  const op = parseFloat(opex) || 0;
  const intr = parseFloat(interest) || 0;
  const tx = parseFloat(taxes) || 0;
  const grossProfit = rev - c;
  const operatingIncome = grossProfit - op;
  const pretaxIncome = operatingIncome - intr;
  const netIncome = pretaxIncome - tx;
  const netMargin = rev > 0 ? (netIncome / rev) * 100 : 0;
  const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;

  const handleTryExample = () => { setRevenue('1000000'); setCogs('400000'); setOpex('300000'); setInterest('20000'); setTaxes('56000'); setCalculated(false); };
  const handleCalculate = () => {
    if (rev > 0) {
      setCalculated(true);
      saveEntry({ revenue, cogs, opex, interest, taxes }, `Net income: ${formatCurrency(netIncome)} (${netMargin.toFixed(1)}% margin)`);
    }
  };
  const handleReset = () => { setRevenue(''); setCogs(''); setOpex(''); setInterest(''); setTaxes(''); setCalculated(false); };
  const handleRestore = (i: { revenue: string; cogs: string; opex: string; interest: string; taxes: string }) => { setRevenue(i.revenue); setCogs(i.cogs); setOpex(i.opex); setInterest(i.interest); setTaxes(i.taxes); setCalculated(true); };
  const snap = (): Snapshot => ({ rev, c, op, intr, tx, grossProfit, operatingIncome, pretaxIncome, netIncome, netMargin, grossMargin, label: `Net: ${formatCurrency(netIncome)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <FileText className="inline h-3 w-3 mr-1" />
          {`Build a profit and loss (income) statement: revenue, COGS, gross profit, operating expenses, net income.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenue">Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="revenue" type="number" step="any" min="0" placeholder="1000000" className="pl-7"
                value={revenue} onChange={(e) => { setRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cogs">COGS</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="cogs" type="number" step="any" min="0" placeholder="400000" className="pl-7"
                value={cogs} onChange={(e) => { setCogs(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="opex">Operating Expenses</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="opex" type="number" step="any" min="0" placeholder="300000" className="pl-7"
                value={opex} onChange={(e) => { setOpex(e.target.value); setCalculated(false); }} />
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
              <Input id="taxes" type="number" step="any" min="0" placeholder="56000" className="pl-7"
                value={taxes} onChange={(e) => { setTaxes(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={rev <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate P&L
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Net Income</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(netIncome)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Gross profit: ${formatCurrency(grossProfit)} (${grossMargin.toFixed(1)}%)`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Operating income: ${formatCurrency(operatingIncome)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Net margin: ${netMargin.toFixed(1)}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(rev)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Gross Profit</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(grossProfit)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Operating Income</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(operatingIncome)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Net Income</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(netIncome)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`P&L: Revenue - COGS = Gross Profit. Gross Profit - Opex = Operating Income. Operating Income - Interest - Taxes = Net Income. Net margin = Net Income / Revenue x 100.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'Net Income', valueA: formatCurrency(compareA.netIncome), valueB: formatCurrency(compareB.netIncome), numA: compareA.netIncome, numB: compareB.netIncome },
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
