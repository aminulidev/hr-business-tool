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

interface Snapshot { current: number; hires: number; departures: number; endHc: number; netGrowth: number; label: string; }

export default function HeadcountCalculator() {
  const [currentHc, setCurrentHc] = useState('');
  const [plannedHires, setPlannedHires] = useState('');
  const [attritionRate, setAttritionRate] = useState('');
  const [periodMonths, setPeriodMonths] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ currentHc: string; plannedHires: string; attritionRate: string; periodMonths: string }>('headcount-calculator');

  const current = parseFloat(currentHc) || 0;
  const hires = parseFloat(plannedHires) || 0;
  const attr = parseFloat(attritionRate) || 0;
  const months = parseFloat(periodMonths) || 12;
  const departures = Math.round(current * (attr / 100) * (months / 12));
  const endHc = Math.max(0, current + hires - departures);
  const netGrowth = endHc - current;

  const handleTryExample = () => { setCurrentHc('100'); setPlannedHires('20'); setAttritionRate('15'); setPeriodMonths('12'); setCalculated(false); };
  const handleCalculate = () => {
    if (current > 0) {
      setCalculated(true);
      saveEntry({ currentHc, plannedHires, attritionRate, periodMonths }, `Projected: ${endHc} (${netGrowth >= 0 ? "+" : ""}${netGrowth} net)`);
    }
  };
  const handleReset = () => { setCurrentHc(''); setPlannedHires(''); setAttritionRate('15'); setPeriodMonths('12'); setCalculated(false); };
  const handleRestore = (i: { currentHc: string; plannedHires: string; attritionRate: string; periodMonths: string }) => { setCurrentHc(i.currentHc); setPlannedHires(i.plannedHires); setAttritionRate(i.attritionRate); setPeriodMonths(i.periodMonths); setCalculated(true); };
  const snap = (): Snapshot => ({ current, hires, departures, endHc, netGrowth, label: `Projected: ${endHc}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Users className="inline h-3 w-3 mr-1" />
          {`Project year-end headcount = current + planned hires − expected attrition. Used for budgeting and workforce planning.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentHc">Current Headcount</Label>
            <div className="relative">
              
              <Input id="currentHc" type="number" step="any" min="0" placeholder="100"
                value={currentHc} onChange={(e) => { setCurrentHc(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="plannedHires">Planned Hires</Label>
            <div className="relative">
              
              <Input id="plannedHires" type="number" step="any" min="0" placeholder="20"
                value={plannedHires} onChange={(e) => { setPlannedHires(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="attritionRate">Attrition Rate (%)</Label>
            <div className="relative">
              
              <Input id="attritionRate" type="number" step="any" min="0" placeholder="15"
                value={attritionRate} onChange={(e) => { setAttritionRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="periodMonths">Projection Period (months)</Label>
            <div className="relative">
              
              <Input id="periodMonths" type="number" step="any" min="0" placeholder="12"
                value={periodMonths} onChange={(e) => { setPeriodMonths(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={current <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Project Headcount
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Projected Year-End Headcount</p>
                <p className="text-4xl font-bold text-emerald-600">{`{endHc} employees`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Net growth: ${netGrowth >= 0 ? "+" : ""}${netGrowth}`}</Badge>
                  <Badge variant="outline" className="'bg-red-500/10 border-red-500/30 text-red-600'">{`${departures} expected departures`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`${hires} planned hires`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Current</p>
                    <p className={`text-lg font-bold`}>{`{current}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Hires</p>
                    <p className={`text-lg font-bold`}>{`+{hires}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Departures</p>
                    <p className={`text-lg font-bold`}>{`-{departures}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Projected</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{endHc}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Headcount projection = current + planned hires − expected departures. Departures = current × (annual attrition %) × (months / 12). For workforce planning across multiple years, see our Workforce Planning Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Current', valueA: String(compareA.current), valueB: String(compareB.current), numA: compareA.current, numB: compareB.current },
          { label: 'Hires', valueA: `+${compareA.hires}`, valueB: `+${compareB.hires}`, numA: compareA.hires, numB: compareB.hires },
          { label: 'Departures', valueA: `-${compareA.departures}`, valueB: `-${compareB.departures}`, numA: compareA.departures, numB: compareB.departures },
          { label: 'Projected', valueA: String(compareA.endHc), valueB: String(compareB.endHc), numA: compareA.endHc, numB: compareB.endHc }
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
