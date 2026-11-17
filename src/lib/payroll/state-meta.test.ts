import { describe, expect, it } from 'vitest';
import { STATE_CODES, STATE_META } from './state-meta';
import { STATE_CODES as PAGE_CODES, STATE_PAYCHECK_PAGES } from './state-pages';

// state-meta.ts is the small copy of the state facts that ships to the browser.
// It must say exactly what the article data says.

describe('state-meta agrees with STATE_PAYCHECK_PAGES', () => {
  it('lists the same states in the same order', () => {
    expect(STATE_CODES).toEqual(PAGE_CODES);
  });

  it.each(PAGE_CODES)('%s: name, slug, allowance input and minimum wage', (code) => {
    const page = STATE_PAYCHECK_PAGES[code];
    expect(STATE_META[code]).toEqual({
      code: page.code,
      name: page.name,
      slug: page.slug,
      allowances: page.allowances,
      minimumWage: page.minimumWage,
    });
  });
});
