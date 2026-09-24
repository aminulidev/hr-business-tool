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

interface Snapshot { ar: number; gm: number; ch: number; clv: number; ltvCacRatio: number; avgLifetime: number; label: string; }

export default function CustomerLifetimeValueCalculator() {
  const [arpu, setArpu] = useState('');
  const [grossMargin, setGrossMargin] = useState('');
  const [monthlyChurn, setMonthlyChurn] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ arpu: string; grossMargin: string; monthlyChurn: string }>('customer-lifetime-value-calculator');

  const ar = parseFloat(arpu) || 0;
  const gm = parseFloat(grossMargin) || 0;
  const ch = parseFloat(monthlyChurn) || 0;
  const clv = ch > 0 ? (ar * (gm / 100)) / (ch / 100) : ar * (gm / 100) * 60;
  const ltvCacRatio = clv > 0 && 500 > 0 ? clv / 500 : 0;
  const avgLifetime = ch > 0 ? 1 / (ch / 100) : 60;

  const handleTryExample = () => { setArpu('100'); setGrossMargin('80'); setMonthlyChurn('3'); setCalculated(false); };
  const handleCalculate = () => {
    if (ar > 0) {
      setCalculated(true);
      saveEntry({ arpu, grossMargin, monthlyChurn }, `CLV: ${formatCurrency(clv)} (${avgLifetime.toFixed(1)} mo lifetime)`);
    }
  };
  const handleReset = () => { setArpu(''); setGrossMargin('80'); setMonthlyChurn('3'); setCalculated(false); };
  const handleRestore = (i: { arpu: string; grossMargin: string; monthlyChurn: string }) => { setArpu(i.arpu); setGrossMargin(i.grossMargin); setMonthlyChurn(i.monthlyChurn); setCalculated(true); };
  const snap = (): Snapshot => ({ ar, gm, ch, clv, ltvCacRatio, avgLifetime, label: `CLV: ${formatCurrency(clv)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`CLV = (ARPU × gross margin) / monthly churn. Target LTV:CAC >3:1 for SaaS. Track by cohort and segment.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="arpu">Monthly ARPU</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="arpu" type="number" step="any" min="0" placeholder="100" className="pl-7"
                value={arpu} onChange={(e) => { setArpu(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="grossMargin">Gross Margin (%)</Label>
            <div className="relative">
              
              <Input id="grossMargin" type="number" step="any" min="0" placeholder="80"
                value={grossMargin} onChange={(e) => { setGrossMargin(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyChurn">Monthly Churn Rate (%)</Label>
            <div className="relative">
              
              <Input id="monthlyChurn" type="number" step="any" min="0" placeholder="3"
                value={monthlyChurn} onChange={(e) => { setMonthlyChurn(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={ar <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate CLV
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Customer Lifetime Value (CLV)</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(clv)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Avg customer lifetime: ${avgLifetime.toFixed(1)} months`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`LTV:CAC (at $500 CAC): ${ltvCacRatio.toFixed(1)}:1`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Target LTV:CAC > 3:1'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Monthly ARPU</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(ar)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Gross Margin</p>
                    <p className={`text-lg font-bold`}>{`{gm}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">CLV</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(clv)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Avg Lifetime</p>
                    <p className={`text-lg font-bold`}>{`{avgLifetime.toFixed(1)} mo`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`CLV = (ARPU × gross margin) / monthly churn. Measures total profit per customer over lifetime. Target LTV:CAC >3:1 (SaaS). Improve CLV by: raise ARPU (upsell), reduce churn (better product), increase gross margin. Even 1% churn reduction can increase CLV 20%+. See our CAC Payback Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'ARPU', valueA: formatCurrency(compareA.ar), valueB: formatCurrency(compareB.ar), numA: compareA.ar, numB: compareB.ar },
          { label: 'CLV', valueA: formatCurrency(compareA.clv), valueB: formatCurrency(compareB.clv), numA: compareA.clv, numB: compareB.clv },
          { label: 'Lifetime', valueA: `${compareA.avgLifetime.toFixed(1)} mo`, valueB: `${compareB.avgLifetime.toFixed(1)} mo`, numA: compareA.avgLifetime, numB: compareB.avgLifetime }
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
