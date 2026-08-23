"use client";

import { Card } from "@/components/ui/card";
import { Plus, Search, Filter, MoreVertical, ExternalLink, Download, FileText, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useProjectsStore } from "@/store/projects-store";
import { useAuthStore } from "@/store/auth-store";

export default function ProjectsPage() {
  const { user } = useAuthStore();
  const allProjects = useProjectsStore(state => state.projects);
  const projects = user ? allProjects.filter(p => p.studentId === user.id) : [];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Approved': return <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Approved</span>;
      case 'Pending': return <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">Pending</span>;
      case 'Revision': return <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">Revision</span>;
      case 'Rejected': return <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider">Rejected</span>;
      default: return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const displayProjects = projects;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[36px] font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">My Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage and track your SDG submissions and faculty approvals.</p>
        </div>
        <Link href="/student/projects/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2.5 font-bold shadow-sm transition-all hover:shadow-md border border-blue-500">
            <Plus size={18} className="mr-2" /> Submit New Project
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#1F2937] p-4 rounded-[18px] border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search by title or ID..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#111827] border-transparent focus:bg-white dark:focus:bg-[#1F2937] focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 rounded-xl text-sm transition-all dark:text-gray-200"
          />
        </div>
        <Button variant="outline" className="w-full md:w-auto rounded-xl border-gray-200 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 font-semibold text-gray-600">
          <Filter size={16} className="mr-2" /> Filter & Sort
        </Button>
      </div>

      {/* Data Table */}
      <Card className="rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1F2937] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#111827]/50">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project ID</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title & Abstract</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type / Target SDG</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submitted</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score / Marks</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {displayProjects.map((project: any) => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-[#111827] transition-colors group">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="font-mono text-sm font-semibold text-gray-500 dark:text-gray-400">{project.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-[15px]">{project.title}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[250px]">{project.abstract}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {project.targetSdg && project.targetSdg !== "N/A" ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <span className="text-xs font-black text-blue-700 dark:text-blue-400">{project.targetSdg.split(' ')[1]}</span>
                        </div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{project.targetSdg}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 font-bold text-xs uppercase tracking-wider bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{project.templateType || "Standard Report"}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {project.date}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {["Major Project Submission", "Minor Project Submission", "Casual Faculty Project"].includes(project.templateType) ? (
                      <div className="flex flex-col">
                        <span className={`font-black text-sm ${project.marksAssigned === '0/100' ? 'text-red-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          Marks: {project.marksAssigned || "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">Plagiarism: {project.plagiarismScore}%</span>
                      </div>
                    ) : (
                      <span className={`font-black text-sm ${project.aiScore?.includes('/') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                        {project.aiScore || "N/A"}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {getStatusBadge(project.status)}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 transition-opacity">
                      {project.templateType !== "Casual Faculty Project" && (project.hasPdf || project.id) && (
                        <>
                          <Link href={`/student/projects/${project.id}/report`} target="_blank" rel="noopener noreferrer">
                            <button className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors flex items-center gap-1" title="Preview PDF Report">
                              <Eye size={16} />
                            </button>
                          </Link>
                          <a href="/sample-sdg-report.pdf" download={`${project.title.replace(/\s+/g, '_')}_Report.pdf`}>
                            <button className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors flex items-center gap-1" title="Download PDF Report">
                              <Download size={16} />
                            </button>
                          </a>
                        </>
                      )}
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
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
