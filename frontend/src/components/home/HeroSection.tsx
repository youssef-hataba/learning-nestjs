import Link from 'next/link';
import { Product } from '@/features/products/types';

interface HeroSectionProps {
  heroPlant?: Product;
}

export default function HeroSection({ heroPlant }: HeroSectionProps) {
  const heroImage =
    heroPlant?.images && heroPlant.images.length > 0
      ? heroPlant.images[0]
      : 'https://res.cloudinary.com/dmohzjxxd/image/upload/v1792335217/planto/products/monstera_deliciosa.jpg';

  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-8 pb-20 sm:px-6 lg:px-8 lg:pt-14 lg:pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headlines & Actions */}
        <div className="lg:col-span-7 flex flex-col z-10">
          {/* Status indicator pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a211a] border border-[#b6f076]/30 w-fit mb-6 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#b6f076] animate-pulse" />
            <span className="text-xs font-semibold text-[#f6ffe4] tracking-wide">
              Live Botanical Sanctuary
            </span>
            <span className="text-[11px] text-[#b6f076] pl-2 border-l border-white/10 font-mono">
              10 Species In Stock
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#f6ffe4] leading-[1.08] mb-6">
            Breath Natural, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b6f076] via-[#f6ffe4] to-[#9be650]">
              Live Biophilic.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#c2c9b5] max-w-xl leading-relaxed mb-10">
            Discover verified living ornamental plants with authentic botanical care profiles, NASA-grade air filtration, and secure nursery climate shipping.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <a
              href="#top-selling"
              className="px-8 py-3.5 rounded-full bg-[#b6f076] text-[#121812] font-semibold text-sm tracking-wide hover:bg-[#c7f88f] hover:shadow-[0_0_24px_rgba(182,240,118,0.4)] transition-all cursor-pointer"
            >
              Explore 10 Living Plants
            </a>
            {heroPlant && (
              <Link
                href={`/products/${heroPlant.id}`}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-[#1a211a]/90 border border-white/10 text-[#f6ffe4] hover:border-[#b6f076]/50 text-sm font-medium transition-all group"
              >
                <span className="w-7 h-7 rounded-full bg-[#b6f076] text-[#121812] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span>Featured: {heroPlant.title}</span>
              </Link>
            )}
          </div>

          {/* Trust Badges Bar */}
          <div className="grid grid-cols-3 gap-4 max-w-lg pt-6 border-t border-white/10">
            <div>
              <div className="text-lg font-bold text-[#b6f076]">100%</div>
              <div className="text-xs text-[#c2c9b5]/70">Arrive-Alive Guarantee</div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#b6f076]">NASA</div>
              <div className="text-xs text-[#c2c9b5]/70">Clean Air Certified</div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#b6f076]">Transparent</div>
              <div className="text-xs text-[#c2c9b5]/70">Studio PNG Visuals</div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Plant Showcase Card */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          {/* Ambient Radial backdrop */}
          <div className="absolute w-80 h-80 bg-[#b6f076]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Frosted Arched Card */}
          {heroPlant && (
            <Link
              href={`/products/${heroPlant.id}`}
              className="group relative z-10 w-full max-w-[360px] rounded-t-[60px] rounded-b-[36px] bg-[#1a211a]/85 backdrop-blur-2xl border border-white/15 p-6 pt-4 flex flex-col items-center shadow-2xl transition-all hover:-translate-y-2 hover:border-[#b6f076]/40"
            >
              {/* Overhanging Plant Visual */}
              <div className="-mt-20 w-64 h-64 flex items-center justify-center relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage}
                  alt={heroPlant.title}
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-2 px-2.5 py-1 rounded-full bg-[#121812]/80 backdrop-blur-md border border-[#b6f076]/40 text-[10px] font-bold text-[#b6f076]">
                  Top Choice
                </div>
              </div>

              <span className="text-[11px] font-semibold text-[#b6f076] uppercase tracking-widest mt-2">
                {heroPlant.category || 'Featured Houseplant'}
              </span>
              <h3 className="text-xl font-bold text-[#f6ffe4] mt-1 text-center group-hover:text-white transition-colors">
                {heroPlant.title}
              </h3>
              {heroPlant.scientificName && (
                <span className="text-xs italic text-[#c2c9b5]/70 text-center">
                  {heroPlant.scientificName}
                </span>
              )}

              <div className="w-full mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#c2c9b5]/70 block">Botanical Price</span>
                  <span className="text-xl font-extrabold text-[#b6f076]">${heroPlant.price}</span>
                </div>
                <span className="px-5 py-2.5 rounded-full bg-[#b6f076] text-[#121812] text-xs font-bold group-hover:bg-[#c7f88f] transition-all shadow-[0_0_16px_rgba(182,240,118,0.3)]">
                  View Specimen &rarr;
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
