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

interface Snapshot { b1u: number; b1c: number; b2u: number; b2c: number; sold: number; totalCost: number; totalUnits: number; wac: number; cogs: number; endingInventory: number; label: string; }

export default function WeightedAverageCostCalculator() {
  const [batch1Units, setBatch1Units] = useState('');
  const [batch1Cost, setBatch1Cost] = useState('');
  const [batch2Units, setBatch2Units] = useState('');
  const [batch2Cost, setBatch2Cost] = useState('');
  const [unitsSold, setUnitsSold] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ batch1Units: string; batch1Cost: string; batch2Units: string; batch2Cost: string; unitsSold: string }>('weighted-average-cost-calculator');

  const b1u = parseFloat(batch1Units) || 0;
  const b1c = parseFloat(batch1Cost) || 0;
  const b2u = parseFloat(batch2Units) || 0;
  const b2c = parseFloat(batch2Cost) || 0;
  const sold = parseFloat(unitsSold) || 0;
  const totalCost = b1u * b1c + b2u * b2c;
  const totalUnits = b1u + b2u;
  const wac = totalUnits > 0 ? totalCost / totalUnits : 0;
  const cogs = wac * sold;
  const endingInventory = wac * (totalUnits - sold);

  const handleTryExample = () => { setBatch1Units('100'); setBatch1Cost('10'); setBatch2Units('150'); setBatch2Cost('12'); setUnitsSold('200'); setCalculated(false); };
  const handleCalculate = () => {
    if (totalUnits > 0) {
      setCalculated(true);
      saveEntry({ batch1Units, batch1Cost, batch2Units, batch2Cost, unitsSold }, `WAC: ${formatCurrency(wac)}/unit (COGS: ${formatCurrency(cogs)}, ending: ${formatCurrency(endingInventory)})`);
    }
  };
  const handleReset = () => { setBatch1Units(''); setBatch1Cost(''); setBatch2Units(''); setBatch2Cost(''); setUnitsSold(''); setCalculated(false); };
  const handleRestore = (i: { batch1Units: string; batch1Cost: string; batch2Units: string; batch2Cost: string; unitsSold: string }) => { setBatch1Units(i.batch1Units); setBatch1Cost(i.batch1Cost); setBatch2Units(i.batch2Units); setBatch2Cost(i.batch2Cost); setUnitsSold(i.unitsSold); setCalculated(true); };
  const snap = (): Snapshot => ({ b1u, b1c, b2u, b2c, sold, totalCost, totalUnits, wac, cogs, endingInventory, label: `WAC: ${formatCurrency(wac)}/unit` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Boxes className="inline h-3 w-3 mr-1" />
          {`Calculate weighted average cost per unit for inventory valuation.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="batch1Units">Batch 1 Units</Label>
            <div className="relative">
              
              <Input id="batch1Units" type="number" step="any" min="0" placeholder="100"
                value={batch1Units} onChange={(e) => { setBatch1Units(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch1Cost">Batch 1 Unit Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="batch1Cost" type="number" step="any" min="0" placeholder="10" className="pl-7"
                value={batch1Cost} onChange={(e) => { setBatch1Cost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch2Units">Batch 2 Units</Label>
            <div className="relative">
              
              <Input id="batch2Units" type="number" step="any" min="0" placeholder="150"
                value={batch2Units} onChange={(e) => { setBatch2Units(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch2Cost">Batch 2 Unit Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="batch2Cost" type="number" step="any" min="0" placeholder="12" className="pl-7"
                value={batch2Cost} onChange={(e) => { setBatch2Cost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="unitsSold">Units Sold</Label>
            <div className="relative">
              
              <Input id="unitsSold" type="number" step="any" min="0" placeholder="200"
                value={unitsSold} onChange={(e) => { setUnitsSold(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={totalUnits <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate WAC
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Weighted Average Cost</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(wac) + "/unit"}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Total cost: ${formatCurrency(totalCost)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`COGS: ${formatCurrency(cogs)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Ending inventory: ${formatCurrency(endingInventory)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalCost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Units</p>
                    <p className={`text-lg font-bold`}>{`{totalUnits}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">WAC/Unit</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(wac)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">COGS</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cogs)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`WAC = total cost of all inventory / total units. COGS = WAC x units sold. Ending inventory = WAC x remaining units. WAC smooths price fluctuations. Simplest method when inventory items are interchangeable.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'WAC', valueA: formatCurrency(compareA.wac), valueB: formatCurrency(compareB.wac), numA: compareA.wac, numB: compareB.wac },
          { label: 'COGS', valueA: formatCurrency(compareA.cogs), valueB: formatCurrency(compareB.cogs), numA: compareA.cogs, numB: compareB.cogs }
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
