'use client';

interface ProductReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  rating: number;
  onRatingChange: (star: number) => void;
  comment: string;
  onCommentChange: (comment: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export default function ProductReviewModal({
  isOpen,
  onClose,
  productTitle,
  rating,
  onRatingChange,
  comment,
  onCommentChange,
  onSubmit,
  isSubmitting,
}: ProductReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl bg-[#141b14] border border-[#b6f076]/30 p-6 sm:p-8 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#c2c9b5] hover:text-white transition-colors text-lg cursor-pointer"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-[#f6ffe4] mb-1">Review {productTitle}</h3>
        <p className="text-xs text-[#c2c9b5] mb-6">
          Share how your plant adapted to its new home environment.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Star Rating Select */}
          <div>
            <label className="text-xs font-semibold text-[#dde5d9] block mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onRatingChange(star)}
                  className={`text-2xl transition-transform hover:scale-110 cursor-pointer ${
                    star <= rating ? 'text-[#9be650]' : 'text-gray-600'
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="text-xs text-[#b6f076] font-bold ml-2">{rating} / 5 Stars</span>
            </div>
          </div>

          {/* Comment text */}
          <div>
            <label className="text-xs font-semibold text-[#dde5d9] block mb-2">
              Your Thoughts & Care Experience
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Tell other plant lovers about leaf health, packaging, light placement, or shipping condition..."
              className="w-full rounded-2xl border border-white/10 bg-[#1a211a] p-3 text-xs text-[#dde5d9] placeholder-[#c2c9b5]/40 focus:border-[#b6f076]/60 focus:outline-none transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-white/10 text-xs font-medium text-[#c2c9b5] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-full bg-[#b6f076] text-[#121812] text-xs font-bold hover:bg-[#c7f88f] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
