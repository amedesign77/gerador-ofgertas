import { Product } from './types';

const specials: Record<number, [number, number, number]> = {
  8: [3, 2, 3],
  9: [3, 3, 3],
  10: [3, 4, 3],
  11: [4, 3, 4],
  12: [4, 4, 4]
};

export function getRowsForCount(count: number): number[] {
  if (specials[count]) return specials[count];
  const base = Math.floor(count / 3);
  const rem = count % 3;
  const rows = [base, base, base];
  if (rem === 1) rows[1] += 1;
  if (rem === 2) {
    rows[0] += 1;
    rows[2] += 1;
  }
  return rows;
}

function combos(total: number, memo = new Map<number, number[][]>()): number[][] {
  if (memo.has(total)) return memo.get(total)!;
  if (total === 0) return [[]];
  if (total < 0) return [];

  const all: number[][] = [];
  for (const size of [8, 9, 10, 11, 12]) {
    for (const tail of combos(total - size, memo)) {
      all.push([size, ...tail]);
    }
  }
  memo.set(total, all);
  return all;
}

function score(sizes: number[]): number {
  const pages = sizes.length;
  const dev = sizes.reduce((acc, s) => acc + Math.abs(s - 9), 0);
  const spread = Math.max(...sizes) - Math.min(...sizes);
  return pages * 100 + dev * 10 + spread;
}

export function paginate(items: Product[], invertNineTen: boolean): Product[][] {
  if (!items.length) return [];
  const options = combos(items.length);
  let best = options[0];

  for (const sizes of options) {
    if (score(sizes) < score(best)) best = sizes;
  }

  const finalSizes = [...best];
  if (invertNineTen) {
    for (let i = 0; i < finalSizes.length - 1; i += 1) {
      if (finalSizes[i] === 9 && finalSizes[i + 1] === 10) {
        [finalSizes[i], finalSizes[i + 1]] = [10, 9];
        break;
      }
    }
  }

  const pages: Product[][] = [];
  let start = 0;
  finalSizes.forEach((size) => {
    pages.push(items.slice(start, start + size));
    start += size;
  });
  return pages;
}
