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

interface Snapshot { lifetime: number; invoice: number; totalFee: number; takeHome: number; flatFee: number; flatTakeHome: number; label: string; }

export default function UpworkFeeCalculator() {
  const [totalBillings, setTotalBillings] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalBillings: string; invoiceAmount: string }>('upwork-fee-calculator');

  const lifetime = parseFloat(totalBillings) || 0;
  const invoice = parseFloat(invoiceAmount) || 0;
  const tier1 = Math.min(invoice, Math.max(0, 500 - lifetime)) * 0.20;
  const tier2 = Math.min(invoice, Math.max(0, 10000 - lifetime)) * 0.10;
  const tier3 = Math.max(0, invoice - Math.max(0, 10000 - lifetime)) * 0.05;
  const totalFee = tier1 + tier2 + tier3;
  const takeHome = invoice - totalFee;
  const flatFee = invoice * 0.10;
  const flatTakeHome = invoice - flatFee;

  const handleTryExample = () => { setTotalBillings('5000'); setInvoiceAmount('1000'); setCalculated(false); };
  const handleCalculate = () => {
    if (invoice > 0) {
      setCalculated(true);
      saveEntry({ totalBillings, invoiceAmount }, `Take-home: ${formatCurrency(takeHome)} (fee: ${formatCurrency(totalFee)})`);
    }
  };
  const handleReset = () => { setTotalBillings(''); setInvoiceAmount(''); setCalculated(false); };
  const handleRestore = (i: { totalBillings: string; invoiceAmount: string }) => { setTotalBillings(i.totalBillings); setInvoiceAmount(i.invoiceAmount); setCalculated(true); };
  const snap = (): Snapshot => ({ lifetime, invoice, totalFee, takeHome, flatFee, flatTakeHome, label: `Take-home: ${formatCurrency(takeHome)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Upwork charges 10% flat fee (or sliding scale: 20% first $500, 10% to $10k, 5% above). See take-home pay.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalBillings">Lifetime Billings with Client</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalBillings" type="number" step="any" min="0" placeholder="5000" className="pl-7"
                value={totalBillings} onChange={(e) => { setTotalBillings(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceAmount">Current Invoice Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="invoiceAmount" type="number" step="any" min="0" placeholder="1000" className="pl-7"
                value={invoiceAmount} onChange={(e) => { setInvoiceAmount(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={invoice <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Upwork Fees
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Freelancer Take-Home</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(takeHome)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Flat 10% take-home: ${formatCurrency(flatTakeHome)}`}</Badge>
                  <Badge variant="outline" className="'bg-red-500/10 border-red-500/30 text-red-600'">{`Fee: ${formatCurrency(totalFee)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Flat 10% fee: ${formatCurrency(flatFee)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Invoice</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(invoice)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Fee</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalFee)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Take-Home</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(takeHome)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Flat 10% Take-Home</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(flatTakeHome)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Upwork fees (sliding scale): 20% on first $500 per client, 10% on $500-$10k, 5% above $10k. New 10% flat fee option available. Fees are per-client relationship. Clients don't pay additional fees.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Invoice', valueA: formatCurrency(compareA.invoice), valueB: formatCurrency(compareB.invoice), numA: compareA.invoice, numB: compareB.invoice },
          { label: 'Fee', valueA: formatCurrency(compareA.totalFee), valueB: formatCurrency(compareB.totalFee), numA: compareA.totalFee, numB: compareB.totalFee },
          { label: 'Take-Home', valueA: formatCurrency(compareA.takeHome), valueB: formatCurrency(compareB.takeHome), numA: compareA.takeHome, numB: compareB.takeHome }
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
