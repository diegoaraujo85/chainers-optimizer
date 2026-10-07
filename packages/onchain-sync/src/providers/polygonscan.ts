import type { NFTTransfer, TokenTransfer } from '@chainers/shared-types';
import { assertAddress, fetchJson, type FetchLike, type NFTProvider } from './types.js';

interface ExplorerResult {
  result?: Array<Record<string, string>> | string;
}

export class PolygonscanProvider implements NFTProvider {
  readonly chain = 'polygon' as const;

  constructor(
    private readonly apiKey: string,
    private readonly fetcher: FetchLike = fetch,
    private readonly baseUrl = 'https://api.etherscan.io/v2/api',
  ) {}

  private async query(action: string, address: string): Promise<Array<Record<string, string>>> {
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
    const body = await fetchJson<ExplorerResult>(this.fetcher, url);
    if (typeof body.result === 'string') {
      if (body.result.toLowerCase().includes('no transactions')) return [];
      throw new Error(body.result);
    }
    return body.result ?? [];
  }

  async getERC721Transfers(address: string): Promise<NFTTransfer[]> {
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

  async getERC20Transfers(address: string): Promise<TokenTransfer[]> {
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

  async getBalance(address: string): Promise<string> {
    const result = await this.query('balance', address);
    return result[0]?.result ?? result[0]?.value ?? '0';
  }
}
