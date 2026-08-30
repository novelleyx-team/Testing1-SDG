"use client"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"
import { useProjectsStore } from "@/store/projects-store"
import { FolderOpen, Eye, Download } from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"

import Image from "next/image"

export default function ProjectsPage() {
  const { user } = useAuthStore()
  const projects = useProjectsStore(state => state.projects)
  
  // Filter for projects in this faculty's department
  const departmentProjects = projects.filter(p => p.studentDepartment === (user?.department || "Computer Science"))



  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">All Projects</h2>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="text-blue-500" />
            Department Projects
          </CardTitle>
          <CardDescription>
            A comprehensive list of all projects submitted within your department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Target SDG</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    No projects found for your department.
                  </TableCell>
                </TableRow>
              ) : (
                departmentProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium text-gray-500">{project.id}</TableCell>
                    <TableCell className="font-bold text-gray-900 dark:text-gray-100 max-w-[200px] truncate">{project.title}</TableCell>
                    <TableCell>{project.studentName}</TableCell>
                    <TableCell className="font-semibold text-blue-600">{project.targetSdg}</TableCell>
                    <TableCell>{project.date}</TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger render={
                          <Button variant="outline" size="sm" />
                        }>
                          <Eye className="w-4 h-4 mr-2" /> View
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{project.title}</DialogTitle>
                            <DialogDescription>Submitted by {project.studentName} • {project.id}</DialogDescription>
                          </DialogHeader>
                          
                          <div className="mt-4 space-y-6">
                            <div>
                              <h4 className="font-bold mb-2">Abstract / Overview</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                {project.abstract}
                              </p>
                            </div>
                            
                            {project.summary && (
                              <div>
                                <h4 className="font-bold mb-2 text-blue-600">AI Generated Summary</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                  {project.summary}
                                </p>
                              </div>
                            )}

                            {project.radarMapUrl && (
                              <div>
                                <h4 className="font-bold mb-2 text-blue-600">SDG Impact Radar Map</h4>
                                <div className="bg-white rounded-xl border border-gray-100 flex items-center justify-center p-4 relative h-[300px]">
                                  <Image src={project.radarMapUrl} alt="Radar Map" fill className="object-contain" />
                                </div>
                              </div>
                            )}

                            {project.reportUrl && (
                              <div className="flex justify-end pt-4 border-t border-gray-100">
                                <Button render={<a href={project.reportUrl} download target="_blank" rel="noreferrer" />} className="bg-blue-600 hover:bg-blue-700">
                                  <Download className="w-4 h-4 mr-2" /> Download Full PDF Report
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
