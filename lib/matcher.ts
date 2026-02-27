import { Product } from './types';

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a.includes(b) || b.includes(a)) return 0.9;
  const ta = new Set(a.split(' '));
  const tb = new Set(b.split(' '));
  const inter = [...ta].filter((t) => tb.has(t)).length;
  const union = new Set([...ta, ...tb]).size;
  return union ? inter / union : 0;
}

export function autoAssignImages(products: Product[], files: File[]): Product[] {
  const available = [...files];
  return products.map((product) => {
    let bestIdx = -1;
    let bestScore = 0;

    available.forEach((file, idx) => {
      const s = similarity(normalize(product.name), normalize(file.name));
      if (s > bestScore) {
        bestScore = s;
        bestIdx = idx;
      }
    });

    if (bestIdx >= 0 && bestScore >= 0.35) {
      const file = available.splice(bestIdx, 1)[0];
      return {
        ...product,
        imageUrl: URL.createObjectURL(file),
        imageFileName: file.name
      };
    }

    return product;
  });
}
