import type { NFTCategory, NormalizedNFT } from '@chainers/shared-types';
import type { NFTProvider } from './providers/types.js';
export declare function classifyNFT(name: string, attributes: Record<string, string>, contractAddress: string): NFTCategory;
export declare function indexUserNFTs(address: string, providers: NFTProvider[]): Promise<NormalizedNFT[]>;
//# sourceMappingURL=nft-indexer.d.ts.map