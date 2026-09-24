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

interface Snapshot { income: number; exp: number; hrs: number; pm: number; totalNeeded: number; hourlyRate: number; dailyRate: number; projectRate: number; retainer: number; label: string; }

export default function ConsultantFeeCalculator() {
  const [annualIncome, setAnnualIncome] = useState('');
  const [businessExp, setBusinessExp] = useState('');
  const [billableHrs, setBillableHrs] = useState('');
  const [profitMargin, setProfitMargin] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ annualIncome: string; businessExp: string; billableHrs: string; profitMargin: string }>('consultant-fee-calculator');

  const income = parseFloat(annualIncome) || 0;
  const exp = parseFloat(businessExp) || 0;
  const hrs = parseFloat(billableHrs) || 0;
  const pm = parseFloat(profitMargin) || 0;
  const totalNeeded = (income + exp) / (1 - pm / 100);
  const hourlyRate = hrs > 0 ? totalNeeded / hrs : 0;
  const dailyRate = hourlyRate * 8;
  const projectRate = hourlyRate * 40;
  const retainer = hourlyRate * 20;

  const handleTryExample = () => { setAnnualIncome('150000'); setBusinessExp('15000'); setBillableHrs('1500'); setProfitMargin('20'); setCalculated(false); };
  const handleCalculate = () => {
    if (income > 0 && hrs > 0) {
      setCalculated(true);
      saveEntry({ annualIncome, businessExp, billableHrs, profitMargin }, `Rate: ${formatCurrency(hourlyRate)}/hr (daily ${formatCurrency(dailyRate)})`);
    }
  };
  const handleReset = () => { setAnnualIncome(''); setBusinessExp(''); setBillableHrs(''); setProfitMargin('20'); setCalculated(false); };
  const handleRestore = (i: { annualIncome: string; businessExp: string; billableHrs: string; profitMargin: string }) => { setAnnualIncome(i.annualIncome); setBusinessExp(i.businessExp); setBillableHrs(i.billableHrs); setProfitMargin(i.profitMargin); setCalculated(true); };
  const snap = (): Snapshot => ({ income, exp, hrs, pm, totalNeeded, hourlyRate, dailyRate, projectRate, retainer, label: `Rate: ${formatCurrency(hourlyRate)}/hr` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <DollarSign className="inline h-3 w-3 mr-1" />
          {`Calculate consultant fees: hourly, daily, project, and retainer. Benchmarks: management $200-500/hr, IT $150-300.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="annualIncome">Desired Annual Income</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="annualIncome" type="number" step="any" min="0" placeholder="150000" className="pl-7"
                value={annualIncome} onChange={(e) => { setAnnualIncome(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessExp">Annual Business Expenses</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="businessExp" type="number" step="any" min="0" placeholder="15000" className="pl-7"
                value={businessExp} onChange={(e) => { setBusinessExp(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="billableHrs">Billable Hours per Year</Label>
            <div className="relative">
              
              <Input id="billableHrs" type="number" step="any" min="0" placeholder="1500"
                value={billableHrs} onChange={(e) => { setBillableHrs(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profitMargin">Profit Margin (%)</Label>
            <div className="relative">
              
              <Input id="profitMargin" type="number" step="any" min="0" placeholder="20"
                value={profitMargin} onChange={(e) => { setProfitMargin(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={income <= 0 || hrs <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Consultant Fee
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Consultant Fees</p>
                <p className="text-4xl font-bold text-emerald-600">{formatCurrency(hourlyRate)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Daily rate: ${formatCurrency(dailyRate)}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Weekly project: ${formatCurrency(projectRate)}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Half-time retainer: ${formatCurrency(retainer)}/mo`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Annual Need</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(totalNeeded)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Hourly Rate</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatCurrency(hourlyRate)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Daily Rate</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(dailyRate)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Project Rate</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(projectRate)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Consultant hourly rate = (desired income + expenses) / (1 - profit margin) / billable hours. Benchmarks: management consulting $200-500/hr, IT $150-300, marketing $100-250, HR $150-300. Billable hours: 1,000-1,800/year.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Annual Need', valueA: formatCurrency(compareA.totalNeeded), valueB: formatCurrency(compareB.totalNeeded), numA: compareA.totalNeeded, numB: compareB.totalNeeded },
          { label: 'Hourly', valueA: formatCurrency(compareA.hourlyRate), valueB: formatCurrency(compareB.hourlyRate), numA: compareA.hourlyRate, numB: compareB.hourlyRate },
          { label: 'Daily', valueA: formatCurrency(compareA.dailyRate), valueB: formatCurrency(compareB.dailyRate), numA: compareA.dailyRate, numB: compareB.dailyRate }
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
