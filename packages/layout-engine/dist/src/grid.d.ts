import type { GridSnapshot, Placement, Position } from '@chainers/shared-types';
export declare class Grid {
    readonly width: number;
    readonly height: number;
    private readonly cells;
    private readonly blocked;
    constructor(width: number, height: number, blocked?: Position[]);
    isWithinBounds(x: number, y: number): boolean;
    isBlocked(x: number, y: number): boolean;
    isFree(x: number, y: number): boolean;
    canPlace(x: number, y: number, width: number, height: number): boolean;
    place(placement: Placement): void;
    remove(instanceId: string): void;
    get(x: number, y: number): string | null;
    freePositions(): Position[];
    snapshot(): GridSnapshot;
}
export declare function placementCells(placement: Placement): Position[];
//# sourceMappingURL=grid.d.ts.map