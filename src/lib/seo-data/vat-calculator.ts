import type { CalculatorSeoData } from './types';
import { SRC } from './sources';
// ---------------------------------------------------------------------------
// VAT & GST Calculator — Phase 17: add or remove tax with country presets, and
// a simple VAT/GST return. The rate tables and every worked figure are
// generated from lib/pricing/vat.ts, so the article and the calculator cannot
// disagree.
// ---------------------------------------------------------------------------
import { componentsFor, computeReturn, computeTax, findCountry, formatMoney, RETURN_DEFAULTS, TAX_COUNTRIES, totalRate, vatFraction } from '@/lib/pricing/vat';

const gbp = (n: number) => formatMoney(n, 'GBP');
const cad = (n: number) => formatMoney(n, 'CAD');
const aud = (n: number) => formatMoney(n, 'AUD');
const rate = (r: number) => `${Number(r.toFixed(3))}%`;
const list = (rs: number[]) => (rs.length ? rs.map(rate).join(' / ') : '—');
const c = (code: string) => findCountry(code)!;

const uk = [{ label: 'VAT', rate: 20 }];
const add = computeTax({ amount: 100, components: uk, direction: 'add' })!;
const remove = computeTax({ amount: 120, components: uk, direction: 'remove' })!;
const europe = TAX_COUNTRIES.filter((x) => x.group === 'Europe');
const euSorted = [...europe].sort((a, b) => b.standard - a.standard);
const others = TAX_COUNTRIES.filter((x) => x.group !== 'Europe' && !x.regions);
const canada = c('CA');
const on = computeTax({ amount: 100, components: componentsFor(canada, 'ON'), direction: 'add' })!;
const bc = computeTax({ amount: 100, components: componentsFor(canada, 'BC'), direction: 'add' })!;
const qc = computeTax({ amount: 100, components: componentsFor(canada, 'QC'), direction: 'add' })!;
const ns = computeTax({ amount: 100, components: componentsFor(canada, 'NS'), direction: 'add' })!;
const auRemove = computeTax({ amount: 110, components: [{ label: 'GST', rate: 10 }], direction: 'remove' })!;
const inRemove = computeTax({ amount: 1180, components: [{ label: 'GST', rate: 18 }], direction: 'remove' })!;
const fractions = [5, 9, 10, 15, 18, 19, 20, 21, 23, 25].map((r) => ({ r, add: computeTax({ amount: 100, components: [{ label: 'x', rate: r }], direction: 'add' })!, remove: computeTax({ amount: 100, components: [{ label: 'x', rate: r }], direction: 'remove' })! }));
const rd = RETURN_DEFAULTS;
const ret = computeReturn(rd)!;
const refund = computeReturn({ sales: 10000, salesIncludeTax: false, salesRatePct: 0, purchases: 6000, purchasesIncludeTax: false, purchasesRatePct: 20 })!;

const seoData = {
  howToSteps: [
    'Choose a country. The calculator loads its standard rate and offers its reduced, super-reduced and zero rates as one-click presets; for Canada choose the province or territory to get GST, HST, PST or QST. You can also type any rate.',
    'Choose "Add" if your amount is before tax or "Remove" if it already includes tax, and enter the amount.',
    'Read the net price, the tax and the gross price, the share of the gross price that is tax, and a table of the same amount at each of that country\'s rates (or in every Canadian province).',
    'For a return estimate, open the "VAT / GST return" tab and enter the period\'s sales and reclaimable purchases, with or without tax. You get output tax, input tax and the amount to pay or reclaim.',
  ],

  formula:
    'Add tax: Gross = Net × (1 + Rate) · Tax = Net × Rate\nRemove tax: Net = Gross ÷ (1 + Rate) · Tax = Gross − Net = Gross × Rate ÷ (1 + Rate)\nTax fraction of a tax-inclusive price = Rate ÷ (100 + Rate): 20% → 1/6, 10% → 1/11, 5% → 1/21\nReturn: Tax payable = Output tax on sales − Input tax on purchases',

  formulaDescription:
    'Value added tax and goods and services tax are the same kind of tax under two names: a percentage charged on the price of most goods and services, collected by businesses at each stage and passed to the government. Adding it is a multiplication. Removing it is a division, not a subtraction of the same percentage, because the rate is expressed as a share of the price before tax, not of the price after it. ' +
    'A registered business does not bear the tax itself. It charges tax on what it sells, reclaims the tax on what it buys for the business, and pays over the difference, so each business hands over tax only on the value it added and the full amount is borne by the final consumer.',

  benchmarkTables: [
    {
      title: 'VAT Rates in Europe, as of January 2026',
      headers: ['Country', 'Standard rate', 'Reduced rates', 'Super-reduced rate', `${gbp(100).replace('£', '')} net becomes`],
      rows: euSorted.map((x) => [x.name, rate(x.standard), list(x.reduced), x.superReduced !== undefined ? rate(x.superReduced) : '—', (100 + x.standard).toFixed(2).replace(/\.00$/, '')]),
      note: `Source: Tax Foundation. Hungary has the highest standard rate at ${rate(c('HU').standard)} and Switzerland the lowest at ${rate(c('CH').standard)}; within the EU the lowest is Luxembourg at ${rate(c('LU').standard)}. Estonia moved to ${rate(c('EE').standard)} in July 2025 and Romania to ${rate(c('RO').standard)} in August 2025. EU law sets a minimum standard rate of 15%.`,
    },
    {
      title: 'GST, HST and Provincial Sales Tax in Canada, 2026',
      headers: ['Province or territory', 'Taxes', 'Combined rate', `Tax on ${cad(100)}`, 'Total'],
      rows: canada.regions!.map((r) => {
        const t = computeTax({ amount: 100, components: r.components, direction: 'add' })!;
        return [r.name, r.components.map((x) => `${x.label} ${rate(x.rate)}`).join(' + '), rate(totalRate(r.components)), cad(t.tax), cad(t.gross)];
      }),
      note: 'The federal GST is 5% everywhere. Five provinces replace it with a single harmonized sales tax (HST); British Columbia, Saskatchewan and Manitoba add their own provincial tax; Quebec adds QST; Alberta and the three territories charge GST only. Nova Scotia\'s HST fell from 15% to 14% on April 1, 2025.',
    },
    {
      title: 'GST, VAT and Consumption Tax Outside Europe, 2026',
      headers: ['Country', 'Tax', 'Standard rate', 'Other rates', 'Tax inside a tax-inclusive price'],
      rows: others.map((x) => [x.name, x.taxName, rate(x.standard), list([...x.reduced, ...(x.other ?? [])]), `${vatFraction(x.standard)} of the price`]),
      note: 'National standard rates in force in 2026. India restructured its GST on September 22, 2025: most goods and services are now taxed at 5% or 18%, with 40% on a short list of luxury and sin goods. The United States has no VAT or GST; it has state and local sales taxes instead.',
    },
    {
      title: 'Adding and Removing Tax at Common Rates',
      headers: ['Rate', '100 before tax becomes', 'Tax inside 100 including tax', 'Net inside 100 including tax', 'Tax fraction'],
      rows: fractions.map((x) => [rate(x.r), x.add.gross.toFixed(2), x.remove.tax.toFixed(2), x.remove.net.toFixed(2), vatFraction(x.r)]),
      note: 'The tax inside a tax-inclusive price is always less than the headline rate: at 20% it is 16.67 of every 100, one sixth, not 20.',
    },
  ],

  deepDiveSections: [
    {
      title: 'Removing VAT Is Not the Same as Taking 20% Off',
      paragraphs: [
        `Adding tax is straightforward: ${gbp(100)} plus 20% is ${gbp(add.gross)}. Going back is where most errors happen. Taking 20% off ${gbp(120)} gives ${gbp(96)}, not ${gbp(100)}, because 20% of the larger number is ${gbp(24)}, more than the ${gbp(add.tax)} that was added. The rate is a percentage of the price before tax, so to recover that price you divide by one plus the rate: ${gbp(120)} ÷ 1.20 = ${gbp(remove.net)}, and the tax is the difference, ${gbp(remove.tax)}.`,
        `That is why the tax inside a tax-inclusive price has its own fraction. At 20% it is ${vatFraction(20)} of the price; at 10% it is ${vatFraction(10)} (${aud(auRemove.tax)} of an ${aud(110)} Australian price, leaving ${aud(auRemove.net)}); at 5% it is ${vatFraction(5)}; at 15% it is ${vatFraction(15)}. Multiplying the gross price by the fraction gives the tax directly. The calculator shows the fraction where it is a simple one and the percentage of the gross price for every rate.`,
      ],
    },
    {
      title: 'VAT, GST and US Sales Tax',
      paragraphs: [
        'VAT (the name used across Europe, South Africa and the Gulf) and GST (Australia, New Zealand, Canada, India, Singapore) work the same way. Every registered business in the chain charges the tax on its sales and deducts the tax on its purchases, so tax is collected in stages but the cumulative amount equals the rate applied to the final price. Prices shown to consumers normally include it. Japan calls its version consumption tax.',
        `A US sales tax is different in two ways. It is charged once, at the final sale to the consumer, with business purchases for resale exempted rather than credited; and it is added at the checkout rather than included in the shelf price. There is no federal sales tax or VAT in the United States; rates are set by states and localities. A US business generally meets VAT or GST when it sells abroad. Digital services sold to consumers in the EU, the UK, Australia and many other places are taxed where the customer is, and a non-resident seller may have to register and charge the local rate, so check the rules of each country you sell into. For domestic sales, use the Sales Tax Calculator.`,
      ],
    },
    {
      title: 'Standard, Reduced and Zero Rates',
      paragraphs: [
        `Most countries have more than one rate. The standard rate applies unless the law says otherwise; reduced rates apply to listed categories, typically food, books, medicines, public transport or hotel stays; and a few countries keep a super-reduced rate below 5%, such as ${rate(c('FR').superReduced!)} in France and ${rate(c('ES').superReduced!)} in Spain. In the United Kingdom the standard rate is ${rate(c('GB').standard)}, home energy and children's car seats are taxed at ${rate(c('GB').reduced[0])}, and most food and children's clothes at 0%.`,
        'Zero-rated and exempt are not the same thing. A zero-rated sale is taxable at 0%, so the seller charges no tax but can still reclaim the tax on its own costs. An exempt sale is outside the tax, so the seller charges no tax and cannot reclaim the related input tax, which then becomes a real cost. Which rate applies to a particular product is decided by each tax authority, often in fine detail, so use the presets for the arithmetic and the authority\'s guidance for the classification.',
      ],
    },
    {
      title: 'Canada: One Federal Tax, Four Provincial Arrangements',
      paragraphs: [
        `Canada's federal GST is 5%, but what a customer pays depends on the province. Ontario, Nova Scotia, New Brunswick, Newfoundland and Labrador and Prince Edward Island combine the federal and provincial taxes into one HST: ${cad(100)} becomes ${cad(on.gross)} in Ontario and ${cad(ns.gross)} in Nova Scotia. British Columbia, Saskatchewan and Manitoba charge GST and a separate provincial sales tax, each on the price before tax: ${cad(100)} in British Columbia carries ${cad(bc.components[0].amount)} of GST and ${cad(bc.components[1].amount)} of PST, ${cad(bc.gross)} in total. Quebec adds its QST of 9.975% for ${cad(qc.gross)}. Alberta and the territories charge GST alone.`,
        'The distinction matters for a business. GST and HST paid on business purchases can be claimed back as input tax credits, as can QST under Quebec\'s parallel system, but provincial sales tax in British Columbia, Saskatchewan and Manitoba is generally not recoverable and is simply a cost. The calculator shows the components separately for that reason.',
      ],
    },
    {
      title: 'The Return: Output Tax Less Input Tax',
      paragraphs: [
        `A VAT or GST return nets two figures. In the example a UK business took ${gbp(rd.sales)} from customers including VAT, which is ${gbp(ret.netSales)} of sales and ${gbp(ret.outputTax)} of output tax. It spent ${gbp(rd.purchases)} including VAT on supplies it can reclaim on, which is ${gbp(ret.netPurchases)} of cost and ${gbp(ret.inputTax)} of input tax. It pays ${gbp(ret.outputTax)} − ${gbp(ret.inputTax)} = ${gbp(ret.payable)}. That is exactly 20% of the ${gbp(ret.valueAdded)} of value it added, and ${rate(ret.effectiveRatePct!)} of its net sales, which is why a business with high material costs pays over a smaller share of its turnover than a service business with few purchases.`,
        `When input tax exceeds output tax the business is owed a refund. An exporter or a seller of zero-rated goods with ${gbp(10000)} of zero-rated sales and ${gbp(6000)} of standard-rated purchases has no output tax and ${gbp(refund.inputTax)} of input tax, a ${gbp(-refund.payable)} repayment. The return tab is an estimate: flat-rate and cash-accounting schemes, partly exempt businesses, imports and cross-border sales each have their own rules, and only tax on genuine business purchases with a valid tax invoice can be reclaimed.`,
      ],
    },
  ],

  workedExamples: [
    { title: 'Add 20% VAT to £100', description: `${gbp(100)} × 1.20 = ${gbp(add.gross)}; VAT ${gbp(add.tax)}.` },
    { title: 'Remove 20% VAT From £120', description: `${gbp(120)} ÷ 1.20 = ${gbp(remove.net)}; VAT ${gbp(remove.tax)}, one sixth of the gross price. Taking 20% off ${gbp(120)} would give ${gbp(96)} and understate the net price by ${gbp(4)}.` },
    { title: 'Remove 10% GST From A$110 (Australia)', description: `${aud(110)} ÷ 1.10 = ${aud(auRemove.net)}; GST ${aud(auRemove.tax)}, one eleventh of the price.` },
    { title: 'Remove 18% GST From ₹1,180 (India)', description: `${formatMoney(1180, 'INR')} ÷ 1.18 = ${formatMoney(inRemove.net, 'INR')}; GST ${formatMoney(inRemove.tax, 'INR')}, split equally into CGST and SGST of ${formatMoney(inRemove.tax / 2, 'INR')} each on a sale within one state.` },
    { title: 'C$100 in Four Canadian Provinces', description: `Ontario HST 13%: ${cad(on.gross)}. British Columbia GST 5% + PST 7%: ${cad(bc.components[0].amount)} + ${cad(bc.components[1].amount)} = ${cad(bc.gross)}. Quebec GST 5% + QST 9.975%: ${cad(qc.components[0].amount)} + ${cad(qc.components[1].amount)} = ${cad(qc.gross)}. Alberta GST only: ${cad(105)}.` },
    { title: 'A Quarterly VAT Return', description: `Sales ${gbp(rd.sales)} including VAT → ${gbp(ret.netSales)} net, ${gbp(ret.outputTax)} output tax. Purchases ${gbp(rd.purchases)} including VAT → ${gbp(ret.netPurchases)} net, ${gbp(ret.inputTax)} input tax. Payable ${gbp(ret.outputTax)} − ${gbp(ret.inputTax)} = ${gbp(ret.payable)}.` },
  ],

  faqs: [
    { question: 'How do I add VAT to a price?', answer: `Multiply the price before tax by 1 plus the rate. At 20%, ${gbp(100)} × 1.20 = ${gbp(add.gross)}, of which ${gbp(add.tax)} is VAT. The same works for GST: at 10%, multiply by 1.10.` },
    { question: 'How do I remove VAT from a price that includes it?', answer: `Divide the price by 1 plus the rate. At 20%, ${gbp(120)} ÷ 1.20 = ${gbp(remove.net)} before VAT, so the VAT is ${gbp(remove.tax)}. Do not take 20% off the gross price: that gives ${gbp(96)} because it removes 20% of the larger figure.` },
    { question: 'What is the VAT fraction?', answer: `The share of a tax-inclusive price that is tax: rate ÷ (100 + rate). At 20% it is ${vatFraction(20)}, at 5% ${vatFraction(5)}, at 10% ${vatFraction(10)} and at 15% ${vatFraction(15)}. Multiply the gross price by the fraction to get the tax.` },
    { question: 'What is the difference between VAT and GST?', answer: 'The name. Both are taxes on consumption collected in stages, with each business charging tax on its sales and reclaiming tax on its purchases. Europe, South Africa and the Gulf states call it VAT; Australia, New Zealand, Canada, India and Singapore call it GST.' },
    { question: 'Does the United States have VAT?', answer: 'No. The US has no federal VAT, GST or sales tax. States and local governments levy sales taxes, which are charged once at the final sale and added at the checkout rather than included in the price. US businesses can still have to charge VAT or GST on sales to customers in other countries.' },
    { question: 'What is the VAT rate in the UK?', answer: `The standard rate is ${rate(c('GB').standard)}. A reduced rate of ${rate(c('GB').reduced[0])} applies to some goods and services such as home energy and children's car seats, and a zero rate to most food and children's clothes.` },
    { question: 'What are the GST and HST rates in Canada?', answer: `The federal GST is 5%. Ontario charges 13% HST; New Brunswick, Newfoundland and Labrador and Prince Edward Island 15%; Nova Scotia 14%. British Columbia and Manitoba add 7% provincial tax for 12%, Saskatchewan 6% for 11%, and Quebec 9.975% QST for 14.975%. Alberta and the territories charge 5%.` },
    { question: 'What is the GST rate in Australia, New Zealand, India and Singapore?', answer: `Australia ${rate(c('AU').standard)}, New Zealand ${rate(c('NZ').standard)} and Singapore ${rate(c('SG').standard)}, each a single rate. India has slabs: most goods and services are taxed at 5% or 18% since September 22, 2025, with 40% on luxury and sin goods.` },
    { question: 'Which country has the highest VAT rate in Europe?', answer: `Hungary, at ${rate(c('HU').standard)}, followed by Finland at ${rate(c('FI').standard)} and Croatia, Denmark and Sweden at 25%. The lowest standard rate in the EU is Luxembourg's ${rate(c('LU').standard)}; Switzerland, outside the EU, charges ${rate(c('CH').standard)}.` },
    { question: 'How do I calculate what I owe on a VAT or GST return?', answer: `Output tax on your sales minus input tax on your business purchases. With ${gbp(ret.outputTax)} of output tax and ${gbp(ret.inputTax)} of input tax you pay ${gbp(ret.payable)}. If input tax is larger, the difference is refunded.` },
    { question: 'What is the difference between zero-rated and exempt?', answer: 'A zero-rated sale is taxed at 0%: you charge no tax but can reclaim the tax on your related costs. An exempt sale is outside the tax: you charge no tax and cannot reclaim the tax on related costs. For a business the difference is whether input tax is recoverable.' },
    { question: 'Where did the separate VAT and GST calculators go?', answer: 'They are this one page. Choose the country and the calculator uses the right name, rates and currency; the old GST calculator link opens it set to Australia.' },
  ],

  sources: [SRC.taxFoundationVat, SRC.hmrcVatRates, SRC.craGstHst],

  relatedTools: [
    { slug: 'sales-tax-calculator', title: 'Sales Tax Calculator', description: 'US state and local sales tax, added or extracted', icon: 'Receipt' },
    { slug: 'invoice-generator', title: 'Invoice Generator', description: 'Invoices with VAT or GST added or included', icon: 'FileText' },
    { slug: 'discount-calculator', title: 'Discount Calculator', description: 'Sale prices before and after tax', icon: 'Tag' },
    { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Margin on the net-of-tax price', icon: 'Percent' },
    { slug: 'markup-calculator', title: 'Markup Calculator', description: 'Cost to selling price before tax', icon: 'DollarSign' },
    { slug: 'financial-statements-calculator', title: 'Financial Statements Calculator', description: 'Where tax payable sits on the balance sheet', icon: 'Landmark' },
  ],
} satisfies CalculatorSeoData;
export default seoData;
