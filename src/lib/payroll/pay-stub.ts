// ---------------------------------------------------------------------------
// Pay stub preview (Roadmap v2, Phase 16.1): a print-ready earnings statement
// built from a PaycheckResult (and optionally the employer-cost result). One
// HTML renderer feeds both the on-screen preview (iframe srcDoc) and the
// Print / Save-as-PDF action, so the two can never differ. No PDF library:
// the browser's print dialog produces the PDF.
// ---------------------------------------------------------------------------

import type { PaycheckResult, PayFrequency } from './withholding-2026';
import type { EmployerCostResult } from './employer-cost-2026';

export interface PayStubData {
  employeeName: string;
  employerName: string;
  /** ISO date (YYYY-MM-DD) printed as the pay date */
  payDate: string;
  /** 1-based pay period number within the year; YTD columns are perPeriod × periodNumber */
  periodNumber: number;
  payFrequency: PayFrequency;
  payFrequencyLabel: string;
  stateName: string;
  taxYear: number;
  /** Hourly mode: hours and rate are printed; salary mode: one salary line */
  isSalary: boolean;
  hourlyRate: number;
  regularHoursPerWeek: number;
  overtimeHoursPerWeek: number;
  annualSalary?: number;
  result: PaycheckResult;
  employer?: EmployerCostResult | null;
  /** Absolute URL of the calculator, printed in the footer */
  sourceUrl: string;
}

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const hrs = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Pay period number for a date: how many paydays have passed this year, including this one */
export function defaultPeriodNumber(date: Date, periodsPerYear: number): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return Math.min(periodsPerYear, Math.max(1, Math.floor((dayOfYear * periodsPerYear) / 365) + 1));
}

export function formatPayDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

interface StubLine {
  label: string;
  current: number;
  ytd: number;
}

/** The numbers on the stub, exposed for tests and the copy-to-clipboard summary */
export function payStubLines(data: PayStubData) {
  const { result, periodNumber } = data;
  const periods = result.periodsPerYear;
  const n = Math.max(1, Math.min(periods, Math.round(periodNumber)));
  const ytd = (perPeriod: number) => Math.round(perPeriod * n * 100) / 100;

  const earnings: (StubLine & { hours?: number; rate?: number })[] = [];
  if (data.isSalary) {
    earnings.push({ label: 'Salary', current: result.grossPerPeriod, ytd: ytd(result.grossPerPeriod) });
  } else {
    const regHours = (data.regularHoursPerWeek * 52) / periods;
    const otHours = (data.overtimeHoursPerWeek * 52) / periods;
    const regPay = Math.round(regHours * data.hourlyRate * 100) / 100;
    const otPay = Math.round(result.grossPerPeriod * 100 - regPay * 100) / 100;
    earnings.push({ label: 'Regular', hours: regHours, rate: data.hourlyRate, current: regPay, ytd: ytd(regPay) });
    if (otHours > 0) earnings.push({ label: 'Overtime (1.5×)', hours: otHours, rate: data.hourlyRate * 1.5, current: otPay, ytd: ytd(otPay) });
  }

  const preTax = result.deductions.filter((d) => d.key === 'retirement' || d.key === 'benefits').map((d) => ({ label: d.label, current: d.perPeriod, ytd: ytd(d.perPeriod) }));
  const taxes = result.deductions.filter((d) => !['retirement', 'benefits', 'other'].includes(d.key)).map((d) => ({ label: d.label, current: d.perPeriod, ytd: ytd(d.perPeriod) }));
  const postTax = result.deductions.filter((d) => d.key === 'other').map((d) => ({ label: d.label, current: d.perPeriod, ytd: ytd(d.perPeriod) }));
  const employer = (data.employer?.lines ?? []).map((l) => ({ label: l.label, current: l.perPeriod, ytd: ytd(l.perPeriod) }));

  return {
    periodNumber: n,
    earnings,
    preTax,
    taxes,
    postTax,
    employer,
    gross: { current: result.grossPerPeriod, ytd: ytd(result.grossPerPeriod) },
    totalDeductions: { current: Math.round((result.grossPerPeriod - result.netPerPeriod) * 100) / 100, ytd: ytd(result.grossPerPeriod - result.netPerPeriod) },
    net: { current: result.netPerPeriod, ytd: ytd(result.netPerPeriod) },
    employerTotal: data.employer ? { current: data.employer.employerTaxesPerPeriod, ytd: ytd(data.employer.employerTaxesPerPeriod) } : null,
  };
}

/** Standalone HTML document: inline CSS, Letter/A4 friendly, prints on one page */
export function buildPayStubHtml(data: PayStubData): string {
  const L = payStubLines(data);
  const e = escapeHtml;
  const row = (l: StubLine & { hours?: number; rate?: number }, withHours = false) =>
    `<tr><td>${e(l.label)}</td>${withHours ? `<td class="num">${l.hours !== undefined ? hrs(l.hours) : ''}</td><td class="num">${l.rate !== undefined ? usd(l.rate) : ''}</td>` : ''}<td class="num">${usd(l.current)}</td><td class="num muted">${usd(l.ytd)}</td></tr>`;
  const section = (title: string, lines: StubLine[], total?: { current: number; ytd: number } | null, totalLabel = 'Total') =>
    lines.length === 0
      ? ''
      : `<table><thead><tr><th>${e(title)}</th><th class="num">Current</th><th class="num">YTD</th></tr></thead><tbody>${lines.map((l) => row(l)).join('')}${
          total ? `<tr class="total"><td>${e(totalLabel)}</td><td class="num">${usd(total.current)}</td><td class="num muted">${usd(total.ytd)}</td></tr>` : ''
        }</tbody></table>`;

  const employee = data.employeeName.trim() || 'Employee';
  const employer = data.employerName.trim() || 'Employer';
  const periodText = `Pay period ${L.periodNumber} of ${data.result.periodsPerYear} (${e(data.payFrequencyLabel)})`;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Pay stub preview — ${e(employee)} — ${e(formatPayDate(data.payDate))}</title>
<style>
  @page { size: auto; margin: 0.5in; }
  * { box-sizing: border-box; }
  body { font: 12px/1.45 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111; margin: 0; padding: 24px; background: #fff; }
  .stub { max-width: 760px; margin: 0 auto; border: 1px solid #cfd4dc; border-radius: 8px; padding: 28px 32px; position: relative; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 16px; }
  .head h1 { font-size: 18px; margin: 0 0 2px; letter-spacing: 0.02em; }
  .head .sub { color: #555; font-size: 11px; }
  .head .title { text-align: right; }
  .head .title strong { display: block; font-size: 15px; letter-spacing: 0.08em; text-transform: uppercase; }
  .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 16px; margin-bottom: 16px; font-size: 11.5px; }
  .meta div span { display: block; color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
  th { text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: #444; border-bottom: 1px solid #999; padding: 6px 6px 4px; }
  td { padding: 5px 6px; border-bottom: 1px solid #e6e8ec; }
  .num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .muted { color: #666; }
  tr.total td { font-weight: 700; border-top: 1px solid #999; border-bottom: none; }
  .net { display: flex; justify-content: space-between; align-items: center; background: #f0faf4; border: 1px solid #a7e3bf; border-radius: 6px; padding: 12px 16px; margin: 6px 0 16px; }
  .net strong { font-size: 20px; }
  .net .ytd { color: #555; font-size: 11px; }
  .employer { border-top: 1px dashed #bbb; padding-top: 12px; margin-top: 4px; }
  .employer h2 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #444; margin: 0 0 6px; }
  .foot { font-size: 10px; color: #666; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 8px; }
  .wm { position: absolute; right: 32px; top: 28px; font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 0.1em; }
  @media print { body { padding: 0; } .stub { border: none; padding: 0; } }
</style></head><body>
<div class="stub">
  <div class="head">
    <div><h1>${e(employer)}</h1><div class="sub">Earnings statement · ${data.taxYear} withholding · ${e(data.stateName)}</div></div>
    <div class="title"><strong>Pay stub</strong><div class="sub">Estimate — not an official payroll record</div></div>
  </div>
  <div class="meta">
    <div><span>Employee</span>${e(employee)}</div>
    <div><span>Pay date</span>${e(formatPayDate(data.payDate))}</div>
    <div><span>Pay period</span>${periodText}</div>
  </div>
  <table><thead><tr><th>Earnings</th>${data.isSalary ? '' : '<th class="num">Hours</th><th class="num">Rate</th>'}<th class="num">Current</th><th class="num">YTD</th></tr></thead><tbody>
    ${L.earnings.map((l) => row(l, !data.isSalary)).join('')}
    <tr class="total"><td>Gross pay</td>${data.isSalary ? '' : '<td></td><td></td>'}<td class="num">${usd(L.gross.current)}</td><td class="num muted">${usd(L.gross.ytd)}</td></tr>
  </tbody></table>
  ${section('Pre-tax deductions', L.preTax)}
  ${section('Taxes withheld', L.taxes)}
  ${section('Post-tax deductions', L.postTax)}
  <table><tbody><tr class="total"><td>Total deductions</td><td class="num">${usd(L.totalDeductions.current)}</td><td class="num muted">${usd(L.totalDeductions.ytd)}</td></tr></tbody></table>
  <div class="net"><div>Net pay <span class="ytd">· YTD ${usd(L.net.ytd)}</span></div><strong>${usd(L.net.current)}</strong></div>
  ${
    L.employer.length
      ? `<div class="employer"><h2>Employer contributions (not deducted from pay)</h2>${section('Employer-paid taxes', L.employer, L.employerTotal, 'Total employer taxes')}</div>`
      : ''
  }
  <div class="foot">Generated by QuickBizCalc from the ${data.taxYear} IRS Publication 15-T percentage method and ${e(data.stateName)} withholding rules for the inputs shown. Year-to-date figures assume identical pay every period. This is a planning estimate, not a legal pay statement or proof of income. ${e(data.sourceUrl)}</div>
  <div class="wm">QuickBizCalc</div>
</div>
</body></html>`;
}
