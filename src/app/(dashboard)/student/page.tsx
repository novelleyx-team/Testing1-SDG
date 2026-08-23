"use client";

import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, Brain, Clock, Folder, CheckCircle2, 
  Droplets, Zap, Leaf, Building2, Lightbulb
} from "lucide-react";
import { DonutChart } from "@/features/analytics/components/donut-chart";
import { LineChart } from "@/features/analytics/components/line-chart";
import { useRealtimeChartData } from "@/hooks/useRealtimeChartData";

import { useProjectsStore } from "@/store/projects-store";
import { EmptyState } from "@/components/EmptyState";
import { useEffect } from "react";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { projects, fetchStudentProjects } = useProjectsStore();
  
  useEffect(() => {
    if (user?.id) {
      fetchStudentProjects(user.id);
    }
  }, [user?.id, fetchStudentProjects]);

  const studentProjects = projects.filter(p => p.studentId === user?.id);
  const { data: sdgData } = useRealtimeChartData('student_sdg_distribution', 'sdg', 'count');
  const { data: scoreTrendData } = useRealtimeChartData('student_score_trend', 'month', 'score');

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-0">
      {/* 1. Welcome Banner */}
      <section className="bg-white rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-110"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-[40px] font-bold text-gray-900 tracking-tight leading-tight">
              Good Afternoon, {user?.name.split(' ')[0] || 'Abhinav'} 👋
            </h1>
            <p className="text-[16px] text-gray-500 mt-2 max-w-xl leading-relaxed">
              Track your SDG submissions, AI-generated reports, faculty reviews, and personal SDG impact analysis.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-gray-50/80 backdrop-blur-sm p-4 rounded-[16px] border border-gray-100">
            <div className="text-center px-4 border-r border-gray-200">
              <p className="text-2xl font-bold text-gray-900">4</p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</p>
            </div>
            <div className="text-center px-4 border-r border-gray-200">
              <p className="text-2xl font-bold text-blue-600">8.4</p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</p>
            </div>
            <div className="text-center px-4">
              <p className="text-2xl font-bold text-amber-600">2</p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistic Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-none p-6 transition-all duration-0 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Folder size={16} /> Projects Submitted
              </p>
              <h3 className="text-[36px] font-bold text-gray-900 mt-2">{studentProjects.length < 10 ? `0${studentProjects.length}` : studentProjects.length}</h3>
            </div>
            <div className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">
              Total Count
            </div>
          </div>
          <div className="mt-6">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-[70%] transition-all duration-0"></div>
            </div>
          </div>
        </Card>

        {/* Card 2 */}
        <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-none p-6 transition-all duration-0 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Brain size={16} /> AI SDG Score
              </p>
              <h3 className="text-[36px] font-bold text-gray-900 mt-2 flex items-baseline gap-2">
                {studentProjects.length > 0 ? (studentProjects.reduce((acc, p) => acc + (parseFloat(p.aiScore) || 0), 0) / studentProjects.length).toFixed(1) : "0.0"} <span className="text-sm font-normal text-gray-400">/ 10</span>
              </h3>
            </div>
            <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">
              {studentProjects.length > 0 ? "Analyzed" : "N/A"}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full bg-indigo-600 rounded-full transition-all duration-0`} style={{width: `${studentProjects.length > 0 ? (studentProjects.reduce((acc, p) => acc + (parseFloat(p.aiScore) || 0), 0) / studentProjects.length) * 10 : 0}%`}}></div>
            </div>
            <span className="text-xs font-bold text-indigo-600">
              {studentProjects.length > 0 ? ((studentProjects.reduce((acc, p) => acc + (parseFloat(p.aiScore) || 0), 0) / studentProjects.length) * 10).toFixed(0) : "0"}%
            </span>
          </div>
        </Card>

        {/* Card 3 */}
        <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-none p-6 bg-gradient-to-br from-white to-orange-50/30 transition-all duration-0 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <Clock size={16} /> Upcoming Deadlines
              </p>
              <h3 className="text-[36px] font-bold text-gray-900 mt-2">0</h3>
            </div>
          </div>
          <div className="mt-5 bg-orange-100/50 rounded-xl p-3 border border-orange-100">
            <p className="text-xs font-semibold text-orange-800 flex justify-between">
              <span>No Upcoming Deadlines</span>
              <span>--</span>
            </p>
            <div className="mt-2 h-1.5 w-full bg-orange-200/50 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full w-[30%] animate-pulse"></div>
            </div>
          </div>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: AI Suggestions & Projects */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Suggestions Card */}
          {studentProjects.length > 0 ? (
            <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(37,99,235,0.06)] border border-blue-100 p-8 bg-gradient-to-br from-white to-blue-50/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md">
                  <Lightbulb size={20} />
                </div>
                <h3 className="text-[18px] font-bold text-gray-900 dark:text-gray-100">Today&apos;s AI Suggestions</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-green-500 mt-0.5 shrink-0" size={18} />
                  <p className="text-[15px] text-gray-700">Your latest abstract could better align with <strong className="text-gray-900">SDG 13 (Climate Action)</strong> by focusing on mitigation strategies.</p>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-green-500 mt-0.5 shrink-0" size={18} />
                  <div className="text-[15px] text-gray-700">
                    Add these high-impact keywords to your submission:
                    <div className="flex gap-2 mt-3">
                      <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 shadow-sm">Renewable Energy</span>
                      <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 shadow-sm">Carbon Emission</span>
                      <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 shadow-sm">Sustainability</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-blue-100/60 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Estimated Score Improvement</p>
                  <p className="text-2xl font-black text-green-600 mt-1">+0.7 pts</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-6 font-semibold shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 group">
                  Improve Project <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(37,99,235,0.06)] border border-blue-100 p-8 bg-gradient-to-br from-white to-blue-50/30 text-center">
              <div className="p-4 bg-blue-100/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="text-blue-600" size={32} />
              </div>
              <h3 className="text-[18px] font-bold text-gray-900 dark:text-gray-100 mb-2">No AI Suggestions Yet</h3>
              <p className="text-gray-500">Submit your first project to receive personalized AI recommendations and score improvements.</p>
            </Card>
          )}

          {/* Recent Projects */}
          <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-none p-0 overflow-hidden">
            <div className="p-8 pb-4 flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-gray-900">Recent Projects</h3>
              <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 font-semibold rounded-xl">View All</Button>
            </div>
            <div className="divide-y divide-gray-50">
              {studentProjects.length === 0 ? (
                <EmptyState title="No Projects Found" description="You haven't submitted any projects yet." />
              ) : (
                studentProjects.slice(0, 3).map((project) => (
                  <div key={project.id} className="p-8 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold border border-blue-100">
                            <Droplets size={12} /> {project.targetSdg}
                          </div>
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            <CheckCircle2 size={12} /> {project.status}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h4>
                        <p className="text-sm text-gray-500 font-medium">Updated {project.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm inline-block">
                          AI Score: {project.aiScore}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Charts, Activity, Templates */}
        <div className="space-y-8">
          
          {/* Charts Card */}
          <div className="space-y-6">
            <DonutChart 
              title="SDG Distribution" 
              description="Breakdown of SDGs targeted by your projects."
              data={sdgData}
            />
            
            <LineChart 
              title="AI Score Trend" 
              description="Your project evaluation scores over time."
              data={scoreTrendData}
              color="#2563EB"
            />
          </div>

          {/* Activity Timeline */}
          <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-none p-8">
            <h3 className="text-[18px] font-bold text-gray-900 mb-6">Recent Activity</h3>
            {studentProjects.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No activity yet. Submit a project to start tracking!</p>
            ) : (
              <div className="relative pl-3 space-y-6 before:absolute before:inset-0 before:ml-[17px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:to-transparent">
                <div className="relative flex items-start gap-4">
                  <div className="absolute left-0 -ml-[5px] mt-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 shadow-sm z-10"></div>
                  <div className="ml-5">
                    <p className="text-[14px] font-bold text-gray-900">Project Submitted</p>
                    <p className="text-[12px] font-medium text-gray-500 mt-0.5">Recently</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Templates Request */}
          <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-none p-8 bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h3 className="text-[18px] font-bold text-white mb-2 relative z-10">Quick Templates</h3>
            <p className="text-sm text-gray-400 mb-6 relative z-10">Start your next submission instantly.</p>
            <div className="space-y-3 relative z-10">
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/5 group">
                <span className="text-sm font-semibold flex items-center gap-2"><Leaf size={16} /> Standard SDG Report</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/5 group">
                <span className="text-sm font-semibold flex items-center gap-2"><Building2 size={16} /> Campus Impact Study</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
