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

interface Snapshot { ca: number; fa: number; cl: number; ltl: number; eq: number; totalAssets: number; totalLiabilities: number; totalLE: number; isBalanced: boolean; difference: number; label: string; }

export default function BalanceSheetCalculator() {
  const [currentAssets, setCurrentAssets] = useState('');
  const [fixedAssets, setFixedAssets] = useState('');
  const [currentLiab, setCurrentLiab] = useState('');
  const [longTermLiab, setLongTermLiab] = useState('');
  const [equity, setEquity] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ currentAssets: string; fixedAssets: string; currentLiab: string; longTermLiab: string; equity: string }>('balance-sheet-calculator');

  const ca = parseFloat(currentAssets) || 0;
  const fa = parseFloat(fixedAssets) || 0;
  const cl = parseFloat(currentLiab) || 0;
  const ltl = parseFloat(longTermLiab) || 0;
  const eq = parseFloat(equity) || 0;
  const totalAssets = ca + fa;
  const totalLiabilities = cl + ltl;
  const totalLE = totalLiabilities + eq;
  const isBalanced = Math.abs(totalAssets - totalLE) < 0.01;
  const difference = totalAssets - totalLE;

  const handleTryExample = () => { setCurrentAssets('400000'); setFixedAssets('600000'); setCurrentLiab('200000'); setLongTermLiab('300000'); setEquity('500000'); setCalculated(false); };
  const handleCalculate = () => {
    if (totalAssets > 0) {
      setCalculated(true);
      saveEntry({ currentAssets, fixedAssets, currentLiab, longTermLiab, equity }, `${isBalanced ? 'Balanced' : 'Unbalanced'} (A: ${formatCurrency(totalAssets)}, L+E: ${formatCurrency(totalLE)})`);
    }
  };
  const handleReset = () => { setCurrentAssets(''); setFixedAssets(''); setCurrentLiab(''); setLongTermLiab(''); setEquity(''); setCalculated(false); };
  const handleRestore = (i: { currentAssets: string; fixedAssets: string; currentLiab: string; longTermLiab: string; equity: string }) => { setCurrentAssets(i.currentAssets); setFixedAssets(i.fixedAssets); setCurrentLiab(i.currentLiab); setLongTermLiab(i.longTermLiab); setEquity(i.equity); setCalculated(true); };
  const snap = (): Snapshot => ({ ca, fa, cl, ltl, eq, totalAssets, totalLiabilities, totalLE, isBalanced, difference, label: isBalanced ? 'Balanced' : 'Unbalanced' });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <FileText className="inline h-3 w-3 mr-1" />
          {`Build a balance sheet: assets, liabilities, and equity. Verify Assets = Liabilities + Equity.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentAssets">Current Assets</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="currentAssets" type="number" step="any" min="0" placeholder="400000" className="pl-7"
                value={currentAssets} onChange={(e) => { setCurrentAssets(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fixedAssets">Fixed Assets</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="fixedAssets" type="number" step="any" min="0" placeholder="600000" className="pl-7"
                value={fixedAssets} onChange={(e) => { setFixedAssets(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentLiab">Current Liabilities</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="currentLiab" type="number" step="any" min="0" placeholder="200000" className="pl-7"
                value={currentLiab} onChange={(e) => { setCurrentLiab(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="longTermLiab">Long-Term Liabilities</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="longTermLiab" type="number" step="any" min="0" placeholder="300000" className="pl-7"
                value={longTermLiab} onChange={(e) => { setLongTermLiab(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="equity">Owners Equity</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="equity" type="number" step="any" min="0" placeholder="500000" className="pl-7"
                value={equity} onChange={(e) => { setEquity(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={totalAssets <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Verify Balance Sheet
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Balance Sheet</p>
                <p className="text-4xl font-bold text-emerald-600">{isBalanced ? 'Balanced' : 'Unbalanced'}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Total assets: ${formatCurrency(totalAssets)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Liab + Equity: ${formatCurrency(totalLE)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{isBalanced ? "Assets = Liabilities + Equity" : "Difference: ${formatCurrency(difference)}"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Assets</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalAssets)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Liabilities</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalLiabilities)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Equity</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(eq)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className={`text-lg font-bold`}>{isBalanced ? 'Balanced' : 'Unbalanced'}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Accounting equation: Assets = Liabilities + Equity. If unbalanced, check for missing entries or calculation errors. Balance sheet is a snapshot of financial position at a point in time.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Assets', valueA: formatCurrency(compareA.totalAssets), valueB: formatCurrency(compareB.totalAssets), numA: compareA.totalAssets, numB: compareB.totalAssets },
          { label: 'Liab+Equity', valueA: formatCurrency(compareA.totalLE), valueB: formatCurrency(compareB.totalLE), numA: compareA.totalLE, numB: compareB.totalLE }
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
