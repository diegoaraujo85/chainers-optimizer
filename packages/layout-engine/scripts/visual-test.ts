import { writeFile } from 'node:fs/promises';
import type { InventoryItem } from '@chainers/shared-types';
import { getLandPreset, renderLayoutSvg, solveLayout } from '../src/index.js';

const inventory: InventoryItem[] = [
  { id: 'plot', type: 'plot', rarity: 'legendary', count: 16 },
  { id: 'lamp', type: 'phytolamp', rarity: 'rare', count: 4, coverageRadius: 2 },
  { id: 'cropper', type: 'cropper', count: 1 },
  { id: 'cattle', type: 'cattle', rarity: 'epic', count: 3 },
];
const land = getLandPreset('Golden Acres');
const solution = solveLayout(land, inventory);
await writeFile(new URL('../visual-test.svg', import.meta.url), renderLayoutSvg(land, solution), 'utf8');
console.error(`visual-test.svg generated with score ${solution.score.toFixed(2)}`);
