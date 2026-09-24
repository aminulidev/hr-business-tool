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

interface Snapshot { order: number; tip: number; sellerFee: number; sellerTakeHome: number; buyerFee: number; buyerTotal: number; label: string; }

export default function FiverrFeeCalculator() {
  const [orderAmount, setOrderAmount] = useState('');
  const [tipAmount, setTipAmount] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ orderAmount: string; tipAmount: string }>('fiverr-fee-calculator');

  const order = parseFloat(orderAmount) || 0;
  const tip = parseFloat(tipAmount) || 0;
  const sellerFee = (order + tip) * 0.20;
  const sellerTakeHome = order + tip - sellerFee;
  const buyerFee = order * 0.05 + 2.50;
  const buyerTotal = order + buyerFee + tip;

  const handleTryExample = () => { setOrderAmount('100'); setTipAmount('10'); setCalculated(false); };
  const handleCalculate = () => {
    if (order > 0) {
      setCalculated(true);
      saveEntry({ orderAmount, tipAmount }, `Take-home: ${formatCurrency(sellerTakeHome)} (fee: ${formatCurrency(sellerFee)})`);
    }
  };
  const handleReset = () => { setOrderAmount(''); setTipAmount(''); setCalculated(false); };
  const handleRestore = (i: { orderAmount: string; tipAmount: string }) => { setOrderAmount(i.orderAmount); setTipAmount(i.tipAmount); setCalculated(true); };
  const snap = (): Snapshot => ({ order, tip, sellerFee, sellerTakeHome, buyerFee, buyerTotal, label: `Take-home: ${formatCurrency(sellerTakeHome)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Fiverr charges sellers 20% of each order. Buyers pay 5% service fee + $2.50. Calculate your take-home pay.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="orderAmount">Order Amount (gig price)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="orderAmount" type="number" step="any" min="0" placeholder="100" className="pl-7"
                value={orderAmount} onChange={(e) => { setOrderAmount(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipAmount">Tip Amount (optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="tipAmount" type="number" step="any" min="0" placeholder="10" className="pl-7"
                value={tipAmount} onChange={(e) => { setTipAmount(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={order <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Fiverr Fees
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Seller Take-Home</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(sellerTakeHome)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-red-500/10 border-red-500/30 text-red-600'">{`Seller fee (20%): ${formatCurrency(sellerFee)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Buyer pays: ${formatCurrency(buyerTotal)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Buyer fee: ${formatCurrency(buyerFee)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Order Amount</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(order)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Seller Fee (20%)</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(sellerFee)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Take-Home</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(sellerTakeHome)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Buyer Total</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(buyerTotal)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Fiverr seller fee = 20% of order + tip. Buyer fee = 5% of order + $2.50 service fee. Tips are also subject to 20% seller fee. Withdrawal: PayPal, Payoneer, or Fiverr Revenue Card.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Order', valueA: formatCurrency(compareA.order), valueB: formatCurrency(compareB.order), numA: compareA.order, numB: compareB.order },
          { label: 'Take-Home', valueA: formatCurrency(compareA.sellerTakeHome), valueB: formatCurrency(compareB.sellerTakeHome), numA: compareA.sellerTakeHome, numB: compareB.sellerTakeHome },
          { label: 'Buyer Total', valueA: formatCurrency(compareA.buyerTotal), valueB: formatCurrency(compareB.buyerTotal), numA: compareA.buyerTotal, numB: compareB.buyerTotal }
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
