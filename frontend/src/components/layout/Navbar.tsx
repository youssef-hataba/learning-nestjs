'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCurrentUserData } from '@/app/auth';
import { useAuthStore } from '@/app/auth/store';

export default function Navbar() {
  const [cartCount] = useState(2);
  const { data: user } = useCurrentUserData();
  const { openAuthModal, openProfileModal } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#091009]/80 backdrop-blur-2xl border-b border-white/5 transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-full bg-[#1a211a] border border-[#b6f076]/30 flex items-center justify-center text-[#b6f076] group-hover:border-[#b6f076] transition-colors shadow-[0_0_12px_rgba(182,240,118,0.2)]">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C8 2 4 6 4 11c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9 0-5-4-9-8-9zm0 16c-3.3 0-6-2.7-6-6 0-3 2.2-5.4 5-5.9V13h2V6.1c2.8.5 5 2.9 5 5.9 0 3.3-2.7 6-6 6z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-[#f6ffe4] group-hover:text-white transition-colors">
            Planto
          </span>
        </Link>

        {/* Floating Center Navigation Dock */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#1a211a]/70 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
          <Link
            href="/"
            className="px-4 py-1.5 rounded-full bg-[#b6f076] text-[#121812] font-semibold text-xs tracking-wide transition-all shadow-[0_0_12px_rgba(182,240,118,0.25)]"
          >
            Home
          </Link>
          <Link
            href="#trending"
            className="px-4 py-1.5 rounded-full text-[#c2c9b5] hover:text-[#f6ffe4] hover:bg-white/5 text-xs font-medium transition-colors"
          >
            Shop Plants
          </Link>
          <Link
            href="#best-o2"
            className="px-4 py-1.5 rounded-full text-[#c2c9b5] hover:text-[#f6ffe4] hover:bg-white/5 text-xs font-medium transition-colors"
          >
            Best O2 Plants
          </Link>
          <Link
            href="#top-selling"
            className="px-4 py-1.5 rounded-full text-[#c2c9b5] hover:text-[#f6ffe4] hover:bg-white/5 text-xs font-medium transition-colors"
          >
            Top Selling
          </Link>
          <Link
            href="#reviews"
            className="px-4 py-1.5 rounded-full text-[#c2c9b5] hover:text-[#f6ffe4] hover:bg-white/5 text-xs font-medium transition-colors"
          >
            Reviews
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search Pill */}
          <div className="hidden md:flex items-center bg-[#1a211a]/80 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm focus-within:border-[#b6f076]/60 transition-colors">
            <svg
              className="w-4 h-4 text-[#c2c9b5] mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search plants, pots..."
              className="bg-transparent text-xs text-[#dde5d9] placeholder-[#c2c9b5]/50 focus:outline-none w-32 lg:w-36"
            />
          </div>

          {/* Cart preview */}
          <button
            type="button"
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#1a211a] border border-white/10 text-[#dde5d9] hover:border-[#b6f076]/40 hover:text-[#f6ffe4] transition-colors"
            aria-label="Cart"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#b6f076] text-[#121812] text-[10px] font-bold shadow-sm">
              {cartCount}
            </span>
          </button>

          {/* User Sign In / Profile */}
          {user ? (
            <button
              type="button"
              onClick={openProfileModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a211a] border border-[#b6f076]/40 text-[#f6ffe4] text-xs font-medium hover:border-[#b6f076] hover:bg-[#252c24] transition-all cursor-pointer shadow-sm"
              title="View Sanctuary Profile"
            >
              <span className="w-5 h-5 rounded-full bg-[#b6f076] text-[#121812] text-[10px] font-bold flex items-center justify-center uppercase">
                {user.username?.slice(0, 1) || 'U'}
              </span>
              <span className="max-w-[85px] truncate">{user.username}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#b6f076] text-[#121812] hover:bg-[#c7f88f] hover:shadow-[0_0_14px_rgba(182,240,118,0.35)] transition-all cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
