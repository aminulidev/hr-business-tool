'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { ca: number; cl: number; currentRatio: number; workingCapital: number; label: string; }

export default function CurrentRatioCalculator() {
  const [currentAssets, setCurrentAssets] = useState('');
  const [currentLiabilities, setCurrentLiabilities] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ currentAssets: string; currentLiabilities: string }>('current-ratio-calculator');

  const ca = parseFloat(currentAssets) || 0;
  const cl = parseFloat(currentLiabilities) || 0;
  const currentRatio = cl > 0 ? ca / cl : 0;
  const workingCapital = ca - cl;

  const handleTryExample = () => { setCurrentAssets('500000'); setCurrentLiabilities('300000'); setCalculated(false); };
  const handleCalculate = () => {
    if (cl > 0) {
      setCalculated(true);
      saveEntry({ currentAssets, currentLiabilities }, `Current ratio: ${currentRatio.toFixed(2)}x (WC ${formatCurrency(workingCapital)})`);
    }
  };
  const handleReset = () => { setCurrentAssets(''); setCurrentLiabilities(''); setCalculated(false); };
  const handleRestore = (i: { currentAssets: string; currentLiabilities: string }) => { setCurrentAssets(i.currentAssets); setCurrentLiabilities(i.currentLiabilities); setCalculated(true); };
  const snap = (): Snapshot => ({ ca, cl, currentRatio, workingCapital, label: `Current ratio: ${currentRatio.toFixed(2)}x` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Scale className="inline h-3 w-3 mr-1" />
          {`Current ratio = current assets / current liabilities. Measures short-term liquidity. Healthy: 1.5-2.0. Below 1.0 = risk.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentAssets">Current Assets</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="currentAssets" type="number" step="any" min="0" placeholder="500000" className="pl-7"
                value={currentAssets} onChange={(e) => { setCurrentAssets(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentLiabilities">Current Liabilities</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="currentLiabilities" type="number" step="any" min="0" placeholder="300000" className="pl-7"
                value={currentLiabilities} onChange={(e) => { setCurrentLiabilities(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={cl <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Current Ratio
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Current Ratio</p>
                <p className="text-4xl font-bold text-emerald-600">{`{currentRatio.toFixed(2)}x`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Working capital: ${formatCurrency(workingCapital)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{'Healthy: 1.5-2.0x'}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{currentRatio < 1 ? "Liquidity risk" : currentRatio > 2 ? "Conservative" : "Healthy"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Current Assets</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(ca)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Current Liabilities</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cl)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Current Ratio</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{currentRatio.toFixed(2)}x`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Working Capital</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(workingCapital)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Current ratio = current assets / current liabilities. Measures ability to pay short-term obligations. Healthy: 1.5-2.0x. Below 1.0 = liquidity risk (can't cover short-term debts). Above 3.0 = too conservative (idle cash). Industry varies: retail 1.5, manufacturing 2.0, services 1.5. See our Quick Ratio and Working Capital Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Current Assets', valueA: formatCurrency(compareA.ca), valueB: formatCurrency(compareB.ca), numA: compareA.ca, numB: compareB.ca },
          { label: 'Current Liabilities', valueA: formatCurrency(compareA.cl), valueB: formatCurrency(compareB.cl), numA: compareA.cl, numB: compareB.cl },
          { label: 'Current Ratio', valueA: `${compareA.currentRatio.toFixed(2)}x`, valueB: `${compareB.currentRatio.toFixed(2)}x`, numA: compareA.currentRatio, numB: compareB.currentRatio },
          { label: 'Working Capital', valueA: formatCurrency(compareA.workingCapital), valueB: formatCurrency(compareB.workingCapital), numA: compareA.workingCapital, numB: compareB.workingCapital }
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
