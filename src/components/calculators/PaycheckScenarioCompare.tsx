'use client';

import { useMemo } from 'react';
import { GitCompareArrows } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ComparePanel, { type CompareRow } from './ComparePanel';
import { formatCurrency } from '@/lib/utils';
import {
  calculatePaycheck,
  PERIODS_PER_YEAR,
  type FilingStatus,
  type PaycheckInput,
  type PaycheckState,
  type PayFrequency,
  type StateCode,
} from '@/lib/payroll/withholding-2026';
import { STATE_CODES, STATE_PAYCHECK_PAGES } from '@/lib/payroll/state-pages';
import { scenarioAllowances, type CompareScenario } from '@/lib/payroll/scenario-params';

const FREQ_SHORT: Record<PayFrequency, string> = { weekly: 'Weekly', 'bi-weekly': 'Bi-weekly', 'semi-monthly': 'Semi-monthly', monthly: 'Monthly' };
const STATUS_SHORT: Record<FilingStatus, string> = { single: 'Single', married: 'Married filing jointly', hoh: 'Head of household' };
const STATES_SORTED: StateCode[] = [...STATE_CODES].sort((a, b) => STATE_PAYCHECK_PAGES[a].name.localeCompare(STATE_PAYCHECK_PAGES[b].name));

interface PaycheckScenarioCompareProps {
  mode: 'hourly' | 'salary';
  /** Scenario A: the main form, already validated (null hides the panel) */
  base: PaycheckInput | null;
  /** The main form's values, used to seed scenario B and for the "same as A" check */
  baseScenario: CompareScenario;
  /** Fixed-state pages pass their state so the picker still offers other states for comparison */
  scenario: CompareScenario | null;
  onChange: (s: CompareScenario | null) => void;
  /** Make B the main scenario and keep the old A as B */
  onSwap?: () => void;
}

const SALARY_HOURS = 2080;

function stateLabel(s: PaycheckState): string {
  if (s === 'none') return 'No state income tax';
  if (s === 'other') return 'Flat rate (as in A)';
  return STATE_PAYCHECK_PAGES[s].name;
}

/** Scenario B as a full PaycheckInput, borrowing anything the scenario does not carry from A */
export function scenarioInput(s: CompareScenario, mode: 'hourly' | 'salary', a: PaycheckInput): PaycheckInput | null {
  const rate = mode === 'salary' ? (parseFloat(s.annualSalary) || 0) / SALARY_HOURS : parseFloat(s.hourlyRate) || 0;
  const reg = mode === 'salary' ? 40 : parseFloat(s.regularHours) || 0;
  const ot = mode === 'salary' ? 0 : parseFloat(s.overtimeHours || '0') || 0;
  if (rate <= 0 || reg < 0 || ot < 0 || reg + ot > 168 || reg + ot === 0) return null;
  const grossAnnual = (rate * reg + rate * 1.5 * ot) * 52;
  const ret = Math.min(100, Math.max(0, parseFloat(s.retirementPct || '0') || 0));
  const periods = PERIODS_PER_YEAR[s.payFrequency];
  const aPeriods = PERIODS_PER_YEAR[a.payFrequency];
  return {
    state: s.state,
    hourlyRate: rate,
    regularHoursPerWeek: reg,
    overtimeHoursPerWeek: ot,
    overtimeMultiplier: 1.5,
    payFrequency: s.payFrequency,
    filingStatus: s.filingStatus,
    stateAllowances: scenarioAllowances(s.state, s.filingStatus),
    nycResident: s.state === 'NY' ? a.nycResident : false,
    customStateRate: s.state === 'other' ? a.customStateRate ?? 0.05 : undefined,
    preTaxRetirementAnnual: grossAnnual * (ret / 100),
    // flat per-period deductions carry over from A as annual amounts
    preTaxBenefitsAnnual: a.preTaxBenefitsAnnual,
    otherDeductionsPerPeriod: ((a.otherDeductionsPerPeriod ?? 0) * aPeriods) / periods,
    w4: a.w4,
  };
}

/**
 * Scenario compare (Phase 16.1): the main paycheck (A) against a what-if (B) —
 * a raise, another state, a 401(k) change, a different filing status or pay
 * frequency — line by line, with B persisted in the share link.
 */
export default function PaycheckScenarioCompare({ mode, base, baseScenario, scenario, onChange, onSwap }: PaycheckScenarioCompareProps) {
  const inputB = useMemo(() => (scenario && base ? scenarioInput(scenario, mode, base) : null), [scenario, mode, base]);
  const resultA = useMemo(() => (base ? calculatePaycheck(base) : null), [base]);
  const resultB = useMemo(() => (inputB ? calculatePaycheck(inputB) : null), [inputB]);

  if (!base || !resultA) return null;

  const start = (patch: Partial<CompareScenario> = {}) => onChange({ ...baseScenario, ...patch });
  const raise = (pct: number) =>
    mode === 'salary'
      ? { annualSalary: String(Math.round((parseFloat(baseScenario.annualSalary) || 0) * (1 + pct / 100))) }
      : { hourlyRate: ((parseFloat(baseScenario.hourlyRate) || 0) * (1 + pct / 100)).toFixed(2) };

  if (!scenario) {
    return (
      <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 sm:p-5 space-y-3">
        <div className="flex items-start gap-2">
          <GitCompareArrows className="h-4 w-4 mt-0.5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Compare a second scenario side by side</p>
            <p className="text-xs text-muted-foreground">A raise, a move to another state, a bigger 401(k) contribution or a different pay schedule, line by line against the paycheck above. The comparison is kept in the share link.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => start(raise(10))}>+10% raise</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => start({ state: baseScenario.state === 'TX' ? 'FL' : 'TX' })}>Move to a no-tax state</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => start({ retirementPct: String(Math.max(6, (parseFloat(baseScenario.retirementPct) || 0) + 6)) })}>Add 6% to 401(k)</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => start({ filingStatus: baseScenario.filingStatus === 'married' ? 'single' : 'married' })}>Change filing status</Button>
          <Button type="button" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => start()}>Custom scenario</Button>
        </div>
      </div>
    );
  }

  const set = (patch: Partial<CompareScenario>) => onChange({ ...scenario, ...patch });
  const labelB = `B: ${stateLabel(scenario.state)} · ${mode === 'salary' ? formatCurrency(parseFloat(scenario.annualSalary) || 0) + '/yr' : formatCurrency(parseFloat(scenario.hourlyRate) || 0) + '/hr'}`;
  const labelA = `A: ${stateLabel(base.state)} · ${mode === 'salary' ? formatCurrency(base.hourlyRate * SALARY_HOURS) + '/yr' : formatCurrency(base.hourlyRate) + '/hr'}`;

  const rows: CompareRow[] = [];
  if (resultB) {
    const money = (label: string, a: number, b: number, higherIsBetter = true) =>
      rows.push({ label, valueA: formatCurrency(a), valueB: formatCurrency(b), numA: a, numB: b, higherIsBetter });
    money('Gross pay per paycheck', resultA.grossPerPeriod, resultB.grossPerPeriod);
    const keys = Array.from(new Set([...resultA.deductions.map((d) => d.key), ...resultB.deductions.map((d) => d.key)]));
    for (const key of keys) {
      const a = resultA.deductions.find((d) => d.key === key);
      const b = resultB.deductions.find((d) => d.key === key);
      const label = (a ?? b)!.label.replace(/ \([^)]*%\)$/, '');
      money(label, a?.annual ? a.perPeriod : 0, b?.annual ? b.perPeriod : 0, false);
    }
    money('Total deductions per paycheck', resultA.grossPerPeriod - resultA.netPerPeriod, resultB.grossPerPeriod - resultB.netPerPeriod, false);
    money('Take-home per paycheck', resultA.netPerPeriod, resultB.netPerPeriod);
    money('Take-home per month', resultA.netAnnual / 12, resultB.netAnnual / 12);
    money('Take-home per year', resultA.netAnnual, resultB.netAnnual);
    money('Take-home per hour worked', resultA.netPerHour, resultB.netPerHour);
    rows.push({
      label: 'Effective tax & deduction rate',
      valueA: `${(resultA.effectiveRate * 100).toFixed(1)}%`,
      valueB: `${(resultB.effectiveRate * 100).toFixed(1)}%`,
      numA: resultA.effectiveRate,
      numB: resultB.effectiveRate,
      higherIsBetter: false,
    });
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold inline-flex items-center gap-2">
            <GitCompareArrows className="h-4 w-4 text-emerald-600" /> Scenario B
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Button type="button" variant="ghost" size="sm" onClick={() => set(raise(10))}>+10%</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => set({ retirementPct: String((parseFloat(scenario.retirementPct) || 0) + 1) })}>401(k) +1%</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="space-y-1.5 col-span-2 sm:col-span-1 lg:col-span-2">
            <Label className="text-xs">State</Label>
            <Select value={scenario.state} onValueChange={(v) => set({ state: v as PaycheckState })}>
              <SelectTrigger aria-label="Scenario B state"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATES_SORTED.map((code) => (
                  <SelectItem key={code} value={code}>{STATE_PAYCHECK_PAGES[code].name}</SelectItem>
                ))}
                <SelectItem value="none">No state income tax</SelectItem>
                {base.state === 'other' && <SelectItem value="other">Flat rate (as in A)</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          {mode === 'salary' ? (
            <div className="space-y-1.5">
              <Label htmlFor="b-salary" className="text-xs">Annual salary ($)</Label>
              <Input id="b-salary" type="number" inputMode="decimal" min="0" step="1000" value={scenario.annualSalary} onChange={(e) => set({ annualSalary: e.target.value })} />
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="b-rate" className="text-xs">Hourly rate ($)</Label>
                <Input id="b-rate" type="number" inputMode="decimal" min="0" step="0.25" value={scenario.hourlyRate} onChange={(e) => set({ hourlyRate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-hours" className="text-xs">Hours / week</Label>
                <Input id="b-hours" type="number" inputMode="decimal" min="0" max="168" value={scenario.regularHours} onChange={(e) => set({ regularHours: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-ot" className="text-xs">Overtime hrs</Label>
                <Input id="b-ot" type="number" inputMode="decimal" min="0" value={scenario.overtimeHours} onChange={(e) => set({ overtimeHours: e.target.value })} />
              </div>
            </>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs">Filing status</Label>
            <Select value={scenario.filingStatus} onValueChange={(v) => set({ filingStatus: v as FilingStatus })}>
              <SelectTrigger aria-label="Scenario B filing status"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(STATUS_SHORT) as FilingStatus[]).map((k) => (
                  <SelectItem key={k} value={k}>{STATUS_SHORT[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Pay frequency</Label>
            <Select value={scenario.payFrequency} onValueChange={(v) => set({ payFrequency: v as PayFrequency })}>
              <SelectTrigger aria-label="Scenario B pay frequency"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(FREQ_SHORT) as PayFrequency[]).map((k) => (
                  <SelectItem key={k} value={k}>{FREQ_SHORT[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-ret" className="text-xs">401(k) %</Label>
            <Input id="b-ret" type="number" inputMode="decimal" min="0" max="100" step="0.5" placeholder="0" value={scenario.retirementPct} onChange={(e) => set({ retirementPct: e.target.value })} />
          </div>
        </div>
        {scenario.payFrequency !== base.payFrequency && (
          <p className="text-xs text-muted-foreground">Different pay frequencies: compare the per-month and per-year rows, not the per-paycheck ones.</p>
        )}
        {!inputB && <p className="text-xs text-amber-600">Scenario B needs a rate above $0 and between 1 and 168 hours a week.</p>}
      </div>

      {resultB && <ComparePanel rows={rows} labelA={labelA} labelB={labelB} onClear={() => onChange(null)} onSwap={onSwap} />}
    </div>
  );
}
