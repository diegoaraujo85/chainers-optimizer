function tranquilWaterTiles() {
    const tiles = [];
    for (let y = 3; y < 17; y += 1) {
        for (let x = 3; x < 17; x += 1) {
            const dx = x - 9.5;
            const dy = y - 9.5;
            if ((dx * dx) / 45 + (dy * dy) / 36 <= 1)
                tiles.push({ x, y });
        }
    }
    return tiles;
}
export const LAND_PRESETS = {
    'Sunny Field': {
        name: 'Sunny Field',
        width: 20,
        height: 15,
        chargingSpot: { x: 10, y: 7 },
        waterTiles: [],
    },
    'Meadow Grove': {
        name: 'Meadow Grove',
        width: 13,
        height: 21,
        chargingSpot: { x: 6, y: 10 },
        waterTiles: [],
    },
    'Golden Acres': {
        name: 'Golden Acres',
        width: 30,
        height: 21,
        chargingSpot: { x: 15, y: 10 },
        waterTiles: [],
    },
    'Tranquil Waters': {
        name: 'Tranquil Waters',
        width: 20,
        height: 20,
        chargingSpot: { x: 10, y: 10 },
        waterTiles: tranquilWaterTiles(),
    },
};
export function getLandPreset(name) {
    const preset = LAND_PRESETS[name];
    if (!preset)
        throw new Error(`Unknown land preset: ${name}`);
    return {
        ...preset,
        chargingSpot: { ...preset.chargingSpot },
        waterTiles: preset.waterTiles.map((tile) => ({ ...tile })),
        blockedTiles: preset.blockedTiles ? preset.blockedTiles.map((tile) => ({ ...tile })) : [],
    };
}
//# sourceMappingURL=land-presets.js.map