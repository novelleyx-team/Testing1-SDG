"use client";

import React, { useEffect } from "react";
import { ServerCrash, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log to an error reporting service here
    console.error("Dashboard Module Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm m-6">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
        <ServerCrash className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Dashboard Component Failure</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        We encountered a problem loading this specific dashboard module. The rest of the platform is still fully operational.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-full flex items-center gap-2 transition-colors"
      >
        <RefreshCw className="w-4 h-4" /> Reload Module
      </button>
    </div>
  );
}
