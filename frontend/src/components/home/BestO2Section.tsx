import Link from 'next/link';
import { Product } from '@/features/products/types';

interface BestO2SectionProps {
  tropicalPlant?: Product;
}

export default function BestO2Section({ tropicalPlant }: BestO2SectionProps) {
  const imageSrc =
    tropicalPlant?.images && tropicalPlant.images.length > 0
      ? tropicalPlant.images[0]
      : 'https://res.cloudinary.com/dmohzjxxd/image/upload/v1792335228/planto/products/bird_of_paradise.jpg';

  return (
    <section id="best-o2" className="mx-auto max-w-7xl px-4 py-16 pb-28 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-[36px] p-8 lg:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#b6f076]/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-72 h-72 sm:w-80 sm:h-80 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt="Bird of Paradise"
                className="w-full h-full object-contain filter drop-shadow-[0_24px_36px_rgba(0,0,0,0.9)]"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest text-[#b6f076] font-semibold">
              ◄ Architectural Tropical Giant ►
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f6ffe4] leading-tight">
              White Bird of Paradise (Strelitzia nicolai)
            </h2>
            <p className="text-xs sm:text-sm text-[#c2c9b5] leading-relaxed max-w-xl">
              Broad architectural foliage engineered by nature for grand tropical statement spaces. Thrives in bright sunlit rooms and infuses indoor environments with luxurious botanical presence.
            </p>

            <div className="flex items-center gap-4 pt-4">
              {tropicalPlant && (
                <Link
                  href={`/products/${tropicalPlant.id}`}
                  className="px-6 py-2.5 rounded-full bg-[#b6f076] text-[#121812] text-xs font-semibold hover:bg-[#c7f88f] transition-all shadow-[0_0_16px_rgba(182,240,118,0.3)]"
                >
                  View Specimen Specs
                </Link>
              )}
              <a
                href="#top-selling"
                className="px-6 py-2.5 rounded-full bg-[#1a211a] border border-white/10 text-[#f6ffe4] text-xs font-medium hover:border-[#b6f076]/40 transition-all"
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
