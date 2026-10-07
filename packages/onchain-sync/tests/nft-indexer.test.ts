import { describe, expect, it, vi } from 'vitest';
import { BlockscoutProProvider, compareInventories, indexUserNFTs } from '../src/index.js';
import type { NFTProvider } from '../src/providers/types.js';

const address = '0x1111111111111111111111111111111111111111';
const contract = '0x2222222222222222222222222222222222222222';

describe('on-chain sync', () => {
  it('normalizes current ERC-721 holdings and classifies lands', async () => {
    const provider: NFTProvider = {
      chain: 'chainers',
      getERC20Transfers: async () => [],
      getBalance: async () => '0',
      getERC721Transfers: async () => [
        { contractAddress: contract, tokenId: '1', from: '0x0000000000000000000000000000000000000000', to: address, transactionHash: '0x1', blockNumber: 1, tokenName: 'Golden Acres Land' },
        { contractAddress: contract, tokenId: '2', from: address, to: '0x3333333333333333333333333333333333333333', transactionHash: '0x2', blockNumber: 2 },
      ],
    };
    const result = await indexUserNFTs(address, [provider]);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ tokenId: '1', category: 'land' });
  });

  it('calls Blockscout with chain_id 7897', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ result: [] }), { status: 200, headers: { 'content-type': 'application/json' } }),
    );
    const provider = new BlockscoutProProvider('key', 7897, fetcher);
    await provider.getERC721Transfers(address);
    const calledUrl = String(fetcher.mock.calls[0]?.[0]);
    expect(calledUrl).toContain('chain_id=7897');
    expect(calledUrl).toContain('action=tokennfttx');
  });

  it('reports missing and extra NFTs', () => {
    const onChain = [{ contractAddress: contract, tokenId: '1', name: 'Golden Acres', image: '', attributes: {}, chain: 'chainers' as const, category: 'land' as const, metadata: {} }];
    const report = compareInventories(onChain, [{ name: 'Golden Acres' }, { name: 'Missing Avatar' }]);
    expect(report.nfts.missingOnChain).toHaveLength(1);
    expect(report.nfts.extraOnChain).toHaveLength(0);
  });
});
