'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { amt: number; rate: number; gstExclusive: number; gstAmount: number; gstInclusive: number; label: string; }

export default function GstCalculator() {
  const [amount, setAmount] = useState('');
  const [gstRate, setGstRate] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ amount: string; gstRate: string }>('gst-calculator');

  const amt = parseFloat(amount) || 0;
  const rate = parseFloat(gstRate) || 0;
  const gstExclusive = amt;
  const gstAmount = amt * (rate / 100);
  const gstInclusive = amt + gstAmount;

  const handleTryExample = () => { setAmount('100'); setGstRate('10'); setCalculated(false); };
  const handleCalculate = () => {
    if (amt > 0) {
      setCalculated(true);
      saveEntry({ amount, gstRate }, `GST: ${formatCurrency(gstAmount)} (${rate}% on ${formatCurrency(amt)})`);
    }
  };
  const handleReset = () => { setAmount(''); setGstRate('10'); setCalculated(false); };
  const handleRestore = (i: { amount: string; gstRate: string }) => { setAmount(i.amount); setGstRate(i.gstRate); setCalculated(true); };
  const snap = (): Snapshot => ({ amt, rate, gstExclusive, gstAmount, gstInclusive, label: `GST: ${formatCurrency(gstAmount)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Percent className="inline h-3 w-3 mr-1" />
          {`Calculate GST inclusive and exclusive amounts. Australia 10%, India 18%, Singapore 9%.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="amount" type="number" step="any" min="0" placeholder="100" className="pl-7"
                value={amount} onChange={(e) => { setAmount(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gstRate">GST Rate (%)</Label>
            <div className="relative">
              
              <Input id="gstRate" type="number" step="any" min="0" placeholder="10"
                value={gstRate} onChange={(e) => { setGstRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={amt <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate GST
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">GST Amount</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(gstAmount)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Exclusive: ${formatCurrency(gstExclusive)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Inclusive: ${formatCurrency(gstInclusive)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Rate: ${rate}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Amount</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(amt)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">GST Rate</p>
                    <p className={`text-lg font-bold`}>{`{rate}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">GST Amount</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(gstAmount)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total (incl)</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(gstInclusive)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`GST = amount x (rate / 100). To add GST: total = amount x (1 + rate/100). To remove GST: net = total / (1 + rate/100).`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Amount', valueA: formatCurrency(compareA.amt), valueB: formatCurrency(compareB.amt), numA: compareA.amt, numB: compareB.amt },
          { label: 'GST', valueA: formatCurrency(compareA.gstAmount), valueB: formatCurrency(compareB.gstAmount), numA: compareA.gstAmount, numB: compareB.gstAmount }
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
