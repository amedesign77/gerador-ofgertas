import { Product } from './types';

const lineRegex = /^(.*?)\s*[-–]\s*([\d.,]+)(?:\s+AT[ÉE]\s*(\d+)\s*UN\s*AP[ÓO]S\s*([\d.,]+))?$/i;

export function normalizePrice(value: string): string {
  const cleaned = value.trim().replace(/\./g, '').replace(',', '.');
  const n = Number(cleaned);
  if (Number.isNaN(n)) return value;
  return n.toFixed(2).replace('.', ',');
}

export function parseInput(text: string): Product[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const match = line.match(lineRegex);
      if (!match) {
        return {
          id: `p-${index}-${Date.now()}`,
          name: line,
          price: '0,00'
        };
      }

      return {
        id: `p-${index}-${Date.now()}`,
        name: match[1].trim(),
        price: normalizePrice(match[2]),
        untilQty: match[3] ? Number(match[3]) : undefined,
        afterPrice: match[4] ? normalizePrice(match[4]) : undefined
      };
    });
}
