"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuthStore } from "@/store/auth-store"
import { UserCircle } from "lucide-react"

export default function StudentsPage() {
  const { user } = useAuthStore()
  const department = user?.department || "Unknown"

  // Generate exactly 20 mock students for the faculty's department
  const students: { id: string, name: string, department: string, ongoingProjects: number, avgSdgScore: string, status: string }[] = [];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mentored Students</h2>
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="text-blue-500" />
            Your Students ({students.length})
          </CardTitle>
          <CardDescription>
            Showing all students mentored by you in the {department} department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Projects</TableHead>
                <TableHead className="text-center">Avg SDG Score</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium text-gray-500">{student.id}</TableCell>
                  <TableCell className="font-bold text-gray-900 dark:text-gray-100">{student.name}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell className="text-center font-medium">{student.ongoingProjects}</TableCell>
                  <TableCell className="text-center text-blue-600 font-bold">{student.avgSdgScore}</TableCell>
                  <TableCell className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {student.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
