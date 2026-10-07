import type {
  CoverageMap,
  InventoryItem,
  LandPreset,
  LayoutConstraints,
  LayoutSolution,
  Placement,
  Position,
} from '@chainers/shared-types';
import type { Phytolamp } from '@chainers/shared-types';
import { evaluateCropperAccessibility } from './cropper.js';
import { Grid } from './grid.js';
import { optimizePhytolampPlacement, type PlotPosition } from './phytolamp.js';
import { resolveShape } from './shapes.js';

const rarityRank: Record<string, number> = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };

function isAnimal(type: string): boolean {
  return !['plot', 'waterPlot', 'phytolamp', 'cropper', 'decoration'].includes(type);
}

function candidatePositions(land: LandPreset, type: string): Position[] {
  const all: Position[] = [];
  for (let y = 0; y < land.height; y += 1) {
    for (let x = 0; x < land.width; x += 1) all.push({ x, y });
  }
  const water = new Set(land.waterTiles.map(({ x, y }) => `${x},${y}`));
  const compatible = all.filter(({ x, y }) => {
    if (type === 'waterPlot') return water.has(`${x},${y}`);
    if (type === 'plot') return !water.has(`${x},${y}`);
    return true;
  });
  return compatible.sort((a, b) => {
    if (isAnimal(type)) return b.x - a.x || a.y - b.y;
    return a.x - b.x || a.y - b.y;
  });
}

function toPlacement(item: InventoryItem, index: number, position: Position): Placement {
  const shape = resolveShape(item.type, item.shape);
  return {
    instanceId: `${item.id}#${index + 1}`,
    itemId: item.id,
    itemType: item.type,
    x: position.x,
    y: position.y,
    width: shape.width,
    height: shape.height,
    rotation: 0,
  };
}

function placeNearChargingSpot(grid: Grid, land: LandPreset, item: InventoryItem): Placement | undefined {
  const positions = grid.freePositions().sort((a, b) => {
    const ad = Math.abs(a.x - land.chargingSpot.x) + Math.abs(a.y - land.chargingSpot.y);
    const bd = Math.abs(b.x - land.chargingSpot.x) + Math.abs(b.y - land.chargingSpot.y);
    return ad - bd || a.y - b.y || a.x - b.x;
  });
  for (const position of positions) {
    const placement = toPlacement(item, 0, position);
    if (grid.canPlace(placement.x, placement.y, placement.width, placement.height)) return placement;
  }
  return undefined;
}

function countAdjacency(placements: Placement[], predicate: (placement: Placement) => boolean): number {
  const selected = placements.filter(predicate);
  let score = 0;
  for (let i = 0; i < selected.length; i += 1) {
    for (let j = i + 1; j < selected.length; j += 1) {
      const a = selected[i];
      const b = selected[j];
      if (a && b && Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1) score += 1;
    }
  }
  return score;
}

export function validateLayout(land: LandPreset, placements: Placement[]): string[] {
  const errors: string[] = [];
  const grid = new Grid(land.width, land.height, land.blockedTiles ?? []);
  for (const placement of placements) {
    if (!grid.canPlace(placement.x, placement.y, placement.width, placement.height)) {
      errors.push(`Placement ${placement.instanceId} overlaps or is out of bounds`);
      continue;
    }
    grid.place(placement);
  }
  return errors;
}

export function solveLayout(
  land: LandPreset,
  inventory: InventoryItem[],
  constraints: LayoutConstraints = {},
): LayoutSolution {
  const charging = land.chargingSpot;
  const blocked = [...(land.blockedTiles ?? []), charging];
  const grid = new Grid(land.width, land.height, blocked);
  const placements: Placement[] = [];
  const warnings: string[] = [];

  const cropper = inventory.find((item) => item.type === 'cropper' && item.count > 0);
  let cropperPlacement: Placement | undefined;
  if (cropper) {
    cropperPlacement = placeNearChargingSpot(grid, land, cropper);
    if (cropperPlacement) {
      grid.place(cropperPlacement);
      placements.push(cropperPlacement);
    } else warnings.push('Cropper could not be placed');
  }

  const placeable = inventory
    .filter((item) => item.type !== 'phytolamp' && item.type !== 'cropper')
    .sort((a, b) => {
      const aGroup = a.type === 'plot' || a.type === 'waterPlot' ? 0 : isAnimal(a.type) ? 1 : 2;
      const bGroup = b.type === 'plot' || b.type === 'waterPlot' ? 0 : isAnimal(b.type) ? 1 : 2;
      return aGroup - bGroup || (rarityRank[b.rarity ?? 'common'] ?? 0) - (rarityRank[a.rarity ?? 'common'] ?? 0);
    });

  for (const item of placeable) {
    const positions = candidatePositions(land, item.type);
    for (let index = 0; index < item.count; index += 1) {
      const position = positions.find((candidate) => {
        const placement = toPlacement(item, index, candidate);
        return grid.canPlace(candidate.x, candidate.y, placement.width, placement.height);
      });
      if (!position) {
        warnings.push(`No room for ${item.id}#${index + 1}`);
        continue;
      }
      const placement = toPlacement(item, index, position);
      grid.place(placement);
      placements.push(placement);
    }
  }

  const plotPositions: PlotPosition[] = placements
    .filter((placement) => placement.itemType === 'plot' || placement.itemType === 'waterPlot')
    .map(({ instanceId, x, y }) => ({ instanceId, x, y }));
  const lamps: Phytolamp[] = [];
  for (const item of inventory.filter((entry) => entry.type === 'phytolamp')) {
    for (let index = 0; index < item.count; index += 1) {
      lamps.push({
        id: item.id,
        kind: 'boost',
        name: item.id,
        rarity: item.rarity ?? 'common',
        boostType: 'phytolamp',
        bpMultiplier: Number(item.metadata?.bpMultiplier ?? 1),
        coverageRadius: item.coverageRadius ?? 2,
      });
    }
  }
  const coverage = optimizePhytolampPlacement(lamps, plotPositions, grid);
  placements.push(
    ...coverage.map((entry) => ({
      instanceId: entry.lampId,
      itemId: entry.lampId.split('#')[0] ?? entry.lampId,
      itemType: 'phytolamp',
      x: entry.lampPosition.x,
      y: entry.lampPosition.y,
      width: 1,
      height: 1,
      rotation: 0 as const,
    })),
  );

  const byPlot: Record<string, string> = {};
  for (const entry of coverage) {
    for (const plotId of entry.coveredPlotIds) byPlot[plotId] = entry.lampId;
  }
  const coverageMap: CoverageMap = {
    byPlot,
    coveredCount: Object.keys(byPlot).length,
    totalPlots: plotPositions.length,
    overlapCount: coverage.reduce((total, entry) => total + entry.overlapPenalty, 0),
  };
  const accessibility = evaluateCropperAccessibility(grid, charging, cropperPlacement);
  if (!accessibility.cropperAccessible) warnings.push('Cropper has no free path to charging spot');

  const weights = {
    coverage: constraints.coverageWeight ?? 10,
    animals: constraints.animalGroupingWeight ?? 5,
    plots: constraints.plotGroupingWeight ?? 5,
    expansion: constraints.expansionWeight ?? 3,
    aesthetic: constraints.aestheticWeight ?? 1,
  };
  const freeTiles = grid.freePositions().length;
  const score =
    coverageMap.coveredCount * weights.coverage -
    coverageMap.overlapCount * weights.coverage +
    countAdjacency(placements, (item) => isAnimal(item.itemType)) * weights.animals +
    countAdjacency(placements, (item) => ['plot', 'waterPlot'].includes(item.itemType)) * weights.plots +
    (freeTiles / (land.width * land.height)) * 100 * weights.expansion +
    (accessibility.cropperAccessible ? weights.aesthetic * 10 : -1000);

  return { placements, score, coverageMap, accessibility, freeTiles, warnings };
}

export function solveLayoutAlternatives(
  land: LandPreset,
  inventory: InventoryItem[],
  constraints: LayoutConstraints = {},
): LayoutSolution[] {
  return [
    solveLayout(land, inventory, constraints),
    solveLayout({ ...land, chargingSpot: { ...land.chargingSpot } }, [...inventory].reverse(), { ...constraints, seed: 2 }),
    solveLayout(land, inventory.map((item) => ({ ...item })), { ...constraints, seed: 3, expansionWeight: (constraints.expansionWeight ?? 3) + 2 }),
  ].sort((a, b) => b.score - a.score);
}
