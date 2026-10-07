import { getLandPreset, solveLayout } from '@chainers/layout-engine';
import { compareInventories } from '@chainers/onchain-sync';
import { optimizeSlotPlans } from './biopoints.js';
import { analyzeMerges } from './merge-advisor.js';
import { choosePoolStrategy } from './pool-strategy.js';
const DEFAULT_TIERS = [
    { name: 'Sprout', minBP: 0, maxBP: 9_999, withdrawalLimit: 10_000, rewardMultiplier: 1 },
    { name: 'Grower', minBP: 10_000, maxBP: 49_999, withdrawalLimit: 50_000, rewardMultiplier: 1.05 },
    { name: 'Harvester', minBP: 50_000, withdrawalLimit: 250_000, rewardMultiplier: 1.1 },
];
function buildRoutine(input, plans, submitAtHour) {
    const tasks = plans.slots.map((slot) => {
        const seconds = slot.kind === 'seed' ? slot.seed.growthTimeSeconds : slot.animal.productionTimeSeconds;
        return {
            atHour: Math.min(input.preferences.timeHorizonHours, seconds / 3600),
            action: slot.kind === 'seed' ? `Harvest ${slot.seed.name}` : `Collect ${slot.animal.product}`,
            itemId: slot.kind === 'seed' ? slot.seed.id : slot.animal.id,
            reasoning: `Maintains ${slot.bpPerHour.toFixed(1)} BP/h on ${slot.slotId}.`,
        };
    });
    tasks.push({ atHour: submitAtHour, action: 'Submit Biopoints to reward pool', reasoning: 'Pool tier timing recommendation.' });
    return tasks.sort((a, b) => a.atHour - b.atHour);
}
export function runFullOptimization(input) {
    const context = {
        ...input.context,
        inventory: input.inventory,
        cfbBalance: input.wallet.cfbBalance,
        timeHorizonHours: input.preferences.timeHorizonHours,
    };
    const biopoints = optimizeSlotPlans(input.slotPlans, context);
    const land = getLandPreset(input.preferences.selectedLand);
    const layout = solveLayout(land, input.layoutInventory, {
        reserveExpansionRatio: input.preferences.reserveExpansionRatio ?? 0,
        expansionWeight: input.preferences.objective === 'space' ? 10 : 3,
        coverageWeight: input.preferences.objective === 'biopoints' ? 15 : 10,
    });
    const freedSlotValueBPPerHour = biopoints.slots.at(-1)?.bpPerHour ?? 0;
    const merges = analyzeMerges({ ...context, freedSlotValueBPPerHour });
    const poolStrategy = choosePoolStrategy(0, biopoints.totalBPPerHour, input.preferences.timeHorizonHours, context.poolRate, DEFAULT_TIERS);
    const result = {
        biopoints,
        merges,
        layout,
        poolStrategy,
        dailyRoutine: buildRoutine(input, biopoints, poolStrategy.submitAtHour),
    };
    if (input.onchainNFTs) {
        result.discrepancies = compareInventories(input.onchainNFTs, input.offchainNFTs ?? []);
    }
    return result;
}
//# sourceMappingURL=optimizer.js.map