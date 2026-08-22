"use client";

import React, { useState, useMemo } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, ChevronDown, ChevronUp, Target, Briefcase } from "lucide-react";

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

export default function LeadershipFacultyPage() {
  const { user } = useAuthStore();
  const userScope = user?.department || user?.designation || "College";
  const isDean = user?.designation?.includes("Dean") || user?.designation?.includes("Coordinator") || user?.designation?.includes("Head");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSdg, setSelectedSdg] = useState("All");
  const [expandedFaculty, setExpandedFaculty] = useState<string | null>(null);

  const facultyList = useMemo(() => {
    const rand = getSeededRandom(userScope + "faculty");
    const numFaculty = isDean ? 25 : 8;
    
    return Array.from({ length: numFaculty }).map(() => {
      const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth"];
      const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
      const fIdx = Math.floor(rand() * firstNames.length);
      const lIdx = Math.floor(rand() * lastNames.length);
      const facId = `MLRS${1000 + Math.floor(rand() * 9000)}`;
      
      const numStudents = Math.floor(rand() * 5) + 3; // 3 to 7 students per faculty
      
      const assignedStudents = Array.from({ length: numStudents }).map(() => {
        const sFirstNames = ["Abhinav", "Rahul", "Priya", "Sneha", "Karthik", "Anjali"];
        const sLastNames = ["Reddy", "Kumar", "Sharma", "Singh", "Patel", "Verma"];
        const yearStrs = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
        const yr = yearStrs[Math.floor(rand() * yearStrs.length)];
        return {
          id: `22R11A0${String(Math.floor(rand() * 90) + 10).padStart(2, '0')}`,
          name: `${sFirstNames[Math.floor(rand() * sFirstNames.length)]} ${sLastNames[Math.floor(rand() * sLastNames.length)]}`,
          year: yr,
          projectTitle: `SDG Platform Implementation Phase ${Math.floor(rand() * 3) + 1}`,
          sdg: `SDG ${Math.floor(rand() * 17) + 1}`
        };
      });

      return {
        id: facId,
        name: `Prof. ${firstNames[fIdx]} ${lastNames[lIdx]}`,
        email: `${firstNames[fIdx].toLowerCase()}.${lastNames[lIdx].toLowerCase()}@mlritm.ac.in`,
        department: userScope,
        primarySdg: `SDG ${Math.floor(rand() * 17) + 1}`,
        activeProjects: numStudents,
        students: assignedStudents
      };
    });
  }, [userScope, isDean]);

  const filteredFaculty = useMemo(() => {
    return facultyList.filter(faculty => {
      const matchesSearch = faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faculty.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSdg = selectedSdg === "All" || faculty.primarySdg === selectedSdg;
      return matchesSearch && matchesSdg;
    });
  }, [facultyList, searchQuery, selectedSdg]);

  const toggleExpand = (id: string) => {
    if (expandedFaculty === id) {
      setExpandedFaculty(null);
    } else {
      setExpandedFaculty(id);
    }
  };

  const totalFaculty = facultyList.length;
  const totalProjects = facultyList.reduce((acc, fac) => acc + fac.activeProjects, 0);
  
  const mostTargetedSdg = useMemo(() => {
    const counts: Record<string, number> = {};
    facultyList.forEach(f => {
      counts[f.primarySdg] = (counts[f.primarySdg] || 0) + 1;
    });
    let max = 0;
    let maxSdg = "N/A";
    Object.entries(counts).forEach(([sdg, count]) => {
      if (count > max) {
        max = count;
        maxSdg = sdg;
      }
    });
    return maxSdg;
  }, [facultyList]);

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Users className="text-blue-600" size={32} />
            Faculty Oversight
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            View faculty performance and expand to see their assigned student projects within <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{userScope}</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Faculty</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalFaculty}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Briefcase size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Student Projects</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalProjects}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><Target size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Top Focus Area</p>
              <h3 className="text-2xl font-bold text-slate-900">{mostTargetedSdg}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm border border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">Faculty Roster</CardTitle>
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
                  <th className="px-6 py-4 font-medium">Faculty Name</th>
                  <th className="px-6 py-4 font-medium">Faculty ID</th>
                  <th className="px-6 py-4 font-medium text-center">Primary SDG</th>
                  <th className="px-6 py-4 font-medium text-center">Active Projects / Students</th>
                  <th className="px-6 py-4 font-medium text-right">View Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFaculty.length > 0 ? (
                  filteredFaculty.map((faculty) => (
                    <React.Fragment key={faculty.id}>
                      <tr 
                        className={`hover:bg-slate-50/80 transition-colors bg-white cursor-pointer ${expandedFaculty === faculty.id ? 'bg-slate-50/80' : ''}`}
                        onClick={() => toggleExpand(faculty.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{faculty.name}</div>
                          <div className="text-xs text-slate-500">{faculty.email}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-mono text-xs">{faculty.id}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {faculty.primarySdg}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                            {faculty.activeProjects}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-500 hover:text-slate-900">
                            {expandedFaculty === faculty.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                        </td>
                      </tr>
                      {expandedFaculty === faculty.id && (
                        <tr>
                          <td colSpan={5} className="p-0 border-b border-slate-200">
                            <div className="bg-slate-50 p-6 animate-in slide-in-from-top-2 duration-200">
                              <h4 className="text-sm font-semibold text-slate-800 mb-4">Assigned Students & Projects</h4>
                              <div className="grid gap-3 grid-cols-1 xl:grid-cols-2">
                                {faculty.students.map((student, i) => (
                                  <div key={i} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <div className="font-semibold text-slate-900">{student.name}</div>
                                        <div className="text-xs text-slate-500 font-mono mt-0.5">{student.id} • {student.year}</div>
                                      </div>
                                      <span className="inline-flex items-center justify-center bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
                                        {student.sdg}
                                      </span>
                                    </div>
                                    <div className="text-sm text-slate-600 mt-2 line-clamp-1 border-t border-slate-100 pt-2" title={student.projectTitle}>
                                      <span className="font-medium text-slate-700">Project:</span> {student.projectTitle}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No faculty found matching your criteria.
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
