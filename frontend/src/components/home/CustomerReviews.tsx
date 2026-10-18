import { CUSTOMER_TESTIMONIALS } from '@/features/products/constants';

export default function CustomerReviews() {
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest text-[#4e7349] font-semibold">
          Customer Stories
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] mt-1.5">
          Loved by Plant Parents
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CUSTOMER_TESTIMONIALS.map((rev) => (
          <div key={rev.name} className="glass-panel rounded-2xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--surface-pill)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--accent-lime)] shadow-sm">
                {rev.avatar}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-main)]">{rev.name}</h4>
                <div className="flex items-center gap-0.5 text-amber-500 text-xs">
                  {'★'.repeat(5)}
                </div>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              "{rev.text}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
