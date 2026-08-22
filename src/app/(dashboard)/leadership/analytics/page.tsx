"use client";

import { useAuthStore } from "@/store/auth-store";
import { useMemo, useState, useEffect } from "react";
import { BarChart } from "@/features/analytics/components/bar-chart";
import { LineChart } from "@/features/analytics/components/line-chart";
import { DonutChart } from "@/features/analytics/components/donut-chart";
import { PyramidChart } from "@/features/analytics/components/pyramid-chart";
import { BarChart3, TrendingUp, Target, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getSeededRandom(seed: string) {
  let h = 0;
  for(let i = 0; i < seed.length; i++) 
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  return function() {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export default function LeadershipAnalyticsPage() {
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userScope = user?.department || user?.designation || "College";
  const isDean = user?.designation?.includes("Dean") || user?.designation?.includes("Coordinator") || user?.designation?.includes("Head");

  const { growthData, fundingDistribution, sdgImpact, impactFunnel } = useMemo(() => {
    return {
      growthData: [
        { name: "Jul", value: 120 },
        { name: "Aug", value: 145 },
        { name: "Sep", value: 180 },
        { name: "Oct", value: 210 },
        { name: "Nov", value: 240 },
        { name: "Dec", value: 280 },
        { name: "Jan", value: 310 },
        { name: "Feb", value: 360 },
        { name: "Mar", value: 410 },
        { name: "Apr", value: 480 },
        { name: "May", value: 530 },
        { name: "Jun", value: 600 },
      ],
      fundingDistribution: [
        { name: "Hardware & IoT", value: 45, color: "#3B82F6" },
        { name: "Software Licenses", value: 25, color: "#8B5CF6" },
        { name: "Community Events", value: 20, color: "#10B981" },
        { name: "Research Pubs", value: 10, color: "#F59E0B" },
      ],
      sdgImpact: [
        { name: "High Impact (>8)", value: 55, color: "#10B981" },
        { name: "Medium Impact (5-8)", value: 35, color: "#3B82F6" },
        { name: "Low Impact (<5)", value: 10, color: "#94A3B8" },
      ],
      impactFunnel: [
        { name: "Students Trained", value: 1200, fill: "#3B82F6" },
        { name: "Projects Initiated", value: 450, fill: "#8B5CF6" },
        { name: "Projects Deployed", value: 120, fill: "#10B981" },
        { name: "Real-world Impact", value: 35, fill: "#F59E0B" },
      ]
    };
  }, []);

  if (!isMounted || !user) return null;

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <BarChart3 className="text-blue-600" size={32} />
            Analytics Hub
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            Deep-dive metrics and trends aggregating performance across <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{userScope}</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-sm border border-slate-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-5">
            <TrendingUp className="text-blue-500 mb-2" size={24} />
            <h3 className="text-3xl font-bold text-slate-900">+34%</h3>
            <p className="text-sm font-medium text-slate-500">YoY Project Growth</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-slate-200 bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-5">
            <Target className="text-emerald-500 mb-2" size={24} />
            <h3 className="text-3xl font-bold text-slate-900">8.4/10</h3>
            <p className="text-sm font-medium text-slate-500">Avg SDG Impact Score</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-slate-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-5">
            <Users className="text-purple-500 mb-2" size={24} />
            <h3 className="text-3xl font-bold text-slate-900">85%</h3>
            <p className="text-sm font-medium text-slate-500">Faculty Engagement</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-slate-200 bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-5">
            <BarChart3 className="text-amber-500 mb-2" size={24} />
            <h3 className="text-3xl font-bold text-slate-900">12</h3>
            <p className="text-sm font-medium text-slate-500">Active Grants/Funds</p>
          </CardContent>
        </Card>
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

      <Card className="rounded-xl shadow-sm border border-slate-200 mt-6">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg font-bold text-slate-800">Monthly Growth & Submissions Data</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-white">
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 font-medium">Month</th>
                  <th className="px-6 py-4 font-medium text-center">New Projects Submitted</th>
                  <th className="px-6 py-4 font-medium text-right">YoY Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {growthData.map((data, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors bg-white">
                    <td className="px-6 py-4 font-semibold text-slate-900">{data.name}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-700">
                      {data.value}
                    </td>
                    <td className="px-6 py-4 text-right text-emerald-600 font-medium">
                      +12.4%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
