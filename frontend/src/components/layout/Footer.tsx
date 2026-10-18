import BrandLogo from '@/components/ui/BrandLogo';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface-lowest)] text-xs text-[var(--text-muted)] transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pb-12 border-b border-[var(--border)]">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <BrandLogo size="md" showTagline={false} />
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--surface-pill)] text-[var(--accent-lime)] border border-[var(--border)] font-medium">
                Biophilic Atelier
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-sm leading-relaxed mt-1">
              Curated botanical collections and architectural houseplants cultivated for indoor air quality and refined interior sanctuaries.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]">Quick Links</h4>
            <div className="flex flex-col gap-2 text-xs">
              <a href="/#trending" className="hover:text-[var(--accent-lime)] transition-colors">Shop Plants</a>
              <a href="/#best-o2" className="hover:text-[var(--accent-lime)] transition-colors">Best O2 Plants</a>
              <a href="/#reviews" className="hover:text-[var(--accent-lime)] transition-colors">Customer Stories</a>
              <a href="http://localhost:3000/api" target="_blank" rel="noreferrer" className="hover:text-[var(--accent-lime)] transition-colors">
                NestJS API Specs
              </a>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]">For Every Update</h4>
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-full bg-[var(--surface-pill)] border border-[var(--border)] px-4 py-2.5 text-xs text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-lime)] pr-24"
              />
              <button
                type="button"
                className="absolute right-1 px-4 py-1.5 rounded-full bg-[var(--accent-lime)] text-[var(--on-primary)] text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-sm"
              >
                Subscribe
              </button>
            </div>
            <p className="text-[11px] text-[var(--text-faint)]">
              Receive seasonal care guides, rare botanical releases, and clean air tips.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-faint)]">
          <div>© 2026 Planto Sanctuary. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Built with NestJS + Next.js</span>
            <span>•</span>
            <span className="text-[var(--accent-lime)]">Biophilic Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
