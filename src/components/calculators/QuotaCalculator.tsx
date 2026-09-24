'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { tam: number; ms: number; reps: number; gm: number; totalTarget: number; quotaPerRep: number; monthlyQuota: number; label: string; }

export default function QuotaCalculator() {
  const [territoryTAM, setTerritoryTAM] = useState('');
  const [marketShare, setMarketShare] = useState('');
  const [numReps, setNumReps] = useState('');
  const [growthMultiplier, setGrowthMultiplier] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ territoryTAM: string; marketShare: string; numReps: string; growthMultiplier: string }>('quota-calculator');

  const tam = parseFloat(territoryTAM) || 0;
  const ms = parseFloat(marketShare) || 0;
  const reps = parseFloat(numReps) || 0;
  const gm = parseFloat(growthMultiplier) || 1;
  const totalTarget = tam * (ms / 100) * gm;
  const quotaPerRep = reps > 0 ? totalTarget / reps : 0;
  const monthlyQuota = quotaPerRep / 12;

  const handleTryExample = () => { setTerritoryTAM('5000000'); setMarketShare('2'); setNumReps('5'); setGrowthMultiplier('1.2'); setCalculated(false); };
  const handleCalculate = () => {
    if (tam > 0 && reps > 0) {
      setCalculated(true);
      saveEntry({ territoryTAM, marketShare, numReps, growthMultiplier }, `Quota: ${formatCurrency(quotaPerRep)}/rep (${formatCurrency(monthlyQuota)}/mo)`);
    }
  };
  const handleReset = () => { setTerritoryTAM(''); setMarketShare('2'); setNumReps(''); setGrowthMultiplier('1.2'); setCalculated(false); };
  const handleRestore = (i: { territoryTAM: string; marketShare: string; numReps: string; growthMultiplier: string }) => { setTerritoryTAM(i.territoryTAM); setMarketShare(i.marketShare); setNumReps(i.numReps); setGrowthMultiplier(i.growthMultiplier); setCalculated(true); };
  const snap = (): Snapshot => ({ tam, ms, reps, gm, totalTarget, quotaPerRep, monthlyQuota, label: `Quota: ${formatCurrency(quotaPerRep)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Target className="inline h-3 w-3 mr-1" />
          {`Calculate sales quotas per rep based on territory potential, historical close rates, and growth targets.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="territoryTAM">Territory TAM (addressable market)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="territoryTAM" type="number" step="any" min="0" placeholder="5000000" className="pl-7"
                value={territoryTAM} onChange={(e) => { setTerritoryTAM(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketShare">Target Market Share (%)</Label>
            <div className="relative">
              
              <Input id="marketShare" type="number" step="any" min="0" placeholder="2"
                value={marketShare} onChange={(e) => { setMarketShare(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="numReps">Number of Reps</Label>
            <div className="relative">
              
              <Input id="numReps" type="number" step="any" min="0" placeholder="5"
                value={numReps} onChange={(e) => { setNumReps(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="growthMultiplier">Growth Multiplier</Label>
            <div className="relative">
              
              <Input id="growthMultiplier" type="number" step="any" min="0" placeholder="1.2"
                value={growthMultiplier} onChange={(e) => { setGrowthMultiplier(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">1.0 = flat, 1.2 = 20% growth</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={tam <= 0 || reps <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Quota
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Annual Quota per Rep</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(quotaPerRep)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Total team target: ${formatCurrency(totalTarget)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Monthly quota: ${formatCurrency(monthlyQuota)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Target market share: ${ms}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Territory TAM</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(tam)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Team Target</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalTarget)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Quota/Rep</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(quotaPerRep)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Monthly Quota</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(monthlyQuota)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Quota = (territory TAM × target market share × growth multiplier) / number of reps. Consider: historical attainment, ramp-up time, seasonality, deal size, sales cycle. Typical SaaS rep quota: $500k-$1.5M ARR. See our Sales Target Calculator for activity-based targets.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'TAM', valueA: formatCurrency(compareA.tam), valueB: formatCurrency(compareB.tam), numA: compareA.tam, numB: compareB.tam },
          { label: 'Total Target', valueA: formatCurrency(compareA.totalTarget), valueB: formatCurrency(compareB.totalTarget), numA: compareA.totalTarget, numB: compareB.totalTarget },
          { label: 'Quota/Rep', valueA: formatCurrency(compareA.quotaPerRep), valueB: formatCurrency(compareB.quotaPerRep), numA: compareA.quotaPerRep, numB: compareB.quotaPerRep }
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
