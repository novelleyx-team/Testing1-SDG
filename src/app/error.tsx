"use client";

import React, { useEffect } from "react";
import { ShieldAlert, RefreshCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-10 max-w-lg w-full text-center shadow-xl">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Something went wrong!</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          The requested page or component crashed unexpectedly. Your session remains secure.
        </p>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full inline-flex items-center gap-2 transition-colors w-full justify-center"
          >
            <RefreshCcw className="w-5 h-5" /> Try Again
          </button>
          <Link
            href="/"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-8 rounded-full inline-flex items-center gap-2 transition-colors w-full justify-center"
          >
            <ArrowLeft className="w-5 h-5" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
