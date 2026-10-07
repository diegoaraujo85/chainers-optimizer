import type { NFTTransfer, TokenTransfer } from '@chainers/shared-types';
import { type FetchLike, type NFTProvider } from './types.js';
export declare class PolygonscanProvider implements NFTProvider {
    private readonly apiKey;
    private readonly fetcher;
    private readonly baseUrl;
    readonly chain: "polygon";
    constructor(apiKey: string, fetcher?: FetchLike, baseUrl?: string);
    private query;
    getERC721Transfers(address: string): Promise<NFTTransfer[]>;
    getERC20Transfers(address: string): Promise<TokenTransfer[]>;
    getBalance(address: string): Promise<string>;
}
//# sourceMappingURL=polygonscan.d.ts.map