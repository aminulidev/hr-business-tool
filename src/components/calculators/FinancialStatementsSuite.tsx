'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, CheckCircle2, FileSpreadsheet, Info, Landmark, Plus, Scale, Trash2, Wallet } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import TryExample from './TryExample';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { useSearchParam } from '@/hooks/useSearchParam';
import { Kpi, ModeTabs, Note, num, pct, Th } from './suite-ui';
import {
  ACCOUNT_TYPES,
  accountTypeInfo,
  balanceSheet,
  cashFlowStatement,
  equationEffect,
  EXAMPLE_COMPANY,
  EXAMPLE_LEDGER,
  EXAMPLE_PERIOD,
  incomeStatement,
  isAccountType,
  isStatementMode,
  postLedger,
  STATEMENT_MODES,
  trialBalance,
  type AccountType,
  type BalanceLine,
  type Ledger,
  type StatementLine,
  type StatementMode,
} from '@/lib/pricing/financial-statements';

/**
 * Financial statements suite (Phase 17). One small ledger — a chart of
 * accounts with prior and current balances plus journal entries — drives all
 * five tabs, so the state lives here rather than in each tab. The former
 * journal-entry, trial-balance, balance-sheet, cash-flow-statement and pnl
 * pages 301 here with ?mode=journal|trial|balance|cashflow|income.
 */

type AccountState = { id: string; name: string; type: AccountType; prior: string; balance: string };
type EntryState = { id: string; date: string; memo: string; debitId: string; creditId: string; amount: string };
interface State { company: string; period: string; accounts: AccountState[]; entries: EntryState[] }

let nextId = 100;
const exampleState = (): State => ({
  company: EXAMPLE_COMPANY,
  period: EXAMPLE_PERIOD,
  accounts: EXAMPLE_LEDGER.accounts.map((a) => ({ id: a.id, name: a.name, type: a.type, prior: a.prior ? String(a.prior) : '', balance: a.balance ? String(a.balance) : '' })),
  entries: EXAMPLE_LEDGER.entries.map((e) => ({ id: e.id, date: e.date, memo: e.memo, debitId: e.debitId, creditId: e.creditId, amount: String(e.amount) })),
});
const blankState = (): State => ({
  company: '',
  period: '',
  accounts: [
    { id: `a${nextId++}`, name: 'Cash', type: 'cash', prior: '', balance: '' },
    { id: `a${nextId++}`, name: 'Accounts receivable', type: 'current-asset', prior: '', balance: '' },
    { id: `a${nextId++}`, name: 'Accounts payable', type: 'current-liability', prior: '', balance: '' },
    { id: `a${nextId++}`, name: 'Owner capital', type: 'equity', prior: '', balance: '' },
    { id: `a${nextId++}`, name: 'Retained earnings', type: 'retained', prior: '', balance: '' },
    { id: `a${nextId++}`, name: 'Revenue', type: 'revenue', prior: '', balance: '' },
    { id: `a${nextId++}`, name: 'Expenses', type: 'expense', prior: '', balance: '' },
  ],
  entries: [],
});
// Signed inputs: contra accounts carry a negative balance, so parse without clamping at zero.
const signed = (v: string) => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };
const toLedger = (s: State): Ledger => ({
  accounts: s.accounts.map((a) => ({ id: a.id, name: a.name, type: a.type, prior: signed(a.prior), balance: signed(a.balance) })),
  entries: s.entries.map((e) => ({ id: e.id, date: e.date, memo: e.memo, debitId: e.debitId, creditId: e.creditId, amount: num(e.amount) })),
});

const money = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
/** Accounting format: negatives in parentheses */
const acct = (n: number) => (n < 0 ? `(${money(-n)})` : money(n));
const selectCls = 'h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const Pill = ({ ok, children }: { ok: boolean; children: React.ReactNode }) => (
  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${ok ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700' : 'border-amber-500/40 bg-amber-500/10 text-amber-700'}`}>
    {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />} {children}
  </span>
);

// Statement table rows
const Head = ({ title, cols }: { title: string; cols: string[] }) => (
  <tr className="border-b border-border/50 bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground"><th className="text-left px-3 py-2 font-semibold">{title}</th>{cols.map((c) => <th key={c} className="text-right px-3 py-2 font-semibold w-32">{c}</th>)}</tr>
);
const Row = ({ label, values, indent, bold, rule, tone }: { label: string; values: (number | null)[]; indent?: boolean; bold?: boolean; rule?: boolean; tone?: string }) => (
  <tr className={`${bold ? 'font-semibold' : ''} ${rule ? 'border-t border-foreground/40' : ''}`}>
    <td className={`px-3 py-1.5 ${indent ? 'pl-7' : ''}`}>{label}</td>
    {values.map((v, i) => <td key={i} className={`text-right px-3 py-1.5 tabular-nums ${i > 0 ? 'text-muted-foreground' : tone ?? ''}`}>{v === null ? '' : acct(v)}</td>)}
  </tr>
);
const Sheet = ({ company, title, period, children }: { company: string; title: string; period: string; children: React.ReactNode }) => (
  <div className="result-display rounded-2xl border border-emerald-500/20 bg-background overflow-hidden" aria-live="polite">
    <div className="text-center px-4 py-3 border-b border-border/50 bg-emerald-500/5">
      <p className="font-bold">{company.trim() || 'Your company'}</p>
      <p className="text-sm">{title}</p>
      {period.trim() && <p className="text-xs text-muted-foreground">{period}</p>}
    </div>
    <div className="overflow-x-auto"><table className="w-full text-sm">{children}</table></div>
  </div>
);

export default function FinancialStatementsSuite() {
  const urlMode = useSearchParam('mode');
  const [override, setMode] = useState<StatementMode | null>(null);
  const mode: StatementMode = override ?? (isStatementMode(urlMode) ? urlMode : 'trial');
  const [state, setState] = useState<State>(exampleState);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('financial-statements-calculator');

  const ledger = useMemo(() => toLedger(state), [state]);
  const posted = useMemo(() => postLedger(ledger), [ledger]);
  const tb = useMemo(() => trialBalance(ledger), [ledger]);
  const is = useMemo(() => incomeStatement(ledger), [ledger]);
  const bs = useMemo(() => balanceSheet(ledger), [ledger]);
  const cf = useMemo(() => cashFlowStatement(ledger), [ledger]);
  const byId = useMemo(() => new Map(posted.accounts.map((a) => [a.id, a])), [posted]);
  const rejected = useMemo(() => new Map(posted.rejected.map((r) => [r.id, r.reason])), [posted]);

  const setAccount = (id: string, patch: Partial<AccountState>) => setState((p) => ({ ...p, accounts: p.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));
  const setEntry = (id: string, patch: Partial<EntryState>) => setState((p) => ({ ...p, entries: p.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  const removeAccount = (id: string) => setState((p) => ({ ...p, accounts: p.accounts.filter((a) => a.id !== id), entries: p.entries.map((e) => ({ ...e, debitId: e.debitId === id ? '' : e.debitId, creditId: e.creditId === id ? '' : e.creditId })) }));
  const save = () => saveEntry({ data: JSON.stringify(state) }, `${state.company.trim() || 'Untitled'} · net income ${acct(is.netIncome)} · assets ${acct(bs.totalAssets.current)}`);
  const restore = (i: Record<string, string>) => {
    try {
      const p = JSON.parse(i.data) as Partial<State>;
      if (p && Array.isArray(p.accounts) && Array.isArray(p.entries)) setState({ company: p.company ?? '', period: p.period ?? '', accounts: p.accounts.map((a) => ({ ...a, type: isAccountType(a.type) ? a.type : 'expense' })), entries: p.entries });
    } catch {}
  };
  const accountOptions = state.accounts.map((a) => <option key={a.id} value={a.id}>{a.name || 'Unnamed account'}</option>);
  const cols = bs.hasPrior ? ['This period', 'Prior period'] : ['This period'];
  const vals = (l: BalanceLine) => (bs.hasPrior ? [l.current, l.prior] : [l.current]);
  const one = (l: StatementLine) => [l.amount];

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-5 calculator-form">
        <ModeTabs modes={STATEMENT_MODES} mode={mode} onChange={setMode} label="Financial statement" icons={{ trial: Scale, journal: BookOpen, income: FileSpreadsheet, balance: Landmark, cashflow: Wallet }} />

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <div className="space-y-1.5"><Label htmlFor="fs-company" className="text-xs text-muted-foreground">Company</Label><Input id="fs-company" value={state.company} onChange={(e) => setState((p) => ({ ...p, company: e.target.value }))} maxLength={80} className="text-sm" placeholder="Company name" /></div>
          <div className="space-y-1.5"><Label htmlFor="fs-period" className="text-xs text-muted-foreground">Period</Label><Input id="fs-period" value={state.period} onChange={(e) => setState((p) => ({ ...p, period: e.target.value }))} maxLength={80} className="text-sm" placeholder="Year ended December 31, 2026" /></div>
          <div className="flex flex-wrap gap-2">
            <TryExample onClick={() => setState(exampleState())} />
            <Button type="button" variant="ghost" size="sm" onClick={() => setState(blankState())}>Start blank</Button>
            <Button type="button" variant="outline" size="sm" onClick={save}>Save to history</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Pill ok={tb.balanced}>{tb.balanced ? 'Trial balance in balance' : `Trial balance off by ${money(Math.abs(tb.difference))}`}</Pill>
          <Pill ok={bs.balanced}>{bs.balanced ? 'Assets = liabilities + equity' : `Balance sheet off by ${money(Math.abs(bs.difference))}`}</Pill>
          {bs.hasPrior && <Pill ok={cf.reconciled}>{cf.reconciled ? 'Cash flow reconciles to cash' : `Cash flow unreconciled by ${money(Math.abs(cf.unreconciled))}`}</Pill>}
          {posted.rejected.length > 0 && <Pill ok={false}>{posted.rejected.length} journal {posted.rejected.length === 1 ? 'entry' : 'entries'} not posted</Pill>}
        </div>

        {/* ───────────── trial balance: the editable chart of accounts */}
        {mode === 'trial' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Enter each account&apos;s balance on its normal side: assets, expenses and draws are debit balances; liabilities, equity and revenue are credit balances. Contra accounts such as accumulated depreciation are entered as a negative asset. &quot;Prior&quot; is last period&apos;s closing balance and is only needed for the cash flow statement.</p>
            <div className="result-display rounded-2xl border border-emerald-500/20 bg-background overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 bg-muted/30 text-xs text-muted-foreground"><Th>Account</Th><Th>Type</Th><Th right>Prior</Th><Th right>Balance</Th><Th right>Adjusted debit</Th><Th right>Adjusted credit</Th><th /></tr></thead>
                <tbody className="divide-y divide-border/30">
                  {state.accounts.map((a, i) => {
                    const p = byId.get(a.id);
                    const info = accountTypeInfo(a.type);
                    const dr = p ? (info.normal === 'debit' ? p.ending : -p.ending) : 0;
                    const adjusted = p ? p.debits + p.credits > 0 : false;
                    return (
                      <tr key={a.id}>
                        <td className="px-2 py-1"><Input aria-label={`Account ${i + 1} name`} value={a.name} onChange={(e) => setAccount(a.id, { name: e.target.value })} className="text-sm min-w-[10rem]" maxLength={60} /></td>
                        <td className="px-2 py-1"><select aria-label={`Account ${i + 1} type`} value={a.type} onChange={(e) => setAccount(a.id, { type: isAccountType(e.target.value) ? e.target.value : 'expense' })} className={`${selectCls} min-w-[11rem]`}>{ACCOUNT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></td>
                        <td className="px-2 py-1">{info.permanent ? <Input aria-label={`Account ${i + 1} prior balance`} type="number" step="any" value={a.prior} onChange={(e) => setAccount(a.id, { prior: e.target.value })} className="text-sm w-28 text-right" placeholder="0" /> : <span className="block text-center text-muted-foreground">—</span>}</td>
                        <td className="px-2 py-1"><Input aria-label={`Account ${i + 1} balance`} type="number" step="any" value={a.balance} onChange={(e) => setAccount(a.id, { balance: e.target.value })} className="text-sm w-28 text-right" placeholder="0" /></td>
                        <td className={`px-3 py-1 text-right tabular-nums ${adjusted ? 'font-semibold text-emerald-700' : ''}`}>{dr > 0 ? money(dr) : ''}</td>
                        <td className={`px-3 py-1 text-right tabular-nums ${adjusted ? 'font-semibold text-emerald-700' : ''}`}>{dr < 0 ? money(-dr) : ''}</td>
                        <td className="px-1 py-1"><Button type="button" variant="ghost" size="icon" aria-label="Remove account" onClick={() => removeAccount(a.id)}><Trash2 className="h-4 w-4" /></Button></td>
                      </tr>
                    );
                  })}
                  <tr className={`font-bold ${tb.balanced ? 'bg-emerald-500/5' : 'bg-amber-500/10'}`}>
                    <td className="px-3 py-2" colSpan={4}>Totals {tb.balanced ? '— debits equal credits' : `— out of balance by ${money(Math.abs(tb.difference))}`}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{money(tb.totalDebit)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{money(tb.totalCredit)}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button type="button" variant="outline" size="sm" disabled={state.accounts.length >= 60} onClick={() => setState((p) => ({ ...p, accounts: [...p.accounts, { id: `a${nextId++}`, name: '', type: 'expense', prior: '', balance: '' }] }))}><Plus className="h-4 w-4 mr-1" /> Add account</Button>
              <span className="text-xs text-muted-foreground">Green figures include posted journal entries.</span>
            </div>
            {tb.hints.length > 0 && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm space-y-1">
                <p className="font-semibold flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" /> Where to look</p>
                {tb.hints.map((h) => <p key={h}>{h}</p>)}
              </div>
            )}
          </div>
        )}

        {/* ───────────── journal */}
        {mode === 'journal' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Each entry debits one account and credits another for the same amount, so the books stay in balance. Split a compound entry into separate lines. Entries adjust the balances on the trial balance tab and flow through every statement.</p>
            <div className="result-display rounded-2xl border border-emerald-500/20 bg-background overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 bg-muted/30 text-xs text-muted-foreground"><Th>Date</Th><Th>Description</Th><Th>Debit</Th><Th>Credit</Th><Th right>Amount</Th><th /></tr></thead>
                <tbody>
                  {state.entries.length === 0 && <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">No journal entries yet. Add one to adjust the trial balance.</td></tr>}
                  {state.entries.map((e, i) => {
                    const effect = equationEffect({ ...e, amount: num(e.amount) }, ledger.accounts);
                    const reason = rejected.get(e.id);
                    return [
                      <tr key={e.id} className="border-t border-border/30">
                        <td className="px-2 pt-2"><Input aria-label={`Entry ${i + 1} date`} type="date" value={e.date} onChange={(ev) => setEntry(e.id, { date: ev.target.value })} className="text-sm w-36" /></td>
                        <td className="px-2 pt-2"><Input aria-label={`Entry ${i + 1} description`} value={e.memo} onChange={(ev) => setEntry(e.id, { memo: ev.target.value })} className="text-sm min-w-[12rem]" maxLength={120} placeholder="What happened" /></td>
                        <td className="px-2 pt-2"><select aria-label={`Entry ${i + 1} debit account`} value={e.debitId} onChange={(ev) => setEntry(e.id, { debitId: ev.target.value })} className={`${selectCls} min-w-[10rem]`}><option value="">Debit…</option>{accountOptions}</select></td>
                        <td className="px-2 pt-2"><select aria-label={`Entry ${i + 1} credit account`} value={e.creditId} onChange={(ev) => setEntry(e.id, { creditId: ev.target.value })} className={`${selectCls} min-w-[10rem]`}><option value="">Credit…</option>{accountOptions}</select></td>
                        <td className="px-2 pt-2"><Input aria-label={`Entry ${i + 1} amount`} type="number" min="0" step="any" value={e.amount} onChange={(ev) => setEntry(e.id, { amount: ev.target.value })} className="text-sm w-28 text-right" /></td>
                        <td className="px-1 pt-2"><Button type="button" variant="ghost" size="icon" aria-label="Remove entry" onClick={() => setState((p) => ({ ...p, entries: p.entries.filter((x) => x.id !== e.id) }))}><Trash2 className="h-4 w-4" /></Button></td>
                      </tr>,
                      <tr key={`${e.id}-fx`}><td /><td colSpan={5} className={`px-2 pb-2 text-xs ${reason ? 'text-amber-700' : 'text-muted-foreground'}`}>{reason ?? (effect ? `Effect: ${effect}` : 'Choose the two accounts')}</td></tr>,
                    ];
                  })}
                </tbody>
              </table>
            </div>
            <Button type="button" variant="outline" size="sm" disabled={state.entries.length >= 60} onClick={() => setState((p) => ({ ...p, entries: [...p.entries, { id: `e${nextId++}`, date: p.entries[p.entries.length - 1]?.date ?? '', memo: '', debitId: '', creditId: '', amount: '' }] }))}><Plus className="h-4 w-4 mr-1" /> Add entry</Button>
            <div className="rounded-xl border border-border/50 bg-muted/20 p-3 text-xs text-muted-foreground grid sm:grid-cols-2 gap-x-6 gap-y-1">
              <p><strong className="text-foreground">Debit increases:</strong> assets, expenses, draws and dividends.</p>
              <p><strong className="text-foreground">Credit increases:</strong> liabilities, equity and revenue.</p>
              <p><strong className="text-foreground">Debit decreases:</strong> liabilities, equity and revenue.</p>
              <p><strong className="text-foreground">Credit decreases:</strong> assets and expenses.</p>
            </div>
          </div>
        )}

        {/* ───────────── income statement */}
        {mode === 'income' && (
          <div className="space-y-4">
            <Sheet company={state.company} title="Income Statement" period={state.period}>
              <tbody>
                <Head title="Revenue" cols={['Amount']} />
                {is.revenue.map((l) => <Row key={l.name} label={l.name} values={one(l)} indent />)}
                <Row label="Total revenue" values={[is.totalRevenue]} bold rule />
                {is.cogs.length > 0 && <Head title="Cost of goods sold" cols={['']} />}
                {is.cogs.map((l) => <Row key={l.name} label={l.name} values={one(l)} indent />)}
                <Row label="Gross profit" values={[is.grossProfit]} bold rule />
                <Head title="Operating expenses" cols={['']} />
                {is.operatingExpenses.map((l) => <Row key={l.name} label={l.name} values={one(l)} indent />)}
                <Row label="Total operating expenses" values={[is.totalOperatingExpenses]} bold rule />
                <Row label="Operating income" values={[is.operatingIncome]} bold />
                {is.interest !== 0 && <Row label="Interest expense" values={[-is.interest]} indent />}
                {(is.interest !== 0 || is.tax !== 0) && <Row label="Income before tax" values={[is.pretaxIncome]} bold rule />}
                {is.tax !== 0 && <Row label="Income tax expense" values={[-is.tax]} indent />}
                <Row label="Net income" values={[is.netIncome]} bold rule tone={is.netIncome < 0 ? 'text-red-500' : 'text-emerald-600'} />
              </tbody>
            </Sheet>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Kpi label="Gross margin" value={pct(is.grossMarginPct)} sub={`gross profit ${acct(is.grossProfit)}`} color="text-emerald-600" />
              <Kpi label="Operating margin" value={pct(is.operatingMarginPct)} sub={`operating income ${acct(is.operatingIncome)}`} />
              <Kpi label="Net margin" value={pct(is.netMarginPct)} sub={is.effectiveTaxRatePct !== null ? `effective tax rate ${pct(is.effectiveTaxRatePct)}` : `net income ${acct(is.netIncome)}`} color="text-blue-600" />
              <Kpi label="EBITDA" value={acct(is.ebitda)} sub={`adds back ${acct(is.depreciation)} depreciation`} />
            </div>
            <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Revenue − cost of goods sold = gross profit; less operating expenses = operating income; less interest and income tax = net income. Net income flows into equity on the balance sheet and is the first line of the cash flow statement.</Note>
          </div>
        )}

        {/* ───────────── balance sheet */}
        {mode === 'balance' && (
          <div className="space-y-4">
            <Sheet company={state.company} title="Balance Sheet" period={state.period}>
              <tbody>
                <Head title="Assets" cols={cols} />
                {bs.currentAssets.map((l) => <Row key={l.name} label={l.name} values={vals(l)} indent />)}
                <Row label="Total current assets" values={vals(bs.totalCurrentAssets)} bold rule />
                {bs.noncurrentAssets.map((l) => <Row key={l.name} label={l.name} values={vals(l)} indent />)}
                <Row label="Total assets" values={vals(bs.totalAssets)} bold rule />
                <Head title="Liabilities" cols={cols.map(() => '')} />
                {bs.currentLiabilities.map((l) => <Row key={l.name} label={l.name} values={vals(l)} indent />)}
                <Row label="Total current liabilities" values={vals(bs.totalCurrentLiabilities)} bold rule />
                {bs.noncurrentLiabilities.map((l) => <Row key={l.name} label={l.name} values={vals(l)} indent />)}
                <Row label="Total liabilities" values={vals(bs.totalLiabilities)} bold rule />
                <Head title="Equity" cols={cols.map(() => '')} />
                {bs.equity.map((l) => <Row key={l.name} label={l.name} values={vals(l)} indent />)}
                <Row label="Net income for the period" values={bs.hasPrior ? [bs.netIncome, null] : [bs.netIncome]} indent />
                {bs.draws !== 0 && <Row label="Less draws / dividends" values={bs.hasPrior ? [-bs.draws, null] : [-bs.draws]} indent />}
                <Row label="Total equity" values={vals(bs.totalEquity)} bold rule />
                <Row label="Total liabilities and equity" values={vals(bs.totalLiabilitiesAndEquity)} bold rule tone={bs.balanced ? 'text-emerald-600' : 'text-amber-600'} />
              </tbody>
            </Sheet>
            {!bs.balanced && <p className="text-sm text-amber-700 flex items-start gap-1.5"><AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> Assets are {money(Math.abs(bs.difference))} {bs.difference > 0 ? 'more' : 'less'} than liabilities plus equity. A balance sheet built from a trial balance that balances always balances, so fix the trial balance first.</p>}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Kpi label="Working capital" value={acct(bs.workingCapital)} sub="current assets − current liabilities" color={bs.workingCapital < 0 ? 'text-red-500' : 'text-emerald-600'} />
              <Kpi label="Current ratio" value={bs.currentRatio === null ? '—' : `${bs.currentRatio}`} sub="current assets ÷ current liabilities" />
              <Kpi label="Debt to equity" value={bs.debtToEquity === null ? '—' : `${bs.debtToEquity}`} sub="total liabilities ÷ equity" color="text-blue-600" />
              <Kpi label="Retained earnings after closing" value={acct(bs.endingRetainedEarnings)} sub="opening + net income − draws" />
            </div>
            <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Assets = liabilities + equity. Equity here is the capital and retained earnings accounts as entered, plus this period&apos;s net income, less draws or dividends, which is what closing the books does to retained earnings.</Note>
          </div>
        )}

        {/* ───────────── cash flow */}
        {mode === 'cashflow' && (
          <div className="space-y-4">
            {!bs.hasPrior && <p className="text-sm text-amber-700 flex items-start gap-1.5"><AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> The indirect method works from the change in each balance. Enter last period&apos;s closing balances in the &quot;Prior&quot; column of the trial balance tab.</p>}
            <Sheet company={state.company} title="Statement of Cash Flows (indirect method)" period={state.period}>
              <tbody>
                <Head title="Operating activities" cols={['Amount']} />
                {cf.operating.map((l) => <Row key={l.name} label={l.name} values={one(l)} indent />)}
                <Row label="Net cash from operating activities" values={[cf.netOperating]} bold rule />
                <Head title="Investing activities" cols={['']} />
                {cf.investing.length === 0 && <Row label="No investing activity" values={[null]} indent />}
                {cf.investing.map((l) => <Row key={l.name} label={l.name} values={one(l)} indent />)}
                <Row label="Net cash from investing activities" values={[cf.netInvesting]} bold rule />
                <Head title="Financing activities" cols={['']} />
                {cf.financing.length === 0 && <Row label="No financing activity" values={[null]} indent />}
                {cf.financing.map((l) => <Row key={l.name} label={l.name} values={one(l)} indent />)}
                <Row label="Net cash from financing activities" values={[cf.netFinancing]} bold rule />
                <Row label="Net change in cash" values={[cf.netChange]} bold rule tone={cf.netChange < 0 ? 'text-red-500' : 'text-emerald-600'} />
                <Row label="Cash at start of period" values={[cf.cashStart]} indent />
                <Row label="Cash at end of period" values={[cf.cashStart + cf.netChange]} bold rule />
              </tbody>
            </Sheet>
            {bs.hasPrior && !cf.reconciled && <p className="text-sm text-amber-700 flex items-start gap-1.5"><AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> The statement explains a change of {acct(cf.netChange)} but the cash accounts moved by {acct(cf.actualChange)} ({money(Math.abs(cf.unreconciled))} unexplained). That happens when this period&apos;s or last period&apos;s balances do not balance.</p>}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Kpi label="Operating cash flow" value={acct(cf.netOperating)} sub={cf.cashConversion !== null ? `${cf.cashConversion}× net income` : undefined} color="text-emerald-600" />
              <Kpi label="Free cash flow" value={acct(cf.freeCashFlow)} sub="operating + investing" color="text-blue-600" />
              <Kpi label="Cash balance" value={acct(cf.cashEnd)} sub={`from ${acct(cf.cashStart)}`} />
              <Kpi label="Net income vs. cash" value={acct(cf.netOperating - is.netIncome)} sub="operating cash flow − net income" />
            </div>
            <Note><Info className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Start with net income, add back non-cash depreciation, subtract increases in current assets and add increases in current liabilities to reach operating cash flow. Long-term asset purchases are investing; loans, owner contributions and draws are financing. The three sections add up to the change in cash.</Note>
          </div>
        )}
      </div>
      <CalcHistoryPanel history={history} onRestore={restore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}
