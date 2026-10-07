import type { LandPreset, LayoutSolution } from '@chainers/shared-types';

const COLORS: Record<string, string> = {
  plot: '#84a98c',
  waterPlot: '#4ea8de',
  animal: '#bc6c25',
  phytolamp: '#ffd166',
  cropper: '#6d597a',
  decoration: '#adb5bd',
};

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (character) => {
    const entities: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' };
    return entities[character] ?? character;
  });
}

export function renderLayoutSvg(land: LandPreset, solution: LayoutSolution, tileSize = 24): string {
  const width = land.width * tileSize;
  const height = land.height * tileSize;
  const gridLines: string[] = [];
  for (let x = 0; x <= land.width; x += 1) gridLines.push(`<path d="M${x * tileSize} 0V${height}"/>`);
  for (let y = 0; y <= land.height; y += 1) gridLines.push(`<path d="M0 ${y * tileSize}H${width}"/>`);
  const water = land.waterTiles.map(
    ({ x, y }) => `<rect x="${x * tileSize}" y="${y * tileSize}" width="${tileSize}" height="${tileSize}" fill="#d8f3ff"/>`,
  );
  const items = solution.placements.map((placement) => {
    const color = COLORS[placement.itemType] ?? (['plot', 'waterPlot'].includes(placement.itemType) ? COLORS.plot : COLORS.animal);
    return `<g><rect x="${placement.x * tileSize + 1}" y="${placement.y * tileSize + 1}" width="${placement.width * tileSize - 2}" height="${placement.height * tileSize - 2}" rx="3" fill="${color}"/><title>${escapeXml(placement.instanceId)} (${placement.x},${placement.y})</title></g>`;
  });
  const charging = `<circle cx="${(land.chargingSpot.x + 0.5) * tileSize}" cy="${(land.chargingSpot.y + 0.5) * tileSize}" r="${tileSize * 0.3}" fill="#ef476f"><title>Charging spot</title></circle>`;
  const path = solution.accessibility.path
    .map(({ x, y }) => `${(x + 0.5) * tileSize},${(y + 0.5) * tileSize}`)
    .join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(land.name)} optimized layout" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#f7f4ea"/>${water.join('')}<g stroke="#d9d5c9" stroke-width="0.5">${gridLines.join('')}</g>${items.join('')}${charging}${path ? `<polyline points="${path}" fill="none" stroke="#ef476f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` : ''}</svg>`;
}
