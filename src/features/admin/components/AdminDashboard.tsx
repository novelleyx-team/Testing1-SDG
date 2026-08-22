"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

const LoadingChart = () => <div className="h-[300px] w-full bg-slate-100/50 dark:bg-slate-800/50 rounded-xl animate-pulse flex items-center justify-center text-slate-400 font-medium">Loading Chart...</div>;

const PieChartCard = dynamic(() => import("./Charts").then((mod) => mod.PieChartCard), { ssr: false, loading: LoadingChart });
const DonutChartCard = dynamic(() => import("./Charts").then((mod) => mod.DonutChartCard), { ssr: false, loading: LoadingChart });
const BarChartCard = dynamic(() => import("./Charts").then((mod) => mod.BarChartCard), { ssr: false, loading: LoadingChart });
const LineChartCard = dynamic(() => import("./Charts").then((mod) => mod.LineChartCard), { ssr: false, loading: LoadingChart });
const WaveChartCard = dynamic(() => import("./Charts").then((mod) => mod.WaveChartCard), { ssr: false, loading: LoadingChart });
import { Copy, Download, RefreshCw, Activity, Users, FileText, CheckCircle, Search, Filter, UserCheck, Shield, GraduationCap, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { PREDEFINED_USERS } from "@/lib/constants/predefined-users";
import { Role } from "@/lib/constants/roles";

// EXTENDED MOCK DATA GENERATION
const sdgDistribution = [
  { name: 'SDG 3: Health', value: 45 },
  { name: 'SDG 4: Education', value: 30 },
  { name: 'SDG 7: Energy', value: 20 },
  { name: 'SDG 11: Cities', value: 35 },
  { name: 'SDG 13: Climate', value: 50 },
  { name: 'SDG 1: No Poverty', value: 15 },
  { name: 'SDG 6: Clean Water', value: 28 },
];

const statusDistribution = [
  { name: 'Approved', value: 150 },
  { name: 'Pending', value: 65 },
  { name: 'Revision', value: 22 },
];

const deptScores = [
  { dept: 'Comp Sci', score: 8.5 },
  { dept: 'Elec Eng', score: 7.2 },
  { dept: 'Mech Eng', score: 6.8 },
  { dept: 'Civil Eng', score: 7.9 },
  { dept: 'Bio Tech', score: 8.1 },
  { dept: 'Data Sci', score: 8.8 },
  { dept: 'Info Tech', score: 7.5 },
];

const timeSeriesData = [
  { name: 'Jan', submissions: 10, approvals: 5 },
  { name: 'Feb', submissions: 25, approvals: 15 },
  { name: 'Mar', submissions: 45, approvals: 30 },
  { name: 'Apr', submissions: 80, approvals: 60 },
  { name: 'May', submissions: 120, approvals: 90 },
  { name: 'Jun', submissions: 180, approvals: 140 },
  { name: 'Jul', submissions: 210, approvals: 160 },
  { name: 'Aug', submissions: 245, approvals: 190 },
];

const baseStudentsData: Record<string, string | number>[] = [];

const activeUsers: Record<string, string>[] = [];

export function AdminDashboard() {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = baseStudentsData.filter(student =>
    String(student.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(student.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(student.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyData = () => {
    const csvContent = filteredStudents.map(row => Object.values(row).join(",")).join("\n");
    const header = Object.keys(filteredStudents[0]).join(",") + "\n";
    navigator.clipboard.writeText(header + csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Submissions</p>
              <h3 className="text-2xl font-bold text-slate-900">245</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Approved Projects</p>
              <h3 className="text-2xl font-bold text-slate-900">150</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Students</p>
              <h3 className="text-2xl font-bold text-slate-900">312</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-pink-100 rounded-lg">
              <Activity className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Avg AI Score</p>
              <h3 className="text-2xl font-bold text-slate-900">8.3</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Students</p>
              <h3 className="text-xl font-bold text-slate-900">3,450</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Faculty</p>
              <h3 className="text-xl font-bold text-slate-900">120</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Briefcase className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">HODs</p>
              <h3 className="text-xl font-bold text-slate-900">{PREDEFINED_USERS.filter(u => u.role === Role.HOD).length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Deans</p>
              <h3 className="text-xl font-bold text-slate-900">{PREDEFINED_USERS.filter(u => u.role === Role.DEAN).length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphs Grid 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Submissions & Approvals (Wave)</CardTitle>
            <CardDescription className="text-slate-500">Overall growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <WaveChartCard data={timeSeriesData} dataKey="submissions" xAxisKey="name" />
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Project Submissions vs Approvals (Line)</CardTitle>
            <CardDescription className="text-slate-500">Comparing submission rate to approval rate</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChartCard data={timeSeriesData} dataKey1="submissions" dataKey2="approvals" xAxisKey="name" />
          </CardContent>
        </Card>
      </div>

      {/* Graphs Grid 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">SDG Distribution (Pie)</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartCard data={sdgDistribution} dataKey="value" nameKey="name" />
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Project Status (Donut)</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChartCard data={statusDistribution} dataKey="value" nameKey="name" />
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800">Scores by Department (Bar)</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartCard data={deptScores} dataKey="score" xAxisKey="dept" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data Tables Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Comprehensive Student Data Table */}
        <Card className="bg-white border-slate-200 shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 bg-slate-50 gap-4">
            <div>
              <CardTitle className="text-lg text-slate-800">Comprehensive Student Database</CardTitle>
              <CardDescription className="text-slate-500">Every detail and action in the entire website.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-9 h-9 w-full bg-white border-slate-300 text-slate-900 focus-visible:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 w-full sm:w-auto" onClick={copyData}>
                {copied ? <CheckCircle className="h-4 w-4 mr-2 text-green-600" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-auto max-h-[500px]">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-slate-600 font-semibold">ID</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Student Name</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Department</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Project Title</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Primary SDG</TableHead>
                  <TableHead className="text-slate-600 font-semibold">AI Score</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? filteredStudents.map((student, i) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i % 10) * 0.05 }}
                    className="border-slate-200 hover:bg-slate-50 cursor-pointer group"
                  >
                    <TableCell className="font-medium text-slate-500 group-hover:text-purple-600 transition-colors">{student.id}</TableCell>
                    <TableCell className="text-slate-900 font-medium">{student.name}</TableCell>
                    <TableCell className="text-slate-600">{student.dept}</TableCell>
                    <TableCell className="text-slate-700 truncate max-w-[150px]">{student.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{student.sdg}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${Number(student.score) >= 8 ? 'text-green-600' : 'text-amber-600'}`}>
                        {student.score}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={student.status === 'Approved' ? 'default' : student.status === 'Pending' ? 'secondary' : 'destructive'}
                        className={
                          student.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' :
                            student.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200' :
                              'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                  </motion.tr>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                      No matching projects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Real-time Activity Table */}
        <Card className="bg-white border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="border-b border-slate-100 bg-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-800">Live Activity</CardTitle>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-200">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 overflow-auto max-h-[500px]">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-slate-600 font-semibold">User</TableHead>
                  <TableHead className="text-slate-600 font-semibold">Action</TableHead>
                  <TableHead className="text-slate-600 font-semibold text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeUsers.length > 0 ? (
                  activeUsers.map((activity, i) => (
                    <TableRow key={i} className="border-slate-200 hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-800">{activity.user}</TableCell>
                      <TableCell className="text-slate-600 text-sm">{activity.action}</TableCell>
                      <TableCell className="text-right text-xs text-slate-400">{activity.time}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-slate-500">
                      No live activity.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
