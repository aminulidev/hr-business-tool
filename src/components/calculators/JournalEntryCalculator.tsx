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

interface Snapshot { d1: number; d2: number; c1: number; c2: number; totalDebits: number; totalCredits: number; difference: number; isBalanced: boolean; label: string; }

export default function JournalEntryCalculator() {
  const [debit1, setDebit1] = useState('');
  const [debit2, setDebit2] = useState('');
  const [credit1, setCredit1] = useState('');
  const [credit2, setCredit2] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ debit1: string; debit2: string; credit1: string; credit2: string }>('journal-entry-calculator');

  const d1 = parseFloat(debit1) || 0;
  const d2 = parseFloat(debit2) || 0;
  const c1 = parseFloat(credit1) || 0;
  const c2 = parseFloat(credit2) || 0;
  const totalDebits = d1 + d2;
  const totalCredits = c1 + c2;
  const difference = totalDebits - totalCredits;
  const isBalanced = Math.abs(difference) < 0.01;

  const handleTryExample = () => { setDebit1('5000'); setDebit2('0'); setCredit1('3000'); setCredit2('2000'); setCalculated(false); };
  const handleCalculate = () => {
    if (totalDebits > 0 || totalCredits > 0) {
      setCalculated(true);
      saveEntry({ debit1, debit2, credit1, credit2 }, `${isBalanced ? 'Balanced' : 'Unbalanced'} (DR: ${formatCurrency(totalDebits)}, CR: ${formatCurrency(totalCredits)})`);
    }
  };
  const handleReset = () => { setDebit1(''); setDebit2(''); setCredit1(''); setCredit2(''); setCalculated(false); };
  const handleRestore = (i: { debit1: string; debit2: string; credit1: string; credit2: string }) => { setDebit1(i.debit1); setDebit2(i.debit2); setCredit1(i.credit1); setCredit2(i.credit2); setCalculated(true); };
  const snap = (): Snapshot => ({ d1, d2, c1, c2, totalDebits, totalCredits, difference, isBalanced, label: isBalanced ? 'Balanced' : 'Unbalanced' });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <FileText className="inline h-3 w-3 mr-1" />
          {`Create balanced journal entries with debits and credits. Verify total debits = total credits.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="debit1">Debit Account 1 Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="debit1" type="number" step="any" min="0" placeholder="5000" className="pl-7"
                value={debit1} onChange={(e) => { setDebit1(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="debit2">Debit Account 2 Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="debit2" type="number" step="any" min="0" placeholder="0" className="pl-7"
                value={debit2} onChange={(e) => { setDebit2(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="credit1">Credit Account 1 Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="credit1" type="number" step="any" min="0" placeholder="3000" className="pl-7"
                value={credit1} onChange={(e) => { setCredit1(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="credit2">Credit Account 2 Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="credit2" type="number" step="any" min="0" placeholder="2000" className="pl-7"
                value={credit2} onChange={(e) => { setCredit2(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={totalDebits <= 0 && totalCredits <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Verify Journal Entry
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Journal Entry Balance</p>
                <p className="text-4xl font-bold text-emerald-600">{isBalanced ? "Balanced" : "Unbalanced"}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Total debits: ${formatCurrency(totalDebits)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Total credits: ${formatCurrency(totalCredits)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{isBalanced ? "Entry is balanced" : "Difference: ${formatCurrency(difference)}"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Debits</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalDebits)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Credits</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalCredits)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Difference</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(difference)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{isBalanced ? 'Balanced' : 'Unbalanced'}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Double-entry bookkeeping: total debits must equal total credits. If unbalanced, find the missing entry. Debits increase assets/expenses, decrease liabilities/equity/revenue. Credits do the opposite.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Debits', valueA: formatCurrency(compareA.totalDebits), valueB: formatCurrency(compareB.totalDebits), numA: compareA.totalDebits, numB: compareB.totalDebits },
          { label: 'Credits', valueA: formatCurrency(compareA.totalCredits), valueB: formatCurrency(compareB.totalCredits), numA: compareA.totalCredits, numB: compareB.totalCredits },
          { label: 'Balanced', valueA: compareA.isBalanced ? 'Yes' : 'No', valueB: compareB.isBalanced ? 'Yes' : 'No' }
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
