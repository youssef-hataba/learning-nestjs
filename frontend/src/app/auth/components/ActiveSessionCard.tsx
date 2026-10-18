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
    <div className="mb-6 rounded-2xl border border-[#3d5a3c]/60 bg-[#0f1b11] p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-[#4e7349] text-white font-bold text-xs flex items-center justify-center uppercase shadow-xs">
          {user.username?.slice(0, 2) || 'U'}
        </div>
        <div>
          <p className="text-xs font-semibold text-[#f5f1e8]">{user.username}</p>
          <p className="text-[11px] text-[#b2c7b5]">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={openProfileModal}
          className="px-3 py-1 text-[11px] rounded-full bg-[#1e3422] border border-[#4e7349]/40 text-[#a8c3a0] font-medium hover:bg-[#28442e] hover:text-[#f5f1e8] transition-colors cursor-pointer"
        >
          View Profile
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="px-3 py-1 text-[11px] rounded-full border border-rose-500/40 text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
