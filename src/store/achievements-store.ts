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

export const useAchievementsStore = create<AchievementsState>((set) => ({
  badges: [
    { id: "B1", title: "First Submission", desc: "Successfully submitted your first SDG project proposal.", unlocked: true, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/30", border: "border-blue-200 dark:border-blue-800", exp: 100 },
    { id: "B2", title: "Energy Innovator", desc: "Achieved a 9.0+ score on an SDG 7 related project.", unlocked: true, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/30", border: "border-amber-200 dark:border-amber-800", exp: 250 },
    { id: "B3", title: "Water Champion", desc: "Complete 3 distinct projects targeting SDG 6 parameters.", unlocked: false, progress: 66, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-900/30", border: "border-cyan-200 dark:border-cyan-800", exp: 500 },
    { id: "B4", title: "Dean's Commendation", desc: "Receive direct approval from the Dean on an interdisciplinary project.", unlocked: false, progress: 0, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/30", border: "border-purple-200 dark:border-purple-800", exp: 1000 },
    { id: "B5", title: "Global Thinker", desc: "Map your abstract to more than 3 distinct SDGs simultaneously.", unlocked: false, progress: 25, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/30", border: "border-emerald-200 dark:border-emerald-800", exp: 750 },
    { id: "B6", title: "Perfect Format", desc: "Submit a report that perfectly aligns with the Master Dictionary with 0 errors.", unlocked: true, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/30", border: "border-rose-200 dark:border-rose-800", exp: 200 },
  ],
  updateBadge: (id, updates) => set((state) => ({
    badges: state.badges.map(b => b.id === id ? { ...b, ...updates } : b)
  }))
}));
