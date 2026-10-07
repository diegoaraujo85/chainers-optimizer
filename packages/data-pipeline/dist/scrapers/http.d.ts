export interface FetchTextOptions {
    timeoutMs?: number;
    retries?: number;
    fetcher?: typeof fetch;
}
export declare function fetchText(url: string, options?: FetchTextOptions): Promise<string>;
//# sourceMappingURL=http.d.ts.map