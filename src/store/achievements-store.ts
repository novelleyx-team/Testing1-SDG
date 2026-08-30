import { create } from 'zustand';

export interface Badge {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
  color: string;
  bg: string;
  border: string;
  exp: number;
  progress?: number;
}

interface AchievementsState {
  badges: Badge[];
  updateBadge: (id: string, updates: Partial<Badge>) => void;
}

// Badges start empty - they are earned through real user actions
export const useAchievementsStore = create<AchievementsState>((set) => ({
  badges: [],
  updateBadge: (id, updates) => set((state) => ({
    badges: state.badges.map(b => b.id === id ? { ...b, ...updates } : b)
  }))
}));
