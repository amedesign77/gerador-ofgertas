import { Product } from '@/lib/types';

type Props = {
  product: Product;
  compact?: boolean;
};

export default function OfferCard({ product }: Props) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
      <div className="mb-3 aspect-square w-full overflow-hidden rounded-xl bg-slate-200">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-500">Sem foto</div>
        )}
      </div>

      <h3 className="line-clamp-2 min-h-[3.6rem] text-center text-2xl font-bold uppercase leading-tight">{product.name}</h3>

      <div className="mt-auto pt-3 text-center">
        {product.untilQty && product.afterPrice ? (
          <>
            <p className="text-4xl font-black text-emerald-600">R$ {product.price}</p>
            <p className="text-lg font-semibold">(até {product.untilQty} un)</p>
            <p className="text-xl font-bold text-slate-700">Após: R$ {product.afterPrice}</p>
          </>
        ) : (
          <p className="text-5xl font-black text-emerald-600">R$ {product.price}</p>
        )}
      </div>
    </div>
  );
}
