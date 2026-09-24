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

interface Snapshot { ret: number; proj: number; hrs: number; cr: number; dc: number; totalRevenue: number; laborCost: number; totalCost: number; profit: number; margin: number; hourlyProfit: number; label: string; }

export default function ProfitPerClientCalculator() {
  const [monthlyRetainer, setMonthlyRetainer] = useState('');
  const [projectRevenue, setProjectRevenue] = useState('');
  const [hoursInvested, setHoursInvested] = useState('');
  const [costRate, setCostRate] = useState('');
  const [directCosts, setDirectCosts] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ monthlyRetainer: string; projectRevenue: string; hoursInvested: string; costRate: string; directCosts: string }>('profit-per-client-calculator');

  const ret = parseFloat(monthlyRetainer) || 0;
  const proj = parseFloat(projectRevenue) || 0;
  const hrs = parseFloat(hoursInvested) || 0;
  const cr = parseFloat(costRate) || 0;
  const dc = parseFloat(directCosts) || 0;
  const totalRevenue = ret + proj;
  const laborCost = hrs * cr;
  const totalCost = laborCost + dc;
  const profit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
  const hourlyProfit = hrs > 0 ? profit / hrs : 0;

  const handleTryExample = () => { setMonthlyRetainer('3000'); setProjectRevenue('1000'); setHoursInvested('20'); setCostRate('35'); setDirectCosts('200'); setCalculated(false); };
  const handleCalculate = () => {
    if (totalRevenue > 0) {
      setCalculated(true);
      saveEntry({ monthlyRetainer, projectRevenue, hoursInvested, costRate, directCosts }, `Profit: ${formatCurrency(profit)}/mo (${margin.toFixed(1)}% margin)`);
    }
  };
  const handleReset = () => { setMonthlyRetainer(''); setProjectRevenue(''); setHoursInvested(''); setCostRate(''); setDirectCosts(''); setCalculated(false); };
  const handleRestore = (i: { monthlyRetainer: string; projectRevenue: string; hoursInvested: string; costRate: string; directCosts: string }) => { setMonthlyRetainer(i.monthlyRetainer); setProjectRevenue(i.projectRevenue); setHoursInvested(i.hoursInvested); setCostRate(i.costRate); setDirectCosts(i.directCosts); setCalculated(true); };
  const snap = (): Snapshot => ({ ret, proj, hrs, cr, dc, totalRevenue, laborCost, totalCost, profit, margin, hourlyProfit, label: `Profit: ${formatCurrency(profit)}/mo` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Calculate profit per client from monthly revenue, hourly cost of time invested, and direct costs.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyRetainer">Monthly Retainer/Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="monthlyRetainer" type="number" step="any" min="0" placeholder="3000" className="pl-7"
                value={monthlyRetainer} onChange={(e) => { setMonthlyRetainer(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectRevenue">Additional Project Revenue</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="projectRevenue" type="number" step="any" min="0" placeholder="1000" className="pl-7"
                value={projectRevenue} onChange={(e) => { setProjectRevenue(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hoursInvested">Hours Invested per Month</Label>
            <div className="relative">
              
              <Input id="hoursInvested" type="number" step="any" min="0" placeholder="20"
                value={hoursInvested} onChange={(e) => { setHoursInvested(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="costRate">Your Cost Rate ($/hr)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="costRate" type="number" step="any" min="0" placeholder="35" className="pl-7"
                value={costRate} onChange={(e) => { setCostRate(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="directCosts">Direct Costs (software, subs)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="directCosts" type="number" step="any" min="0" placeholder="200" className="pl-7"
                value={directCosts} onChange={(e) => { setDirectCosts(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={totalRevenue <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Profit Per Client
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Profit Per Client</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(profit)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Margin: ${margin.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Profit/hour: ${formatCurrency(hourlyProfit)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Revenue: ${formatCurrency(totalRevenue)}/mo`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalCost)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Profit</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(profit)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Profit/Hour</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(hourlyProfit)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Profit per client = (retainer + project revenue) - (hours x cost rate) - direct costs. Track per client to identify high-profit (expand), break-even (optimize), and loss clients (reprice or fire).`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Revenue', valueA: formatCurrency(compareA.totalRevenue), valueB: formatCurrency(compareB.totalRevenue), numA: compareA.totalRevenue, numB: compareB.totalRevenue },
          { label: 'Profit', valueA: formatCurrency(compareA.profit), valueB: formatCurrency(compareB.profit), numA: compareA.profit, numB: compareB.profit },
          { label: 'Margin', valueA: `${compareA.margin.toFixed(1)}%`, valueB: `${compareB.margin.toFixed(1)}%`, numA: compareA.margin, numB: compareB.margin }
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
