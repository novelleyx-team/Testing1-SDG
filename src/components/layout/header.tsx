"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, User, Plus, LogOut, ChevronDown, UserCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="h-16 bg-white dark:bg-[#111827] border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm relative transition-colors duration-0">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search Projects, Reports, Faculty, Keywords..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1F2937] border-transparent focus:bg-white dark:focus:bg-[#1F2937] focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 rounded-full text-sm transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user?.role === 'STUDENT' && (
          <Link href="/student/projects/new">
            <Button className="hidden md:flex bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-sm transition-all hover:shadow-md border border-blue-500 dark:border-blue-400">
              <Plus size={16} className="mr-2" /> NEW PROJECT
            </Button>
          </Link>
        )}
        
        <Link href={`/${user?.role?.toLowerCase() || 'student'}/notifications`}>
          <button className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-[#111827]"></span>
          </button>
        </Link>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#1F2937] hover:bg-gray-100 dark:hover:bg-[#374151] px-3 flex items-center gap-2 py-1 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
              {user?.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || <User className="h-4 w-4" />
              )}
            </div>
            <span className="text-sm font-semibold max-w-[120px] truncate">{user?.name || 'Profile'}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1F2937] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-gray-700 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-0">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-[#111827]/50">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{user?.name || "User"}</p>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                  {user?.designation ? (user?.department ? `${user.designation} - ${user.department}` : user.designation) : user?.role}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{user?.email || "user@novelleyx.com"}</p>
              </div>
              <div className="p-2 space-y-1">
                <Link href={`/${user?.role?.toLowerCase() || 'student'}/profile`} onClick={() => setIsProfileOpen(false)}>
                  <button className="w-full text-left px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 rounded-xl transition-colors flex items-center gap-2">
                    <UserCircle size={16} /> My Profile
                  </button>
                </Link>
                <Link href={`/${user?.role?.toLowerCase() || 'student'}/settings`} onClick={() => setIsProfileOpen(false)}>
                  <button className="w-full text-left px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 rounded-xl transition-colors flex items-center gap-2">
                    <Settings size={16} /> Account Settings
                  </button>
                </Link>
              </div>
              <div className="p-2 border-t border-gray-100 dark:border-gray-700/50">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
