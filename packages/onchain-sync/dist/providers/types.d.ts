import type { NFTTransfer, NormalizedNFT, SupportedChain, TokenTransfer } from '@chainers/shared-types';
export interface NFTProvider {
    readonly chain: SupportedChain;
    getERC721Transfers(address: string): Promise<NFTTransfer[]>;
    getERC20Transfers(address: string): Promise<TokenTransfer[]>;
    getBalance(address: string): Promise<string>;
    getOwnedNFTs?(address: string): Promise<NormalizedNFT[]>;
    getTokenMetadata?(contractAddress: string, tokenId: string, tokenURI?: string): Promise<Record<string, unknown>>;
}
export type FetchLike = typeof fetch;
export declare function assertAddress(address: string): void;
export declare function fetchJson<T>(fetcher: FetchLike, url: URL, init?: RequestInit): Promise<T>;
//# sourceMappingURL=types.d.ts.map