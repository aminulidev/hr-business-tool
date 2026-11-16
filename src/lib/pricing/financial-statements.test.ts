import { describe, expect, it } from 'vitest';
import { balanceSheet, cashFlowStatement, equationEffect, EXAMPLE_LEDGER, incomeStatement, postLedger, trialBalance, type Ledger } from './financial-statements';

const L = EXAMPLE_LEDGER;
const noEntries: Ledger = { ...L, entries: [] };
const withAccount = (id: string, patch: Partial<Ledger['accounts'][number]>): Ledger => ({ ...L, accounts: L.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)) });

describe('postLedger', () => {
  it('debits raise debit-normal accounts and lower credit-normal ones', () => {
    const p = postLedger(L);
    const get = (id: string) => p.accounts.find((a) => a.id === id)!;
    expect(p.posted).toBe(3);
    expect(get('dep').ending).toBe(5000); // debit to an expense
    expect(get('accdep').ending).toBe(-13000); // credit to a contra asset makes it more negative
    expect(get('wages').ending).toBe(53200);
    expect(get('wagespay').ending).toBe(1200); // credit to a liability
    expect(get('prepaid').ending).toBe(1600); // credit to an asset
  });
  it('rejects entries that cannot balance', () => {
    const p = postLedger({ ...L, entries: [{ id: 'x', date: '', memo: 'same account', debitId: 'cash', creditId: 'cash', amount: 100 }, { id: 'y', date: '', memo: 'missing', debitId: 'cash', creditId: 'nope', amount: 100 }, { id: 'z', date: '', memo: 'no amount', debitId: 'cash', creditId: 'ar', amount: 0 }] });
    expect(p.posted).toBe(0);
    expect(p.rejected.map((r) => r.id)).toEqual(['x', 'y', 'z']);
  });
  it('describes the effect on the accounting equation', () => {
    expect(equationEffect(L.entries[0], L.accounts)).toBe('Expenses (reduce equity) ↑ · Assets ↓');
    expect(equationEffect(L.entries[1], L.accounts)).toBe('Expenses (reduce equity) ↑ · Liabilities ↑');
    expect(equationEffect({ id: 'q', date: '', memo: '', debitId: 'cash', creditId: 'sales', amount: 1 }, L.accounts)).toBe('Assets ↑ · Revenue (equity) ↑');
    expect(equationEffect({ id: 'q', date: '', memo: '', debitId: 'draws', creditId: 'cash', amount: 1 }, L.accounts)).toBe('Draws (reduce equity) ↑ · Assets ↓');
  });
});

describe('trialBalance', () => {
  it('unadjusted and adjusted trial balances both balance', () => {
    const before = trialBalance(noEntries);
    expect(before.totalDebit).toBe(260800);
    expect(before.totalCredit).toBe(260800);
    const after = trialBalance(L);
    expect(after.totalDebit).toBe(267000); // +5,000 depreciation, +1,200 wages, +800 insurance; −800 prepaid
    expect(after.totalCredit).toBe(267000);
    expect(after.balanced).toBe(true);
    expect(after.hints).toEqual([]);
  });
  it('a contra asset shows in the credit column', () => {
    const row = trialBalance(L).rows.find((r) => r.name === 'Accumulated depreciation')!;
    expect(row.debit).toBe(0);
    expect(row.credit).toBe(13000);
  });
  it('diagnoses a transposition, a doubled amount and a wrong-side entry', () => {
    const transposed = trialBalance(withAccount('rent', { balance: 81000 })); // 18,000 keyed as 81,000
    expect(transposed.difference).toBe(63000);
    expect(transposed.hints.some((h) => h.includes('divides evenly by 9'))).toBe(true);
    const wrongSide = trialBalance(withAccount('int', { balance: -1600 })); // interest entered as a credit
    expect(wrongSide.difference).toBe(-3200);
    expect(wrongSide.hints.some((h) => h.includes('Interest expense') && h.includes('half the difference'))).toBe(true);
    const missing = trialBalance(withAccount('util', { balance: 0 }));
    expect(missing.difference).toBe(-9500);
    expect(missing.hints.length).toBeGreaterThan(0);
  });
});

describe('incomeStatement', () => {
  const is = incomeStatement(L);
  it('multi-step statement from the adjusted balances', () => {
    expect(is.totalRevenue).toBe(184000);
    expect(is.totalCogs).toBe(73600);
    expect(is.grossProfit).toBe(110400);
    expect(is.grossMarginPct).toBeCloseTo(60, 6);
    expect(is.totalOperatingExpenses).toBe(53200 + 18000 + 9500 + 800 + 5000);
    expect(is.operatingIncome).toBe(23900);
    expect(is.ebitda).toBe(28900);
    expect(is.interest).toBe(1600);
    expect(is.netIncome).toBe(22300);
    expect(is.netMarginPct).toBeCloseTo((22300 / 184000) * 100, 6);
  });
  it('the adjusting entries lower net income by exactly their total', () => {
    expect(incomeStatement(noEntries).netIncome).toBe(22300 + 5000 + 1200 + 800);
  });
  it('income tax and the effective rate', () => {
    const taxed = incomeStatement({ ...L, accounts: [...L.accounts, { id: 'tax', name: 'Income tax', type: 'tax', prior: 0, balance: 4683 }] });
    expect(taxed.pretaxIncome).toBe(22300);
    expect(taxed.netIncome).toBe(17617);
    expect(taxed.effectiveTaxRatePct).toBeCloseTo(21, 6);
  });
});

describe('balanceSheet', () => {
  const bs = balanceSheet(L);
  it('assets equal liabilities plus equity in both periods', () => {
    expect(bs.totalCurrentAssets.current).toBe(23100 + 9200 + 7400 + 1600);
    expect(bs.totalAssets.current).toBe(80300);
    expect(bs.totalLiabilities.current).toBe(31500);
    expect(bs.totalEquity.current).toBe(48800); // 30,000 + 8,500 + 22,300 − 12,000
    expect(bs.totalLiabilitiesAndEquity.current).toBe(80300);
    expect(bs.balanced).toBe(true);
    expect(bs.totalAssets.prior).toBe(64000);
    expect(bs.totalLiabilitiesAndEquity.prior).toBe(64000);
    expect(bs.priorBalanced).toBe(true);
  });
  it('rolls retained earnings forward and reports the ratios', () => {
    expect(bs.endingRetainedEarnings).toBe(8500 + 22300 - 12000);
    expect(bs.workingCapital).toBe(41300 - 7500);
    expect(bs.currentRatio).toBeCloseTo(5.51, 2);
    expect(bs.debtToEquity).toBeCloseTo(0.65, 2);
    expect(bs.equityRatioPct).toBeCloseTo((48800 / 80300) * 100, 6);
  });
  it('reports the size of an imbalance', () => {
    const off = balanceSheet(withAccount('cash', { balance: 24100 }));
    expect(off.balanced).toBe(false);
    expect(off.difference).toBe(1000);
  });
});

describe('cashFlowStatement', () => {
  const cf = cashFlowStatement(L);
  it('indirect method: operating, investing and financing', () => {
    expect(cf.operating[0]).toEqual({ name: 'Net income', amount: 22300 });
    expect(cf.operating.find((l) => l.name.includes('depreciation'))!.amount).toBe(5000);
    expect(cf.operating.find((l) => l.name === 'Increase in accounts receivable')!.amount).toBe(-3200);
    expect(cf.operating.find((l) => l.name === 'Decrease in inventory')!.amount).toBe(600);
    expect(cf.operating.find((l) => l.name === 'Increase in prepaid insurance')!.amount).toBe(-1600);
    expect(cf.operating.find((l) => l.name === 'Increase in accounts payable')!.amount).toBe(800);
    expect(cf.operating.find((l) => l.name === 'Increase in wages payable')!.amount).toBe(1200);
    expect(cf.netOperating).toBe(25100);
    expect(cf.investing).toEqual([{ name: 'Purchases of long-term assets', amount: -12000 }]);
    expect(cf.financing).toEqual([{ name: 'Proceeds from bank loan', amount: 4000 }, { name: 'Owner draws', amount: -12000 }]);
    expect(cf.netFinancing).toBe(-8000);
  });
  it('reconciles to the change in the cash account', () => {
    expect(cf.netChange).toBe(5100);
    expect(cf.cashStart).toBe(18000);
    expect(cf.cashEnd).toBe(23100);
    expect(cf.actualChange).toBe(5100);
    expect(cf.reconciled).toBe(true);
    expect(cf.freeCashFlow).toBe(13100);
    expect(cf.cashConversion).toBeCloseTo(1.13, 2);
  });
  it('an unbalanced balance sheet shows up as an unreconciled amount', () => {
    const off = cashFlowStatement(withAccount('cash', { balance: 24100 }));
    expect(off.reconciled).toBe(false);
    expect(off.unreconciled).toBe(1000);
  });
  it('loan repayment and a disposal change the labels', () => {
    const cf2 = cashFlowStatement({ ...withAccount('loan', { balance: 15000 }), accounts: withAccount('loan', { balance: 15000 }).accounts.map((a) => (a.id === 'equip' ? { ...a, balance: 30000 } : a)) });
    expect(cf2.financing[0]).toEqual({ name: 'Repayment of bank loan', amount: -5000 });
    expect(cf2.investing[0].name).toBe('Proceeds from long-term assets, net');
    expect(cf2.investing[0].amount).toBe(10000);
  });
});
