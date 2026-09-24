'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { income: number; wh: number; off: number; workWeeks: number; annualHours: number; hourlyValue: number; minuteValue: number; dailyValue: number; label: string; }

export default function TimeValueCalculator() {
  const [annualIncome, setAnnualIncome] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [weeksOff, setWeeksOff] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ annualIncome: string; workHours: string; weeksOff: string }>('time-value-calculator');

  const income = parseFloat(annualIncome) || 0;
  const wh = parseFloat(workHours) || 0;
  const off = parseFloat(weeksOff) || 0;
  const workWeeks = 52 - off;
  const annualHours = workWeeks * wh;
  const hourlyValue = annualHours > 0 ? income / annualHours : 0;
  const minuteValue = hourlyValue / 60;
  const dailyValue = hourlyValue * 8;

  const handleTryExample = () => { setAnnualIncome('75000'); setWorkHours('40'); setWeeksOff('4'); setCalculated(false); };
  const handleCalculate = () => {
    if (income > 0 && wh > 0) {
      setCalculated(true);
      saveEntry({ annualIncome, workHours, weeksOff }, `Value: ${formatCurrency(hourlyValue)}/hr (${formatCurrency(dailyValue)}/day)`);
    }
  };
  const handleReset = () => { setAnnualIncome(''); setWorkHours('40'); setWeeksOff('4'); setCalculated(false); };
  const handleRestore = (i: { annualIncome: string; workHours: string; weeksOff: string }) => { setAnnualIncome(i.annualIncome); setWorkHours(i.workHours); setWeeksOff(i.weeksOff); setCalculated(true); };
  const snap = (): Snapshot => ({ income, wh, off, workWeeks, annualHours, hourlyValue, minuteValue, dailyValue, label: `Value: ${formatCurrency(hourlyValue)}/hr` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Clock className="inline h-3 w-3 mr-1" />
          {`Calculate the value of your time: annual income / work hours = hourly time value. See cost of any activity.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annualIncome">Annual Income</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="annualIncome" type="number" step="any" min="0" placeholder="75000" className="pl-7"
                value={annualIncome} onChange={(e) => { setAnnualIncome(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workHours">Work Hours per Week</Label>
            <div className="relative">
              
              <Input id="workHours" type="number" step="any" min="0" placeholder="40"
                value={workHours} onChange={(e) => { setWorkHours(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weeksOff">Weeks Off per Year</Label>
            <div className="relative">
              
              <Input id="weeksOff" type="number" step="any" min="0" placeholder="4"
                value={weeksOff} onChange={(e) => { setWeeksOff(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={income <= 0 || wh <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Time Value
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Value of Your Time</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(hourlyValue) + "/hr"}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Daily value: ${formatCurrency(dailyValue)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Per minute: ${formatCurrency(minuteValue)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`${annualHours}h/year`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annual Hours</p>
                    <p className={`text-lg font-bold`}>{`{annualHours}h`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Hourly Value</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(hourlyValue)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Daily Value</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(dailyValue)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Per Minute</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(minuteValue)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Time value = annual income / annual work hours. Example: $75k / (48 weeks x 40h) = $39.06/hr. If a task costs less than $39/hr to outsource, outsource it. Use for: outsourcing decisions, pricing your time, valuing meetings.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Annual Hours', valueA: `${compareA.annualHours}h`, valueB: `${compareB.annualHours}h`, numA: compareA.annualHours, numB: compareB.annualHours },
          { label: 'Hourly Value', valueA: formatCurrency(compareA.hourlyValue), valueB: formatCurrency(compareB.hourlyValue), numA: compareA.hourlyValue, numB: compareB.hourlyValue },
          { label: 'Daily Value', valueA: formatCurrency(compareA.dailyValue), valueB: formatCurrency(compareB.dailyValue), numA: compareA.dailyValue, numB: compareB.dailyValue }
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
