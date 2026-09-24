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

interface Snapshot { out: number; infl: number; grossBurn: number; netBurn: number; annualBurn: number; dailyBurn: number; label: string; }

export default function BurnRateCalculator() {
  const [cashOutflow, setCashOutflow] = useState('');
  const [cashInflow, setCashInflow] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ cashOutflow: string; cashInflow: string }>('burn-rate-calculator');

  const out = parseFloat(cashOutflow) || 0;
  const infl = parseFloat(cashInflow) || 0;
  const grossBurn = out;
  const netBurn = out - infl;
  const annualBurn = netBurn * 12;
  const dailyBurn = netBurn / 30;

  const handleTryExample = () => { setCashOutflow('100000'); setCashInflow('30000'); setCalculated(false); };
  const handleCalculate = () => {
    if (out > 0) {
      setCalculated(true);
      saveEntry({ cashOutflow, cashInflow }, `Net burn: ${formatCurrency(netBurn)}/mo (${formatCurrency(annualBurn)}/yr)`);
    }
  };
  const handleReset = () => { setCashOutflow(''); setCashInflow(''); setCalculated(false); };
  const handleRestore = (i: { cashOutflow: string; cashInflow: string }) => { setCashOutflow(i.cashOutflow); setCashInflow(i.cashInflow); setCalculated(true); };
  const snap = (): Snapshot => ({ out, infl, grossBurn, netBurn, annualBurn, dailyBurn, label: `Net burn: ${formatCurrency(netBurn)}/mo` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <TrendingDown className="inline h-3 w-3 mr-1" />
          {`Burn rate = monthly cash outflow (gross) or outflow - inflow (net). Critical startup metric. Track alongside cash balance and runway.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cashOutflow">Monthly Cash Outflow</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="cashOutflow" type="number" step="any" min="0" placeholder="100000" className="pl-7"
                value={cashOutflow} onChange={(e) => { setCashOutflow(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cashInflow">Monthly Cash Inflow (revenue)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="cashInflow" type="number" step="any" min="0" placeholder="30000" className="pl-7"
                value={cashInflow} onChange={(e) => { setCashInflow(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={out <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Burn Rate
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Burn Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(netBurn) + "/mo"}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-red-500/10 border-red-500/30 text-red-600'">{`Gross burn: ${formatCurrency(grossBurn)}/mo`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Annual burn: ${formatCurrency(annualBurn)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Daily burn: ${formatCurrency(dailyBurn)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Outflow</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(out)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Inflow</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(infl)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Net Burn</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(netBurn)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annual Burn</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(annualBurn)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Gross burn = total monthly cash outflow. Net burn = outflow - inflow (revenue). Track alongside runway (cash / net burn). Healthy startups: 12-18 months runway. Below 6 months = urgent fundraising. Reduce burn by cutting non-essential spend, delaying hires, or negotiating vendor terms. See our Runway Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Outflow', valueA: formatCurrency(compareA.out), valueB: formatCurrency(compareB.out), numA: compareA.out, numB: compareB.out },
          { label: 'Inflow', valueA: formatCurrency(compareA.infl), valueB: formatCurrency(compareB.infl), numA: compareA.infl, numB: compareB.infl },
          { label: 'Net Burn', valueA: formatCurrency(compareA.netBurn), valueB: formatCurrency(compareB.netBurn), numA: compareA.netBurn, numB: compareB.netBurn },
          { label: 'Annual Burn', valueA: formatCurrency(compareA.annualBurn), valueB: formatCurrency(compareB.annualBurn), numA: compareA.annualBurn, numB: compareB.annualBurn }
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
