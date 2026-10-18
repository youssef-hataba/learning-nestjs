import Link from 'next/link';
import { Product } from '@/features/products/types';

interface BestO2SectionProps {
  tropicalPlant?: Product;
}

export default function BestO2Section({ tropicalPlant }: BestO2SectionProps) {
  const imageSrc =
    tropicalPlant?.images && tropicalPlant.images.length > 0
      ? tropicalPlant.images[0]
      : 'https://res.cloudinary.com/dmohzjxxd/image/upload/v1792344965/planto/products/bird_of_paradise_transparent.png';

  return (
    <section id="best-o2" className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-[32px] p-6 sm:p-8 lg:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-lime)]/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-72 h-72 sm:w-80 sm:h-80 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt="Bird of Paradise"
                className="w-full h-full object-contain rounded-2xl filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.22)]"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest text-[#4e7349] font-semibold">
              Natural Oxygen & Wellness
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-main)] leading-tight">
              White Bird of Paradise
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-lg">
              Broad architectural foliage that naturally purifies air and brings timeless serene beauty into your home.
            </p>

            <div className="flex items-center gap-4 pt-4">
              {tropicalPlant && (
                <Link
                  href={`/products/${tropicalPlant.id}`}
                  className="px-6 py-2.5 rounded-full bg-[var(--accent-lime)] text-[var(--on-primary)] text-xs font-semibold hover:opacity-90 transition-all shadow-md"
                >
                  View Specimen Specs
                </Link>
              )}
              <a
                href="#top-selling"
                className="px-6 py-2.5 rounded-full bg-[var(--surface-pill)] border border-[var(--border)] text-[var(--text-main)] text-xs font-medium hover:border-[var(--accent-lime)] transition-all shadow-sm"
              >
                Browse All 10 Plants
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
