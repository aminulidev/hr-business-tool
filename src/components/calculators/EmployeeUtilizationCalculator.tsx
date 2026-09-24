'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { prod: number; avail: number; train: number; admin: number; utilization: number; nonProductive: number; nonProdPct: number; idleTime: number; idlePct: number; label: string; }

export default function EmployeeUtilizationCalculator() {
  const [productiveHours, setProductiveHours] = useState('');
  const [availableHours, setAvailableHours] = useState('Standard 2,080/yr');
  const [trainingHours, setTrainingHours] = useState('');
  const [adminHours, setAdminHours] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ productiveHours: string; availableHours: string; trainingHours: string; adminHours: string }>('employee-utilization-calculator');

  const prod = parseFloat(productiveHours) || 0;
  const avail = parseFloat(availableHours) || 0;
  const train = parseFloat(trainingHours) || 0;
  const admin = parseFloat(adminHours) || 0;
  const utilization = avail > 0 ? (prod / avail) * 100 : 0;
  const nonProductive = train + admin;
  const nonProdPct = avail > 0 ? (nonProductive / avail) * 100 : 0;
  const idleTime = Math.max(0, avail - prod - nonProductive);
  const idlePct = avail > 0 ? (idleTime / avail) * 100 : 0;

  const handleTryExample = () => { setProductiveHours('1600'); setAvailableHours('2080'); setTrainingHours('80'); setAdminHours('160'); setCalculated(false); };
  const handleCalculate = () => {
    if (avail > 0) {
      setCalculated(true);
      saveEntry({ productiveHours, availableHours, trainingHours, adminHours }, `Utilization: ${utilization.toFixed(1)}% (${prod}h/${avail}h)`);
    }
  };
  const handleReset = () => { setProductiveHours(''); setAvailableHours('2080'); setTrainingHours(''); setAdminHours(''); setCalculated(false); };
  const handleRestore = (i: { productiveHours: string; availableHours: string; trainingHours: string; adminHours: string }) => { setProductiveHours(i.productiveHours); setAvailableHours(i.availableHours); setTrainingHours(i.trainingHours); setAdminHours(i.adminHours); setCalculated(true); };
  const snap = (): Snapshot => ({ prod, avail, train, admin, utilization, nonProductive, nonProdPct, idleTime, idlePct, label: `${utilization.toFixed(1)}% utilization` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Gauge className="inline h-3 w-3 mr-1" />
          {`Calculate workforce capacity utilization: productive hours vs available hours. Target: 75-85% productive, 15-25% non-billable.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productiveHours">Productive Hours (period)</Label>
            <div className="relative">
              
              <Input id="productiveHours" type="number" step="any" min="0" placeholder="1600"
                value={productiveHours} onChange={(e) => { setProductiveHours(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="availableHours">Available Hours (period)</Label>
            <div className="relative">
              
              <Input id="availableHours" type="number" step="any" min="0" placeholder="2080"
                value={availableHours} onChange={(e) => { setAvailableHours(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Standard 2,080/yr</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trainingHours">Training Hours</Label>
            <div className="relative">
              
              <Input id="trainingHours" type="number" step="any" min="0" placeholder="80"
                value={trainingHours} onChange={(e) => { setTrainingHours(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminHours">Admin/Internal Hours</Label>
            <div className="relative">
              
              <Input id="adminHours" type="number" step="any" min="0" placeholder="160"
                value={adminHours} onChange={(e) => { setAdminHours(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={avail <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Utilization
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Employee Utilization Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{`{utilization.toFixed(1)}%`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Non-productive: ${nonProdPct.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-red-500/10 border-red-500/30 text-red-600'">{`Idle/unutilized: ${idlePct.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{'Target: 75-85% productive'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Productive</p>
                    <p className={`text-lg font-bold`}>{`{prod}h`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Available</p>
                    <p className={`text-lg font-bold`}>{`{avail}h`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Utilization</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{utilization.toFixed(1)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Idle Time</p>
                    <p className={`text-lg font-bold`}>{`{idleTime}h`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Employee utilization = productive hours / available hours × 100. Target: 75-85% productive, 10-15% training/development, 5-10% admin, 5-10% idle/bench. Below 70% suggests underutilization; above 90% risks burnout. For billable utilization (consulting/legal), see our Utilization Rate Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Productive', valueA: `${compareA.prod}h`, valueB: `${compareB.prod}h`, numA: compareA.prod, numB: compareB.prod },
          { label: 'Available', valueA: `${compareA.avail}h`, valueB: `${compareB.avail}h`, numA: compareA.avail, numB: compareB.avail },
          { label: 'Utilization', valueA: `${compareA.utilization.toFixed(1)}%`, valueB: `${compareB.utilization.toFixed(1)}%`, numA: compareA.utilization, numB: compareB.utilization },
          { label: 'Idle Time', valueA: `${compareA.idleTime}h`, valueB: `${compareB.idleTime}h`, numA: compareA.idleTime, numB: compareB.idleTime }
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
