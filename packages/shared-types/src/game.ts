export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type SeedType =
  | 'Basic'
  | 'Disposable'
  | 'Limited'
  | 'Seasonal'
  | 'Seasonal Food Seed'
  | 'Seasonal Seed';

export interface ItemRef {
  id: string;
  kind: 'seed' | 'animal' | 'plot' | 'boost' | 'land' | 'feed' | 'other';
  name: string;
  rarity: Rarity;
}

export interface Seed extends ItemRef {
  kind: 'seed';
  type: SeedType;
  biopoints: number;
  growthTimeSeconds: number;
  harvestUnits?: number;
}

export interface Animal extends ItemRef {
  kind: 'animal';
  category: string;
  product: string;
  biopoints: number;
  productionTimeSeconds: number;
  feedRecipeId: string;
}

export interface Plot extends ItemRef {
  kind: 'plot';
  bpMultiplier: number;
  compatibleSeedTypes?: SeedType[];
}

export interface Phytolamp extends ItemRef {
  kind: 'boost';
  boostType: 'phytolamp';
  bpMultiplier: number;
  coverageRadius: number;
}

export interface Fertilizer extends ItemRef {
  kind: 'boost';
  boostType: 'fertilizer';
  bpMultiplier: number;
  uses: number;
}

export interface FeedIngredient {
  itemId: string;
  quantity: number;
  directSaleBP: number;
}

export interface FeedRecipe extends ItemRef {
  kind: 'feed';
  animalCategory: string;
  ingredients: FeedIngredient[];
  craftTimeSeconds: number;
  outputUnits: number;
  productionMultiplier?: number;
}

export interface PoolRate {
  CFBper1000BP: number;
  BNBper1000BP?: number;
  POLper1000BP?: number;
}

export interface LandSlot {
  id: string;
  landId: string;
  accepts: Array<'seed' | 'animal' | 'boost' | 'plot'>;
  occupiedBy?: string;
}

export interface InventoryEntry<T extends ItemRef = ItemRef> {
  item: T;
  count: number;
  inUse?: number;
  estimatedPoolBP?: number;
}

export interface Inventory {
  entries: InventoryEntry[];
}

export interface MergeRule {
  id: string;
  fromItemId: string;
  fromCount: number;
  toItem: ItemRef;
  costCFB: number;
  craftTimeSeconds?: number;
  outputBPPerHour: number;
  inputBPPerHour: number;
}

export interface SeedSlotPlan {
  kind: 'seed';
  slotId: string;
  seed: Seed;
  plot: Plot;
  phytolamp?: Phytolamp;
  fertilizer?: Fertilizer;
}

export interface AnimalSlotPlan {
  kind: 'animal';
  slotId: string;
  animal: Animal;
  feed: FeedRecipe;
  plot: Plot;
}

export type SlotPlan = SeedSlotPlan | AnimalSlotPlan;

export interface WalletState {
  address?: string;
  cfbBalance: number;
  mode: 'manual' | 'hybrid';
}

export interface UserPreferences {
  timeHorizonHours: number;
  selectedLand: string;
  reserveExpansionRatio?: number;
  objective?: 'biopoints' | 'balanced' | 'space';
}
