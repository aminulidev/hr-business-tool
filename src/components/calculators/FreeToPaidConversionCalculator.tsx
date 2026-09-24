'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { free: number; paid: number; conversionRate: number; benchmark: string; label: string; }

export default function FreeToPaidConversionCalculator() {
  const [freeUsers, setFreeUsers] = useState('');
  const [paidUsers, setPaidUsers] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ freeUsers: string; paidUsers: string }>('free-to-paid-conversion-calculator');

  const free = parseFloat(freeUsers) || 0;
  const paid = parseFloat(paidUsers) || 0;
  const conversionRate = free > 0 ? (paid / free) * 100 : 0;
  const benchmark = conversionRate > 5 ? "Excellent" : conversionRate > 2 ? "Healthy" : "Below benchmark";

  const handleTryExample = () => { setFreeUsers('10000'); setPaidUsers('350'); setCalculated(false); };
  const handleCalculate = () => {
    if (free > 0) {
      setCalculated(true);
      saveEntry({ freeUsers, paidUsers }, `Free-to-paid: ${conversionRate.toFixed(1)}% (${paid}/${free.toLocaleString()})`);
    }
  };
  const handleReset = () => { setFreeUsers(''); setPaidUsers(''); setCalculated(false); };
  const handleRestore = (i: { freeUsers: string; paidUsers: string }) => { setFreeUsers(i.freeUsers); setPaidUsers(i.paidUsers); setCalculated(true); };
  const snap = (): Snapshot => ({ free, paid, conversionRate, benchmark, label: `Conversion: ${conversionRate.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <BarChart3 className="inline h-3 w-3 mr-1" />
          {`Calculate free-to-paid conversion rate for freemium SaaS. Benchmark: 2-5%.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="freeUsers">Total Free Users</Label>
            <div className="relative">
              
              <Input id="freeUsers" type="number" step="any" min="0" placeholder="10000"
                value={freeUsers} onChange={(e) => { setFreeUsers(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paidUsers">Paid Users</Label>
            <div className="relative">
              
              <Input id="paidUsers" type="number" step="any" min="0" placeholder="350"
                value={paidUsers} onChange={(e) => { setPaidUsers(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={free <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Free-to-Paid
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Free-to-Paid Conversion</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(conversionRate)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Paid: ${paid} out of ${free.toLocaleString()} free users`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Benchmark: ${benchmark}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Freemium benchmark: 2-5%'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Free Users</p>
                    <p className={`text-lg font-bold`}>{`{free.toLocaleString()}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Paid Users</p>
                    <p className={`text-lg font-bold`}>{`{paid}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Conversion</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatPercent(conversionRate)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className={`text-lg font-bold`}>{benchmark}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Free-to-paid conversion = paid / free users x 100. Freemium benchmark: 2-5%.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Free', valueA: compareA.free.toLocaleString(), valueB: compareB.free.toLocaleString(), numA: compareA.free, numB: compareB.free },
          { label: 'Paid', valueA: String(compareA.paid), valueB: String(compareB.paid), numA: compareA.paid, numB: compareB.paid }
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
