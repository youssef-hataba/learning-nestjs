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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors text-lg cursor-pointer"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-[var(--text-main)] mb-1">Review {productTitle}</h3>
        <p className="text-xs text-[var(--text-muted)] mb-6">
          Share how your plant adapted to its new home environment.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Star Rating Select */}
          <div>
            <label className="text-xs font-semibold text-[var(--text-main)] block mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onRatingChange(star)}
                  className={`text-2xl transition-transform hover:scale-110 cursor-pointer ${
                    star <= rating ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="text-xs text-[var(--accent-lime)] font-bold ml-2">{rating} / 5 Stars</span>
            </div>
          </div>

          {/* Comment text */}
          <div>
            <label className="text-xs font-semibold text-[var(--text-main)] block mb-2">
              Your Thoughts & Care Experience
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Tell other plant lovers about leaf health, packaging, light placement, or shipping condition..."
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-pill)] p-3 text-xs text-[var(--text-main)] placeholder-[var(--text-faint)] focus:border-[var(--accent-lime)] focus:outline-none transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-[var(--border)] text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-full bg-[var(--accent-lime)] text-[var(--on-primary)] text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
