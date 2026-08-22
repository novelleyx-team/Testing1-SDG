"use client";

import { Card } from "@/components/ui/card";
import { Trophy, Star, TrendingUp } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Priya Sharma", id: "20R11A0505", branch: "CSE", score: 98.4, trend: "+2.1" },
  { rank: 2, name: "Rahul Verma", id: "20R11A0412", branch: "ECE", score: 95.8, trend: "+1.5" },
  { rank: 3, name: "Anita Desai", id: "20R11A0322", branch: "MECH", score: 94.2, trend: "+0.8" },
  { rank: 4, name: "Abhinav (You)", id: "20R11A0501", branch: "CSE", score: 91.5, trend: "+3.4" },
  { rank: 5, name: "Vikram Singh", id: "20R11A1204", branch: "IT", score: 89.9, trend: "-0.5" },
  { rank: 6, name: "Sneha Reddy", id: "20R11A0211", branch: "EEE", score: 88.3, trend: "+1.1" },
  { rank: 7, name: "Karan Patel", id: "20R11A0108", branch: "CIVIL", score: 87.0, trend: "+0.2" },
];

export default function LeaderboardPage() {
  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[36px] font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Trophy className="text-amber-500" size={32} /> Global Leaderboard
          </h1>
          <p className="text-gray-500 mt-1">Compare your cumulative AI SDG score against the entire college.</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm">
          <Star size={18} className="text-amber-500 fill-amber-500" /> Current Rank: 4th
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Rank 2 */}
        <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-none p-6 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden mt-8 md:mt-12 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-300"></div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center mb-3 text-2xl font-black text-gray-500 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Rahul Verma</h3>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">ECE</p>
            <div className="mt-4 bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-sm">
              95.8 pts
            </div>
          </div>
        </Card>

        {/* Rank 1 */}
        <Card className="rounded-[18px] shadow-[0_12px_40px_rgba(245,158,11,0.15)] border border-amber-200 p-6 bg-gradient-to-b from-amber-50 to-white relative overflow-hidden group z-10">
          <div className="absolute top-0 left-0 w-full h-2 bg-amber-400"></div>
          <div className="flex flex-col items-center text-center">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl"></div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-4 border-white shadow-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Trophy size={32} className="text-white fill-white" />
            </div>
            <h3 className="font-black text-gray-900 text-xl">Priya Sharma</h3>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">CSE</p>
            <div className="mt-4 bg-amber-500 text-white px-5 py-2 rounded-full text-base font-black shadow-md">
              98.4 pts
            </div>
          </div>
        </Card>

        {/* Rank 3 */}
        <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-none p-6 bg-gradient-to-b from-orange-50 to-white relative overflow-hidden mt-8 md:mt-16 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-300"></div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-orange-200 border-4 border-white shadow-md flex items-center justify-center mb-3 text-2xl font-black text-orange-600 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Anita Desai</h3>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">MECH</p>
            <div className="mt-4 bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-sm">
              94.2 pts
            </div>
          </div>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden bg-white mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-5 font-semibold text-center w-20">Rank</th>
                <th className="px-6 py-5 font-semibold">Student Name</th>
                <th className="px-6 py-5 font-semibold">Branch</th>
                <th className="px-6 py-5 font-semibold">Trend</th>
                <th className="px-6 py-5 font-semibold text-right">Total AI Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leaderboardData.slice(3).map((student) => (
                <tr key={student.id} className={`hover:bg-blue-50/30 transition-colors ${student.id === '20R11A0501' ? 'bg-blue-50/50 relative' : ''}`}>
                  {student.id === '20R11A0501' && (
                    <td className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></td>
                  )}
                  <td className="px-6 py-5 text-center">
                    <span className="font-bold text-gray-900 text-base">{student.rank}</span>
                  </td>
                  <td className="px-6 py-5">
                    <p className={`font-bold text-base ${student.id === '20R11A0501' ? 'text-blue-700' : 'text-gray-900'}`}>
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500 font-medium mt-1">{student.id}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-xs">
                      {student.branch}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`flex items-center gap-1 text-xs font-bold ${
                      student.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {student.trend.startsWith('+') ? <TrendingUp size={14} /> : null} {student.trend}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="font-black text-gray-900 text-lg">
                      {student.score}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
