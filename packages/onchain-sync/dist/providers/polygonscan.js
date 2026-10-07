import { assertAddress, fetchJson } from './types.js';
export class PolygonscanProvider {
    apiKey;
    fetcher;
    baseUrl;
    chain = 'polygon';
    constructor(apiKey, fetcher = fetch, baseUrl = 'https://api.etherscan.io/v2/api') {
        this.apiKey = apiKey;
        this.fetcher = fetcher;
        this.baseUrl = baseUrl;
    }
    async query(action, address) {
        assertAddress(address);
        const url = new URL(this.baseUrl);
        url.search = new URLSearchParams({
            chainid: '137',
            module: 'account',
            action,
            address,
            sort: 'asc',
            apikey: this.apiKey,
        }).toString();
        const body = await fetchJson(this.fetcher, url);
        if (typeof body.result === 'string') {
            if (body.result.toLowerCase().includes('no transactions'))
                return [];
            throw new Error(body.result);
        }
        return body.result ?? [];
    }
    async getERC721Transfers(address) {
        return (await this.query('tokennfttx', address)).map((item) => ({
            contractAddress: item.contractAddress ?? '',
            tokenId: item.tokenID ?? '',
            from: item.from ?? '',
            to: item.to ?? '',
            transactionHash: item.hash ?? '',
            blockNumber: Number(item.blockNumber ?? 0),
            ...(item.timeStamp ? { timestamp: item.timeStamp } : {}),
            ...(item.tokenName ? { tokenName: item.tokenName } : {}),
            ...(item.tokenSymbol ? { tokenSymbol: item.tokenSymbol } : {}),
        }));
    }
    async getERC20Transfers(address) {
        return (await this.query('tokentx', address)).map((item) => ({
            contractAddress: item.contractAddress ?? '',
            from: item.from ?? '',
            to: item.to ?? '',
            transactionHash: item.hash ?? '',
            blockNumber: Number(item.blockNumber ?? 0),
            value: item.value ?? '0',
            ...(item.tokenDecimal ? { decimals: Number(item.tokenDecimal) } : {}),
        }));
    }
    async getBalance(address) {
        const result = await this.query('balance', address);
        return result[0]?.result ?? result[0]?.value ?? '0';
    }
}
//# sourceMappingURL=polygonscan.js.map