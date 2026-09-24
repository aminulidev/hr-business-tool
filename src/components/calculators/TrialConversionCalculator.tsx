'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { signups: number; paid: number; conversionRate: number; lostTrials: number; benchmark: string; label: string; }

export default function TrialConversionCalculator() {
  const [trialSignups, setTrialSignups] = useState('');
  const [paidConversions, setPaidConversions] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ trialSignups: string; paidConversions: string }>('trial-conversion-calculator');

  const signups = parseFloat(trialSignups) || 0;
  const paid = parseFloat(paidConversions) || 0;
  const conversionRate = signups > 0 ? (paid / signups) * 100 : 0;
  const lostTrials = signups - paid;
  const benchmark = conversionRate > 25 ? "Excellent" : conversionRate > 15 ? "Healthy" : "Below benchmark";

  const handleTryExample = () => { setTrialSignups('1000'); setPaidConversions('200'); setCalculated(false); };
  const handleCalculate = () => {
    if (signups > 0) {
      setCalculated(true);
      saveEntry({ trialSignups, paidConversions }, `Trial conversion: ${conversionRate.toFixed(1)}% (${paid}/${signups})`);
    }
  };
  const handleReset = () => { setTrialSignups(''); setPaidConversions(''); setCalculated(false); };
  const handleRestore = (i: { trialSignups: string; paidConversions: string }) => { setTrialSignups(i.trialSignups); setPaidConversions(i.paidConversions); setCalculated(true); };
  const snap = (): Snapshot => ({ signups, paid, conversionRate, lostTrials, benchmark, label: `Conversion: ${conversionRate.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <BarChart3 className="inline h-3 w-3 mr-1" />
          {`Calculate trial-to-paid conversion rate. SaaS benchmark: 15-25% for free trials.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trialSignups">Trial Signups</Label>
            <div className="relative">
              
              <Input id="trialSignups" type="number" step="any" min="0" placeholder="1000"
                value={trialSignups} onChange={(e) => { setTrialSignups(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paidConversions">Paid Conversions</Label>
            <div className="relative">
              
              <Input id="paidConversions" type="number" step="any" min="0" placeholder="200"
                value={paidConversions} onChange={(e) => { setPaidConversions(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={signups <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Trial Conversion
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Trial Conversion Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(conversionRate)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Paid: ${paid} out of ${signups} trials`}</Badge>
                  <Badge variant="outline" className="'bg-red-500/10 border-red-500/30 text-red-600'">{`Lost trials: ${lostTrials}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Benchmark: ${benchmark}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Trial Signups</p>
                    <p className={`text-lg font-bold`}>{`{signups}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Paid Conversions</p>
                    <p className={`text-lg font-bold`}>{`{paid}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Conversion Rate</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatPercent(conversionRate)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Lost</p>
                    <p className={`text-lg font-bold`}>{`{lostTrials}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Trial conversion = paid / trial signups x 100. SaaS benchmarks: free trial 15-25%, freemium 2-5%.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Signups', valueA: String(compareA.signups), valueB: String(compareB.signups), numA: compareA.signups, numB: compareB.signups },
          { label: 'Conversion', valueA: formatPercent(compareA.conversionRate), valueB: formatPercent(compareB.conversionRate), numA: compareA.conversionRate, numB: compareB.conversionRate }
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
