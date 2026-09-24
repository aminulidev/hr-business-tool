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

interface Snapshot { price: number; vc: number; units: number; cmPerUnit: number; cmRatio: number; totalCM: number; label: string; }

export default function ContributionMarginCalculator() {
  const [sellingPrice, setSellingPrice] = useState('');
  const [variableCost, setVariableCost] = useState('');
  const [unitsSold, setUnitsSold] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ sellingPrice: string; variableCost: string; unitsSold: string }>('contribution-margin-calculator');

  const price = parseFloat(sellingPrice) || 0;
  const vc = parseFloat(variableCost) || 0;
  const units = parseFloat(unitsSold) || 0;
  const cmPerUnit = price - vc;
  const cmRatio = price > 0 ? (cmPerUnit / price) * 100 : 0;
  const totalCM = cmPerUnit * units;
  const vcRatio = price > 0 ? (vc / price) * 100 : 0;

  const handleTryExample = () => { setSellingPrice('50'); setVariableCost('20'); setUnitsSold('1000'); setCalculated(false); };
  const handleCalculate = () => {
    if (price > 0 && vc >= 0) {
      setCalculated(true);
      saveEntry({ sellingPrice, variableCost, unitsSold }, `CM ratio: ${cmRatio.toFixed(1)}% (${formatCurrency(cmPerUnit)}/unit)`);
    }
  };
  const handleReset = () => { setSellingPrice(''); setVariableCost(''); setUnitsSold(''); setCalculated(false); };
  const handleRestore = (i: { sellingPrice: string; variableCost: string; unitsSold: string }) => { setSellingPrice(i.sellingPrice); setVariableCost(i.variableCost); setUnitsSold(i.unitsSold); setCalculated(true); };
  const snap = (): Snapshot => ({ price, vc, units, cmPerUnit, cmRatio, totalCM, label: `CM ratio: ${cmRatio.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Percent className="inline h-3 w-3 mr-1" />
          {`Contribution margin = (price - variable cost) / price × 100. Measures profit per unit after variable costs. Used for break-even analysis.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sellingPrice">Selling Price per Unit</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="sellingPrice" type="number" step="any" min="0" placeholder="50" className="pl-7"
                value={sellingPrice} onChange={(e) => { setSellingPrice(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="variableCost">Variable Cost per Unit</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="variableCost" type="number" step="any" min="0" placeholder="20" className="pl-7"
                value={variableCost} onChange={(e) => { setVariableCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="unitsSold">Units Sold (period)</Label>
            <div className="relative">
              
              <Input id="unitsSold" type="number" step="any" min="0" placeholder="1000"
                value={unitsSold} onChange={(e) => { setUnitsSold(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={price <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Contribution Margin
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Contribution Margin</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(cmRatio)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`CM per unit: ${formatCurrency(cmPerUnit)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Total CM: ${formatCurrency(totalCM)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Variable cost ratio: ${vcRatio.toFixed(1)}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Price</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(price)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Variable Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(vc)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">CM per Unit</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(cmPerUnit)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total CM</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalCM)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Contribution margin = price - variable cost per unit. CM ratio = CM / price × 100. Each unit contributes CM toward fixed costs and profit. Break-even units = fixed costs / CM per unit. High CM ratio = strong operating leverage. See our Break-Even Calculator and Contribution Calculator for CVP analysis.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Price', valueA: formatCurrency(compareA.price), valueB: formatCurrency(compareB.price), numA: compareA.price, numB: compareB.price },
          { label: 'Variable Cost', valueA: formatCurrency(compareA.vc), valueB: formatCurrency(compareB.vc), numA: compareA.vc, numB: compareB.vc },
          { label: 'CM per Unit', valueA: formatCurrency(compareA.cmPerUnit), valueB: formatCurrency(compareB.cmPerUnit), numA: compareA.cmPerUnit, numB: compareB.cmPerUnit },
          { label: 'CM Ratio', valueA: formatPercent(compareA.cmRatio), valueB: formatPercent(compareB.cmRatio), numA: compareA.cmRatio, numB: compareB.cmRatio }
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
