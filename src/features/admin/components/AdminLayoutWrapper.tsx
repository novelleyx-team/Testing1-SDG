"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Role } from "@/lib/constants/roles";
import { Loader2, LogOut, LayoutDashboard, Database, Settings, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // If not logged in at all, redirect to login
      if (pathname.includes("/admin/") && pathname !== "/admin/login") {
        if (!user) {
          router.replace("/admin/login");
        }
      }
    }
  }, [user, router, pathname, isMounted]);

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // If on login page, render children directly without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Aggressive Breach Detected Screen for non-admins
  if (user && user.role !== Role.ADMIN) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 relative overflow-hidden text-center">
        {/* Sirens/Alarms visual effect */}
        <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" style={{ animationDuration: '0.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl bg-black/60 border-2 border-red-600/50 p-10 rounded-[2rem] shadow-[0_0_50px_rgba(220,38,38,0.3)] backdrop-blur-md">
          <div className="w-24 h-24 bg-red-500/20 border-2 border-red-500 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl font-black">⚠</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Security Breach Detected
          </h1>
          <p className="text-red-400 font-mono text-lg mb-6 uppercase tracking-widest">
            Unauthorized Access Attempt Logged
          </p>
          <div className="bg-red-950/50 p-6 rounded-xl border border-red-900 mb-8 text-left">
            <p className="text-slate-300 mb-2">
              <strong className="text-red-400">User ID:</strong> {user.id}
            </p>
            <p className="text-slate-300 mb-2">
              <strong className="text-red-400">Current Role:</strong> {user.role}
            </p>
            <p className="text-slate-400 text-sm mt-4">
              This incident has been recorded. Attempting to access Tier-1 Administrative Infrastructure without proper clearance violates the Zero-Tolerance Security Policy. 
            </p>
          </div>
          <Button 
            onClick={() => router.replace("/student/dashboard")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg uppercase tracking-wider rounded-xl transition-all"
          >
            Evacuate to Safe Zone
          </Button>
        </div>
      </div>
    );
  }

  // Prevent flash of unauthorized content if user is somehow null but didn't redirect yet
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            SDG Admin
          </h2>
          <p className="text-sm text-slate-500 mt-1">Super User Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/dashboard')}
            className={`w-full justify-start ${pathname === '/admin/dashboard' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/data-center')}
            className={`w-full justify-start ${pathname === '/admin/data-center' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <Database className="mr-3 h-5 w-5" />
            Data Center
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/settings')}
            className={`w-full justify-start ${pathname === '/admin/settings' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <Settings className="mr-3 h-5 w-5" />
            System Settings
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/admin/suggestions')}
            className={`w-full justify-start ${pathname === '/admin/suggestions' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <Inbox className="mr-3 h-5 w-5" />
            Global Suggestions
          </Button>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Secure Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-slate-800">Overview</h1>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}
