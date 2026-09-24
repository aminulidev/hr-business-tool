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

interface Snapshot { ni: number; assets: number; roa: number; ratio: number; label: string; }

export default function RoaCalculator() {
  const [netIncome, setNetIncome] = useState('');
  const [totalAssets, setTotalAssets] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ netIncome: string; totalAssets: string }>('roa-calculator');

  const ni = parseFloat(netIncome) || 0;
  const assets = parseFloat(totalAssets) || 0;
  const roa = assets > 0 ? (ni / assets) * 100 : 0;
  const ratio = assets > 0 ? ni / assets : 0;

  const handleTryExample = () => { setNetIncome('500000'); setTotalAssets('5000000'); setCalculated(false); };
  const handleCalculate = () => {
    if (ni !== 0 && assets > 0) {
      setCalculated(true);
      saveEntry({ netIncome, totalAssets }, `ROA: ${roa.toFixed(1)}% (${formatCurrency(ni)} on ${formatCurrency(assets)})`);
    }
  };
  const handleReset = () => { setNetIncome(''); setTotalAssets(''); setCalculated(false); };
  const handleRestore = (i: { netIncome: string; totalAssets: string }) => { setNetIncome(i.netIncome); setTotalAssets(i.totalAssets); setCalculated(true); };
  const snap = (): Snapshot => ({ ni, assets, roa, ratio, label: `ROA: ${roa.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          {`Return on Assets (ROA) = net income / total assets × 100. Measures how efficiently a company uses assets to generate profit. Tech: 10-15%, Retail: 5-10%, Banks: 1%.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="netIncome">Net Income (annual)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="netIncome" type="number" step="any" min="0" placeholder="500000" className="pl-7"
                value={netIncome} onChange={(e) => { setNetIncome(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalAssets">Total Assets</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalAssets" type="number" step="any" min="0" placeholder="5000000" className="pl-7"
                value={totalAssets} onChange={(e) => { setTotalAssets(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={assets <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate ROA
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Return on Assets (ROA)</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(roa)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Ratio: ${ratio.toFixed(2)}x`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{'Tech 10-15%, Retail 5-10%, Banks 1%'}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{roa < 3 ? "Low asset efficiency" : roa > 10 ? "Excellent" : "Healthy"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Net Income</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(ni)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Assets</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(assets)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ROA</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatPercent(roa)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Ratio</p>
                    <p className={`text-lg font-bold`}>{`{ratio.toFixed(2)}x`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`ROA = net income / total assets × 100. Measures asset efficiency — how much profit each $1 of assets generates. Industry varies: banks 1% (asset-heavy), retail 5-10%, tech 10-15%. Higher = better. DuPont: ROA = net margin × asset turnover. Compare to industry peers.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Net Income', valueA: formatCurrency(compareA.ni), valueB: formatCurrency(compareB.ni), numA: compareA.ni, numB: compareB.ni },
          { label: 'Total Assets', valueA: formatCurrency(compareA.assets), valueB: formatCurrency(compareB.assets), numA: compareA.assets, numB: compareB.assets },
          { label: 'ROA', valueA: formatPercent(compareA.roa), valueB: formatPercent(compareB.roa), numA: compareA.roa, numB: compareB.roa }
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
