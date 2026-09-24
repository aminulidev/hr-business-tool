'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { inv: number; cap: number; disc: number; nrv: number; effectiveValuation: number; ownershipPct: number; label: string; }

export default function SafeNoteCalculator() {
  const [investment, setInvestment] = useState('');
  const [valuationCap, setValuationCap] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [nextRoundValuation, setNextRoundValuation] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ investment: string; valuationCap: string; discountRate: string; nextRoundValuation: string }>('safe-note-calculator');

  const inv = parseFloat(investment) || 0;
  const cap = parseFloat(valuationCap) || 0;
  const disc = parseFloat(discountRate) || 0;
  const nrv = parseFloat(nextRoundValuation) || 0;
  const effectiveValuation = Math.min(cap, nrv * (1 - disc / 100));
  const ownershipPct = effectiveValuation > 0 ? (inv / effectiveValuation) * 100 : 0;

  const handleTryExample = () => { setInvestment('100000'); setValuationCap('5000000'); setDiscountRate('20'); setNextRoundValuation('10000000'); setCalculated(false); };
  const handleCalculate = () => {
    if (inv > 0 && cap > 0) {
      setCalculated(true);
      saveEntry({ investment, valuationCap, discountRate, nextRoundValuation }, `SAFE ownership: ${ownershipPct.toFixed(2)}% (eff. valuation: ${formatCurrency(effectiveValuation)})`);
    }
  };
  const handleReset = () => { setInvestment(''); setValuationCap(''); setDiscountRate('20'); setNextRoundValuation(''); setCalculated(false); };
  const handleRestore = (i: { investment: string; valuationCap: string; discountRate: string; nextRoundValuation: string }) => { setInvestment(i.investment); setValuationCap(i.valuationCap); setDiscountRate(i.discountRate); setNextRoundValuation(i.nextRoundValuation); setCalculated(true); };
  const snap = (): Snapshot => ({ inv, cap, disc, nrv, effectiveValuation, ownershipPct, label: `Ownership: ${ownershipPct.toFixed(2)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <FileText className="inline h-3 w-3 mr-1" />
          {`Calculate SAFE note conversion: valuation cap, discount rate, and ownership at next round.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="investment">SAFE Investment Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="investment" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={investment} onChange={(e) => { setInvestment(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="valuationCap">Valuation Cap</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="valuationCap" type="number" step="any" min="0" placeholder="5000000" className="pl-7"
                value={valuationCap} onChange={(e) => { setValuationCap(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountRate">Discount Rate (%)</Label>
            <div className="relative">
              
              <Input id="discountRate" type="number" step="any" min="0" placeholder="20"
                value={discountRate} onChange={(e) => { setDiscountRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nextRoundValuation">Next Round Pre-Money</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="nextRoundValuation" type="number" step="any" min="0" placeholder="10000000" className="pl-7"
                value={nextRoundValuation} onChange={(e) => { setNextRoundValuation(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={inv <= 0 || cap <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate SAFE
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">SAFE Conversion</p>
                <p className="text-4xl font-bold text-emerald-600">{`{ownershipPct.toFixed(2)}% ownership`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Effective valuation: ${formatCurrency(effectiveValuation)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Valuation cap: ${formatCurrency(cap)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Discount: ${disc}% off next round`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">SAFE Investment</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(inv)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Effective Valuation</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(effectiveValuation)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Ownership %</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{ownershipPct.toFixed(2)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Valuation Cap</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cap)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`SAFE converts at the LOWER of: valuation cap or discount rate x next round valuation. YC standard for pre-seed/seed.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Ownership', valueA: `${compareA.ownershipPct.toFixed(2)}%`, valueB: `${compareB.ownershipPct.toFixed(2)}%`, numA: compareA.ownershipPct, numB: compareB.ownershipPct },
          { label: 'Eff. Valuation', valueA: formatCurrency(compareA.effectiveValuation), valueB: formatCurrency(compareB.effectiveValuation), numA: compareA.effectiveValuation, numB: compareB.effectiveValuation }
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
