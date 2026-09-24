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

interface Snapshot { f1i: number; f1c: number; f1t: number; f1p: number; f2i: number; f2c: number; f2t: number; f2p: number; f1Total: number; f2Total: number; f1Pct: number; f2Pct: number; label: string; }

export default function FounderEquitySplitCalculator() {
  const [f1Idea, setF1Idea] = useState('');
  const [f1Capital, setF1Capital] = useState('');
  const [f1Time, setF1Time] = useState('');
  const [f1IP, setF1IP] = useState('');
  const [f2Idea, setF2Idea] = useState('');
  const [f2Capital, setF2Capital] = useState('');
  const [f2Time, setF2Time] = useState('');
  const [f2IP, setF2IP] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ f1Idea: string; f1Capital: string; f1Time: string; f1IP: string; f2Idea: string; f2Capital: string; f2Time: string; f2IP: string }>('founder-equity-split-calculator');

  const f1i = parseFloat(f1Idea) || 0;
  const f1c = parseFloat(f1Capital) || 0;
  const f1t = parseFloat(f1Time) || 0;
  const f1p = parseFloat(f1IP) || 0;
  const f2i = parseFloat(f2Idea) || 0;
  const f2c = parseFloat(f2Capital) || 0;
  const f2t = parseFloat(f2Time) || 0;
  const f2p = parseFloat(f2IP) || 0;
  const f1Total = (f1i + f1c + f1t + f1p) / 4;
  const f2Total = (f2i + f2c + f2t + f2p) / 4;
  const f1Pct = f1Total + f2Total > 0 ? (f1Total / (f1Total + f2Total)) * 100 : 0;
  const f2Pct = f1Total + f2Total > 0 ? (f2Total / (f1Total + f2Total)) * 100 : 0;

  const handleTryExample = () => { setF1Idea('40'); setF1Capital('50'); setF1Time('60'); setF1IP('50'); setF2Idea('60'); setF2Capital('50'); setF2Time('40'); setF2IP('50'); setCalculated(false); };
  const handleCalculate = () => {
    if (f1Total + f2Total > 0) {
      setCalculated(true);
      saveEntry({ f1Idea, f1Capital, f1Time, f1IP, f2Idea, f2Capital, f2Time, f2IP }, `F1: ${f1Pct.toFixed(1)}% / F2: ${f2Pct.toFixed(1)}%`);
    }
  };
  const handleReset = () => { setF1Idea('50'); setF1Capital('50'); setF1Time('50'); setF1IP('50'); setF2Idea('50'); setF2Capital('50'); setF2Time('50'); setF2IP('50'); setCalculated(false); };
  const handleRestore = (i: { f1Idea: string; f1Capital: string; f1Time: string; f1IP: string; f2Idea: string; f2Capital: string; f2Time: string; f2IP: string }) => { setF1Idea(i.f1Idea); setF1Capital(i.f1Capital); setF1Time(i.f1Time); setF1IP(i.f1IP); setF2Idea(i.f2Idea); setF2Capital(i.f2Capital); setF2Time(i.f2Time); setF2IP(i.f2IP); setCalculated(true); };
  const snap = (): Snapshot => ({ f1i, f1c, f1t, f1p, f2i, f2c, f2t, f2p, f1Total, f2Total, f1Pct, f2Pct, label: `F1: ${f1Pct.toFixed(1)}% / F2: ${f2Pct.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Users className="inline h-3 w-3 mr-1" />
          {`Calculate fair founder equity split based on contributions: idea, capital, time, and IP.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="f1Idea">Founder 1: Idea (%)</Label>
            <div className="relative">
              
              <Input id="f1Idea" type="number" step="any" min="0" placeholder="40"
                value={f1Idea} onChange={(e) => { setF1Idea(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="f1Capital">Founder 1: Capital (%)</Label>
            <div className="relative">
              
              <Input id="f1Capital" type="number" step="any" min="0" placeholder="50"
                value={f1Capital} onChange={(e) => { setF1Capital(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="f1Time">Founder 1: Time (%)</Label>
            <div className="relative">
              
              <Input id="f1Time" type="number" step="any" min="0" placeholder="60"
                value={f1Time} onChange={(e) => { setF1Time(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="f1IP">Founder 1: IP/Skills (%)</Label>
            <div className="relative">
              
              <Input id="f1IP" type="number" step="any" min="0" placeholder="50"
                value={f1IP} onChange={(e) => { setF1IP(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="f2Idea">Founder 2: Idea (%)</Label>
            <div className="relative">
              
              <Input id="f2Idea" type="number" step="any" min="0" placeholder="60"
                value={f2Idea} onChange={(e) => { setF2Idea(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="f2Capital">Founder 2: Capital (%)</Label>
            <div className="relative">
              
              <Input id="f2Capital" type="number" step="any" min="0" placeholder="50"
                value={f2Capital} onChange={(e) => { setF2Capital(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="f2Time">Founder 2: Time (%)</Label>
            <div className="relative">
              
              <Input id="f2Time" type="number" step="any" min="0" placeholder="40"
                value={f2Time} onChange={(e) => { setF2Time(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="f2IP">Founder 2: IP/Skills (%)</Label>
            <div className="relative">
              
              <Input id="f2IP" type="number" step="any" min="0" placeholder="50"
                value={f2IP} onChange={(e) => { setF2IP(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={f1Total + f2Total <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Equity Split
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Founder Equity Split</p>
                <p className="text-4xl font-bold text-emerald-600">{`F1: ${f1Pct.toFixed(1)}% / F2: ${f2Pct.toFixed(1)}%`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Founder 1 weighted: ${f1Total.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Founder 2 weighted: ${f2Total.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Consider 4yr vest, 1yr cliff'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">F1 Weighted</p>
                    <p className={`text-lg font-bold`}>{`{f1Total.toFixed(1)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">F2 Weighted</p>
                    <p className={`text-lg font-bold`}>{`{f2Total.toFixed(1)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">F1 Equity</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{f1Pct.toFixed(1)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">F2 Equity</p>
                    <p className={`text-lg font-bold`}>{`{f2Pct.toFixed(1)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Founder equity split: weight contributions across idea, capital, time, IP/skills. Always use 4-year vesting with 1-year cliff.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'F1 Equity', valueA: `${compareA.f1Pct.toFixed(1)}%`, valueB: `${compareB.f1Pct.toFixed(1)}%`, numA: compareA.f1Pct, numB: compareB.f1Pct },
          { label: 'F2 Equity', valueA: `${compareA.f2Pct.toFixed(1)}%`, valueB: `${compareB.f2Pct.toFixed(1)}%`, numA: compareA.f2Pct, numB: compareB.f2Pct }
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
