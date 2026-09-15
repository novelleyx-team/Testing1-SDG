"use client";

import { useAuthStore } from "@/store/auth-store";
import { useState, useEffect } from "react";
import { BarChart } from "@/features/analytics/components/bar-chart";
import { LineChart } from "@/features/analytics/components/line-chart";
import { DonutChart } from "@/features/analytics/components/donut-chart";
import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeChartData } from "@/hooks/useRealtimeChartData";



export default function LeadershipSDGTrackingPage() {
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userScope = user?.department || user?.designation || "College";

  // Fetch all chart data from real database tables via realtime hooks
  const { data: sdgSkillAdoption } = useRealtimeChartData('leadership_sdg_skill_adoption', 'sdg', 'students');
  const { data: sdgGrowth } = useRealtimeChartData('leadership_sdg_growth', 'month', 'count');
  const { data: skillCategorySplit } = useRealtimeChartData('leadership_skill_categories', 'category', 'value');

  if (!isMounted || !user) return null;

  return (
    <div className="flex flex-col gap-8 p-6 xl:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-gray-100 flex items-center gap-3">
          <Target className="text-blue-600 dark:text-blue-500" size={32} />
          SDG Skill Tracking
        </h1>
        <p className="text-slate-500 dark:text-gray-400 max-w-3xl">
          Massive, full-width analytical view of Sustainable Development Goal (SDG) skill adoption and growth across <span className="font-semibold text-slate-700 dark:text-gray-200 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{userScope}</span>.
        </p>
      </div>

      <div className="flex flex-col gap-10 mt-4">
        {/* Full-width Bar Chart for Detailed SDG Skill breakdown */}
        <div className="w-full">
          <BarChart 
            title="Total Students Certified per SDG Skill" 
            description={`Comprehensive breakdown of the most targeted SDGs across ${userScope}`}
            data={sdgSkillAdoption}
          />
        </div>

        {/* Full-width Line Chart for Growth Tracking */}
        <div className="w-full">
          <LineChart 
            title="SDG Skill Acquisition Growth" 
            description="Tracking the cumulative month-over-month growth of certified SDG skills"
            data={sdgGrowth}
            color="#8B5CF6"
          />
        </div>

        {/* Full-width Donut Chart for Categories */}
        <div className="w-full max-w-4xl mx-auto">
          <DonutChart 
            title="SDG Skill Category Distribution" 
            description="How students are applying their SDG knowledge"
            data={skillCategorySplit}
          />
        </div>
      </div>

      {/* Raw Metrics Table — only shown when data exists */}
      {sdgSkillAdoption && sdgSkillAdoption.length > 0 && (
        <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 mt-6 bg-white dark:bg-[#1F2937]">
          <CardHeader className="bg-slate-50/50 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-800 pb-4">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-gray-100">Raw SDG Metrics Data</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 dark:text-gray-400 uppercase bg-white dark:bg-[#1F2937]">
                  <tr className="border-b border-slate-100 dark:border-gray-800">
                    <th className="px-6 py-4 font-medium">SDG Category</th>
                    <th className="px-6 py-4 font-medium text-center">Certified Students</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {sdgSkillAdoption.map((sdg, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/30 transition-colors bg-white dark:bg-[#1F2937]">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-gray-100 flex items-center gap-2">
                          {sdg.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-gray-300">
                        {sdg.value}
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
