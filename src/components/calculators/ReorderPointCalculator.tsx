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

interface Snapshot { demand: number; lt: number; ss: number; leadTimeDemand: number; reorderPoint: number; maxInventory: number; label: string; }

export default function ReorderPointCalculator() {
  const [avgDailyDemand, setAvgDailyDemand] = useState('');
  const [leadTimeDays, setLeadTimeDays] = useState('');
  const [safetyStock, setSafetyStock] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ avgDailyDemand: string; leadTimeDays: string; safetyStock: string }>('reorder-point-calculator');

  const demand = parseFloat(avgDailyDemand) || 0;
  const lt = parseFloat(leadTimeDays) || 0;
  const ss = parseFloat(safetyStock) || 0;
  const leadTimeDemand = demand * lt;
  const reorderPoint = leadTimeDemand + ss;
  const maxInventory = reorderPoint + 200;

  const handleTryExample = () => { setAvgDailyDemand('50'); setLeadTimeDays('10'); setSafetyStock('100'); setCalculated(false); };
  const handleCalculate = () => {
    if (demand > 0 && lt > 0) {
      setCalculated(true);
      saveEntry({ avgDailyDemand, leadTimeDays, safetyStock }, `ROP: ${reorderPoint.toFixed(0)} units (${leadTimeDemand.toFixed(0)} LTD + ${ss} SS)`);
    }
  };
  const handleReset = () => { setAvgDailyDemand(''); setLeadTimeDays(''); setSafetyStock(''); setCalculated(false); };
  const handleRestore = (i: { avgDailyDemand: string; leadTimeDays: string; safetyStock: string }) => { setAvgDailyDemand(i.avgDailyDemand); setLeadTimeDays(i.leadTimeDays); setSafetyStock(i.safetyStock); setCalculated(true); };
  const snap = (): Snapshot => ({ demand, lt, ss, leadTimeDemand, reorderPoint, maxInventory, label: `ROP: ${reorderPoint.toFixed(0)} units` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Boxes className="inline h-3 w-3 mr-1" />
          {`Reorder point = (avg daily demand × lead time) + safety stock. When inventory drops to ROP, place new order.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="avgDailyDemand">Avg Daily Demand (units)</Label>
            <div className="relative">
              
              <Input id="avgDailyDemand" type="number" step="any" min="0" placeholder="50"
                value={avgDailyDemand} onChange={(e) => { setAvgDailyDemand(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="leadTimeDays">Lead Time (days)</Label>
            <div className="relative">
              
              <Input id="leadTimeDays" type="number" step="any" min="0" placeholder="10"
                value={leadTimeDays} onChange={(e) => { setLeadTimeDays(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="safetyStock">Safety Stock (units)</Label>
            <div className="relative">
              
              <Input id="safetyStock" type="number" step="any" min="0" placeholder="100"
                value={safetyStock} onChange={(e) => { setSafetyStock(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={demand <= 0 || lt <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Reorder Point
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Reorder Point</p>
                <p className="text-4xl font-bold text-emerald-600">{`{reorderPoint.toFixed(0)} units`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Lead time demand: ${leadTimeDemand.toFixed(0)} units`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Safety stock: ${ss} units`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Reorder when inventory drops to ROP'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Daily Demand</p>
                    <p className={`text-lg font-bold`}>{`{demand} units`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Lead Time</p>
                    <p className={`text-lg font-bold`}>{`{lt} days`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Reorder Point</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{reorderPoint.toFixed(0)} units`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Lead Time Demand</p>
                    <p className={`text-lg font-bold`}>{`{leadTimeDemand.toFixed(0)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Reorder point = (avg daily demand × lead time in days) + safety stock. When inventory drops to ROP, place a new order. Lead time demand = demand during supplier lead time. Safety stock covers demand variability. Combine with EOQ for order quantity. See our Safety Stock and EOQ Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Daily Demand', valueA: `${compareA.demand} units`, valueB: `${compareB.demand} units`, numA: compareA.demand, numB: compareB.demand },
          { label: 'Lead Time', valueA: `${compareA.lt} days`, valueB: `${compareB.lt} days`, numA: compareA.lt, numB: compareB.lt },
          { label: 'Reorder Point', valueA: `${compareA.reorderPoint.toFixed(0)} units`, valueB: `${compareB.reorderPoint.toFixed(0)} units`, numA: compareA.reorderPoint, numB: compareB.reorderPoint },
          { label: 'Lead Time Demand', valueA: `${compareA.leadTimeDemand.toFixed(0)} units`, valueB: `${compareB.leadTimeDemand.toFixed(0)} units`, numA: compareA.leadTimeDemand, numB: compareB.leadTimeDemand }
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
