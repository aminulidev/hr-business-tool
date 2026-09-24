'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { pm: number; inv: number; op: number; postMoney: number; investorPct: number; founderPct: number; dilution: number; label: string; }

export default function EquityDilutionCalculator() {
  const [preMoney, setPreMoney] = useState('');
  const [investment, setInvestment] = useState('');
  const [optionPool, setOptionPool] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ preMoney: string; investment: string; optionPool: string }>('equity-dilution-calculator');

  const pm = parseFloat(preMoney) || 0;
  const inv = parseFloat(investment) || 0;
  const op = parseFloat(optionPool) || 0;
  const postMoney = pm + inv;
  const investorPct = postMoney > 0 ? (inv / postMoney) * 100 : 0;
  const founderPct = 100 - investorPct - op;
  const dilution = investorPct + op;

  const handleTryExample = () => { setPreMoney('10000000'); setInvestment('2500000'); setOptionPool('10'); setCalculated(false); };
  const handleCalculate = () => {
    if (pm > 0 && inv > 0) {
      setCalculated(true);
      saveEntry({ preMoney, investment, optionPool }, `Founder: ${founderPct.toFixed(1)}% (dilution: ${dilution.toFixed(1)}%)`);
    }
  };
  const handleReset = () => { setPreMoney(''); setInvestment(''); setOptionPool('10'); setCalculated(false); };
  const handleRestore = (i: { preMoney: string; investment: string; optionPool: string }) => { setPreMoney(i.preMoney); setInvestment(i.investment); setOptionPool(i.optionPool); setCalculated(true); };
  const snap = (): Snapshot => ({ pm, inv, op, postMoney, investorPct, founderPct, dilution, label: `Founder: ${founderPct.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Percent className="inline h-3 w-3 mr-1" />
          {`Calculate equity dilution per funding round. See founder ownership before and after investment.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="preMoney">Pre-Money Valuation</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="preMoney" type="number" step="any" min="0" placeholder="10000000" className="pl-7"
                value={preMoney} onChange={(e) => { setPreMoney(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="investment">Investment Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="investment" type="number" step="any" min="0" placeholder="2500000" className="pl-7"
                value={investment} onChange={(e) => { setInvestment(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="optionPool">New Option Pool (%)</Label>
            <div className="relative">
              
              <Input id="optionPool" type="number" step="any" min="0" placeholder="10"
                value={optionPool} onChange={(e) => { setOptionPool(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={pm <= 0 || inv <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Dilution
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Post-Round Ownership</p>
                <p className="text-4xl font-bold text-emerald-600">{`{founderPct.toFixed(1)}% founder`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Investor: ${investorPct.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Option pool: ${op}%`}</Badge>
                  <Badge variant="outline" className="'bg-red-500/10 border-red-500/30 text-red-600'">{`Total dilution: ${dilution.toFixed(1)}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Pre-Money</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(pm)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Post-Money</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(postMoney)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Founder %</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{founderPct.toFixed(1)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Dilution</p>
                    <p className={`text-lg font-bold`}>{`{dilution.toFixed(1)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Dilution = investor % + option pool %. Investor % = investment / post-money. After Series A (25% + 10% pool), founders retain ~65%.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Founder %', valueA: `${compareA.founderPct.toFixed(1)}%`, valueB: `${compareB.founderPct.toFixed(1)}%`, numA: compareA.founderPct, numB: compareB.founderPct },
          { label: 'Dilution', valueA: `${compareA.dilution.toFixed(1)}%`, valueB: `${compareB.dilution.toFixed(1)}%`, numA: compareA.dilution, numB: compareB.dilution }
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
