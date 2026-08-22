"use client";

import React, { useMemo } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, Users, Target, UserCircle, CheckCircle2 } from "lucide-react";
import { BarChart } from "@/features/analytics/components/bar-chart";
import { DonutChart } from "@/features/analytics/components/donut-chart";
import { LineChart } from "@/features/analytics/components/line-chart";
import { PREDEFINED_USERS } from "@/lib/constants/predefined-users";

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

export default function LeadershipDepartmentsPage() {
  const { user } = useAuthStore();
  const isDean = user?.designation?.includes("Dean") || user?.designation?.includes("Coordinator") || user?.designation?.includes("Head");
  const userScope = user?.department || "Department";

  const hodUsers = useMemo(() => PREDEFINED_USERS.filter(u => u.designation === "HOD"), []);

  const departments = useMemo(() => {
    let targetHods = hodUsers;
    if (!isDean) {
      targetHods = targetHods.filter(h => h.department === user?.department);
    }

    return targetHods.map(hod => {
      const seededRand = getSeededRandom(hod.department || "unknown");
      const activeProjects = Math.floor(seededRand() * 120) + 30;
      const completedProjects = Math.floor(activeProjects * (0.3 + seededRand() * 0.4));
      const facultyCount = Math.floor(seededRand() * 20) + 10;
      const sdgScore = (seededRand() * 3 + 6.5).toFixed(1);

      return {
        name: hod.department || "Unknown",
        hodName: hod.name,
        activeProjects,
        completedProjects,
        facultyCount,
        sdgScore
      };
    }).sort((a, b) => b.activeProjects - a.activeProjects);
  }, [hodUsers, isDean, user?.department]);

  const chartData = useMemo(() => {
    return departments.map(d => ({
      name: d.name.length > 15 ? d.name.substring(0, 12) + "..." : d.name,
      value: d.activeProjects,
      color: "#3B82F6"
    }));
  }, [departments]);

  // HOD specific data
  const { hodKpis, hodYearDistribution, hodMonthlySubmissions } = useMemo(() => {
    if (isDean) return { hodKpis: null, hodYearDistribution: [], hodMonthlySubmissions: [] };
    
    const seededRand = getSeededRandom(userScope + "hod_view");
    const total = Math.floor(seededRand() * 100) + 40;
    
    return {
      hodKpis: {
        active: Math.floor(total * 0.4),
        completed: Math.floor(total * 0.4),
        faculty: Math.floor(seededRand() * 15) + 5,
        sdgAvg: (seededRand() * 2 + 7).toFixed(1)
      },
      hodYearDistribution: [
        { name: "1st Year", value: Math.floor(seededRand() * 20) + 10, color: "#3B82F6" },
        { name: "2nd Year", value: Math.floor(seededRand() * 30) + 15, color: "#8B5CF6" },
        { name: "3rd Year", value: Math.floor(seededRand() * 40) + 20, color: "#10B981" },
        { name: "4th Year", value: Math.floor(seededRand() * 30) + 10, color: "#F59E0B" },
      ],
      hodMonthlySubmissions: Array.from({ length: 6 }).map((_, i) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        return { name: months[i], value: Math.floor(seededRand() * 15) + 5 };
      })
    };
  }, [isDean, userScope]);

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Building2 className="text-blue-600" size={32} />
            {isDean ? "Departments Overview" : `${userScope} Overview`}
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            {isDean 
              ? "Compare performance, project volume, and SDG impact across all academic departments." 
              : `Deep-dive analytics and progress metrics specifically for the ${userScope} department.`}
          </p>
        </div>
      </div>

      {!isDean && hodKpis ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="rounded-xl shadow-sm border border-slate-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><TrendingUp size={24} /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Active Projects</p>
                  <h3 className="text-2xl font-bold text-slate-900">{hodKpis.active}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-sm border border-slate-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle2 size={24} /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Completed</p>
                  <h3 className="text-2xl font-bold text-slate-900">{hodKpis.completed}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-sm border border-slate-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Users size={24} /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Faculty</p>
                  <h3 className="text-2xl font-bold text-slate-900">{hodKpis.faculty}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-sm border border-slate-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Target size={24} /></div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Avg SDG Score</p>
                  <h3 className="text-2xl font-bold text-slate-900">{hodKpis.sdgAvg}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <LineChart 
              title="Department Submission Velocity" 
              description="Project proposals submitted over the last 6 months"
              data={hodMonthlySubmissions}
              color="#3B82F6"
            />
            <DonutChart 
              title="Projects by Academic Year" 
              description="Distribution of active projects across student years"
              data={hodYearDistribution}
            />
          </div>
        </>
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full rounded-xl shadow-sm border border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-800">Department Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-white">
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-4 font-medium">Department</th>
                      <th className="px-6 py-4 font-medium">Head of Department</th>
                      <th className="px-6 py-4 font-medium text-center">Faculty</th>
                      <th className="px-6 py-4 font-medium text-center">Active Projects</th>
                      <th className="px-6 py-4 font-medium text-center">Completed</th>
                      <th className="px-6 py-4 font-medium text-center">Avg SDG Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {departments.map((dept, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors bg-white">
                        <td className="px-6 py-4 font-semibold text-slate-900">{dept.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <UserCircle size={16} className="text-slate-400" />
                            {dept.hodName}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                            <Users size={14} className="text-slate-400" />
                            {dept.facultyCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1.5 text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                            <TrendingUp size={14} />
                            {dept.activeProjects}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-emerald-600 font-semibold">{dept.completedProjects}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1.5 text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-full">
                            <Target size={14} />
                            {dept.sdgScore} / 10
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <BarChart 
            title="Projects Volume by Department" 
            description="Total active projects currently ongoing"
            data={chartData}
          />
        </div>
      </div>
      )}
    </div>
  );
}
