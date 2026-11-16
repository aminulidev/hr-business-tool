import { describe, expect, it } from 'vitest';
import { addDays, buildInvoiceHtml, computeInvoice, dueDateFor, formatDate, INVOICE_EXAMPLE, money, nextInvoiceNumber, parseIso, type InvoiceDocument } from './invoice';

const doc: InvoiceDocument = { ...INVOICE_EXAMPLE, issueDate: '2026-11-16', customDueDate: '' };

describe('computeInvoice', () => {
  const t = computeInvoice(doc);
  it('line amounts and subtotal', () => {
    expect(t.lines.map((l) => l.amount)).toEqual([2400, 3040, 340]);
    expect(t.subtotal).toBe(5780);
  });
  it('percentage discount is spread across lines, so tax falls on the discounted taxable part only', () => {
    expect(t.discount).toBe(289);
    expect(t.discountPct).toBeCloseTo(5, 6);
    expect(t.taxableBase).toBe(323); // $340 × 95%
    expect(t.tax).toBe(26.65); // $323 × 8.25% = 26.6475
    expect(t.netOfTax).toBe(5491);
  });
  it('shipping is added after tax; deposit leaves a balance', () => {
    expect(t.total).toBe(5542.65); // 5,491 + 26.65 + 25
    expect(t.amountPaid).toBe(1500);
    expect(t.balanceDue).toBe(4042.65);
  });
  it('fixed discount, capped at the subtotal', () => {
    const f = computeInvoice({ ...doc, discountType: 'fixed', discountValue: 780 });
    expect(f.discount).toBe(780);
    expect(f.netOfTax).toBe(5000);
    expect(computeInvoice({ ...doc, discountType: 'fixed', discountValue: 99999 }).total).toBe(25); // only shipping left
  });
  it('tax-inclusive prices: tax is extracted, not added', () => {
    const vat = computeInvoice({ lines: [{ description: 'Consulting', quantity: 1, unitPrice: 1200, taxable: true }], discountType: 'percent', discountValue: 0, taxPct: 20, pricesIncludeTax: true, shipping: 0, amountPaid: 0 });
    expect(vat.total).toBe(1200);
    expect(vat.tax).toBe(200);
    expect(vat.netOfTax).toBe(1000);
    expect(vat.taxableBase).toBe(1000);
  });
  it('ignores blank rows and never lets payments exceed the total', () => {
    const r = computeInvoice({ lines: [{ description: '', quantity: 0, unitPrice: 0, taxable: true }, { description: 'Work', quantity: 2, unitPrice: 50, taxable: true }], discountType: 'percent', discountValue: 0, taxPct: 0, pricesIncludeTax: false, shipping: 0, amountPaid: 500 });
    expect(r.lines).toHaveLength(1);
    expect(r.total).toBe(100);
    expect(r.amountPaid).toBe(100);
    expect(r.balanceDue).toBe(0);
  });
  it('rounds each figure to cents', () => {
    const r = computeInvoice({ lines: [{ description: 'Hours', quantity: 3.333, unitPrice: 33.33, taxable: true }], discountType: 'percent', discountValue: 0, taxPct: 7.25, pricesIncludeTax: false, shipping: 0, amountPaid: 0 });
    expect(r.subtotal).toBe(111.09);
    expect(r.tax).toBe(8.05);
    expect(r.total).toBe(119.14);
  });
});

describe('dates and numbering', () => {
  it('due date from terms', () => {
    expect(dueDateFor('2026-11-16', 'net30', '')).toBe('2026-12-16');
    expect(dueDateFor('2026-11-16', 'receipt', '')).toBe('2026-11-16');
    expect(dueDateFor('2026-12-20', 'net15', '')).toBe('2027-01-04'); // crosses the year end
    expect(dueDateFor('2026-11-16', 'custom', '2026-12-01')).toBe('2026-12-01');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29'); // leap year
  });
  it('parses and formats ISO dates without a timezone shift', () => {
    expect(parseIso('2026-02-30')).toBeNull();
    expect(parseIso('not a date')).toBeNull();
    expect(formatDate('2026-11-16')).toBe('November 16, 2026');
    expect(formatDate('')).toBe('');
  });
  it('increments the trailing number and keeps its padding', () => {
    expect(nextInvoiceNumber('INV-0042')).toBe('INV-0043');
    expect(nextInvoiceNumber('2026-099')).toBe('2026-100');
    expect(nextInvoiceNumber('ACME')).toBe('ACME-2');
    expect(nextInvoiceNumber('')).toBe('INV-0001');
  });
  it('formats money in the invoice currency', () => {
    expect(money(1234.5, 'USD')).toBe('$1,234.50');
    expect(money(1234.5, 'EUR')).toBe('€1,234.50');
    expect(money(10, 'XXX-unknown')).toBe('$10.00');
  });
});

describe('buildInvoiceHtml', () => {
  const html = buildInvoiceHtml(doc);
  it('renders parties, number, dates and the balance', () => {
    expect(html).toContain('Northside Design Studio LLC');
    expect(html).toContain('Harbor Coffee Roasters');
    expect(html).toContain('INV-0042');
    expect(html).toContain('November 16, 2026');
    expect(html).toContain('December 16, 2026'); // Net 30
    expect(html).toContain('$4,042.65');
    expect(html).toContain('Sales tax (8.25%)');
    expect(html).toContain('not taxed');
  });
  it('escapes user text and refuses non-image logo URLs', () => {
    const evil = buildInvoiceHtml({ ...doc, toName: '<script>alert(1)</script>', notes: 'a & b\n<b>c</b>', logoDataUrl: 'javascript:alert(1)' });
    expect(evil).not.toContain('<script>alert(1)</script>');
    expect(evil).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(evil).toContain('a &amp; b<br>&lt;b&gt;c&lt;/b&gt;');
    expect(evil).not.toContain('javascript:');
    expect(evil).not.toContain('<img');
    const ok = buildInvoiceHtml({ ...doc, logoDataUrl: 'data:image/png;base64,iVBORw0KGgo=' });
    expect(ok).toContain('<img src="data:image/png;base64,iVBORw0KGgo="');
    expect(buildInvoiceHtml({ ...doc, logoDataUrl: 'data:image/svg+xml;base64,PHN2Zz4=' })).not.toContain('<img'); // SVG can carry script
  });
  it('tax-inclusive invoices show the tax as included rather than added', () => {
    const vat = buildInvoiceHtml({ ...doc, taxLabel: 'VAT', taxPct: 20, pricesIncludeTax: true });
    expect(vat).toContain('Includes VAT (20%)');
  });
  it('carries no network requests or third-party branding', () => {
    expect(html).not.toMatch(/https?:\/\//);
    expect(html.toLowerCase()).not.toContain('quickbizcalc');
  });
});
