import type { VersionedData } from './types.js';
export interface UpdateOptions {
    dataDirectory: string;
    fetcher?: typeof fetch;
    dryRun?: boolean;
}
export declare function updateOfficialData(options: UpdateOptions): Promise<VersionedData>;
//# sourceMappingURL=pipeline.d.ts.map