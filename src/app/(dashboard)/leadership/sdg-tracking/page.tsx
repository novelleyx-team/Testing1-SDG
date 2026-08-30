"use client";

import { useAuthStore } from "@/store/auth-store";
import { useMemo, useState, useEffect } from "react";
import { BarChart } from "@/features/analytics/components/bar-chart";
import { LineChart } from "@/features/analytics/components/line-chart";
import { DonutChart } from "@/features/analytics/components/donut-chart";
import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



export default function LeadershipSDGTrackingPage() {
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userScope = user?.department || user?.designation || "College";


  const { sdgSkillAdoption, sdgGrowth, skillCategorySplit } = useMemo(() => {
    return {
      sdgSkillAdoption: [
        { name: "SDG 1: No Poverty", value: 120, color: "#E5243B" },
        { name: "SDG 3: Good Health", value: 340, color: "#4C9F38" },
        { name: "SDG 4: Quality Ed", value: 580, color: "#C5192D" },
        { name: "SDG 5: Gender Eq", value: 210, color: "#FF3A21" },
        { name: "SDG 7: Clean Energy", value: 430, color: "#FCC30B" },
        { name: "SDG 9: Industry", value: 650, color: "#FD6925" },
        { name: "SDG 11: Cities", value: 520, color: "#FD9D24" },
        { name: "SDG 13: Climate", value: 610, color: "#3F7E44" },
      ].sort((a, b) => b.value - a.value),
      
      sdgGrowth: [
        { name: "Nov", value: 150 },
        { name: "Dec", value: 280 },
        { name: "Jan", value: 420 },
        { name: "Feb", value: 590 },
        { name: "Mar", value: 750 },
        { name: "Apr", value: 910 },
        { name: "May", value: 1100 },
        { name: "Jun", value: 1350 },
      ],

      skillCategorySplit: [
        { name: "Technical Implementation", value: 850, color: "#2563EB" },
        { name: "Policy & Research", value: 420, color: "#7C3AED" },
        { name: "Community Outreach", value: 310, color: "#10B981" },
        { name: "Data & Analytics", value: 560, color: "#F59E0B" },
      ]
    };
  }, []);

  if (!isMounted || !user) return null;

  return (
    <div className="flex flex-col gap-8 p-6 xl:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <Target className="text-blue-600" size={32} />
          SDG Skill Tracking
        </h1>
        <p className="text-slate-500 max-w-3xl">
          Massive, full-width analytical view of Sustainable Development Goal (SDG) skill adoption and growth across <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{userScope}</span>.
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
            title="SDG Skill Acquisition Growth (8 Months)" 
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

      <Card className="rounded-xl shadow-sm border border-slate-200 mt-6">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg font-bold text-slate-800">Raw SDG Metrics Data</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-white">
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 font-medium">SDG Category</th>
                  <th className="px-6 py-4 font-medium text-center">Certified Students</th>
                  <th className="px-6 py-4 font-medium text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sdgSkillAdoption.map((sdg, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors bg-white">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sdg.color }}></div>
                        {sdg.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-700">
                      {sdg.value}
                    </td>
                    <td className="px-6 py-4 text-right text-emerald-600 font-medium">
                      +8.5%
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
