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

interface Snapshot { income: number; annualBillable: number; grossNeeded: number; hourlyRate: number; dailyRate: number; label: string; }

export default function FreelanceHourlyRateCalculator() {
  const [desiredIncome, setDesiredIncome] = useState('');
  const [businessExpenses, setBusinessExpenses] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [billableHours, setBillableHours] = useState('');
  const [weeksOff, setWeeksOff] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ desiredIncome: string; businessExpenses: string; taxRate: string; billableHours: string; weeksOff: string }>('freelance-hourly-rate-calculator');

  const income = parseFloat(desiredIncome) || 0;
  const expenses = parseFloat(businessExpenses) || 0;
  const tax = parseFloat(taxRate) || 0;
  const bhpw = parseFloat(billableHours) || 0;
  const off = parseFloat(weeksOff) || 0;
  const workWeeks = 52 - off;
  const annualBillable = workWeeks * bhpw;
  const grossNeeded = (income + expenses) / (1 - tax / 100);
  const hourlyRate = annualBillable > 0 ? grossNeeded / annualBillable : 0;
  const dailyRate = hourlyRate * 8;

  const handleTryExample = () => { setDesiredIncome('50000'); setBusinessExpenses('5000'); setTaxRate('30'); setBillableHours('25'); setWeeksOff('4'); setCalculated(false); };
  const handleCalculate = () => {
    if (income > 0 && bhpw > 0) {
      setCalculated(true);
      saveEntry({ desiredIncome, businessExpenses, taxRate, billableHours, weeksOff }, `Rate: ${formatCurrency(hourlyRate)}/hr (${annualBillable}h billable)`);
    }
  };
  const handleReset = () => { setDesiredIncome(''); setBusinessExpenses(''); setTaxRate('30'); setBillableHours(''); setWeeksOff('4'); setCalculated(false); };
  const handleRestore = (i: { desiredIncome: string; businessExpenses: string; taxRate: string; billableHours: string; weeksOff: string }) => { setDesiredIncome(i.desiredIncome); setBusinessExpenses(i.businessExpenses); setTaxRate(i.taxRate); setBillableHours(i.billableHours); setWeeksOff(i.weeksOff); setCalculated(true); };
  const snap = (): Snapshot => ({ income, annualBillable, grossNeeded, hourlyRate, dailyRate, label: `Rate: ${formatCurrency(hourlyRate)}/hr` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Calculate your freelance hourly rate from desired annual income, expenses, billable hours, and self-employment tax.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="desiredIncome">Desired Annual Income (after tax)</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="desiredIncome" type="number" step="any" min="0" placeholder="50000" className="pl-7"
                value={desiredIncome} onChange={(e) => { setDesiredIncome(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessExpenses">Annual Business Expenses</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="businessExpenses" type="number" step="any" min="0" placeholder="5000" className="pl-7"
                value={businessExpenses} onChange={(e) => { setBusinessExpenses(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxRate">Self-Employment Tax Rate (%)</Label>
            <div className="relative">
              
              <Input id="taxRate" type="number" step="any" min="0" placeholder="30"
                value={taxRate} onChange={(e) => { setTaxRate(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Includes SECA + income tax</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="billableHours">Billable Hours per Week</Label>
            <div className="relative">
              
              <Input id="billableHours" type="number" step="any" min="0" placeholder="25"
                value={billableHours} onChange={(e) => { setBillableHours(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Out of 40 work hours</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weeksOff">Weeks Off per Year</Label>
            <div className="relative">
              
              <Input id="weeksOff" type="number" step="any" min="0" placeholder="4"
                value={weeksOff} onChange={(e) => { setWeeksOff(e.target.value); setCalculated(false); }} />
            </div>
            <p className="text-xs text-muted-foreground">Vacation, sick, holidays</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={income <= 0 || bhpw <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Freelance Rate
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Required Hourly Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(hourlyRate)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`${annualBillable}h billable/year`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Gross needed: ${formatCurrency(grossNeeded)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Daily rate: ${formatCurrency(dailyRate)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Billable Hours/Yr</p>
                    <p className={`text-lg font-bold`}>{`{annualBillable}h`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Gross Needed</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(grossNeeded)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Hourly Rate</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(hourlyRate)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Daily Rate</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(dailyRate)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Freelance hourly rate = (desired income + expenses) / (1 - tax%) / annual billable hours. Only ~60% of work hours are billable (admin, marketing, training). Self-employment tax ~30% (SECA 15.3% + income tax). See our Self Employment Tax Calculator.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Billable Hours', valueA: `${compareA.annualBillable}h`, valueB: `${compareB.annualBillable}h`, numA: compareA.annualBillable, numB: compareB.annualBillable },
          { label: 'Gross Needed', valueA: formatCurrency(compareA.grossNeeded), valueB: formatCurrency(compareB.grossNeeded), numA: compareA.grossNeeded, numB: compareB.grossNeeded },
          { label: 'Hourly Rate', valueA: formatCurrency(compareA.hourlyRate), valueB: formatCurrency(compareB.hourlyRate), numA: compareA.hourlyRate, numB: compareB.hourlyRate }
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
