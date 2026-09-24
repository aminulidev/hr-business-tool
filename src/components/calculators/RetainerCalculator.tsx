'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarRange } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { hours: number; rate: number; disc: number; standardValue: number; discountDollars: number; retainerFee: number; effectiveRate: number; annualValue: number; label: string; }

export default function RetainerCalculator() {
  const [includedHours, setIncludedHours] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [retainerDiscount, setRetainerDiscount] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ includedHours: string; hourlyRate: string; retainerDiscount: string }>('retainer-calculator');

  const hours = parseFloat(includedHours) || 0;
  const rate = parseFloat(hourlyRate) || 0;
  const disc = parseFloat(retainerDiscount) || 0;
  const standardValue = hours * rate;
  const discountDollars = standardValue * (disc / 100);
  const retainerFee = standardValue - discountDollars;
  const effectiveRate = hours > 0 ? retainerFee / hours : 0;
  const annualValue = retainerFee * 12;

  const handleTryExample = () => { setIncludedHours('40'); setHourlyRate('100'); setRetainerDiscount('15'); setCalculated(false); };
  const handleCalculate = () => {
    if (hours > 0 && rate > 0) {
      setCalculated(true);
      saveEntry({ includedHours, hourlyRate, retainerDiscount }, `Retainer: ${formatCurrency(retainerFee)}/mo (${formatCurrency(effectiveRate)}/hr effective)`);
    }
  };
  const handleReset = () => { setIncludedHours(''); setHourlyRate(''); setRetainerDiscount('15'); setCalculated(false); };
  const handleRestore = (i: { includedHours: string; hourlyRate: string; retainerDiscount: string }) => { setIncludedHours(i.includedHours); setHourlyRate(i.hourlyRate); setRetainerDiscount(i.retainerDiscount); setCalculated(true); };
  const snap = (): Snapshot => ({ hours, rate, disc, standardValue, discountDollars, retainerFee, effectiveRate, annualValue, label: `Retainer: ${formatCurrency(retainerFee)}/mo` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <CalendarRange className="inline h-3 w-3 mr-1" />
          {`Calculate monthly retainer fee from included hours, hourly rate, retainer discount, and scope of work.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="includedHours">Hours Included per Month</Label>
            <div className="relative">
              
              <Input id="includedHours" type="number" step="any" min="0" placeholder="40"
                value={includedHours} onChange={(e) => { setIncludedHours(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Standard Hourly Rate</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="hourlyRate" type="number" step="any" min="0" placeholder="100" className="pl-7"
                value={hourlyRate} onChange={(e) => { setHourlyRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="retainerDiscount">Retainer Discount (%)</Label>
            <div className="relative">
              
              <Input id="retainerDiscount" type="number" step="any" min="0" placeholder="15"
                value={retainerDiscount} onChange={(e) => { setRetainerDiscount(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Discount vs ad-hoc rate</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={hours <= 0 || rate <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Retainer
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Monthly Retainer Fee</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(retainerFee)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Effective rate: ${formatCurrency(effectiveRate)}/hr`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Client saves: ${formatCurrency(discountDollars)}/mo`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Annual contract: ${formatCurrency(annualValue)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Standard Value</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(standardValue)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Discount</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(discountDollars)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Retainer Fee</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(retainerFee)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annual Value</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(annualValue)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Retainer = (included hours x hourly rate) x (1 - discount%). Discount: 10-20% (client commits to monthly volume, you get predictable revenue). Effective rate = retainer / hours. Track actual hours - if consistently exceeding, renegotiate.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Hours', valueA: String(compareA.hours), valueB: String(compareB.hours), numA: compareA.hours, numB: compareB.hours },
          { label: 'Retainer', valueA: formatCurrency(compareA.retainerFee), valueB: formatCurrency(compareB.retainerFee), numA: compareA.retainerFee, numB: compareB.retainerFee },
          { label: 'Annual', valueA: formatCurrency(compareA.annualValue), valueB: formatCurrency(compareB.annualValue), numA: compareA.annualValue, numB: compareB.annualValue }
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
