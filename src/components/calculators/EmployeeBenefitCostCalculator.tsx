'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { salary: number; health: number; retirement: number; ptoValue: number; lifeDis: number; other: number; totalBenefits: number; benefitsPct: number; loadedCost: number; label: string; }

export default function EmployeeBenefitCostCalculator() {
  const [annualSalary, setAnnualSalary] = useState('');
  const [healthInsurance, setHealthInsurance] = useState('Employer-paid premium');
  const [retirementMatch, setRetirementMatch] = useState('Typical 3-6%');
  const [ptoDays, setPtoDays] = useState('');
  const [lifeDisability, setLifeDisability] = useState('');
  const [otherBenefits, setOtherBenefits] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ annualSalary: string; healthInsurance: string; retirementMatch: string; ptoDays: string; lifeDisability: string; otherBenefits: string }>('employee-benefit-cost-calculator');

  const salary = parseFloat(annualSalary) || 0;
  const health = parseFloat(healthInsurance) || 0;
  const matchPct = parseFloat(retirementMatch) || 0;
  const pto = parseFloat(ptoDays) || 0;
  const lifeDis = parseFloat(lifeDisability) || 0;
  const other = parseFloat(otherBenefits) || 0;
  const retirement = salary * (matchPct / 100);
  const ptoValue = salary / 260 * pto;
  const totalBenefits = health + retirement + ptoValue + lifeDis + other;
  const benefitsPct = salary > 0 ? (totalBenefits / salary) * 100 : 0;
  const loadedCost = salary + totalBenefits;

  const handleTryExample = () => { setAnnualSalary('75000'); setHealthInsurance('12000'); setRetirementMatch('5'); setPtoDays('15'); setLifeDisability('600'); setOtherBenefits('1500'); setCalculated(false); };
  const handleCalculate = () => {
    if (salary > 0) {
      setCalculated(true);
      saveEntry({ annualSalary, healthInsurance, retirementMatch, ptoDays, lifeDisability, otherBenefits }, `Benefits: ${formatCurrency(totalBenefits)} (${benefitsPct.toFixed(1)}% of salary)`);
    }
  };
  const handleReset = () => { setAnnualSalary(''); setHealthInsurance(''); setRetirementMatch('5'); setPtoDays('15'); setLifeDisability(''); setOtherBenefits(''); setCalculated(false); };
  const handleRestore = (i: { annualSalary: string; healthInsurance: string; retirementMatch: string; ptoDays: string; lifeDisability: string; otherBenefits: string }) => { setAnnualSalary(i.annualSalary); setHealthInsurance(i.healthInsurance); setRetirementMatch(i.retirementMatch); setPtoDays(i.ptoDays); setLifeDisability(i.lifeDisability); setOtherBenefits(i.otherBenefits); setCalculated(true); };
  const snap = (): Snapshot => ({ salary, health, retirement, ptoValue, lifeDis, other, totalBenefits, benefitsPct, loadedCost, label: `Benefits: ${formatCurrency(totalBenefits)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <HeartPulse className="inline h-3 w-3 mr-1" />
          {`Calculate total employee benefit cost per employee: health, 401(k), PTO, life/disability, FSA/HSA. BLS: 30-32% of wages.`}
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
            <Label htmlFor="healthInsurance">Health Insurance ($/yr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="healthInsurance" type="number" step="any" min="0" placeholder="12000" className="pl-7"
                value={healthInsurance} onChange={(e) => { setHealthInsurance(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Employer-paid premium</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="retirementMatch">401(k) Match (% of salary)</Label>
            <div className="relative">
              
              <Input id="retirementMatch" type="number" step="any" min="0" placeholder="5"
                value={retirementMatch} onChange={(e) => { setRetirementMatch(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Typical 3-6%</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ptoDays">PTO Days per Year</Label>
            <div className="relative">
              
              <Input id="ptoDays" type="number" step="any" min="0" placeholder="15"
                value={ptoDays} onChange={(e) => { setPtoDays(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lifeDisability">Life + Disability Insurance ($/yr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="lifeDisability" type="number" step="any" min="0" placeholder="600" className="pl-7"
                value={lifeDisability} onChange={(e) => { setLifeDisability(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="otherBenefits">Other Benefits (FSA, HSA, etc.) ($/yr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="otherBenefits" type="number" step="any" min="0" placeholder="1500" className="pl-7"
                value={otherBenefits} onChange={(e) => { setOtherBenefits(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={salary <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Benefit Cost
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Benefit Cost per Employee</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalBenefits)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Benefits as % of salary: ${benefitsPct.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Loaded cost: ${formatCurrency(loadedCost)}`}</Badge>
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{'BLS benchmark: 30-32%'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Health Insurance</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(health)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Retirement</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(retirement)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">PTO Value</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(ptoValue)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Benefits</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalBenefits)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`BLS data: benefits average 30-32% of wages. Breakdown: health insurance 8-10%, retirement 3-6%, PTO 6-8% (15 days), life/disability 0.5-1%, other 1-2%. Loaded cost = salary + benefits. Use for total compensation statements and headcount budgeting. See our Employee Cost Calculator for full loaded cost including taxes.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Health', valueA: formatCurrency(compareA.health), valueB: formatCurrency(compareB.health), numA: compareA.health, numB: compareB.health },
          { label: 'Retirement', valueA: formatCurrency(compareA.retirement), valueB: formatCurrency(compareB.retirement), numA: compareA.retirement, numB: compareB.retirement },
          { label: 'Total Benefits', valueA: formatCurrency(compareA.totalBenefits), valueB: formatCurrency(compareB.totalBenefits), numA: compareA.totalBenefits, numB: compareB.totalBenefits },
          { label: '% of Salary', valueA: `${compareA.benefitsPct.toFixed(1)}%`, valueB: `${compareB.benefitsPct.toFixed(1)}%`, numA: compareA.benefitsPct, numB: compareB.benefitsPct }
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
