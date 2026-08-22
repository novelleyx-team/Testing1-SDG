"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, UserCheck, Shield, GraduationCap, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PREDEFINED_USERS } from "@/lib/constants/predefined-users";
import { Role } from "@/lib/constants/roles";
import { MOCK_USERS } from "@/lib/mock-data/users";

const studentsData = MOCK_USERS.filter((u) => u.role === Role.STUDENT).map(u => ({
  id: u.id,
  name: u.name,
  dept: (u as any).departmentId || (u as any).department || "N/A",
  email: u.email,
  projects: Math.floor(Math.random() * 3) + 1,
  status: "Active"
}));

const facultyData = [
  ...PREDEFINED_USERS.filter((u) => u.role === Role.FACULTY),
  ...MOCK_USERS.filter((u) => u.role === Role.FACULTY)
].map(u => ({
  id: u.id,
  name: u.name,
  dept: (u as any).department || (u as any).departmentId || "N/A",
  role: (u as any).designation || "Assistant Professor",
  studentsMentored: Math.floor(Math.random() * 20) + 5,
  status: "Active"
}));

const hodData = PREDEFINED_USERS.filter((u) => u.role === Role.HOD).map(u => ({
  id: u.id,
  name: u.name,
  dept: u.department || "N/A",
  facultyCount: Math.floor(Math.random() * 30) + 10, // Mock faculty count
  joined: "2018", // Mock year
}));

const deanData = PREDEFINED_USERS.filter((u) => u.role === Role.DEAN).map(u => ({
  id: u.id,
  name: u.name,
  division: u.designation,
  deptsManaged: Math.floor(Math.random() * 5) + 2, // Mock depts managed
  status: "Active",
}));

export function DataCenter() {
  const [activeTab, setActiveTab] = useState<'students' | 'faculty' | 'hods' | 'deans'>('students');
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'faculty', label: 'Faculty', icon: UserCheck },
    { id: 'hods', label: 'HODs', icon: Briefcase },
    { id: 'deans', label: 'Deans', icon: Shield },
  ] as const;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Data Center</h1>
          <p className="text-slate-500">Super Admin access to all institutional hierarchies.</p>
        </div>
        <Button variant="outline" className="border-slate-300 text-slate-700 bg-white">
          <Download className="mr-2 h-4 w-4" />
          Export Master Data
        </Button>
      </div>

      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit border border-slate-200 shadow-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchTerm("");
              }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'text-purple-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white shadow-sm border border-slate-200 rounded-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-lg text-slate-800 capitalize">{activeTab} Directory</CardTitle>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder={`Search ${activeTab}...`}
                className="pl-9 h-9 w-full bg-white border-slate-300 text-slate-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="sm" variant="outline" className="border-slate-300 text-slate-700 h-9 shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-slate-200">
                    <TableHead className="text-slate-600 font-semibold">ID</TableHead>
                    <TableHead className="text-slate-600 font-semibold">Name</TableHead>
                    
                    {activeTab === 'students' && (
                      <>
                        <TableHead className="text-slate-600 font-semibold">Department</TableHead>
                        <TableHead className="text-slate-600 font-semibold">Email</TableHead>
                        <TableHead className="text-slate-600 font-semibold text-center">Projects</TableHead>
                      </>
                    )}
                    
                    {activeTab === 'faculty' && (
                      <>
                        <TableHead className="text-slate-600 font-semibold">Department</TableHead>
                        <TableHead className="text-slate-600 font-semibold">Role</TableHead>
                        <TableHead className="text-slate-600 font-semibold text-center">Mentored</TableHead>
                      </>
                    )}

                    {activeTab === 'hods' && (
                      <>
                        <TableHead className="text-slate-600 font-semibold">Department</TableHead>
                        <TableHead className="text-slate-600 font-semibold text-center">Faculty Count</TableHead>
                        <TableHead className="text-slate-600 font-semibold">Joined</TableHead>
                      </>
                    )}

                    {activeTab === 'deans' && (
                      <>
                        <TableHead className="text-slate-600 font-semibold">Division</TableHead>
                        <TableHead className="text-slate-600 font-semibold text-center">Depts Managed</TableHead>
                      </>
                    )}

                    <TableHead className="text-slate-600 font-semibold text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Students Table Rendering */}
                  {activeTab === 'students' && (
                    studentsData.length > 0 ? studentsData.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item, i) => (
                      <TableRow key={item.id} className="border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <TableCell className="font-medium text-slate-500">{item.id}</TableCell>
                        <TableCell className="text-slate-900">{item.name}</TableCell>
                        <TableCell className="text-slate-600">{item.dept}</TableCell>
                        <TableCell className="text-slate-600">{item.email}</TableCell>
                        <TableCell className="text-center font-medium text-purple-600">{item.projects}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-8">No student data available. Awaiting new data.</TableCell></TableRow>
                    )
                  )}

                  {/* Faculty Table Rendering */}
                  {activeTab === 'faculty' && (
                    facultyData.length > 0 ? facultyData.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                      <TableRow key={item.id} className="border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <TableCell className="font-medium text-slate-500">{item.id}</TableCell>
                        <TableCell className="text-slate-900 font-medium">{item.name}</TableCell>
                        <TableCell className="text-slate-600">{item.dept}</TableCell>
                        <TableCell className="text-slate-600">{item.role}</TableCell>
                        <TableCell className="text-center font-medium text-blue-600">{item.studentsMentored}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-8">No faculty data available. Awaiting new data.</TableCell></TableRow>
                    )
                  )}

                  {/* HODs Table Rendering */}
                  {activeTab === 'hods' && (
                    hodData.length > 0 ? hodData.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                      <TableRow key={item.id} className="border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <TableCell className="font-medium text-slate-500">{item.id}</TableCell>
                        <TableCell className="text-slate-900 font-bold">{item.name}</TableCell>
                        <TableCell className="text-slate-700 font-medium">{item.dept}</TableCell>
                        <TableCell className="text-center text-slate-600">{item.facultyCount}</TableCell>
                        <TableCell className="text-slate-600">{item.joined}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">Appointed</Badge>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-8">No HOD data available.</TableCell></TableRow>
                    )
                  )}

                  {/* Deans Table Rendering */}
                  {activeTab === 'deans' && (
                    deanData.length > 0 ? deanData.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                      <TableRow key={item.id} className="border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <TableCell className="font-medium text-slate-500">{item.id}</TableCell>
                        <TableCell className="text-slate-900 font-bold text-lg">{item.name}</TableCell>
                        <TableCell className="text-slate-700 font-medium">{item.division}</TableCell>
                        <TableCell className="text-center text-slate-600">{item.deptsManaged}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">Executive</Badge>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow><TableCell colSpan={5} className="text-center text-slate-500 py-8">No Dean data available.</TableCell></TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
