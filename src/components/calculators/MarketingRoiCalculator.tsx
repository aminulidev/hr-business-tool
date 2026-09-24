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

interface Snapshot { cost: number; rev: number; profit: number; roi: number; roas: number; label: string; }

export default function MarketingRoiCalculator() {
  const [campaignCost, setCampaignCost] = useState('');
  const [revenueGenerated, setRevenueGenerated] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ campaignCost: string; revenueGenerated: string }>('marketing-roi-calculator');

  const cost = parseFloat(campaignCost) || 0;
  const rev = parseFloat(revenueGenerated) || 0;
  const profit = rev - cost;
  const roi = cost > 0 ? (profit / cost) * 100 : 0;
  const roas = cost > 0 ? rev / cost : 0;

  const handleTryExample = () => { setCampaignCost('10000'); setRevenueGenerated('35000'); setCalculated(false); };
  const handleCalculate = () => {
    if (cost > 0) {
      setCalculated(true);
      saveEntry({ campaignCost, revenueGenerated }, `ROI: ${roi.toFixed(0)}% (ROAS ${roas.toFixed(2)}x, profit ${formatCurrency(profit)})`);
    }
  };
  const handleReset = () => { setCampaignCost(''); setRevenueGenerated(''); setCalculated(false); };
  const handleRestore = (i: { campaignCost: string; revenueGenerated: string }) => { setCampaignCost(i.campaignCost); setRevenueGenerated(i.revenueGenerated); setCalculated(true); };
  const snap = (): Snapshot => ({ cost, rev, profit, roi, roas, label: `ROI: ${roi.toFixed(0)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <BarChart3 className="inline h-3 w-3 mr-1" />
          {`Marketing ROI = (revenue from campaign - cost) / cost × 100. Track by channel. Good ROI: >200% (3x return).`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="campaignCost">Campaign Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="campaignCost" type="number" step="any" min="0" placeholder="10000" className="pl-7"
                value={campaignCost} onChange={(e) => { setCampaignCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="revenueGenerated">Revenue Generated</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="revenueGenerated" type="number" step="any" min="0" placeholder="35000" className="pl-7"
                value={revenueGenerated} onChange={(e) => { setRevenueGenerated(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={cost <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Marketing ROI
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Marketing ROI</p>
                <p className="text-4xl font-bold text-emerald-600">{`{roi.toFixed(0)}%`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Profit: ${formatCurrency(profit)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`ROAS: ${roas.toFixed(2)}x`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{roi > 200 ? "Strong" : roi > 100 ? "Good" : roi > 0 ? "Marginal" : "Loss"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(rev)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Profit</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(profit)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ROI</p>
                    <p className={`text-lg font-bold`}>{`{roi.toFixed(0)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Marketing ROI = (revenue - cost) / cost × 100. Good: >200% (3x return). Track by channel. ROAS = revenue / cost (simpler, excludes overhead). Attribution matters: first-touch, last-touch, multi-touch. See our ROAS Calculator for ad-specific ROI.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Cost', valueA: formatCurrency(compareA.cost), valueB: formatCurrency(compareB.cost), numA: compareA.cost, numB: compareB.cost },
          { label: 'Revenue', valueA: formatCurrency(compareA.rev), valueB: formatCurrency(compareB.rev), numA: compareA.rev, numB: compareB.rev },
          { label: 'ROI', valueA: `${compareA.roi.toFixed(0)}%`, valueB: `${compareB.roi.toFixed(0)}%`, numA: compareA.roi, numB: compareB.roi }
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
