'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { bi: number; purch: number; ei: number; rev: number; cogs: number; grossProfit: number; grossMargin: number; label: string; }

export default function CogsCalculator() {
  const [beginningInventory, setBeginningInventory] = useState('');
  const [purchases, setPurchases] = useState('');
  const [endingInventory, setEndingInventory] = useState('');
  const [revenue, setRevenue] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ beginningInventory: string; purchases: string; endingInventory: string; revenue: string }>('cogs-calculator');

  const bi = parseFloat(beginningInventory) || 0;
  const purch = parseFloat(purchases) || 0;
  const ei = parseFloat(endingInventory) || 0;
  const rev = parseFloat(revenue) || 0;
  const cogs = bi + purch - ei;
  const grossProfit = rev - cogs;
  const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;

  const handleTryExample = () => { setBeginningInventory('50000'); setPurchases('200000'); setEndingInventory('60000'); setRevenue('400000'); setCalculated(false); };
  const handleCalculate = () => {
    if (bi > 0 || purch > 0) {
      setCalculated(true);
      saveEntry({ beginningInventory, purchases, endingInventory, revenue }, `COGS: ${formatCurrency(cogs)} (gross profit: ${formatCurrency(grossProfit)}, margin: ${grossMargin.toFixed(1)}%)`);
    }
  };
  const handleReset = () => { setBeginningInventory(''); setPurchases(''); setEndingInventory(''); setRevenue(''); setCalculated(false); };
  const handleRestore = (i: { beginningInventory: string; purchases: string; endingInventory: string; revenue: string }) => { setBeginningInventory(i.beginningInventory); setPurchases(i.purchases); setEndingInventory(i.endingInventory); setRevenue(i.revenue); setCalculated(true); };
  const snap = (): Snapshot => ({ bi, purch, ei, rev, cogs, grossProfit, grossMargin, label: `COGS: ${formatCurrency(cogs)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Calculate COGS = beginning inventory + purchases - ending inventory. See gross profit.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="beginningInventory">Beginning Inventory</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="beginningInventory" type="number" step="any" min="0" placeholder="50000" className="pl-7"
                value={beginningInventory} onChange={(e) => { setBeginningInventory(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchases">Purchases</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="purchases" type="number" step="any" min="0" placeholder="200000" className="pl-7"
                value={purchases} onChange={(e) => { setPurchases(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endingInventory">Ending Inventory</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="endingInventory" type="number" step="any" min="0" placeholder="60000" className="pl-7"
                value={endingInventory} onChange={(e) => { setEndingInventory(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="revenue">Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="revenue" type="number" step="any" min="0" placeholder="400000" className="pl-7"
                value={revenue} onChange={(e) => { setRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={bi <= 0 && purch <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate COGS
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Cost of Goods Sold</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(cogs)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Gross profit: ${formatCurrency(grossProfit)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Gross margin: ${grossMargin.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Revenue: ${formatCurrency(rev)}`}</Badge>
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
                    <p className="text-xs text-muted-foreground mb-1">COGS</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cogs)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Gross Profit</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(grossProfit)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Gross Margin</p>
                    <p className={`text-lg font-bold`}>{`{grossMargin.toFixed(1)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`COGS = beginning inventory + purchases - ending inventory. Gross profit = revenue - COGS.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'COGS', valueA: formatCurrency(compareA.cogs), valueB: formatCurrency(compareB.cogs), numA: compareA.cogs, numB: compareB.cogs },
          { label: 'Gross Profit', valueA: formatCurrency(compareA.grossProfit), valueB: formatCurrency(compareB.grossProfit), numA: compareA.grossProfit, numB: compareB.grossProfit }
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
