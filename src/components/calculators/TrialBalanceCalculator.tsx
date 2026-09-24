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

interface Snapshot { td: number; tc: number; difference: number; isBalanced: boolean; label: string; }

export default function TrialBalanceCalculator() {
  const [totalDebits, setTotalDebits] = useState('');
  const [totalCredits, setTotalCredits] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalDebits: string; totalCredits: string }>('trial-balance-calculator');

  const td = parseFloat(totalDebits) || 0;
  const tc = parseFloat(totalCredits) || 0;
  const difference = td - tc;
  const isBalanced = Math.abs(difference) < 0.01;
  const debitPct = (td + tc) > 0 ? td / (td + tc) * 100 : 0;

  const handleTryExample = () => { setTotalDebits('500000'); setTotalCredits('500000'); setCalculated(false); };
  const handleCalculate = () => {
    if (td > 0 || tc > 0) {
      setCalculated(true);
      saveEntry({ totalDebits, totalCredits }, `${isBalanced ? 'Balanced' : 'Unbalanced'} (diff: ${formatCurrency(difference)})`);
    }
  };
  const handleReset = () => { setTotalDebits(''); setTotalCredits(''); setCalculated(false); };
  const handleRestore = (i: { totalDebits: string; totalCredits: string }) => { setTotalDebits(i.totalDebits); setTotalCredits(i.totalCredits); setCalculated(true); };
  const snap = (): Snapshot => ({ td, tc, difference, isBalanced, label: isBalanced ? 'Balanced' : 'Unbalanced' });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <FileText className="inline h-3 w-3 mr-1" />
          {`Verify total debits equal total credits in the trial balance. Identify unbalanced entries.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalDebits">Total Debits</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalDebits" type="number" step="any" min="0" placeholder="500000" className="pl-7"
                value={totalDebits} onChange={(e) => { setTotalDebits(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalCredits">Total Credits</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalCredits" type="number" step="any" min="0" placeholder="500000" className="pl-7"
                value={totalCredits} onChange={(e) => { setTotalCredits(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={td <= 0 && tc <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Check Trial Balance
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Trial Balance Status</p>
                <p className="text-4xl font-bold text-emerald-600">{isBalanced ? 'Balanced' : 'Unbalanced'}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Debits: ${formatCurrency(td)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Credits: ${formatCurrency(tc)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{isBalanced ? "Trial balance is balanced" : "Difference: ${formatCurrency(difference)}"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Debits</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(td)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Credits</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(tc)}</p>
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
                {`Trial balance verifies total debits = total credits. If unbalanced: check for transposition errors, missing entries, or wrong account types. Common error: difference divisible by 9 = transposition error.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Debits', valueA: formatCurrency(compareA.td), valueB: formatCurrency(compareB.td), numA: compareA.td, numB: compareB.td },
          { label: 'Credits', valueA: formatCurrency(compareA.tc), valueB: formatCurrency(compareB.tc), numA: compareA.tc, numB: compareB.tc },
          { label: 'Difference', valueA: formatCurrency(compareA.difference), valueB: formatCurrency(compareB.difference), numA: compareA.difference, numB: compareB.difference }
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
