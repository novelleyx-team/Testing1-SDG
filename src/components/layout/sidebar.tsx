"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAVIGATION } from "@/lib/constants/navigation";
import { useAuthStore } from "@/store/auth-store";
import * as Icons from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  if (!user) return null;

  const links = NAVIGATION[user.role] || [];

  return (
    <aside
      className={cn(
        "bg-white dark:bg-[#111827] border-r border-gray-100 dark:border-white/5 flex flex-col transition-all duration-0 shadow-sm relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-white/5 justify-between">
        {!isCollapsed && (
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            NOVELLEYX
          </span>
        )}
        {isCollapsed && (
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mx-auto">
            NX
          </span>
        )}
      </div>
      
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-white dark:bg-[#1F2937] border border-gray-200 dark:border-white/10 rounded-full p-1 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 z-10"
      >
        {isCollapsed ? <Icons.ChevronRight size={14} /> : <Icons.ChevronLeft size={14} />}
      </button>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = Icons[link.icon as keyof typeof Icons] as React.ElementType;
          const isDashboard = link.title === "Dashboard";
          const isActive = isDashboard 
            ? pathname === link.href 
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-0",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.3)] dark:shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-blue-200 dark:border-blue-500/30 font-bold"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1F2937] hover:text-gray-900 dark:hover:text-gray-100 font-medium",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? link.title : undefined}
            >
              {Icon && <Icon className={cn("shrink-0", isActive ? "text-blue-600 dark:text-blue-400 drop-shadow-[0_0_8px_rgba(37,99,235,0.6)] dark:drop-shadow-[0_0_12px_rgba(37,99,235,0.8)]" : "text-gray-400 dark:text-gray-500")} size={20} />}
              {!isCollapsed && (
                <span className="text-sm">{link.title}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827]">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm shrink-0">
            {user.name.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col flex-1 truncate">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                {user?.designation ? (user?.department ? `${user.designation} - ${user.department}` : user.designation) : user?.role?.toLowerCase() || 'student'}
              </span>
            </div>
          )}
          {!isCollapsed && (
            <button 
              onClick={handleLogout}
              className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30"
              title="Log out"
            >
              <Icons.LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
