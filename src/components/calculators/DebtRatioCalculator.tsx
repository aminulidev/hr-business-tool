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

interface Snapshot { liab: number; assets: number; debtRatio: number; equity: number; debtToEquity: number; label: string; }

export default function DebtRatioCalculator() {
  const [totalLiabilities, setTotalLiabilities] = useState('');
  const [totalAssets, setTotalAssets] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalLiabilities: string; totalAssets: string }>('debt-ratio-calculator');

  const liab = parseFloat(totalLiabilities) || 0;
  const assets = parseFloat(totalAssets) || 0;
  const debtRatio = assets > 0 ? (liab / assets) * 100 : 0;
  const equity = assets - liab;
  const debtToEquity = equity > 0 ? liab / equity : 0;

  const handleTryExample = () => { setTotalLiabilities('400000'); setTotalAssets('1000000'); setCalculated(false); };
  const handleCalculate = () => {
    if (assets > 0) {
      setCalculated(true);
      saveEntry({ totalLiabilities, totalAssets }, `Debt ratio: ${debtRatio.toFixed(1)}% (D/E ${debtToEquity.toFixed(2)}x)`);
    }
  };
  const handleReset = () => { setTotalLiabilities(''); setTotalAssets(''); setCalculated(false); };
  const handleRestore = (i: { totalLiabilities: string; totalAssets: string }) => { setTotalLiabilities(i.totalLiabilities); setTotalAssets(i.totalAssets); setCalculated(true); };
  const snap = (): Snapshot => ({ liab, assets, debtRatio, equity, debtToEquity, label: `Debt ratio: ${debtRatio.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Scale className="inline h-3 w-3 mr-1" />
          {`Debt ratio = total liabilities / total assets × 100. Measures financial leverage. Healthy: 30-50%. Above 60% = high leverage.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalLiabilities">Total Liabilities</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalLiabilities" type="number" step="any" min="0" placeholder="400000" className="pl-7"
                value={totalLiabilities} onChange={(e) => { setTotalLiabilities(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalAssets">Total Assets</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalAssets" type="number" step="any" min="0" placeholder="1000000" className="pl-7"
                value={totalAssets} onChange={(e) => { setTotalAssets(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={assets <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Debt Ratio
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Debt Ratio</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(debtRatio)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Equity: ${formatCurrency(equity)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Debt/Equity: ${debtToEquity.toFixed(2)}x`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{debtRatio < 50 ? "Healthy" : debtRatio < 60 ? "Moderate" : "High leverage"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Liabilities</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(liab)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Assets</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(assets)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Debt Ratio</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatPercent(debtRatio)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Debt/Equity</p>
                    <p className={`text-lg font-bold`}>{`{debtToEquity.toFixed(2)}x`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Debt ratio = total liabilities / total assets × 100. Measures financial leverage — what % of assets is financed by debt. Healthy: 30-50%. Above 60% = high leverage (distress risk in downturn). Debt-to-equity = liabilities / equity. Capital-intensive industries (utilities, manufacturing) have higher ratios. See our Current Ratio and Interest Coverage Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Liabilities', valueA: formatCurrency(compareA.liab), valueB: formatCurrency(compareB.liab), numA: compareA.liab, numB: compareB.liab },
          { label: 'Assets', valueA: formatCurrency(compareA.assets), valueB: formatCurrency(compareB.assets), numA: compareA.assets, numB: compareB.assets },
          { label: 'Debt Ratio', valueA: formatPercent(compareA.debtRatio), valueB: formatPercent(compareB.debtRatio), numA: compareA.debtRatio, numB: compareB.debtRatio },
          { label: 'D/E', valueA: `${compareA.debtToEquity.toFixed(2)}x`, valueB: `${compareB.debtToEquity.toFixed(2)}x`, numA: compareA.debtToEquity, numB: compareB.debtToEquity }
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
