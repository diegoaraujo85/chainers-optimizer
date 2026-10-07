import type {
  Fertilizer,
  Inventory,
  LandSlot,
  MergeRule,
  Phytolamp,
  PoolRate,
  SlotPlan,
  UserPreferences,
  WalletState,
} from './game.js';
import type { InventoryItem, LayoutSolution } from './layout.js';
import type { DiscrepancyReport, NormalizedNFT } from './onchain.js';

export interface OptimizerContext {
  inventory: Inventory;
  poolRate: PoolRate;
  cfbBalance: number;
  timeHorizonHours: number;
  landSlots: LandSlot[];
  phytolamps: Phytolamp[];
  fertilizers: Fertilizer[];
  mergeRules?: MergeRule[];
  optimalItemIds?: string[];
  freedSlotValueBPPerHour?: number;
}

export interface BiopointsPlan {
  slots: Array<SlotPlan & { bpPerHour: number }>;
  totalBPPerHour: number;
  projectedBP: number;
}

export interface PoolTier {
  name: string;
  minBP: number;
  maxBP?: number;
  withdrawalLimit: number;
  rewardMultiplier: number;
}

export interface PoolStrategy {
  currentTier: PoolTier | null;
  targetTier: PoolTier | null;
  submitAtHour: number;
  expectedRewardCFB: number;
  reasoning: string;
}

export interface Task {
  atHour: number;
  action: string;
  itemId?: string;
  reasoning: string;
}

export interface FullOptimizationInput {
  wallet: WalletState;
  inventory: Inventory;
  preferences: UserPreferences;
  context: Omit<OptimizerContext, 'inventory' | 'cfbBalance' | 'timeHorizonHours'>;
  slotPlans: SlotPlan[];
  layoutInventory: InventoryItem[];
  onchainNFTs?: NormalizedNFT[];
  offchainNFTs?: import('./onchain.js').OffChainNFT[];
}

export interface FullOptimizationResult {
  biopoints: BiopointsPlan;
  merges: import('./optimizer.js').MergeRecommendation[];
  layout: LayoutSolution;
  poolStrategy: PoolStrategy;
  dailyRoutine: Task[];
  discrepancies?: DiscrepancyReport;
}

export type MergeRecommendation =
  | {
      action: 'merge';
      from: import('./game.js').ItemRef[];
      to: import('./game.js').ItemRef;
      costCFB: number;
      bpGainPerHour: number;
      paybackHours: number;
      reasoning: string;
    }
  | { action: 'keep'; item: import('./game.js').ItemRef; reasoning: string }
  | {
      action: 'sell';
      item: import('./game.js').ItemRef;
      expectedPoolBP: number;
      reasoning: string;
    };
