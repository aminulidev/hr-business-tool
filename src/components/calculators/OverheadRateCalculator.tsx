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

interface Snapshot { oh: number; base: number; overheadRate: number; monthlyOverhead: number; label: string; }

export default function OverheadRateCalculator() {
  const [totalOverhead, setTotalOverhead] = useState('');
  const [allocationBase, setAllocationBase] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalOverhead: string; allocationBase: string }>('overhead-rate-calculator');

  const oh = parseFloat(totalOverhead) || 0;
  const base = parseFloat(allocationBase) || 0;
  const overheadRate = base > 0 ? oh / base : 0;
  const monthlyOverhead = oh / 12;

  const handleTryExample = () => { setTotalOverhead('200000'); setAllocationBase('10000'); setCalculated(false); };
  const handleCalculate = () => {
    if (base > 0) {
      setCalculated(true);
      saveEntry({ totalOverhead, allocationBase }, `Rate: ${formatCurrency(overheadRate)}/unit (${formatCurrency(oh)} / ${base.toLocaleString()})`);
    }
  };
  const handleReset = () => { setTotalOverhead(''); setAllocationBase(''); setCalculated(false); };
  const handleRestore = (i: { totalOverhead: string; allocationBase: string }) => { setTotalOverhead(i.totalOverhead); setAllocationBase(i.allocationBase); setCalculated(true); };
  const snap = (): Snapshot => ({ oh, base, overheadRate, monthlyOverhead, label: `Rate: ${formatCurrency(overheadRate)}/unit` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Percent className="inline h-3 w-3 mr-1" />
          {`Calculate overhead rate = total overhead / allocation base.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalOverhead">Total Manufacturing Overhead</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalOverhead" type="number" step="any" min="0" placeholder="200000" className="pl-7"
                value={totalOverhead} onChange={(e) => { setTotalOverhead(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="allocationBase">Total Allocation Base (labor hrs)</Label>
            <div className="relative">
              
              <Input id="allocationBase" type="number" step="any" min="0" placeholder="10000"
                value={allocationBase} onChange={(e) => { setAllocationBase(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={base <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Overhead Rate
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Overhead Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{`${formatCurrency(overheadRate)}/unit`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Total overhead: ${formatCurrency(oh)}/yr`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Monthly: ${formatCurrency(monthlyOverhead)}/mo`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Base: ${base.toLocaleString()} units`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Overhead</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(oh)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Allocation Base</p>
                    <p className={`text-lg font-bold`}>{`{base.toLocaleString()}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Overhead Rate</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`${formatCurrency(overheadRate)}/unit`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Monthly OH</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(monthlyOverhead)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Overhead rate = total overhead / allocation base. Bases: labor hours, machine hours, labor cost.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Overhead', valueA: formatCurrency(compareA.oh), valueB: formatCurrency(compareB.oh), numA: compareA.oh, numB: compareB.oh },
          { label: 'Rate', valueA: formatCurrency(compareA.overheadRate), valueB: formatCurrency(compareB.overheadRate), numA: compareA.overheadRate, numB: compareB.overheadRate }
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
