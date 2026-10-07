import path from 'node:path';
import { scrapeChainersDocs, scrapeMinaryganar } from './scrapers/index.js';
import { validateAndVersion } from './validators/index.js';
import { latestVersion, persistVersion, readBundle } from './versioning/index.js';
function chooseFresh(fresh, fallback) {
    return fresh.length > 0 ? fresh : fallback;
}
export async function updateOfficialData(options) {
    const currentVersion = await latestVersion(options.dataDirectory);
    const previous = currentVersion > 0 ? await readBundle(path.join(options.dataDirectory, `v${currentVersion}`)) : undefined;
    const [official, community] = await Promise.all([
        scrapeChainersDocs(options.fetcher),
        scrapeMinaryganar(options.fetcher),
    ]);
    const fallback = previous ?? { seeds: [], animals: [], merges: [], boostItems: [], recipes: [] };
    const next = {
        seeds: chooseFresh(official.seeds, fallback.seeds),
        animals: chooseFresh(official.animals, fallback.animals),
        boostItems: chooseFresh(official.boostItems, fallback.boostItems),
        merges: chooseFresh(community.animalMerges, fallback.merges),
        recipes: fallback.recipes,
    };
    const warnings = [...official.warnings, ...community.warnings];
    const versioned = validateAndVersion(next, previous, currentVersion, warnings);
    if (versioned.changed && !options.dryRun)
        await persistVersion(options.dataDirectory, versioned);
    return versioned;
}
//# sourceMappingURL=pipeline.js.map