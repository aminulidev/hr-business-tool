'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { tc: number; d1: number; d2: number; d3: number; totalBase: number; dept1Cost: number; dept2Cost: number; dept3Cost: number; label: string; }

export default function CostAllocationCalculator() {
  const [totalCost, setTotalCost] = useState('');
  const [dept1Base, setDept1Base] = useState('');
  const [dept2Base, setDept2Base] = useState('');
  const [dept3Base, setDept3Base] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalCost: string; dept1Base: string; dept2Base: string; dept3Base: string }>('cost-allocation-calculator');

  const tc = parseFloat(totalCost) || 0;
  const d1 = parseFloat(dept1Base) || 0;
  const d2 = parseFloat(dept2Base) || 0;
  const d3 = parseFloat(dept3Base) || 0;
  const totalBase = d1 + d2 + d3;
  const dept1Cost = totalBase > 0 ? tc * (d1 / totalBase) : 0;
  const dept2Cost = totalBase > 0 ? tc * (d2 / totalBase) : 0;
  const dept3Cost = totalBase > 0 ? tc * (d3 / totalBase) : 0;

  const handleTryExample = () => { setTotalCost('100000'); setDept1Base('30'); setDept2Base('20'); setDept3Base('50'); setCalculated(false); };
  const handleCalculate = () => {
    if (tc > 0 && totalBase > 0) {
      setCalculated(true);
      saveEntry({ totalCost, dept1Base, dept2Base, dept3Base }, `Dept1: ${formatCurrency(dept1Cost)}, Dept2: ${formatCurrency(dept2Cost)}, Dept3: ${formatCurrency(dept3Cost)}`);
    }
  };
  const handleReset = () => { setTotalCost(''); setDept1Base(''); setDept2Base(''); setDept3Base(''); setCalculated(false); };
  const handleRestore = (i: { totalCost: string; dept1Base: string; dept2Base: string; dept3Base: string }) => { setTotalCost(i.totalCost); setDept1Base(i.dept1Base); setDept2Base(i.dept2Base); setDept3Base(i.dept3Base); setCalculated(true); };
  const snap = (): Snapshot => ({ tc, d1, d2, d3, totalBase, dept1Cost, dept2Cost, dept3Cost, label: `Allocated: ${formatCurrency(tc)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <PieChart className="inline h-3 w-3 mr-1" />
          {`Allocate shared costs to departments based on headcount, square footage, or usage.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalCost">Total Shared Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalCost" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={totalCost} onChange={(e) => { setTotalCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dept1Base">Dept 1 Allocation Base (e.g. headcount)</Label>
            <div className="relative">
              
              <Input id="dept1Base" type="number" step="any" min="0" placeholder="30"
                value={dept1Base} onChange={(e) => { setDept1Base(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dept2Base">Dept 2 Allocation Base</Label>
            <div className="relative">
              
              <Input id="dept2Base" type="number" step="any" min="0" placeholder="20"
                value={dept2Base} onChange={(e) => { setDept2Base(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dept3Base">Dept 3 Allocation Base</Label>
            <div className="relative">
              
              <Input id="dept3Base" type="number" step="any" min="0" placeholder="50"
                value={dept3Base} onChange={(e) => { setDept3Base(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={tc <= 0 || totalBase <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Allocate Costs
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Cost Allocation</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(dept1Cost) + " / " + formatCurrency(dept2Cost) + " / " + formatCurrency(dept3Cost)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Dept 1: ${formatCurrency(dept1Cost)} (${d1} base)`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Dept 2: ${formatCurrency(dept2Cost)} (${d2} base)`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Dept 3: ${formatCurrency(dept3Cost)} (${d3} base)`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(tc)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Base</p>
                    <p className={`text-lg font-bold`}>{`{totalBase}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Dept 1</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(dept1Cost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Dept 2/3</p>
                    <p className={`text-lg font-bold`}>{`${formatCurrency(dept2Cost)} / ${formatCurrency(dept3Cost)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Cost allocation = total cost x (dept base / total base). Allocation bases: headcount, square footage, revenue, usage hours, direct labor hours. Choose base that best reflects cost driver. Used for shared costs: rent, utilities, IT, admin.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total', valueA: formatCurrency(compareA.tc), valueB: formatCurrency(compareB.tc), numA: compareA.tc, numB: compareB.tc },
          { label: 'Dept 1', valueA: formatCurrency(compareA.dept1Cost), valueB: formatCurrency(compareB.dept1Cost), numA: compareA.dept1Cost, numB: compareB.dept1Cost }
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
