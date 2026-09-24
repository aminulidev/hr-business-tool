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

interface Snapshot { cost: number; imp: number; cpm: number; label: string; }

export default function CpmCalculator() {
  const [adCost, setAdCost] = useState('');
  const [impressions, setImpressions] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ adCost: string; impressions: string }>('cpm-calculator');

  const cost = parseFloat(adCost) || 0;
  const imp = parseFloat(impressions) || 0;
  const cpm = imp > 0 ? (cost / imp) * 1000 : 0;

  const handleTryExample = () => { setAdCost('1000'); setImpressions('200000'); setCalculated(false); };
  const handleCalculate = () => {
    if (imp > 0) {
      setCalculated(true);
      saveEntry({ adCost, impressions }, `CPM: ${formatCurrency(cpm)} (${imp.toLocaleString()} impressions for ${formatCurrency(cost)})`);
    }
  };
  const handleReset = () => { setAdCost(''); setImpressions(''); setCalculated(false); };
  const handleRestore = (i: { adCost: string; impressions: string }) => { setAdCost(i.adCost); setImpressions(i.impressions); setCalculated(true); };
  const snap = (): Snapshot => ({ cost, imp, cpm, label: `CPM: ${formatCurrency(cpm)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`CPM = (ad cost / impressions) × 1,000. Compare: Google Display $2-10, Facebook $5-15, LinkedIn $15-30.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adCost">Ad Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="adCost" type="number" step="any" min="0" placeholder="1000" className="pl-7"
                value={adCost} onChange={(e) => { setAdCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="impressions">Total Impressions</Label>
            <div className="relative">
              
              <Input id="impressions" type="number" step="any" min="0" placeholder="200000"
                value={impressions} onChange={(e) => { setImpressions(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={imp <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate CPM
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Cost Per Mille (CPM)</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(cpm)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Cost: ${formatCurrency(cost)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Impressions: ${imp.toLocaleString()}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Display $2-10, FB $5-15, LinkedIn $15-30'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Ad Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Impressions</p>
                    <p className={`text-lg font-bold`}>{`{imp.toLocaleString()}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">CPM</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(cpm)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Cost per 10k</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cpm * 10)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`CPM = (ad cost / impressions) × 1,000 = cost per thousand impressions. Used for brand awareness campaigns. Benchmarks: Google Display $2-10, Facebook $5-15, LinkedIn $15-30, video $20-40, OTT/CTV $25-40. Lower = more efficient reach. See our CPC and CPL Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Cost', valueA: formatCurrency(compareA.cost), valueB: formatCurrency(compareB.cost), numA: compareA.cost, numB: compareB.cost },
          { label: 'Impressions', valueA: compareA.imp.toLocaleString(), valueB: compareB.imp.toLocaleString(), numA: compareA.imp, numB: compareB.imp },
          { label: 'CPM', valueA: formatCurrency(compareA.cpm), valueB: formatCurrency(compareB.cpm), numA: compareA.cpm, numB: compareB.cpm }
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
