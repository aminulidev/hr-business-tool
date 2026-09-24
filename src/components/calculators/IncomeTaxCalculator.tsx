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

interface Snapshot { income: number; totalTax: number; afterTax: number; effectiveRate: number; label: string; }

export default function IncomeTaxCalculator() {
  const [taxableIncome, setTaxableIncome] = useState('');
  const [filingStatus, setFilingStatus] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ taxableIncome: string; filingStatus: string }>('income-tax-calculator');

  const income = parseFloat(taxableIncome) || 0;
  const bracket1 = Math.min(income, 12150) * 0.10;
  const bracket2 = Math.max(0, Math.min(income, 49350) - 12150) * 0.12;
  const bracket3 = Math.max(0, Math.min(income, 105250) - 49350) * 0.22;
  const bracket4 = Math.max(0, Math.min(income, 200900) - 105250) * 0.24;
  const bracket5 = Math.max(0, Math.min(income, 255350) - 200900) * 0.32;
  const bracket6 = Math.max(0, Math.min(income, 639950) - 255350) * 0.35;
  const bracket7 = Math.max(0, income - 639950) * 0.37;
  const totalTax = bracket1 + bracket2 + bracket3 + bracket4 + bracket5 + bracket6 + bracket7;
  const afterTax = income - (bracket1 + bracket2 + bracket3 + bracket4 + bracket5 + bracket6 + bracket7);
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

  const handleTryExample = () => { setTaxableIncome('85000'); setFilingStatus('single'); setCalculated(false); };
  const handleCalculate = () => {
    if (income > 0) {
      setCalculated(true);
      saveEntry({ taxableIncome, filingStatus }, `Income tax: ${formatCurrency(totalTax)} (${effectiveRate.toFixed(1)}% effective)`);
    }
  };
  const handleReset = () => { setTaxableIncome(''); setFilingStatus('single'); setCalculated(false); };
  const handleRestore = (i: { taxableIncome: string; filingStatus: string }) => { setTaxableIncome(i.taxableIncome); setFilingStatus(i.filingStatus); setCalculated(true); };
  const snap = (): Snapshot => ({ income, totalTax, afterTax, effectiveRate, label: `Tax: ${formatCurrency(totalTax)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <FileText className="inline h-3 w-3 mr-1" />
          {`Calculate federal income tax using 2026 IRS tax brackets and filing status.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="taxableIncome">Taxable Income</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="taxableIncome" type="number" step="any" min="0" placeholder="85000" className="pl-7"
                value={taxableIncome} onChange={(e) => { setTaxableIncome(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filingStatus">Filing Status (single/mfj/hoh)</Label>
            <div className="relative">
              
              <Input id="filingStatus" type="text" step="any" min="0" placeholder="single"
                value={filingStatus} onChange={(e) => { setFilingStatus(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={income <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Income Tax
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Federal Income Tax</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalTax)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`After tax: ${formatCurrency(afterTax)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Effective rate: ${effectiveRate.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'2026 brackets (single)'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Taxable Income</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(income)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Federal Tax</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalTax)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">After Tax</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(afterTax)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Effective Rate</p>
                    <p className={`text-lg font-bold`}>{`{effectiveRate.toFixed(1)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Federal income tax uses progressive brackets: 10%, 12%, 22%, 24%, 32%, 35%, 37%. Each bracket applies only to income in that range. Effective rate = total tax / income.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Income', valueA: formatCurrency(compareA.income), valueB: formatCurrency(compareB.income), numA: compareA.income, numB: compareB.income },
          { label: 'Tax', valueA: formatCurrency(compareA.totalTax), valueB: formatCurrency(compareB.totalTax), numA: compareA.totalTax, numB: compareB.totalTax },
          { label: 'After Tax', valueA: formatCurrency(compareA.afterTax), valueB: formatCurrency(compareB.afterTax), numA: compareA.afterTax, numB: compareB.afterTax }
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
