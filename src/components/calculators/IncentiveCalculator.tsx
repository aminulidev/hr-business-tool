'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { base: number; comm: number; bonus: number; sp: number; ote: number; variableComp: number; payMix: number; label: string; }

export default function IncentiveCalculator() {
  const [baseSalary, setBaseSalary] = useState('');
  const [commissionAtQuota, setCommissionAtQuota] = useState('');
  const [bonusAtQuota, setBonusAtQuota] = useState('');
  const [spiffs, setSpiffs] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ baseSalary: string; commissionAtQuota: string; bonusAtQuota: string; spiffs: string }>('incentive-calculator');

  const base = parseFloat(baseSalary) || 0;
  const comm = parseFloat(commissionAtQuota) || 0;
  const bonus = parseFloat(bonusAtQuota) || 0;
  const sp = parseFloat(spiffs) || 0;
  const ote = base + comm + bonus + sp;
  const variableComp = comm + bonus + sp;
  const payMix = ote > 0 ? (variableComp / ote) * 100 : 0;
  const variableRatio = base > 0 ? variableComp / base : 0;

  const handleTryExample = () => { setBaseSalary('80000'); setCommissionAtQuota('60000'); setBonusAtQuota('15000'); setSpiffs('5000'); setCalculated(false); };
  const handleCalculate = () => {
    if (base > 0 || comm > 0) {
      setCalculated(true);
      saveEntry({ baseSalary, commissionAtQuota, bonusAtQuota, spiffs }, `OTE: ${formatCurrency(ote)} (${payMix.toFixed(0)}% variable)`);
    }
  };
  const handleReset = () => { setBaseSalary(''); setCommissionAtQuota(''); setBonusAtQuota(''); setSpiffs(''); setCalculated(false); };
  const handleRestore = (i: { baseSalary: string; commissionAtQuota: string; bonusAtQuota: string; spiffs: string }) => { setBaseSalary(i.baseSalary); setCommissionAtQuota(i.commissionAtQuota); setBonusAtQuota(i.bonusAtQuota); setSpiffs(i.spiffs); setCalculated(true); };
  const snap = (): Snapshot => ({ base, comm, bonus, sp, ote, variableComp, payMix, label: `OTE: ${formatCurrency(ote)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Gift className="inline h-3 w-3 mr-1" />
          {`Calculate total sales incentive compensation: base + commission + bonus + SPIFFs. See OTE (on-target earnings) and pay mix.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="baseSalary">Base Salary</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="baseSalary" type="number" step="any" min="0" placeholder="80000" className="pl-7"
                value={baseSalary} onChange={(e) => { setBaseSalary(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="commissionAtQuota">Commission at 100% Quota</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="commissionAtQuota" type="number" step="any" min="0" placeholder="60000" className="pl-7"
                value={commissionAtQuota} onChange={(e) => { setCommissionAtQuota(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bonusAtQuota">Bonus at 100% Quota</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="bonusAtQuota" type="number" step="any" min="0" placeholder="15000" className="pl-7"
                value={bonusAtQuota} onChange={(e) => { setBonusAtQuota(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="spiffs">SPIFFs (annual)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="spiffs" type="number" step="any" min="0" placeholder="5000" className="pl-7"
                value={spiffs} onChange={(e) => { setSpiffs(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={base <= 0 && comm <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Total Incentive Comp
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">OTE (On-Target Earnings)</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(ote)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Variable comp: ${formatCurrency(variableComp)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Pay mix: ${payMix.toFixed(0)}% variable`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Variable/Base ratio: ${variableRatio.toFixed(2)}x`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Base Salary</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(base)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Variable Comp</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(variableComp)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">OTE</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(ote)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Pay Mix</p>
                    <p className={`text-lg font-bold`}>{`{payMix.toFixed(0)}% var`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`OTE (On-Target Earnings) = base + commission at quota + bonus + SPIFFs. Pay mix = variable / OTE. Typical SaaS: 50/50 to 60/40 (base/variable). Higher variable = more risk/reward. Sales reps prefer 50/50 for predictability; hunters prefer 40/60 for upside. See our Sales Bonus Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Base', valueA: formatCurrency(compareA.base), valueB: formatCurrency(compareB.base), numA: compareA.base, numB: compareB.base },
          { label: 'Variable', valueA: formatCurrency(compareA.variableComp), valueB: formatCurrency(compareB.variableComp), numA: compareA.variableComp, numB: compareB.variableComp },
          { label: 'OTE', valueA: formatCurrency(compareA.ote), valueB: formatCurrency(compareB.ote), numA: compareA.ote, numB: compareB.ote },
          { label: 'Pay Mix', valueA: `${compareA.payMix.toFixed(0)}% var`, valueB: `${compareB.payMix.toFixed(0)}% var`, numA: compareA.payMix, numB: compareB.payMix }
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
