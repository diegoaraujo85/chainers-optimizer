import type { NFTTransfer, NormalizedNFT, TokenTransfer } from '@chainers/shared-types';
import { assertAddress, fetchJson, type FetchLike, type NFTProvider } from './types.js';

interface ImmutableNFT {
  contract_address?: string;
  token_id?: string;
  name?: string;
  image?: string;
  attributes?: Array<{ trait_type?: string; value?: string | number }> | Record<string, string>;
  metadata?: Record<string, unknown>;
}

interface ImmutableResponse {
  result?: ImmutableNFT[];
  page?: { next_cursor?: string };
}

export class ImmutableProvider implements NFTProvider {
  readonly chain = 'immutable' as const;

  constructor(
    private readonly publishableKey: string,
    private readonly fetcher: FetchLike = fetch,
    private readonly baseUrl = 'https://api.immutable.com',
    private readonly chainName = 'imtbl-zkevm-mainnet',
  ) {}

  async getOwnedNFTs(address: string): Promise<NormalizedNFT[]> {
    assertAddress(address);
    const all: ImmutableNFT[] = [];
    let cursor: string | undefined;
    do {
      const url = new URL(`/v1/chains/${this.chainName}/accounts/${address}/nfts`, this.baseUrl);
      if (cursor) url.searchParams.set('page_cursor', cursor);
      url.searchParams.set('page_size', '200');
      const body = await fetchJson<ImmutableResponse>(this.fetcher, url, {
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

  async getERC721Transfers(_address: string): Promise<NFTTransfer[]> {
    return [];
  }

  async getERC20Transfers(_address: string): Promise<TokenTransfer[]> {
    return [];
  }

  async getBalance(_address: string): Promise<string> {
    return '0';
  }
}
