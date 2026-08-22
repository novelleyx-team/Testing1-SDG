"use client";

import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-200">
          <div className="bg-slate-900 border border-red-500/20 rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-4">Critical System Failure</h1>
            <p className="text-slate-400 mb-8 leading-relaxed">
              The application encountered an unrecoverable error at the root level. Our engineers have been notified. Please attempt to reset the application.
            </p>
            <div className="bg-black/50 p-4 rounded-xl text-left overflow-hidden mb-8 border border-white/5">
              <p className="text-xs font-mono text-red-400 break-words">{error.message || "Unknown error"}</p>
            </div>
            <button
              onClick={() => reset()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full inline-flex items-center gap-2 transition-colors w-full justify-center"
            >
              <RefreshCcw className="w-5 h-5" /> Reboot Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
