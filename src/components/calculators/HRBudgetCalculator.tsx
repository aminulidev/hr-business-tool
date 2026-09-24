'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { recr: number; train: number; ben: number; staff: number; tech: number; totalBudget: number; hrPctRev: number; costPerEmp: number; label: string; }

export default function HRBudgetCalculator() {
  const [recruitingCost, setRecruitingCost] = useState('');
  const [trainingCost, setTrainingCost] = useState('');
  const [benefitsCost, setBenefitsCost] = useState('');
  const [hrStaffCost, setHrStaffCost] = useState('');
  const [hrTechnology, setHrTechnology] = useState('');
  const [totalRevenue, setTotalRevenue] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ recruitingCost: string; trainingCost: string; benefitsCost: string; hrStaffCost: string; hrTechnology: string; totalRevenue: string }>('hr-budget-calculator');

  const recr = parseFloat(recruitingCost) || 0;
  const train = parseFloat(trainingCost) || 0;
  const ben = parseFloat(benefitsCost) || 0;
  const staff = parseFloat(hrStaffCost) || 0;
  const tech = parseFloat(hrTechnology) || 0;
  const rev = parseFloat(totalRevenue) || 0;
  const totalBudget = recr + train + ben + staff + tech;
  const hrPctRev = rev > 0 ? (totalBudget / rev) * 100 : 0;
  const employeeCount = 350;
  const costPerEmp = employeeCount > 0 ? totalBudget / employeeCount : 0;

  const handleTryExample = () => { setRecruitingCost('50000'); setTrainingCost('75000'); setBenefitsCost('30000'); setHrStaffCost('400000'); setHrTechnology('25000'); setTotalRevenue('10000000'); setCalculated(false); };
  const handleCalculate = () => {
    if (totalBudget > 0) {
      setCalculated(true);
      saveEntry({ recruitingCost, trainingCost, benefitsCost, hrStaffCost, hrTechnology, totalRevenue }, `HR budget: ${formatCurrency(totalBudget)} (${hrPctRev.toFixed(2)}% of revenue)`);
    }
  };
  const handleReset = () => { setRecruitingCost(''); setTrainingCost(''); setBenefitsCost(''); setHrStaffCost(''); setHrTechnology(''); setTotalRevenue(''); setCalculated(false); };
  const handleRestore = (i: { recruitingCost: string; trainingCost: string; benefitsCost: string; hrStaffCost: string; hrTechnology: string; totalRevenue: string }) => { setRecruitingCost(i.recruitingCost); setTrainingCost(i.trainingCost); setBenefitsCost(i.benefitsCost); setHrStaffCost(i.hrStaffCost); setHrTechnology(i.hrTechnology); setTotalRevenue(i.totalRevenue); setCalculated(true); };
  const snap = (): Snapshot => ({ recr, train, ben, staff, tech, totalBudget, hrPctRev, costPerEmp, label: `HR budget: ${formatCurrency(totalBudget)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Wallet className="inline h-3 w-3 mr-1" />
          {`Plan HR department spend across recruiting, training, benefits, payroll, technology, and HR staff. See HR budget as % of revenue.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recruitingCost">Recruiting Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="recruitingCost" type="number" step="any" min="0" placeholder="50000" className="pl-7"
                value={recruitingCost} onChange={(e) => { setRecruitingCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trainingCost">Training & Development</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="trainingCost" type="number" step="any" min="0" placeholder="75000" className="pl-7"
                value={trainingCost} onChange={(e) => { setTrainingCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="benefitsCost">Benefits Administration</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="benefitsCost" type="number" step="any" min="0" placeholder="30000" className="pl-7"
                value={benefitsCost} onChange={(e) => { setBenefitsCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hrStaffCost">HR Staff Salaries</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="hrStaffCost" type="number" step="any" min="0" placeholder="400000" className="pl-7"
                value={hrStaffCost} onChange={(e) => { setHrStaffCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hrTechnology">HR Technology (HRIS, etc.)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="hrTechnology" type="number" step="any" min="0" placeholder="25000" className="pl-7"
                value={hrTechnology} onChange={(e) => { setHrTechnology(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalRevenue">Total Revenue (for ratio)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalRevenue" type="number" step="any" min="0" placeholder="10000000" className="pl-7"
                value={totalRevenue} onChange={(e) => { setTotalRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={totalBudget <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate HR Budget
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total HR Budget</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalBudget)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`HR as % of revenue: ${hrPctRev.toFixed(2)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Cost per employee: ${formatCurrency(costPerEmp)}`}</Badge>
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{'Benchmark: 1-2.5% of revenue'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Recruiting</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(recr)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Training</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(train)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">HR Staff</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(staff)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total HR</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalBudget)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`HR budget as % of revenue: 1% (small companies), 1.5-2% (mid-size), 2-2.5% (large enterprises). Cost per employee: $500-$2,000 typical. SHRM benchmarks: recruiting 15-20% of HR budget, training 10-15%, benefits admin 5-10%, HR staff 50-60%, technology 5-10%.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Recruiting', valueA: formatCurrency(compareA.recr), valueB: formatCurrency(compareB.recr), numA: compareA.recr, numB: compareB.recr },
          { label: 'Training', valueA: formatCurrency(compareA.train), valueB: formatCurrency(compareB.train), numA: compareA.train, numB: compareB.train },
          { label: 'Total Budget', valueA: formatCurrency(compareA.totalBudget), valueB: formatCurrency(compareB.totalBudget), numA: compareA.totalBudget, numB: compareB.totalBudget },
          { label: 'HR % Rev', valueA: `${compareA.hrPctRev.toFixed(2)}%`, valueB: `${compareB.hrPctRev.toFixed(2)}%`, numA: compareA.hrPctRev, numB: compareB.hrPctRev }
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
