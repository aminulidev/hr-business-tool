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

interface Snapshot { price: number; vc: number; units: number; fc: number; cmPerUnit: number; totalCM: number; cmRatio: number; netProfit: number; breakEvenUnits: number; label: string; }

export default function ContributionCalculator() {
  const [sellingPrice, setSellingPrice] = useState('');
  const [variableCost, setVariableCost] = useState('');
  const [unitsSold, setUnitsSold] = useState('');
  const [fixedCosts, setFixedCosts] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ sellingPrice: string; variableCost: string; unitsSold: string; fixedCosts: string }>('contribution-calculator');

  const price = parseFloat(sellingPrice) || 0;
  const vc = parseFloat(variableCost) || 0;
  const units = parseFloat(unitsSold) || 0;
  const fc = parseFloat(fixedCosts) || 0;
  const cmPerUnit = price - vc;
  const totalCM = cmPerUnit * units;
  const cmRatio = price > 0 ? (cmPerUnit / price) * 100 : 0;
  const netProfit = totalCM - fc;
  const breakEvenUnits = cmPerUnit > 0 ? fc / cmPerUnit : 0;

  const handleTryExample = () => { setSellingPrice('50'); setVariableCost('20'); setUnitsSold('2000'); setFixedCosts('45000'); setCalculated(false); };
  const handleCalculate = () => {
    if (price > 0 && units > 0) {
      setCalculated(true);
      saveEntry({ sellingPrice, variableCost, unitsSold, fixedCosts }, `Total CM: ${formatCurrency(totalCM)}, Net profit: ${formatCurrency(netProfit)}`);
    }
  };
  const handleReset = () => { setSellingPrice(''); setVariableCost(''); setUnitsSold(''); setFixedCosts(''); setCalculated(false); };
  const handleRestore = (i: { sellingPrice: string; variableCost: string; unitsSold: string; fixedCosts: string }) => { setSellingPrice(i.sellingPrice); setVariableCost(i.variableCost); setUnitsSold(i.unitsSold); setFixedCosts(i.fixedCosts); setCalculated(true); };
  const snap = (): Snapshot => ({ price, vc, units, fc, cmPerUnit, totalCM, cmRatio, netProfit, breakEvenUnits, label: `Total CM: ${formatCurrency(totalCM)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Percent className="inline h-3 w-3 mr-1" />
          {`Total contribution = (price - variable cost) × units. Used for CVP analysis, break-even, and target profit.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <Label htmlFor="unitsSold">Units Sold</Label>
            <div className="relative">
              
              <Input id="unitsSold" type="number" step="any" min="0" placeholder="2000"
                value={unitsSold} onChange={(e) => { setUnitsSold(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fixedCosts">Total Fixed Costs</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="fixedCosts" type="number" step="any" min="0" placeholder="45000" className="pl-7"
                value={fixedCosts} onChange={(e) => { setFixedCosts(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={price <= 0 || units <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Contribution
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Contribution Margin</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalCM)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`CM per unit: ${formatCurrency(cmPerUnit)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Net profit: ${formatCurrency(netProfit)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Break-even: ${breakEvenUnits.toFixed(0)} units`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(price * units)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Variable Costs</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(vc * units)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total CM</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalCM)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(netProfit)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Total contribution margin = (price - variable cost) × units = contribution toward fixed costs and profit. CM ratio = CM / price × 100. Break-even units = fixed costs / CM per unit. Net profit = total CM - fixed costs. Used for CVP (cost-volume-profit) analysis. See our Contribution Margin and Break-Even Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'CM per Unit', valueA: formatCurrency(compareA.cmPerUnit), valueB: formatCurrency(compareB.cmPerUnit), numA: compareA.cmPerUnit, numB: compareB.cmPerUnit },
          { label: 'Total CM', valueA: formatCurrency(compareA.totalCM), valueB: formatCurrency(compareB.totalCM), numA: compareA.totalCM, numB: compareB.totalCM },
          { label: 'Net Profit', valueA: formatCurrency(compareA.netProfit), valueB: formatCurrency(compareB.netProfit), numA: compareA.netProfit, numB: compareB.netProfit },
          { label: 'Break-even', valueA: `${compareA.breakEvenUnits.toFixed(0)} units`, valueB: `${compareB.breakEvenUnits.toFixed(0)} units`, numA: compareA.breakEvenUnits, numB: compareB.breakEvenUnits }
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
