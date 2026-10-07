import { describe, expect, it } from 'vitest';
import { animalBPperHour, feedOpportunityCost, seedBPperHour } from '../src/index.js';
import type { Animal, FeedRecipe, Plot, Seed } from '@chainers/shared-types';

const plot: Plot = { id: 'plot', kind: 'plot', name: 'Plot', rarity: 'rare', bpMultiplier: 1.5 };
const seed: Seed = {
  id: 'seed',
  kind: 'seed',
  name: 'Seed',
  rarity: 'rare',
  type: 'Basic',
  biopoints: 100,
  growthTimeSeconds: 1800,
};
const feed: FeedRecipe = {
  id: 'feed',
  kind: 'feed',
  name: 'Cattle Feed',
  rarity: 'common',
  animalCategory: 'cattle',
  ingredients: [{ itemId: 'wheat', quantity: 2, directSaleBP: 10 }],
  craftTimeSeconds: 60,
  outputUnits: 2,
};
const animal: Animal = {
  id: 'cow',
  kind: 'animal',
  name: 'Cow',
  rarity: 'rare',
  category: 'cattle',
  product: 'Milk',
  biopoints: 300,
  productionTimeSeconds: 3600,
  feedRecipeId: 'feed',
};

describe('biopoints', () => {
  it('calculates seed BP per hour with multiplicative boosts', () => {
    expect(seedBPperHour(seed, plot)).toBe(300);
    expect(
      seedBPperHour(seed, plot, {
        id: 'lamp', kind: 'boost', name: 'Lamp', rarity: 'rare', boostType: 'phytolamp', bpMultiplier: 1.2, coverageRadius: 2,
      }),
    ).toBe(360);
  });

  it('calculates animal yield and feed opportunity cost', () => {
    expect(animalBPperHour(animal, feed, plot)).toBe(450);
    expect(feedOpportunityCost(feed, { CFBper1000BP: 0.5 })).toBe(10);
  });
});
