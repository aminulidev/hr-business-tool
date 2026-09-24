'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { ft: number; ptHours: number; ptFTE: number; totalFTE: number; acaFTE: number; label: string; }

export default function FTECalculator() {
  const [fullTimeEmps, setFullTimeEmps] = useState('');
  const [partTimeHours, setPartTimeHours] = useState('Sum of all PT employees weekly hours');
  const [fullTimeHours, setFullTimeHours] = useState('Standard 40, ACA 30');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ fullTimeEmps: string; partTimeHours: string; fullTimeHours: string }>('fte-calculator');

  const ft = parseFloat(fullTimeEmps) || 0;
  const ptHours = parseFloat(partTimeHours) || 0;
  const ftHours = parseFloat(fullTimeHours) || 40;
  const ptFTE = ptHours / ftHours;
  const totalFTE = ft + ptFTE;
  const acaFTE = ft + (ptHours / 30);

  const handleTryExample = () => { setFullTimeEmps('10'); setPartTimeHours('120'); setFullTimeHours('40'); setCalculated(false); };
  const handleCalculate = () => {
    if (ft >= 0 && ptHours >= 0) {
      setCalculated(true);
      saveEntry({ fullTimeEmps, partTimeHours, fullTimeHours }, `${totalFTE.toFixed(1)} FTE (${ft} FT + ${ptFTE.toFixed(1)} from PT)`);
    }
  };
  const handleReset = () => { setFullTimeEmps(''); setPartTimeHours(''); setFullTimeHours('40'); setCalculated(false); };
  const handleRestore = (i: { fullTimeEmps: string; partTimeHours: string; fullTimeHours: string }) => { setFullTimeEmps(i.fullTimeEmps); setPartTimeHours(i.partTimeHours); setFullTimeHours(i.fullTimeHours); setCalculated(true); };
  const snap = (): Snapshot => ({ ft, ptHours, ptFTE, totalFTE, acaFTE, label: `${totalFTE.toFixed(1)} FTE` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Users className="inline h-3 w-3 mr-1" />
          {`FTE = total part-time hours / standard full-time hours (typically 40h/week or 2,080h/year). ACA uses 30h/week threshold.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullTimeEmps">Full-Time Employees</Label>
            <div className="relative">
              
              <Input id="fullTimeEmps" type="number" step="any" min="0" placeholder="10"
                value={fullTimeEmps} onChange={(e) => { setFullTimeEmps(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="partTimeHours">Total Part-Time Hours/Week</Label>
            <div className="relative">
              
              <Input id="partTimeHours" type="number" step="any" min="0" placeholder="120"
                value={partTimeHours} onChange={(e) => { setPartTimeHours(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Sum of all PT employees weekly hours</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullTimeHours">Full-Time Hours/Week</Label>
            <div className="relative">
              
              <Input id="fullTimeHours" type="number" step="any" min="0" placeholder="40"
                value={fullTimeHours} onChange={(e) => { setFullTimeHours(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Standard 40, ACA 30</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={ft < 0 || ptHours < 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate FTE
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total FTE</p>
                <p className="text-4xl font-bold text-emerald-600">{`{totalFTE.toFixed(1)} FTE`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`${ft} full-time`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`${ptFTE.toFixed(1)} from part-time`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`ACA FTE: ${acaFTE.toFixed(1)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Full-Time Emps</p>
                    <p className={`text-lg font-bold`}>{`{ft}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">PT Hours/Week</p>
                    <p className={`text-lg font-bold`}>{`{ptHours}h`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">PT to FTE</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{ptFTE.toFixed(2)}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ACA FTE</p>
                    <p className={`text-lg font-bold`}>{`{acaFTE.toFixed(1)}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`FTE (Full-Time Equivalent) standardizes part-time hours to full-time units. ACA counts employees working 30h+/week as full-time. For ACA compliance, count FTEs (including PT equivalents) — employers with 50+ FTEs must offer health insurance. Standard 40h/week = 2,080h/year.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Full-Time', valueA: String(compareA.ft), valueB: String(compareB.ft), numA: compareA.ft, numB: compareB.ft },
          { label: 'PT Hours', valueA: `${compareA.ptHours}h`, valueB: `${compareB.ptHours}h`, numA: compareA.ptHours, numB: compareB.ptHours },
          { label: 'Total FTE', valueA: compareA.totalFTE.toFixed(1), valueB: compareB.totalFTE.toFixed(1), numA: compareA.totalFTE, numB: compareB.totalFTE },
          { label: 'ACA FTE', valueA: compareA.acaFTE.toFixed(1), valueB: compareB.acaFTE.toFixed(1), numA: compareA.acaFTE, numB: compareB.acaFTE }
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
