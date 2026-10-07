export function assertAddress(address) {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address))
        throw new Error('Invalid EVM address');
}
export async function fetchJson(fetcher, url, init) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
        const response = await fetcher(url, { ...init, signal: controller.signal });
        if (!response.ok)
            throw new Error(`HTTP ${response.status} from ${url.origin}`);
        return (await response.json());
    }
    finally {
        clearTimeout(timeout);
    }
}
//# sourceMappingURL=types.js.map