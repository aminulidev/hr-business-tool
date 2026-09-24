'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { tcv: number; years: number; acv: number; monthlyValue: number; label: string; }

export default function AcvCalculator() {
  const [contractValue, setContractValue] = useState('');
  const [contractYears, setContractYears] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ contractValue: string; contractYears: string }>('acv-calculator');

  const tcv = parseFloat(contractValue) || 0;
  const years = parseFloat(contractYears) || 0;
  const acv = years > 0 ? tcv / years : 0;
  const monthlyValue = acv / 12;

  const handleTryExample = () => { setContractValue('150000'); setContractYears('3'); setCalculated(false); };
  const handleCalculate = () => {
    if (tcv > 0 && years > 0) {
      setCalculated(true);
      saveEntry({ contractValue, contractYears }, `ACV: ${formatCurrency(acv)}/yr (TCV: ${formatCurrency(tcv)} over ${years}yr)`);
    }
  };
  const handleReset = () => { setContractValue(''); setContractYears('1'); setCalculated(false); };
  const handleRestore = (i: { contractValue: string; contractYears: string }) => { setContractValue(i.contractValue); setContractYears(i.contractYears); setCalculated(true); };
  const snap = (): Snapshot => ({ tcv, years, acv, monthlyValue, label: `ACV: ${formatCurrency(acv)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Calculate ACV = total contract value / contract years. SaaS benchmarks: SMB $5-25k, enterprise $100k+.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contractValue">Total Contract Value (TCV)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="contractValue" type="number" step="any" min="0" placeholder="150000" className="pl-7"
                value={contractValue} onChange={(e) => { setContractValue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractYears">Contract Term (years)</Label>
            <div className="relative">
              
              <Input id="contractYears" type="number" step="any" min="0" placeholder="3"
                value={contractYears} onChange={(e) => { setContractYears(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={tcv <= 0 || years <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate ACV
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Annual Contract Value</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(acv)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`TCV: ${formatCurrency(tcv)} over ${years} years`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Monthly: ${formatCurrency(monthlyValue)}/mo`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'SMB $5-25k, Mid-market $25-100k, Enterprise $100k+'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">TCV</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(tcv)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Contract Term</p>
                    <p className={`text-lg font-bold`}>{`{years} years`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ACV</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(acv)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(monthlyValue)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`ACV = total contract value / contract term in years. TCV = ACV x years. SaaS benchmarks: SMB $5-25k, enterprise $100k+.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'TCV', valueA: formatCurrency(compareA.tcv), valueB: formatCurrency(compareB.tcv), numA: compareA.tcv, numB: compareB.tcv },
          { label: 'ACV', valueA: formatCurrency(compareA.acv), valueB: formatCurrency(compareB.acv), numA: compareA.acv, numB: compareB.acv }
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
