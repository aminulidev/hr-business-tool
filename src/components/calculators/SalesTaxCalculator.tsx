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

interface Snapshot { p: number; r: number; taxAmount: number; totalPrice: number; label: string; }

export default function SalesTaxCalculator() {
  const [price, setPrice] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ price: string; taxRate: string }>('sales-tax-calculator');

  const p = parseFloat(price) || 0;
  const r = parseFloat(taxRate) || 0;
  const taxAmount = p * (r / 100);
  const totalPrice = p + taxAmount;

  const handleTryExample = () => { setPrice('100'); setTaxRate('7.25'); setCalculated(false); };
  const handleCalculate = () => {
    if (p > 0) {
      setCalculated(true);
      saveEntry({ price, taxRate }, `Sales tax: ${formatCurrency(taxAmount)} (${r}% on ${formatCurrency(p)})`);
    }
  };
  const handleReset = () => { setPrice(''); setTaxRate('7.25'); setCalculated(false); };
  const handleRestore = (i: { price: string; taxRate: string }) => { setPrice(i.price); setTaxRate(i.taxRate); setCalculated(true); };
  const snap = (): Snapshot => ({ p, r, taxAmount, totalPrice, label: `Tax: ${formatCurrency(taxAmount)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Percent className="inline h-3 w-3 mr-1" />
          {`Calculate US sales tax by state. Add or extract sales tax from a price.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="price" type="number" step="any" min="0" placeholder="100" className="pl-7"
                value={price} onChange={(e) => { setPrice(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxRate">Sales Tax Rate (%)</Label>
            <div className="relative">
              
              <Input id="taxRate" type="number" step="any" min="0" placeholder="7.25"
                value={taxRate} onChange={(e) => { setTaxRate(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">CA: 7.25%</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={p <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Sales Tax
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Sales Tax Amount</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(taxAmount)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Price: ${formatCurrency(p)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Total: ${formatCurrency(totalPrice)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Rate: ${r}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Price</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(p)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Tax Rate</p>
                    <p className={`text-lg font-bold`}>{`{r}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Tax Amount</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(taxAmount)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalPrice)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Sales tax = price x (rate / 100). CA 7.25%, TX 6.25%, NY 4%, FL 6%. No sales tax: OR, MT, NH, DE.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Price', valueA: formatCurrency(compareA.p), valueB: formatCurrency(compareB.p), numA: compareA.p, numB: compareB.p },
          { label: 'Tax', valueA: formatCurrency(compareA.taxAmount), valueB: formatCurrency(compareB.taxAmount), numA: compareA.taxAmount, numB: compareB.taxAmount }
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
