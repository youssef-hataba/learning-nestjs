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
    <div className="mb-6 rounded-2xl border border-[#A8C3A0]/40 bg-[#f8faf7] p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-[#4e7349] text-white font-bold text-xs flex items-center justify-center uppercase shadow-xs">
          {user.username?.slice(0, 2) || 'U'}
        </div>
        <div>
          <p className="text-xs font-semibold text-[#203123]">{user.username}</p>
          <p className="text-[11px] text-[#5e7362]">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={openProfileModal}
          className="px-3 py-1 text-[11px] rounded-full bg-[#eaf1e8] border border-[#A8C3A0]/40 text-[#3c5a38] font-medium hover:bg-[#dce8da] transition-colors cursor-pointer"
        >
          View Profile
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="px-3 py-1 text-[11px] rounded-full border border-rose-300 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
