export function simulateFeedCraft(recipe, inventory, requestedBatches) {
    if (!Number.isInteger(requestedBatches) || requestedBatches < 0) {
        throw new Error('Requested batches must be a non-negative integer');
    }
    const quantities = new Map(inventory.entries.map((entry) => [entry.item.id, entry.count]));
    let possible = requestedBatches;
    const missing = [];
    for (const ingredient of recipe.ingredients) {
        const available = quantities.get(ingredient.itemId) ?? 0;
        possible = Math.min(possible, Math.floor(available / ingredient.quantity));
        const needed = ingredient.quantity * requestedBatches;
        if (available < needed)
            missing.push({ itemId: ingredient.itemId, quantity: needed - available });
    }
    return {
        recipeId: recipe.id,
        requestedBatches,
        craftedBatches: Math.max(0, possible),
        outputUnits: Math.max(0, possible) * recipe.outputUnits,
        craftTimeSeconds: Math.max(0, possible) * recipe.craftTimeSeconds,
        missing,
    };
}
export function rankFeedRecipes(recipes) {
    return [...recipes].sort((a, b) => {
        const aCost = a.ingredients.reduce((sum, ingredient) => sum + ingredient.directSaleBP * ingredient.quantity, 0) / a.outputUnits;
        const bCost = b.ingredients.reduce((sum, ingredient) => sum + ingredient.directSaleBP * ingredient.quantity, 0) / b.outputUnits;
        return aCost - bCost;
    });
}
//# sourceMappingURL=workshop.js.map