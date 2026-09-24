'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { dep: number; avg: number; attritionRate: number; annualized: number; label: string; }

export default function AttritionCalculator() {
  const [departures, setDepartures] = useState('');
  const [avgHeadcount, setAvgHeadcount] = useState('(start + end) / 2');
  const [periodMonths, setPeriodMonths] = useState('For annualization');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ departures: string; avgHeadcount: string; periodMonths: string }>('attrition-calculator');

  const dep = parseFloat(departures) || 0;
  const avg = parseFloat(avgHeadcount) || 0;
  const months = parseFloat(periodMonths) || 12;
  const attritionRate = avg > 0 ? (dep / avg) * 100 : 0;
  const monthlyRate = attritionRate / months;
  const annualized = monthlyRate * 12;

  const handleTryExample = () => { setDepartures('12'); setAvgHeadcount('100'); setPeriodMonths('12'); setCalculated(false); };
  const handleCalculate = () => {
    if (dep > 0 && avg > 0) {
      setCalculated(true);
      saveEntry({ departures, avgHeadcount, periodMonths }, `${attritionRate.toFixed(1)}% attrition (${dep}/${avg})`);
    }
  };
  const handleReset = () => { setDepartures(''); setAvgHeadcount(''); setPeriodMonths('12'); setCalculated(false); };
  const handleRestore = (i: { departures: string; avgHeadcount: string; periodMonths: string }) => { setDepartures(i.departures); setAvgHeadcount(i.avgHeadcount); setPeriodMonths(i.periodMonths); setCalculated(true); };
  const snap = (): Snapshot => ({ dep, avg, attritionRate, annualized, label: `${attritionRate.toFixed(1)}% attrition` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingDown className="inline h-3 w-3 mr-1" />
          {`Attrition rate = departures / average headcount × 100. Annualized rate scales period rate to a full year.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="departures">Departures in Period</Label>
            <div className="relative">
              
              <Input id="departures" type="number" step="any" min="0" placeholder="12"
                value={departures} onChange={(e) => { setDepartures(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgHeadcount">Average Headcount</Label>
            <div className="relative">
              
              <Input id="avgHeadcount" type="number" step="any" min="0" placeholder="100"
                value={avgHeadcount} onChange={(e) => { setAvgHeadcount(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">(start + end) / 2</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="periodMonths">Period Length (months)</Label>
            <div className="relative">
              
              <Input id="periodMonths" type="number" step="any" min="0" placeholder="12"
                value={periodMonths} onChange={(e) => { setPeriodMonths(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">For annualization</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={dep <= 0 || avg <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Attrition Rate
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Attrition Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(attritionRate)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-red-500/10 border-red-500/30 text-red-600'">{`${dep} departures`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Annualized: ${annualized.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{'Benchmark: 13% US avg'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Departures</p>
                    <p className={`text-lg font-bold`}>{`{dep}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Avg Headcount</p>
                    <p className={`text-lg font-bold`}>{`{avg}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Period Rate</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{attritionRate.toFixed(1)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annualized</p>
                    <p className={`text-lg font-bold`}>{`{annualized.toFixed(1)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Attrition rate includes voluntary (resignations) and involuntary (terminations, layoffs) departures. Annualized = (period rate / months) × 12. US average attrition: 13-18% depending on industry. For retention rate (inverse), see our Employee Retention Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Departures', valueA: String(compareA.dep), valueB: String(compareB.dep), numA: compareA.dep, numB: compareB.dep },
          { label: 'Avg Headcount', valueA: String(compareA.avg), valueB: String(compareB.avg), numA: compareA.avg, numB: compareB.avg },
          { label: 'Attrition %', valueA: formatPercent(compareA.attritionRate), valueB: formatPercent(compareB.attritionRate), numA: compareA.attritionRate, numB: compareB.attritionRate },
          { label: 'Annualized %', valueA: `${compareA.annualized.toFixed(1)}%`, valueB: `${compareB.annualized.toFixed(1)}%`, numA: compareA.annualized, numB: compareB.annualized }
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
