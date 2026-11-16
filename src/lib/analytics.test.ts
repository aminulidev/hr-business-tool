import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanParams, pageContext, track } from './analytics';
import { consentBootstrapScript, consentUpdate, CONSENT_EVENT, CONSENT_KEY, CONSENT_PREFS_KEY, hasAnalyticsConsent, OPT_IN_REGIONS } from './consent';

describe('consentUpdate', () => {
  it('says nothing until the visitor has chosen', () => {
    expect(consentUpdate(null, null)).toBeNull();
    expect(consentUpdate('undecided', null)).toBeNull();
  });
  it('accept and reject', () => {
    expect(consentUpdate('accepted', null)).toEqual({ analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
    expect(consentUpdate('rejected', null)).toEqual({ analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  });
  it('custom preferences are applied per category', () => {
    expect(consentUpdate('custom', '{"analytics":true,"advertising":false}')).toEqual({ analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    expect(consentUpdate('custom', '{"analytics":false,"advertising":true}')?.ad_storage).toBe('granted');
    expect(consentUpdate('custom', 'not json')).toEqual(consentUpdate('rejected', null));
    expect(consentUpdate('custom', null)?.analytics_storage).toBe('denied');
  });
  it('session recording needs an explicit yes', () => {
    expect(hasAnalyticsConsent(null, null)).toBe(false);
    expect(hasAnalyticsConsent('accepted', null)).toBe(true);
    expect(hasAnalyticsConsent('custom', '{"analytics":false}')).toBe(false);
  });
});

describe('consentBootstrapScript, run as the browser would', () => {
  function run(stored: Record<string, string>) {
    const calls: unknown[][] = [];
    const listeners: Record<string, () => void> = {};
    const win: Record<string, unknown> = { addEventListener: (name: string, fn: () => void) => { listeners[name] = fn; } };
    const localStorage = { getItem: (k: string) => stored[k] ?? null };
    // dataLayer.push receives the `arguments` object, as gtag does in the page
    const dataLayer = { push: (args: ArrayLike<unknown>) => calls.push(Array.from(args)) };
    win.dataLayer = dataLayer;
    new Function('window', 'localStorage', 'dataLayer', consentBootstrapScript())(win, localStorage, dataLayer);
    return { calls, listeners, win, stored };
  }
  it('denies by default in Europe and grants elsewhere, in that order', () => {
    const { calls, win } = run({});
    expect(typeof win.gtag).toBe('function');
    expect(calls).toHaveLength(2);
    expect(calls[0].slice(0, 2)).toEqual(['consent', 'default']);
    expect(calls[0][2]).toMatchObject({ analytics_storage: 'denied', ad_storage: 'denied', region: OPT_IN_REGIONS });
    expect(calls[1][2]).toEqual({ analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
    expect(OPT_IN_REGIONS).toContain('DE');
    expect(OPT_IN_REGIONS).toContain('GB');
    expect(OPT_IN_REGIONS).not.toContain('US');
  });
  it('applies a stored rejection before any tag runs', () => {
    const { calls } = run({ [CONSENT_KEY]: 'rejected' });
    expect(calls[2]).toEqual(['consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }]);
  });
  it('reacts when the banner is answered later', () => {
    const { calls, listeners, stored } = run({});
    stored[CONSENT_KEY] = 'custom';
    stored[CONSENT_PREFS_KEY] = '{"analytics":true,"advertising":false}';
    listeners[CONSENT_EVENT]();
    expect(calls[2]).toEqual(['consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }]);
  });
});

describe('track', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('reads the calculator and embed flag from the path', () => {
    expect(pageContext('/calculators/vat-calculator')).toEqual({ calculator: 'vat-calculator', embedded: false });
    expect(pageContext('/calculators/vat-calculator/embed')).toEqual({ calculator: 'vat-calculator', embedded: true });
    expect(pageContext('/newsletter')).toEqual({ calculator: 'none', embedded: false });
  });
  it('drops undefined parameters and truncates long strings', () => {
    expect(cleanParams({ mode: 'retainer', helpful: false, n: 3, skip: undefined, long: 'x'.repeat(300) })).toEqual({ mode: 'retainer', helpful: false, n: 3, long: 'x'.repeat(100) });
  });
  it('sends the event with page context when gtag is present', () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag, location: { pathname: '/calculators/mrr-calculator' } });
    track('mode_change', { mode: 'pricing' });
    expect(gtag).toHaveBeenCalledWith('event', 'mode_change', { calculator: 'mrr-calculator', embedded: false, mode: 'pricing' });
  });
  it('is a no-op without gtag and never throws', () => {
    vi.stubGlobal('window', { location: { pathname: '/' } });
    expect(() => track('share')).not.toThrow();
    vi.stubGlobal('window', { gtag: () => { throw new Error('blocked'); }, location: { pathname: '/' } });
    expect(() => track('share')).not.toThrow();
  });
});
