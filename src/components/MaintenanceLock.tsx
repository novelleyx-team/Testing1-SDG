"use client";

import React, { useEffect, useState } from "react";
import { useSystemStore } from "@/store/system-store";
import { useAuthStore } from "@/store/auth-store";
import { Role } from "@/lib/constants/roles";
import { AlertTriangle, Lock, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

export function MaintenanceLock({ children }: { children: React.ReactNode }) {
  const { isMaintenanceMode } = useSystemStore();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return <>{children}</>;

  // Admins bypass the lock completely. Everyone else gets locked out.
  const isLockedOut = isMaintenanceMode && user?.role !== Role.ADMIN;

  if (isLockedOut) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
        {/* Aggressive Red Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-red-600/20 blur-[150px] pointer-events-none animate-pulse rounded-full" style={{ animationDuration: '3s' }} />
        
        <div className="relative z-10 w-full max-w-2xl text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-red-500/10 border-2 border-red-500/30 mb-8 relative"
          >
            <div className="absolute inset-0 rounded-full border border-red-500/50 animate-ping" style={{ animationDuration: '2s' }} />
            <ShieldAlert className="w-16 h-16 text-red-500" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase mb-6"
          >
            System Lockout
          </motion.h1>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black/50 border border-red-500/30 p-6 md:p-8 rounded-3xl backdrop-blur-md mb-8 inline-block max-w-lg mx-auto"
          >
            <div className="flex items-start gap-4 text-left">
              <AlertTriangle className="w-8 h-8 text-red-500 shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-2 uppercase tracking-wide">Global Maintenance Active</h3>
                <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                  The Campus Administration has triggered an emergency halt on all platform operations. Access for students and faculty is temporarily suspended while critical updates are applied.
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 text-slate-500 font-mono text-sm uppercase tracking-widest"
          >
            <Lock className="w-4 h-4" /> Secure Auth Layer Enforced
          </motion.div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
