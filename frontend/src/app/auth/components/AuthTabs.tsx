'use client';

import Link from 'next/link';
import { useAuthStore } from '../store';

export default function AuthTabs() {
  const { activeTab, setActiveTab } = useAuthStore();

  return (
    <div className="flex border-b border-[#21252b] pb-3 mb-6 justify-between items-center">
      <div className="flex gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('login')}
          className={`text-xs font-semibold pb-1 cursor-pointer transition-colors relative ${
            activeTab === 'login'
              ? 'text-[#f5f0e6]'
              : 'text-[#878075] hover:text-[#d8d0c2]'
          }`}
        >
          Sign In
          {activeTab === 'login' && (
            <span className="absolute bottom-[-13px] left-0 w-full h-[2px] bg-[#f5f0e6]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('register')}
          className={`text-xs font-semibold pb-1 cursor-pointer transition-colors relative ${
            activeTab === 'register'
              ? 'text-[#f5f0e6]'
              : 'text-[#878075] hover:text-[#d8d0c2]'
          }`}
        >
          Create Account
          {activeTab === 'register' && (
            <span className="absolute bottom-[-13px] left-0 w-full h-[2px] bg-[#f5f0e6]" />
          )}
        </button>
      </div>

      <Link
        href="/"
        className="text-[11px] text-[#736c62] hover:text-[#f5f0e6] transition-colors flex items-center gap-1"
      >
        ← Store
      </Link>
    </div>
  );
}
