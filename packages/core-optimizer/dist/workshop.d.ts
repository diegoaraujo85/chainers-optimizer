import type { FeedRecipe, Inventory } from '@chainers/shared-types';
export interface CraftSimulation {
    recipeId: string;
    requestedBatches: number;
    craftedBatches: number;
    outputUnits: number;
    craftTimeSeconds: number;
    missing: Array<{
        itemId: string;
        quantity: number;
    }>;
}
export declare function simulateFeedCraft(recipe: FeedRecipe, inventory: Inventory, requestedBatches: number): CraftSimulation;
export declare function rankFeedRecipes(recipes: FeedRecipe[]): FeedRecipe[];
//# sourceMappingURL=workshop.d.ts.map