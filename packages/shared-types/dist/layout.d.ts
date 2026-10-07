import type { Rarity } from './game.js';
export interface Position {
    x: number;
    y: number;
}
export interface Shape {
    width: number;
    height: number;
    rotatable: boolean;
    anchor: 'center' | 'bottom-left';
}
export type LayoutItemType = 'plot' | 'waterPlot' | 'animal' | 'phytolamp' | 'cropper' | 'decoration';
export interface InventoryItem {
    id: string;
    type: LayoutItemType | string;
    rarity?: Rarity;
    shape?: Partial<Shape>;
    count: number;
    coverageRadius?: number;
    metadata?: Record<string, string | number | boolean>;
}
export interface LandPreset {
    name: string;
    width: number;
    height: number;
    chargingSpot: Position;
    waterTiles: Position[];
    blockedTiles?: Position[];
}
export interface Placement extends Position {
    instanceId: string;
    itemId: string;
    itemType: string;
    width: number;
    height: number;
    rotation: 0 | 90;
}
export interface CoverageMap {
    byPlot: Record<string, string>;
    coveredCount: number;
    totalPlots: number;
    overlapCount: number;
}
export interface AccessibilityMap {
    cropperAccessible: boolean;
    path: Position[];
    unreachableItems: string[];
}
export interface LayoutConstraints {
    coverageWeight?: number;
    animalGroupingWeight?: number;
    plotGroupingWeight?: number;
    expansionWeight?: number;
    aestheticWeight?: number;
    reserveExpansionRatio?: number;
    seed?: number;
}
export interface LayoutSolution {
    placements: Placement[];
    score: number;
    coverageMap: CoverageMap;
    accessibility: AccessibilityMap;
    freeTiles: number;
    warnings: string[];
}
export interface GridSnapshot {
    width: number;
    height: number;
    cells: Array<Array<string | null>>;
}
//# sourceMappingURL=layout.d.ts.map