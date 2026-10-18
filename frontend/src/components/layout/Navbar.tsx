'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCurrentUserData } from '@/app/auth';
import { useAuthStore } from '@/app/auth/store';
import BrandLogo from '@/components/ui/BrandLogo';
import { BotanicalCartIcon, SproutSearchIcon } from '@/components/icons';

export default function Navbar() {
  const [cartCount] = useState(2);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { data: user, isHydrated } = useCurrentUserData();
  const { openAuthModal, openProfileModal } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchClick = () => {
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
      // Focus on the catalog search input if present
      const searchInput = catalogElement.querySelector('input');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 600);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md shadow-xs border-b border-[var(--border-glass)]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Navigation Links */}
        <nav className="flex-1 hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className="text-sm font-semibold text-[#203123] hover:text-[#4e7349] transition-colors relative py-1"
          >
            Home
          </Link>
          <Link
            href="/#catalog"
            className="text-sm font-medium text-[#5e7362] hover:text-[#203123] transition-colors relative py-1"
          >
            Shop Plants
          </Link>
          <Link
            href="/#best-o2"
            className="text-sm font-medium text-[#5e7362] hover:text-[#203123] transition-colors relative py-1"
          >
            Best O2
          </Link>
          <Link
            href="/#reviews"
            className="text-sm font-medium text-[#5e7362] hover:text-[#203123] transition-colors relative py-1"
          >
            Reviews
          </Link>
        </nav>

        {/* Center: Brand Logo (Enlarged) */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <BrandLogo size="lg" showTagline={false} />
        </div>

        {/* Right Side: Search, Cart, Profile (Exact match to reference) */}
        <div className="flex-1 flex items-center justify-end gap-3 sm:gap-4">
          {/* Search Icon Button */}
          <button
            type="button"
            onClick={handleSearchClick}
            className="flex items-center justify-center w-10 h-10 rounded-full text-[#203123] hover:text-[#4e7349] hover:bg-[#E9D5C9]/30 transition-all cursor-pointer group"
            aria-label="Search nursery"
            title="Search plants"
          >
            <SproutSearchIcon size={21} className="group-hover:scale-110 transition-transform" />
          </button>

          {/* Botanical Cart Icon Button with Count Badge */}
          <button
            type="button"
            className="relative flex items-center justify-center w-10 h-10 rounded-full text-[#203123] hover:text-[#4e7349] hover:bg-[#E9D5C9]/30 transition-all cursor-pointer group"
            aria-label="Cart"
          >
            <BotanicalCartIcon size={22} className="group-hover:scale-110 transition-transform" />
            <span className="absolute 1 top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#4e7349] text-white text-[10px] font-bold shadow-xs">
              {cartCount}
            </span>
          </button>

          {/* Profile Avatar / Sign In */}
          {!mounted || !isHydrated ? (
            <div className="w-9 h-9 rounded-full bg-[#E9D5C9]/40 border border-[#A8C3A0]/30 animate-pulse" />
          ) : user ? (
            <button
              type="button"
              onClick={openProfileModal}
              className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#4e7349] text-white text-xs font-bold hover:shadow-md transition-all cursor-pointer border border-[#A8C3A0]/40 uppercase shadow-sm"
              title={`Profile (${user.username})`}
            >
              {user.username?.slice(0, 1) || 'U'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#4e7349] text-white hover:bg-[#3d5c38] hover:shadow-md transition-all cursor-pointer"
            >
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
