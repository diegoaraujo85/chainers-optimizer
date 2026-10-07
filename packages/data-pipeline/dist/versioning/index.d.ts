import type { DataBundle, VersionedData } from '../types.js';
export declare function latestVersion(dataDirectory: string): Promise<number>;
export declare function readBundle(directory: string): Promise<DataBundle>;
export declare function persistVersion(dataDirectory: string, versioned: VersionedData): Promise<string>;
//# sourceMappingURL=index.d.ts.map