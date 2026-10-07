import { assertAddress, fetchJson } from './types.js';
const numberValue = (value) => Number(value ?? 0);
export class BlockscoutProProvider {
    apiKey;
    chainId;
    fetcher;
    baseUrl;
    chain = 'chainers';
    constructor(apiKey, chainId = 7897, fetcher = fetch, baseUrl = 'https://api.blockscout.com/v2/api') {
        this.apiKey = apiKey;
        this.chainId = chainId;
        this.fetcher = fetcher;
        this.baseUrl = baseUrl;
    }
    async accountQuery(action, address) {
        assertAddress(address);
        const url = new URL(this.baseUrl);
        url.search = new URLSearchParams({
            chain_id: String(this.chainId),
            module: 'account',
            action,
            address,
            apikey: this.apiKey,
        }).toString();
        const body = await fetchJson(this.fetcher, url);
        if (typeof body.result === 'string')
            throw new Error(body.result);
        return body.result ?? [];
    }
    async getERC721Transfers(address) {
        return (await this.accountQuery('tokennfttx', address)).map((item) => ({
            contractAddress: item.contractAddress ?? item.contract_address ?? '',
            tokenId: item.tokenID ?? item.token_id ?? '',
            from: item.from ?? '',
            to: item.to ?? '',
            transactionHash: item.hash ?? item.transaction_hash ?? '',
            blockNumber: numberValue(item.blockNumber ?? item.block_number),
            ...(item.timeStamp || item.timestamp ? { timestamp: item.timeStamp ?? item.timestamp } : {}),
            ...(item.tokenName ? { tokenName: item.tokenName } : {}),
            ...(item.tokenSymbol ? { tokenSymbol: item.tokenSymbol } : {}),
            ...(item.tokenURI ? { tokenURI: item.tokenURI } : {}),
        }));
    }
    async getERC20Transfers(address) {
        return (await this.accountQuery('tokentx', address)).map((item) => ({
            contractAddress: item.contractAddress ?? item.contract_address ?? '',
            from: item.from ?? '',
            to: item.to ?? '',
            transactionHash: item.hash ?? item.transaction_hash ?? '',
            blockNumber: numberValue(item.blockNumber ?? item.block_number),
            value: item.value ?? '0',
            ...(item.tokenDecimal ? { decimals: numberValue(item.tokenDecimal) } : {}),
        }));
    }
    async getBalance(address) {
        const result = await this.accountQuery('balance', address);
        return result[0]?.value ?? '0';
    }
}
//# sourceMappingURL=blockscout-pro.js.map