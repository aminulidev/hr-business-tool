import type { CalculatorSeoData } from './types';
import { SRC } from './sources';
import { ATTAINMENT_STEPS, BONUS_DEFAULTS, computeBonusOte, computeCommissionSplit, SPLIT_DEFAULTS } from '@/lib/pricing/commission';

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const usd0 = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const pct = (n: number, d = 0) => `${n.toFixed(d)}%`;

// Phase 17: split and bonus/OTE figures come from the same functions the tabs run
const split = computeCommissionSplit(SPLIT_DEFAULTS);
const teamSplit = computeCommissionSplit({ saleAmount: 120000, commissionRatePct: 10, houseCutPct: 0, flatFees: 0, managerOverridePct: 5, parties: [{ name: 'Account executive', sharePct: 70 }, { name: 'Sales engineer', sharePct: 30 }] });
const ote = computeBonusOte(BONUS_DEFAULTS);
const ladder = ATTAINMENT_STEPS.map((a) => ({ a, r: computeBonusOte({ ...BONUS_DEFAULTS, attainmentPct: a }) }));

const seoData = {
  howToSteps: [
    'Determine your commission structure — flat rate, tiered, or base + commission',
    'Gather your sales data — total sales amount or individual transaction values',
    'Identify your commission rate(s) — check your employment agreement or comp plan',
    'Apply the commission formula — multiply sales by rate(s) according to your structure',
    'Account for any deductions — subtract broker fees, processing fees, or clawbacks',
    'Add base salary if applicable — combine fixed and variable pay for total compensation',
    'Splitting a commission? The "Commission Split" tab takes the sale, the rate, the brokerage or house cut and flat fees off the top, an optional manager override, and up to five parties with their shares, and shows what each person actually receives and what share of the sale that is.',
    'Modelling a comp plan? "Bonus & OTE" combines base salary, commission to quota, an accelerator above quota, a bonus with a threshold and kickers, and SPIFFs into on-target earnings, pay mix and an earnings curve from 50% to 150% attainment.',
  ],

  formula: `Simple: Commission = Sales Amount × (Commission Rate / 100)
Tiered: Commission = ∑(Tier Sales × Tier Rate)
With Base: Total Compensation = Base Salary + Commission
Net Commission = Gross Commission − Deductions
Quota Attainment = (Actual Sales / Quota) × 100%
Split: Pool = Gross − House cut − Fees − Override;  Party share = Pool × Share %
OTE = Base + Quota × Rate + Bonus at quota + SPIFFs;  above quota the rate is × Accelerator`,

  formulaDescription:
    'The commission formula depends on your compensation structure. A simple flat rate multiplies your total sales by a single percentage. Tiered structures apply different rates to different portions of your sales, rewarding higher volumes. Quota-based plans add accelerators that increase your rate when you exceed targets. Always subtract any deductions to arrive at your net commission.',

  workedExamples: [
    {
      title: 'Real Estate Agent — Flat Commission',
      description:
        'A real estate agent sells a house for $500,000 at a 3% commission rate. Commission = $500,000 × 3% = $15,000. If the agent has a base salary of $0 (straight commission), their total compensation is $15,000.',
    },
    {
      title: 'SaaS Sales Rep — Tiered Commission',
      description:
        'A SaaS sales rep closes $200,000 in annual recurring revenue with 3 tiers: 5% on the first $50,000 = $2,500, 8% on the next $100,000 = $8,000, and 12% on everything above $150,000 = $6,000. Total commission = $2,500 + $8,000 + $6,000 = $16,500. With a $65,000 base salary, total comp = $81,500.',
    },
    {
      title: 'B2B Account Executive — Quota with Accelerator',
      description:
        'An AE has an $80,000 annual quota, a 10% commission rate, and a 1.5x accelerator above quota. They close $100,000 in sales. Regular commission on $80,000 at 10% = $8,000. Accelerated commission on $20,000 above quota at 15% (10% × 1.5) = $3,000. Total commission = $11,000. With a $55,000 base, total comp = $66,000.',
    },
  ],

  benchmarkTables: [
    {
      title: `Earnings Curve for the Sample Plan (${usd0(BONUS_DEFAULTS.baseSalary)} base, ${usd0(BONUS_DEFAULTS.quota)} quota, ${BONUS_DEFAULTS.commissionRatePct}% to quota, ${BONUS_DEFAULTS.acceleratorMultiplier}× above, ${usd0(BONUS_DEFAULTS.bonusAtQuota)} bonus)`,
      description: 'How total earnings move with attainment when commission, accelerator, threshold bonus and kickers are combined. OTE is the 100% row.',
      headers: ['Attainment', 'Sales', 'Commission', 'Bonus', 'Total earnings', '% of OTE'],
      rows: ladder.map(({ a, r }) => [`${a}%`, usd0(r.actualSales), usd0(r.commission), usd0(r.bonus), usd0(r.totalEarnings), pct(r.pctOfOte)]),
      note: `Bonus pays nothing below ${BONUS_DEFAULTS.bonusThresholdPct}% attainment, scales to ${usd0(BONUS_DEFAULTS.bonusAtQuota)} at 100% and adds ${usd0(BONUS_DEFAULTS.bonusPer10PtsOver)} for every full 10 points above; SPIFFs of ${usd0(BONUS_DEFAULTS.spiffs)} are assumed earned at every level. Pay mix at target: ${pct(100 - ote.payMixVariablePct)} base / ${pct(ote.payMixVariablePct)} variable.`,
    },
  ],

  deepDiveSections: [
    {
      title: 'How a Commission Gets Split: House Cut, Fees, Overrides and Shares',
      paragraphs: [
        `A split works top-down. The sale earns a gross commission; the brokerage or house takes its cut and any flat fees; a manager or team lead may take an override on the gross; what is left is the pool the people who did the work share. On the sample ${usd0(SPLIT_DEFAULTS.saleAmount)} home sale at ${SPLIT_DEFAULTS.commissionRatePct}%, the gross is ${usd(split.grossCommission)}; a ${SPLIT_DEFAULTS.houseCutPct}% house cut (${usd(split.houseCut)}) and a ${usd(SPLIT_DEFAULTS.flatFees)} transaction fee leave ${usd(split.pool)}, split 60/40 into ${usd(split.parties[0].amount)} for the listing agent and ${usd(split.parties[1].amount)} for the co-agent — so the listing agent's take is ${pct(split.effectiveRateOnSale ?? 0, 2)} of the sale price, not 3%.`,
        `Team deals in B2B work the same way without a brokerage: a ${usd0(120000)} deal at 10% with a 5% manager override leaves ${usd(teamSplit.pool)} to split 70/30, ${usd(teamSplit.parties[0].amount)} to the account executive and ${usd(teamSplit.parties[1].amount)} to the sales engineer. The tab warns when the shares do not add up to 100%, which is the most common reason a split dispute ends up with payroll.`,
      ],
    },
    {
      title: 'Reading a Comp Plan: OTE, Pay Mix, Accelerators and Kickers',
      paragraphs: [
        `On-target earnings are what the plan pays at exactly 100% of quota: base salary plus commission on the quota plus the at-quota bonus and any SPIFFs the plan expects. The sample plan's OTE is ${usd0(ote.ote)} on a ${usd0(BONUS_DEFAULTS.baseSalary)} base, a ${pct(100 - ote.payMixVariablePct)}/${pct(ote.payMixVariablePct)} pay mix. Pay mix is the first thing to read in an offer: 50/50 is common for new-business account executives, 70/30 or 80/20 for account managers and customer success, and 100% variable only in roles where the rep controls the whole sale.`,
        `Accelerators and kickers are what make the curve bend. At ${BONUS_DEFAULTS.attainmentPct}% attainment the sample rep earns ${usd0(ote.totalEarnings)}, ${pct(ote.pctOfOte)} of OTE: the last ${usd0(ote.actualSales - BONUS_DEFAULTS.quota)} of sales paid ${usd0(ote.commissionAbove)} at the accelerated rate and triggered a ${usd0(BONUS_DEFAULTS.bonusPer10PtsOver)} kicker. Below the ${BONUS_DEFAULTS.bonusThresholdPct}% threshold the bonus disappears entirely, which is why plans with a high threshold feel harsher than their OTE suggests. The earnings-curve table shows the whole shape at a glance; compare two offers by their 80% and 120% rows, not just the OTE.`,
      ],
    },
  ],

  commissionStructures: [
    {
      type: 'Straight Commission',
      description: '100% variable, no base salary.',
      formula: 'Commission = Sales × Rate',
      example: 'Real estate agents often work on 100% commission.',
    },
    {
      type: 'Base Salary + Commission',
      description: 'Fixed base + variable.',
      formula: 'Total = Base + (Sales × Rate)',
      example: 'Sales rep with $60K base + 5% commission.',
    },
    {
      type: 'Tiered/Graduated Commission',
      description: 'Rate increases at thresholds.',
      formula: 'Sum of (tier_sales × tier_rate)',
      example: 'First $50K at 5%, next $50K at 8%, above $100K at 12%.',
    },
  ],

  faqs: [
    {
      question: 'How do I split a commission between agents or with my brokerage?',
      answer:
        `Start from the gross commission, take off the brokerage or house cut and any flat fees, then any manager override, and divide what is left by the agreed shares. On a ${usd0(SPLIT_DEFAULTS.saleAmount)} sale at ${SPLIT_DEFAULTS.commissionRatePct}% (${usd(split.grossCommission)} gross), a ${SPLIT_DEFAULTS.houseCutPct}% house cut and a ${usd(SPLIT_DEFAULTS.flatFees)} fee leave ${usd(split.pool)}; a 60/40 split pays ${usd(split.parties[0].amount)} and ${usd(split.parties[1].amount)}. The "Commission Split" tab handles up to five parties and flags shares that do not total 100%.`,
    },
    {
      question: 'What are on-target earnings (OTE) and pay mix?',
      answer:
        `OTE is total pay at exactly 100% of quota: base salary plus the commission earned on the quota plus any at-quota bonus. Pay mix is the base/variable split of that OTE — the sample plan is ${usd0(ote.ote)} OTE at ${pct(100 - ote.payMixVariablePct)}/${pct(ote.payMixVariablePct)}. A richer mix (more variable) means higher upside and a lower floor; the "Bonus & OTE" tab shows earnings from 50% to 150% attainment so you can see the floor and the upside, not just the midpoint.`,
    },
    {
      question: 'How do sales bonuses with thresholds and kickers work?',
      answer:
        `Most plans pay no bonus below a threshold (often 70–80% of quota), a pro-rata share between the threshold and 100%, the full bonus at 100%, and a fixed kicker for each further step above quota. In the sample plan a ${usd0(BONUS_DEFAULTS.bonusAtQuota)} bonus starts at ${BONUS_DEFAULTS.bonusThresholdPct}% and adds ${usd0(BONUS_DEFAULTS.bonusPer10PtsOver)} per full 10 points over 100%, so 90% attainment pays ${usd0(computeBonusOte({ ...BONUS_DEFAULTS, attainmentPct: 90 }).bonus)} and 120% pays ${usd0(computeBonusOte({ ...BONUS_DEFAULTS, attainmentPct: 120 }).bonus)}. SPIFFs are flat incentives for specific products or periods and sit on top of all of this.`,
    },
    {
      question: 'What is a sales commission?',
      answer:
        'A sales commission is a performance-based payment that compensates salespeople based on the volume or value of sales they generate. It serves as a powerful incentive to drive higher revenue and rewards top performers with additional earnings beyond any base salary. Commission structures are widely used across real estate, retail, B2B sales, SaaS, financial services, and insurance industries. The more you sell, the more you earn — making it a key motivator for sales-focused roles.',
    },
    {
      question: 'What is a typical commission rate by industry?',
      answer:
        'Commission rates vary significantly by industry: Real estate agents typically earn 2–6% of the sale price. SaaS and software sales reps often see 5–15% on annual recurring revenue. Retail sales associates usually earn 1–5% of sales. Insurance agents can earn 10–25% on new premiums. B2B sales professionals generally earn 5–10% of deal value. The exact rate depends on deal size, product complexity, sales cycle length, and the balance between base salary and variable compensation.',
    },
    {
      question: 'How do tiered commission structures work?',
      answer:
        'Tiered commission structures apply progressively higher rates as your sales volume increases through predefined thresholds. Each tier only applies to the sales within its specific range — this is called marginal calculation. For example, the first $50,000 might earn 5%, the next $50,000 earns 8%, and everything above $100,000 earns 12%. This approach rewards higher performance with proportionally greater earnings and motivates salespeople to push beyond minimum targets for maximum earning potential.',
    },
    {
      question: 'What is a commission accelerator?',
      answer:
        'A commission accelerator increases your commission rate when you exceed your sales quota. For example, if your base rate is 10% and your accelerator is 1.5x, any sales above your quota earn 15% instead of 10%. Accelerators are especially common in SaaS and B2B sales where exceeding targets significantly impacts company growth. They create a strong financial incentive to push past 100% quota attainment, often resulting in exponential earnings growth for top performers.',
    },
    {
      question: 'How is commission taxed?',
      answer:
        'Commission income is generally taxed as ordinary income at the federal level, just like regular salary. However, employers often withhold taxes at a higher supplemental rate — typically 22% federal flat rate — on commission payments, which means larger deductions from each commission paycheck. This does not mean you pay more in total taxes, the difference is usually reconciled when you file your annual return. Self-employed individuals must also pay self-employment tax (15.3%) and make quarterly estimated payments. State and local taxes vary by jurisdiction.',
    },
    {
      question: 'What is the difference between gross and net commission?',
      answer:
        'Gross commission is the total commission earned before any deductions are subtracted. Net commission is what you actually take home after broker fees, agency splits, processing fees, clawbacks, and other deductions have been applied. This distinction is especially important in real estate, where agents may split their commission with their brokerage (e.g., a 70/30 split), and in insurance, where premium financing and processing costs can reduce actual earnings significantly.',
    },
    {
      question: 'Can my employer claw back my commission?',
      answer:
        'Yes, many employers include clawback provisions in their commission agreements. Common triggers include customer cancellations, product returns, failed payments, or early contract terminations that occur within a specified period after the sale. Some companies also claw back commissions if you leave the company before a certain vesting period. It is critical to review your employment agreement or compensation plan carefully to understand the specific clawback terms, timelines, and conditions that apply to your commission.',
    },
    {
      question: 'How do I calculate commission on a returned sale?',
      answer:
        'When a sale is returned or cancelled, the commission previously earned on that sale is typically clawed back in full. For example, if you earned $500 commission on a $10,000 sale that is later returned, your employer will deduct $500 from future commissions. For partial returns, the clawback is pro-rata — a 50% return means a 50% clawback of the original commission. In tiered structures, a return can be particularly complex because it may shift your total sales into a lower tier, retroactively reducing the rate applied to your remaining sales. Always check your comp plan for the specific return policy.',
    },
  ],

  relatedTools: [
    { slug: 'salary-increase-calculator' as const, title: 'Salary Increase Calculator', description: 'See what a raise looks like in your paycheck', icon: 'TrendingUp' },
    { slug: 'payroll-calculator' as const, title: 'Payroll Calculator', description: 'Calculate your take-home pay after taxes', icon: 'CreditCard' },
    { slug: 'pro-rata-calculator' as const, title: 'Pro Rata Salary Calculator', description: 'Calculate prorated salary for partial periods', icon: 'CalendarClock' },
    { slug: 'profit-margin-calculator' as const, title: 'Profit Margin Calculator', description: 'Calculate profit margins and markup percentages', icon: 'Percent' },
    { slug: 'bonus-tax-calculator' as const, title: 'Bonus Tax Calculator', description: 'Calculate net bonus after tax withholding', icon: 'Gift' },
    { slug: 'roi-calculator' as const, title: 'ROI Calculator', description: 'Calculate return on investment for business decisions', icon: 'BarChart3' },
  ],
  sources: [SRC.dolFactSheet20, SRC.cfr778_117],
  // Note: tiered, quota, split, bonus and incentive calculator URLs redirect to the matching tab here (Phase 17).
} satisfies CalculatorSeoData;

export default seoData;