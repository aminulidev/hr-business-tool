'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { q: number; p: number; wr: number; coverage: number; weightedPipeline: number; gap: number; requiredPipeline: number; label: string; }

export default function PipelineCalculator() {
  const [quota, setQuota] = useState('');
  const [pipeline, setPipeline] = useState('');
  const [winRate, setWinRate] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ quota: string; pipeline: string; winRate: string }>('pipeline-calculator');

  const q = parseFloat(quota) || 0;
  const p = parseFloat(pipeline) || 0;
  const wr = parseFloat(winRate) || 0;
  const coverage = q > 0 ? p / q : 0;
  const weightedPipeline = p * (wr / 100);
  const gap = q - weightedPipeline;
  const requiredPipeline = wr > 0 ? q / (wr / 100) : 0;

  const handleTryExample = () => { setQuota('500000'); setPipeline('1500000'); setWinRate('25'); setCalculated(false); };
  const handleCalculate = () => {
    if (q > 0 && p > 0) {
      setCalculated(true);
      saveEntry({ quota, pipeline, winRate }, `Coverage: ${coverage.toFixed(2)}x (gap: ${formatCurrency(gap)})`);
    }
  };
  const handleReset = () => { setQuota(''); setPipeline(''); setWinRate('25'); setCalculated(false); };
  const handleRestore = (i: { quota: string; pipeline: string; winRate: string }) => { setQuota(i.quota); setPipeline(i.pipeline); setWinRate(i.winRate); setCalculated(true); };
  const snap = (): Snapshot => ({ q, p, wr, coverage, weightedPipeline, gap, requiredPipeline, label: `Coverage: ${coverage.toFixed(2)}x` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <BarChart3 className="inline h-3 w-3 mr-1" />
          {`Calculate pipeline coverage ratio and gap analysis. See how much pipeline you need to hit quota.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quota">Quota (period)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="quota" type="number" step="any" min="0" placeholder="500000" className="pl-7"
                value={quota} onChange={(e) => { setQuota(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pipeline">Current Pipeline</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="pipeline" type="number" step="any" min="0" placeholder="1500000" className="pl-7"
                value={pipeline} onChange={(e) => { setPipeline(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="winRate">Win Rate (%)</Label>
            <div className="relative">
              
              <Input id="winRate" type="number" step="any" min="0" placeholder="25"
                value={winRate} onChange={(e) => { setWinRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={q <= 0 || p <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Pipeline Coverage
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Pipeline Coverage Ratio</p>
                <p className="text-4xl font-bold text-emerald-600">{`{coverage.toFixed(2)}x`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Weighted pipeline: ${formatCurrency(weightedPipeline)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Gap to quota: ${formatCurrency(gap)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Required pipeline: ${formatCurrency(requiredPipeline)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Quota</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(q)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Pipeline</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(p)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Coverage</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{coverage.toFixed(2)}x`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Gap</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(gap)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Pipeline coverage = pipeline / quota. Target: 3-4x (need $3-4 in pipeline for every $1 of quota). Weighted pipeline = pipeline × win rate. Gap = quota - weighted pipeline (positive = shortfall). Required pipeline = quota / win rate. If coverage < 3x, focus on prospecting. See our Sales Forecast Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Quota', valueA: formatCurrency(compareA.q), valueB: formatCurrency(compareB.q), numA: compareA.q, numB: compareB.q },
          { label: 'Pipeline', valueA: formatCurrency(compareA.p), valueB: formatCurrency(compareB.p), numA: compareA.p, numB: compareB.p },
          { label: 'Coverage', valueA: `${compareA.coverage.toFixed(2)}x`, valueB: `${compareB.coverage.toFixed(2)}x`, numA: compareA.coverage, numB: compareB.coverage },
          { label: 'Gap', valueA: formatCurrency(compareA.gap), valueB: formatCurrency(compareB.gap), numA: compareA.gap, numB: compareB.gap }
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
