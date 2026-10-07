export type TableRow = Record<string, string>;
export declare function parseMarkdownTables(markdown: string): TableRow[][];
export declare function field(row: TableRow, candidates: string[]): string | undefined;
export declare function numeric(value: string | undefined): number | undefined;
export declare function durationSeconds(value: string | undefined): number | undefined;
export declare function imageFor(markdown: string, name: string): string | undefined;
//# sourceMappingURL=markdown.d.ts.map