'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { cacV: number; arpuV: number; gm: number; churn: number; ltv: number; ltvCacRatio: number; paybackMonths: number; contributionMargin: number; label: string; }

export default function UnitEconomicsCalculator() {
  const [cac, setCac] = useState('');
  const [arpu, setArpu] = useState('Avg revenue per user/mo');
  const [grossMarginPct, setGrossMarginPct] = useState('');
  const [monthlyChurn, setMonthlyChurn] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ cac: string; arpu: string; grossMarginPct: string; monthlyChurn: string }>('unit-economics-calculator');

  const cacV = parseFloat(cac) || 0;
  const arpuV = parseFloat(arpu) || 0;
  const gm = parseFloat(grossMarginPct) || 0;
  const churn = parseFloat(monthlyChurn) || 0;
  const ltv = churn > 0 ? (arpuV * (gm / 100)) / (churn / 100) : arpuV * (gm / 100) * 60;
  const ltvCacRatio = cacV > 0 ? ltv / cacV : 0;
  const paybackMonths = arpuV > 0 && gm > 0 ? cacV / (arpuV * (gm / 100)) : 0;
  const contributionMargin = arpuV * (gm / 100);

  const handleTryExample = () => { setCac('500'); setArpu('100'); setGrossMarginPct('80'); setMonthlyChurn('3'); setCalculated(false); };
  const handleCalculate = () => {
    if (cacV > 0 && arpuV > 0) {
      setCalculated(true);
      saveEntry({ cac, arpu, grossMarginPct, monthlyChurn }, `LTV:CAC ${ltvCacRatio.toFixed(1)}:1 (LTV ${formatCurrency(ltv)}, CAC ${formatCurrency(cacV)})`);
    }
  };
  const handleReset = () => { setCac(''); setArpu(''); setGrossMarginPct('80'); setMonthlyChurn('3'); setCalculated(false); };
  const handleRestore = (i: { cac: string; arpu: string; grossMarginPct: string; monthlyChurn: string }) => { setCac(i.cac); setArpu(i.arpu); setGrossMarginPct(i.grossMarginPct); setMonthlyChurn(i.monthlyChurn); setCalculated(true); };
  const snap = (): Snapshot => ({ cacV, arpuV, gm, churn, ltv, ltvCacRatio, paybackMonths, contributionMargin, label: `LTV:CAC ${ltvCacRatio.toFixed(1)}:1` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <LineChart className="inline h-3 w-3 mr-1" />
          {`Calculate unit economics: CAC, LTV, LTV:CAC ratio (target 3:1), payback period (target <12mo). Critical for SaaS/subscription.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cac">Customer Acquisition Cost (CAC)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="cac" type="number" step="any" min="0" placeholder="500" className="pl-7"
                value={cac} onChange={(e) => { setCac(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="arpu">Monthly ARPU</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="arpu" type="number" step="any" min="0" placeholder="100" className="pl-7"
                value={arpu} onChange={(e) => { setArpu(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Avg revenue per user/mo</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="grossMarginPct">Gross Margin %</Label>
            <div className="relative">
              
              <Input id="grossMarginPct" type="number" step="any" min="0" placeholder="80"
                value={grossMarginPct} onChange={(e) => { setGrossMarginPct(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyChurn">Monthly Churn %</Label>
            <div className="relative">
              
              <Input id="monthlyChurn" type="number" step="any" min="0" placeholder="3"
                value={monthlyChurn} onChange={(e) => { setMonthlyChurn(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={cacV <= 0 || arpuV <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Unit Economics
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">LTV:CAC Ratio</p>
                <p className="text-4xl font-bold text-emerald-600">{`{ltvCacRatio.toFixed(1)}:1`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`LTV: ${formatCurrency(ltv)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Payback: ${paybackMonths.toFixed(1)} months`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{ltvCacRatio < 3 ? "Below target" : ltvCacRatio > 5 ? "Strong" : "Healthy"}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">CAC</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(cacV)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">LTV</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(ltv)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">LTV:CAC</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{ltvCacRatio.toFixed(1)}:1`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Payback</p>
                    <p className={`text-lg font-bold`}>{`{paybackMonths.toFixed(1)}mo`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Unit economics: LTV = (ARPU × gross margin) / monthly churn. LTV:CAC target = 3:1 (SaaS benchmark). Below 1:1 = losing money per customer. Payback period target <12 months (SaaS). Contribution margin = ARPU × gross margin per month. Critical for SaaS, subscription, marketplace businesses. Improve by: reduce CAC (better marketing), increase ARPU (upsell), reduce churn (better product).`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'CAC', valueA: formatCurrency(compareA.cacV), valueB: formatCurrency(compareB.cacV), numA: compareA.cacV, numB: compareB.cacV },
          { label: 'LTV', valueA: formatCurrency(compareA.ltv), valueB: formatCurrency(compareB.ltv), numA: compareA.ltv, numB: compareB.ltv },
          { label: 'LTV:CAC', valueA: `${compareA.ltvCacRatio.toFixed(1)}:1`, valueB: `${compareB.ltvCacRatio.toFixed(1)}:1`, numA: compareA.ltvCacRatio, numB: compareB.ltvCacRatio },
          { label: 'Payback', valueA: `${compareA.paybackMonths.toFixed(1)}mo`, valueB: `${compareB.paybackMonths.toFixed(1)}mo`, numA: compareA.paybackMonths, numB: compareB.paybackMonths }
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
