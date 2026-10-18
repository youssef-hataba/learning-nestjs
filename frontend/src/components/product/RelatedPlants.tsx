import Link from 'next/link';
import { Product } from '@/features/products/types';

interface RelatedPlantsProps {
  relatedProducts: Product[];
}

export default function RelatedPlants({ relatedProducts }: RelatedPlantsProps) {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-widest text-[#b6f076] font-semibold">
          ◄ Complete Your Living Sanctuary ►
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#f6ffe4] mt-2">
          Recommended Companion Plants
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedProducts.map((rel) => (
          <Link
            key={rel.id}
            href={`/products/${rel.id}`}
            className="group glass-panel glass-panel-hover rounded-3xl p-6 pt-12 flex flex-col justify-between transition-all hover:-translate-y-2"
          >
            <div className="-mt-20 w-full h-44 flex items-center justify-center relative mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rel.images[0]}
                alt={rel.title}
                className="max-h-full max-w-[85%] object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div>
              <span className="text-[10px] font-semibold text-[#b6f076] uppercase tracking-wider block mb-1">
                {rel.category || 'Companion'}
              </span>
              <h3 className="text-base font-bold text-[#f6ffe4] group-hover:text-white transition-colors">
                {rel.title}
              </h3>
              {rel.scientificName && (
                <p className="text-xs italic text-[#c2c9b5]/60 mb-2">{rel.scientificName}</p>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-base font-bold text-[#b6f076]">${rel.price}</span>
              <span className="text-xs font-semibold text-[#f6ffe4] group-hover:text-[#b6f076] transition-colors">
                View Plant &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
