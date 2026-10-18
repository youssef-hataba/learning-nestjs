'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/auth/store';
import { useCurrentUser } from '@/app/auth/hooks';
import { logoutUser } from '@/app/auth/api';
import { notify } from '@/lib/notifications';

export default function ProfileModal() {
  const { isProfileModalOpen, closeProfileModal } = useAuthStore();
  const { data: user, triggerRefetch } = useCurrentUser();
  const [copiedId, setCopiedId] = useState(false);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isProfileModalOpen) {
        closeProfileModal();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProfileModalOpen, closeProfileModal]);

  if (!isProfileModalOpen || !user) return null;

  const handleCopyId = () => {
    if (!user.id) return;
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    notify.success('Account ID copied to clipboard', 'Copied');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSignOut = () => {
    logoutUser();
    triggerRefetch();
    closeProfileModal();
    notify.info('You have safely signed out of your Planto sanctuary.', 'Signed Out');
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={closeProfileModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-md animate-fade-in transition-opacity cursor-pointer"
      />

      {/* Profile Dialog */}
      <div className="relative w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden z-10 animate-scale-in">
        {/* Background Watermark Leaf */}
        <div className="absolute -right-10 -bottom-14 opacity-5 pointer-events-none select-none text-[var(--accent-lime)]">
          <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 200 200">
            <path d="M100 0 C120 40 180 80 180 130 C180 170 145 200 100 200 C55 200 20 170 20 130 C20 80 80 40 100 0 Z" />
          </svg>
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-[var(--accent-lime)]/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[var(--border)] relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--surface-pill)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-lime)] shadow-xs">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8 2 4 6 4 11c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9 0-5-4-9-8-9zm0 16c-3.3 0-6-2.7-6-6 0-3 2.2-5.4 5-5.9V13h2V6.1c2.8.5 5 2.9 5 5.9 0 3.3-2.7 6-6 6z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-main)] tracking-tight">Sanctuary Profile</h3>
              <p className="text-[11px] text-[var(--text-muted)]">Botanical Heritage & Identity</p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeProfileModal}
            className="w-8 h-8 rounded-full bg-[var(--surface-pill)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Hero Section */}
        <div className="py-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--accent-lime)] to-[#15803d] text-[var(--on-primary)] font-extrabold text-2xl flex items-center justify-center uppercase shadow-md border-2 border-[var(--border)]">
              {user.username?.slice(0, 2) || 'PL'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--surface)] border-2 border-[var(--border)] flex items-center justify-center text-[var(--accent-lime)] shadow-xs" title="Verified Botanist">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight truncate">
                {user.username}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--badge-bg)] text-[var(--badge-text)] border border-[var(--badge-border)]">
                {user.userType || 'Standard Botanist'}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1 truncate">{user.email}</p>
            <p className="text-[11px] text-[var(--text-faint)] mt-1">
              Member since {memberSince}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 relative z-10">
          {/* Account ID */}
          <div className="bg-[var(--surface-pill)] border border-[var(--border)] rounded-2xl p-3.5 flex flex-col justify-between shadow-xs">
            <span className="text-[10px] font-medium text-[var(--text-faint)] uppercase tracking-wider">
              Account ID
            </span>
            <div className="flex items-center justify-between mt-1">
              <code className="text-xs text-[var(--text-main)] font-mono truncate max-w-[150px]">
                {user.id || 'N/A'}
              </code>
              <button
                type="button"
                onClick={handleCopyId}
                className="text-[11px] text-[var(--accent-lime)] font-semibold hover:underline cursor-pointer"
              >
                {copiedId ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-[var(--surface-pill)] border border-[var(--border)] rounded-2xl p-3.5 flex flex-col justify-between shadow-xs">
            <span className="text-[10px] font-medium text-[var(--text-faint)] uppercase tracking-wider">
              Verification Status
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-lime)] animate-pulse" />
              <span className="text-xs text-[var(--text-main)] font-medium">
                {user.isAccountVerified !== false ? 'Active & Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>

          {/* Security */}
          <div className="bg-[var(--surface-pill)] border border-[var(--border)] rounded-2xl p-3.5 flex flex-col justify-between shadow-xs">
            <span className="text-[10px] font-medium text-[var(--text-faint)] uppercase tracking-wider">
              Security Level
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--text-main)]">
              <svg className="w-3.5 h-3.5 text-[var(--accent-lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>NestJS Guarded</span>
            </div>
          </div>

          {/* Sanctuary Tier */}
          <div className="bg-[var(--surface-pill)] border border-[var(--border)] rounded-2xl p-3.5 flex flex-col justify-between shadow-xs">
            <span className="text-[10px] font-medium text-[var(--text-faint)] uppercase tracking-wider">
              Sanctuary Tier
            </span>
            <span className="text-xs text-[var(--accent-lime)] font-semibold mt-1">
              Forest Steward Tier I
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-5 mt-4 border-t border-[var(--border)] flex items-center justify-between gap-3 relative z-10">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300 text-xs font-semibold hover:bg-rose-500/20 transition-all cursor-pointer shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>

          <button
            type="button"
            onClick={closeProfileModal}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[var(--surface-pill)] border border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--surface-high)] transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
