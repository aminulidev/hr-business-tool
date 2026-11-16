#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Turn a saved Search Console pull into a Markdown report (Phase 19).
//
//   npm run gsc:report                       the newest pull in data/gsc
//   npm run gsc:report -- data/gsc/2026-11-13.json
//
// The report joins the pull with the calculator registry: which published
// pages nobody sees, which are within reach of the first page, which earn
// impressions but no clicks, and which old URLs Google still shows.
// ---------------------------------------------------------------------------
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildReport, extractRegistry, renderReport } from './lib/gsc-core.mjs';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'data', 'gsc');
const REGISTRY_DIR = path.join(ROOT, 'src', 'lib', 'registry', 'calculators');
const PULL_FILE = /^\d{4}-\d{2}-\d{2}\.json$/;

export async function loadRegistry() {
  const files = (await readdir(REGISTRY_DIR)).filter((f) => f.endsWith('.ts'));
  const parts = await Promise.all(files.map((f) => readFile(path.join(REGISTRY_DIR, f), 'utf8')));
  return parts.flatMap(extractRegistry);
}

async function pulls() {
  try {
    return (await readdir(OUT_DIR)).filter((f) => PULL_FILE.test(f)).sort();
  } catch {
    return [];
  }
}

/** Write report-<end>.md next to the pull and return its path */
export async function writeReport(pullFile) {
  const pull = JSON.parse(await readFile(pullFile, 'utf8'));
  const all = await pulls();
  // Compare with the most recent earlier pull of the same window length, if there is one.
  const earlier = all.filter((f) => f < path.basename(pullFile)).reverse();
  let previous = null;
  for (const f of earlier) {
    const candidate = JSON.parse(await readFile(path.join(OUT_DIR, f), 'utf8'));
    if (candidate.days === pull.days) {
      previous = candidate;
      break;
    }
  }
  const report = buildReport(pull.pages, await loadRegistry(), previous?.pages ?? null);
  const markdown = renderReport(report, { site: pull.site, startDate: pull.startDate, endDate: pull.endDate, fetchedAt: pull.fetchedAt, previousEndDate: previous?.endDate ?? null });
  const out = path.join(path.dirname(pullFile), `report-${pull.endDate}.md`);
  await writeFile(out, markdown);
  return out;
}

async function main() {
  let target = process.argv[2];
  if (!target) {
    const all = await pulls();
    if (!all.length) throw new Error('No pulls in data/gsc yet. Run `npm run gsc:pull` first.');
    target = path.join(OUT_DIR, all[all.length - 1]);
  }
  const out = await writeReport(path.resolve(target));
  console.log(`Report → ${path.relative(ROOT, out)}`);
}

// Run only when called directly, not when gsc-pull.mjs imports writeReport.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(`gsc-report: ${err.message}`);
    process.exit(1);
  });
}
