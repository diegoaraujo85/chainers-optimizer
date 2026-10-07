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

export function assertAddress(address: string): void {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) throw new Error('Invalid EVM address');
}

export async function fetchJson<T>(fetcher: FetchLike, url: URL, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetcher(url, { ...init, signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status} from ${url.origin}`);
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}
