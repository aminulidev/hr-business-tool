import { beforeEach, describe, expect, it, vi } from 'vitest';

// The route handlers run here with no Resend key, so nothing leaves the machine, and with the
// filesystem mocked, so nothing is written to the repository.
const files = new Map<string, string>();
vi.mock('fs', () => {
  const promises = {
    readFile: vi.fn(async (p: string) => {
      if (!files.has(p)) throw new Error('ENOENT');
      return files.get(p)!;
    }),
    mkdir: vi.fn(async () => undefined),
    appendFile: vi.fn(async (p: string, data: string) => {
      files.set(p, (files.get(p) ?? '') + data);
    }),
  };
  return { promises, default: { promises } };
});

const post = (body: unknown) => new Request('http://localhost/api/x', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: typeof body === 'string' ? body : JSON.stringify(body) });

async function load<T>(path: string, env: Record<string, string | undefined> = {}): Promise<T> {
  vi.resetModules();
  delete process.env.RESEND_API_KEY;
  delete process.env.RESEND_FROM;
  delete process.env.RESEND_SEGMENT_ID;
  delete process.env.RESEND_AUDIENCE_ID;
  delete process.env.VERCEL;
  for (const [k, v] of Object.entries(env)) if (v !== undefined) process.env[k] = v;
  return (await import(path)) as T;
}
type Route = { POST: (req: Request) => Promise<Response>; GET?: () => Promise<Response> };

beforeEach(() => {
  files.clear();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('POST /api/newsletter', () => {
  it('rejects a bad address and malformed JSON', async () => {
    const { POST } = await load<Route>('./newsletter/route');
    expect((await POST(post({ email: 'nope' }))).status).toBe(400);
    expect((await POST(post('{not json'))).status).toBe(400);
  });
  it('stores a sign-up locally in development and recognises a repeat', async () => {
    const { POST } = await load<Route>('./newsletter/route');
    const first = await POST(post({ email: 'Pat@Example.com', source: '/calculators/vat-calculator' }));
    expect(first.status).toBe(200);
    expect(await first.json()).toMatchObject({ success: true, alreadySubscribed: false, confirmationSent: false });
    expect([...files.values()].join('')).toContain('"email":"pat@example.com"');
    const again = await POST(post({ email: 'pat@example.com' }));
    expect(await again.json()).toMatchObject({ success: true, alreadySubscribed: true });
    expect([...files.values()].join('').match(/pat@example\.com/g)).toHaveLength(1);
  });
  it('a filled honeypot gets a normal-looking answer and is not stored', async () => {
    const { POST } = await load<Route>('./newsletter/route');
    const res = await POST(post({ email: 'bot@example.com', website: 'http://spam.example' }));
    expect(res.status).toBe(200);
    expect(files.size).toBe(0);
  });
  it('on the read-only host with no mail provider it reports failure rather than a false success', async () => {
    const { POST } = await load<Route>('./newsletter/route', { VERCEL: '1' });
    const res = await POST(post({ email: 'pat@example.com' }));
    expect(res.status).toBe(503);
    expect(files.size).toBe(0);
  });
  it('does not expose a subscriber count', async () => {
    const { GET } = await load<Route>('./newsletter/route');
    expect(await (await GET!()).json()).toEqual({ ok: true, service: 'newsletter' });
  });
});

describe('POST /api/feedback', () => {
  it('accepts a vote for a published calculator and refuses unknown pages', async () => {
    const { POST } = await load<Route>('./feedback/route');
    expect((await POST(post({ slug: 'hourly-paycheck-calculator', helpful: true }))).status).toBe(200);
    expect((await POST(post({ slug: 'not-a-calculator', helpful: true }))).status).toBe(400);
    expect((await POST(post({ slug: 'hr-roi-calculator', helpful: true }))).status).toBe(400); // deleted draft
    expect((await POST(post('nope'))).status).toBe(400);
  });
  it('keeps a comment locally in development', async () => {
    const { POST } = await load<Route>('./feedback/route');
    const res = await POST(post({ slug: 'hourly-paycheck-calculator', helpful: false, message: 'NY looks off' }));
    expect(res.status).toBe(200);
    expect([...files.values()].join('')).toContain('NY looks off');
  });
  it('writes nothing on the read-only host', async () => {
    const { POST } = await load<Route>('./feedback/route', { VERCEL: '1' });
    expect((await POST(post({ slug: 'hourly-paycheck-calculator', helpful: false, message: 'x' }))).status).toBe(200);
    expect(files.size).toBe(0);
  });
});

describe('POST /api/contact', () => {
  it('validates the fields', async () => {
    const { POST } = await load<Route>('./contact/route');
    expect((await POST(post({ name: 'A', email: 'a@example.com', subject: 'Hi' }))).status).toBe(400);
    expect((await POST(post({ name: 'A', email: 'not-an-email', subject: 'Hi', message: 'Hello' }))).status).toBe(400);
    expect((await POST(post('{'))).status).toBe(400);
  });
  it('accepts a complete message when no mail provider is configured (development)', async () => {
    const { POST } = await load<Route>('./contact/route');
    const res = await POST(post({ name: 'A', email: 'a@example.com', subject: 'Hi', message: 'Hello' }));
    expect(res.status).toBe(200);
  });
});
