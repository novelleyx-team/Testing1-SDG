"use client";

import { Card } from "@/components/ui/card";
import { BrainCircuit, Activity, Target, Zap, ArrowUpRight } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useProjectsStore } from "@/store/projects-store";
import { useEffect, useState } from "react";

interface AnalysisData {
  overallScore: number | null;
  keywordsMatched: number;
  submissionCount: number;
  topSdg: string | null;
  topSdgName: string | null;
  alignments: { label: string; sdg: string; percent: number }[];
  insights: { title: string; description: string; type: "blue" | "emerald" | "purple" }[];
}

export default function AIAnalysisPage() {
  const { user } = useAuthStore();
  const allProjects = useProjectsStore(state => state.projects);
  const { fetchStudentProjects } = useProjectsStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchStudentProjects(user.id).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.id, fetchStudentProjects]);

  const studentProjects = user ? allProjects.filter(p => p.studentId === user.id) : [];

  // Derive analysis data from actual projects
  const analysisData: AnalysisData = (() => {
    if (studentProjects.length === 0) {
      return {
        overallScore: null,
        keywordsMatched: 0,
        submissionCount: 0,
        topSdg: null,
        topSdgName: null,
        alignments: [],
        insights: [],
      };
    }

    // Calculate average AI score from projects that have one
    const projectsWithScores = studentProjects.filter(p => p.aiScore && p.aiScore !== "N/A");
    const scores = projectsWithScores.map(p => {
      const scoreStr = p.aiScore.split("/")[0];
      return parseFloat(scoreStr) || 0;
    });
    const overallScore = scores.length > 0 ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : null;

    // Count SDG occurrences to find top alignment
    const sdgCounts: Record<string, number> = {};
    studentProjects.forEach(p => {
      if (p.targetSdg && p.targetSdg !== "N/A") {
        sdgCounts[p.targetSdg] = (sdgCounts[p.targetSdg] || 0) + 1;
      }
    });

    const sdgEntries = Object.entries(sdgCounts).sort((a, b) => b[1] - a[1]);
    const topSdg = sdgEntries.length > 0 ? sdgEntries[0][0] : null;

    // SDG name mapping
    const sdgNames: Record<string, string> = {
      "SDG 1": "No Poverty", "SDG 2": "Zero Hunger", "SDG 3": "Good Health & Well-being",
      "SDG 4": "Quality Education", "SDG 5": "Gender Equality", "SDG 6": "Clean Water & Sanitation",
      "SDG 7": "Affordable & Clean Energy", "SDG 8": "Decent Work & Economic Growth",
      "SDG 9": "Industry, Innovation & Infrastructure", "SDG 10": "Reduced Inequalities",
      "SDG 11": "Sustainable Cities & Communities", "SDG 12": "Responsible Consumption & Production",
      "SDG 13": "Climate Action", "SDG 14": "Life Below Water", "SDG 15": "Life on Land",
      "SDG 16": "Peace, Justice & Strong Institutions", "SDG 17": "Partnerships for the Goals",
    };

    const topSdgName = topSdg ? sdgNames[topSdg] || null : null;

    // Build alignment bars from SDG distribution (percentage of total projects)
    const totalProjectsCount = studentProjects.length;
    const alignments = sdgEntries.slice(0, 4).map(([sdg, count]) => ({
      label: `${sdgNames[sdg] || sdg} (${sdg})`,
      sdg,
      percent: Math.round((count / totalProjectsCount) * 100),
    }));

    // Keywords matched — sum from sdgScores or count of tech stack keywords
    let keywordsMatched = 0;
    studentProjects.forEach(p => {
      if (p.techStack) {
        keywordsMatched += p.techStack.split(",").filter(k => k.trim()).length;
      }
    });

    return {
      overallScore,
      keywordsMatched,
      submissionCount: studentProjects.length,
      topSdg,
      topSdgName,
      alignments,
      insights: [], // Insights would come from actual AI analysis results
    };
  })();

  const hasAnalysis = studentProjects.length > 0;
  const alignmentColors = ["text-blue-600 dark:text-blue-400", "text-emerald-600 dark:text-emerald-400", "text-amber-600 dark:text-amber-400", "text-purple-600 dark:text-purple-400"];
  const alignmentBarColors = ["bg-blue-600", "bg-emerald-500", "bg-amber-500", "bg-purple-500"];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
        <div className="flex flex-col items-center justify-center py-20">
          <BrainCircuit size={48} className="text-purple-400 animate-pulse mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading analysis data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
        <div className="flex flex-col items-center justify-center py-20">
          <BrainCircuit size={48} className="text-red-400 mb-4" />
          <p className="text-gray-900 dark:text-gray-100 font-bold text-lg mb-2">Unable to load analysis data</p>
          <p className="text-gray-500 dark:text-gray-400">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">AI Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Deep-dive metrics, keyword frequency, and actionable insights.</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full border border-purple-100 dark:border-purple-800">
          <BrainCircuit size={18} className={hasAnalysis ? "animate-pulse" : ""} />
          <span className="text-sm font-bold tracking-wide">{hasAnalysis ? "AI ENGINE ACTIVE" : "AWAITING DATA"}</span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[18px] shadow-sm border border-gray-100 dark:border-gray-800 p-6 bg-white dark:bg-[#1F2937] flex items-start justify-between group">
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Overall SDG Score</p>
            {analysisData.overallScore !== null ? (
              <>
                <h2 className="text-4xl font-black text-gray-900 dark:text-gray-100">{analysisData.overallScore}<span className="text-xl text-gray-400 font-bold">/10</span></h2>
                <p className="text-emerald-500 text-sm font-semibold mt-2 flex items-center gap-1">
                  <ArrowUpRight size={14} /> Based on {analysisData.submissionCount} submission{analysisData.submissionCount !== 1 ? "s" : ""}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-400 dark:text-gray-500 mt-1">No analysis available</h2>
                <p className="text-gray-400 text-sm font-medium mt-2">Submit a project to begin</p>
              </>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Target className="text-emerald-500 dark:text-emerald-400" size={24} />
          </div>
        </Card>
        
        <Card className="rounded-[18px] shadow-sm border border-gray-100 dark:border-gray-800 p-6 bg-white dark:bg-[#1F2937] flex items-start justify-between group">
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Keywords Matched</p>
            {hasAnalysis ? (
              <>
                <h2 className="text-4xl font-black text-gray-900 dark:text-gray-100">{analysisData.keywordsMatched}</h2>
                <p className="text-blue-500 text-sm font-semibold mt-2 flex items-center gap-1">
                  Across {analysisData.submissionCount} submission{analysisData.submissionCount !== 1 ? "s" : ""}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-400 dark:text-gray-500 mt-1">No submissions</h2>
                <p className="text-gray-400 text-sm font-medium mt-2">Keywords tracked from tech stack</p>
              </>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="text-blue-500 dark:text-blue-400" size={24} />
          </div>
        </Card>

        <Card className="rounded-[18px] shadow-sm border border-gray-100 dark:border-gray-800 p-6 bg-white dark:bg-[#1F2937] flex items-start justify-between group">
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Top Alignment</p>
            {analysisData.topSdg ? (
              <>
                <h2 className="text-4xl font-black text-blue-600 dark:text-blue-400">{analysisData.topSdg}</h2>
                <p className="text-gray-500 text-sm font-semibold mt-2">{analysisData.topSdgName}</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-400 dark:text-gray-500 mt-1">No alignment data</h2>
                <p className="text-gray-400 text-sm font-medium mt-2">Submit a project to analyze</p>
              </>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Zap className="text-purple-500 dark:text-purple-400" size={24} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Keyword Frequency Breakdown */}
        <Card className="rounded-[18px] shadow-sm border border-gray-100 dark:border-gray-800 p-8 bg-white dark:bg-[#1F2937]">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Master Dictionary Alignment</h3>
          {analysisData.alignments.length > 0 ? (
            <div className="space-y-6">
              {analysisData.alignments.map((alignment, i) => (
                <div key={alignment.sdg}>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-gray-700 dark:text-gray-300">{alignment.label}</span>
                    <span className={alignmentColors[i % alignmentColors.length]}>{alignment.percent}% Match</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${alignmentBarColors[i % alignmentBarColors.length]} rounded-full`} style={{ width: `${alignment.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Target size={40} className="text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No alignment data available</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Submit a project to begin SDG alignment analysis.</p>
            </div>
          )}
        </Card>

        {/* Actionable Insights */}
        <Card className="rounded-[18px] shadow-sm border border-gray-100 dark:border-gray-800 p-8 bg-white dark:bg-[#1F2937]">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Actionable Insights</h3>
          {hasAnalysis ? (
            <div className="space-y-4">
              {analysisData.insights.length > 0 ? (
                analysisData.insights.map((insight, i) => {
                  const colorMap = {
                    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-100 dark:border-blue-900/50", icon: "bg-blue-100 dark:bg-blue-900/50", iconText: "text-blue-600 dark:text-blue-400" },
                    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-900/50", icon: "bg-emerald-100 dark:bg-emerald-900/50", iconText: "text-emerald-600 dark:text-emerald-400" },
                    purple: { bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-100 dark:border-purple-900/50", icon: "bg-purple-100 dark:bg-purple-900/50", iconText: "text-purple-600 dark:text-purple-400" },
                  };
                  const colors = colorMap[insight.type];
                  const IconComponent = insight.type === "blue" ? Zap : insight.type === "emerald" ? Target : BrainCircuit;
                  return (
                    <div key={i} className={`p-4 rounded-xl ${colors.bg} border ${colors.border} flex gap-4`}>
                      <div className={`w-10 h-10 rounded-full ${colors.icon} flex items-center justify-center shrink-0`}>
                        <IconComponent size={20} className={colors.iconText} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{insight.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BrainCircuit size={40} className="text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">AI insights not yet generated</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Insights will be generated when AI analysis is run on your submissions.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Zap size={40} className="text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No insights available</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Submit projects to receive AI-powered insights and recommendations.</p>
            </div>
          )}
        </Card>
      </div>

    </div>
  );
}
