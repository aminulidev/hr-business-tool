import type { CalculatorSeoData } from './types';
import { SRC } from './sources';
// ---------------------------------------------------------------------------
// Invoice Generator — Phase 17. The article's figures come from the same
// computeInvoice() the form runs, applied to the built-in example invoice.
// ---------------------------------------------------------------------------
import { addDays, computeInvoice, dueDateFor, formatDate, INVOICE_EXAMPLE, money, nextInvoiceNumber, PAYMENT_TERMS } from '@/lib/pricing/invoice';

const usd = (n: number) => money(n, 'USD');
const pct = (n: number, d = 2) => `${Number(n.toFixed(d))}%`;

const ex = INVOICE_EXAMPLE;
const issue = '2026-11-02';
const t = computeInvoice(ex);
const due = dueDateFor(issue, ex.terms, '');
const taxableLine = t.lines.find((l) => l.taxable)!;
const noDiscount = computeInvoice({ ...ex, discountValue: 0 });
const fixed = computeInvoice({ ...ex, discountType: 'fixed', discountValue: 250 });
const vatInput = { lines: [{ description: 'Consulting', quantity: 1, unitPrice: 1200, taxable: true }], discountType: 'percent' as const, discountValue: 0, taxPct: 20, shipping: 0, amountPaid: 0 };
const vatIncl = computeInvoice({ ...vatInput, pricesIncludeTax: true });
const vatExcl = computeInvoice({ ...vatInput, pricesIncludeTax: false });
const termRows = PAYMENT_TERMS.filter((x) => x.days !== null).map((x) => ({ label: x.label, days: x.days as number, due: dueDateFor(issue, x.value, '') }));

const seoData = {
  howToSteps: [
    'Enter your business name and details under "From" and your client under "Bill to". Add a logo if you have one; it stays in your browser like everything else.',
    'Set the invoice number, date, payment terms and currency. The due date is worked out from the terms (Net 30 is 30 days after the invoice date), or choose a custom date.',
    'Add a line for each service or product with a quantity and unit price, and untick "Taxed" on any line that tax does not apply to.',
    'Enter a discount (percent or fixed), the tax rate and its name (sales tax, VAT, GST), shipping, and any deposit already paid. If your prices already include tax, switch that on and the tax is shown as included rather than added.',
    'Add payment instructions and notes, check the live preview, then choose "Print / Save as PDF" and pick "Save as PDF" in the print dialog, or download the invoice as a file. "Next invoice" saves this one to your history and moves the number on.',
  ],

  formula:
    'Line amount = Quantity × Unit price · Subtotal = Σ line amounts · Discount = Subtotal × Discount % (or a fixed amount)\nTax (added) = Taxable lines after discount × Tax rate · Tax (included in prices) = Taxable amount − Taxable amount ÷ (1 + Tax rate)\nTotal = Subtotal − Discount + Tax + Shipping · Balance due = Total − Amount paid · Due date = Invoice date + Net days',

  formulaDescription:
    'An invoice is arithmetic in a fixed order: line amounts add up to a subtotal, the discount comes off, tax is charged on what is left of the taxable lines, shipping is added, and any deposit is deducted to leave the balance due. The order matters. Applying the discount before tax means the client is taxed on what they actually pay; and when only some lines are taxable, the discount has to be spread across the lines in proportion so that tax is charged on the discounted taxable part and nothing else. ' +
    'Where prices are quoted including tax, as is usual for VAT and GST, the tax is not added but extracted: it is the part of the price that is tax, the price minus the price divided by one plus the rate.',

  benchmarkTables: [
    {
      title: `The Example Invoice, Line by Line (${ex.invoiceNumber})`,
      headers: ['Line', 'Basis', 'Amount'],
      rows: [
        ...t.lines.map((l) => [l.description, `${l.quantity} × ${usd(l.unitPrice)}${l.taxable ? ' (taxed)' : ''}`, usd(l.amount)]),
        ['Subtotal', '', usd(t.subtotal)],
        ['Discount', `${pct(ex.discountValue)} of ${usd(t.subtotal)}`, `−${usd(t.discount)}`],
        [ex.taxLabel, `${pct(ex.taxPct)} of ${usd(t.taxableBase)} (the taxed line after discount)`, usd(t.tax)],
        ['Shipping', 'Added after tax', usd(t.shipping)],
        ['Total', '', usd(t.total)],
        ['Paid', 'Deposit', `−${usd(t.amountPaid)}`],
        ['Balance due', `${formatDate(due)} (Net 30 from ${formatDate(issue)})`, usd(t.balanceDue)],
      ],
      note: `Only the ${usd(taxableLine.amount)} line is taxed. The ${pct(ex.discountValue)} discount applies to every line, so the taxed amount is ${usd(t.taxableBase)}, not ${usd(taxableLine.amount)}. The ${pct(ex.taxPct)} rate is illustrative; use the rate for where your goods or services are delivered.`,
    },
    {
      title: `Payment Terms and the Due Date They Produce (invoice dated ${formatDate(issue)})`,
      headers: ['Terms', 'Meaning', 'Due date'],
      rows: [
        ...termRows.map((x) => [x.label, x.days === 0 ? 'Payable when the invoice is received' : `Payable within ${x.days} days of the invoice date`, formatDate(x.due)]),
        ['2/10 Net 30', '2% off if paid within 10 days, otherwise the full amount in 30', `${formatDate(dueDateFor(issue, 'net30', ''))} (discount until ${formatDate(addDays(issue, 10))})`],
      ],
      note: 'Days are calendar days counted from the invoice date unless the contract says otherwise. Shorter terms are normal for small invoices and new clients; Net 30 is the most common default in the US. State the terms and the resulting date on the invoice so there is nothing to work out.',
    },
    {
      title: 'Tax Added to the Price vs. Tax Included in It (20% rate)',
      headers: ['How the price is quoted', 'Price entered', 'Net of tax', 'Tax', 'Client pays'],
      rows: [
        ['Tax added on top (US sales tax style)', usd(1200), usd(vatExcl.netOfTax), usd(vatExcl.tax), usd(vatExcl.total)],
        ['Tax included in the price (VAT / GST style)', usd(1200), usd(vatIncl.netOfTax), usd(vatIncl.tax), usd(vatIncl.total)],
      ],
      note: `Extracting tax from an inclusive price is price − price ÷ (1 + rate): ${usd(1200)} − ${usd(1200)} ÷ 1.20 = ${usd(vatIncl.tax)}. Taking 20% of the inclusive price (${usd(240)}) overstates it.`,
    },
  ],

  deepDiveSections: [
    {
      title: 'What an Invoice Needs to Contain',
      paragraphs: [
        'There is no single legal template for an invoice in the United States, but a usable one answers five questions without a phone call: who is billing, who is being billed, for what, how much, and when and how to pay. That means your business name and contact details, the client\'s name and billing address, a unique invoice number and date, a description of each service or product with quantity, unit price and amount, the subtotal, any discount, tax and total, and the payment terms with a due date and payment instructions. Clients with purchasing systems often also need a purchase order number, which goes in the bill-to details. In VAT and GST countries a tax invoice has specific required contents, usually including both parties\' tax registration numbers and the tax rate and amount, so check the rules of the country you are registered in.',
        `Number invoices in an unbroken sequence and never reuse a number; it is how you and your client both find the document later, and gaps or duplicates make the books hard to reconcile. The generator's "Next invoice" button moves the number on for you (${ex.invoiceNumber} becomes ${nextInvoiceNumber(ex.invoiceNumber)}) and saves the finished invoice to your browser history. Keep a copy of every invoice you issue: the IRS lists invoices among the supporting documents for the income on your return and expects records to be kept for as long as they may be needed, generally at least three years.`,
      ],
    },
    {
      title: 'Discount First, Then Tax, Then Deposit',
      paragraphs: [
        `The example invoice has three lines totaling ${usd(t.subtotal)}: two for services and one for ${usd(taxableLine.amount)} of printed goods, the only taxed line. A ${pct(ex.discountValue)} discount takes ${usd(t.discount)} off the subtotal. Because the discount applies to the whole invoice, the taxed line is reduced by ${pct(ex.discountValue)} as well, so tax is charged on ${usd(t.taxableBase)}: ${usd(t.tax)} at ${pct(ex.taxPct)}. Taxing the undiscounted line would have charged ${usd(noDiscount.tax)}, a small overcharge that is nonetheless tax collected on money the client never paid. Shipping of ${usd(t.shipping)} is added after tax, giving ${usd(t.total)}; the ${usd(t.amountPaid)} deposit leaves a balance of ${usd(t.balanceDue)}.`,
        `A fixed discount works the same way: ${usd(250)} off the same invoice is ${pct(fixed.discountPct)} of the subtotal, so the taxed amount becomes ${usd(fixed.taxableBase)} and the tax ${usd(fixed.tax)}. Whether a given line is taxable is a matter for your state: nearly every state with a sales tax applies it to goods, most services are not taxed in most states, and a number of states tax particular services. Five states have no statewide sales tax at all. Rates also vary by city and county and usually depend on where the customer receives the goods, so confirm with your state revenue department rather than assuming.`,
      ],
    },
    {
      title: 'Payment Terms, Deposits and Late Fees',
      paragraphs: [
        `Terms are the part of an invoice most likely to be vague and most worth getting exact. "Net 30" means the full amount is due 30 days after the invoice date: an invoice dated ${formatDate(issue)} is due ${formatDate(due)}. Print the date as well as the terms, because "30 days" invites a debate about when the clock started. For new clients, small jobs or anything delivered immediately, "Due on receipt" or Net 7 to Net 15 is reasonable; large companies frequently insist on Net 45 or Net 60, which is worth pricing in.`,
        'A deposit shifts the risk before work starts. Show it on the final invoice as an amount already paid, so the client sees the full value of the work and the balance separately, which is what the "Already paid" field does. If you charge interest or a fee on late payments, it should be in the contract the client agreed to and repeated in the payment instructions on every invoice; a late fee that first appears on the invoice is hard to enforce, and some states cap what can be charged. Put the practical details in the same place: who to make a check payable to, bank details for a transfer, or a payment link.',
      ],
    },
    {
      title: 'How the PDF Is Made, and Where Your Data Goes',
      paragraphs: [
        'The invoice is assembled in your browser as you type. Nothing is sent to a server: there is no account, no upload, and the logo you add is read straight from your device into the page. "Print / Save as PDF" opens your browser\'s print dialog on the invoice alone; choosing "Save as PDF" (or "Microsoft Print to PDF") as the destination produces the file, at the paper size your printer settings use. "Download HTML" saves the same invoice as a single self-contained file you can open in any browser or attach to an email.',
        'Saved invoices live in your browser\'s local storage on this device, up to fifteen at a time, so they are private but not backed up: clearing your browser data removes them, and they will not appear on another computer. Treat the history as a convenience for repeating and renumbering invoices, and keep the PDFs themselves with your business records.',
      ],
    },
  ],

  workedExamples: [
    { title: `Three Lines, ${pct(ex.discountValue)} Discount, One Taxed Line`, description: `${t.lines.map((l) => `${l.quantity} × ${usd(l.unitPrice)} = ${usd(l.amount)}`).join('; ')}. Subtotal ${usd(t.subtotal)}; discount ${pct(ex.discountValue)} = ${usd(t.discount)}; tax ${pct(ex.taxPct)} × ${usd(t.taxableBase)} = ${usd(t.tax)}; shipping ${usd(t.shipping)}; total ${usd(t.total)}; less ${usd(t.amountPaid)} deposit = ${usd(t.balanceDue)} due ${formatDate(due)}.` },
    { title: 'Fixed Discount of $250', description: `${usd(250)} is ${pct(fixed.discountPct)} of ${usd(t.subtotal)}. Taxed amount ${usd(taxableLine.amount)} × ${(1 - fixed.discount / fixed.subtotal).toFixed(4)} = ${usd(fixed.taxableBase)}; tax ${usd(fixed.tax)}; total ${usd(fixed.total)}.` },
    { title: 'VAT-Inclusive Price of $1,200 at 20%', description: `Net ${usd(1200)} ÷ 1.20 = ${usd(vatIncl.netOfTax)}; VAT ${usd(vatIncl.tax)}; the client pays ${usd(vatIncl.total)}. The same ${usd(1200)} quoted before tax would cost ${usd(vatExcl.total)}.` },
    { title: 'Due Dates From Terms', description: `Invoice dated ${formatDate(issue)}: ${termRows.filter((x) => x.days > 0).map((x) => `${x.label} → ${formatDate(x.due)}`).join('; ')}.` },
  ],

  faqs: [
    { question: 'Is this invoice generator free, and do I need an account?', answer: 'It is free and there is no account. The invoice is built in your browser; nothing you type, and no logo you add, is uploaded to a server.' },
    { question: 'How do I save the invoice as a PDF?', answer: 'Click "Print / Save as PDF", then in the print dialog choose "Save as PDF" (Chrome, Edge, Safari) or "Microsoft Print to PDF" as the printer or destination. Only the invoice is printed, not the rest of the page. You can also download it as a single HTML file.' },
    { question: 'What should an invoice include?', answer: 'Your business name and contact details, the client\'s name and billing address, a unique invoice number, the invoice date, a description of each item with quantity, unit price and amount, the subtotal, any discount, tax and total, the payment terms and due date, and how to pay. Add a purchase order number if the client uses them, and tax registration numbers where VAT or GST rules require them.' },
    { question: 'How do I calculate tax on an invoice with a discount?', answer: `Take the discount off first, then apply the tax rate to what remains of the taxable lines. In the example a ${pct(ex.discountValue)} discount reduces the ${usd(taxableLine.amount)} taxed line to ${usd(t.taxableBase)}, so tax at ${pct(ex.taxPct)} is ${usd(t.tax)} rather than ${usd(noDiscount.tax)}.` },
    { question: 'Do I charge sales tax on services?', answer: 'It depends on the state and the service. Most services are not taxed in most states, several states tax specific services, and goods are taxed in nearly every state that has a sales tax. Rates and rules are set by state and local governments, so check with the revenue department of the state where your customer receives the work. Use the "Taxed" box to tax only the lines that need it.' },
    { question: 'What does Net 30 mean on an invoice?', answer: `Payment of the full amount is due 30 calendar days after the invoice date. An invoice dated ${formatDate(issue)} on Net 30 terms is due ${formatDate(due)}. Net 15, Net 45 and Net 60 work the same way, and "Due on receipt" means payment is expected as soon as the invoice arrives.` },
    { question: 'How do I show a deposit on an invoice?', answer: `Invoice the full value of the work and enter the deposit under "Already paid". The invoice then shows the total, the amount paid and the balance due: ${usd(t.total)} less ${usd(t.amountPaid)} leaves ${usd(t.balanceDue)} in the example.` },
    { question: 'How do I invoice with VAT or GST included in the price?', answer: `Switch on "Unit prices already include tax". The tax is then extracted from the price instead of added: at 20%, a ${usd(1200)} inclusive price contains ${usd(vatIncl.tax)} of tax and ${usd(vatIncl.netOfTax)} net. The invoice total stays ${usd(vatIncl.total)} and the tax is shown as included.` },
    { question: 'How should I number invoices?', answer: `Sequentially, with no gaps or repeats. A prefix and padded number such as ${ex.invoiceNumber} sorts correctly and leaves room to grow; some businesses include the year. "Next invoice" increases the trailing number for you and keeps its padding.` },
    { question: 'Where are my saved invoices stored?', answer: 'In your browser\'s local storage on the device you are using, up to fifteen at a time. They are not sent anywhere, which also means they are not backed up: clearing browser data deletes them, so keep the PDF of every invoice you send.' },
    { question: 'Where did the invoice calculator go?', answer: 'This page replaces it. The totals the calculator produced (subtotal, discount, tax and amount due) are shown above the invoice preview, and the same figures now go straight onto a printable invoice.' },
  ],

  sources: [SRC.irsPub583, SRC.ftaStateAgencies],

  relatedTools: [
    { slug: 'sales-tax-calculator', title: 'Sales Tax Calculator', description: 'Tax on a price, and the price before tax', icon: 'Receipt' },
    { slug: 'freelance-pricing-calculator', title: 'Freelance Pricing Calculator', description: 'Build the quote behind the invoice', icon: 'Briefcase' },
    { slug: 'billable-hours-calculator', title: 'Billable Hours Calculator', description: 'Hours and rate for the line items', icon: 'Clock' },
    { slug: 'discount-calculator', title: 'Discount Calculator', description: 'Percent and fixed discounts', icon: 'Tag' },
    { slug: 'vat-calculator', title: 'VAT & GST Calculator', description: 'Rates by country for a VAT or GST invoice', icon: 'Percent' },
    { slug: 'cash-flow-forecast-calculator', title: 'Cash Flow Forecast Calculator', description: 'When those invoices turn into cash', icon: 'Wallet' },
  ],
} satisfies CalculatorSeoData;
export default seoData;
