const hours = (seconds) => seconds / 3600;
const finitePositive = (value, label) => {
    if (!Number.isFinite(value) || value <= 0)
        throw new Error(`${label} must be a positive number`);
    return value;
};
export function seedBPperHour(seed, plot, phytolamp, fertilizer) {
    const growthHours = hours(finitePositive(seed.growthTimeSeconds, 'Seed growth time'));
    const units = seed.harvestUnits ?? 1;
    return ((seed.biopoints * units * plot.bpMultiplier * (phytolamp?.bpMultiplier ?? 1) * (fertilizer?.bpMultiplier ?? 1)) /
        growthHours);
}
export function animalBPperHour(animal, feed, plot) {
    if (feed.animalCategory.toLowerCase() !== animal.category.toLowerCase()) {
        throw new Error(`Feed ${feed.name} is incompatible with ${animal.category}`);
    }
    const productionHours = hours(finitePositive(animal.productionTimeSeconds, 'Animal production time'));
    return (animal.biopoints * plot.bpMultiplier * (feed.productionMultiplier ?? 1)) / productionHours;
}
export function feedOpportunityCost(feed, _poolRate) {
    return (feed.ingredients.reduce((total, ingredient) => total + ingredient.quantity * ingredient.directSaleBP, 0) /
        finitePositive(feed.outputUnits, 'Feed output units'));
}
export function slotBPperHour(slot, context) {
    if (slot.kind === 'seed')
        return seedBPperHour(slot.seed, slot.plot, slot.phytolamp, slot.fertilizer);
    const gross = animalBPperHour(slot.animal, slot.feed, slot.plot);
    const feedCostPerCycle = feedOpportunityCost(slot.feed, context.poolRate);
    const cyclesPerHour = 3600 / finitePositive(slot.animal.productionTimeSeconds, 'Animal production time');
    return Math.max(0, gross - feedCostPerCycle * cyclesPerHour);
}
export const calculateSlotBPperHour = slotBPperHour;
export function optimizeSlotPlans(slotPlans, context) {
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
//# sourceMappingURL=biopoints.js.map