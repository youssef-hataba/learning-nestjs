'use client';

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
      {/* Subtle Ambient Glow Orbs from Stitch Design */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-[#b6f076]/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#2e4732]/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Central Sanctuary Card with Watermark Leaf */}
      <div className="relative w-full max-w-2xl mx-auto bg-[#161d16]/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden border border-white/10">
        {/* Watermark Plant Leaf Graphic */}
        <div className="absolute -right-12 -bottom-16 opacity-5 pointer-events-none select-none text-[#b6f076]">
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
  );
}
