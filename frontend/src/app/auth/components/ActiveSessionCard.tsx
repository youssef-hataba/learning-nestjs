'use client';

import Link from 'next/link';
import { User } from '../types';
import { logoutUser } from '../api';
import { useAuthStore } from '../store';

interface ActiveSessionCardProps {
  user: User;
  onSignOut: () => void;
}

export default function ActiveSessionCard({ user, onSignOut }: ActiveSessionCardProps) {
  const { setMessage } = useAuthStore();

  function handleLogout() {
    logoutUser();
    onSignOut();
    setMessage({ text: 'You have been signed out.', type: 'info' });
  }

  return (
    <div className="mb-6 rounded-lg border border-[#2a3038] bg-[#15191e] p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-[#f5f0e6] text-[#0d0f11] font-bold text-xs flex items-center justify-center uppercase">
          {user.username?.slice(0, 2) || 'U'}
        </div>
        <div>
          <p className="text-xs font-semibold text-[#f5f0e6]">{user.username}</p>
          <p className="text-[11px] text-[#878075]">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="px-2.5 py-1 text-[11px] rounded bg-[#21262d] text-[#d8d0c2] hover:text-[#f5f0e6] hover:bg-[#2b313a] transition-colors"
        >
          Store
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="px-2.5 py-1 text-[11px] rounded border border-rose-900/50 text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
