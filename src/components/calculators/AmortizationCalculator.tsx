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
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { pv: number; apr: number; yrs: number; monthlyRate: number; numPayments: number; monthlyPayment: number; totalPaid: number; totalInterest: number; label: string; }

export default function AmortizationCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ loanAmount: string; interestRate: string; loanTerm: string }>('amortization-calculator');

  const pv = parseFloat(loanAmount) || 0;
  const apr = parseFloat(interestRate) || 0;
  const yrs = parseFloat(loanTerm) || 0;
  const monthlyRate = apr / 100 / 12;
  const numPayments = yrs * 12;
  const monthlyPayment = monthlyRate > 0 ? pv * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1) : pv / numPayments;
  const totalPaid = monthlyPayment * numPayments;
  const totalInterest = totalPaid - pv;

  const handleTryExample = () => { setLoanAmount('250000'); setInterestRate('6.5'); setLoanTerm('30'); setCalculated(false); };
  const handleCalculate = () => {
    if (pv > 0 && yrs > 0) {
      setCalculated(true);
      saveEntry({ loanAmount, interestRate, loanTerm }, `Monthly: ${formatCurrency(monthlyPayment)}, Total interest: ${formatCurrency(totalInterest)}`);
    }
  };
  const handleReset = () => { setLoanAmount(''); setInterestRate('6.5'); setLoanTerm('30'); setCalculated(false); };
  const handleRestore = (i: { loanAmount: string; interestRate: string; loanTerm: string }) => { setLoanAmount(i.loanAmount); setInterestRate(i.interestRate); setLoanTerm(i.loanTerm); setCalculated(true); };
  const snap = (): Snapshot => ({ pv, apr, yrs, monthlyRate, numPayments, monthlyPayment, totalPaid, totalInterest, label: `Monthly: ${formatCurrency(monthlyPayment)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingDown className="inline h-3 w-3 mr-1" />
          {`Calculate loan amortization schedule and intangible asset amortization. See monthly payment, total interest, and payoff.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="loanAmount" type="number" step="any" min="0" placeholder="250000" className="pl-7"
                value={loanAmount} onChange={(e) => { setLoanAmount(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
            <div className="relative">
              
              <Input id="interestRate" type="number" step="any" min="0" placeholder="6.5"
                value={interestRate} onChange={(e) => { setInterestRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="loanTerm">Loan Term (years)</Label>
            <div className="relative">
              
              <Input id="loanTerm" type="number" step="any" min="0" placeholder="30"
                value={loanTerm} onChange={(e) => { setLoanTerm(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={pv <= 0 || yrs <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Amortization
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Monthly Payment</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(monthlyPayment)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Total paid: ${formatCurrency(totalPaid)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Total interest: ${formatCurrency(totalInterest)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Interest as % of loan: ${pv > 0 ? (totalInterest / pv * 100).toFixed(1) : 0}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(pv)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Monthly Pmt</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(monthlyPayment)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Interest</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalInterest)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalPaid)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Loan amortization: each payment = principal + interest. Early payments mostly interest; later mostly principal. Formula: M = P × [r(1+r)^n] / [(1+r)^n - 1] where P = principal, r = monthly rate, n = number of payments. For intangible assets (goodwill, patents): straight-line amortization = cost / useful life. See our Depreciation Calculator for tangible assets.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Loan Amount', valueA: formatCurrency(compareA.pv), valueB: formatCurrency(compareB.pv), numA: compareA.pv, numB: compareB.pv },
          { label: 'Rate', valueA: `${compareA.apr}%`, valueB: `${compareB.apr}%`, numA: compareA.apr, numB: compareB.apr },
          { label: 'Monthly Pmt', valueA: formatCurrency(compareA.monthlyPayment), valueB: formatCurrency(compareB.monthlyPayment), numA: compareA.monthlyPayment, numB: compareB.monthlyPayment },
          { label: 'Total Interest', valueA: formatCurrency(compareA.totalInterest), valueB: formatCurrency(compareB.totalInterest), numA: compareA.totalInterest, numB: compareB.totalInterest }
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
