export type SupportedChain = 'chainers' | 'polygon' | 'immutable';
export type NFTCategory = 'avatar' | 'land' | 'wearable' | 'event' | 'unknown';
export interface NFTTransfer {
    contractAddress: string;
    tokenId: string;
    from: string;
    to: string;
    transactionHash: string;
    blockNumber: number;
    timestamp?: string;
    tokenName?: string;
    tokenSymbol?: string;
    tokenURI?: string;
}
export interface TokenTransfer extends Omit<NFTTransfer, 'tokenId'> {
    value: string;
    decimals?: number;
}
export interface NormalizedNFT {
    contractAddress: string;
    tokenId: string;
    name: string;
    image: string;
    attributes: Record<string, string>;
    chain: SupportedChain;
    category: NFTCategory;
    metadata: Record<string, unknown>;
}
export interface OffChainNFT {
    contractAddress?: string;
    tokenId?: string;
    name: string;
    category?: NFTCategory;
    quantity?: number;
}
export interface Transaction {
    hash: string;
    blockNumber: number;
    from: string;
    to: string;
    timestamp?: string;
}
export interface DiscrepancyReport {
    nfts: {
        onChain: NormalizedNFT[];
        offChain: OffChainNFT[];
        missingOnChain: OffChainNFT[];
        extraOnChain: NormalizedNFT[];
    };
    recommendations: string[];
}
//# sourceMappingURL=onchain.d.ts.map