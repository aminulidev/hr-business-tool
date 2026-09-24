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

interface Snapshot { start: number; end: number; newC: number; retained: number; retentionRate: number; churnRate: number; churned: number; label: string; }

export default function CustomerRetentionCalculator() {
  const [startCustomers, setStartCustomers] = useState('');
  const [endCustomers, setEndCustomers] = useState('');
  const [newCustomers, setNewCustomers] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ startCustomers: string; endCustomers: string; newCustomers: string }>('customer-retention-calculator');

  const start = parseFloat(startCustomers) || 0;
  const end = parseFloat(endCustomers) || 0;
  const newC = parseFloat(newCustomers) || 0;
  const retained = end - newC;
  const retentionRate = start > 0 ? (retained / start) * 100 : 0;
  const churnRate = start > 0 ? ((start - retained) / start) * 100 : 0;
  const churned = start - retained;

  const handleTryExample = () => { setStartCustomers('500'); setEndCustomers('480'); setNewCustomers('50'); setCalculated(false); };
  const handleCalculate = () => {
    if (start > 0) {
      setCalculated(true);
      saveEntry({ startCustomers, endCustomers, newCustomers }, `Retention: ${retentionRate.toFixed(1)}%, Churn: ${churnRate.toFixed(1)}%`);
    }
  };
  const handleReset = () => { setStartCustomers(''); setEndCustomers(''); setNewCustomers(''); setCalculated(false); };
  const handleRestore = (i: { startCustomers: string; endCustomers: string; newCustomers: string }) => { setStartCustomers(i.startCustomers); setEndCustomers(i.endCustomers); setNewCustomers(i.newCustomers); setCalculated(true); };
  const snap = (): Snapshot => ({ start, end, newC, retained, retentionRate, churnRate, churned, label: `Retention: ${retentionRate.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Users className="inline h-3 w-3 mr-1" />
          {`Customer retention rate = ((start + new - end) / start) × 100. SaaS benchmark: NRR >110%, logo retention >90%.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startCustomers">Customers at Start</Label>
            <div className="relative">
              
              <Input id="startCustomers" type="number" step="any" min="0" placeholder="500"
                value={startCustomers} onChange={(e) => { setStartCustomers(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endCustomers">Customers at End</Label>
            <div className="relative">
              
              <Input id="endCustomers" type="number" step="any" min="0" placeholder="480"
                value={endCustomers} onChange={(e) => { setEndCustomers(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newCustomers">New Customers Acquired</Label>
            <div className="relative">
              
              <Input id="newCustomers" type="number" step="any" min="0" placeholder="50"
                value={newCustomers} onChange={(e) => { setNewCustomers(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={start <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Customer Retention
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Customer Retention Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{formatPercent(retentionRate)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-red-500/10 border-red-500/30 text-red-600'">{`Churn rate: ${formatPercent(churnRate)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Retained: ${retained}, Churned: ${churned}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'SaaS: NRR >110%, logo >90%'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Start</p>
                    <p className={`text-lg font-bold`}>{`{start}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">End</p>
                    <p className={`text-lg font-bold`}>{`{end}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Retention</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatPercent(retentionRate)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Churn</p>
                    <p className={`text-lg font-bold`}>{formatPercent(churnRate)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Customer retention = ((start + new - end) / start) × 100. Churn = 100 - retention. SaaS benchmarks: logo retention >90% (churn <10%), NRR (net revenue retention) >110% (expansion > churn). Track by cohort, segment, plan tier. Improve retention: onboarding, CS, product, pricing. See our CLV Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Start', valueA: String(compareA.start), valueB: String(compareB.start), numA: compareA.start, numB: compareB.start },
          { label: 'Retained', valueA: String(compareA.retained), valueB: String(compareB.retained), numA: compareA.retained, numB: compareB.retained },
          { label: 'Retention %', valueA: formatPercent(compareA.retentionRate), valueB: formatPercent(compareB.retentionRate), numA: compareA.retentionRate, numB: compareB.retentionRate },
          { label: 'Churn %', valueA: formatPercent(compareA.churnRate), valueB: formatPercent(compareB.churnRate), numA: compareA.churnRate, numB: compareB.churnRate }
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
