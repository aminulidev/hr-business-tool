'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { cost: number; salvage: number; life: number; mult: number; straightLineRate: number; ddbRate: number; year1Depreciation: number; year1BookValue: number; year2Depreciation: number; label: string; }

export default function DecliningBalanceDepreciationCalculator() {
  const [assetCost, setAssetCost] = useState('');
  const [salvageValue, setSalvageValue] = useState('');
  const [usefulLife, setUsefulLife] = useState('');
  const [multiplier, setMultiplier] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ assetCost: string; salvageValue: string; usefulLife: string; multiplier: string }>('declining-balance-depreciation-calculator');

  const cost = parseFloat(assetCost) || 0;
  const salvage = parseFloat(salvageValue) || 0;
  const life = parseFloat(usefulLife) || 0;
  const mult = parseFloat(multiplier) || 2;
  const straightLineRate = life > 0 ? 1 / life : 0;
  const ddbRate = straightLineRate * mult;
  const year1Depreciation = cost * ddbRate;
  const year1BookValue = cost - year1Depreciation;
  const year2Depreciation = year1BookValue * ddbRate;

  const handleTryExample = () => { setAssetCost('50000'); setSalvageValue('5000'); setUsefulLife('5'); setMultiplier('2'); setCalculated(false); };
  const handleCalculate = () => {
    if (cost > 0 && life > 0) {
      setCalculated(true);
      saveEntry({ assetCost, salvageValue, usefulLife, multiplier }, `DDB Year 1: ${formatCurrency(year1Depreciation)} (${(ddbRate * 100).toFixed(0)}% rate)`);
    }
  };
  const handleReset = () => { setAssetCost(''); setSalvageValue(''); setUsefulLife('5'); setMultiplier('2'); setCalculated(false); };
  const handleRestore = (i: { assetCost: string; salvageValue: string; usefulLife: string; multiplier: string }) => { setAssetCost(i.assetCost); setSalvageValue(i.salvageValue); setUsefulLife(i.usefulLife); setMultiplier(i.multiplier); setCalculated(true); };
  const snap = (): Snapshot => ({ cost, salvage, life, mult, straightLineRate, ddbRate, year1Depreciation, year1BookValue, year2Depreciation, label: `DDB Y1: ${formatCurrency(year1Depreciation)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingDown className="inline h-3 w-3 mr-1" />
          {`Calculate declining balance and DDB depreciation. Accelerated method.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="assetCost">Asset Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="assetCost" type="number" step="any" min="0" placeholder="50000" className="pl-7"
                value={assetCost} onChange={(e) => { setAssetCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salvageValue">Salvage Value</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="salvageValue" type="number" step="any" min="0" placeholder="5000" className="pl-7"
                value={salvageValue} onChange={(e) => { setSalvageValue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="usefulLife">Useful Life (years)</Label>
            <div className="relative">
              
              <Input id="usefulLife" type="number" step="any" min="0" placeholder="5"
                value={usefulLife} onChange={(e) => { setUsefulLife(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="multiplier">DDB Multiplier</Label>
            <div className="relative">
              
              <Input id="multiplier" type="number" step="any" min="0" placeholder="2"
                value={multiplier} onChange={(e) => { setMultiplier(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">2 = double declining</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={cost <= 0 || life <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate DDB
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Year 1 Depreciation (DDB)</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(year1Depreciation)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`DDB rate: ${(ddbRate * 100).toFixed(0)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Year 1 BV: ${formatCurrency(year1BookValue)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Year 2: ${formatCurrency(year2Depreciation)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Asset Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">DDB Rate</p>
                    <p className={`text-lg font-bold`}>{`{(ddbRate * 100).toFixed(0)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Year 1 Depr.</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(year1Depreciation)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Year 1 BV</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(year1BookValue)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`DDB rate = (1 / life) x multiplier. Year 1 depreciation = cost x DDB rate. Accelerated method.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Year 1 Depr.', valueA: formatCurrency(compareA.year1Depreciation), valueB: formatCurrency(compareB.year1Depreciation), numA: compareA.year1Depreciation, numB: compareB.year1Depreciation },
          { label: 'Year 1 BV', valueA: formatCurrency(compareA.year1BookValue), valueB: formatCurrency(compareB.year1BookValue), numA: compareA.year1BookValue, numB: compareB.year1BookValue }
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
