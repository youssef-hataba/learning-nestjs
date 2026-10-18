import Link from 'next/link';
import { Product } from '@/features/products/types';

interface TrendingSectionProps {
  trendyPlant1?: Product;
  trendyPlant2?: Product;
}

export default function TrendingSection({
  trendyPlant1,
  trendyPlant2,
}: TrendingSectionProps) {
  return (
    <section id="trending" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center mb-10">
        <span className="text-xs font-semibold text-[#b6f076] tracking-widest uppercase px-4 py-1 rounded-full bg-[#1a211a] border border-[#b6f076]/20">
          ◄ Spotlight Curated Varieties ►
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1 */}
        {trendyPlant1 && (
          <Link
            href={`/products/${trendyPlant1.id}`}
            className="group glass-panel glass-panel-hover rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:-translate-y-1"
          >
            <div className="flex flex-col gap-2 max-w-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#b6f076] font-semibold">
                {trendyPlant1.category || 'Air Purifying'} · Care: {trendyPlant1.careLevel}
              </span>
              <h3 className="text-2xl font-bold text-[#f6ffe4] group-hover:text-white transition-colors">
                {trendyPlant1.title}
              </h3>
              {trendyPlant1.scientificName && (
                <span className="text-xs italic text-[#c2c9b5]/70 -mt-1">
                  {trendyPlant1.scientificName}
                </span>
              )}
              <p className="text-xs text-[#c2c9b5] leading-relaxed mt-2 line-clamp-2">
                {trendyPlant1.description}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-xl font-bold text-[#b6f076]">${trendyPlant1.price}</span>
                <span className="px-4 py-1.5 rounded-full bg-[#1a211a] border border-[#b6f076]/40 text-[#f6ffe4] group-hover:bg-[#b6f076] group-hover:text-[#121812] text-xs font-semibold transition-all">
                  View Plant
                </span>
              </div>
            </div>
            <div className="w-40 h-40 shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trendyPlant1.images[0]}
                alt={trendyPlant1.title}
                className="w-full h-full object-contain filter drop-shadow-[0_14px_28px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        )}

        {/* Card 2 */}
        {trendyPlant2 && (
          <Link
            href={`/products/${trendyPlant2.id}`}
            className="group glass-panel glass-panel-hover rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:-translate-y-1"
          >
            <div className="flex flex-col gap-2 max-w-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#b6f076] font-semibold">
                {trendyPlant2.category || 'Rare & Exotic'} · Care: {trendyPlant2.careLevel}
              </span>
              <h3 className="text-2xl font-bold text-[#f6ffe4] group-hover:text-white transition-colors">
                {trendyPlant2.title}
              </h3>
              {trendyPlant2.scientificName && (
                <span className="text-xs italic text-[#c2c9b5]/70 -mt-1">
                  {trendyPlant2.scientificName}
                </span>
              )}
              <p className="text-xs text-[#c2c9b5] leading-relaxed mt-2 line-clamp-2">
                {trendyPlant2.description}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-xl font-bold text-[#b6f076]">${trendyPlant2.price}</span>
                <span className="px-4 py-1.5 rounded-full bg-[#1a211a] border border-[#b6f076]/40 text-[#f6ffe4] group-hover:bg-[#b6f076] group-hover:text-[#121812] text-xs font-semibold transition-all">
                  View Plant
                </span>
              </div>
            </div>
            <div className="w-40 h-40 shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trendyPlant2.images[0]}
                alt={trendyPlant2.title}
                className="w-full h-full object-contain filter drop-shadow-[0_14px_28px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
