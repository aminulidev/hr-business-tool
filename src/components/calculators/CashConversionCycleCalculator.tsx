'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { dioV: number; dsoV: number; dpoV: number; ccc: number; operatingCycle: number; label: string; }

export default function CashConversionCycleCalculator() {
  const [dio, setDio] = useState('');
  const [dso, setDso] = useState('');
  const [dpo, setDpo] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ dio: string; dso: string; dpo: string }>('cash-conversion-cycle-calculator');

  const dioV = parseFloat(dio) || 0;
  const dsoV = parseFloat(dso) || 0;
  const dpoV = parseFloat(dpo) || 0;
  const ccc = dioV + dsoV - dpoV;
  const operatingCycle = dioV + dsoV;

  const handleTryExample = () => { setDio('60'); setDso('45'); setDpo('30'); setCalculated(false); };
  const handleCalculate = () => {
    if (true) {
      setCalculated(true);
      saveEntry({ dio, dso, dpo }, `CCC: ${ccc.toFixed(0)} days (DIO ${dioV} + DSO ${dsoV} - DPO ${dpoV})`);
    }
  };
  const handleReset = () => { setDio('60'); setDso('45'); setDpo('30'); setCalculated(false); };
  const handleRestore = (i: { dio: string; dso: string; dpo: string }) => { setDio(i.dio); setDso(i.dso); setDpo(i.dpo); setCalculated(true); };
  const snap = (): Snapshot => ({ dioV, dsoV, dpoV, ccc, operatingCycle, label: `CCC: ${ccc.toFixed(0)} days` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Clock className="inline h-3 w-3 mr-1" />
          {`Cash conversion cycle = DIO + DSO - DPO. Measures days to convert inventory investment to cash. Shorter = better.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dio">Days Inventory Outstanding (DIO)</Label>
            <div className="relative">
              
              <Input id="dio" type="number" step="any" min="0" placeholder="60"
                value={dio} onChange={(e) => { setDio(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dso">Days Sales Outstanding (DSO)</Label>
            <div className="relative">
              
              <Input id="dso" type="number" step="any" min="0" placeholder="45"
                value={dso} onChange={(e) => { setDso(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dpo">Days Payable Outstanding (DPO)</Label>
            <div className="relative">
              
              <Input id="dpo" type="number" step="any" min="0" placeholder="30"
                value={dpo} onChange={(e) => { setDpo(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={false}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Cash Conversion Cycle
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Cash Conversion Cycle</p>
                <p className="text-4xl font-bold text-emerald-600">{`{ccc.toFixed(0)} days`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Operating cycle: ${operatingCycle.toFixed(0)} days`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{'Typical: 30-90 days'}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{ccc < 30 ? "Excellent" : ccc < 60 ? "Healthy" : "Long cycle"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">DIO</p>
                    <p className={`text-lg font-bold`}>{`{dioV} days`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">DSO</p>
                    <p className={`text-lg font-bold`}>{`{dsoV} days`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">DPO</p>
                    <p className={`text-lg font-bold`}>{`{dpoV} days`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">CCC</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{ccc.toFixed(0)} days`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Cash conversion cycle (CCC) = DIO + DSO - DPO. DIO = days inventory outstanding (inventory → sale). DSO = days sales outstanding (sale → cash). DPO = days payable outstanding (purchase → payment). CCC measures time from cash out (inventory purchase) to cash in (sale collected). Shorter = better. Negative CCC = supplier funds your business (Amazon model). See our Inventory Turnover Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'DIO', valueA: `${compareA.dioV} days`, valueB: `${compareB.dioV} days`, numA: compareA.dioV, numB: compareB.dioV },
          { label: 'DSO', valueA: `${compareA.dsoV} days`, valueB: `${compareB.dsoV} days`, numA: compareA.dsoV, numB: compareB.dsoV },
          { label: 'DPO', valueA: `${compareA.dpoV} days`, valueB: `${compareB.dpoV} days`, numA: compareA.dpoV, numB: compareB.dpoV },
          { label: 'CCC', valueA: `${compareA.ccc.toFixed(0)} days`, valueB: `${compareB.ccc.toFixed(0)} days`, numA: compareA.ccc, numB: compareB.ccc }
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
