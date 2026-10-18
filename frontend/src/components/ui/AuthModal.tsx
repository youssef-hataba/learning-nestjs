'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useAuthStore } from '@/app/auth/store';
import { useCurrentUser } from '@/app/auth/hooks';
import LoginForm from '@/app/auth/components/LoginForm';
import RegisterWizard from '@/app/auth/components/RegisterWizard';
import ActiveSessionCard from '@/app/auth/components/ActiveSessionCard';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    activeTab,
    resendCooldown,
    decrementCooldown,
  } = useAuthStore();
  const { data: currentUser, triggerRefetch } = useCurrentUser();

  // Handle countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0 || !isAuthModalOpen) return;
    const timer = setInterval(() => {
      decrementCooldown();
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown, isAuthModalOpen, decrementCooldown]);

  // Handle Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (!isAuthModalOpen) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    const preventBackgroundScroll = (e: WheelEvent | TouchEvent) => {
      const modalWrapper = document.getElementById('auth-modal-card-wrapper');
      if (modalWrapper && !modalWrapper.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventBackgroundScroll, { passive: false });
    window.addEventListener('touchmove', preventBackgroundScroll, { passive: false });

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('wheel', preventBackgroundScroll);
      window.removeEventListener('touchmove', preventBackgroundScroll);
    };
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSuccess = () => {
    triggerRefetch();
    closeAuthModal();
  };

  return (
    <div
      className="fixed inset-0 z-[9980] flex items-center justify-center p-4 sm:p-6 overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-[#0a140d]/75 backdrop-blur-md animate-fade-in transition-opacity cursor-pointer"
      />

      {/* Sanctuary Modal Wrapper */}
      <div
        id="auth-modal-card-wrapper"
        className="relative w-full max-w-xl my-auto animate-scale-in z-10"
      >
        {/* ================= EDGE VINES ONLY (NO CORNERS) ================= */}
        {/* Left Edge Vine - Large Vertical Image, Centered Vertically */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-4 w-7 sm:w-9 h-[70%] sm:h-[75%] z-20 pointer-events-none select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
          aria-hidden="true"
        >
          <Image
            src="/leaf_border_vertical.png"
            alt="Left Botanical Vine"
            fill
            className="object-contain"
            sizes="40px"
          />
        </div>

        {/* Right Edge Vine - Large Vertical Image, Centered Vertically */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-4 w-7 sm:w-9 h-[70%] sm:h-[75%] z-20 pointer-events-none select-none -scale-x-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
          aria-hidden="true"
        >
          <Image
            src="/leaf_border_vertical.png"
            alt="Right Botanical Vine"
            fill
            className="object-contain"
            sizes="40px"
          />
        </div>

        {/* Top Edge Vine - Small Divider Image, Centered Horizontally */}
        <div
          className="absolute -top-3.5 sm:-top-5 left-1/2 -translate-x-1/2 w-60 sm:w-80 h-7 sm:h-9 z-20 pointer-events-none select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
          aria-hidden="true"
        >
          <Image
            src="/leaf_divider.png"
            alt="Top Botanical Garland"
            fill
            className="object-contain"
            sizes="320px"
          />
        </div>

        {/* Bottom Edge Vine - Small Divider Image, Centered Horizontally */}
        <div
          className="absolute -bottom-3.5 sm:-bottom-5 left-1/2 -translate-x-1/2 w-60 sm:w-80 h-7 sm:h-9 z-20 pointer-events-none select-none -scale-y-100 drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
          aria-hidden="true"
        >
          <Image
            src="/leaf_divider.png"
            alt="Bottom Botanical Garland"
            fill
            className="object-contain"
            sizes="320px"
          />
        </div>

        {/* Sanctuary Modal Card - Clean, Wide & Elegant Dark Green */}
        <div className="relative w-full bg-[#142417] border border-[#3d5a3c]/60 rounded-3xl p-7 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl overflow-hidden z-10">
          {/* Close Button */}
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-5 right-5 z-30 w-8 h-8 rounded-full bg-[#1e3422]/90 border border-[#4e7349]/40 text-[#c5d5cb] hover:text-white hover:bg-[#28442e] flex items-center justify-center transition-all cursor-pointer shadow-xs"
            aria-label="Close dialog"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-[#4e7349]/15 rounded-full blur-[110px] pointer-events-none" />

          {/* If user is already logged in, show active session card */}
          {currentUser && (
            <ActiveSessionCard user={currentUser} onSignOut={triggerRefetch} />
          )}

          {/* Auth Forms */}
          {activeTab === 'login' ? (
            <LoginForm onSuccess={handleSuccess} />
          ) : (
            <RegisterWizard onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
