import { generateKeyPairSync, createVerify } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { calculators } from '@/lib/calculator-meta';
import {
  buildReport,
  byPath,
  defaultRange,
  extractRegistry,
  familyOf,
  jwtClaims,
  normalizeRows,
  parseServiceAccount,
  pathOf,
  queryBody,
  queryUrl,
  renderReport,
  signJwt,
} from '../../scripts/lib/gsc-core.mjs';

const REGISTRY_DIR = path.join(process.cwd(), 'src', 'lib', 'registry', 'calculators');
const parsedRegistry = readdirSync(REGISTRY_DIR)
  .filter((f) => f.endsWith('.ts'))
  .flatMap((f) => extractRegistry(readFileSync(path.join(REGISTRY_DIR, f), 'utf8')));

describe('registry extraction used by the report', () => {
  it('finds exactly the calculators the real registry has, with the same statuses', () => {
    const real = calculators.map((c) => `${c.slug}:${c.status}`).sort();
    const parsed = parsedRegistry.map((c) => `${c.slug}:${c.status}`).sort();
    expect(parsed).toEqual(real);
  });
  it('captures merge targets', () => {
    const merged = parsedRegistry.filter((c) => c.status === 'merged');
    expect(merged.length).toBeGreaterThan(50);
    expect(merged.every((c) => c.mergedInto)).toBe(true);
    expect(parsedRegistry.find((c) => c.slug === 'gst-calculator')?.mergedInto).toBe('vat-calculator');
  });
});

describe('service account token', () => {
  it('signs an RS256 JWT Google can verify', () => {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const pem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
    const claims = jwtClaims('reader@project.iam.gserviceaccount.com', 1_800_000_000);
    expect(claims).toEqual({ iss: 'reader@project.iam.gserviceaccount.com', scope: 'https://www.googleapis.com/auth/webmasters.readonly', aud: 'https://oauth2.googleapis.com/token', iat: 1_800_000_000, exp: 1_800_003_600 });
    const jwt = signJwt(claims, pem);
    const [head, body, sig] = jwt.split('.');
    expect(JSON.parse(Buffer.from(head, 'base64url').toString())).toEqual({ alg: 'RS256', typ: 'JWT' });
    expect(JSON.parse(Buffer.from(body, 'base64url').toString())).toEqual(claims);
    expect(createVerify('RSA-SHA256').update(`${head}.${body}`).verify(publicKey, Buffer.from(sig, 'base64url'))).toBe(true);
  });
  it('rejects a key file that is not a service account key', () => {
    expect(() => parseServiceAccount('nope')).toThrow(/not valid JSON/);
    expect(() => parseServiceAccount('{"type":"authorized_user"}')).toThrow(/client_email and private_key/);
    expect(parseServiceAccount('{"client_email":"a@b","private_key":"k"}')).toEqual({ clientEmail: 'a@b', privateKey: 'k' });
  });
});

describe('query construction', () => {
  it('defaults to the 28 days ending three days ago', () => {
    expect(defaultRange(new Date('2026-11-16T10:00:00Z'))).toEqual({ startDate: '2026-10-17', endDate: '2026-11-13' });
    expect(defaultRange(new Date('2026-01-02T00:00:00Z'), 7)).toEqual({ startDate: '2025-12-24', endDate: '2025-12-30' }); // crosses the year
    expect(defaultRange(new Date('2026-11-10T00:00:00Z'), 28, 0).endDate).toBe('2026-11-10');
  });
  it('builds the request', () => {
    expect(queryUrl('sc-domain:quickbizcalc.com')).toBe('https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aquickbizcalc.com/searchAnalytics/query');
    expect(queryBody({ startDate: '2026-10-17', endDate: '2026-11-13', dimensions: ['page'] })).toEqual({ startDate: '2026-10-17', endDate: '2026-11-13', dimensions: ['page'], rowLimit: 25000, startRow: 0, dataState: 'final' });
  });
  it('flattens API rows', () => {
    expect(normalizeRows([{ keys: ['https://www.quickbizcalc.com/', 'paycheck'], clicks: 2, impressions: 40, ctr: 0.05, position: 7.5 }], ['page', 'query'])).toEqual([{ page: 'https://www.quickbizcalc.com/', query: 'paycheck', clicks: 2, impressions: 40, ctr: 0.05, position: 7.5 }]);
    expect(normalizeRows(undefined, ['page'])).toEqual([]);
  });
});

describe('report', () => {
  const U = 'https://www.quickbizcalc.com';
  const row = (p: string, impressions: number, clicks: number, position: number) => ({ page: `${U}${p}`, impressions, clicks, ctr: impressions ? clicks / impressions : 0, position });
  const registry = [
    { slug: 'hourly-paycheck-calculator', status: 'published', mergedInto: null },
    { slug: 'overtime-calculator', status: 'published', mergedInto: null },
    { slug: 'vat-calculator', status: 'published', mergedInto: null },
    { slug: 'invoice-generator', status: 'published', mergedInto: null },
    { slug: 'gst-calculator', status: 'merged', mergedInto: 'vat-calculator' },
    { slug: 'runway-calculator', status: 'draft', mergedInto: null },
  ];
  const pages = [
    row('/calculators/hourly-paycheck-calculator', 3000, 12, 6.2), // first page, CTR 0.4%
    row('/calculators/hourly-paycheck-calculator?rate=25', 100, 1, 9), // same page with a query string
    row('/calculators/overtime-calculator', 400, 6, 14.5), // striking distance
    row('/calculators/vat-calculator', 4, 0, 55),
    row('/calculators/gst-calculator', 30, 0, 40), // merged, still showing
    row('/calculators/hr-roi-calculator', 12, 0, 60), // deleted
    row('/salary/20-an-hour', 250, 3, 18),
    row('/', 80, 5, 3),
  ];
  const report = buildReport(pages, registry);

  it('normalises paths and groups page families', () => {
    expect(pathOf(`${U}/calculators/x/?a=1#h`)).toBe('/calculators/x');
    expect(pathOf(`${U}/`)).toBe('/');
    expect(familyOf('/calculators/x/embed')).toBe('embed');
    expect(familyOf('/salary/20-an-hour')).toBe('salary');
    expect(byPath(pages).get('/calculators/hourly-paycheck-calculator')).toMatchObject({ impressions: 3100, clicks: 13 });
    expect(report.byFamily.calculator.impressions).toBe(3100 + 400 + 4 + 30 + 12);
    expect(report.byFamily.salary).toMatchObject({ pages: 1, impressions: 250 });
  });
  it('weights position by impressions', () => {
    const p = byPath(pages).get('/calculators/hourly-paycheck-calculator')!;
    expect(p.position).toBeCloseTo((6.2 * 3000 + 9 * 100) / 3100, 6);
    expect(report.total.impressions).toBe(3876);
    expect(report.total.clicks).toBe(27);
  });
  it('sorts published calculators and finds the ones nobody sees', () => {
    expect(report.calculators.map((c) => c.slug)).toEqual(['hourly-paycheck-calculator', 'overtime-calculator', 'vat-calculator', 'invoice-generator']);
    expect(report.notSeen.map((c) => c.slug)).toEqual(['vat-calculator', 'invoice-generator']);
  });
  it('flags striking-distance and low-CTR pages', () => {
    expect(report.strikingDistance.map((c) => c.slug)).toEqual(['overtime-calculator']);
    expect(report.lowCtr.map((c) => c.slug)).toEqual(['hourly-paycheck-calculator']);
  });
  it('lists merged pages still showing and URLs the registry does not know', () => {
    expect(report.mergedStillShowing).toMatchObject([{ slug: 'gst-calculator', mergedInto: 'vat-calculator', impressions: 30 }]);
    expect(report.unknownCalculatorPaths.map((c) => c.path)).toEqual(['/calculators/hr-roi-calculator']);
    expect(report.draftCount).toBe(1);
  });
  it('compares with a previous pull', () => {
    const withPrev = buildReport(pages, registry, [row('/calculators/hourly-paycheck-calculator', 2000, 5, 8), row('/calculators/overtime-calculator', 500, 4, 15)]);
    expect(withPrev.previousTotal).toMatchObject({ impressions: 2500, clicks: 9 });
    expect(withPrev.calculators[0].impressionsChange).toBe(1100);
    expect(withPrev.calculators[1].impressionsChange).toBe(-100);
    expect(report.calculators[0].impressionsChange).toBeNull();
  });
  it('renders Markdown', () => {
    const md = renderReport(report, { site: 'sc-domain:quickbizcalc.com', startDate: '2026-10-17', endDate: '2026-11-13', fetchedAt: '2026-11-16T10:00:00.000Z' });
    expect(md).toContain('# Search Console report: 2026-10-17 to 2026-11-13');
    expect(md).toContain('3,876 impressions, 27 clicks');
    expect(md).toContain('| `overtime-calculator` | 400 | 6 | 1.50% | 14.5 |');
    expect(md).toContain('| `gst-calculator` | `vat-calculator` | 30 | 0 |');
    expect(md).toContain('`/calculators/hr-roi-calculator`');
    expect(md).toContain('1 drafts are not listed');
  });
});
