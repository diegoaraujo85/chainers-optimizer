export type TableRow = Record<string, string>;

function cleanCell(value: string): string {
  return value
    .replace(/<img[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .trim();
}

function htmlTablesToMarkdown(markdown: string): string {
  const converted = [...markdown.matchAll(/<table[\s\S]*?<\/table>/gi)].map((match) => {
    const rows = [...match[0].matchAll(/<tr[\s\S]*?<\/tr>/gi)].map((row) =>
      [...row[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => cleanCell(cell[1] ?? '')),
    );
    const header = rows[0] ?? [];
    if (header.length === 0 || rows.length < 2) return '';
    return `| ${header.join(' | ')} |\n| ${header.map(() => '---').join(' | ')} |\n${rows
      .slice(1)
      .map((row) => `| ${row.join(' | ')} |`)
      .join('\n')}`;
  });
  return `${markdown}\n${converted.join('\n\n')}`;
}

export function parseMarkdownTables(markdown: string): TableRow[][] {
  const lines = htmlTablesToMarkdown(markdown).split(/\r?\n/);
  const tables: TableRow[][] = [];
  let index = 0;
  while (index < lines.length - 1) {
    const headerLine = lines[index] ?? '';
    const separatorLine = lines[index + 1] ?? '';
    if (!headerLine.includes('|') || !/^\s*\|?\s*:?-{3,}/.test(separatorLine)) {
      index += 1;
      continue;
    }
    const headers = headerLine
      .replace(/^\s*\||\|\s*$/g, '')
      .split('|')
      .map((header) => cleanCell(header).toLowerCase());
    index += 2;
    const rows: TableRow[] = [];
    while (index < lines.length && (lines[index] ?? '').includes('|')) {
      const values = (lines[index] ?? '')
        .replace(/^\s*\||\|\s*$/g, '')
        .split('|')
        .map(cleanCell);
      if (values.length === headers.length) {
        rows.push(Object.fromEntries(headers.map((header, cellIndex) => [header, values[cellIndex] ?? ''])));
      }
      index += 1;
    }
    if (rows.length > 0) tables.push(rows);
  }
  return tables;
}

export function field(row: TableRow, candidates: string[]): string | undefined {
  const entry = Object.entries(row).find(([name]) => candidates.some((candidate) => name.includes(candidate)));
  return entry?.[1]?.trim() || undefined;
}

export function numeric(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const normalized = value.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/u)?.[0];
  if (!normalized) return undefined;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : undefined;
}

export function durationSeconds(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const hours = numeric(value.match(/\d+(?:\.\d+)?\s*h(?:our)?s?/i)?.[0]);
  const minutes = numeric(value.match(/\d+(?:\.\d+)?\s*m(?:in(?:ute)?)?s?/i)?.[0]);
  const seconds = numeric(value.match(/\d+(?:\.\d+)?\s*s(?:ec(?:ond)?)?s?/i)?.[0]);
  if (hours || minutes || seconds) return (hours ?? 0) * 3600 + (minutes ?? 0) * 60 + (seconds ?? 0);
  return numeric(value);
}

export function imageFor(markdown: string, name: string): string | undefined {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const nearby = new RegExp(`(?:${escaped}[^\\n]{0,300}?!\\[[^\\]]*]\((https?://[^)]+)\))|(?:!\\[[^\\]]*]\((https?://[^)]+)\)[^\\n]{0,300}${escaped})`, 'i');
  const match = markdown.match(nearby);
  return match?.[1] ?? match?.[2];
}
