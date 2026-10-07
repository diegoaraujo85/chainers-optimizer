import { assertAddress, fetchJson } from './types.js';
export class ImmutableProvider {
    publishableKey;
    fetcher;
    baseUrl;
    chainName;
    chain = 'immutable';
    constructor(publishableKey, fetcher = fetch, baseUrl = 'https://api.immutable.com', chainName = 'imtbl-zkevm-mainnet') {
        this.publishableKey = publishableKey;
        this.fetcher = fetcher;
        this.baseUrl = baseUrl;
        this.chainName = chainName;
    }
    async getOwnedNFTs(address) {
        assertAddress(address);
        const all = [];
        let cursor;
        do {
            const url = new URL(`/v1/chains/${this.chainName}/accounts/${address}/nfts`, this.baseUrl);
            if (cursor)
                url.searchParams.set('page_cursor', cursor);
            url.searchParams.set('page_size', '200');
            const body = await fetchJson(this.fetcher, url, {
                headers: { 'x-immutable-publishable-key': this.publishableKey },
            });
            all.push(...(body.result ?? []));
            cursor = body.page?.next_cursor;
        } while (cursor);
        return all.map((nft) => ({
            contractAddress: nft.contract_address ?? '',
            tokenId: nft.token_id ?? '',
            name: nft.name ?? `NFT #${nft.token_id ?? 'unknown'}`,
            image: nft.image ?? '',
            attributes: Array.isArray(nft.attributes)
                ? Object.fromEntries(nft.attributes.map((attribute) => [attribute.trait_type ?? 'unknown', String(attribute.value ?? '')]))
                : (nft.attributes ?? {}),
            chain: 'immutable',
            category: 'unknown',
            metadata: nft.metadata ?? {},
        }));
    }
    async getERC721Transfers(_address) {
        return [];
    }
    async getERC20Transfers(_address) {
        return [];
    }
    async getBalance(_address) {
        return '0';
    }
}
//# sourceMappingURL=immutable.js.map