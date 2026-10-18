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
          <h3 className="text-xl font-bold text-[#f6ffe4]">Verified Specimen Feedback</h3>
          <p className="text-xs text-[#c2c9b5]">
            Real thoughts from plant parents who welcomed {product.title} into their homes.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenReviewModal}
          className="px-5 py-2.5 rounded-full bg-[#b6f076] text-[#121812] text-xs font-bold hover:bg-[#c7f88f] transition-all cursor-pointer"
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
                  <div className="w-9 h-9 rounded-full bg-[#252c24] border border-[#b6f076]/40 flex items-center justify-center text-xs font-bold text-[#b6f076]">
                    {rev.user?.username ? rev.user.username.slice(0, 2).toUpperCase() : 'PP'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#f6ffe4]">
                      {rev.user?.username || 'Verified Botanist'}
                    </div>
                    <div className="text-[10px] text-[#c2c9b5]/60">Verified Purchase</div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-[#9be650] text-xs">
                  {'★'.repeat(rev.rating)}
                </div>
              </div>
              <p className="text-xs text-[#c2c9b5] leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-panel rounded-3xl">
          <p className="text-sm text-[#c2c9b5] mb-4">
            Be the first plant enthusiast to review this {product.title} specimen!
          </p>
          <button
            type="button"
            onClick={onOpenReviewModal}
            className="px-5 py-2 rounded-full bg-[#1a211a] border border-[#b6f076]/40 text-[#f6ffe4] text-xs font-semibold hover:bg-[#b6f076] hover:text-[#121812] transition-all cursor-pointer"
          >
            Leave First Review
          </button>
        </div>
      )}
    </div>
  );
}
