const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const key = (contract, tokenId) => `${contract.toLowerCase()}:${tokenId}`;
function currentHoldings(address, transfers) {
    const holdings = new Map();
    const sorted = [...transfers].sort((a, b) => a.blockNumber - b.blockNumber);
    for (const transfer of sorted) {
        const id = key(transfer.contractAddress, transfer.tokenId);
        if (transfer.to.toLowerCase() === address.toLowerCase())
            holdings.set(id, transfer);
        if (transfer.from.toLowerCase() === address.toLowerCase() && transfer.to.toLowerCase() !== address.toLowerCase())
            holdings.delete(id);
    }
    return [...holdings.values()];
}
function attributesFrom(metadata) {
    const attributes = metadata.attributes;
    if (Array.isArray(attributes)) {
        return Object.fromEntries(attributes.flatMap((value) => {
            if (!value || typeof value !== 'object')
                return [];
            const item = value;
            const trait = item.trait_type ?? item.traitType;
            return typeof trait === 'string' ? [[trait, String(item.value ?? '')]] : [];
        }));
    }
    if (attributes && typeof attributes === 'object') {
        return Object.fromEntries(Object.entries(attributes).map(([name, value]) => [name, String(value)]));
    }
    return {};
}
export function classifyNFT(name, attributes, contractAddress) {
    const searchable = `${name} ${contractAddress} ${Object.keys(attributes).join(' ')} ${Object.values(attributes).join(' ')}`.toLowerCase();
    if (/golden acres|sunny field|meadow grove|tranquil waters|\bland\b/.test(searchable))
        return 'land';
    if (/avatar|character|skin/.test(searchable))
        return 'avatar';
    if (/wearable|hat|shirt|pants|shoes|outfit/.test(searchable))
        return 'wearable';
    if (/event|ticket|pass/.test(searchable))
        return 'event';
    return 'unknown';
}
export async function indexUserNFTs(address, providers) {
    const batches = await Promise.all(providers.map(async (provider) => {
        if (provider.getOwnedNFTs)
            return provider.getOwnedNFTs(address);
        const transfers = await provider.getERC721Transfers(address);
        return Promise.all(currentHoldings(address, transfers).map(async (transfer) => {
            let metadata = {};
            if (provider.getTokenMetadata) {
                metadata = await provider.getTokenMetadata(transfer.contractAddress, transfer.tokenId, transfer.tokenURI);
            }
            const attributes = attributesFrom(metadata);
            const name = String(metadata.name ?? transfer.tokenName ?? `NFT #${transfer.tokenId}`);
            return {
                contractAddress: transfer.contractAddress,
                tokenId: transfer.tokenId,
                name,
                image: String(metadata.image ?? ''),
                attributes,
                chain: provider.chain,
                category: classifyNFT(name, attributes, transfer.contractAddress),
                metadata,
            };
        }));
    }));
    const deduped = new Map();
    for (const nft of batches.flat()) {
        if (nft.contractAddress.toLowerCase() === ZERO_ADDRESS)
            continue;
        const identifier = `${nft.chain}:${key(nft.contractAddress, nft.tokenId)}`;
        const category = classifyNFT(nft.name, nft.attributes, nft.contractAddress);
        deduped.set(identifier, { ...nft, category: nft.category === 'unknown' ? category : nft.category });
    }
    return [...deduped.values()].sort((a, b) => a.chain.localeCompare(b.chain) || a.name.localeCompare(b.name));
}
//# sourceMappingURL=nft-indexer.js.map