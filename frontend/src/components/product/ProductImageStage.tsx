import { Product } from '@/features/products/types';

interface ProductImageStageProps {
  product: Product;
}

export default function ProductImageStage({ product }: ProductImageStageProps) {
  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://res.cloudinary.com/dmohzjxxd/image/upload/v1792335217/planto/products/monstera_deliciosa.jpg';

  return (
    <div className="relative">
      {/* Visual Glass Stage */}
      <div className="relative rounded-[40px] bg-[#1a211a]/70 backdrop-blur-2xl border border-white/10 p-8 sm:p-14 flex flex-col items-center justify-center overflow-hidden group shadow-2xl">
        {/* Radial Chlorophyll Glow behind plant */}
        <div className="absolute w-80 h-80 bg-[#b6f076]/15 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

        {/* Floating Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          {product.isPetFriendly ? (
            <span className="px-3 py-1 rounded-full bg-[#121812]/80 backdrop-blur-md border border-[#b6f076]/50 text-xs font-bold text-[#b6f076] flex items-center gap-1.5 shadow-sm">
              🐾 100% Pet Friendly
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-[#121812]/80 backdrop-blur-md border border-amber-400/40 text-xs font-semibold text-amber-300 flex items-center gap-1.5 shadow-sm">
              ⚠️ Keep Away From Pets
            </span>
          )}

          <span className="px-3 py-1 rounded-full bg-[#121812]/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-[#f6ffe4] flex items-center gap-1.5">
            🍃 NASA Clean Air Certified
          </span>
        </div>

        {/* Stock status pill */}
        <div className="absolute top-6 right-6 z-10">
          <span className="px-3 py-1 rounded-full bg-[#121812]/80 backdrop-blur-md border border-white/10 text-xs font-medium text-[#c2c9b5] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#b6f076] animate-pulse" />
            {product.stock > 0 ? `${product.stock} in Greenhouse` : 'Sold Out'}
          </span>
        </div>

        {/* Central Transparent Plant Image */}
        <div className="relative w-full max-w-[460px] h-[380px] sm:h-[460px] flex items-center justify-center my-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage}
            alt={product.title}
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_28px_48px_rgba(0,0,0,0.95)] transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Quality Seal Footer */}
        <div className="w-full pt-6 mt-2 border-t border-white/5 flex flex-wrap items-center justify-around gap-4 text-center">
          <div className="flex items-center gap-2 text-xs text-[#c2c9b5]">
            <span className="text-[#b6f076] font-bold">✓</span>
            <span>Acclimated Living Specimen</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#c2c9b5]">
            <span className="text-[#b6f076] font-bold">✓</span>
            <span>Organic Nutrient Substrate</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#c2c9b5]">
            <span className="text-[#b6f076] font-bold">✓</span>
            <span>30-Day Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
