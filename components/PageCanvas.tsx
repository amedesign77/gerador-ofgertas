import OfferCard from './OfferCard';
import { getRowsForCount } from '@/lib/pagination';
import { Product } from '@/lib/types';

type Props = {
  items: Product[];
  pageNumber: number;
};

export default function PageCanvas({ items, pageNumber }: Props) {
  const rows = getRowsForCount(items.length);
  let cursor = 0;

  return (
    <div className="relative h-[1500px] w-[1080px] overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50 p-8">
      <div className="mb-6 flex items-center justify-between rounded-xl bg-slate-900 px-6 py-4 text-white">
        <h2 className="text-4xl font-black uppercase tracking-wide">Ofertas da Semana</h2>
        <span className="text-2xl font-bold">Página {pageNumber}</span>
      </div>

      <div className="flex h-[1320px] flex-col justify-center gap-6">
        {rows.map((rowCount, idx) => {
          const rowItems = items.slice(cursor, cursor + rowCount);
          cursor += rowCount;
          return (
            <div key={`${idx}-${rowCount}`} className="flex flex-1 items-stretch justify-center gap-4">
              {rowItems.map((item) => (
                <div key={item.id} style={{ width: rowCount >= 4 ? 246 : 300 }}>
                  <OfferCard product={item} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
