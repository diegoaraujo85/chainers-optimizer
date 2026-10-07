import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import type { DataBundle, DataChange, VersionedData } from '../types.js';

const collections: Array<[keyof DataBundle, string]> = [
  ['seeds', 'seeds.json'],
  ['animals', 'animals.json'],
  ['merges', 'merges.json'],
  ['boostItems', 'boost-items.json'],
  ['recipes', 'recipes.json'],
];

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function latestVersion(dataDirectory: string): Promise<number> {
  if (!(await exists(dataDirectory))) return 0;
  const entries = await readdir(dataDirectory, { withFileTypes: true });
  return entries.reduce((latest, entry) => {
    const match = entry.isDirectory() ? /^v(\d+)$/.exec(entry.name) : null;
    return match?.[1] ? Math.max(latest, Number(match[1])) : latest;
  }, 0);
}

export async function readBundle(directory: string): Promise<DataBundle> {
  const result: Partial<DataBundle> = {};
  for (const [property, filename] of collections) {
    result[property] = JSON.parse(await readFile(path.join(directory, filename), 'utf8')) as never;
  }
  return result as DataBundle;
}

function markdownChangelog(changes: DataChange[], warnings: string[]): string {
  const lines = ['# Data changelog', ''];
  if (changes.length === 0) lines.push('- No semantic changes.');
  for (const change of changes) {
    const marker = change.severity === 'warning' ? '**ALERT** ' : '';
    lines.push(`- ${marker}${change.collection}/${change.key}: ${change.field} ${JSON.stringify(change.before)} → ${JSON.stringify(change.after)}`);
  }
  if (warnings.length > 0) lines.push('', '## Scraper warnings', ...warnings.map((warning) => `- ${warning}`));
  return `${lines.join('\n')}\n`;
}

export async function persistVersion(dataDirectory: string, versioned: VersionedData): Promise<string> {
  const target = path.join(dataDirectory, `v${versioned.version}`);
  await mkdir(target, { recursive: true });
  for (const [property, filename] of collections) {
    const serialized = `${JSON.stringify(versioned.bundle[property], null, 2)}\n`;
    await writeFile(path.join(target, filename), serialized, 'utf8');
    await writeFile(path.join(dataDirectory, filename), serialized, 'utf8');
  }
  await writeFile(path.join(target, 'CHANGELOG.md'), markdownChangelog(versioned.changelog, versioned.warnings), 'utf8');
  await writeFile(
    path.join(dataDirectory, 'manifest.json'),
    `${JSON.stringify({ version: versioned.version, updatedAt: new Date().toISOString(), warnings: versioned.warnings }, null, 2)}\n`,
    'utf8',
  );
  return target;
}
