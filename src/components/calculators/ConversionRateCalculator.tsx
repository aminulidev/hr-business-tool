'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { leads: number; mqls: number; sqls: number; opps: number; cust: number; leadToMQL: number; mqlToSQL: number; sqlToOpp: number; oppToCust: number; overall: number; label: string; }

export default function ConversionRateCalculator() {
  const [leadsInput, setLeadsInput] = useState('');
  const [mqlsInput, setMqlsInput] = useState('');
  const [sqlsInput, setSqlsInput] = useState('');
  const [oppsInput, setOppsInput] = useState('');
  const [customersInput, setCustomersInput] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ leadsInput: string; mqlsInput: string; sqlsInput: string; oppsInput: string; customersInput: string }>('conversion-rate-calculator');

  const leads = parseFloat(leadsInput) || 0;
  const mqls = parseFloat(mqlsInput) || 0;
  const sqls = parseFloat(sqlsInput) || 0;
  const opps = parseFloat(oppsInput) || 0;
  const cust = parseFloat(customersInput) || 0;
  const leadToMQL = leads > 0 ? (mqls / leads) * 100 : 0;
  const mqlToSQL = mqls > 0 ? (sqls / mqls) * 100 : 0;
  const sqlToOpp = sqls > 0 ? (opps / sqls) * 100 : 0;
  const oppToCust = opps > 0 ? (cust / opps) * 100 : 0;
  const overall = leads > 0 ? (cust / leads) * 100 : 0;

  const handleTryExample = () => { setLeadsInput('1000'); setMqlsInput('300'); setSqlsInput('120'); setOppsInput('60'); setCustomersInput('15'); setCalculated(false); };
  const handleCalculate = () => {
    if (leads > 0) {
      setCalculated(true);
      saveEntry({ leadsInput, mqlsInput, sqlsInput, oppsInput, customersInput }, `${overall.toFixed(1)}% overall (${cust}/${leads} leads to customers)`);
    }
  };
  const handleReset = () => { setLeadsInput(''); setMqlsInput(''); setSqlsInput(''); setOppsInput(''); setCustomersInput(''); setCalculated(false); };
  const handleRestore = (i: { leadsInput: string; mqlsInput: string; sqlsInput: string; oppsInput: string; customersInput: string }) => { setLeadsInput(i.leadsInput); setMqlsInput(i.mqlsInput); setSqlsInput(i.sqlsInput); setOppsInput(i.oppsInput); setCustomersInput(i.customersInput); setCalculated(true); };
  const snap = (): Snapshot => ({ leads, mqls, sqls, opps, cust, leadToMQL, mqlToSQL, sqlToOpp, oppToCust, overall, label: `Overall: ${overall.toFixed(1)}%` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <BarChart3 className="inline h-3 w-3 mr-1" />
          {`Calculate conversion rate at each funnel stage: lead → MQL → SQL → opportunity → customer.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="leadsInput">Total Leads</Label>
            <div className="relative">
              
              <Input id="leadsInput" type="number" step="any" min="0" placeholder="1000"
                value={leadsInput} onChange={(e) => { setLeadsInput(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mqlsInput">MQLs (Marketing Qualified)</Label>
            <div className="relative">
              
              <Input id="mqlsInput" type="number" step="any" min="0" placeholder="300"
                value={mqlsInput} onChange={(e) => { setMqlsInput(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sqlsInput">SQLs (Sales Qualified)</Label>
            <div className="relative">
              
              <Input id="sqlsInput" type="number" step="any" min="0" placeholder="120"
                value={sqlsInput} onChange={(e) => { setSqlsInput(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="oppsInput">Opportunities</Label>
            <div className="relative">
              
              <Input id="oppsInput" type="number" step="any" min="0" placeholder="60"
                value={oppsInput} onChange={(e) => { setOppsInput(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="customersInput">Customers Won</Label>
            <div className="relative">
              
              <Input id="customersInput" type="number" step="any" min="0" placeholder="15"
                value={customersInput} onChange={(e) => { setCustomersInput(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={leads <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Conversion Rate
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Overall Conversion Rate</p>
                <p className="text-4xl font-bold text-emerald-600">{`${formatPercent(overall)}`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Lead-to-MQL: ${leadToMQL.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`MQL-to-SQL: ${mqlToSQL.toFixed(1)}%`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`SQL-to-Opp: ${sqlToOpp.toFixed(1)}%, Opp-to-Cust: ${oppToCust.toFixed(1)}%`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Leads</p>
                    <p className={`text-lg font-bold`}>{`{leads}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">MQLs</p>
                    <p className={`text-lg font-bold`}>{`{mqls}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Customers</p>
                    <p className={`text-lg font-bold`}>{`{cust}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Overall Conv</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{formatPercent(overall)}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Conversion rate = converted / total × 100. Track at each funnel stage: Lead→MQL (20-30%), MQL→SQL (30-40%), SQL→Opp (40-50%), Opp→Cust (20-30%). Overall: 1-3% lead-to-customer. Identify bottleneck stage. See our Win Rate Calculator for opportunity-stage conversion.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Leads', valueA: String(compareA.leads), valueB: String(compareB.leads), numA: compareA.leads, numB: compareB.leads },
          { label: 'Customers', valueA: String(compareA.cust), valueB: String(compareB.cust), numA: compareA.cust, numB: compareB.cust },
          { label: 'Overall', valueA: formatPercent(compareA.overall), valueB: formatPercent(compareB.overall), numA: compareA.overall, numB: compareB.overall }
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
