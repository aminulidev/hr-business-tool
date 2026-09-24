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

interface Snapshot { m1h: number; m1r: number; m2h: number; m2r: number; m3h: number; m3r: number; oh: number; m1Cost: number; m2Cost: number; m3Cost: number; laborCost: number; overhead: number; totalCost: number; totalHours: number; avgRate: number; label: string; }

export default function TeamCostCalculator() {
  const [member1Hours, setMember1Hours] = useState('');
  const [member1Rate, setMember1Rate] = useState('');
  const [member2Hours, setMember2Hours] = useState('');
  const [member2Rate, setMember2Rate] = useState('');
  const [member3Hours, setMember3Hours] = useState('');
  const [member3Rate, setMember3Rate] = useState('');
  const [overheadPct, setOverheadPct] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ member1Hours: string; member1Rate: string; member2Hours: string; member2Rate: string; member3Hours: string; member3Rate: string; overheadPct: string }>('team-cost-calculator');

  const m1h = parseFloat(member1Hours) || 0;
  const m1r = parseFloat(member1Rate) || 0;
  const m2h = parseFloat(member2Hours) || 0;
  const m2r = parseFloat(member2Rate) || 0;
  const m3h = parseFloat(member3Hours) || 0;
  const m3r = parseFloat(member3Rate) || 0;
  const oh = parseFloat(overheadPct) || 0;
  const m1Cost = m1h * m1r;
  const m2Cost = m2h * m2r;
  const m3Cost = m3h * m3r;
  const laborCost = m1Cost + m2Cost + m3Cost;
  const overhead = laborCost * (oh / 100);
  const totalCost = laborCost + overhead;
  const totalHours = m1h + m2h + m3h;
  const avgRate = totalHours > 0 ? totalCost / totalHours : 0;

  const handleTryExample = () => { setMember1Hours('40'); setMember1Rate('100'); setMember2Hours('60'); setMember2Rate('75'); setMember3Hours('20'); setMember3Rate('50'); setOverheadPct('30'); setCalculated(false); };
  const handleCalculate = () => {
    if (totalHours > 0) {
      setCalculated(true);
      saveEntry({ member1Hours, member1Rate, member2Hours, member2Rate, member3Hours, member3Rate, overheadPct }, `Cost: ${formatCurrency(totalCost)} (${totalHours}h, ${formatCurrency(avgRate)}/hr avg)`);
    }
  };
  const handleReset = () => { setMember1Hours(''); setMember1Rate(''); setMember2Hours(''); setMember2Rate(''); setMember3Hours(''); setMember3Rate(''); setOverheadPct('30'); setCalculated(false); };
  const handleRestore = (i: { member1Hours: string; member1Rate: string; member2Hours: string; member2Rate: string; member3Hours: string; member3Rate: string; overheadPct: string }) => { setMember1Hours(i.member1Hours); setMember1Rate(i.member1Rate); setMember2Hours(i.member2Hours); setMember2Rate(i.member2Rate); setMember3Hours(i.member3Hours); setMember3Rate(i.member3Rate); setOverheadPct(i.overheadPct); setCalculated(true); };
  const snap = (): Snapshot => ({ m1h, m1r, m2h, m2r, m3h, m3r, oh, m1Cost, m2Cost, m3Cost, laborCost, overhead, totalCost, totalHours, avgRate, label: `Cost: ${formatCurrency(totalCost)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Users className="inline h-3 w-3 mr-1" />
          {`Calculate total project team cost: each member's hours, rate, and role. See loaded cost with overhead.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="member1Hours">Member 1 Hours</Label>
            <div className="relative">
              
              <Input id="member1Hours" type="number" step="any" min="0" placeholder="40"
                value={member1Hours} onChange={(e) => { setMember1Hours(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="member1Rate">Member 1 Rate ($/hr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="member1Rate" type="number" step="any" min="0" placeholder="100" className="pl-7"
                value={member1Rate} onChange={(e) => { setMember1Rate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="member2Hours">Member 2 Hours</Label>
            <div className="relative">
              
              <Input id="member2Hours" type="number" step="any" min="0" placeholder="60"
                value={member2Hours} onChange={(e) => { setMember2Hours(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="member2Rate">Member 2 Rate ($/hr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="member2Rate" type="number" step="any" min="0" placeholder="75" className="pl-7"
                value={member2Rate} onChange={(e) => { setMember2Rate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="member3Hours">Member 3 Hours</Label>
            <div className="relative">
              
              <Input id="member3Hours" type="number" step="any" min="0" placeholder="20"
                value={member3Hours} onChange={(e) => { setMember3Hours(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="member3Rate">Member 3 Rate ($/hr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="member3Rate" type="number" step="any" min="0" placeholder="50" className="pl-7"
                value={member3Rate} onChange={(e) => { setMember3Rate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="overheadPct">Overhead (%)</Label>
            <div className="relative">
              
              <Input id="overheadPct" type="number" step="any" min="0" placeholder="30"
                value={overheadPct} onChange={(e) => { setOverheadPct(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={totalHours <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Team Cost
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Team Cost</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(totalCost)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Labor: ${formatCurrency(laborCost)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Overhead: ${formatCurrency(overhead)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Avg loaded rate: ${formatCurrency(avgRate)}/hr`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Hours</p>
                    <p className={`text-lg font-bold`}>{`{totalHours}h`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Labor Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(laborCost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Overhead</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(overhead)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(totalCost)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Team cost = sum of (member hours x rate) x (1 + overhead%). Overhead: 25-50% (covers admin, rent, tools, benefits). Avg loaded rate = total cost / total hours. Use for: project budgeting, pricing, staffing decisions.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total Hours', valueA: `${compareA.totalHours}h`, valueB: `${compareB.totalHours}h`, numA: compareA.totalHours, numB: compareB.totalHours },
          { label: 'Labor', valueA: formatCurrency(compareA.laborCost), valueB: formatCurrency(compareB.laborCost), numA: compareA.laborCost, numB: compareB.laborCost },
          { label: 'Total Cost', valueA: formatCurrency(compareA.totalCost), valueB: formatCurrency(compareB.totalCost), numA: compareA.totalCost, numB: compareB.totalCost }
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
