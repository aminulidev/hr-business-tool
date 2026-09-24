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

interface Snapshot { sales: number; t1Amount: number; t2Amount: number; t3Amount: number; totalCommission: number; effectiveRate: number; label: string; }

export default function TieredCommissionCalculator() {
  const [totalSales, setTotalSales] = useState('');
  const [tier1Limit, setTier1Limit] = useState('');
  const [tier1Rate, setTier1Rate] = useState('');
  const [tier2Limit, setTier2Limit] = useState('');
  const [tier2Rate, setTier2Rate] = useState('');
  const [tier3Rate, setTier3Rate] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalSales: string; tier1Limit: string; tier1Rate: string; tier2Limit: string; tier2Rate: string; tier3Rate: string }>('tiered-commission-calculator');

  const sales = parseFloat(totalSales) || 0;
  const t1L = parseFloat(tier1Limit) || 0;
  const t1R = parseFloat(tier1Rate) || 0;
  const t2L = parseFloat(tier2Limit) || 0;
  const t2R = parseFloat(tier2Rate) || 0;
  const t3R = parseFloat(tier3Rate) || 0;
  const t1Amount = Math.min(sales, t1L) * (t1R / 100);
  const t2Amount = sales > t1L ? (Math.min(sales, t2L) - t1L) * (t2R / 100) : 0;
  const t3Amount = sales > t2L ? (sales - t2L) * (t3R / 100) : 0;
  const totalCommission = t1Amount + t2Amount + t3Amount;
  const effectiveRate = sales > 0 ? (totalCommission / sales) * 100 : 0;

  const handleTryExample = () => { setTotalSales('120000'); setTier1Limit('50000'); setTier1Rate('5'); setTier2Limit('100000'); setTier2Rate('8'); setTier3Rate('12'); setCalculated(false); };
  const handleCalculate = () => {
    if (sales > 0) {
      setCalculated(true);
      saveEntry({ totalSales, tier1Limit, tier1Rate, tier2Limit, tier2Rate, tier3Rate }, `Commission: ${formatCurrency(totalCommission)} (${effectiveRate.toFixed(2)}% effective)`);
    }
  };
  const handleReset = () => { setTotalSales(''); setTier1Limit('50000'); setTier1Rate('5'); setTier2Limit('100000'); setTier2Rate('8'); setTier3Rate('12'); setCalculated(false); };
  const handleRestore = (i: { totalSales: string; tier1Limit: string; tier1Rate: string; tier2Limit: string; tier2Rate: string; tier3Rate: string }) => { setTotalSales(i.totalSales); setTier1Limit(i.tier1Limit); setTier1Rate(i.tier1Rate); setTier2Limit(i.tier2Limit); setTier2Rate(i.tier2Rate); setTier3Rate(i.tier3Rate); setCalculated(true); };
  const snap = (): Snapshot => ({ sales, t1Amount, t2Amount, t3Amount, totalCommission, effectiveRate, label: `Commission: ${formatCurrency(totalCommission)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Tiered commission: different rates for different sales thresholds. E.g., 5% to $50k, 8% to $100k, 12% above. Used in SaaS, real estate, insurance.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalSales">Total Sales Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalSales" type="number" step="any" min="0" placeholder="120000" className="pl-7"
                value={totalSales} onChange={(e) => { setTotalSales(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tier1Limit">Tier 1 Limit ($)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="tier1Limit" type="number" step="any" min="0" placeholder="50000" className="pl-7"
                value={tier1Limit} onChange={(e) => { setTier1Limit(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tier1Rate">Tier 1 Rate (%)</Label>
            <div className="relative">
              
              <Input id="tier1Rate" type="number" step="any" min="0" placeholder="5"
                value={tier1Rate} onChange={(e) => { setTier1Rate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tier2Limit">Tier 2 Limit ($)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="tier2Limit" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={tier2Limit} onChange={(e) => { setTier2Limit(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tier2Rate">Tier 2 Rate (%)</Label>
            <div className="relative">
              
              <Input id="tier2Rate" type="number" step="any" min="0" placeholder="8"
                value={tier2Rate} onChange={(e) => { setTier2Rate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tier3Rate">Tier 3 Rate (%) (above Tier 2)</Label>
            <div className="relative">
              
              <Input id="tier3Rate" type="number" step="any" min="0" placeholder="12"
                value={tier3Rate} onChange={(e) => { setTier3Rate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={sales <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Tiered Commission
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Commission</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalCommission)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Effective rate: ${effectiveRate.toFixed(2)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Tier 1: ${formatCurrency(t1Amount)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Tier 2: ${formatCurrency(t2Amount)}, Tier 3: ${formatCurrency(t3Amount)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Sales</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(sales)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Tier 1 Commission</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(t1Amount)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Tier 2 Commission</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(t2Amount)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Commission</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalCommission)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Tiered commission uses progressive rates: different percentages for different sales thresholds. Example: 5% on first $50k, 8% on $50k-$100k, 12% above $100k. Accelerators reward over-performance. Effective rate = total commission / total sales. See our Sales Commission Calculator for flat-rate commission.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total Sales', valueA: formatCurrency(compareA.sales), valueB: formatCurrency(compareB.sales), numA: compareA.sales, numB: compareB.sales },
          { label: 'Total Commission', valueA: formatCurrency(compareA.totalCommission), valueB: formatCurrency(compareB.totalCommission), numA: compareA.totalCommission, numB: compareB.totalCommission },
          { label: 'Effective Rate', valueA: `${compareA.effectiveRate.toFixed(2)}%`, valueB: `${compareB.effectiveRate.toFixed(2)}%`, numA: compareA.effectiveRate, numB: compareB.effectiveRate }
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
