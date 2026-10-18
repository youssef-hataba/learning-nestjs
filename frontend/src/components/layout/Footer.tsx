import BrandLogo from '@/components/ui/BrandLogo';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-[#091009] text-xs text-[#c2c9b5]/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <BrandLogo size="md" showTagline={false} />
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#1a211a] text-[#b6f076] border border-[#b6f076]/30 font-medium">
                Biophilic Noir
              </span>
            </div>
            <p className="text-xs text-[#c2c9b5]/70 max-w-sm leading-relaxed mt-1">
              Curated botanical collections and architectural houseplants cultivated for indoor air quality and refined interior sanctuaries.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f6ffe4]">Quick Links</h4>
            <div className="flex flex-col gap-2 text-xs">
              <a href="/#trending" className="hover:text-[#b6f076] transition-colors">Shop Plants</a>
              <a href="/#best-o2" className="hover:text-[#b6f076] transition-colors">Best O2 Plants</a>
              <a href="/#reviews" className="hover:text-[#b6f076] transition-colors">Customer Stories</a>
              <a href="http://localhost:3000/api" target="_blank" rel="noreferrer" className="hover:text-[#b6f076] transition-colors">
                NestJS API Specs
              </a>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f6ffe4]">For Every Update</h4>
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-full bg-[#1a211a] border border-white/10 px-4 py-2.5 text-xs text-[#dde5d9] placeholder-[#c2c9b5]/40 focus:outline-none focus:border-[#b6f076]/50 pr-24"
              />
              <button
                type="button"
                className="absolute right-1 px-4 py-1.5 rounded-full bg-[#b6f076] text-[#121812] text-xs font-semibold hover:bg-[#c7f88f] transition-all cursor-pointer"
              >
                Subscribe
              </button>
            </div>
            <p className="text-[11px] text-[#c2c9b5]/50">
              Receive seasonal care guides, rare botanical releases, and clean air tips.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#c2c9b5]/60">
          <div>© 2026 Planto Store. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Built with NestJS + Next.js</span>
            <span>•</span>
            <span className="text-[#b6f076]">Biophilic Noir Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
