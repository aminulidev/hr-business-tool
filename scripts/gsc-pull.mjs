#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Pull Search Console performance data and write a report (Phase 19).
//
//   npm run gsc:pull                 last 28 days (ending 3 days ago)
//   npm run gsc:pull -- --days 90    a longer window
//   npm run gsc:pull -- --end 2026-11-10
//
// Needs a Google service account that has been added as a user of the Search
// Console property. Provide its JSON key in one of two ways:
//   GSC_SERVICE_ACCOUNT_FILE   path to the key file (keep it outside the repo)
//   GSC_SERVICE_ACCOUNT_JSON   the key's JSON text (for CI secrets)
// and optionally GSC_SITE_URL (default sc-domain:quickbizcalc.com; a URL-prefix
// property is written like https://www.quickbizcalc.com/).
//
// Writes data/gsc/<end-date>.json and data/gsc/report-<end-date>.md.
// Setup steps are in docs/measurement.md.
// ---------------------------------------------------------------------------
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { defaultRange, jwtClaims, normalizeRows, parseServiceAccount, queryBody, queryUrl, signJwt, TOKEN_URL } from './lib/gsc-core.mjs';
import { writeReport } from './gsc-report.mjs';

const OUT_DIR = path.join(process.cwd(), 'data', 'gsc');

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

async function loadKey() {
  if (process.env.GSC_SERVICE_ACCOUNT_JSON) return parseServiceAccount(process.env.GSC_SERVICE_ACCOUNT_JSON);
  if (process.env.GSC_SERVICE_ACCOUNT_FILE) return parseServiceAccount(await readFile(process.env.GSC_SERVICE_ACCOUNT_FILE, 'utf8'));
  throw new Error('Set GSC_SERVICE_ACCOUNT_FILE (path to the key) or GSC_SERVICE_ACCOUNT_JSON. See docs/measurement.md.');
}

async function accessToken({ clientEmail, privateKey }) {
  const assertion = signJwt(jwtClaims(clientEmail, Math.floor(Date.now() / 1000)), privateKey);
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  });
  const json = await res.json();
  if (!res.ok || !json.access_token) throw new Error(`Google refused the service account: ${json.error_description || json.error || res.status}`);
  return json.access_token;
}

async function query(token, site, range, dimensions, maxRows = 50000) {
  const rows = [];
  for (let startRow = 0; startRow < maxRows; startRow += 25000) {
    const res = await fetch(queryUrl(site), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(queryBody({ ...range, dimensions, startRow })),
    });
    const json = await res.json();
    if (!res.ok) {
      const hint = res.status === 403 ? ` Add the service account email as a user of the property in Search Console, and check GSC_SITE_URL (${site}).` : '';
      throw new Error(`Search Console query failed (${res.status}): ${json.error?.message || 'unknown error'}.${hint}`);
    }
    const page = normalizeRows(json.rows, dimensions);
    rows.push(...page);
    if (page.length < 25000) break;
  }
  return rows;
}

async function main() {
  const site = process.env.GSC_SITE_URL || 'sc-domain:quickbizcalc.com';
  const days = Number(arg('days') ?? 28);
  if (!Number.isInteger(days) || days < 1 || days > 480) throw new Error('--days must be a whole number between 1 and 480');
  const end = arg('end');
  if (end && !/^\d{4}-\d{2}-\d{2}$/.test(end)) throw new Error('--end must look like 2026-11-10');
  const range = end ? defaultRange(new Date(`${end}T00:00:00Z`), days, 0) : defaultRange(new Date(), days);

  const token = await accessToken(await loadKey());
  console.log(`Pulling ${site} for ${range.startDate} to ${range.endDate}…`);
  const pages = await query(token, site, range, ['page']);
  const queries = await query(token, site, range, ['query'], 25000);
  const pageQueries = await query(token, site, range, ['page', 'query'], 25000);

  await mkdir(OUT_DIR, { recursive: true });
  const file = path.join(OUT_DIR, `${range.endDate}.json`);
  const fetchedAt = new Date().toISOString();
  await writeFile(file, JSON.stringify({ site, ...range, days, fetchedAt, pages, queries, pageQueries }, null, 1));
  console.log(`Saved ${pages.length} pages, ${queries.length} queries → ${path.relative(process.cwd(), file)}`);

  const reportFile = await writeReport(file);
  console.log(`Report → ${path.relative(process.cwd(), reportFile)}`);
}

main().catch((err) => {
  console.error(`gsc-pull: ${err.message}`);
  process.exit(1);
});
