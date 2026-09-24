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

interface Snapshot { rev: number; ba: number; ea: number; avgAssets: number; turnover: number; label: string; }

export default function AssetTurnoverCalculator() {
  const [revenue, setRevenue] = useState('');
  const [beginAssets, setBeginAssets] = useState('');
  const [endAssets, setEndAssets] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ revenue: string; beginAssets: string; endAssets: string }>('asset-turnover-calculator');

  const rev = parseFloat(revenue) || 0;
  const ba = parseFloat(beginAssets) || 0;
  const ea = parseFloat(endAssets) || 0;
  const avgAssets = (ba + ea) / 2;
  const turnover = avgAssets > 0 ? rev / avgAssets : 0;

  const handleTryExample = () => { setRevenue('2000000'); setBeginAssets('1500000'); setEndAssets('1700000'); setCalculated(false); };
  const handleCalculate = () => {
    if (rev > 0 && (ba > 0 || ea > 0)) {
      setCalculated(true);
      saveEntry({ revenue, beginAssets, endAssets }, `Asset turnover: ${turnover.toFixed(2)}x (${formatCurrency(rev)} / ${formatCurrency(avgAssets)})`);
    }
  };
  const handleReset = () => { setRevenue(''); setBeginAssets(''); setEndAssets(''); setCalculated(false); };
  const handleRestore = (i: { revenue: string; beginAssets: string; endAssets: string }) => { setRevenue(i.revenue); setBeginAssets(i.beginAssets); setEndAssets(i.endAssets); setCalculated(true); };
  const snap = (): Snapshot => ({ rev, ba, ea, avgAssets, turnover, label: `Asset turnover: ${turnover.toFixed(2)}x` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          {`Asset turnover = revenue / average total assets. Measures efficiency of asset utilization. Retail: 2.5x, Tech: 0.8x, Mfg: 1.0x.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenue">Total Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="revenue" type="number" step="any" min="0" placeholder="2000000" className="pl-7"
                value={revenue} onChange={(e) => { setRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="beginAssets">Beginning Total Assets</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="beginAssets" type="number" step="any" min="0" placeholder="1500000" className="pl-7"
                value={beginAssets} onChange={(e) => { setBeginAssets(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endAssets">Ending Total Assets</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="endAssets" type="number" step="any" min="0" placeholder="1700000" className="pl-7"
                value={endAssets} onChange={(e) => { setEndAssets(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={rev <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Asset Turnover
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Asset Turnover Ratio</p>
                <p className="text-4xl font-bold text-emerald-600">{`{turnover.toFixed(2)}x`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Avg assets: ${formatCurrency(avgAssets)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{'Retail 2.5x, Tech 0.8x, Mfg 1.0x'}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{turnover < 1 ? "Low efficiency" : turnover > 2 ? "High efficiency" : "Healthy"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(rev)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Avg Assets</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(avgAssets)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Turnover</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{turnover.toFixed(2)}x`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Per $1 Asset</p>
                    <p className={`text-lg font-bold`}>{`$${turnover.toFixed(2)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Asset turnover = revenue / average total assets. Measures how efficiently assets generate revenue. Higher = better. Industry: retail 2.5x (low assets, high volume), tech 0.8x (high asset base), manufacturing 1.0x. DuPont: ROA = net margin × asset turnover. Improve by: increasing revenue, reducing asset base, or both. See our ROA Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'Avg Assets', valueA: formatCurrency(compareA.avgAssets), valueB: formatCurrency(compareB.avgAssets), numA: compareA.avgAssets, numB: compareB.avgAssets },
          { label: 'Turnover', valueA: `${compareA.turnover.toFixed(2)}x`, valueB: `${compareB.turnover.toFixed(2)}x`, numA: compareA.turnover, numB: compareB.turnover }
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
