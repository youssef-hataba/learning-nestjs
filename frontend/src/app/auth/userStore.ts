'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from './types';
import { getMe } from './api';

export interface UserSessionState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setIsHydrated: (state: boolean) => void;
  syncWithBackend: () => Promise<User | null>;
}

export const useUserStore = create<UserSessionState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isHydrated: false,
      isLoading: false,

      setUser: (user) => set({ user }),

      setToken: (token) => {
        if (typeof window !== 'undefined') {
          if (token) {
            localStorage.setItem('token', token);
          } else {
            localStorage.removeItem('token');
          }
        }
        set({ token });
      },

      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
        set({ user, token, isHydrated: true });
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({ user: null, token: null });
      },

      setIsHydrated: (isHydrated) => set({ isHydrated }),

      syncWithBackend: async () => {
        const storedToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('token') || get().token
            : get().token;

        if (!storedToken) {
          get().clearAuth();
          return null;
        }

        try {
          set({ isLoading: true });
          const freshUser = await getMe();
          set({ user: freshUser, token: storedToken, isLoading: false, isHydrated: true });
          return freshUser;
        } catch {
          // If token expired or is invalid, safely clear auth
          get().clearAuth();
          set({ isLoading: false, isHydrated: true });
          return null;
        }
      },
    }),
    {
      name: 'planto-user-session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true);
      },
    }
  )
);
