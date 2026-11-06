import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Pure-TypeScript tests only (payroll engine, registry invariants, generated
// content). No DOM, no React rendering — run with `npm test`.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    testTimeout: 20000,
  },
});
