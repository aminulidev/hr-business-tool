'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { up: number; se: number; cs: number; tm: number; expansionMrr: number; expansionPct: number; annualExpansion: number; label: string; }

export default function ExpansionMrrCalculator() {
  const [upsellMrr, setUpsellMrr] = useState('');
  const [seatMrr, setSeatMrr] = useState('');
  const [crossSellMrr, setCrossSellMrr] = useState('');
  const [totalMrr, setTotalMrr] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ upsellMrr: string; seatMrr: string; crossSellMrr: string; totalMrr: string }>('expansion-mrr-calculator');

  const up = parseFloat(upsellMrr) || 0;
  const se = parseFloat(seatMrr) || 0;
  const cs = parseFloat(crossSellMrr) || 0;
  const tm = parseFloat(totalMrr) || 0;
  const expansionMrr = up + se + cs;
  const expansionPct = tm > 0 ? (expansionMrr / tm) * 100 : 0;
  const annualExpansion = expansionMrr * 12;

  const handleTryExample = () => { setUpsellMrr('3000'); setSeatMrr('2000'); setCrossSellMrr('1000'); setTotalMrr('100000'); setCalculated(false); };
  const handleCalculate = () => {
    if (tm > 0) {
      setCalculated(true);
      saveEntry({ upsellMrr, seatMrr, crossSellMrr, totalMrr }, `Expansion MRR: ${formatCurrency(expansionMrr)}/mo (${expansionPct.toFixed(1)}%)`);
    }
  };
  const handleReset = () => { setUpsellMrr(''); setSeatMrr(''); setCrossSellMrr(''); setTotalMrr(''); setCalculated(false); };
  const handleRestore = (i: { upsellMrr: string; seatMrr: string; crossSellMrr: string; totalMrr: string }) => { setUpsellMrr(i.upsellMrr); setSeatMrr(i.seatMrr); setCrossSellMrr(i.crossSellMrr); setTotalMrr(i.totalMrr); setCalculated(true); };
  const snap = (): Snapshot => ({ up, se, cs, tm, expansionMrr, expansionPct, annualExpansion, label: `Expansion: ${formatCurrency(expansionMrr)}/mo` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          {`Calculate expansion MRR from upsells, cross-sells, seat additions, and plan upgrades.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="upsellMrr">Upsell MRR</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="upsellMrr" type="number" step="any" min="0" placeholder="3000" className="pl-7"
                value={upsellMrr} onChange={(e) => { setUpsellMrr(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seatMrr">Seat Addition MRR</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="seatMrr" type="number" step="any" min="0" placeholder="2000" className="pl-7"
                value={seatMrr} onChange={(e) => { setSeatMrr(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="crossSellMrr">Cross-sell MRR</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="crossSellMrr" type="number" step="any" min="0" placeholder="1000" className="pl-7"
                value={crossSellMrr} onChange={(e) => { setCrossSellMrr(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalMrr">Total Current MRR</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalMrr" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={totalMrr} onChange={(e) => { setTotalMrr(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={tm <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Expansion MRR
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Expansion MRR</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(expansionMrr)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Expansion %: ${expansionPct.toFixed(1)}% of MRR`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Annual expansion: ${formatCurrency(annualExpansion)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{expansionPct > 10 ? "Strong" : expansionPct > 5 ? "Good" : "Needs work"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Upsell MRR</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(up)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Seat MRR</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(se)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Expansion MRR</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(expansionMrr)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Expansion %</p>
                    <p className={`text-lg font-bold`}>{`{expansionPct.toFixed(1)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Expansion MRR = upsells + seat additions + cross-sells. Expansion >10% of MRR = strong. Drives NRR >100%.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Expansion MRR', valueA: formatCurrency(compareA.expansionMrr), valueB: formatCurrency(compareB.expansionMrr), numA: compareA.expansionMrr, numB: compareB.expansionMrr },
          { label: 'Expansion %', valueA: `${compareA.expansionPct.toFixed(1)}%`, valueB: `${compareB.expansionPct.toFixed(1)}%`, numA: compareA.expansionPct, numB: compareB.expansionPct }
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
