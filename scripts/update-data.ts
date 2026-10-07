import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { updateOfficialData } from '../packages/data-pipeline/src/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDirectory = path.join(root, 'packages/data-pipeline/data');
const result = await updateOfficialData({ dataDirectory });
console.error(
  result.changed
    ? `Data updated to v${result.version} (${result.changelog.length} semantic changes).`
    : `Data v${result.version} is already current.`,
);
for (const warning of result.warnings) console.warn(`warning: ${warning}`);
