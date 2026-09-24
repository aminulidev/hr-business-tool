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

interface Snapshot { cost: number; clk: number; cpc: number; label: string; }

export default function CpcCalculator() {
  const [adCost, setAdCost] = useState('');
  const [clicks, setClicks] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ adCost: string; clicks: string }>('cpc-calculator');

  const cost = parseFloat(adCost) || 0;
  const clk = parseFloat(clicks) || 0;
  const cpc = clk > 0 ? cost / clk : 0;
  const ctr = 0;

  const handleTryExample = () => { setAdCost('500'); setClicks('250'); setCalculated(false); };
  const handleCalculate = () => {
    if (clk > 0) {
      setCalculated(true);
      saveEntry({ adCost, clicks }, `CPC: ${formatCurrency(cpc)} (${clk} clicks for ${formatCurrency(cost)})`);
    }
  };
  const handleReset = () => { setAdCost(''); setClicks(''); setCalculated(false); };
  const handleRestore = (i: { adCost: string; clicks: string }) => { setAdCost(i.adCost); setClicks(i.clicks); setCalculated(true); };
  const snap = (): Snapshot => ({ cost, clk, cpc, label: `CPC: ${formatCurrency(cpc)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`CPC = ad cost / clicks. Compare: Google Search $1-50, Facebook $0.50-3, LinkedIn $5-10.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adCost">Ad Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="adCost" type="number" step="any" min="0" placeholder="500" className="pl-7"
                value={adCost} onChange={(e) => { setAdCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="clicks">Total Clicks</Label>
            <div className="relative">
              
              <Input id="clicks" type="number" step="any" min="0" placeholder="250"
                value={clicks} onChange={(e) => { setClicks(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={clk <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate CPC
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Cost Per Click (CPC)</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(cpc)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Cost: ${formatCurrency(cost)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Clicks: ${clk}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Google $1-50, FB $0.50-3, LinkedIn $5-10'}</Badge>
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
                    <p className="text-xs text-muted-foreground mb-1">Clicks</p>
                    <p className={`text-lg font-bold`}>{`{clk}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">CPC</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(cpc)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Cost per 100 clicks</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cpc * 100)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`CPC = ad cost / clicks. Benchmarks: Google Search $1-50 (varies by keyword competitiveness), Facebook $0.50-3, LinkedIn $5-10, display $0.50-2. Lower = better. Improve by: better ad relevance, higher Quality Score (Google), better targeting, ad creative testing. See our CPM and CPL Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Cost', valueA: formatCurrency(compareA.cost), valueB: formatCurrency(compareB.cost), numA: compareA.cost, numB: compareB.cost },
          { label: 'Clicks', valueA: String(compareA.clk), valueB: String(compareB.clk), numA: compareA.clk, numB: compareB.clk },
          { label: 'CPC', valueA: formatCurrency(compareA.cpc), valueB: formatCurrency(compareB.cpc), numA: compareA.cpc, numB: compareA.cpc }
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
