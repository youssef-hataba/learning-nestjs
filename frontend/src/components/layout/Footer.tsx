export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#1e2227] bg-[#090a0c] text-xs text-[#8f887c]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs tracking-wider text-[#f5f0e6]">
              ATELIER
            </span>
            <span className="text-[11px] text-[#6d675e]">
              — Powered by NestJS + Next.js
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a href="http://localhost:3000/api" target="_blank" rel="noreferrer" className="hover:text-[#f5f0e6] transition-colors">
              API Docs
            </a>
            <span className="text-[#363a40]">•</span>
            <span className="text-[#6d675e]">Monorepo Structure</span>
            <span className="text-[#363a40]">•</span>
            <span className="text-[#6d675e]">Dark & Cream Minimal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
