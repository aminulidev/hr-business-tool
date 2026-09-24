'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { mrr: number; gr: number; mos: number; forecastMRR: number; forecastARR: number; totalRevenue: number; optimistic: number; conservative: number; label: string; }

export default function RevenueForecastCalculator() {
  const [currentMRR, setCurrentMRR] = useState('');
  const [monthlyGrowth, setMonthlyGrowth] = useState('');
  const [months, setMonths] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ currentMRR: string; monthlyGrowth: string; months: string }>('revenue-forecast-calculator');

  const mrr = parseFloat(currentMRR) || 0;
  const gr = parseFloat(monthlyGrowth) || 0;
  const mos = parseFloat(months) || 0;
  const forecastMRR = mrr * Math.pow(1 + gr / 100, mos);
  const forecastARR = forecastMRR * 12;
  const totalRevenue = (mrr + forecastMRR) / 2 * mos;
  const optimistic = mrr * Math.pow(1 + (gr + 2) / 100, mos);
  const conservative = mrr * Math.pow(1 + Math.max(0, gr - 2) / 100, mos);

  const handleTryExample = () => { setCurrentMRR('100000'); setMonthlyGrowth('5'); setMonths('12'); setCalculated(false); };
  const handleCalculate = () => {
    if (mrr > 0) {
      setCalculated(true);
      saveEntry({ currentMRR, monthlyGrowth, months }, `Forecast ARR: ${formatCurrency(forecastARR)} (${gr}%/mo growth)`);
    }
  };
  const handleReset = () => { setCurrentMRR(''); setMonthlyGrowth('5'); setMonths('12'); setCalculated(false); };
  const handleRestore = (i: { currentMRR: string; monthlyGrowth: string; months: string }) => { setCurrentMRR(i.currentMRR); setMonthlyGrowth(i.monthlyGrowth); setMonths(i.months); setCalculated(true); };
  const snap = (): Snapshot => ({ mrr, gr, mos, forecastMRR, forecastARR, totalRevenue, optimistic, conservative, label: `Forecast ARR: ${formatCurrency(forecastARR)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          {`Forecast revenue based on current run rate and growth rate, with base/optimistic/conservative scenarios.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentMRR">Current Monthly Recurring Revenue (MRR)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="currentMRR" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={currentMRR} onChange={(e) => { setCurrentMRR(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyGrowth">Monthly Growth Rate (%)</Label>
            <div className="relative">
              
              <Input id="monthlyGrowth" type="number" step="any" min="0" placeholder="5"
                value={monthlyGrowth} onChange={(e) => { setMonthlyGrowth(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="months">Forecast Period (months)</Label>
            <div className="relative">
              
              <Input id="months" type="number" step="any" min="0" placeholder="12"
                value={months} onChange={(e) => { setMonths(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={mrr <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Forecast Revenue
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Forecasted Annual Revenue</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(forecastARR)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`MRR in ${mos} months: ${formatCurrency(forecastMRR)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Optimistic: ${formatCurrency(optimistic * 12)} ARR`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Conservative: ${formatCurrency(conservative * 12)} ARR`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Current MRR</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(mrr)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Forecast MRR</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(forecastMRR)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Forecast ARR</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(forecastARR)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Period Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalRevenue)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Revenue forecast = current MRR × (1 + monthly growth)^months. Optimistic = +2% growth, conservative = -2%. Compound growth is powerful: 5% monthly = 80% annual. Track forecast vs actuals monthly. Adjust growth rate based on pipeline, churn, expansion. See our Sales Forecast Calculator for pipeline-based forecast.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Current MRR', valueA: formatCurrency(compareA.mrr), valueB: formatCurrency(compareB.mrr), numA: compareA.mrr, numB: compareB.mrr },
          { label: 'Forecast MRR', valueA: formatCurrency(compareA.forecastMRR), valueB: formatCurrency(compareB.forecastMRR), numA: compareA.forecastMRR, numB: compareB.forecastMRR },
          { label: 'Forecast ARR', valueA: formatCurrency(compareA.forecastARR), valueB: formatCurrency(compareB.forecastARR), numA: compareA.forecastARR, numB: compareB.forecastARR }
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
