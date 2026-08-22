"use client";

import React, { useState } from "react";
import { useSystemStore } from "@/store/system-store";
import { useNotificationStore } from "@/store/notification-store";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, 
  Power, 
  Server, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  AlertOctagon, 
  CheckCircle2, 
  Building,
  Terminal,
  Activity,
  RefreshCw
} from "lucide-react";

export function Settings() {
  const { 
    isMaintenanceMode, 
    securityLevel, 
    activeDepartments,
    toggleMaintenance,
    setSecurityLevel,
    toggleDepartment
  } = useSystemStore();
  const showNotification = useNotificationStore(state => state.showNotification);
  
  const [confirmText, setConfirmText] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);

  const handleReboot = () => {
    setIsRebooting(true);
    showNotification("Server Reboot Initiated", "The core system is restarting...", "success");
    setTimeout(() => {
      setIsRebooting(false);
      showNotification("Reboot Complete", "Server is back online. All state is preserved.", "success");
    }, 4000);
  };

  const handleKillSwitch = () => {
    if (confirmText === "CONFIRM") {
      toggleMaintenance(true);
      showNotification("GLOBAL LOCKDOWN INITIATED", "All students and faculty have been forcefully disconnected.", "error");
      setConfirmText("");
      setIsConfirming(false);
    } else {
      showNotification("Authentication Failed", "You must type CONFIRM to trigger the kill switch.", "error");
    }
  };

  const handleDisableKillSwitch = () => {
    toggleMaintenance(false);
    showNotification("Systems Restored", "Global operations have been restored to normal.", "success");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* God Mode Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg border border-purple-200">
              <Terminal className="w-6 h-6 text-purple-700" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Campus Control Center</h1>
          </div>
          <p className="text-slate-500 font-mono text-sm">
            STATUS: <span className={isMaintenanceMode ? "text-red-600 font-bold animate-pulse" : "text-emerald-600 font-bold"}>
              {isMaintenanceMode ? "OFFLINE (MAINTENANCE)" : "ONLINE & OPERATIONAL"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-purple-600" />
          <span className="text-purple-700 text-sm font-bold uppercase tracking-wider">God Mode Authorized</span>
        </div>
      </div>

      {/* DANGER ZONE - GLOBAL KILL SWITCH */}
      <motion.div 
        layout
        className={`relative overflow-hidden rounded-[2rem] border-2 transition-colors duration-500 ${isMaintenanceMode ? 'border-red-500/50 bg-red-50' : 'border-rose-200 bg-white shadow-sm'}`}
      >
        {isMaintenanceMode && (
          <div className="absolute inset-0 bg-red-100/50 animate-pulse pointer-events-none" />
        )}
        
        <div className="p-8 md:p-10">
          <div className="flex items-start gap-6">
            <div className={`p-4 rounded-2xl shrink-0 ${isMaintenanceMode ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] text-white' : 'bg-rose-100 border border-rose-200 text-rose-600'}`}>
              <Power className={`w-10 h-10`} />
            </div>
            
            <div className="flex-1 relative z-10">
              <h2 className={`text-2xl font-black uppercase tracking-tight mb-2 ${isMaintenanceMode ? 'text-red-700' : 'text-slate-900'}`}>
                Global Maintenance Kill Switch
              </h2>
              <p className={`max-w-2xl leading-relaxed mb-6 ${isMaintenanceMode ? 'text-red-600' : 'text-slate-500'}`}>
                Activating this switch will forcefully disconnect all non-admin users across the entire college network immediately. They will be met with a lockdown screen. Use only during critical updates or security breaches.
              </p>

              <AnimatePresence mode="wait">
                {!isMaintenanceMode ? (
                  !isConfirming ? (
                    <motion.button 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsConfirming(true)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_4px_14px_rgba(225,29,72,0.3)] flex items-center gap-2"
                    >
                      <AlertOctagon className="w-5 h-5" /> INITIATE LOCKDOWN
                    </motion.button>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-rose-200 shadow-md inline-flex"
                    >
                      <input 
                        type="text" 
                        placeholder="Type 'CONFIRM'" 
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="bg-slate-50 text-rose-600 font-mono font-bold uppercase placeholder:text-rose-300 border border-slate-200 rounded-lg outline-none px-4 py-2 w-48 text-center focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                      />
                      <button 
                        onClick={handleKillSwitch}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-md"
                      >
                        EXECUTE
                      </button>
                      <button 
                        onClick={() => {setIsConfirming(false); setConfirmText("");}}
                        className="text-slate-500 hover:text-slate-800 px-4 font-bold"
                      >
                        CANCEL
                      </button>
                    </motion.div>
                  )
                ) : (
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleDisableKillSwitch}
                    className="bg-white hover:bg-slate-50 text-emerald-600 font-bold py-3 px-8 rounded-xl transition-all border-2 border-emerald-500 shadow-md flex items-center gap-2"
                  >
                    <Power className="w-5 h-5" /> RESTORE ALL SYSTEMS
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Security Protocols */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors" />
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <ShieldAlert className="w-8 h-8 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">Security Protocols</h3>
          </div>

          <div className="space-y-4 relative z-10">
            {[
              { id: 'STANDARD', title: 'Standard Operation', desc: 'Normal traffic allowed. Basic JWT validation.' },
              { id: 'ELEVATED', title: 'Elevated Scrutiny', desc: 'Requires 2FA for all faculty logins. IP logging active.' },
              { id: 'LOCKDOWN', title: 'Maximum Security', desc: 'No new registrations. All file uploads blocked.' }
            ].map((level) => (
              <div 
                key={level.id}
                onClick={() => {
                  setSecurityLevel(level.id as "STANDARD" | "ELEVATED" | "LOCKDOWN");
                  showNotification("Protocol Updated", `Security level shifted to ${level.id}.`, "success");
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  securityLevel === level.id 
                    ? 'border-blue-500 bg-blue-50 shadow-[0_4px_14px_rgba(59,130,246,0.1)]' 
                    : 'border-slate-100 hover:border-blue-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold uppercase tracking-wider ${securityLevel === level.id ? 'text-blue-700' : 'text-slate-600'}`}>
                    {level.title}
                  </span>
                  {securityLevel === level.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                </div>
                <p className="text-slate-500 text-sm">{level.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Department Control Network */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl group-hover:bg-purple-100 transition-colors" />
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <Building className="w-8 h-8 text-purple-600" />
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">Network Traffic routing</h3>
          </div>

          <p className="text-slate-500 text-sm mb-6 relative z-10">
            Toggle network access for specific college departments. Disabling a department immediately halts their API traffic.
          </p>

          <div className="space-y-3 relative z-10">
            {Object.entries(activeDepartments).map(([dept, isActive]) => (
              <div key={dept} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className={`font-medium ${isActive ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                  {dept}
                </span>
                
                <button 
                  onClick={() => {
                    toggleDepartment(dept);
                    showNotification(
                      isActive ? "Network Disabled" : "Network Restored", 
                      `${dept} has been ${isActive ? 'disconnected from' : 'reconnected to'} the main server.`,
                      isActive ? "error" : "success"
                    );
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border shadow-sm ${
                    isActive 
                      ? 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50' 
                      : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                  }`}
                >
                  {isActive ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  {isActive ? 'Active' : 'Halted'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Core Server Actions */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group lg:col-span-2">
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-colors" />
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <Server className="w-8 h-8 text-emerald-600" />
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">Core Server Infrastructure</h3>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 relative z-10">
            <div>
              <h4 className="font-bold text-slate-800 mb-1">Server Instance Control</h4>
              <p className="text-slate-500 text-sm">Force reboot the core backend services. Global state and user data are automatically preserved via persistent edge storage during reboot.</p>
            </div>
            
            <button 
              onClick={handleReboot}
              disabled={isRebooting}
              className={`px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center gap-3 shrink-0 shadow-sm border ${
                isRebooting 
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200 cursor-not-allowed' 
                  : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300'
              }`}
            >
              <RefreshCw className={`w-5 h-5 ${isRebooting ? 'animate-spin' : ''}`} />
              {isRebooting ? 'Rebooting...' : 'Reboot Server'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
