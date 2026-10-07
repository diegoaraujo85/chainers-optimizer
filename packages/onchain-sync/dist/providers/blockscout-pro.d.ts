import type { NFTTransfer, TokenTransfer } from '@chainers/shared-types';
import { type FetchLike, type NFTProvider } from './types.js';
export declare class BlockscoutProProvider implements NFTProvider {
    private readonly apiKey;
    private readonly chainId;
    private readonly fetcher;
    private readonly baseUrl;
    readonly chain: "chainers";
    constructor(apiKey: string, chainId?: number, fetcher?: FetchLike, baseUrl?: string);
    private accountQuery;
    getERC721Transfers(address: string): Promise<NFTTransfer[]>;
    getERC20Transfers(address: string): Promise<TokenTransfer[]>;
    getBalance(address: string): Promise<string>;
}
//# sourceMappingURL=blockscout-pro.d.ts.map