import type { AccessibilityMap, Placement, Position } from '@chainers/shared-types';
import { Grid } from './grid.js';
export declare function findPath(grid: Grid, start: Position, goals: Position[]): Position[];
export declare function cropperAdjacentCells(grid: Grid, cropper: Placement): Position[];
export declare function evaluateCropperAccessibility(grid: Grid, chargingSpot: Position, cropper?: Placement): AccessibilityMap;
//# sourceMappingURL=cropper.d.ts.map