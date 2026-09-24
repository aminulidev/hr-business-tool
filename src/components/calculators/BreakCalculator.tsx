'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PauseCircle } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';

interface BreakSnapshot { shiftHours: number; mealBreaks: number; restBreaks: number; totalBreakMin: number; label: string; }
type StateCode = 'CA' | 'OR' | 'WA' | 'CO' | 'NY' | 'other';

// State break rules (2026)
const STATE_RULES: Record<StateCode, { mealThreshold: number; mealMin: number; restEveryNHours: number; restMin: number; secondMealThreshold: number; name: string }> = {
  CA: { mealThreshold: 5, mealMin: 30, restEveryNHours: 4, restMin: 10, secondMealThreshold: 10, name: 'California' },
  OR: { mealThreshold: 6, mealMin: 30, restEveryNHours: 4, restMin: 10, secondMealThreshold: 14, name: 'Oregon' },
  WA: { mealThreshold: 5, mealMin: 30, restEveryNHours: 4, restMin: 10, secondMealThreshold: 10, name: 'Washington' },
  CO: { mealThreshold: 5, mealMin: 30, restEveryNHours: 4, restMin: 10, secondMealThreshold: 10, name: 'Colorado' },
  NY: { mealThreshold: 6, mealMin: 30, restEveryNHours: 6, restMin: 0, secondMealThreshold: 99, name: 'New York' },
  other: { mealThreshold: 0, mealMin: 0, restEveryNHours: 0, restMin: 0, secondMealThreshold: 0, name: 'No state mandate (FLSA only)' },
};

export default function BreakCalculator() {
  const [shiftHours, setShiftHours] = useState('8');
  const [stateCode, setStateCode] = useState<StateCode>('CA');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<BreakSnapshot | null>(null);
  const [compareB, setCompareB] = useState<BreakSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ shiftHours: string; stateCode: string }>('break-calculator');

  const sh = parseFloat(shiftHours) || 0;
  const rule = STATE_RULES[stateCode];

  // Calculate required breaks
  let mealBreaks = 0;
  if (rule.mealThreshold > 0 && sh >= rule.mealThreshold) mealBreaks = 1;
  if (rule.secondMealThreshold > 0 && rule.secondMealThreshold < 99 && sh >= rule.secondMealThreshold) mealBreaks = 2;
  // NY: 30-min meal between 11am-3pm for factory workers, 6h+ for other industries
  if (stateCode === 'NY' && sh >= 6) mealBreaks = 1;

  const restBreaks = rule.restEveryNHours > 0 ? Math.floor(sh / rule.restEveryNHours) : 0;
  const totalBreakMin = mealBreaks * rule.mealMin + restBreaks * rule.restMin;
  const paidBreakMin = restBreaks * rule.restMin; // rest breaks are paid; meal breaks unpaid if relieved of duty
  const unpaidBreakMin = mealBreaks * rule.mealMin;
  const netWorkHours = Math.max(0, sh - unpaidBreakMin / 60);

  const handleTryExample = () => { setShiftHours('10'); setStateCode('CA'); setCalculated(false); };
  const handleCalculate = () => {
    if (sh > 0) {
      setCalculated(true);
      saveEntry({ shiftHours, stateCode }, `${rule.name} · ${sh}h shift · ${mealBreaks} meal + ${restBreaks} rest = ${totalBreakMin}min`);
    }
  };
  const handleReset = () => { setShiftHours('8'); setStateCode('CA'); setCalculated(false); };
  const handleRestore = (i: { shiftHours: string; stateCode: string }) => { setShiftHours(i.shiftHours); setStateCode(i.stateCode as StateCode); setCalculated(true); };
  const snap = (): BreakSnapshot => ({ shiftHours: sh, mealBreaks, restBreaks, totalBreakMin, label: `${sh}h (${rule.name})` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3 text-xs text-muted-foreground">
          <PauseCircle className="inline h-3 w-3 mr-1" />
          Federal FLSA does not require meal or rest breaks — only CA, OR, WA, CO, and NY mandate them for most workers. Meal breaks (30 min) are typically unpaid; rest breaks (10 min) are paid.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bc-shift">Shift Length (hours)</Label>
            <Input id="bc-shift" type="number" step="0.5" min="0" placeholder="8" value={shiftHours}
              onChange={(e) => { setShiftHours(e.target.value); setCalculated(false); }} />
            <p className="text-xs text-muted-foreground">Total scheduled shift length including breaks.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bc-state">State</Label>
            <Select value={stateCode} onValueChange={(v) => { setStateCode(v as StateCode); setCalculated(false); }}>
              <SelectTrigger id="bc-state"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(STATE_RULES) as StateCode[]).map(s => (
                  <SelectItem key={s} value={s}>{STATE_RULES[s].name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={sh <= 0}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg shadow-blue-500/25 flex-1 sm:flex-none">
              Calculate Required Breaks
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
            className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Required Breaks ({rule.name})</p>
                <p className="text-4xl font-bold text-blue-600">{totalBreakMin} min total</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">{mealBreaks} × {rule.mealMin}min meal (unpaid)</Badge>
                  {restBreaks > 0 && <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{restBreaks} × {rule.restMin}min rest (paid)</Badge>}
                  <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">Net work: {netWorkHours.toFixed(2)}h</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 overflow-hidden">
                <div className="px-4 py-2 bg-muted/40 border-b border-border/50 text-xs font-semibold text-muted-foreground">
                  {rule.name} Break Requirements
                </div>
                <div className="divide-y divide-border/40 text-xs">
                  {stateCode === 'CA' && (
                    <>
                      <div className="px-4 py-2 flex justify-between"><span>Meal break (30 min, unpaid):</span><span className="font-semibold">{sh >= 5 ? `Required (shift ≥ 5h)` : 'Not required'}</span></div>
                      <div className="px-4 py-2 flex justify-between"><span>Second meal (30 min):</span><span className="font-semibold">{sh >= 10 ? `Required (shift ≥ 10h)` : 'Not required'}</span></div>
                      <div className="px-4 py-2 flex justify-between"><span>Rest breaks (10 min, paid):</span><span className="font-semibold">{restBreaks} breaks (1 per 4h)</span></div>
                      <div className="px-4 py-2 flex justify-between"><span>Net work time:</span><span className="font-semibold">{netWorkHours.toFixed(2)}h</span></div>
                    </>
                  )}
                  {stateCode === 'other' && (
                    <div className="px-4 py-3 text-muted-foreground">Federal FLSA does not require meal or rest breaks. Check your employer policy or union contract.</div>
                  )}
                  {stateCode !== 'CA' && stateCode !== 'other' && (
                    <>
                      <div className="px-4 py-2 flex justify-between"><span>Meal break ({rule.mealMin} min, unpaid):</span><span className="font-semibold">{sh >= rule.mealThreshold ? `Required (shift ≥ ${rule.mealThreshold}h)` : 'Not required'}</span></div>
                      {rule.restMin > 0 && <div className="px-4 py-2 flex justify-between"><span>Rest breaks ({rule.restMin} min, paid):</span><span className="font-semibold">{restBreaks} breaks</span></div>}
                      <div className="px-4 py-2 flex justify-between"><span>Net work time:</span><span className="font-semibold">{netWorkHours.toFixed(2)}h</span></div>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                💡 California (LC 512) requires a 30-min meal break before the 5th hour of work and a 10-min paid rest break per 4 hours worked. Missing breaks trigger 1-hour premium pay (LC 226.7). For payroll with auto-deducted lunch, see <a href="/calculators/lunch-deduction-calculator" className="text-blue-600 hover:underline">Lunch Deduction Calculator</a>.
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Shift Hours', valueA: `${compareA.shiftHours}h`, valueB: `${compareB.shiftHours}h`, numA: compareA.shiftHours, numB: compareB.shiftHours },
          { label: 'Meal Breaks', valueA: String(compareA.mealBreaks), valueB: String(compareB.mealBreaks), numA: compareA.mealBreaks, numB: compareB.mealBreaks },
          { label: 'Rest Breaks', valueA: String(compareA.restBreaks), valueB: String(compareB.restBreaks), numA: compareA.restBreaks, numB: compareB.restBreaks },
          { label: 'Total Break Min', valueA: `${compareA.totalBreakMin} min`, valueB: `${compareB.totalBreakMin} min`, numA: compareA.totalBreakMin, numB: compareB.totalBreakMin },
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
