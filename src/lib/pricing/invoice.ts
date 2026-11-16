// ---------------------------------------------------------------------------
// Invoice generator — Phase 17. Pure totals math plus a standalone HTML
// renderer (same approach as payroll/pay-stub.ts: the preview iframe and the
// printed page share one renderer, and "Save as PDF" is the browser's own
// print dialog, so no PDF library ships to the client). Nothing here touches
// the network: an invoice never leaves the visitor's browser.
// ---------------------------------------------------------------------------

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const v = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);

export interface InvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
  /** Whether tax applies to this line */
  taxable: boolean;
}

export type DiscountType = 'percent' | 'fixed';

export const CURRENCIES = ['USD', 'CAD', 'EUR', 'GBP', 'AUD', 'NZD', 'INR', 'SGD', 'CHF', 'JPY', 'MXN'] as const;
export type Currency = (typeof CURRENCIES)[number];
export const isCurrency = (x: string): x is Currency => (CURRENCIES as readonly string[]).includes(x);

export const TAX_LABELS = ['Sales tax', 'VAT', 'GST', 'HST', 'Tax'] as const;

export const PAYMENT_TERMS: { value: string; label: string; days: number | null }[] = [
  { value: 'receipt', label: 'Due on receipt', days: 0 },
  { value: 'net7', label: 'Net 7', days: 7 },
  { value: 'net15', label: 'Net 15', days: 15 },
  { value: 'net30', label: 'Net 30', days: 30 },
  { value: 'net45', label: 'Net 45', days: 45 },
  { value: 'net60', label: 'Net 60', days: 60 },
  { value: 'custom', label: 'Custom due date', days: null },
];

export interface InvoiceTotalsInput {
  lines: InvoiceLine[];
  discountType: DiscountType;
  discountValue: number;
  taxPct: number;
  /** True when the unit prices already include tax (usual for VAT/GST consumer pricing) */
  pricesIncludeTax: boolean;
  /** Shipping or other charge added after tax, not taxed */
  shipping: number;
  /** Deposit or payments already received */
  amountPaid: number;
}

export interface InvoiceTotals {
  lines: (InvoiceLine & { amount: number })[];
  subtotal: number;
  discount: number;
  /** Discount as a percentage of the subtotal */
  discountPct: number;
  /** Part of the discounted subtotal that tax applies to (net of tax when prices include it) */
  taxableBase: number;
  tax: number;
  /** Total before tax: discounted subtotal, less the tax inside it when prices include tax */
  netOfTax: number;
  shipping: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
}

export function computeInvoice(i: InvoiceTotalsInput): InvoiceTotals {
  const lines = i.lines
    .filter((l) => l.description.trim() !== '' || (l.quantity > 0 && l.unitPrice > 0))
    .map((l) => ({ ...l, quantity: v(l.quantity), unitPrice: v(l.unitPrice), amount: round2(v(l.quantity) * v(l.unitPrice)) }));
  const subtotal = round2(lines.reduce((s, l) => s + l.amount, 0));
  const taxableSubtotal = lines.filter((l) => l.taxable).reduce((s, l) => s + l.amount, 0);
  const discount = round2(Math.min(subtotal, i.discountType === 'percent' ? subtotal * (Math.min(100, v(i.discountValue)) / 100) : v(i.discountValue)));
  // The discount is spread across lines in proportion, so tax falls only on the discounted taxable part.
  const share = subtotal > 0 ? 1 - discount / subtotal : 0;
  const taxableGross = taxableSubtotal * share;
  const rate = v(i.taxPct) / 100;
  const tax = round2(i.pricesIncludeTax ? taxableGross - taxableGross / (1 + rate) : taxableGross * rate);
  const discounted = round2(subtotal - discount);
  const shipping = round2(v(i.shipping));
  const total = round2(i.pricesIncludeTax ? discounted + shipping : discounted + tax + shipping);
  const paid = round2(Math.min(total, v(i.amountPaid)));
  return {
    lines,
    subtotal,
    discount,
    discountPct: subtotal > 0 ? (discount / subtotal) * 100 : 0,
    taxableBase: round2(i.pricesIncludeTax ? taxableGross - tax : taxableGross),
    tax,
    netOfTax: round2(i.pricesIncludeTax ? discounted - tax : discounted),
    shipping,
    total,
    amountPaid: paid,
    balanceDue: round2(total - paid),
  };
}

// ───────────────────────── dates

const pad = (n: number) => String(n).padStart(2, '0');
export const toIso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function parseIso(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.getMonth() === Number(m[2]) - 1 ? d : null;
}

export function addDays(iso: string, days: number): string {
  const d = parseIso(iso);
  if (!d) return '';
  d.setDate(d.getDate() + days);
  return toIso(d);
}

/** Due date for a terms code; custom terms return the date the user typed */
export function dueDateFor(issueDate: string, terms: string, customDueDate: string): string {
  const t = PAYMENT_TERMS.find((x) => x.value === terms);
  if (!t || t.days === null) return customDueDate;
  return addDays(issueDate, t.days);
}

export function formatDate(iso: string): string {
  const d = parseIso(iso);
  return d ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
}

/** INV-0042 → INV-0043; 2026-009 → 2026-010; no trailing digits → appends -2 */
export function nextInvoiceNumber(current: string): string {
  const m = /^(.*?)(\d+)$/.exec(current.trim());
  if (!m) return current.trim() ? `${current.trim()}-2` : 'INV-0001';
  const next = String(Number(m[2]) + 1).padStart(m[2].length, '0');
  return `${m[1]}${next}`;
}

// ───────────────────────── rendering

export function money(n: number, currency: string): string {
  try {
    return n.toLocaleString('en-US', { style: 'currency', currency: isCurrency(currency) ? currency : 'USD' });
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export interface InvoiceDocument extends InvoiceTotalsInput {
  fromName: string;
  /** Address, email, phone, tax ID — one per line */
  fromDetails: string;
  toName: string;
  toDetails: string;
  invoiceNumber: string;
  issueDate: string;
  terms: string;
  customDueDate: string;
  currency: string;
  taxLabel: string;
  notes: string;
  /** Payment instructions: bank details, payment link, late-fee wording */
  paymentInstructions: string;
  /** Optional logo as a data: URL; only image data URLs are rendered */
  logoDataUrl?: string;
}

const multiline = (s: string) => escapeHtml(s.trim()).replace(/\r?\n/g, '<br>');
const safeLogo = (url?: string) => (url && /^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(url) ? url : '');
const qty = (n: number) => (Number.isInteger(n) ? String(n) : n.toLocaleString('en-US', { maximumFractionDigits: 3 }));

export function buildInvoiceHtml(doc: InvoiceDocument): string {
  const t = computeInvoice(doc);
  const e = escapeHtml;
  const m = (n: number) => money(n, doc.currency);
  const due = dueDateFor(doc.issueDate, doc.terms, doc.customDueDate);
  const termsLabel = PAYMENT_TERMS.find((x) => x.value === doc.terms)?.label ?? '';
  const anyUntaxed = t.lines.some((l) => !l.taxable) && t.tax > 0;
  const logo = safeLogo(doc.logoDataUrl);
  const number = doc.invoiceNumber.trim() || 'Draft';
  const rows = t.lines
    .map((l) => `<tr><td>${multiline(l.description) || '&nbsp;'}${anyUntaxed && !l.taxable ? ' <span class="tag">not taxed</span>' : ''}</td><td class="num">${qty(l.quantity)}</td><td class="num">${m(l.unitPrice)}</td><td class="num">${m(l.amount)}</td></tr>`)
    .join('');
  const line = (label: string, value: string, cls = '') => `<tr class="${cls}"><td>${label}</td><td class="num">${value}</td></tr>`;
  const taxText = `${e(doc.taxLabel || 'Tax')} (${Number(v(doc.taxPct).toFixed(3))}%)`;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Invoice ${e(number)}${doc.toName.trim() ? ` — ${e(doc.toName.trim())}` : ''}</title>
<style>
  @page { size: auto; margin: 0.6in; }
  * { box-sizing: border-box; }
  body { font: 13px/1.5 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111; margin: 0; padding: 24px; background: #fff; }
  .inv { max-width: 780px; margin: 0 auto; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 28px; }
  .head img { max-height: 64px; max-width: 220px; display: block; margin-bottom: 10px; }
  .head h1 { font-size: 30px; letter-spacing: 0.06em; margin: 0; text-transform: uppercase; color: #0f766e; }
  .from strong, .to strong { font-size: 15px; display: block; }
  .muted { color: #555; font-size: 12px; }
  .meta { text-align: right; }
  .meta table { margin-left: auto; border-collapse: collapse; }
  .meta td { padding: 2px 0 2px 16px; font-size: 12.5px; }
  .meta td:first-child { color: #555; text-align: right; }
  .parties { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 24px; }
  .label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #666; margin-bottom: 4px; }
  .due { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 10px 16px; text-align: right; min-width: 200px; }
  .due strong { display: block; font-size: 22px; }
  table.items { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
  table.items th { text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: #444; border-bottom: 2px solid #111; padding: 8px 8px 6px; }
  table.items td { padding: 9px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
  .num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .tag { font-size: 10px; color: #666; border: 1px solid #d1d5db; border-radius: 4px; padding: 0 4px; margin-left: 4px; white-space: nowrap; }
  .totals { display: flex; justify-content: flex-end; margin-bottom: 24px; }
  .totals table { border-collapse: collapse; min-width: 300px; }
  .totals td { padding: 5px 8px; }
  .totals tr.total td { border-top: 2px solid #111; font-weight: 700; font-size: 15px; }
  .totals tr.balance td { background: #f0fdfa; font-weight: 700; font-size: 16px; }
  .block { margin-bottom: 16px; }
  .block p { margin: 0; white-space: normal; }
  .foot { border-top: 1px solid #ddd; padding-top: 10px; margin-top: 24px; font-size: 11px; color: #666; text-align: center; }
  @media print { body { padding: 0; } }
  @media (max-width: 560px) { .head, .parties { flex-direction: column; } .meta { text-align: left; } .meta table { margin-left: 0; } .meta td:first-child { text-align: left; padding-left: 0; } .due { text-align: left; } }
</style></head><body>
<div class="inv">
  <div class="head">
    <div class="from">${logo ? `<img src="${logo}" alt="">` : ''}<strong>${e(doc.fromName.trim()) || 'Your business name'}</strong>${doc.fromDetails.trim() ? `<div class="muted">${multiline(doc.fromDetails)}</div>` : ''}</div>
    <div class="meta"><h1>Invoice</h1><table>
      <tr><td>Invoice no.</td><td><strong>${e(number)}</strong></td></tr>
      ${doc.issueDate ? `<tr><td>Date</td><td>${e(formatDate(doc.issueDate))}</td></tr>` : ''}
      ${termsLabel && doc.terms !== 'custom' ? `<tr><td>Terms</td><td>${e(termsLabel)}</td></tr>` : ''}
      ${due ? `<tr><td>Due</td><td><strong>${e(formatDate(due))}</strong></td></tr>` : ''}
    </table></div>
  </div>
  <div class="parties">
    <div class="to"><div class="label">Bill to</div><strong>${e(doc.toName.trim()) || 'Client name'}</strong>${doc.toDetails.trim() ? `<div class="muted">${multiline(doc.toDetails)}</div>` : ''}</div>
    <div class="due"><div class="label">${t.amountPaid > 0 ? 'Balance due' : 'Amount due'}</div><strong>${m(t.balanceDue)}</strong>${due ? `<div class="muted">by ${e(formatDate(due))}</div>` : ''}</div>
  </div>
  <table class="items"><thead><tr><th>Description</th><th class="num">Qty</th><th class="num">Unit price</th><th class="num">Amount</th></tr></thead><tbody>
    ${rows || '<tr><td colspan="4" class="muted">No line items yet</td></tr>'}
  </tbody></table>
  <div class="totals"><table>
    ${line('Subtotal', m(t.subtotal))}
    ${t.discount > 0 ? line(`Discount${doc.discountType === 'percent' ? ` (${Number(t.discountPct.toFixed(2))}%)` : ''}`, `−${m(t.discount)}`) : ''}
    ${t.tax > 0 && !doc.pricesIncludeTax ? line(taxText, m(t.tax)) : ''}
    ${t.shipping > 0 ? line('Shipping', m(t.shipping)) : ''}
    ${line('Total', m(t.total), 'total')}
    ${t.tax > 0 && doc.pricesIncludeTax ? line(`Includes ${taxText}`, m(t.tax), 'muted') : ''}
    ${t.amountPaid > 0 ? line('Paid', `−${m(t.amountPaid)}`) + line('Balance due', m(t.balanceDue), 'balance') : ''}
  </table></div>
  ${doc.paymentInstructions.trim() ? `<div class="block"><div class="label">Payment</div><p>${multiline(doc.paymentInstructions)}</p></div>` : ''}
  ${doc.notes.trim() ? `<div class="block"><div class="label">Notes</div><p>${multiline(doc.notes)}</p></div>` : ''}
  <div class="foot">Thank you for your business.</div>
</div>
</body></html>`;
}

export const INVOICE_EXAMPLE: Omit<InvoiceDocument, 'issueDate' | 'customDueDate' | 'logoDataUrl'> = {
  fromName: 'Northside Design Studio LLC',
  fromDetails: '418 Alder Street, Suite 2\nAustin, TX 78701\nbilling@northside.example\nEIN 00-0000000',
  toName: 'Harbor Coffee Roasters',
  toDetails: 'Attn: Accounts Payable\n77 Mill Road\nRound Rock, TX 78664',
  invoiceNumber: 'INV-0042',
  terms: 'net30',
  currency: 'USD',
  taxLabel: 'Sales tax',
  lines: [
    { description: 'Brand identity design (fixed fee)', quantity: 1, unitPrice: 2400, taxable: false },
    { description: 'Website design and build, hours', quantity: 32, unitPrice: 95, taxable: false },
    { description: 'Printed menu boards', quantity: 4, unitPrice: 85, taxable: true },
  ],
  discountType: 'percent',
  discountValue: 5,
  taxPct: 8.25,
  pricesIncludeTax: false,
  shipping: 25,
  amountPaid: 1500,
  notes: 'Final files are delivered on receipt of the balance.',
  paymentInstructions: 'Pay by bank transfer or check payable to Northside Design Studio LLC.\nA late fee of 1.5% per month applies to balances more than 30 days overdue.',
};
