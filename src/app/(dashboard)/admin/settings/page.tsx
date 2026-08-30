"use client";

import { Card } from "@/components/ui/card";
import { Settings, Bell, Shield, Server, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeSettingsCard } from "@/components/shared/theme-settings-card";
import { TwoFactorSetup } from "@/components/shared/two-factor-setup";
import { useAuthStore } from "@/store/auth-store";

import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const { user } = useAuthStore();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [systemMaintenance, setSystemMaintenance] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
      <div>
        <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
          <Settings className="text-blue-600" size={32} /> System Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage core platform configurations, super-admin preferences, and global security.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Global Admin Actions */}
        <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1F2937] overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-red-50/50 dark:bg-red-900/10">
            <Shield className="text-red-500 dark:text-red-400" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Platform Administration</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Server size={16} className="text-gray-400" /> Maintenance Mode
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Lock down the platform for all users except Super Admins.
                </p>
              </div>
              <Button 
                variant={systemMaintenance ? "destructive" : "outline"}
                onClick={() => setSystemMaintenance(!systemMaintenance)}
                className={!systemMaintenance ? "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300" : ""}
              >
                {systemMaintenance ? "Disable Maintenance" : "Enable Maintenance"}
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Database size={16} className="text-gray-400" /> Database Backup
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Trigger an immediate manual snapshot of all institutional data.
                </p>
              </div>
              <Button variant="outline" className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                Trigger Backup
              </Button>
            </div>
          </div>
        </Card>

        {/* System Notifications */}
        <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1F2937] overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
            <Bell className="text-gray-500 dark:text-gray-400" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">System Alerts</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">Downtime Alerts</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Receive immediate SMS/Email on server degradation.</p>
              </div>
              <button 
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`w-12 h-6 rounded-full transition-colors relative ${emailNotifs ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${emailNotifs ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">Security Anomalies</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Push notifications for multiple failed login attempts globally.</p>
              </div>
              <button 
                onClick={() => setPushNotifs(!pushNotifs)}
                className={`w-12 h-6 rounded-full transition-colors relative ${pushNotifs ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${pushNotifs ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </Card>

        {/* Appearance & Theme (Phase 4) */}
        <ThemeSettingsCard />

        {/* Security & 2FA (Phase 7) */}
        <TwoFactorSetup />
        
      </div>
    </div>
  );
}
