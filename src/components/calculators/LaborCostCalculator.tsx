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

interface Snapshot { wages: number; benefits: number; payrollTaxes: number; totalLaborCost: number; laborPctRev: number; loadedMultiplier: number; label: string; }

export default function LaborCostCalculator() {
  const [totalWages, setTotalWages] = useState('');
  const [benefitsPct, setBenefitsPct] = useState('Health, 401k, PTO');
  const [payrollTaxesPct, setPayrollTaxesPct] = useState('FICA 7.65% + FUTA + SUTA');
  const [workersComp, setWorkersComp] = useState('');
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ totalWages: string; benefitsPct: string; payrollTaxesPct: string; workersComp: string; annualRevenue: string }>('labor-cost-calculator');

  const wages = parseFloat(totalWages) || 0;
  const benPct = parseFloat(benefitsPct) || 0;
  const taxPct = parseFloat(payrollTaxesPct) || 0;
  const wc = parseFloat(workersComp) || 0;
  const rev = parseFloat(annualRevenue) || 0;
  const benefits = wages * (benPct / 100);
  const payrollTaxes = wages * (taxPct / 100);
  const totalLaborCost = wages + benefits + payrollTaxes + wc;
  const laborPctRev = rev > 0 ? (totalLaborCost / rev) * 100 : 0;
  const loadedMultiplier = wages > 0 ? totalLaborCost / wages : 0;

  const handleTryExample = () => { setTotalWages('2500000'); setBenefitsPct('30'); setPayrollTaxesPct('9'); setWorkersComp('25000'); setAnnualRevenue('5000000'); setCalculated(false); };
  const handleCalculate = () => {
    if (wages > 0) {
      setCalculated(true);
      saveEntry({ totalWages, benefitsPct, payrollTaxesPct, workersComp, annualRevenue }, `Total labor cost: ${formatCurrency(totalLaborCost)} (${laborPctRev.toFixed(1)}% of revenue)`);
    }
  };
  const handleReset = () => { setTotalWages(''); setBenefitsPct('30'); setPayrollTaxesPct('9'); setWorkersComp(''); setAnnualRevenue(''); setCalculated(false); };
  const handleRestore = (i: { totalWages: string; benefitsPct: string; payrollTaxesPct: string; workersComp: string; annualRevenue: string }) => { setTotalWages(i.totalWages); setBenefitsPct(i.benefitsPct); setPayrollTaxesPct(i.payrollTaxesPct); setWorkersComp(i.workersComp); setAnnualRevenue(i.annualRevenue); setCalculated(true); };
  const snap = (): Snapshot => ({ wages, benefits, payrollTaxes, totalLaborCost, laborPctRev, loadedMultiplier, label: `Total: ${formatCurrency(totalLaborCost)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Wallet className="inline h-3 w-3 mr-1" />
          {`Total labor cost = wages + benefits + payroll taxes + workers comp. Compare as % of revenue to industry benchmark.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalWages">Total Annual Wages</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="totalWages" type="number" step="any" min="0" placeholder="2500000" className="pl-7"
                value={totalWages} onChange={(e) => { setTotalWages(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="benefitsPct">Benefits (% of wages)</Label>
            <div className="relative">
              
              <Input id="benefitsPct" type="number" step="any" min="0" placeholder="30"
                value={benefitsPct} onChange={(e) => { setBenefitsPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Health, 401k, PTO</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payrollTaxesPct">Employer Payroll Taxes (%)</Label>
            <div className="relative">
              
              <Input id="payrollTaxesPct" type="number" step="any" min="0" placeholder="9"
                value={payrollTaxesPct} onChange={(e) => { setPayrollTaxesPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">FICA 7.65% + FUTA + SUTA</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workersComp">Workers Comp Premium</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="workersComp" type="number" step="any" min="0" placeholder="25000" className="pl-7"
                value={workersComp} onChange={(e) => { setWorkersComp(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="annualRevenue">Annual Revenue (for ratio)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="annualRevenue" type="number" step="any" min="0" placeholder="5000000" className="pl-7"
                value={annualRevenue} onChange={(e) => { setAnnualRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={wages <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Labor Cost
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Labor Cost</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalLaborCost)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Labor as % of revenue: ${laborPctRev.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Loaded ${loadedMultiplier.toFixed(2)}x wages`}</Badge>
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{'Benchmark: 20-50% of revenue'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Wages</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(wages)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Benefits</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(benefits)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Payroll Taxes</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(payrollTaxes)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Labor</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalLaborCost)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Labor cost as % of revenue varies by industry: restaurants 30-35%, retail 20%, services 50%, manufacturing 25%, tech 15%. Loaded cost (wages × multiplier) typically 1.25-1.40x base. For per-employee cost breakdown, see our Employee Cost Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Wages', valueA: formatCurrency(compareA.wages), valueB: formatCurrency(compareB.wages), numA: compareA.wages, numB: compareB.wages },
          { label: 'Total Labor', valueA: formatCurrency(compareA.totalLaborCost), valueB: formatCurrency(compareB.totalLaborCost), numA: compareA.totalLaborCost, numB: compareB.totalLaborCost },
          { label: 'Labor % Rev', valueA: `${compareA.laborPctRev.toFixed(1)}%`, valueB: `${compareB.laborPctRev.toFixed(1)}%`, numA: compareA.laborPctRev, numB: compareB.laborPctRev },
          { label: 'Loaded Multiplier', valueA: `${compareA.loadedMultiplier.toFixed(2)}x`, valueB: `${compareB.loadedMultiplier.toFixed(2)}x`, numA: compareA.loadedMultiplier, numB: compareB.loadedMultiplier }
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
