import { CUSTOMER_TESTIMONIALS } from '@/features/products/constants';

export default function CustomerReviews() {
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-widest text-[#b6f076] font-semibold">
          ◄ Real Customer Testimonials ►
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#f6ffe4] mt-2">
          Trusted by Modern Plant Enthusiasts
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CUSTOMER_TESTIMONIALS.map((rev) => (
          <div key={rev.name} className="glass-panel rounded-2xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#252c24] border border-[#b6f076]/40 flex items-center justify-center text-xs font-bold text-[#b6f076]">
                {rev.avatar}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#f6ffe4]">{rev.name}</h4>
                <div className="flex items-center gap-0.5 text-[#9be650] text-xs">
                  {'★'.repeat(5)}
                </div>
              </div>
            </div>
            <p className="text-xs text-[#c2c9b5]/80 leading-relaxed">
              "{rev.text}"
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
