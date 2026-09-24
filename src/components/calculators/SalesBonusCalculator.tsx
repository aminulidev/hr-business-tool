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

interface Snapshot { q: number; att: number; bb: number; overAttainment: number; acceleratorBonus: number; attainmentBonus: number; totalBonus: number; label: string; }

export default function SalesBonusCalculator() {
  const [quota, setQuota] = useState('');
  const [attainment, setAttainment] = useState('');
  const [baseBonus, setBaseBonus] = useState('');
  const [accelerator, setAccelerator] = useState('');
  const [spiff, setSpiff] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ quota: string; attainment: string; baseBonus: string; accelerator: string; spiff: string }>('sales-bonus-calculator');

  const q = parseFloat(quota) || 0;
  const att = parseFloat(attainment) || 0;
  const bb = parseFloat(baseBonus) || 0;
  const acc = parseFloat(accelerator) || 0;
  const sp = parseFloat(spiff) || 0;
  const overAttainment = Math.max(0, att - 100);
  const acceleratorBonus = bb * acc * overAttainment;
  const attainmentBonus = att >= 100 ? bb : bb * (att / 100);
  const totalBonus = attainmentBonus + acceleratorBonus + sp;

  const handleTryExample = () => { setQuota('500000'); setAttainment('110'); setBaseBonus('20000'); setAccelerator('0.02'); setSpiff('2000'); setCalculated(false); };
  const handleCalculate = () => {
    if (att > 0 && bb > 0) {
      setCalculated(true);
      saveEntry({ quota, attainment, baseBonus, accelerator, spiff }, `Total bonus: ${formatCurrency(totalBonus)} (${att}% attainment)`);
    }
  };
  const handleReset = () => { setQuota(''); setAttainment('100'); setBaseBonus(''); setAccelerator('0.02'); setSpiff(''); setCalculated(false); };
  const handleRestore = (i: { quota: string; attainment: string; baseBonus: string; accelerator: string; spiff: string }) => { setQuota(i.quota); setAttainment(i.attainment); setBaseBonus(i.baseBonus); setAccelerator(i.accelerator); setSpiff(i.spiff); setCalculated(true); };
  const snap = (): Snapshot => ({ q, att, bb, overAttainment, acceleratorBonus, attainmentBonus, totalBonus, label: `Total bonus: ${formatCurrency(totalBonus)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Gift className="inline h-3 w-3 mr-1" />
          {`Calculate sales bonuses based on quota attainment, with accelerators above 100% and SPIFFs.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quota">Annual Quota</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="quota" type="number" step="any" min="0" placeholder="500000" className="pl-7"
                value={quota} onChange={(e) => { setQuota(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="attainment">Quota Attainment (%)</Label>
            <div className="relative">
              
              <Input id="attainment" type="number" step="any" min="0" placeholder="110"
                value={attainment} onChange={(e) => { setAttainment(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="baseBonus">Base Bonus at 100% attainment</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="baseBonus" type="number" step="any" min="0" placeholder="20000" className="pl-7"
                value={baseBonus} onChange={(e) => { setBaseBonus(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accelerator">Accelerator (x base bonus per 1% above 100)</Label>
            <div className="relative">
              
              <Input id="accelerator" type="number" step="any" min="0" placeholder="0.02"
                value={accelerator} onChange={(e) => { setAccelerator(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">2% = 0.02</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="spiff">SPIFF (one-time incentive)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="spiff" type="number" step="any" min="0" placeholder="2000" className="pl-7"
                value={spiff} onChange={(e) => { setSpiff(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={att <= 0 || bb <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Sales Bonus
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Bonus</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalBonus)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Attainment: ${att}% (${formatCurrency(q * att / 100)})`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Accelerator bonus: ${formatCurrency(acceleratorBonus)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`SPIFF: ${formatCurrency(sp)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Attainment</p>
                    <p className={`text-lg font-bold`}>{`{att}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Base Bonus</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(attainmentBonus)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Accelerator</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(acceleratorBonus)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Bonus</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalBonus)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Sales bonus: base bonus at 100% attainment, accelerator (e.g., 2% per 1% above 100%) for over-achievement, SPIFFs for specific behaviors. Example: 110% attainment, $20k base, 2% accelerator = $20k + $4k + SPIFF. Typical pay mix: 60% base, 40% variable. See our Incentive Calculator for full OTE.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Attainment', valueA: `${compareA.att}%`, valueB: `${compareB.att}%`, numA: compareA.att, numB: compareB.att },
          { label: 'Base Bonus', valueA: formatCurrency(compareA.attainmentBonus), valueB: formatCurrency(compareB.attainmentBonus), numA: compareA.attainmentBonus, numB: compareB.attainmentBonus },
          { label: 'Total Bonus', valueA: formatCurrency(compareA.totalBonus), valueB: formatCurrency(compareB.totalBonus), numA: compareA.totalBonus, numB: compareB.totalBonus }
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
