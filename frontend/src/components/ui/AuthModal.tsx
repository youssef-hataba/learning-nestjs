'use client';

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

  if (!isAuthModalOpen) return null;

  const handleSuccess = () => {
    triggerRefetch();
    closeAuthModal();
  };

  return (
    <div
      className="fixed inset-0 z-[9980] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-[#203123]/50 backdrop-blur-md animate-fade-in transition-opacity cursor-pointer"
      />

      {/* Sanctuary Modal Card */}
      <div className="relative w-full max-w-lg bg-white/95 border border-[#A8C3A0]/40 rounded-3xl p-6 sm:p-8 shadow-[0_24px_60px_rgba(32,49,35,0.18)] backdrop-blur-xl overflow-hidden z-10 animate-scale-in my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-[#f2f6f1] border border-[#A8C3A0]/30 text-[#5e7362] hover:text-[#203123] hover:bg-[#e4ede2] flex items-center justify-center transition-all cursor-pointer shadow-xs"
          aria-label="Close dialog"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Background Watermark Leaf Graphic */}
        <div className="absolute -right-12 -bottom-16 opacity-[0.06] pointer-events-none select-none text-[#4e7349]">
          <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 200 200">
            <path d="M100 0 C120 40 180 80 180 130 C180 170 145 200 100 200 C55 200 20 170 20 130 C20 80 80 40 100 0 Z M100 25 C85 60 42 95 42 130 C42 158 68 180 100 180 C132 180 158 158 158 130 C158 95 115 60 100 25 Z" />
            <path
              d="M100 40 L100 170 M100 80 C120 70 135 85 135 85 M100 110 C80 100 65 115 65 115 M100 135 C120 125 135 140 135 140"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[380px] h-[380px] bg-[#A8C3A0]/20 rounded-full blur-[100px] pointer-events-none" />

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
  );
}
