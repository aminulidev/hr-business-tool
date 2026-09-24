'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { prom: number; lateral: number; avg: number; totalMoves: number; mobilityRate: number; promotionShare: number; lateralShare: number; label: string; }

export default function InternalMobilityCalculator() {
  const [promotions, setPromotions] = useState('');
  const [lateralMoves, setLateralMoves] = useState('');
  const [avgHeadcount, setAvgHeadcount] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ promotions: string; lateralMoves: string; avgHeadcount: string }>('internal-mobility-calculator');

  const prom = parseFloat(promotions) || 0;
  const lateral = parseFloat(lateralMoves) || 0;
  const avg = parseFloat(avgHeadcount) || 0;
  const totalMoves = prom + lateral;
  const mobilityRate = avg > 0 ? (totalMoves / avg) * 100 : 0;
  const promotionShare = totalMoves > 0 ? (prom / totalMoves) * 100 : 0;
  const lateralShare = totalMoves > 0 ? (lateral / totalMoves) * 100 : 0;

  const handleTryExample = () => { setPromotions('12'); setLateralMoves('8'); setAvgHeadcount('100'); setCalculated(false); };
  const handleCalculate = () => {
    if (totalMoves > 0 && avg > 0) {
      setCalculated(true);
      saveEntry({ promotions, lateralMoves, avgHeadcount }, `Mobility: ${mobilityRate.toFixed(1)}% (${totalMoves} moves/${avg} HC)`);
    }
  };
  const handleReset = () => { setPromotions(''); setLateralMoves(''); setAvgHeadcount(''); setCalculated(false); };
  const handleRestore = (i: { promotions: string; lateralMoves: string; avgHeadcount: string }) => { setPromotions(i.promotions); setLateralMoves(i.lateralMoves); setAvgHeadcount(i.avgHeadcount); setCalculated(true); };
  const snap = (): Snapshot => ({ prom, lateral, avg, totalMoves, mobilityRate, promotionShare, lateralShare, label: `${mobilityRate.toFixed(1)}% mobility` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <ArrowLeftRight className="inline h-3 w-3 mr-1" />
          {`Calculate internal mobility rate (lateral moves + promotions). Higher mobility = 2x retention (LinkedIn data).`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="promotions">Promotions (period)</Label>
            <div className="relative">
              
              <Input id="promotions" type="number" step="any" min="0" placeholder="12"
                value={promotions} onChange={(e) => { setPromotions(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lateralMoves">Lateral Moves (period)</Label>
            <div className="relative">
              
              <Input id="lateralMoves" type="number" step="any" min="0" placeholder="8"
                value={lateralMoves} onChange={(e) => { setLateralMoves(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgHeadcount">Average Headcount</Label>
            <div className="relative">
              
              <Input id="avgHeadcount" type="number" step="any" min="0" placeholder="100"
                value={avgHeadcount} onChange={(e) => { setAvgHeadcount(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={totalMoves <= 0 || avg <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Mobility Rate
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Internal Mobility Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{`{mobilityRate.toFixed(1)}%`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`${totalMoves} total moves`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Promotions: ${promotionShare.toFixed(0)}%, Lateral: ${lateralShare.toFixed(0)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'High mobility = 2x retention'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Promotions</p>
                    <p className={`text-lg font-bold`}>{`{prom}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Lateral Moves</p>
                    <p className={`text-lg font-bold`}>{`{lateral}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Moves</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{totalMoves}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Mobility Rate</p>
                    <p className={`text-lg font-bold`}>{`{mobilityRate.toFixed(1)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Internal mobility rate = (promotions + lateral moves) / average headcount × 100. LinkedIn data: companies with high internal mobility retain employees 2x longer. Healthy: 10-20% annually. Low mobility (<5%) suggests career stagnation; very high (>30%) may indicate churn or restructuring. For promotion-only rate, see our Promotion Rate Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Promotions', valueA: String(compareA.prom), valueB: String(compareB.prom), numA: compareA.prom, numB: compareB.prom },
          { label: 'Lateral Moves', valueA: String(compareA.lateral), valueB: String(compareB.lateral), numA: compareA.lateral, numB: compareB.lateral },
          { label: 'Total Moves', valueA: String(compareA.totalMoves), valueB: String(compareB.totalMoves), numA: compareA.totalMoves, numB: compareB.totalMoves },
          { label: 'Mobility Rate', valueA: `${compareA.mobilityRate.toFixed(1)}%`, valueB: `${compareB.mobilityRate.toFixed(1)}%`, numA: compareA.mobilityRate, numB: compareB.mobilityRate }
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
