import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Bundle boundaries (Phase 19). Two import mistakes each cost every visitor a
// megabyte of JavaScript and neither fails the build or shows in a diff:
//
//  1. Importing the slug → component map from a Server Component. The
//     dynamic() calls in it then split nothing, and every calculator is
//     shipped to every calculator page.
//  2. Importing the calculator registry into the site chrome (header, footer,
//     shell), which is on every page. Only the search dialog needs it, and
//     the header loads that on first use.
//
// These tests read the source text, so they run in milliseconds.
// ---------------------------------------------------------------------------

const SRC = path.resolve(__dirname, '..');
const rel = (file: string) => path.relative(SRC, file).replace(/\\/g, '/');

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

const files = sourceFiles(SRC).map((file) => ({ file: rel(file), text: fs.readFileSync(file, 'utf8') }));
const isClient = (text: string) => /^\s*(['"])use client\1/.test(text);

/** import lines that bring in runtime code (not `import type`) from the given module paths */
function runtimeImports(text: string, modules: string[]): string[] {
  const statements = text.match(/^import\s[^;]*?from\s+['"][^'"]+['"]/gm) ?? [];
  return statements.filter((s) => !/^import\s+type\s/.test(s) && modules.some((m) => new RegExp(`from\\s+['"]${m}['"]`).test(s)));
}

describe('the calculator component map', () => {
  it('is imported only by client components', () => {
    const importers = files.filter((f) => /from\s+['"](@\/lib\/registry\/components|\.{1,2}\/(.*\/)?registry\/components|\.\/components)['"]/.test(f.text) && f.file !== 'lib/registry/components.tsx');
    // `./components` only means the map when the importer sits in lib/registry.
    const real = importers.filter((f) => !/from\s+['"]\.\/components['"]/.test(f.text) || f.file.startsWith('lib/registry/'));
    expect(real.map((f) => f.file)).toContain('components/calculators/CalculatorRenderer.tsx');
    expect(real.filter((f) => !isClient(f.text)).map((f) => f.file)).toEqual([]);
  });

  it('is reached from the page and embed routes through CalculatorRenderer', () => {
    for (const route of ['app/calculators/[slug]/page.tsx', 'app/calculators/[slug]/embed/page.tsx']) {
      const text = files.find((f) => f.file === route)!.text;
      expect(text, route).toContain('<CalculatorRenderer slug={calc.slug} />');
      expect(text, route).not.toContain('registry/components');
    }
  });
});

describe('the site chrome (on every page)', () => {
  const REGISTRY_MODULES = ['@/lib/calculator-meta', '@/lib/registry', '@/lib/registry/index', '@/lib/search-calculators', '@/lib/category-hubs', '@/lib/salary-pages'];
  const chrome = ['components/layout/Header.tsx', 'components/layout/AppShell.tsx', 'components/layout/Footer.tsx', 'components/layout/CookieConsentBanner.tsx'];

  it.each(chrome)('%s does not import the calculator registry', (name) => {
    const text = files.find((f) => f.file === name)!.text;
    expect(runtimeImports(text, REGISTRY_MODULES)).toEqual([]);
  });

  it('loads the search dialog on first use, not with the page', () => {
    const header = files.find((f) => f.file === 'components/layout/Header.tsx')!.text;
    expect(header).toContain("import('./SearchDialog')");
    expect(header).not.toMatch(/from\s+['"]\.\/SearchDialog['"]/);
  });
});

// ---------------------------------------------------------------------------
// Interactivity (Nov 2026). Each rule below removed JavaScript that every page
// downloaded and ran before it could respond to a tap. The measurements are in
// docs/measurement.md §4.
// ---------------------------------------------------------------------------

const textOf = (name: string) => {
  const found = files.find((f) => f.file === name);
  if (!found) throw new Error(`${name} not found`);
  return found.text;
};
/** every module path a file imports, statically or with import() */
const importedPaths = (text: string) =>
  [...text.matchAll(/(?:from\s+|import\s*\(\s*|^import\s+)['"]([^'"]+)['"]/gm)].map((m) => m[1]);
/** module paths a file imports with a static `import … from` that brings in runtime code */
const staticRuntimePaths = (text: string) =>
  (text.match(/^import\s[^;]*?from\s+['"][^'"]+['"]/gm) ?? [])
    .filter((s) => !/^import\s+type\s/.test(s))
    .map((s) => s.match(/from\s+['"]([^'"]+)['"]/)![1]);

describe('animation library', () => {
  it('no file imports framer-motion: entrance animations come from components/motion.tsx (CSS)', () => {
    const importers = files.filter((f) => importedPaths(f.text).some((p) => p === 'framer-motion' || p.startsWith('framer-motion/') || p === 'motion' || p.startsWith('motion/')));
    expect(importers.map((f) => f.file)).toEqual([]);
  });

  it('the stand-in has no dependency beyond React', () => {
    expect(importedPaths(textOf('components/motion.tsx')).filter((p) => p !== 'react')).toEqual([]);
  });
});

describe('the home page', () => {
  it('HubPage gets its calculators as a prop and does not bundle the registry', () => {
    const paths = staticRuntimePaths(textOf('components/calculators/HubPage.tsx'));
    const registry = paths.filter((p) => ['@/lib/calculator-meta', '@/lib/registry', '@/lib/registry/index', '@/lib/search-calculators', '@/lib/hub-data'].includes(p) || p.startsWith('@/lib/registry/calculators'));
    expect(registry).toEqual([]);
  });

  it('hub-data.ts is used only by server files', () => {
    const importers = files.filter((f) => importedPaths(f.text).includes('@/lib/hub-data'));
    expect(importers.map((f) => f.file)).toContain('app/page.tsx');
    // A type-only import is erased, so it is fine in a client component.
    const clientRuntime = importers.filter((f) => isClient(f.text) && staticRuntimePaths(f.text).includes('@/lib/hub-data'));
    expect(clientRuntime.map((f) => f.file)).toEqual([]);
  });

  it('search keywords are fetched with import() on first use of the search box', () => {
    const hub = textOf('components/calculators/HubPage.tsx');
    expect(hub).toContain("import('@/lib/hub-keywords')");
    const staticImporters = files.filter((f) => staticRuntimePaths(f.text).some((p) => /(^|\/)hub-keywords$/.test(p)));
    expect(staticImporters.map((f) => f.file)).toEqual([]);
    // the list the server sends must not carry them
    expect(textOf('lib/hub-data.ts')).not.toMatch(/keywords\s*:/);
  });

  it('links to "/" are not prefetched (each one made its page download the home page code)', () => {
    const offenders: string[] = [];
    for (const f of files) {
      const links = f.text.match(/<Link\s[^>]*?href=(?:"\/"|\{['"]\/['"]\})[^>]*>/g) ?? [];
      for (const link of links) if (!/prefetch=\{false\}/.test(link)) offenders.push(`${f.file}: ${link.replace(/\s+/g, ' ').slice(0, 80)}`);
    }
    expect(offenders).toEqual([]);
  });
});

describe('state article data stays on the server', () => {
  // state-pages.ts is 100 kB of FAQs, notes and sources. Client code reads state-meta.ts.
  const isStatePages = (p: string) => p === '@/lib/payroll/state-pages' || /(^|\/)state-pages$/.test(p);
  // Not marked 'use client', but imported by client components, so they ship to the browser.
  const sharedWithClient = ['lib/payroll/bulk-payroll.ts', 'lib/payroll/scenario-params.ts', 'lib/payroll/state-meta.ts', 'lib/payroll/reverse-solver.ts'];

  it('no client component imports state-pages', () => {
    const offenders = files.filter((f) => (isClient(f.text) || sharedWithClient.includes(f.file)) && staticRuntimePaths(f.text).some(isStatePages));
    expect(offenders.map((f) => f.file)).toEqual([]);
  });
});

describe('loaded on first use, not with the page', () => {
  const calculators = ['components/calculators/HourlyPaycheckCalculator.tsx', 'components/calculators/StatePaycheckCalculator.tsx'];
  const lazy = ['./EmployerCostPanel', './PayStubDialog', './BulkPayrollPanel', '@/lib/payroll/employer-cost-2026'];

  it.each(calculators)('%s does not statically import the employer view, the pay stub or the bulk table', (name) => {
    expect(staticRuntimePaths(textOf(name)).filter((p) => lazy.includes(p))).toEqual([]);
  });

  it('the root layout does not mount the toaster (only the contact form shows toasts)', () => {
    expect(importedPaths(textOf('app/layout.tsx')).filter((p) => /toaster|sonner/.test(p))).toEqual([]);
    expect(textOf('components/layout/ContactForm.tsx')).toContain('<Toaster />');
  });

  it.each(['app/loading.tsx', 'app/calculators/[slug]/loading.tsx'])('%s uses ShellSkeleton, not the client shell', (name) => {
    const paths = importedPaths(textOf(name));
    expect(paths).toContain('@/components/layout/ShellSkeleton');
    expect(paths.filter((p) => /layout\/(AppShell|Header|Footer)$/.test(p))).toEqual([]);
  });

  it('ShellSkeleton has no client code of its own', () => {
    const text = textOf('components/layout/ShellSkeleton.tsx');
    expect(isClient(text)).toBe(false);
    expect(importedPaths(text)).toEqual(['next/link']);
  });
});
