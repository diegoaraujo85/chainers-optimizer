import { z } from 'zod';
export const RaritySchema = z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']);
export const SeedTypeSchema = z.enum([
    'Basic',
    'Disposable',
    'Limited',
    'Seasonal',
    'Seasonal Food Seed',
    'Seasonal Seed',
]);
const ProvenanceSchema = z.object({ sourceUrl: z.string().url(), scrapedAt: z.string().datetime() });
export const SeedSchema = ProvenanceSchema.extend({
    name: z.string().min(1),
    type: SeedTypeSchema,
    rarity: RaritySchema,
    biopoints: z.number().positive(),
    growthTimeSeconds: z.number().positive(),
    imageUrl: z.string().url().optional(),
});
export const AnimalSchema = ProvenanceSchema.extend({
    name: z.string().min(1),
    category: z.string().min(1),
    product: z.string().min(1),
    rarity: RaritySchema,
    biopoints: z.number().positive(),
    growthTimeSeconds: z.number().positive(),
    imageUrl: z.string().url().optional(),
});
export const BoostItemSchema = ProvenanceSchema.extend({
    name: z.string().min(1),
    kind: z.enum(['phytolamp', 'fertilizer', 'plot', 'land', 'cropper']),
    rarity: RaritySchema,
    multiplier: z.number().positive().optional(),
    coverageRadius: z.number().nonnegative().optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    imageUrl: z.string().url().optional(),
});
export const MergeSchema = ProvenanceSchema.extend({
    animal: z.string().min(1),
    fromRarity: RaritySchema,
    toRarity: RaritySchema,
    unitsRequired: z.number().int().min(2),
    costCFB: z.number().nonnegative(),
});
export const RecipeSchema = ProvenanceSchema.extend({
    name: z.string().min(1),
    animalCategory: z.string().min(1),
    ingredients: z.array(z.object({ item: z.string().min(1), quantity: z.number().positive() })).min(1),
    outputUnits: z.number().int().positive(),
    craftTimeSeconds: z.number().positive(),
});
export const DataBundleSchema = z.object({
    seeds: z.array(SeedSchema),
    animals: z.array(AnimalSchema),
    merges: z.array(MergeSchema),
    boostItems: z.array(BoostItemSchema),
    recipes: z.array(RecipeSchema),
});
const identity = (collection, item) => {
    if (collection === 'merges')
        return `${item.animal}:${item.fromRarity}:${item.toRarity}`;
    return String(item.name ?? 'unknown');
};
function diffCollection(collection, current, previous) {
    const changes = [];
    const before = new Map(previous.map((item) => [identity(collection, item), item]));
    const after = new Map(current.map((item) => [identity(collection, item), item]));
    for (const [key, item] of after) {
        const old = before.get(key);
        if (!old) {
            changes.push({ collection, key, field: 'item', after: item, severity: 'info' });
            continue;
        }
        for (const [fieldName, value] of Object.entries(item)) {
            if (['scrapedAt', 'sourceUrl'].includes(fieldName))
                continue;
            if (JSON.stringify(old[fieldName]) === JSON.stringify(value))
                continue;
            const oldValue = old[fieldName];
            const isBp = fieldName === 'biopoints';
            const droppedOverTenPercent = isBp && typeof value === 'number' && typeof oldValue === 'number' && value < oldValue * 0.9;
            changes.push({
                collection,
                key,
                field: fieldName,
                before: oldValue,
                after: value,
                severity: droppedOverTenPercent ? 'warning' : 'info',
            });
        }
    }
    for (const [key, item] of before) {
        if (!after.has(key))
            changes.push({ collection, key, field: 'item', before: item, severity: 'warning' });
    }
    return changes;
}
export function validateBundle(data) {
    return DataBundleSchema.parse(data);
}
export function validateAndVersion(data, previous, previousVersion = 0, warnings = []) {
    const bundle = validateBundle(data);
    const changelog = previous
        ? Object.keys(bundle).flatMap((collection) => diffCollection(collection, bundle[collection], previous[collection]))
        : [];
    const changed = !previous || changelog.length > 0;
    return { version: changed ? previousVersion + 1 : previousVersion, changed, changelog, bundle, warnings };
}
//# sourceMappingURL=index.js.map