'use client';

import { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Download, FilePlus2, ImagePlus, Info, Lock, Plus, Printer, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import TryExample from './TryExample';
import CalcHistoryPanel from './CalcHistoryPanel';
import { useCalcHistory } from '@/hooks/useCalcHistory';
import { Kpi, num } from './suite-ui';
import {
  buildInvoiceHtml,
  computeInvoice,
  CURRENCIES,
  dueDateFor,
  formatDate,
  INVOICE_EXAMPLE,
  money,
  nextInvoiceNumber,
  PAYMENT_TERMS,
  TAX_LABELS,
  toIso,
  type DiscountType,
  type InvoiceDocument,
} from '@/lib/pricing/invoice';

/**
 * Invoice generator (Phase 17). The form, the live preview and the printed
 * page all come from lib/pricing/invoice.ts. Everything stays in the browser:
 * the invoice is rendered into a sandboxed iframe and "Print / Save as PDF"
 * uses the browser's own print dialog, so there is no upload and no PDF
 * library. The former invoice-calculator draft 301s here.
 */

type LineState = { id: number; description: string; quantity: string; unitPrice: string; taxable: boolean };
interface FormState {
  fromName: string;
  fromDetails: string;
  toName: string;
  toDetails: string;
  invoiceNumber: string;
  /** null = today, resolved on the client */
  issueDate: string | null;
  terms: string;
  customDueDate: string;
  currency: string;
  taxLabel: string;
  lines: LineState[];
  discountType: DiscountType;
  discountValue: string;
  taxPct: string;
  pricesIncludeTax: boolean;
  shipping: string;
  amountPaid: string;
  notes: string;
  paymentInstructions: string;
}

let nextId = 100;
const blankLine = (): LineState => ({ id: nextId++, description: '', quantity: '1', unitPrice: '', taxable: true });
const EMPTY: FormState = {
  fromName: '', fromDetails: '', toName: '', toDetails: '', invoiceNumber: 'INV-0001', issueDate: null, terms: 'net30', customDueDate: '', currency: 'USD', taxLabel: 'Sales tax',
  lines: [{ id: 1, description: '', quantity: '1', unitPrice: '', taxable: true }],
  discountType: 'percent', discountValue: '0', taxPct: '0', pricesIncludeTax: false, shipping: '0', amountPaid: '0', notes: '', paymentInstructions: '',
};
const exampleState = (): FormState => ({
  ...EMPTY,
  ...INVOICE_EXAMPLE,
  issueDate: null,
  customDueDate: '',
  lines: INVOICE_EXAMPLE.lines.map((l) => ({ id: nextId++, description: l.description, quantity: String(l.quantity), unitPrice: String(l.unitPrice), taxable: l.taxable })),
  discountValue: String(INVOICE_EXAMPLE.discountValue),
  taxPct: String(INVOICE_EXAMPLE.taxPct),
  shipping: String(INVOICE_EXAMPLE.shipping),
  amountPaid: String(INVOICE_EXAMPLE.amountPaid),
});

// Today's date and "are we in the browser" without an effect: the server snapshot is empty, so the
// statically generated HTML carries no build-time date and hydration never mismatches.
const noopSubscribe = () => () => {};
const todaySnapshot = () => toIso(new Date());
const useToday = () => useSyncExternalStore(noopSubscribe, todaySnapshot, () => '');

const selectCls = 'h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
const MAX_LOGO_BYTES = 300 * 1024;

function toDocument(f: FormState, today: string, logo: string): InvoiceDocument {
  return {
    fromName: f.fromName, fromDetails: f.fromDetails, toName: f.toName, toDetails: f.toDetails, invoiceNumber: f.invoiceNumber,
    issueDate: f.issueDate ?? today, terms: f.terms, customDueDate: f.customDueDate, currency: f.currency, taxLabel: f.taxLabel,
    lines: f.lines.map((l) => ({ description: l.description, quantity: num(l.quantity), unitPrice: num(l.unitPrice), taxable: l.taxable })),
    discountType: f.discountType, discountValue: num(f.discountValue), taxPct: num(f.taxPct), pricesIncludeTax: f.pricesIncludeTax,
    shipping: num(f.shipping), amountPaid: num(f.amountPaid), notes: f.notes, paymentInstructions: f.paymentInstructions, logoDataUrl: logo || undefined,
  };
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <fieldset className="rounded-xl border border-border/50 bg-muted/20 p-3 space-y-3">
    <legend className="px-1 text-xs font-semibold">{title}</legend>
    {children}
  </fieldset>
);
const Txt = ({ id, label, value, onChange, placeholder, type = 'text' }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
    <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={120} className="text-sm" />
  </div>
);
const Money = ({ id, label, value, onChange, suffix, help }: { id: string; label: string; value: string; onChange: (v: string) => void; suffix?: string; help?: string }) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
    <div className="relative">
      <Input id={id} type="number" inputMode="decimal" min="0" step="any" value={value} onChange={(e) => onChange(e.target.value)} className={`text-sm ${suffix ? 'pr-8' : ''}`} />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}
    </div>
    {help && <p className="text-xs text-muted-foreground">{help}</p>}
  </div>
);

export default function InvoiceGenerator() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [logo, setLogo] = useState('');
  const [logoError, setLogoError] = useState('');
  const today = useToday();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { history, saveEntry, clearHistory, deleteEntry } = useCalcHistory<Record<string, string>>('invoice-generator');

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((p) => ({ ...p, [key]: value }));
  const setLine = (id: number, patch: Partial<LineState>) => setForm((p) => ({ ...p, lines: p.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));

  const doc = useMemo(() => toDocument(form, today, logo), [form, today, logo]);
  const totals = useMemo(() => computeInvoice(doc), [doc]);
  const html = useMemo(() => buildInvoiceHtml(doc), [doc]);
  const due = dueDateFor(doc.issueDate, doc.terms, doc.customDueDate);
  const m = (n: number) => money(n, form.currency);
  const hasContent = totals.lines.length > 0 && totals.subtotal > 0;
  const fileName = `invoice-${(form.invoiceNumber.trim() || 'draft').replace(/[^A-Za-z0-9_-]+/g, '-')}`;

  const print = () => {
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    win.focus();
    win.print();
  };
  const download = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const save = () => saveEntry({ data: JSON.stringify(form) }, `${form.invoiceNumber.trim() || 'Draft'} · ${form.toName.trim() || 'no client'} · ${m(totals.balanceDue)} due`);
  const startNext = () => {
    if (hasContent) save();
    setForm((p) => ({ ...p, invoiceNumber: nextInvoiceNumber(p.invoiceNumber), issueDate: null, customDueDate: '', toName: '', toDetails: '', lines: [blankLine()], discountValue: '0', shipping: '0', amountPaid: '0', notes: '' }));
  };
  const restore = (i: Record<string, string>) => {
    try {
      const p = JSON.parse(i.data) as Partial<FormState>;
      if (p && typeof p === 'object' && Array.isArray(p.lines)) setForm({ ...EMPTY, ...p, lines: p.lines.map((l) => ({ ...l, id: nextId++ })) });
    } catch {}
  };
  const onLogo = (file: File | undefined) => {
    setLogoError('');
    if (!file) return;
    if (!/^image\/(png|jpeg|gif|webp)$/.test(file.type)) return setLogoError('Use a PNG, JPG, GIF or WebP image.');
    if (file.size > MAX_LOGO_BYTES) return setLogoError('Keep the logo under 300 KB.');
    const reader = new FileReader();
    reader.onload = () => setLogo(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 space-y-5 calculator-form">
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-muted-foreground flex items-start gap-2">
          <Lock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>Fill in the form and the invoice below updates as you type. Nothing is uploaded: the invoice is built in your browser, and &quot;Print / Save as PDF&quot; uses your browser&apos;s own print dialog.</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Section title="From (your business)">
            <Txt id="inv-from" label="Business or your name" value={form.fromName} onChange={(x) => set('fromName', x)} placeholder="Your business name" />
            <div className="space-y-1.5">
              <Label htmlFor="inv-from-details" className="text-xs text-muted-foreground">Address, email, phone, tax ID (one per line)</Label>
              <Textarea id="inv-from-details" rows={4} value={form.fromDetails} onChange={(e) => set('fromDetails', e.target.value)} maxLength={600} className="text-sm" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={(e) => { onLogo(e.target.files?.[0]); e.target.value = ''; }} />
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}><ImagePlus className="h-4 w-4 mr-1.5" /> {logo ? 'Replace logo' : 'Add logo'}</Button>
              {logo && <Button type="button" variant="ghost" size="sm" onClick={() => setLogo('')}><X className="h-4 w-4 mr-1" /> Remove</Button>}
              {logoError && <span className="text-xs text-red-500">{logoError}</span>}
            </div>
          </Section>
          <Section title="Bill to (your client)">
            <Txt id="inv-to" label="Client name" value={form.toName} onChange={(x) => set('toName', x)} placeholder="Client or company" />
            <div className="space-y-1.5">
              <Label htmlFor="inv-to-details" className="text-xs text-muted-foreground">Contact, address, PO number (one per line)</Label>
              <Textarea id="inv-to-details" rows={4} value={form.toDetails} onChange={(e) => set('toDetails', e.target.value)} maxLength={600} className="text-sm" />
            </div>
          </Section>
        </div>

        <Section title="Invoice details">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Txt id="inv-number" label="Invoice number" value={form.invoiceNumber} onChange={(x) => set('invoiceNumber', x)} />
            <Txt id="inv-date" label="Invoice date" type="date" value={form.issueDate ?? today} onChange={(x) => set('issueDate', x)} />
            <div className="space-y-1.5">
              <Label htmlFor="inv-terms" className="text-xs text-muted-foreground">Payment terms</Label>
              <select id="inv-terms" value={form.terms} onChange={(e) => set('terms', e.target.value)} className={selectCls}>{PAYMENT_TERMS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select>
            </div>
            {form.terms === 'custom'
              ? <Txt id="inv-due" label="Due date" type="date" value={form.customDueDate} onChange={(x) => set('customDueDate', x)} />
              : <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Due date</Label><p className="h-9 flex items-center text-sm font-medium">{due ? formatDate(due) : '—'}</p></div>}
            <div className="space-y-1.5">
              <Label htmlFor="inv-currency" className="text-xs text-muted-foreground">Currency</Label>
              <select id="inv-currency" value={form.currency} onChange={(e) => set('currency', e.target.value)} className={selectCls}>{CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
            </div>
          </div>
        </Section>

        <Section title="Line items">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-muted-foreground"><th className="text-left py-1 pr-2 font-medium">Description</th><th className="text-left py-1 px-2 font-medium">Qty</th><th className="text-left py-1 px-2 font-medium">Unit price</th><th className="text-left py-1 px-2 font-medium">Taxed</th><th className="text-right py-1 px-2 font-medium">Amount</th><th /></tr></thead>
              <tbody>
                {form.lines.map((l, i) => (
                  <tr key={l.id}>
                    <td className="py-1 pr-2"><Input aria-label={`Item ${i + 1} description`} value={l.description} onChange={(e) => setLine(l.id, { description: e.target.value })} className="text-sm min-w-[12rem]" placeholder="Service or product" maxLength={200} /></td>
                    <td className="py-1 px-2"><Input aria-label={`Item ${i + 1} quantity`} type="number" min="0" step="any" value={l.quantity} onChange={(e) => setLine(l.id, { quantity: e.target.value })} className="text-sm w-20" /></td>
                    <td className="py-1 px-2"><Input aria-label={`Item ${i + 1} unit price`} type="number" min="0" step="any" value={l.unitPrice} onChange={(e) => setLine(l.id, { unitPrice: e.target.value })} className="text-sm w-28" placeholder="0.00" /></td>
                    <td className="py-1 px-2"><input aria-label={`Item ${i + 1} taxed`} type="checkbox" checked={l.taxable} onChange={(e) => setLine(l.id, { taxable: e.target.checked })} className="h-4 w-4 accent-emerald-600" /></td>
                    <td className="py-1 px-2 text-right font-medium whitespace-nowrap">{m(num(l.quantity) * num(l.unitPrice))}</td>
                    <td className="py-1 pl-1"><Button type="button" variant="ghost" size="icon" aria-label="Remove item" onClick={() => setForm((p) => ({ ...p, lines: p.lines.length > 1 ? p.lines.filter((x) => x.id !== l.id) : p.lines }))}><Trash2 className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button type="button" variant="outline" size="sm" disabled={form.lines.length >= 40} onClick={() => setForm((p) => ({ ...p, lines: [...p.lines, blankLine()] }))}><Plus className="h-4 w-4 mr-1" /> Add item</Button>
        </Section>

        <Section title="Discount, tax and payments">
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="inv-disc-type" className="text-xs text-muted-foreground">Discount type</Label>
              <select id="inv-disc-type" value={form.discountType} onChange={(e) => set('discountType', e.target.value === 'fixed' ? 'fixed' : 'percent')} className={selectCls}><option value="percent">Percent</option><option value="fixed">Fixed amount</option></select>
            </div>
            <Money id="inv-disc" label="Discount" value={form.discountValue} onChange={(x) => set('discountValue', x)} suffix={form.discountType === 'percent' ? '%' : undefined} />
            <div className="space-y-1.5">
              <Label htmlFor="inv-tax-label" className="text-xs text-muted-foreground">Tax name</Label>
              <select id="inv-tax-label" value={form.taxLabel} onChange={(e) => set('taxLabel', e.target.value)} className={selectCls}>{TAX_LABELS.map((t) => <option key={t} value={t}>{t}</option>)}</select>
            </div>
            <Money id="inv-tax" label="Tax rate" value={form.taxPct} onChange={(x) => set('taxPct', x)} suffix="%" />
            <Money id="inv-ship" label="Shipping" value={form.shipping} onChange={(x) => set('shipping', x)} />
            <Money id="inv-paid" label="Already paid" value={form.amountPaid} onChange={(x) => set('amountPaid', x)} help="Deposit or part payment" />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="inv-inclusive" checked={form.pricesIncludeTax} onCheckedChange={(x) => set('pricesIncludeTax', x)} />
            <Label htmlFor="inv-inclusive" className="text-xs">Unit prices already include tax (usual for VAT and GST pricing); the tax is shown as included instead of added</Label>
          </div>
        </Section>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="inv-pay" className="text-xs text-muted-foreground">Payment instructions (bank details, payment link, late fee)</Label>
            <Textarea id="inv-pay" rows={3} value={form.paymentInstructions} onChange={(e) => set('paymentInstructions', e.target.value)} maxLength={800} className="text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inv-notes" className="text-xs text-muted-foreground">Notes to the client</Label>
            <Textarea id="inv-notes" rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} maxLength={800} className="text-sm" />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <TryExample onClick={() => { setForm(exampleState()); setLogo(''); }} />
            <Button type="button" variant="ghost" size="sm" onClick={() => { setForm({ ...EMPTY, lines: [blankLine()] }); setLogo(''); }}>Clear form</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={save} disabled={!hasContent}>Save to history</Button>
            <Button type="button" variant="outline" size="sm" onClick={startNext}><FilePlus2 className="h-4 w-4 mr-1.5" /> Next invoice</Button>
          </div>
        </div>

        <div className="result-display rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5 space-y-4" aria-live="polite">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Kpi label="Subtotal" value={m(totals.subtotal)} />
            <Kpi label="Discount" value={totals.discount > 0 ? `−${m(totals.discount)}` : m(0)} sub={totals.discount > 0 ? `${totals.discountPct.toFixed(1)}%` : undefined} />
            <Kpi label={form.pricesIncludeTax ? `${form.taxLabel} included` : form.taxLabel} value={m(totals.tax)} sub={`on ${m(totals.taxableBase)}`} />
            <Kpi label="Total" value={m(totals.total)} />
            <div className="rounded-xl bg-background border border-emerald-500/40 p-3 text-center col-span-2 sm:col-span-1">
              <p className="text-xs text-muted-foreground mb-1">{totals.amountPaid > 0 ? 'Balance due' : 'Amount due'}</p>
              <p className="text-xl font-extrabold text-emerald-600" data-result-primary>{m(totals.balanceDue)}</p>
              {due && <p className="text-[11px] text-muted-foreground">by {formatDate(due)}</p>}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground flex items-start gap-1.5"><Info className="h-3.5 w-3.5 mt-0.5 shrink-0" /> To get a PDF, choose &quot;Save as PDF&quot; as the printer in the print dialog.</p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={download} disabled={!today}><Download className="h-4 w-4 mr-1.5" /> Download HTML</Button>
              <Button type="button" size="sm" onClick={print} disabled={!today} className="bg-emerald-600 hover:bg-emerald-700 text-white"><Printer className="h-4 w-4 mr-1.5" /> Print / Save as PDF</Button>
            </div>
          </div>

          {today ? (
            <iframe ref={frameRef} title="Invoice preview" sandbox="allow-same-origin allow-modals" srcDoc={html} className="w-full rounded-lg border border-border/60 bg-white" style={{ height: 'min(85vh, 1000px)' }} />
          ) : (
            <div className="w-full rounded-lg border border-border/60 bg-background animate-pulse" style={{ height: 480 }} />
          )}
        </div>
      </div>
      <CalcHistoryPanel history={history} onRestore={restore} onClear={clearHistory} onDelete={deleteEntry} />
    </div>
  );
}
