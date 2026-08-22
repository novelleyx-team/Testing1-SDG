"use client";

import { useAuthStore } from "@/store/auth-store";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap, Users, TrendingUp, Trophy } from "lucide-react";

// Mock data generator scoped to department
function getSeededRandom(seed: string) {
  let h = 0;
  for(let i = 0; i < seed.length; i++) 
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  return function() {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export default function LeadershipStudentsPage() {
  const { user } = useAuthStore();
  const userScope = user?.department || user?.designation || "College";
  const isDean = user?.designation?.includes("Dean") || user?.designation?.includes("Coordinator") || user?.designation?.includes("Head");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSdg, setSelectedSdg] = useState("All");

  const students = useMemo(() => {
    const rand = getSeededRandom(userScope + "students");
    const numStudents = isDean ? 120 : 45;
    const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
    
    return Array.from({ length: numStudents }).map(() => {
      const firstNames = ["Abhinav", "Rahul", "Priya", "Sneha", "Karthik", "Anjali", "Vikram", "Rohan", "Neha", "Arjun"];
      const lastNames = ["Reddy", "Kumar", "Sharma", "Singh", "Patel", "Verma", "Rao", "Iyer", "Nair", "Das"];
      
      const yearStr = years[Math.floor(rand() * years.length)];
      // Roll prefix based on year
      const prefixMap: Record<string, string> = {
        "1st Year": "24R11",
        "2nd Year": "23R11",
        "3rd Year": "22R11",
        "4th Year": "21R11"
      };
      const deptCode = "A05"; // Simplified
      const rollNum = `${prefixMap[yearStr]}${deptCode}${String(Math.floor(rand() * 90) + 10).padStart(2, '0')}`;

      return {
        id: rollNum,
        name: `${firstNames[Math.floor(rand() * firstNames.length)]} ${lastNames[Math.floor(rand() * lastNames.length)]}`,
        year: yearStr,
        department: userScope,
        projects: Math.floor(rand() * 4) + 1,
        sdgSkills: Math.floor(rand() * 5) + 1,
        primarySdg: `SDG ${Math.floor(rand() * 17) + 1}`,
        score: (rand() * 4 + 6).toFixed(1)
      };
    });
  }, [userScope, isDean]);

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
  const avgScore = (students.reduce((acc, s) => acc + parseFloat(s.score), 0) / (totalStudents || 1)).toFixed(1);
  const topPerformer = students.reduce((max, s) => parseFloat(s.score) > parseFloat(max.score) ? s : max, students[0]);

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <GraduationCap className="text-blue-600" size={32} />
            Student Analytics
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            Detailed performance and SDG skill tracking for students in <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{userScope}</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Tracked Students</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalStudents}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><TrendingUp size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Average SDG Score</p>
              <h3 className="text-2xl font-bold text-slate-900">{avgScore} / 10</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Trophy size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Top Performer</p>
              <h3 className="text-lg font-bold text-slate-900 truncate max-w-[150px]" title={topPerformer?.name}>
                {topPerformer?.name || "N/A"}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm border border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">Student Roster</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search by name or ID..."
                  className="pl-9 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="flex h-10 w-full sm:w-40 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="flex h-10 w-full sm:w-40 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              <thead className="text-xs text-slate-500 uppercase bg-white">
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Roll Number</th>
                  <th className="px-6 py-4 font-medium">Year</th>
                  <th className="px-6 py-4 font-medium text-center">Projects</th>
                  <th className="px-6 py-4 font-medium text-center">Primary SDG</th>
                  <th className="px-6 py-4 font-medium text-center">SDG Skills</th>
                  <th className="px-6 py-4 font-medium text-center">Avg Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors bg-white">
                      <td className="px-6 py-4 font-semibold text-slate-900">{student.name}</td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-xs">{student.id}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          {student.year}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {student.projects}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {student.primarySdg}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {student.sdgSkills}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700">
                        {student.score} / 10
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
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
