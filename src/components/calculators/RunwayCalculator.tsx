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

interface Snapshot { cash: number; burn: number; runway: number; runwayYears: number; fundraiseBy: number; label: string; }

export default function RunwayCalculator() {
  const [cashBalance, setCashBalance] = useState('');
  const [monthlyBurn, setMonthlyBurn] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ cashBalance: string; monthlyBurn: string }>('runway-calculator');

  const cash = parseFloat(cashBalance) || 0;
  const burn = parseFloat(monthlyBurn) || 0;
  const runway = burn > 0 ? cash / burn : 0;
  const runwayYears = runway / 12;
  const fundraiseBy = Math.max(0, runway - 6);

  const handleTryExample = () => { setCashBalance('2000000'); setMonthlyBurn('70000'); setCalculated(false); };
  const handleCalculate = () => {
    if (cash > 0 && burn > 0) {
      setCalculated(true);
      saveEntry({ cashBalance, monthlyBurn }, `Runway: ${runway.toFixed(1)} months (${formatCurrency(cash)} / ${formatCurrency(burn)}/mo)`);
    }
  };
  const handleReset = () => { setCashBalance(''); setMonthlyBurn(''); setCalculated(false); };
  const handleRestore = (i: { cashBalance: string; monthlyBurn: string }) => { setCashBalance(i.cashBalance); setMonthlyBurn(i.monthlyBurn); setCalculated(true); };
  const snap = (): Snapshot => ({ cash, burn, runway, runwayYears, fundraiseBy, label: `Runway: ${runway.toFixed(1)} months` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Clock className="inline h-3 w-3 mr-1" />
          {`Runway = cash balance / monthly net burn. Measures months until cash runs out. Healthy: 12-18 months. Raise 6 months before running out.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cashBalance">Current Cash Balance</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="cashBalance" type="number" step="any" min="0" placeholder="2000000" className="pl-7"
                value={cashBalance} onChange={(e) => { setCashBalance(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyBurn">Monthly Net Burn</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="monthlyBurn" type="number" step="any" min="0" placeholder="70000" className="pl-7"
                value={monthlyBurn} onChange={(e) => { setMonthlyBurn(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={cash <= 0 || burn <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Runway
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Cash Runway</p>
                <p className="text-4xl font-bold text-emerald-600">{`{runway.toFixed(1)} months`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`{runwayYears.toFixed(2)} years`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Start fundraising in ${fundraiseBy.toFixed(0)} months`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{runway < 6 ? "CRITICAL" : runway < 12 ? "Raise soon" : "Healthy"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Cash Balance</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cash)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Monthly Burn</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(burn)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Runway (months)</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{runway.toFixed(1)}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Runway (years)</p>
                    <p className={`text-lg font-bold`}>{`{runwayYears.toFixed(2)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Runway = cash balance / monthly net burn. Measures months until cash runs out. Healthy: 12-18 months. Below 6 months = critical. Start fundraising 6 months before running out (fundraising takes 3-6 months). Reduce burn to extend runway. See our Burn Rate Calculator and Cash Flow Forecast Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Cash', valueA: formatCurrency(compareA.cash), valueB: formatCurrency(compareB.cash), numA: compareA.cash, numB: compareB.cash },
          { label: 'Monthly Burn', valueA: formatCurrency(compareA.burn), valueB: formatCurrency(compareB.burn), numA: compareA.burn, numB: compareB.burn },
          { label: 'Runway (mo)', valueA: compareA.runway.toFixed(1), valueB: compareB.runway.toFixed(1), numA: compareA.runway, numB: compareB.runway },
          { label: 'Runway (yr)', valueA: compareA.runwayYears.toFixed(2), valueB: compareB.runwayYears.toFixed(2), numA: compareA.runwayYears, numB: compareB.runwayYears }
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
