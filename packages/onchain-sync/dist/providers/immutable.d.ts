import type { NFTTransfer, NormalizedNFT, TokenTransfer } from '@chainers/shared-types';
import { type FetchLike, type NFTProvider } from './types.js';
export declare class ImmutableProvider implements NFTProvider {
    private readonly publishableKey;
    private readonly fetcher;
    private readonly baseUrl;
    private readonly chainName;
    readonly chain: "immutable";
    constructor(publishableKey: string, fetcher?: FetchLike, baseUrl?: string, chainName?: string);
    getOwnedNFTs(address: string): Promise<NormalizedNFT[]>;
    getERC721Transfers(_address: string): Promise<NFTTransfer[]>;
    getERC20Transfers(_address: string): Promise<TokenTransfer[]>;
    getBalance(_address: string): Promise<string>;
}
//# sourceMappingURL=immutable.d.ts.map