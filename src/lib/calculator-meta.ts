// Compatibility shim — the registry moved to src/lib/registry (Roadmap v2 Phase 14.1).
// New code should import from '@/lib/registry'. This file will be removed once
// all 33 importers are migrated.
export * from './registry';
