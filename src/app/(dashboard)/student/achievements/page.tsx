"use client";

import { Card } from "@/components/ui/card";
import { Award, Lock, Star } from "lucide-react";
import { useProjectsStore, type Project } from "@/store/projects-store";
import { useAuthStore } from "@/store/auth-store";

import { useAchievementsStore } from "@/store/achievements-store";

export default function AchievementsPage() {
  const { user } = useAuthStore();
  const getStudentProjects = useProjectsStore(state => state.getStudentProjects);
  const projects = user ? getStudentProjects(user.id) : [];
  const globalBadges = useAchievementsStore(state => state.badges);

  const dynamicBadges = projects.flatMap((project: Project) => {
    const badges = [];
    
    // Submission Achievement
    badges.push({
      id: `dyn-sub-${project.id}`,
      title: `Submitted: ${project.title.length > 15 ? project.title.slice(0, 15) + '...' : project.title}`,
      desc: `Successfully submitted the project: ${project.title}`,
      unlocked: true,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/30",
      border: "border-blue-200 dark:border-blue-800"
    });

    // Win Achievement
    const isWin = project.status === 'Approved' || 
                  (project.marksAssigned && parseInt(project.marksAssigned) >= 80) || 
                  (project.aiScore && parseInt(project.aiScore.split('/')[0]) >= 80);
    
    if (isWin) {
      badges.push({
        id: `dyn-win-${project.id}`,
        title: `Victory: ${project.title.length > 15 ? project.title.slice(0, 15) + '...' : project.title}`,
        desc: `Achieved a major win with high scores or approval for ${project.title}.`,
        unlocked: true,
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-900/30",
        border: "border-amber-200 dark:border-amber-800"
      });
    }

    return badges;
  });

  const allBadges = [...dynamicBadges, ...globalBadges];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">Achievements</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Unlock digital badges by submitting high-quality SDG proposals.</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 px-4 py-2 rounded-full border border-yellow-200 dark:border-yellow-800/50 shadow-sm">
          <Star size={16} className="fill-yellow-500" />
          <span className="text-sm font-bold tracking-wide">LEVEL 4 SCHOLAR</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allBadges.map((badge: Record<string, unknown>) => (
          <Card 
            key={badge.id} 
            className={`rounded-[18px] p-6 border transition-all duration-0 relative overflow-hidden flex flex-col items-center text-center ${
              badge.unlocked 
                ? `bg-white dark:bg-[#1F2937] shadow-sm hover:shadow-md ${badge.border}` 
                : 'bg-gray-50/80 dark:bg-[#111827]/80 border-gray-200 dark:border-gray-800 opacity-70 grayscale-[50%]'
            }`}
          >
            {/* Background Glow for Unlocked */}
            {badge.unlocked && (
              <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30 ${badge.bg}`}></div>
            )}

            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 relative z-10 ${badge.unlocked ? badge.bg : 'bg-gray-200 dark:bg-gray-800'}`}>
              {badge.unlocked ? (
                <Award size={36} className={badge.color} />
              ) : (
                <Lock size={32} className="text-gray-400 dark:text-gray-500" />
              )}
            </div>

            <h3 className={`text-lg font-bold mb-2 relative z-10 ${badge.unlocked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
              {badge.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 relative z-10 leading-relaxed">
              {badge.desc}
            </p>

            {/* Progress Bar for Locked Badges */}
            {!badge.unlocked && badge.progress !== undefined && (
              <div className="w-full mt-auto relative z-10">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">
                  <span>Progress</span>
                  <span>{badge.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400 dark:bg-gray-500 rounded-full" style={{ width: `${badge.progress}%` }}></div>
                </div>
              </div>
            )}
            
            {badge.unlocked && badge.exp && (
              <div className="mt-2 relative z-10">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                  +{badge.exp} EXP
                </span>
              </div>
            )}
            
            {badge.unlocked && (
              <div className="mt-auto pt-2 relative z-10">
                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${badge.bg} ${badge.color}`}>
                  Unlocked
                </span>
              </div>
            )}
          </Card>
        ))}
      </div>

    </div>
  );
}
