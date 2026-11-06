// ---------------------------------------------------------------------------
// Bulk payroll (Roadmap v2, Phase 16.1): paste up to 25 employees as CSV, get
// gross-to-net for each from the same engine the single-employee calculator
// runs, plus the employer-side cost, and download the table as CSV.
// ---------------------------------------------------------------------------

import {
  calculatePaycheck,
  PERIODS_PER_YEAR,
  type FilingStatus,
  type PaycheckInput,
  type PaycheckResult,
  type PaycheckState,
  type PayFrequency,
  type StateCode,
} from './withholding-2026';
import { STATE_CODES, STATE_PAYCHECK_PAGES } from './state-pages';
import { calculateEmployerCost, type EmployerCostResult } from './employer-cost-2026';

export const BULK_MAX_ROWS = 25;

/** Input columns, in positional order; a header row may reorder them by name */
export const BULK_COLUMNS = [
  { key: 'name', label: 'name', help: 'Any text (optional)' },
  { key: 'type', label: 'type', help: 'hourly or salary (default hourly)' },
  { key: 'pay', label: 'pay', help: 'Hourly rate, or annual salary when type is salary' },
  { key: 'hours', label: 'hours', help: 'Regular hours per week (hourly only, default 40)' },
  { key: 'overtime', label: 'overtime', help: 'Overtime hours per week at 1.5× (default 0)' },
  { key: 'state', label: 'state', help: 'Two-letter code from the 30 supported states, or none' },
  { key: 'status', label: 'status', help: 'single, married or hoh (default single)' },
  { key: 'allowances', label: 'allowances', help: 'State allowances/exemptions (default: the state default)' },
  { key: '401k', label: '401k_pct', help: '401(k) % of gross, pre-tax (default 0)' },
  { key: 'benefits', label: 'benefits', help: 'Section 125 benefits per paycheck, pre-tax (default 0)' },
] as const;

export type BulkColumnKey = (typeof BULK_COLUMNS)[number]['key'];

export interface BulkRow {
  line: number;
  name: string;
  type: 'hourly' | 'salary';
  pay: number;
  hours: number;
  overtime: number;
  state: PaycheckState;
  status: FilingStatus;
  allowances: number;
  retirementPct: number;
  benefitsPerPeriod: number;
}

export interface BulkParseError {
  line: number;
  message: string;
}

export interface BulkParseResult {
  rows: BulkRow[];
  errors: BulkParseError[];
  /** true when more than BULK_MAX_ROWS data lines were supplied (extra lines dropped) */
  truncated: boolean;
}

const HEADER_ALIASES: Record<string, BulkColumnKey> = {
  name: 'name',
  employee: 'name',
  type: 'type',
  paytype: 'type',
  pay: 'pay',
  rate: 'pay',
  salary: 'pay',
  wage: 'pay',
  hours: 'hours',
  hoursperweek: 'hours',
  overtime: 'overtime',
  ot: 'overtime',
  othours: 'overtime',
  state: 'state',
  status: 'status',
  filingstatus: 'status',
  filing: 'status',
  allowances: 'allowances',
  exemptions: 'allowances',
  '401k': '401k',
  '401kpct': '401k',
  retirement: '401k',
  benefits: 'benefits',
  benefitsperpaycheck: 'benefits',
  section125: 'benefits',
};

/** Split one CSV line, honouring double quotes; also accepts tab- or semicolon-separated lines */
export function splitCsvLine(line: string): string[] {
  const sep = line.includes('\t') ? '\t' : line.includes(';') && !line.includes(',') ? ';' : ',';
  const out: string[] = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === sep) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

function headerMap(cells: string[]): Record<number, BulkColumnKey> | null {
  const map: Record<number, BulkColumnKey> = {};
  let hits = 0;
  cells.forEach((c, i) => {
    const key = HEADER_ALIASES[norm(c)];
    if (key) {
      map[i] = key;
      hits++;
    }
  });
  // a header row has at least two recognised names and no plain numbers
  const numeric = cells.filter((c) => /^-?\d+(\.\d+)?$/.test(c)).length;
  return hits >= 2 && numeric === 0 ? map : null;
}

function defaultAllowances(state: PaycheckState, status: FilingStatus): number {
  if (state === 'none' || state === 'other') return 0;
  const a = STATE_PAYCHECK_PAGES[state as StateCode].allowances;
  if (!a) return 0;
  return status === 'married' ? a.defaultMarried : a.defaultSingle;
}

export function parseBulkCsv(text: string): BulkParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((l, i) => ({ line: i + 1, text: l }))
    .filter((l) => l.text.trim() !== '' && !l.text.trim().startsWith('#'));
  const rows: BulkRow[] = [];
  const errors: BulkParseError[] = [];
  if (lines.length === 0) return { rows, errors, truncated: false };

  let map: Record<number, BulkColumnKey> | null = headerMap(splitCsvLine(lines[0].text));
  let data = lines;
  if (map) data = lines.slice(1);
  else map = Object.fromEntries(BULK_COLUMNS.map((c, i) => [i, c.key]));

  const truncated = data.length > BULK_MAX_ROWS;
  for (const { line, text } of data.slice(0, BULK_MAX_ROWS)) {
    const cells = splitCsvLine(text);
    const get = (key: BulkColumnKey) => {
      const idx = Object.keys(map!).find((i) => map![Number(i)] === key);
      return idx === undefined ? '' : (cells[Number(idx)] ?? '');
    };
    const name = get('name');
    const typeRaw = norm(get('type'));
    const type: BulkRow['type'] = typeRaw === 'salary' || typeRaw === 'annual' || typeRaw === 's' ? 'salary' : 'hourly';
    const pay = parseFloat(get('pay').replace(/[$,]/g, ''));
    const hours = get('hours') === '' ? 40 : parseFloat(get('hours'));
    const overtime = get('overtime') === '' ? 0 : parseFloat(get('overtime'));
    const stateRaw = get('state').toUpperCase();
    const state: PaycheckState | null =
      stateRaw === '' || stateRaw === 'NONE' ? 'none' : (STATE_CODES as readonly string[]).includes(stateRaw) ? (stateRaw as StateCode) : null;
    const statusRaw = norm(get('status'));
    const status: FilingStatus | null =
      statusRaw === '' || statusRaw === 'single' || statusRaw === 's'
        ? 'single'
        : statusRaw === 'married' || statusRaw === 'mfj' || statusRaw === 'm'
          ? 'married'
          : statusRaw === 'hoh' || statusRaw === 'headofhousehold' || statusRaw === 'h'
            ? 'hoh'
            : null;
    const retirementPct = get('401k') === '' ? 0 : parseFloat(get('401k').replace('%', ''));
    const benefitsPerPeriod = get('benefits') === '' ? 0 : parseFloat(get('benefits').replace(/[$,]/g, ''));

    if (!(pay > 0)) {
      errors.push({ line, message: `${name || `Line ${line}`}: pay must be a number above 0 (hourly rate or annual salary).` });
      continue;
    }
    if (state === null) {
      errors.push({ line, message: `${name || `Line ${line}`}: unknown state "${get('state')}". Use a two-letter code from the supported list or "none".` });
      continue;
    }
    if (status === null) {
      errors.push({ line, message: `${name || `Line ${line}`}: status must be single, married or hoh.` });
      continue;
    }
    if (type === 'hourly' && (!(hours >= 0) || !(overtime >= 0) || hours + overtime > 168 || hours + overtime === 0)) {
      errors.push({ line, message: `${name || `Line ${line}`}: hours must be between 1 and 168 a week.` });
      continue;
    }
    if (!(retirementPct >= 0 && retirementPct <= 100) || !(benefitsPerPeriod >= 0)) {
      errors.push({ line, message: `${name || `Line ${line}`}: 401k_pct must be 0–100 and benefits 0 or more.` });
      continue;
    }
    const allowRaw = get('allowances');
    const allowances = allowRaw === '' ? defaultAllowances(state, status) : Math.max(0, parseInt(allowRaw, 10) || 0);
    rows.push({ line, name, type, pay, hours: type === 'salary' ? 40 : hours, overtime: type === 'salary' ? 0 : overtime, state, status, allowances, retirementPct, benefitsPerPeriod });
  }
  return { rows, errors, truncated };
}

export interface BulkResult {
  row: BulkRow;
  input: PaycheckInput;
  paycheck: PaycheckResult;
  employer: EmployerCostResult;
  /** Convenience per-paycheck figures for the table */
  federal: number;
  fica: number;
  stateTax: number;
  otherWithholding: number;
  preTax: number;
}

export function runBulkPayroll(rows: BulkRow[], payFrequency: PayFrequency): BulkResult[] {
  const periods = PERIODS_PER_YEAR[payFrequency];
  return rows.map((row) => {
    const hourlyRate = row.type === 'salary' ? row.pay / 2080 : row.pay;
    const grossAnnual = (hourlyRate * row.hours + hourlyRate * 1.5 * row.overtime) * 52;
    const input: PaycheckInput = {
      state: row.state,
      hourlyRate,
      regularHoursPerWeek: row.hours,
      overtimeHoursPerWeek: row.overtime,
      overtimeMultiplier: 1.5,
      payFrequency,
      filingStatus: row.status,
      stateAllowances: row.allowances,
      preTaxRetirementAnnual: grossAnnual * (row.retirementPct / 100),
      preTaxBenefitsAnnual: row.benefitsPerPeriod * periods,
    };
    const paycheck = calculatePaycheck(input);
    const employer = calculateEmployerCost({
      state: row.state,
      grossAnnual: paycheck.grossAnnual,
      ficaWagesAnnual: paycheck.ficaWagesAnnual,
      payFrequency,
      hoursPerYear: (row.hours + row.overtime) * 52,
    });
    const sum = (pred: (key: string) => boolean) => paycheck.deductions.filter((d) => pred(d.key)).reduce((s, d) => s + d.perPeriod, 0);
    return {
      row,
      input,
      paycheck,
      employer,
      federal: sum((k) => k === 'federal'),
      fica: sum((k) => k === 'social-security' || k === 'medicare'),
      stateTax: sum((k) => k === 'state' || k === 'local'),
      otherWithholding: sum((k) => !['federal', 'social-security', 'medicare', 'state', 'local', 'retirement', 'benefits', 'other'].includes(k)),
      preTax: sum((k) => k === 'retirement' || k === 'benefits'),
    };
  });
}

const csvCell = (v: string | number) => {
  const s = typeof v === 'number' ? (Math.round(v * 100) / 100).toFixed(2) : v;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const BULK_OUTPUT_HEADERS = [
  'name',
  'type',
  'pay',
  'hours',
  'overtime',
  'state',
  'status',
  'gross_per_paycheck',
  'federal_income_tax',
  'social_security_medicare',
  'state_tax',
  'state_programs',
  'pretax_deductions',
  'net_per_paycheck',
  'gross_annual',
  'net_annual',
  'employer_taxes_per_paycheck',
  'total_cost_per_paycheck',
] as const;

export function bulkToCsv(results: BulkResult[]): string {
  const lines = [BULK_OUTPUT_HEADERS.join(',')];
  for (const r of results) {
    lines.push(
      [
        csvCell(r.row.name),
        r.row.type,
        csvCell(r.row.pay),
        csvCell(r.row.hours),
        csvCell(r.row.overtime),
        r.row.state,
        r.row.status,
        csvCell(r.paycheck.grossPerPeriod),
        csvCell(r.federal),
        csvCell(r.fica),
        csvCell(r.stateTax),
        csvCell(r.otherWithholding),
        csvCell(r.preTax),
        csvCell(r.paycheck.netPerPeriod),
        csvCell(r.paycheck.grossAnnual),
        csvCell(r.paycheck.netAnnual),
        csvCell(r.employer.employerTaxesPerPeriod),
        csvCell(r.employer.totalCostPerPeriod),
      ].join(','),
    );
  }
  return lines.join('\n');
}

export const BULK_EXAMPLE_CSV = `name,type,pay,hours,overtime,state,status,allowances,401k_pct,benefits
Maria Lopez,hourly,24.50,40,4,TX,single,,5,80
Devon Carter,salary,68000,,,CA,married,2,6,150
Priya Shah,hourly,19,32,0,FL,hoh,,0,0`;
