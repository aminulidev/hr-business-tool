'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarRange } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { curRev: number; tgtRev: number; curHc: number; revPerEmp: number; targetHc: number; growthNeeded: number; attritionLoss: number; totalHiresNeeded: number; annualHires: number; label: string; }

export default function WorkforcePlanningCalculator() {
  const [currentRevenue, setCurrentRevenue] = useState('');
  const [targetRevenue, setTargetRevenue] = useState('');
  const [currentHeadcount, setCurrentHeadcount] = useState('');
  const [years, setYears] = useState('');
  const [attritionRate, setAttritionRate] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ currentRevenue: string; targetRevenue: string; currentHeadcount: string; years: string; attritionRate: string }>('workforce-planning-calculator');

  const curRev = parseFloat(currentRevenue) || 0;
  const tgtRev = parseFloat(targetRevenue) || 0;
  const curHc = parseFloat(currentHeadcount) || 0;
  const yrs = parseFloat(years) || 1;
  const attr = parseFloat(attritionRate) || 0;
  const revPerEmp = curHc > 0 ? curRev / curHc : 0;
  const targetHc = revPerEmp > 0 ? Math.round(tgtRev / revPerEmp) : 0;
  const growthNeeded = targetHc - curHc;
  const attritionLoss = Math.round(curHc * (attr / 100) * yrs);
  const totalHiresNeeded = growthNeeded + attritionLoss;
  const annualHires = Math.round(totalHiresNeeded / yrs);

  const handleTryExample = () => { setCurrentRevenue('10000000'); setTargetRevenue('20000000'); setCurrentHeadcount('50'); setYears('3'); setAttritionRate('15'); setCalculated(false); };
  const handleCalculate = () => {
    if (curRev > 0 && tgtRev > 0 && curHc > 0) {
      setCalculated(true);
      saveEntry({ currentRevenue, targetRevenue, currentHeadcount, years, attritionRate }, `Target: ${targetHc} HC, ${totalHiresNeeded} hires over ${yrs}y`);
    }
  };
  const handleReset = () => { setCurrentRevenue(''); setTargetRevenue(''); setCurrentHeadcount(''); setYears('3'); setAttritionRate('15'); setCalculated(false); };
  const handleRestore = (i: { currentRevenue: string; targetRevenue: string; currentHeadcount: string; years: string; attritionRate: string }) => { setCurrentRevenue(i.currentRevenue); setTargetRevenue(i.targetRevenue); setCurrentHeadcount(i.currentHeadcount); setYears(i.years); setAttritionRate(i.attritionRate); setCalculated(true); };
  const snap = (): Snapshot => ({ curRev, tgtRev, curHc, revPerEmp, targetHc, growthNeeded, attritionLoss, totalHiresNeeded, annualHires, label: `Target: ${targetHc} (${totalHiresNeeded} hires)` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <CalendarRange className="inline h-3 w-3 mr-1" />
          {`Project headcount needs for 1-5 years based on revenue targets, current revenue per employee, and attrition rate.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentRevenue">Current Annual Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="currentRevenue" type="number" step="any" min="0" placeholder="10000000" className="pl-7"
                value={currentRevenue} onChange={(e) => { setCurrentRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetRevenue">Target Revenue (in N years)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="targetRevenue" type="number" step="any" min="0" placeholder="20000000" className="pl-7"
                value={targetRevenue} onChange={(e) => { setTargetRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentHeadcount">Current Headcount</Label>
            <div className="relative">
              
              <Input id="currentHeadcount" type="number" step="any" min="0" placeholder="50"
                value={currentHeadcount} onChange={(e) => { setCurrentHeadcount(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="years">Years to Target</Label>
            <div className="relative">
              
              <Input id="years" type="number" step="any" min="0" placeholder="3"
                value={years} onChange={(e) => { setYears(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="attritionRate">Annual Attrition Rate (%)</Label>
            <div className="relative">
              
              <Input id="attritionRate" type="number" step="any" min="0" placeholder="15"
                value={attritionRate} onChange={(e) => { setAttritionRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={curRev <= 0 || curHc <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Plan Workforce
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Projected Headcount Need</p>
                <p className="text-4xl font-bold text-emerald-600">{`{targetHc} employees`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Net growth needed: ${growthNeeded} employees`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`${totalHiresNeeded} total hires over ${yrs} years`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`~${annualHires}/year`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Current HC</p>
                    <p className={`text-lg font-bold`}>{`{curHc}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Target HC</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{targetHc}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Attrition Loss</p>
                    <p className={`text-lg font-bold`}>{`{attritionLoss}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Hires</p>
                    <p className={`text-lg font-bold`}>{`{totalHiresNeeded}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Workforce planning: target headcount = target revenue / current revenue per employee. Add attrition losses (current HC × annual rate × years). Assumes constant revenue per employee — adjust for productivity gains. For capacity analysis, see our Workforce Capacity Calculator. For headcount projection with hiring schedule, see our Headcount Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Current HC', valueA: String(compareA.curHc), valueB: String(compareB.curHc), numA: compareA.curHc, numB: compareB.curHc },
          { label: 'Target HC', valueA: String(compareA.targetHc), valueB: String(compareB.targetHc), numA: compareA.targetHc, numB: compareB.targetHc },
          { label: 'Growth Needed', valueA: String(compareA.growthNeeded), valueB: String(compareB.growthNeeded), numA: compareA.growthNeeded, numB: compareB.growthNeeded },
          { label: 'Total Hires', valueA: String(compareA.totalHiresNeeded), valueB: String(compareB.totalHiresNeeded), numA: compareA.totalHiresNeeded, numB: compareB.totalHiresNeeded }
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
