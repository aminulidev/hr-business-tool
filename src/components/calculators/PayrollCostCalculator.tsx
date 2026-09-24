'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { wages: number; ficaCost: number; futaCost: number; sutaCost: number; totalTaxes: number; totalCost: number; loadedMultiplier: number; label: string; }

export default function PayrollCostCalculator() {
  const [grossWages, setGrossWages] = useState('');
  const [ficaPct, setFicaPct] = useState('SS 6.2% + Medicare 1.45%');
  const [futaPct, setFutaPct] = useState('Federal unemployment');
  const [sutaPct, setSutaPct] = useState('State unemployment');
  const [workersComp, setWorkersComp] = useState('');
  const [payrollFees, setPayrollFees] = useState('ADP, Gusto, etc.');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ grossWages: string; ficaPct: string; futaPct: string; sutaPct: string; workersComp: string; payrollFees: string }>('payroll-cost-calculator');

  const wages = parseFloat(grossWages) || 0;
  const fica = parseFloat(ficaPct) || 0;
  const futa = parseFloat(futaPct) || 0;
  const suta = parseFloat(sutaPct) || 0;
  const wc = parseFloat(workersComp) || 0;
  const fees = parseFloat(payrollFees) || 0;
  const ficaCost = wages * (fica / 100);
  const futaCost = wages * (futa / 100);
  const sutaCost = wages * (suta / 100);
  const totalTaxes = ficaCost + futaCost + sutaCost;
  const totalCost = wages + totalTaxes + wc + fees;
  const loadedMultiplier = wages > 0 ? totalCost / wages : 0;

  const handleTryExample = () => { setGrossWages('2000000'); setFicaPct('7.65'); setFutaPct('0.6'); setSutaPct('3.5'); setWorkersComp('20000'); setPayrollFees('12000'); setCalculated(false); };
  const handleCalculate = () => {
    if (wages > 0) {
      setCalculated(true);
      saveEntry({ grossWages, ficaPct, futaPct, sutaPct, workersComp, payrollFees }, `Payroll cost: ${formatCurrency(totalCost)} (${loadedMultiplier.toFixed(3)}x wages)`);
    }
  };
  const handleReset = () => { setGrossWages(''); setFicaPct('7.65'); setFutaPct('0.6'); setSutaPct('3.5'); setWorkersComp(''); setPayrollFees(''); setCalculated(false); };
  const handleRestore = (i: { grossWages: string; ficaPct: string; futaPct: string; sutaPct: string; workersComp: string; payrollFees: string }) => { setGrossWages(i.grossWages); setFicaPct(i.ficaPct); setFutaPct(i.futaPct); setSutaPct(i.sutaPct); setWorkersComp(i.workersComp); setPayrollFees(i.payrollFees); setCalculated(true); };
  const snap = (): Snapshot => ({ wages, ficaCost, futaCost, sutaCost, totalTaxes, totalCost, loadedMultiplier, label: `Total: ${formatCurrency(totalCost)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <CreditCard className="inline h-3 w-3 mr-1" />
          {`Calculate total payroll cost: gross wages + employer FICA (7.65%) + FUTA (0.6%) + SUTA (1-5%) + workers comp + admin fees.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="grossWages">Gross Wages</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="grossWages" type="number" step="any" min="0" placeholder="2000000" className="pl-7"
                value={grossWages} onChange={(e) => { setGrossWages(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ficaPct">Employer FICA (%)</Label>
            <div className="relative">
              
              <Input id="ficaPct" type="number" step="any" min="0" placeholder="7.65"
                value={ficaPct} onChange={(e) => { setFicaPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">SS 6.2% + Medicare 1.45%</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="futaPct">FUTA (%)</Label>
            <div className="relative">
              
              <Input id="futaPct" type="number" step="any" min="0" placeholder="0.6"
                value={futaPct} onChange={(e) => { setFutaPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Federal unemployment</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sutaPct">SUTA (%)</Label>
            <div className="relative">
              
              <Input id="sutaPct" type="number" step="any" min="0" placeholder="3.5"
                value={sutaPct} onChange={(e) => { setSutaPct(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">State unemployment</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workersComp">Workers Comp Premium</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="workersComp" type="number" step="any" min="0" placeholder="20000" className="pl-7"
                value={workersComp} onChange={(e) => { setWorkersComp(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payrollFees">Payroll Service Fees</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="payrollFees" type="number" step="any" min="0" placeholder="12000" className="pl-7"
                value={payrollFees} onChange={(e) => { setPayrollFees(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">ADP, Gusto, etc.</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={wages <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Payroll Cost
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Payroll Cost</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalCost)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Employer taxes: ${formatCurrency(totalTaxes)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Loaded ${loadedMultiplier.toFixed(3)}x wages`}</Badge>
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{'Employer burden: 1.08-1.15x'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Gross Wages</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(wages)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Employer Taxes</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalTaxes)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">WC + Fees</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(wc + fees)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalCost)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Total payroll cost = gross wages + employer taxes (FICA 7.65% + FUTA 0.6% + SUTA 1-5%) + workers comp + payroll service fees. Loaded multiplier: 1.08-1.15x wages (employer burden). SUTA varies by state and experience rating. For per-employee cost including benefits, see our Employee Cost Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Gross Wages', valueA: formatCurrency(compareA.wages), valueB: formatCurrency(compareB.wages), numA: compareA.wages, numB: compareB.wages },
          { label: 'Employer Taxes', valueA: formatCurrency(compareA.totalTaxes), valueB: formatCurrency(compareB.totalTaxes), numA: compareA.totalTaxes, numB: compareB.totalTaxes },
          { label: 'Total Cost', valueA: formatCurrency(compareA.totalCost), valueB: formatCurrency(compareB.totalCost), numA: compareA.totalCost, numB: compareB.totalCost },
          { label: 'Loaded Mult', valueA: `${compareA.loadedMultiplier.toFixed(3)}x`, valueB: `${compareB.loadedMultiplier.toFixed(3)}x`, numA: compareA.loadedMultiplier, numB: compareB.loadedMultiplier }
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
