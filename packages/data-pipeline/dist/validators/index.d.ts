import { z } from 'zod';
import type { DataBundle, VersionedData } from '../types.js';
export declare const RaritySchema: z.ZodEnum<["common", "uncommon", "rare", "epic", "legendary"]>;
export declare const SeedTypeSchema: z.ZodEnum<["Basic", "Disposable", "Limited", "Seasonal", "Seasonal Food Seed", "Seasonal Seed"]>;
export declare const SeedSchema: z.ZodObject<{
    sourceUrl: z.ZodString;
    scrapedAt: z.ZodString;
} & {
    name: z.ZodString;
    type: z.ZodEnum<["Basic", "Disposable", "Limited", "Seasonal", "Seasonal Food Seed", "Seasonal Seed"]>;
    rarity: z.ZodEnum<["common", "uncommon", "rare", "epic", "legendary"]>;
    biopoints: z.ZodNumber;
    growthTimeSeconds: z.ZodNumber;
    imageUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sourceUrl: string;
    scrapedAt: string;
    type: "Basic" | "Disposable" | "Limited" | "Seasonal" | "Seasonal Food Seed" | "Seasonal Seed";
    name: string;
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    biopoints: number;
    growthTimeSeconds: number;
    imageUrl?: string | undefined;
}, {
    sourceUrl: string;
    scrapedAt: string;
    type: "Basic" | "Disposable" | "Limited" | "Seasonal" | "Seasonal Food Seed" | "Seasonal Seed";
    name: string;
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    biopoints: number;
    growthTimeSeconds: number;
    imageUrl?: string | undefined;
}>;
export declare const AnimalSchema: z.ZodObject<{
    sourceUrl: z.ZodString;
    scrapedAt: z.ZodString;
} & {
    name: z.ZodString;
    category: z.ZodString;
    product: z.ZodString;
    rarity: z.ZodEnum<["common", "uncommon", "rare", "epic", "legendary"]>;
    biopoints: z.ZodNumber;
    growthTimeSeconds: z.ZodNumber;
    imageUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sourceUrl: string;
    scrapedAt: string;
    name: string;
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    biopoints: number;
    growthTimeSeconds: number;
    category: string;
    product: string;
    imageUrl?: string | undefined;
}, {
    sourceUrl: string;
    scrapedAt: string;
    name: string;
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    biopoints: number;
    growthTimeSeconds: number;
    category: string;
    product: string;
    imageUrl?: string | undefined;
}>;
export declare const BoostItemSchema: z.ZodObject<{
    sourceUrl: z.ZodString;
    scrapedAt: z.ZodString;
} & {
    name: z.ZodString;
    kind: z.ZodEnum<["phytolamp", "fertilizer", "plot", "land", "cropper"]>;
    rarity: z.ZodEnum<["common", "uncommon", "rare", "epic", "legendary"]>;
    multiplier: z.ZodOptional<z.ZodNumber>;
    coverageRadius: z.ZodOptional<z.ZodNumber>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    imageUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sourceUrl: string;
    scrapedAt: string;
    name: string;
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    kind: "phytolamp" | "fertilizer" | "plot" | "land" | "cropper";
    imageUrl?: string | undefined;
    multiplier?: number | undefined;
    coverageRadius?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
}, {
    sourceUrl: string;
    scrapedAt: string;
    name: string;
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    kind: "phytolamp" | "fertilizer" | "plot" | "land" | "cropper";
    imageUrl?: string | undefined;
    multiplier?: number | undefined;
    coverageRadius?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
}>;
export declare const MergeSchema: z.ZodObject<{
    sourceUrl: z.ZodString;
    scrapedAt: z.ZodString;
} & {
    animal: z.ZodString;
    fromRarity: z.ZodEnum<["common", "uncommon", "rare", "epic", "legendary"]>;
    toRarity: z.ZodEnum<["common", "uncommon", "rare", "epic", "legendary"]>;
    unitsRequired: z.ZodNumber;
    costCFB: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    sourceUrl: string;
    scrapedAt: string;
    animal: string;
    fromRarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    toRarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    unitsRequired: number;
    costCFB: number;
}, {
    sourceUrl: string;
    scrapedAt: string;
    animal: string;
    fromRarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    toRarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    unitsRequired: number;
    costCFB: number;
}>;
export declare const RecipeSchema: z.ZodObject<{
    sourceUrl: z.ZodString;
    scrapedAt: z.ZodString;
} & {
    name: z.ZodString;
    animalCategory: z.ZodString;
    ingredients: z.ZodArray<z.ZodObject<{
        item: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        item: string;
        quantity: number;
    }, {
        item: string;
        quantity: number;
    }>, "many">;
    outputUnits: z.ZodNumber;
    craftTimeSeconds: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    sourceUrl: string;
    scrapedAt: string;
    name: string;
    animalCategory: string;
    ingredients: {
        item: string;
        quantity: number;
    }[];
    outputUnits: number;
    craftTimeSeconds: number;
}, {
    sourceUrl: string;
    scrapedAt: string;
    name: string;
    animalCategory: string;
    ingredients: {
        item: string;
        quantity: number;
    }[];
    outputUnits: number;
    craftTimeSeconds: number;
}>;
export declare const DataBundleSchema: z.ZodObject<{
    seeds: z.ZodArray<z.ZodObject<{
        sourceUrl: z.ZodString;
        scrapedAt: z.ZodString;
    } & {
        name: z.ZodString;
        type: z.ZodEnum<["Basic", "Disposable", "Limited", "Seasonal", "Seasonal Food Seed", "Seasonal Seed"]>;
        rarity: z.ZodEnum<["common", "uncommon", "rare", "epic", "legendary"]>;
        biopoints: z.ZodNumber;
        growthTimeSeconds: z.ZodNumber;
        imageUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        sourceUrl: string;
        scrapedAt: string;
        type: "Basic" | "Disposable" | "Limited" | "Seasonal" | "Seasonal Food Seed" | "Seasonal Seed";
        name: string;
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        biopoints: number;
        growthTimeSeconds: number;
        imageUrl?: string | undefined;
    }, {
        sourceUrl: string;
        scrapedAt: string;
        type: "Basic" | "Disposable" | "Limited" | "Seasonal" | "Seasonal Food Seed" | "Seasonal Seed";
        name: string;
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        biopoints: number;
        growthTimeSeconds: number;
        imageUrl?: string | undefined;
    }>, "many">;
    animals: z.ZodArray<z.ZodObject<{
        sourceUrl: z.ZodString;
        scrapedAt: z.ZodString;
    } & {
        name: z.ZodString;
        category: z.ZodString;
        product: z.ZodString;
        rarity: z.ZodEnum<["common", "uncommon", "rare", "epic", "legendary"]>;
        biopoints: z.ZodNumber;
        growthTimeSeconds: z.ZodNumber;
        imageUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        sourceUrl: string;
        scrapedAt: string;
        name: string;
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        biopoints: number;
        growthTimeSeconds: number;
        category: string;
        product: string;
        imageUrl?: string | undefined;
    }, {
        sourceUrl: string;
        scrapedAt: string;
        name: string;
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        biopoints: number;
        growthTimeSeconds: number;
        category: string;
        product: string;
        imageUrl?: string | undefined;
    }>, "many">;
    merges: z.ZodArray<z.ZodObject<{
        sourceUrl: z.ZodString;
        scrapedAt: z.ZodString;
    } & {
        animal: z.ZodString;
        fromRarity: z.ZodEnum<["common", "uncommon", "rare", "epic", "legendary"]>;
        toRarity: z.ZodEnum<["common", "uncommon", "rare", "epic", "legendary"]>;
        unitsRequired: z.ZodNumber;
        costCFB: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        sourceUrl: string;
        scrapedAt: string;
        animal: string;
        fromRarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        toRarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        unitsRequired: number;
        costCFB: number;
    }, {
        sourceUrl: string;
        scrapedAt: string;
        animal: string;
        fromRarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        toRarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        unitsRequired: number;
        costCFB: number;
    }>, "many">;
    boostItems: z.ZodArray<z.ZodObject<{
        sourceUrl: z.ZodString;
        scrapedAt: z.ZodString;
    } & {
        name: z.ZodString;
        kind: z.ZodEnum<["phytolamp", "fertilizer", "plot", "land", "cropper"]>;
        rarity: z.ZodEnum<["common", "uncommon", "rare", "epic", "legendary"]>;
        multiplier: z.ZodOptional<z.ZodNumber>;
        coverageRadius: z.ZodOptional<z.ZodNumber>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        imageUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        sourceUrl: string;
        scrapedAt: string;
        name: string;
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        kind: "phytolamp" | "fertilizer" | "plot" | "land" | "cropper";
        imageUrl?: string | undefined;
        multiplier?: number | undefined;
        coverageRadius?: number | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }, {
        sourceUrl: string;
        scrapedAt: string;
        name: string;
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        kind: "phytolamp" | "fertilizer" | "plot" | "land" | "cropper";
        imageUrl?: string | undefined;
        multiplier?: number | undefined;
        coverageRadius?: number | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }>, "many">;
    recipes: z.ZodArray<z.ZodObject<{
        sourceUrl: z.ZodString;
        scrapedAt: z.ZodString;
    } & {
        name: z.ZodString;
        animalCategory: z.ZodString;
        ingredients: z.ZodArray<z.ZodObject<{
            item: z.ZodString;
            quantity: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            item: string;
            quantity: number;
        }, {
            item: string;
            quantity: number;
        }>, "many">;
        outputUnits: z.ZodNumber;
        craftTimeSeconds: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        sourceUrl: string;
        scrapedAt: string;
        name: string;
        animalCategory: string;
        ingredients: {
            item: string;
            quantity: number;
        }[];
        outputUnits: number;
        craftTimeSeconds: number;
    }, {
        sourceUrl: string;
        scrapedAt: string;
        name: string;
        animalCategory: string;
        ingredients: {
            item: string;
            quantity: number;
        }[];
        outputUnits: number;
        craftTimeSeconds: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    seeds: {
        sourceUrl: string;
        scrapedAt: string;
        type: "Basic" | "Disposable" | "Limited" | "Seasonal" | "Seasonal Food Seed" | "Seasonal Seed";
        name: string;
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        biopoints: number;
        growthTimeSeconds: number;
        imageUrl?: string | undefined;
    }[];
    animals: {
        sourceUrl: string;
        scrapedAt: string;
        name: string;
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        biopoints: number;
        growthTimeSeconds: number;
        category: string;
        product: string;
        imageUrl?: string | undefined;
    }[];
    merges: {
        sourceUrl: string;
        scrapedAt: string;
        animal: string;
        fromRarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        toRarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        unitsRequired: number;
        costCFB: number;
    }[];
    boostItems: {
        sourceUrl: string;
        scrapedAt: string;
        name: string;
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        kind: "phytolamp" | "fertilizer" | "plot" | "land" | "cropper";
        imageUrl?: string | undefined;
        multiplier?: number | undefined;
        coverageRadius?: number | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }[];
    recipes: {
        sourceUrl: string;
        scrapedAt: string;
        name: string;
        animalCategory: string;
        ingredients: {
            item: string;
            quantity: number;
        }[];
        outputUnits: number;
        craftTimeSeconds: number;
    }[];
}, {
    seeds: {
        sourceUrl: string;
        scrapedAt: string;
        type: "Basic" | "Disposable" | "Limited" | "Seasonal" | "Seasonal Food Seed" | "Seasonal Seed";
        name: string;
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        biopoints: number;
        growthTimeSeconds: number;
        imageUrl?: string | undefined;
    }[];
    animals: {
        sourceUrl: string;
        scrapedAt: string;
        name: string;
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        biopoints: number;
        growthTimeSeconds: number;
        category: string;
        product: string;
        imageUrl?: string | undefined;
    }[];
    merges: {
        sourceUrl: string;
        scrapedAt: string;
        animal: string;
        fromRarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        toRarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        unitsRequired: number;
        costCFB: number;
    }[];
    boostItems: {
        sourceUrl: string;
        scrapedAt: string;
        name: string;
        rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
        kind: "phytolamp" | "fertilizer" | "plot" | "land" | "cropper";
        imageUrl?: string | undefined;
        multiplier?: number | undefined;
        coverageRadius?: number | undefined;
        width?: number | undefined;
        height?: number | undefined;
    }[];
    recipes: {
        sourceUrl: string;
        scrapedAt: string;
        name: string;
        animalCategory: string;
        ingredients: {
            item: string;
            quantity: number;
        }[];
        outputUnits: number;
        craftTimeSeconds: number;
    }[];
}>;
export declare function validateBundle(data: unknown): DataBundle;
export declare function validateAndVersion(data: unknown, previous?: DataBundle, previousVersion?: number, warnings?: string[]): VersionedData;
//# sourceMappingURL=index.d.ts.map