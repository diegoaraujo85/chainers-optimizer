import type { InventoryItem, LandPreset, LayoutConstraints, LayoutSolution, Placement } from '@chainers/shared-types';
export declare function validateLayout(land: LandPreset, placements: Placement[]): string[];
export declare function solveLayout(land: LandPreset, inventory: InventoryItem[], constraints?: LayoutConstraints): LayoutSolution;
export declare function solveLayoutAlternatives(land: LandPreset, inventory: InventoryItem[], constraints?: LayoutConstraints): LayoutSolution[];
//# sourceMappingURL=solver.d.ts.map