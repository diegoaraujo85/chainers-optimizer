import { describe, expect, it } from 'vitest';
import type { OptimizerContext } from '@chainers/shared-types';
import { analyzeMerges } from '../src/index.js';

describe('Merge Advisor Golden Tests', () => {
  it('2 Rare Cattle to Epic Cattle', () => {
    const rare = { id: 'cattle-rare', kind: 'animal' as const, name: 'Rare Cattle', rarity: 'rare' as const };
    const context: OptimizerContext = {
      inventory: { entries: [{ item: rare, count: 2 }] },
      poolRate: { CFBper1000BP: 0.5 },
      cfbBalance: 1000,
      timeHorizonHours: 100,
      landSlots: [],
      phytolamps: [],
      fertilizers: [],
      mergeRules: [
        {
          id: 'cattle-rare-epic',
          fromItemId: rare.id,
          fromCount: 2,
          toItem: { id: 'cattle-epic', kind: 'animal', name: 'Epic Cattle', rarity: 'epic' },
          costCFB: 1,
          inputBPPerHour: 240,
          outputBPPerHour: 400,
        },
      ],
    };
    expect(analyzeMerges(context)).toContainEqual(
      expect.objectContaining({ action: 'merge', paybackHours: expect.closeTo(12.5) }),
    );
  });

  it('keeps an uneconomic merge', () => {
    const item = { id: 'rare', kind: 'animal' as const, name: 'Rare', rarity: 'rare' as const };
    const context: OptimizerContext = {
      inventory: { entries: [{ item, count: 2 }] },
      poolRate: { CFBper1000BP: 0.5 },
      cfbBalance: 100,
      timeHorizonHours: 24,
      landSlots: [],
      phytolamps: [],
      fertilizers: [],
      mergeRules: [{ id: 'r', fromItemId: 'rare', fromCount: 2, toItem: { ...item, id: 'epic', rarity: 'epic' }, costCFB: 100, inputBPPerHour: 200, outputBPPerHour: 201 }],
    };
    expect(analyzeMerges(context)[0]).toMatchObject({ action: 'keep' });
  });
});
