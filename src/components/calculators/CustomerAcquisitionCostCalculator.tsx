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

interface Snapshot { mkt: number; sales: number; totalSpend: number; cust: number; cac: number; label: string; }

export default function CustomerAcquisitionCostCalculator() {
  const [marketingSpend, setMarketingSpend] = useState('');
  const [salesSpend, setSalesSpend] = useState('');
  const [newCustomers, setNewCustomers] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ marketingSpend: string; salesSpend: string; newCustomers: string }>('customer-acquisition-cost-calculator');

  const mkt = parseFloat(marketingSpend) || 0;
  const sales = parseFloat(salesSpend) || 0;
  const cust = parseFloat(newCustomers) || 0;
  const totalSpend = mkt + sales;
  const cac = cust > 0 ? totalSpend / cust : 0;

  const handleTryExample = () => { setMarketingSpend('50000'); setSalesSpend('40000'); setNewCustomers('100'); setCalculated(false); };
  const handleCalculate = () => {
    if (cust > 0) {
      setCalculated(true);
      saveEntry({ marketingSpend, salesSpend, newCustomers }, `CAC: ${formatCurrency(cac)} (${cust} customers for ${formatCurrency(totalSpend)})`);
    }
  };
  const handleReset = () => { setMarketingSpend(''); setSalesSpend(''); setNewCustomers(''); setCalculated(false); };
  const handleRestore = (i: { marketingSpend: string; salesSpend: string; newCustomers: string }) => { setMarketingSpend(i.marketingSpend); setSalesSpend(i.salesSpend); setNewCustomers(i.newCustomers); setCalculated(true); };
  const snap = (): Snapshot => ({ mkt, sales, totalSpend, cust, cac, label: `CAC: ${formatCurrency(cac)}` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`CAC = total sales + marketing spend / new customers. SaaS benchmark: CAC payback <12 months, LTV:CAC >3:1.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="marketingSpend">Marketing Spend</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="marketingSpend" type="number" step="any" min="0" placeholder="50000" className="pl-7"
                value={marketingSpend} onChange={(e) => { setMarketingSpend(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="salesSpend">Sales Spend (salaries, tools)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="salesSpend" type="number" step="any" min="0" placeholder="40000" className="pl-7"
                value={salesSpend} onChange={(e) => { setSalesSpend(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newCustomers">New Customers Acquired</Label>
            <div className="relative">
              
              <Input id="newCustomers" type="number" step="any" min="0" placeholder="100"
                value={newCustomers} onChange={(e) => { setNewCustomers(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={cust <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate CAC
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Customer Acquisition Cost (CAC)</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(cac)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Total spend: ${formatCurrency(totalSpend)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`New customers: ${cust}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{'Target LTV:CAC > 3:1'}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Marketing</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(mkt)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Sales</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(sales)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Spend</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalSpend)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">CAC</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(cac)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`CAC = (marketing + sales spend) / new customers. Includes ALL costs to acquire: ads, content, sales salaries, tools, events. SaaS benchmark: CAC payback <12 months, LTV:CAC >3:1. Track blended CAC (all channels) and paid CAC (paid only). See our CAC Payback and CLV Calculators.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total Spend', valueA: formatCurrency(compareA.totalSpend), valueB: formatCurrency(compareB.totalSpend), numA: compareA.totalSpend, numB: compareB.totalSpend },
          { label: 'Customers', valueA: String(compareA.cust), valueB: String(compareB.cust), numA: compareA.cust, numB: compareB.cust },
          { label: 'CAC', valueA: formatCurrency(compareA.cac), valueB: formatCurrency(compareB.cac), numA: compareA.cac, numB: compareB.cac }
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
