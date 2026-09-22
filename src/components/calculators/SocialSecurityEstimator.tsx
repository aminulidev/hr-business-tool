'use client';

/**
 * SocialSecurityEstimator — estimates monthly Social Security
 * retirement benefit at full retirement age based on earnings history.
 *
 * The actual SSA calculation uses your 35 highest-earning years (inflation-
 * adjusted) and applies bend points. This calculator approximates that using
 * the 2026 bend points and a simplified average of recent earnings.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Calendar, DollarSign, Info, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TryExample from './TryExample';

interface SocialSecurityResult {
  aime: number; // Average Indexed Monthly Earnings
  pia: number; // Primary Insurance Amount (monthly benefit at FRA)
  monthlyAt62: number; // reduced benefit at 62
  monthlyAt67: number; // benefit at FRA (67 for those born 1960+)
  monthlyAt70: number; // delayed benefit at 70
  annualAtFRA: number;
  lifetimeAtFRA: number; // expected lifetime payout (to age 85)
  lifetimeAt70: number;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

// 2026 bend points (approximate, based on 2025 COLA + 2.5% projection)
const BEND_POINT_1 = 1289; // 90% up to this
const BEND_POINT_2 = 7783; // 32% from bend 1 to 2; 15% above

export default function SocialSecurityEstimator() {
  const [annualIncome, setAnnualIncome] = useState('75000');
  const [currentAge, setCurrentAge] = useState('35');
  const [yearsWorked, setYearsWorked] = useState('15');
  const [retireAge, setRetireAge] = useState('67');

  const result = useMemo<SocialSecurityResult | null>(() => {
    const income = parseFloat(annualIncome);
    const age = parseInt(currentAge);
    const worked = parseInt(yearsWorked);
    const retire = parseInt(retireAge);

    if (isNaN(income) || isNaN(age) || isNaN(worked) || isNaN(retire)) return null;
    if (income <= 0 || worked <= 0) return null;

    // Cap at 2026 wage base ($176,100)
    const ssWages = Math.min(income, 176100);
    const yearsTo35 = Math.max(0, 35 - worked);
    // AIME = (sum of 35 highest indexed years) / 420 (35 years × 12 months)
    // Simplified: assume current income is the indexed average
    const aime = (ssWages * Math.min(worked, 35) + 0 * yearsTo35) / 420;

    // PIA calculation using bend points
    let pia = 0;
    if (aime <= BEND_POINT_1) {
      pia = aime * 0.90;
    } else if (aime <= BEND_POINT_2) {
      pia = BEND_POINT_1 * 0.90 + (aime - BEND_POINT_1) * 0.32;
    } else {
      pia = BEND_POINT_1 * 0.90 + (BEND_POINT_2 - BEND_POINT_1) * 0.32 + (aime - BEND_POINT_2) * 0.15;
    }

    // Adjustments for claiming age
    // FRA is 67 for anyone born 1960 or later
    // At 62: ~30% reduction
    // At 70: ~24% increase (8%/year for 3 years)
    const monthlyAt62 = pia * 0.70;
    const monthlyAt67 = pia;
    const monthlyAt70 = pia * 1.24;

    // Lifetime projections (to age 85)
    const lifetimeAtFRA = pia * 12 * (85 - retire);
    const lifetimeAt70 = monthlyAt70 * 12 * (85 - 70);

    return {
      aime,
      pia,
      monthlyAt62,
      monthlyAt67,
      monthlyAt70,
      annualAtFRA: pia * 12,
      lifetimeAtFRA,
      lifetimeAt70,
    };
  }, [annualIncome, currentAge, yearsWorked, retireAge]);

  const handleTryExample = () => {
    setAnnualIncome('95000');
    setCurrentAge('40');
    setYearsWorked('18');
    setRetireAge('67');
  };

  const handleReset = () => {
    setAnnualIncome('75000');
    setCurrentAge('35');
    setYearsWorked('15');
    setRetireAge('67');
  };

  return (
    <div className="p-5 sm:p-6 space-y-6">
      <TryExample onClick={handleTryExample} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="income" className="text-sm font-medium">Current Annual Income ($)</Label>
          <Input id="income" type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="mt-1" />
          <p className="text-xs text-muted-foreground mt-1">Capped at 2026 SS wage base ($176,100)</p>
        </div>
        <div>
          <Label htmlFor="age" className="text-sm font-medium">Current Age</Label>
          <Input id="age" type="number" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="worked" className="text-sm font-medium">Years Worked (SS-covered)</Label>
          <Input id="worked" type="number" value={yearsWorked} onChange={(e) => setYearsWorked(e.target.value)} className="mt-1" />
          <p className="text-xs text-muted-foreground mt-1">Need 10+ years (40 credits) to qualify</p>
        </div>
        <div>
          <Label htmlFor="retire" className="text-sm font-medium">Planned Retirement Age</Label>
          <Select value={retireAge} onValueChange={setRetireAge}>
            <SelectTrigger id="retire" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="62">62 (earliest — 30% reduction)</SelectItem>
              <SelectItem value="67">67 (Full Retirement Age)</SelectItem>
              <SelectItem value="70">70 (maximum — 24% increase)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="result-display space-y-5"
        >
          {/* Hero result */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="size-6" />
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                Estimated Monthly Benefit
              </p>
            </div>
            <p className="text-4xl font-bold mb-1">{fmt(result.pia)}/mo</p>
            <p className="text-sm text-blue-100">
              at Full Retirement Age (67) — your Primary Insurance Amount (PIA)
            </p>
          </div>

          {/* Claiming age comparison */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Age 62</p>
              <p className="text-lg font-bold text-red-600">{fmt(result.monthlyAt62)}</p>
              <p className="text-xs text-muted-foreground mt-1">−30% reduced</p>
            </div>
            <div className="rounded-xl border-2 border-emerald-500 bg-emerald-500/5 p-4 text-center">
              <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">Age 67 (FRA)</p>
              <p className="text-lg font-bold text-emerald-600">{fmt(result.monthlyAt67)}</p>
              <p className="text-xs text-muted-foreground mt-1">Full benefit</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Age 70</p>
              <p className="text-lg font-bold text-blue-600">{fmt(result.monthlyAt70)}</p>
              <p className="text-xs text-muted-foreground mt-1">+24% increased</p>
            </div>
          </div>

          {/* Annual + lifetime */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="size-4 text-blue-600" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Annual at FRA</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{fmt(result.annualAtFRA)}</p>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="size-4 text-purple-600" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Lifetime (to age 85)</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">{fmt(result.lifetimeAtFRA)}</p>
              <p className="text-xs text-muted-foreground mt-1">If claim at FRA, live to 85</p>
            </div>
          </div>

          <div className="rounded-xl bg-muted/40 p-4 text-sm space-y-2">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <Info className="size-4 text-primary" />
              How this is calculated
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
              <li><strong>AIME</strong> (Average Indexed Monthly Earnings) ≈ {fmt(result.aime)}/mo</li>
              <li>Simplified: assumes your current income is the inflation-adjusted average across your 35 highest-earning years</li>
              <li><strong>PIA formula</strong> uses 2026 bend points: 90% of first ${BEND_POINT_1}, 32% of ${BEND_POINT_1}-${BEND_POINT_2}, 15% above ${BEND_POINT_2}</li>
              <li><strong>Age 62 claim</strong>: ~30% permanent reduction (born 1960+)</li>
              <li><strong>Age 70 claim</strong>: ~24% permanent increase (8%/year delayed retirement credit for 3 years past FRA)</li>
              <li><strong>Lifetime payout</strong> assumes you live to age 85 (US average life expectancy at 65 is ~84)</li>
            </ul>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-amber-800">
            <strong>Disclaimer:</strong> This is a simplified estimate. The actual SSA calculation uses your full 35-year earnings history
            with inflation indexing (AWI factor) and may differ by ±20%. For your official benefit, create an account at{' '}
            <a href="https://www.ssa.gov/myaccount" target="_blank" rel="noopener noreferrer" className="underline">
              ssa.gov/myaccount
            </a>.
          </div>

          <Button variant="outline" size="sm" onClick={handleReset}>Reset</Button>
        </motion.div>
      )}
    </div>
  );
}
