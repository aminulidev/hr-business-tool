'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import TryExample from './TryExample';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency } from '@/lib/utils';

interface CphSnap { totalCost: number; numHires: number; cph: number; label: string; }

export default function CostPerHireCalculator() {
  const [internalRecruiting, setInternalRecruiting] = useState('');
  const [externalAgency, setExternalAgency] = useState('');
  const [jobBoards, setJobBoards] = useState('');
  const [backgroundChecks, setBackgroundChecks] = useState('');
  const [travelRelocation, setTravelRelocation] = useState('');
  const [otherCosts, setOtherCosts] = useState('');
  const [numHires, setNumHires] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<CphSnap | null>(null);
  const [compareB, setCompareB] = useState<CphSnap | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ numHires: string; internalRecruiting: string; externalAgency: string }>('cost-per-hire-calculator');

  const parse = (v: string) => parseFloat(v) || 0;
  const internal = parse(internalRecruiting);
  const external = parse(externalAgency);
  const boards = parse(jobBoards);
  const bg = parse(backgroundChecks);
  const travel = parse(travelRelocation);
  const other = parse(otherCosts);
  const hiresNum = parse(numHires);
  const totalCost = internal + external + boards + bg + travel + other;
  const cph = hiresNum > 0 ? totalCost / hiresNum : 0;
  // SHRM 2024 average: ~$4,700
  const shrm = 4700;

    const handleTryExample = () => {
    setInternalRecruiting('5000');
    setExternalAgency('10000');
    setNumHires('15');
    setCalculated(false);
  };

  const handleCalculate = () => {
    if (totalCost > 0 && hiresNum > 0) {
      setCalculated(true);
      saveEntry({ numHires, internalRecruiting, externalAgency }, `${hiresNum} hires · Total: ${formatCurrency(totalCost)} · CPH: ${formatCurrency(cph)}`);
    }
  };
  const handleReset = () => {
    [setInternalRecruiting, setExternalAgency, setJobBoards, setBackgroundChecks, setTravelRelocation, setOtherCosts, setNumHires].forEach(fn => fn(''));
    setCalculated(false);
  };
  const handleRestore = (i: { numHires: string; internalRecruiting: string; externalAgency: string }) => {
    setNumHires(i.numHires); setInternalRecruiting(i.internalRecruiting); setExternalAgency(i.externalAgency); setCalculated(true);
  };
  const snap = (): CphSnap => ({ totalCost, numHires: hiresNum, cph, label: `${hiresNum} hires · ${formatCurrency(cph)}/hire` });

  const costItems = [
    { name: 'Internal Recruiting', value: internal, color: '#6366f1' },
    { name: 'Agency Fees', value: external, color: '#f59e0b' },
    { name: 'Job Boards', value: boards, color: '#10b981' },
    { name: 'Background Checks', value: bg, color: '#ec4899' },
    { name: 'Travel / Relocation', value: travel, color: '#14b8a6' },
    { name: 'Other', value: other, color: '#94a3b8' },
  ].filter(c => c.value > 0);

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'internal-recruiting', label: 'Internal Recruiting Costs', placeholder: '8,000', note: 'HR staff time, ATS software, referral bonuses', value: internalRecruiting, set: setInternalRecruiting },
            { id: 'external-agency', label: 'Agency / Recruiter Fees', placeholder: '15,000', note: 'Staffing agencies, executive search, placement fees', value: externalAgency, set: setExternalAgency },
            { id: 'job-boards', label: 'Job Boards & Advertising', placeholder: '3,000', note: 'LinkedIn, Indeed, Glassdoor, social media ads', value: jobBoards, set: setJobBoards },
            { id: 'background-checks', label: 'Background Checks & Screening', placeholder: '500', note: 'Criminal, drug, skills assessments, reference checks', value: backgroundChecks, set: setBackgroundChecks },
            { id: 'travel-relocation', label: 'Travel & Relocation', placeholder: '2,000', note: 'Candidate travel, new hire relocation packages', value: travelRelocation, set: setTravelRelocation },
            { id: 'other-costs', label: 'Other Recruiting Costs', placeholder: '0', note: 'Sign-on bonuses, equipment, training materials', value: otherCosts, set: setOtherCosts },
          ].map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <div className="relative">
                <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <Input id={field.id} type="number" step="100" min="0" placeholder={field.placeholder}
                  value={field.value} onChange={(e) => { field.set(e.target.value); setCalculated(false); }} className="pl-7" />
              </div>
              <p className="text-xs text-muted-foreground">{field.note}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2 border-t border-border/50">
          <Label htmlFor="num-hires" className="font-semibold">Number of Hires</Label>
          <Input id="num-hires" type="number" step="1" min="1" placeholder="10" className="max-w-xs"
            value={numHires} onChange={(e) => { setNumHires(e.target.value); setCalculated(false); }} />
        </div>

        {totalCost > 0 && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-3 text-sm text-indigo-700 dark:text-indigo-300">
            📊 Total recruiting spend: <strong>{formatCurrency(totalCost)}</strong>
            {hiresNum > 0 && <> → <strong>{formatCurrency(cph)}</strong> per hire</>}
          </motion.div>
        )}

        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-6">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCalculate}
              disabled={totalCost <= 0 || hiresNum <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
              size="lg"
            >
              Calculate Cost per Hire
            </Button>
            <Button variant="outline" size="lg" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="result-display" aria-live="polite">
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Cost per Hire</p>
                <p className="text-4xl font-bold text-indigo-600">{formatCurrency(cph)}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/30 text-indigo-600">{hiresNum} total hires</Badge>
                  <Badge variant="outline" className={cph <= shrm ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-amber-500/10 border-amber-500/30 text-amber-600'}>
                    {cph <= shrm ? `${formatCurrency(shrm - cph)} below` : `${formatCurrency(cph - shrm)} above`} SHRM avg
                  </Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total Recruiting Cost', value: formatCurrency(totalCost) },
                  { label: 'Total Hires', value: `${hiresNum} employees` },
                  { label: 'SHRM 2024 Avg', value: formatCurrency(shrm) },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-lg font-bold">{m.value}</p>
                  </div>
                ))}
              </div>

              {costItems.length > 0 && (
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={costItems} cx="50%" cy="50%" outerRadius={80} paddingAngle={2} dataKey="value">
                        {costItems.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <RechartsTooltip formatter={(v: number) => [formatCurrency(v)]} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                      <Legend iconType="circle" iconSize={10} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Total Recruiting Cost', valueA: formatCurrency(compareA.totalCost), valueB: formatCurrency(compareB.totalCost), numA: compareA.totalCost, numB: compareB.totalCost, higherIsBetter: false },
          { label: 'Number of Hires', valueA: `${compareA.numHires}`, valueB: `${compareB.numHires}`, numA: compareA.numHires, numB: compareB.numHires },
          { label: 'Cost per Hire', valueA: formatCurrency(compareA.cph), valueB: formatCurrency(compareB.cph), numA: compareA.cph, numB: compareB.cph, higherIsBetter: false },
        ];
        return (
          <div className="px-4 pb-6 sm:px-6">
            <ComparePanel rows={rows} labelA={compareA.label} labelB={compareB.label}
              onClear={() => { setCompareA(null); setCompareB(null); }}
              onSwap={() => { const t = compareA; setCompareA(compareB); setCompareB(t); }} />
          </div>
        );
      })()}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory}
          onDelete={deleteEntry} />
    </div>
  );
}
