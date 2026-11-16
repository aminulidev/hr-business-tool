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
