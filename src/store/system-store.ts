import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SystemState {
  isMaintenanceMode: boolean;
  securityLevel: 'STANDARD' | 'ELEVATED' | 'LOCKDOWN';
  activeDepartments: Record<string, boolean>;
  toggleMaintenance: (status: boolean) => void;
  setSecurityLevel: (level: 'STANDARD' | 'ELEVATED' | 'LOCKDOWN') => void;
  toggleDepartment: (dept: string) => void;
}

export const useSystemStore = create<SystemState>()(
  persist(
    (set) => ({
      isMaintenanceMode: false,
      securityLevel: 'STANDARD',
      activeDepartments: {
        'Computer Science & Engineering (CSE)': true,
        'Mechanical Engineering (ME)': true,
        'Civil Engineering (CE)': true,
        'Electrical & Electronics (EEE)': true,
        'Business Administration (MBA)': true,
      },
      toggleMaintenance: (status) => set({ isMaintenanceMode: status }),
      setSecurityLevel: (level) => set({ securityLevel: level }),
      toggleDepartment: (dept) => set((state) => ({
        activeDepartments: {
          ...state.activeDepartments,
          [dept]: !state.activeDepartments[dept]
        }
      }))
    }),
    {
      name: 'novelleyx-system-control',
    }
  )
);
