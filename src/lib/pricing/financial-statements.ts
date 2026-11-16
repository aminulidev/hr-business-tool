// ---------------------------------------------------------------------------
// Financial statements engine — Phase 17: the journal-entry, trial-balance,
// balance-sheet, cash-flow-statement and pnl drafts fold into one suite built
// on a single small ledger.
//
// Model: a chart of accounts where every account has a type, a prior-period
// balance (balance-sheet accounts only) and a current balance, both entered on
// the account's normal side. Journal entries (one debit, one credit) adjust
// the current balances. From that the engine derives the adjusted trial
// balance, a multi-step income statement, a classified balance sheet and an
// indirect-method cash flow statement that reconciles to the change in cash
// whenever both balance sheets balance.
// ---------------------------------------------------------------------------

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const fin = (n: number) => (Number.isFinite(n) ? n : 0);

export type StatementMode = 'trial' | 'journal' | 'income' | 'balance' | 'cashflow';
export const STATEMENT_MODES: { value: StatementMode; label: string; short: string }[] = [
  { value: 'trial', label: 'Trial balance', short: 'Trial' },
  { value: 'journal', label: 'Journal entries', short: 'Journal' },
  { value: 'income', label: 'Income statement', short: 'P&L' },
  { value: 'balance', label: 'Balance sheet', short: 'Balance' },
  { value: 'cashflow', label: 'Cash flow', short: 'Cash flow' },
];
export const isStatementMode = (x: string | null): x is StatementMode => STATEMENT_MODES.some((m) => m.value === x);

export type AccountType =
  | 'cash'
  | 'current-asset'
  | 'noncurrent-asset'
  | 'current-liability'
  | 'noncurrent-liability'
  | 'equity'
  | 'retained'
  | 'draws'
  | 'revenue'
  | 'cogs'
  | 'expense'
  | 'depreciation'
  | 'interest'
  | 'tax';

export type AccountGroup = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export interface AccountTypeInfo {
  value: AccountType;
  label: string;
  group: AccountGroup;
  normal: 'debit' | 'credit';
  /** Balance-sheet accounts carry a prior-period balance; income accounts start each period at zero */
  permanent: boolean;
}

export const ACCOUNT_TYPES: AccountTypeInfo[] = [
  { value: 'cash', label: 'Cash and equivalents', group: 'asset', normal: 'debit', permanent: true },
  { value: 'current-asset', label: 'Current asset', group: 'asset', normal: 'debit', permanent: true },
  { value: 'noncurrent-asset', label: 'Long-term asset', group: 'asset', normal: 'debit', permanent: true },
  { value: 'current-liability', label: 'Current liability', group: 'liability', normal: 'credit', permanent: true },
  { value: 'noncurrent-liability', label: 'Long-term liability', group: 'liability', normal: 'credit', permanent: true },
  { value: 'equity', label: 'Owner capital / stock', group: 'equity', normal: 'credit', permanent: true },
  { value: 'retained', label: 'Retained earnings', group: 'equity', normal: 'credit', permanent: true },
  { value: 'draws', label: 'Draws / dividends', group: 'equity', normal: 'debit', permanent: false },
  { value: 'revenue', label: 'Revenue', group: 'revenue', normal: 'credit', permanent: false },
  { value: 'cogs', label: 'Cost of goods sold', group: 'expense', normal: 'debit', permanent: false },
  { value: 'expense', label: 'Operating expense', group: 'expense', normal: 'debit', permanent: false },
  { value: 'depreciation', label: 'Depreciation and amortization', group: 'expense', normal: 'debit', permanent: false },
  { value: 'interest', label: 'Interest expense', group: 'expense', normal: 'debit', permanent: false },
  { value: 'tax', label: 'Income tax expense', group: 'expense', normal: 'debit', permanent: false },
];
const TYPE = Object.fromEntries(ACCOUNT_TYPES.map((t) => [t.value, t])) as Record<AccountType, AccountTypeInfo>;
export const accountTypeInfo = (t: AccountType): AccountTypeInfo => TYPE[t] ?? TYPE.expense;
export const isAccountType = (x: string): x is AccountType => x in TYPE;

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  /** Balance at the end of the prior period, on the account's normal side (contra accounts negative) */
  prior: number;
  /** Current balance before the journal entries below, on the account's normal side */
  balance: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  memo: string;
  debitId: string;
  creditId: string;
  amount: number;
}

export interface Ledger {
  accounts: Account[];
  entries: JournalEntry[];
}

// ───────────────────────── posting

export interface PostedAccount extends Account {
  info: AccountTypeInfo;
  /** Debits and credits posted from the journal */
  debits: number;
  credits: number;
  /** Balance after the journal, on the normal side */
  ending: number;
}

export interface PostResult {
  accounts: PostedAccount[];
  /** Entries that could not be posted, with the reason */
  rejected: { id: string; reason: string }[];
  posted: number;
}

export function postLedger(ledger: Ledger): PostResult {
  const map = new Map<string, PostedAccount>();
  for (const a of ledger.accounts) {
    const info = accountTypeInfo(a.type);
    map.set(a.id, { ...a, prior: info.permanent ? fin(a.prior) : 0, balance: fin(a.balance), info, debits: 0, credits: 0, ending: 0 });
  }
  const rejected: PostResult['rejected'] = [];
  let posted = 0;
  for (const e of ledger.entries) {
    const dr = map.get(e.debitId);
    const cr = map.get(e.creditId);
    const amount = fin(e.amount);
    if (!dr || !cr) {
      if (amount !== 0 || e.memo.trim()) rejected.push({ id: e.id, reason: 'Choose both a debit and a credit account' });
      continue;
    }
    if (dr === cr) {
      rejected.push({ id: e.id, reason: 'Debit and credit accounts must be different' });
      continue;
    }
    if (amount <= 0) {
      if (e.memo.trim()) rejected.push({ id: e.id, reason: 'Enter an amount greater than zero' });
      continue;
    }
    dr.debits += amount;
    cr.credits += amount;
    posted++;
  }
  for (const a of map.values()) {
    const net = a.debits - a.credits;
    a.ending = round2(a.balance + (a.info.normal === 'debit' ? net : -net));
  }
  return { accounts: [...map.values()], rejected, posted };
}

/** What a journal entry does to the accounting equation, for the teaching line under each entry */
export function equationEffect(entry: JournalEntry, accounts: Account[]): string | null {
  const dr = accounts.find((a) => a.id === entry.debitId);
  const cr = accounts.find((a) => a.id === entry.creditId);
  if (!dr || !cr || dr === cr) return null;
  const side = (a: Account, isDebit: boolean) => {
    const info = accountTypeInfo(a.type);
    const up = (info.normal === 'debit') === isDebit;
    const label = info.group === 'asset' ? 'Assets' : info.group === 'liability' ? 'Liabilities' : info.group === 'revenue' ? 'Revenue (equity)' : info.group === 'expense' ? 'Expenses (reduce equity)' : a.type === 'draws' ? 'Draws (reduce equity)' : 'Equity';
    return `${label} ${up ? '↑' : '↓'}`;
  };
  return `${side(dr, true)} · ${side(cr, false)}`;
}

// ───────────────────────── trial balance

export interface TrialRow {
  id: string;
  name: string;
  type: AccountType;
  debit: number;
  credit: number;
}

export interface TrialBalance {
  rows: TrialRow[];
  totalDebit: number;
  totalCredit: number;
  /** Debits − credits */
  difference: number;
  balanced: boolean;
  hints: string[];
}

export function trialBalance(ledger: Ledger): TrialBalance {
  const { accounts } = postLedger(ledger);
  const rows: TrialRow[] = accounts
    .filter((a) => a.ending !== 0 || a.name.trim() !== '')
    .map((a) => {
      const dr = a.info.normal === 'debit' ? a.ending : -a.ending;
      return { id: a.id, name: a.name, type: a.type, debit: dr > 0 ? round2(dr) : 0, credit: dr < 0 ? round2(-dr) : 0 };
    });
  const totalDebit = round2(rows.reduce((s, r) => s + r.debit, 0));
  const totalCredit = round2(rows.reduce((s, r) => s + r.credit, 0));
  const difference = round2(totalDebit - totalCredit);
  const hints: string[] = [];
  if (difference !== 0) {
    const d = Math.abs(difference);
    const heavy = difference > 0 ? 'debit' : 'credit';
    const light = difference > 0 ? 'credit' : 'debit';
    const amount = (r: TrialRow) => r.debit || r.credit;
    const wrongSide = rows.filter((r) => round2(amount(r) * 2) === d && (difference > 0 ? r.debit > 0 : r.credit > 0));
    if (wrongSide.length) hints.push(`${wrongSide.map((r) => r.name).join(' or ')} is exactly half the difference: check whether it belongs in the ${light} column.`);
    const same = rows.filter((r) => amount(r) === d);
    if (same.length) hints.push(`${same.map((r) => r.name).join(' or ')} equals the difference: it may have been entered twice, or its matching ${light} may be missing.`);
    if (Number.isInteger(d) && d % 9 === 0) hints.push('The difference divides evenly by 9, which usually means two digits were transposed (540 for 450) or a decimal slipped (500 for 50).');
    if (!hints.length) hints.push(`The ${heavy} column is larger by ${d.toLocaleString('en-US', { minimumFractionDigits: 2 })}. Re-add each column, then check that every balance sits on its normal side.`);
  }
  return { rows, totalDebit, totalCredit, difference, balanced: difference === 0, hints };
}

// ───────────────────────── income statement

export interface StatementLine {
  name: string;
  amount: number;
}

export interface IncomeStatement {
  revenue: StatementLine[];
  totalRevenue: number;
  cogs: StatementLine[];
  totalCogs: number;
  grossProfit: number;
  grossMarginPct: number | null;
  operatingExpenses: StatementLine[];
  totalOperatingExpenses: number;
  /** Depreciation and amortization included in operating expenses */
  depreciation: number;
  operatingIncome: number;
  operatingMarginPct: number | null;
  ebitda: number;
  interest: number;
  pretaxIncome: number;
  tax: number;
  netIncome: number;
  netMarginPct: number | null;
  effectiveTaxRatePct: number | null;
}

export function incomeStatement(ledger: Ledger): IncomeStatement {
  const { accounts } = postLedger(ledger);
  const lines = (...types: AccountType[]) => accounts.filter((a) => types.includes(a.type) && a.ending !== 0).map((a) => ({ name: a.name, amount: a.ending }));
  const sum = (ls: StatementLine[]) => round2(ls.reduce((s, l) => s + l.amount, 0));
  const revenue = lines('revenue');
  const cogs = lines('cogs');
  const opex = lines('expense', 'depreciation');
  const totalRevenue = sum(revenue);
  const totalCogs = sum(cogs);
  const grossProfit = round2(totalRevenue - totalCogs);
  const totalOpex = sum(opex);
  const depreciation = sum(lines('depreciation'));
  const operatingIncome = round2(grossProfit - totalOpex);
  const interest = sum(lines('interest'));
  const pretax = round2(operatingIncome - interest);
  const tax = sum(lines('tax'));
  const net = round2(pretax - tax);
  const pctOf = (n: number) => (totalRevenue > 0 ? (n / totalRevenue) * 100 : null);
  return {
    revenue,
    totalRevenue,
    cogs,
    totalCogs,
    grossProfit,
    grossMarginPct: pctOf(grossProfit),
    operatingExpenses: opex,
    totalOperatingExpenses: totalOpex,
    depreciation,
    operatingIncome,
    operatingMarginPct: pctOf(operatingIncome),
    ebitda: round2(operatingIncome + depreciation),
    interest,
    pretaxIncome: pretax,
    tax,
    netIncome: net,
    netMarginPct: pctOf(net),
    effectiveTaxRatePct: pretax > 0 && tax > 0 ? (tax / pretax) * 100 : null,
  };
}

// ───────────────────────── balance sheet

export interface BalanceLine {
  name: string;
  current: number;
  prior: number;
}

export interface BalanceSheet {
  currentAssets: BalanceLine[];
  totalCurrentAssets: BalanceLine;
  noncurrentAssets: BalanceLine[];
  totalAssets: BalanceLine;
  currentLiabilities: BalanceLine[];
  totalCurrentLiabilities: BalanceLine;
  noncurrentLiabilities: BalanceLine[];
  totalLiabilities: BalanceLine;
  /** Capital and retained earnings accounts as entered */
  equity: BalanceLine[];
  netIncome: number;
  draws: number;
  /** Retained earnings after closing: opening + net income − draws */
  endingRetainedEarnings: number;
  totalEquity: BalanceLine;
  totalLiabilitiesAndEquity: BalanceLine;
  /** Assets − (liabilities + equity) */
  difference: number;
  priorDifference: number;
  balanced: boolean;
  priorBalanced: boolean;
  hasPrior: boolean;
  workingCapital: number;
  currentRatio: number | null;
  debtToEquity: number | null;
  /** Equity ÷ assets */
  equityRatioPct: number | null;
}

export function balanceSheet(ledger: Ledger): BalanceSheet {
  const { accounts } = postLedger(ledger);
  const is = incomeStatement(ledger);
  const lines = (...types: AccountType[]): BalanceLine[] => accounts.filter((a) => types.includes(a.type) && (a.ending !== 0 || a.prior !== 0)).map((a) => ({ name: a.name, current: a.ending, prior: a.prior }));
  const total = (name: string, ...groups: BalanceLine[][]): BalanceLine => ({ name, current: round2(groups.flat().reduce((s, l) => s + l.current, 0)), prior: round2(groups.flat().reduce((s, l) => s + l.prior, 0)) });
  const currentAssets = lines('cash', 'current-asset');
  const noncurrentAssets = lines('noncurrent-asset');
  const currentLiabilities = lines('current-liability');
  const noncurrentLiabilities = lines('noncurrent-liability');
  const equity = lines('equity', 'retained');
  const draws = round2(accounts.filter((a) => a.type === 'draws').reduce((s, a) => s + a.ending, 0));
  const totalCurrentAssets = total('Total current assets', currentAssets);
  const totalAssets = total('Total assets', currentAssets, noncurrentAssets);
  const totalCurrentLiabilities = total('Total current liabilities', currentLiabilities);
  const totalLiabilities = total('Total liabilities', currentLiabilities, noncurrentLiabilities);
  const entered = total('Equity', equity);
  const totalEquity: BalanceLine = { name: 'Total equity', current: round2(entered.current + is.netIncome - draws), prior: entered.prior };
  const totalLE: BalanceLine = { name: 'Total liabilities and equity', current: round2(totalLiabilities.current + totalEquity.current), prior: round2(totalLiabilities.prior + totalEquity.prior) };
  const retained = accounts.filter((a) => a.type === 'retained').reduce((s, a) => s + a.ending, 0);
  const difference = round2(totalAssets.current - totalLE.current);
  const priorDifference = round2(totalAssets.prior - totalLE.prior);
  return {
    currentAssets,
    totalCurrentAssets,
    noncurrentAssets,
    totalAssets,
    currentLiabilities,
    totalCurrentLiabilities,
    noncurrentLiabilities,
    totalLiabilities,
    equity,
    netIncome: is.netIncome,
    draws,
    endingRetainedEarnings: round2(retained + is.netIncome - draws),
    totalEquity,
    totalLiabilitiesAndEquity: totalLE,
    difference,
    priorDifference,
    balanced: difference === 0,
    priorBalanced: priorDifference === 0,
    hasPrior: accounts.some((a) => a.prior !== 0),
    workingCapital: round2(totalCurrentAssets.current - totalCurrentLiabilities.current),
    currentRatio: totalCurrentLiabilities.current > 0 ? round2(totalCurrentAssets.current / totalCurrentLiabilities.current) : null,
    debtToEquity: totalEquity.current > 0 ? round2(totalLiabilities.current / totalEquity.current) : null,
    equityRatioPct: totalAssets.current > 0 ? (totalEquity.current / totalAssets.current) * 100 : null,
  };
}

// ───────────────────────── cash flow statement (indirect method)

export interface CashFlowStatement {
  operating: StatementLine[];
  netOperating: number;
  investing: StatementLine[];
  netInvesting: number;
  financing: StatementLine[];
  netFinancing: number;
  netChange: number;
  cashStart: number;
  cashEnd: number;
  /** Change in the cash accounts themselves */
  actualChange: number;
  /** actualChange − netChange; zero when both balance sheets balance */
  unreconciled: number;
  reconciled: boolean;
  /** Operating cash flow less net purchases of long-term assets */
  freeCashFlow: number;
  /** Operating cash flow ÷ net income */
  cashConversion: number | null;
}

export function cashFlowStatement(ledger: Ledger): CashFlowStatement {
  const { accounts } = postLedger(ledger);
  const is = incomeStatement(ledger);
  const delta = (a: PostedAccount) => round2(a.ending - a.prior);
  const of = (...types: AccountType[]) => accounts.filter((a) => types.includes(a.type));
  const push = (list: StatementLine[], name: string, amount: number) => {
    if (round2(amount) !== 0) list.push({ name, amount: round2(amount) });
  };
  const sum = (ls: StatementLine[]) => round2(ls.reduce((s, l) => s + l.amount, 0));

  const operating: StatementLine[] = [{ name: 'Net income', amount: is.netIncome }];
  push(operating, 'Add back depreciation and amortization', is.depreciation);
  for (const a of of('current-asset')) push(operating, `${delta(a) > 0 ? 'Increase' : 'Decrease'} in ${a.name.toLowerCase()}`, -delta(a));
  for (const a of of('current-liability')) push(operating, `${delta(a) > 0 ? 'Increase' : 'Decrease'} in ${a.name.toLowerCase()}`, delta(a));

  const investing: StatementLine[] = [];
  const longTermChange = of('noncurrent-asset').reduce((s, a) => s + delta(a), 0);
  const netPurchases = round2(longTermChange + is.depreciation);
  push(investing, netPurchases >= 0 ? 'Purchases of long-term assets' : 'Proceeds from long-term assets, net', -netPurchases);

  const financing: StatementLine[] = [];
  for (const a of of('noncurrent-liability')) push(financing, delta(a) > 0 ? `Proceeds from ${a.name.toLowerCase()}` : `Repayment of ${a.name.toLowerCase()}`, delta(a));
  for (const a of of('equity')) push(financing, delta(a) > 0 ? `Contributions: ${a.name.toLowerCase()}` : `Returned capital: ${a.name.toLowerCase()}`, delta(a));
  for (const a of of('retained')) push(financing, `Other change in ${a.name.toLowerCase()}`, delta(a));
  for (const a of of('draws')) push(financing, a.name, -a.ending);

  const netOperating = sum(operating);
  const netInvesting = sum(investing);
  const netFinancing = sum(financing);
  const netChange = round2(netOperating + netInvesting + netFinancing);
  const cash = of('cash');
  const cashStart = round2(cash.reduce((s, a) => s + a.prior, 0));
  const cashEnd = round2(cash.reduce((s, a) => s + a.ending, 0));
  const actualChange = round2(cashEnd - cashStart);
  return {
    operating,
    netOperating,
    investing,
    netInvesting,
    financing,
    netFinancing,
    netChange,
    cashStart,
    cashEnd,
    actualChange,
    unreconciled: round2(actualChange - netChange),
    reconciled: round2(actualChange - netChange) === 0,
    freeCashFlow: round2(netOperating + netInvesting),
    cashConversion: is.netIncome > 0 ? round2(netOperating / is.netIncome) : null,
  };
}

// ───────────────────────── example

export const EXAMPLE_COMPANY = 'Maple Street Bakery';
export const EXAMPLE_PERIOD = 'Year ended December 31, 2026';

export const EXAMPLE_LEDGER: Ledger = {
  accounts: [
    { id: 'cash', name: 'Cash', type: 'cash', prior: 18000, balance: 23100 },
    { id: 'ar', name: 'Accounts receivable', type: 'current-asset', prior: 6000, balance: 9200 },
    { id: 'inv', name: 'Inventory', type: 'current-asset', prior: 8000, balance: 7400 },
    { id: 'prepaid', name: 'Prepaid insurance', type: 'current-asset', prior: 0, balance: 2400 },
    { id: 'equip', name: 'Equipment', type: 'noncurrent-asset', prior: 40000, balance: 52000 },
    { id: 'accdep', name: 'Accumulated depreciation', type: 'noncurrent-asset', prior: -8000, balance: -8000 },
    { id: 'ap', name: 'Accounts payable', type: 'current-liability', prior: 5500, balance: 6300 },
    { id: 'wagespay', name: 'Wages payable', type: 'current-liability', prior: 0, balance: 0 },
    { id: 'loan', name: 'Bank loan', type: 'noncurrent-liability', prior: 20000, balance: 24000 },
    { id: 'capital', name: 'Owner capital', type: 'equity', prior: 30000, balance: 30000 },
    { id: 're', name: 'Retained earnings', type: 'retained', prior: 8500, balance: 8500 },
    { id: 'draws', name: 'Owner draws', type: 'draws', prior: 0, balance: 12000 },
    { id: 'sales', name: 'Sales revenue', type: 'revenue', prior: 0, balance: 184000 },
    { id: 'cogs', name: 'Cost of goods sold', type: 'cogs', prior: 0, balance: 73600 },
    { id: 'wages', name: 'Wages expense', type: 'expense', prior: 0, balance: 52000 },
    { id: 'rent', name: 'Rent expense', type: 'expense', prior: 0, balance: 18000 },
    { id: 'util', name: 'Utilities and other', type: 'expense', prior: 0, balance: 9500 },
    { id: 'ins', name: 'Insurance expense', type: 'expense', prior: 0, balance: 0 },
    { id: 'dep', name: 'Depreciation expense', type: 'depreciation', prior: 0, balance: 0 },
    { id: 'int', name: 'Interest expense', type: 'interest', prior: 0, balance: 1600 },
  ],
  entries: [
    { id: 'e1', date: '2026-12-31', memo: 'Depreciation on equipment for the year', debitId: 'dep', creditId: 'accdep', amount: 5000 },
    { id: 'e2', date: '2026-12-31', memo: 'Wages earned but not yet paid', debitId: 'wages', creditId: 'wagespay', amount: 1200 },
    { id: 'e3', date: '2026-12-31', memo: 'Four months of insurance used up', debitId: 'ins', creditId: 'prepaid', amount: 800 },
  ],
};
