"use client"

import { useState } from "react"
import { StatCard } from "@/components/shared/stat-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DonutChart } from "@/features/analytics/components/donut-chart"
import { LineChart } from "@/features/analytics/components/line-chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Users, X, Check, RefreshCw } from "lucide-react"
import { useProjectsStore, type Project } from "@/store/projects-store"
import { useAuthStore } from "@/store/auth-store"
import { useRealtimeChartData } from "@/hooks/useRealtimeChartData"

export default function FacultyDashboard() {
  const { user } = useAuthStore()
  const projects = useProjectsStore(state => state.projects)
  const updateProjectStatus = useProjectsStore(state => state.updateProjectStatus)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Filter by department if the user has one, else show all (for demo purposes we could just show all or filter)
  const relevantProjects = user?.department ? projects.filter(p => p.studentDepartment === user.department) : projects;
  
  const pendingCount = relevantProjects.filter(p => p.status === 'Pending').length;


  const { data: donutData } = useRealtimeChartData('faculty_sdg_progress', 'status', 'count');
  const { data: lineData } = useRealtimeChartData('faculty_submissions', 'week', 'count');

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 relative">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Faculty Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Pending Reviews"
          value={pendingCount.toString()}
          icon={Clock}
          trend="Action required"
          trendDirection="up"
        />
        <StatCard
          title="Students Under Supervision"
          value="0"
          icon={Users}
          trend="In your department"
          trendDirection="up"
        />
        <StatCard
          title="Average SDG Impact"
          value="0/10"
          icon={BookOpen}
          trend="No data"
          trendDirection="up"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DonutChart 
          title="Student SDG Progress" 
          description="Distribution of student projects by their current status."
          data={donutData} 
        />
        <LineChart 
          title="Submissions Over Time" 
          description="Total number of SDG project submissions over the last month."
          data={lineData} 
          color="#3B82F6"
        />
      </div>

      <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937]">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Recent Submissions</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">Projects from your students requiring review or recently evaluated.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 dark:border-gray-800">
                <TableHead className="w-[100px] text-gray-500 dark:text-gray-400">ID</TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">Student</TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">Project Title</TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">Target SDG</TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">Date</TableHead>
                <TableHead className="text-gray-500 dark:text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-500 dark:text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relevantProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30">
                    <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    No projects submitted yet.
                  </TableCell>
                </TableRow>
              ) : relevantProjects.map((submission) => (
                <TableRow key={submission.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">{submission.id}</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{submission.studentName}</TableCell>
                  <TableCell className="text-gray-900 dark:text-gray-100 font-medium">{submission.title}</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{submission.targetSdg}</TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400">{submission.date}</TableCell>
                  <TableCell>
                    <StatusBadge status={submission.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedProject(submission)} className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                      {submission.status === "Pending" ? "Review" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Modal Overlay */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1F2937] w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Project Review: {selectedProject.id}</h3>
              <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Student</h4>
                <p className="text-gray-900 dark:text-gray-100 font-medium">{selectedProject.studentName} ({selectedProject.studentDepartment})</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Project Title</h4>
                <p className="text-gray-900 dark:text-gray-100 font-medium">{selectedProject.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Abstract</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm bg-gray-50 dark:bg-[#111827] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  {selectedProject.abstract}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">AI Identified SDG</h4>
                  <p className="text-lg font-black text-gray-900 dark:text-gray-100">{selectedProject.targetSdg}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/50">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">AI Confidence Score</h4>
                  <p className="text-lg font-black text-gray-900 dark:text-gray-100">{selectedProject.aiScore || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#111827] flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedProject(null)}>Close</Button>
              {selectedProject.status === 'Pending' && (
                <>
                  <Button 
                    variant="outline" 
                    className="text-amber-600 hover:text-amber-700 border-amber-200 hover:bg-amber-50"
                    onClick={() => {
                      updateProjectStatus(selectedProject.id, 'Revision');
                      setSelectedProject(null);
                    }}
                  >
                    <RefreshCw size={16} className="mr-2" /> Request Revision
                  </Button>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => {
                      updateProjectStatus(selectedProject.id, 'Approved');
                      setSelectedProject(null);
                    }}
                  >
                    <Check size={16} className="mr-2" /> Approve Project
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
