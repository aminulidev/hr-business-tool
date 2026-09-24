'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { sc: number; lc: number; sm: number; lm: number; logoChurn: number; revenueChurn: number; logoRetention: number; revenueRetention: number; label: string; }

export default function ChurnRateCalculator() {
  const [startCustomers, setStartCustomers] = useState('');
  const [lostCustomers, setLostCustomers] = useState('');
  const [startMrr, setStartMrr] = useState('');
  const [lostMrr, setLostMrr] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ startCustomers: string; lostCustomers: string; startMrr: string; lostMrr: string }>('churn-rate-calculator');

  const sc = parseFloat(startCustomers) || 0;
  const lc = parseFloat(lostCustomers) || 0;
  const sm = parseFloat(startMrr) || 0;
  const lm = parseFloat(lostMrr) || 0;
  const logoChurn = sc > 0 ? (lc / sc) * 100 : 0;
  const revenueChurn = sm > 0 ? (lm / sm) * 100 : 0;
  const logoRetention = 100 - logoChurn;
  const revenueRetention = 100 - revenueChurn;

  const handleTryExample = () => { setStartCustomers('500'); setLostCustomers('25'); setStartMrr('100000'); setLostMrr('5000'); setCalculated(false); };
  const handleCalculate = () => {
    if (sc > 0) {
      setCalculated(true);
      saveEntry({ startCustomers, lostCustomers, startMrr, lostMrr }, `Logo churn: ${logoChurn.toFixed(1)}%, Revenue churn: ${revenueChurn.toFixed(1)}%`);
    }
  };
  const handleReset = () => { setStartCustomers(''); setLostCustomers(''); setStartMrr(''); setLostMrr(''); setCalculated(false); };
  const handleRestore = (i: { startCustomers: string; lostCustomers: string; startMrr: string; lostMrr: string }) => { setStartCustomers(i.startCustomers); setLostCustomers(i.lostCustomers); setStartMrr(i.startMrr); setLostMrr(i.lostMrr); setCalculated(true); };
  const snap = (): Snapshot => ({ sc, lc, sm, lm, logoChurn, revenueChurn, logoRetention, revenueRetention, label: `Churn: ${logoChurn.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingDown className="inline h-3 w-3 mr-1" />
          {`Calculate customer churn rate (logo) and revenue churn rate. SaaS benchmark: <5%/yr.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startCustomers">Customers at Start</Label>
            <div className="relative">
              
              <Input id="startCustomers" type="number" step="any" min="0" placeholder="500"
                value={startCustomers} onChange={(e) => { setStartCustomers(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lostCustomers">Customers Lost</Label>
            <div className="relative">
              
              <Input id="lostCustomers" type="number" step="any" min="0" placeholder="25"
                value={lostCustomers} onChange={(e) => { setLostCustomers(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startMrr">Starting MRR</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="startMrr" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={startMrr} onChange={(e) => { setStartMrr(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lostMrr">Churned MRR</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="lostMrr" type="number" step="any" min="0" placeholder="5000" className="pl-7"
                value={lostMrr} onChange={(e) => { setLostMrr(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={sc <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Churn Rate
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Churn Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(logoChurn)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-red-500/10 border-red-500/30 text-red-600'">{`Revenue churn: ${formatPercent(revenueChurn)}`}</Badge>
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Logo retention: ${formatPercent(logoRetention)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{'SaaS benchmark: <5%/yr'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Logo Churn</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatPercent(logoChurn)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue Churn</p>
                    <p className={`text-lg font-bold`}>{formatPercent(revenueChurn)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Logo Retention</p>
                    <p className={`text-lg font-bold`}>{formatPercent(logoRetention)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Rev Retention</p>
                    <p className={`text-lg font-bold`}>{formatPercent(revenueRetention)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Logo churn = customers lost / customers at start x 100. Revenue churn = churned MRR / starting MRR x 100.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Logo Churn', valueA: formatPercent(compareA.logoChurn), valueB: formatPercent(compareB.logoChurn), numA: compareA.logoChurn, numB: compareB.logoChurn },
          { label: 'Rev Churn', valueA: formatPercent(compareA.revenueChurn), valueB: formatPercent(compareB.revenueChurn), numA: compareA.revenueChurn, numB: compareB.revenueChurn }
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
