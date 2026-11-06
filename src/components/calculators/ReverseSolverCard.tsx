'use client';

import { useState } from 'react';
import { ArrowRight, Target } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { PERIODS_PER_YEAR, type PaycheckInput, type PayFrequency } from '@/lib/payroll/withholding-2026';
import { solveHourlyRateForNet, solveSalaryForNet, targetPerPeriod, type TargetBasis } from '@/lib/payroll/reverse-solver';

interface ReverseSolverCardProps {
  mode: 'hourly' | 'salary';
  /** Current form settings applied to a candidate rate; null while the form is invalid */
  buildInput: (hourlyRate: number) => PaycheckInput | null;
  payFrequency: PayFrequency;
  /** Copies the solved rate (or salary) into the form above */
  onApply: (hourlyRate: number) => void;
}

const BASIS_LABEL: Record<TargetBasis, string> = { paycheck: 'per paycheck', month: 'per month', year: 'per year' };

/**
 * Reverse solver (Phase 16.1): enter the take-home you need and get the gross
 * hourly rate or salary that produces it under the current state, filing
 * status, pay frequency and deductions. Bisection on the live engine, so the
 * answer always agrees with the forward calculation above.
 */
export default function ReverseSolverCard({ mode, buildInput, payFrequency, onApply }: ReverseSolverCardProps) {
  const [target, setTarget] = useState('');
  const [basis, setBasis] = useState<TargetBasis>(mode === 'salary' ? 'month' : 'paycheck');

  const periods = PERIODS_PER_YEAR[payFrequency];
  const amount = parseFloat(target);
  const formValid = buildInput(1) !== null;
  const build = (rate: number) => buildInput(rate)!;
  const solved =
    amount > 0 && amount < 1e7 && formValid
      ? mode === 'salary'
        ? solveSalaryForNet(build, targetPerPeriod(amount, basis, periods))
        : solveHourlyRateForNet(build, targetPerPeriod(amount, basis, periods))
      : null;
  const salary: number | null = solved && 'salary' in solved ? (solved as { salary: number }).salary : null;

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4 sm:p-5 space-y-3">
      <div className="flex items-start gap-2">
        <Target className="h-4 w-4 mt-0.5 text-violet-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Work backwards: how much do I need to earn?</p>
          <p className="text-xs text-muted-foreground">
            Enter the take-home pay you need and get the gross {mode === 'salary' ? 'salary' : 'hourly rate'} that produces it with the
            state, filing status, pay frequency and deductions set above.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
        <div className="space-y-1.5">
          <Label htmlFor="reverse-target" className="text-xs">
            Take-home pay I need
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <Input
              id="reverse-target"
              type="number"
              inputMode="decimal"
              min="0"
              step="50"
              placeholder={mode === 'salary' ? '4,000' : '1,500'}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="pl-7"
            />
          </div>
        </div>
        <div className="space-y-1.5 sm:w-40">
          <Label className="text-xs">Basis</Label>
          <Select value={basis} onValueChange={(v) => setBasis(v as TargetBasis)}>
            <SelectTrigger aria-label="Target basis">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(BASIS_LABEL) as TargetBasis[]).map((b) => (
                <SelectItem key={b} value={b}>
                  {BASIS_LABEL[b]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {amount > 0 && !formValid && (
        <p className="text-xs text-amber-600">Fix the inputs above first; the solver uses the same settings.</p>
      )}
      {amount > 0 && formValid && !solved && (
        <p className="text-xs text-amber-600">That target is out of range for the hours entered.</p>
      )}
      {solved && (
        <div className="rounded-xl bg-background border border-border/50 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3" aria-live="polite">
          <div className="text-sm">
            <p>
              To take home <strong>{formatCurrency(amount)}</strong> {BASIS_LABEL[basis]} you need{' '}
              <strong className="text-violet-700 dark:text-violet-400 text-base">
                {salary !== null ? `${formatCurrency(salary)} a year` : `${formatCurrency(solved.hourlyRate)} an hour`}
              </strong>
              .
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gross {formatCurrency(solved.result.grossPerPeriod)} per paycheck ({formatCurrency(solved.result.grossAnnual)}/yr) → take-home{' '}
              {formatCurrency(solved.result.netPerPeriod)} per paycheck ({formatCurrency(solved.result.netAnnual)}/yr). Taxes and deductions take{' '}
              {(solved.result.effectiveRate * 100).toFixed(1)}%.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onApply(solved.hourlyRate)}
            className="shrink-0 border-violet-500/30 hover:bg-violet-500/10 text-violet-700 dark:text-violet-300"
          >
            Use this {salary !== null ? 'salary' : 'rate'} above <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
