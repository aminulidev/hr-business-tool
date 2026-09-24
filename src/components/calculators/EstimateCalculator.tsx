'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { best: number; likely: number; worst: number; rate: number; con: number; pert: number; avg: number; range: number; costLow: number; costExpected: number; costHigh: number; bufferedHours: number; bufferedCost: number; label: string; }

export default function EstimateCalculator() {
  const [bestCase, setBestCase] = useState('');
  const [likelyCase, setLikelyCase] = useState('');
  const [worstCase, setWorstCase] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [contingencyPct, setContingencyPct] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ bestCase: string; likelyCase: string; worstCase: string; hourlyRate: string; contingencyPct: string }>('estimate-calculator');

  const best = parseFloat(bestCase) || 0;
  const likely = parseFloat(likelyCase) || 0;
  const worst = parseFloat(worstCase) || 0;
  const rate = parseFloat(hourlyRate) || 0;
  const con = parseFloat(contingencyPct) || 0;
  const pert = (best + 4 * likely + worst) / 6;
  const avg = (best + likely + worst) / 3;
  const range = worst - best;
  const costLow = best * rate;
  const costExpected = pert * rate;
  const costHigh = worst * rate;
  const bufferedHours = pert * (1 + con / 100);
  const bufferedCost = bufferedHours * rate;

  const handleTryExample = () => { setBestCase('60'); setLikelyCase('80'); setWorstCase('120'); setHourlyRate('75'); setContingencyPct('15'); setCalculated(false); };
  const handleCalculate = () => {
    if (best > 0 && likely > 0 && worst > 0) {
      setCalculated(true);
      saveEntry({ bestCase, likelyCase, worstCase, hourlyRate, contingencyPct }, `PERT: ${pert.toFixed(1)}h (range ${best}-${worst}h, cost ${formatCurrency(bufferedCost)} with buffer)`);
    }
  };
  const handleReset = () => { setBestCase(''); setLikelyCase(''); setWorstCase(''); setHourlyRate(''); setContingencyPct('15'); setCalculated(false); };
  const handleRestore = (i: { bestCase: string; likelyCase: string; worstCase: string; hourlyRate: string; contingencyPct: string }) => { setBestCase(i.bestCase); setLikelyCase(i.likelyCase); setWorstCase(i.worstCase); setHourlyRate(i.hourlyRate); setContingencyPct(i.contingencyPct); setCalculated(true); };
  const snap = (): Snapshot => ({ best, likely, worst, rate, con, pert, avg, range, costLow, costExpected, costHigh, bufferedHours, bufferedCost, label: `PERT: ${pert.toFixed(1)}h` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <FileText className="inline h-3 w-3 mr-1" />
          {`Calculate project estimate using three-point estimation (PERT): best, likely, worst case. See expected hours and cost.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bestCase">Best Case Hours</Label>
            <div className="relative">
              
              <Input id="bestCase" type="number" step="any" min="0" placeholder="60"
                value={bestCase} onChange={(e) => { setBestCase(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="likelyCase">Most Likely Hours</Label>
            <div className="relative">
              
              <Input id="likelyCase" type="number" step="any" min="0" placeholder="80"
                value={likelyCase} onChange={(e) => { setLikelyCase(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="worstCase">Worst Case Hours</Label>
            <div className="relative">
              
              <Input id="worstCase" type="number" step="any" min="0" placeholder="120"
                value={worstCase} onChange={(e) => { setWorstCase(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly Rate</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="hourlyRate" type="number" step="any" min="0" placeholder="75" className="pl-7"
                value={hourlyRate} onChange={(e) => { setHourlyRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contingencyPct">Contingency Buffer (%)</Label>
            <div className="relative">
              
              <Input id="contingencyPct" type="number" step="any" min="0" placeholder="15"
                value={contingencyPct} onChange={(e) => { setContingencyPct(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={best <= 0 || likely <= 0 || worst <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Estimate
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Expected Hours (PERT)</p>
                <p className="text-4xl font-bold text-emerald-600">{`${pert.toFixed(1)} hours`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Simple average: ${avg.toFixed(1)}h`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Range: ${best}h - ${worst}h (${range}h spread)`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`With buffer: ${bufferedHours.toFixed(1)}h (${formatCurrency(bufferedCost)})`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">PERT Expected</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`${pert.toFixed(1)}h`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Cost (Expected)</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(costExpected)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Cost Range</p>
                    <p className={`text-lg font-bold`}>{`${formatCurrency(costLow)} - ${formatCurrency(costHigh)}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">With Buffer</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(bufferedCost)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`PERT = (Best + 4xLikely + Worst) / 6. Weighted toward most likely. More accurate than simple average. Range = worst - best (uncertainty). Add 10-20% contingency buffer. Use for: project bidding, sprint planning, capacity planning. See our Project Pricing Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'PERT', valueA: `${compareA.pert.toFixed(1)}h`, valueB: `${compareB.pert.toFixed(1)}h`, numA: compareA.pert, numB: compareB.pert },
          { label: 'Cost (Expected)', valueA: formatCurrency(compareA.costExpected), valueB: formatCurrency(compareB.costExpected), numA: compareA.costExpected, numB: compareB.costExpected },
          { label: 'With Buffer', valueA: formatCurrency(compareA.bufferedCost), valueB: formatCurrency(compareB.bufferedCost), numA: compareA.bufferedCost, numB: compareB.bufferedCost }
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
