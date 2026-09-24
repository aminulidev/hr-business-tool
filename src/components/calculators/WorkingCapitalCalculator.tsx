'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { csh: number; arV: number; inv: number; currentAssets: number; currentLiabilities: number; workingCapital: number; currentRatio: number; label: string; }

export default function WorkingCapitalCalculator() {
  const [cash, setCash] = useState('');
  const [ar, setAr] = useState('');
  const [inventory, setInventory] = useState('');
  const [otherCA, setOtherCA] = useState('');
  const [ap, setAp] = useState('');
  const [otherCL, setOtherCL] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ cash: string; ar: string; inventory: string; otherCA: string; ap: string; otherCL: string }>('working-capital-calculator');

  const csh = parseFloat(cash) || 0;
  const arV = parseFloat(ar) || 0;
  const inv = parseFloat(inventory) || 0;
  const oCA = parseFloat(otherCA) || 0;
  const apV = parseFloat(ap) || 0;
  const oCL = parseFloat(otherCL) || 0;
  const currentAssets = csh + arV + inv + oCA;
  const currentLiabilities = apV + oCL;
  const workingCapital = currentAssets - currentLiabilities;
  const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;

  const handleTryExample = () => { setCash('200000'); setAr('150000'); setInventory('200000'); setOtherCA('50000'); setAp('120000'); setOtherCL('80000'); setCalculated(false); };
  const handleCalculate = () => {
    if (currentAssets > 0 || currentLiabilities > 0) {
      setCalculated(true);
      saveEntry({ cash, ar, inventory, otherCA, ap, otherCL }, `WC: ${formatCurrency(workingCapital)} (CR ${currentRatio.toFixed(2)}x)`);
    }
  };
  const handleReset = () => { setCash(''); setAr(''); setInventory(''); setOtherCA(''); setAp(''); setOtherCL(''); setCalculated(false); };
  const handleRestore = (i: { cash: string; ar: string; inventory: string; otherCA: string; ap: string; otherCL: string }) => { setCash(i.cash); setAr(i.ar); setInventory(i.inventory); setOtherCA(i.otherCA); setAp(i.ap); setOtherCL(i.otherCL); setCalculated(true); };
  const snap = (): Snapshot => ({ csh, arV, inv, currentAssets, currentLiabilities, workingCapital, currentRatio, label: `WC: ${formatCurrency(workingCapital)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Wallet className="inline h-3 w-3 mr-1" />
          {`Working capital = current assets - current liabilities. Measures short-term liquidity. Healthy: positive with 1.5-2.0 current ratio.`}
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
            <Label htmlFor="ar">Accounts Receivable</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="ar" type="number" step="any" min="0" placeholder="150000" className="pl-7"
                value={ar} onChange={(e) => { setAr(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inventory">Inventory</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="inventory" type="number" step="any" min="0" placeholder="200000" className="pl-7"
                value={inventory} onChange={(e) => { setInventory(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="otherCA">Other Current Assets</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="otherCA" type="number" step="any" min="0" placeholder="50000" className="pl-7"
                value={otherCA} onChange={(e) => { setOtherCA(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ap">Accounts Payable</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="ap" type="number" step="any" min="0" placeholder="120000" className="pl-7"
                value={ap} onChange={(e) => { setAp(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="otherCL">Other Current Liabilities</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="otherCL" type="number" step="any" min="0" placeholder="80000" className="pl-7"
                value={otherCL} onChange={(e) => { setOtherCL(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={currentAssets <= 0 && currentLiabilities <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Working Capital
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Working Capital</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(workingCapital)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Current ratio: ${currentRatio.toFixed(2)}x`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Current assets: ${formatCurrency(currentAssets)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{workingCapital > 0 ? "Positive WC" : "Negative WC"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Current Assets</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(currentAssets)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Current Liabilities</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(currentLiabilities)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Working Capital</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(workingCapital)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Current Ratio</p>
                    <p className={`text-lg font-bold`}>{`{currentRatio.toFixed(2)}x`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Working capital = current assets - current liabilities. Positive = can cover short-term obligations. Current ratio = CA / CL (healthy: 1.5-2.0). Below 1.0 = liquidity risk. Negative WC can be OK for retail (fast inventory turnover). See our Current Ratio and Quick Ratio Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Current Assets', valueA: formatCurrency(compareA.currentAssets), valueB: formatCurrency(compareB.currentAssets), numA: compareA.currentAssets, numB: compareB.currentAssets },
          { label: 'Current Liabilities', valueA: formatCurrency(compareA.currentLiabilities), valueB: formatCurrency(compareB.currentLiabilities), numA: compareA.currentLiabilities, numB: compareB.currentLiabilities },
          { label: 'Working Capital', valueA: formatCurrency(compareA.workingCapital), valueB: formatCurrency(compareB.workingCapital), numA: compareA.workingCapital, numB: compareB.workingCapital },
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
