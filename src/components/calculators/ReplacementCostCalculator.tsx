'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { salary: number; recruiting: number; onboarding: number; training: number; vacancyCost: number; totalCost: number; pctSalary: number; label: string; }

export default function ReplacementCostCalculator() {
  const [annualSalary, setAnnualSalary] = useState('');
  const [recruitingPct, setRecruitingPct] = useState('Job ads, agency, HR time');
  const [onboardingPct, setOnboardingPct] = useState('Orientation, setup');
  const [trainingPct, setTrainingPct] = useState('Time to full productivity');
  const [vacancyWeeks, setVacancyWeeks] = useState('');
  const [coverageOvertime, setCoverageOvertime] = useState('OT for remaining team');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ annualSalary: string; recruitingPct: string; onboardingPct: string; trainingPct: string; vacancyWeeks: string; coverageOvertime: string }>('replacement-cost-calculator');

  const salary = parseFloat(annualSalary) || 0;
  const recPct = parseFloat(recruitingPct) || 0;
  const onbPct = parseFloat(onboardingPct) || 0;
  const trnPct = parseFloat(trainingPct) || 0;
  const weeks = parseFloat(vacancyWeeks) || 0;
  const ot = parseFloat(coverageOvertime) || 0;
  const recruiting = salary * (recPct / 100);
  const onboarding = salary * (onbPct / 100);
  const training = salary * (trnPct / 100);
  const vacancyCost = salary * (weeks / 52);
  const totalCost = recruiting + onboarding + training + vacancyCost + ot;
  const pctSalary = salary > 0 ? (totalCost / salary) * 100 : 0;

  const handleTryExample = () => { setAnnualSalary('75000'); setRecruitingPct('20'); setOnboardingPct('10'); setTrainingPct('30'); setVacancyWeeks('6'); setCoverageOvertime('8000'); setCalculated(false); };
  const handleCalculate = () => {
    if (salary > 0) {
      setCalculated(true);
      saveEntry({ annualSalary, recruitingPct, onboardingPct, trainingPct, vacancyWeeks, coverageOvertime }, `Replacement cost: ${formatCurrency(totalCost)} (${pctSalary.toFixed(0)}% of salary)`);
    }
  };
  const handleReset = () => { setAnnualSalary(''); setRecruitingPct('20'); setOnboardingPct('10'); setTrainingPct('30'); setVacancyWeeks('6'); setCoverageOvertime(''); setCalculated(false); };
  const handleRestore = (i: { annualSalary: string; recruitingPct: string; onboardingPct: string; trainingPct: string; vacancyWeeks: string; coverageOvertime: string }) => { setAnnualSalary(i.annualSalary); setRecruitingPct(i.recruitingPct); setOnboardingPct(i.onboardingPct); setTrainingPct(i.trainingPct); setVacancyWeeks(i.vacancyWeeks); setCoverageOvertime(i.coverageOvertime); setCalculated(true); };
  const snap = (): Snapshot => ({ salary, recruiting, onboarding, training, vacancyCost, totalCost, pctSalary, label: `Total: ${formatCurrency(totalCost)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <RefreshCw className="inline h-3 w-3 mr-1" />
          {`Calculate total cost to replace a departing employee: recruitment, onboarding, training, ramp-up productivity loss, and overtime.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annualSalary">Annual Salary</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="annualSalary" type="number" step="any" min="0" placeholder="75000" className="pl-7"
                value={annualSalary} onChange={(e) => { setAnnualSalary(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recruitingPct">Recruiting (% of salary)</Label>
            <div className="relative">
              
              <Input id="recruitingPct" type="number" step="any" min="0" placeholder="20"
                value={recruitingPct} onChange={(e) => { setRecruitingPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Job ads, agency, HR time</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="onboardingPct">Onboarding (% of salary)</Label>
            <div className="relative">
              
              <Input id="onboardingPct" type="number" step="any" min="0" placeholder="10"
                value={onboardingPct} onChange={(e) => { setOnboardingPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Orientation, setup</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trainingPct">Training/Ramp-up (% of salary)</Label>
            <div className="relative">
              
              <Input id="trainingPct" type="number" step="any" min="0" placeholder="30"
                value={trainingPct} onChange={(e) => { setTrainingPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Time to full productivity</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vacancyWeeks">Vacancy Duration (weeks)</Label>
            <div className="relative">
              
              <Input id="vacancyWeeks" type="number" step="any" min="0" placeholder="6"
                value={vacancyWeeks} onChange={(e) => { setVacancyWeeks(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverageOvertime">Coverage Overtime ($)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="coverageOvertime" type="number" step="any" min="0" placeholder="8000" className="pl-7"
                value={coverageOvertime} onChange={(e) => { setCoverageOvertime(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">OT for remaining team</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={salary <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Replacement Cost
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Replacement Cost</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalCost)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`${pctSalary.toFixed(0)}% of annual salary`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Vacancy cost: ${formatCurrency(vacancyCost)}`}</Badge>
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{'Typical: 50-200% of salary'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Recruiting</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(recruiting)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Onboarding+Training</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(onboarding + training)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Vacancy Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(vacancyCost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalCost)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Replacement cost = recruiting + onboarding + training + vacancy cost + coverage overtime. Ranges from 50% (entry-level) to 200% (executive/specialized). Vacancy cost = salary × (weeks vacant / 52). Reduce cost by improving retention and building internal talent pipeline. See our Cost of Turnover Calculator for company-wide impact.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Recruiting', valueA: formatCurrency(compareA.recruiting), valueB: formatCurrency(compareB.recruiting), numA: compareA.recruiting, numB: compareB.recruiting },
          { label: 'Vacancy Cost', valueA: formatCurrency(compareA.vacancyCost), valueB: formatCurrency(compareB.vacancyCost), numA: compareA.vacancyCost, numB: compareB.vacancyCost },
          { label: 'Total Cost', valueA: formatCurrency(compareA.totalCost), valueB: formatCurrency(compareB.totalCost), numA: compareA.totalCost, numB: compareB.totalCost },
          { label: '% of Salary', valueA: `${compareA.pctSalary.toFixed(0)}%`, valueB: `${compareB.pctSalary.toFixed(0)}%`, numA: compareA.pctSalary, numB: compareB.pctSalary }
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
