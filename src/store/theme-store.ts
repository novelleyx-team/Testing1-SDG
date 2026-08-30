import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ACCENT_COLORS = [
  { name: 'Blue', value: '#2563EB', class: 'bg-blue-600' },
  { name: 'Indigo', value: '#6366F1', class: 'bg-indigo-500' },
  { name: 'Emerald', value: '#10B981', class: 'bg-emerald-500' },
  { name: 'Amber', value: '#F59E0B', class: 'bg-amber-500' },
  { name: 'Rose', value: '#F43F5E', class: 'bg-rose-500' },
  { name: 'Purple', value: '#8B5CF6', class: 'bg-purple-500' },
] as const;

export type AccentColor = typeof ACCENT_COLORS[number]['value'];

interface UserThemePrefs {
  mode: 'light' | 'dark';
  accentColor: AccentColor;
}

interface ThemeState {
  userPreferences: Record<string, UserThemePrefs>;
  getPreferences: (userId: string) => UserThemePrefs;
  setMode: (userId: string, mode: 'light' | 'dark') => void;
  setAccentColor: (userId: string, color: AccentColor) => void;
}

const DEFAULT_PREFS: UserThemePrefs = {
  mode: 'light',
  accentColor: '#2563EB',
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      userPreferences: {},
      getPreferences: (userId: string) => {
        return get().userPreferences[userId] || DEFAULT_PREFS;
      },
      setMode: (userId: string, mode: 'light' | 'dark') => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            [userId]: {
              ...(state.userPreferences[userId] || DEFAULT_PREFS),
              mode,
            },
          },
        }));
      },
      setAccentColor: (userId: string, color: AccentColor) => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            [userId]: {
              ...(state.userPreferences[userId] || DEFAULT_PREFS),
              accentColor: color,
            },
          },
        }));
      },
    }),
    {
      name: 'novelleyx-theme-preferences',
    }
  )
);
