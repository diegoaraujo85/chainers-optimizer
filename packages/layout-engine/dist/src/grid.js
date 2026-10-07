const key = ({ x, y }) => `${x},${y}`;
export class Grid {
    width;
    height;
    cells;
    blocked = new Set();
    constructor(width, height, blocked = []) {
        if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
            throw new Error('Grid dimensions must be positive integers');
        }
        this.width = width;
        this.height = height;
        this.cells = Array.from({ length: height }, () => Array(width).fill(null));
        for (const position of blocked) {
            if (this.isWithinBounds(position.x, position.y))
                this.blocked.add(key(position));
        }
    }
    isWithinBounds(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }
    isBlocked(x, y) {
        return this.blocked.has(key({ x, y }));
    }
    isFree(x, y) {
        return this.isWithinBounds(x, y) && !this.isBlocked(x, y) && this.cells[y]?.[x] === null;
    }
    canPlace(x, y, width, height) {
        for (let dy = 0; dy < height; dy += 1) {
            for (let dx = 0; dx < width; dx += 1) {
                if (!this.isFree(x + dx, y + dy))
                    return false;
            }
        }
        return true;
    }
    place(placement) {
        if (!this.canPlace(placement.x, placement.y, placement.width, placement.height)) {
            throw new Error(`Invalid placement for ${placement.instanceId} at ${placement.x},${placement.y}`);
        }
        for (let dy = 0; dy < placement.height; dy += 1) {
            for (let dx = 0; dx < placement.width; dx += 1) {
                const row = this.cells[placement.y + dy];
                if (row)
                    row[placement.x + dx] = placement.instanceId;
            }
        }
    }
    remove(instanceId) {
        for (const row of this.cells) {
            for (let x = 0; x < row.length; x += 1) {
                if (row[x] === instanceId)
                    row[x] = null;
            }
        }
    }
    get(x, y) {
        return this.cells[y]?.[x] ?? null;
    }
    freePositions() {
        const positions = [];
        for (let y = 0; y < this.height; y += 1) {
            for (let x = 0; x < this.width; x += 1) {
                if (this.isFree(x, y))
                    positions.push({ x, y });
            }
        }
        return positions;
    }
    snapshot() {
        return { width: this.width, height: this.height, cells: this.cells.map((row) => [...row]) };
    }
}
export function placementCells(placement) {
    const positions = [];
    for (let y = placement.y; y < placement.y + placement.height; y += 1) {
        for (let x = placement.x; x < placement.x + placement.width; x += 1)
            positions.push({ x, y });
    }
    return positions;
}
//# sourceMappingURL=grid.js.map