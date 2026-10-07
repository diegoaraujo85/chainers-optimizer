import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateBundle } from '../packages/data-pipeline/src/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDirectory = path.join(root, 'packages/data-pipeline/data');
const read = async (name: string): Promise<unknown> => JSON.parse(await readFile(path.join(dataDirectory, name), 'utf8'));
validateBundle({
  seeds: await read('seeds.json'),
  animals: await read('animals.json'),
  merges: await read('merges.json'),
  boostItems: await read('boost-items.json'),
  recipes: await read('recipes.json'),
});
console.error('Committed game data is valid.');
