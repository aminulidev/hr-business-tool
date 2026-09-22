'use client';

/**
 * ContractorVsEmployeeCalculator — compares total take-home as a 1099
 * contractor vs. W-2 employee at the same gross pay.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Briefcase, TrendingUp, Info, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TryExample from './TryExample';

interface ComparisonResult {
  contractor1099: {
    gross: number;
    secaTax: number;
    incomeTax: number;
    totalTax: number;
    netTakeHome: number;
    effectiveRate: number;
  };
  employeeW2: {
    gross: number;
    ficaTax: number;
    incomeTax: number;
    totalTax: number;
    netTakeHome: number;
    effectiveRate: number;
  };
  winner: '1099' | 'w2' | 'tie';
  annualDifference: number;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const fmtPct = (n: number) => `${n.toFixed(1)}%`;

// 2026 federal tax brackets (single filer, standard deduction $15,300)
function calcFederalTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  let tax = 0;
  const brackets = [
    { min: 0, max: 12150, rate: 0.10 },
    { min: 12150, max: 49350, rate: 0.12 },
    { min: 49350, max: 105250, rate: 0.22 },
    { min: 105250, max: 200900, rate: 0.24 },
    { min: 200900, max: 255350, rate: 0.32 },
    { min: 255350, max: 639950, rate: 0.35 },
    { min: 639950, max: Infinity, rate: 0.37 },
  ];
  for (const b of brackets) {
    if (taxableIncome > b.min) {
      tax += (Math.min(taxableIncome, b.max) - b.min) * b.rate;
    } else break;
  }
  return tax;
}

export default function ContractorVsEmployeeCalculator() {
  const [annualGross, setAnnualGross] = useState('120000');
  const [stateTaxRate, setStateTaxRate] = useState('5');

  const result = useMemo<ComparisonResult | null>(() => {
    const gross = parseFloat(annualGross);
    const stateRate = parseFloat(stateTaxRate) / 100;
    if (isNaN(gross) || isNaN(stateRate) || gross <= 0) return null;

    const SS_WAGE_BASE = 176100;
    const SS_RATE = 0.124; // 12.4% combined
    const MEDICARE_RATE = 0.029; // 2.9% combined

    // ----- 1099 Contractor -----
    // SECA tax (both halves of FICA)
    const ssWages1099 = Math.min(gross, SS_WAGE_BASE);
    const secaSS = ssWages1099 * SS_RATE;
    const secaMedicare = gross * MEDICARE_RATE;
    const secaTax = secaSS + secaMedicare;
    // SECA deduction: half of SECA reduces taxable income
    const secaDeduction = secaTax / 2;
    const taxableIncome1099 = Math.max(0, gross - secaDeduction - 15300); // standard deduction
    const fedTax1099 = calcFederalTax(taxableIncome1099);
    const stateTax1099 = taxableIncome1099 * stateRate;
    const totalTax1099 = secaTax + fedTax1099 + stateTax1099;
    const net1099 = gross - totalTax1099;

    // ----- W-2 Employee -----
    // FICA (employee half only)
    const ficaSS = Math.min(gross, SS_WAGE_BASE) * 0.062;
    const ficaMedicare = gross * 0.0145;
    const ficaTax = ficaSS + ficaMedicare;
    const taxableIncomeW2 = Math.max(0, gross - 15300);
    const fedTaxW2 = calcFederalTax(taxableIncomeW2);
    const stateTaxW2 = taxableIncomeW2 * stateRate;
    const totalTaxW2 = ficaTax + fedTaxW2 + stateTaxW2;
    const netW2 = gross - totalTaxW2;

    const winner = net1099 > netW2 + 100 ? '1099' : netW2 > net1099 + 100 ? 'w2' : 'tie';
    const annualDifference = Math.abs(net1099 - netW2);

    return {
      contractor1099: {
        gross,
        secaTax,
        incomeTax: fedTax1099 + stateTax1099,
        totalTax: totalTax1099,
        netTakeHome: net1099,
        effectiveRate: (totalTax1099 / gross) * 100,
      },
      employeeW2: {
        gross,
        ficaTax,
        incomeTax: fedTaxW2 + stateTaxW2,
        totalTax: totalTaxW2,
        netTakeHome: netW2,
        effectiveRate: (totalTaxW2 / gross) * 100,
      },
      winner,
      annualDifference,
    };
  }, [annualGross, stateTaxRate]);

  const handleTryExample = () => {
    setAnnualGross('150000');
    setStateTaxRate('5');
  };

  const handleReset = () => {
    setAnnualGross('120000');
    setStateTaxRate('5');
  };

  return (
    <div className="p-5 sm:p-6 space-y-6">
      <TryExample onClick={handleTryExample} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gross" className="text-sm font-medium">Annual Gross Income ($)</Label>
          <Input
            id="gross"
            type="number"
            value={annualGross}
            onChange={(e) => setAnnualGross(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Same gross for both 1099 and W-2 scenarios</p>
        </div>
        <div>
          <Label htmlFor="state" className="text-sm font-medium">State Tax Rate (%)</Label>
          <Input
            id="state"
            type="number"
            value={stateTaxRate}
            onChange={(e) => setStateTaxRate(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Avg: TX 0%, CA ~9%, NY ~7%</p>
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="result-display space-y-5"
        >
          {/* Winner Banner */}
          <div
            className={`rounded-2xl p-5 border-2 ${
              result.winner === '1099'
                ? 'bg-blue-50 border-blue-300'
                : result.winner === 'w2'
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-muted border-border'
            }`}
          >
            <div className="flex items-center gap-3">
              <Trophy
                className={`size-7 ${
                  result.winner === '1099' ? 'text-blue-600' : result.winner === 'w2' ? 'text-emerald-600' : 'text-muted-foreground'
                }`}
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Higher Net Take-Home
                </p>
                <p className="text-lg font-bold">
                  {result.winner === 'tie' ? (
                    'Both options are roughly equal'
                  ) : (
                    <>
                      {result.winner === '1099' ? '1099 Contractor' : 'W-2 Employee'} wins by{' '}
                      <span className={result.winner === '1099' ? 'text-blue-700' : 'text-emerald-700'}>
                        {fmt(result.annualDifference)}/year
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              This comparison is purely tax-based. W-2 employees typically also receive benefits (health insurance, 401k match, paid leave) worth $10,000-$25,000/year that are NOT included in this calculation.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1099 Card */}
            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="size-5 text-blue-600" />
                <h3 className="font-semibold text-blue-700">1099 Contractor</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Gross income</span><span className="font-medium">{fmt(result.contractor1099.gross)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">SECA tax (15.3%)</span><span className="font-medium text-red-600">−{fmt(result.contractor1099.secaTax)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Income tax (fed + state)</span><span className="font-medium text-red-600">−{fmt(result.contractor1099.incomeTax)}</span></div>
                <div className="border-t pt-2 flex justify-between"><span className="font-semibold">Total tax</span><span className="font-bold text-red-600">{fmt(result.contractor1099.totalTax)}</span></div>
                <div className="border-t pt-2 flex justify-between"><span className="font-semibold">NET TAKE-HOME</span><span className="font-bold text-emerald-600 text-lg">{fmt(result.contractor1099.netTakeHome)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Effective rate</span><Badge variant="secondary">{fmtPct(result.contractor1099.effectiveRate)}</Badge></div>
              </div>
            </div>

            {/* W-2 Card */}
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="size-5 text-emerald-600" />
                <h3 className="font-semibold text-emerald-700">W-2 Employee</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Gross income</span><span className="font-medium">{fmt(result.employeeW2.gross)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">FICA tax (7.65%)</span><span className="font-medium text-red-600">−{fmt(result.employeeW2.ficaTax)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Income tax (fed + state)</span><span className="font-medium text-red-600">−{fmt(result.employeeW2.incomeTax)}</span></div>
                <div className="border-t pt-2 flex justify-between"><span className="font-semibold">Total tax</span><span className="font-bold text-red-600">{fmt(result.employeeW2.totalTax)}</span></div>
                <div className="border-t pt-2 flex justify-between"><span className="font-semibold">NET TAKE-HOME</span><span className="font-bold text-emerald-600 text-lg">{fmt(result.employeeW2.netTakeHome)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Effective rate</span><Badge variant="secondary">{fmtPct(result.employeeW2.effectiveRate)}</Badge></div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-muted/40 p-4 text-sm space-y-2">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <Info className="size-4 text-primary" />
              Key differences
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
              <li><strong>SECA (1099):</strong> 12.4% Social Security + 2.9% Medicare = 15.3% total (both halves)</li>
              <li><strong>FICA (W-2):</strong> 6.2% Social Security + 1.45% Medicare = 7.65% total (employee half only)</li>
              <li><strong>SECA deduction:</strong> Contractors can deduct half of SECA from taxable income (effectively reducing income tax)</li>
              <li><strong>2026 Social Security wage base:</strong> $176,100 — Social Security portion stops above this income</li>
              <li><strong>Benefits NOT included:</strong> W-2 employees typically receive health insurance, 401(k) match, paid leave worth $10k-$25k/year</li>
              <li><strong>1099 deductions:</strong> Contractors can deduct business expenses (home office, mileage, equipment) — not modeled here</li>
            </ul>
          </div>

          <Button variant="outline" size="sm" onClick={handleReset}>Reset</Button>
        </motion.div>
      )}
    </div>
  );
}
