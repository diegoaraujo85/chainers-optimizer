import type { DiscrepancyReport, NormalizedNFT, OffChainNFT } from '@chainers/shared-types';

const normalizedName = (name: string): string => name.trim().toLowerCase().replace(/\s+/g, ' ');
const chainKey = (nft: NormalizedNFT): string => `${nft.contractAddress.toLowerCase()}:${nft.tokenId}`;

function matches(offchain: OffChainNFT, onchain: NormalizedNFT): boolean {
  if (offchain.contractAddress && offchain.tokenId) {
    return `${offchain.contractAddress.toLowerCase()}:${offchain.tokenId}` === chainKey(onchain);
  }
  return normalizedName(offchain.name) === normalizedName(onchain.name);
}

export function compareInventories(onChain: NormalizedNFT[], offChain: OffChainNFT[]): DiscrepancyReport {
  const matched = new Set<string>();
  const missingOnChain = offChain.filter((item) => {
    const match = onChain.find((nft) => !matched.has(chainKey(nft)) && matches(item, nft));
    if (match) matched.add(chainKey(match));
    return !match;
  });
  const extraOnChain = onChain.filter((nft) => !matched.has(chainKey(nft)));
  const recommendations: string[] = [];
  if (missingOnChain.length > 0) {
    recommendations.push('Confirm whether off-chain-only items are game inventory objects that have not been minted.');
  }
  if (extraOnChain.length > 0) {
    recommendations.push('Import verified on-chain NFTs into the local inventory after user confirmation.');
  }
  if (missingOnChain.length === 0 && extraOnChain.length === 0) {
    recommendations.push('No discrepancies detected.');
  }
  return { nfts: { onChain, offChain, missingOnChain, extraOnChain }, recommendations };
}
