'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { dev: number; del: number; mat: number; directCost: number; lostProductivity: number; totalCost: number; costPerEmp: number; costPerHour: number; label: string; }

export default function TrainingCostCalculator() {
  const [developmentCost, setDevelopmentCost] = useState('');
  const [deliveryCost, setDeliveryCost] = useState('');
  const [materialsCost, setMaterialsCost] = useState('');
  const [numEmployees, setNumEmployees] = useState('');
  const [trainingHours, setTrainingHours] = useState('');
  const [avgSalary, setAvgSalary] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ developmentCost: string; deliveryCost: string; materialsCost: string; numEmployees: string; trainingHours: string; avgSalary: string }>('training-cost-calculator');

  const dev = parseFloat(developmentCost) || 0;
  const del = parseFloat(deliveryCost) || 0;
  const mat = parseFloat(materialsCost) || 0;
  const emps = parseFloat(numEmployees) || 0;
  const hrs = parseFloat(trainingHours) || 0;
  const rate = parseFloat(avgSalary) || 0;
  const directCost = dev + del + mat;
  const lostProductivity = emps * hrs * rate;
  const totalCost = directCost + lostProductivity;
  const costPerEmp = emps > 0 ? totalCost / emps : 0;
  const costPerHour = emps > 0 && hrs > 0 ? totalCost / (emps * hrs) : 0;

  const handleTryExample = () => { setDevelopmentCost('15000'); setDeliveryCost('8000'); setMaterialsCost('3000'); setNumEmployees('50'); setTrainingHours('8'); setAvgSalary('30'); setCalculated(false); };
  const handleCalculate = () => {
    if (totalCost > 0) {
      setCalculated(true);
      saveEntry({ developmentCost, deliveryCost, materialsCost, numEmployees, trainingHours, avgSalary }, `Training cost: ${formatCurrency(totalCost)} (${formatCurrency(costPerEmp)}/emp)`);
    }
  };
  const handleReset = () => { setDevelopmentCost(''); setDeliveryCost(''); setMaterialsCost(''); setNumEmployees(''); setTrainingHours(''); setAvgSalary(''); setCalculated(false); };
  const handleRestore = (i: { developmentCost: string; deliveryCost: string; materialsCost: string; numEmployees: string; trainingHours: string; avgSalary: string }) => { setDevelopmentCost(i.developmentCost); setDeliveryCost(i.deliveryCost); setMaterialsCost(i.materialsCost); setNumEmployees(i.numEmployees); setTrainingHours(i.trainingHours); setAvgSalary(i.avgSalary); setCalculated(true); };
  const snap = (): Snapshot => ({ dev, del, mat, directCost, lostProductivity, totalCost, costPerEmp, costPerHour, label: `Total: ${formatCurrency(totalCost)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <GraduationCap className="inline h-3 w-3 mr-1" />
          {`Calculate total training cost (development, delivery, materials, lost productivity) and cost per employee per hour.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="developmentCost">Content Development</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="developmentCost" type="number" step="any" min="0" placeholder="15000" className="pl-7"
                value={developmentCost} onChange={(e) => { setDevelopmentCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryCost">Delivery (instructor, facility)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="deliveryCost" type="number" step="any" min="0" placeholder="8000" className="pl-7"
                value={deliveryCost} onChange={(e) => { setDeliveryCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="materialsCost">Materials & Technology</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="materialsCost" type="number" step="any" min="0" placeholder="3000" className="pl-7"
                value={materialsCost} onChange={(e) => { setMaterialsCost(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="numEmployees">Number of Employees Trained</Label>
            <div className="relative">
              
              <Input id="numEmployees" type="number" step="any" min="0" placeholder="50"
                value={numEmployees} onChange={(e) => { setNumEmployees(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trainingHours">Training Hours per Employee</Label>
            <div className="relative">
              
              <Input id="trainingHours" type="number" step="any" min="0" placeholder="8"
                value={trainingHours} onChange={(e) => { setTrainingHours(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgSalary">Average Hourly Rate ($/hr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="avgSalary" type="number" step="any" min="0" placeholder="30" className="pl-7"
                value={avgSalary} onChange={(e) => { setAvgSalary(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={totalCost <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Training Cost
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Training Cost</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalCost)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Cost per employee: ${formatCurrency(costPerEmp)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Cost per training hour: ${formatCurrency(costPerHour)}`}</Badge>
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{'Benchmark: $1,000-$2,000/emp/yr'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Direct Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(directCost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Lost Productivity</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(lostProductivity)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalCost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Per Employee</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(costPerEmp)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Total training cost = direct cost (development + delivery + materials) + lost productivity (employees' salary during training hours). Industry benchmark: $1,000-$2,000/employee/year. Training Magazine reports average $1,286/learner. For training ROI, compare productivity gains to total cost.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Direct Cost', valueA: formatCurrency(compareA.directCost), valueB: formatCurrency(compareB.directCost), numA: compareA.directCost, numB: compareB.directCost },
          { label: 'Lost Productivity', valueA: formatCurrency(compareA.lostProductivity), valueB: formatCurrency(compareB.lostProductivity), numA: compareA.lostProductivity, numB: compareB.lostProductivity },
          { label: 'Total Cost', valueA: formatCurrency(compareA.totalCost), valueB: formatCurrency(compareB.totalCost), numA: compareA.totalCost, numB: compareB.totalCost },
          { label: 'Per Employee', valueA: formatCurrency(compareA.costPerEmp), valueB: formatCurrency(compareB.costPerEmp), numA: compareA.costPerEmp, numB: compareB.costPerEmp }
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
