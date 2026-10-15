'use client';

import { useDolab, useDolabData, SetDolabData } from 'dolab';
import { getMe } from './api';
import { User } from './types';

const CURRENT_USER_KEY = 'current-user';

const fetchCurrentUser = async (setData: SetDolabData<User | null>) => {
  if (typeof window === 'undefined') return;

  const token = localStorage.getItem('token');
  if (!token) {
    setData(null);
    return;
  }

  try {
    const user = await getMe();
    setData(user);
  } catch {
    localStorage.removeItem('token');
    setData(null);
  }
};

export function useCurrentUser() {
  return useDolab<User | null>({
    id: CURRENT_USER_KEY,
    fetch: fetchCurrentUser,
    lifeTime: 1000 * 60 * 15,
  });
}

export function useCurrentUserData() {
  return useDolabData<User | null>({
    id: CURRENT_USER_KEY,
  });
}
