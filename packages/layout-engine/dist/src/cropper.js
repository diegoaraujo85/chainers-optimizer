import { placementCells } from './grid.js';
const DIRECTIONS = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
];
const key = (position) => `${position.x},${position.y}`;
export function findPath(grid, start, goals) {
    const goalKeys = new Set(goals.map(key));
    const queue = [start];
    const visited = new Set([key(start)]);
    const previous = new Map();
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
        const current = queue[cursor];
        if (!current)
            continue;
        if (goalKeys.has(key(current))) {
            const path = [current];
            let point = current;
            while (key(point) !== key(start)) {
                const parent = previous.get(key(point));
                if (!parent)
                    break;
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
export function cropperAdjacentCells(grid, cropper) {
    const occupied = new Set(placementCells(cropper).map(key));
    const adjacent = new Map();
    for (const cell of placementCells(cropper)) {
        for (const direction of DIRECTIONS) {
            const candidate = { x: cell.x + direction.x, y: cell.y + direction.y };
            if (grid.isWithinBounds(candidate.x, candidate.y) &&
                !occupied.has(key(candidate)) &&
                grid.get(candidate.x, candidate.y) === null) {
                adjacent.set(key(candidate), candidate);
            }
        }
    }
    return [...adjacent.values()];
}
export function evaluateCropperAccessibility(grid, chargingSpot, cropper) {
    if (!cropper)
        return { cropperAccessible: true, path: [], unreachableItems: [] };
    const path = findPath(grid, chargingSpot, cropperAdjacentCells(grid, cropper));
    return {
        cropperAccessible: path.length > 0,
        path,
        unreachableItems: path.length > 0 ? [] : [cropper.instanceId],
    };
}
//# sourceMappingURL=cropper.js.map