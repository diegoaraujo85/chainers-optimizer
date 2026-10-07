import { createHash } from 'node:crypto';
import { durationSeconds, field, imageFor, numeric, parseMarkdownTables } from '../transformers/markdown.js';
import { fetchText } from './http.js';
const DOCS_ROOT = 'https://docs.chainers.io/chainers-docs/chainers/chainers-farm';
const KNOWN_PAGES = ['seeds', 'animals', 'farm-boost-items', 'reward-pools'];
const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
function rarity(value) {
    return rarities.find((candidate) => value?.toLowerCase().includes(candidate));
}
function normalizeType(value) {
    const normalized = value?.trim().toLowerCase() ?? 'basic';
    if (normalized.includes('seasonal food'))
        return 'Seasonal Food Seed';
    if (normalized === 'seasonal seed')
        return 'Seasonal Seed';
    if (normalized.includes('seasonal'))
        return 'Seasonal';
    if (normalized.includes('disposable'))
        return 'Disposable';
    if (normalized.includes('limited'))
        return 'Limited';
    return 'Basic';
}
function parseSeeds(markdown, sourceUrl, scrapedAt) {
    return parseMarkdownTables(markdown).flatMap((table) => table.flatMap((row) => {
        const name = field(row, ['name', 'seed']);
        const itemRarity = rarity(field(row, ['rarity']));
        const biopoints = numeric(field(row, ['biopoint', 'bp']));
        const growthTimeSeconds = durationSeconds(field(row, ['growth', 'time']));
        if (!name || !itemRarity || !biopoints || !growthTimeSeconds)
            return [];
        const imageUrl = imageFor(markdown, name);
        return [{
                name,
                type: normalizeType(field(row, ['type', 'category'])),
                rarity: itemRarity,
                biopoints,
                growthTimeSeconds,
                ...(imageUrl ? { imageUrl } : {}),
                sourceUrl,
                scrapedAt,
            }];
    }));
}
function parseAnimals(markdown, sourceUrl, scrapedAt) {
    return parseMarkdownTables(markdown).flatMap((table) => table.flatMap((row) => {
        const name = field(row, ['name', 'animal']);
        const itemRarity = rarity(field(row, ['rarity']));
        const biopoints = numeric(field(row, ['biopoint', 'bp']));
        const growthTimeSeconds = durationSeconds(field(row, ['growth', 'production', 'time']));
        if (!name || !itemRarity || !biopoints || !growthTimeSeconds)
            return [];
        const imageUrl = imageFor(markdown, name);
        return [{
                name,
                category: field(row, ['category', 'animal type']) ?? name.split(/\s+/).at(-1) ?? name,
                product: field(row, ['product', 'produce']) ?? 'Unknown',
                rarity: itemRarity,
                biopoints,
                growthTimeSeconds,
                ...(imageUrl ? { imageUrl } : {}),
                sourceUrl,
                scrapedAt,
            }];
    }));
}
function boostKind(row) {
    const value = `${field(row, ['type', 'category']) ?? ''} ${field(row, ['name', 'item']) ?? ''}`.toLowerCase();
    if (value.includes('phytolamp') || value.includes('lamp'))
        return 'phytolamp';
    if (value.includes('fertilizer'))
        return 'fertilizer';
    if (value.includes('cropper'))
        return 'cropper';
    if (value.includes('land'))
        return 'land';
    if (value.includes('plot'))
        return 'plot';
    return undefined;
}
function parseBoostItems(markdown, sourceUrl, scrapedAt) {
    return parseMarkdownTables(markdown).flatMap((table) => table.flatMap((row) => {
        const name = field(row, ['name', 'item']);
        const kind = boostKind(row);
        if (!name || !kind)
            return [];
        const itemRarity = rarity(field(row, ['rarity'])) ?? 'common';
        const imageUrl = imageFor(markdown, name);
        const multiplier = numeric(field(row, ['multiplier', 'boost']));
        const coverageRadius = numeric(field(row, ['radius', 'coverage']));
        const width = numeric(field(row, ['width']));
        const height = numeric(field(row, ['height']));
        return [{
                name,
                kind,
                rarity: itemRarity,
                ...(multiplier ? { multiplier } : {}),
                ...(coverageRadius ? { coverageRadius } : {}),
                ...(width ? { width } : {}),
                ...(height ? { height } : {}),
                ...(imageUrl ? { imageUrl } : {}),
                sourceUrl,
                scrapedAt,
            }];
    }));
}
async function discoverPages(fetcher) {
    const defaults = Object.fromEntries(KNOWN_PAGES.map((page) => [page, `${DOCS_ROOT}/${page}`]));
    try {
        const llms = await fetchText('https://docs.chainers.io/llms.txt', { fetcher });
        for (const page of KNOWN_PAGES) {
            const match = llms.match(new RegExp(`https://docs\\.chainers\\.io/[^\\s)>]*${page}[^\\s)>]*`, 'i'));
            if (match?.[0])
                defaults[page] = match[0].replace(/\.md$/i, '');
        }
    }
    catch {
        // Stable known routes remain available if discovery is temporarily unavailable.
    }
    return defaults;
}
export async function scrapeChainersDocs(fetcher = fetch) {
    const timestamp = new Date().toISOString();
    const warnings = [];
    const pages = await discoverPages(fetcher);
    const documents = new Map();
    for (const page of KNOWN_PAGES) {
        const url = pages[page];
        try {
            documents.set(page, await fetchText(`${url}.md`, { fetcher }));
        }
        catch (error) {
            warnings.push(`${page}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    const seedsMarkdown = documents.get('seeds') ?? '';
    const animalsMarkdown = documents.get('animals') ?? '';
    const boostMarkdown = documents.get('farm-boost-items') ?? '';
    const digest = createHash('sha256').update([...documents.values()].join('\n')).digest('hex').slice(0, 12);
    return {
        seeds: parseSeeds(seedsMarkdown, pages.seeds, timestamp),
        animals: parseAnimals(animalsMarkdown, pages.animals, timestamp),
        boostItems: parseBoostItems(boostMarkdown, pages['farm-boost-items'], timestamp),
        timestamp,
        sourceVersion: digest,
        warnings,
    };
}
//# sourceMappingURL=chainers-docs.js.map