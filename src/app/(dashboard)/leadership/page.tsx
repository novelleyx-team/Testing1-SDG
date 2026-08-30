"use client";

import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/features/analytics/components/bar-chart";
import { LineChart } from "@/features/analytics/components/line-chart";
import { DonutChart } from "@/features/analytics/components/donut-chart";
import { PyramidChart } from "@/features/analytics/components/pyramid-chart";
import { Building2, CheckCircle2, Clock, Users, Activity, Target } from "lucide-react";
import { useRealtimeChartData } from "@/hooks/useRealtimeChartData";

export default function LeadershipDashboardPage() {
  const { user } = useAuthStore();
  
  // Use department if available, otherwise fall back to designation for broader roles (like Deans)
  const userScope = user?.department || user?.designation || "College";
  const isDean = user?.designation?.includes("Dean") || user?.designation?.includes("Coordinator") || user?.designation?.includes("Head");

  const { data: monthlySubmissions } = useRealtimeChartData('leadership_monthly_submissions', 'month', 'count');
  const { data: funnelData } = useRealtimeChartData('leadership_funnel', 'stage', 'value');
  const { data: projectsByStatus } = useRealtimeChartData('leadership_project_status', 'status', 'value');
  const { data: sdgDistribution } = useRealtimeChartData('leadership_sdg_distribution', 'sdg', 'value');

  // Hardcode KPIs to 0 until database is populated per Zero-Mock policy
  const kpis = [
    { title: "Total Projects", value: "0", icon: Building2, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { title: "Active Students", value: "0", icon: Users, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
    { title: "Completed Projects", value: "0", icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    { title: "Pending Review", value: "0", icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { title: "Avg. SDG Impact", value: "0/10", icon: Target, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { title: "Faculty Engagement", value: "0%", icon: Activity, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/30" },
  ];

  // Empty list for faculty until populated
  const departmentFaculty: { id: string; name: string; email: string; department: string; activeProjects: number; status: string }[] = [];

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
            {user?.designation === "HOD" ? "HOD Dashboard" : (user?.designation?.includes("Dean") ? "Dean Dashboard" : "Leadership Dashboard")}
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1 max-w-2xl">
            Real-time SDG analytics and operational overview strictly scoped to <span className="font-semibold text-slate-700 dark:text-gray-200 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{userScope}</span>.
          </p>
        </div>
      </div>

      {/* KPI Grid - Dense Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={i} className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937] hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col justify-between h-full gap-3">
                <div className="flex flex-row items-start justify-between">
                  <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-gray-100 tracking-tight">{kpi.value}</div>
                  <div className="text-[13px] font-medium text-slate-500 dark:text-gray-400 mt-0.5">{kpi.title}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <LineChart 
          title="Submission Velocity" 
          description="Project submissions over the last 6 months"
          data={monthlySubmissions}
          color="#3B82F6"
        />
        <PyramidChart 
          title="Project Funnel Progression"
          description="Conversion rates from proposal to successful deployment"
          data={funnelData}
        />
      </div>

      {/* Secondary Analytics Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <DonutChart 
            title="Project Status Breakdown" 
            description="Current states of all tracked projects"
            data={projectsByStatus}
          />
        </div>
        <div className="xl:col-span-2">
          <BarChart 
            title="SDG Focus Distribution" 
            description="Top Sustainable Development Goals targeted by projects"
            data={sdgDistribution}
          />
        </div>
      </div>

      {/* Faculty Roster Table */}
      <div className="mt-4">
        <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-gray-100">
              {isDean ? "College Faculty Roster Overview" : `${userScope} Faculty Roster`}
            </CardTitle>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Only displaying faculty members assigned to your scope.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 dark:text-gray-400 uppercase bg-slate-50/50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-tl-lg">Faculty Member</th>
                    <th className="px-4 py-3 font-medium">Faculty ID</th>
                    <th className="px-4 py-3 font-medium">Department</th>
                    <th className="px-4 py-3 font-medium text-center">Active Projects</th>
                    <th className="px-4 py-3 font-medium rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {departmentFaculty.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-gray-400">
                        No faculty members found in your scope.
                      </td>
                    </tr>
                  ) : (
                    departmentFaculty.map((faculty, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-gray-100">{faculty.name}</div>
                          <div className="text-xs text-slate-500 dark:text-gray-400">{faculty.email}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-gray-300 font-mono text-xs">{faculty.id}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-gray-300">{faculty.department}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {faculty.activeProjects}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                            faculty.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            faculty.status === "On Leave" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" :
                            "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          }`}>
                            {faculty.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
