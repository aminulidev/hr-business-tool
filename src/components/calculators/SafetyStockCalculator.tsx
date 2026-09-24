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

interface Snapshot { avgD: number; sigma: number; lt: number; sl: number; zScore: number; safetyStock: number; avgLtDemand: number; reorderPoint: number; label: string; }

export default function SafetyStockCalculator() {
  const [avgDemand, setAvgDemand] = useState('');
  const [demandStdDev, setDemandStdDev] = useState('');
  const [avgLeadTime, setAvgLeadTime] = useState('');
  const [serviceLevel, setServiceLevel] = useState('90, 95, or 99');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ avgDemand: string; demandStdDev: string; avgLeadTime: string; serviceLevel: string }>('safety-stock-calculator');

  const avgD = parseFloat(avgDemand) || 0;
  const sigma = parseFloat(demandStdDev) || 0;
  const lt = parseFloat(avgLeadTime) || 0;
  const sl = parseFloat(serviceLevel) || 95;
  const zScore = sl >= 99 ? 2.33 : sl >= 95 ? 1.65 : sl >= 90 ? 1.28 : 1.0;
  const safetyStock = zScore * sigma * Math.sqrt(lt);
  const avgLtDemand = avgD * lt;
  const reorderPoint = avgLtDemand + safetyStock;

  const handleTryExample = () => { setAvgDemand('100'); setDemandStdDev('20'); setAvgLeadTime('7'); setServiceLevel('95'); setCalculated(false); };
  const handleCalculate = () => {
    if (avgD > 0 && sigma > 0 && lt > 0) {
      setCalculated(true);
      saveEntry({ avgDemand, demandStdDev, avgLeadTime, serviceLevel }, `Safety stock: ${safetyStock.toFixed(0)} units (${serviceLevel}% service level)`);
    }
  };
  const handleReset = () => { setAvgDemand(''); setDemandStdDev(''); setAvgLeadTime(''); setServiceLevel('95'); setCalculated(false); };
  const handleRestore = (i: { avgDemand: string; demandStdDev: string; avgLeadTime: string; serviceLevel: string }) => { setAvgDemand(i.avgDemand); setDemandStdDev(i.demandStdDev); setAvgLeadTime(i.avgLeadTime); setServiceLevel(i.serviceLevel); setCalculated(true); };
  const snap = (): Snapshot => ({ avgD, sigma, lt, sl, zScore, safetyStock, avgLtDemand, reorderPoint, label: `Safety stock: ${safetyStock.toFixed(0)} units` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Boxes className="inline h-3 w-3 mr-1" />
          {`Safety stock = Z × σ × √lead time. Buffer inventory to prevent stockouts. Service level: 90% = 1.28, 95% = 1.65, 99% = 2.33.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="avgDemand">Average Daily Demand (units)</Label>
            <div className="relative">
              
              <Input id="avgDemand" type="number" step="any" min="0" placeholder="100"
                value={avgDemand} onChange={(e) => { setAvgDemand(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="demandStdDev">Demand Std Deviation (units)</Label>
            <div className="relative">
              
              <Input id="demandStdDev" type="number" step="any" min="0" placeholder="20"
                value={demandStdDev} onChange={(e) => { setDemandStdDev(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgLeadTime">Avg Lead Time (days)</Label>
            <div className="relative">
              
              <Input id="avgLeadTime" type="number" step="any" min="0" placeholder="7"
                value={avgLeadTime} onChange={(e) => { setAvgLeadTime(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceLevel">Service Level (%)</Label>
            <div className="relative">
              
              <Input id="serviceLevel" type="number" step="any" min="0" placeholder="95"
                value={serviceLevel} onChange={(e) => { setServiceLevel(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">90, 95, or 99</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={avgD <= 0 || sigma <= 0 || lt <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Safety Stock
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Safety Stock Level</p>
                <p className="text-4xl font-bold text-emerald-600">{`{safetyStock.toFixed(0)} units`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Z-score: ${zScore.toFixed(2)} (${serviceLevel}% service)`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Reorder point: ${reorderPoint.toFixed(0)} units`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Lead time demand: ${avgLtDemand.toFixed(0)} units`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Avg Daily Demand</p>
                    <p className={`text-lg font-bold`}>{`{avgD} units`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Std Dev</p>
                    <p className={`text-lg font-bold`}>{`{sigma} units`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Safety Stock</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{safetyStock.toFixed(0)} units`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Reorder Point</p>
                    <p className={`text-lg font-bold`}>{`{reorderPoint.toFixed(0)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Safety stock = Z × σ × √lead time, where Z = service level (90% = 1.28, 95% = 1.65, 99% = 2.33), σ = demand standard deviation, √lead time in days. Higher service level or demand variability = more safety stock. Reorder point = (avg daily demand × lead time) + safety stock. See our Reorder Point and EOQ Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Avg Demand', valueA: `${compareA.avgD} units`, valueB: `${compareB.avgD} units`, numA: compareA.avgD, numB: compareB.avgD },
          { label: 'Std Dev', valueA: `${compareA.sigma} units`, valueB: `${compareB.sigma} units`, numA: compareA.sigma, numB: compareB.sigma },
          { label: 'Safety Stock', valueA: `${compareA.safetyStock.toFixed(0)} units`, valueB: `${compareB.safetyStock.toFixed(0)} units`, numA: compareA.safetyStock, numB: compareB.safetyStock },
          { label: 'Reorder Point', valueA: `${compareA.reorderPoint.toFixed(0)} units`, valueB: `${compareB.reorderPoint.toFixed(0)} units`, numA: compareA.reorderPoint, numB: compareB.reorderPoint }
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
