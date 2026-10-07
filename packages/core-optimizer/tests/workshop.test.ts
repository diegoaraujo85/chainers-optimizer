import { describe, expect, it } from 'vitest';
import { simulateFeedCraft } from '../src/index.js';
import type { FeedRecipe } from '@chainers/shared-types';

describe('workshop', () => {
  it('limits batches by available ingredients', () => {
    const recipe: FeedRecipe = {
      id: 'feed', kind: 'feed', name: 'Feed', rarity: 'common', animalCategory: 'cattle',
      ingredients: [{ itemId: 'grain', quantity: 2, directSaleBP: 5 }], craftTimeSeconds: 30, outputUnits: 3,
    };
    const result = simulateFeedCraft(recipe, {
      entries: [{ item: { id: 'grain', kind: 'seed', name: 'Grain', rarity: 'common' }, count: 5 }],
    }, 3);
    expect(result).toMatchObject({ craftedBatches: 2, outputUnits: 6 });
    expect(result.missing).toEqual([{ itemId: 'grain', quantity: 1 }]);
  });
});
