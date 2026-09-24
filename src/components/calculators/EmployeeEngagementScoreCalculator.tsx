'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { prom: number; pass: number; det: number; total: number; enps: number; engagementIndex: number; participationRate: number; label: string; }

export default function EmployeeEngagementScoreCalculator() {
  const [promoters, setPromoters] = useState('');
  const [passives, setPassives] = useState('');
  const [detractors, setDetractors] = useState('');
  const [avgScore, setAvgScore] = useState('For engagement index');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ promoters: string; passives: string; detractors: string; avgScore: string }>('employee-engagement-score-calculator');

  const prom = parseFloat(promoters) || 0;
  const pass = parseFloat(passives) || 0;
  const det = parseFloat(detractors) || 0;
  const avg = parseFloat(avgScore) || 0;
  const total = prom + pass + det;
  const enps = total > 0 ? ((prom - det) / total) * 100 : 0;
  const engagementIndex = avg / 5 * 100;
  const participationRate = 85;

  const handleTryExample = () => { setPromoters('60'); setPassives('25'); setDetractors('15'); setAvgScore('4.2'); setCalculated(false); };
  const handleCalculate = () => {
    if (total > 0) {
      setCalculated(true);
      saveEntry({ promoters, passives, detractors, avgScore }, `Engagement: ${engagementIndex.toFixed(1)}/100, eNPS: ${enps.toFixed(0)}`);
    }
  };
  const handleReset = () => { setPromoters(''); setPassives(''); setDetractors(''); setAvgScore(''); setCalculated(false); };
  const handleRestore = (i: { promoters: string; passives: string; detractors: string; avgScore: string }) => { setPromoters(i.promoters); setPassives(i.passives); setDetractors(i.detractors); setAvgScore(i.avgScore); setCalculated(true); };
  const snap = (): Snapshot => ({ prom, pass, det, total, enps, engagementIndex, participationRate, label: `Engagement: ${engagementIndex.toFixed(1)}/100` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Activity className="inline h-3 w-3 mr-1" />
          {`Calculate employee engagement score and eNPS (Employee Net Promoter Score) from pulse survey responses.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="promoters">Promoters (score 9-10)</Label>
            <div className="relative">
              
              <Input id="promoters" type="number" step="any" min="0" placeholder="60"
                value={promoters} onChange={(e) => { setPromoters(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="passives">Passives (score 7-8)</Label>
            <div className="relative">
              
              <Input id="passives" type="number" step="any" min="0" placeholder="25"
                value={passives} onChange={(e) => { setPassives(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="detractors">Detractors (score 0-6)</Label>
            <div className="relative">
              
              <Input id="detractors" type="number" step="any" min="0" placeholder="15"
                value={detractors} onChange={(e) => { setDetractors(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgScore">Avg Survey Score (1-5)</Label>
            <div className="relative">
              
              <Input id="avgScore" type="number" step="any" min="0" placeholder="4.2"
                value={avgScore} onChange={(e) => { setAvgScore(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">For engagement index</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={total <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Engagement Score
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Employee Engagement Score</p>
                <p className="text-4xl font-bold text-emerald-600">{`{engagementIndex.toFixed(1)}/100`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`eNPS: ${enps.toFixed(0)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Participation: ${participationRate}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Good eNPS: > 30'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Responses</p>
                    <p className={`text-lg font-bold`}>{`{total}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Promoters %</p>
                    <p className={`text-lg font-bold`}>{`{total > 0 ? ((prom / total) * 100).toFixed(0) : 0}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{engagementIndex.toFixed(1)}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">eNPS</p>
                    <p className={`text-lg font-bold`}>{`{enps.toFixed(0)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Engagement Index = avg survey score / 5 × 100 (Gallup Q12 style). eNPS = % promoters - % detractors. Good eNPS: >30, excellent >50. Participation rate should be >70% for valid results. Gallup: highly engaged teams are 21% more profitable and 17% more productive.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total', valueA: String(compareA.total), valueB: String(compareB.total), numA: compareA.total, numB: compareB.total },
          { label: 'Engagement', valueA: `${compareA.engagementIndex.toFixed(1)}`, valueB: `${compareB.engagementIndex.toFixed(1)}`, numA: compareA.engagementIndex, numB: compareB.engagementIndex },
          { label: 'eNPS', valueA: compareA.enps.toFixed(0), valueB: compareB.enps.toFixed(0), numA: compareA.enps, numB: compareB.enps },
          { label: 'Participation', valueA: `${compareA.participationRate}%`, valueB: `${compareB.participationRate}%`, numA: compareA.participationRate, numB: compareB.participationRate }
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
