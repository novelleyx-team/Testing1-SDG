"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Bell, Brain, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";

const initialNotifications = [
  {
    id: "NOT-1",
    type: "ai",
    title: "AI Analysis Complete",
    message: "Your submission 'Clean Water Filtration System' has been evaluated. You scored a 9.1!",
    time: "2 hours ago",
    read: false,
    icon: <Brain size={20} className="text-purple-600" />,
    bg: "bg-purple-100",
  },
  {
    id: "NOT-2",
    type: "faculty",
    title: "Faculty Approval",
    message: "Dr. Sharma has approved your SDG 11 proposal. You can now download your official certificate.",
    time: "Yesterday, 4:30 PM",
    read: false,
    icon: <ShieldCheck size={20} className="text-emerald-600" />,
    bg: "bg-emerald-100",
  },
  {
    id: "NOT-3",
    type: "deadline",
    title: "Upcoming Deadline",
    message: "Reminder: Final submissions for the Campus Sustainability Drive close in 4 days.",
    time: "Oct 22, 2026",
    read: true,
    icon: <Clock size={20} className="text-orange-600" />,
    bg: "bg-orange-100",
  },
  {
    id: "NOT-4",
    type: "system",
    title: "Achievement Unlocked!",
    message: "You have unlocked the 'Energy Innovator' badge for your work on SDG 7.",
    time: "Oct 18, 2026",
    read: true,
    icon: <CheckCircle2 size={20} className="text-blue-600" />,
    bg: "bg-blue-100",
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-0 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[36px] font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Bell className="text-blue-600" size={32} /> Notifications
          </h1>
          <p className="text-gray-500 mt-1">Stay updated on your project statuses and system alerts.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-none overflow-hidden bg-white">
        <div className="divide-y divide-gray-50">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-6 flex items-start gap-5 transition-colors hover:bg-gray-50/50 ${!notif.read ? 'bg-blue-50/20' : ''}`}
            >
              <div className={`w-12 h-12 rounded-full ${notif.bg} flex items-center justify-center shrink-0`}>
                {notif.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`text-base ${!notif.read ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-xs font-semibold text-gray-400 whitespace-nowrap ml-4">
                    {notif.time}
                  </span>
                </div>
                <p className={`mt-1 text-sm ${!notif.read ? 'font-medium text-gray-600' : 'text-gray-500'}`}>
                  {notif.message}
                </p>
              </div>
              {!notif.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
