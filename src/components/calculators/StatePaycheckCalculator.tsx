'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Clock, Calendar, Users, MapPin, Info, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TryExample from './TryExample';
import { formatCurrency } from '@/lib/utils';
import {
  calculatePaycheck,
  TAX_YEAR,
  type FilingStatus,
  type PayFrequency,
  type PaycheckResult,
  type StateCode,
} from '@/lib/payroll/withholding-2026';
import { STATE_PAYCHECK_PAGES } from '@/lib/payroll/state-pages';

const FREQ_LABELS: Record<PayFrequency, string> = {
  weekly: 'Weekly (52 paychecks)',
  'bi-weekly': 'Bi-Weekly (26 paychecks)',
  'semi-monthly': 'Semi-Monthly (24 paychecks)',
  monthly: 'Monthly (12 paychecks)',
};

const FILING_LABELS: Record<FilingStatus, string> = {
  single: 'Single or Married Filing Separately',
  married: 'Married Filing Jointly',
  hoh: 'Head of Household',
};

export default function StatePaycheckCalculator({ state }: { state: StateCode }) {
  const page = STATE_PAYCHECK_PAGES[state];

  const [hourlyRate, setHourlyRate] = useState('');
  const [regularHours, setRegularHours] = useState('40');
  const [overtimeHours, setOvertimeHours] = useState('0');
  const [payFrequency, setPayFrequency] = useState<PayFrequency>('bi-weekly');
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [allowances, setAllowances] = useState(String(page.allowances?.defaultSingle ?? 0));
  const [nycResident, setNycResident] = useState(false);
  const [result, setResult] = useState<PaycheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const changeFilingStatus = (status: FilingStatus) => {
    setFilingStatus(status);
    // Keep the state allowance default in step with filing status until the user edits it
    if (page.allowances) {
      const defaults = [page.allowances.defaultSingle, page.allowances.defaultMarried].map(String);
      if (defaults.includes(allowances)) {
        setAllowances(String(status === 'married' ? page.allowances.defaultMarried : page.allowances.defaultSingle));
      }
    }
    setResult(null);
  };

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    const rate = parseFloat(hourlyRate);
    const reg = parseFloat(regularHours);
    const ot = parseFloat(overtimeHours || '0');
    const allow = parseInt(allowances || '0', 10);

    if (isNaN(rate) || rate <= 0) {
      setError('Please enter your hourly wage.');
      return;
    }
    if (isNaN(reg) || reg < 0 || reg > 168) {
      setError('Please enter regular hours per week between 0 and 168.');
      return;
    }
    if (isNaN(ot) || ot < 0 || reg + ot > 168) {
      setError('Please enter valid overtime hours (total hours cannot exceed 168 per week).');
      return;
    }
    if (page.allowances && (isNaN(allow) || allow < 0 || allow > 99)) {
      setError(`Please enter your ${page.allowances.label} as a whole number (0 or more).`);
      return;
    }

    setResult(
      calculatePaycheck({
        state,
        hourlyRate: rate,
        regularHoursPerWeek: reg,
        overtimeHoursPerWeek: ot,
        overtimeMultiplier: 1.5,
        payFrequency,
        filingStatus,
        stateAllowances: page.allowances ? allow : 0,
        nycResident: state === 'NY' && nycResident,
      })
    );
  };

  const handleTryExample = () => {
    setHourlyRate('25');
    setRegularHours('40');
    setOvertimeHours('5');
    setPayFrequency('bi-weekly');
    setFilingStatus('single');
    setAllowances(String(page.allowances?.defaultSingle ?? 0));
    setNycResident(state === 'NY');
    setError(null);
    setResult(null);
  };

  const handleReset = () => {
    setHourlyRate('');
    setRegularHours('40');
    setOvertimeHours('0');
    setPayFrequency('bi-weekly');
    setFilingStatus('single');
    setAllowances(String(page.allowances?.defaultSingle ?? 0));
    setNycResident(false);
    setError(null);
    setResult(null);
  };

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        {/* Wage & Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spHourlyRate" className="text-sm font-medium">
              <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Hourly Wage ($)
            </Label>
            <Input
              id="spHourlyRate"
              type="number"
              min="0"
              step="0.01"
              placeholder={`e.g., ${page.minimumWage.toFixed(2)}`}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spRegHours" className="text-sm font-medium">
              <Clock className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Regular Hours / Week
            </Label>
            <Input
              id="spRegHours"
              type="number"
              min="0"
              step="0.5"
              value={regularHours}
              onChange={(e) => setRegularHours(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spOtHours" className="text-sm font-medium">
              Overtime Hours / Week (1.5×)
            </Label>
            <Input
              id="spOtHours"
              type="number"
              min="0"
              step="0.5"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(e.target.value)}
            />
          </div>
        </div>

        {/* Pay Frequency & Filing Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spFrequency" className="text-sm font-medium">
              <Calendar className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Pay Frequency
            </Label>
            <Select value={payFrequency} onValueChange={(v) => { setPayFrequency(v as PayFrequency); setResult(null); }}>
              <SelectTrigger id="spFrequency" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(FREQ_LABELS) as PayFrequency[]).map((f) => (
                  <SelectItem key={f} value={f}>{FREQ_LABELS[f]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="spFiling" className="text-sm font-medium">
              <Users className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Federal Filing Status (W-4)
            </Label>
            <Select value={filingStatus} onValueChange={(v) => changeFilingStatus(v as FilingStatus)}>
              <SelectTrigger id="spFiling" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(FILING_LABELS) as FilingStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{FILING_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* State-specific inputs */}
        {page.allowances ? (
          <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
            <p className="text-sm font-semibold flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {page.name} Withholding
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div className="space-y-1.5">
                <Label htmlFor="spAllowances" className="text-xs text-muted-foreground">
                  {page.allowances.label}
                </Label>
                <Input
                  id="spAllowances"
                  type="number"
                  min="0"
                  step="1"
                  value={allowances}
                  onChange={(e) => setAllowances(e.target.value)}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">{page.allowances.help}</p>
              </div>
              {state === 'NY' && (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-background px-3 py-2.5 sm:mt-5">
                  <Label htmlFor="spNyc" className="text-sm">I live in New York City</Label>
                  <Switch id="spNyc" checked={nycResident} onCheckedChange={(v) => { setNycResident(v); setResult(null); }} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
            <p>
              {page.name} has no state income tax and no employee-paid state payroll taxes, so only federal
              income tax, Social Security, and Medicare come out of your paycheck.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex gap-3">
            <TryExample onClick={handleTryExample} />
            <Button onClick={handleReset} variant="outline" size="lg" className="shrink-0">
              Reset
            </Button>
          </div>
          <Button
            onClick={handleCalculate}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Calculate Take-Home Pay
          </Button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 px-4 sm:px-6 result-display"
          aria-live="polite"
        >
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-6">
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground font-medium">Take-Home Pay per Paycheck</p>
              <p className="text-4xl font-bold text-emerald-600">{formatCurrency(result.netPerPeriod)}</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(result.netAnnual)} per year · {formatCurrency(result.netPerHour)} per hour worked
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Gross Pay', value: formatCurrency(result.grossPerPeriod), color: 'text-blue-600' },
                {
                  label: 'Total Deductions',
                  value: formatCurrency(result.grossPerPeriod - result.netPerPeriod),
                  color: 'text-amber-600',
                },
                { label: 'Effective Rate', value: `${(result.effectiveRate * 100).toFixed(1)}%`, color: 'text-foreground' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-background border border-border/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className={`text-base sm:text-lg font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs"></th>
                      <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs">Per Paycheck</th>
                      <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs">Per Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <tr className="font-medium">
                      <td className="px-4 py-2.5">Gross pay</td>
                      <td className="text-right px-4 py-2.5">{formatCurrency(result.grossPerPeriod)}</td>
                      <td className="text-right px-4 py-2.5">{formatCurrency(result.grossAnnual)}</td>
                    </tr>
                    {result.deductions.map((d) => (
                      <tr key={d.key}>
                        <td className="px-4 py-2.5 text-muted-foreground">{d.label}</td>
                        <td className="text-right px-4 py-2.5 text-red-500">−{formatCurrency(d.perPeriod)}</td>
                        <td className="text-right px-4 py-2.5 text-red-500">−{formatCurrency(d.annual)}</td>
                      </tr>
                    ))}
                    <tr className="font-semibold bg-emerald-500/5">
                      <td className="px-4 py-2.5">Take-home pay</td>
                      <td className="text-right px-4 py-2.5 text-emerald-600">{formatCurrency(result.netPerPeriod)}</td>
                      <td className="text-right px-4 py-2.5 text-emerald-600">{formatCurrency(result.netAnnual)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-muted/30 border border-border/30 p-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                Estimate based on {TAX_YEAR} IRS and {page.name} withholding formulas for a standard W-4 with no
                pre-tax deductions. 401(k) contributions, health insurance premiums, or extra W-4 withholding will
                change your actual paycheck.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
