import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number; // ms, default 5000
}

interface NotificationStore {
  notifications: ToastNotification[];
  addNotification: (notification: Omit<ToastNotification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (item) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastNotification = {
      ...item,
      id,
      duration: item.duration ?? 5000,
    };

    set((state) => ({
      // Stack at the top, max 5 notifications at once
      notifications: [newToast, ...state.notifications].slice(0, 5),
    }));

    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => set({ notifications: [] }),
}));

// Ergonomic helper API for instant usage anywhere in client components
export const notify = {
  success: (message: string, title: string = 'Success') => {
    return useNotificationStore.getState().addNotification({
      type: 'success',
      title,
      message,
    });
  },
  error: (message: string, title: string = 'Verification Alert') => {
    return useNotificationStore.getState().addNotification({
      type: 'error',
      title,
      message,
    });
  },
  warning: (message: string, title: string = 'Notice') => {
    return useNotificationStore.getState().addNotification({
      type: 'warning',
      title,
      message,
    });
  },
  info: (message: string, title: string = 'Information') => {
    return useNotificationStore.getState().addNotification({
      type: 'info',
      title,
      message,
    });
  },
};
