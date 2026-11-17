import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { FEDERAL_BRACKETS, FEDERAL_STANDARD_DEDUCTIONS, SOCIAL_SECURITY_WAGE_BASE } from './federal-tax';

// The calculators must read tax figures from the paycheck engine, not carry a
// typed copy. Nine components each held their own brackets and three held their
// own table of state rates until November 2026; the state tables had gone stale
// while the engine was kept current. This test reads the component sources and
// fails if the site year's federal figures, or a table of state rates, are typed
// into one again.

const DIR = path.join(process.cwd(), 'src', 'components', 'calculators');
// HubPage is the home page, not a calculator: it quotes the wage base in a paragraph of copy, and
// importing the engine there would add it to the home page bundle. docs/tax-year-rollover.md lists it.
const COPY_ONLY = new Set(['HubPage.tsx']);
const files = readdirSync(DIR).filter((f) => f.endsWith('.tsx') && !COPY_ONLY.has(f));
const read = (f: string) => readFileSync(path.join(DIR, f), 'utf8');

const withCommas = (n: number) => n.toLocaleString('en-US');
/** A number as it would be typed in code (16100) or in copy (16,100), not as part of a longer number */
const typed = (n: number) => new RegExp(`(?<![\\d.,])(${n}|${withCommas(n).replace(/,/g, ',')})(?![\\d])`);

describe('calculator components hold no typed tax figures', () => {
  // Distinctive federal figures of the site's tax year: standard deductions, the Social Security
  // wage base and every bracket threshold above $10,000 (small round numbers appear for other reasons).
  const figures = [
    ...new Set([
      ...Object.values(FEDERAL_STANDARD_DEDUCTIONS),
      SOCIAL_SECURITY_WAGE_BASE,
      ...Object.values(FEDERAL_BRACKETS).flatMap((list) => list.map((b) => b.min)),
    ]),
  ].filter((n) => n > 10000 && n % 10000 !== 0);

  it('checks a meaningful set of figures and files', () => {
    expect(figures.length).toBeGreaterThan(15);
    expect(files.length).toBeGreaterThan(80);
  });

  it('no component types a federal bracket threshold, standard deduction or the Social Security wage base', () => {
    const problems: string[] = [];
    for (const f of files) {
      const source = read(f);
      for (const n of figures) {
        if (typed(n).test(source)) problems.push(`${f}: ${withCommas(n)} is typed in the file; import it from @/lib/payroll/federal-tax`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('no component carries its own table of state income tax rates', () => {
    const problems: string[] = [];
    // A table of states: several "XX: { name: 'State', ... rate" entries in one file
    const entry = /\b[A-Z]{2}: \{ name: '[A-Z][a-z]+(?: [A-Z][a-z]+)*',[^}]*\brate\b/g;
    for (const f of files) {
      const hits = read(f).match(entry)?.length ?? 0;
      if (hits >= 5) problems.push(`${f}: ${hits} state rate entries; use @/lib/payroll/state-tax`);
    }
    expect(problems).toEqual([]);
  });
});
