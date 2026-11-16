import { describe, expect, it, vi } from 'vitest';
import { buildEmbedCode, embedCreditUrl, embedFrameUrl, EMBED_LINK_REL } from '@/lib/embed';
import { feedbackSubject, parseFeedback, shouldNotifyOwner } from './feedback';
import { escapeHtml, escapeMultiline } from './mailer';
import { parseSubscription, subscribe } from './newsletter';

describe('embed snippet', () => {
  const code = buildEmbedCode({ slug: 'hourly-paycheck-calculator', title: 'Hourly Paycheck Calculator' });
  it('frames the embed route on the canonical host', () => {
    expect(embedFrameUrl('hourly-paycheck-calculator')).toBe('https://www.quickbizcalc.com/calculators/hourly-paycheck-calculator/embed');
    expect(code).toContain('src="https://www.quickbizcalc.com/calculators/hourly-paycheck-calculator/embed"');
    expect(code).toContain('width="900"');
    expect(code).toContain('height="700"');
  });
  it('adds a visible credit link outside the iframe, tagged for referral tracking', () => {
    expect(embedCreditUrl('hourly-paycheck-calculator')).toBe('https://www.quickbizcalc.com/calculators/hourly-paycheck-calculator?ref=embed');
    const afterFrame = code.split('</iframe>')[1];
    expect(afterFrame).toContain('href="https://www.quickbizcalc.com/calculators/hourly-paycheck-calculator?ref=embed"');
    expect(afterFrame).toContain('>QuickBizCalc</a>'); // branded anchor text, not a keyword
    expect(afterFrame).not.toMatch(/display:\s*none|visibility:\s*hidden|font-size:\s*0/);
  });
  it('the credit link is nofollow, per the link-spam policy on widget links', () => {
    expect(EMBED_LINK_REL).toContain('nofollow');
    expect(code).toContain(`rel="${EMBED_LINK_REL}"`);
  });
  it('escapes the title and clamps the size', () => {
    const odd = buildEmbedCode({ slug: 'x', title: 'A "quoted" <title>', width: 99999, height: -5 });
    expect(odd).toContain('title="A &quot;quoted&quot; &lt;title&gt;"');
    expect(odd).toContain('width="1400"');
    expect(odd).toContain('height="400"');
    expect(buildEmbedCode({ slug: 'x', title: 'T', width: NaN }).includes('width="900"')).toBe(true);
  });
});

describe('newsletter sign-up', () => {
  it('validates and normalises the address', () => {
    expect(parseSubscription({ email: '  Pat@Example.COM ', source: '/calculators/x' })).toEqual({ ok: true, email: 'pat@example.com', source: '/calculators/x', bot: false });
    expect(parseSubscription({ email: 'nope' })).toMatchObject({ ok: false, status: 400 });
    expect(parseSubscription({ email: 'a@b' })).toMatchObject({ ok: false });
    expect(parseSubscription(null)).toMatchObject({ ok: false });
    expect(parseSubscription({ email: `${'a'.repeat(250)}@example.com` })).toMatchObject({ ok: false, error: 'Email address is too long' });
    expect(parseSubscription({ email: 'pat@example.com', source: 'https://evil.example/x' })).toMatchObject({ source: 'unknown' });
  });
  it('treats a filled honeypot as a bot', () => {
    expect(parseSubscription({ email: 'pat@example.com', website: 'http://spam' })).toEqual({ ok: true, bot: true });
  });
  it('stores in the audience first and sends the welcome only for a new contact', async () => {
    const sendWelcome = vi.fn(async () => {});
    const notifyOwner = vi.fn(async () => true);
    expect(await subscribe('pat@example.com', '/x', { addToAudience: async () => 'added', notifyOwner, sendWelcome })).toEqual({ stored: 'audience', alreadySubscribed: false });
    expect(sendWelcome).toHaveBeenCalledOnce();
    expect(notifyOwner).not.toHaveBeenCalled();
    expect(await subscribe('pat@example.com', '/x', { addToAudience: async () => 'exists', sendWelcome })).toEqual({ stored: 'audience', alreadySubscribed: true });
    expect(sendWelcome).toHaveBeenCalledOnce();
  });
  it('falls back to emailing the owner, then to a local file', async () => {
    const failing = async () => { throw new Error('audience down'); };
    expect(await subscribe('pat@example.com', '/x', { addToAudience: failing, notifyOwner: async () => true })).toEqual({ stored: 'owner-email', alreadySubscribed: false });
    const appendLocal = vi.fn(async () => 'added' as const);
    expect(await subscribe('pat@example.com', '/x', { notifyOwner: async () => false, appendLocal, now: () => new Date('2026-11-16T00:00:00Z') })).toEqual({ stored: 'local', alreadySubscribed: false });
    expect(appendLocal).toHaveBeenCalledWith({ email: 'pat@example.com', source: '/x', ts: '2026-11-16T00:00:00.000Z' });
  });
  it('reports failure instead of pretending when nothing could store the address', async () => {
    expect(await subscribe('pat@example.com', '/x', {})).toEqual({ stored: null, alreadySubscribed: false });
    expect(await subscribe('pat@example.com', '/x', { notifyOwner: async () => false, appendLocal: async () => { throw new Error('read-only filesystem'); } })).toEqual({ stored: null, alreadySubscribed: false });
  });
  it('a failed welcome email does not undo the sign-up', async () => {
    expect(await subscribe('pat@example.com', '/x', { addToAudience: async () => 'added', sendWelcome: async () => { throw new Error('no verified sender'); } })).toEqual({ stored: 'audience', alreadySubscribed: false });
  });
});

describe('calculator feedback', () => {
  const known = (slug: string) => slug === 'hourly-paycheck-calculator';
  const now = () => new Date('2026-11-16T12:00:00Z');
  it('accepts votes for known calculators only', () => {
    expect(parseFeedback({ slug: 'hourly-paycheck-calculator', helpful: true }, known, now)).toEqual({ ok: true, record: { slug: 'hourly-paycheck-calculator', helpful: true, message: undefined, ts: '2026-11-16T12:00:00.000Z' } });
    expect(parseFeedback({ slug: 'made-up', helpful: true }, known)).toMatchObject({ ok: false, error: 'Unknown calculator' });
    expect(parseFeedback({ slug: 'hourly-paycheck-calculator', helpful: 'yes' }, known)).toMatchObject({ ok: false });
    expect(parseFeedback('nope', known)).toMatchObject({ ok: false });
  });
  it('trims and caps the comment', () => {
    const r = parseFeedback({ slug: 'hourly-paycheck-calculator', helpful: false, message: `  ${'x'.repeat(1500)}  ` }, known, now);
    expect(r.ok && r.record.message?.length).toBe(1000);
    expect(parseFeedback({ slug: 'hourly-paycheck-calculator', helpful: false, message: 'x'.repeat(5001) }, known)).toMatchObject({ ok: false, error: 'Message too long' });
    const blank = parseFeedback({ slug: 'hourly-paycheck-calculator', helpful: true, message: '   ' }, known, now);
    expect(blank.ok && blank.record.message).toBeUndefined();
  });
  it('emails the owner for comments and thumbs-down, not for a bare thumbs-up', () => {
    const base = { slug: 'hourly-paycheck-calculator', ts: '' };
    expect(shouldNotifyOwner({ ...base, helpful: true })).toBe(false);
    expect(shouldNotifyOwner({ ...base, helpful: false })).toBe(true);
    expect(shouldNotifyOwner({ ...base, helpful: true, message: 'The NY rate looks off' })).toBe(true);
    expect(feedbackSubject({ ...base, helpful: false })).toBe('[Feedback] Not helpful: hourly-paycheck-calculator');
    expect(feedbackSubject({ ...base, helpful: null, message: 'hi' })).toBe('[Feedback] Comment: hourly-paycheck-calculator');
  });
});

describe('email escaping', () => {
  it('neutralises HTML in anything a visitor typed', () => {
    expect(escapeHtml('<img src=x onerror=alert(1)> & "q"')).toBe('&lt;img src=x onerror=alert(1)&gt; &amp; &quot;q&quot;');
    expect(escapeMultiline('line 1\n<b>line 2</b>')).toBe('line 1<br>&lt;b&gt;line 2&lt;/b&gt;');
    expect(escapeHtml(undefined)).toBe('');
  });
});
