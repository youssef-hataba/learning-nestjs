'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCurrentUserData } from '@/app/auth';

export default function Navbar() {
  const [cartCount] = useState(2);
  const { data: user } = useCurrentUserData();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#21252b] bg-[#0d0f11]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="h-6 w-6 rounded-md bg-[#f5f0e6] text-[#0d0f11] font-bold text-xs flex items-center justify-center tracking-tighter">
              E
            </span>
            <span className="font-semibold text-sm tracking-wide text-[#f5f0e6] group-hover:text-white transition-colors">
              ATELIER<span className="text-[#a89f91] font-normal text-xs ml-1">STORE</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs text-[#a89f91]">
            <Link href="/" className="text-[#f5f0e6] font-medium transition-colors">
              Products
            </Link>
            <Link href="#collections" className="hover:text-[#f5f0e6] transition-colors">
              Collections
            </Link>
            <Link href="#reviews" className="hover:text-[#f5f0e6] transition-colors">
              Reviews
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Backend Status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#15181c] border border-[#23272e] text-[11px] text-[#b8b0a2]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>API :3000</span>
          </div>

          {/* Cart preview */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-[#d8d0c2] hover:text-[#f5f0e6] hover:bg-[#181b1f] border border-[#23272e] transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
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
            <span className="text-[11px] font-medium text-[#f5f0e6]">{cartCount}</span>
          </button>

          {/* Auth Action Button / User profile */}
          {user ? (
            <Link
              href="/auth"
              className="flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium bg-[#15191e] border border-[#2a3038] text-[#f5f0e6] hover:bg-[#1c2229] transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-[#f5f0e6] text-[#0d0f11] text-[10px] font-bold flex items-center justify-center uppercase">
                {user.username?.slice(0, 1) || 'U'}
              </span>
              <span className="max-w-[80px] truncate">{user.username}</span>
            </Link>
          ) : (
            <Link
              href="/auth"
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-[#f5f0e6] text-[#0d0f11] hover:bg-[#e7ded1] transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
