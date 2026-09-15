"use client";

import { useAuthStore } from "@/store/auth-store";
import { useState, useEffect } from "react";
import { BarChart } from "@/features/analytics/components/bar-chart";
import { LineChart } from "@/features/analytics/components/line-chart";
import { DonutChart } from "@/features/analytics/components/donut-chart";
import { PyramidChart } from "@/features/analytics/components/pyramid-chart";
import { BarChart3, TrendingUp, Target, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeChartData } from "@/hooks/useRealtimeChartData";



export default function LeadershipAnalyticsPage() {
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userScope = user?.department || user?.designation || "College";

  // Fetch all chart data from real database tables via realtime hooks
  const { data: growthData } = useRealtimeChartData('leadership_yoy_submissions', 'month', 'count');
  const { data: fundingDistribution } = useRealtimeChartData('leadership_funding_distribution', 'category', 'value');
  const { data: sdgImpact } = useRealtimeChartData('leadership_quality_distribution', 'tier', 'value');
  const { data: impactFunnel } = useRealtimeChartData('leadership_impact_funnel', 'stage', 'value');

  // Fetch KPI stats from API
  const [kpiStats, setKpiStats] = useState({ yoy_growth: "N/A", avg_sdg_impact: "N/A", faculty_engagement: "N/A", active_grants: "N/A" });

  useEffect(() => {
    fetch('/api/analytics/leadership')
      .then(res => res.json())
      .then(data => {
        setKpiStats({
          yoy_growth: data.yoy_growth ?? "N/A",
          avg_sdg_impact: data.avg_sdg_impact ?? "N/A",
          faculty_engagement: data.faculty_engagement ?? "N/A",
          active_grants: data.active_grants ?? "N/A",
        });
      })
      .catch(() => {
        // Keep defaults — N/A
      });
  }, []);

  if (!isMounted || !user) return null;

  const kpis = [
    { title: "YoY Project Growth", value: kpiStats.yoy_growth, icon: TrendingUp, color: "text-blue-500", bg: "bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-[#1F2937]" },
    { title: "Avg SDG Impact Score", value: kpiStats.avg_sdg_impact, icon: Target, color: "text-emerald-500", bg: "bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-[#1F2937]" },
    { title: "Faculty Engagement", value: kpiStats.faculty_engagement, icon: Users, color: "text-purple-500", bg: "bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-[#1F2937]" },
    { title: "Active Grants/Funds", value: kpiStats.active_grants, icon: BarChart3, color: "text-amber-500", bg: "bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-[#1F2937]" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-gray-100 flex items-center gap-3">
            <BarChart3 className="text-blue-600 dark:text-blue-500" size={32} />
            Analytics Hub
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1 max-w-2xl">
            Deep-dive metrics and trends aggregating performance across <span className="font-semibold text-slate-700 dark:text-gray-200 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{userScope}</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={i} className={`rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 ${kpi.bg}`}>
              <CardContent className="p-5">
                <Icon className={`${kpi.color} mb-2`} size={24} />
                <h3 className="text-3xl font-bold text-slate-900 dark:text-gray-100">{kpi.value}</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">{kpi.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <LineChart 
          title="Year-over-Year Submissions (Trailing 12 Months)" 
          description="Volume of project proposals submitted relative to previous periods"
          data={growthData}
          color="#3B82F6"
        />
        <PyramidChart 
          title="Conversion Funnel: Training to Real-World Impact"
          description="How student training translates into deployed, impactful solutions"
          data={impactFunnel}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <DonutChart 
          title="Budget/Funding Allocation" 
          description="How resources are being distributed across project types"
          data={fundingDistribution}
        />
        <BarChart 
          title="Project Quality Distribution" 
          description="Categorization of projects by their evaluated SDG impact score"
          data={sdgImpact}
        />
      </div>

      {/* Data table — only shown when growth data exists */}
      {growthData && growthData.length > 0 && (
        <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 mt-6 bg-white dark:bg-[#1F2937]">
          <CardHeader className="bg-slate-50/50 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-800 pb-4">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-gray-100">Monthly Growth & Submissions Data</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 dark:text-gray-400 uppercase bg-white dark:bg-[#1F2937]">
                  <tr className="border-b border-slate-100 dark:border-gray-800">
                    <th className="px-6 py-4 font-medium">Month</th>
                    <th className="px-6 py-4 font-medium text-center">New Projects Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {growthData.map((data, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/30 transition-colors bg-white dark:bg-[#1F2937]">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-gray-100">{data.name}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-gray-300">
                        {data.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
