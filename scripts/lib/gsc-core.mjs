// ---------------------------------------------------------------------------
// Search Console pull and report — pure logic (Phase 19). No network or file
// access here, so everything in this file is unit-tested from
// src/lib/gsc-core.test.ts. The command-line wrappers are gsc-pull.mjs and
// gsc-report.mjs.
// ---------------------------------------------------------------------------
import { createSign } from 'node:crypto';

export const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
export const TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const SITE_HOST = 'www.quickbizcalc.com';

const b64url = (input) => Buffer.from(input).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

/** Claims for a service-account token request, valid for one hour */
export function jwtClaims(clientEmail, nowSeconds) {
  return { iss: clientEmail, scope: GSC_SCOPE, aud: TOKEN_URL, iat: nowSeconds, exp: nowSeconds + 3600 };
}

/** Sign claims as an RS256 JWT with the service account's private key (PEM) */
export function signJwt(claims, privateKeyPem) {
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(claims));
  const signature = createSign('RSA-SHA256').update(`${head}.${body}`).sign(privateKeyPem);
  return `${head}.${body}.${b64url(signature)}`;
}

/** Accepts the service-account JSON as text and returns the two fields that matter */
export function parseServiceAccount(json) {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('The service account key is not valid JSON');
  }
  if (!parsed.client_email || !parsed.private_key) throw new Error('The service account key needs client_email and private_key');
  return { clientEmail: parsed.client_email, privateKey: parsed.private_key };
}

const iso = (d) => d.toISOString().slice(0, 10);

/**
 * Search Console data lags two to three days. The default window is the 28 days ending three
 * days before `today`, which always covers four whole weeks.
 */
export function defaultRange(today, days = 28, lagDays = 3) {
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - lagDays));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return { startDate: iso(start), endDate: iso(end) };
}

export const queryUrl = (siteUrl) => `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;

export function queryBody({ startDate, endDate, dimensions, startRow = 0, rowLimit = 25000 }) {
  return { startDate, endDate, dimensions, rowLimit, startRow, dataState: 'final' };
}

/** API rows ({ keys, clicks, impressions, ctr, position }) → flat objects keyed by dimension name */
export function normalizeRows(rows, dimensions) {
  return (rows ?? []).map((r) => {
    const out = {};
    dimensions.forEach((d, i) => { out[d] = r.keys?.[i] ?? ''; });
    out.clicks = r.clicks ?? 0;
    out.impressions = r.impressions ?? 0;
    out.ctr = r.ctr ?? 0;
    out.position = r.position ?? 0;
    return out;
  });
}

// ───────────────────────── registry

/**
 * Slug, status and merge target for every calculator, read from the registry source text.
 * The registry is TypeScript and these scripts are plain Node, so this parses the files instead
 * of importing them; gsc-core.test.ts fails if the result ever disagrees with the real registry.
 */
export function extractRegistry(sourceText) {
  const out = [];
  const text = sourceText.replace(/\r\n/g, '\n');
  const re = /slug: '([a-z0-9-]+)',\n\s*status: '([a-z]+)',(?:\n\s*mergedInto: '([a-z0-9-]+)',)?/g;
  let m;
  while ((m = re.exec(text))) out.push({ slug: m[1], status: m[2], mergedInto: m[3] ?? null });
  return out;
}

// ───────────────────────── report

/** Path of a Search Console page URL, without query, hash or trailing slash */
export function pathOf(url) {
  try {
    const u = new URL(url);
    return u.pathname.replace(/\/+$/, '') || '/';
  } catch {
    return url;
  }
}

export function familyOf(path) {
  if (path === '/') return 'home';
  if (/^\/calculators\/[^/]+\/embed$/.test(path)) return 'embed';
  if (path.startsWith('/calculators/')) return 'calculator';
  if (path.startsWith('/salary/')) return 'salary';
  if (path.startsWith('/blog')) return 'blog';
  if (path.startsWith('/category/')) return 'category';
  return 'other';
}

const sum = (rows) => {
  const impressions = rows.reduce((s, r) => s + r.impressions, 0);
  const clicks = rows.reduce((s, r) => s + r.clicks, 0);
  // Position is averaged by impressions, as Search Console does.
  const position = impressions > 0 ? rows.reduce((s, r) => s + r.position * r.impressions, 0) / impressions : 0;
  return { impressions, clicks, ctr: impressions > 0 ? clicks / impressions : 0, position };
};

/** Merge rows that are the same path (http/https, www/non-www, query strings) */
export function byPath(pageRows) {
  const groups = new Map();
  for (const r of pageRows) {
    const p = pathOf(r.page);
    if (!groups.has(p)) groups.set(p, []);
    groups.get(p).push(r);
  }
  return new Map([...groups.entries()].map(([p, rows]) => [p, sum(rows)]));
}

export const THRESHOLDS = {
  /** Impressions below which a page is "barely seen" */
  lowImpressions: 10,
  /** Positions 8–20: page two or the bottom of page one, where a better page moves up */
  strikingMin: 8,
  strikingMax: 20,
  strikingImpressions: 50,
  /** A first-page result with this many impressions should earn more than this CTR */
  lowCtrImpressions: 100,
  lowCtrPosition: 10,
  lowCtr: 0.01,
};

/**
 * @param pageRows normalized rows with a `page` dimension for the current window
 * @param registry output of extractRegistry over all registry files
 * @param {any[] | null} [previousPageRows] the same for the previous pull, or null
 */
export function buildReport(pageRows, registry, previousPageRows = null) {
  const now = byPath(pageRows);
  const before = previousPageRows ? byPath(previousPageRows) : null;
  const stat = (map, path) => map?.get(path) ?? { impressions: 0, clicks: 0, ctr: 0, position: 0 };
  const total = sum([...now.values()]);
  const previousTotal = before ? sum([...before.values()]) : null;

  const families = {};
  for (const [path, s] of now) {
    const f = familyOf(path);
    (families[f] ??= []).push(s);
  }
  const byFamily = Object.fromEntries(Object.entries(families).map(([f, rows]) => [f, { pages: rows.length, ...sum(rows) }]));

  const calculators = registry
    .filter((c) => c.status === 'published')
    .map((c) => {
      const path = `/calculators/${c.slug}`;
      const s = stat(now, path);
      const prev = before ? stat(before, path) : null;
      return { slug: c.slug, path, ...s, impressionsChange: prev ? s.impressions - prev.impressions : null };
    })
    .sort((a, b) => b.impressions - a.impressions);

  const T = THRESHOLDS;
  const known = new Set(registry.map((c) => `/calculators/${c.slug}`));
  const mergedStillShowing = registry
    .filter((c) => c.status === 'merged')
    .map((c) => ({ slug: c.slug, mergedInto: c.mergedInto, ...stat(now, `/calculators/${c.slug}`) }))
    .filter((c) => c.impressions > 0)
    .sort((a, b) => b.impressions - a.impressions);
  const unknownCalculatorPaths = [...now.entries()]
    .filter(([path]) => familyOf(path) === 'calculator' && !known.has(path))
    .map(([path, s]) => ({ path, ...s }))
    .sort((a, b) => b.impressions - a.impressions);

  return {
    total,
    previousTotal,
    byFamily,
    calculators,
    notSeen: calculators.filter((c) => c.impressions < T.lowImpressions),
    strikingDistance: calculators.filter((c) => c.impressions >= T.strikingImpressions && c.position >= T.strikingMin && c.position <= T.strikingMax),
    lowCtr: calculators.filter((c) => c.impressions >= T.lowCtrImpressions && c.position > 0 && c.position <= T.lowCtrPosition && c.ctr < T.lowCtr),
    mergedStillShowing,
    unknownCalculatorPaths,
    draftCount: registry.filter((c) => c.status === 'draft').length,
  };
}

const n = (x) => Math.round(x).toLocaleString('en-US');
const pct = (x) => `${(x * 100).toFixed(2)}%`;
const pos = (x) => (x > 0 ? x.toFixed(1) : '—');
const table = (headers, rows) => (rows.length ? [`| ${headers.join(' | ')} |`, `|${headers.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n') : '_None._');
const signed = (x) => (x === null ? '' : x > 0 ? `+${n(x)}` : x < 0 ? `−${n(-x)}` : '0');

export function renderReport(report, { site, startDate, endDate, fetchedAt, previousEndDate = null }) {
  const r = report;
  const T = THRESHOLDS;
  const change = r.previousTotal ? ` Previous pull (to ${previousEndDate}): ${n(r.previousTotal.impressions)} impressions, ${n(r.previousTotal.clicks)} clicks.` : '';
  const row = (c) => [`\`${c.slug}\``, n(c.impressions), n(c.clicks), pct(c.ctr), pos(c.position)];
  return [
    `# Search Console report: ${startDate} to ${endDate}`,
    '',
    `Property \`${site}\`, pulled ${fetchedAt}. Positions are averaged by impressions.`,
    '',
    `**Whole site:** ${n(r.total.impressions)} impressions, ${n(r.total.clicks)} clicks, CTR ${pct(r.total.ctr)}, average position ${pos(r.total.position)}.${change}`,
    '',
    '## By page family',
    '',
    table(['Family', 'Pages seen', 'Impressions', 'Clicks', 'CTR', 'Position'], Object.entries(r.byFamily).sort((a, b) => b[1].impressions - a[1].impressions).map(([f, s]) => [f, n(s.pages), n(s.impressions), n(s.clicks), pct(s.ctr), pos(s.position)])),
    '',
    `## Published calculators barely seen (under ${T.lowImpressions} impressions): ${r.notSeen.length} of ${r.calculators.length}`,
    '',
    'Candidates to improve, merge or cut. A page published in the last few weeks belongs here only because it is new.',
    '',
    table(['Calculator', 'Impressions', 'Clicks', 'CTR', 'Position'], r.notSeen.map(row)),
    '',
    `## Striking distance (position ${T.strikingMin}–${T.strikingMax}, at least ${T.strikingImpressions} impressions)`,
    '',
    'Already ranking near the first page: the cheapest wins. Improve the page rather than building a new one.',
    '',
    table(['Calculator', 'Impressions', 'Clicks', 'CTR', 'Position'], r.strikingDistance.map(row)),
    '',
    `## First-page results that few people click (CTR under ${pct(T.lowCtr)})`,
    '',
    'The title or description is not earning the click. Rewrite `metaTitle` and `metaDescription` in the registry.',
    '',
    table(['Calculator', 'Impressions', 'Clicks', 'CTR', 'Position'], r.lowCtr.map(row)),
    '',
    '## Merged pages Google still shows',
    '',
    'These redirect. Impressions here should fall to zero as Google re-crawls; if they persist for months, check the redirect.',
    '',
    table(['Old slug', 'Redirects to', 'Impressions', 'Clicks'], r.mergedStillShowing.map((c) => [`\`${c.slug}\``, `\`${c.mergedInto}\``, n(c.impressions), n(c.clicks)])),
    '',
    '## Calculator URLs Google shows that the registry does not know',
    '',
    'Deleted or never-published pages (now 404), or stray URLs. Expected to fade; if one has real impressions, consider a redirect.',
    '',
    table(['Path', 'Impressions', 'Clicks', 'Position'], r.unknownCalculatorPaths.slice(0, 40).map((c) => [`\`${c.path}\``, n(c.impressions), n(c.clicks), pos(c.position)])),
    '',
    `## All ${r.calculators.length} published calculators`,
    '',
    table(['Calculator', 'Impressions', r.previousTotal ? 'Change' : null, 'Clicks', 'CTR', 'Position'].filter(Boolean), r.calculators.map((c) => [`\`${c.slug}\``, n(c.impressions), r.previousTotal ? signed(c.impressionsChange) : null, n(c.clicks), pct(c.ctr), pos(c.position)].filter((x) => x !== null))),
    '',
    `${r.draftCount} drafts are not listed: they return 404 and cannot appear in Search Console.`,
    '',
  ].join('\n');
}
