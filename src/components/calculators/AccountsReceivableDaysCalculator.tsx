'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { ar: number; rev: number; dso: number; dailyRevenue: number; label: string; }

export default function AccountsReceivableDaysCalculator() {
  const [accountsReceivable, setAccountsReceivable] = useState('');
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ accountsReceivable: string; annualRevenue: string }>('accounts-receivable-days-calculator');

  const ar = parseFloat(accountsReceivable) || 0;
  const rev = parseFloat(annualRevenue) || 0;
  const dso = rev > 0 ? (ar / rev) * 365 : 0;
  const dailyRevenue = rev / 365;

  const handleTryExample = () => { setAccountsReceivable('150000'); setAnnualRevenue('1000000'); setCalculated(false); };
  const handleCalculate = () => {
    if (rev > 0) {
      setCalculated(true);
      saveEntry({ accountsReceivable, annualRevenue }, `DSO: ${dso.toFixed(0)} days (${formatCurrency(ar)} AR on ${formatCurrency(rev)} rev)`);
    }
  };
  const handleReset = () => { setAccountsReceivable(''); setAnnualRevenue(''); setCalculated(false); };
  const handleRestore = (i: { accountsReceivable: string; annualRevenue: string }) => { setAccountsReceivable(i.accountsReceivable); setAnnualRevenue(i.annualRevenue); setCalculated(true); };
  const snap = (): Snapshot => ({ ar, rev, dso, dailyRevenue, label: `DSO: ${dso.toFixed(0)} days` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Clock className="inline h-3 w-3 mr-1" />
          {`Calculate DSO = (AR / revenue) x 365. Benchmark: 30-60 days.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="accountsReceivable">Accounts Receivable</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="accountsReceivable" type="number" step="any" min="0" placeholder="150000" className="pl-7"
                value={accountsReceivable} onChange={(e) => { setAccountsReceivable(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="annualRevenue">Annual Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="annualRevenue" type="number" step="any" min="0" placeholder="1000000" className="pl-7"
                value={annualRevenue} onChange={(e) => { setAnnualRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={rev <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate DSO
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Days Sales Outstanding</p>
                <p className="text-4xl font-bold text-emerald-600">{`${dso.toFixed(0)} days`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`AR: ${formatCurrency(ar)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Daily revenue: ${formatCurrency(dailyRevenue)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Benchmark: 30-60 days'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">AR</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(ar)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(rev)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">DSO</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{dso.toFixed(0)} days`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Daily Rev</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(dailyRevenue)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`DSO = (AR / revenue) x 365. Lower = better. Benchmark: 30-60 days.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'AR', valueA: formatCurrency(compareA.ar), valueB: formatCurrency(compareB.ar), numA: compareA.ar, numB: compareB.ar },
          { label: 'DSO', valueA: formatPercent(compareA.dso), valueB: formatPercent(compareB.dso), numA: compareA.dso, numB: compareB.dso }
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
