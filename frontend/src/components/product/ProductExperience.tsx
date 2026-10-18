import { Product } from '@/features/products/types';

interface ProductExperienceProps {
  product: Product;
}

export default function ProductExperience({ product }: ProductExperienceProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest text-[#b6f076] font-bold px-3 py-1 rounded-full bg-[#1a211a] border border-[#b6f076]/20">
          The Living Experience
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f6ffe4] tracking-tight mt-3">
          Cultivated for Modern Living Sanctuaries
        </h2>
        <p className="text-sm text-[#c2c9b5] max-w-xl mx-auto mt-2">
          Every {product.title} specimen is hand-selected and nurtured to thrive effortlessly in contemporary indoor spaces.
        </p>
      </div>

      {/* 2-Column Engaging Layout: Space Styling vs 60-Second Care Ritual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
        {/* Left: Space Placement & Styling */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-[#b6f076] uppercase tracking-wider">
                Interior Placement Guide
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#f6ffe4] mb-2">
              Where {product.title} Thrives Best
            </h3>
            <p className="text-xs text-[#c2c9b5] leading-relaxed mb-6">
              Thoughtfully positioned plants transform interior acoustics, reduce eye fatigue, and establish a restorative biophilic connection.
            </p>

            <div className="flex flex-col gap-4">
              {/* Room 1 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#121812] border border-white/5">
                <span className="text-2xl p-2 rounded-xl bg-[#1a211a] border border-white/10 shrink-0">
                  🛋️
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#f6ffe4]">Living Room Anchor</h4>
                  <p className="text-xs text-[#c2c9b5]/80 leading-relaxed mt-0.5">
                    Position beside mid-century armchairs, credenzas, or 1–2 meters from light-filled windows to create an architectural focal point.
                  </p>
                </div>
              </div>

              {/* Room 2 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#121812] border border-white/5">
                <span className="text-2xl p-2 rounded-xl bg-[#1a211a] border border-white/10 shrink-0">
                  💼
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#f6ffe4]">Creative Workspace Sanctuary</h4>
                  <p className="text-xs text-[#c2c9b5]/80 leading-relaxed mt-0.5">
                    Mitigates digital eye strain and filters indoor volatile compounds, promoting prolonged focus and creative stamina.
                  </p>
                </div>
              </div>

              {/* Room 3 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#121812] border border-white/5">
                <span className="text-2xl p-2 rounded-xl bg-[#1a211a] border border-white/10 shrink-0">
                  🛏️
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#f6ffe4]">Bedroom Air Restoration</h4>
                  <p className="text-xs text-[#c2c9b5]/80 leading-relaxed mt-0.5">
                    Maintains healthy microclimate humidity ({product.humidity || '50-70%'}) and produces clean, calming natural oxygen throughout the night.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: The 60-Second Care Routine */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-[#b6f076] uppercase tracking-wider">
                Horticultural Routine
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#f6ffe4] mb-2">
              The 60-Second Care Ritual
            </h3>
            <p className="text-xs text-[#c2c9b5] leading-relaxed mb-6">
              Engineered by nature for resilience. You do not need a green thumb to keep this botanical masterpiece thriving.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Light Box */}
              <div className="p-4 rounded-2xl bg-[#121812] border border-white/5 flex flex-col gap-1.5">
                <span className="text-xl">☀️</span>
                <span className="text-xs font-bold text-[#f6ffe4]">Natural Illumination</span>
                <span className="text-[11px] font-semibold text-[#b6f076]">
                  {product.lightRequirement || 'INDIRECT_BRIGHT'}
                </span>
                <p className="text-[11px] text-[#c2c9b5]/75 leading-relaxed">
                  Filtered morning daylight. Protect from intense midday sun to keep foliage glossy.
                </p>
              </div>

              {/* Water Box */}
              <div className="p-4 rounded-2xl bg-[#121812] border border-white/5 flex flex-col gap-1.5">
                <span className="text-xl">💧</span>
                <span className="text-xs font-bold text-[#f6ffe4]">Hydration Routine</span>
                <span className="text-[11px] font-semibold text-[#b6f076]">
                  {product.wateringFrequency || 'MODERATE'} Routine
                </span>
                <p className="text-[11px] text-[#c2c9b5]/75 leading-relaxed">
                  Water when top 2 inches dry. Pour until drainage, then empty drip tray.
                </p>
              </div>

              {/* Climate Box */}
              <div className="p-4 rounded-2xl bg-[#121812] border border-white/5 flex flex-col gap-1.5">
                <span className="text-xl">🌡️</span>
                <span className="text-xs font-bold text-[#f6ffe4]">Room Climate</span>
                <span className="text-[11px] font-semibold text-[#b6f076]">
                  {product.humidity || '50-70%'} Humidity
                </span>
                <p className="text-[11px] text-[#c2c9b5]/75 leading-relaxed">
                  Thrives between 18°C–28°C. Keep away from direct artificial A/C drafts.
                </p>
              </div>

              {/* Family Safety */}
              <div className="p-4 rounded-2xl bg-[#121812] border border-white/5 flex flex-col gap-1.5">
                <span className="text-xl">{product.isPetFriendly ? '🐾' : '⚠️'}</span>
                <span className="text-xs font-bold text-[#f6ffe4]">Household Safety</span>
                <span className={`text-[11px] font-semibold ${product.isPetFriendly ? 'text-[#b6f076]' : 'text-amber-300'}`}>
                  {product.isPetFriendly ? '100% Pet Friendly' : 'Keep on High Surfaces'}
                </span>
                <p className="text-[11px] text-[#c2c9b5]/75 leading-relaxed">
                  {product.isPetFriendly
                    ? 'Completely safe for inquisitive cats and puppies.'
                    : 'Best showcased on elevated plant stands or consoles.'}
                </p>
              </div>
            </div>
          </div>

          {/* Botanist Secret Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-[#1a211a] border border-[#b6f076]/30 flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <div className="text-xs">
              <span className="font-bold text-[#f6ffe4]">Nursery Botanist Tip: </span>
              <span className="text-[#c2c9b5]">
                Gently wipe foliage with a lukewarm damp cloth once a month to remove dust and maximize photosynthesis.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* The Unboxing Experience Strip */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <h3 className="text-center text-sm font-bold uppercase tracking-widest text-[#b6f076] mb-6">
          The Planto Unboxing Journey
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-full bg-[#121812] border border-[#b6f076]/40 flex items-center justify-center text-sm font-black text-[#b6f076] shrink-0">
              1
            </span>
            <div>
              <h4 className="text-sm font-bold text-[#f6ffe4]">Greenhouse Conditioning</h4>
              <p className="text-xs text-[#c2c9b5]/70 mt-0.5">
                Pre-hydrated and inspected by licensed botanists prior to dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-full bg-[#121812] border border-[#b6f076]/40 flex items-center justify-center text-sm font-black text-[#b6f076] shrink-0">
              2
            </span>
            <div>
              <h4 className="text-sm font-bold text-[#f6ffe4]">Thermal Shock-Proof Transit</h4>
              <p className="text-xs text-[#c2c9b5]/70 mt-0.5">
                Packaged in custom biodegradable corrugate with secure root-ball stabilization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-full bg-[#121812] border border-[#b6f076]/40 flex items-center justify-center text-sm font-black text-[#b6f076] shrink-0">
              3
            </span>
            <div>
              <h4 className="text-sm font-bold text-[#f6ffe4]">30-Day Guarantee Activated</h4>
              <p className="text-xs text-[#c2c9b5]/70 mt-0.5">
                Direct WhatsApp & email care hotline with our botanical team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
