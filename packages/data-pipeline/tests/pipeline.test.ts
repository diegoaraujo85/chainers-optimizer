import { describe, expect, it } from 'vitest';
import { parseMarkdownTables, SeedSchema, validateAndVersion } from '../src/index.js';

const provenance = { sourceUrl: 'https://docs.chainers.io/example', scrapedAt: '2026-01-01T00:00:00.000Z' };

describe('data pipeline', () => {
  it('parses markdown tables despite formatting markup', () => {
    const tables = parseMarkdownTables('| **Name** | BP |\n| --- | ---: |\n| Wheat | 100 |');
    expect(tables[0]?.[0]).toEqual({ name: 'Wheat', bp: '100' });
  });

  it('rejects invalid seed values', () => {
    expect(() => SeedSchema.parse({ name: 'Bad', type: 'Basic', rarity: 'rare', biopoints: -1, growthTimeSeconds: 0, ...provenance })).toThrow();
  });

  it('flags a BP nerf greater than ten percent', () => {
    const base = {
      seeds: [{ name: 'Wheat', type: 'Basic' as const, rarity: 'common' as const, biopoints: 100, growthTimeSeconds: 60, ...provenance }],
      animals: [], merges: [], boostItems: [], recipes: [],
    };
    const next = { ...base, seeds: [{ ...base.seeds[0]!, biopoints: 80 }] };
    const result = validateAndVersion(next, base, 1);
    expect(result.changelog).toContainEqual(expect.objectContaining({ field: 'biopoints', severity: 'warning' }));
  });
});
