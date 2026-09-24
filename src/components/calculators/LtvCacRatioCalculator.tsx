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

interface Snapshot { l: number; c: number; ratio: number; status: string; label: string; }

export default function LtvCacRatioCalculator() {
  const [ltv, setLtv] = useState('');
  const [cac, setCac] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ ltv: string; cac: string }>('ltv-cac-ratio-calculator');

  const l = parseFloat(ltv) || 0;
  const c = parseFloat(cac) || 0;
  const ratio = c > 0 ? l / c : 0;
  const status = ratio > 5 ? "Under-investing" : ratio > 3 ? "Healthy" : ratio > 1 ? "Marginal" : "Losing money";

  const handleTryExample = () => { setLtv('2000'); setCac('500'); setCalculated(false); };
  const handleCalculate = () => {
    if (l > 0 && c > 0) {
      setCalculated(true);
      saveEntry({ ltv, cac }, `LTV:CAC ${ratio.toFixed(1)}:1 (${status})`);
    }
  };
  const handleReset = () => { setLtv(''); setCac(''); setCalculated(false); };
  const handleRestore = (i: { ltv: string; cac: string }) => { setLtv(i.ltv); setCac(i.cac); setCalculated(true); };
  const snap = (): Snapshot => ({ l, c, ratio, status, label: `LTV:CAC ${ratio.toFixed(1)}:1` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <BarChart3 className="inline h-3 w-3 mr-1" />
          {`Calculate LTV:CAC ratio. Target >3:1 for SaaS. Below 1:1 = losing money per customer.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ltv">Customer Lifetime Value (LTV)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="ltv" type="number" step="any" min="0" placeholder="2000" className="pl-7"
                value={ltv} onChange={(e) => { setLtv(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cac">Customer Acquisition Cost (CAC)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="cac" type="number" step="any" min="0" placeholder="500" className="pl-7"
                value={cac} onChange={(e) => { setCac(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={l <= 0 || c <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate LTV:CAC
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">LTV:CAC Ratio</p>
                <p className="text-4xl font-bold text-emerald-600">{`{ratio.toFixed(1)}:1`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`LTV: ${formatCurrency(l)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`CAC: ${formatCurrency(c)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Status: ${status}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">LTV</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(l)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">CAC</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(c)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">LTV:CAC</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{ratio.toFixed(1)}:1`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className={`text-lg font-bold`}>{status}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`LTV:CAC ratio = lifetime value / acquisition cost. Target >3:1. Below 1:1 = losing money.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'LTV', valueA: formatCurrency(compareA.l), valueB: formatCurrency(compareB.l), numA: compareA.l, numB: compareB.l },
          { label: 'CAC', valueA: formatCurrency(compareA.c), valueB: formatCurrency(compareB.c), numA: compareA.c, numB: compareB.c },
          { label: 'Ratio', valueA: `${compareA.ratio.toFixed(1)}:1`, valueB: `${compareB.ratio.toFixed(1)}:1`, numA: compareA.ratio, numB: compareB.ratio }
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
