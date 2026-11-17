import { describe, expect, it } from 'vitest';
import { __testMoreStates as t, MORE_STATE_SOURCES } from './2026-more-states';
import { MORE_STATE_RULES_2026 } from './2026';

// ---------------------------------------------------------------------------
// Golden values for the jurisdictions without a paycheck page. Each figure is
// worked by hand from the state's 2026 withholding publication (cited in
// 2026-more-states.ts), and where the publication prints a worked example it is
// reproduced here. Annual amounts; a publication's per-paycheck example is
// compared after dividing by the pay periods, within the cents that its rounded
// per-period thresholds introduce.
// ---------------------------------------------------------------------------

describe('every modeled jurisdiction', () => {
  const codes = Object.keys(MORE_STATE_RULES_2026) as (keyof typeof MORE_STATE_RULES_2026)[];

  it('has a rule and a primary source on a government domain', () => {
    expect(Object.keys(MORE_STATE_SOURCES).sort()).toEqual([...codes].sort());
    for (const code of codes) {
      const source = MORE_STATE_SOURCES[code]!;
      expect(source.url, code).toMatch(/^https:\/\/[a-z0-9.-]+\.(gov|us)\//);
      expect(source.label.length, code).toBeGreaterThan(20);
      expect(source.publisher.length, code).toBeGreaterThan(5);
    }
  });

  it.each(codes)('%s: tax never falls as wages rise, is never negative, and more allowances never raise it', (code) => {
    const rule = MORE_STATE_RULES_2026[code]!;
    for (const filingStatus of ['single', 'married', 'hoh'] as const) {
      let previous = 0;
      for (let wages = 0; wages <= 600000; wages += 2500) {
        const tax = (allowances: number) =>
          rule({ taxableWages: wages, ficaWages: wages, filingStatus, allowances, nycResident: false })
            .filter((l) => l.key === 'state')
            .reduce((s, l) => s + l.annual, 0);
        const withOne = tax(1);
        expect(withOne, `${code} ${filingStatus} ${wages}`).toBeGreaterThanOrEqual(0);
        expect(withOne, `${code} ${filingStatus} ${wages}`).toBeGreaterThanOrEqual(previous - 0.005);
        expect(tax(3), `${code} ${filingStatus} ${wages}`).toBeLessThanOrEqual(withOne + 0.005);
        expect(withOne).toBeLessThan(wages * 0.15 + 1);
        previous = withOne;
      }
    }
  });
});

describe('Montana (Employer Guide V4, November 2025)', () => {
  it('annual formula W = A + B × (G − C)', () => {
    expect(t.montanaIncomeTax(60000, 'single')).toBeCloseTo(2063.3, 2); // 4.7% × (60,000 − 16,100)
    expect(t.montanaIncomeTax(150000, 'single')).toBeCloseTo(7114.6, 2); // 2,233 + 5.65% × (150,000 − 63,600)
    expect(t.montanaIncomeTax(100000, 'married')).toBeCloseTo(3186.6, 2); // 4.7% × (100,000 − 32,200)
    expect(t.montanaIncomeTax(120000, 'hoh')).toBeCloseTo(3349 + 0.0565 * (120000 - 95400), 2); // 4,738.90
    expect(t.montanaIncomeTax(16100, 'single')).toBe(0);
    expect(t.montanaIncomeTax(32200, 'married')).toBe(0);
  });

  it('agrees with the guide’s printed examples, per paycheck', () => {
    // "box 1a ... earns $1,375 during a semi-monthly payroll period: ... = $33"
    expect(Math.round(t.montanaIncomeTax(1375 * 24, 'single') / 24)).toBe(33);
    // "line 2 ... earns $2,950 during a bi-weekly payroll period: ... = $114" (single table)
    expect(Math.round(t.montanaIncomeTax(2950 * 26, 'single') / 26)).toBe(114);
    // "line 1b ... earns $5,950 during a bi-weekly payroll period: ... = $232"
    expect(Math.abs(t.montanaIncomeTax(5950 * 26, 'married') / 26 - 232)).toBeLessThan(0.75);
    // "box 1c ... earns $4,950 during a bi-weekly payroll period: ... = $201"
    expect(Math.abs(t.montanaIncomeTax(4950 * 26, 'hoh') / 26 - 201)).toBeLessThan(0.75);
  });
});

describe('Oklahoma (Packet OW-2, revised 11-2025)', () => {
  it('annual Table 7 after $1,000 per allowance', () => {
    expect(t.oklahomaIncomeTax(60000, 'single', 1)).toBeCloseTo(2154.5, 2); // 109.25 + 4.5% × (59,000 − 13,550)
    expect(t.oklahomaIncomeTax(150000, 'single', 1)).toBeCloseTo(6204.5, 2);
    expect(t.oklahomaIncomeTax(100000, 'married', 2)).toBeCloseTo(3409, 2); // 218.50 + 4.5% × (98,000 − 27,100)
    expect(t.oklahomaIncomeTax(12000, 'single', 0)).toBeCloseTo(28.75 + 0.035 * 750, 2); // 55.00
    expect(t.oklahomaIncomeTax(10100, 'single', 0)).toBe(0);
    expect(t.oklahomaIncomeTax(60000, 'hoh', 1)).toBe(t.oklahomaIncomeTax(60000, 'single', 1));
  });

  it('reproduces the packet’s example: $1,825 semi-monthly, married, two allowances → $36.67', () => {
    expect(t.oklahomaIncomeTax(1825 * 24, 'married', 2) / 24).toBeCloseTo(36.67, 1);
  });
});

describe('West Virginia (Form IT-100.2A, March 2026)', () => {
  it('default two-earner table after $2,000 per exemption', () => {
    expect(t.westVirginiaIncomeTax(60000, 1)).toBeCloseTo(2058.28, 2); // 1,462.88 + 4.58% × (58,000 − 45,000)
    expect(t.westVirginiaIncomeTax(150000, 1)).toBeCloseTo(6180.28, 2);
    expect(t.westVirginiaIncomeTax(100000, 2)).toBeCloseTo(3798.68, 2);
    expect(t.westVirginiaIncomeTax(7000, 1)).toBeCloseTo(105.5, 2); // 2.11% × 5,000
  });

  it('optional one-earner table (IT-104 line 5) withholds less', () => {
    expect(t.westVirginiaIncomeTax(60000, 1, true)).toBeCloseTo(1866.1, 2); // 1,106.50 + 4.22% × (58,000 − 40,000)
    expect(t.westVirginiaIncomeTax(150000, 1, true)).toBeCloseTo(5980.9, 2);
    expect(t.westVirginiaIncomeTax(100000, 2, true)).toBeCloseTo(3599.3, 2);
  });

  it('both tables are continuous at every bracket edge', () => {
    for (const oneEarner of [false, true]) {
      for (const edge of oneEarner ? [10000, 25000, 40000, 60000] : [7500, 18750, 30000, 45000]) {
        const below = t.westVirginiaIncomeTax(edge + 2000 - 0.01, 1, oneEarner);
        const above = t.westVirginiaIncomeTax(edge + 2000 + 0.01, 1, oneEarner);
        expect(above - below).toBeLessThan(0.02);
      }
    }
  });
});

describe('Alabama (Withholding Tax Tables and Instructions, revised January 2026)', () => {
  it('standard deduction schedule steps down between $25,999 and $35,500', () => {
    expect(t.alabamaStandardDeduction(25999, 'single')).toBe(3000);
    expect(t.alabamaStandardDeduction(26000, 'single')).toBe(2975); // one $500 increment or part thereof
    expect(t.alabamaStandardDeduction(35000, 'single')).toBe(2525); // printed in the schedule for $35,000–$35,499
    expect(t.alabamaStandardDeduction(35500, 'single')).toBe(2500);
    expect(t.alabamaStandardDeduction(35000, 'married')).toBe(5175);
    expect(t.alabamaStandardDeduction(35500, 'married')).toBe(5000);
    expect(t.alabamaStandardDeduction(20000, 'married')).toBe(8500);
    expect(t.alabamaStandardDeduction(35000, 'hoh')).toBe(2635);
    expect(t.alabamaStandardDeduction(90000, 'hoh')).toBe(2500);
  });

  it('formula with the federal tax withheld deducted', () => {
    // S, $60,000: 60,000 − 2,500 − 5,020 federal − 1,500 = 50,980 → 10 + 100 + 5% × 47,980
    expect(t.alabamaIncomeTax(60000, 'single', 5020)).toBeCloseTo(2509, 2);
    // S, $150,000: 150,000 − 2,500 − 24,734 − 1,500 = 121,266 → 110 + 5% × 118,266
    expect(t.alabamaIncomeTax(150000, 'single', 24734)).toBeCloseTo(6023.3, 2);
    // M, $100,000: 100,000 − 5,000 − 7,640 − 3,000 = 84,360 → 20 + 200 + 5% × 78,360
    expect(t.alabamaIncomeTax(100000, 'married', 7640)).toBeCloseTo(4138, 2);
    // H, $60,000: 60,000 − 2,500 − 3,948 − 3,000 = 50,552 → 110 + 5% × 47,552
    expect(t.alabamaIncomeTax(60000, 'hoh', 3948)).toBeCloseTo(2487.6, 2);
    expect(t.alabamaIncomeTax(4000, 'single', 0)).toBe(0); // deduction and exemption exceed wages
    expect(t.alabamaIncomeTax(5000, 'single', 0)).toBeCloseTo(10, 2); // 500 taxable at 2%
  });

  it('the rule feeds the engine’s own 2026 federal withholding into the formula', () => {
    const [line] = MORE_STATE_RULES_2026.AL!({ taxableWages: 60000, ficaWages: 60000, filingStatus: 'single', allowances: 0, nycResident: false });
    expect(line.annual).toBeCloseTo(2509, 2);
    const [married] = MORE_STATE_RULES_2026.AL!({ taxableWages: 100000, ficaWages: 100000, filingStatus: 'married', allowances: 0, nycResident: false });
    expect(married.annual).toBeCloseTo(4138, 2);
  });
});

describe('Arkansas (Withholding Tax Formula Method, Tax Year 2026, 3.7% edition)', () => {
  it('reproduces the publication’s example: $2,127 a month, two exemptions → $438 a year', () => {
    // 25,524 − 2,470 = 23,054 → midrange 23,050 × 3.4% − 287.97 = 495.73 → 496 − 58
    expect(t.arkansasIncomeTax(2127 * 12, 2)).toBe(438);
  });

  it('midrange lookup, whole-dollar rounding and the $29 credit', () => {
    expect(t.arkansasIncomeTax(60000, 1)).toBe(1733); // 57,550 × 3.7% − 367.16 = 1,762.19 → 1,762 − 29
    expect(t.arkansasIncomeTax(150000, 1)).toBe(5350); // exact 147,530 × 3.7% − 79.90 = 5,378.71 → 5,379 − 29
    expect(t.arkansasIncomeTax(100000, 2)).toBe(3461); // 97,550 × 3.7% − 89.90 = 3,519.45 → 3,519 − 58
    expect(t.arkansasIncomeTax(8000, 1)).toBe(0); // 5,550 is in the 0% bracket
    expect(t.arkansasIncomeTax(10000, 0)).toBe(39); // 7,550 × 2% − 111.98 = 39.02
  });

  it('the $100 bands between $94,701 and $97,600 step the adjustment down $10 at a time', () => {
    // net taxable 94,750 → 3.7% × 94,750 − 369.90 = 3,135.85; 94,850 → − 359.90 = 3,149.55
    expect(t.arkansasIncomeTax(94750 + 2470, 0)).toBe(3136);
    expect(t.arkansasIncomeTax(94850 + 2470, 0)).toBe(3150);
    // 97,650 (first band of the last row) → 3.7% × 97,650 − 79.90 = 3,533.15
    expect(t.arkansasIncomeTax(97650 + 2470, 0)).toBe(3533);
  });
});

describe('Connecticut (TPG-211, Rev. 12/25)', () => {
  it('Table A exemptions, rows typed from the publication', () => {
    expect([30000, 30001, 31000, 43500, 44000, 44001].map((s) => t.ctExemption(s, 'F'))).toEqual([15000, 14000, 14000, 1000, 1000, 0]);
    expect([48000, 48500, 67500, 71000, 71001].map((s) => t.ctExemption(s, 'C'))).toEqual([24000, 23000, 4000, 1000, 0]);
    expect([38000, 39000, 39001, 56000, 56001].map((s) => t.ctExemption(s, 'B'))).toEqual([19000, 18000, 17000, 1000, 0]);
  });

  it('Table C add-back, rows typed from the publication', () => {
    expect([56500, 56501, 61500, 66500, 96500, 101500, 101501, 400000].map((s) => t.ctAddBack(s, 'F'))).toEqual([0, 25, 25, 50, 200, 225, 250, 250]);
    expect([100500, 105500, 110500, 145500, 145501].map((s) => t.ctAddBack(s, 'C'))).toEqual([0, 50, 100, 450, 500]);
    expect([78500, 82500, 86500, 114500, 114501].map((s) => t.ctAddBack(s, 'B'))).toEqual([0, 40, 80, 360, 400]);
  });

  it('Table D recapture, rows typed from the publication', () => {
    const F: [number, number][] = [[105000, 0], [110000, 25], [135000, 150], [150000, 225], [200000, 250], [205000, 340], [235000, 880], [245000, 1060], [345000, 2860], [500000, 2950], [505000, 3000], [540000, 3350], [540001, 3400]];
    for (const [salary, amount] of F) expect(t.ctRecapture(salary, 'F'), `F ${salary}`).toBe(amount);
    const B: [number, number][] = [[168000, 0], [216000, 240], [320000, 400], [376000, 1380], [552000, 4460], [800000, 4600], [808000, 4680], [864000, 5240], [864001, 5320]];
    for (const [salary, amount] of B) expect(t.ctRecapture(salary, 'B'), `B ${salary}`).toBe(amount);
    const C: [number, number][] = [[210000, 0], [270000, 300], [400000, 500], [470000, 1760], [690000, 5720], [1000000, 5900], [1010000, 6000], [1080000, 6700], [1080001, 6800]];
    for (const [salary, amount] of C) expect(t.ctRecapture(salary, 'C'), `C ${salary}`).toBe(amount);
  });

  it('Table E credit decimals, rows typed from the publication', () => {
    const F: [number, number][] = [[18800, 0.75], [19300, 0.7], [22300, 0.4], [25000, 0.35], [25500, 0.3], [26500, 0.2], [31300, 0.15], [31800, 0.14], [33300, 0.11], [60000, 0.1], [60500, 0.09], [62000, 0.06], [64500, 0.01], [64501, 0]];
    for (const [salary, decimal] of F) expect(t.ctCreditDecimal(salary, 'F'), `F ${salary}`).toBeCloseTo(decimal, 6);
    const C: [number, number][] = [[30000, 0.75], [30500, 0.7], [33500, 0.4], [40000, 0.35], [41500, 0.2], [50000, 0.15], [50500, 0.14], [52000, 0.11], [96000, 0.1], [98000, 0.06], [100000, 0.02], [100500, 0.01], [100501, 0]];
    for (const [salary, decimal] of C) expect(t.ctCreditDecimal(salary, 'C'), `C ${salary}`).toBeCloseTo(decimal, 6);
    const B: [number, number][] = [[24000, 0.75], [27500, 0.4], [34000, 0.35], [35500, 0.2], [44000, 0.15], [46000, 0.11], [74000, 0.1], [76000, 0.06], [78500, 0.01], [78501, 0]];
    for (const [salary, decimal] of B) expect(t.ctCreditDecimal(salary, 'B'), `B ${salary}`).toBeCloseTo(decimal, 6);
  });

  it('the calculation rules, steps 5 to 12', () => {
    // F, $60,000: no exemption; 2,000 + 5.5% × 10,000 = 2,550; add-back 25; × (1 − .10)
    expect(t.connecticutIncomeTax(60000, 'single')).toBeCloseTo(2317.5, 2);
    // one dollar more crosses into the .09 credit row
    expect(t.connecticutIncomeTax(60001, 'single')).toBeCloseTo((2000 + 0.055 * 10001 + 25) * 0.91, 2);
    // F, $150,000: 4,750 + 6% × 50,000 = 7,750; add-back 250; recapture 225; no credit
    expect(t.connecticutIncomeTax(150000, 'single')).toBeCloseTo(8225, 2);
    // C, $100,000: 400 + 4.5% × 80,000 = 4,000; × (1 − .02)
    expect(t.connecticutIncomeTax(100000, 'married')).toBeCloseTo(3920, 2);
    // B, $60,000: 320 + 4.5% × 44,000 = 2,300; × (1 − .10)
    expect(t.connecticutIncomeTax(60000, 'hoh')).toBeCloseTo(2070, 2);
    // F, $20,000: exemption 15,000; 2% × 5,000 = 100; × (1 − .60)
    expect(t.connecticutIncomeTax(20000, 'single')).toBeCloseTo(40, 2);
    expect(t.connecticutIncomeTax(15000, 'single')).toBe(0);
    expect(t.connecticutIncomeTax(24000, 'married')).toBe(0);
  });

  it('CT Paid Leave is 0.5% up to the Social Security wage base', () => {
    const lines = (wages: number) => MORE_STATE_RULES_2026.CT!({ taxableWages: wages, ficaWages: wages, filingStatus: 'single', allowances: 0, nycResident: false });
    expect(lines(60000).find((l) => l.key === 'pfl')!.annual).toBeCloseTo(300, 2);
    expect(lines(250000).find((l) => l.key === 'pfl')!.annual).toBeCloseTo(922.5, 2); // 184,500 × 0.5%
  });
});

describe('Delaware (Employer’s Guide, table effective January 1, 2025)', () => {
  it('reproduces the guide’s examples', () => {
    expect(t.delawareIncomeTax(25000, 'single', 1)).toBeCloseTo(722, 2); // 741 + 5.2% × 1,750 = 832, less 110
    expect(t.delawareIncomeTax(25000, 'married', 3)).toBeCloseTo(339, 2); // 261 + 4.8% × 8,500 = 669, less 330
  });

  it('annual formula', () => {
    expect(t.delawareIncomeTax(60000, 'single', 1)).toBeCloseTo(2653.125, 3); // 1,001 + 5.55% × 31,750, less 110
    expect(t.delawareIncomeTax(150000, 'single', 1)).toBeCloseTo(8559, 2);
    expect(t.delawareIncomeTax(100000, 'married', 2)).toBeCloseTo(4934.5, 2);
    expect(t.delawareIncomeTax(60000, 'hoh', 1)).toBe(t.delawareIncomeTax(60000, 'single', 1));
    expect(t.delawareIncomeTax(5000, 'single', 1)).toBe(0); // the credit exceeds the tax
  });

  it('Paid Leave is shown at the 0.4% an employer may deduct, up to the Social Security wage base', () => {
    const lines = (wages: number) => MORE_STATE_RULES_2026.DE!({ taxableWages: wages, ficaWages: wages, filingStatus: 'single', allowances: 1, nycResident: false });
    expect(lines(60000).find((l) => l.key === 'pfl')!.annual).toBeCloseTo(240, 2);
    expect(lines(300000).find((l) => l.key === 'pfl')!.annual).toBeCloseTo(738, 2); // 184,500 × 0.4%
  });
});

describe('Hawaii (Booklet A, tables for January 1, 2026 and thereafter)', () => {
  it('reproduces the booklet’s example: single, $500 a week, three allowances → $497.99 a year', () => {
    expect(t.hawaiiIncomeTax(500 * 52, 'single', 3)).toBeCloseTo(497.99, 2);
  });

  it('annual formula', () => {
    expect(t.hawaiiIncomeTax(60000, 'single', 2)).toBeCloseTo(2946.51, 2); // 2,539 + 7.6% × 5,362
    expect(t.hawaiiIncomeTax(150000, 'single', 2)).toBeCloseTo(9841.6, 2); // 8,391 + 7.9% × 18,362
    expect(t.hawaiiIncomeTax(100000, 'married', 3)).toBeCloseTo(4805.7, 2); // 3,350 + 7.2% × 20,218
    expect(t.hawaiiIncomeTax(60000, 'hoh', 3)).toBeCloseTo(2539 + 0.076 * (60000 - 3432 - 4350 - 48000), 2);
    expect(t.hawaiiIncomeTax(6000, 'single', 2)).toBe(0);
  });

  it('TDI is shown at 0.5% of wages, at most $7.50 a week', () => {
    const lines = (wages: number) => MORE_STATE_RULES_2026.HI!({ taxableWages: wages, ficaWages: wages, filingStatus: 'single', allowances: 2, nycResident: false });
    expect(lines(40000).find((l) => l.key === 'sdi')!.annual).toBeCloseTo(200, 2);
    expect(lines(120000).find((l) => l.key === 'sdi')!.annual).toBeCloseTo(390, 2);
  });
});

describe('Kansas (KW-100, Rev. 10-24)', () => {
  it('reproduces the guide’s example: $2,000 semi-monthly, married, three allowances → $41.44', () => {
    expect(t.kansasIncomeTax(2000 * 24, 'married', 3) / 24).toBeCloseTo(41.44, 1);
  });

  it('annual formula and the value of each allowance', () => {
    expect(t.kansasIncomeTax(60000, 'single', 1)).toBeCloseTo(2548.31, 2); // 1,196 + 5.58% × (50,840 − 26,605)
    expect(t.kansasIncomeTax(150000, 'single', 1)).toBeCloseTo(7570.31, 2);
    expect(t.kansasIncomeTax(100000, 'married', 2)).toBeCloseTo(3923.15, 2); // 2,392 + 5.58% × (81,680 − 54,240)
    // head of household: single table, $9,160 plus one $2,320 allowance
    expect(t.kansasIncomeTax(60000, 'hoh', 2)).toBeCloseTo(1196 + 0.0558 * (60000 - 11480 - 26605), 2);
    // no allowance: nothing subtracted
    expect(t.kansasIncomeTax(20000, 'single', 0)).toBeCloseTo(0.052 * (20000 - 3605), 2);
  });
});

describe('Maine (2026 Withholding Tables, revised August 2026)', () => {
  it('standard deduction for withholding phases out', () => {
    expect(t.maineStandardDeduction(102250, 'single')).toBe(12850);
    expect(t.maineStandardDeduction(177250, 'single')).toBe(0);
    expect(t.maineStandardDeduction(234000, 'married')).toBeCloseTo(22945, 0); // Example 3: "$28,550*$120,550 / $150,000 = $22,945"
    expect(t.maineStandardDeduction(204550, 'married')).toBe(28550);
  });

  it('reproduces the booklet’s examples', () => {
    // Example 2: single, $1,000 weekly, 2 allowances: 28,550 of income → $1,667 a year, $32 a week
    expect(Math.round(t.maineIncomeTax(52000, 'single', 2))).toBe(1667);
    expect(Math.round(t.maineIncomeTax(52000, 'single', 2) / 52)).toBe(32);
    // Example 3: married, $4,500 weekly, 2 allowances → $13,292 a year, $256 a week
    expect(Math.round(t.maineIncomeTax(234000, 'married', 2))).toBe(13292);
    expect(Math.round(t.maineIncomeTax(234000, 'married', 2) / 52)).toBe(256);
    // Example 1: single, $300 weekly, 2 allowances → nothing
    expect(t.maineIncomeTax(15600, 'single', 2)).toBe(0);
  });

  it('annual formula and the surcharge', () => {
    expect(t.maineIncomeTax(60000, 'single', 1)).toBeCloseTo(2564.375, 3); // 1,589 + 6.75% × 14,450
    expect(t.maineIncomeTax(150000, 'single', 1)).toBeCloseTo(9492.45, 1);
    expect(t.maineIncomeTax(100000, 'married', 2)).toBeCloseTo(3586, 2); // 3,181 + 6.75% × 6,000
    // single, $1,300,000, one allowance: income 1,294,700; 4,117 + 7.15% × 1,229,850 + 2% × 294,700
    expect(t.maineIncomeTax(1300000, 'single', 1)).toBeCloseTo(4117 + 0.0715 * 1229850 + 0.02 * 294700, 2);
  });
});

describe('Mississippi (Pub. 89-700, effective January 1, 2026)', () => {
  it('4.0% of taxable income over $10,000, after the exemption and standard deduction', () => {
    expect(t.mississippiIncomeTax(60000, 'single')).toBeCloseTo(1668, 2); // (60,000 − 8,300 − 10,000) × 4%
    expect(t.mississippiIncomeTax(150000, 'single')).toBeCloseTo(5268, 2);
    expect(t.mississippiIncomeTax(100000, 'married')).toBeCloseTo(2936, 2); // (100,000 − 16,600 − 10,000) × 4%
    expect(t.mississippiIncomeTax(60000, 'hoh')).toBeCloseTo(1484, 2); // (60,000 − 12,900 − 10,000) × 4%
    expect(t.mississippiIncomeTax(18300, 'single')).toBe(0);
  });
});

describe('Nebraska (2026 Circular EN)', () => {
  it('annual Table 7 after $2,440 per allowance', () => {
    expect(t.nebraskaIncomeTax(60000, 'single', 2)).toBeCloseTo(2015.1, 2); // 1,343.55 + 4.48% × (55,120 − 40,130)
    expect(t.nebraskaIncomeTax(60000, 'single', 1)).toBeCloseTo(2124.41, 2);
    expect(t.nebraskaIncomeTax(150000, 'single', 2)).toBeCloseTo(6130.8, 2); // 2,922.30 + 4.6% × (145,120 − 75,370)
    expect(t.nebraskaIncomeTax(100000, 'married', 3)).toBeCloseTo(3381.18, 2); // 2,932.22 + 4.6% × (92,680 − 82,920)
    expect(t.nebraskaIncomeTax(60000, 'hoh', 3)).toBeCloseTo(1343.55 + 0.0448 * (60000 - 7320 - 40130), 2);
  });

  it('the 1.5% rule: never less than half of what one allowance (two if married) would withhold', () => {
    // single, $10,000, two allowances: 2.26% × (5,120 − 3,430) = 38.19, under 1.5% of wages ($150),
    // so at least half of the one-allowance amount: (74.13 + 3.22% × 850) / 2 = 50.75
    expect(t.nebraskaIncomeTax(10000, 'single', 2)).toBeCloseTo(50.75, 2);
    // at $60,000 the ordinary result is well above 1.5% and is left alone
    expect(t.nebraskaIncomeTax(60000, 'single', 2)).toBeGreaterThan(900);
  });
});

describe('New Mexico (FYI-104, effective January 1, 2026)', () => {
  it('annual Table 7 by federal W-4 status', () => {
    expect(t.newMexicoIncomeTax(60000, 'single')).toBeCloseTo(2032.65, 2); // 1,964.50 + 4.7% × 1,450
    expect(t.newMexicoIncomeTax(150000, 'single')).toBeCloseTo(6413.55, 2); // 2,716.50 + 4.9% × 75,450
    expect(t.newMexicoIncomeTax(100000, 'married')).toBeCloseTo(3332.3, 2); // 1,739 + 4.7% × 33,900
    expect(t.newMexicoIncomeTax(60000, 'hoh')).toBeCloseTo(1352 + 0.043 * (60000 - 53075), 2);
    expect(t.newMexicoIncomeTax(8050, 'single')).toBe(0);
  });

  it('agrees with the publication’s example: married, $1,000 weekly → $21.80', () => {
    expect(Math.abs(t.newMexicoIncomeTax(52000, 'married') / 52 - 21.8)).toBeLessThan(0.05);
  });

  it('adds the Workers’ Compensation Fee of $2.25 a quarter', () => {
    const lines = MORE_STATE_RULES_2026.NM!({ taxableWages: 60000, ficaWages: 60000, filingStatus: 'single', allowances: 0, nycResident: false });
    expect(lines.find((l) => l.key === 'sdi')!.annual).toBe(9);
  });
});

describe('North Dakota (Withholding Rates & Instructions for 2026, Forms W-4 from 2020 or later)', () => {
  it('annual percentage method tables', () => {
    expect(t.northDakotaIncomeTax(60000, 'single')).toBeCloseTo(46.31, 2); // 1.95% × (60,000 − 57,625)
    expect(t.northDakotaIncomeTax(150000, 'single')).toBeCloseTo(1801.31, 2);
    expect(t.northDakotaIncomeTax(100000, 'married')).toBeCloseTo(828.75, 2); // 1.95% × (100,000 − 57,500)
    expect(t.northDakotaIncomeTax(100000, 'hoh')).toBeCloseTo(419.74, 2); // 1.95% × (100,000 − 78,475)
    expect(t.northDakotaIncomeTax(300000, 'single')).toBeCloseTo(3916.09 + 0.025 * (300000 - 258450), 2);
    expect(t.northDakotaIncomeTax(57000, 'single')).toBe(0);
  });
});

describe('Vermont (GB-1210-2026)', () => {
  it('agrees with the guide’s example: married, $1,800 weekly, two allowances → $45.77', () => {
    expect(Math.abs(t.vermontIncomeTax(1800 * 52, 'married', 2) / 52 - 45.77)).toBeLessThan(0.05);
  });

  it('annual tables after $5,400 per allowance', () => {
    expect(t.vermontIncomeTax(60000, 'single', 1)).toBeCloseTo(1697.61, 2); // 3.35% × (54,600 − 3,925)
    expect(t.vermontIncomeTax(150000, 'single', 1)).toBeCloseTo(7813.43, 2); // 6,458.73 + 7.6% × 17,825
    expect(t.vermontIncomeTax(100000, 'married', 2)).toBeCloseTo(2593.74, 2); // 3.35% × (89,200 − 11,775)
    expect(t.vermontIncomeTax(60000, 'hoh', 2)).toBeCloseTo(0.0335 * (60000 - 10800 - 3925), 2);
  });
});
