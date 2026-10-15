'use client';

import Link from 'next/link';
import { useAuthStore } from '../store';

export default function AuthTabs() {
  const { activeTab, setActiveTab } = useAuthStore();

  return (
    <div className="flex border-b border-white/10 pb-3 mb-6 justify-between items-center">
      <div className="flex gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('login')}
          className={`text-xs font-semibold pb-1 cursor-pointer transition-colors relative ${
            activeTab === 'login'
              ? 'text-[#f6ffe4]'
              : 'text-[#c2c9b5]/60 hover:text-[#dde5d9]'
          }`}
        >
          Sign In
          {activeTab === 'login' && (
            <span className="absolute bottom-[-13px] left-0 w-full h-[2px] bg-[#b6f076] shadow-[0_0_8px_rgba(182,240,118,0.5)]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('register')}
          className={`text-xs font-semibold pb-1 cursor-pointer transition-colors relative ${
            activeTab === 'register'
              ? 'text-[#f6ffe4]'
              : 'text-[#c2c9b5]/60 hover:text-[#dde5d9]'
          }`}
        >
          Create Account
          {activeTab === 'register' && (
            <span className="absolute bottom-[-13px] left-0 w-full h-[2px] bg-[#b6f076] shadow-[0_0_8px_rgba(182,240,118,0.5)]" />
          )}
        </button>
      </div>

      <Link
        href="/"
        className="text-[11px] text-[#c2c9b5]/70 hover:text-[#b6f076] transition-colors flex items-center gap-1"
      >
        ← Back to Store
      </Link>
    </div>
  );
}
