"use client";

import { Card } from "@/components/ui/card";
import { Settings, Moon, Bell, Shield, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
      <div>
        <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
          <Settings className="text-blue-600" size={32} /> Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your platform preferences and notification rules.</p>
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

        {/* Appearance Card */}
        <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1F2937] overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
            <Moon className="text-gray-500 dark:text-gray-400" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Appearance</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">Dark Mode</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Toggle the platform&apos;s visual theme.</p>
              </div>
              {mounted && (
                <button 
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              )}
            </div>
            {mounted && isDark && (
              <p className="text-xs text-orange-600 mt-3 font-semibold bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400 p-2 rounded-lg inline-block">
                Note: Dark mode is currently applied globally.
              </p>
            )}
          </div>
        </Card>

        {/* Security Card */}
        <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1F2937] overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
            <Shield className="text-gray-500 dark:text-gray-400" size={20} />
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Security</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <Smartphone className="text-gray-400 dark:text-gray-500 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Add an extra layer of security to your academic account.</p>
                </div>
              </div>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-4 py-2 rounded-xl transition-colors border border-blue-100 dark:border-blue-800">
                Setup 2FA
              </button>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
