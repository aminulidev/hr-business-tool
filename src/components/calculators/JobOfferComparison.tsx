'use client';

/**
 * JobOfferComparison — a side-by-side comparison tool for two job offers.
 * Captures salary, bonus, benefits, retirement match, PTO, and commute cost
 * for each offer, then calculates total annual compensation and shows
 * which offer is better by how much.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Trophy,
  DollarSign,
  Calendar,
  Heart,
  Plane,
  Car,
  TrendingUp,
  Briefcase,
} from 'lucide-react';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

type PayType = 'salary' | 'hourly';

interface JobOffer {
  label: string;
  payType: PayType;
  basePay: string; // annual salary OR hourly rate
  hoursPerWeek: string;
  signOnBonus: string;
  annualBonus: string; // expected annual bonus
  bonusTaxRate: string; // % (default 22% supplemental)
  retirementMatchPct: string; // % of salary employer matches
  retirementMatchLimit: string; // max $ employer will match
  healthInsuranceValue: string; // annual $ value of employer-paid health insurance
  ptoDays: string; // paid time off days per year
  holidaysDays: string; // paid holidays
  commuteMiles: string; // one-way miles
  commuteCostPerMile: string; // IRS rate ~$0.67/mile in 2026
  state: string;
}

// -----------------------------------------------------------------------
// Defaults & helpers
// -----------------------------------------------------------------------

const DEFAULT_OFFER_A: JobOffer = {
  label: 'Offer A — Current Job',
  payType: 'salary',
  basePay: '85000',
  hoursPerWeek: '40',
  signOnBonus: '0',
  annualBonus: '5000',
  bonusTaxRate: '22',
  retirementMatchPct: '4',
  retirementMatchLimit: '4000',
  healthInsuranceValue: '9000',
  ptoDays: '15',
  holidaysDays: '10',
  commuteMiles: '12',
  commuteCostPerMile: '0.67',
  state: 'Texas',
};

const DEFAULT_OFFER_B: JobOffer = {
  label: 'Offer B — New Offer',
  payType: 'hourly',
  basePay: '45',
  hoursPerWeek: '40',
  signOnBonus: '10000',
  annualBonus: '8000',
  bonusTaxRate: '22',
  retirementMatchPct: '6',
  retirementMatchLimit: '5000',
  healthInsuranceValue: '12000',
  ptoDays: '20',
  holidaysDays: '11',
  commuteMiles: '5',
  commuteCostPerMile: '0.67',
  state: 'Texas',
};

function num(s: string): number {
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

// -----------------------------------------------------------------------
// Calculation logic
// -----------------------------------------------------------------------

interface OfferTotals {
  grossBase: number; // annual gross base pay
  signOnBonusNet: number; // sign-on bonus after tax
  annualBonusNet: number; // annual bonus after tax
  retirementMatch: number; // employer 401(k) match value
  healthInsurance: number;
  ptoValue: number; // $ value of PTO + holidays
  commuteCost: number; // annual commute cost
  totalCashComp: number; // base + bonuses (gross)
  totalNetComp: number; // base + bonuses (after bonus tax)
  totalComp: number; // total comp including benefits, after commute
  effectiveHourlyRate: number;
  hoursWorkedPerYear: number;
  hoursAwayPerYear: number; // includes commute time
  effectiveHourlyRateAfterCommute: number;
}

function calcOffer(offer: JobOffer): OfferTotals {
  // Calculate gross base pay
  let grossBase: number;
  if (offer.payType === 'salary') {
    grossBase = num(offer.basePay);
  } else {
    grossBase = num(offer.basePay) * num(offer.hoursPerWeek) * 52;
  }

  // Calculate bonus net (after supplemental tax)
  const bonusTax = num(offer.bonusTaxRate) / 100;
  const signOnBonusNet = num(offer.signOnBonus) * (1 - bonusTax);
  const annualBonusNet = num(offer.annualBonus) * (1 - bonusTax);

  // Calculate 401(k) match
  const matchPct = num(offer.retirementMatchPct) / 100;
  const matchLimit = num(offer.retirementMatchLimit);
  const retirementMatch = Math.min(grossBase * matchPct, matchLimit);

  // Health insurance value (already provided)
  const healthInsurance = num(offer.healthInsuranceValue);

  // PTO value (paid days × daily rate)
  const ptoDays = num(offer.ptoDays);
  const holidaysDays = num(offer.holidaysDays);
  const dailyRate = grossBase / 260; // 52 weeks × 5 days
  const ptoValue = (ptoDays + holidaysDays) * dailyRate;

  // Commute cost (annual)
  const commuteMiles = num(offer.commuteMiles);
  const commuteCostPerMile = num(offer.commuteCostPerMile);
  const daysPerWeek = num(offer.hoursPerWeek) / 8;
  const commuteCost = commuteMiles * 2 * daysPerWeek * 50 * commuteCostPerMile; // 50 working weeks

  // Totals
  const totalCashComp = grossBase + num(offer.signOnBonus) + num(offer.annualBonus);
  const totalNetComp = grossBase + signOnBonusNet + annualBonusNet;
  const totalComp = totalNetComp + retirementMatch + healthInsurance + ptoValue - commuteCost;

  // Hours
  const hoursWorkedPerYear = num(offer.hoursPerWeek) * 52;
  const commuteHoursPerYear = (commuteMiles * 2 * daysPerWeek * 50) / 30; // assume 30 mph avg
  const hoursAwayPerYear = hoursWorkedPerYear + commuteHoursPerYear;

  // Effective hourly rate (total comp / hours worked, including commute time)
  const effectiveHourlyRate = totalComp / Math.max(hoursWorkedPerYear, 1);
  const effectiveHourlyRateAfterCommute = totalComp / Math.max(hoursAwayPerYear, 1);

  return {
    grossBase,
    signOnBonusNet,
    annualBonusNet,
    retirementMatch,
    healthInsurance,
    ptoValue,
    commuteCost,
    totalCashComp,
    totalNetComp,
    totalComp,
    effectiveHourlyRate,
    hoursWorkedPerYear,
    hoursAwayPerYear,
    effectiveHourlyRateAfterCommute,
  };
}

// -----------------------------------------------------------------------
// Offer Input Form Component
// -----------------------------------------------------------------------

function OfferForm({
  offer,
  onChange,
  accent,
}: {
  offer: JobOffer;
  onChange: (o: JobOffer) => void;
  accent: 'blue' | 'purple';
}) {
  const set = (key: keyof JobOffer, value: string) => {
    onChange({ ...offer, [key]: value });
  };

  const accentBg = accent === 'blue' ? 'bg-blue-50/60 border-blue-200' : 'bg-purple-50/60 border-purple-200';
  const accentText = accent === 'blue' ? 'text-blue-700' : 'text-purple-700';
  const accentBgStrong = accent === 'blue' ? 'bg-blue-600' : 'bg-purple-600';

  return (
    <Card className={`${accentBg} border-2`}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-lg ${accentText} flex items-center gap-2`}>
          <span className={`size-2 rounded-full ${accentBgStrong}`} />
          <Input
            value={offer.label}
            onChange={(e) => set('label', e.target.value)}
            className="border-0 bg-transparent p-0 h-auto text-lg font-bold focus-visible:ring-0"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={`${accent}-payType`} className="text-xs">Pay Type</Label>
            <Select value={offer.payType} onValueChange={(v) => set('payType', v as PayType)}>
              <SelectTrigger id={`${accent}-payType`} className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salary">Annual Salary</SelectItem>
                <SelectItem value="hourly">Hourly Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor={`${accent}-basePay`} className="text-xs">
              {offer.payType === 'salary' ? 'Annual Salary ($)' : 'Hourly Rate ($)'}
            </Label>
            <Input
              id={`${accent}-basePay`}
              type="number"
              value={offer.basePay}
              onChange={(e) => set('basePay', e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={`${accent}-hours`} className="text-xs">Hours/Week</Label>
            <Input
              id={`${accent}-hours`}
              type="number"
              value={offer.hoursPerWeek}
              onChange={(e) => set('hoursPerWeek', e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <Label htmlFor={`${accent}-state`} className="text-xs">State</Label>
            <Input
              id={`${accent}-state`}
              value={offer.state}
              onChange={(e) => set('state', e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Bonuses</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`${accent}-signOn`} className="text-xs">Sign-On Bonus ($)</Label>
              <Input
                id={`${accent}-signOn`}
                type="number"
                value={offer.signOnBonus}
                onChange={(e) => set('signOnBonus', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor={`${accent}-annualBonus`} className="text-xs">Annual Bonus ($)</Label>
              <Input
                id={`${accent}-annualBonus`}
                type="number"
                value={offer.annualBonus}
                onChange={(e) => set('annualBonus', e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          <div className="mt-2">
            <Label htmlFor={`${accent}-bonusTax`} className="text-xs">Bonus Tax Rate (%)</Label>
            <Input
              id={`${accent}-bonusTax`}
              type="number"
              value={offer.bonusTaxRate}
              onChange={(e) => set('bonusTaxRate', e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Benefits</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`${accent}-matchPct`} className="text-xs">401(k) Match %</Label>
              <Input
                id={`${accent}-matchPct`}
                type="number"
                value={offer.retirementMatchPct}
                onChange={(e) => set('retirementMatchPct', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor={`${accent}-matchLimit`} className="text-xs">Match Limit ($)</Label>
              <Input
                id={`${accent}-matchLimit`}
                type="number"
                value={offer.retirementMatchLimit}
                onChange={(e) => set('retirementMatchLimit', e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          <div className="mt-2">
            <Label htmlFor={`${accent}-health`} className="text-xs">Health Insurance Value ($/yr)</Label>
            <Input
              id={`${accent}-health`}
              type="number"
              value={offer.healthInsuranceValue}
              onChange={(e) => set('healthInsuranceValue', e.target.value)}
              className="h-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <Label htmlFor={`${accent}-pto`} className="text-xs">PTO Days</Label>
              <Input
                id={`${accent}-pto`}
                type="number"
                value={offer.ptoDays}
                onChange={(e) => set('ptoDays', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor={`${accent}-holidays`} className="text-xs">Paid Holidays</Label>
              <Input
                id={`${accent}-holidays`}
                type="number"
                value={offer.holidaysDays}
                onChange={(e) => set('holidaysDays', e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Commute</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`${accent}-miles`} className="text-xs">One-Way Miles</Label>
              <Input
                id={`${accent}-miles`}
                type="number"
                value={offer.commuteMiles}
                onChange={(e) => set('commuteMiles', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor={`${accent}-cost`} className="text-xs">Cost/Mile ($)</Label>
              <Input
                id={`${accent}-cost`}
                type="number"
                value={offer.commuteCostPerMile}
                onChange={(e) => set('commuteCostPerMile', e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// -----------------------------------------------------------------------
// Comparison Row
// -----------------------------------------------------------------------

function ComparisonRow({
  label,
  valueA,
  valueB,
  format = 'currency',
  icon: Icon,
}: {
  label: string;
  valueA: number;
  valueB: number;
  format?: 'currency' | 'percent';
  icon?: any;
}) {
  const aWins = valueA > valueB;
  const bWins = valueB > valueA;

  const fmtVal = (v: number) => {
    if (format === 'percent') return fmtPct(v);
    return fmt(v);
  };

  const diff = Math.abs(valueA - valueB);

  return (
    <div className="grid grid-cols-3 gap-2 items-center py-2 border-b border-border/30 last:border-b-0">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {Icon && <Icon className="size-3.5 shrink-0" />}
        <span>{label}</span>
      </div>
      <div className={`text-right font-semibold text-sm ${aWins ? 'text-blue-700' : ''}`}>
        {fmtVal(valueA)}
        {aWins && diff > 0 && (
          <Badge variant="secondary" className="ml-1 text-[10px] bg-blue-100 text-blue-700">
            +{format === 'percent' ? fmtPct(diff) : fmt(diff)}
          </Badge>
        )}
      </div>
      <div className={`text-right font-semibold text-sm ${bWins ? 'text-purple-700' : ''}`}>
        {fmtVal(valueB)}
        {bWins && diff > 0 && (
          <Badge variant="secondary" className="ml-1 text-[10px] bg-purple-100 text-purple-700">
            +{format === 'percent' ? fmtPct(diff) : fmt(diff)}
          </Badge>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// Main Page Component
// -----------------------------------------------------------------------

export default function JobOfferComparison() {
  const [offerA, setOfferA] = useState<JobOffer>(DEFAULT_OFFER_A);
  const [offerB, setOfferB] = useState<JobOffer>(DEFAULT_OFFER_B);

  const totalsA = useMemo(() => calcOffer(offerA), [offerA]);
  const totalsB = useMemo(() => calcOffer(offerB), [offerB]);

  const winner = totalsA.totalComp > totalsB.totalComp ? 'A' : totalsB.totalComp > totalsA.totalComp ? 'B' : 'tie';
  const diff = Math.abs(totalsA.totalComp - totalsB.totalComp);
  const diffPct = (diff / Math.min(totalsA.totalComp, totalsB.totalComp)) * 100;

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4" />
        Back to all calculators
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
            <Briefcase className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Job Offer Comparison Calculator
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Compare two job offers side-by-side. Includes salary, bonuses, retirement match, health insurance, PTO value, and commute cost.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <OfferForm offer={offerA} onChange={setOfferA} accent="blue" />
        <OfferForm offer={offerB} onChange={setOfferB} accent="purple" />
      </div>

      {/* Winner Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={`rounded-2xl p-6 mb-8 border-2 ${
          winner === 'A'
            ? 'bg-blue-50 border-blue-300'
            : winner === 'B'
            ? 'bg-purple-50 border-purple-300'
            : 'bg-muted border-border'
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          <Trophy className={`size-7 ${winner === 'A' ? 'text-blue-600' : winner === 'B' ? 'text-purple-600' : 'text-muted-foreground'}`} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Winner</p>
            <h2 className="text-xl font-bold">
              {winner === 'tie' ? (
                'It\'s a tie!'
              ) : (
                <>
                  {winner === 'A' ? offerA.label : offerB.label} wins by{' '}
                  <span className={winner === 'A' ? 'text-blue-700' : 'text-purple-700'}>
                    {fmt(diff)}/year
                  </span>{' '}
                  <span className="text-sm text-muted-foreground">({diffPct.toFixed(1)}% more)</span>
                </>
              )}
            </h2>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Total annual compensation includes base pay, sign-on bonus (year 1), annual bonus (after supplemental tax), 401(k) employer match, health insurance value, PTO value, minus annual commute cost.
        </p>
      </motion.div>

      {/* Detailed Comparison Table */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="grid grid-cols-3 gap-2 items-center">
            <div className="text-xs text-muted-foreground">Component</div>
            <div className="text-right text-sm font-semibold text-blue-700">{offerA.label}</div>
            <div className="text-right text-sm font-semibold text-purple-700">{offerB.label}</div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <ComparisonRow
            label="Gross Base Pay"
            valueA={totalsA.grossBase}
            valueB={totalsB.grossBase}
            icon={DollarSign}
          />
          <ComparisonRow
            label="Sign-On Bonus (after tax)"
            valueA={totalsA.signOnBonusNet}
            valueB={totalsB.signOnBonusNet}
            icon={DollarSign}
          />
          <ComparisonRow
            label="Annual Bonus (after tax)"
            valueA={totalsA.annualBonusNet}
            valueB={totalsB.annualBonusNet}
            icon={TrendingUp}
          />
          <ComparisonRow
            label="401(k) Match"
            valueA={totalsA.retirementMatch}
            valueB={totalsB.retirementMatch}
            icon={DollarSign}
          />
          <ComparisonRow
            label="Health Insurance Value"
            valueA={totalsA.healthInsurance}
            valueB={totalsB.healthInsurance}
            icon={Heart}
          />
          <ComparisonRow
            label="PTO + Holiday Value"
            valueA={totalsA.ptoValue}
            valueB={totalsB.ptoValue}
            icon={Calendar}
          />
          <ComparisonRow
            label="Commute Cost (annual)"
            valueA={-totalsA.commuteCost}
            valueB={-totalsB.commuteCost}
            icon={Car}
          />
          <div className="grid grid-cols-3 gap-2 items-center py-3 mt-2 border-t-2 border-border">
            <div className="text-sm font-bold">TOTAL COMPENSATION</div>
            <div className={`text-right text-lg font-bold ${winner === 'A' ? 'text-blue-700' : ''}`}>
              {fmt(totalsA.totalComp)}
            </div>
            <div className={`text-right text-lg font-bold ${winner === 'B' ? 'text-purple-700' : ''}`}>
              {fmt(totalsB.totalComp)}
            </div>
          </div>
          <ComparisonRow
            label="Effective Hourly Rate"
            valueA={totalsA.effectiveHourlyRate}
            valueB={totalsB.effectiveHourlyRate}
            icon={TrendingUp}
          />
          <ComparisonRow
            label="Effective Rate (after commute)"
            valueA={totalsA.effectiveHourlyRateAfterCommute}
            valueB={totalsB.effectiveHourlyRateAfterCommute}
            icon={TrendingUp}
          />
          <ComparisonRow
            label="Hours Worked/Year"
            valueA={totalsA.hoursWorkedPerYear}
            valueB={totalsB.hoursWorkedPerYear}
            icon={Calendar}
          />
          <ComparisonRow
            label="Hours Away/Year (incl. commute)"
            valueA={totalsA.hoursAwayPerYear}
            valueB={totalsB.hoursAwayPerYear}
            icon={Plane}
          />
        </CardContent>
      </Card>

      {/* Methodology */}
      <Card className="mt-8 bg-muted/30">
        <CardContent className="p-6 text-sm text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground">How we calculate total compensation</p>
          <p><strong>Gross base pay</strong>: Annual salary, or hourly rate × hours/week × 52 weeks.</p>
          <p><strong>Sign-on bonus (after tax)</strong>: Bonus × (1 − bonus tax rate). Default 22% federal supplemental rate; state tax not included.</p>
          <p><strong>Annual bonus (after tax)</strong>: Same as sign-on, but recurring annually.</p>
          <p><strong>401(k) match</strong>: Min(employer match % × gross salary, match limit). This is free money — always claim the full match.</p>
          <p><strong>Health insurance value</strong>: Annual $ value of employer-paid premiums. Average employer contribution: $7,000-$15,000/year for family coverage.</p>
          <p><strong>PTO + Holiday value</strong>: (PTO days + paid holidays) × (annual salary / 260 working days). Represents the value of paid time off.</p>
          <p><strong>Commute cost</strong>: One-way miles × 2 × days/week × 50 weeks × IRS mileage rate (default $0.67/mile in 2026). Doesn't include the time cost of commuting.</p>
          <p><strong>Total compensation</strong>: Net cash (base + after-tax bonuses) + 401(k) match + health insurance + PTO value − commute cost.</p>
          <p><strong>Effective hourly rate</strong>: Total compensation / hours worked per year. The "after commute" version divides by hours worked + commute time, capturing the hidden cost of a long commute.</p>
        </CardContent>
      </Card>

      {/* Related Calculators */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">Related Calculators</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <Link href="/calculators/salary-converter" className="text-emerald-600 hover:underline">Salary Converter</Link>
          <Link href="/calculators/hourly-paycheck-calculator" className="text-emerald-600 hover:underline">Hourly Paycheck Calculator</Link>
          <Link href="/calculators/salary-tax-calculator" className="text-emerald-600 hover:underline">Salary Tax Calculator</Link>
          <Link href="/calculators/after-tax-income-calculator" className="text-emerald-600 hover:underline">After-Tax Income Calculator</Link>
          <Link href="/calculators/bonus-tax-calculator" className="text-emerald-600 hover:underline">Bonus Tax Calculator</Link>
          <Link href="/calculators/salary-increase-calculator" className="text-emerald-600 hover:underline">Salary Increase Calculator</Link>
        </div>
      </div>
    </div>
  );
}
