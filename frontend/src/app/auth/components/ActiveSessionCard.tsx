'use client';

import Link from 'next/link';
import { User } from '../types';
import { logoutUser } from '../api';
import { useAuthStore } from '../store';
import { notify } from '@/lib/notifications';

interface ActiveSessionCardProps {
  user: User;
  onSignOut: () => void;
}

export default function ActiveSessionCard({ user, onSignOut }: ActiveSessionCardProps) {
  const { openProfileModal } = useAuthStore();

  function handleLogout() {
    logoutUser();
    onSignOut();
    notify.info('You have been signed out of Planto.', 'Session Ended');
  }

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-[#252c24]/80 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-[#b6f076] text-[#121812] font-bold text-xs flex items-center justify-center uppercase shadow-sm">
          {user.username?.slice(0, 2) || 'U'}
        </div>
        <div>
          <p className="text-xs font-semibold text-[#f6ffe4]">{user.username}</p>
          <p className="text-[11px] text-[#c2c9b5]/70">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={openProfileModal}
          className="px-3 py-1 text-[11px] rounded-full bg-[#b6f076]/15 border border-[#b6f076]/30 text-[#b6f076] hover:bg-[#b6f076]/25 transition-colors cursor-pointer"
        >
          View Profile
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="px-3 py-1 text-[11px] rounded-full border border-rose-800/40 text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
