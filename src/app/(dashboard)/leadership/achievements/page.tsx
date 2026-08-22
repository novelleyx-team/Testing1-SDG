"use client";

import { useAchievementsStore } from "@/store/achievements-store";
import { Card } from "@/components/ui/card";
import { Award, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function LeadershipAchievementsEditor() {
  const { badges, updateBadge } = useAchievementsStore();

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">Achievement Branches Editor</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Modify the digital badges and assign custom EXP values to reward your students.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800/50 shadow-sm">
          <Star size={16} className="fill-blue-500 text-blue-500" />
          <span className="text-sm font-bold tracking-wide">GAMIFICATION SETTINGS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <Card key={badge.id} className="p-6 rounded-[18px] border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1F2937] shadow-sm flex flex-col relative overflow-hidden">
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${badge.bg}`}></div>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badge.bg}`}>
                <Award size={24} className={badge.color} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">{badge.title}</h3>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{badge.id}</p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="space-y-2">
                <Label htmlFor={`title-${badge.id}`} className="text-xs text-gray-500">Badge Title</Label>
                <Input 
                  id={`title-${badge.id}`} 
                  value={badge.title}
                  onChange={(e) => updateBadge(badge.id, { title: e.target.value })}
                  className="h-10 bg-gray-50 dark:bg-[#111827] border-transparent focus-visible:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`desc-${badge.id}`} className="text-xs text-gray-500">Description / Requirements</Label>
                <Textarea 
                  id={`desc-${badge.id}`} 
                  value={badge.desc}
                  onChange={(e) => updateBadge(badge.id, { desc: e.target.value })}
                  className="min-h-[80px] bg-gray-50 dark:bg-[#111827] border-transparent focus-visible:ring-blue-600 focus:bg-white resize-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`exp-${badge.id}`} className="text-xs font-bold text-emerald-600">EXP Reward</Label>
                <div className="relative">
                  <Input 
                    id={`exp-${badge.id}`} 
                    type="number"
                    value={badge.exp}
                    onChange={(e) => updateBadge(badge.id, { exp: parseInt(e.target.value) || 0 })}
                    className="h-10 pl-4 pr-12 bg-gray-50 dark:bg-[#111827] border-transparent focus-visible:ring-emerald-600 focus:bg-white font-black text-emerald-700 dark:text-emerald-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-500">EXP</span>
                </div>
              </div>
            </div>
            
          </Card>
        ))}
      </div>
    </div>
  );
}
