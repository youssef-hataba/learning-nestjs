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
    <section id="trending" className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center mb-5">
        <span className="text-xs font-semibold text-[#4e7349] tracking-widest uppercase px-4 py-1.5 rounded-full bg-[#E9D5C9]/40 border border-[#A8C3A0]/30 shadow-sm">
          Featured Favorites
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
              <span className="text-[11px] uppercase tracking-wider text-[var(--accent-lime)] font-semibold">
                {trendyPlant1.category || 'Air Purifying'} · Care: {trendyPlant1.careLevel}
              </span>
              <h3 className="text-2xl font-bold text-[var(--text-main)] group-hover:text-[var(--accent-lime)] transition-colors">
                {trendyPlant1.title}
              </h3>
              {trendyPlant1.scientificName && (
                <span className="text-xs italic text-[var(--text-muted)] -mt-1">
                  {trendyPlant1.scientificName}
                </span>
              )}
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-2 line-clamp-2">
                {trendyPlant1.description}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-xl font-bold text-[var(--accent-lime)]">${trendyPlant1.price}</span>
                <span className="px-4 py-1.5 rounded-full bg-[var(--surface-pill)] border border-[var(--border)] text-[var(--text-main)] group-hover:bg-[var(--accent-lime)] group-hover:text-[var(--on-primary)] text-xs font-semibold transition-all shadow-sm">
                  View Plant
                </span>
              </div>
            </div>
            <div className="w-40 h-40 shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trendyPlant1.images[0]}
                alt={trendyPlant1.title}
                className="w-full h-full object-contain rounded-xl filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.18)] group-hover:scale-105 transition-transform duration-300"
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
              <span className="text-[11px] uppercase tracking-wider text-[var(--accent-lime)] font-semibold">
                {trendyPlant2.category || 'Rare & Exotic'} · Care: {trendyPlant2.careLevel}
              </span>
              <h3 className="text-2xl font-bold text-[var(--text-main)] group-hover:text-[var(--accent-lime)] transition-colors">
                {trendyPlant2.title}
              </h3>
              {trendyPlant2.scientificName && (
                <span className="text-xs italic text-[var(--text-muted)] -mt-1">
                  {trendyPlant2.scientificName}
                </span>
              )}
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-2 line-clamp-2">
                {trendyPlant2.description}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-xl font-bold text-[var(--accent-lime)]">${trendyPlant2.price}</span>
                <span className="px-4 py-1.5 rounded-full bg-[var(--surface-pill)] border border-[var(--border)] text-[var(--text-main)] group-hover:bg-[var(--accent-lime)] group-hover:text-[var(--on-primary)] text-xs font-semibold transition-all shadow-sm">
                  View Plant
                </span>
              </div>
            </div>
            <div className="w-40 h-40 shrink-0 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trendyPlant2.images[0]}
                alt={trendyPlant2.title}
                className="w-full h-full object-contain rounded-xl filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.18)] group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
