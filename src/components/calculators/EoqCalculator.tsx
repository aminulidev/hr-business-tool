'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Boxes } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { D: number; S: number; H: number; eoq: number; numOrders: number; annualOrderCost: number; annualHoldingCost: number; totalCost: number; label: string; }

export default function EoqCalculator() {
  const [annualDemand, setAnnualDemand] = useState('');
  const [orderCost, setOrderCost] = useState('');
  const [holdingCost, setHoldingCost] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ annualDemand: string; orderCost: string; holdingCost: string }>('eoq-calculator');

  const D = parseFloat(annualDemand) || 0;
  const S = parseFloat(orderCost) || 0;
  const H = parseFloat(holdingCost) || 0;
  const eoq = H > 0 ? Math.sqrt((2 * D * S) / H) : 0;
  const numOrders = eoq > 0 ? D / eoq : 0;
  const annualOrderCost = numOrders * S;
  const annualHoldingCost = (eoq / 2) * H;
  const totalCost = annualOrderCost + annualHoldingCost;

  const handleTryExample = () => { setAnnualDemand('12000'); setOrderCost('50'); setHoldingCost('3'); setCalculated(false); };
  const handleCalculate = () => {
    if (D > 0 && S > 0 && H > 0) {
      setCalculated(true);
      saveEntry({ annualDemand, orderCost, holdingCost }, `EOQ: ${eoq.toFixed(0)} units (${numOrders.toFixed(1)} orders/yr, ${formatCurrency(totalCost)} total)`);
    }
  };
  const handleReset = () => { setAnnualDemand(''); setOrderCost(''); setHoldingCost(''); setCalculated(false); };
  const handleRestore = (i: { annualDemand: string; orderCost: string; holdingCost: string }) => { setAnnualDemand(i.annualDemand); setOrderCost(i.orderCost); setHoldingCost(i.holdingCost); setCalculated(true); };
  const snap = (): Snapshot => ({ D, S, H, eoq, numOrders, annualOrderCost, annualHoldingCost, totalCost, label: `EOQ: ${eoq.toFixed(0)} units` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Boxes className="inline h-3 w-3 mr-1" />
          {`Economic Order Quantity (EOQ) = √(2DS/H). Finds optimal order size minimizing total ordering + holding costs.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annualDemand">Annual Demand (units)</Label>
            <div className="relative">
              
              <Input id="annualDemand" type="number" step="any" min="0" placeholder="12000"
                value={annualDemand} onChange={(e) => { setAnnualDemand(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="orderCost">Order Cost per Order</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="orderCost" type="number" step="any" min="0" placeholder="50" className="pl-7"
                value={orderCost} onChange={(e) => { setOrderCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="holdingCost">Holding Cost per Unit/Year</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="holdingCost" type="number" step="any" min="0" placeholder="3" className="pl-7"
                value={holdingCost} onChange={(e) => { setHoldingCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={D <= 0 || S <= 0 || H <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate EOQ
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Economic Order Quantity</p>
                <p className="text-4xl font-bold text-emerald-600">{`{eoq.toFixed(0)} units`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Orders per year: ${numOrders.toFixed(1)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Total inventory cost: ${formatCurrency(totalCost)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Minimizes ordering + holding cost'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annual Demand</p>
                    <p className={`text-lg font-bold`}>{`{D} units`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Order Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(S)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">EOQ</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{eoq.toFixed(0)} units`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Orders/Year</p>
                    <p className={`text-lg font-bold`}>{`{numOrders.toFixed(1)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`EOQ = √(2DS/H) where D = annual demand, S = order cost per order, H = holding cost per unit per year. Finds order size that minimizes total inventory cost (ordering + holding). Larger order cost or demand = larger EOQ. Larger holding cost = smaller EOQ. See our Reorder Point and Safety Stock Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Demand', valueA: `${compareA.D} units`, valueB: `${compareB.D} units`, numA: compareA.D, numB: compareB.D },
          { label: 'EOQ', valueA: `${compareA.eoq.toFixed(0)} units`, valueB: `${compareB.eoq.toFixed(0)} units`, numA: compareA.eoq, numB: compareB.eoq },
          { label: 'Orders/Year', valueA: compareA.numOrders.toFixed(1), valueB: compareB.numOrders.toFixed(1), numA: compareA.numOrders, numB: compareB.numOrders },
          { label: 'Total Cost', valueA: formatCurrency(compareA.totalCost), valueB: formatCurrency(compareB.totalCost), numA: compareA.totalCost, numB: compareB.totalCost }
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
