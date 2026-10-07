import type { GridSnapshot, Placement, Position } from '@chainers/shared-types';

const key = ({ x, y }: Position): string => `${x},${y}`;

export class Grid {
  readonly width: number;
  readonly height: number;
  private readonly cells: Array<Array<string | null>>;
  private readonly blocked = new Set<string>();

  constructor(width: number, height: number, blocked: Position[] = []) {
    if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
      throw new Error('Grid dimensions must be positive integers');
    }
    this.width = width;
    this.height = height;
    this.cells = Array.from({ length: height }, () => Array<string | null>(width).fill(null));
    for (const position of blocked) {
      if (this.isWithinBounds(position.x, position.y)) this.blocked.add(key(position));
    }
  }

  isWithinBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  isBlocked(x: number, y: number): boolean {
    return this.blocked.has(key({ x, y }));
  }

  isFree(x: number, y: number): boolean {
    return this.isWithinBounds(x, y) && !this.isBlocked(x, y) && this.cells[y]?.[x] === null;
  }

  canPlace(x: number, y: number, width: number, height: number): boolean {
    for (let dy = 0; dy < height; dy += 1) {
      for (let dx = 0; dx < width; dx += 1) {
        if (!this.isFree(x + dx, y + dy)) return false;
      }
    }
    return true;
  }

  place(placement: Placement): void {
    if (!this.canPlace(placement.x, placement.y, placement.width, placement.height)) {
      throw new Error(`Invalid placement for ${placement.instanceId} at ${placement.x},${placement.y}`);
    }
    for (let dy = 0; dy < placement.height; dy += 1) {
      for (let dx = 0; dx < placement.width; dx += 1) {
        const row = this.cells[placement.y + dy];
        if (row) row[placement.x + dx] = placement.instanceId;
      }
    }
  }

  remove(instanceId: string): void {
    for (const row of this.cells) {
      for (let x = 0; x < row.length; x += 1) {
        if (row[x] === instanceId) row[x] = null;
      }
    }
  }

  get(x: number, y: number): string | null {
    return this.cells[y]?.[x] ?? null;
  }

  freePositions(): Position[] {
    const positions: Position[] = [];
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        if (this.isFree(x, y)) positions.push({ x, y });
      }
    }
    return positions;
  }

  snapshot(): GridSnapshot {
    return { width: this.width, height: this.height, cells: this.cells.map((row) => [...row]) };
  }
}

export function placementCells(placement: Placement): Position[] {
  const positions: Position[] = [];
  for (let y = placement.y; y < placement.y + placement.height; y += 1) {
    for (let x = placement.x; x < placement.x + placement.width; x += 1) positions.push({ x, y });
  }
  return positions;
}
