"use client";

import { Card } from "@/components/ui/card";
import { Settings, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeSettingsCard } from "@/components/shared/theme-settings-card";
import { TwoFactorSetup } from "@/components/shared/two-factor-setup";

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
      <div>
        <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
          <Settings className="text-blue-600" size={32} /> Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your platform preferences and notification rules.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Notifications Card */}
        <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1F2937] overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
            <Bell className="text-gray-500 dark:text-gray-400" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Notifications</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">Email Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Receive AI analysis results and faculty feedback via email.</p>
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
                <h4 className="font-bold text-gray-900 dark:text-gray-100">Push Notifications</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Get browser alerts for approaching project deadlines.</p>
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

        {mounted && (
          <>
            {/* Appearance & Theme (Phase 4) */}
            <ThemeSettingsCard />

            {/* Security & 2FA (Phase 7) */}
            <TwoFactorSetup />
          </>
        )}
      </div>
    </div>
  );
}
