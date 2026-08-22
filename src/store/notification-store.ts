import { create } from 'zustand';

interface NotificationState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  showNotification: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  closeNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  type: 'success',
  
  showNotification: (title, message, type = 'success') => {
    set({ isOpen: true, title, message, type });
  },
  
  closeNotification: () => {
    set({ isOpen: false });
  },
}));
