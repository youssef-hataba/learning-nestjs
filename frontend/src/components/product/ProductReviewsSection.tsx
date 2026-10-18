import { Product } from '@/features/products/types';

interface ProductReviewsSectionProps {
  product: Product;
  onOpenReviewModal: () => void;
}

export default function ProductReviewsSection({
  product,
  onOpenReviewModal,
}: ProductReviewsSectionProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-main)]">Verified Specimen Feedback</h3>
          <p className="text-xs text-[var(--text-muted)]">
            Real thoughts from plant parents who welcomed {product.title} into their homes.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenReviewModal}
          className="px-5 py-2.5 rounded-full bg-[var(--accent-lime)] text-[var(--on-primary)] text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-sm"
        >
          Write a Review
        </button>
      </div>

      {product.reviews && product.reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.reviews.map((rev) => (
            <div key={rev.id} className="glass-panel rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--surface-pill)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--accent-lime)] shadow-xs">
                    {rev.user?.username ? rev.user.username.slice(0, 2).toUpperCase() : 'PP'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-main)]">
                      {rev.user?.username || 'Verified Botanist'}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">Verified Purchase</div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500 text-xs">
                  {'★'.repeat(rev.rating)}
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-panel rounded-3xl">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Be the first plant enthusiast to review this {product.title} specimen!
          </p>
          <button
            type="button"
            onClick={onOpenReviewModal}
            className="px-5 py-2 rounded-full bg-[var(--surface-pill)] border border-[var(--border)] text-[var(--text-main)] text-xs font-semibold hover:border-[var(--accent-lime)] transition-all cursor-pointer shadow-xs"
          >
            Leave First Review
          </button>
        </div>
      )}
    </div>
  );
}
