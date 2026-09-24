'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { cost: number; salvage: number; life: number; owned: number; annualDepreciation: number; accumulatedDepreciation: number; bookValue: number; isFullyDepreciated: boolean; label: string; }

export default function FixedAssetCalculator() {
  const [assetCost, setAssetCost] = useState('');
  const [salvageValue, setSalvageValue] = useState('');
  const [usefulLife, setUsefulLife] = useState('');
  const [yearsOwned, setYearsOwned] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ assetCost: string; salvageValue: string; usefulLife: string; yearsOwned: string }>('fixed-asset-calculator');

  const cost = parseFloat(assetCost) || 0;
  const salvage = parseFloat(salvageValue) || 0;
  const life = parseFloat(usefulLife) || 0;
  const owned = parseFloat(yearsOwned) || 0;
  const annualDepreciation = life > 0 ? (cost - salvage) / life : 0;
  const accumulatedDepreciation = annualDepreciation * Math.min(owned, life);
  const bookValue = cost - accumulatedDepreciation;
  const isFullyDepreciated = owned >= life;

  const handleTryExample = () => { setAssetCost('50000'); setSalvageValue('5000'); setUsefulLife('5'); setYearsOwned('3'); setCalculated(false); };
  const handleCalculate = () => {
    if (cost > 0 && life > 0) {
      setCalculated(true);
      saveEntry({ assetCost, salvageValue, usefulLife, yearsOwned }, `Book value: ${formatCurrency(bookValue)} (${owned}/${life} yrs, acc. depr: ${formatCurrency(accumulatedDepreciation)})`);
    }
  };
  const handleReset = () => { setAssetCost(''); setSalvageValue(''); setUsefulLife('5'); setYearsOwned(''); setCalculated(false); };
  const handleRestore = (i: { assetCost: string; salvageValue: string; usefulLife: string; yearsOwned: string }) => { setAssetCost(i.assetCost); setSalvageValue(i.salvageValue); setUsefulLife(i.usefulLife); setYearsOwned(i.yearsOwned); setCalculated(true); };
  const snap = (): Snapshot => ({ cost, salvage, life, owned, annualDepreciation, accumulatedDepreciation, bookValue, isFullyDepreciated, label: `BV: ${formatCurrency(bookValue)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Building2 className="inline h-3 w-3 mr-1" />
          {`Track fixed assets: cost, depreciation, book value, and disposal gain/loss.`}
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
            <Label htmlFor="yearsOwned">Years Owned</Label>
            <div className="relative">
              
              <Input id="yearsOwned" type="number" step="any" min="0" placeholder="3"
                value={yearsOwned} onChange={(e) => { setYearsOwned(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={cost <= 0 || life <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Fixed Asset
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Book Value</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(bookValue)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Annual depreciation: ${formatCurrency(annualDepreciation)}/yr`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Accumulated depreciation: ${formatCurrency(accumulatedDepreciation)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{isFullyDepreciated ? 'Fully depreciated' : `${life - owned} years remaining`}</Badge>
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
                    <p className="text-xs text-muted-foreground mb-1">Acc. Depr.</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(accumulatedDepreciation)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Book Value</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(bookValue)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annual Depr.</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(annualDepreciation)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Fixed asset tracking: cost, annual depreciation, accumulated depreciation, book value. Book value = cost - accumulated depreciation. When book value = salvage value, asset is fully depreciated. Track disposal: gain/loss = sale price - book value.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Book Value', valueA: formatCurrency(compareA.bookValue), valueB: formatCurrency(compareB.bookValue), numA: compareA.bookValue, numB: compareB.bookValue },
          { label: 'Acc. Depr.', valueA: formatCurrency(compareA.accumulatedDepreciation), valueB: formatCurrency(compareB.accumulatedDepreciation), numA: compareA.accumulatedDepreciation, numB: compareB.accumulatedDepreciation }
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
