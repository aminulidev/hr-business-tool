'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { salary: number; mid: number; compaRatio: number; compaPct: number; rangePosition: number; status: string; label: string; }

export default function CompensationRatioCalculator() {
  const [employeeSalary, setEmployeeSalary] = useState('');
  const [marketMidpoint, setMarketMidpoint] = useState('');
  const [marketMin, setMarketMin] = useState('');
  const [marketMax, setMarketMax] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ employeeSalary: string; marketMidpoint: string; marketMin: string; marketMax: string }>('compensation-ratio-calculator');

  const salary = parseFloat(employeeSalary) || 0;
  const mid = parseFloat(marketMidpoint) || 0;
  const mMin = parseFloat(marketMin) || 0;
  const mMax = parseFloat(marketMax) || 0;
  const compaRatio = mid > 0 ? salary / mid : 0;
  const compaPct = compaRatio * 100;
  const rangePosition = mMax > mMin ? ((salary - mMin) / (mMax - mMin)) * 100 : 0;
  const status = compaRatio < 0.9 ? "Underpaid" : compaRatio > 1.1 ? "Overpaid" : "At Market";

  const handleTryExample = () => { setEmployeeSalary('75000'); setMarketMidpoint('80000'); setMarketMin('65000'); setMarketMax('95000'); setCalculated(false); };
  const handleCalculate = () => {
    if (salary > 0 && mid > 0) {
      setCalculated(true);
      saveEntry({ employeeSalary, marketMidpoint, marketMin, marketMax }, `Compa-ratio: ${compaPct.toFixed(1)}% (${status})`);
    }
  };
  const handleReset = () => { setEmployeeSalary(''); setMarketMidpoint(''); setMarketMin(''); setMarketMax(''); setCalculated(false); };
  const handleRestore = (i: { employeeSalary: string; marketMidpoint: string; marketMin: string; marketMax: string }) => { setEmployeeSalary(i.employeeSalary); setMarketMidpoint(i.marketMidpoint); setMarketMin(i.marketMin); setMarketMax(i.marketMax); setCalculated(true); };
  const snap = (): Snapshot => ({ salary, mid, compaRatio, compaPct, rangePosition, status, label: `Compa-ratio: ${compaPct.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Percent className="inline h-3 w-3 mr-1" />
          {`Compa-ratio = employee salary / market midpoint. Identify underpaid (<0.9), at-market (0.9-1.1), and overpaid (>1.1) positions.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="employeeSalary">Employee Salary</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="employeeSalary" type="number" step="any" min="0" placeholder="75000" className="pl-7"
                value={employeeSalary} onChange={(e) => { setEmployeeSalary(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketMidpoint">Market Salary Midpoint</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="marketMidpoint" type="number" step="any" min="0" placeholder="80000" className="pl-7"
                value={marketMidpoint} onChange={(e) => { setMarketMidpoint(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketMin">Market Minimum (optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="marketMin" type="number" step="any" min="0" placeholder="65000" className="pl-7"
                value={marketMin} onChange={(e) => { setMarketMin(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marketMax">Market Maximum (optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="marketMax" type="number" step="any" min="0" placeholder="95000" className="pl-7"
                value={marketMax} onChange={(e) => { setMarketMax(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={salary <= 0 || mid <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Compa-Ratio
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Compa-Ratio</p>
                <p className="text-4xl font-bold text-emerald-600">{`{compaPct.toFixed(1)}%`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Status: ${status}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Range position: ${rangePosition.toFixed(0)}%`}</Badge>
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{'At market = 90-110%'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Employee Salary</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(salary)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Market Mid</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(mid)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Compa-Ratio</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`{compaPct.toFixed(1)}%`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Range Pos</p>
                    <p className={`text-lg font-bold`}>{`{rangePosition.toFixed(0)}%`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Compa-ratio = salary / market midpoint. Below 90% = underpaid (retention risk). 90-110% = at market. Above 110% = overpaid (equity concern). Range position = (salary - min) / (max - min). Used for pay equity analysis and salary band management.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Salary', valueA: formatCurrency(compareA.salary), valueB: formatCurrency(compareB.salary), numA: compareA.salary, numB: compareB.salary },
          { label: 'Midpoint', valueA: formatCurrency(compareA.mid), valueB: formatCurrency(compareB.mid), numA: compareA.mid, numB: compareB.mid },
          { label: 'Compa-Ratio', valueA: `${compareA.compaPct.toFixed(1)}%`, valueB: `${compareB.compaPct.toFixed(1)}%`, numA: compareA.compaPct, numB: compareB.compaPct },
          { label: 'Range Position', valueA: `${compareA.rangePosition.toFixed(0)}%`, valueB: `${compareB.rangePosition.toFixed(0)}%`, numA: compareA.rangePosition, numB: compareB.rangePosition }
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
