import type { Phytolamp, Position } from '@chainers/shared-types';
import { Grid } from './grid.js';
export interface PlotPosition extends Position {
    instanceId: string;
}
export interface PhytolampCoverage {
    lampPosition: Position;
    lampId: string;
    coveredPlots: Position[];
    coveredPlotIds: string[];
    overlapPenalty: number;
}
export declare function optimizePhytolampPlacement(lamps: Phytolamp[], plots: PlotPosition[], grid: Grid): PhytolampCoverage[];
//# sourceMappingURL=phytolamp.d.ts.map