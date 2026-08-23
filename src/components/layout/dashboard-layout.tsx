"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { BotMessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    let expectedPrefix = `/${user.role.toLowerCase()}`;
    if (user.role === "HOD" || user.role === "DEAN" || user.role === "LEADERSHIP") {
      expectedPrefix = "/leadership";
    }

    if (!pathname.startsWith(expectedPrefix)) {
      router.push(expectedPrefix);
    } else {
      setIsAuthorized(true);
    }
  }, [user, pathname, router]);

  if (!isAuthorized) {
    return null; // Don't render until authorized
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0B1120] text-gray-900 dark:text-gray-100 overflow-hidden relative">
      {/* Absolute Background Grid Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] dark:opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" className="stroke-gray-900 dark:stroke-white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
      
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10 dark:bg-[#0B1120]">
          <div className="max-w-7xl mx-auto w-full space-y-10">
            {children}
          </div>
        </main>
      </div>


    </div>
  );
}
