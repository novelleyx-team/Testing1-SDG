"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"
import { useProjectsStore } from "@/store/projects-store"
import { Clock, CheckCircle2, AlertCircle } from "lucide-react"

export default function ReviewsPage() {
  const { user } = useAuthStore()
  const projects = useProjectsStore(state => state.projects)
  const updateProjectStatus = useProjectsStore(state => state.updateProjectStatus)
  
  // Filter for pending projects for this faculty's department
  const pendingProjects = projects.filter(p => p.status === 'Pending' && p.studentDepartment === user?.department)

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Pending Reviews</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pendingProjects.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">All caught up!</h3>
            <p className="text-gray-500 text-center max-w-sm mt-2">There are currently no projects awaiting your review. Check back later.</p>
          </div>
        ) : (
          pendingProjects.map((project) => (
            <Card key={project.id} className="rounded-xl flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                    <CardDescription className="mt-1 font-medium">{project.studentName}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-bold">
                    <Clock size={12} /> Pending
                  </div>
                </div>
                {project.templateType && (
                  <div className="mt-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {project.templateType}
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                  {project.abstract || "No abstract provided for this project."}
                </p>
                {["Major Project Submission", "Minor Project Submission", "Casual Faculty Project"].includes(project.templateType as string) ? (
                  <div className="flex flex-col gap-2">
                    <div className={`flex items-center justify-between p-3 rounded-lg border ${project.isPlagiarized ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/30' : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/30'}`}>
                      <div>
                        <span className={`block text-xs font-semibold uppercase ${project.isPlagiarized ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>Plagiarism Score</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{project.plagiarismScore}% {project.isPlagiarized ? '(High)' : '(Low)'}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Assigned Marks</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{project.marksAssigned}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <div>
                      <span className="block text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Target SDG</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{project.targetSdg || "N/A"}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">AI Score</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{project.aiScore || "N/A"}</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="gap-2 pt-0">
                {["Major Project Submission", "Minor Project Submission", "Casual Faculty Project"].includes(project.templateType as string) && project.isPlagiarized ? (
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => updateProjectStatus(project.id, 'Rejected')}
                  >
                    <AlertCircle size={16} className="mr-2" /> Reject (Malpractice)
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                      onClick={() => updateProjectStatus(project.id, 'Revision')}
                    >
                      <AlertCircle size={16} className="mr-2" /> Revise
                    </Button>
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => updateProjectStatus(project.id, 'Approved')}
                    >
                      <CheckCircle2 size={16} className="mr-2" /> Approve
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
