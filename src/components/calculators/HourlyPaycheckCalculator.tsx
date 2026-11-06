'use client';

import { useState, useMemo } from 'react';
import { useInitialQuery } from '@/hooks/useSearchParam';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Clock,
  Calendar,
  Users,
  MapPin,
  Info,
  AlertCircle,
  Copy,
  Check,
  PiggyBank,
  BookmarkPlus,
  ArrowRight,
  Sparkles,
  Link2,
  FileText,
  Receipt,
  User,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TryExample from './TryExample';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { formatCurrency } from '@/lib/utils';
import {
  calculatePaycheck,
  PERIODS_PER_YEAR,
  TAX_YEAR,
  type FilingStatus,
  type PayFrequency,
  W4_CHILD_CREDIT,
  W4_OTHER_DEPENDENT_CREDIT,
  type PaycheckInput,
  type PaycheckResult,
  type PaycheckState,
  type StateCode,
  type W4Adjustments,
} from '@/lib/payroll/withholding-2026';
import { STATE_CODES, STATE_PAYCHECK_PAGES } from '@/lib/payroll/state-pages';
import EmployerCostPanel, { ResultViewToggle, type ResultView } from './EmployerCostPanel';
import ReverseSolverCard from './ReverseSolverCard';
import PaycheckScenarioCompare from './PaycheckScenarioCompare';
import PayStubDialog from './PayStubDialog';
import BulkPayrollPanel from './BulkPayrollPanel';
import { useSearchParam } from '@/hooks/useSearchParam';
import { calculateEmployerCost } from '@/lib/payroll/employer-cost-2026';
import { parseScenarioParams, writeScenarioParams, type CompareScenario } from '@/lib/payroll/scenario-params';

// ---------------------------------------------------------------------------
// Labels & Presets
// ---------------------------------------------------------------------------

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

const HOURLY_PRESETS = ['16', '20', '25', '30', '40', '55'];
const SALARY_PRESETS = ['45000', '65000', '85000', '110000', '150000'];

// States with exact 2026 withholding tables, alphabetical
const EXACT_STATES: StateCode[] = [...STATE_CODES].sort((a, b) =>
  STATE_PAYCHECK_PAGES[a].name.localeCompare(STATE_PAYCHECK_PAGES[b].name)
);

const NO_TAX_STATES = 'Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming';

const SALARY_HOURS_PER_WEEK = 40;
const SALARY_HOURS_PER_YEAR = SALARY_HOURS_PER_WEEK * 52;

function isExactState(s: PaycheckState): s is StateCode {
  return s !== 'none' && s !== 'other';
}

function defaultAllowances(s: PaycheckState, status: FilingStatus): string {
  if (!isExactState(s)) return '0';
  const a = STATE_PAYCHECK_PAGES[s].allowances;
  if (!a) return '0';
  return String(status === 'married' ? a.defaultMarried : a.defaultSingle);
}

interface HistoryInputs {
  hourlyRate: string;
  regularHours: string;
  overtimeHours: string;
  annualSalary: string;
  payFrequency: string;
  filingStatus: string;
  state: string;
  allowances: string;
  customStateRate: string;
  retirementPct: string;
  benefitsPerPeriod: string;
  otherDeductions: string;
  nycResident: string;
}

export type PaycheckMode = 'hourly' | 'salary';

interface PaycheckDefaults {
  hourlyRate: string;
  regularHours: string;
  overtimeHours: string;
  annualSalary: string;
  payFrequency: PayFrequency;
  filingStatus: FilingStatus;
  state: PaycheckState;
  allowances: string;
  retirementPct: string;
  benefitsPerPeriod: string;
  otherDeductions: string;
  nycResident: boolean;
  /** ?view=employer opens the employer-cost side of the result */
  view: ResultView;
  /** Scenario B from b_* params, or null */
  compare: CompareScenario | null;
  /** Form W-4 Steps 2–4 (w4_2, w4_kids, w4_dep, w4_a, w4_b, w4_c) */
  w4MultipleJobs: boolean;
  w4Children: string;
  w4Dependents: string;
  w4OtherIncome: string;
  w4Deductions: string;
  w4Extra: string;
}

/** Steps 2–4 as the engine wants them; undefined when every field is blank */
function w4FromInputs(multipleJobs: boolean, children: string, dependents: string, otherIncome: string, deductions: string, extra: string): W4Adjustments | undefined {
  const kids = parseInt(children || '0', 10) || 0;
  const deps = parseInt(dependents || '0', 10) || 0;
  const w4: W4Adjustments = {
    multipleJobs,
    dependentsCredit: kids * W4_CHILD_CREDIT + deps * W4_OTHER_DEPENDENT_CREDIT,
    otherIncome: parseFloat(otherIncome || '0') || 0,
    deductions: parseFloat(deductions || '0') || 0,
    extraWithholdingPerPeriod: parseFloat(extra || '0') || 0,
  };
  return multipleJobs || w4.dependentsCredit || w4.otherIncome || w4.deductions || w4.extraWithholdingPerPeriod ? w4 : undefined;
}

const scenarioOf = (d: PaycheckDefaults): CompareScenario => ({
  state: d.state,
  hourlyRate: d.hourlyRate,
  regularHours: d.regularHours,
  overtimeHours: d.overtimeHours,
  annualSalary: d.annualSalary,
  filingStatus: d.filingStatus,
  payFrequency: d.payFrequency,
  retirementPct: d.retirementPct,
});

// Pre-filled sensible defaults for instant live calculation on page load, overridden by the
// shareable URL query params (?rate=28&hours=40&ot=5&state=CA&freq=bi-weekly&status=single)
function readDefaults(params: URLSearchParams | null): PaycheckDefaults {
  const d: PaycheckDefaults = {
    hourlyRate: '25',
    regularHours: '40',
    overtimeHours: '0',
    annualSalary: '65000',
    payFrequency: 'bi-weekly',
    filingStatus: 'single',
    state: 'CA',
    allowances: defaultAllowances('CA', 'single'),
    retirementPct: '',
    benefitsPerPeriod: '',
    otherDeductions: '',
    nycResident: false,
    view: 'employee',
    compare: null,
    w4MultipleJobs: false,
    w4Children: '',
    w4Dependents: '',
    w4OtherIncome: '',
    w4Deductions: '',
    w4Extra: '',
  };
  if (!params || !params.toString()) return d;
  const qRate = params.get('rate');
  const qHours = params.get('hours');
  const qOt = params.get('ot');
  const qSalary = params.get('salary');
  const qFreq = params.get('freq') as PayFrequency | null;
  const qStatus = params.get('status') as FilingStatus | null;
  const qState = params.get('state') as PaycheckState | null;
  const qAllow = params.get('allowances');
  const qRet = params.get('ret');
  const qBen = params.get('benefits');
  const qOther = params.get('other');
  const qNyc = params.get('nyc');

  if (qRate) d.hourlyRate = qRate;
  if (qHours) d.regularHours = qHours;
  if (qOt) d.overtimeHours = qOt;
  if (qSalary) d.annualSalary = qSalary;
  if (qFreq && qFreq in FREQ_LABELS) d.payFrequency = qFreq;
  if (qStatus && qStatus in FILING_LABELS) d.filingStatus = qStatus;
  if (qState && (qState === 'none' || qState === 'other' || STATE_CODES.includes(qState as StateCode))) {
    d.state = qState;
    if (!qAllow) d.allowances = defaultAllowances(qState, d.filingStatus);
  }
  if (qAllow) d.allowances = qAllow;
  if (qRet) d.retirementPct = qRet;
  if (qBen) d.benefitsPerPeriod = qBen;
  if (qOther) d.otherDeductions = qOther;
  if (qNyc === '1') d.nycResident = true;
  if (params.get('view') === 'employer') d.view = 'employer';
  if (params.get('w4_2') === '1') d.w4MultipleJobs = true;
  const w4num = (k: string) => {
    const v = params.get(k);
    return v !== null && Number.isFinite(parseFloat(v)) && parseFloat(v) >= 0 ? v : null;
  };
  d.w4Children = w4num('w4_kids') ?? '';
  d.w4Dependents = w4num('w4_dep') ?? '';
  d.w4OtherIncome = w4num('w4_a') ?? '';
  d.w4Deductions = w4num('w4_b') ?? '';
  d.w4Extra = w4num('w4_c') ?? '';
  d.compare = parseScenarioParams(params, scenarioOf(d));
  return d;
}

export default function HourlyPaycheckCalculator({ mode = 'hourly' }: { mode?: PaycheckMode }) {
  // The server renders the defaults; once the client knows the query string the form is
  // keyed on it and mounts again with the shared values (no setState inside an effect).
  const query = useInitialQuery();
  return <HourlyPaycheckForm key={query?.toString() ?? ''} mode={mode} defaults={readDefaults(query)} />;
}

function HourlyPaycheckForm({ mode, defaults }: { mode: PaycheckMode; defaults: PaycheckDefaults }) {
  const isSalary = mode === 'salary';
  const historySlug = isSalary ? 'payroll-calculator' : 'hourly-paycheck-calculator';

  const [hourlyRate, setHourlyRate] = useState(defaults.hourlyRate);
  const [regularHours, setRegularHours] = useState(defaults.regularHours);
  const [overtimeHours, setOvertimeHours] = useState(defaults.overtimeHours);
  const [annualSalary, setAnnualSalary] = useState(defaults.annualSalary);
  const [payFrequency, setPayFrequency] = useState<PayFrequency>(defaults.payFrequency);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>(defaults.filingStatus);
  const [state, setState] = useState<PaycheckState>(defaults.state);
  const [allowances, setAllowances] = useState(defaults.allowances);
  const [customStateRate, setCustomStateRate] = useState('5');
  const [nycResident, setNycResident] = useState(defaults.nycResident);
  const [retirementPct, setRetirementPct] = useState(defaults.retirementPct);
  const [benefitsPerPeriod, setBenefitsPerPeriod] = useState(defaults.benefitsPerPeriod);
  const [otherDeductions, setOtherDeductions] = useState(defaults.otherDeductions);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [view, setView] = useState<ResultView>(defaults.view);
  const [stubOpen, setStubOpen] = useState(false);
  // Bulk payroll (Phase 16.1): ?mode=bulk opens the multi-employee table
  const urlMode = useSearchParam('mode');
  const [bulkOverride, setBulkMode] = useState<boolean | null>(null);
  const bulkMode = bulkOverride ?? urlMode === 'bulk';
  const [scenario, setScenario] = useState<CompareScenario | null>(defaults.compare);
  // Form W-4 Steps 2–4 (Phase 16.1)
  const [w4MultipleJobs, setW4MultipleJobs] = useState(defaults.w4MultipleJobs);
  const [w4Children, setW4Children] = useState(defaults.w4Children);
  const [w4Dependents, setW4Dependents] = useState(defaults.w4Dependents);
  const [w4OtherIncome, setW4OtherIncome] = useState(defaults.w4OtherIncome);
  const [w4Deductions, setW4Deductions] = useState(defaults.w4Deductions);
  const [w4Extra, setW4Extra] = useState(defaults.w4Extra);
  const [w4Open, setW4Open] = useState(
    defaults.w4MultipleJobs || !!(defaults.w4Children || defaults.w4Dependents || defaults.w4OtherIncome || defaults.w4Deductions || defaults.w4Extra),
  );
  const w4 = w4FromInputs(w4MultipleJobs, w4Children, w4Dependents, w4OtherIncome, w4Deductions, w4Extra);

  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<HistoryInputs>(historySlug);

  const page = isExactState(state) ? STATE_PAYCHECK_PAGES[state] : null;

  const changeState = (v: PaycheckState) => {
    setState(v);
    setAllowances(defaultAllowances(v, filingStatus));
    if (v !== 'NY') setNycResident(false);
  };

  const changeFilingStatus = (status: FilingStatus) => {
    if (allowances === defaultAllowances(state, filingStatus)) {
      setAllowances(defaultAllowances(state, status));
    }
    setFilingStatus(status);
  };

  // Real-time live calculation (no button click required, updates as user types)
  const { result, noTaxStateComparison, error } = useMemo<{
    result: PaycheckResult | null;
    noTaxStateComparison: PaycheckResult | null;
    error: string | null;
  }>(() => {
    const allow = parseInt(allowances || '0', 10);
    const statePct = parseFloat(customStateRate || '0');
    const retPct = parseFloat(retirementPct || '0');
    const benefits = parseFloat(benefitsPerPeriod || '0');
    const other = parseFloat(otherDeductions || '0');

    let rate: number;
    let reg: number;
    let ot: number;
    if (isSalary) {
      const salary = parseFloat(annualSalary);
      if (isNaN(salary) || salary <= 0) {
        return { result: null, noTaxStateComparison: null, error: 'Please enter a valid annual salary above $0.' };
      }
      rate = salary / SALARY_HOURS_PER_YEAR;
      reg = SALARY_HOURS_PER_WEEK;
      ot = 0;
    } else {
      rate = parseFloat(hourlyRate);
      reg = parseFloat(regularHours);
      ot = parseFloat(overtimeHours || '0');
      if (isNaN(rate) || rate <= 0) {
        return { result: null, noTaxStateComparison: null, error: 'Please enter an hourly wage above $0.' };
      }
      if (isNaN(reg) || reg < 0 || reg > 168) {
        return { result: null, noTaxStateComparison: null, error: 'Regular hours must be between 0 and 168 per week.' };
      }
      if (isNaN(ot) || ot < 0 || reg + ot > 168) {
        return { result: null, noTaxStateComparison: null, error: 'Total weekly hours cannot exceed 168.' };
      }
    }

    if (page?.allowances && (isNaN(allow) || allow < 0 || allow > 99)) {
      return {
        result: null,
        noTaxStateComparison: null,
        error: `Please enter your ${page.allowances.label} as a whole number (0 or more).`,
      };
    }
    if (state === 'other' && (isNaN(statePct) || statePct < 0 || statePct > 20)) {
      return { result: null, noTaxStateComparison: null, error: 'Please enter a state tax rate between 0% and 20%.' };
    }
    if (isNaN(retPct) || retPct < 0 || retPct > 100) {
      return { result: null, noTaxStateComparison: null, error: 'Please enter a 401(k) contribution between 0% and 100%.' };
    }
    if (isNaN(benefits) || benefits < 0 || isNaN(other) || other < 0) {
      return { result: null, noTaxStateComparison: null, error: 'Deductions cannot be negative.' };
    }
    if ([w4Children, w4Dependents, w4OtherIncome, w4Deductions, w4Extra].some((v) => v !== '' && (!Number.isFinite(parseFloat(v)) || parseFloat(v) < 0))) {
      return { result: null, noTaxStateComparison: null, error: 'W-4 entries must be zero or more.' };
    }

    const grossAnnual = (rate * reg + rate * 1.5 * ot) * 52;
    const periods = PERIODS_PER_YEAR[payFrequency];

    const baseInput = {
      hourlyRate: rate,
      regularHoursPerWeek: reg,
      overtimeHoursPerWeek: ot,
      overtimeMultiplier: 1.5,
      payFrequency,
      filingStatus,
      preTaxRetirementAnnual: grossAnnual * (retPct / 100),
      preTaxBenefitsAnnual: benefits * periods,
      otherDeductionsPerPeriod: other,
      w4,
    };

    const r = calculatePaycheck({
      ...baseInput,
      state,
      stateAllowances: page?.allowances ? allow : 0,
      nycResident: state === 'NY' && nycResident,
      customStateRate: state === 'other' ? statePct / 100 : undefined,
    });

    const noTax = calculatePaycheck({
      ...baseInput,
      state: 'none',
      stateAllowances: 0,
      nycResident: false,
    });

    return { result: r, noTaxStateComparison: noTax, error: null };
  }, [
    isSalary,
    hourlyRate,
    regularHours,
    overtimeHours,
    annualSalary,
    payFrequency,
    filingStatus,
    state,
    allowances,
    customStateRate,
    nycResident,
    retirementPct,
    benefitsPerPeriod,
    otherDeductions,
    page,
    w4,
  ]);

  // Reverse solver (Phase 16.1): the current settings applied to any candidate hourly rate
  const inputForRate = (rate: number): PaycheckInput | null => {
    if (error) return null;
    const reg = isSalary ? SALARY_HOURS_PER_WEEK : parseFloat(regularHours) || 0;
    const ot = isSalary ? 0 : parseFloat(overtimeHours || '0') || 0;
    const periods = PERIODS_PER_YEAR[payFrequency];
    const grossAnnual = (rate * reg + rate * 1.5 * ot) * 52;
    return {
      state,
      hourlyRate: rate,
      regularHoursPerWeek: reg,
      overtimeHoursPerWeek: ot,
      overtimeMultiplier: 1.5,
      payFrequency,
      filingStatus,
      stateAllowances: page?.allowances ? parseInt(allowances || '0', 10) || 0 : 0,
      nycResident: state === 'NY' && nycResident,
      customStateRate: state === 'other' ? (parseFloat(customStateRate || '0') || 0) / 100 : undefined,
      preTaxRetirementAnnual: grossAnnual * ((parseFloat(retirementPct || '0') || 0) / 100),
      preTaxBenefitsAnnual: (parseFloat(benefitsPerPeriod || '0') || 0) * periods,
      otherDeductionsPerPeriod: parseFloat(otherDeductions || '0') || 0,
      w4,
    };
  };
  const applySolvedRate = (rate: number) => {
    if (isSalary) setAnnualSalary(String(Math.ceil(rate * SALARY_HOURS_PER_YEAR)));
    else setHourlyRate(rate.toFixed(2));
  };

  // Scenario compare (Phase 16.1): A is the form above, B is editable and lives in the share link
  const currentScenario: CompareScenario = { state, hourlyRate, regularHours, overtimeHours, annualSalary, filingStatus, payFrequency, retirementPct };
  const scenarioBase = result ? inputForRate(isSalary ? (parseFloat(annualSalary) || 0) / SALARY_HOURS_PER_YEAR : parseFloat(hourlyRate) || 0) : null;
  const swapScenarios = () => {
    if (!scenario) return;
    const previous = currentScenario;
    setState(scenario.state);
    setAllowances(defaultAllowances(scenario.state, scenario.filingStatus));
    setFilingStatus(scenario.filingStatus);
    setPayFrequency(scenario.payFrequency);
    setRetirementPct(scenario.retirementPct);
    if (isSalary) {
      setAnnualSalary(scenario.annualSalary);
    } else {
      setHourlyRate(scenario.hourlyRate);
      setRegularHours(scenario.regularHours);
      setOvertimeHours(scenario.overtimeHours);
    }
    setScenario(previous);
  };

  const handleSaveSnapshot = () => {
    if (!result) return;
    const rate = parseFloat(hourlyRate);
    saveEntry(
      {
        hourlyRate,
        regularHours,
        overtimeHours,
        annualSalary,
        payFrequency,
        filingStatus,
        state,
        allowances,
        customStateRate,
        retirementPct,
        benefitsPerPeriod,
        otherDeductions,
        nycResident: nycResident ? '1' : '0',
      },
      isSalary
        ? `${formatCurrency(parseFloat(annualSalary))}/yr → ${formatCurrency(result.netPerPeriod)} take-home per paycheck`
        : `${formatCurrency(rate)}/hr → ${formatCurrency(result.netPerPeriod)} take-home per paycheck`
    );
  };

  const handleRestore = (inputs: HistoryInputs) => {
    setHourlyRate(inputs.hourlyRate);
    setRegularHours(inputs.regularHours);
    setOvertimeHours(inputs.overtimeHours);
    setAnnualSalary(inputs.annualSalary ?? '65000');
    setPayFrequency(inputs.payFrequency as PayFrequency);
    setFilingStatus(inputs.filingStatus as FilingStatus);
    setState(inputs.state as PaycheckState);
    setAllowances(inputs.allowances);
    setCustomStateRate(inputs.customStateRate);
    setRetirementPct(inputs.retirementPct ?? '');
    setBenefitsPerPeriod(inputs.benefitsPerPeriod ?? '');
    setOtherDeductions(inputs.otherDeductions);
    setNycResident(inputs.nycResident === '1');
  };

  const handleTryExample = () => {
    if (isSalary) {
      setAnnualSalary('85000');
      setRetirementPct('6');
      setBenefitsPerPeriod('150');
    } else {
      setHourlyRate('32');
      setRegularHours('40');
      setOvertimeHours('5');
      setRetirementPct('5');
      setBenefitsPerPeriod('120');
    }
    setPayFrequency('bi-weekly');
    setFilingStatus('single');
    setState('CA');
    setAllowances(defaultAllowances('CA', 'single'));
    setCustomStateRate('5');
    setNycResident(false);
    setOtherDeductions('');
  };

  const handleReset = () => {
    setW4MultipleJobs(false);
    setW4Children('');
    setW4Dependents('');
    setW4OtherIncome('');
    setW4Deductions('');
    setW4Extra('');
    setHourlyRate('25');
    setRegularHours('40');
    setOvertimeHours('0');
    setAnnualSalary('65000');
    setPayFrequency('bi-weekly');
    setFilingStatus('single');
    setState('CA');
    setAllowances(defaultAllowances('CA', 'single'));
    setCustomStateRate('5');
    setNycResident(false);
    setRetirementPct('');
    setBenefitsPerPeriod('');
    setOtherDeductions('');
  };

  const handleShareLink = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.search = '';
    if (isSalary) {
      url.searchParams.set('salary', annualSalary);
    } else {
      url.searchParams.set('rate', hourlyRate);
      url.searchParams.set('hours', regularHours);
      if (parseFloat(overtimeHours || '0') > 0) url.searchParams.set('ot', overtimeHours);
    }
    url.searchParams.set('freq', payFrequency);
    url.searchParams.set('status', filingStatus);
    url.searchParams.set('state', state);
    if (allowances && allowances !== defaultAllowances(state, filingStatus)) {
      url.searchParams.set('allowances', allowances);
    }
    if (retirementPct) url.searchParams.set('ret', retirementPct);
    if (benefitsPerPeriod) url.searchParams.set('benefits', benefitsPerPeriod);
    if (otherDeductions) url.searchParams.set('other', otherDeductions);
    if (w4MultipleJobs) url.searchParams.set('w4_2', '1');
    if (w4Children) url.searchParams.set('w4_kids', w4Children);
    if (w4Dependents) url.searchParams.set('w4_dep', w4Dependents);
    if (w4OtherIncome) url.searchParams.set('w4_a', w4OtherIncome);
    if (w4Deductions) url.searchParams.set('w4_b', w4Deductions);
    if (w4Extra) url.searchParams.set('w4_c', w4Extra);
    if (state === 'NY' && nycResident) url.searchParams.set('nyc', '1');
    if (view === 'employer') url.searchParams.set('view', 'employer');
    writeScenarioParams(url, scenario, isSalary ? 'salary' : 'hourly');

    const shareUrl = url.toString();
    window.history.replaceState({}, '', shareUrl);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleCopySummary = () => {
    if (!result) return;
    const stateLabel =
      state === 'none' ? 'No state income tax' : state === 'other' ? `Flat state rate ${customStateRate}%` : page!.name;
    const payLine = isSalary
      ? `Annual Salary: ${formatCurrency(parseFloat(annualSalary))}`
      : `Hourly Rate: ${formatCurrency(parseFloat(hourlyRate))}/hr (${regularHours} regular + ${overtimeHours || 0} OT hrs/week)`;
    const summary = [
      `--- ${isSalary ? 'Payroll' : 'Hourly Paycheck'} Summary (QuickBizCalc, ${TAX_YEAR}) ---`,
      payLine,
      `Pay Frequency: ${FREQ_LABELS[payFrequency]}`,
      `Filing Status: ${FILING_LABELS[filingStatus]}`,
      `State: ${stateLabel}`,
      `Gross Pay / Paycheck: ${formatCurrency(result.grossPerPeriod)}`,
      ...result.deductions.map((d) => `${d.label}: -${formatCurrency(d.perPeriod)}`),
      `Take-Home Pay / Paycheck: ${formatCurrency(result.netPerPeriod)}`,
      `Take-Home Pay / Year: ${formatCurrency(result.netAnnual)}`,
      ...(isSalary ? [] : [`Take-Home per Hour Worked: ${formatCurrency(result.netPerHour)}`]),
      `Calculated at: https://www.quickbizcalc.com/calculators/${historySlug}`,
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resultStateNote =
    state === 'none'
      ? 'no state income tax'
      : state === 'other'
        ? `a flat ${customStateRate}% state income tax estimate`
        : `${page!.name} ${TAX_YEAR} withholding tables`;

  const totalWeeklyHours = Math.max(1, (parseFloat(regularHours) || 0) + (parseFloat(overtimeHours) || 0));
  const totalAnnualHours = isSalary ? SALARY_HOURS_PER_YEAR : totalWeeklyHours * 52;

  // Pay stub preview (Phase 16.1): the live paycheck plus the employer side at the state default SUI rate
  const stubData = result
    ? {
        payFrequency,
        payFrequencyLabel: FREQ_LABELS[payFrequency].replace(/ \(.*\)$/, ''),
        stateName: state === 'none' ? 'No state income tax' : state === 'other' ? `flat ${customStateRate}% state rate` : page!.name,
        taxYear: TAX_YEAR,
        isSalary,
        hourlyRate: isSalary ? (parseFloat(annualSalary) || 0) / SALARY_HOURS_PER_YEAR : parseFloat(hourlyRate) || 0,
        regularHoursPerWeek: isSalary ? SALARY_HOURS_PER_WEEK : parseFloat(regularHours) || 0,
        overtimeHoursPerWeek: isSalary ? 0 : parseFloat(overtimeHours || '0') || 0,
        annualSalary: isSalary ? parseFloat(annualSalary) || 0 : undefined,
        result,
        employer: calculateEmployerCost({ state, grossAnnual: result.grossAnnual, ficaWagesAnnual: result.ficaWagesAnnual, payFrequency, hoursPerYear: totalAnnualHours }),
        sourceUrl: `https://www.quickbizcalc.com/calculators/${historySlug}`,
      }
    : null;
  const stateTaxSavingsInNoTaxState =
    result && noTaxStateComparison ? Math.max(0, noTaxStateComparison.netAnnual - result.netAnnual) : 0;

  const modeSwitch = (
    <div className="px-4 sm:px-6 pt-4">
      <div className="flex rounded-xl bg-muted/50 p-1 border border-border/50" role="tablist" aria-label="Single employee or bulk payroll">
        {[
          { bulk: false, label: 'One employee', icon: User },
          { bulk: true, label: `Bulk payroll (up to ${25})`, icon: Users },
        ].map((o) => (
          <button
            key={o.label}
            type="button"
            role="tab"
            aria-selected={bulkMode === o.bulk}
            onClick={() => setBulkMode(o.bulk)}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              bulkMode === o.bulk ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <o.icon className="h-4 w-4" />
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (bulkMode) {
    return (
      <div className="w-full">
        {modeSwitch}
        <BulkPayrollPanel initialFrequency={payFrequency} />
      </div>
    );
  }

  return (
    <div className="w-full">
      {modeSwitch}
      <div className="p-4 sm:p-6 space-y-6 calculator-form">
        {/* Quick Preset Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Quick Presets:
          </span>
          {isSalary
            ? SALARY_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAnnualSalary(preset)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    annualSalary === preset
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                  }`}
                >
                  ${(parseInt(preset, 10) / 1000).toFixed(0)}k/yr
                </button>
              ))
            : HOURLY_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setHourlyRate(preset)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    hourlyRate === preset
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-muted/40 hover:bg-muted text-foreground border-border/60'
                  }`}
                >
                  ${preset}/hr
                </button>
              ))}
        </div>

        {/* Pay Inputs */}
        {isSalary ? (
          <div className="space-y-2">
            <Label htmlFor="pcSalary" className="text-sm font-medium">
              <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Annual Salary ($)
            </Label>
            <Input
              id="pcSalary"
              type="number"
              min="0"
              step="500"
              placeholder="e.g., 65000"
              value={annualSalary}
              onChange={(e) => setAnnualSalary(e.target.value)}
              className="sm:max-w-sm"
            />
            <p className="text-xs text-muted-foreground">
              Your gross yearly pay before taxes. Paid hourly?{' '}
              <Link href="/calculators/hourly-paycheck-calculator" className="text-emerald-600 hover:underline font-medium">
                Switch to the Hourly Paycheck Calculator
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pcHourlyRate" className="text-sm font-medium">
                <DollarSign className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Hourly Rate ($)
              </Label>
              <Input
                id="pcHourlyRate"
                type="number"
                min="0"
                step="0.25"
                placeholder="e.g., 25.00"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pcRegHours" className="text-sm font-medium">
                <Clock className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Regular Hours / Week
              </Label>
              <Input
                id="pcRegHours"
                type="number"
                min="0"
                step="0.5"
                value={regularHours}
                onChange={(e) => setRegularHours(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pcOtHours" className="text-sm font-medium">
                Overtime Hours / Week (1.5×)
              </Label>
              <Input
                id="pcOtHours"
                type="number"
                min="0"
                step="0.5"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Pay Frequency & Filing Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pcFrequency" className="text-sm font-medium">
              <Calendar className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Pay Frequency
            </Label>
            <Select value={payFrequency} onValueChange={(v) => setPayFrequency(v as PayFrequency)}>
              <SelectTrigger id="pcFrequency" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(FREQ_LABELS) as PayFrequency[]).map((f) => (
                  <SelectItem key={f} value={f}>{FREQ_LABELS[f]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pcFiling" className="text-sm font-medium">
              <Users className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              Federal Filing Status (W-4 Step 1)
            </Label>
            <Select value={filingStatus} onValueChange={(v) => changeFilingStatus(v as FilingStatus)}>
              <SelectTrigger id="pcFiling" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(FILING_LABELS) as FilingStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{FILING_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* State */}
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pcState" className="text-sm font-medium">
              <MapPin className="inline h-3.5 w-3.5 mr-1 text-muted-foreground" />
              State Tax Jurisdiction
            </Label>
            <Select value={state} onValueChange={(v) => changeState(v as PaycheckState)}>
              <SelectTrigger id="pcState" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {EXACT_STATES.map((code) => (
                  <SelectItem key={code} value={code}>
                    {STATE_PAYCHECK_PAGES[code].name} (exact {TAX_YEAR} tables)
                  </SelectItem>
                ))}
                <SelectItem value="none">No state income tax (AK, FL, NV, NH, SD, TN, TX, WA, WY)</SelectItem>
                <SelectItem value="other">Other state (enter custom state rate)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {page?.allowances && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div className="space-y-1.5">
                <Label htmlFor="pcAllowances" className="text-xs text-muted-foreground">
                  {page.allowances.label}
                </Label>
                <Input
                  id="pcAllowances"
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
                  <Label htmlFor="pcNyc" className="text-sm">I live in New York City</Label>
                  <Switch id="pcNyc" checked={nycResident} onCheckedChange={(v) => setNycResident(v)} />
                </div>
              )}
            </div>
          )}

          {page && !page.allowances && (
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
              {page.name} has no state income tax, so only federal income tax, Social Security, and Medicare come out of your paycheck.
            </p>
          )}

          {state === 'none' && (
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
              {NO_TAX_STATES} do not tax wages. Only federal income tax, Social Security, and Medicare are withheld.
            </p>
          )}

          {state === 'other' && (
            <div className="space-y-1.5">
              <Label htmlFor="pcStateRate" className="text-xs text-muted-foreground">
                State income tax rate (%)
              </Label>
              <Input
                id="pcStateRate"
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={customStateRate}
                onChange={(e) => setCustomStateRate(e.target.value)}
                className="text-sm sm:max-w-xs"
              />
              <p className="text-xs text-muted-foreground">
                Enter your state&apos;s flat rate or effective state tax rate (most workers fall between 2% and 6%).
              </p>
            </div>
          )}

          {page && (
            <p className="text-xs text-muted-foreground">
              Only need {page.name}?{' '}
              <Link href={`/calculators/${page.slug}`} className="text-emerald-600 hover:underline font-medium">
                Open the dedicated {page.name} hourly paycheck calculator
              </Link>{' '}
              for state-specific minimum wage, overtime, and FAQ details.
            </p>
          )}
        </div>

        {/* Deductions */}
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
          <p className="text-sm font-semibold flex items-center gap-1.5">
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
            Pre-Tax &amp; Post-Tax Deductions <span className="text-muted-foreground font-normal text-xs">(optional)</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="pcRetirement" className="text-xs text-muted-foreground">
                401(k) / 403(b) contribution (% of gross)
              </Label>
              <Input
                id="pcRetirement"
                type="number"
                min="0"
                max="100"
                step="0.5"
                placeholder="e.g., 5"
                value={retirementPct}
                onChange={(e) => setRetirementPct(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">Pre-tax: lowers federal &amp; state income tax.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pcBenefits" className="text-xs text-muted-foreground">
                Health &amp; HSA/FSA benefits ($ per paycheck)
              </Label>
              <Input
                id="pcBenefits"
                type="number"
                min="0"
                step="5"
                placeholder="e.g., 150"
                value={benefitsPerPeriod}
                onChange={(e) => setBenefitsPerPeriod(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">Pre-tax Section 125: lowers income tax &amp; FICA.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pcOther" className="text-xs text-muted-foreground">
                Other post-tax deductions ($ per paycheck)
              </Label>
              <Input
                id="pcOther"
                type="number"
                min="0"
                step="5"
                placeholder="e.g., 25"
                value={otherDeductions}
                onChange={(e) => setOtherDeductions(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">Roth 401(k), union dues, garnishments.</p>
            </div>
          </div>
        </div>

        {/* Form W-4 Steps 2–4 (Phase 16.1) */}
        <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-4">
          <button
            type="button"
            onClick={() => setW4Open((o) => !o)}
            aria-expanded={w4Open}
            className="w-full flex items-center justify-between gap-2 text-left"
          >
            <span className="text-sm font-semibold flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-muted-foreground" />
              W-4 Steps 2–4 <span className="text-muted-foreground font-normal text-xs">(optional — two jobs, dependents, other income, extra withholding)</span>
            </span>
            <span className="text-xs font-medium text-emerald-600">{w4Open ? 'Hide' : w4 ? 'Edit' : 'Add'}</span>
          </button>
          {w4Open && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-lg bg-background border border-border/50 px-3 py-2.5">
                <div>
                  <Label htmlFor="w4Multi" className="text-sm">Step 2(c): two jobs in total, or my spouse also works</Label>
                  <p className="text-xs text-muted-foreground">Uses the "Step 2, Checkbox" withholding table: half the standard deduction and half-width brackets, so each job withholds as if it were the only one.</p>
                </div>
                <Switch id="w4Multi" checked={w4MultipleJobs} onCheckedChange={(v) => setW4MultipleJobs(v)} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="w4Kids" className="text-xs text-muted-foreground">Step 3: children under 17</Label>
                  <Input id="w4Kids" type="number" min="0" max="20" step="1" placeholder="0" value={w4Children} onChange={(e) => setW4Children(e.target.value)} className="text-sm" />
                  <p className="text-xs text-muted-foreground">× {formatCurrency(W4_CHILD_CREDIT)}/yr</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="w4Dep" className="text-xs text-muted-foreground">Other dependents</Label>
                  <Input id="w4Dep" type="number" min="0" max="20" step="1" placeholder="0" value={w4Dependents} onChange={(e) => setW4Dependents(e.target.value)} className="text-sm" />
                  <p className="text-xs text-muted-foreground">× {formatCurrency(W4_OTHER_DEPENDENT_CREDIT)}/yr</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="w4a" className="text-xs text-muted-foreground">4(a) other income / yr</Label>
                  <Input id="w4a" type="number" min="0" step="500" placeholder="0" value={w4OtherIncome} onChange={(e) => setW4OtherIncome(e.target.value)} className="text-sm" />
                  <p className="text-xs text-muted-foreground">Interest, dividends, retirement.</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="w4b" className="text-xs text-muted-foreground">4(b) deductions / yr</Label>
                  <Input id="w4b" type="number" min="0" step="500" placeholder="0" value={w4Deductions} onChange={(e) => setW4Deductions(e.target.value)} className="text-sm" />
                  <p className="text-xs text-muted-foreground">Beyond the standard deduction.</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="w4c" className="text-xs text-muted-foreground">4(c) extra per paycheck</Label>
                  <Input id="w4c" type="number" min="0" step="5" placeholder="0" value={w4Extra} onChange={(e) => setW4Extra(e.target.value)} className="text-sm" />
                  <p className="text-xs text-muted-foreground">Added to every check.</p>
                </div>
              </div>
            </div>
          )}
        </div>

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
            onClick={handleSaveSnapshot}
            disabled={!result}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25"
            size="lg"
          >
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Save Calculation to History
          </Button>
        </div>
      </div>

      {/* Reverse solver: take-home target → required gross (Phase 16.1) */}
      <div className="mt-4 px-4 sm:px-6">
        <ReverseSolverCard mode={isSalary ? 'salary' : 'hourly'} buildInput={inputForRate} payFrequency={payFrequency} onApply={applySolvedRate} />
      </div>

      {/* Live Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-4 px-4 sm:px-6 result-display"
          aria-live="polite"
        >
          {/* Phase 16.1: the same paycheck from the employer's side */}
          <ResultViewToggle view={view} onChange={setView} />
          {view === 'employer' && (
            <EmployerCostPanel
              state={state}
              stateName={state === 'none' || state === 'other' ? null : page!.name}
              paycheck={result}
              payFrequency={payFrequency}
              hoursPerYear={totalAnnualHours}
              frequencyLabel={FREQ_LABELS[payFrequency]}
            />
          )}
          {view === 'employee' && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 space-y-6">
            {/* Primary Headline */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live {TAX_YEAR} Paycheck Estimate
              </div>
              <p className="text-sm text-muted-foreground font-medium">Net Take-Home Pay per Paycheck</p>
              <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600" data-result-primary>
                {formatCurrency(result.netPerPeriod)}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                <strong className="text-foreground">{formatCurrency(result.netAnnual)}</strong>/year ·{' '}
                <strong className="text-foreground">{formatCurrency(result.netAnnual / 12)}</strong>/month ·{' '}
                <strong className="text-foreground">{formatCurrency(result.netPerHour)}</strong>/hr net after taxes
              </p>
            </div>

            {/* Summary KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Gross Paycheck', value: formatCurrency(result.grossPerPeriod), color: 'text-blue-600' },
                {
                  label: 'Total Taxes & Deductions',
                  value: formatCurrency(result.grossPerPeriod - result.netPerPeriod),
                  color: 'text-amber-600',
                },
                {
                  label: 'Effective Tax & Ded. Rate',
                  value: `${(result.effectiveRate * 100).toFixed(1)}%`,
                  color: 'text-foreground',
                },
                {
                  label: 'Keep From Every $100',
                  value: formatCurrency((1 - result.effectiveRate) * 100),
                  color: 'text-emerald-600',
                },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-background border border-border/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className={`text-base sm:text-lg font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Visual Paycheck Allocation Bar ("Where Your Paycheck Goes") */}
            {result.grossAnnual > 0 && (
              <div className="rounded-xl bg-background border border-border/50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Where Your Gross Pay Goes</span>
                  <span className="text-emerald-600">
                    {((result.netAnnual / result.grossAnnual) * 100).toFixed(1)}% Take-Home
                  </span>
                </div>
                <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-muted">
                  <div
                    style={{ width: `${Math.max(0, (result.netAnnual / result.grossAnnual) * 100)}%` }}
                    className="bg-emerald-500 h-full transition-all duration-300"
                    title="Net Take-Home Pay"
                  />
                  {result.deductions.map((d, idx) => {
                    const colors = ['bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500'];
                    const pct = Math.max(0, (d.annual / result.grossAnnual) * 100);
                    return (
                      <div
                        key={d.key}
                        style={{ width: `${pct}%` }}
                        className={`${colors[idx % colors.length]} h-full transition-all duration-300`}
                        title={`${d.label}: ${pct.toFixed(1)}%`}
                      />
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-emerald-500" />
                    Take-Home ({((result.netAnnual / result.grossAnnual) * 100).toFixed(1)}%)
                  </span>
                  {result.deductions.map((d, idx) => {
                    const colors = ['bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500'];
                    const pct = (d.annual / result.grossAnnual) * 100;
                    if (pct <= 0.05) return null;
                    return (
                      <span key={d.key} className="inline-flex items-center gap-1.5">
                        <span className={`size-2.5 rounded-sm ${colors[idx % colors.length]}`} />
                        {d.label} ({pct.toFixed(1)}%)
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Detailed Itemized Deduction Table */}
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border/50 bg-muted/40 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Itemized Paycheck Stub Breakdown
                </span>
                <span className="text-xs text-muted-foreground">{FREQ_LABELS[payFrequency]}</span>
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
                      <td className="px-4 py-2.5">Gross Pay</td>
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
                    <tr className="font-bold bg-emerald-500/5">
                      <td className="px-4 py-2.5">Net Take-Home Pay</td>
                      <td className="text-right px-4 py-2.5 text-emerald-600">{formatCurrency(result.netPerPeriod)}</td>
                      <td className="text-right px-4 py-2.5 text-emerald-600">{formatCurrency(result.netAnnual)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Multi-Period Pay Conversion Table (Hourly / Daily / Weekly / Bi-Weekly / Semi-Monthly / Monthly / Annual) */}
            <div className="rounded-xl bg-background border border-border/50 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border/50 bg-muted/40">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Take-Home Pay Converted Across All Pay Periods
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground text-xs">Period</th>
                      <th className="text-right px-4 py-2 font-medium text-muted-foreground text-xs">Gross Pay</th>
                      <th className="text-right px-4 py-2 font-medium text-muted-foreground text-xs">Taxes &amp; Ded.</th>
                      <th className="text-right px-4 py-2 font-medium text-muted-foreground text-xs">Net Take-Home</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {[
                      { label: 'Hourly', divisor: totalAnnualHours },
                      { label: 'Daily (8 hrs)', divisor: totalAnnualHours / 8 },
                      { label: 'Weekly (52/yr)', divisor: 52 },
                      { label: 'Bi-Weekly (26/yr)', divisor: 26 },
                      { label: 'Semi-Monthly (24/yr)', divisor: 24 },
                      { label: 'Monthly (12/yr)', divisor: 12 },
                      { label: 'Annual (1/yr)', divisor: 1 },
                    ].map((row) => {
                      const gross = result.grossAnnual / row.divisor;
                      const net = result.netAnnual / row.divisor;
                      const ded = gross - net;
                      return (
                        <tr key={row.label} className="hover:bg-muted/20">
                          <td className="px-4 py-2 font-medium">{row.label}</td>
                          <td className="text-right px-4 py-2">{formatCurrency(gross)}</td>
                          <td className="text-right px-4 py-2 text-red-500">−{formatCurrency(ded)}</td>
                          <td className="text-right px-4 py-2 font-semibold text-emerald-600">{formatCurrency(net)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* State Comparison & Job Offer Comparison Callout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stateTaxSavingsInNoTaxState > 50 && (
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5 text-xs space-y-1">
                  <p className="font-semibold text-blue-700 dark:text-blue-400">
                    State Tax Impact Insight
                  </p>
                  <p className="text-muted-foreground">
                    In a 0% income-tax state (like Texas, Florida, or Washington), your annual take-home pay at this wage would be{' '}
                    <strong className="text-foreground">+{formatCurrency(stateTaxSavingsInNoTaxState)}/year higher</strong>{' '}
                    ({formatCurrency(noTaxStateComparison!.netAnnual)}/yr).
                  </p>
                </div>
              )}
              <div className="rounded-xl border border-emerald-500/20 bg-background p-3.5 text-xs flex flex-col justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">Comparing Two Job Offers?</p>
                  <p className="text-muted-foreground">
                    Compare salary, 401(k) match, health insurance, PTO value, and commute costs side-by-side.
                  </p>
                </div>
                <Link
                  href="/compare/jobs"
                  className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Open Job Offer Comparison Tool <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  Estimate based on the {TAX_YEAR} IRS percentage method for a standard W-4 and {resultStateNote}. Extra
                  W-4 withholding, local taxes, and employer-specific deductions will change your actual paycheck.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button onClick={handleShareLink} variant="outline" size="sm" className="border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  {linkCopied ? <Check className="h-4 w-4 mr-1.5 text-emerald-600" /> : <Link2 className="h-4 w-4 mr-1.5" />}
                  {linkCopied ? 'Share Link Copied!' : 'Share Calculation Link'}
                </Button>
                <Button onClick={handleCopySummary} variant="outline" size="sm">
                  {copied ? <Check className="h-4 w-4 mr-1.5 text-emerald-600" /> : <Copy className="h-4 w-4 mr-1.5" />}
                  {copied ? 'Copied' : 'Copy summary'}
                </Button>
                <Button onClick={() => setStubOpen(true)} variant="outline" size="sm">
                  <Receipt className="h-4 w-4 mr-1.5" />
                  Pay stub preview
                </Button>
              </div>
            </div>
          </div>
          )}
        </motion.div>
      )}

      {stubData && <PayStubDialog open={stubOpen} onOpenChange={setStubOpen} data={stubData} />}

      {/* Scenario compare: A (above) vs. B, persisted as b_* params (Phase 16.1) */}
      {result && (
        <div className="mt-4 px-4 sm:px-6">
          <PaycheckScenarioCompare
            mode={isSalary ? 'salary' : 'hourly'}
            base={scenarioBase}
            baseScenario={currentScenario}
            scenario={scenario}
            onChange={setScenario}
            onSwap={swapScenarios}
          />
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6 px-4 sm:px-6 pb-4">
          <CalcHistoryPanel
            history={history}
            onRestore={handleRestore}
            onClear={clearHistory}
            onDelete={deleteEntry}
          />
        </div>
      )}
    </div>
  );
}
