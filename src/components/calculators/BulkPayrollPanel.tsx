'use client';

import { useMemo, useState } from 'react';
import { Download, Users, AlertCircle, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { TAX_YEAR, type PayFrequency } from '@/lib/payroll/withholding-2026';
import { STATE_CODES, STATE_PAYCHECK_PAGES } from '@/lib/payroll/state-pages';
import { BULK_COLUMNS, BULK_EXAMPLE_CSV, BULK_MAX_ROWS, bulkToCsv, parseBulkCsv, runBulkPayroll } from '@/lib/payroll/bulk-payroll';

const FREQ_LABELS: Record<PayFrequency, string> = {
  weekly: 'Weekly (52 paychecks)',
  'bi-weekly': 'Bi-Weekly (26 paychecks)',
  'semi-monthly': 'Semi-Monthly (24 paychecks)',
  monthly: 'Monthly (12 paychecks)',
};

/**
 * Bulk payroll (Phase 16.1): paste up to 25 employees as CSV and get a
 * gross-to-net table from the same engine as the single calculator, with the
 * employer cost per row and a CSV download. No upload, nothing leaves the page.
 */
export default function BulkPayrollPanel({ initialFrequency = 'bi-weekly' }: { initialFrequency?: PayFrequency }) {
  const [text, setText] = useState(BULK_EXAMPLE_CSV);
  const [payFrequency, setPayFrequency] = useState<PayFrequency>(initialFrequency);
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => parseBulkCsv(text), [text]);
  const results = useMemo(() => runBulkPayroll(parsed.rows, payFrequency), [parsed.rows, payFrequency]);

  const totals = results.reduce(
    (t, r) => ({
      gross: t.gross + r.paycheck.grossPerPeriod,
      federal: t.federal + r.federal,
      fica: t.fica + r.fica,
      state: t.state + r.stateTax + r.otherWithholding,
      preTax: t.preTax + r.preTax,
      net: t.net + r.paycheck.netPerPeriod,
      employer: t.employer + r.employer.employerTaxesPerPeriod,
      cost: t.cost + r.employer.totalCostPerPeriod,
    }),
    { gross: 0, federal: 0, fica: 0, state: 0, preTax: 0, net: 0, employer: 0, cost: 0 },
  );

  const csv = () => bulkToCsv(results);

  const download = () => {
    const blob = new Blob([csv()], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-${payFrequency}-${TAX_YEAR}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const copy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(csv());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stateList = [...STATE_CODES].sort().join(', ');

  return (
    <div className="p-4 sm:p-6 space-y-5 calculator-form">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3">
        <p className="text-sm font-semibold flex items-center gap-1.5">
          <Users className="h-4 w-4 text-muted-foreground" />
          Paste up to {BULK_MAX_ROWS} employees (CSV, one per line)
        </p>
        <p className="text-xs text-muted-foreground">
          Columns in order: {BULK_COLUMNS.map((c) => c.label).join(', ')}. A header row with those names lets you reorder or skip columns. Supported states: {stateList}, or <code>none</code>. Everything runs in your browser; nothing is uploaded.
        </p>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          spellCheck={false}
          className="font-mono text-xs"
          aria-label="Employee CSV"
        />
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,16rem)_1fr] gap-3 items-end">
          <div className="space-y-1.5">
            <Label className="text-xs">Pay frequency (whole batch)</Label>
            <Select value={payFrequency} onValueChange={(v) => setPayFrequency(v as PayFrequency)}>
              <SelectTrigger aria-label="Pay frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(FREQ_LABELS) as PayFrequency[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {FREQ_LABELS[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => setText(BULK_EXAMPLE_CSV)}>
              Reset example
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setText('')}>
              Clear
            </Button>
          </div>
        </div>
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer font-medium text-foreground">Column reference</summary>
          <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            {BULK_COLUMNS.map((c) => (
              <li key={c.key}>
                <code className="text-foreground">{c.label}</code> — {c.help}
              </li>
            ))}
          </ul>
        </details>
      </div>

      {parsed.errors.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-semibold flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" /> {parsed.errors.length} line{parsed.errors.length === 1 ? '' : 's'} skipped
          </p>
          <ul className="list-disc pl-5">
            {parsed.errors.map((e) => (
              <li key={e.line}>
                Line {e.line}: {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {parsed.truncated && (
        <p className="text-xs text-amber-700">Only the first {BULK_MAX_ROWS} employees were used; split a larger roster into batches.</p>
      )}

      {results.length > 0 && (
        <div className="result-display rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5 space-y-4" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                {results.length} employee{results.length === 1 ? '' : 's'} · {FREQ_LABELS[payFrequency]} · {TAX_YEAR} withholding
              </p>
              <p className="text-xs text-muted-foreground">
                Net payroll {formatCurrency(totals.net)} · gross {formatCurrency(totals.gross)} · total cost incl. employer taxes {formatCurrency(totals.cost)} per pay run
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={copy}>
                {copied ? <Check className="h-4 w-4 mr-1.5 text-emerald-600" /> : <Copy className="h-4 w-4 mr-1.5" />}
                {copied ? 'Copied' : 'Copy CSV'}
              </Button>
              <Button type="button" size="sm" onClick={download} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Download className="h-4 w-4 mr-1.5" /> Download CSV
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl bg-background border border-border/50">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30 text-muted-foreground">
                  <th className="text-left px-3 py-2 font-medium">Employee</th>
                  <th className="text-left px-3 py-2 font-medium">State</th>
                  <th className="text-right px-3 py-2 font-medium">Gross</th>
                  <th className="text-right px-3 py-2 font-medium">Federal</th>
                  <th className="text-right px-3 py-2 font-medium">FICA</th>
                  <th className="text-right px-3 py-2 font-medium">State &amp; programs</th>
                  <th className="text-right px-3 py-2 font-medium">Pre-tax</th>
                  <th className="text-right px-3 py-2 font-medium">Net pay</th>
                  <th className="text-right px-3 py-2 font-medium">Employer taxes</th>
                  <th className="text-right px-3 py-2 font-medium">Total cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {results.map((r) => (
                  <tr key={r.row.line} className="hover:bg-muted/20">
                    <td className="px-3 py-2">
                      <div className="font-medium">{r.row.name || `Line ${r.row.line}`}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {r.row.type === 'salary' ? `${formatCurrency(r.row.pay)}/yr` : `${formatCurrency(r.row.pay)}/hr × ${r.row.hours}h${r.row.overtime ? ` + ${r.row.overtime} OT` : ''}`} · {r.row.status}
                      </div>
                    </td>
                    <td className="px-3 py-2">{r.row.state === 'none' ? '—' : STATE_PAYCHECK_PAGES[r.row.state as keyof typeof STATE_PAYCHECK_PAGES].name}</td>
                    <td className="text-right px-3 py-2">{formatCurrency(r.paycheck.grossPerPeriod)}</td>
                    <td className="text-right px-3 py-2 text-red-500">{formatCurrency(r.federal)}</td>
                    <td className="text-right px-3 py-2 text-red-500">{formatCurrency(r.fica)}</td>
                    <td className="text-right px-3 py-2 text-red-500">{formatCurrency(r.stateTax + r.otherWithholding)}</td>
                    <td className="text-right px-3 py-2 text-muted-foreground">{formatCurrency(r.preTax)}</td>
                    <td className="text-right px-3 py-2 font-semibold text-emerald-600">{formatCurrency(r.paycheck.netPerPeriod)}</td>
                    <td className="text-right px-3 py-2 text-amber-600">{formatCurrency(r.employer.employerTaxesPerPeriod)}</td>
                    <td className="text-right px-3 py-2 font-semibold text-sky-600">{formatCurrency(r.employer.totalCostPerPeriod)}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-muted/20">
                  <td className="px-3 py-2" colSpan={2}>
                    Totals per pay run
                  </td>
                  <td className="text-right px-3 py-2">{formatCurrency(totals.gross)}</td>
                  <td className="text-right px-3 py-2 text-red-500">{formatCurrency(totals.federal)}</td>
                  <td className="text-right px-3 py-2 text-red-500">{formatCurrency(totals.fica)}</td>
                  <td className="text-right px-3 py-2 text-red-500">{formatCurrency(totals.state)}</td>
                  <td className="text-right px-3 py-2 text-muted-foreground">{formatCurrency(totals.preTax)}</td>
                  <td className="text-right px-3 py-2 text-emerald-600">{formatCurrency(totals.net)}</td>
                  <td className="text-right px-3 py-2 text-amber-600">{formatCurrency(totals.employer)}</td>
                  <td className="text-right px-3 py-2 text-sky-600">{formatCurrency(totals.cost)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            Standard W-4 for every employee (no Steps 2–4), state default allowances unless given, employer SUI at each state&apos;s {TAX_YEAR} new-employer rate (industry-rated states: SUI left out). The CSV adds gross and net per year. Open an employee in the single calculator for W-4 adjustments, a pay stub or the employer breakdown.
          </p>
        </div>
      )}
    </div>
  );
}
