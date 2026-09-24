'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface Snapshot { target: number; deal: number; dealsNeeded: number; meetingsNeeded: number; leadsNeeded: number; label: string; }

export default function SalesTargetCalculator() {
  const [revenueTarget, setRevenueTarget] = useState('');
  const [avgDealSize, setAvgDealSize] = useState('');
  const [meetingToClose, setMeetingToClose] = useState('');
  const [leadToMeeting, setLeadToMeeting] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [compareA, setCompareA] = useState<Snapshot | null>(null);
  const [compareB, setCompareB] = useState<Snapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ revenueTarget: string; avgDealSize: string; meetingToClose: string; leadToMeeting: string }>('sales-target-calculator');

  const target = parseFloat(revenueTarget) || 0;
  const deal = parseFloat(avgDealSize) || 0;
  const m2c = parseFloat(meetingToClose) || 0;
  const l2m = parseFloat(leadToMeeting) || 0;
  const dealsNeeded = deal > 0 ? Math.ceil(target / deal) : 0;
  const meetingsNeeded = m2c > 0 ? Math.ceil(dealsNeeded / (m2c / 100)) : 0;
  const leadsNeeded = l2m > 0 ? Math.ceil(meetingsNeeded / (l2m / 100)) : 0;

  const handleTryExample = () => { setRevenueTarget('1000000'); setAvgDealSize('25000'); setMeetingToClose('25'); setLeadToMeeting('30'); setCalculated(false); };
  const handleCalculate = () => {
    if (target > 0 && deal > 0) {
      setCalculated(true);
      saveEntry({ revenueTarget, avgDealSize, meetingToClose, leadToMeeting }, `${dealsNeeded} deals, ${meetingsNeeded} meetings, ${leadsNeeded} leads for ${formatCurrency(target)}`);
    }
  };
  const handleReset = () => { setRevenueTarget(''); setAvgDealSize(''); setMeetingToClose('25'); setLeadToMeeting('30'); setCalculated(false); };
  const handleRestore = (i: { revenueTarget: string; avgDealSize: string; meetingToClose: string; leadToMeeting: string }) => { setRevenueTarget(i.revenueTarget); setAvgDealSize(i.avgDealSize); setMeetingToClose(i.meetingToClose); setLeadToMeeting(i.leadToMeeting); setCalculated(true); };
  const snap = (): Snapshot => ({ target, deal, dealsNeeded, meetingsNeeded, leadsNeeded, label: `${dealsNeeded} deals needed` });

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
          <Target className="inline h-3 w-3 mr-1" />
          {`Calculate required sales activity (calls, meetings, proposals, deals) from revenue target, deal size, and conversion rates.`}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenueTarget">Revenue Target</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="revenueTarget" type="number" step="any" min="0" placeholder="1000000" className="pl-7"
                value={revenueTarget} onChange={(e) => { setRevenueTarget(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgDealSize">Average Deal Size</Label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input id="avgDealSize" type="number" step="any" min="0" placeholder="25000" className="pl-7"
                value={avgDealSize} onChange={(e) => { setAvgDealSize(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meetingToClose">Meeting-to-Close Rate (%)</Label>
            <div className="relative">
              
              <Input id="meetingToClose" type="number" step="any" min="0" placeholder="25"
                value={meetingToClose} onChange={(e) => { setMeetingToClose(e.target.value); setCalculated(false); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="leadToMeeting">Lead-to-Meeting Rate (%)</Label>
            <div className="relative">
              
              <Input id="leadToMeeting" type="number" step="any" min="0" placeholder="30"
                value={leadToMeeting} onChange={(e) => { setLeadToMeeting(e.target.value); setCalculated(false); }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleCalculate} disabled={target <= 0 || deal <= 0}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 flex-1 sm:flex-none">
              Calculate Sales Targets
            </Button>
            <Button variant="outline" onClick={handleReset} className="shrink-0">Reset</Button>
          </div>
        </div>

        {calculated && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display mt-2" aria-live="polite">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Required Deals</p>
                <p className="text-4xl font-bold text-emerald-600">{`${dealsNeeded} deals`}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'">{`Meetings needed: ${meetingsNeeded}`}</Badge>
                  <Badge variant="outline" className="'bg-blue-500/10 border-blue-500/30 text-blue-600'">{`Leads needed: ${leadsNeeded}`}</Badge>
                  <Badge variant="outline" className="'bg-amber-500/10 border-amber-500/30 text-amber-600'">{`Avg deal: ${formatCurrency(deal)}`}</Badge>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue Target</p>
                    <p className={`text-lg font-bold`}>{formatCurrency(target)}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Deals Needed</p>
                    <p className={`text-lg font-bold text-emerald-600`}>{`${dealsNeeded}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Meetings Needed</p>
                    <p className={`text-lg font-bold`}>{`${meetingsNeeded}`}</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Leads Needed</p>
                    <p className={`text-lg font-bold`}>{`${leadsNeeded}`}</p>
                  </div>
              </div>

              <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
                {`Sales targets work backward from revenue goal: deals = revenue / avg deal size. Meetings = deals / close rate. Leads = meetings / lead-to-meeting rate. Example: $1M target, $25k deal, 25% close, 30% lead-to-meeting = 40 deals, 160 meetings, 534 leads. See our Pipeline Calculator for coverage analysis.`}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {compareA && compareB && (() => {
        const rows: CompareRow[] = [
          { label: 'Revenue Target', valueA: formatCurrency(compareA.target), valueB: formatCurrency(compareB.target), numA: compareA.target, numB: compareB.target },
          { label: 'Deals Needed', valueA: String(compareA.dealsNeeded), valueB: String(compareB.dealsNeeded), numA: compareA.dealsNeeded, numB: compareB.dealsNeeded },
          { label: 'Meetings', valueA: String(compareA.meetingsNeeded), valueB: String(compareB.meetingsNeeded), numA: compareA.meetingsNeeded, numB: compareB.meetingsNeeded },
          { label: 'Leads', valueA: String(compareA.leadsNeeded), valueB: String(compareB.leadsNeeded), numA: compareA.leadsNeeded, numB: compareB.leadsNeeded }
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
