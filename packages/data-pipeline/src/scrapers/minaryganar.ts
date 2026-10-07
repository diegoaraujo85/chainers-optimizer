import type { DataRarity, MergeCostDataItem, MinaryganarData, SeedMultiplierData } from '../types.js';
import { field, numeric, parseMarkdownTables } from '../transformers/markdown.js';
import { fetchText } from './http.js';

const ANIMALS_URL = 'https://minaryganar.com/chainers/animals';
const SEEDS_URL = 'https://minaryganar.com/chainers/seeds';
const rarities: DataRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

function rarity(value: string | undefined): DataRarity | undefined {
  return rarities.find((candidate) => value?.toLowerCase().includes(candidate));
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<\/t[dh]>/gi, ' | ')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/[ \t]+/g, ' ');
}

function htmlTablesToMarkdown(html: string): string {
  return [...html.matchAll(/<table[\s\S]*?<\/table>/gi)]
    .map((match) => {
      const rows = [...match[0].matchAll(/<tr[\s\S]*?<\/tr>/gi)].map((row) =>
        [...row[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => stripHtml(cell[1] ?? '').trim()),
      );
      if (rows.length < 2) return '';
      const header = rows[0] ?? [];
      return `| ${header.join(' | ')} |\n| ${header.map(() => '---').join(' | ')} |\n${rows
        .slice(1)
        .map((row) => `| ${row.join(' | ')} |`)
        .join('\n')}`;
    })
    .join('\n\n');
}

function parseMerges(content: string, scrapedAt: string): MergeCostDataItem[] {
  const markdown = content.includes('<table') ? htmlTablesToMarkdown(content) : content;
  return parseMarkdownTables(markdown).flatMap((table) =>
    table.flatMap((row): MergeCostDataItem[] => {
      const animal = field(row, ['animal', 'name']);
      const fromRarity = rarity(field(row, ['from', 'rarity']));
      const toRarity = rarity(field(row, ['to', 'result']));
      const unitsRequired = numeric(field(row, ['unit', 'required', 'quantity']));
      const costCFB = numeric(field(row, ['cfb', 'cost']));
      if (!animal || !fromRarity || !toRarity || !unitsRequired || costCFB === undefined) return [];
      return [{ animal, fromRarity, toRarity, unitsRequired, costCFB, sourceUrl: ANIMALS_URL, scrapedAt }];
    }),
  );
}

function parseMultipliers(content: string, scrapedAt: string): SeedMultiplierData[] {
  const markdown = content.includes('<table') ? htmlTablesToMarkdown(content) : content;
  return parseMarkdownTables(markdown).flatMap((table) =>
    table.flatMap((row): SeedMultiplierData[] => {
      const seed = field(row, ['seed', 'name']);
      const multiplier = numeric(field(row, ['multiplier']));
      const harvestRatio = numeric(field(row, ['harvest', 'ratio']));
      if (!seed || !multiplier || !harvestRatio) return [];
      return [{ seed, multiplier, harvestRatio, sourceUrl: SEEDS_URL, scrapedAt }];
    }),
  );
}

export async function scrapeMinaryganar(fetcher: typeof fetch = fetch): Promise<MinaryganarData> {
  const timestamp = new Date().toISOString();
  const warnings: string[] = [];
  let animals = '';
  let seeds = '';
  try {
    animals = await fetchText(ANIMALS_URL, { fetcher });
  } catch (error) {
    warnings.push(`animals: ${error instanceof Error ? error.message : String(error)}`);
  }
  try {
    seeds = await fetchText(SEEDS_URL, { fetcher });
  } catch (error) {
    warnings.push(`seeds: ${error instanceof Error ? error.message : String(error)}`);
  }
  const animalMerges = parseMerges(animals, timestamp);
  const seedMultipliers = parseMultipliers(seeds, timestamp);
  if (animals && animalMerges.length === 0) warnings.push('animals: dynamic table not found; retained committed fallback data');
  if (seeds && seedMultipliers.length === 0) warnings.push('seeds: dynamic table not found; retained committed fallback data');
  return { animalMerges, seedMultipliers, timestamp, warnings };
}
