'use client';

/**
 * FTE Calculator with a headcount-planning tab (Roadmap v2, Phase 15.1).
 * The former Headcount Calculator 301s here with ?mode=headcount.
 */

import { useState } from 'react';
import { useSearchParam } from '@/hooks/useSearchParam';
import { motion } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';
import TryExample from './TryExample';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ComparePanel, { CompareRow } from './ComparePanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';

type Mode = 'fte' | 'headcount';

interface FteSnapshot { ft: number; ptHours: number; ptFTE: number; totalFTE: number; acaFTE: number; label: string }

function FteTab() {
  const [fullTimeEmps, setFullTimeEmps] = useState('10');
  const [partTimeHours, setPartTimeHours] = useState('120');
  const [fullTimeHours, setFullTimeHours] = useState('40');
  const [compareA, setCompareA] = useState<FteSnapshot | null>(null);
  const [compareB, setCompareB] = useState<FteSnapshot | null>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<{ fullTimeEmps: string; partTimeHours: string; fullTimeHours: string }>('fte-calculator');

  const ft = Math.max(0, parseFloat(fullTimeEmps) || 0);
  const ptHours = Math.max(0, parseFloat(partTimeHours) || 0);
  const ftHours = parseFloat(fullTimeHours) || 40;
  const ptFTE = ptHours / ftHours;
  const totalFTE = ft + ptFTE;
  const acaFTE = ft + ptHours / 30;
  const ale = acaFTE >= 50;

  const handleTryExample = () => { setFullTimeEmps('30'); setPartTimeHours('600'); setFullTimeHours('40'); };
  const handleSave = () => saveEntry({ fullTimeEmps, partTimeHours, fullTimeHours }, `${totalFTE.toFixed(1)} FTE (${ft} FT + ${ptFTE.toFixed(1)} PT) · ACA ${acaFTE.toFixed(1)}`);
  const handleRestore = (i: { fullTimeEmps: string; partTimeHours: string; fullTimeHours: string }) => { setFullTimeEmps(i.fullTimeEmps); setPartTimeHours(i.partTimeHours); setFullTimeHours(i.fullTimeHours); };
  const snap = (): FteSnapshot => ({ ft, ptHours, ptFTE, totalFTE, acaFTE, label: `${totalFTE.toFixed(1)} FTE` });

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
        <Users className="inline h-3 w-3 mr-1" />
        FTE = full-time employees + (total part-time hours ÷ full-time hours). Budgets use a 40-hour week (2,080 hours a year); the Affordable Care Act uses 30 hours a week and counts 50 or more FTEs as a large employer.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullTimeEmps">Full-time employees</Label>
          <Input id="fullTimeEmps" type="number" step="1" min="0" value={fullTimeEmps} onChange={(e) => setFullTimeEmps(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="partTimeHours">Total part-time hours per week</Label>
          <Input id="partTimeHours" type="number" step="any" min="0" value={partTimeHours} onChange={(e) => setPartTimeHours(e.target.value)} />
          <p className="text-xs text-muted-foreground">Add up every part-timer&apos;s weekly hours</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullTimeHours">Full-time hours per week</Label>
          <Input id="fullTimeHours" type="number" step="any" min="1" value={fullTimeHours} onChange={(e) => setFullTimeHours(e.target.value)} />
          <p className="text-xs text-muted-foreground">40 standard, 37.5 for 7.5-hour days</p>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <TryExample onClick={handleTryExample} />
        <Button variant="outline" onClick={handleSave} className="shrink-0">Save to history</Button>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display" aria-live="polite">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Total FTE</p>
            <p className="text-4xl font-bold text-emerald-600" data-result-primary>{totalFTE.toFixed(1)} FTE</p>
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-600">{ft} full-time</Badge>
              <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{ptFTE.toFixed(2)} from part-time</Badge>
              <Badge variant="outline" className={ale ? 'bg-red-500/10 border-red-500/30 text-red-600' : 'bg-amber-500/10 border-amber-500/30 text-amber-600'}>ACA FTE {acaFTE.toFixed(1)}{ale ? ' — large employer' : ''}</Badge>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setCompareA(snap())} className="h-7 text-[10px] px-2 border-primary/30 bg-primary/5 text-primary">{compareA ? '↺ Set A' : '+ Save A'}</Button>
              <Button variant="outline" size="sm" onClick={() => setCompareB(snap())} className="h-7 text-[10px] px-2 border-amber-500/30 bg-amber-500/5 text-amber-600">{compareB ? '↺ Set B' : '+ Save B'}</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Full-time', value: `${ft}` },
              { label: 'Part-time hours/week', value: `${ptHours}h` },
              { label: 'Part-time FTE', value: ptFTE.toFixed(2), accent: true },
              { label: 'ACA FTE (30h base)', value: acaFTE.toFixed(1) },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                <p className={`text-lg font-bold ${m.accent ? 'text-emerald-600' : ''}`}>{m.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
            {ale
              ? 'At 50 or more ACA full-time equivalents averaged over the prior calendar year, an employer is an Applicable Large Employer and must offer affordable minimum essential coverage to full-time staff or face the IRC §4980H penalty.'
              : 'Below 50 ACA FTEs the employer mandate does not apply. The IRS counts anyone at 30+ hours a week (130 a month) as full-time and converts the rest by dividing their monthly hours by 120.'}
          </div>
        </div>
      </motion.div>

      {compareA && compareB && (
        <ComparePanel
          rows={[
            { label: 'Full-time', valueA: String(compareA.ft), valueB: String(compareB.ft), numA: compareA.ft, numB: compareB.ft },
            { label: 'Part-time hours', valueA: `${compareA.ptHours}h`, valueB: `${compareB.ptHours}h`, numA: compareA.ptHours, numB: compareB.ptHours },
            { label: 'Total FTE', valueA: compareA.totalFTE.toFixed(1), valueB: compareB.totalFTE.toFixed(1), numA: compareA.totalFTE, numB: compareB.totalFTE },
            { label: 'ACA FTE', valueA: compareA.acaFTE.toFixed(1), valueB: compareB.acaFTE.toFixed(1), numA: compareA.acaFTE, numB: compareB.acaFTE },
          ] as CompareRow[]}
          labelA={compareA.label}
          labelB={compareB.label}
          onClear={() => { setCompareA(null); setCompareB(null); }}
          onSwap={() => { const t = compareA; setCompareA(compareB); setCompareB(t); }}
        />
      )}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Headcount projection (former Headcount Calculator)
// ---------------------------------------------------------------------------
function HeadcountTab() {
  const [currentHc, setCurrentHc] = useState('100');
  const [plannedHires, setPlannedHires] = useState('20');
  const [attritionRate, setAttritionRate] = useState('15');
  const [periodMonths, setPeriodMonths] = useState('12');
  const [avgHours, setAvgHours] = useState('40');
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('headcount-calculator');

  const current = Math.max(0, parseFloat(currentHc) || 0);
  const hires = Math.max(0, parseFloat(plannedHires) || 0);
  const attr = Math.max(0, parseFloat(attritionRate) || 0);
  const months = Math.max(1, parseFloat(periodMonths) || 12);
  const hoursAvg = Math.max(0, parseFloat(avgHours) || 40);
  // Departures accrue on the average headcount over the period, not just the opening number
  const avgHeadcount = current + hires / 2;
  const departures = Math.round(avgHeadcount * (attr / 100) * (months / 12));
  const endHc = Math.max(0, current + hires - departures);
  const netGrowth = endHc - current;
  const backfills = departures; // hires needed just to stand still
  const totalHiringLoad = hires; // planned hires already include growth; show backfill separately
  const endFte = (endHc * hoursAvg) / 40;

  const handleTryExample = () => { setCurrentHc('100'); setPlannedHires('20'); setAttritionRate('15'); setPeriodMonths('12'); setAvgHours('38'); };
  const handleSave = () => saveEntry({ currentHc, plannedHires, attritionRate, periodMonths, avgHours }, `Headcount ${current} → ${endHc} (${netGrowth >= 0 ? '+' : ''}${netGrowth})`);
  const handleRestore = (i: Record<string, string>) => { setCurrentHc(i.currentHc); setPlannedHires(i.plannedHires); setAttritionRate(i.attritionRate); setPeriodMonths(i.periodMonths); if (i.avgHours) setAvgHours(i.avgHours); };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
        <TrendingUp className="inline h-3 w-3 mr-1" />
        Projected headcount = current + planned hires − expected departures. Departures are the annual attrition rate applied to the average headcount over the period, so hiring plans that ignore backfill come out too low.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2"><Label htmlFor="hcCurrent">Current headcount</Label><Input id="hcCurrent" type="number" min="0" value={currentHc} onChange={(e) => setCurrentHc(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="hcHires">Planned hires</Label><Input id="hcHires" type="number" min="0" value={plannedHires} onChange={(e) => setPlannedHires(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="hcAttr">Annual attrition (%)</Label><Input id="hcAttr" type="number" min="0" step="0.5" value={attritionRate} onChange={(e) => setAttritionRate(e.target.value)} /><p className="text-xs text-muted-foreground">US average is roughly 17% (BLS JOLTS)</p></div>
        <div className="space-y-2"><Label htmlFor="hcMonths">Period (months)</Label><Input id="hcMonths" type="number" min="1" value={periodMonths} onChange={(e) => setPeriodMonths(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="hcHours">Average hours/week</Label><Input id="hcHours" type="number" min="0" value={avgHours} onChange={(e) => setAvgHours(e.target.value)} /><p className="text-xs text-muted-foreground">Converts the result to FTE</p></div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <TryExample onClick={handleTryExample} />
        <Button variant="outline" onClick={handleSave} className="shrink-0" disabled={current <= 0}>Save to history</Button>
      </div>

      {current > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="result-display" aria-live="polite">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Projected headcount in {months} months</p>
              <p className="text-4xl font-bold text-emerald-600" data-result-primary>{endHc} employees</p>
              <div className="flex justify-center gap-2 flex-wrap">
                <Badge variant="outline" className={netGrowth >= 0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'bg-red-500/10 border-red-500/30 text-red-600'}>Net {netGrowth >= 0 ? '+' : ''}{netGrowth}</Badge>
                <Badge variant="outline" className="bg-red-500/10 border-red-500/30 text-red-600">{departures} expected departures</Badge>
                <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-600">{endFte.toFixed(1)} FTE at {hoursAvg}h/week</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Start', value: `${current}` },
                { label: 'Planned hires', value: `+${totalHiringLoad}` },
                { label: 'Departures', value: `−${departures}` },
                { label: 'Backfills needed to stand still', value: `${backfills}`, accent: true },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-background border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                  <p className={`text-lg font-bold ${m.accent ? 'text-emerald-600' : ''}`}>{m.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
              Departures = ({current} + {hires} ÷ 2) × {attr}% × {months}/12 = {departures}. To grow by {hires} people net you would need about {hires + departures} hires in total. Headcount counts people on payroll (W-2 full-time, part-time and temporary staff); 1099 contractors are excluded. Switch to the FTE tab to normalise part-time hours.
            </div>
          </div>
        </motion.div>
      )}
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}

export default function FTECalculator() {
  const urlMode = useSearchParam('mode');
  const [modeOverride, setMode] = useState<Mode | null>(null);
  const mode: Mode = modeOverride ?? (urlMode === 'headcount' ? 'headcount' : 'fte');

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex rounded-xl bg-muted/50 p-1 border border-border/50" role="tablist">
          {([
            { value: 'fte', label: 'FTE conversion', icon: Users },
            { value: 'headcount', label: 'Headcount projection', icon: TrendingUp },
          ] as { value: Mode; label: string; icon: typeof Users }[]).map((t) => {
            const Icon = t.icon;
            const active = mode === t.value;
            return (
              <button key={t.value} type="button" role="tab" aria-selected={active} onClick={() => setMode(t.value)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-muted-foreground hover:text-foreground'}`}>
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>
        {mode === 'fte' ? <FteTab /> : <HeadcountTab />}
      </div>
    </div>
  );
}
