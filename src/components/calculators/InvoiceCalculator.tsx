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

interface Snapshot { l1q: number; l1p: number; l2q: number; l2p: number; dp: number; tp: number; subtotal: number; discount: number; afterDiscount: number; tax: number; total: number; label: string; }

export default function InvoiceCalculator() {
  const [line1Qty, setLine1Qty] = useState('');
  const [line1Price, setLine1Price] = useState('');
  const [line2Qty, setLine2Qty] = useState('');
  const [line2Price, setLine2Price] = useState('');
  const [discountPct, setDiscountPct] = useState('');
  const [taxPct, setTaxPct] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ line1Qty: string; line1Price: string; line2Qty: string; line2Price: string; discountPct: string; taxPct: string }>('invoice-calculator');

  const l1q = parseFloat(line1Qty) || 0;
  const l1p = parseFloat(line1Price) || 0;
  const l2q = parseFloat(line2Qty) || 0;
  const l2p = parseFloat(line2Price) || 0;
  const dp = parseFloat(discountPct) || 0;
  const tp = parseFloat(taxPct) || 0;
  const line1Total = l1q * l1p;
  const line2Total = l2q * l2p;
  const subtotal = line1Total + line2Total;
  const discount = subtotal * (dp / 100);
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * (tp / 100);
  const total = afterDiscount + tax;

  const handleTryExample = () => { setLine1Qty('1'); setLine1Price('2000'); setLine2Qty('10'); setLine2Price('100'); setDiscountPct('10'); setTaxPct('8.5'); setCalculated(false); };
  const handleCalculate = () => {
    if (subtotal > 0) {
      setCalculated(true);
      saveEntry({ line1Qty, line1Price, line2Qty, line2Price, discountPct, taxPct }, `Total: ${formatCurrency(total)} (subtotal ${formatCurrency(subtotal)}, tax ${formatCurrency(tax)})`);
    }
  };
  const handleReset = () => { setLine1Qty(''); setLine1Price(''); setLine2Qty(''); setLine2Price(''); setDiscountPct('10'); setTaxPct('8.5'); setCalculated(false); };
  const handleRestore = (i: { line1Qty: string; line1Price: string; line2Qty: string; line2Price: string; discountPct: string; taxPct: string }) => { setLine1Qty(i.line1Qty); setLine1Price(i.line1Price); setLine2Qty(i.line2Qty); setLine2Price(i.line2Price); setDiscountPct(i.discountPct); setTaxPct(i.taxPct); setCalculated(true); };
  const snap = (): Snapshot => ({ l1q, l1p, l2q, l2p, dp, tp, subtotal, discount, afterDiscount, tax, total, label: `Total: ${formatCurrency(total)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <FileText className="inline h-3 w-3 mr-1" />
          {`Calculate invoice total with line items, subtotal, discount, tax, and final amount due.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="line1Qty">Line 1 Quantity</Label>
            <div className="relative">
              
              <Input id="line1Qty" type="number" step="any" min="0" placeholder="1"
                value={line1Qty} onChange={(e) => { setLine1Qty(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="line1Price">Line 1 Unit Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="line1Price" type="number" step="any" min="0" placeholder="2000" className="pl-7"
                value={line1Price} onChange={(e) => { setLine1Price(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="line2Qty">Line 2 Quantity</Label>
            <div className="relative">
              
              <Input id="line2Qty" type="number" step="any" min="0" placeholder="10"
                value={line2Qty} onChange={(e) => { setLine2Qty(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="line2Price">Line 2 Unit Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="line2Price" type="number" step="any" min="0" placeholder="100" className="pl-7"
                value={line2Price} onChange={(e) => { setLine2Price(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountPct">Discount (%)</Label>
            <div className="relative">
              
              <Input id="discountPct" type="number" step="any" min="0" placeholder="10"
                value={discountPct} onChange={(e) => { setDiscountPct(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxPct">Tax Rate (%)</Label>
            <div className="relative">
              
              <Input id="taxPct" type="number" step="any" min="0" placeholder="8.5"
                value={taxPct} onChange={(e) => { setTaxPct(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={subtotal <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Invoice
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Invoice Total</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(total)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Subtotal: ${formatCurrency(subtotal)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Discount: -${formatCurrency(discount)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Tax: ${formatCurrency(tax)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Subtotal</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(subtotal)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">After Discount</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(afterDiscount)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Tax</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(tax)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Due</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(total)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Invoice total = subtotal - discount + tax. Subtotal = sum of (quantity x unit price). Discount = subtotal x discount%. Tax = (subtotal - discount) x tax%. For VAT-inclusive pricing, divide by (1 + tax%). See our Quote Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Subtotal', valueA: formatCurrency(compareA.subtotal), valueB: formatCurrency(compareB.subtotal), numA: compareA.subtotal, numB: compareB.subtotal },
          { label: 'Discount', valueA: formatCurrency(compareA.discount), valueB: formatCurrency(compareB.discount), numA: compareA.discount, numB: compareB.discount },
          { label: 'Total', valueA: formatCurrency(compareA.total), valueB: formatCurrency(compareB.total), numA: compareA.total, numB: compareB.total }
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
