'use client';

import { useEffect, useRef } from 'react';
import { useUserStore } from './userStore';
import { User } from './types';

export function useCurrentUser() {
  const user = useUserStore((s) => s.user);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const isLoading = useUserStore((s) => s.isLoading);
  const syncWithBackend = useUserStore((s) => s.syncWithBackend);
  const syncedRef = useRef(false);

  useEffect(() => {
    if (syncedRef.current) return;
    syncedRef.current = true;

    // Check if token exists in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      syncWithBackend();
    }
  }, [syncWithBackend]);

  return {
    data: user,
    isHydrated,
    isLoading,
    triggerRefetch: syncWithBackend,
  };
}

export function useCurrentUserData(): { data: User | null; isHydrated: boolean } {
  const user = useUserStore((s) => s.user);
  const isHydrated = useUserStore((s) => s.isHydrated);

  return {
    data: user,
    isHydrated,
  };
}
