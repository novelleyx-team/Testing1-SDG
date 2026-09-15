"use client";

import { Card } from "@/components/ui/card";
import { Trophy, Star, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";

interface LeaderboardEntry {
  rank: number;
  name: string;
  id: string;
  department: string;
  score: number;
  trend: string;
}

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Attempt to fetch leaderboard data from API
    fetch('/api/analytics/leaderboard')
      .then(res => {
        if (!res.ok) throw new Error('Not available');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLeaderboardData(data);
        }
        setLoading(false);
      })
      .catch(() => {
        // No leaderboard API exists yet — show empty state
        setLoading(false);
      });
  }, []);

  const currentUserRank = leaderboardData.find(entry => entry.id === user?.id);
  const hasData = leaderboardData.length >= 3;
  const top3 = hasData ? leaderboardData.slice(0, 3) : [];
  const remaining = hasData ? leaderboardData.slice(3) : [];

  if (loading) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in duration-0">
        <div className="flex flex-col items-center justify-center py-20">
          <Trophy size={48} className="text-amber-400 animate-pulse mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in duration-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
              <Trophy className="text-amber-500" size={32} /> Global Leaderboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Compare your cumulative AI SDG score against the entire college.</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm">
            <Star size={18} className="text-gray-400" /> Current Rank: N/A
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-6">
            <Users size={40} className="text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Leaderboard Not Available Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Rankings will appear once project evaluations are complete and enough students have received AI SDG scores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-3">
            <Trophy className="text-amber-500" size={32} /> Global Leaderboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Compare your cumulative AI SDG score against the entire college.</p>
        </div>
        <div className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm ${
          currentUserRank 
            ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400"
            : "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
        }`}>
          <Star size={18} className={currentUserRank ? "text-amber-500 fill-amber-500" : "text-gray-400"} />
          Current Rank: {currentUserRank ? `${currentUserRank.rank}${currentUserRank.rank === 1 ? 'st' : currentUserRank.rank === 2 ? 'nd' : currentUserRank.rank === 3 ? 'rd' : 'th'}` : "N/A"}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Rank 2 */}
        <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-none p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-[#1F2937] relative overflow-hidden mt-8 md:mt-12 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-900 shadow-md flex items-center justify-center mb-3 text-2xl font-black text-gray-500 dark:text-gray-400 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{top3[1]?.name || "—"}</h3>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">{top3[1]?.department || "—"}</p>
            <div className="mt-4 bg-gray-900 dark:bg-gray-700 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-sm">
              {top3[1]?.score ?? "—"} pts
            </div>
          </div>
        </Card>

        {/* Rank 1 */}
        <Card className="rounded-[18px] shadow-[0_12px_40px_rgba(245,158,11,0.15)] border border-amber-200 dark:border-amber-800 p-6 bg-gradient-to-b from-amber-50 to-white dark:from-amber-900/20 dark:to-[#1F2937] relative overflow-hidden group z-10">
          <div className="absolute top-0 left-0 w-full h-2 bg-amber-400"></div>
          <div className="flex flex-col items-center text-center">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl"></div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-4 border-white dark:border-gray-900 shadow-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Trophy size={32} className="text-white fill-white" />
            </div>
            <h3 className="font-black text-gray-900 dark:text-gray-100 text-xl">{top3[0]?.name || "—"}</h3>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mt-1">{top3[0]?.department || "—"}</p>
            <div className="mt-4 bg-amber-500 text-white px-5 py-2 rounded-full text-base font-black shadow-md">
              {top3[0]?.score ?? "—"} pts
            </div>
          </div>
        </Card>

        {/* Rank 3 */}
        <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-none p-6 bg-gradient-to-b from-orange-50 to-white dark:from-orange-900/10 dark:to-[#1F2937] relative overflow-hidden mt-8 md:mt-16 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-300 dark:bg-orange-700"></div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-orange-200 dark:bg-orange-900/50 border-4 border-white dark:border-gray-900 shadow-md flex items-center justify-center mb-3 text-2xl font-black text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{top3[2]?.name || "—"}</h3>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">{top3[2]?.department || "—"}</p>
            <div className="mt-4 bg-gray-900 dark:bg-gray-700 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-sm">
              {top3[2]?.score ?? "—"} pts
            </div>
          </div>
        </Card>
      </div>

      {/* Leaderboard Table */}
      {remaining.length > 0 && (
        <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-[#1F2937] mt-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-5 font-semibold text-center w-20">Rank</th>
                  <th className="px-6 py-5 font-semibold">Student Name</th>
                  <th className="px-6 py-5 font-semibold">Branch</th>
                  <th className="px-6 py-5 font-semibold">Trend</th>
                  <th className="px-6 py-5 font-semibold text-right">Total AI Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {remaining.map((student) => (
                  <tr key={student.id} className={`hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors ${student.id === user?.id ? 'bg-blue-50/50 dark:bg-blue-900/20 relative' : ''}`}>
                    {student.id === user?.id && (
                      <td className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></td>
                    )}
                    <td className="px-6 py-5 text-center">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-base">{student.rank}</span>
                    </td>
                    <td className="px-6 py-5">
                      <p className={`font-bold text-base ${student.id === user?.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                        {student.name}{student.id === user?.id ? ' (You)' : ''}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">{student.id}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs">
                        {student.department}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`flex items-center gap-1 text-xs font-bold ${
                        student.trend.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : student.trend.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-gray-500'
                      }`}>
                        {student.trend.startsWith('+') ? <TrendingUp size={14} /> : null} {student.trend}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="font-black text-gray-900 dark:text-gray-100 text-lg">
                        {student.score}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

    </div>
  );
}
