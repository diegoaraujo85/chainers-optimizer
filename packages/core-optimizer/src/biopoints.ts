import type {
  Animal,
  FeedRecipe,
  Fertilizer,
  OptimizerContext,
  Phytolamp,
  Plot,
  PoolRate,
  Seed,
  SlotPlan,
} from '@chainers/shared-types';

const hours = (seconds: number): number => seconds / 3600;
const finitePositive = (value: number, label: string): number => {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${label} must be a positive number`);
  return value;
};

export function seedBPperHour(
  seed: Seed,
  plot: Plot,
  phytolamp?: Phytolamp,
  fertilizer?: Fertilizer,
): number {
  const growthHours = hours(finitePositive(seed.growthTimeSeconds, 'Seed growth time'));
  const units = seed.harvestUnits ?? 1;
  return (
    (seed.biopoints * units * plot.bpMultiplier * (phytolamp?.bpMultiplier ?? 1) * (fertilizer?.bpMultiplier ?? 1)) /
    growthHours
  );
}

export function animalBPperHour(animal: Animal, feed: FeedRecipe, plot: Plot): number {
  if (feed.animalCategory.toLowerCase() !== animal.category.toLowerCase()) {
    throw new Error(`Feed ${feed.name} is incompatible with ${animal.category}`);
  }
  const productionHours = hours(finitePositive(animal.productionTimeSeconds, 'Animal production time'));
  return (animal.biopoints * plot.bpMultiplier * (feed.productionMultiplier ?? 1)) / productionHours;
}

export function feedOpportunityCost(feed: FeedRecipe, _poolRate: PoolRate): number {
  return (
    feed.ingredients.reduce((total, ingredient) => total + ingredient.quantity * ingredient.directSaleBP, 0) /
    finitePositive(feed.outputUnits, 'Feed output units')
  );
}

export function slotBPperHour(slot: SlotPlan, context: OptimizerContext): number {
  if (slot.kind === 'seed') return seedBPperHour(slot.seed, slot.plot, slot.phytolamp, slot.fertilizer);
  const gross = animalBPperHour(slot.animal, slot.feed, slot.plot);
  const feedCostPerCycle = feedOpportunityCost(slot.feed, context.poolRate);
  const cyclesPerHour = 3600 / finitePositive(slot.animal.productionTimeSeconds, 'Animal production time');
  return Math.max(0, gross - feedCostPerCycle * cyclesPerHour);
}

export const calculateSlotBPperHour = slotBPperHour;

export function optimizeSlotPlans(slotPlans: SlotPlan[], context: OptimizerContext) {
  const availableSlots = new Set(context.landSlots.map((slot) => slot.id));
  const ranked = slotPlans
    .filter((plan) => availableSlots.has(plan.slotId))
    .map((plan) => ({ ...plan, bpPerHour: slotBPperHour(plan, context) }))
    .sort((a, b) => b.bpPerHour - a.bpPerHour)
    .slice(0, context.landSlots.length);
  const totalBPPerHour = ranked.reduce((total, plan) => total + plan.bpPerHour, 0);
  return {
    slots: ranked,
    totalBPPerHour,
    projectedBP: totalBPPerHour * context.timeHorizonHours,
  };
}
