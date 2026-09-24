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

interface Snapshot { csh: number; ms: number; arV: number; inv: number; cl: number; quickAssets: number; currentAssets: number; quickRatio: number; currentRatio: number; label: string; }

export default function QuickRatioCalculator() {
  const [cash, setCash] = useState('');
  const [marketableSec, setMarketableSec] = useState('');
  const [ar, setAr] = useState('');
  const [inventory, setInventory] = useState('');
  const [currentLiab, setCurrentLiab] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ cash: string; marketableSec: string; ar: string; inventory: string; currentLiab: string }>('quick-ratio-calculator');

  const csh = parseFloat(cash) || 0;
  const ms = parseFloat(marketableSec) || 0;
  const arV = parseFloat(ar) || 0;
  const inv = parseFloat(inventory) || 0;
  const cl = parseFloat(currentLiab) || 0;
  const quickAssets = csh + ms + arV;
  const currentAssets = quickAssets + inv;
  const quickRatio = cl > 0 ? quickAssets / cl : 0;
  const currentRatio = cl > 0 ? currentAssets / cl : 0;

  const handleTryExample = () => { setCash('200000'); setMarketableSec('50000'); setAr('150000'); setInventory('100000'); setCurrentLiab('300000'); setCalculated(false); };
  const handleCalculate = () => {
    if (cl > 0) {
      setCalculated(true);
      saveEntry({ cash, marketableSec, ar, inventory, currentLiab }, `Quick ratio: ${quickRatio.toFixed(2)}x (CR ${currentRatio.toFixed(2)}x)`);
    }
  };
  const handleReset = () => { setCash(''); setMarketableSec(''); setAr(''); setInventory(''); setCurrentLiab(''); setCalculated(false); };
  const handleRestore = (i: { cash: string; marketableSec: string; ar: string; inventory: string; currentLiab: string }) => { setCash(i.cash); setMarketableSec(i.marketableSec); setAr(i.ar); setInventory(i.inventory); setCurrentLiab(i.currentLiab); setCalculated(true); };
  const snap = (): Snapshot => ({ csh, ms, arV, inv, cl, quickAssets, currentAssets, quickRatio, currentRatio, label: `Quick ratio: ${quickRatio.toFixed(2)}x` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Scale className="inline h-3 w-3 mr-1" />
          {`Quick ratio (acid test) = (current assets - inventory) / current liabilities. Stricter liquidity test. Healthy: 1.0+.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cash">Cash & Equivalents</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="cash" type="number" step="any" min="0" placeholder="200000" className="pl-7"
                value={cash} onChange={(e) => { setCash(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketableSec">Marketable Securities</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="marketableSec" type="number" step="any" min="0" placeholder="50000" className="pl-7"
                value={marketableSec} onChange={(e) => { setMarketableSec(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ar">Accounts Receivable</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="ar" type="number" step="any" min="0" placeholder="150000" className="pl-7"
                value={ar} onChange={(e) => { setAr(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inventory">Inventory (excluded)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="inventory" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={inventory} onChange={(e) => { setInventory(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentLiab">Current Liabilities</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="currentLiab" type="number" step="any" min="0" placeholder="300000" className="pl-7"
                value={currentLiab} onChange={(e) => { setCurrentLiab(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={cl <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Quick Ratio
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Quick Ratio (Acid Test)</p>
                <p className="text-4xl font-bold text-emerald-600">{`{quickRatio.toFixed(2)}x`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Quick assets: ${formatCurrency(quickAssets)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Current ratio: ${currentRatio.toFixed(2)}x`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{quickRatio < 1 ? "Liquidity risk" : quickRatio > 1.5 ? "Strong" : "Healthy"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Quick Assets</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(quickAssets)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Inventory</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(inv)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Quick Ratio</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{quickRatio.toFixed(2)}x`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Current Ratio</p>
                    <p className={`text-lg font-bold`}>{`{currentRatio.toFixed(2)}x`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Quick ratio (acid test) = (cash + marketable securities + AR) / current liabilities, or (current assets - inventory) / current liabilities. Stricter than current ratio — excludes inventory (may not convert to cash quickly). Healthy: 1.0+. Below 1.0 = can't pay short-term debts without selling inventory. See our Current Ratio Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Quick Assets', valueA: formatCurrency(compareA.quickAssets), valueB: formatCurrency(compareB.quickAssets), numA: compareA.quickAssets, numB: compareB.quickAssets },
          { label: 'Current Liab', valueA: formatCurrency(compareA.cl), valueB: formatCurrency(compareB.cl), numA: compareA.cl, numB: compareB.cl },
          { label: 'Quick Ratio', valueA: `${compareA.quickRatio.toFixed(2)}x`, valueB: `${compareB.quickRatio.toFixed(2)}x`, numA: compareA.quickRatio, numB: compareB.quickRatio },
          { label: 'Current Ratio', valueA: `${compareA.currentRatio.toFixed(2)}x`, valueB: `${compareB.currentRatio.toFixed(2)}x`, numA: compareA.currentRatio, numB: compareB.currentRatio }
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
