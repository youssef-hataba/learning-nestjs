'use client';

import Link from 'next/link';
import { useAuthStore } from '../store';

export default function AuthTabs() {
  const { activeTab, setActiveTab } = useAuthStore();

  return (
    <div className="flex border-b border-[#A8C3A0]/30 pb-3 mb-5 justify-between items-center">
      <div className="flex gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('login')}
          className={`text-xs font-semibold pb-1 cursor-pointer transition-colors relative ${
            activeTab === 'login'
              ? 'text-[#203123]'
              : 'text-[#5e7362] hover:text-[#203123]'
          }`}
        >
          Sign In
          {activeTab === 'login' && (
            <span className="absolute bottom-[-13px] left-0 w-full h-[2px] bg-[#4e7349] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('register')}
          className={`text-xs font-semibold pb-1 cursor-pointer transition-colors relative ${
            activeTab === 'register'
              ? 'text-[#203123]'
              : 'text-[#5e7362] hover:text-[#203123]'
          }`}
        >
          Create Account
          {activeTab === 'register' && (
            <span className="absolute bottom-[-13px] left-0 w-full h-[2px] bg-[#4e7349] rounded-full" />
          )}
        </button>
      </div>

      <Link
        href="/"
        className="text-[11px] text-[#5e7362] hover:text-[#4e7349] transition-colors flex items-center gap-1 font-medium"
      >
        ← Back to Store
      </Link>
    </div>
  );
}
