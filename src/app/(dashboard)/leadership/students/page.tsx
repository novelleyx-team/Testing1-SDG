"use client";

import { useAuthStore } from "@/store/auth-store";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap, Users, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";

export default function LeadershipStudentsPage() {
  const { user } = useAuthStore();
  const userScope = user?.department || user?.designation || "College";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSdg, setSelectedSdg] = useState("All");

  interface Student {
    id: string;
    name: string;
    year: string;
    primarySdg: string;
    score: string;
    projects: number;
    sdgSkills: number;
  }
  
  // Zero-Mock Data Policy: Start with an empty array until backend integration
  const students = useMemo<Student[]>(() => [], []);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            student.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesYear = selectedYear === "All" || student.year === selectedYear;
      const matchesSdg = selectedSdg === "All" || student.primarySdg === selectedSdg;
      return matchesSearch && matchesYear && matchesSdg;
    });
  }, [students, searchQuery, selectedYear, selectedSdg]);

  const totalStudents = students.length;
  const avgScore = totalStudents > 0 ? (students.reduce((acc, s) => acc + parseFloat(s.score), 0) / totalStudents).toFixed(1) : "0.0";
  const topPerformer = students.length > 0 ? students.reduce((max, s) => parseFloat(s.score) > parseFloat(max.score) ? s : max, students[0]) : null;

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-gray-100 flex items-center gap-3">
            <GraduationCap className="text-blue-600 dark:text-blue-500" size={32} />
            Student Analytics
          </h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1 max-w-2xl">
            Detailed performance and SDG skill tracking for students in <span className="font-semibold text-slate-700 dark:text-gray-200 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{userScope}</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Users size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Total Tracked Students</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100">{totalStudents}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg"><TrendingUp size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Average SDG Score</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100">{avgScore} / 10</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937]">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg"><Trophy size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Top Performer</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100 truncate max-w-[150px]" title={topPerformer?.name}>
                {topPerformer?.name || "N/A"}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937]">
        <CardHeader className="bg-slate-50/50 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-800 pb-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-gray-100">Student Roster</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or ID..."
                  className="pl-9 bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="flex h-10 w-full sm:w-40 rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 text-gray-900 dark:text-gray-100"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="All">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
              <select
                className="flex h-10 w-full sm:w-40 rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 text-gray-900 dark:text-gray-100"
                value={selectedSdg}
                onChange={(e) => setSelectedSdg(e.target.value)}
              >
                <option value="All">All SDGs</option>
                {Array.from({ length: 17 }).map((_, i) => (
                  <option key={i} value={`SDG ${i + 1}`}>
                    SDG {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-gray-400 uppercase bg-slate-50/50 dark:bg-gray-800/50">
                <tr className="border-b border-slate-100 dark:border-gray-800">
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Roll Number</th>
                  <th className="px-6 py-4 font-medium">Year</th>
                  <th className="px-6 py-4 font-medium text-center">Projects</th>
                  <th className="px-6 py-4 font-medium text-center">Primary SDG</th>
                  <th className="px-6 py-4 font-medium text-center">SDG Skills</th>
                  <th className="px-6 py-4 font-medium text-center">Avg Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-gray-800/30 transition-colors bg-white dark:bg-[#1F2937]">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-gray-100">{student.name}</td>
                      <td className="px-6 py-4">
                        <Link href={`/leadership/students/${student.id}`} className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs">
                          {student.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-gray-300">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300">
                          {student.year}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {student.projects}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {student.primarySdg}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {student.sdgSkills}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-gray-200">
                        {student.score} / 10
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-gray-400">
                      <Users size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      No students found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
