'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { spend: number; rev: number; roas: number; roasPct: number; profit: number; label: string; }

export default function RoasCalculator() {
  const [adSpend, setAdSpend] = useState('');
  const [adRevenue, setAdRevenue] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ adSpend: string; adRevenue: string }>('roas-calculator');

  const spend = parseFloat(adSpend) || 0;
  const rev = parseFloat(adRevenue) || 0;
  const roas = spend > 0 ? rev / spend : 0;
  const roasPct = roas * 100;
  const profit = rev - spend;

  const handleTryExample = () => { setAdSpend('5000'); setAdRevenue('25000'); setCalculated(false); };
  const handleCalculate = () => {
    if (spend > 0) {
      setCalculated(true);
      saveEntry({ adSpend, adRevenue }, `ROAS: ${roas.toFixed(2)}x (${formatCurrency(rev)} / ${formatCurrency(spend)})`);
    }
  };
  const handleReset = () => { setAdSpend(''); setAdRevenue(''); setCalculated(false); };
  const handleRestore = (i: { adSpend: string; adRevenue: string }) => { setAdSpend(i.adSpend); setAdRevenue(i.adRevenue); setCalculated(true); };
  const snap = (): Snapshot => ({ spend, rev, roas, roasPct, profit, label: `ROAS: ${roas.toFixed(2)}x` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <BarChart3 className="inline h-3 w-3 mr-1" />
          {`ROAS = ad revenue / ad spend. Target 4:1 (400%) for ecommerce, 3:1 for SaaS. Different from ROI (excludes overhead).`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adSpend">Ad Spend</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="adSpend" type="number" step="any" min="0" placeholder="5000" className="pl-7"
                value={adSpend} onChange={(e) => { setAdSpend(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="adRevenue">Revenue from Ads</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="adRevenue" type="number" step="any" min="0" placeholder="25000" className="pl-7"
                value={adRevenue} onChange={(e) => { setAdRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={spend <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate ROAS
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Return on Ad Spend (ROAS)</p>
                <p className="text-4xl font-bold text-emerald-600">{`{roas.toFixed(2)}x ({roasPct.toFixed(0)}%)`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Revenue: ${formatCurrency(rev)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Spend: ${formatCurrency(spend)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{roas > 4 ? "Strong" : roas > 3 ? "Healthy" : roas > 1 ? "Marginal" : "Loss"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Ad Spend</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(spend)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Ad Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(rev)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ROAS</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{roas.toFixed(2)}x`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Profit</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(profit)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`ROAS = revenue from ads / ad spend. Different from ROI (ROAS excludes overhead, only ad spend). Target: 4:1 (400%) for ecommerce, 3:1 for SaaS, 2:1 for brand awareness. Track by campaign, ad group, keyword. See our Marketing ROI Calculator for full ROI.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Spend', valueA: formatCurrency(compareA.spend), valueB: formatCurrency(compareB.spend), numA: compareA.spend, numB: compareB.spend },
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'ROAS', valueA: `${compareA.roas.toFixed(2)}x`, valueB: `${compareB.roas.toFixed(2)}x`, numA: compareA.roas, numB: compareB.roas }
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
