import { describe, expect, it } from 'vitest';
import { getLandPreset, optimizePhytolampPlacement, Grid, solveLayout, validateLayout } from '../src/index.js';
import type { InventoryItem, Phytolamp } from '@chainers/shared-types';

const inventory: InventoryItem[] = [
  { id: 'legendary-plot', type: 'plot', rarity: 'legendary', count: 16 },
  { id: 'rare-lamp', type: 'phytolamp', rarity: 'rare', count: 4, coverageRadius: 2 },
  { id: 'cropper', type: 'cropper', count: 1 },
  { id: 'epic-cattle', type: 'cattle', rarity: 'epic', count: 3 },
];

describe('layout solver', () => {
  it('places every item within bounds without overlap', () => {
    const land = getLandPreset('Golden Acres');
    const result = solveLayout(land, inventory);
    expect(validateLayout(land, result.placements)).toEqual([]);
    expect(result.placements).toHaveLength(24);
  });

  it('keeps a path from charging spot to cropper', () => {
    const result = solveLayout(getLandPreset('Golden Acres'), inventory);
    expect(result.accessibility.cropperAccessible).toBe(true);
    expect(result.accessibility.path.length).toBeGreaterThan(0);
  });

  it('assigns each plot to at most one phytolamp', () => {
    const grid = new Grid(8, 8);
    const plots = Array.from({ length: 12 }, (_, index) => ({
      instanceId: `plot-${index}`,
      x: index % 4,
      y: Math.floor(index / 4),
    }));
    for (const plot of plots) {
      grid.place({ ...plot, itemId: 'plot', itemType: 'plot', width: 1, height: 1, rotation: 0 });
    }
    const lamp: Phytolamp = {
      id: 'lamp',
      kind: 'boost',
      name: 'Lamp',
      rarity: 'rare',
      boostType: 'phytolamp',
      bpMultiplier: 1.25,
      coverageRadius: 3,
    };
    const coverage = optimizePhytolampPlacement([lamp, lamp], plots, grid);
    const assigned = coverage.flatMap((entry) => entry.coveredPlotIds);
    expect(new Set(assigned).size).toBe(assigned.length);
  });

  it.each(['Sunny Field', 'Meadow Grove', 'Golden Acres', 'Tranquil Waters'])(
    'supports %s',
    (name) => {
      const land = getLandPreset(name);
      expect(solveLayout(land, [{ id: 'plot', type: 'plot', count: 2 }]).placements).toHaveLength(2);
    },
  );
});
