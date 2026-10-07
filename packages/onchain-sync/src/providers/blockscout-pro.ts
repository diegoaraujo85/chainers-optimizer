import type { NFTTransfer, TokenTransfer } from '@chainers/shared-types';
import { assertAddress, fetchJson, type FetchLike, type NFTProvider } from './types.js';

interface BlockscoutItem {
  contractAddress?: string;
  contract_address?: string;
  tokenID?: string;
  token_id?: string;
  from?: string;
  to?: string;
  hash?: string;
  transaction_hash?: string;
  blockNumber?: string;
  block_number?: number;
  timeStamp?: string;
  timestamp?: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenURI?: string;
  value?: string;
  tokenDecimal?: string;
}

interface BlockscoutResponse {
  result?: BlockscoutItem[] | string;
}

const numberValue = (value: string | number | undefined): number => Number(value ?? 0);

export class BlockscoutProProvider implements NFTProvider {
  readonly chain = 'chainers' as const;

  constructor(
    private readonly apiKey: string,
    private readonly chainId = 7897,
    private readonly fetcher: FetchLike = fetch,
    private readonly baseUrl = 'https://api.blockscout.com/v2/api',
  ) {}

  private async accountQuery(action: string, address: string): Promise<BlockscoutItem[]> {
    assertAddress(address);
    const url = new URL(this.baseUrl);
    url.search = new URLSearchParams({
      chain_id: String(this.chainId),
      module: 'account',
      action,
      address,
      apikey: this.apiKey,
    }).toString();
    const body = await fetchJson<BlockscoutResponse>(this.fetcher, url);
    if (typeof body.result === 'string') throw new Error(body.result);
    return body.result ?? [];
  }

  async getERC721Transfers(address: string): Promise<NFTTransfer[]> {
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

  async getERC20Transfers(address: string): Promise<TokenTransfer[]> {
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

  async getBalance(address: string): Promise<string> {
    const result = await this.accountQuery('balance', address);
    return result[0]?.value ?? '0';
  }
}
