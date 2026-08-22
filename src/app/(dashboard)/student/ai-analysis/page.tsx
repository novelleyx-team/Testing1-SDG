"use client";

import { Card } from "@/components/ui/card";
import { BrainCircuit, Activity, Target, Zap, ArrowUpRight } from "lucide-react";

export default function AIAnalysisPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">AI Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Deep-dive metrics, keyword frequency, and actionable insights.</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full border border-purple-100 dark:border-purple-800">
          <BrainCircuit size={18} className="animate-pulse" />
          <span className="text-sm font-bold tracking-wide">AI ENGINE ACTIVE</span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[18px] shadow-sm border border-gray-100 dark:border-gray-800 p-6 bg-white dark:bg-[#1F2937] flex items-start justify-between group">
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Overall SDG Score</p>
            <h2 className="text-4xl font-black text-gray-900 dark:text-gray-100">8.9<span className="text-xl text-gray-400 font-bold">/10</span></h2>
            <p className="text-emerald-500 text-sm font-semibold mt-2 flex items-center gap-1"><ArrowUpRight size={14} /> +1.2 from last month</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Target className="text-emerald-500 dark:text-emerald-400" size={24} />
          </div>
        </Card>
        
        <Card className="rounded-[18px] shadow-sm border border-gray-100 dark:border-gray-800 p-6 bg-white dark:bg-[#1F2937] flex items-start justify-between group">
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Keywords Matched</p>
            <h2 className="text-4xl font-black text-gray-900 dark:text-gray-100">142</h2>
            <p className="text-blue-500 text-sm font-semibold mt-2 flex items-center gap-1">Across 4 submissions</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="text-blue-500 dark:text-blue-400" size={24} />
          </div>
        </Card>

        <Card className="rounded-[18px] shadow-sm border border-gray-100 dark:border-gray-800 p-6 bg-white dark:bg-[#1F2937] flex items-start justify-between group">
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Top Alignment</p>
            <h2 className="text-4xl font-black text-blue-600 dark:text-blue-400">SDG 6</h2>
            <p className="text-gray-500 text-sm font-semibold mt-2">Clean Water & Sanitation</p>
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
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-700 dark:text-gray-300">Wastewater Treatment (SDG 6)</span>
                <span className="text-blue-600 dark:text-blue-400">92% Match</span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-700 dark:text-gray-300">Renewable Grid Tech (SDG 7)</span>
                <span className="text-emerald-600 dark:text-emerald-400">78% Match</span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-700 dark:text-gray-300">Urban Agriculture (SDG 11)</span>
                <span className="text-amber-600 dark:text-amber-400">65% Match</span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-700 dark:text-gray-300">Carbon Capture (SDG 13)</span>
                <span className="text-purple-600 dark:text-purple-400">42% Match</span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Actionable Insights */}
        <Card className="rounded-[18px] shadow-sm border border-gray-100 dark:border-gray-800 p-8 bg-white dark:bg-[#1F2937]">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Actionable Insights</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                <Zap size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Diversify SDG Targets</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">Your projects heavily index on SDG 6. Consider integrating aspects of SDG 12 (Responsible Consumption) to boost your interdisciplinary score.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                <Target size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Keyword Optimization</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">Your last abstract missed key engineering terms from the master dictionary. Use terms like &quot;IoT&quot;, &quot;Sensors&quot;, and &quot;Data Logging&quot; to increase AI detection.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/50 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
                <BrainCircuit size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Formatting Excellence</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">Your report structure matches the Dean&apos;s templates perfectly. Continue using the standard formatting for fast faculty approvals.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
