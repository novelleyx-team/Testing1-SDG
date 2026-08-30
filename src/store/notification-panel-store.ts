import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationPanelState {
  notifications: Record<string, AppNotification[]>; // keyed by userId
  getNotifications: (userId: string) => AppNotification[];
  getUnreadCount: (userId: string) => number;
  addNotification: (userId: string, notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (userId: string, notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
}

export const useNotificationPanelStore = create<NotificationPanelState>()(
  persist(
    (set, get) => ({
      notifications: {},
      getNotifications: (userId: string) => {
        return get().notifications[userId] || [];
      },
      getUnreadCount: (userId: string) => {
        const userNotifs = get().notifications[userId] || [];
        return userNotifs.filter(n => !n.read).length;
      },
      addNotification: (userId: string, notification) => {
        const newNotif: AppNotification = {
          ...notification,
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          notifications: {
            ...state.notifications,
            [userId]: [newNotif, ...(state.notifications[userId] || [])],
          },
        }));
      },
      markAsRead: (userId: string, notificationId: string) => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            [userId]: (state.notifications[userId] || []).map(n =>
              n.id === notificationId ? { ...n, read: true } : n
            ),
          },
        }));
      },
      markAllAsRead: (userId: string) => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            [userId]: (state.notifications[userId] || []).map(n => ({ ...n, read: true })),
          },
        }));
      },
    }),
    {
      name: 'novelleyx-notification-panel',
    }
  )
);
