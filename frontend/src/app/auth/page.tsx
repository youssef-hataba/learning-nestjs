'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useCurrentUser } from './hooks';
import { useAuthStore } from './store';
import ActiveSessionCard from './components/ActiveSessionCard';
import LoginForm from './components/LoginForm';
import RegisterWizard from './components/RegisterWizard';

export default function AuthPage() {
  const { data: currentUser, triggerRefetch } = useCurrentUser();
  const { activeTab, resendCooldown, decrementCooldown } = useAuthStore();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      decrementCooldown();
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown, decrementCooldown]);

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center px-4 py-20 sm:px-6">
      {/* Subtle Ambient Glow Orbs */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-[#4e7349]/20 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#E8B4A0]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Sanctuary Card Wrapper */}
      <div className="relative w-full max-w-xl mx-auto my-auto z-10">
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

        {/* Central Sanctuary Card - Clean, Wide & Elegant Dark Green */}
        <div className="relative w-full bg-[#142417] backdrop-blur-2xl rounded-3xl p-7 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.65)] overflow-hidden border border-[#3d5a3c]/60">
          {currentUser && (
            <ActiveSessionCard user={currentUser} onSignOut={triggerRefetch} />
          )}

          {/* Content: Login or Multi-Step Pre-Reg */}
          {activeTab === 'login' ? (
            <LoginForm onSuccess={() => triggerRefetch()} />
          ) : (
            <RegisterWizard onSuccess={() => triggerRefetch()} />
          )}
        </div>
      </div>
    </div>
  );
}
