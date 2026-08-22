"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/features/analytics/components/line-chart";
import { BarChart } from "@/features/analytics/components/bar-chart";
import { Activity, Server, Users, ShieldCheck } from "lucide-react";
import { useRealtimeChartData } from "@/hooks/useRealtimeChartData";

const kpis = [
  { title: "Total Users", value: "0", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  { title: "Active Sessions", value: "0", icon: Activity, color: "text-green-600", bg: "bg-green-100" },
  { title: "System Uptime", value: "0%", icon: Server, color: "text-purple-600", bg: "bg-purple-100" },
  { title: "Security Alerts", value: "0", icon: ShieldCheck, color: "text-slate-600", bg: "bg-slate-100" },
];

export default function AdminDashboardPage() {
  const { data: systemUsageData } = useRealtimeChartData('system_metrics', 'timestamp', 'active_users');
  const { data: userRolesData } = useRealtimeChartData('user_roles_stats', 'role', 'count');

  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Platform Administration</h1>
        <p className="text-slate-500 mt-2">Monitor platform health, active users, and system resources.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={i} className="rounded-xl shadow-sm border border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{kpi.title}</CardTitle>
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <LineChart 
          title="System Usage" 
          description="Active users over the last 24 hours"
          data={systemUsageData}
          color="#0EA5E9"
        />
        <BarChart 
          title="Users by Role" 
          description="Distribution of accounts across the platform"
          data={userRolesData}
        />
      </div>
    </div>
  );
}
