"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Users, Search, Flame, ArrowUpRight, TrendingUp, Award, MessageSquare } from "lucide-react";
import { BackButton } from "@/components/BackButton";

const trendingTopics = [
  {
    tag: "SDG-4",
    title: "Best practices for incorporating AI scoring in primary education initiatives",
    author: "Prof. Alan Turing",
    replies: 142,
    upvotes: 890,
    hot: true
  },
  {
    tag: "API",
    title: "How to use Webhooks to trigger external Python data pipelines",
    author: "DataEngineer99",
    replies: 56,
    upvotes: 340,
    hot: false
  },
  {
    tag: "Security",
    title: "Role-Based Access Control: A deep dive into custom permissions",
    author: "SecOps_Admin",
    replies: 89,
    upvotes: 612,
    hot: true
  },
  {
    tag: "UI/UX",
    title: "Feature Request: Dark mode for the Faculty Dashboard",
    author: "DesignStudent_01",
    replies: 230,
    upvotes: 1205,
    hot: true
  }
];

const leaderBoard = [
  { rank: 1, name: "Dr. Sarah Jenkins", score: "12,450", badge: "Global Moderator" },
  { rank: 2, name: "CodeWizard_88", score: "9,820", badge: "API Expert" },
  { rank: 3, name: "Prof. H. Patel", score: "8,900", badge: "Top Contributor" }
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("trending");

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-100/60 to-purple-100/60 rounded-full blur-[100px] pointer-events-none -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-[100px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <BackButton />
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
          <Users className="w-5 h-5 text-indigo-500" />
          <span className="font-bold text-sm text-slate-800 tracking-wide">COMMUNITY HUB</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        {/* Header Hero */}
        <div className="text-center mb-16 pt-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6"
          >
            Connect with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Global Network.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10"
          >
            Join thousands of developers, researchers, and faculty members sharing insights, discussing SDG strategies, and shaping the future of Novelleyx.
          </motion.p>
          
          {/* Interactive Search */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full group-hover:bg-indigo-500/30 transition-all duration-300"></div>
            <div className="relative bg-white border border-slate-200 rounded-full flex items-center px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.1)] transition-shadow">
              <Search className="w-6 h-6 text-slate-400 mr-4 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search forums, discussions, or members..." 
                className="w-full bg-transparent border-none outline-none text-slate-800 text-lg placeholder:text-slate-400"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column - Main Embedded Data Feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-6 mb-6 border-b border-slate-200">
              <button 
                onClick={() => setActiveTab("trending")}
                className={`pb-4 font-bold text-sm transition-colors relative ${activeTab === 'trending' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4" /> Trending
                </div>
                {activeTab === 'trending' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
              </button>
              <button 
                onClick={() => setActiveTab("new")}
                className={`pb-4 font-bold text-sm transition-colors relative ${activeTab === 'new' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Latest Posts
                </div>
                {activeTab === 'new' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
              </button>
            </div>

            <div className="space-y-4">
              {trendingTopics.map((topic, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  key={idx} 
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">{topic.tag}</span>
                      {topic.hot && <span className="flex items-center gap-1 text-xs font-bold text-rose-500"><Flame className="w-3 h-3" /> HOT</span>}
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{topic.title}</h3>
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
                      <span className="font-semibold text-slate-700">{topic.author}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-400">
                      <span className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors"><MessageSquare className="w-4 h-4" /> {topic.replies}</span>
                      <span className="flex items-center gap-1.5 hover:text-rose-500 transition-colors"><Flame className="w-4 h-4" /> {topic.upvotes}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-colors bg-white/50">
              Load More Discussions
            </button>
          </div>

          {/* Right Column - Embedded Stats & Leaderboard */}
          <div className="space-y-8">
            {/* Global Stats Embed */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Award className="w-5 h-5 text-amber-400" /> Network Stats</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-indigo-200 text-sm font-semibold mb-1">Total Members</p>
                  <p className="text-3xl font-black text-white">45,291</p>
                </div>
                <div>
                  <p className="text-indigo-200 text-sm font-semibold mb-1">Active Projects</p>
                  <p className="text-3xl font-black text-white">12,045</p>
                </div>
                <div>
                  <p className="text-indigo-200 text-sm font-semibold mb-1">Resolved Queries</p>
                  <p className="text-3xl font-black text-white text-emerald-400">98.4%</p>
                </div>
              </div>
            </motion.div>

            {/* Leaderboard Embed */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">Top Contributors</h3>
              <div className="space-y-4">
                {leaderBoard.map((user) => (
                  <div key={user.rank} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 shrink-0">
                      #{user.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                      <p className="text-xs font-semibold text-indigo-500">{user.badge}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-sm">{user.score}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rep</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
