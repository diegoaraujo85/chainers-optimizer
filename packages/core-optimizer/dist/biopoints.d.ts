import type { Animal, FeedRecipe, Fertilizer, OptimizerContext, Phytolamp, Plot, PoolRate, Seed, SlotPlan } from '@chainers/shared-types';
export declare function seedBPperHour(seed: Seed, plot: Plot, phytolamp?: Phytolamp, fertilizer?: Fertilizer): number;
export declare function animalBPperHour(animal: Animal, feed: FeedRecipe, plot: Plot): number;
export declare function feedOpportunityCost(feed: FeedRecipe, _poolRate: PoolRate): number;
export declare function slotBPperHour(slot: SlotPlan, context: OptimizerContext): number;
export declare const calculateSlotBPperHour: typeof slotBPperHour;
export declare function optimizeSlotPlans(slotPlans: SlotPlan[], context: OptimizerContext): {
    slots: ({
        bpPerHour: number;
        kind: "seed";
        slotId: string;
        seed: Seed;
        plot: Plot;
        phytolamp?: Phytolamp;
        fertilizer?: Fertilizer;
    } | {
        bpPerHour: number;
        kind: "animal";
        slotId: string;
        animal: Animal;
        feed: FeedRecipe;
        plot: Plot;
    })[];
    totalBPPerHour: number;
    projectedBP: number;
};
//# sourceMappingURL=biopoints.d.ts.map