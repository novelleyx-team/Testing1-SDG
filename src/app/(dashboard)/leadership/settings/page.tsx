"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Bell, Lock, Globe, Cloud, CloudOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updatePasskeyInCode } from "@/app/actions/user-actions";

export default function LeadershipSettingsPage() {
  const { user } = useAuthStore();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'error' | 'success'} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted || !user) return null;

  const handleUpdatePassword = async () => {
    setMessage(null);
    if (!currentPassword || !newPassword) {
      setMessage({ text: "Please fill in both password fields.", type: 'error' });
      return;
    }

    if (!isCloudConnected) {
      setMessage({ text: "Cannot update password locally. Please connect to the Cloud Server first.", type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await updatePasskeyInCode(user.id, currentPassword, newPassword);
      if (res.success) {
        setMessage({ text: res.message, type: 'success' });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setMessage({ text: res.message, type: 'error' });
      }
    } catch (e) {
      setMessage({ text: "An unexpected error occurred.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Settings className="text-blue-600" size={32} />
            Platform Settings
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            Manage your notification preferences, security, and account settings.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Bell className="text-slate-500" size={20} />
              <CardTitle className="text-lg font-bold text-slate-800">Notifications</CardTitle>
            </div>
            <CardDescription>Control when and how you are notified.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Email Alerts</h4>
                <p className="text-sm text-slate-500">Receive emails for new project proposals.</p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Weekly Digest</h4>
                <p className="text-sm text-slate-500">A weekly summary of SDG performance.</p>
              </div>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Lock className="text-slate-500" size={20} />
              <CardTitle className="text-lg font-bold text-slate-800">Security</CardTitle>
            </div>
            <CardDescription>Manage your password and security settings.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-4">
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                {isCloudConnected ? <Cloud className="text-emerald-500" size={24} /> : <CloudOff className="text-slate-400" size={24} />}
                <div>
                  <h4 className="font-semibold text-slate-900">Cloud Sync Connection</h4>
                  <p className="text-xs text-slate-500">Connect to the cloud server to sync security updates.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isCloudConnected} onChange={(e) => setIsCloudConnected(e.target.checked)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {message && (
              <div className={`flex items-center gap-2 p-3 rounded-md text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                {message.text}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" 
              />
            </div>
            <Button 
              className="w-fit mt-2 bg-slate-900 hover:bg-slate-800"
              onClick={handleUpdatePassword}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Globe className="text-slate-500" size={20} />
              <CardTitle className="text-lg font-bold text-slate-800">Display Preferences</CardTitle>
            </div>
            <CardDescription>Customize your dashboard experience.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Dark Mode</h4>
                <p className="text-sm text-slate-500">Toggle dark mode theme.</p>
              </div>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Compact Tables</h4>
                <p className="text-sm text-slate-500">Show more rows in data tables.</p>
              </div>
              <input type="checkbox" className="toggle" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
