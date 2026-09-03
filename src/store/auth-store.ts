import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role } from "@/lib/constants/roles";

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  profileImage?: string;
  designation?: string;
  department?: string;
  passkey?: string;
  identifier?: string;
  phoneNumber?: string;
  githubUrl?: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => void;
  registerUser: (user: User) => Promise<void>;
  updateProfileImage: (imageUrl: string) => void;
  deleteProfileImage: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, 
      login: async (userCreds) => {
        try {
          const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userCreds.email, passkey: userCreds.passkey })
          });
          if (res.ok) {
            const data = await res.json();
            // Data mapping from backend user table to frontend user object
            const backendUser = data.user;
            const fullUser = {
              ...userCreds,
              id: backendUser.id,
              name: backendUser.name,
              role: backendUser.role,
              department: backendUser.department,
            };
            set({ user: fullUser });
          } else {
            console.error("Login failed");
            set({ user: userCreds }); // Fallback if backend isn't running
          }
        } catch {
          set({ user: userCreds });
        }
      },
      logout: () => set({ user: null }),
      registerUser: async (user) => {
        try {
          await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              department: user.department,
              passkey: user.passkey
            })
          });
          set((state) => ({ 
            user: user 
          }));
        } catch (e) {
          console.error(e);
        }
      },
      updateProfileImage: (imageUrl) => {
        set((state) => ({
          user: state.user ? { ...state.user, profileImage: imageUrl } : null,
        }));
      },
      deleteProfileImage: () => {
        set((state) => ({
          user: state.user ? { ...state.user, profileImage: undefined } : null,
        }));
      },
      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      version: 2, // Bump version to force cache invalidation and purge corrupted CSE data
    }
  )
);
