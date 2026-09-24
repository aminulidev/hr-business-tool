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

interface Snapshot { ap: number; cogs: number; dpo: number; dailyCogs: number; label: string; }

export default function AccountsPayableDaysCalculator() {
  const [accountsPayable, setAccountsPayable] = useState('');
  const [annualCogs, setAnnualCogs] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ accountsPayable: string; annualCogs: string }>('accounts-payable-days-calculator');

  const ap = parseFloat(accountsPayable) || 0;
  const cogs = parseFloat(annualCogs) || 0;
  const dpo = cogs > 0 ? (ap / cogs) * 365 : 0;
  const dailyCogs = cogs / 365;

  const handleTryExample = () => { setAccountsPayable('120000'); setAnnualCogs('600000'); setCalculated(false); };
  const handleCalculate = () => {
    if (cogs > 0) {
      setCalculated(true);
      saveEntry({ accountsPayable, annualCogs }, `DPO: ${dpo.toFixed(0)} days (${formatCurrency(ap)} AP on ${formatCurrency(cogs)} COGS)`);
    }
  };
  const handleReset = () => { setAccountsPayable(''); setAnnualCogs(''); setCalculated(false); };
  const handleRestore = (i: { accountsPayable: string; annualCogs: string }) => { setAccountsPayable(i.accountsPayable); setAnnualCogs(i.annualCogs); setCalculated(true); };
  const snap = (): Snapshot => ({ ap, cogs, dpo, dailyCogs, label: `DPO: ${dpo.toFixed(0)} days` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Clock className="inline h-3 w-3 mr-1" />
          {`Calculate DPO = (AP / COGS) x 365. Higher = better cash flow.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="accountsPayable">Accounts Payable</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="accountsPayable" type="number" step="any" min="0" placeholder="120000" className="pl-7"
                value={accountsPayable} onChange={(e) => { setAccountsPayable(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="annualCogs">Annual COGS</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="annualCogs" type="number" step="any" min="0" placeholder="600000" className="pl-7"
                value={annualCogs} onChange={(e) => { setAnnualCogs(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={cogs <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate DPO
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Days Payable Outstanding</p>
                <p className="text-4xl font-bold text-emerald-600">{`${dpo.toFixed(0)} days`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`AP: ${formatCurrency(ap)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Daily COGS: ${formatCurrency(dailyCogs)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Benchmark: 30-60 days'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">AP</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(ap)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">COGS</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cogs)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">DPO</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{dpo.toFixed(0)} days`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Daily COGS</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(dailyCogs)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`DPO = (AP / COGS) x 365. Higher = better cash flow. Benchmark: 30-60 days.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'AP', valueA: formatCurrency(compareA.ap), valueB: formatCurrency(compareB.ap), numA: compareA.ap, numB: compareB.ap },
          { label: 'DPO', valueA: formatPercent(compareA.dpo), valueB: formatPercent(compareB.dpo), numA: compareA.dpo, numB: compareB.dpo }
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
