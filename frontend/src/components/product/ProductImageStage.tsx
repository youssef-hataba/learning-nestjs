import { Product } from '@/features/products/types';

interface ProductImageStageProps {
  product: Product;
}

export default function ProductImageStage({ product }: ProductImageStageProps) {
  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://res.cloudinary.com/dmohzjxxd/image/upload/v1792344863/planto/products/monstera_deliciosa_transparent.png';

  return (
    <div className="relative">
      {/* Visual Glass Stage */}
      <div className="relative rounded-[40px] glass-panel p-8 sm:p-14 flex flex-col items-center justify-center overflow-hidden group">
        {/* Radial Chlorophyll Glow behind plant */}
        <div className="absolute w-80 h-80 bg-[var(--accent-lime)]/15 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

        {/* Floating Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          {product.isPetFriendly ? (
            <span className="px-3 py-1 rounded-full bg-[var(--surface-pill)]/90 backdrop-blur-md border border-[var(--border)] text-xs font-bold text-[var(--accent-lime)] flex items-center gap-1.5 shadow-sm">
              🐾 100% Pet Friendly
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-[var(--surface-pill)]/90 backdrop-blur-md border border-amber-500/40 text-xs font-semibold text-amber-600 dark:text-amber-300 flex items-center gap-1.5 shadow-sm">
              ⚠️ Keep Away From Pets
            </span>
          )}

          <span className="px-3 py-1 rounded-full bg-[var(--surface-pill)]/90 backdrop-blur-md border border-[var(--border)] text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5 shadow-sm">
            🍃 NASA Clean Air Certified
          </span>
        </div>

        {/* Stock status pill */}
        <div className="absolute top-6 right-6 z-10">
          <span className="px-3 py-1 rounded-full bg-[var(--surface-pill)]/90 backdrop-blur-md border border-[var(--border)] text-xs font-medium text-[var(--text-muted)] flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-lime)] animate-pulse" />
            {product.stock > 0 ? `${product.stock} in Greenhouse` : 'Sold Out'}
          </span>
        </div>

        {/* Central Plant Image */}
        <div className="relative w-full max-w-[460px] h-[380px] sm:h-[460px] flex items-center justify-center my-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage}
            alt={product.title}
            className="max-h-full max-w-full object-contain rounded-2xl filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.22)] transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Quality Seal Footer */}
        <div className="w-full pt-6 mt-2 border-t border-[var(--border)] flex flex-wrap items-center justify-around gap-4 text-center">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="text-[var(--accent-lime)] font-bold">✓</span>
            <span>Acclimated Living Specimen</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="text-[var(--accent-lime)] font-bold">✓</span>
            <span>Organic Nutrient Substrate</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="text-[var(--accent-lime)] font-bold">✓</span>
            <span>30-Day Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
