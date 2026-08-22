"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/store/notification-store";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export function GlobalNotification() {
  const { isOpen, title, message, type, closeNotification } = useNotificationStore();

  // Auto-close after 2 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        closeNotification();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, closeNotification]);

  // Close on any click anywhere in the window
  useEffect(() => {
    if (isOpen) {
      const handleClick = () => {
        closeNotification();
      };
      // Use capture phase to ensure it triggers before other click handlers prevent it
      window.addEventListener("click", handleClick, true);
      return () => window.removeEventListener("click", handleClick, true);
    }
  }, [isOpen, closeNotification]);

  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={24} />,
    error: <AlertCircle className="text-red-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />,
  };

  const bgColors = {
    success: "bg-emerald-50 border-emerald-100",
    error: "bg-red-50 border-red-100",
    info: "bg-blue-50 border-blue-100",
  };

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-0">
      <div className={`flex items-start gap-4 p-4 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border ${bgColors[type]} bg-white min-w-[320px] max-w-md`}>
        <div className={`p-2 rounded-xl bg-white shadow-sm border ${bgColors[type]}`}>
          {icons[type]}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-[15px] leading-tight">{title}</h4>
          <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}
