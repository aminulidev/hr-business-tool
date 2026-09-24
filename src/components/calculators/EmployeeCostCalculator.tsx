'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { salary: number; benefits: number; payrollTaxes: number; totalCost: number; loadedMultiplier: number; hourlyCost: number; label: string; }

export default function EmployeeCostCalculator() {
  const [annualSalary, setAnnualSalary] = useState('');
  const [benefitsPct, setBenefitsPct] = useState('Health, 401k, PTO');
  const [payrollTaxesPct, setPayrollTaxesPct] = useState('FICA + FUTA + SUTA');
  const [workersComp, setWorkersComp] = useState('');
  const [equipment, setEquipment] = useState('');
  const [overhead, setOverhead] = useState('Rent, utilities, admin');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ annualSalary: string; benefitsPct: string; payrollTaxesPct: string; workersComp: string; equipment: string; overhead: string }>('employee-cost-calculator');

  const salary = parseFloat(annualSalary) || 0;
  const benPct = parseFloat(benefitsPct) || 0;
  const taxPct = parseFloat(payrollTaxesPct) || 0;
  const wc = parseFloat(workersComp) || 0;
  const equip = parseFloat(equipment) || 0;
  const oh = parseFloat(overhead) || 0;
  const benefits = salary * (benPct / 100);
  const payrollTaxes = salary * (taxPct / 100);
  const totalCost = salary + benefits + payrollTaxes + wc + equip + oh;
  const loadedMultiplier = salary > 0 ? totalCost / salary : 0;
  const hourlyCost = totalCost / 2080;

  const handleTryExample = () => { setAnnualSalary('75000'); setBenefitsPct('30'); setPayrollTaxesPct('9'); setWorkersComp('1200'); setEquipment('3500'); setOverhead('5000'); setCalculated(false); };
  const handleCalculate = () => {
    if (salary > 0) {
      setCalculated(true);
      saveEntry({ annualSalary, benefitsPct, payrollTaxesPct, workersComp, equipment, overhead }, `Cost/employee: ${formatCurrency(totalCost)} (${loadedMultiplier.toFixed(2)}x salary)`);
    }
  };
  const handleReset = () => { setAnnualSalary(''); setBenefitsPct('30'); setPayrollTaxesPct('9'); setWorkersComp(''); setEquipment(''); setOverhead(''); setCalculated(false); };
  const handleRestore = (i: { annualSalary: string; benefitsPct: string; payrollTaxesPct: string; workersComp: string; equipment: string; overhead: string }) => { setAnnualSalary(i.annualSalary); setBenefitsPct(i.benefitsPct); setPayrollTaxesPct(i.payrollTaxesPct); setWorkersComp(i.workersComp); setEquipment(i.equipment); setOverhead(i.overhead); setCalculated(true); };
  const snap = (): Snapshot => ({ salary, benefits, payrollTaxes, totalCost, loadedMultiplier, hourlyCost, label: `Total: ${formatCurrency(totalCost)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Calculate the true cost per employee: wages + benefits + payroll taxes + workers comp + equipment + overhead. Loaded cost = 1.25-1.40x salary.`}
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
            <Label htmlFor="benefitsPct">Benefits (% of salary)</Label>
            <div className="relative">
              
              <Input id="benefitsPct" type="number" step="any" min="0" placeholder="30"
                value={benefitsPct} onChange={(e) => { setBenefitsPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Health, 401k, PTO</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payrollTaxesPct">Payroll Taxes (%)</Label>
            <div className="relative">
              
              <Input id="payrollTaxesPct" type="number" step="any" min="0" placeholder="9"
                value={payrollTaxesPct} onChange={(e) => { setPayrollTaxesPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">FICA + FUTA + SUTA</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workersComp">Workers Comp ($/yr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="workersComp" type="number" step="any" min="0" placeholder="1200" className="pl-7"
                value={workersComp} onChange={(e) => { setWorkersComp(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment & Software ($/yr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="equipment" type="number" step="any" min="0" placeholder="3500" className="pl-7"
                value={equipment} onChange={(e) => { setEquipment(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="overhead">Overhead Allocation ($/yr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="overhead" type="number" step="any" min="0" placeholder="5000" className="pl-7"
                value={overhead} onChange={(e) => { setOverhead(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Rent, utilities, admin</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={salary <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Employee Cost
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Cost per Employee</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalCost)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Loaded ${loadedMultiplier.toFixed(2)}x salary`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Hourly cost: ${formatCurrency(hourlyCost)}`}</Badge>
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{'Typical: 1.25-1.40x salary'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Salary</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(salary)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Benefits</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(benefits)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Taxes + WC</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(payrollTaxes + wc)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalCost)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`True cost per employee = salary + benefits (30%) + payroll taxes (9%) + workers comp + equipment + overhead. Loaded multiplier 1.25-1.40x is typical. Use this for pricing (charge rate must exceed loaded cost) and headcount planning. See our Labor Cost Calculator for total workforce cost.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Salary', valueA: formatCurrency(compareA.salary), valueB: formatCurrency(compareB.salary), numA: compareA.salary, numB: compareB.salary },
          { label: 'Benefits', valueA: formatCurrency(compareA.benefits), valueB: formatCurrency(compareB.benefits), numA: compareA.benefits, numB: compareB.benefits },
          { label: 'Total Cost', valueA: formatCurrency(compareA.totalCost), valueB: formatCurrency(compareB.totalCost), numA: compareA.totalCost, numB: compareB.totalCost },
          { label: 'Loaded Mult', valueA: `${compareA.loadedMultiplier.toFixed(2)}x`, valueB: `${compareB.loadedMultiplier.toFixed(2)}x`, numA: compareA.loadedMultiplier, numB: compareB.loadedMultiplier }
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
