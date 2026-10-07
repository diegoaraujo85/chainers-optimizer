import type { SeedType } from '@chainers/shared-types';

export type DataRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface SeedData {
  name: string;
  type: SeedType;
  rarity: DataRarity;
  biopoints: number;
  growthTimeSeconds: number;
  imageUrl?: string;
  sourceUrl: string;
  scrapedAt: string;
}

export interface AnimalData {
  name: string;
  category: string;
  product: string;
  rarity: DataRarity;
  biopoints: number;
  growthTimeSeconds: number;
  imageUrl?: string;
  sourceUrl: string;
  scrapedAt: string;
}

export interface BoostItemData {
  name: string;
  kind: 'phytolamp' | 'fertilizer' | 'plot' | 'land' | 'cropper';
  rarity: DataRarity;
  multiplier?: number;
  coverageRadius?: number;
  width?: number;
  height?: number;
  imageUrl?: string;
  sourceUrl: string;
  scrapedAt: string;
}

export interface MergeCostDataItem {
  animal: string;
  fromRarity: DataRarity;
  toRarity: DataRarity;
  unitsRequired: number;
  costCFB: number;
  sourceUrl: string;
  scrapedAt: string;
}

export interface SeedMultiplierData {
  seed: string;
  multiplier: number;
  harvestRatio: number;
  sourceUrl: string;
  scrapedAt: string;
}

export interface RecipeData {
  name: string;
  animalCategory: string;
  ingredients: Array<{ item: string; quantity: number }>;
  outputUnits: number;
  craftTimeSeconds: number;
  sourceUrl: string;
  scrapedAt: string;
}

export interface ScrapedData {
  seeds: SeedData[];
  animals: AnimalData[];
  boostItems: BoostItemData[];
  timestamp: string;
  sourceVersion: string;
  warnings: string[];
}

export interface MinaryganarData {
  animalMerges: MergeCostDataItem[];
  seedMultipliers: SeedMultiplierData[];
  timestamp: string;
  warnings: string[];
}

export interface DataBundle {
  seeds: SeedData[];
  animals: AnimalData[];
  merges: MergeCostDataItem[];
  boostItems: BoostItemData[];
  recipes: RecipeData[];
}

export interface DataChange {
  collection: keyof DataBundle;
  key: string;
  field: string;
  before?: unknown;
  after?: unknown;
  severity: 'info' | 'warning';
}

export interface VersionedData {
  version: number;
  changed: boolean;
  changelog: DataChange[];
  bundle: DataBundle;
  warnings: string[];
}
