'use client';

import { useMemo, useState } from 'react';
import { Briefcase, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { getTaxYear, TAX_YEAR, type PaycheckResult, type PaycheckState, type PayFrequency } from '@/lib/payroll/withholding';
import {
  calculateEmployerCost,
  EMPLOYER_STATE_FIGURES_YEAR,
  FUTA_CREDIT_REDUCTION,
  STATE_EMPLOYER_TAXES,
} from '@/lib/payroll/employer-cost-2026';

interface EmployerCostPanelProps {
  state: PaycheckState;
  /** Display name of the state, or null for the generic options */
  stateName: string | null;
  paycheck: PaycheckResult;
  payFrequency: PayFrequency;
  hoursPerYear: number;
  frequencyLabel: string;
}

const pct = (rate: number) => `${parseFloat((rate * 100).toFixed(3))}%`;

/**
 * Employer-side view of the same paycheck: FICA match, FUTA, state unemployment
 * at the new-employer rate (editable) and the employer share of state paid-leave
 * programs. Phase 16.1 — no major free calculator shows both sides on one screen.
 */
export default function EmployerCostPanel({ state, stateName, paycheck, payFrequency, hoursPerYear, frequencyLabel }: EmployerCostPanelProps) {
  const profile = state === 'none' || state === 'other' ? null : STATE_EMPLOYER_TAXES[state];
  const defaultRate = profile?.sui.rate;
  // The SUI input is text so the employer can paste the rate from their notice; blank = use the default
  const [suiRateInput, setSuiRateInput] = useState('');

  const parsedRate = suiRateInput.trim() === '' ? null : parseFloat(suiRateInput);
  const rateInvalid = parsedRate !== null && (isNaN(parsedRate) || parsedRate < 0 || parsedRate > 15);
  const suiRate = parsedRate !== null && !rateInvalid ? parsedRate / 100 : undefined;

  const cost = useMemo(
    () =>
      calculateEmployerCost({
        state,
        grossAnnual: paycheck.grossAnnual,
        ficaWagesAnnual: paycheck.ficaWagesAnnual,
        payFrequency,
        hoursPerYear,
        suiRate,
        taxYear: paycheck.taxYear,
      }),
    [state, paycheck.grossAnnual, paycheck.ficaWagesAnnual, paycheck.taxYear, payFrequency, hoursPerYear, suiRate],
  );

  const creditReduction = state !== 'none' && state !== 'other' ? FUTA_CREDIT_REDUCTION[state] : undefined;
  const suiMissing = cost.suiRateApplied === null;
  const where = stateName ?? 'this state';

  return (
    <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5 sm:p-6 space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-400 text-xs font-semibold mb-1">
          <Briefcase className="h-3.5 w-3.5" />
          {paycheck.taxYear} Employer Cost{stateName ? ` in ${stateName}` : ''}{paycheck.taxYear > TAX_YEAR ? ' (preview)' : ''}
        </div>
        <p className="text-sm text-muted-foreground font-medium">Total Cost to Employ per Paycheck</p>
        <p className="text-4xl sm:text-5xl font-extrabold text-sky-600" data-result-primary>
          {formatCurrency(cost.totalCostPerPeriod)}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">
          <strong className="text-foreground">{formatCurrency(cost.totalCostAnnual)}</strong>/year ·{' '}
          <strong className="text-foreground">{formatCurrency(cost.totalCostPerHour)}</strong>/hr worked ·{' '}
          employer taxes add <strong className="text-foreground">{(cost.loadRate * 100).toFixed(1)}%</strong> on top of wages
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Gross Wages', value: formatCurrency(cost.grossPerPeriod), color: 'text-blue-600' },
          { label: 'Employer Payroll Taxes', value: formatCurrency(cost.employerTaxesPerPeriod), color: 'text-amber-600' },
          { label: 'Employee Take-Home', value: formatCurrency(paycheck.netPerPeriod), color: 'text-emerald-600' },
          {
            label: 'Taxes Both Sides',
            value: formatCurrency(paycheck.grossPerPeriod - paycheck.netPerPeriod + cost.employerTaxesPerPeriod),
            color: 'text-foreground',
          },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-background border border-border/50 p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
            <p className={`text-base sm:text-lg font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* SUI rate input */}
      <div className="rounded-xl bg-background border border-border/50 p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
        <div className="space-y-1 text-xs text-muted-foreground">
          <p className="text-sm font-semibold text-foreground">State unemployment insurance (SUI) rate</p>
          {profile ? (
            <p>{profile.sui.note}</p>
          ) : (
            <p>
              Pick a specific state above to use its {EMPLOYER_STATE_FIGURES_YEAR} new-employer rate and taxable wage base. For any other state, enter the rate
              from your unemployment tax notice; it is applied to the first $7,000 of wages, the floor every state uses.
            </p>
          )}
        </div>
        <div className="space-y-1.5 sm:w-44">
          <Label htmlFor="sui-rate" className="text-xs">
            Your SUI rate (%){profile && defaultRate !== null ? ` — default ${profile.sui.rateText}` : ''}
          </Label>
          <Input
            id="sui-rate"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            max="15"
            placeholder={profile && defaultRate !== null && defaultRate !== undefined ? parseFloat((defaultRate * 100).toFixed(3)).toString() : 'e.g. 2.7'}
            value={suiRateInput}
            onChange={(e) => setSuiRateInput(e.target.value)}
            aria-invalid={rateInvalid}
          />
          {rateInvalid && <p className="text-xs text-red-500">Enter a rate between 0% and 15%.</p>}
        </div>
      </div>

      {/* Itemized employer taxes */}
      <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border/50 bg-muted/40 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Employer Payroll Taxes &amp; Contributions</span>
          <span className="text-xs text-muted-foreground">{frequencyLabel}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Line Item</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs">Per Paycheck</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs">Annual Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              <tr className="font-medium">
                <td className="px-4 py-2.5">Gross wages paid to the employee</td>
                <td className="text-right px-4 py-2.5">{formatCurrency(cost.grossPerPeriod)}</td>
                <td className="text-right px-4 py-2.5">{formatCurrency(cost.grossAnnual)}</td>
              </tr>
              {cost.lines.map((l) => (
                <tr key={l.key}>
                  <td className="px-4 py-2.5 text-muted-foreground">{l.label}</td>
                  <td className="text-right px-4 py-2.5 text-amber-600">+{formatCurrency(l.perPeriod)}</td>
                  <td className="text-right px-4 py-2.5 text-amber-600">+{formatCurrency(l.annual)}</td>
                </tr>
              ))}
              {suiMissing && (
                <tr>
                  <td className="px-4 py-2.5 text-muted-foreground italic">State unemployment insurance (enter your rate above)</td>
                  <td className="text-right px-4 py-2.5 text-muted-foreground">—</td>
                  <td className="text-right px-4 py-2.5 text-muted-foreground">—</td>
                </tr>
              )}
              <tr className="font-bold bg-sky-500/5">
                <td className="px-4 py-2.5">Total cost to employ</td>
                <td className="text-right px-4 py-2.5 text-sky-600">{formatCurrency(cost.totalCostPerPeriod)}</td>
                <td className="text-right px-4 py-2.5 text-sky-600">{formatCurrency(cost.totalCostAnnual)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Both sides of the paycheck */}
      <div className="rounded-xl bg-background border border-border/50 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span>Where Each {formatCurrency(cost.totalCostPerPeriod)} Paycheck Goes</span>
          <span className="text-emerald-600">{((paycheck.netAnnual / cost.totalCostAnnual) * 100).toFixed(1)}% reaches the employee</span>
        </div>
        <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-muted">
          <div style={{ width: `${(paycheck.netAnnual / cost.totalCostAnnual) * 100}%` }} className="bg-emerald-500 h-full" title="Employee take-home" />
          <div
            style={{ width: `${((paycheck.grossAnnual - paycheck.netAnnual) / cost.totalCostAnnual) * 100}%` }}
            className="bg-amber-500 h-full"
            title="Withheld from the employee"
          />
          <div style={{ width: `${(cost.employerTaxesAnnual / cost.totalCostAnnual) * 100}%` }} className="bg-sky-500 h-full" title="Employer taxes" />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-emerald-500" />Employee take-home ({((paycheck.netAnnual / cost.totalCostAnnual) * 100).toFixed(1)}%)</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-amber-500" />Withheld from employee ({(((paycheck.grossAnnual - paycheck.netAnnual) / cost.totalCostAnnual) * 100).toFixed(1)}%)</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-sky-500" />Employer taxes ({((cost.employerTaxesAnnual / cost.totalCostAnnual) * 100).toFixed(1)}%)</span>
        </div>
      </div>

      {paycheck.taxYear !== EMPLOYER_STATE_FIGURES_YEAR && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-foreground/80" role="note" data-tax-year-note>
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
          <p>
            <strong className="text-foreground">{paycheck.taxYear > TAX_YEAR ? `${paycheck.taxYear} preview.` : `${paycheck.taxYear} figures.`}</strong>{' '}
            The Social Security match uses the {paycheck.taxYear} wage base of ${getTaxYear(paycheck.taxYear).federal.socialSecurityWageBase.toLocaleString('en-US')}.
            FUTA credit reductions, state unemployment rates and wage bases, and paid-leave employer shares are {EMPLOYER_STATE_FIGURES_YEAR} figures,
            because the {paycheck.taxYear} ones were not published as of this page&apos;s last review.
          </p>
        </div>
      )}

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p>
          Employer figures use the {paycheck.taxYear} FICA match (Pub. 15), FUTA at {pct(cost.futaRateApplied)} on the first $7,000
          {creditReduction ? ` (the U.S. DOL's potential ${pct(creditReduction)} credit reduction for ${where}; the final list is set after November 10, ${EMPLOYER_STATE_FIGURES_YEAR})` : ''},
          and {where === 'this state' ? 'the SUI rate you enter' : `${where}'s new-employer SUI rate and wage base`}
          {profile?.extras.length ? `, plus ${profile.extras.map((e) => e.label.replace(/ \(.*\)$/, '')).join(' and ')}` : ''}.
          Experience-rated employers should enter their own SUI rate. Not included: workers' compensation, health insurance, retirement match, and local employer taxes such as the Newark, Jersey City or Oregon transit payroll taxes.
          {profile?.extras.map((e) => (e.note ? ` ${e.note}` : '')).join('')}
        </p>
      </div>
    </div>
  );
}
