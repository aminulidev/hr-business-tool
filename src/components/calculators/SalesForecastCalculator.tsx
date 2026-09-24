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

interface Snapshot { pipeline: number; wr: number; weightedForecast: number; coverageRatio: number; dealsClosing: number; label: string; }

export default function SalesForecastCalculator() {
  const [pipelineValue, setPipelineValue] = useState('');
  const [avgWinRate, setAvgWinRate] = useState('');
  const [salesCycleDays, setSalesCycleDays] = useState('');
  const [forecastPeriod, setForecastPeriod] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ pipelineValue: string; avgWinRate: string; salesCycleDays: string; forecastPeriod: string }>('sales-forecast-calculator');

  const pipeline = parseFloat(pipelineValue) || 0;
  const wr = parseFloat(avgWinRate) || 0;
  const cycle = parseFloat(salesCycleDays) || 0;
  const period = parseFloat(forecastPeriod) || 0;
  const weightedForecast = pipeline * (wr / 100);
  const coverageRatio = weightedForecast > 0 ? pipeline / weightedForecast : 0;
  const dealsClosing = cycle > 0 ? (period / cycle) * weightedForecast : weightedForecast;

  const handleTryExample = () => { setPipelineValue('2000000'); setAvgWinRate('25'); setSalesCycleDays('90'); setForecastPeriod('90'); setCalculated(false); };
  const handleCalculate = () => {
    if (pipeline > 0) {
      setCalculated(true);
      saveEntry({ pipelineValue, avgWinRate, salesCycleDays, forecastPeriod }, `Forecast: ${formatCurrency(weightedForecast)} (${coverageRatio.toFixed(1)}x coverage)`);
    }
  };
  const handleReset = () => { setPipelineValue(''); setAvgWinRate('25'); setSalesCycleDays('90'); setForecastPeriod('90'); setCalculated(false); };
  const handleRestore = (i: { pipelineValue: string; avgWinRate: string; salesCycleDays: string; forecastPeriod: string }) => { setPipelineValue(i.pipelineValue); setAvgWinRate(i.avgWinRate); setSalesCycleDays(i.salesCycleDays); setForecastPeriod(i.forecastPeriod); setCalculated(true); };
  const snap = (): Snapshot => ({ pipeline, wr, weightedForecast, coverageRatio, dealsClosing, label: `Forecast: ${formatCurrency(weightedForecast)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          {`Forecast sales from pipeline value, stage probabilities, and win rate. See weighted pipeline forecast.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pipelineValue">Total Pipeline Value</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="pipelineValue" type="number" step="any" min="0" placeholder="2000000" className="pl-7"
                value={pipelineValue} onChange={(e) => { setPipelineValue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgWinRate">Average Win Rate (%)</Label>
            <div className="relative">
              
              <Input id="avgWinRate" type="number" step="any" min="0" placeholder="25"
                value={avgWinRate} onChange={(e) => { setAvgWinRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salesCycleDays">Avg Sales Cycle (days)</Label>
            <div className="relative">
              
              <Input id="salesCycleDays" type="number" step="any" min="0" placeholder="90"
                value={salesCycleDays} onChange={(e) => { setSalesCycleDays(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="forecastPeriod">Forecast Period (days)</Label>
            <div className="relative">
              
              <Input id="forecastPeriod" type="number" step="any" min="0" placeholder="90"
                value={forecastPeriod} onChange={(e) => { setForecastPeriod(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={pipeline <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Forecast Sales
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Weighted Forecast</p>
                <p className="text-4xl font-bold text-emerald-600">{`${formatCurrency(weightedForecast)}`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Coverage: ${coverageRatio.toFixed(1)}x pipeline`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Closing in period: ${formatCurrency(dealsClosing)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Win rate: ${wr}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Pipeline</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(pipeline)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                    <p className={`text-lg font-bold`}>{`{wr}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Weighted Forecast</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(weightedForecast)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Closing in Period</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(dealsClosing)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Weighted forecast = pipeline × win rate. Coverage ratio = pipeline / forecast (target 3-4x). Deals closing in period = (period / sales cycle) × weighted forecast. Adjust win rate by stage (prospect 10%, qualified 25%, proposal 50%, negotiation 75%). See our Pipeline Calculator for coverage analysis.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Pipeline', valueA: formatCurrency(compareA.pipeline), valueB: formatCurrency(compareB.pipeline), numA: compareA.pipeline, numB: compareB.pipeline },
          { label: 'Weighted Forecast', valueA: formatCurrency(compareA.weightedForecast), valueB: formatCurrency(compareB.weightedForecast), numA: compareA.weightedForecast, numB: compareB.weightedForecast },
          { label: 'Coverage', valueA: `${compareA.coverageRatio.toFixed(1)}x`, valueB: `${compareB.coverageRatio.toFixed(1)}x`, numA: compareA.coverageRatio, numB: compareB.coverageRatio }
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
