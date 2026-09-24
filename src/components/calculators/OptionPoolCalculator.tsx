'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { ts: number; ps: number; ch: number; poolShares: number; availableShares: number; reservedShares: number; perHire: number; perHirePct: number; label: string; }

export default function OptionPoolCalculator() {
  const [totalShares, setTotalShares] = useState('');
  const [poolSize, setPoolSize] = useState('');
  const [currentHires, setCurrentHires] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalShares: string; poolSize: string; currentHires: string }>('option-pool-calculator');

  const ts = parseFloat(totalShares) || 0;
  const ps = parseFloat(poolSize) || 0;
  const ch = parseFloat(currentHires) || 0;
  const poolShares = ts * (ps / 100);
  const availableShares = poolShares * 0.7;
  const reservedShares = poolShares * 0.3;
  const perHire = ch > 0 ? availableShares / ch : 0;
  const perHirePct = ts > 0 ? (perHire / ts) * 100 : 0;

  const handleTryExample = () => { setTotalShares('10000000'); setPoolSize('15'); setCurrentHires('10'); setCalculated(false); };
  const handleCalculate = () => {
    if (ts > 0 && ps > 0) {
      setCalculated(true);
      saveEntry({ totalShares, poolSize, currentHires }, `Pool: ${ps}% (${poolShares.toLocaleString()} shares, ${perHirePct.toFixed(2)}%/hire)`);
    }
  };
  const handleReset = () => { setTotalShares(''); setPoolSize('15'); setCurrentHires(''); setCalculated(false); };
  const handleRestore = (i: { totalShares: string; poolSize: string; currentHires: string }) => { setTotalShares(i.totalShares); setPoolSize(i.poolSize); setCurrentHires(i.currentHires); setCalculated(true); };
  const snap = (): Snapshot => ({ ts, ps, ch, poolShares, availableShares, reservedShares, perHire, perHirePct, label: `Pool: ${ps}% (${poolShares.toLocaleString()} shares)` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Users className="inline h-3 w-3 mr-1" />
          {`Calculate option pool size, available shares, and standard grants by role. Typical pool: 10-20%.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalShares">Total Outstanding Shares</Label>
            <div className="relative">
              
              <Input id="totalShares" type="number" step="any" min="0" placeholder="10000000"
                value={totalShares} onChange={(e) => { setTotalShares(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="poolSize">Option Pool Size (%)</Label>
            <div className="relative">
              
              <Input id="poolSize" type="number" step="any" min="0" placeholder="15"
                value={poolSize} onChange={(e) => { setPoolSize(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentHires">Current Employees with Options</Label>
            <div className="relative">
              
              <Input id="currentHires" type="number" step="any" min="0" placeholder="10"
                value={currentHires} onChange={(e) => { setCurrentHires(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={ts <= 0 || ps <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Option Pool
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Option Pool</p>
                <p className="text-4xl font-bold text-emerald-600">{`{poolShares.toLocaleString()} shares (${ps}%)`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Available: ${availableShares.toLocaleString()} shares`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Reserved: ${reservedShares.toLocaleString()} shares`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Per hire: ${perHirePct.toFixed(2)}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Pool Size</p>
                    <p className={`text-lg font-bold`}>{`{ps}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Pool Shares</p>
                    <p className={`text-lg font-bold`}>{`{poolShares.toLocaleString()}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Available</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{availableShares.toLocaleString()}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Per Hire</p>
                    <p className={`text-lg font-bold`}>{`{perHirePct.toFixed(2)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Option pool: 10-15% (post-A), 15-20% (pre-A). Grants: engineer 0.1-0.5%, VP 0.5-2%, C-level 2-5%. 4yr vest, 1yr cliff.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Pool Size', valueA: `${compareA.ps}%`, valueB: `${compareB.ps}%`, numA: compareA.ps, numB: compareB.ps },
          { label: 'Available', valueA: compareA.availableShares.toLocaleString(), valueB: compareB.availableShares.toLocaleString(), numA: compareA.availableShares, numB: compareB.availableShares }
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
