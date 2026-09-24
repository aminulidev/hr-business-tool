'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { sm: number; em: number; cm: number; ctm: number; endingMrr: number; nrr: number; grr: number; netChurn: number; label: string; }

export default function NetRevenueRetentionCalculator() {
  const [startingMrr, setStartingMrr] = useState('');
  const [expansionMrr, setExpansionMrr] = useState('');
  const [churnedMrr, setChurnedMrr] = useState('');
  const [contractionMrr, setContractionMrr] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ startingMrr: string; expansionMrr: string; churnedMrr: string; contractionMrr: string }>('net-revenue-retention-calculator');

  const sm = parseFloat(startingMrr) || 0;
  const em = parseFloat(expansionMrr) || 0;
  const cm = parseFloat(churnedMrr) || 0;
  const ctm = parseFloat(contractionMrr) || 0;
  const endingMrr = sm + em - cm - ctm;
  const nrr = sm > 0 ? (endingMrr / sm) * 100 : 0;
  const grr = sm > 0 ? ((sm - cm - ctm) / sm) * 100 : 0;
  const netChurn = 100 - nrr;

  const handleTryExample = () => { setStartingMrr('100000'); setExpansionMrr('8000'); setChurnedMrr('3000'); setContractionMrr('2000'); setCalculated(false); };
  const handleCalculate = () => {
    if (sm > 0) {
      setCalculated(true);
      saveEntry({ startingMrr, expansionMrr, churnedMrr, contractionMrr }, `NRR: ${nrr.toFixed(1)}% (GRR: ${grr.toFixed(1)}%)`);
    }
  };
  const handleReset = () => { setStartingMrr(''); setExpansionMrr(''); setChurnedMrr(''); setContractionMrr(''); setCalculated(false); };
  const handleRestore = (i: { startingMrr: string; expansionMrr: string; churnedMrr: string; contractionMrr: string }) => { setStartingMrr(i.startingMrr); setExpansionMrr(i.expansionMrr); setChurnedMrr(i.churnedMrr); setContractionMrr(i.contractionMrr); setCalculated(true); };
  const snap = (): Snapshot => ({ sm, em, cm, ctm, endingMrr, nrr, grr, netChurn, label: `NRR: ${nrr.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          {`Calculate NRR = (starting MRR + expansion - churn - contraction) / starting MRR. Benchmark: >110%.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startingMrr">Starting MRR</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="startingMrr" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={startingMrr} onChange={(e) => { setStartingMrr(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expansionMrr">Expansion MRR</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="expansionMrr" type="number" step="any" min="0" placeholder="8000" className="pl-7"
                value={expansionMrr} onChange={(e) => { setExpansionMrr(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="churnedMrr">Churned MRR</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="churnedMrr" type="number" step="any" min="0" placeholder="3000" className="pl-7"
                value={churnedMrr} onChange={(e) => { setChurnedMrr(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractionMrr">Contraction MRR</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="contractionMrr" type="number" step="any" min="0" placeholder="2000" className="pl-7"
                value={contractionMrr} onChange={(e) => { setContractionMrr(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={sm <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate NRR
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Net Revenue Retention</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(nrr)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`GRR: ${formatPercent(grr)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Net churn: ${formatPercent(netChurn)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{nrr > 110 ? "Excellent" : nrr > 100 ? "Healthy" : "Below 100%"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Starting MRR</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(sm)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Ending MRR</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(endingMrr)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">NRR</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatPercent(nrr)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">GRR</p>
                    <p className={`text-lg font-bold`}>{formatPercent(grr)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`NRR = (starting MRR + expansion - churn - contraction) / starting MRR. SaaS benchmark: >110%.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'NRR', valueA: formatPercent(compareA.nrr), valueB: formatPercent(compareB.nrr), numA: compareA.nrr, numB: compareB.nrr },
          { label: 'GRR', valueA: formatPercent(compareA.grr), valueB: formatPercent(compareB.grr), numA: compareA.grr, numB: compareB.grr }
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
