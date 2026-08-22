"use client";

import React, { useState, useMemo } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Folder, Calendar, CheckCircle, Clock } from "lucide-react";

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

export default function LeadershipProjectsPage() {
  const { user } = useAuthStore();
  const userScope = user?.department || user?.designation || "College";
  const isDean = user?.designation?.includes("Dean") || user?.designation?.includes("Coordinator") || user?.designation?.includes("Head");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSdg, setSelectedSdg] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const projectsList = useMemo(() => {
    const rand = getSeededRandom(userScope + "projects");
    const numProjects = isDean ? 150 : 60;
    
    return Array.from({ length: numProjects }).map((_, i) => {
      const sFirstNames = ["Abhinav", "Rahul", "Priya", "Sneha", "Karthik", "Anjali", "Vikram", "Neha"];
      const sLastNames = ["Reddy", "Kumar", "Sharma", "Singh", "Patel", "Verma", "Rao", "Das"];
      const yearStrs = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
      const yr = yearStrs[Math.floor(rand() * yearStrs.length)];
      const studentName = `${sFirstNames[Math.floor(rand() * sFirstNames.length)]} ${sLastNames[Math.floor(rand() * sLastNames.length)]}`;
      const rollNum = `22R11A0${String(Math.floor(rand() * 90) + 10).padStart(2, '0')}`;
      
      const statuses = ["Completed", "In Progress", "Under Review", "Rejected"];
      const status = statuses[Math.floor(rand() * statuses.length)];
      
      const projectTopics = [
        "Smart Agriculture IoT System",
        "Clean Energy Grid Optimization",
        "Accessible Education Platform",
        "Waste Management Analytics",
        "Healthcare Data Blockchain",
        "Urban Mobility Tracker",
        "Water Quality Sensor Network"
      ];
      
      const sdgNum = Math.floor(rand() * 17) + 1;

      return {
        id: `PRJ${1000 + i}`,
        title: projectTopics[Math.floor(rand() * projectTopics.length)],
        studentName,
        studentId: rollNum,
        year: yr,
        department: userScope,
        sdg: `SDG ${sdgNum}`,
        status,
        dateSubmitted: new Date(2025, Math.floor(rand() * 12), Math.floor(rand() * 28) + 1).toLocaleDateString()
      };
    });
  }, [userScope, isDean]);

  const filteredProjects = useMemo(() => {
    return projectsList.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            project.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            project.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesYear = selectedYear === "All" || project.year === selectedYear;
      const matchesSdg = selectedSdg === "All" || project.sdg === selectedSdg;
      const matchesStatus = selectedStatus === "All" || project.status === selectedStatus;
      
      return matchesSearch && matchesYear && matchesSdg && matchesStatus;
    });
  }, [projectsList, searchQuery, selectedYear, selectedSdg, selectedStatus]);

  const totalProjects = projectsList.length;
  const completedProjects = projectsList.filter(p => p.status === "Completed").length;
  const underReviewProjects = projectsList.filter(p => p.status === "Under Review").length;

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Completed": return "bg-emerald-100 text-emerald-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Under Review": return "bg-amber-100 text-amber-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 xl:p-8 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Folder className="text-blue-600" size={32} />
            Projects Oversight
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            Monitor and filter student projects aligned with Sustainable Development Goals across <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{userScope}</span>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Folder size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Projects</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalProjects}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Successfully Completed</p>
              <h3 className="text-2xl font-bold text-slate-900">{completedProjects}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm border border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Clock size={24} /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Review</p>
              <h3 className="text-2xl font-bold text-slate-900">{underReviewProjects}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm border border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex flex-col xl:flex-row items-center gap-4 justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">Project Directory</CardTitle>
            <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="relative w-full sm:w-64 flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search projects, students..."
                  className="pl-9 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="flex h-10 w-full sm:w-36 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                className="flex h-10 w-full sm:w-36 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              <select
                className="flex h-10 w-full sm:w-40 rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Under Review">Under Review</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-white">
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 font-medium">Project Title & Student</th>
                  <th className="px-6 py-4 font-medium">Academic Year</th>
                  <th className="px-6 py-4 font-medium text-center">Target SDG</th>
                  <th className="px-6 py-4 font-medium">Submitted On</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors bg-white">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{project.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {project.studentName} <span className="font-mono ml-1 text-slate-400">({project.studentId})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          {project.year}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          {project.sdg}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {project.dateSubmitted}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center text-xs font-bold px-2.5 py-1 rounded-md whitespace-nowrap ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No projects found matching your criteria.
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
