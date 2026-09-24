'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { total: number; women: number; minority: number; over40: number; womenPct: number; minorityPct: number; over40Pct: number; diversityScore: number; label: string; }

export default function DiversityRatioCalculator() {
  const [totalEmployees, setTotalEmployees] = useState('');
  const [womenCount, setWomenCount] = useState('');
  const [minorityCount, setMinorityCount] = useState('');
  const [over40Count, setOver40Count] = useState('ADEA protected class');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalEmployees: string; womenCount: string; minorityCount: string; over40Count: string }>('diversity-ratio-calculator');

  const total = parseFloat(totalEmployees) || 0;
  const women = parseFloat(womenCount) || 0;
  const minority = parseFloat(minorityCount) || 0;
  const over40 = parseFloat(over40Count) || 0;
  const womenPct = total > 0 ? (women / total) * 100 : 0;
  const minorityPct = total > 0 ? (minority / total) * 100 : 0;
  const over40Pct = total > 0 ? (over40 / total) * 100 : 0;
  const diversityScore = (womenPct + minorityPct + over40Pct) / 3;

  const handleTryExample = () => { setTotalEmployees('100'); setWomenCount('45'); setMinorityCount('35'); setOver40Count('30'); setCalculated(false); };
  const handleCalculate = () => {
    if (total > 0) {
      setCalculated(true);
      saveEntry({ totalEmployees, womenCount, minorityCount, over40Count }, `Diversity score: ${diversityScore.toFixed(1)}/100 (W:${womenPct.toFixed(0)}% M:${minorityPct.toFixed(0)}%)`);
    }
  };
  const handleReset = () => { setTotalEmployees(''); setWomenCount(''); setMinorityCount(''); setOver40Count(''); setCalculated(false); };
  const handleRestore = (i: { totalEmployees: string; womenCount: string; minorityCount: string; over40Count: string }) => { setTotalEmployees(i.totalEmployees); setWomenCount(i.womenCount); setMinorityCount(i.minorityCount); setOver40Count(i.over40Count); setCalculated(true); };
  const snap = (): Snapshot => ({ total, women, minority, over40, womenPct, minorityPct, over40Pct, diversityScore, label: `Score: ${diversityScore.toFixed(1)}/100` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Users className="inline h-3 w-3 mr-1" />
          {`Track workforce diversity by gender, race/ethnicity, age group, and tenure. Compare to EEO-1 and BLS benchmarks.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalEmployees">Total Employees</Label>
            <div className="relative">
              
              <Input id="totalEmployees" type="number" step="any" min="0" placeholder="100"
                value={totalEmployees} onChange={(e) => { setTotalEmployees(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="womenCount">Women Employees</Label>
            <div className="relative">
              
              <Input id="womenCount" type="number" step="any" min="0" placeholder="45"
                value={womenCount} onChange={(e) => { setWomenCount(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="minorityCount">Underrepresented Minorities</Label>
            <div className="relative">
              
              <Input id="minorityCount" type="number" step="any" min="0" placeholder="35"
                value={minorityCount} onChange={(e) => { setMinorityCount(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="over40Count">Employees Age 40+</Label>
            <div className="relative">
              
              <Input id="over40Count" type="number" step="any" min="0" placeholder="30"
                value={over40Count} onChange={(e) => { setOver40Count(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">ADEA protected class</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={total <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Diversity Ratio
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Diversity Ratios</p>
                <p className="text-4xl font-bold text-emerald-600">{`{diversityScore.toFixed(1)}/100`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Women: ${womenPct.toFixed(0)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Minorities: ${minorityPct.toFixed(0)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Age 40+: ${over40Pct.toFixed(0)}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total</p>
                    <p className={`text-lg font-bold`}>{`{total}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Women %</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{womenPct.toFixed(0)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Minority %</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{minorityPct.toFixed(0)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Age 40+ %</p>
                    <p className={`text-lg font-bold`}>{`{over40Pct.toFixed(0)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Diversity score = average of representation across tracked dimensions. US workforce benchmarks (BLS): women 47%, racial minorities 36%, age 40+ 45%. EEO-1 reporting required for employers with 100+ employees. DEI metrics should be tracked by department, level, and hiring stage to identify bottlenecks. Higher diversity correlates with 35%+ financial outperformance (McKinsey).`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total', valueA: String(compareA.total), valueB: String(compareB.total), numA: compareA.total, numB: compareB.total },
          { label: 'Women %', valueA: `${compareA.womenPct.toFixed(0)}%`, valueB: `${compareB.womenPct.toFixed(0)}%`, numA: compareA.womenPct, numB: compareB.womenPct },
          { label: 'Minority %', valueA: `${compareA.minorityPct.toFixed(0)}%`, valueB: `${compareB.minorityPct.toFixed(0)}%`, numA: compareA.minorityPct, numB: compareB.minorityPct },
          { label: 'Diversity Score', valueA: compareA.diversityScore.toFixed(1), valueB: compareB.diversityScore.toFixed(1), numA: compareA.diversityScore, numB: compareB.diversityScore }
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
