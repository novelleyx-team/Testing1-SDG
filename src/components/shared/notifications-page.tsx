"use client";

import { useAuthStore } from "@/store/auth-store";
import { useNotificationPanelStore } from "@/store/notification-panel-store";
import { Card } from "@/components/ui/card";
import { Bell, CheckCircle2, ShieldCheck, Clock, Brain, Info, AlertTriangle } from "lucide-react";

export function NotificationsPage() {
  const { user } = useAuthStore();
  const { getNotifications, markAllAsRead, markAsRead } = useNotificationPanelStore();

  const notifications = user ? getNotifications(user.id) : [];

  const handleMarkAllAsRead = () => {
    if (user) {
      markAllAsRead(user.id);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "ai": return <Brain size={20} className="text-purple-600 dark:text-purple-400" />;
      case "success": return <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />;
      case "warning": return <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400" />;
      case "faculty": return <ShieldCheck size={20} className="text-blue-600 dark:text-blue-400" />;
      case "deadline": return <Clock size={20} className="text-orange-600 dark:text-orange-400" />;
      case "system":
      case "info":
      default: return <Info size={20} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "ai": return "bg-purple-100 dark:bg-purple-900/30";
      case "success": return "bg-emerald-100 dark:bg-emerald-900/30";
      case "warning": return "bg-amber-100 dark:bg-amber-900/30";
      case "faculty": return "bg-blue-100 dark:bg-blue-900/30";
      case "deadline": return "bg-orange-100 dark:bg-orange-900/30";
      case "system":
      case "info":
      default: return "bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500 max-w-4xl mx-auto p-6 md:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
            <Bell className="text-blue-600 dark:text-blue-500" size={32} /> Notifications
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Stay updated on your project statuses and system alerts.</p>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-xl transition-colors self-start sm:self-auto"
          >
            Mark all as read
          </button>
        )}
      </div>

      <Card className="rounded-[18px] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-[#1F2937]">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center gap-3">
            <Bell size={48} className="text-gray-300 dark:text-gray-600" />
            <p>You have no notifications at the moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => { if (!notif.read && user) markAsRead(user.id, notif.id); }}
                className={`p-6 flex items-start gap-5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer ${!notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
              >
                <div className={`w-12 h-12 rounded-full ${getBgColor(notif.type)} flex items-center justify-center shrink-0`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
                    <h4 className={`text-base truncate ${!notif.read ? 'font-bold text-gray-900 dark:text-gray-100' : 'font-semibold text-gray-700 dark:text-gray-300'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap">
                      {new Date(notif.timestamp).toLocaleDateString()} {new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${!notif.read ? 'font-medium text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500 mt-2 shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
