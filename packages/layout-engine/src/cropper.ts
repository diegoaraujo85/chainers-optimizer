import type { AccessibilityMap, Placement, Position } from '@chainers/shared-types';
import { Grid, placementCells } from './grid.js';

const DIRECTIONS: Position[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];
const key = (position: Position): string => `${position.x},${position.y}`;

export function findPath(grid: Grid, start: Position, goals: Position[]): Position[] {
  const goalKeys = new Set(goals.map(key));
  const queue: Position[] = [start];
  const visited = new Set<string>([key(start)]);
  const previous = new Map<string, Position>();

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor];
    if (!current) continue;
    if (goalKeys.has(key(current))) {
      const path: Position[] = [current];
      let point = current;
      while (key(point) !== key(start)) {
        const parent = previous.get(key(point));
        if (!parent) break;
        path.push(parent);
        point = parent;
      }
      return path.reverse();
    }
    for (const direction of DIRECTIONS) {
      const next = { x: current.x + direction.x, y: current.y + direction.y };
      const nextKey = key(next);
      const passable = grid.isWithinBounds(next.x, next.y) && !grid.isBlocked(next.x, next.y) && grid.get(next.x, next.y) === null;
      if (passable && !visited.has(nextKey)) {
        visited.add(nextKey);
        previous.set(nextKey, current);
        queue.push(next);
      }
    }
  }
  return [];
}

export function cropperAdjacentCells(grid: Grid, cropper: Placement): Position[] {
  const occupied = new Set(placementCells(cropper).map(key));
  const adjacent = new Map<string, Position>();
  for (const cell of placementCells(cropper)) {
    for (const direction of DIRECTIONS) {
      const candidate = { x: cell.x + direction.x, y: cell.y + direction.y };
      if (
        grid.isWithinBounds(candidate.x, candidate.y) &&
        !occupied.has(key(candidate)) &&
        grid.get(candidate.x, candidate.y) === null
      ) {
        adjacent.set(key(candidate), candidate);
      }
    }
  }
  return [...adjacent.values()];
}

export function evaluateCropperAccessibility(
  grid: Grid,
  chargingSpot: Position,
  cropper?: Placement,
): AccessibilityMap {
  if (!cropper) return { cropperAccessible: true, path: [], unreachableItems: [] };
  const path = findPath(grid, chargingSpot, cropperAdjacentCells(grid, cropper));
  return {
    cropperAccessible: path.length > 0,
    path,
    unreachableItems: path.length > 0 ? [] : [cropper.instanceId],
  };
}
