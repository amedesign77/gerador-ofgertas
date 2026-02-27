'use client';

import { useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import PageCanvas from '@/components/PageCanvas';
import { autoAssignImages } from '@/lib/matcher';
import { paginate } from '@/lib/pagination';
import { parseInput } from '@/lib/parser';
import { Product } from '@/lib/types';

const sample = `ALFACE CRESPA - 3,99\nTOMATE ITALIANO - 9,90 ATÉ 5UN APÓS 10,53\nCEBOLA ROXA - 7,49\nBATATA LAVADA - 5,99\nCENOURA - 4,29\nLARANJA PERA - 6,99\nBANANA PRATA - 8,49\nABOBRINHA - 4,99\nCOUVE-FLOR - 10,90\nMAMÃO FORMOSA - 7,29`;

export default function HomePage() {
  const [input, setInput] = useState(sample);
  const [items, setItems] = useState<Product[]>(() => parseInput(sample));
  const [invertNineTen, setInvertNineTen] = useState(false);
  const exportRefs = useRef<(HTMLDivElement | null)[]>([]);

  const pages = useMemo(() => paginate(items, invertNineTen), [items, invertNineTen]);

  const applyText = () => setItems(parseInput(input));

  const onUpload = (filesList: FileList | null) => {
    if (!filesList) return;
    const files = Array.from(filesList);
    setItems((prev) => autoAssignImages(prev, files));
  };

  const onManualImage = (id: string, file?: File) => {
    if (!file) return;
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, imageUrl: URL.createObjectURL(file), imageFileName: file.name } : p))
    );
  };

  const onDrag = (from: number, to: number) => {
    if (from === to) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const exportAll = async () => {
    for (let i = 0; i < pages.length; i += 1) {
      const node = exportRefs.current[i];
      if (!node) continue;
      const dataUrl = await toPng(node, { cacheBust: true, width: 1080, height: 1500, pixelRatio: 1 });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `ofertas-pagina-${i + 1}.png`;
      a.click();
    }
  };

  return (
    <main className="mx-auto max-w-[1800px] p-6">
      <h1 className="mb-4 text-3xl font-black">Gerador Web de Ofertas (PNG 1080x1500)</h1>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[480px_1fr]">
        <section className="space-y-4 rounded-2xl bg-white p-4 shadow">
          <label className="block text-sm font-bold">Entrada de itens (1 por linha)</label>
          <textarea
            className="h-64 w-full rounded-xl border p-3 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={applyText} className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white">
            Aplicar texto
          </button>

          <div>
            <label className="mb-1 block text-sm font-bold">Upload de fotos (massa)</label>
            <input type="file" multiple accept="image/*" onChange={(e) => onUpload(e.target.files)} />
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={invertNineTen} onChange={(e) => setInvertNineTen(e.target.checked)} />
            Inverter ordem de páginas 9+10 para 10+9
          </label>

          <button onClick={exportAll} className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-lg font-black text-white">
            Exportar PNG (1080x1500)
          </button>

          <div className="space-y-2">
            <h2 className="text-lg font-black">Reordenar / foto manual</h2>
            {items.map((item, idx) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', String(idx))}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const from = Number(e.dataTransfer.getData('text/plain'));
                  onDrag(from, idx);
                }}
                className="rounded-lg border p-2 text-sm"
              >
                <div className="font-semibold">{idx + 1}. {item.name}</div>
                <div className="text-slate-600">{item.imageFileName ?? 'sem imagem atribuída'}</div>
                <input type="file" accept="image/*" onChange={(e) => onManualImage(item.id, e.target.files?.[0])} />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 overflow-auto">
          {pages.map((pageItems, i) => (
            <div key={`p-${i}`} className="rounded-2xl bg-white p-4 shadow">
              <p className="mb-3 font-bold">Página {i + 1} ({pageItems.length} itens)</p>
              <div className="origin-top-left scale-[0.45]">
                <div ref={(el) => (exportRefs.current[i] = el)}>
                  <PageCanvas items={pageItems} pageNumber={i + 1} />
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
