export interface FetchTextOptions {
  timeoutMs?: number;
  retries?: number;
  fetcher?: typeof fetch;
}

export async function fetchText(url: string, options: FetchTextOptions = {}): Promise<string> {
  const fetcher = options.fetcher ?? fetch;
  const retries = options.retries ?? 2;
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 20_000);
    try {
      const response = await fetcher(url, {
        signal: controller.signal,
        headers: { accept: 'text/markdown,text/html;q=0.9,*/*;q=0.8', 'user-agent': 'chainers-optimizer-data-bot/2.0' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError instanceof Error ? lastError : new Error(`Could not fetch ${url}`);
}
