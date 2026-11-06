'use client';

/**
 * PTOAccrualCalculator — paid time off accrual by rate, pay period or lump sum,
 * plus (Phase 15.1) state-mandated paid sick leave accrual with the statutory
 * annual cap. The former Sick Leave Calculator 301s here with ?type=sick.
 */

import { useMemo, useState } from 'react';
import { useSearchParam } from '@/hooks/useSearchParam';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TryExample from './TryExample';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import CalcHistoryPanel from './CalcHistoryPanel';

type AccrualType = 'per-hour' | 'per-pay-period' | 'annual-lump' | 'state-sick';

/**
 * State paid-sick-leave accrual floors (hours earned per hour worked) and the
 * most common annual accrual/use cap, 2026. Several states set a higher cap for
 * larger employers — the note says which.
 */
export const SICK_LEAVE_MANDATES: Record<string, { name: string; perHours: number; cap: number; note: string }> = {
  AZ: { name: 'Arizona', perHours: 30, cap: 40, note: '24 hours at employers with fewer than 15 employees' },
  CA: { name: 'California', perHours: 30, cap: 40, note: 'Minimum 40 hours or 5 days a year since 2024; employers may cap the balance at 80 hours' },
  CO: { name: 'Colorado', perHours: 30, cap: 48, note: 'Healthy Families and Workplaces Act' },
  CT: { name: 'Connecticut', perHours: 30, cap: 40, note: 'Covers employers with 25+ employees in 2026, all employers from 2027' },
  IL: { name: 'Illinois', perHours: 40, cap: 40, note: 'Paid Leave for All Workers Act — usable for any reason' },
  MA: { name: 'Massachusetts', perHours: 30, cap: 40, note: 'Unpaid at employers with fewer than 11 employees' },
  MD: { name: 'Maryland', perHours: 30, cap: 40, note: 'Paid at employers with 15+ employees' },
  ME: { name: 'Maine', perHours: 40, cap: 40, note: 'Earned Paid Leave, any reason, employers with 10+ employees' },
  MI: { name: 'Michigan', perHours: 30, cap: 72, note: 'Earned Sick Time Act (Feb 2025); 40 hours paid at employers with 10 or fewer employees' },
  MN: { name: 'Minnesota', perHours: 30, cap: 48, note: 'Earned Sick and Safe Time; balance may reach 80 hours' },
  NJ: { name: 'New Jersey', perHours: 30, cap: 40, note: 'All employers' },
  NM: { name: 'New Mexico', perHours: 30, cap: 64, note: 'Healthy Workplaces Act' },
  NV: { name: 'Nevada', perHours: 52, cap: 40, note: '0.01923 hours per hour worked, employers with 50+ employees' },
  NY: { name: 'New York', perHours: 30, cap: 56, note: '40 hours at employers with 5–99 employees; 56 at 100+' },
  OR: { name: 'Oregon', perHours: 30, cap: 40, note: 'Unpaid at employers with fewer than 10 employees (6 in Portland)' },
  RI: { name: 'Rhode Island', perHours: 35, cap: 40, note: 'Employers with 18+ employees' },
  VT: { name: 'Vermont', perHours: 52, cap: 40, note: 'Earned Sick Time Act' },
  WA: { name: 'Washington', perHours: 40, cap: 40, note: 'No statutory cap on accrual; 40 hours must carry over' },
  DC: { name: 'District of Columbia', perHours: 37, cap: 56, note: '1 hour per 37 worked at employers with 100+ employees; less at smaller ones' },
};

interface PTOResult {
  annualHours: number;
  perPaycheck: number;
  projectedYearEnd: number;
  cashValue: number;
  /** state-sick only */
  capApplied: boolean;
  remaining: number;
}

const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: d });
const fmtMoney = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function PTOAccrualCalculator() {
  // ?type=sick from the old sick-leave page; ?state=XX optional
  const urlType = useSearchParam('type');
  const urlState = useSearchParam('state')?.toUpperCase() ?? null;
  const [accrualTypeOverride, setAccrualType] = useState<AccrualType | null>(null);
  const accrualType: AccrualType = accrualTypeOverride ?? (urlType === 'sick' ? 'state-sick' : 'per-hour');
  const [rate, setRate] = useState('0.0385');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [payPeriodsPerYear, setPayPeriodsPerYear] = useState('26');
  const [currentHours, setCurrentHours] = useState('0');
  const [usedHours, setUsedHours] = useState('0');
  const [hourlyRate, setHourlyRate] = useState('25');
  const [stateOverride, setStateCode] = useState<string | null>(null);
  const stateCode = stateOverride ?? (urlState && urlState in SICK_LEAVE_MANDATES ? urlState : 'CA');
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('pto-accrual-calculator');

  const mandate = SICK_LEAVE_MANDATES[stateCode];

  const result = useMemo<PTOResult | null>(() => {
    const r = parseFloat(rate);
    const hpw = parseFloat(hoursPerWeek);
    const ppy = parseFloat(payPeriodsPerYear);
    const ch = parseFloat(currentHours) || 0;
    const used = parseFloat(usedHours) || 0;
    const hr = parseFloat(hourlyRate) || 0;
    if (isNaN(hpw) || isNaN(ppy) || hpw < 0 || ppy <= 0) return null;

    let annualHours = 0;
    let capApplied = false;
    if (accrualType === 'state-sick') {
      const earned = (hpw * 52) / mandate.perHours;
      annualHours = Math.min(earned, mandate.cap);
      capApplied = earned > mandate.cap;
    } else if (isNaN(r)) {
      return null;
    } else if (accrualType === 'per-hour') {
      annualHours = r * hpw * 52;
    } else if (accrualType === 'per-pay-period') {
      annualHours = r * ppy;
    } else {
      annualHours = r;
    }
    const perPaycheck = annualHours / ppy;
    const projectedYearEnd = ch + annualHours - (accrualType === 'state-sick' ? used : 0);
    return { annualHours, perPaycheck, projectedYearEnd, cashValue: annualHours * hr, capApplied, remaining: Math.max(0, ch + annualHours - used) };
  }, [accrualType, rate, hoursPerWeek, payPeriodsPerYear, currentHours, usedHours, hourlyRate, mandate]);

  const handleTryExample = () => {
    if (accrualType === 'state-sick') { setStateCode('CA'); setHoursPerWeek('40'); setUsedHours('16'); setCurrentHours('0'); setHourlyRate('22'); return; }
    setAccrualType('per-hour'); setRate('0.0577'); setHoursPerWeek('40'); setPayPeriodsPerYear('26'); setCurrentHours('40'); setHourlyRate('25');
  };
  const handleSave = () => {
    if (!result) return;
    saveEntry(
      { accrualType, rate, hoursPerWeek, payPeriodsPerYear, currentHours, usedHours, hourlyRate, stateCode },
      accrualType === 'state-sick' ? `${mandate.name} sick leave · ${fmt(result.annualHours)}h/yr · ${fmt(result.remaining)}h left` : `${fmt(result.annualHours)}h PTO/yr · ${fmt(result.perPaycheck, 2)}h per paycheck`,
    );
  };
  const handleRestore = (i: Record<string, string>) => {
    setAccrualType((i.accrualType as AccrualType) || 'per-hour'); setRate(i.rate); setHoursPerWeek(i.hoursPerWeek); setPayPeriodsPerYear(i.payPeriodsPerYear);
    setCurrentHours(i.currentHours); setUsedHours(i.usedHours ?? '0'); setHourlyRate(i.hourlyRate); if (i.stateCode) setStateCode(i.stateCode);
  };
  const handleReset = () => { setRate('0.0385'); setCurrentHours('0'); setUsedHours('0'); setHourlyRate('25'); setHoursPerWeek('40'); };

  const isSick = accrualType === 'state-sick';

  return (
    <div className="w-full">
      <div className="p-5 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="accrualType" className="text-sm font-medium">What are you accruing?</Label>
            <Select value={accrualType} onValueChange={(v) => setAccrualType(v as AccrualType)}>
              <SelectTrigger id="accrualType" className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="per-hour">PTO — per hour worked</SelectItem>
                <SelectItem value="per-pay-period">PTO — fixed hours per pay period</SelectItem>
                <SelectItem value="annual-lump">PTO — annual lump sum</SelectItem>
                <SelectItem value="state-sick">Paid sick leave — state mandate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isSick ? (
            <div>
              <Label htmlFor="sickState" className="text-sm font-medium">State</Label>
              <Select value={stateCode} onValueChange={setStateCode}>
                <SelectTrigger id="sickState" className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(SICK_LEAVE_MANDATES).sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([code, m]) => (
                    <SelectItem key={code} value={code}>{m.name} — 1 hr per {m.perHours} worked, {m.cap}h/yr</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">{mandate.note}. No federal sick leave law exists; states not listed have no mandate.</p>
            </div>
          ) : (
            <div>
              <Label htmlFor="rate" className="text-sm font-medium">
                {accrualType === 'per-hour' && 'Accrual rate (hours per hour worked)'}
                {accrualType === 'per-pay-period' && 'Hours accrued each pay period'}
                {accrualType === 'annual-lump' && 'Hours granted per year'}
              </Label>
              <Input id="rate" type="number" step="0.001" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">
                {accrualType === 'per-hour' && '0.0385 = 2 weeks a year, 0.0577 = 3 weeks, 0.0769 = 4 weeks (at 40 h/week)'}
                {accrualType === 'per-pay-period' && 'For 80 hours a year paid bi-weekly: 80 ÷ 26 = 3.08'}
                {accrualType === 'annual-lump' && 'Granted on January 1 or your anniversary date'}
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="hpw" className="text-sm font-medium">Hours worked per week</Label>
            <Input id="hpw" type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="ppy" className="text-sm font-medium">Pay periods per year</Label>
            <Select value={payPeriodsPerYear} onValueChange={setPayPeriodsPerYear}>
              <SelectTrigger id="ppy" className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="52">Weekly (52)</SelectItem>
                <SelectItem value="26">Bi-weekly (26)</SelectItem>
                <SelectItem value="24">Semi-monthly (24)</SelectItem>
                <SelectItem value="12">Monthly (12)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="current" className="text-sm font-medium">{isSick ? 'Hours carried over from last year' : 'Current PTO balance (hours)'}</Label>
            <Input id="current" type="number" value={currentHours} onChange={(e) => setCurrentHours(e.target.value)} className="mt-1" />
          </div>

          {isSick ? (
            <div>
              <Label htmlFor="used" className="text-sm font-medium">Sick hours used this year</Label>
              <Input id="used" type="number" min="0" value={usedHours} onChange={(e) => setUsedHours(e.target.value)} className="mt-1" />
            </div>
          ) : (
            <div>
              <Label htmlFor="hr" className="text-sm font-medium">Hourly rate ($)</Label>
              <Input id="hr" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">Used for the cash value of your PTO</p>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <TryExample onClick={handleTryExample} />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSave} disabled={!result}>Save to history</Button>
            <Button variant="outline" size="sm" onClick={handleReset}>Reset</Button>
          </div>
        </div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="result-display space-y-4" aria-live="polite">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{isSick ? 'Accrues this year' : 'Annual PTO'}</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1" data-result-primary>{fmt(result.annualHours, 1)}h</p>
                <p className="text-xs text-muted-foreground mt-1">{isSick && result.capApplied ? `capped at ${mandate.cap}h` : `${fmt(result.annualHours / 8, 1)} days`}</p>
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Per paycheck</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{fmt(result.perPaycheck, 2)}h</p>
                <p className="text-xs text-muted-foreground mt-1">accrued each period</p>
              </div>
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{isSick ? 'Remaining balance' : 'Year-end balance'}</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{fmt(isSick ? result.remaining : result.projectedYearEnd, 1)}h</p>
                <p className="text-xs text-muted-foreground mt-1">{fmt((isSick ? result.remaining : result.projectedYearEnd) / 8, 1)} days</p>
              </div>
              {isSick ? (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Used so far</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">{fmt(parseFloat(usedHours) || 0, 1)}h</p>
                  <p className="text-xs text-muted-foreground mt-1">{mandate.name} floor</p>
                </div>
              ) : (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Cash value</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{fmtMoney(result.cashValue)}</p>
                  <p className="text-xs text-muted-foreground mt-1">if paid out</p>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-muted/40 p-4 text-sm space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-2"><Info className="size-4 text-primary" />How this was calculated</p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
                {accrualType === 'per-hour' && (<>
                  <li>Annual PTO = {rate} × {hoursPerWeek} hours/week × 52 weeks = {fmt(result.annualHours, 1)} hours</li>
                  <li>Per paycheck = {fmt(result.annualHours, 1)} ÷ {payPeriodsPerYear} = {fmt(result.perPaycheck, 2)} hours</li>
                </>)}
                {accrualType === 'per-pay-period' && (<>
                  <li>Annual PTO = {rate} hours × {payPeriodsPerYear} pay periods = {fmt(result.annualHours, 1)} hours</li>
                </>)}
                {accrualType === 'annual-lump' && (<>
                  <li>{rate} hours granted for the year; spread evenly that is {fmt(result.perPaycheck, 2)} hours per paycheck</li>
                </>)}
                {isSick && (<>
                  <li>{mandate.name}: 1 hour per {mandate.perHours} hours worked → {hoursPerWeek} × 52 ÷ {mandate.perHours} = {fmt((parseFloat(hoursPerWeek) || 0) * 52 / mandate.perHours, 1)} hours{result.capApplied ? `, capped at the ${mandate.cap}-hour annual limit` : ''}</li>
                  <li>Remaining = {currentHours || 0} carried over + {fmt(result.annualHours, 1)} accrued − {usedHours || 0} used = {fmt(result.remaining, 1)} hours</li>
                  <li>Most mandates let unused hours carry over (subject to the cap) but do not require payout when you leave.</li>
                </>)}
                {!isSick && <li>Cash value = {fmt(result.annualHours, 1)} hours × ${hourlyRate}/hr = {fmtMoney(result.cashValue)}</li>}
                {!isSick && <li>Year-end balance = {currentHours || 0} current + {fmt(result.annualHours, 1)} accrued = {fmt(result.projectedYearEnd, 1)} hours</li>}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
      <CalcHistoryPanel history={history} onRestore={handleRestore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}
