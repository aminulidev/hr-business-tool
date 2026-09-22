'use client';

/**
 * BreakEvenCalculator — calculates the break-even point in units and
 * revenue, given fixed costs, variable cost per unit, and selling price.
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, DollarSign, Info, BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TryExample from './TryExample';

interface BreakEvenResult {
  contributionMargin: number;
  contributionMarginPct: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  breakEvenMonths: number;
  profitAtTarget: number;
  marginOfSafety: number;
  marginOfSafetyPct: number;
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const fmtUnits = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 0 });

const fmtPct = (n: number) => `${n.toFixed(1)}%`;

export default function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState('10000');
  const [variableCost, setVariableCost] = useState('60');
  const [sellingPrice, setSellingPrice] = useState('100');
  const [monthlyUnits, setMonthlyUnits] = useState('500');
  const [targetProfit, setTargetProfit] = useState('5000');

  const result = useMemo<BreakEvenResult | null>(() => {
    const fc = parseFloat(fixedCosts);
    const vc = parseFloat(variableCost);
    const sp = parseFloat(sellingPrice);
    const mu = parseFloat(monthlyUnits);
    const tp = parseFloat(targetProfit);

    if (isNaN(fc) || isNaN(vc) || isNaN(sp) || isNaN(mu) || isNaN(tp)) return null;
    if (sp <= vc) return null; // can't break even if variable cost >= selling price

    const contributionMargin = sp - vc;
    const contributionMarginPct = (contributionMargin / sp) * 100;
    const breakEvenUnits = fc / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * sp;
    const breakEvenMonths = breakEvenUnits / mu;
    const profitAtTarget = (mu * contributionMargin) - fc;
    const marginOfSafety = (mu * 12 - breakEvenUnits) / (mu * 12);
    const marginOfSafetyPct = marginOfSafety * 100;

    return {
      contributionMargin,
      contributionMarginPct,
      breakEvenUnits,
      breakEvenRevenue,
      breakEvenMonths,
      profitAtTarget,
      marginOfSafety: marginOfSafety * (mu * sp * 12),
      marginOfSafetyPct,
    };
  }, [fixedCosts, variableCost, sellingPrice, monthlyUnits, targetProfit]);

  const handleTryExample = () => {
    setFixedCosts('15000');
    setVariableCost('40');
    setSellingPrice('80');
    setMonthlyUnits('400');
    setTargetProfit('10000');
  };

  const handleReset = () => {
    setFixedCosts('10000');
    setVariableCost('60');
    setSellingPrice('100');
    setMonthlyUnits('500');
    setTargetProfit('5000');
  };

  return (
    <div className="p-5 sm:p-6 space-y-6">
      <TryExample onClick={handleTryExample} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fc" className="text-sm font-medium">Monthly Fixed Costs ($)</Label>
          <Input id="fc" type="number" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} className="mt-1" />
          <p className="text-xs text-muted-foreground mt-1">Rent, salaries, insurance, software</p>
        </div>
        <div>
          <Label htmlFor="vc" className="text-sm font-medium">Variable Cost Per Unit ($)</Label>
          <Input id="vc" type="number" value={variableCost} onChange={(e) => setVariableCost(e.target.value)} className="mt-1" />
          <p className="text-xs text-muted-foreground mt-1">Materials, direct labor, shipping</p>
        </div>
        <div>
          <Label htmlFor="sp" className="text-sm font-medium">Selling Price Per Unit ($)</Label>
          <Input id="sp" type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="mt-1" />
          <p className="text-xs text-muted-foreground mt-1">Must be greater than variable cost</p>
        </div>
        <div>
          <Label htmlFor="mu" className="text-sm font-medium">Monthly Units Sold</Label>
          <Input id="mu" type="number" value={monthlyUnits} onChange={(e) => setMonthlyUnits(e.target.value)} className="mt-1" />
          <p className="text-xs text-muted-foreground mt-1">Average monthly sales volume</p>
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="result-display space-y-5"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="size-4 text-emerald-600" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Break-Even Units</p>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{fmtUnits(result.breakEvenUnits)}</p>
              <p className="text-xs text-muted-foreground mt-1">units/month</p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="size-4 text-blue-600" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Break-Even Revenue</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{fmt(result.breakEvenRevenue)}</p>
              <p className="text-xs text-muted-foreground mt-1">monthly revenue</p>
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <BarChart3 className="size-4 text-purple-600" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Contribution Margin</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">{fmt(result.contributionMargin)}</p>
              <p className="text-xs text-muted-foreground mt-1">{fmtPct(result.contributionMarginPct)} of price</p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="size-4 text-amber-600" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Margin of Safety</p>
              </div>
              <p className="text-2xl font-bold text-amber-600">{fmtPct(result.marginOfSafetyPct)}</p>
              <p className="text-xs text-muted-foreground mt-1">{fmt(result.marginOfSafety)} annual buffer</p>
            </div>
          </div>

          <div className="rounded-xl bg-muted/40 p-4 text-sm space-y-2">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <Info className="size-4 text-primary" />
              Break-even analysis
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
              <li>Contribution margin = ${sellingPrice} − ${variableCost} = {fmt(result.contributionMargin)} per unit</li>
              <li>Break-even units = ${fixedCosts} fixed costs ÷ {fmt(result.contributionMargin)} contribution = {fmtUnits(result.breakEvenUnits)} units</li>
              <li>Break-even revenue = {fmtUnits(result.breakEvenUnits)} units × ${sellingPrice} = {fmt(result.breakEvenRevenue)}</li>
              <li>At {monthlyUnits} units/month, you break even in {result.breakEvenMonths.toFixed(1)} months</li>
              <li>Current monthly profit at {monthlyUnits} units: {fmt(result.profitAtTarget)}</li>
              <li>Margin of safety: you can lose {fmtPct(result.marginOfSafetyPct)} of annual sales before hitting break-even</li>
            </ul>
          </div>

          {/* Target profit calculation */}
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-sm font-semibold mb-2">Target profit: {fmt(parseFloat(targetProfit || '0'))}/month</p>
            <p className="text-xs text-muted-foreground">
              Units needed for target profit = (Fixed Costs + Target Profit) ÷ Contribution Margin
              <br />
              = ({fmt(parseFloat(fixedCosts))} + {fmt(parseFloat(targetProfit || '0'))}) ÷ {fmt(result.contributionMargin)}
              <br />
              <strong className="text-foreground">= {fmtUnits((parseFloat(fixedCosts) + parseFloat(targetProfit || '0')) / result.contributionMargin)} units/month</strong>
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={handleReset}>Reset</Button>
        </motion.div>
      )}
    </div>
  );
}
