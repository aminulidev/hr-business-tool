'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Boxes } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { c: number; bi: number; ei: number; avgInventory: number; turnover: number; daysInInventory: number; label: string; }

export default function InventoryTurnoverCalculator() {
  const [cogs, setCogs] = useState('');
  const [beginInventory, setBeginInventory] = useState('');
  const [endInventory, setEndInventory] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ cogs: string; beginInventory: string; endInventory: string }>('inventory-turnover-calculator');

  const c = parseFloat(cogs) || 0;
  const bi = parseFloat(beginInventory) || 0;
  const ei = parseFloat(endInventory) || 0;
  const avgInventory = (bi + ei) / 2;
  const turnover = avgInventory > 0 ? c / avgInventory : 0;
  const daysInInventory = turnover > 0 ? 365 / turnover : 0;

  const handleTryExample = () => { setCogs('600000'); setBeginInventory('100000'); setEndInventory('120000'); setCalculated(false); };
  const handleCalculate = () => {
    if (c > 0 && (bi > 0 || ei > 0)) {
      setCalculated(true);
      saveEntry({ cogs, beginInventory, endInventory }, `Turnover: ${turnover.toFixed(2)}x (${daysInInventory.toFixed(0)} days in inventory)`);
    }
  };
  const handleReset = () => { setCogs(''); setBeginInventory(''); setEndInventory(''); setCalculated(false); };
  const handleRestore = (i: { cogs: string; beginInventory: string; endInventory: string }) => { setCogs(i.cogs); setBeginInventory(i.beginInventory); setEndInventory(i.endInventory); setCalculated(true); };
  const snap = (): Snapshot => ({ c, bi, ei, avgInventory, turnover, daysInInventory, label: `Turnover: ${turnover.toFixed(2)}x` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Boxes className="inline h-3 w-3 mr-1" />
          {`Inventory turnover = COGS / average inventory. Measures how fast inventory sells. Grocery: 15x, Retail: 6x, Manufacturing: 5x.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cogs">Cost of Goods Sold (annual)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="cogs" type="number" step="any" min="0" placeholder="600000" className="pl-7"
                value={cogs} onChange={(e) => { setCogs(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="beginInventory">Beginning Inventory</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="beginInventory" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={beginInventory} onChange={(e) => { setBeginInventory(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endInventory">Ending Inventory</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="endInventory" type="number" step="any" min="0" placeholder="120000" className="pl-7"
                value={endInventory} onChange={(e) => { setEndInventory(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={c <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Inventory Turnover
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Inventory Turnover Ratio</p>
                <p className="text-4xl font-bold text-emerald-600">{`{turnover.toFixed(2)}x`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Days in inventory: ${daysInInventory.toFixed(0)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`${avgInventory.toFixed(0)} avg inventory`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Grocery 15x, Retail 6x, Mfg 5x'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">COGS</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(c)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Avg Inventory</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(avgInventory)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Turnover</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{turnover.toFixed(2)}x`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Days in Inv</p>
                    <p className={`text-lg font-bold`}>{`{daysInInventory.toFixed(0)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Inventory turnover = COGS / average inventory. Measures inventory efficiency. Higher = faster selling. Industry: grocery 15x, retail 6x, manufacturing 5x, auto dealers 8x. Days in inventory (DIO) = 365 / turnover. Low turnover = excess inventory, obsolescence risk. See our Inventory Holding Cost and EOQ Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'COGS', valueA: formatCurrency(compareA.c), valueB: formatCurrency(compareB.c), numA: compareA.c, numB: compareB.c },
          { label: 'Avg Inventory', valueA: formatCurrency(compareA.avgInventory), valueB: formatCurrency(compareB.avgInventory), numA: compareA.avgInventory, numB: compareB.avgInventory },
          { label: 'Turnover', valueA: `${compareA.turnover.toFixed(2)}x`, valueB: `${compareB.turnover.toFixed(2)}x`, numA: compareA.turnover, numB: compareB.turnover },
          { label: 'Days in Inv', valueA: compareA.daysInInventory.toFixed(0), valueB: compareB.daysInInventory.toFixed(0), numA: compareA.daysInInventory, numB: compareB.daysInInventory }
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
